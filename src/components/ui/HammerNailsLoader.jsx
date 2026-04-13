import React from 'react';

/**
 * Inline SVG (SMIL) animation:
 * - Hammer hits 5 nails sequentially (realistic timing)
 * - Each nail drives down and stays until reset
 * - Subtle impact flash + vibration + dust
 * - Loops smoothly (~7s) with matching first/last frame
 *
 * Styled/positioned via Tailwind on wrapper.
 */
export default function HammerNailsLoader({ className = '' }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 360 200"
        className="h-44 w-[22rem] max-w-full"
        role="img"
        aria-label="Loading animation: hammer hitting nails"
      >
        <defs>
          <linearGradient id="metal" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="metalDark" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#94a3b8" />
            <stop offset="1" stopColor="#1f2937" />
          </linearGradient>
          <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#d97706" />
            <stop offset="1" stopColor="#78350f" />
          </linearGradient>
          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Wood plank */}
        <g filter="url(#softShadow)">
          <rect
            x="40"
            y="142"
            width="280"
            height="30"
            rx="14"
            fill="#5a341e"
          />
          <rect
            x="40"
            y="142"
            width="280"
            height="30"
            rx="14"
            fill="url(#wood)"
            opacity="0.55"
          />
          <path
            d="M58 156c18-10 36 10 54 0s36 10 54 0 36 10 54 0 36 10 54 0"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Timeline (7s): hit1..hit5, then smooth reset */}
        {/* Key times (0..1): 0.12,0.28,0.44,0.60,0.76 impacts; 0.88-1 reset */}
        constNails
        {[
          { x: 92, impact: 0.12, drivenY: 104 },
          { x: 142, impact: 0.28, drivenY: 106 },
          { x: 192, impact: 0.44, drivenY: 108 },
          { x: 242, impact: 0.60, drivenY: 110 },
          { x: 292, impact: 0.76, drivenY: 112 },
        ].map((n, i) => (
          <g key={i} filter="url(#softShadow)">
            {/* Nail group position animates (driven down, then reset back up) */}
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                dur="7s"
                repeatCount="indefinite"
                calcMode="linear"
                values={`
                  ${n.x} 92;
                  ${n.x} 92;
                  ${n.x} ${n.drivenY};
                  ${n.x} ${n.drivenY};
                  ${n.x} ${n.drivenY};
                  ${n.x} 92;
                  ${n.x} 92
                `}
                keyTimes={`
                  0;
                  ${n.impact};
                  ${Math.min(n.impact + 0.04, 0.86)};
                  0.86;
                  0.88;
                  0.98;
                  1
                `}
              />

              {/* subtle vibration right at impact */}
              <animateTransform
                attributeName="transform"
                additive="sum"
                type="translate"
                dur="7s"
                repeatCount="indefinite"
                values={`
                  0 0;
                  0 0;
                  0 0;
                  0.6 -0.6;
                  -0.4 0.4;
                  0.2 -0.2;
                  0 0;
                  0 0
                `}
                keyTimes={`
                  0;
                  ${n.impact};
                  ${Math.min(n.impact + 0.015, 0.86)};
                  ${Math.min(n.impact + 0.03, 0.86)};
                  ${Math.min(n.impact + 0.045, 0.86)};
                  ${Math.min(n.impact + 0.06, 0.86)};
                  ${Math.min(n.impact + 0.08, 0.86)};
                  1
                `}
              />

              <rect x="-3" y="32" width="6" height="46" rx="3" fill="url(#metalDark)" />
              <rect x="-10" y="26" width="20" height="10" rx="6" fill="url(#metal)" />
            </g>
          </g>
        ))}

        {/* Impact flashes + dust (one per nail) */}
        {[
          { x: 92, impact: 0.12 },
          { x: 142, impact: 0.28 },
          { x: 192, impact: 0.44 },
          { x: 242, impact: 0.60 },
          { x: 292, impact: 0.76 },
        ].map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy="124" r="10" fill="#ef4444" opacity="0.9" />
            <path
              d={`M${p.x} 108 v-10 M${p.x} 150 v10 M${p.x - 16} 124 h-10 M${p.x + 16} 124 h10`}
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <animate
              attributeName="opacity"
              dur="7s"
              repeatCount="indefinite"
              values="0;0;1;0;0"
              keyTimes={`0;${p.impact};${Math.min(p.impact + 0.02, 0.86)};${Math.min(p.impact + 0.06, 0.86)};1`}
            />

            {/* tiny dust particles */}
            {[ -10, -4, 6, 12 ].map((dx, j) => (
              <circle key={j} cx={p.x + dx} cy="124" r="2.2" fill="rgba(255,255,255,0.65)">
                <animate
                  attributeName="opacity"
                  dur="7s"
                  repeatCount="indefinite"
                  values="0;0;1;0;0"
                  keyTimes={`0;${p.impact};${Math.min(p.impact + 0.015, 0.86)};${Math.min(p.impact + 0.10, 0.86)};1`}
                />
                <animate
                  attributeName="cy"
                  dur="7s"
                  repeatCount="indefinite"
                  values={`124;124;${118 - (j % 2) * 3};124;124`}
                  keyTimes={`0;${p.impact};${Math.min(p.impact + 0.08, 0.86)};${Math.min(p.impact + 0.16, 0.86)};1`}
                />
              </circle>
            ))}
          </g>
        ))}

        {/* Sledgehammer */}
        <g>
          <g id="hammer" filter="url(#softShadow)">
            {/* handle (thicker, with grip) */}
            <rect
              x="70"
              y="76"
              width="140"
              height="20"
              rx="11"
              fill="url(#wood)"
            />
            <rect x="78" y="79" width="124" height="6" rx="6" fill="rgba(255,255,255,0.18)" />
            <rect x="72" y="80" width="22" height="12" rx="8" fill="rgba(15,23,42,0.35)" />
            {/* neck */}
            <rect x="196" y="62" width="18" height="18" rx="8" fill="url(#metalDark)" />

            {/* sledge head (big, dual-faced) */}
            <rect x="206" y="42" width="92" height="36" rx="10" fill="url(#metal)" />
            <rect x="214" y="49" width="76" height="8" rx="6" fill="rgba(255,255,255,0.22)" />
            {/* darker underside */}
            <rect x="206" y="60" width="92" height="18" rx="9" fill="rgba(2,6,23,0.16)" />
            {/* end caps */}
            <rect x="202" y="46" width="10" height="28" rx="6" fill="url(#metalDark)" opacity="0.9" />
            <rect x="292" y="46" width="10" height="28" rx="6" fill="url(#metalDark)" opacity="0.9" />
          </g>

          {/* Hammer motion (~7s): prep up, swing down, move to next nail */}
          <animateTransform
            xlinkHref="#hammer"
            attributeName="transform"
            type="translate"
            dur="7s"
            repeatCount="indefinite"
            values="
              0 0;
              0 -10;
              0 0;
              50 -10;
              50 0;
              100 -10;
              100 0;
              150 -10;
              150 0;
              200 -10;
              200 0;
              0 0;
              0 0
            "
            keyTimes="
              0;
              0.06;
              0.12;
              0.22;
              0.28;
              0.38;
              0.44;
              0.54;
              0.60;
              0.70;
              0.76;
              0.88;
              0.98;
              1
            "
          />
          <animateTransform
            xlinkHref="#hammer"
            attributeName="transform"
            type="rotate"
            additive="sum"
            dur="7s"
            repeatCount="indefinite"
            values="
              -18 210 90;
              -26 210 90;
              14 210 90;
              -26 210 90;
              14 210 90;
              -26 210 90;
              14 210 90;
              -26 210 90;
              14 210 90;
              -26 210 90;
              14 210 90;
              -18 210 90;
              -18 210 90;
              -18 210 90
            "
            keyTimes="
              0;
              0.06;
              0.12;
              0.22;
              0.28;
              0.38;
              0.44;
              0.54;
              0.60;
              0.70;
              0.76;
              0.88;
              0.98;
              1
            "
          />
        </g>
      </svg>
    </div>
  );
}

