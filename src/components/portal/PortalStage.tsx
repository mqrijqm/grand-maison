'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import Dashboard from './Dashboard'
import s from './Portal.module.css'

// Pozornica portala: iza prozora se iz kobalt kvadratića podiže "grad" (stepenasti siluet zgrada),
// a prozor dashboarda se dok skrolujete ispravlja iz 3D nagiba (kao na Blink-ovom Arky sajtu).
// Kvadratići se crtaju na canvasu samo kad se skrol pomjeri — nema stalne petlje.

const CELL = 16
const GAP = 3

function skyline(cols: number, rows: number, seed: number) {
  let r = seed
  const rnd = () => ((r = (r * 16807) % 2147483647) / 2147483647)
  const h: number[] = []
  let x = 0
  while (x < cols) {
    const w = 2 + Math.floor(rnd() * 5)
    const center = 1 - Math.abs((x + w / 2) / cols - 0.5) * 2 // više u sredini, niže prema ivicama
    const top = Math.round(rows * (0.5 + 0.42 * Math.pow(center, 0.8) + rnd() * 0.1))
    for (let i = 0; i < w && x < cols; i++, x++) h.push(Math.min(rows, top - (i === 0 || i === w - 1 ? 1 : 0)))
  }
  // Mrvice: tonovi i prag pojavljivanja po kvadratiću.
  const cells: { c: number; row: number; tone: number; th: number }[] = []
  for (let c = 0; c < cols; c++) {
    for (let row = 0; row < h[c]; row++) {
      const edge = row >= h[c] - 2
      if (edge && rnd() < 0.35) continue
      cells.push({ c, row, tone: edge ? 0.35 + rnd() * 0.4 : 0.55 + rnd() * 0.45, th: (row / rows) * 0.7 + rnd() * 0.3 })
    }
  }
  return cells
}

export default function PortalStage({ variant = 'full' }: { variant?: 'full' | 'preview' }) {
  const root = useRef<HTMLDivElement>(null)
  const shot = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)

  useGSAP(
    () => {
      const canvas = cv.current!
      const ctx = canvas.getContext('2d')!
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      let cells: ReturnType<typeof skyline> = []
      let built = 0
      let progress = reduce ? 1 : 0
      const draw = () => {
        const dpr = Math.min(2, window.devicePixelRatio || 1)
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        // Mreža se pravi u ovom zatvaranju (ne po veličini canvasa), jer dev režim pokreće efekat dvaput.
        if (built !== w * 10000 + h) {
          built = w * 10000 + h
          canvas.width = Math.round(w * dpr)
          canvas.height = Math.round(h * dpr)
          cells = skyline(Math.ceil(w / (CELL + GAP)), Math.ceil(h / (CELL + GAP)), 7)
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w, h)
        for (const k of cells) {
          const show = Math.min(1, Math.max(0, (progress * 1.25 - k.th) / 0.12))
          if (show <= 0) continue
          ctx.globalAlpha = k.tone * show
          ctx.fillStyle = '#3156ea'
          const size = CELL * (0.6 + 0.4 * show)
          const x = k.c * (CELL + GAP) + (CELL - size) / 2
          const y = h - (k.row + 1) * (CELL + GAP) + (CELL - size) / 2
          ctx.fillRect(x, y, size, size)
        }
        ctx.globalAlpha = 1
      }
      draw()
      const ro = new ResizeObserver(draw)
      ro.observe(canvas)
      if (reduce) return () => ro.disconnect()

      const sync = (st: ScrollTrigger) => {
        progress = st.progress
        draw()
      }
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 95%',
        end: 'top 10%',
        onUpdate: sync,
        onRefresh: sync,
      })
      gsap.matchMedia().add('(min-width: 900px)', () => {
        gsap.fromTo(
          shot.current,
          { rotateX: 16, y: 80, scale: 0.9, transformPerspective: 1400 },
          { rotateX: 0, y: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'top 12%', scrub: true } },
        )
      })
      return () => ro.disconnect()
    },
    { scope: root },
  )

  return (
    <div ref={root} className={s.stage} data-variant={variant}>
      <div className={s.coords} aria-hidden>
        <span>A1 · Nabavka</span>
        <span>Portal · uživo</span>
      </div>
      <canvas ref={cv} className={s.mosaic} aria-hidden />
      <div ref={shot} className={s.shot}>
        <Dashboard variant={variant} />
      </div>
    </div>
  )
}
