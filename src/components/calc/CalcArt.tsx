import type { CalcArt as Kind } from '@/lib/manufacturer-calculators'

// Linijski crteži za kartice kalkulatora (bijele linije na kobalt pozadini, isti jezik kao šematski
// crteži na početnoj). Vlastiti crteži, bez slika proizvođača. `data-d` = redoslijed iscrtavanja.
export default function CalcArt({ kind }: { kind: Kind }) {
  return (
    <svg viewBox="0 0 240 160" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" strokeLinecap="round" aria-hidden>
      {kind === 'roof-mono' && (
        <>
          {/* zid i jednostrešni krov u izometriji */}
          <path data-d="0" d="M50 120 L50 78 L120 58 L120 100 Z" />
          <path data-d="0" d="M120 100 L190 120 L190 92 L120 58" />
          <path data-d="1" d="M40 82 L120 50 L200 92" />
          <path data-d="1" d="M50 120 L120 140 L190 120" />
          {/* redovi crijepa na kosini */}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} data-d="2" d={`M${128 + i * 13} ${54 + i * 7} L${128 + i * 13 - 78} ${54 + i * 7 + 31}`} opacity={0.75} />
          ))}
        </>
      )}
      {kind === 'roof-gable' && (
        <>
          {/* kuća sa dvostrešnim krovom */}
          <path data-d="0" d="M60 128 L60 88 L120 112 L120 152 Z" />
          <path data-d="0" d="M120 152 L190 124 L190 84 L120 112" />
          <path data-d="1" d="M60 88 L88 50 L148 74 L120 112" />
          <path data-d="1" d="M148 74 L190 84" />
          <path data-d="1" d="M88 50 L60 88" />
          {/* crijep na prednjoj kosini */}
          {[0, 1, 2, 3].map((i) => (
            <path key={i} data-d="2" d={`M${95 + i * 12} ${60 + i * 12} L${145 + i * 12} ${80 + i * 2}`} opacity={0.75} />
          ))}
          <path data-d="2" d="M150 104 L150 128 L168 121 L168 97 Z" opacity={0.75} />
        </>
      )}
      {kind === 'u-value' && (
        <>
          {/* presjek zida: opeka sa šupljinama, strelice toplote prolaze kroz zid */}
          <rect data-d="0" x="92" y="28" width="56" height="104" />
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <g key={r}>
              <rect data-d="1" x="98" y={34 + r * 16} width="10" height="10" opacity={0.75} />
              <rect data-d="1" x="115" y={34 + r * 16} width="10" height="10" opacity={0.75} />
              <rect data-d="1" x="132" y={34 + r * 16} width="10" height="10" opacity={0.75} />
            </g>
          ))}
          {[52, 80, 108].map((y) => (
            <g key={y}>
              <path data-d="2" d={`M24 ${y} C44 ${y - 8} 62 ${y + 8} 84 ${y}`} />
              <path data-d="2" d={`M156 ${y} C176 ${y - 6} 196 ${y + 6} 216 ${y}`} opacity={0.55} />
              <path data-d="2" d={`M210 ${y - 5} L216 ${y} L210 ${y + 5}`} opacity={0.55} />
            </g>
          ))}
        </>
      )}
      {kind === 'wall-cost' && (
        <>
          {/* dva presjeka zida različite debljine i trake poređenja */}
          <rect data-d="0" x="40" y="30" width="34" height="100" />
          <rect data-d="0" x="96" y="30" width="52" height="100" />
          {[0, 1, 2, 3, 4].map((r) => (
            <g key={r}>
              <path data-d="1" d={`M40 ${48 + r * 18} L74 ${48 + r * 18}`} opacity={0.6} />
              <path data-d="1" d={`M96 ${48 + r * 18} L148 ${48 + r * 18}`} opacity={0.6} />
            </g>
          ))}
          <path data-d="2" d="M172 130 L172 84 L186 84 L186 130" />
          <path data-d="2" d="M196 130 L196 58 L210 58 L210 130" />
          <path data-d="2" d="M166 130 L216 130" />
        </>
      )}
      {kind === 'order' && (
        <>
          {/* list sa stavkama i mali crtež kuće: izračun materijala za objekat */}
          <path data-d="0" d="M70 24 L156 24 L172 40 L172 140 L70 140 Z" />
          <path data-d="0" d="M156 24 L156 40 L172 40" />
          <path data-d="1" d="M84 50 L108 34 L132 50 L132 76 L84 76 Z" />
          <path data-d="1" d="M102 76 L102 62 L114 62 L114 76" />
          {[92, 106, 120].map((y) => (
            <g key={y}>
              <path data-d="2" d={`M84 ${y} L90 ${y + 4} L98 ${y - 4}`} />
              <path data-d="2" d={`M106 ${y} L158 ${y}`} opacity={0.75} />
            </g>
          ))}
        </>
      )}
    </svg>
  )
}
