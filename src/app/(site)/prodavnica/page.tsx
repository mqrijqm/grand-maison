import { Suspense } from 'react'
import CatalogBrowser from '@/components/catalog/CatalogBrowser'
import CatalogProjectQuote from '@/components/catalog/CatalogProjectQuote'
import Pw from '@/components/ui/Pw'

export const metadata = {
  title: 'Katalog | Grand Company',
  description: 'Katalog građevinskog materijala: suha gradnja, izolacija i fasade, veziva, pribor, zidanje i krov, drvni program i sanitarna oprema. Pretraga, filteri i ponuda po upitu.',
}

// Kategorije pa jedna lepeza malih kartica sa pretragom i filterima. Opširan opis artikla je na njegovoj stranici.
export default function CataloguePage() {
  return (
    <>
      <header className="gutter pb-[8vh] pt-[16vh] text-center">
        <h1 className="display fade-up text-display"><Pw>
          Kata<em>log</em>
        </Pw></h1>
      </header>

      <Suspense fallback={<div className="min-h-screen" />}>
        <CatalogBrowser />
      </Suspense>

      <div aria-hidden className="h-[14vh]" />
      <CatalogProjectQuote />

      <div aria-hidden className="h-[22vh]" />
    </>
  )
}
