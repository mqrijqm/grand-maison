'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { BOARD_MM, PROFILE_MM } from '@/lib/w111'
import styles from './Calc.module.css'

// Živi crtež pregradnog zida (pogled + presjek), računat iz unosa. Zid je u razmjeri dužina : visina,
// CW stupovi na 625 mm (osnova W111 normativa), UW profili gore i dolje, ploče 1250 × 2000 mm
// (2,5 m² = jedna ploča iz normativa) sa stvarnim spojevima, drugi sloj pomjeren za pola ploče.
// Crtež se mjeri u pikselima kontejnera (viewBox = stvarna veličina), pa su tekst i linije uvijek
// iste debljine, i na telefonu i na desktopu. Promjene se animiraju preko GSAP-a.

export type Focus = 'board' | 'cw' | 'uw' | 'wool' | 'filler' | 'screws' | null

type Geo = { L: number; H: number; dbl: number; wool: number }

const STUD = 0.625
const BOARD_W = 1.25
const BOARD_H = 2
const ZONE_WOOL = 0.22 // do ovdje se vidi samo potkonstrukcija
const ZONE_BOARD = 0.44 // od ovdje počinje prvi sloj ploča
const ZONE_DBL = 0.66 // od ovdje drugi sloj (kad je obloga dvostruka)

const m = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function studPositions(L: number) {
  const xs: number[] = []
  for (let x = 0; x < L - 0.08; x += STUD) xs.push(x)
  xs.push(L)
  return xs
}

export default function WallDrawing({ L, H, double, wool, focus }: { L: number; H: number; double: boolean; wool: boolean; focus: Focus }) {
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 640, h: 480 })
  const target: Geo = { L, H, dbl: double ? 1 : 0, wool: wool ? 1 : 0 }
  const [g, setG] = useState<Geo>(target)
  const cur = useRef<Geo>({ ...target })

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      if (width > 0 && height > 0) setSize({ w: Math.round(width), h: Math.round(height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = gsap.to(cur.current, {
      L: target.L,
      H: target.H,
      dbl: target.dbl,
      wool: target.wool,
      duration: reduce ? 0 : 0.9,
      ease: 'power3.inOut',
      onUpdate: () => setG({ ...cur.current }),
    })
    return () => {
      t.kill()
    }
  }, [target.L, target.H, target.dbl, target.wool])

  const { w, h } = size
  const small = w < 480
  const pad = small ? 14 : 22
  const secH = small ? 70 : 84 // traka sa presjekom
  const dimB = small ? 38 : 44 // kota ispod zida
  const boxX = pad + (small ? 26 : 34)
  const boxR = w - pad
  const boxT = pad + (small ? 58 : 48)
  const boxB = h - pad - secH - dimB
  const s = Math.max(0.0001, Math.min((boxR - boxX) / g.L, (boxB - boxT) / g.H))
  const W = g.L * s
  const Hp = g.H * s
  const x0 = boxX + (boxR - boxX - W) / 2
  const yF = boxB - Math.max(0, (boxB - boxT - Hp) * 0.42) // zid malo ispod sredine, kad je nizak
  const yT = yF - Hp
  const X = (mx: number) => x0 + mx * s
  const Y = (my: number) => yF - my * s // visina od poda
  const tr = Math.max(3, Math.min(7, 0.05 * s)) // debljina UW profila u crtežu

  const studs = studPositions(g.L)
  // Zone presjeka "skidanja slojeva" padaju na stupove (cijela polja), ako zid ima dovoljno polja
  const snap = (f: number) => {
    if (studs.length < 5) return g.L * f
    return studs.reduce((best, x) => (Math.abs(x - g.L * f) < Math.abs(best - g.L * f) ? x : best), studs[1])
  }
  const xWool = snap(ZONE_WOOL)
  const xB = Math.max(snap(ZONE_BOARD), xWool + 0.01)
  const xDd = Math.max(snap(ZONE_DBL), xB + 0.01)
  const xD = g.L - g.dbl * (g.L - xDd)

  // Spojevi ploča: vertikalni na 1250 mm, horizontalni na 2000 mm, svaka druga kolona pomjerena za 1000 mm
  // (smaknuti spojevi). Drugi sloj je pomjeren za pola ploče (625 mm).
  const joints = (from: number, offset: number) => {
    const v: number[] = []
    for (let x = offset; x < g.L - 0.02; x += BOARD_W) if (x > from + 0.02) v.push(x)
    const hz: { x1: number; x2: number; y: number }[] = []
    for (let c = Math.floor((from - offset) / BOARD_W); c * BOARD_W + offset < g.L; c++) {
      const a = Math.max(from, c * BOARD_W + offset)
      const b = Math.min(g.L, (c + 1) * BOARD_W + offset)
      if (b <= a) continue
      const shift = ((c % 2) + 2) % 2 ? 1 : 0
      for (let y = BOARD_H - shift; y < g.H - 0.02; y += BOARD_H) if (y > 0.02) hz.push({ x1: a, x2: b, y })
    }
    return { v, hz }
  }
  const j1 = joints(xB, 0)
  const j2 = joints(xD, STUD)

  // Vuna: cik-cak u svakom polju između stupova, od zone vune do kraja zida
  const woolPath = (() => {
    let d = ''
    const yTop = yT + tr
    const yBot = yF - tr
    const step = Math.max(8, Math.min(16, (yBot - yTop) / 10))
    for (let i = 0; i < studs.length - 1; i++) {
      const a = Math.max(studs[i], xWool)
      const b = studs[i + 1]
      if (b - a < 0.05) continue
      const xa = X(a) + 3
      const xb = X(b) - 3
      let left = true
      d += `M${xa} ${yTop + 2}`
      for (let y = yTop + 2 + step; y <= yBot - 2; y += step) {
        d += `L${left ? xb : xa} ${y}`
        left = !left
      }
    }
    return d
  })()

  // Vijci: tačke na stupovima ispod ploča, na ~250 mm (samo vizuelno)
  const screwDots: { x: number; y: number }[] = []
  const sStep = Math.max(0.25, 14 / s)
  studs.forEach((sx) => {
    if (sx < xB + 0.01) return
    for (let y = 0.15; y < g.H - 0.1; y += sStep) screwDots.push({ x: X(sx), y: Y(y) })
  })

  const dim = (focus: Focus, keys: Focus[]) => (focus && !keys.includes(focus) ? 0.28 : 1)
  const on = (keys: Focus[]) => (focus && keys.includes(focus) ? 2.2 : 1.25)

  // Presjek (pogled odozgo): ploče | profil + vuna | ploče. Debljina je uvećana radi čitljivosti.
  const sx0 = boxX
  const sx1 = boxR
  const sy = h - pad - secH + 26
  const kT = (secH - 44) / (PROFILE_MM + 4 * BOARD_MM) // px po mm debljine
  const bT = BOARD_MM * kT
  const layers = 1 + g.dbl
  const cavT = PROFILE_MM * kT
  const totT = cavT + 2 * layers * bT
  const cavY = sy + layers * bT
  const secStuds: number[] = []
  const secSpan = sx1 - sx0
  const secStep = Math.max(56, secSpan / 4.2)
  for (let x = sx0 + secStep * 0.5; x < sx1 - 10; x += secStep) secStuds.push(x)
  const thickness = Math.round(PROFILE_MM + 2 * layers * BOARD_MM)

  const label = (x: number, y: number, t: string, anchor: 'start' | 'middle' | 'end' = 'middle', o = 1) => (
    <text x={x} y={y} textAnchor={anchor} opacity={o} className={styles.svgLabel}>
      {t}
    </text>
  )

  const zoneLabel = (a: number, b: number, t: string, o: number, keys: Focus[]) =>
    X(b) - X(a) > (small ? 34 : 40) && o > 0.02 ? label((X(a) + X(b)) / 2, yT - 10, t, 'middle', o * dim(focus, keys)) : null

  return (
    <div ref={box} className={styles.svgBox}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Zid ${m(L)} × ${m(H)} m, ${double ? 'dvostruka' : 'jednostruka'} obloga, ${wool ? 'sa kamenom vunom' : 'bez vune'}`}>
        <defs>
          <clipPath id="calc-cav">
            <rect x={X(xWool)} y={yT + tr} width={Math.max(0, X(focus === 'wool' ? g.L : xB) - X(xWool))} height={Math.max(0, Hp - 2 * tr)} />
          </clipPath>
        </defs>
        <g fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinejoin="miter">
          {/* pod */}
          <line x1={pad} x2={w - pad} y1={yF} y2={yF} opacity={0.5} />
          {Array.from({ length: Math.ceil((w - 2 * pad) / 12) }, (_, i) => (
            <line key={i} x1={pad + i * 12} y1={yF + 6} x2={pad + i * 12 + 6} y2={yF} opacity={0.22} />
          ))}

          {/* vuna */}
          <g clipPath="url(#calc-cav)" opacity={g.wool * dim(focus, ['wool'])}>
            <path d={woolPath} strokeWidth={on(['wool'])} opacity={0.75} />
          </g>

          {/* CW stupovi */}
          <g opacity={dim(focus, ['cw', 'screws'])} strokeWidth={on(['cw'])}>
            {studs.map((sx, i) => {
              const x = X(sx)
              const fl = Math.max(3, Math.min(8, 0.05 * s))
              const xl = i === studs.length - 1 ? x - fl : i === 0 ? x : x - fl / 2
              return <rect key={i} x={xl} y={yT + tr} width={fl} height={Math.max(0, Hp - 2 * tr)} />
            })}
          </g>

          {/* UW gore i dolje */}
          <g opacity={dim(focus, ['uw'])} strokeWidth={on(['uw'])}>
            <rect x={X(0)} y={yT} width={W} height={tr} />
            <rect x={X(0)} y={yF - tr} width={W} height={tr} />
          </g>

          {/* 1. sloj ploča */}
          <g opacity={dim(focus, ['board', 'filler', 'screws'])}>
            <rect x={X(xB)} y={yT} width={Math.max(0, X(g.L) - X(xB))} height={Hp} fill="var(--cobalt)" fillOpacity={0.9} strokeWidth={on(['board'])} />
            <rect x={X(xB)} y={yT} width={Math.max(0, X(g.L) - X(xB))} height={Hp} fill="#fff" fillOpacity={0.05} stroke="none" />
            <g strokeWidth={on(['filler'])}>
              {j1.v.map((x) => (
                <line key={`v${x}`} x1={X(x)} x2={X(x)} y1={yT} y2={yF} />
              ))}
              {j1.hz.map((l, i) => (
                <line key={`h${i}`} x1={X(l.x1)} x2={X(l.x2)} y1={Y(l.y)} y2={Y(l.y)} />
              ))}
            </g>
          </g>

          {/* 2. sloj ploča (dvostruka obloga) */}
          <g opacity={g.dbl * dim(focus, ['board', 'filler', 'screws'])}>
            <rect x={X(xD)} y={yT} width={Math.max(0, X(g.L) - X(xD))} height={Hp} fill="var(--cobalt)" strokeWidth={on(['board'])} />
            <rect x={X(xD)} y={yT} width={Math.max(0, X(g.L) - X(xD))} height={Hp} fill="#fff" fillOpacity={0.1} stroke="none" />
            <g strokeWidth={on(['filler'])}>
              {j2.v.map((x) => (
                <line key={`v${x}`} x1={X(x)} x2={X(x)} y1={yT} y2={yF} />
              ))}
              {j2.hz.map((l, i) => (
                <line key={`h${i}`} x1={X(l.x1)} x2={X(l.x2)} y1={Y(l.y)} y2={Y(l.y)} />
              ))}
            </g>
          </g>

          {/* vijci */}
          <g fill="currentColor" stroke="none" opacity={(focus === 'screws' ? 1 : 0.55) * dim(focus, ['screws', 'board'])}>
            {screwDots.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={focus === 'screws' ? 1.8 : 1.1} />
            ))}
          </g>

          {/* kote: dužina */}
          <g opacity={0.9}>
            <line x1={X(0)} x2={X(g.L)} y1={yF + dimB * 0.5} y2={yF + dimB * 0.5} />
            <line x1={X(0)} x2={X(0)} y1={yF + 10} y2={yF + dimB * 0.5 + 5} />
            <line x1={X(g.L)} x2={X(g.L)} y1={yF + 10} y2={yF + dimB * 0.5 + 5} />
            <line x1={X(0) - 4} x2={X(0) + 4} y1={yF + dimB * 0.5 + 4} y2={yF + dimB * 0.5 - 4} />
            <line x1={X(g.L) - 4} x2={X(g.L) + 4} y1={yF + dimB * 0.5 + 4} y2={yF + dimB * 0.5 - 4} />
          </g>
          {/* kote: visina */}
          <g opacity={0.9}>
            <line x1={x0 - 18} x2={x0 - 18} y1={yT} y2={yF} />
            <line x1={x0 - 23} x2={x0 - 6} y1={yT} y2={yT} />
            <line x1={x0 - 22} x2={x0 - 14} y1={yT + 4} y2={yT - 4} />
            <line x1={x0 - 22} x2={x0 - 14} y1={yF + 4} y2={yF - 4} />
          </g>
          {/* razmak stupova */}
          {studs.length > 2 && X(STUD) - X(0) > 26 && (
            <g opacity={0.7 * dim(focus, ['cw'])}>
              <line x1={X(0)} x2={X(STUD)} y1={yT - 26} y2={yT - 26} />
              <line x1={X(0)} x2={X(0)} y1={yT - 30} y2={yT - 22} />
              <line x1={X(STUD)} x2={X(STUD)} y1={yT - 30} y2={yT - 22} />
            </g>
          )}

          {/* presjek */}
          <g>
            <line x1={sx0} x2={sx1} y1={sy - 12} y2={sy - 12} opacity={0.25} />
            {/* ploče: slojevi sa obje strane */}
            {[0, 1].map((side) =>
              [0, 1].map((k) => {
                const o = k === 0 ? 1 : g.dbl
                if (o < 0.02) return null
                const y = side === 0 ? cavY - (k + 1) * bT : cavY + cavT + k * bT
                return (
                  <rect key={`${side}${k}`} x={sx0} y={y} width={secSpan} height={bT * (k === 0 ? 1 : g.dbl)} opacity={o * dim(focus, ['board'])} strokeWidth={on(['board'])} />
                )
              }),
            )}
            {/* vuna u šupljini */}
            <path
              d={(() => {
                let d = ''
                const st = 9
                let up = true
                for (let x = sx0 + 3; x <= sx1 - 3; x += st) {
                  d += `${d ? 'L' : 'M'}${x} ${up ? cavY + 3 : cavY + cavT - 3}`
                  up = !up
                }
                return d
              })()}
              opacity={0.6 * g.wool * dim(focus, ['wool'])}
              strokeWidth={on(['wool'])}
            />
            {/* CW profili (C oblik) */}
            <g opacity={dim(focus, ['cw'])} strokeWidth={on(['cw'])}>
              {secStuds.map((x, i) => (
                <path key={i} d={`M${x + 9} ${cavY + 1.5}H${x}V${cavY + cavT - 1.5}H${x + 9}`} fill="var(--cobalt)" />
              ))}
            </g>
          </g>
        </g>

        {/* tekst */}
        <g fill="currentColor">
          {label(X(g.L / 2), yF + dimB * 0.5 - 6, `${m(g.L)} m`)}
          <text x={x0 - 26} y={(yT + yF) / 2} textAnchor="middle" className={styles.svgLabel} transform={`rotate(-90 ${x0 - 26} ${(yT + yF) / 2})`}>
            {`${m(g.H)} m`}
          </text>
          {studs.length > 2 && X(STUD) - X(0) > 26 && label((X(0) + X(STUD)) / 2, yT - 31, '625', 'middle', 0.8 * dim(focus, ['cw']))}
          {zoneLabel(0, xWool, 'CW / UW', 1, ['cw', 'uw'])}
          {zoneLabel(xWool, xB, 'Vuna', g.wool, ['wool'])}
          {zoneLabel(xB, xD, g.dbl > 0.5 ? '1. sloj' : 'Ploča', 1, ['board', 'filler', 'screws'])}
          {zoneLabel(xD, g.L, '2. sloj', g.dbl, ['board', 'filler', 'screws'])}
          {label(sx0, sy - 18, 'Presjek', 'start', 0.75)}
          {label(sx1, sy - 18, `${thickness} mm`, 'end', 0.75)}
          {label(sx0, sy + totT + 14, `${layers > 1.5 ? '2' : '1'} × 12,5 + CW ${PROFILE_MM}${g.wool > 0.5 ? ' + vuna' : ''} + ${layers > 1.5 ? '2' : '1'} × 12,5`, 'start', 0.6)}
        </g>
      </svg>
    </div>
  )
}
