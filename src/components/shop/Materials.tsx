'use client'

import { useState } from 'react'
import { resetFilters } from '@/lib/cart'
import { CATEGORIES, PRODUCTS, USES, artikala, brandL, workName } from '@/lib/shop'
import { CATEGORIES_EN } from '@/gc/gc'
import { useLang } from '@/lib/i18n'
import { useScrollTo } from '@/lib/useScrollTo'
import SectionHead from './SectionHead'

// Četiri grupe iz kataloga (src/gc): opis primjene, fotografija ugradnje i ono što je stvarno u ponudi.
const MATERIALS = CATEGORIES.map((c) => {
  const items = PRODUCTS.filter((p) => p.category === c.id)
  return {
    ...c,
    useIds: USES.filter((u) => items.some((p) => p.uses.includes(u.id))).map((u) => u.id),
    brands: [...new Set(items.map((p) => p.brand))],
    count: items.length,
  }
})

export default function Materials() {
  const { t, lang } = useLang()
  const [active, setActive] = useState(0)
  const scrollTo = useScrollTo()
  const m = MATERIALS[active]
  const mEn = CATEGORIES_EN[m.id]
  const en = lang === 'en'

  return (
    <section id="materijali" data-spy className="gutter scroll-mt-[var(--bar)] py-[14dvh]">
      <SectionHead
        no="06"
        label={t('Materijali', 'Materials')}
        title={t('Znajte šta ugrađujete', 'Know what you build with')}
        lead={t('Gdje se koristi, po čemu se razlikuje i koje brendove držimo na stanju.', 'Where it is used, what sets it apart and which brands we keep in stock.')}
        meta={t(`${MATERIALS.length} grupe`, `${MATERIALS.length} groups`)}
      />

      <div className="mt-[8dvh] grid gap-8 md:grid-cols-12 md:gap-[1.5vw]">
        <div role="tablist" aria-label={t('Materijali', 'Materials')} className="border-b-2 border-ink md:col-span-5 md:self-start">
          {MATERIALS.map((mat, i) => {
            const on = i === active
            return (
              <button
                key={mat.id}
                id={`mat-tab-${mat.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="mat-panel"
                onClick={() => setActive(i)}
                className={`flex w-full items-baseline gap-4 border-t-2 border-ink px-3 py-5 text-left uppercase transition-colors duration-500 md:px-4 md:py-7 ${
                  on ? 'bg-ink text-bg' : 'hover:bg-ink/10'
                }`}
              >
                <span className="text-micro tabular-nums">0{i + 1}</span>
                <span className="text-[clamp(24px,3.2vw,56px)] leading-[0.95]">{en ? CATEGORIES_EN[mat.id].label : mat.name}</span>
              </button>
            )
          })}
        </div>

        <div
          key={m.id}
          id="mat-panel"
          role="tabpanel"
          aria-labelledby={`mat-tab-${m.id}`}
          className="fade-up md:col-span-6 md:col-start-7"
        >
          {/* Fotografija ugradnje: ilustruje grupu, ne prikazuje konkretan artikal. */}
          <figure>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img decoding="async" src={m.photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <figcaption className="mt-2 text-micro uppercase text-ink/60">{en ? mEn.label : m.name} · {t('primjer ugradnje', 'installation example')}</figcaption>
          </figure>
          <p className="mt-6 max-w-[46ch] text-lead uppercase">{en ? mEn.lead : m.lead}</p>
          <p className="mt-4 max-w-[60ch] text-small normal-case leading-[1.3]">{en ? mEn.usage : m.usage}</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              [t('Primjena', 'Applications'), m.useIds.map((id) => workName(id, lang))],
              [t('Brendovi', 'Brands'), m.brands.map((b) => brandL(b, lang))],
            ].map(([label, list]) => (
              <div key={label as string}>
                <p className="text-micro uppercase text-ink/60">{label as string}</p>
                <ul className="mt-3 border-t-2 border-ink">
                  {(list as string[]).map((li) => (
                    <li key={li} className="border-b border-ink/25 py-2.5 text-small uppercase">
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                resetFilters({ category: m.id })
                scrollTo('prodavnica')
              }}
              className="border-2 border-ink px-4 py-3.5 text-micro uppercase transition-colors duration-300 hover:bg-ink hover:text-bg"
            >
              {artikala(m.count, lang)} {t('u katalogu', 'in the catalogue')} →
            </button>
            <button
              type="button"
              onClick={() => scrollTo('ponuda')}
              className="px-1 py-3.5 text-micro uppercase underline underline-offset-4"
            >
              {t('Zatraži tehnički list', 'Request a datasheet')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
