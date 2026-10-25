'use client'

import { useState, type FormEvent } from 'react'
import { cartCount, cartLines, cartTotal, useShop } from '@/lib/cart'
import { COMPANY } from '@/gc/gc'
import { artikala, moneyL, qtyLabelL } from '@/lib/shop'
import { useLang } from '@/lib/i18n'
import { OpenBox } from './Reveal'
import SectionHead from './SectionHead'

const KINDS = [
  ['privatni', 'Privatni kupac', 'Private customer'],
  ['izvodjac', 'Izvođač radova', 'Contractor'],
  ['firma', 'Firma / partner', 'Company / partner'],
]

const FIELD =
  'w-full border-b-2 border-ink/40 bg-transparent py-3 text-small uppercase outline-none transition-colors duration-300 placeholder:text-ink/25 focus:border-ink'

export default function Quote() {
  const { t, lang } = useLang()
  const { cart } = useShop()
  const lines = cartLines(cart)
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Demo: forma nije povezana sa mail servisom, pa se ništa ne šalje. Potvrda to kaže otvoreno.
    setSent(true)
  }

  return (
    <section id="ponuda" data-spy className="gutter scroll-mt-[var(--bar)] py-[14dvh]">
      <SectionHead
        no="10"
        label={t('Upit', 'Enquiry')}
        title={t('Zatražite ponudu', 'Request a quote')}
        lead={t('Pošaljite predmjer ili spisak artikala. Javljamo se sa cijenom i rokom isporuke.', 'Send a bill of quantities or a list of items. We will get back to you with a price and a delivery date.')}
      />

      <OpenBox className="mt-[8dvh] border-[10px] border-ink">
        <div className="grid gap-10 p-6 md:grid-cols-12 md:gap-[3vw] md:p-[3vw]">
          {sent ? (
            <div className="flex min-h-[40dvh] flex-col items-start justify-center gap-6 md:col-span-12">
              <p className="text-title uppercase">{t('Upit nije poslan.', 'Your enquiry was not sent.')}</p>
              <p className="max-w-[46ch] text-small uppercase">
                {t('Ovo je demo prodavnica i forma još nije povezana. Pozovite', 'This is a demo shop and the form is not connected yet. Call')}{' '}
                <a href={COMPANY.phoneLandlineHref} className="underline underline-offset-4">{COMPANY.phoneLandline}</a> {t('ili pišite na', 'or write to')}{' '}
                <a href={`mailto:${COMPANY.emailInfo}`} className="underline underline-offset-4">{COMPANY.emailInfo}</a>.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="border-2 border-ink px-4 py-3.5 text-micro uppercase transition-colors duration-300 hover:bg-ink hover:text-bg"
              >
                {t('Pošalji novi upit', 'Send a new enquiry')}
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={onSubmit} className="flex flex-col gap-8 md:col-span-7">
                <div role="radiogroup" aria-labelledby="quote-kind">
                  <p id="quote-kind" className="mb-3 text-micro uppercase text-ink/60">
                    {t('Ko ste?', 'Who are you?')}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {KINDS.map(([v, sr, en], i) => (
                      <label key={v} className="cursor-pointer">
                        <input type="radio" name="kind" value={v} defaultChecked={i === 0} className="peer sr-only" />
                        <span className="block border-2 border-ink px-2 py-3 text-center text-micro uppercase transition-colors duration-300 peer-checked:bg-ink peer-checked:text-bg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                          {lang === 'en' ? en : sr}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex flex-col gap-1 text-micro uppercase">
                  <span className="text-ink/60">{t('Ime i prezime', 'Full name')}</span>
                  <input name="name" required autoComplete="name" placeholder={t('Vaše ime', 'Your name')} className={FIELD} />
                </label>

                <label className="flex flex-col gap-1 text-micro uppercase">
                  <span className="text-ink/60">{t('Telefon ili e-mail', 'Phone or email')}</span>
                  <input name="contact" required autoComplete="email" placeholder={t('Kako da vas kontaktiramo', 'How can we reach you')} className={FIELD} />
                </label>

                <label className="flex flex-col gap-1 text-micro uppercase">
                  <span className="text-ink/60">{t('Šta vam treba', 'What you need')}</span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={t('Vrsta radova, površina, rok, lokacija isporuke', 'Type of work, area, deadline, delivery location')}
                    className={`${FIELD} resize-none`}
                  />
                </label>

                <button
                  type="submit"
                  className="flex w-full items-center justify-between bg-ink px-4 py-4 text-micro uppercase text-bg transition-opacity duration-300 hover:opacity-85 md:w-auto md:min-w-[320px]"
                >
                  <span>{t('Pošalji upit (demo)', 'Send enquiry (demo)')}</span>
                  <span aria-hidden>→</span>
                </button>
              </form>

              <aside className="md:col-span-5 md:border-l-2 md:border-ink md:pl-[3vw]">
                <p className="flex justify-between text-micro uppercase">
                  <span>{t('Vaš spisak', 'Your list')}</span>
                  <span className="tabular-nums">{lines.length ? artikala(cartCount(cart), lang) : ''}</span>
                </p>
                {lines.length === 0 ? (
                  <p className="mt-4 border-t-2 border-ink pt-4 text-micro uppercase text-ink/60">
                    {t('Spisak je prazan. Dodajte artikle iz prodavnice ili opišite šta vam treba.', 'Your list is empty. Add items from the shop or describe what you need.')}
                  </p>
                ) : (
                  <>
                    <ul className="mt-4 border-t-2 border-ink">
                      {lines.map((l) => (
                        <li key={l.key} className="flex items-baseline justify-between gap-4 border-b border-ink/25 py-2.5 uppercase">
                          <span className="text-micro">
                            <span className="tabular-nums opacity-60">{qtyLabelL(l.qty, l.unit, lang)} ·</span> {lang === 'en' ? (l.nameEn ?? l.name) : l.name}
                          </span>
                          <span className="shrink-0 text-micro tabular-nums">{moneyL(l.price * l.qty, lang)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 flex items-baseline justify-between uppercase">
                      <span className="text-micro text-ink/60">{t('Orijentacioni iznos', 'Indicative total')}</span>
                      <span className="text-lead tabular-nums">{moneyL(cartTotal(cart), lang)}</span>
                    </p>
                  </>
                )}
              </aside>
            </>
          )}
        </div>
      </OpenBox>
    </section>
  )
}
