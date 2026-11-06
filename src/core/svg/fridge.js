/* style de réfrigérateur : congélateur en haut (défaut), en bas (tiroirs ou porte), French door, 4 portes, américain, une porte (sans congélateur) */
const fridgeStyle = (c) => ({ top: "top", haut: "top", bottom: "bottom", bas: "bottom", combi: "bottom", french: "french", french_door: "french", bottom_door: "bottom_door", "bottom-door": "bottom_door", combi_door: "bottom_door", combi_porte: "bottom_door", combi_clean: "combi_clean", "combi-clean": "combi_clean", clean: "combi_clean", modern: "combi_clean", four_door: "four_door", "4_door": "four_door", "4-door": "four_door", cross_door: "four_door", american: "american", americain: "american", side_by_side: "american", us: "american", single: "single", one_door: "single", "one-door": "single", une_porte: "single", "1_door": "single", larder: "single", tall: "single" }[String(c?.style || "top").toLowerCase()] || "top");

// contenu du compartiment frigo (bouteilles, pots, fruits, bac à légumes), dessiné dans la zone x, y, w, h
const fridgeFood = (x, y, w, h) => {
  const s1 = y + h * 0.33, s2 = y + h * 0.64, cx = x + w / 2;
  return `
<path d="M${x + 2} ${s1}h${w - 4}M${x + 2} ${s2}h${w - 4}" stroke="#b9c8d6" stroke-width="1.1"/>
<rect x="${x + 7}" y="${s1 - 14}" width="6" height="14" rx="1.5" fill="#3fbf7f"/><rect x="${x + 15}" y="${s1 - 10}" width="8" height="10" rx="2" fill="#f2c94c"/>
<rect x="${cx - 3}" y="${s1 - 8}" width="12" height="8" rx="2" fill="#e5484d"/><rect x="${x + w - 15}" y="${s1 - 12}" width="5" height="12" rx="1.5" fill="#3e8ed0"/>
<rect x="${x + 9}" y="${s2 - 10}" width="14" height="10" rx="2" fill="#ffffff" stroke="#c9d3dc" stroke-width=".6"/><circle cx="${cx + 4}" cy="${s2 - 5}" r="5" fill="#ff8f3d"/><circle cx="${cx + 14}" cy="${s2 - 4}" r="4" fill="#9fd356"/>
<rect x="${x + 3}" y="${s2 + 6}" width="${w - 6}" height="${y + h - s2 - 9}" rx="2" fill="#e3eef7" stroke="#b9c8d6" stroke-width=".6"/>`;
};
// tiroir de congélateur (façade inox + poignée horizontale)
const fzDrawer = (x, y, w, h, cls) => `
<g class="${cls}">
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="${x + w * 0.25}" y="${y + 3.5}" width="${w * 0.5}" height="3.2" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <path d="M${x + 4} ${y + h - 2}h${w - 8}" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>
</g>`;
// intérieur de congélateur à porte battante : clayettes givrées et bacs, dessiné dans la zone x, y, w, h
const fzInside = (x, y, w, h) => `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#ID-frost)"/>
<path d="M${x + 2} ${y + h * 0.36}h${w - 4}M${x + 2} ${y + h * 0.68}h${w - 4}" stroke="#a9cbe2" stroke-width="1"/>
<rect x="${x + 5}" y="${y + h * 0.36 - 9}" width="${w * 0.4}" height="9" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/><rect x="${x + w * 0.55}" y="${y + h * 0.36 - 7}" width="${w * 0.33}" height="7" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>
<rect x="${x + 5}" y="${y + h * 0.68 - 9}" width="${w * 0.5}" height="9" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>`;
// afficheur température + flocon
const fridgeLcd = (x, y) => `
<rect x="${x}" y="${y}" width="30" height="14" rx="2" fill="#0c1720" stroke="#7d868f" stroke-width=".6"/>
<g class="flake"><path d="M${x + 5.5} ${y + 4}v6M${x + 2.9} ${y + 5.5}l5.2 3M${x + 2.9} ${y + 8.5}l5.2-3" stroke="#38d9ff" stroke-width=".8" stroke-linecap="round"/></g>
<text class="lcd fr-temp" x="${x + 19.5}" y="${y + 10.8}" text-anchor="middle" fill="#38d9ff" font-size="11.5" font-weight="800">--°</text>`;
// afficheur de la zone flex (option flex_temperature)
const flexLcd = (x, y) => `
<rect x="${x}" y="${y}" width="22" height="11" rx="2" fill="#0c1720" stroke="#7d868f" stroke-width=".6"/>
<text class="lcd3" x="${x + 11}" y="${y + 8.4}" text-anchor="middle" fill="#7cf0c4" font-size="8.5" font-weight="800">--°</text>`;
const FRIDGE_DEFS = `<defs>${DEFS}
<linearGradient id="ID-in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe9f2"/></linearGradient>
<linearGradient id="ID-frost" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9f6ff"/><stop offset="1" stop-color="#bfe0f5"/></linearGradient>
<linearGradient id="ID-fwhite" x1="0" x2="1"><stop offset="0" stop-color="#dfe3e7"/><stop offset=".22" stop-color="#ffffff"/><stop offset=".55" stop-color="#f3f5f7"/><stop offset=".8" stop-color="#fbfcfd"/><stop offset="1" stop-color="#d3d8dd"/></linearGradient>
<linearGradient id="ID-fblack" x1="0" x2="1"><stop offset="0" stop-color="#1c1f23"/><stop offset=".22" stop-color="#4a5058"/><stop offset=".5" stop-color="#2b2f35"/><stop offset=".75" stop-color="#40464d"/><stop offset="1" stop-color="#16181b"/></linearGradient></defs>`;
const fridgeMist = `<g class="mist"><circle cx="40" cy="132" r="1.1"/><circle cx="52" cy="133" r=".9"/><circle cx="66" cy="132" r="1.2"/><circle cx="79" cy="133" r=".9"/></g>`;

const FRIDGE = {
  // congélateur en haut (modèle d'origine)
  top: () => `
<ellipse cx="60" cy="134" rx="40" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="26" y="4" width="68" height="126" rx="6" fill="#9aa2ab"/>
<rect x="29" y="7" width="62" height="36" rx="3" fill="url(#ID-frost)"/>
<path d="M31 25h58" stroke="#a9cbe2" stroke-width="1"/>
<rect x="34" y="28" width="22" height="11" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>
<rect x="60" y="28" width="26" height="11" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>
<rect x="29" y="47" width="62" height="78" rx="3" fill="url(#ID-in)"/>
<path d="M31 72h58M31 96h58" stroke="#b9c8d6" stroke-width="1.1"/>
<rect x="36" y="58" width="6" height="14" rx="1.5" fill="#3fbf7f"/><rect x="44" y="62" width="8" height="10" rx="2" fill="#f2c94c"/>
<rect x="56" y="64" width="12" height="8" rx="2" fill="#e5484d"/><rect x="72" y="60" width="5" height="12" rx="1.5" fill="#3e8ed0"/>
<rect x="38" y="86" width="14" height="10" rx="2" fill="#ffffff" stroke="#c9d3dc" stroke-width=".6"/><circle cx="64" cy="91" r="5" fill="#ff8f3d"/><circle cx="74" cy="92" r="4" fill="#9fd356"/>
<rect x="32" y="104" width="56" height="18" rx="2" fill="#e3eef7" stroke="#b9c8d6" stroke-width=".6"/>
<rect class="flight" x="29" y="47" width="62" height="78" fill="#fffbe6" opacity="0"/>
<g class="fz-door">
  <rect x="26" y="4" width="68" height="40" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="84" y="12" width="3.4" height="24" rx="1.7" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
</g>
<g class="fr-door">
  <rect x="26" y="46" width="68" height="84" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="84" y="52" width="3.4" height="40" rx="1.7" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  ${fridgeLcd(35, 54)}
  <path d="M30 50v76" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>`,

  // combiné : frigo en haut, deux tiroirs de congélation en bas
  bottom: () => `
<ellipse cx="60" cy="134" rx="40" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="26" y="4" width="68" height="126" rx="6" fill="#9aa2ab"/>
<rect x="29" y="7" width="62" height="74" rx="3" fill="url(#ID-in)"/>
${fridgeFood(29, 7, 62, 74)}
<rect class="flight" x="29" y="7" width="62" height="74" fill="#fffbe6" opacity="0"/>
<rect x="29" y="86" width="62" height="41" rx="3" fill="url(#ID-frost)"/>
<path d="M31 106h58" stroke="#a9cbe2" stroke-width="1"/>
${fzDrawer(26, 108, 68, 22, "fzd")}
${fzDrawer(26, 85, 68, 22, "fzd fzd-pull")}
<g class="fr-door">
  <rect x="26" y="4" width="68" height="79" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="84" y="40" width="3.4" height="38" rx="1.7" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  ${fridgeLcd(45, 11.5)}
  <path d="M30 8v71" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>`,

  // combiné classique : porte de frigo en haut, porte battante de congélateur en bas
  bottom_door: () => `
<ellipse cx="60" cy="134" rx="40" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="26" y="4" width="68" height="126" rx="6" fill="#9aa2ab"/>
<rect x="29" y="7" width="62" height="74" rx="3" fill="url(#ID-in)"/>
${fridgeFood(29, 7, 62, 74)}
<rect class="flight" x="29" y="7" width="62" height="74" fill="#fffbe6" opacity="0"/>
${fzInside(29, 86, 62, 41)}
<g class="fz-door">
  <rect x="26" y="84" width="68" height="46" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <path d="M30 88v38" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>
<g class="fr-door">
  <rect x="26" y="4" width="68" height="79" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  ${fridgeLcd(45, 11.5)}
  <path d="M30 8v71" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>`,

  // 4 portes (cross door) : deux portes battantes en haut, deux portes battantes de congélateur en bas
    // combiné moderne (sans poignées saillantes, frigo en haut, congélateur battant en bas)
  combi_clean: () => `
<ellipse cx="60" cy="134" rx="40" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="26" y="4" width="68" height="126" rx="6" fill="#9aa2ab"/>
<rect x="29" y="7" width="62" height="74" rx="3" fill="url(#ID-in)"/>
${fridgeFood(29, 7, 62, 74)}
<rect class="flight" x="29" y="7" width="62" height="74" fill="#fffbe6" opacity="0"/>
${fzInside(29, 86, 62, 41)}
<g class="fz-door">
  <rect x="26" y="84" width="68" height="46" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <path d="M30 88v38" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>
<g class="fr-door">
  <rect x="26" y="4" width="68" height="79" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  ${fridgeLcd(45, 11.5)}
  <path d="M30 8v71" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>`,

  four_door: (flex) => `
<ellipse cx="60" cy="134" rx="50" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="16" y="4" width="88" height="126" rx="6" fill="#9aa2ab"/>
<rect x="19" y="7" width="82" height="70" rx="3" fill="url(#ID-in)"/>
${fridgeFood(19, 7, 82, 70)}
<rect class="flight" x="19" y="7" width="82" height="70" fill="#fffbe6" opacity="0"/>
${fzInside(19, 82, 40, 45)}${fzInside(61, 82, 40, 45)}
<g class="fz-door fz-l" style="transform-origin: 16px 0">
  <rect x="16" y="80" width="43.6" height="50" rx="5" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="53" y="88" width="3.2" height="30" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <path d="M20 84v42" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>
<g class="fz-door fz-r" style="transform-origin: 104px 0">
  <rect x="60.4" y="80" width="43.6" height="50" rx="5" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="63.8" y="88" width="3.2" height="30" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <path d="M71 84v42" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
  ${flex ? flexLcd(74, 86) : ""}
</g>
<g class="fr-door fr-l">
  <rect x="16" y="4" width="43.6" height="75" rx="5" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="53" y="16" width="3.2" height="46" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  ${fridgeLcd(22, 12)}
  <path d="M20 8v67" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>
<g class="fr-door fr-r" style="transform-origin: 104px 0">
  <rect x="60.4" y="4" width="43.6" height="75" rx="5" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="63.8" y="16" width="3.2" height="46" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <path d="M71 8v67" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
</g>`,

  // French door : deux portes battantes en haut, deux tiroirs de congélation en bas
  french: (flex) => `
<ellipse cx="60" cy="134" rx="50" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="16" y="4" width="88" height="126" rx="6" fill="#9aa2ab"/>
<rect x="19" y="7" width="82" height="70" rx="3" fill="url(#ID-in)"/>
${fridgeFood(19, 7, 82, 70)}
<rect class="flight" x="19" y="7" width="82" height="70" fill="#fffbe6" opacity="0"/>
<rect x="19" y="82" width="82" height="45" rx="3" fill="url(#ID-frost)"/>
<path d="M21 106h78" stroke="#a9cbe2" stroke-width="1"/>
${fzDrawer(16, 106, 88, 24, "fzd")}
<g class="fzd fzd-pull">${fzDrawer(16, 81, 88, 23, "")}${flex ? flexLcd(76, 88) : ""}</g>
<g class="fr-door fr-l">
  <rect x="16" y="4" width="43.6" height="75" rx="5" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="53" y="16" width="3.2" height="46" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  ${fridgeLcd(22, 12)}
  <path d="M20 8v67" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>
<g class="fr-door fr-r" style="transform-origin: 104px 0">
  <rect x="60.4" y="4" width="43.6" height="75" rx="5" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="63.8" y="16" width="3.2" height="46" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <path d="M71 8v67" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
</g>`,

  // une porte, sans congélateur (réfrigérateur « tout utile ») : clayettes en verre sur toute la hauteur, deux bacs à légumes
  single: () => `
<ellipse cx="60" cy="134" rx="40" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="26" y="4" width="68" height="126" rx="6" fill="#9aa2ab"/>
<rect x="29" y="7" width="62" height="120" rx="3" fill="url(#ID-in)"/>
<path d="M31 30h58M31 53h58M31 76h58M31 99h58" stroke="#b9c8d6" stroke-width="1.1"/>
<rect x="36" y="16" width="6" height="14" rx="1.5" fill="#3fbf7f"/><rect x="44" y="20" width="8" height="10" rx="2" fill="#f2c94c"/>
<rect x="58" y="22" width="12" height="8" rx="2" fill="#e5484d"/><rect x="76" y="18" width="5" height="12" rx="1.5" fill="#3e8ed0"/>
<rect x="36" y="44" width="16" height="9" rx="2" fill="#ffffff" stroke="#c9d3dc" stroke-width=".6"/><rect x="56" y="41" width="9" height="12" rx="2" fill="#f2f0e6" stroke="#c9d3dc" stroke-width=".6"/>
<rect x="69" y="46" width="14" height="7" rx="2" fill="#ffd27a"/>
<rect x="35" y="64" width="18" height="12" rx="2" fill="#9ad0ec" stroke="#7fb6d3" stroke-width=".6"/><circle cx="64" cy="71" r="5" fill="#ff8f3d"/><circle cx="74" cy="72" r="4" fill="#9fd356"/>
<rect x="37" y="88" width="10" height="11" rx="2" fill="#c78bd6"/><rect x="51" y="90" width="15" height="9" rx="2" fill="#ffffff" stroke="#c9d3dc" stroke-width=".6"/><rect x="70" y="86" width="6" height="13" rx="1.5" fill="#3fbf7f"/>
<rect x="31" y="103" width="28" height="21" rx="2" fill="#e3eef7" stroke="#b9c8d6" stroke-width=".6"/><rect x="61" y="103" width="28" height="21" rx="2" fill="#e3eef7" stroke="#b9c8d6" stroke-width=".6"/>
<circle cx="40" cy="116" r="3.4" fill="#9fd356"/><circle cx="47" cy="117" r="3" fill="#e5484d"/><rect x="68" y="113" width="13" height="5" rx="2.5" fill="#ff8f3d"/>
<rect class="flight" x="29" y="7" width="62" height="120" fill="#fffbe6" opacity="0"/>
<g class="fr-door">
  <rect x="26" y="4" width="68" height="126" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="84" y="16" width="3.4" height="48" rx="1.7" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  ${fridgeLcd(45, 11.5)}
  <path d="M30 8v118" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>`,

  // américain side-by-side : congélateur à gauche avec distributeur glaçons / eau, frigo à droite
  american: () => `
<ellipse cx="60" cy="134" rx="54" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="12" y="4" width="96" height="126" rx="6" fill="#9aa2ab"/>
<rect x="15" y="7" width="43" height="120" rx="3" fill="url(#ID-frost)"/>
<path d="M17 36h39M17 66h39M17 96h39" stroke="#a9cbe2" stroke-width="1"/>
<rect x="19" y="24" width="14" height="10" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/><rect x="36" y="27" width="17" height="7" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>
<rect x="20" y="54" width="32" height="10" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>
<rect x="62" y="7" width="43" height="120" rx="3" fill="url(#ID-in)"/>
${fridgeFood(62, 7, 43, 120)}
<rect class="flight" x="62" y="7" width="43" height="120" fill="#fffbe6" opacity="0"/>
<g class="fz-door fz-l">
  <rect x="12" y="4" width="47.6" height="126" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="53.4" y="30" width="3.2" height="66" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  ${fridgeLcd(19, 14)}
  <rect x="19" y="32" width="28" height="36" rx="3" fill="#161b21" stroke="#5f6770" stroke-width=".6"/>
  <rect class="ib-light" x="20.5" y="33.5" width="25" height="2" rx="1" fill="#6fd8ff"/>
  <path d="M30 36v6h6v-6" fill="#2a3139" stroke="#5f6770" stroke-width=".4"/>
  <rect x="24" y="44" width="18" height="11" rx="1.5" fill="#20262d" stroke="#3b434c" stroke-width=".5"/>
  <circle class="ib-drop" cx="33" cy="43" r=".9" fill="#9fdcff"/>
  <g class="ib-ice"><rect x="27" y="45" width="3" height="3" rx=".6" fill="#e9f6ff" opacity=".8"/><rect x="36" y="46" width="3" height="3" rx=".6" fill="#e9f6ff" opacity=".8"/></g>
  <rect x="20" y="62" width="26" height="4" rx="1" fill="#2a3139"/><path d="M22 63.2h22M22 64.8h22" stroke="#3b434c" stroke-width=".4"/>
  <path d="M16 8v118" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>
<g class="fr-door fr-r">
  <rect x="60.4" y="4" width="47.6" height="126" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="63.4" y="30" width="3.2" height="66" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <path d="M71 8v118" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
</g>`,
};

// finition des portes (option finish) : inox (défaut), blanc ou noir
const fridgeFinish = (c) => ({ white: "fwhite", blanc: "fwhite", black: "fblack", noir: "fblack" }[String(c?.finish || "").toLowerCase()] || "");
SVG.fridge = (c) => {
  const f = fridgeFinish(c), body = FRIDGE[fridgeStyle(c)](!!(c && c.flex_temperature));
  return `${FRIDGE_DEFS}${f ? body.replace(/url\(#ID-inox\)/g, `url(#ID-${f})`) : body}${fridgeMist}`;
};
