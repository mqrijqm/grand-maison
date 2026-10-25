'use client'

import { useMemo } from 'react'
import { useLang } from '@/lib/i18n'
import { PRODUCT_MAP } from '@/lib/shop'
import { dateLocale, kmL, moneyL, n2L, numLocale, pName, tr, uName } from '@/lib/portal-i18n'

/** Jezik + formatiranje za ekrane portala (brojevi, datumi, nazivi artikala, prevod demo podataka). */
export function useFmt() {
  const { t, lang } = useLang()
  return useMemo(
    () => ({
      t,
      lang,
      L: (s: string) => tr(s, lang),
      money: (n: number) => moneyL(n, lang),
      km0: (n: number) => kmL(n, lang),
      n2: (n: number) => n2L(n, lang),
      kg: (n: number) => (n >= 1000 ? `${(n / 1000).toLocaleString(numLocale(lang), { maximumFractionDigits: 1 })} t` : `${n} kg`),
      name: (sku: string) => pName(sku, PRODUCT_MAP[sku]?.name ?? sku, lang),
      unit: (sku: string) => uName(PRODUCT_MAP[sku]?.unit ?? '', lang),
      date: (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString(dateLocale(lang), opts),
    }),
    [t, lang],
  )
}
