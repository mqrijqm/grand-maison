import { Suspense } from 'react'
import CatalogPartner from '@/components/catalog/CatalogPartner'
import CatalogShop from '@/components/catalog/CatalogShop'

export const metadata = {
  title: 'Katalog | Grand Company',
  description: 'Katalog građevinskog materijala: suha gradnja, izolacija i fasade, veziva, pribor, zidanje i krov, drvni program i sanitarna oprema. Pretraga, filteri i ponuda po upitu.',
}

// Plavi vrh sa pretragom i kategorijama, mreža svedenih kartica, pa kratak poziv firmama.
// Opis i detalji artikla su na njegovoj stranici.
export default function CataloguePage() {
  return (
    <div className="bg-white">
      <Suspense fallback={<div className="min-h-screen bg-cobalt" />}>
        <CatalogShop />
      </Suspense>
      <CatalogPartner />
    </div>
  )
}
