'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import css from './BlueWipe.module.css'

// Prelaz za plave površine: plavo se sklapa od malih kvadratića (isti mozaik kao iza dashboarda
// portala). Kvadratići niču od jedne strane prema drugoj, rastu i na kraju se spoje u punu plavu
// pozadinu. Kad sekcija uđe u ekran, prelaz se sam odigra (~0,9 s); sadržaj (bijeli tekst) izroni na kraju.
//   from="right": kvadratići kreću od desne ivice
//   from="left":  kvadratići kreću od lijeve ivice

type Props = {
  children: React.ReactNode
  from: 'left' | 'right'
  className?: string
  fillClassName?: string
  contentClassName?: string
  /** Živa plava pozadina: svjetliji kvadratići tiho trepere i putuju talasom dok je sekcija u ekranu. */
  ambient?: boolean
}

const CELL = 18
const GAP = 3

export default function BlueWipe({ children, from, className = '', fillClassName = 'bg-navy', contentClassName = '', ambient = false }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const fill = el.querySelector<HTMLElement>('[data-wipe-fill]')!
      const canvas = el.querySelector<HTMLCanvasElement>('[data-wipe-canvas]')!
      const content = el.querySelector<HTMLElement>('[data-wipe-content]')!
      const trigger = el.parentElement ?? el
      const mm = gsap.matchMedia()
      mm.add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        if (reduce) return
        const ctx2d = canvas.getContext('2d')!
        const color = getComputedStyle(fill).backgroundColor
        let cells: { x: number; y: number; th: number }[] = []
        let built = ''
        const state = { p: 0 }
        const draw = () => {
          // Prelaz se dešava dok je vrh sekcije u ekranu, pa platno pokriva samo prvu visinu ekrana
          // (duge plave kolone bi inače dale ogroman canvas i trzanje na telefonu).
          const w = el.clientWidth
          const h = Math.min(el.clientHeight, window.innerHeight)
          const dpr = Math.min(1.5, window.devicePixelRatio || 1)
          canvas.style.height = `${h}px`
          const key = `${w}x${h}`
          if (key !== built) {
            built = key
            canvas.width = Math.round(w * dpr)
            canvas.height = Math.round(h * dpr)
            const cols = Math.ceil(w / (CELL + GAP))
            const rows = Math.ceil(h / (CELL + GAP))
            let seed = 7
            const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
            cells = []
            for (let c = 0; c < cols; c++)
              for (let r = 0; r < rows; r++) {
                const side = from === 'right' ? 1 - c / cols : c / cols
                cells.push({ x: c * (CELL + GAP), y: r * (CELL + GAP), th: side * 0.68 + rnd() * 0.3 })
              }
          }
          const p = state.p
          // Puno: kvadratići su spojeni — pravi pun sloj (oštre ivice, bez šavova).
          fill.style.opacity = p >= 1 ? '1' : '0'
          canvas.style.opacity = p >= 1 ? '0' : '1'
          ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx2d.clearRect(0, 0, w, h)
          if (p <= 0 || p >= 1) return
          ctx2d.fillStyle = color
          // Razmaci između kvadratića se zatvaraju tek na kraju, svi odjednom: da se ranije spoje,
          // oko onih koji još rastu ostao bi krem okvir (izgledalo bi kao šuplji kvadrati).
          const merge = Math.min(1, Math.max(0, (p - 0.86) / 0.14))
          for (const k of cells) {
            const e = Math.min(1, Math.max(0, (p * 1.18 - k.th) / 0.2))
            if (e <= 0) continue
            const size = CELL * e + (GAP + 1) * merge
            const off = (CELL - size) / 2
            ctx2d.fillRect(k.x + off, k.y + off, size, size)
          }
        }
        gsap.set(content, { autoAlpha: 0, y: 24 })
        draw()
        // Vremenska animacija (ne scrub): kad sekcija uđe u ekran, plavo se sklopi za ~0,9 s i tekst
        // izroni. Ne zavisi od brzine skrola, pa kvadratići nikad ne ostanu zaglavljeni na pola.
        const tl = gsap.timeline({
          paused: true,
          scrollTrigger: { trigger, start: 'top 78%', toggleActions: 'play none none reverse', onRefresh: draw },
        })
        tl.to(state, { p: 1, ease: 'power2.inOut', duration: 0.9, onUpdate: draw }, 0)
        tl.to(content, { autoAlpha: 1, y: 0, ease: 'power3.out', duration: 0.5 }, 0.75)
        const ro = new ResizeObserver(draw)
        ro.observe(el)

        // Živi mozaik preko pune plave: platno veličine ekrana prati vidljivi dio kolone, crta samo dok
        // je sekcija u ekranu i plavo je puno (gsap.ticker), na telefonu rjeđe ćelije.
        const amb = el.querySelector<HTMLCanvasElement>('[data-wipe-ambient]')
        let stopAmbient = () => {}
        if (ambient && amb) {
          const g = amb.getContext('2d')!
          const coarse = window.matchMedia('(pointer: coarse)').matches
          const cell = coarse ? 22 : 18
          let grid: { x: number; y: number; ph: number }[] = []
          let gk = ''
          let lastDraw = -1
          const tick = (time: number) => {
            // Telefon: 30 sličica u sekundi je dovoljno za sporo treptanje, a procesor radi upola manje.
            if (coarse && time - lastDraw < 1 / 30) return
            lastDraw = time
            const r = el.getBoundingClientRect()
            const vh = window.innerHeight
            const w = el.clientWidth
            const h = Math.min(vh, r.height)
            const top = Math.min(Math.max(0, -r.top), Math.max(0, r.height - h))
            amb.style.transform = `translateY(${top}px)`
            const k = `${w}x${h}`
            if (k !== gk) {
              gk = k
              amb.width = w
              amb.height = h
              amb.style.height = `${h}px`
              let seed = 3
              const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
              grid = []
              for (let c = 0; c * (cell + GAP) < w; c++)
                for (let rr = 0; rr * (cell + GAP) < h; rr++) grid.push({ x: c * (cell + GAP), y: rr * (cell + GAP), ph: c * 0.28 - rr * 0.36 + rnd() * 2.4 })
            }
            g.clearRect(0, 0, w, h)
            if (state.p < 1) return
            g.fillStyle = '#ffffff'
            for (const q of grid) {
              const s = Math.sin(time * 1.5 + q.ph)
              if (s < 0.55) continue
              const i = (s - 0.55) / 0.45
              const size = cell * (0.35 + 0.65 * i)
              const off = (cell - size) / 2
              g.globalAlpha = 0.05 + 0.13 * i
              g.fillRect(q.x + off, q.y + off, size, size)
            }
            g.globalAlpha = 1
          }
          const on = (yes: boolean) => (yes ? gsap.ticker.add(tick) : gsap.ticker.remove(tick))
          const st = ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: (self) => on(self.isActive) })
          stopAmbient = () => {
            on(false)
            st.kill()
          }
        }
        return () => {
          stopAmbient()
          ro.disconnect()
          fill.style.opacity = ''
          canvas.style.opacity = '0'
          gsap.set(content, { clearProps: 'all' })
        }
      })
    },
    { scope: root },
  )

  // Kad se visina stranice promijeni (scena herosa se učita ili padne na statičnu sliku), pozicije
  // okidača su zastarjele: bez ponovnog mjerenja plavo ostane na početku.
  useEffect(() => {
    let timer = 0
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    })
    observer.observe(document.body)
    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={root} className={`${css.wrap} relative ${className}`}>
      <div data-wipe-fill aria-hidden className={`${css.fill} ${fillClassName}`} />
      <canvas data-wipe-canvas aria-hidden className={css.canvas} />
      {ambient && <canvas data-wipe-ambient aria-hidden className={css.ambient} />}
      <div data-wipe-content className={`${css.content} ${contentClassName}`}>
        {children}
      </div>
    </div>
  )
}
