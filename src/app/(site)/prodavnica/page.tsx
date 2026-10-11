import { Suspense } from 'react'
import CatalogPartner from '@/components/catalog/CatalogPartner'
import CatalogMarkets from '@/components/catalog/CatalogMarkets'
import CatalogShop from '@/components/catalog/CatalogShop'

export const metadata = {
  title: 'Katalog | Grand Company',
  description: 'Katalog građevinskog materijala sa stovarišta u Banjoj Luci: krovni sistemi (Tondach), zidni blokovi (Porotherm), malteri i ljepila (Baumalt), suha gradnja i izolacija. Cijene i dostupnost po upitu.',
}

// Uvod sa trakom kartica kategorija (po uzoru na lpas.com), pa plava traka sa pretragom, mreža artikala
// i kratak poziv firmama.
// Opis i detalji artikla su na njegovoj stranici.
export default function CataloguePage() {
  return (
    <div className="bg-white">
      <CatalogMarkets />
      <Suspense fallback={<div className="min-h-screen bg-cobalt" />}>
        <CatalogShop compact />
      </Suspense>
      <CatalogPartner />
    </div>
  )
}
