'use client'

/* eslint-disable @next/next/no-img-element -- editorijalne fotografije iz /public, već u WebP */

import { MAPS_URL } from '@/lib/company'
import { useRef } from 'react'
import Pw from '@/components/ui/Pw'
import { COMPANY } from '@/gc/gc'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { useLang } from '@/lib/i18n'
import BladeOutline from './BladeOutline'

// Brend (po referenci): lijevo velika kvadratna fotografija sa manjom uokvirenom slikom preko,
// desno obrisani romb, serif naslov i kratak tekst u verzalu. Ispod red "Sa gradilišta":
// četiri krupna plana i u sredini tamni romb — sve ćelije dijele tanke linije.
const TILES = [
  { src: '/shop2/tile-1.webp', alt: 'Zrnca stiropora na plavoj podlozi', en: 'Polystyrene beads on a blue background' },
  { src: '/shop2/tile-2.webp', alt: 'Cement koji se sipa u kupu', en: 'Cement being poured into a heap' },
  null,
  { src: '/shop2/tile-3.webp', alt: 'Vlakna mineralne vune', en: 'Mineral wool fibres' },
  { src: '/shop2/tile-4.webp', alt: 'Libela na gips-kartonskoj ploči', en: 'Spirit level on a plasterboard sheet' },
]

export default function BrandStory() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)

  useGSAP(
    () => {
      const el = root.current!
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        if (reduce) return
        // Uokvirena slika klizi brže od velike — dubina kolaža.
        gsap.fromTo(
          el.querySelector('[data-inset]'),
          { yPercent: 18 },
          { yPercent: -18, ease: 'none', scrollTrigger: { trigger: el.querySelector('[data-collage]'), start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="mt-[22vh]" aria-label={t('O nama', 'About us')}>
      <div className="grid border-y border-ink/20 md:grid-cols-2">
        <div data-collage className="relative aspect-square overflow-hidden md:border-r md:border-ink/20">
          <figure data-parallax="6" className="absolute inset-0 overflow-hidden">
            <img decoding="async" loading="lazy" src="/shop2/brand.webp" alt={t('Gleterica na svježe izglađenoj masi', 'Trowel on freshly smoothed compound')} className="h-full w-full object-cover" />
          </figure>
          <figure data-inset className="absolute left-[30%] top-[24%] w-[38%] border-[6px] border-white shadow-[0_24px_50px_-24px_rgba(27,36,54,.5)]">
            <img decoding="async" loading="lazy" src="/shop2/brand-inset.webp" alt={t('Spoj ploča prekriven bandaž trakom i masom', 'Board joint covered with jointing tape and compound')} className="aspect-[3/4] w-full object-cover" />
          </figure>
        </div>

        <div className="flex flex-col justify-between gap-14 px-5 py-10 md:px-[4vw] md:py-[4vw]">
          <BladeOutline label={t('Pročitaj', 'Read more')} href="/vodici" className="self-end" />
          <div>
            <h2 data-up className="display text-[clamp(44px,4.8vw,84px)]">
              <Pw>{t('Naš brend', 'Our brand')}</Pw>
            </h2>
            <p data-up className="mt-8 max-w-[62ch] text-[11.5px] leading-[1.75]">
              {t(
                `${COMPANY.name} od ${COMPANY.founded}. radi veleprodaju i maloprodaju građevinskog materijala: sisteme suhe gradnje, izolaciju, veziva i pribor. Ne prodajemo samo ploču — slažemo sistem, od profila i montažnog pribora do mase za spojeve, a uslove i način istovara dogovaramo prema lokaciji i vrsti robe.`,
                `${COMPANY.name} has been supplying construction materials, wholesale and retail, since ${COMPANY.founded}: drywall systems, insulation, binders and accessories. We don't just sell a board — we assemble a system, from profiles and fixings to jointing compound, and agree unloading terms to suit the site and the type of goods.`,
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[18vh] border-y border-ink/20">
        <h2 className="display border-b border-ink/20 py-10 text-center text-[clamp(36px,3.6vw,60px)]">
          <Pw>{t('Sa gradilišta', 'From the site')}</Pw>
        </h2>
        <div className="grid grid-cols-2 gap-px bg-ink/20 md:grid-cols-5">
          {TILES.map((tile, i) =>
            tile ? (
              <figure key={i} className="bg-bg p-4 md:p-5">
                <div data-curtain className="aspect-[4/5] overflow-hidden">
                  <img decoding="async" src={tile.src} alt={lang === 'en' ? tile.en : tile.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out)] hover:scale-105" />
                </div>
              </figure>
            ) : (
              <a
                key={i}
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('Stovarište Banja Luka na Google mapi', 'Banja Luka yard on Google Maps')}
                data-cursor={t('Mapa', 'Map')}
                className="col-span-2 grid place-items-center bg-bg p-6 transition-opacity hover:opacity-70 md:col-span-1"
              >
                <BladeOutline label="Banja Luka" dark className="w-full max-w-[260px]" />
              </a>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
