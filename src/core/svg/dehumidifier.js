/* déshumidificateur mobile à bac : grille de sortie en haut, ventilateur derrière la grille avant, bac à eau transparent en bas */
SVG.dehumidifier = () => `
<defs>${DEFS}
<linearGradient id="ID-dhbody" x1="0" x2="1"><stop offset="0" stop-color="#dfe4e9"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#c8cfd6"/></linearGradient>
<linearGradient id="ID-dhtankb" x1="0" x2="1"><stop offset="0" stop-color="#cfd6dd"/><stop offset=".5" stop-color="#eef2f5"/><stop offset="1" stop-color="#bcc4cc"/></linearGradient>
<linearGradient id="ID-dhwater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3ff"/><stop offset="1" stop-color="#2d7fd0"/></linearGradient>
<clipPath id="ID-dhtank"><rect x="38" y="96" width="44" height="20" rx="1.6"/></clipPath>
<clipPath id="ID-dhgrill"><circle cx="60" cy="64" r="18"/></clipPath></defs>
<ellipse cx="60" cy="133" rx="40" ry="3.5" fill="url(#ID-shadow)"/>
<g class="dh-out" fill="none" stroke-linecap="round"><path d="M42 14q-3-5 0-10"/><path d="M52 14q3-5 0-10"/><path d="M68 14q-3-5 0-10"/><path d="M78 14q3-5 0-10"/></g>
<g class="dh-in" fill="none" stroke-linecap="round"><path d="M6 52q8 4 16 2"/><path d="M4 66q9 0 18 -1"/><path d="M6 80q8 -4 16 -3"/><path d="M114 52q-8 4 -16 2"/><path d="M116 66q-9 0 -18 -1"/><path d="M114 80q-8 -4 -16 -3"/></g>
<rect x="28" y="16" width="64" height="110" rx="9" fill="url(#ID-dhbody)" stroke="#97a0a9" stroke-width=".6"/>
<rect x="34" y="18" width="52" height="8" rx="2" fill="#2a3036"/>
<path d="M37 20.5h46M37 23.5h46" stroke="#5a636d" stroke-width=".9" stroke-linecap="round"/>
<rect x="34" y="29" width="52" height="13" rx="2.2" fill="#1a1f25"/>
<rect x="56" y="31.5" width="26" height="8" rx="1.4" fill="#0c1720" stroke="#59616b" stroke-width=".4"/>
<text class="lcd" x="69" y="35.7" text-anchor="middle">OFF</text>
<circle class="dh-led" cx="39" cy="35.5" r="1.5"/>
<path class="dh-full" d="M47 32.4q-2.4 3 -2.4 4.4a2.4 2.4 0 0 0 4.8 0q0-1.4 -2.4-4.4z"/>
<circle cx="60" cy="64" r="21" fill="#e6eaee" stroke="#a6aeb6" stroke-width=".6"/>
<circle cx="60" cy="64" r="18" fill="#1d2329"/>
<g clip-path="url(#ID-dhgrill)">
  <g class="dh-fan"><circle cx="60" cy="64" r="15" fill="#2b3239"/>
    <path d="M60 64q-3-8 0-13q5 2 3 10zM60 64q8-3 13 0q-2 5-10 3zM60 64q3 8 0 13q-5-2-3-10zM60 64q-8 3-13 0q2-5 10-3z" fill="#7d8791"/>
    <circle cx="60" cy="64" r="2.6" fill="#c6ccd2"/></g>
  <rect x="42" y="46" width="36" height="36" fill="url(#ID-mesh)"/>
  <g class="dh-mist"><circle cx="50" cy="56" r="1.2"/><circle cx="68" cy="60" r="1"/><circle cx="56" cy="72" r="1.1"/><circle cx="66" cy="70" r="1.2"/><circle cx="53" cy="64" r=".9"/></g>
</g>
<path d="M44 52a19 19 0 0 1 14 -7" stroke="#fff" stroke-opacity=".55" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<rect x="34" y="90" width="52" height="30" rx="3" fill="url(#ID-dhtankb)" stroke="#97a0a9" stroke-width=".6"/>
<path d="M50 92.6h20" stroke="#8e979f" stroke-width="1.6" stroke-linecap="round"/>
<rect x="38" y="96" width="44" height="20" rx="1.6" fill="#0f2a3d" opacity=".55"/>
<g clip-path="url(#ID-dhtank)">
  <g class="dh-water"><rect x="34" y="96" width="52" height="24" fill="url(#ID-dhwater)" opacity=".85"/>
    <path class="dh-wave" d="M30 96.6q3 -1.4 6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0v3h-60z" fill="#c6ebff" opacity=".7"/></g>
  <g class="dh-drops"><path d="M50 96q-.9 1.2 -.9 1.8a.9 .9 0 0 0 1.8 0q0-.6 -.9-1.8z"/><path d="M60 96q-.9 1.2 -.9 1.8a.9 .9 0 0 0 1.8 0q0-.6 -.9-1.8z"/><path d="M70 96q-.9 1.2 -.9 1.8a.9 .9 0 0 0 1.8 0q0-.6 -.9-1.8z"/></g>
</g>
<path d="M39 97h8l-6 18h-2z" fill="#fff" opacity=".16"/>
<path d="M78 98.5v15" stroke="#fff" stroke-opacity=".5" stroke-width=".6" stroke-dasharray="1 2.4"/>
<rect x="34" y="124" width="10" height="5" rx="2.4" fill="#3a3f45"/><rect x="76" y="124" width="10" height="5" rx="2.4" fill="#3a3f45"/>`;
