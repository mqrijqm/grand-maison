'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'

// Kraj plave površine: kvadratići boje stranice niču odozdo, gore rijetki i sitni, prema dnu sve gušći
// i na dnu puna krem površina (isti mozaik kao prelazi na početnoj, samo obrnuto). Stoji iza donje polovine
// sadržaja iznad sebe. Kad uđe u ekran, prelaz se sam odigra (brzo, ~0,8 s) i ne zavisi od toga koliko
// se skrola, pa nikad ne ostane "zaglavljen" na pola; skrol nazad ga vrati. Dok je u ekranu, mozaik je
// stalno živ: kvadratići glatko "dišu", a talas putuje dijagonalno preko njih (gsap.ticker, samo dok se vidi).
// Reduced motion: odmah gotov, bez disanja.
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
      let cells: { x: number; y: number; f: number; d: number; ph: number; t: number }[] = []
      let built = ''
      let fill = ''
      const state = { p: 0 }
      let time = 0
      let live = false
      const draw = () => {
        const w = el.clientWidth, h = el.clientHeight + 2
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
              const fr = Math.min(1, Math.max(0, (t - 0.12) / 0.62 + (rnd() - 0.5) * 0.5))
              // Donji dio: slučajnost nestaje, svi kvadratići rastu do pune veličine i spoje se u krem.
              const solidify = Math.min(1, Math.max(0, (t - 0.42) / 0.16))
              const f = fr + (1 - fr) * solidify
              // ph: faza talasa (dijagonala + malo slučajnosti), da disanje putuje preko mozaika
              if (t <= (solid ? 0.74 : 1)) cells.push({ x: c * (CELL + GAP), y: r * (CELL + GAP), f, d: (1 - t) * 0.55 + rnd() * 0.2, ph: c * 0.38 - r * 0.55 + rnd() * 1.2, t })
            }
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w, h)
        ctx.fillStyle = fill
        ctx.globalAlpha = 1
        const p = state.p
        for (const k of cells) {
          let e = k.f * Math.min(1, Math.max(0, (p - k.d) / 0.3))
          // Ciklus ~1 s; gore kvadratići potpuno nestaju i vraćaju se, prema dnu disanje slabi do nule,
          // da donji redovi ostanu puni i ne otvaraju plave procjepe iznad krem trake.
          // Disanje kroz cijeli mozaik (talas od ~1,8 s); utihne tek tamo gdje krem preliv sve pokrije.
          if (live) e *= 1 - (0.75 - 0.35 * k.f) * (1 - Math.min(1, Math.max(0, (k.t - 0.55) / 0.2))) * (0.5 + 0.5 * Math.sin(time * 3.4 + k.ph))
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
        // Dno: krem preliv preko mozaika (od prozirnog na ~38 % visine do pune boje na ~72 %), pa puna
        // krem ispod. Plavo i procjepi između kvadratića postepeno blijede u pozadinu, bez ijedne linije.
        const w = el.clientWidth, h = el.clientHeight + 2
        const rgb = fill.match(/[\d.]+/g)?.slice(0, 3).join(',') ?? '244,241,236'
        const g = ctx.createLinearGradient(0, h * 0.38, 0, h * 0.72)
        g.addColorStop(0, `rgba(${rgb},0)`)
        g.addColorStop(0.5, `rgba(${rgb},0.55)`)
        g.addColorStop(1, `rgb(${rgb})`)
        ctx.globalAlpha = Math.min(1, state.p / 0.5)
        ctx.fillStyle = g
        ctx.fillRect(0, h * 0.38, w, h * 0.62 + 3)
        ctx.globalAlpha = 1
      }
      gsap.matchMedia().add(MQ, (c) => {
        const { reduce } = c.conditions as { reduce: boolean }
        if (reduce) {
          state.p = 1
          drawAll()
          return
        }
        drawAll()
        // Disanje ide na GSAP tickeru, samo dok je prelaz u ekranu.
        const tick = (t: number) => {
          time = t
          drawAll()
        }
        const breathe = (on: boolean) => {
          live = on
          if (on) gsap.ticker.add(tick)
          else gsap.ticker.remove(tick)
        }
        ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: (self) => breathe(self.isActive) })
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
        return () => {
          ro.disconnect()
          breathe(false)
        }
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} aria-hidden className={`pointer-events-none relative ${className}`}>
      <span data-probe className="hidden" style={{ background: color }} />
      {/* Platno ide 2 px ispod ivice: zaokruživanje veličine ne ostavlja plavu crtu na dnu. */}
      <canvas className="absolute inset-x-0 top-0 h-[calc(100%+2px)] w-full" />
    </div>
  )
}
