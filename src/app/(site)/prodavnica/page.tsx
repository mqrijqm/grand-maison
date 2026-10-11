import { Suspense } from 'react'
import CatalogPartner from '@/components/catalog/CatalogPartner'
import CatalogMarkets from '@/components/catalog/CatalogMarkets'
import CatalogBrowse from '@/components/catalog/CatalogBrowse'

export const metadata = {
  title: 'Katalog | Grand Company',
  description: 'Katalog građevinskog materijala sa stovarišta u Banjoj Luci: krovni sistemi (Tondach), zidni blokovi (Porotherm), malteri i ljepila (Baumalt), suha gradnja i izolacija. Cijene i dostupnost po upitu.',
}

// Uvod sa trakom kartica kategorija (po uzoru na lpas.com), pa katalog po proizvođačima (UI i UX po uzoru
// na mtponos.studioblink.ba/asortiman) i kratak poziv firmama.
// Opis i detalji artikla su na njegovoj stranici.
export default function CataloguePage() {
  return (
    <div className="bg-white">
      <CatalogMarkets />
      <Suspense fallback={<div id="artikli" className="min-h-screen bg-white" />}>
        <CatalogBrowse />
      </Suspense>
      <CatalogPartner />
    </div>
  )
}
