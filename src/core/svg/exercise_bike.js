/* Vélo d'appartement (vue de côté) : volant d'inertie à l'avant, pédalier avec pédales qui restent à plat, selle et guidon */
SVG.exercise_bike = () => `
<defs>${DEFS}
<linearGradient id="ID-bkbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a525b"/><stop offset="1" stop-color="#1d2228"/></linearGradient></defs>
<ellipse cx="60" cy="130" rx="52" ry="4" fill="url(#ID-shadow)"/>
<rect x="6" y="123" width="34" height="5" rx="2.5" fill="#1d2228"/><rect x="76" y="123" width="38" height="5" rx="2.5" fill="#1d2228"/>
<path d="M24 124L40 100M96 124L66 104" stroke="#2b3138" stroke-width="5" stroke-linecap="round"/>
<path d="M40 98L54 106" stroke="#2b3138" stroke-width="5" stroke-linecap="round"/>
<path d="M54 106L90 54" stroke="url(#ID-bkbody)" stroke-width="6" stroke-linecap="round"/>
<rect x="70" y="46" width="30" height="8" rx="4" fill="#2b3138" stroke="#12161a" stroke-width=".8"/><path d="M74 49h22" stroke="#e5484d" stroke-width="1.4" stroke-linecap="round"/>
<path d="M88 52L86 60" stroke="#9aa3ad" stroke-width="3" stroke-linecap="round"/>
<path d="M40 98L26 44" stroke="url(#ID-bkbody)" stroke-width="6.5" stroke-linecap="round"/>
<path d="M14 38q12-8 24 0" fill="none" stroke="#2b3138" stroke-width="4.2" stroke-linecap="round"/>
<path d="M16 38q-5 3-4 8M36 38q5 2 4 8" fill="none" stroke="#e5484d" stroke-width="3" stroke-linecap="round"/>
<rect x="14" y="14" width="34" height="20" rx="5" fill="url(#ID-bkbody)" stroke="#12161a" stroke-width=".8"/>
${lcd(18, 17, 26, 11)}
<circle class="bk-led" cx="24" cy="31" r="1.3"/><circle class="bk-led" cx="30" cy="31" r="1.3"/><circle class="bk-led" cx="36" cy="31" r="1.3"/>
<circle cx="38" cy="98" r="19" fill="url(#ID-bkbody)" stroke="#12161a" stroke-width="1"/>
<g class="bk-fly">
  <circle cx="38" cy="98" r="13" fill="#2b3138" stroke="#7d858e" stroke-width=".8"/>
  <path d="M38 87v22M27 98h22M30 90l16 16M46 90l-16 16" stroke="#7d858e" stroke-width="1.1"/>
  <circle cx="38" cy="87.8" r="2.2" fill="#e5484d"/>
</g>
<circle cx="38" cy="98" r="3" fill="url(#ID-chrome)"/>
<path d="M38 98L58 110" stroke="#3a424b" stroke-width="1.2" opacity=".8"/>
<circle cx="58" cy="110" r="6.5" fill="url(#ID-chrome)" stroke="#7d858e" stroke-width=".6"/>
<g class="bk-crank">
  <path d="M58 110V128" stroke="#8d959f" stroke-width="3" stroke-linecap="round"/>
  <path d="M58 110V92" stroke="#c4ccd5" stroke-width="3" stroke-linecap="round"/>
  <g class="bk-ped" style="transform-origin:58px 128px"><rect x="50" y="127" width="16" height="4.4" rx="2" fill="#2b3138"/></g>
  <g class="bk-ped" style="transform-origin:58px 92px"><rect x="50" y="90" width="16" height="4.4" rx="2" fill="#59616b"/></g>
</g>
<circle cx="58" cy="110" r="2.2" fill="#e5484d"/>`;
