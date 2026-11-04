/* style de télé : murale (défaut, rien autour), sur pied central, sur deux pieds */
const tvStyle = (c) => ({ wall: "wall", mural: "wall", stand: "stand", pied: "stand", base: "stand", feet: "feet", pieds: "feet", legs: "feet" }[String(c?.style || "wall").toLowerCase()] || "wall");
const TV_STAND = {
  wall: "",
  // pied central trapézoïdal
  stand: `
<ellipse cx="60" cy="113.5" rx="30" ry="2.6" fill="url(#ID-shadow)"/>
<rect x="53" y="102" width="14" height="7" fill="#15181d"/>
<path d="M40 113l5-5h30l5 5z" fill="#0b0d10" stroke="#2c3138" stroke-width=".5"/>
<path d="M45 108h30" stroke="#fff" stroke-opacity=".18" stroke-width=".6"/>`,
  // deux pieds inclinés aux extrémités
  feet: `
<ellipse cx="60" cy="108.5" rx="46" ry="2.4" fill="url(#ID-shadow)"/>
<path d="M13 102l-5 5.6q-.8 1 .5 1h10.5q1.5 0 2-1l3.5-5.6z" fill="#0b0d10" stroke="#2c3138" stroke-width=".5"/>
<path d="M107 102l5 5.6q.8 1-.5 1h-10.5q-1.5 0-2-1l-3.5-5.6z" fill="#0b0d10" stroke="#2c3138" stroke-width=".5"/>`,
};

SVG.tv = (c) => `
<defs>${DEFS}<clipPath id="ID-scr"><rect x="4" y="38" width="112" height="63" rx="1"/></clipPath>
<linearGradient id="ID-off" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2027"/><stop offset=".6" stop-color="#0a0c0f"/><stop offset="1" stop-color="#14181d"/></linearGradient>
<linearGradient id="ID-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f5a73"/><stop offset=".55" stop-color="#3b2a7a"/><stop offset="1" stop-color="#0f1420"/></linearGradient>
<linearGradient id="ID-fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0f1420" stop-opacity=".95"/><stop offset=".6" stop-color="#0f1420" stop-opacity="0"/></linearGradient>
<linearGradient id="ID-tvgloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="ID-logo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38e1ff"/><stop offset="1" stop-color="#8a5cff"/></linearGradient></defs>
${TV_STAND[tvStyle(c)]}
<rect x="2.5" y="36.5" width="115" height="66" rx="2" fill="#0b0d10" stroke="#2c3138" stroke-width=".7"/>
<rect x="4" y="38" width="112" height="63" rx="1" fill="url(#ID-off)"/>
<g clip-path="url(#ID-scr)">
  <g class="tv-content">
    <rect x="4" y="38" width="112" height="63" fill="#0f1420"/>
    <rect x="4" y="38" width="112" height="33" fill="url(#ID-hero)"/>
    <circle cx="92" cy="50" r="9" fill="#ffb35c" opacity=".85"/>
    <path d="M60 71l14-12l9 6l12-10l21 16z" fill="#1d1640" opacity=".9"/>
    <rect x="4" y="38" width="112" height="33" fill="url(#ID-fade)"/>
    <rect x="9" y="51" width="30" height="3.2" rx="1" fill="#fff"/>
    <rect x="9" y="56" width="22" height="1.6" rx=".8" fill="#9aa3b8"/>
    <rect x="9" y="61" width="11" height="4" rx="1" fill="#fff"/><path d="M12 61.9l2.4 1.1l-2.4 1.1z" fill="#0f1420"/>
    <rect x="22" y="61" width="11" height="4" rx="1" fill="#59616b"/>
    <rect x="9" y="74" width="16" height="1.6" rx=".8" fill="#c9d0db"/>
    <g class="tv-row">
      <rect x="9" y="77.5" width="17" height="11" rx="1.2" fill="#e85d75"/><rect x="28" y="77.5" width="17" height="11" rx="1.2" fill="#3fb6a8"/>
      <rect x="47" y="77.5" width="17" height="11" rx="1.2" fill="#f2b84b"/><rect x="66" y="77.5" width="17" height="11" rx="1.2" fill="#5b7cfa"/>
      <rect x="85" y="77.5" width="17" height="11" rx="1.2" fill="#a55cd6"/><rect x="104" y="77.5" width="17" height="11" rx="1.2" fill="#4fb36b"/>
      <rect x="123" y="77.5" width="17" height="11" rx="1.2" fill="#e8834a"/><rect x="142" y="77.5" width="17" height="11" rx="1.2" fill="#3a8fd6"/>
      <path d="M12 86h8M31 86h10M50 86h7M69 86h9M88 86h10M107 86h8M126 86h9M145 86h8" stroke="#fff" stroke-opacity=".75" stroke-width="1" stroke-linecap="round"/>
    </g>
    <rect class="tv-sel" x="8.4" y="76.9" width="18.2" height="12.2" rx="1.6" fill="none" stroke="#fff" stroke-width=".9"/>
    <rect x="9" y="91.5" width="12" height="1.6" rx=".8" fill="#c9d0db"/>
    <g class="tv-row2">
      <rect x="9" y="95" width="24" height="9" rx="1.2" fill="#2f6f8f"/><rect x="35" y="95" width="24" height="9" rx="1.2" fill="#8f3f5f"/>
      <rect x="61" y="95" width="24" height="9" rx="1.2" fill="#6f6f2f"/><rect x="87" y="95" width="24" height="9" rx="1.2" fill="#3f4f8f"/>
      <rect x="113" y="95" width="24" height="9" rx="1.2" fill="#2f8f5f"/>
    </g>
  </g>
  <g class="tv-intro">
    <rect x="4" y="38" width="112" height="63" fill="#05070c"/>
    <g class="tv-streaks" stroke-linecap="round" fill="none">
      <path d="M4 44L60 69.5" stroke="#38e1ff"/><path d="M116 44L60 69.5" stroke="#8a5cff"/>
      <path d="M4 95L60 69.5" stroke="#8a5cff"/><path d="M116 95L60 69.5" stroke="#38e1ff"/>
      <path d="M60 38v31.5" stroke="#5fd0ff"/><path d="M60 101v-31.5" stroke="#a07cff"/>
    </g>
    <g class="tv-logo">
      <circle cx="60" cy="69.5" r="11" fill="none" stroke="url(#ID-logo)" stroke-width="2.2"/>
      <path d="M56.5 63.5q0-1.6 1.4-.8l8.6 5.4q1.3.8 0 1.6l-8.6 5.4q-1.4.8-1.4-.8z" fill="url(#ID-logo)"/>
    </g>
  </g>
  <rect class="tv-flash" x="4" y="38" width="112" height="63" fill="#eef6ff"/>
</g>
<path d="M4 38L46 38L4 78z" fill="#fff" opacity=".06"/>
<path class="tv-gloss" d="M4 38L78 38L30 101H4z" fill="url(#ID-tvgloss)"/>
<rect x="4" y="38" width="112" height="63" rx="1" fill="none" stroke="#000" stroke-opacity=".5"/>
<circle class="tv-led" cx="60" cy="101.8" r=".7"/>`;
