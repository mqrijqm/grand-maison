'use client'

import { Fragment } from 'react'
import { LABELS_EN, TERMS, TERMS_EN, parseText, type TextPart } from '@/lib/company'
import { useLang } from '@/lib/i18n'

// Tekst sa oznakama iz company.ts: {sjediste} → vrijednost (ili istaknuta oznaka ako je nepoznata), *kurziv*.
// Na engleskom se oznake koje su na srpskom (rok isporuke, područje dostave, rok za odustanak, nazivi
// nepoznatih podataka) zamjenjuju engleskim vrijednostima.
// (grand-root components/shop/parts.tsx → T)
function partsFor(s: string, lang: 'sr' | 'en'): TextPart[] {
  if (lang !== 'en') return parseText(s)
  return s.split(/(\{\w+\})/).flatMap((chunk): TextPart[] => {
    const m = /^\{(\w+)\}$/.exec(chunk)
    if (!m) return parseText(chunk)
    const key = m[1]
    if (key === 'rokIsporuke') return [{ text: TERMS_EN.deliveryDays, kind: 'plain' }]
    if (key === 'zonaDostave') return [{ text: TERMS_EN.deliveryZone, kind: 'plain' }]
    if (key === 'rokOdustanka' && TERMS.withdrawalDays) return [{ text: `${TERMS.withdrawalDays} days`, kind: 'plain' }]
    const parsed = parseText(chunk)
    return parsed.map((p) => (p.kind === 'missing' ? { text: `[${LABELS_EN[key] ?? key}]`, kind: 'missing' as const } : p))
  })
}

export function T({ s }: { s: string }) {
  const { lang, t } = useLang()
  return (
    <>
      {partsFor(s, lang).map((p, i) =>
        p.kind === 'em' ? (
          <em key={i}>{p.text}</em>
        ) : p.kind === 'missing' ? (
          <span key={i} className="rounded-[2px] bg-plate px-1 text-signal" title={t('Podatak nije poznat, dopuniti prije objave', 'Information not yet known, to be completed before publication')}>
            {p.text}
          </span>
        ) : (
          <Fragment key={i}>{p.text}</Fragment>
        ),
      )}
    </>
  )
}
