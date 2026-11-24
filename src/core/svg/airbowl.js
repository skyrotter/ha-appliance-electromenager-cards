/* assainisseur d'air Airbowl (proWIN) : dôme métal + cuve d'eau ; on/off seul. Les parties actives (vagues, bulles, LEDs) sont pilotées par la classe .st-running en CSS */
SVG.airbowl = () => `
  <defs>${DEFS}
    <!-- Dégradés métalliques et verre -->
    <linearGradient id="ID-dome-metal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c2c8ce"/>
      <stop offset="15%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#7c838a"/>
      <stop offset="50%" stop-color="#3e4247"/>
      <stop offset="65%" stop-color="#7c838a"/>
      <stop offset="85%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#b5bcc2"/>
    </linearGradient>

    <radialGradient id="ID-dome-shade" cx="50%" cy="35%" r="68%">
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#1a1d20" stop-opacity="0.45"/>
    </radialGradient>

    <linearGradient id="ID-glass-bowl" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d8e2eb" stop-opacity="0.65"/>
      <stop offset="15%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#eef4f8" stop-opacity="0.15"/>
      <stop offset="85%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#c5d1dc" stop-opacity="0.65"/>
    </linearGradient>

    <linearGradient id="ID-water" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#a8d5e5" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#6eb2cb" stop-opacity="0.75"/>
    </linearGradient>

    <!-- ClipPath épousant exactement l'intérieur de la cuve sphérique -->
    <clipPath id="ID-bowl-clip">
      <path d="M 19 59 C 19 82, 34 102, 52 103.5 L 68 103.5 C 86 102, 101 82, 101 59 Z"/>
    </clipPath>

    <filter id="ID-led-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Ombre au sol -->
  <ellipse cx="60" cy="106.5" rx="30" ry="3.2" fill="url(#ID-shadow)"/>

  <!-- 1. CUVE TRANSPARENTE SPHÉRIQUE & MÉCANISME INTERNE -->
  <g class="ab-bowl">
    <!-- Contour global de la cuve très galbée -->
    <path d="M 19 59 C 19 82, 34 102, 52 103.5 L 68 103.5 C 86 102, 101 82, 101 59 Z" 
          fill="url(#ID-glass-bowl)" stroke="#b0bec5" stroke-width="0.65"/>

    <!-- Contenu interne découpé aux dimensions de la cuve -->
    <g clip-path="url(#ID-bowl-clip)">
      <!-- Volume d'eau principal -->
      <path d="M 20 83 L 100 83 L 100 105 L 20 105 Z" fill="url(#ID-water)"/>

      <g class="ab-on">
        <!-- Vague 1 (remous arrière) -->
        <path d="M 20 83 Q 40 80.5, 60 83 T 100 83 L 100 105 L 20 105 Z" fill="#81d4fa" fill-opacity="0.35">
          <animate attributeName="d" dur="2.2s" repeatCount="indefinite"
            values="
              M 20 83 Q 40 80.5, 60 83 T 100 83 L 100 105 L 20 105 Z;
              M 20 83 Q 40 85.5, 60 83 T 100 83 L 100 105 L 20 105 Z;
              M 20 83 Q 40 80.5, 60 83 T 100 83 L 100 105 L 20 105 Z
            "/>
        </path>

        <!-- Vague 2 (remous avant déphasé) -->
        <path d="M 20 83.5 Q 40 85.5, 60 83.5 T 100 83.5 L 100 105 L 20 105 Z" fill="#e1f5fe" fill-opacity="0.45">
          <animate attributeName="d" dur="1.7s" repeatCount="indefinite"
            values="
              M 20 83.5 Q 40 85.5, 60 83.5 T 100 83.5 L 100 105 L 20 105 Z;
              M 20 83.5 Q 40 81.2, 60 83.5 T 100 83.5 L 100 105 L 20 105 Z;
              M 20 83.5 Q 40 85.5, 60 83.5 T 100 83.5 L 100 105 L 20 105 Z
            "/>
        </path>

        <!-- Tourbillon horizontal autour de la tige -->
        <ellipse cx="60" cy="91" rx="18" ry="1.6" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.45">
          <animate attributeName="rx" values="14;22;14" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0.55;0.2" dur="2s" repeatCount="indefinite"/>
        </ellipse>
</g>
      <g class="ab-off">
        <!-- Surface calme (ménisque fixe lorsque éteint) -->
        <ellipse cx="60" cy="83" rx="33.5" ry="2.2" fill="#e1f5fe" fill-opacity="0.6" stroke="#90caf9" stroke-width="0.4"/>
      </g>

      <!-- Cône diffuseur interne blanc translucide -->
      <path d="M 38 59 L 82 59 L 92 70 C 74 72.5, 46 72.5, 28 70 Z" fill="#ffffff" fill-opacity="0.75" stroke="#cfd8dc" stroke-width="0.4"/>
      <ellipse cx="60" cy="70" rx="32" ry="2" fill="#eceff1" fill-opacity="0.8"/>

      <!-- Tige centrale verticale -->
      <path d="M 56.5 64 L 63.5 64 L 62 99 L 58 99 Z" fill="#ffffff" fill-opacity="0.85" stroke="#cfd8dc" stroke-width="0.4"/>
      <rect x="52" y="65" width="16" height="1.5" rx="0.7" fill="#ffffff" fill-opacity="0.9"/>
      <rect x="57" y="93" width="6" height="6.5" rx="1.2" fill="#e0e6ed" fill-opacity="0.9"/>

      <g class="ab-on">
        <!-- Micro-bulles ascendantes -->
        <g fill="#ffffff">
          <circle cx="51" cy="96" r="0.8">
            <animate attributeName="cy" values="98;83" dur="1.6s" repeatCount="indefinite"/>
            <animate attributeName="cx" values="51;49;52" dur="1.6s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.8;0" dur="1.6s" repeatCount="indefinite"/>
          </circle>
          <circle cx="68" cy="95" r="0.7">
            <animate attributeName="cy" values="97;83" dur="1.9s" begin="0.5s" repeatCount="indefinite"/>
            <animate attributeName="cx" values="68;70;67" dur="1.9s" begin="0.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.75;0" dur="1.9s" begin="0.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="55" cy="94" r="0.6">
            <animate attributeName="cy" values="96;83" dur="1.4s" begin="0.9s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.85;0" dur="1.4s" begin="0.9s" repeatCount="indefinite"/>
          </circle>
          <circle cx="64" cy="96" r="0.85">
            <animate attributeName="cy" values="98;83" dur="2.1s" begin="1.2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.7;0" dur="2.1s" begin="1.2s" repeatCount="indefinite"/>
          </circle>
        </g>
      </g>
    </g>

    <!-- Reflets verre avant courbés -->
    <path d="M 24 64 C 24 77, 33 92, 46 100" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.65"/>
    <path d="M 96 64 C 96 77, 87 92, 74 100" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
    <!-- Base épaisse du verre -->
    <path d="M 48 103.5 C 54 104.8, 66 104.8, 72 103.5" fill="none" stroke="#90a4ae" stroke-width="1.4" stroke-linecap="round"/>
  </g>

  <!-- 2. DÔME SUPÉRIEUR MÉTALLISÉ SPHÉRIQUE -->
  <g class="ab-dome">
    <!-- Forme principale du dôme très bombé -->
    <path d="M 19 53 C 20 27, 37 17, 60 17 C 83 17, 100 27, 101 53 Z" fill="url(#ID-dome-metal)"/>
    <path d="M 19 53 C 20 27, 37 17, 60 17 C 83 17, 100 27, 101 53 Z" fill="url(#ID-dome-shade)"/>

    <!-- Grilles d'aération au sommet -->
    <g fill="#26292e" opacity="0.85">
      <ellipse cx="60" cy="18.6" rx="2.3" ry="0.6"/>
      <ellipse cx="52.5" cy="19.2" rx="2.1" ry="0.6" transform="rotate(-8 52.5 19.2)"/>
      <ellipse cx="67.5" cy="19.2" rx="2.1" ry="0.6" transform="rotate(8 67.5 19.2)"/>
      <ellipse cx="46" cy="20.4" rx="1.9" ry="0.5" transform="rotate(-15 46 20.4)"/>
      <ellipse cx="74" cy="20.4" rx="1.9" ry="0.5" transform="rotate(15 74 20.4)"/>
    </g>

    <!-- Bandeau central noir ("AIRBOWL") -->
    <path d="M 19 53 L 101 53 L 101.2 59 L 18.8 59 Z" fill="#121417"/>
    <!-- Reflets brillants sur le bandeau noir -->
    <rect x="22" y="53" width="2.8" height="6" fill="#ffffff" opacity="0.55"/>
    <rect x="95.2" y="53" width="2.8" height="6" fill="#ffffff" opacity="0.55"/>
    <!-- Texte AIRBOWL -->
    <text x="60" y="57.3" font-family="sans-serif" font-size="4.4" font-weight="600" letter-spacing="0.9" fill="#e2e8f0" text-anchor="middle">AIRBOWL</text>
  </g>

  <!-- 3. ÉCRAN DE CONTRÔLE OVALE NOIR -->
  <g class="ab-display">
    <rect x="50" y="22.5" width="20" height="26" rx="10" fill="#0d0f12" stroke="#4a5058" stroke-width="0.6"/>
    <!-- Reflet vitre écran -->
    <path d="M 52 30.5 C 52 25.5, 56 23.5, 60 23.5 C 63 23.5, 65 24.5, 66.5 26.5 C 61 26.5, 55 28.5, 52 33.5 Z" fill="#ffffff" opacity="0.12"/>

    <!-- Logo proWIN discret en haut de l'écran -->
    <text x="60" y="27.3" font-family="sans-serif" font-size="2.3" font-weight="bold" fill="#cbd5e1" text-anchor="middle" opacity="0.85">proWIN</text>

    <!-- Symbole Power central -->
    <g class="ab-pw" stroke-width="0.8" fill="none" stroke-linecap="round">
      <path d="M 58.6 35.3 A 2.2 2.2 0 1 0 61.4 35.3"/>
      <line x1="60" y1="34" x2="60" y2="36.3"/>
    </g>

    <!-- Motif étoile de LEDs vertes -->
    <g class="ab-led ab-ledoff" fill="#263238">
      <!-- Anneau intérieur (8 points) -->
      <circle cx="60" cy="31.7" r="0.65"/>
      <circle cx="63.4" cy="33.1" r="0.65"/>
      <circle cx="64.8" cy="36.5" r="0.65"/>
      <circle cx="63.4" cy="39.9" r="0.65"/>
      <circle cx="60" cy="41.3" r="0.65"/>
      <circle cx="56.6" cy="39.9" r="0.65"/>
      <circle cx="55.2" cy="36.5" r="0.65"/>
      <circle cx="56.6" cy="33.1" r="0.65"/>

      <!-- Rayons extérieurs -->
      <circle cx="60" cy="29.3" r="0.55"/>
      <circle cx="65.2" cy="31.3" r="0.55"/>
      <circle cx="67.2" cy="36.5" r="0.55"/>
      <circle cx="65.2" cy="41.7" r="0.55"/>
      <circle cx="60" cy="43.7" r="0.55"/>
      <circle cx="54.8" cy="41.7" r="0.55"/>
      <circle cx="52.8" cy="36.5" r="0.55"/>
      <circle cx="54.8" cy="31.3" r="0.55"/>
    </g>
    <g class="ab-led ab-ledon" fill="#64dd17" filter="url(#ID-led-glow)">
      <!-- Anneau intérieur (8 points) -->
      <circle cx="60" cy="31.7" r="0.65"/>
      <circle cx="63.4" cy="33.1" r="0.65"/>
      <circle cx="64.8" cy="36.5" r="0.65"/>
      <circle cx="63.4" cy="39.9" r="0.65"/>
      <circle cx="60" cy="41.3" r="0.65"/>
      <circle cx="56.6" cy="39.9" r="0.65"/>
      <circle cx="55.2" cy="36.5" r="0.65"/>
      <circle cx="56.6" cy="33.1" r="0.65"/>

      <!-- Rayons extérieurs -->
      <circle cx="60" cy="29.3" r="0.55"/>
      <circle cx="65.2" cy="31.3" r="0.55"/>
      <circle cx="67.2" cy="36.5" r="0.55"/>
      <circle cx="65.2" cy="41.7" r="0.55"/>
      <circle cx="60" cy="43.7" r="0.55"/>
      <circle cx="54.8" cy="41.7" r="0.55"/>
      <circle cx="52.8" cy="36.5" r="0.55"/>
      <circle cx="54.8" cy="31.3" r="0.55"/>
    </g>
  </g>
`;