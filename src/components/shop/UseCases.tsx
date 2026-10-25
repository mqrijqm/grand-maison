'use client'

import { PRODUCTS, USES, artikala, workHint, workName } from '@/lib/shop'
import { useLang } from '@/lib/i18n'
import SectionHead from './SectionHead'

// Pet vrsta radova. Klik je ranije postavljao filter u katalogu; katalog je uklonjen,
// pa su blokovi sada samo informacija — bez akcije i bez strelice.
export default function UseCases() {
  const { t, lang } = useLang()
  return (
    <section id="namjena" className="pt-[12dvh]">
      <div className="gutter">
        <SectionHead no="05" label={t('Po namjeni', 'By application')} meta={t(`${USES.length} vrsta radova`, `${USES.length} types of work`)} />
      </div>

      <ul className="mt-[8dvh] border-b-2 border-ink">
        {USES.map((u, i) => {
          const n = PRODUCTS.filter((p) => p.uses.includes(u.id)).length
          return (
            <li
              key={u.id}
              className="gutter grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t-2 border-ink py-6 uppercase md:grid-cols-12 md:gap-[1.5vw] md:py-8"
            >
              <span className="text-micro tabular-nums md:col-span-1">0{i + 1}</span>
              <span className="text-[clamp(24px,3.4vw,60px)] leading-[0.95] md:col-span-6">{workName(u.id, lang)}</span>
              <span className="hidden text-micro opacity-60 md:col-span-3 md:block">{workHint(u.id, lang)}</span>
              <span className="whitespace-nowrap text-micro md:col-span-2 md:text-right">{artikala(n, lang)}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
