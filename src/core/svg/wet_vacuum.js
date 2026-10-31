/* aspirateur laveur (balai laveur sans fil) : manche, écran rond, réservoir d'eau propre à l'arrière, bac d'eau sale transparent,
   tête avec rouleau ; posé sur sa base (auto-nettoyage, séchage, charge) ou en train de laver le sol */
SVG.wet_vacuum = () => `
<defs>${DEFS}
<linearGradient id="ID-wvbody" x1="0" x2="1"><stop offset="0" stop-color="#d9dee3"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#bfc6cd"/></linearGradient>
<linearGradient id="ID-wvhead" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a525b"/><stop offset="1" stop-color="#1f252b"/></linearGradient>
<linearGradient id="ID-wvclean" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd8ff"/><stop offset="1" stop-color="#2b8fe0"/></linearGradient>
<linearGradient id="ID-wvdirty" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a99a7c"/><stop offset="1" stop-color="#6d6250"/></linearGradient>
<linearGradient id="ID-wvdock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f4f6"/><stop offset="1" stop-color="#c3c9cf"/></linearGradient>
<clipPath id="ID-wvcl"><rect x="65" y="46" width="11" height="30" rx="2.5"/></clipPath>
<clipPath id="ID-wvdt"><rect x="50.5" y="84" width="19" height="20" rx="3"/></clipPath>
<clipPath id="ID-wvroll"><rect x="33" y="119" width="54" height="8" rx="4"/></clipPath></defs>
<ellipse cx="60" cy="133.5" rx="44" ry="3.5" fill="url(#ID-shadow)"/>
<path class="wv-wet" d="M14 130.5h92" stroke="#7cc7ff" stroke-width="2.4" stroke-linecap="round"/>
<g class="wv-dock">
  <rect x="74" y="86" width="13" height="40" rx="3" fill="url(#ID-wvdock)" stroke="#9aa3ac" stroke-width=".5"/>
  <circle cx="80.5" cy="92" r="1.6" fill="#3a424b"/>
  <path class="wv-bolt" d="M81.5 97l-3 5h2.4l-1.4 4.6l3.6-5.6h-2.4z"/>
  <path d="M22 122h76l-3 9h-70z" fill="url(#ID-wvdock)" stroke="#9aa3ac" stroke-width=".5"/>
  <rect x="28" y="123" width="64" height="3.6" rx="1.4" fill="#25303a"/>
  <rect class="wv-tray" x="29" y="123.8" width="62" height="2.2" rx="1" fill="#5fb6f0"/>
  <g class="wv-bub" fill="none" stroke="#bfe6ff" stroke-width=".6"><circle cx="38" cy="122" r="1.2"/><circle cx="50" cy="122" r=".9"/><circle cx="62" cy="122" r="1.3"/><circle cx="73" cy="122" r="1"/><circle cx="84" cy="122" r="1.1"/></g>
</g>
<g class="wv-air" fill="none" stroke="#ffb35c" stroke-width="1.3" stroke-linecap="round">
  <path d="M30 116q-3-5 0-10t0-10"/><path d="M90 116q3-5 0-10t0-10"/><path d="M24 118q-3-5 0-10t0-10"/><path d="M96 118q3-5 0-10t0-10"/></g>
<g class="wv-unit">
  <!-- manche et poignée -->
  <path d="M53 4h14a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-3.5v26h-7v-26h-3.5a3 3 0 0 1 -3-3v-6a3 3 0 0 1 3-3z" fill="#2f363d"/>
  <rect x="55" y="7" width="10" height="6" rx="2" fill="#0f1317"/>
  <circle class="wv-btn" cx="60" cy="19" r="1.3"/>
  <path d="M58 20v20" stroke="#5a636d" stroke-width=".7" stroke-linecap="round"/>
  <!-- réservoir d'eau propre (arrière) -->
  <rect class="wv-cl-frame" x="64" y="45" width="13" height="32" rx="3" fill="#dceefa" fill-opacity=".55" stroke="#8fb8d8" stroke-width=".6"/>
  <g clip-path="url(#ID-wvcl)"><rect class="wv-clean" x="64" y="46" width="13" height="30" fill="url(#ID-wvclean)"/></g>
  <path d="M74 49v24" stroke="#fff" stroke-opacity=".6" stroke-width=".8" stroke-linecap="round"/>
  <!-- corps -->
  <path d="M51 40h18a3 3 0 0 1 3 3v39h-24v-39a3 3 0 0 1 3-3z" fill="url(#ID-wvbody)" stroke="#949da6" stroke-width=".6"/>
  <circle cx="60" cy="52" r="8.6" fill="#11171d" stroke="#6b737c" stroke-width=".6"/>
  <circle cx="60" cy="52" r="6.4" fill="none" stroke="#26303a" stroke-width="1.6"/>
  <circle class="wv-ring" cx="60" cy="52" r="6.4" fill="none" stroke-width="1.6" stroke-linecap="round" pathLength="100" transform="rotate(-90 60 52)"/>
  <text class="lcd" x="60" y="52.4" text-anchor="middle">--</text>
  <path d="M53 66h14M53 70h14" stroke="#b4bcc4" stroke-width=".7" stroke-linecap="round"/>
  <!-- bac d'eau sale transparent -->
  <rect x="49" y="82" width="22" height="24" rx="4" fill="#e6edf2" fill-opacity=".5" stroke="#8f99a3" stroke-width=".6"/>
  <g clip-path="url(#ID-wvdt)"><g class="wv-dirty-g"><rect class="wv-dirty" x="49" y="84" width="22" height="20" fill="url(#ID-wvdirty)"/>
    <path class="wv-swirl" d="M44 92q3-1.6 6 0t6 0t6 0t6 0t6 0t6 0" fill="none" stroke="#cbbf9f" stroke-width=".9" opacity=".8"/></g></g>
  <path d="M52 85v18" stroke="#fff" stroke-opacity=".55" stroke-width=".8" stroke-linecap="round"/>
  <!-- articulation et tête -->
  <circle cx="60" cy="108.5" r="4.6" fill="#2f363d"/>
  <path d="M30 116a6 6 0 0 1 6-6h48a6 6 0 0 1 6 6v3h-60z" fill="url(#ID-wvhead)"/>
  <path class="wv-led" d="M36 113.6h48" stroke-width="1.1" stroke-linecap="round"/>
  <rect x="33" y="119" width="54" height="8" rx="4" fill="#e3e8ec" stroke="#8f99a3" stroke-width=".5"/>
  <g clip-path="url(#ID-wvroll)"><g class="wv-roll" stroke="#9fb0bf" stroke-width="1.1">
    <path d="M26 128l6-10M31 128l6-10M36 128l6-10M41 128l6-10M46 128l6-10M51 128l6-10M56 128l6-10M61 128l6-10M66 128l6-10M71 128l6-10M76 128l6-10M81 128l6-10M86 128l6-10M91 128l6-10"/></g></g>
  <g class="wv-drops" fill="#6ec3ff"><path d="M40 128q-.8 1.1-.8 1.6a.8 .8 0 0 0 1.6 0q0-.5-.8-1.6z"/><path d="M56 128q-.8 1.1-.8 1.6a.8 .8 0 0 0 1.6 0q0-.5-.8-1.6z"/><path d="M72 128q-.8 1.1-.8 1.6a.8 .8 0 0 0 1.6 0q0-.5-.8-1.6z"/></g>
</g>`;
