import { PRODUCTS } from '@/lib/shop'
import { OFFERINGS } from '@/lib/offerings'

// Konkretni artikli koriste postojeće specifikacije. Širi program ostaje po upitu.
// Fotografije prikazuju vrstu materijala, bez tvrdnje o stanju zaliha.
const productEntry = (sku: string, program: (typeof OFFERINGS)[number]['id']) => {
  const product = PRODUCTS.find(p => p.sku === sku)!
  const offering = OFFERINGS.find(p => p.id === program)!
  return {
    id: sku, name: product.name, program: offering.name, spec: product.spec,
    unit: product.unit, image: product.image, detail: offering.image,
    href: `/prodavnica/${sku}`,
    quote: `/upit-za-izvodjace?artikal=${sku}&program=${program}`,
    mode: 'Artikal iz kataloga', action: 'Zatražite ponudu', detailAction: 'Detalji artikla',
  }
}
const programEntry = (id: (typeof OFFERINGS)[number]['id'], spec: string) => {
  const offering = OFFERINGS.find(p => p.id === id)!
  return {
    id, name: offering.name, program: 'Program po upitu', spec,
    unit: null, image: offering.image, detail: offering.image,
    href: offering.href, quote: `/upit-za-izvodjace?program=${id}`,
    mode: 'Program po upitu', action: 'Pošaljite specifikaciju', detailAction: 'Pogledajte program',
  }
}
export const FEATURED_OFFERINGS = [
  productEntry('GKP-001', 'suha-gradnja'),
  productEntry('ISO-001', 'izolacija'),
  productEntry('CHM-003', 'veziva'),
  programEntry('drvni-program', 'Vrsta materijala, dimenzije i količine prema vašem spisku.'),
  programEntry('sanitarna-oprema', 'Pošaljite traženu opremu i specifikaciju za provjeru ponude.'),
  programEntry('zidni-krovni', 'Aktuelni program i dostupnost provjerite prema specifikaciji.'),
]
