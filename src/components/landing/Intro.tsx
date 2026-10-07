'use client'

/* eslint-disable @next/next/no-img-element -- editorijalne fotografije iz /public, već u WebP */

import { useRef } from 'react'
import Link from 'next/link'
import Cta from '@/components/ui/Cta'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { OFFERINGS } from '@/lib/offerings'
import styles from './Offerings.module.css'

// Prvi ekran poslije herosa: B2B veleprodaja i šest programskih ulaza. Postojeći vizuelni
// sistem galerije ostaje: fotografije, hover i vodoravna vožnja skrolom.
// Na telefonu je swipe. id="radovi" je postojeći okidač za odlazak velikog wordmarka.

export default function Intro() {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(root.current!.querySelector('[data-head]')!, reduce, 'top 80%')
      })
    },
    { scope: root },
  )

  // Traka kadrova: sekcija se zalijepi (CSS sticky u višem omotaču) i skrol, umjesto na sljedeću
  // sekciju, vodi traku vodoravno. Sticky drži browser — bez GSAP pina, pa nema skoka.
  useGSAP(
    () => {
      const el = root.current!
      const wrap = el.querySelector<HTMLElement>('[data-pinwrap]')!
      const viewport = el.querySelector<HTMLElement>('[data-viewport]')!
      const track = el.querySelector<HTMLElement>('[data-track]')!

      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)' }, () => {
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)
        // Omotač je visok koliko traje vožnja: ekran + dužina trake. Mjeri se prije svakog
        // osvježavanja ScrollTriggera, da start/end budu izmjereni na tačnoj visini.
        const setHeight = () => {
          wrap.style.height = `${window.innerHeight + distance()}px`
        }
        setHeight()
        ScrollTrigger.addEventListener('refreshInit', setHeight)
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top top', end: () => `+=${distance()}`, scrub: 0.7, invalidateOnRefresh: true },
        })
        return () => {
          ScrollTrigger.removeEventListener('refreshInit', setHeight)
          wrap.style.height = ''
          tween.scrollTrigger?.kill()
          tween.kill()
          gsap.set(track, { clearProps: 'transform' })
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="radovi" aria-labelledby="offerings-title" className="relative z-20 bg-bg pb-[8vh] pt-[24vh]">
      <div className={`gutter ${styles.heading}`}>
        <h2
          id="offerings-title"
          data-head
          className={`display invisible ${styles.title}`}
        >
          Građevinski materijal za profesionalce
        </h2>

        <div data-up data-delay="0.1" className={styles.lead}>
            <p className="text-[15px] leading-[1.7] opacity-75">
              Veleprodaja građevinskog materijala u Banjoj Luci. Za firme, izvođače i vaš sljedeći projekat.
            </p>
            <div data-up data-delay="0.2" className="mt-7 flex flex-wrap gap-3">
              <Cta href="/prodavnica" solid>
                Asortiman
              </Cta>
              <Cta href="/upit-za-izvodjace">Pošaljite spisak</Cta>
            </div>
        </div>
      </div>

      {/* Traka kadrova: sticky sekcija, skrol je vozi udesno. */}
      <div data-pinwrap className="relative mt-[12vh] bg-bg">
        <section
          aria-label="Šest oblasti ponude"
          className="relative overflow-hidden bg-bg md:sticky md:top-0 md:flex md:h-dvh md:items-center"
        >
          <div data-viewport className="hs-viewport w-full">
            <div data-track className="flex w-max items-start gap-[6vw] px-5 md:gap-[2.2vw] md:px-[6vw]">
              {OFFERINGS.map((s, i) => (
                <figure key={s.id} className="m-0 w-[72vw] max-w-[400px] shrink-0 snap-start sm:w-[42vw] lg:w-[min(28vw,38vh)]" style={{ marginTop: i % 2 ? '5vh' : 0 }}>
                  <Link href={s.href} className={styles.card} aria-label={`${s.name} — ${s.cta}`}>
                    <div data-curtain className={styles.image}>
                      <img
                        decoding="async"
                        loading="lazy"
                        src={s.image}
                        alt={s.alt}
                        width={1024}
                        height={1536}
                        className={styles.photo}
                      />
                      <div className={styles.reveal}>
                        <div className={styles.words}>{s.keywords.map(word => <span key={word} className={styles.word}>{word}</span>)}</div>
                        <span className={styles.action}>{s.cta}<span aria-hidden>↗</span></span>
                      </div>
                    </div>
                    <div className={styles.caption}>
                      <h3 className={`font-pretty ${styles.name}`}>{s.name}</h3>
                      <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                  </Link>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
