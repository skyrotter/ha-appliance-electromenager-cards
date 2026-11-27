/* Carte « Météo animée » — custom:appliance-weather-card
 * Une carte météo complète à partir d'une entité weather.* : scène animée plein fond (soleil, lune et étoiles, nuages qui dérivent, pluie,
 * pluie forte, neige, grêle, orage avec éclairs, brouillard, vent) qui suit la condition et le jour / la nuit ; température, ressenti, min / max ;
 * bandeau d'alerte ; prévisions horaires et sur plusieurs jours ; détails (vent avec flèche, humidité, UV, pression, visibilité, point de rosée,
 * nuages) ; arc du soleil (lever / coucher calculés pour la position de Home Assistant) et phase de la lune ; pluie dans l'heure (capteur
 * Météo-France facultatif) ; radar de pluie animé centré sur la maison (RainViewer + fond de carte gris Esri, sans clé API ; radar_map_url pour un autre fournisseur).
 */
(() => {
  const TAG = 'appliance-weather-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n weather_card*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const fin = (v) => typeof v === 'number' && Number.isFinite(v);
  const num = (v) => { const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(n) ? n : NaN; };
  const RAD = Math.PI / 180;

  // ---------- calculs astronomiques (sans dépendance) ----------
  // lever / coucher du soleil pour un jour et une position (équation du lever de soleil) ; null aux latitudes polaires
  const sunTimes = (date, lat, lon) => {
    const jd = (d) => d.getTime() / 86400000 + 2440587.5, d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
    const n = Math.round(jd(d) - 2451545.0 + 0.0008), Js = n - lon / 360;
    const M = (357.5291 + 0.98560028 * Js) % 360, C = 1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
    const L = (M + C + 180 + 102.9372) % 360, Jt = 2451545.0 + Js + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * L * RAD);
    const sd = Math.sin(L * RAD) * Math.sin(23.4397 * RAD), cd = Math.cos(Math.asin(sd));
    const co = (Math.sin(-0.833 * RAD) - Math.sin(lat * RAD) * sd) / (Math.cos(lat * RAD) * cd);
    if (!(co >= -1 && co <= 1)) return null;
    const w = Math.acos(co) / RAD, toD = (j) => new Date((j - 2440587.5) * 86400000);
    return { rise: toD(Jt - w / 360), set: toD(Jt + w / 360) };
  };
  // phase de la lune : 0 = nouvelle, 0.5 = pleine
  const moonPhase = (date) => { const p = ((date.getTime() / 86400000 + 2440587.5 - 2451550.1) / 29.530588853) % 1; return p < 0 ? p + 1 : p; };
  const moonSvg = (p) => {
    const r = 10, k = Math.cos(2 * Math.PI * p), rx = (r * Math.abs(k)).toFixed(2), wax = p < 0.5;
    const outer = wax ? 1 : 0, inner = wax ? (k > 0 ? 0 : 1) : (k > 0 ? 1 : 0);
    const lit = `M12 2 A${r} ${r} 0 0 ${outer} 12 22 A${rx} ${r} 0 0 ${inner} 12 2Z`;
    return `<svg viewBox="0 0 24 24" class="moon-ph" aria-hidden="true"><circle cx="12" cy="12" r="${r}" fill="rgba(255,255,255,.14)"/><path d="${lit}" fill="#f4efd9"/></svg>`;
  };
  const BEARINGS = { N: 0, NNE: 22.5, NE: 45, ENE: 67.5, E: 90, ESE: 112.5, SE: 135, SSE: 157.5, S: 180, SSW: 202.5, SW: 225, WSW: 247.5, W: 270, WNW: 292.5, NW: 315, NNW: 337.5 };
  const bearing = (v) => { const n = num(v); if (fin(n)) return ((n % 360) + 360) % 360; const k = String(v || '').toUpperCase().trim(); return k in BEARINGS ? BEARINGS[k] : NaN; };
  const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

  // ---------- icônes de prévision (SVG compacts) ----------
  const CLOUD = '<path d="M7 18h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.6 4.2 4.2 0 0 0 7 18Z" fill="#e8eef5"/>';
  const GREY = '<path d="M7 17h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 8.6 4.2 4.2 0 0 0 7 17Z" fill="#aab4c2"/>';
  const SUN = (x, y, r) => `<g class="ic-sun"><circle cx="${x}" cy="${y}" r="${r}" fill="#ffd54a"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="${x}" y1="${y - r - 1.5}" x2="${x}" y2="${y - r - 3.5}" stroke="#ffd54a" stroke-width="1.5" stroke-linecap="round" transform="rotate(${a} ${x} ${y})"/>`).join('') + '</g>';
  const MOON = (x, y) => `<path d="M${x + 3} ${y - 6}a6.5 6.5 0 1 0 5 10.5 5.5 5.5 0 0 1-5-10.5Z" fill="#f4efd9"/>`;
  const drops = (n, col = '#6cb4ff') => Array.from({ length: n }, (_, i) => `<line class="ic-drop" style="animation-delay:${i * 0.25}s" x1="${8 + i * 3.4}" y1="19" x2="${7 + i * 3.4}" y2="22" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>`).join('');
  const flakes = (n) => Array.from({ length: n }, (_, i) => `<circle class="ic-drop" style="animation-delay:${i * 0.3}s" cx="${8 + i * 3.4}" cy="20.5" r="1.1" fill="#fff"/>`).join('');
  const ICON = (cond, night) => {
    const c = String(cond || '').toLowerCase();
    let b;
    if (c === 'sunny') b = night ? MOON(12, 12) : SUN(12, 12, 4.5);
    else if (c === 'clear-night') b = MOON(12, 12);
    else if (c === 'partlycloudy') b = (night ? MOON(9, 8) : SUN(9, 8, 3.4)) + CLOUD;
    else if (c === 'cloudy') b = GREY;
    else if (c === 'fog') b = '<g stroke="#cfd8e3" stroke-width="2" stroke-linecap="round"><line x1="5" y1="10" x2="19" y2="10"/><line x1="3" y1="14" x2="17" y2="14"/><line x1="6" y1="18" x2="20" y2="18"/></g>';
    else if (c === 'rainy') b = GREY + drops(4);
    else if (c === 'pouring') b = GREY + drops(5, '#4a9bff');
    else if (c === 'snowy') b = GREY + flakes(4);
    else if (c === 'snowy-rainy') b = GREY + drops(2) + flakes(2);
    else if (c === 'hail') b = GREY + flakes(4);
    else if (c === 'lightning') b = GREY + '<path d="M12.5 13 9.5 18.5h2.6L11 22l4-6h-2.6Z" fill="#ffd54a"/>';
    else if (c === 'lightning-rainy') b = GREY + '<path d="M12.5 13 9.5 18.5h2.6L11 22l4-6h-2.6Z" fill="#ffd54a"/>' + drops(2);
    else if (/^windy/.test(c)) b = '<g stroke="#cfe3ff" stroke-width="2" fill="none" stroke-linecap="round"><path d="M3 9h10a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 14h14a2.5 2.5 0 1 1-2.5 2.5"/></g>';
    else b = GREY;
    return `<svg viewBox="0 0 24 24" class="ic" aria-hidden="true">${b}</svg>`;
  };

  // ---------- scène animée ----------
  // générateur pseudo-aléatoire déterministe : la scène est identique d'un rendu à l'autre
  const rnd = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const sceneKind = (cond) => {
    const c = String(cond || '').toLowerCase();
    return { rain: /rainy|pouring/.test(c) ? (c === 'pouring' ? 2 : 1) : 0, snow: /snowy/.test(c) ? 1 : 0, hail: c === 'hail' ? 1 : 0, bolt: /lightning/.test(c) ? 1 : 0,
      fog: c === 'fog' ? 1 : 0, wind: /windy/.test(c) ? 1 : 0, clouds: { sunny: 0, 'clear-night': 0, partlycloudy: 3, windy: 2, 'windy-variant': 4, cloudy: 6, exceptional: 3, fog: 2 }[c] ?? 6,
      grey: /rainy|pouring|lightning|snowy|hail|cloudy|fog/.test(c) ? 1 : 0, sky: /lightning|pouring/.test(c) ? 'storm' : /rainy|hail/.test(c) ? 'rain' : /snowy/.test(c) ? 'snow' : c === 'fog' ? 'fog' : c === 'cloudy' ? 'cloud' : 'clear' };
  };
  const sceneHTML = (cond, night) => {
    const k = sceneKind(cond), R = rnd(7);
    const showSun = !night && /^(sunny|partlycloudy|windy|windy-variant|exceptional)$/i.test(cond || '') , showMoon = night && /^(clear-night|sunny|partlycloudy|windy|windy-variant|exceptional)$/i.test(cond || '');
    let h = '';
    if (night) h += '<div class="stars">' + Array.from({ length: 28 }, () => `<i style="left:${(R() * 100).toFixed(1)}%;top:${(R() * 60).toFixed(1)}%;animation-delay:${(R() * 4).toFixed(2)}s;--sz:${(1 + R() * 1.6).toFixed(1)}px"></i>`).join('') + '</div>';
    if (showSun) h += '<div class="sun"><div class="rays"></div><div class="disc"></div></div>';
    if (showMoon) h += '<div class="moon"></div>';
    h += '<div class="clouds' + (k.grey ? ' grey' : '') + '">' + Array.from({ length: k.clouds }, (_, i) => {
      const s = 0.8 + R() * 1.1;
      return `<svg class="cl" viewBox="0 0 120 60" style="top:${(i * 11 + R() * 12).toFixed(0)}%;--s:${s.toFixed(2)};animation-duration:${(60 + R() * 70).toFixed(0)}s;animation-delay:${(-R() * 90).toFixed(0)}s;opacity:${(0.55 + R() * 0.4).toFixed(2)}"><path d="M28 54h66a22 22 0 0 0 3-43.8A30 30 0 0 0 40 14 20 20 0 0 0 28 54Z"/></svg>`;
    }).join('') + '</div>';
    if (k.fog) h += '<div class="fogs">' + [0, 1, 2].map((i) => `<i style="top:${30 + i * 22}%;animation-duration:${26 + i * 9}s;animation-delay:${-i * 7}s"></i>`).join('') + '</div>';
    if (k.rain) h += '<div class="rain">' + Array.from({ length: k.rain === 2 ? 70 : 38 }, () => `<i style="left:${(R() * 100).toFixed(1)}%;animation-duration:${(0.55 + R() * 0.45).toFixed(2)}s;animation-delay:${(-R() * 1.4).toFixed(2)}s;opacity:${(0.4 + R() * 0.5).toFixed(2)}"></i>`).join('') + '</div>';
    if (k.snow) h += '<div class="snow">' + Array.from({ length: 40 }, () => `<i style="left:${(R() * 100).toFixed(1)}%;--sz:${(2 + R() * 3.5).toFixed(1)}px;animation-duration:${(5 + R() * 6).toFixed(1)}s;animation-delay:${(-R() * 9).toFixed(1)}s"></i>`).join('') + '</div>';
    if (k.hail) h += '<div class="hailst">' + Array.from({ length: 26 }, () => `<i style="left:${(R() * 100).toFixed(1)}%;animation-duration:${(0.7 + R() * 0.5).toFixed(2)}s;animation-delay:${(-R() * 1.4).toFixed(2)}s"></i>`).join('') + '</div>';
    if (k.bolt) h += '<div class="bolt"></div>';
    if (k.wind) h += '<div class="gust">' + Array.from({ length: 9 }, (_, i) => `<i style="top:${10 + i * 9}%;animation-duration:${(2.2 + R() * 2).toFixed(1)}s;animation-delay:${(-R() * 4).toFixed(1)}s;width:${(60 + R() * 90).toFixed(0)}px"></i>`).join('') + '</div>';
    return { html: h, cls: `sky-${k.sky}${night ? ' night' : ''}` };
  };

  const CSS = `
:host{display:block}ha-card{position:relative;overflow:hidden;color:#fff;box-sizing:border-box;--wc-glass:rgba(255,255,255,.13);--wc-line:rgba(255,255,255,.2);background:#2a6fb5;isolation:isolate;border:0}
.scene{position:absolute;inset:0;z-index:0;overflow:hidden;transition:background .8s;background:linear-gradient(180deg,#2f86d6 0%,#7cc4f4 100%)}
.scene.sky-clear.night{background:linear-gradient(180deg,#0a1331 0%,#1c2f63 100%)}
.scene.sky-cloud{background:linear-gradient(180deg,#5d7893 0%,#9fb3c6 100%)}.scene.sky-cloud.night{background:linear-gradient(180deg,#1a2231 0%,#38455a 100%)}
.scene.sky-rain{background:linear-gradient(180deg,#3d556e 0%,#7b91a6 100%)}.scene.sky-rain.night{background:linear-gradient(180deg,#121a26 0%,#2c3a4d 100%)}
.scene.sky-storm{background:linear-gradient(180deg,#252f3f 0%,#4b586b 100%)}.scene.sky-storm.night{background:linear-gradient(180deg,#0b0f18 0%,#222b3a 100%)}
.scene.sky-snow{background:linear-gradient(180deg,#7f93a8 0%,#c9d6e2 100%)}.scene.sky-snow.night{background:linear-gradient(180deg,#232d3b 0%,#4d5c6e 100%)}
.scene.sky-fog{background:linear-gradient(180deg,#8d99a5 0%,#c4ccd3 100%)}.scene.sky-fog.night{background:linear-gradient(180deg,#2a3037 0%,#4a535c 100%)}
.stars i{position:absolute;width:var(--sz);height:var(--sz);border-radius:50%;background:#fff;animation:wctw 3.4s ease-in-out infinite}
@keyframes wctw{0%,100%{opacity:.25}50%{opacity:1}}
.sun{position:absolute;right:-30px;top:-30px;width:190px;height:190px}.sun .disc{position:absolute;inset:55px;border-radius:50%;background:radial-gradient(circle,#fff6c8 0%,#ffd54a 55%,#ffb300 100%);box-shadow:0 0 60px 25px rgba(255,214,90,.55)}
.sun .rays{position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,236,150,.5) 0 5deg,transparent 5deg 20deg);-webkit-mask:radial-gradient(circle,transparent 30%,#000 32%,transparent 70%);mask:radial-gradient(circle,transparent 30%,#000 32%,transparent 70%);animation:wcspin 60s linear infinite}
@keyframes wcspin{to{transform:rotate(360deg)}}
.moon{position:absolute;right:26px;top:22px;width:62px;height:62px;border-radius:50%;background:#f6f1db;box-shadow:0 0 36px 10px rgba(246,241,219,.35),inset -14px -4px 0 0 rgba(0,0,0,.09)}
.clouds .cl{position:absolute;left:-30%;width:calc(150px * var(--s));fill:rgba(255,255,255,.85);animation:wcdrift linear infinite;filter:drop-shadow(0 4px 6px rgba(0,0,0,.08))}
.clouds.grey .cl{fill:rgba(168,180,194,.92)}.night .clouds .cl{fill:rgba(120,134,160,.55)}.night .clouds.grey .cl{fill:rgba(90,102,122,.7)}
@keyframes wcdrift{from{transform:translateX(0)}to{transform:translateX(calc(100cqw + 160%))}}
ha-card{container-type:inline-size}
.rain i,.hailst i{position:absolute;top:-20px;width:1.6px;height:16px;background:linear-gradient(180deg,transparent,rgba(190,225,255,.9));transform:rotate(12deg);animation:wcfall linear infinite}
.hailst i{width:5px;height:5px;border-radius:50%;background:#fff;transform:none}
@keyframes wcfall{to{transform:translate(-30px,calc(100cqh + 40px)) rotate(12deg)}}
.hailst i{animation-name:wchail}@keyframes wchail{to{transform:translate(-20px,calc(100cqh + 40px))}}
.snow i{position:absolute;top:-10px;width:var(--sz);height:var(--sz);border-radius:50%;background:#fff;opacity:.9;animation:wcsnow linear infinite}
@keyframes wcsnow{0%{transform:translate(0,0)}50%{transform:translate(18px,50cqh)}100%{transform:translate(-10px,calc(100cqh + 20px))}}
.bolt{position:absolute;inset:0;background:#fff;opacity:0;animation:wcbolt 7s infinite}
@keyframes wcbolt{0%,86%,90%,94%,100%{opacity:0}87%{opacity:.55}88%{opacity:.1}91%{opacity:.4}}
.fogs i{position:absolute;left:-40%;width:180%;height:60px;border-radius:50%;background:rgba(235,240,245,.4);filter:blur(18px);animation:wcfog ease-in-out infinite alternate}
@keyframes wcfog{from{transform:translateX(-8%)}to{transform:translateX(10%)}}
.gust i{position:absolute;left:-160px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);animation:wcgust linear infinite}
@keyframes wcgust{to{transform:translateX(calc(100cqw + 320px))}}
.noanim .scene *,.noanim .ic-sun,.noanim .ic-drop,.noanim .pulse,.noanim .live{animation:none!important}
@media (prefers-reduced-motion:reduce){.scene *{animation-duration:0s!important;animation-iteration-count:1!important}}
.body{position:relative;z-index:1;padding:14px 14px 12px;text-shadow:0 1px 3px rgba(0,0,0,.28)}
.head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;cursor:pointer}
.place{font-size:15px;font-weight:600;opacity:.95}.cond{font-size:14px;opacity:.92;margin-top:2px}
.big{display:flex;align-items:center;gap:6px;margin-top:6px;cursor:pointer}
.temp{font-size:56px;line-height:1;font-weight:300;letter-spacing:-2px}.temp sup{font-size:24px;font-weight:400;letter-spacing:0;vertical-align:top;position:relative;top:4px}
.big .ic{width:62px;height:62px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.25))}
.hl{font-size:13px;opacity:.92;margin-top:4px}
.glass{background:var(--wc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--wc-line);border-radius:14px;margin-top:10px;padding:8px 10px;text-shadow:none}
.glass .t{font-size:11px;font-weight:600;letter-spacing:.4px;text-transform:uppercase;opacity:.8;margin-bottom:6px;text-shadow:0 1px 2px rgba(0,0,0,.25)}
.alert{display:flex;align-items:center;gap:8px;background:rgba(255,152,0,.88);color:#1d1100;font-size:13px;font-weight:600;padding:7px 10px;border-radius:12px;margin-top:10px;cursor:pointer;text-shadow:none}
.alert.red{background:rgba(229,57,53,.92);color:#fff}.alert.hide{display:none}
.alert svg{width:18px;height:18px;flex:0 0 auto}.alert span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hours{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;margin:0 -4px;padding:0 4px}.hours::-webkit-scrollbar{display:none}
.hr{flex:0 0 auto;min-width:46px;text-align:center;font-size:12.5px;display:flex;flex-direction:column;align-items:center;gap:2px}
.hr .tm{opacity:.85;font-size:11.5px}.hr .tp{font-weight:600}.hr .pp{font-size:10.5px;color:#9fd3ff;min-height:13px}.ic{width:30px;height:30px}
.dy{display:grid;grid-template-columns:minmax(52px,66px) 30px 34px 34px 1fr 34px;align-items:center;gap:6px;font-size:13px;padding:2px 0}
.dy+.dy{border-top:1px solid var(--wc-line)}.dy .dn{font-weight:600;text-transform:capitalize;white-space:nowrap}.dy .ic{width:26px;height:26px}.dy .lo{opacity:.7;text-align:right}.dy .hi{font-weight:600}
.dy .pp{font-size:10.5px;color:#9fd3ff;min-height:0;text-align:right}
.rng{position:relative;height:4px;border-radius:2px;background:rgba(255,255,255,.22)}.rng i{position:absolute;top:0;bottom:0;border-radius:2px;background:linear-gradient(90deg,#6cc4ff,#ffd54a,#ff8a50)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(104px,1fr));gap:8px;margin-top:10px}
.tile{background:var(--wc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--wc-line);border-radius:14px;padding:8px 10px;text-shadow:none;cursor:pointer;min-width:0}
.tile .l{font-size:11px;opacity:.8;text-transform:uppercase;letter-spacing:.3px}.tile .v{font-size:19px;font-weight:600;line-height:26px;white-space:nowrap}.tile .v small{font-size:11px;font-weight:500;opacity:.8;margin-left:3px}
.tile .s{font-size:11px;opacity:.8;min-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile.hide{display:none}.cmp{display:inline-block;width:20px;height:20px;vertical-align:-4px;margin-right:6px}
.uvbar{height:4px;border-radius:2px;margin-top:3px;background:linear-gradient(90deg,#4caf50,#ffeb3b,#ff9800,#f44336,#9c27b0);position:relative}.uvbar i{position:absolute;top:-3px;width:3px;height:10px;border-radius:2px;background:#fff;box-shadow:0 0 3px rgba(0,0,0,.5)}
.sunrow{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center}
.arc{width:100%;height:auto;display:block;max-height:92px}.arc text{fill:#fff;font-size:9px;opacity:.9}
.mn{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px;text-align:center;min-width:76px}.moon-ph{width:34px;height:34px}
.nr{display:flex;align-items:flex-end;gap:2px;height:34px}.nr i{flex:1;min-height:3px;border-radius:2px;background:rgba(255,255,255,.28)}.nr i.l1{background:#8fd0ff}.nr i.l2{background:#4a9bff}.nr i.l3{background:#2563eb}
.nrt{font-size:12px;margin-top:4px;opacity:.92}
.radar .map{position:relative;overflow:hidden;border-radius:10px;background:#1e2733;height:var(--rh,220px)}
.radar .grid{position:absolute;left:50%;top:50%;width:768px;height:768px;transform-origin:0 0}
.radar .grid img,.radar .rf img{position:absolute;width:256px;height:256px;display:block;user-select:none;-webkit-user-drag:none}
.radar .rf{position:absolute;inset:0;opacity:0}.radar .rf.on{opacity:.8}
.radar .home{position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#fff;border:3px solid #e53935;box-shadow:0 0 0 2px rgba(255,255,255,.6)}
.radar .pulse{position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;border:2px solid #e53935;animation:wcpulse 2.2s ease-out infinite}
@keyframes wcpulse{from{transform:scale(1);opacity:.9}to{transform:scale(4);opacity:0}}
.radar .att{position:absolute;right:4px;bottom:2px;font-size:8.5px;color:rgba(255,255,255,.75);text-shadow:0 0 2px #000}
.radar .msg{position:absolute;inset:0;display:none;align-items:center;justify-content:center;font-size:13px;background:rgba(20,28,40,.78)}
.radar.fail .msg{display:flex}
.radar .ctl{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:12px}
.radar button{all:unset;cursor:pointer;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.2);display:grid;place-items:center}.radar button svg{width:14px;height:14px;fill:#fff}
.radar input{flex:1;min-width:0;accent-color:#7cc4ff}.radar .rt{min-width:92px;text-align:right;font-variant-numeric:tabular-nums}
.hide{display:none!important}
`;

  const alertIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 1 21h22L12 2Zm1 15h-2v-2h2v2Zm0-4h-2V9h2v4Z"/></svg>';
  const UVCOL = (v) => (v < 3 ? 'low' : v < 6 ? 'moderate' : v < 8 ? 'high' : 'very high');

  class ApplianceWeatherCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) { return { entity: Object.keys((hass && hass.states) || {}).find((i) => i.startsWith('weather.')) || '' }; }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      // sans entité (carte tout juste ajoutée) : pas d'erreur, un message invite à en choisir une dans l'éditeur
      this._c = { entity_sun: 'sun.sun', show_alert: true, show_hourly: true, show_daily: true, show_details: true, show_sun: true, show_radar: true, show_next_rain: true, hourly_count: 12, daily_count: 5, radar_zoom: 7, radar_height: 220, radar_color: 2, animations: true, ...c };
      this._built = false; this._fcAt = 0; this._frames = null; this._rvAt = 0;
      if (this._hass) this._render();
    }
    set hass(h) {
      const ch = this._c && window.applianceChanged(this, h, this._c);
      this._hass = h;
      if (ch) this._render();
    }
    getCardSize() { return 9; }
    getGridOptions() { return { columns: 12, min_columns: 6, rows: 'auto', min_rows: 4 }; }
    connectedCallback() { if (this._built) this._radarPlay(true); }
    disconnectedCallback() { this._radarPlay(false); if (this._ro) { this._ro.disconnect(); this._ro = null; } }

    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _t(k) { return (T[this._lang()] || {})[k] ?? T.en[k] ?? k; }
    _loc() { return window.applianceLocale ? window.applianceLocale(this._c, this._hass, true) : undefined; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _fmt(v, d = 0) { try { return new Intl.NumberFormat(this._loc(), { maximumFractionDigits: d }).format(v); } catch (e) { return String(Math.round(v * 10 ** d) / 10 ** d); } }
    _st(id) { const s = id && this._hass.states[id]; return s && !/^(unavailable|unknown)$/i.test(String(s.state)) ? s : null; }
    _hm(d) { try { return d.toLocaleTimeString(this._loc(), { hour: '2-digit', minute: '2-digit', hour12: this._hass && this._hass.locale && /^(12|24)$/.test(this._hass.locale.time_format) ? this._hass.locale.time_format === '12' : undefined }); } catch (e) { return d.toTimeString().slice(0, 5); } }
    _cond(cond) { return (this._hass.localize && this._hass.localize(`component.weather.entity_component._.state.${cond}`)) || String(cond || '').replace(/-/g, ' ').replace(/^./, (x) => x.toUpperCase()); }
    _pos() { const c = this._c, cf = (this._hass && this._hass.config) || {}; return { lat: fin(num(c.latitude)) ? num(c.latitude) : num(cf.latitude), lon: fin(num(c.longitude)) ? num(c.longitude) : num(cf.longitude) }; }
    // nuit : entité soleil si disponible, sinon calcul d'après la position
    _night(at) {
      const now = !at;
      const sun = now && this._st(this._c.entity_sun);
      if (sun && /^(above|below)_horizon$/.test(sun.state)) return sun.state === 'below_horizon';
      const { lat, lon } = this._pos(), d = at || new Date();
      if (!fin(lat) || !fin(lon)) return false;
      const st = sunTimes(d, lat, lon);
      return st ? !(d >= st.rise && d <= st.set) : false;
    }

    // prévisions (service weather.get_forecasts, ou attribut « forecast » des anciennes intégrations), rafraîchies toutes les 30 min
    _loadFc() {
      const h = this._hass, c = this._c, e = c.entity;
      if (this._fcBusy || Date.now() - (this._fcAt || 0) < 30 * 60000 || !h || !e) return;
      const legacy = ((h.states[e] || {}).attributes || {}).forecast;
      if (typeof h.callWS !== 'function') { if (Array.isArray(legacy)) this._fc = { daily: legacy, hourly: [] }; return; }
      this._fcBusy = true; this._fcAt = Date.now();
      const get = (type) => h.callWS({ type: 'call_service', domain: 'weather', service: 'get_forecasts', service_data: { type }, target: { entity_id: e }, return_response: true })
        .then((r) => ((r && r.response && r.response[e]) || {}).forecast || []).catch(() => []);
      Promise.all([get('daily'), get('hourly')]).then(([daily, hourly]) => {
        this._fc = { daily: daily.length ? daily : (Array.isArray(legacy) ? legacy : []), hourly };
      }).finally(() => { this._fcBusy = false; if (this._hass) this._render(); });
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="scene" id="wcscene"></div><div class="body">
        <div class="head" id="wchead"></div><div class="big" id="wcbig"></div><div class="hl" id="wchl"></div>
        <div class="alert hide" id="wcalert"></div>
        <div class="glass hide" id="wcnr"></div>
        <div class="glass hide" id="wchours"></div>
        <div class="glass hide" id="wcdays"></div>
        <div class="tiles hide" id="wctiles"></div>
        <div class="glass hide" id="wcsun"></div>
        <div class="glass radar hide" id="wcradar"><div class="t" id="wcrt"></div>
          <div class="map" id="wcmap"><div class="grid" id="wcgrid"></div><div class="pulse"></div><div class="home"></div><div class="msg" id="wcmsg"></div><div class="att">© Esri · © OpenStreetMap · RainViewer</div></div>
          <div class="ctl"><button id="wcplay" aria-label="Play"></button><input type="range" id="wcseek" min="0" max="0" value="0"><span class="rt" id="wctime"></span></div></div>
        </div></ha-card>`;
      this._root = root; this._card = root.querySelector('ha-card'); this._cache = {};
      root.getElementById('wchead').addEventListener('click', () => this._more(this._c.entity));
      root.getElementById('wcbig').addEventListener('click', () => this._more(this._c.entity));
      root.getElementById('wcalert').addEventListener('click', () => this._more(this._c.entity_alert));
      root.getElementById('wctiles').addEventListener('click', (e) => { const t = e.target.closest('.tile'); if (t) this._more(t.dataset.entity || this._c.entity); });
      root.getElementById('wcplay').addEventListener('click', () => this._radarToggle());
      root.getElementById('wcseek').addEventListener('input', (e) => { this._radarPlay(false); this._radarShow(Number(e.target.value)); this._paused = true; this._drawPlay(); });
      if (typeof ResizeObserver !== 'undefined') { this._ro = new ResizeObserver(() => this._radarFit()); this._ro.observe(root.getElementById('wcmap')); }
      this._built = true;
    }
    // met à jour un bloc seulement s'il a changé (garde la position de défilement et évite de recharger les images)
    _set(id, html) { if (this._cache[id] === html) return; this._cache[id] = html; this._root.getElementById(id).innerHTML = html; }
    _show(id, on) { this._root.getElementById(id).classList.toggle('hide', !on); }

    _render() {
      if (!this._built) this._build();
      const c = this._c, hass = this._hass, r = this._root, ws = this._st(c.entity);
      this._loadFc();
      const a = (ws && ws.attributes) || {}, cond = ws ? ws.state : 'unavailable', night = this._night();
      this._card.classList.toggle('noanim', c.animations === false);
      // scène
      const key = `${cond}|${night}`;
      if (this._sceneKey !== key) { this._sceneKey = key; const s = sceneHTML(cond, night), el = r.getElementById('wcscene'); el.className = `scene ${s.cls}`; el.innerHTML = s.html; }
      // temps actuel
      const tu = a.temperature_unit || (hass.config && hass.config.unit_system && hass.config.unit_system.temperature) || '°C', tv = num(a.temperature);
      const fc = this._fc || { daily: [], hourly: [] }, today = fc.daily.find((x) => new Date(x.datetime).toDateString() === new Date().toDateString()) || fc.daily[0] || {};
      const place = c.name || a.friendly_name || (hass.config && hass.config.location_name) || this._t('name');
      this._set('wchead', `<div><div class="place">${esc(place)}</div><div class="cond">${esc(!c.entity ? this._t('pick_entity') : ws ? this._cond(cond) : this._t('name'))}</div></div>`);
      this._set('wcbig', `<div class="temp">${fin(tv) ? this._fmt(tv, 1) : '--'}<sup>${esc(tu)}</sup></div>${ICON(cond, night)}`);
      const ap = num(a.apparent_temperature), hi = num(today.temperature), lo = num(today.templow);
      this._set('wchl', [fin(hi) ? `${this._t('high')} ${this._fmt(hi)}°` : '', fin(lo) ? `${this._t('low')} ${this._fmt(lo)}°` : '', fin(ap) ? `${this._t('feels')} ${this._fmt(ap)}°` : ''].filter(Boolean).join(' · '));
      this._alert(); this._nextRain(); this._hourly(night); this._daily(a); this._details(a); this._sunMoon();
      this._radarSetup();
    }

    _alert() {
      const c = this._c, el = this._root.getElementById('wcalert'), s = c.show_alert !== false && this._st(c.entity_alert);
      if (!s) { el.classList.add('hide'); return; }
      const a = s.attributes || {}, st = String(s.state).toLowerCase();
      // binary_sensor : « on » ; sensor Météo-France : couleur dans l'état (vert / jaune / orange / rouge) ou texte ; sinon tout état non vide hors « off / none / vert »
      if (/^(off|none|aucune|vert|green|0|ok|no)$/.test(st) || (!s.entity_id.startsWith('binary_sensor.') && st === '')) { el.classList.add('hide'); return; }
      const txt = a.headline || a.event || a.message || a.description || (s.entity_id.startsWith('binary_sensor.') ? a.friendly_name : s.state) || this._t('alert');
      el.classList.remove('hide'); el.classList.toggle('red', /rouge|red|extreme|severe/.test(st + ' ' + String(a.severity || '').toLowerCase()));
      this._set('wcalert', `${alertIcon}<span>${esc(String(txt))}</span>`);
    }

    // barres « pluie dans l'heure » (capteur Météo-France next_rain : attribut 1_hour_forecast)
    _nextRain() {
      const c = this._c, s = c.show_next_rain !== false && this._st(c.entity_next_rain);
      if (!s) { this._show('wcnr', false); return; }
      const f = (s.attributes && s.attributes['1_hour_forecast']) || {}, ks = Object.keys(f);
      if (!ks.length) { this._show('wcnr', false); return; }
      const lvl = (t) => { const x = String(t).toLowerCase(); return /forte|heavy|fort/.test(x) ? 3 : /mod/.test(x) ? 2 : /faible|light|pluie|rain/.test(x) && !/sec|dry/.test(x) ? 1 : 0; };
      const L = ks.map((k) => lvl(f[k])), any = L.some((x) => x > 0);
      this._show('wcnr', true);
      this._set('wcnr', `<div class="t">${esc(this._t('nextrain'))}</div><div class="nr">${L.map((x) => `<i class="${x ? 'l' + x : ''}" style="height:${x ? 25 + x * 25 : 10}%"></i>`).join('')}</div><div class="nrt">${esc(this._t(any ? 'rain_hour' : 'dry_hour'))}</div>`);
    }

    _hourly(night) {
      const c = this._c, fc = (this._fc || {}).hourly || [], on = c.show_hourly !== false && fc.length;
      this._show('wchours', !!on); if (!on) return;
      const now = Date.now() - 3600e3, items = fc.filter((x) => new Date(x.datetime).getTime() > now).slice(0, Math.max(1, Number(c.hourly_count) || 12));
      this._set('wchours', `<div class="t">${esc(this._t('hourly'))}</div><div class="hours">` + items.map((x, i) => {
        const d = new Date(x.datetime), t = num(x.temperature), p = num(x.precipitation_probability), mm = num(x.precipitation);
        const lab = i === 0 ? this._t('now') : this._hm(d).replace(/:00(?!\d)/, '').replace(/\s?[AP]M$/i, (m) => m);
        return `<div class="hr"><span class="tm">${esc(lab)}</span>${ICON(x.condition, x.is_daytime === false || this._night(d))}<span class="tp">${fin(t) ? this._fmt(t) + '°' : '--'}</span><span class="pp">${fin(p) && p > 0 ? this._fmt(p) + '%' : fin(mm) && mm > 0 ? this._fmt(mm, 1) + ' mm' : ''}</span></div>`;
      }).join('') + '</div>');
    }

    _daily() {
      const c = this._c, fc = (this._fc || {}).daily || [], on = c.show_daily !== false && fc.length;
      this._show('wcdays', !!on); if (!on) return;
      const items = fc.slice(0, Math.max(1, Number(c.daily_count) || 5)), lows = items.map((x) => num(x.templow)).filter(fin), his = items.map((x) => num(x.temperature)).filter(fin);
      const mn = Math.min(...lows, ...his), mx = Math.max(...his, ...lows), span = Math.max(1, mx - mn);
      this._set('wcdays', `<div class="t">${esc(this._t('daily'))}</div>` + items.map((x, i) => {
        const d = new Date(x.datetime), lo = num(x.templow), hi = num(x.temperature), p = num(x.precipitation_probability), mm = num(x.precipitation);
        let name = ''; try { name = i === 0 && d.toDateString() === new Date().toDateString() ? this._t('today') : d.toLocaleDateString(this._loc(), { weekday: 'short' }); } catch (e) { name = d.toDateString().slice(0, 3); }
        const l = fin(lo) ? ((lo - mn) / span) * 100 : 0, w = (fin(hi) ? ((hi - (fin(lo) ? lo : mn)) / span) * 100 : 100);
        return `<div class="dy"><span class="dn">${esc(name)}</span>${ICON(x.condition, false)}<span class="pp">${fin(p) && p > 0 ? this._fmt(p) + '%' : fin(mm) && mm > 0 ? this._fmt(mm, 1) : ''}</span><span class="lo">${fin(lo) ? this._fmt(lo) + '°' : ''}</span><span class="rng"><i style="left:${l.toFixed(1)}%;width:${Math.max(6, w).toFixed(1)}%"></i></span><span class="hi">${fin(hi) ? this._fmt(hi) + '°' : '--'}</span></div>`;
      }).join(''));
    }

    _details(a) {
      const c = this._c, el = this._root.getElementById('wctiles');
      if (c.show_details === false) { el.classList.add('hide'); return; }
      el.classList.remove('hide');
      const wu = a.wind_speed_unit || 'km/h', ws = num(a.wind_speed), gu = num(a.wind_gust_speed), wb = bearing(a.wind_bearing);
      const uvS = this._st(c.entity_uv), uv = uvS ? num(uvS.state) : num(a.uv_index);
      const pu = a.pressure_unit || 'hPa', vu = a.visibility_unit || 'km';
      const tile = (l, v, u, s, ent) => `<div class="tile" data-entity="${esc(ent || c.entity)}"><div class="l">${esc(l)}</div><div class="v">${v}${u ? `<small>${esc(u)}</small>` : ''}</div><div class="s">${s || ''}</div></div>`;
      const arrow = fin(wb) ? `<svg class="cmp" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" stroke="rgba(255,255,255,.45)"/><path d="M12 4 16 18 12 15.5 8 18Z" fill="#fff" transform="rotate(${((wb + 180) % 360).toFixed(0)} 12 12)"/></svg>` : '';
      const out = [];
      if (fin(ws)) out.push(tile(this._t('wind'), arrow + this._fmt(ws), wu, [fin(wb) ? COMPASS[Math.round(wb / 22.5) % 16] : '', fin(gu) ? `${this._t('gust')} ${this._fmt(gu)}` : ''].filter(Boolean).join(' · ')));
      if (fin(num(a.humidity))) out.push(tile(this._t('humidity'), this._fmt(num(a.humidity)), '%', fin(num(a.dew_point)) ? `${this._t('dew')} ${this._fmt(num(a.dew_point))}°` : ''));
      if (fin(uv)) out.push(tile(this._t('uv'), this._fmt(uv, uv < 10 ? 1 : 0), '', `${UVCOL(uv)}<div class="uvbar"><i style="left:${Math.min(97, (uv / 11) * 100).toFixed(0)}%"></i></div>`, c.entity_uv));
      if (fin(num(a.pressure))) out.push(tile(this._t('pressure'), this._fmt(num(a.pressure), pu === 'inHg' ? 2 : 0), pu, ''));
      if (fin(num(a.visibility))) out.push(tile(this._t('visibility'), this._fmt(num(a.visibility), 1), vu, ''));
      if (fin(num(a.cloud_coverage))) out.push(tile(this._t('clouds'), this._fmt(num(a.cloud_coverage)), '%', ''));
      if (!fin(num(a.humidity)) && fin(num(a.dew_point))) out.push(tile(this._t('dew'), this._fmt(num(a.dew_point)), '°', ''));
      this._set('wctiles', out.join(''));
    }

    _sunMoon() {
      const c = this._c, on = c.show_sun !== false, { lat, lon } = this._pos();
      const st = on && fin(lat) && fin(lon) ? sunTimes(new Date(), lat, lon) : null;
      this._show('wcsun', !!on && !!st); if (!on || !st) return;
      const now = Date.now(), f = Math.max(0, Math.min(1, (now - st.rise.getTime()) / (st.set.getTime() - st.rise.getTime()))), day = now >= st.rise && now <= st.set;
      // arc de l'horizon gauche (lever) à droite (coucher) ; la position du soleil suit la fraction du jour écoulée
      const W = 220, H = 70, x0 = 14, x1 = W - 14, cx = W / 2, ry = 52, ang = Math.PI * (1 - f), sx = cx + ((x1 - x0) / 2) * Math.cos(ang), sy = H - 12 - ry * Math.sin(ang);
      const p = moonPhase(new Date()), mi = Math.round(p * 8) % 8, dayMin = Math.round((st.set - st.rise) / 60000);
      const arc = `<svg class="arc" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="M${x0} ${H - 12} A${(x1 - x0) / 2} ${ry} 0 0 1 ${x1} ${H - 12}" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.5" stroke-dasharray="3 3"/><line x1="4" y1="${H - 12}" x2="${W - 4}" y2="${H - 12}" stroke="rgba(255,255,255,.35)"/>${day && !this._night() ? `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="6" fill="#ffd54a" stroke="#fff" stroke-width="1.5"/>` : ''}<text x="${x0}" y="${H - 1}" text-anchor="middle">${esc(this._hm(st.rise))}</text><text x="${x1}" y="${H - 1}" text-anchor="middle">${esc(this._hm(st.set))}</text><text x="${cx}" y="${H - 1}" text-anchor="middle">${Math.floor(dayMin / 60)} h ${String(dayMin % 60).padStart(2, '0')}</text></svg>`;
      this._set('wcsun', `<div class="sunrow">${arc}<div class="mn">${moonSvg(p)}<span>${esc(this._t('m' + mi))}</span></div></div>`);
    }

    // ---------- radar de pluie ----------
    _drawPlay() { const b = this._root.getElementById('wcplay'); b.innerHTML = this._playing ? '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'; b.setAttribute('aria-label', this._t(this._playing ? 'pause' : 'play')); }
    _radarToggle() { this._paused = this._playing; this._radarPlay(!this._playing); }
    _radarPlay(on) {
      clearInterval(this._rvTimer); this._playing = false;
      if (on && this._frames && this._frames.length > 1 && this._c.animations !== false && !this._paused) {
        this._playing = true;
        this._rvTimer = setInterval(() => this._radarShow((this._rvI + 1) % this._frames.length), 650);
      }
      if (this._built) this._drawPlay();
    }
    _radarShow(i) {
      const fr = this._frames; if (!fr || !fr[i]) return;
      this._rvI = i;
      this._root.querySelectorAll('.rf').forEach((el, k) => el.classList.toggle('on', k === i));
      const seek = this._root.getElementById('wcseek'); seek.value = String(i);
      const f = fr[i], d = new Date(f.time * 1000), mins = Math.round((d.getTime() - Date.now()) / 60000);
      this._root.getElementById('wctime').textContent = `${this._hm(d)} · ${mins > 2 ? '+' + mins + ' min' : mins < -2 ? mins + ' min' : this._t('radar_now')}`;
    }
    _radarFit() {
      const m = this._root && this._root.getElementById('wcmap'), g = this._root && this._root.getElementById('wcgrid'); if (!m || !g || !this._ofs) return;
      const w = m.clientWidth || 0, h = m.clientHeight || 0, s = Math.max(1, w / 500, h / 500);
      g.style.transform = `scale(${s.toFixed(3)}) translate(${(-this._ofs.x).toFixed(1)}px,${(-this._ofs.y).toFixed(1)}px)`;
    }
    _radarSetup() {
      const c = this._c, on = c.show_radar !== false, { lat, lon } = this._pos(), box = this._root.getElementById('wcradar');
      const ok = on && fin(lat) && fin(lon);
      box.classList.toggle('hide', !ok); if (!ok) return;
      this._root.getElementById('wcrt').textContent = this._t('radar');
      this._root.getElementById('wcmap').style.setProperty('--rh', `${Math.max(120, Number(c.radar_height) || 220)}px`);
      const z = Math.max(3, Math.min(7, Math.round(Number(c.radar_zoom) || 7))), dark = hasDark(this._hass), key = `${z}|${lat}|${lon}|${dark}|${c.radar_map_url || ''}`;
      if (this._mapKey !== key) { this._mapKey = key; this._radarBase(z, lat, lon, dark); this._frames = null; this._rvAt = 0; this._root.querySelectorAll('.rf').forEach((e) => e.remove()); }
      if (!this._frames && !this._rvBusy && Date.now() - this._rvAt > 5 * 60000) this._radarLoad(z, lat, lon);
      else if (this._frames && Date.now() - this._rvAt > 10 * 60000 && !this._rvBusy) this._radarLoad(z, lat, lon);
    }
    // 3 × 3 tuiles de fond autour de la maison
    _radarBase(z, lat, lon, dark) {
      const n = 2 ** z, xf = ((lon + 180) / 360) * n, la = lat * RAD, yf = ((1 - Math.log(Math.tan(la) + 1 / Math.cos(la)) / Math.PI) / 2) * n;
      const cx = Math.floor(xf), cy = Math.floor(yf);
      this._tile = { z, cx, cy, n }; this._ofs = { x: (xf - (cx - 1)) * 256 - 0, y: (yf - (cy - 1)) * 256 };
      const g = this._root.getElementById('wcgrid');
      // fond de carte : gris Esri (clair / sombre selon le thème), servi sans clé API ni référent — OpenStreetMap bloque les tuiles
      // demandées depuis Home Assistant (403 « Access blocked ») et CARTO exige une clé. radar_map_url : autre fournisseur ({z} {x} {y})
      const tpl = this._c.radar_map_url || `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${dark ? 'Dark' : 'Light'}_Gray_Base/MapServer/tile/{z}/{y}/{x}`;
      g.innerHTML = '';
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const x = ((cx + dx) % n + n) % n, y = cy + dy; if (y < 0 || y >= n) continue;
        const im = document.createElement('img'); im.alt = ''; im.draggable = false; im.decoding = 'async';
        im.style.left = `${(dx + 1) * 256}px`; im.style.top = `${(dy + 1) * 256}px`;
        im.src = tpl.replace('{z}', z).replace('{x}', x).replace('{y}', y);
        g.appendChild(im);
      }
      this._radarFit();
    }
    _radarLoad(z, lat, lon) {
      this._rvBusy = true; this._rvAt = Date.now();
      const fail = () => this._root.getElementById('wcradar').classList.add('fail');
      this._root.getElementById('wcmsg').textContent = this._t('radar_unavailable');
      fetch('https://api.rainviewer.com/public/weather-maps.json').then((r) => r.json()).then((j) => {
        const fr = [...((j.radar && j.radar.past) || []), ...((j.radar && j.radar.nowcast) || [])].slice(-12), host = j.host || 'https://tilecache.rainviewer.com';
        if (!fr.length) throw new Error('no frames');
        this._frames = fr; this._root.getElementById('wcradar').classList.remove('fail');
        const { cx, cy, n } = this._tile, col = Math.max(1, Math.min(8, Number(this._c.radar_color) || 2)), map = this._root.getElementById('wcgrid');
        map.querySelectorAll('.rf').forEach((e) => e.remove());
        fr.forEach((f) => {
          const d = document.createElement('div'); d.className = 'rf';
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            const x = ((cx + dx) % n + n) % n, y = cy + dy; if (y < 0 || y >= n) continue;
            const im = document.createElement('img'); im.alt = ''; im.draggable = false; im.style.left = `${(dx + 1) * 256}px`; im.style.top = `${(dy + 1) * 256}px`;
            im.src = `${host}${f.path}/256/${z}/${x}/${y}/${col}/1_1.png`; d.appendChild(im);
          }
          map.appendChild(d);
        });
        const seek = this._root.getElementById('wcseek'); seek.max = String(fr.length - 1);
        // image la plus récente du passé par défaut
        const pastN = ((j.radar && j.radar.past) || []).slice(-12).length; this._radarShow(Math.max(0, Math.min(fr.length - 1, pastN - 1)));
        this._radarPlay(true);
      }).catch(fail).finally(() => { this._rvBusy = false; });
    }
  }
  const hasDark = (h) => !!(h && h.themes && h.themes.darkMode);
  customElements.define(TAG, ApplianceWeatherCard);

  /* ---- éditeur visuel ---- */
  class ApplianceWeatherCardEditor extends HTMLElement {
    setConfig(c) { this._c = c; this._draw(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
    _draw() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => {
          this._c = e.detail.value;
          this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true }));
        });
        this.appendChild(this._form);
      }
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const n = (name, min, max, step = 1) => ({ name, selector: { number: { min, max, step, mode: 'box' } } });
      const tr = { ...T.en, ...T[window.applianceLang(T, this._c, this._hass)] };
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'entity', required: true, selector: { entity: { domain: 'weather' } } },
        { name: 'entity_sun', selector: { entity: { domain: 'sun' } } },
        { name: 'entity_alert', selector: { entity: { domain: ['binary_sensor', 'sensor'] } } },
        { name: 'entity_uv', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_next_rain', selector: { entity: { domain: 'sensor' } } },
        { type: 'grid', name: '', schema: [bool('show_alert'), bool('show_next_rain'), bool('show_hourly'), bool('show_daily'), bool('show_details'), bool('show_sun'), bool('show_radar'), bool('animations')] },
        { type: 'grid', name: '', schema: [n('hourly_count', 3, 48), n('daily_count', 1, 10), n('radar_zoom', 3, 7), n('radar_height', 120, 600, 10), n('radar_color', 1, 8)] },
        { name: 'radar_map_url', selector: { text: {} } },
        { type: 'grid', name: '', schema: [n('latitude', -90, 90, 0.0001), n('longitude', -180, 180, 0.0001)] },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        window.applianceLanguageField(T),
      ];
      this._form.computeLabel = (s) => tr[`f_${s.name}`] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceWeatherCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Carte météo complète à scène animée (soleil, lune, nuages, pluie, neige, orage, brouillard) : prévisions horaires et par jour, détails, arc du soleil, phase de la lune, alertes et radar de pluie animé autour de chez soi.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/weather.md',
  });
})();
