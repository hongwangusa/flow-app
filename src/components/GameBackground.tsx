'use client'
// Zelda BotW × Pokémon landscape — shared background for all Flow pages

export default function GameBackground() {
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,overflow:'hidden'}}>
      <svg
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        style={{width:'100%',height:'100%'}}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky gradient — BotW clear day */}
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A8FD1"/>
            <stop offset="60%" stopColor="#5BB8F5"/>
            <stop offset="100%" stopColor="#A8D8EA"/>
          </linearGradient>
          {/* Sun glow */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE566" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#FFE566" stopOpacity="0"/>
          </radialGradient>
          {/* Hills gradient */}
          <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3DAA4A"/>
            <stop offset="100%" stopColor="#2A8C38"/>
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#236B2F"/>
            <stop offset="100%" stopColor="#1A5224"/>
          </linearGradient>
          {/* Atmospheric blur for far mountains */}
          <filter id="haze">
            <feGaussianBlur stdDeviation="1.5"/>
          </filter>
        </defs>

        {/* ── Sky ── */}
        <rect width="1200" height="700" fill="url(#sky)"/>

        {/* ── Sun with glow rings ── */}
        <circle cx="1060" cy="90" r="110" fill="url(#sunGlow)"/>
        <circle cx="1060" cy="90" r="75" fill="#FFE566" opacity="0.15"/>
        <circle cx="1060" cy="90" r="52" fill="#FFD93D"/>

        {/* ── Distant mountains — BotW misty blue-gray ── */}
        <path d="M0,420 L80,220 L160,310 L270,160 L380,260 L490,130
                 L610,230 L730,150 L860,210 L980,155 L1100,195 L1200,170
                 L1200,480 L0,480 Z"
              fill="#7AADC4" opacity="0.55" filter="url(#haze)"/>

        {/* ── Mid mountains — deep pine forest ── */}
        <path d="M0,490 L70,310 L160,400 L290,255 L420,360 L560,280
                 L700,350 L840,285 L980,330 L1110,280 L1200,305
                 L1200,530 L0,530 Z"
              fill="#1A5C2A"/>

        {/* ── Mid mountains highlight edge ── */}
        <path d="M0,490 L70,310 L160,400 L290,255 L420,360 L560,280
                 L700,350 L840,285 L980,330 L1110,280 L1200,305 L1200,320
                 L1110,295 L980,345 L840,300 L700,365 L560,295 L420,375
                 L290,270 L160,415 L70,325 L0,505 Z"
              fill="#2A7A3A" opacity="0.6"/>

        {/* ── Rolling hills — lush grass ── */}
        <path d="M0,560 C80,490 200,530 350,505 C500,480 640,520 780,498
                 C920,476 1060,510 1200,488 L1200,700 L0,700 Z"
              fill="url(#hillNear)"/>

        {/* ── Ground strip ── */}
        <rect x="0" y="610" width="1200" height="90" fill="url(#ground)"/>

        {/* ── Clouds ── */}
        {/* Cloud 1 — large, left */}
        <g opacity="0.92">
          <ellipse cx="340" cy="118" rx="72" ry="30" fill="white"/>
          <ellipse cx="295" cy="112" rx="48" ry="26" fill="white"/>
          <ellipse cx="385" cy="110" rx="52" ry="28" fill="white"/>
          <ellipse cx="340" cy="108" rx="38" ry="20" fill="white"/>
        </g>
        {/* Cloud 2 — small, upper left */}
        <g opacity="0.85">
          <ellipse cx="115" cy="175" rx="50" ry="22" fill="white"/>
          <ellipse cx="80" cy="170" rx="34" ry="18" fill="white"/>
          <ellipse cx="148" cy="168" rx="38" ry="20" fill="white"/>
        </g>
        {/* Cloud 3 — right side */}
        <g opacity="0.80">
          <ellipse cx="820" cy="135" rx="60" ry="26" fill="white"/>
          <ellipse cx="778" cy="130" rx="42" ry="22" fill="white"/>
          <ellipse cx="860" cy="128" rx="46" ry="24" fill="white"/>
        </g>
        {/* Cloud 4 — far right small */}
        <g opacity="0.70">
          <ellipse cx="680" cy="88" rx="38" ry="17" fill="white"/>
          <ellipse cx="656" cy="84" rx="26" ry="14" fill="white"/>
          <ellipse cx="704" cy="83" rx="30" ry="16" fill="white"/>
        </g>

        {/* ── Foreground trees (Zelda-style silhouettes) ── */}
        {/* Left cluster */}
        <rect x="22" y="570" width="12" height="50" fill="#3D2207"/>
        <ellipse cx="28" cy="565" rx="24" ry="32" fill="#155C22"/>
        <ellipse cx="28" cy="548" rx="18" ry="24" fill="#1A7A2C"/>
        <rect x="68" y="582" width="9" height="38" fill="#3D2207"/>
        <ellipse cx="72" cy="578" rx="18" ry="26" fill="#155C22"/>
        <ellipse cx="72" cy="562" rx="13" ry="19" fill="#1A7A2C"/>

        {/* Right cluster */}
        <rect x="1155" y="568" width="12" height="52" fill="#3D2207"/>
        <ellipse cx="1161" cy="563" rx="24" ry="32" fill="#155C22"/>
        <ellipse cx="1161" cy="546" rx="18" ry="24" fill="#1A7A2C"/>
        <rect x="1112" y="580" width="9" height="40" fill="#3D2207"/>
        <ellipse cx="1116" cy="576" rx="18" ry="26" fill="#155C22"/>
        <ellipse cx="1116" cy="560" rx="13" ry="19" fill="#1A7A2C"/>

        {/* Mid scattered trees */}
        <rect x="150" y="590" width="8" height="32" fill="#3D2207"/>
        <ellipse cx="154" cy="587" rx="14" ry="20" fill="#1A6B26"/>
        <rect x="1030" y="588" width="8" height="34" fill="#3D2207"/>
        <ellipse cx="1034" cy="584" rx="14" ry="20" fill="#1A6B26"/>
      </svg>
    </div>
  )
}
