'use client'

/* eslint-disable @next/next/no-img-element -- optimizovane WebP fotografije iz /public */

import { useRef, useState } from 'react'
import Link from 'next/link'
import GcMonogram from '@/components/GcMonogram'
import { gsap, useGSAP } from '@/lib/gsap'
import { EASE, MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { FEATURED_OFFERINGS as ITEMS } from '@/lib/featured-offerings'
import styles from './FeaturedOrbit.module.css'

// Lepeza i dinamika prema korisničkoj referenci:
// https://github.com/mqrijqm/grand-cipher/blob/main/src/components/Constellation.tsx
const TILES = Array.from({ length: ITEMS.length * 2 }, (_, i) => ({
  item: i % ITEMS.length, detail: i >= ITEMS.length,
}))
const random = (i: number, salt: number) => {
  const n = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return n - Math.floor(n)
}
const JITTER = TILES.map((_, i) => ({
  angle: (random(i, 1) - .5) * .16, radius: 1 + (random(i, 2) - .5) * .1,
}))
type Controls = { enter: (i: number) => void; leave: () => void }

export default function Featured() {
  const root = useRef<HTMLElement>(null)
  const controls = useRef<Controls>({ enter: () => {}, leave: () => {} })
  const [selected, setSelected] = useState(0)
  const item = ITEMS[selected]

  useGSAP((_, contextSafe) => {
    const el = root.current!
    const stage = el.querySelector<HTMLElement>('[data-orbit]')!
    const tiles = [...stage.querySelectorAll<HTMLElement>('[data-tile]')]
    const mm = gsap.matchMedia()
    mm.add(MQ, ctx => {
      const { reduce } = ctx.conditions as { reduce: boolean }
      revealChars(el.querySelector('[data-head]')!, reduce, 'top 80%')
      const state = { angle: 0, introAngle: reduce ? 0 : -1.3, slow: 1, kick: 0, tx: 0, ty: 0, ox: 0, oy: 0 }
      const tileState = tiles.map(() => ({ intro: reduce ? 1 : 0, scale: 1, dim: 1 }))
      let width = 0, height = 0, tileWidth = 0, tileHeight = 0, rx = 0, ry = 0
      let visible = false, entered = reduce, hovered = -1

      const draw = () => {
        tiles.forEach((tile, i) => {
          const angle = state.angle + state.introAngle + i / tiles.length * Math.PI * 2 + JITTER[i].angle
          const depth = Math.sin(angle)
          const scale = (.96 + .07 * (depth + 1) / 2) * tileState[i].scale * (.7 + .3 * tileState[i].intro)
          const x = width / 2 + rx * Math.cos(angle) * JITTER[i].radius + state.ox - tileWidth / 2
          const y = height / 2 + ry * depth * JITTER[i].radius + state.oy - tileHeight / 2
          tile.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
          tile.style.opacity = String(tileState[i].intro * tileState[i].dim)
          tile.style.zIndex = String(hovered === i ? 260 : 100 + Math.round(depth * 80))
        })
      }
      const layout = () => {
        width = stage.clientWidth; height = stage.clientHeight
        tileWidth = Math.min(width * .235, height * .32)
        tileHeight = tileWidth * .64
        rx = width * .325; ry = height * .315
        stage.style.setProperty('--tile-width', `${tileWidth}px`)
        stage.style.setProperty('--tile-height', `${tileHeight}px`)
        gsap.set(tiles, { left: 0, top: 0 })
        draw()
      }
      layout()
      const observer = new ResizeObserver(layout)
      observer.observe(stage)
      const enterView = contextSafe!(() => {
        if (entered) return
        entered = true
        gsap.to(tileState, { intro: 1, duration: 1, ease: EASE.expo, stagger: .055 })
        gsap.to(state, { introAngle: 0, duration: 2.2, ease: EASE.out })
      })
      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible) enterView()
      }, { threshold: .08 })
      visibility.observe(stage)

      const update = (_time: number, milliseconds: number) => {
        if (!visible || document.hidden) return
        const dt = Math.min(milliseconds, 50) / 1000
        if (!reduce) {
          state.kick *= Math.pow(.04, dt)
          state.angle += (.15 * state.slow + (hovered !== -1 ? 0 : state.kick)) * dt
          const ease = 1 - Math.exp(-5 * dt)
          state.ox += (state.tx - state.ox) * ease
          state.oy += (state.ty - state.oy) * ease
        }
        draw()
      }
      if (!reduce) gsap.ticker.add(update)
      controls.current.enter = contextSafe!((i: number) => {
        hovered = i
        setSelected(TILES[i].item)
        gsap.to(state, { slow: 0, duration: reduce ? 0 : .65, overwrite: 'auto' })
        tileState.forEach((tile, j) => gsap.to(tile, {
          scale: i === j ? 1.3 : 1, dim: i === j ? 1 : .45,
          duration: reduce ? 0 : .65, ease: EASE.expo, overwrite: 'auto',
        }))
        draw()
      })
      controls.current.leave = contextSafe!(() => {
        hovered = -1
        gsap.to(state, { slow: 1, duration: reduce ? 0 : .8, overwrite: 'auto' })
        gsap.to(tileState, { scale: 1, dim: 1, duration: reduce ? 0 : .65, ease: EASE.out, overwrite: 'auto' })
        draw()
      })
      const move = (event: PointerEvent) => {
        if (reduce || event.pointerType !== 'mouse') return
        const rect = stage.getBoundingClientRect()
        state.tx = ((event.clientX - rect.left) / width - .5) * -18
        state.ty = ((event.clientY - rect.top) / height - .5) * -12
      }
      const reset = () => { state.tx = 0; state.ty = 0 }
      const wheel = (event: WheelEvent) => {
        if (!reduce && hovered === -1) state.kick = Math.max(-.7, Math.min(.7, state.kick + event.deltaY * .0006))
      }
      stage.addEventListener('pointermove', move)
      stage.addEventListener('pointerleave', reset)
      stage.addEventListener('wheel', wheel, { passive: true })
      return () => {
        observer.disconnect(); visibility.disconnect()
        gsap.ticker.remove(update)
        stage.removeEventListener('pointermove', move)
        stage.removeEventListener('pointerleave', reset)
        stage.removeEventListener('wheel', wheel)
        controls.current = { enter: () => {}, leave: () => {} }
      }
    })
  }, { scope: root })

  return (
    <section ref={root} id="najcesce" className={styles.section} aria-labelledby="featured-title">
      <div className="gutter">
        <div className={styles.heading}>
          <div>
            <p className="label mb-6 opacity-65">Materijal za vaš projekat</p>
            <h2 id="featured-title" data-head className={`display invisible ${styles.title}`}>Izdvojeno iz asortimana</h2>
          </div>
          <p className={styles.lead}>Od ploča i izolacije do drvnog i sanitarnog programa. Istražite materijal i nastavite prema ponudi.</p>
        </div>
        <div className={styles.content}>
          <div data-orbit className={styles.stage} role="group" aria-label="Lepeza materijala — odaberite sliku za detalje">
            <div className={styles.mark} aria-hidden><GcMonogram /></div>
            {TILES.map((tile, i) => {
              const entry = ITEMS[tile.item]
              const angle = i / TILES.length * Math.PI * 2
              return (
                <button key={i} type="button" data-tile className={styles.tile}
                  style={{ left: `${50 + Math.cos(angle) * 32.5}%`, top: `${50 + Math.sin(angle) * 31.5}%`, transform: 'translate(-50%,-50%)' }}
                  aria-label={`${tile.detail ? 'Prikaz programa' : 'Odaberite'}: ${entry.name}`}
                  aria-pressed={selected === tile.item} aria-controls="featured-details"
                  onPointerEnter={event => { if (event.pointerType === 'mouse') controls.current.enter(i) }}
                  onPointerLeave={() => controls.current.leave()}
                  onFocus={() => controls.current.enter(i)} onBlur={() => controls.current.leave()}
                  onClick={() => setSelected(tile.item)}>
                  <img src={tile.detail ? entry.detail : entry.image} alt="" width={900} height={1350}
                    loading="lazy" decoding="async" style={{ objectPosition: tile.detail ? '50% 72%' : '50% 48%' }} />
                  <span className={styles.index}>0{tile.item + 1} ↗</span>
                </button>
              )
            })}
          </div>
          <div id="featured-details" className={styles.center}>
            <div className={styles.selection}>
              <span aria-live="polite">0{selected + 1} / 0{ITEMS.length}</span>
              <button type="button" aria-label="Prethodna stavka" onClick={() => setSelected((selected + ITEMS.length - 1) % ITEMS.length)}>←</button>
              <button type="button" aria-label="Sljedeća stavka" onClick={() => setSelected((selected + 1) % ITEMS.length)}>→</button>
            </div>
            <span className={styles.category}>{item.program}</span>
            <h3 className={`font-pretty ${styles.itemTitle}`}>{item.name}</h3>
            <p className={styles.spec}>{item.spec}</p>
            <p className={styles.unit}>{item.unit ? `Jedinica: ${item.unit}` : 'Količine prema specifikaciji'}</p>
            <div className={styles.actions}>
              <Link href={item.quote} className={styles.action}><span>{item.action}</span><span aria-hidden>↗</span></Link>
              <Link href={item.href} className={styles.detailLink}>{item.detailAction}</Link>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <p className={styles.hint}>Odaberite sliku za detalje. Fotografije ilustruju materijal; dostupnost se provjerava po upitu.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
