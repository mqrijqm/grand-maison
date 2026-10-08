'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import css from './StepBand.module.css'

// Stepenasta traka: sekcija čija su gornja i donja ivica stepenice ("pikselizovana dijagonala"),
// kao na referencama. Stepenice su kolone (div-ovi) iznad i ispod sekcije; skrol ih izvlači
// jednu po jednu (scaleY 0 → 1), pa ravna ivica naraste u stepenište kad traka uđe u ekran.
//
// Ivice leže u margini sekcije (margin-block = depth), pa ne prekrivaju susjedne sekcije.
//
// profile:
//   diag      — gore lijevo najviše, dolje desno najniže (paralelogram)
//   diag-rev  — ogledalo: gore desno najviše
//   valley    — gornja ivica se spušta ka sredini, donja visi u sredini (V)
//   flat-top  — ravno gore, stepenice samo dolje (za prvu traku ispod herosa)

export type StepProfile = 'diag' | 'diag-rev' | 'valley' | 'flat-top'
export type StepTone = 'navy' | 'ink' | 'bg'

// Visine kolona (0..1) za gornju i donju ivicu.
export function stepHeights(profile: StepProfile, n: number) {
  const top: number[] = []
  const bottom: number[] = []
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1)
    // stepenice nikad nisu nula: i najniža kolona malo viri, kao na referenci
    const lo = 1 / (n + 1)
    const v = Math.abs(2 * t - 1)
    if (profile === 'diag') {
      top.push(lo + (1 - lo) * (1 - t))
      bottom.push(lo + (1 - lo) * t)
    } else if (profile === 'diag-rev') {
      top.push(lo + (1 - lo) * t)
      bottom.push(lo + (1 - lo) * (1 - t))
    } else if (profile === 'valley') {
      top.push(lo + (1 - lo) * v)
      bottom.push(lo + (1 - lo) * (1 - v))
    } else {
      top.push(0)
      bottom.push(lo + (1 - lo) * t)
    }
  }
  return { top, bottom }
}

type Props = {
  children: React.ReactNode
  profile?: StepProfile
  tone?: StepTone
  /** broj stepenica (kolona) na desktopu; na uskom ekranu ide polovina */
  steps?: number
  /** visina stepeništa (CSS dužina) */
  depth?: string
  bottom?: boolean
  id?: string
  className?: string
  as?: 'section' | 'div'
  'aria-label'?: string
}

// Visina stuba = zrnasta kapa (--step-grain) + dio stepeništa; i najniži stub tako ima punu kapu.
const colStyle = (h: number, depth: string): React.CSSProperties => ({
  height: `calc(var(--step-grain) + ${h} * (${depth} - var(--step-grain)))`,
})

const FILL: Record<StepTone, string> = { navy: 'bg-navy', ink: 'bg-ink', bg: 'bg-bg' }
const TEXT: Record<StepTone, string> = { navy: 'text-bg', ink: 'text-bg', bg: 'text-ink' }

export default function StepBand({
  children,
  profile = 'diag',
  tone = 'navy',
  steps = 10,
  depth = 'clamp(300px, 46vh, 480px)',
  bottom = true,
  id,
  className = '',
  as: Tag = 'section',
  ...rest
}: Props) {
  const root = useRef<HTMLElement>(null)
  const { top, bottom: bottomHeights } = stepHeights(profile, steps)

  useGSAP(
    () => {
      const el = root.current!
      const tops = gsap.utils.toArray<HTMLElement>('[data-step-edge="top"] [data-step-col]', el)
      const bots = gsap.utils.toArray<HTMLElement>('[data-step-edge="bottom"] [data-step-col]', el)
      const mm = gsap.matchMedia()
      mm.add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        if (reduce) {
          gsap.set([...tops, ...bots], { yPercent: 0 })
          return
        }
        // Stub se ne skalira (zrno bi se razvuklo) nego izlazi iz ivice trake: translate + overflow:hidden
        // na traci. Okidač je sama traka: počinje kad njena spoljna ivica uđe u ekran, a završava kad
        // unutrašnja stigne do ~30% visine — dugačak, miran prelaz prije teksta ispod.
        // Niži stubovi kreću ranije, viši kasnije, pa ivica naraste u stepenište.
        const grow = (cols: HTMLElement[], hs: number[], edge: 'top' | 'bottom') => {
          if (!cols.length) return
          const band = cols[0].parentElement!
          const from = edge === 'top' ? 100 : -100
          const timeline = gsap.timeline({ scrollTrigger: { trigger: band, start: 'top 100%', end: 'bottom 30%', scrub: 0.8 } })
          cols.forEach((column, index) => timeline.fromTo(column, { yPercent: from }, { yPercent: 0, duration: 1, ease: 'power2.out' }, (1 - hs[index]) * 0.6))
        }
        grow(tops, top, 'top')
        grow(bots, bottomHeights, 'bottom')
      })
    },
    { scope: root },
  )

  return (
    <Tag
      ref={root as React.Ref<HTMLElement & HTMLDivElement>}
      id={id}
      data-step-band={tone}
      className={`relative z-[5] ${FILL[tone]} ${TEXT[tone]} ${className}`}
      style={{ marginTop: profile === 'flat-top' ? 0 : depth, marginBottom: bottom ? depth : 0 }}
      {...rest}
    >
      {profile !== 'flat-top' && (
        <div aria-hidden data-step-edge="top" className={`${css.band} pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] flex items-end`} style={{ height: depth }}>
          {top.map((h, i) => (
            <span key={i} data-step-col className={`${css.col} ${i % 2 && steps > 6 ? 'max-md:hidden' : ''}`} style={colStyle(h, depth)}>
              <i className={`${css.grain} ${FILL[tone]}`} style={{ '--gx': `${(i * 173) % 1024}px` } as React.CSSProperties} />
              <b className={`${css.body} ${FILL[tone]}`} />
            </span>
          ))}
        </div>
      )}
      {children}
      {bottom && <div aria-hidden data-step-edge="bottom" className={`${css.band} pointer-events-none absolute inset-x-0 top-[calc(100%-1px)] flex items-start`} style={{ height: depth }}>
        {bottomHeights.map((h, i) => (
          <span key={i} data-step-col className={`${css.col} ${i % 2 && steps > 6 ? 'max-md:hidden' : ''}`} style={colStyle(h, depth)}>
            <b className={`${css.body} ${FILL[tone]}`} />
            <i className={`${css.grain} ${css.grainBottom} ${FILL[tone]}`} style={{ '--gx': `${(i * 173 + 91) % 1024}px` } as React.CSSProperties} />
          </span>
        ))}
      </div>}
    </Tag>
  )
}
