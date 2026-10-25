'use client'

import { useLang } from '@/lib/i18n'

// Cijena artikla. Javnog cjenovnika nema, pa se umjesto iznosa svuda prikazuje "Cijena na upit"
// (katalog, stranica artikla, korpa). Props ostaju isti da pozivi ne moraju da se mijenjaju.
export default function Price({ className = '' }: { value?: number; qty?: number; unit?: string; className?: string }) {
  const { t } = useLang()
  return <span className={className}>{t('Cijena na upit', 'Price on request')}</span>
}
