// Linijske ilustracije procesa; tekst i brojke ostaju u HTML-u.
export default function ProcurementArt({ step, className }: { step: number; className?: string }) {
  return (
    <svg data-process-art viewBox="0 0 360 260" className={className} fill="none" stroke="var(--ink)" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 226H336" stroke="var(--ink)" opacity=".2" />
      {step < 3 ? (
        <>
          <path d="M87 53 242 40 264 216 109 229Z" stroke="var(--ink)" opacity=".25" />
          <path d="M78 46 237 27 259 205 100 224Z" stroke="var(--ink)" opacity=".4" />
          <path d="M72 31H211L247 67V207H72Z" fill="var(--bg)" />
          <path d="M211 31V67H247" />
          <path d="M93 57H151M93 68H126" stroke="var(--cobalt)" />
          <path d="M93 95H225M93 129H225M93 163H225M93 191H173" opacity=".3" />
          <path d="M183 95V163" opacity=".3" />
          {[108, 142, 176].map((y, i) => (
            <g key={y}>
              <rect x="93" y={y} width="9" height="9" />
              <path d={`M112 ${y + 4}H${i === 2 ? 146 : 167}`} />
              {i < 2 && <path d={`M195 ${y + 4}H219`} />}
            </g>
          ))}
          {step === 0 && (
            <g stroke="var(--cobalt)" data-detail>
              <circle cx="259" cy="172" r="39" fill="var(--bg)" />
              <path d="M239 172H278M266 160 278 172 266 184" />
              <path d="M228 121 260 108 293 121" opacity=".4" strokeDasharray="3 5" />
            </g>
          )}
          {step === 1 && (
            <g stroke="var(--cobalt)" data-detail>
              <path d="M94 111 97 114 103 107M94 145 97 148 103 141" />
              <circle cx="258" cy="170" r="38" fill="var(--bg)" />
              <path d="M240 170 252 182 276 156" strokeWidth="2.4" />
            </g>
          )}
          {step === 2 && (
            <g stroke="var(--cobalt)" data-detail>
              <path d="M102 185C119 163 109 203 128 179S126 195 148 182" strokeWidth="2" />
              <path d="M205 155 270 89 282 100 217 166 201 171Z" fill="var(--bg)" />
              <path d="M205 155 217 166M264 95 276 106" />
              <circle cx="267" cy="192" r="23" fill="var(--bg)" />
              <path d="M256 192 263 199 278 183" strokeWidth="2" />
            </g>
          )}
        </>
      ) : (
        <>
          <path d="M55 189 160 231 284 174 179 132Z" fill="var(--plate)" />
          <path d="M55 189V202L160 244 284 187V174M160 231V244" />
          <path d="M75 194 199 141M104 206 228 152M133 219 256 164" />
          <path d="M65 104 170 61 273 102 168 146Z" fill="var(--bg)" />
          <path d="M65 104V184L168 225 273 181V102M168 146V225" fill="var(--bg)" />
          <path d="M65 104 168 146 273 102" />
          <path d="M110 86 211 128V164L193 159V136L92 94" stroke="var(--cobalt)" data-detail />
          <path d="M201 172 247 153V176L201 195Z" stroke="var(--cobalt)" />
          <path d="M87 154V172M94 157V175M84 159 87 154 90 161M91 162 94 157 97 164" />
          <g stroke="var(--cobalt)" data-detail>
            <path d="M211 48H283L303 67V112" strokeDasharray="4 5" />
            <circle cx="302" cy="128" r="22" fill="var(--bg)" />
            <path d="M292 128 300 135 314 119" strokeWidth="2" />
          </g>
        </>
      )}
    </svg>
  )
}
