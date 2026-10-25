'use client'

/* eslint-disable @next/next/no-img-element -- naše fotografije iz /public */
import { DELIVERY_ZONES, DELIVERY_ZONES_EN, FREE_DELIVERY_OVER, ORDER_STEPS, ORDER_STEPS_EN, kmL } from '@/gc/gc'
import { useLang } from '@/lib/i18n'
import Reveal from './Reveal'
import SectionHead from './SectionHead'

// Koraci narudžbe (ORDER_STEPS) i cjenovnik dostave po zonama (DELIVERY_ZONES) iz kataloga Grand Company.
export default function Process() {
  const { t, lang } = useLang()
  const steps = lang === 'en' ? ORDER_STEPS_EN : ORDER_STEPS
  return (
    <section id="isporuka" data-spy className="gutter scroll-mt-[var(--bar)] bg-ink py-[14dvh] text-bg">
      <SectionHead
        no="08"
        label={t('Isporuka', 'Delivery')}
        title={t('Od narudžbe do etaže', 'From order to floor')}
        lead={t('Četiri koraka. Posljednji radi kamion sa kranom.', 'Four steps. The last one is done by a truck with a crane.')}
      />

      <div className="mt-[8dvh] grid border-t-2 border-current md:grid-cols-4">
        {steps.map(([title, text], i) => (
          <Reveal
            key={title}
            delay={i * 110}
            className={`flex min-h-[260px] flex-col justify-between gap-10 py-6 md:min-h-[46dvh] md:px-[1.6vw] ${
              i > 0 ? 'border-t border-current/25 md:border-l md:border-t-0' : 'md:pl-0'
            }`}
          >
            <p className="text-[clamp(72px,10vw,180px)] leading-[0.8] tabular-nums">{i + 1}</p>
            <div>
              <h3 className="text-small uppercase">{title}</h3>
              <p className="mt-3 max-w-[30ch] text-micro uppercase opacity-60">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Kran: fotografija našeg vozila i cijene dostave po zonama. */}
      <div className="mt-[10dvh] grid gap-8 border-t-2 border-current pt-8 md:grid-cols-12 md:gap-[1.5vw]">
        <figure className="min-w-0 md:col-span-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg/10">
            <img decoding="async" src="/photos/kran-utovar.webp" alt={t('Kamion Grand Company sa kranom pri utovaru paleta', 'Grand Company crane truck loading pallets')} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          </div>
          <figcaption className="mt-2 text-micro uppercase opacity-60">{t('Naš kamion sa kranom, stovarište Banja Luka', 'Our crane truck, Banja Luka yard')}</figcaption>
        </figure>

        <div className="min-w-0 md:col-span-7 md:pl-[2vw]">
          <h3 className="text-lead uppercase">{t('Dostava po zonama', 'Delivery by zone')}</h3>
          <p className="mt-2 text-micro uppercase opacity-60">
            {t(`Standardna dostava je besplatna preko ${kmL(FREE_DELIVERY_OVER, 'sr')}. Kran se naplaćuje kao prevoz plus rad.`, `Standard delivery is free over ${kmL(FREE_DELIVERY_OVER, 'en')}. The crane is charged as transport plus operation.`)}
          </p>
          <div className="mt-6 overflow-x-auto" data-lenis-prevent-horizontal>
            <table className="w-full min-w-[460px] border-collapse text-left uppercase">
              <caption className="sr-only">{t('Cijene dostave po zonama', 'Delivery prices by zone')}</caption>
              <thead>
                <tr>
                  {[t('Zona', 'Zone'), t('Standardna', 'Standard'), t('Kran: prevoz', 'Crane: transport'), t('Kran: rad', 'Crane: operation')].map((h) => (
                    <th key={h} scope="col" className="border-b-2 border-current pb-3 pr-3 text-micro font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DELIVERY_ZONES.map((z) => (
                  <tr key={z.id}>
                    <th scope="row" className="border-b border-current/25 py-3 pr-3 text-micro font-bold">
                      {lang === 'en' ? (DELIVERY_ZONES_EN[z.id] ?? z.label) : z.label}
                    </th>
                    {[z.standard, z.kranTransport, z.kranWork].map((v, i) => (
                      <td key={i} className="border-b border-current/25 py-3 pr-3 text-small tabular-nums">
                        {kmL(v, lang)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
