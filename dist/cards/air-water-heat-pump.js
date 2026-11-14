/* Carte « PAC air/eau 2 zones » — custom:appliance-air-water-heat-pump-card
 * Pompe à chaleur air/eau : unité extérieure (ventilateur, flux d'air), module intérieur,
 * puis deux circuits de chauffage avec leur circulateur : zone 1 (radiateurs) et zone 2 (plancher chauffant).
 * Le compresseur tourne si la fréquence ou la puissance dépasse le seuil ; chaque zone s'anime quand son
 * circulateur tourne ; la vanne 3 voies en position « eau chaude » arrête les zones et affiche l'ECS.
 */
(() => {
  const TAG = 'appliance-air-water-heat-pump-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Air-to-water heat pump",
      "off": "Off",
      "standby": "Standby",
      "heating": "Heating",
      "dhw": "Hot water",
      "cooling": "Cooling",
      "alarm": "Fault",
      "heat": "Heat output",
      "power": "Electric",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Demand",
      "flow": "Flow",
      "ret": "Return",
      "delta": "ΔT",
      "dhw_temp": "Hot water tank",
      "buffer": "Buffer tank",
      "outdoor": "Outdoor",
      "energy": "Elec. energy",
      "heat_energy": "Heat energy",
      "backup": "Backup heater",
      "immersion": "Immersion heater",
      "boiler": "Boiler",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "On"
    },
    "cs": {
      "name": "Air-to-water heat pump",
      "off": "Off",
      "standby": "Standby",
      "heating": "Heating",
      "dhw": "Hot water",
      "cooling": "Cooling",
      "alarm": "Fault",
      "heat": "Heat output",
      "power": "Electric",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Demand",
      "flow": "Flow",
      "ret": "Return",
      "delta": "ΔT",
      "dhw_temp": "Hot water tank",
      "buffer": "Buffer tank",
      "outdoor": "Outdoor",
      "energy": "Elec. energy",
      "heat_energy": "Heat energy",
      "backup": "Backup heater",
      "immersion": "Immersion heater",
      "boiler": "Boiler",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "On"
    },
    "da": {
      "name": "Air-to-water heat pump",
      "off": "Off",
      "standby": "Standby",
      "heating": "Heating",
      "dhw": "Hot water",
      "cooling": "Cooling",
      "alarm": "Fault",
      "heat": "Heat output",
      "power": "Electric",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Demand",
      "flow": "Flow",
      "ret": "Return",
      "delta": "ΔT",
      "dhw_temp": "Hot water tank",
      "buffer": "Buffer tank",
      "outdoor": "Outdoor",
      "energy": "Elec. energy",
      "heat_energy": "Heat energy",
      "backup": "Backup heater",
      "immersion": "Immersion heater",
      "boiler": "Boiler",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "On"
    },
    "de": {
      "name": "Luft-Wasser-Wärmepumpe",
      "off": "Aus",
      "standby": "Standby",
      "heating": "Heizen",
      "dhw": "Warmwasser",
      "cooling": "Kühlen",
      "alarm": "Störung",
      "heat": "Wärmeleistung",
      "power": "Elektrisch",
      "cop": "COP",
      "freq": "Verdichter",
      "demand": "Anforderung",
      "flow": "Vorlauf",
      "ret": "Rücklauf",
      "delta": "ΔT",
      "dhw_temp": "Warmwasserspeicher",
      "buffer": "Pufferspeicher",
      "outdoor": "Außen",
      "energy": "Strom",
      "heat_energy": "Wärmeenergie",
      "backup": "Zusatzheizung",
      "immersion": "Heizstab",
      "boiler": "Kessel",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "An"
    },
    "es": {
      "name": "Bomba de calor aire-agua",
      "off": "Apagado",
      "standby": "En espera",
      "heating": "Calefacción",
      "dhw": "Agua caliente",
      "cooling": "Refrigeración",
      "alarm": "Fallo",
      "heat": "Potencia térmica",
      "power": "Eléctrica",
      "cop": "COP",
      "freq": "Compresor",
      "demand": "Demanda",
      "flow": "Ida",
      "ret": "Retorno",
      "delta": "ΔT",
      "dhw_temp": "Depósito ACS",
      "buffer": "Depósito de inercia",
      "outdoor": "Exterior",
      "energy": "Energía eléc.",
      "heat_energy": "Energía térmica",
      "backup": "Apoyo",
      "immersion": "Resistencia",
      "boiler": "Caldera",
      "zone1": "Zona 1",
      "zone2": "Zona 2",
      "on": "Marcha"
    },
    "fr": {
      "name": "PAC air/eau",
      "off": "Arrêt",
      "standby": "Veille",
      "heating": "Chauffage",
      "dhw": "Eau chaude",
      "cooling": "Rafraîchissement",
      "alarm": "Défaut",
      "heat": "Puissance thermique",
      "power": "Électrique",
      "cop": "COP",
      "freq": "Compresseur",
      "demand": "Demande",
      "flow": "Départ",
      "ret": "Retour",
      "delta": "ΔT",
      "dhw_temp": "Ballon ECS",
      "buffer": "Ballon tampon",
      "outdoor": "Extérieur",
      "energy": "Énergie élec.",
      "heat_energy": "Énergie thermique",
      "backup": "Appoint",
      "immersion": "Résistance",
      "boiler": "Chaudière",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "Marche"
    },
    "hu": {
      "name": "Air-to-water heat pump",
      "off": "Off",
      "standby": "Standby",
      "heating": "Heating",
      "dhw": "Hot water",
      "cooling": "Cooling",
      "alarm": "Fault",
      "heat": "Heat output",
      "power": "Electric",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Demand",
      "flow": "Flow",
      "ret": "Return",
      "delta": "ΔT",
      "dhw_temp": "Hot water tank",
      "buffer": "Buffer tank",
      "outdoor": "Outdoor",
      "energy": "Elec. energy",
      "heat_energy": "Heat energy",
      "backup": "Backup heater",
      "immersion": "Immersion heater",
      "boiler": "Boiler",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "On"
    },
    "it": {
      "name": "Pompa di calore aria-acqua",
      "off": "Spento",
      "standby": "Standby",
      "heating": "Riscaldamento",
      "dhw": "Acqua calda",
      "cooling": "Raffrescamento",
      "alarm": "Guasto",
      "heat": "Potenza termica",
      "power": "Elettrica",
      "cop": "COP",
      "freq": "Compressore",
      "demand": "Richiesta",
      "flow": "Mandata",
      "ret": "Ritorno",
      "delta": "ΔT",
      "dhw_temp": "Bollitore ACS",
      "buffer": "Puffer",
      "outdoor": "Esterno",
      "energy": "Energia elett.",
      "heat_energy": "Energia termica",
      "backup": "Integrazione",
      "immersion": "Resistenza",
      "boiler": "Caldaia",
      "zone1": "Zona 1",
      "zone2": "Zona 2",
      "on": "Acceso"
    },
    "nb": {
      "name": "Air-to-water heat pump",
      "off": "Off",
      "standby": "Standby",
      "heating": "Heating",
      "dhw": "Hot water",
      "cooling": "Cooling",
      "alarm": "Fault",
      "heat": "Heat output",
      "power": "Electric",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Demand",
      "flow": "Flow",
      "ret": "Return",
      "delta": "ΔT",
      "dhw_temp": "Hot water tank",
      "buffer": "Buffer tank",
      "outdoor": "Outdoor",
      "energy": "Elec. energy",
      "heat_energy": "Heat energy",
      "backup": "Backup heater",
      "immersion": "Immersion heater",
      "boiler": "Boiler",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "On"
    },
    "nl": {
      "name": "Lucht-water-warmtepomp",
      "off": "Uit",
      "standby": "Stand-by",
      "heating": "Verwarmen",
      "dhw": "Warm water",
      "cooling": "Koelen",
      "alarm": "Storing",
      "heat": "Warmtevermogen",
      "power": "Elektrisch",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Vraag",
      "flow": "Aanvoer",
      "ret": "Retour",
      "delta": "ΔT",
      "dhw_temp": "Warmwaterboiler",
      "buffer": "Buffervat",
      "outdoor": "Buiten",
      "energy": "Elektr. energie",
      "heat_energy": "Warmte-energie",
      "backup": "Bijverwarming",
      "immersion": "Elektrisch element",
      "boiler": "Ketel",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "Aan"
    },
    "pl": {
      "name": "Air-to-water heat pump",
      "off": "Off",
      "standby": "Standby",
      "heating": "Heating",
      "dhw": "Hot water",
      "cooling": "Cooling",
      "alarm": "Fault",
      "heat": "Heat output",
      "power": "Electric",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Demand",
      "flow": "Flow",
      "ret": "Return",
      "delta": "ΔT",
      "dhw_temp": "Hot water tank",
      "buffer": "Buffer tank",
      "outdoor": "Outdoor",
      "energy": "Elec. energy",
      "heat_energy": "Heat energy",
      "backup": "Backup heater",
      "immersion": "Immersion heater",
      "boiler": "Boiler",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "On"
    },
    "pt-BR": {
      "name": "Bomba de calor ar-água",
      "off": "Desligado",
      "standby": "Em espera",
      "heating": "Aquecimento",
      "dhw": "Água quente",
      "cooling": "Arrefecimento",
      "alarm": "Avaria",
      "heat": "Potência térmica",
      "power": "Elétrica",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Procura",
      "flow": "Ida",
      "ret": "Retorno",
      "delta": "ΔT",
      "dhw_temp": "Depósito AQS",
      "buffer": "Depósito de inércia",
      "outdoor": "Exterior",
      "energy": "Energia elét.",
      "heat_energy": "Energia térmica",
      "backup": "Apoio",
      "immersion": "Resistência",
      "boiler": "Caldeira",
      "zone1": "Zona 1",
      "zone2": "Zona 2",
      "on": "Ligado"
    },
    "pt-PT": {
      "name": "Bomba de calor ar-água",
      "off": "Desligado",
      "standby": "Em espera",
      "heating": "Aquecimento",
      "dhw": "Água quente",
      "cooling": "Arrefecimento",
      "alarm": "Avaria",
      "heat": "Potência térmica",
      "power": "Elétrica",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Procura",
      "flow": "Ida",
      "ret": "Retorno",
      "delta": "ΔT",
      "dhw_temp": "Depósito AQS",
      "buffer": "Depósito de inércia",
      "outdoor": "Exterior",
      "energy": "Energia elét.",
      "heat_energy": "Energia térmica",
      "backup": "Apoio",
      "immersion": "Resistência",
      "boiler": "Caldeira",
      "zone1": "Zona 1",
      "zone2": "Zona 2",
      "on": "Ligado"
    },
    "ro": {
      "name": "Air-to-water heat pump",
      "off": "Off",
      "standby": "Standby",
      "heating": "Heating",
      "dhw": "Hot water",
      "cooling": "Cooling",
      "alarm": "Fault",
      "heat": "Heat output",
      "power": "Electric",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Demand",
      "flow": "Flow",
      "ret": "Return",
      "delta": "ΔT",
      "dhw_temp": "Hot water tank",
      "buffer": "Buffer tank",
      "outdoor": "Outdoor",
      "energy": "Elec. energy",
      "heat_energy": "Heat energy",
      "backup": "Backup heater",
      "immersion": "Immersion heater",
      "boiler": "Boiler",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "On"
    },
    "ru": {
      "name": "Air-to-water heat pump",
      "off": "Off",
      "standby": "Standby",
      "heating": "Heating",
      "dhw": "Hot water",
      "cooling": "Cooling",
      "alarm": "Fault",
      "heat": "Heat output",
      "power": "Electric",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Demand",
      "flow": "Flow",
      "ret": "Return",
      "delta": "ΔT",
      "dhw_temp": "Hot water tank",
      "buffer": "Buffer tank",
      "outdoor": "Outdoor",
      "energy": "Elec. energy",
      "heat_energy": "Heat energy",
      "backup": "Backup heater",
      "immersion": "Immersion heater",
      "boiler": "Boiler",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "On"
    },
    "sr": {
      "name": "Air-to-water heat pump",
      "off": "Off",
      "standby": "Standby",
      "heating": "Heating",
      "dhw": "Hot water",
      "cooling": "Cooling",
      "alarm": "Fault",
      "heat": "Heat output",
      "power": "Electric",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Demand",
      "flow": "Flow",
      "ret": "Return",
      "delta": "ΔT",
      "dhw_temp": "Hot water tank",
      "buffer": "Buffer tank",
      "outdoor": "Outdoor",
      "energy": "Elec. energy",
      "heat_energy": "Heat energy",
      "backup": "Backup heater",
      "immersion": "Immersion heater",
      "boiler": "Boiler",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "On"
    },
    "sr-Latn": {
      "name": "Air-to-water heat pump",
      "off": "Off",
      "standby": "Standby",
      "heating": "Heating",
      "dhw": "Hot water",
      "cooling": "Cooling",
      "alarm": "Fault",
      "heat": "Heat output",
      "power": "Electric",
      "cop": "COP",
      "freq": "Compressor",
      "demand": "Demand",
      "flow": "Flow",
      "ret": "Return",
      "delta": "ΔT",
      "dhw_temp": "Hot water tank",
      "buffer": "Buffer tank",
      "outdoor": "Outdoor",
      "energy": "Elec. energy",
      "heat_energy": "Heat energy",
      "backup": "Backup heater",
      "immersion": "Immersion heater",
      "boiler": "Boiler",
      "zone1": "Zone 1",
      "zone2": "Zone 2",
      "on": "On"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--ah-heat:var(--appliance-heat-color,#ff8a3d);--ah-cold:var(--appliance-cold-color,#2b9af9);
  --ah-alert:var(--appliance-alert-color,#db4437)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--ah-heat) 22%,transparent);color:var(--ah-heat)}
.dhw .badge,.cooling .badge{background:color-mix(in srgb,var(--ah-cold) 22%,transparent);color:var(--ah-cold)}
.alarm .badge{background:color-mix(in srgb,var(--ah-alert) 22%,transparent);color:var(--ah-alert)}
svg{display:block;width:100%;max-width:calc(100% * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}

/* ---- illustration ---- */
.fan{transform-box:fill-box;transform-origin:50% 50%}
.run .fan{animation:spin var(--ah-spin,.7s) linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.air{opacity:.3}
.run .air{animation:air 1.1s ease-in-out infinite}
.run .air.b{animation-delay:.18s}.run .air.c{animation-delay:.36s}
@keyframes air{0%{opacity:.15;transform:translateX(-4px)}50%{opacity:.95}100%{opacity:.15;transform:translateX(5px)}}
.dash{stroke-dasharray:4 7;opacity:0}
.run .dash.pri,.z1 .dash.z1,.z2 .dash.z2{opacity:.95;animation:flow 1s linear infinite}
@keyframes flow{to{stroke-dashoffset:-11}}
.pump .tri{fill:#e6ebf0;transform-box:fill-box;transform-origin:50% 50%}
.z1 .pump.p1 .tri,.z2 .pump.p2 .tri{fill:#7fe3a0}
.led{fill:#6b7480}
.heating .led{fill:#ff8a3d}.dhw .led{fill:#3fa3ff}.cooling .led{fill:#4dd0e1}.standby .led{fill:#43a047}.alarm .led{fill:#db4437;animation:blink .8s steps(2) infinite}
@keyframes blink{50%{opacity:.15}}
.dsp{fill:#7fe3ff;font:700 11px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.alarm .dsp{fill:#ffb74d}.off .dsp{fill:#3b4a5c}
.off .body-shade{opacity:.55}
.zlabel{fill:var(--secondary-text-color);font:600 9px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.rad{fill:#e9edf1;transition:fill .8s}
.z1 .rad{fill:color-mix(in srgb,var(--ah-flowc,#e5533d) 38%,#f4f6f8)}
.zoff{transition:opacity .6s}
.dhwmode .zone{opacity:.45}
.noanim *{animation:none!important}
`;

  // Schéma : unité extérieure (g.), module intérieur (m.), collecteurs départ / retour, 2 circulateurs, 2 émetteurs
  const SVG = `
<svg viewBox="0 0 330 190" role="img" aria-label="air water heat pump">
 <defs>
  <linearGradient id="ah-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9dfe6"/></linearGradient>
  <linearGradient id="ah-mod" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4f6f9"/><stop offset="1" stop-color="#d3d9e0"/></linearGradient>
 </defs>
 <!-- flux d'air -->
 <g fill="none" stroke="#8fd0f7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <path class="air a" d="M6 78 Q16 76 24 82 M19 76 L25 82 L17 85"/>
  <path class="air b" d="M6 92 Q16 90 24 96 M19 90 L25 96 L17 99"/>
  <path class="air c" d="M6 106 Q16 104 24 110 M19 104 L25 110 L17 113"/>
 </g>
 <!-- unité extérieure -->
 <rect x="34" y="60" width="84" height="76" rx="7" fill="#000" opacity=".12" transform="translate(2 3)"/>
 <rect class="body-shade" x="32" y="58" width="84" height="76" rx="7" fill="url(#ah-body)" stroke="#aeb6c0" stroke-width="1.2"/>
 <rect x="38" y="64" width="48" height="64" rx="5" fill="#cfd6de"/>
 <circle cx="62" cy="96" r="25" fill="#1b232d" stroke="#2c3744" stroke-width="1.5"/>
 <g class="fan" fill="#59636f" stroke="#2c3744" stroke-width=".6">
  <path d="M62 96 C56 84 60 74 66 72 C70 80 68 90 62 96Z"/>
  <path d="M62 96 C73 90 83 92 85 98 C77 103 67 102 62 96Z"/>
  <path d="M62 96 C64 109 58 118 51 118 C49 110 54 101 62 96Z"/>
  <path d="M62 96 C50 101 40 98 39 91 C47 87 57 89 62 96Z"/>
  <path d="M62 96 C56 90 52 80 56 74 C63 77 66 88 62 96Z" transform="rotate(30 62 96)"/>
  <path d="M62 96 C70 86 78 84 82 88 C80 95 72 100 62 96Z" transform="rotate(-40 62 96)"/>
 </g>
 <circle cx="62" cy="96" r="5" fill="#9aa3ad" stroke="#2c3744"/>
 <rect x="92" y="70" width="18" height="9" rx="2" fill="#7a8a9c"/>
 <rect x="36" y="134" width="12" height="4" rx="1" fill="#9aa3ad"/><rect x="100" y="134" width="12" height="4" rx="1" fill="#9aa3ad"/>
 <!-- liaisons unité extérieure → module intérieur -->
 <g fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M116 80 H128 L134 76 H152" style="stroke:var(--ah-flowc,#e5533d)"/>
  <path d="M116 104 H128 L134 108 H152" style="stroke:var(--ah-retc,#3b8fe8)"/>
 </g>
 <g stroke="#fff" stroke-width="1.8" stroke-linecap="round" fill="none">
  <path class="dash pri" d="M116 80 H128 L134 76 H152"/><path class="dash pri" d="M152 108 H134 L128 104 H116"/>
 </g>
 <!-- module intérieur -->
 <rect x="154" y="52" width="46" height="90" rx="7" fill="#000" opacity=".12" transform="translate(2 3)"/>
 <rect class="body-shade" x="152" y="50" width="46" height="90" rx="7" fill="url(#ah-mod)" stroke="#aeb6c0" stroke-width="1.2"/>
 <rect x="160" y="58" width="30" height="44" rx="4" fill="#0e1b2c" stroke="#27394f"/>
 <text class="dsp" id="dsp" x="175" y="84">--</text>
 <circle class="led" cx="175" cy="93" r="2.6"/>
 <rect x="160" y="108" width="30" height="26" rx="3" fill="#aab2bb"/>
 <!-- collecteurs : départ (rouge) à gauche, retour (bleu) à droite -->
 <g class="zone zoff" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M198 108 H222 V70 H302 V62" style="stroke:var(--ah-retc,#3b8fe8)"/>
  <path d="M222 108 V166 H292 V158" style="stroke:var(--ah-retc,#3b8fe8)"/>
  <path d="M198 76 H210 V40 H238" style="stroke:var(--ah-flowc,#e5533d)"/>
  <path d="M210 76 V134 H238" style="stroke:var(--ah-flowc,#e5533d)"/>
  <path d="M262 40 H284" style="stroke:var(--ah-flowc,#e5533d)"/>
  <path d="M262 134 H286" style="stroke:var(--ah-flowc,#e5533d)"/>
 </g>
 <!-- zone 1 : circulateur + radiateur -->
 <g class="zone">
  <g class="pump p1"><circle cx="250" cy="40" r="12" fill="#cfd6de" stroke="#8f99a4" stroke-width="1.6"/><circle cx="250" cy="40" r="8.6" fill="#2b3440"/><path class="tri" d="M247 35 L255 40 L247 45Z"/></g>
  <g transform="translate(286 20)">
   <rect x="1" y="1" width="40" height="40" rx="4" fill="#000" opacity=".1"/>
   <g class="rad" stroke="#aab3bd" stroke-width="1">
    <rect x="0" y="0" width="40" height="6" rx="2.5"/><rect x="0" y="34" width="40" height="6" rx="2.5"/>
    <rect x="3" y="3" width="5" height="34" rx="2.5"/><rect x="11" y="3" width="5" height="34" rx="2.5"/>
    <rect x="19" y="3" width="5" height="34" rx="2.5"/><rect x="27" y="3" width="5" height="34" rx="2.5"/><rect x="35" y="3" width="3" height="34" rx="1.5"/>
   </g>
  </g>
  <!-- zone 2 : circulateur + plancher chauffant -->
  <g class="pump p2"><circle cx="250" cy="134" r="12" fill="#cfd6de" stroke="#8f99a4" stroke-width="1.6"/><circle cx="250" cy="134" r="8.6" fill="#2b3440"/><path class="tri" d="M247 129 L255 134 L247 139Z"/></g>
  <rect x="284" y="116" width="44" height="42" rx="4" fill="#2a3340" opacity=".12"/>
  <path d="M286 134 H320 V122 H292 V128 H314 V140 H294 V146 H320 V154 H294" fill="none" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--ah-flowc,#e5533d)"/>
 </g>
 <!-- animation de l'eau dans les deux zones -->
 <g class="zone" stroke="#fff" stroke-width="1.8" stroke-linecap="round" fill="none">
  <path class="dash z1" d="M198 76 H210 V40 H238 M262 40 H286"/>
  <path class="dash z1" d="M302 62 V70 H222 V108 H198"/>
  <path class="dash z2" d="M210 76 V134 H238 M262 134 H286 M320 122 H292 M294 154 H292 V166 H222"/>
 </g>
 <text class="zlabel" id="zl1" x="306" y="14">Zone 1</text>
 <text class="zlabel" id="zl2" x="306" y="180">Zone 2</text>
</svg>`;

  const TILES = [
    ['heat', 'mdi:heat-wave', 'show_heat', 'entity_heat_power'],
    ['power', 'mdi:flash', 'show_power', 'entity_power'],
    ['cop', 'mdi:speedometer', 'show_cop', 'entity_cop'],
    ['freq', 'mdi:fan', 'show_compressor', 'entity_frequency'],
    ['demand', 'mdi:gauge', 'show_compressor', 'entity_demand'],
    ['flow', 'mdi:thermometer-chevron-up', 'show_temps', 'entity_flow_temp'],
    ['ret', 'mdi:thermometer-chevron-down', 'show_temps', 'entity_return_temp'],
    ['delta', 'mdi:delta', 'show_temps', 'entity_flow_temp'],
    ['dhw_temp', 'mdi:water-boiler', 'show_temps', 'entity_dhw_temp'],
    ['buffer', 'mdi:storage-tank', 'show_temps', 'entity_buffer_temp'],
    ['outdoor', 'mdi:thermometer', 'show_temps', 'entity_outdoor_temp'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy', 'entity_energy'],
    ['heat_energy', 'mdi:fire-circle', 'show_energy', 'entity_heat_energy'],
    ['backup', 'mdi:heating-coil', 'show_backup', 'entity_backup'],
    ['immersion', 'mdi:water-boiler-alert', 'show_backup', 'entity_immersion'],
    ['boiler', 'mdi:water-boiler', 'show_backup', 'entity_boiler'],
  ];
  const SHOW = ['show_status', 'show_heat', 'show_power', 'show_cop', 'show_compressor', 'show_temps', 'show_energy', 'show_backup', 'animations'];

  class ApplianceAirWaterHeatPumpCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config
    get _config() { return this._c; }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_status: f(/pac|heat_?pump|pompe_a_chaleur|aerothermie/i, 'climate'),
        entity_heat_power: f(/(pac|heat_?pump|pompe_a_chaleur).*(power|puissance|produite)/i, 'sensor'),
        entity_flow_temp: f(/(pac|heat_?pump|pompe_a_chaleur).*(flow|depart|départ)/i, 'sensor'),
      };
    }
    static getConfigForm() {
      const ent = (name, domain, extra = {}) => ({ name, selector: { entity: { domain, ...extra } } });
      const RELAY = ['binary_sensor', 'switch', 'input_boolean', 'sensor'];
      return {
        schema: [
          { name: 'name', selector: { text: {} } },
          { name: 'labels', selector: { object: {} } },
          { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
          { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
          ent('entity_status', ['climate', 'sensor', 'select', 'input_select', 'water_heater']),
          { type: 'grid', name: '', schema: [ent('entity_heat_power', 'sensor'), ent('entity_power', 'sensor'), ent('entity_cop', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_frequency', 'sensor'), ent('entity_demand', 'sensor'), ent('entity_outdoor_temp', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_flow_temp', 'sensor'), ent('entity_return_temp', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_dhw_temp', 'sensor'), ent('entity_buffer_temp', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_energy', 'sensor'), ent('entity_heat_energy', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_pump_1', RELAY), ent('entity_pump_2', RELAY), ent('entity_valve', RELAY)] },
          { type: 'grid', name: '', schema: [ent('entity_backup', RELAY), ent('entity_immersion', RELAY), ent('entity_boiler', RELAY)] },
          { type: 'grid', name: '', schema: [
            { name: 'threshold', selector: { number: { min: 0, max: 5000, step: 5, mode: 'box', unit_of_measurement: 'W' } } },
            { name: 'frequency_threshold', selector: { number: { min: 0, max: 200, step: 1, mode: 'box', unit_of_measurement: 'Hz' } } },
          ] },
          { type: 'grid', name: '', schema: SHOW.map((name) => ({ name, selector: { boolean: {} }, default: true })) },
          window.applianceTempField,
          ...window.applianceActionFields,
          { name: 'language', selector: { select: { options: Object.keys(T) } } },
        ],
        computeLabel: (s) => window.applianceEditorLabel(s.name),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { ...Object.fromEntries(SHOW.map((k) => [k, true])), threshold: 100, frequency_threshold: 0, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { return window.applianceNum(this._st(id)); }
    _watts(id) { return window.applianceWatts(this._st(id)); }
    // relais (binary_sensor, switch…) : on / off ; capteur numérique : marche au-dessus de 0
    _on(id) {
      const s = this._st(id); if (!s) return false;
      const v = this._num(id);
      return isNaN(v) ? /^(on|true|running|marche|en cours|activ|heat|cool)/i.test(String(s.state)) : v > 0;
    }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _kw(w) { return isNaN(w) ? ['--', ''] : w >= 1000 ? [this._fmt(w / 1000, 2), 'kW'] : [this._fmt(w, 0), 'W']; }
    // Compteurs d'énergie toujours en kWh (Wh et MWh convertis), sans décimale au-delà de 1000 kWh
    _kwh(id) {
      const v = this._num(id), u = String(this._unit(id, 'kWh'));
      const k = isNaN(v) ? NaN : /^wh$/i.test(u) ? v / 1000 : /^mwh$/i.test(u) ? v * 1000 : /^gwh$/i.test(u) ? v * 1e6 : v;
      return [this._fmt(k, Math.abs(k) >= 1000 ? 0 : 1), 'kWh'];
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap">
        <div class="head"><div class="title" id="title"></div><div class="badge" id="badge"></div></div>
        ${SVG}
        <div class="tiles" id="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => { const c = this._c; window.applianceMore(this, c.entity_status || c.entity_heat_power || c.entity_flow_temp); });
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // État : entité climate / texte si fournie, sinon fréquence du compresseur, puissance électrique ou circulateurs
    _compute() {
      const c = this._c, pw = this._watts(c.entity_power), heat = this._watts(c.entity_heat_power), freq = this._num(c.entity_frequency);
      const s = this._st(c.entity_status);
      const state = s ? String(s.state).toLowerCase() : '';
      const action = s ? String((s.attributes || {}).hvac_action || '').toLowerCase() : '';
      const txt = `${state} ${action}`, key = action || state;
      // compresseur : fréquence au-dessus du seuil, sinon puissance électrique, sinon puissance thermique
      const run = !isNaN(freq) ? freq > (+c.frequency_threshold || 0)
        : !isNaN(pw) ? pw > c.threshold : !isNaN(heat) ? heat > 0 : false;
      const valve = c.entity_valve ? this._on(c.entity_valve) : false; // vanne 3 voies : activée = eau chaude sanitaire
      const p1 = c.entity_pump_1 ? this._on(c.entity_pump_1) : run && !valve;
      const p2 = c.entity_pump_2 ? this._on(c.entity_pump_2) : run && !valve;
      let st;
      if (/alarm|alarme|error|erreur|fault|défaut|defaut|lock|verrou/.test(txt)) st = 'alarm';
      else if (s && /^(unavailable|unknown|off|arr[eê]t|eteint|éteint)$/.test(state)) st = 'off';
      else if (/idle|standby|veille|attente/.test(action)) st = 'standby';
      else if (/dhw|ecs|hot.?water|eau.?chaude|sanitaire/.test(txt) || (s && String(c.entity_status).startsWith('water_heater.'))) st = 'dhw';
      else if (/cool|rafra|froid/.test(key) && key !== 'heat_cool') st = 'cooling';
      else if (/heat|chauff|compress|running|marche|^on/.test(key)) st = 'heating';
      else if (s) st = 'standby';
      else if (run) st = valve ? 'dhw' : 'heating';
      else if (p1 || p2) st = 'standby';
      else st = 'off';
      // en mode eau chaude, la vanne 3 voies ferme les zones : seul le circuit primaire est animé
      const dhw = st === 'dhw' || valve;
      return { st, run: run && st !== 'off', z1: p1 && !dhw, z2: p2 && !dhw, dhw, pw, heat, freq };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, card = this._card, r = this._root;
      const { st, run, z1, z2, dhw, pw, heat, freq } = this._compute();
      // températures dans l'unité d'affichage (°C / °F)
      const tu = window.applianceTemp(this._hass, c), tv = (id) => tu.conv(this._num(id), this._st(id));
      const flow = tv(c.entity_flow_temp), ret = tv(c.entity_return_temp);
      card.className = `${st} ${run ? 'run' : ''} ${z1 ? 'z1' : ''} ${z2 ? 'z2' : ''} ${dhw ? 'dhwmode' : ''} ${c.animations === false ? 'noanim' : ''}`;
      // départ chaud (rouge-orangé) et retour froid (bleu), comme sur le schéma d'une PAC
      card.style.setProperty('--ah-flowc', '#ee5a3a');
      card.style.setProperty('--ah-retc', '#3b8fe8');
      // le ventilateur accélère avec la demande / fréquence du compresseur
      const dem = this._num(c.entity_demand);
      card.style.setProperty('--ah-spin', `${(1.1 - 0.7 * Math.max(0, Math.min(1, (isNaN(dem) ? 100 : dem) / 100))).toFixed(2)}s`);

      r.getElementById('title').textContent = c.name || this._t('name');
      const badge = r.getElementById('badge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('dsp').textContent = st === 'off' ? 'OFF' : st === 'alarm' ? 'Err' : isNaN(flow) ? '--' : `${Math.round(flow)}°`;
      r.getElementById('zl1').textContent = this._l('zone1');
      r.getElementById('zl2').textContent = this._l('zone2');

      // COP : capteur si fourni, sinon puissance thermique / puissance électrique quand le compresseur tourne
      let cop = this._num(c.entity_cop);
      if (!c.entity_cop && run && heat > 0 && pw > 0) cop = heat / pw;
      const hasCop = c.entity_cop || (c.entity_heat_power && c.entity_power);
      const onoff = (id) => [id, this._t(this._on(id) ? 'on' : 'off'), ''];
      const V = {
        heat: [c.entity_heat_power, ...this._kw(heat)],
        power: [c.entity_power, ...this._kw(pw)],
        cop: [hasCop, this._fmt(cop, 1), ''],
        freq: [c.entity_frequency, this._fmt(freq, 0), this._unit(c.entity_frequency, 'Hz')],
        demand: [c.entity_demand, this._fmt(dem, 0), this._unit(c.entity_demand, '%')],
        flow: [c.entity_flow_temp, this._fmt(flow, 1), tu.unit],
        ret: [c.entity_return_temp, this._fmt(ret, 1), tu.unit],
        delta: [c.entity_flow_temp && c.entity_return_temp, this._fmt(flow - ret, 1), tu.unit === '°F' ? '°F' : 'K'],
        dhw_temp: [c.entity_dhw_temp, this._fmt(tv(c.entity_dhw_temp), 1), tu.unit],
        buffer: [c.entity_buffer_temp, this._fmt(tv(c.entity_buffer_temp), 1), tu.unit],
        outdoor: [c.entity_outdoor_temp, this._fmt(tv(c.entity_outdoor_temp), 1), tu.unit],
        energy: [c.entity_energy, ...this._kwh(c.entity_energy)],
        heat_energy: [c.entity_heat_energy, ...this._kwh(c.entity_heat_energy)],
        backup: onoff(c.entity_backup),
        immersion: onoff(c.entity_immersion),
        boiler: onoff(c.entity_boiler),
      };
      TILES.forEach(([k, , opt, more]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [shown, val, unit] = V[k];
        el.classList.toggle('hide', !shown || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        // valeur + unité en texte (l'unité vient de l'entité ou de la config)
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        const id = k === 'cop' && !c.entity_cop ? c.entity_heat_power : c[more];
        el.onclick = () => { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); };
      });
    }
  }
  customElements.define(TAG, ApplianceAirWaterHeatPumpCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Air-to-water heat pump / PAC air/eau', names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Animated air-to-water heat pump with two zones: outdoor fan, compressor, circulators, radiators and underfloor heating.', preview: true,
  });
})();
