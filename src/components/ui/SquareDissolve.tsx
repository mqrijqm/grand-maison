'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'

// Kraj plave površine: kvadratići boje stranice niču odozdo, gore rijetki i sitni, prema dnu sve gušći
// i na dnu puna krem površina (isti mozaik kao prelazi na početnoj, samo obrnuto). Stoji iza donje polovine
// sadržaja iznad sebe. Kad uđe u ekran, prelaz se sam odigra (brzo, ~0,8 s) i ne zavisi od toga koliko
// se skrola, pa nikad ne ostane "zaglavljen" na pola; skrol nazad ga vrati. Reduced motion: odmah gotov.
const CELL = 18
const GAP = 3

/** tint: kvadratići su prozirniji gore, a puni boje pri dnu (blijedo → jarko). solid: puna traka na dnu. */
export default function SquareDissolve({ className = '', color = 'var(--bg)', tint = false, solid = true }: { className?: string; color?: string; tint?: boolean; solid?: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const canvas = el.querySelector('canvas')!
      const ctx = canvas.getContext('2d')!
      const probe = el.querySelector<HTMLElement>('[data-probe]')!
      let cells: { x: number; y: number; f: number; d: number }[] = []
      let built = ''
      let fill = ''
      const state = { p: 0 }
      const draw = () => {
        const w = el.clientWidth, h = el.clientHeight
        const dpr = Math.min(1.5, window.devicePixelRatio || 1)
        const key = `${w}x${h}`
        if (key !== built) {
          built = key
          fill = getComputedStyle(probe).backgroundColor
          canvas.width = Math.round(w * dpr)
          canvas.height = Math.round(h * dpr)
          const cols = Math.ceil(w / (CELL + GAP)), rows = Math.ceil(h / (CELL + GAP))
          let seed = 11
          const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
          cells = []
          for (let c = 0; c < cols; c++)
            for (let r = 0; r < rows; r++) {
              const t = r / (rows - 1)
              // f: krajnja veličina (gore 0, dole puno); d: kad kvadratić krene da raste
              const f = Math.min(1, Math.max(0, (t - 0.12) / 0.62 + (rnd() - 0.5) * 0.5))
              if (t <= (solid ? 0.86 : 1)) cells.push({ x: c * (CELL + GAP), y: r * (CELL + GAP), f, d: (1 - t) * 0.55 + rnd() * 0.2 })
            }
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w, h)
        ctx.fillStyle = fill
        const p = state.p
        for (const k of cells) {
          const e = k.f * Math.min(1, Math.max(0, (p - k.d) / 0.3))
          if (e <= 0.02) continue
          const size = CELL * e
          const off = (CELL - size) / 2
          if (tint) ctx.globalAlpha = Math.min(1, 0.2 + 0.8 * (k.y / h))
          ctx.fillRect(k.x + off, k.y + off, size, size)
        }
      }
      const drawAll = () => {
        draw()
        ctx.globalAlpha = 1
        if (!solid) return
        // Dno: puna krem traka (posljednjih ~14 % visine) koja raste sa skrolom i spaja se sa stranicom ispod.
        const w = el.clientWidth, h = el.clientHeight
        const band = h * 0.14 * Math.min(1, state.p / 0.6)
        ctx.fillRect(0, h - band, w, band + 1)
      }
      gsap.matchMedia().add(MQ, (c) => {
        const { reduce } = c.conditions as { reduce: boolean }
        if (reduce) {
          state.p = 1
          drawAll()
          return
        }
        drawAll()
        // Vremenska animacija (ne scrub): okidač je kad gornja ivica prelaza dođe do 85 % ekrana.
        gsap.to(state, {
          p: 1,
          duration: 0.8,
          ease: 'power2.inOut',
          onUpdate: drawAll,
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse', onRefresh: drawAll },
        })
        const ro = new ResizeObserver(() => {
          built = ''
          drawAll()
        })
        ro.observe(el)
        return () => ro.disconnect()
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} aria-hidden className={`pointer-events-none relative ${className}`}>
      <span data-probe className="hidden" style={{ background: color }} />
      <canvas className="absolute inset-0 h-full w-full" />
    </div>
  )
}
