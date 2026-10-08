/* eslint-disable @next/next/no-img-element -- studijske fotografije iz /public, već optimizovane u WebP */

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductBuy from '@/components/catalog/ProductBuy'
import CatalogProductCard from '@/components/catalog/CatalogProductCard'
import commerce from '@/components/catalog/CatalogCommerce.module.css'
import support from '@/components/catalog/CatalogSupport.module.css'
import MotionScope from '@/components/shop/MotionScope'
import { WALL_SYSTEMS } from '@/gc/gc'
import { ARTICLE_COPY } from '@/lib/catalog-copy'
import { PRODUCTS, USES, categoryName, massLabel, qtyLabel } from '@/lib/shop'
import Pw from '@/components/ui/Pw'
import Price from '@/components/b2b/Price'

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ sku: product.sku }))
}

export async function generateMetadata({ params }: PageProps<'/prodavnica/[sku]'>): Promise<Metadata> {
  const { sku } = await params
  const product = PRODUCTS.find((item) => item.sku === sku)
  return product ? { title: `${product.name} | Grand Company`, description: product.desc } : { title: 'Artikal nije pronađen' }
}

// Stranica artikla: velika fotografija lijevo (lijepi se dok se skrola), desno ime, cijena,
// kratak opis i kupovina; ispod tanka lista podataka i artikli iz istog sistema.
export default async function ProductPage({ params }: PageProps<'/prodavnica/[sku]'>) {
  const { sku } = await params
  const product = PRODUCTS.find((item) => item.sku === sku)
  if (!product) notFound()

  const systems = WALL_SYSTEMS.filter((system) => system.skus.includes(product.sku))
  const systemSkus = new Set(systems.flatMap((s) => s.skus))
  const related = [
    ...PRODUCTS.filter((item) => item.id !== product.id && systemSkus.has(item.sku) && item.category !== product.category),
    ...PRODUCTS.filter((item) => item.id !== product.id && item.category === product.category),
  ]
    .filter((item, i, all) => all.findIndex((x) => x.id === item.id) === i)
    .slice(0, 4)

  const copy = ARTICLE_COPY[product.sku]
  const uses = USES.filter((u) => product.uses.includes(u.id))
  const specs = [
    ['Specifikacija', product.spec],
    ['Jedinica prodaje', product.unit],
    // Pakovanje se prikazuje samo gdje je veličina izražena u jedinici artikla (m²); kod vreća i
    // kutija isto piše u specifikaciji ("Vreća 5 kg"), pa se ne ponavlja.
    ...(product.pack && product.unit === 'm²' ? [['Pakovanje', `${qtyLabel(product.pack.size, product.unit)} — 1 ${product.pack.name}`]] : []),
    ['Masa', massLabel(product)],
    ['Brend', product.brand],
    ...(systems.length ? [['Sistemi', systems.map((s) => s.code).join(', ')]] : []),
    ['Šifra', product.sku],
  ]

  return (
    <MotionScope>
      <section className="grid md:-mt-16 md:grid-cols-2">
        <div className="md:sticky md:top-0 md:h-svh md:self-start">
          <div className="shot h-[min(120vw,80svh)] md:h-full" data-curtain data-float>
            <img decoding="async" src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          </div>
        </div>

        <div className="flex flex-col justify-center px-5 py-16 md:min-h-svh md:px-[6vw] md:py-[16vh]">
          <nav className="fade-up text-[13px] opacity-60" aria-label="Putanja">
            <Link href="/prodavnica" className="ulink">
              Katalog
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/prodavnica?kategorija=${product.category}#artikli`} className="ulink">
              {categoryName(product.category)}
            </Link>
          </nav>

          <h1 className="display fade-up mt-6 text-[clamp(38px,4.6vw,84px)] !leading-[1]" style={{ animationDelay: '0.08s' }}><Pw>
            {product.name}
          </Pw></h1>

          <p className="fade-up mt-6 text-[clamp(22px,1.8vw,30px)] tabular-nums" style={{ animationDelay: '0.16s' }}>
            <Price value={product.price} unit={product.unit} /> <span className="text-[0.6em] opacity-50">sa PDV-om · orijentaciono</span>
          </p>

          <p className="fade-up mt-8 max-w-[44ch] text-[13px] leading-[1.55] opacity-80" style={{ animationDelay: '0.24s' }}>
            {copy?.lead ?? product.desc}
          </p>

          <div className="fade-up mt-10" style={{ animationDelay: '0.32s' }}>
            <ProductBuy product={product} />
          </div>

          <dl className="mt-14 max-w-[520px] text-[14px]" data-up>
            {specs.map(([term, value]) => (
              <div key={term} className="grid grid-cols-[8.5rem_1fr] gap-4 border-t border-ink/15 py-3">
                <dt className="opacity-50">{term}</dt>
                <dd className="min-w-0 break-words normal-case">{value}</dd>
              </div>
            ))}
          </dl>

          <div className={support.productHelp}>
            <Link href={`/upit-za-izvodjace?artikal=${product.sku}&vrsta=dokumentacija`}>Zatražite tehnički list ovog artikla <span aria-hidden>↗</span></Link>
            <Link href="/dostava">Provjerite dostavu i preuzimanje <span aria-hidden>↗</span></Link>
          </div>


          {uses.length > 0 && (
            <p className="mt-8 flex flex-wrap gap-x-5 gap-y-1 text-[14px]" data-up>
              <span className="opacity-50">Za radove:</span>
              {uses.map((u) => (
                <span key={u.id}>{u.name}</span>
              ))}
            </p>
          )}
        </div>
      </section>

      {copy && (
        <section className="gutter border-t border-ink/15 py-[12vh]" aria-labelledby="about-product">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-[6vw]">
            <div>
              <p className="label opacity-55" data-up>O artiklu</p>
              <h2 id="about-product" className="display mt-5 text-[clamp(30px,4vw,64px)] !leading-[0.98]" data-up><Pw>Šta je i kako se koristi</Pw></h2>
            </div>
            <div data-up>
              {copy.body.map((paragraph) => (
                <p key={paragraph} className="mb-5 max-w-[62ch] text-[14px] leading-[1.75] opacity-80 normal-case">{paragraph}</p>
              ))}
              <div className="mt-10 grid gap-8 border-t border-ink/15 pt-8 sm:grid-cols-3">
                {([['Gdje se koristi', copy.uses], ['Najčešće uz', copy.together]] as const).map(([title, items]) => (
                  <div key={title}>
                    <h3 className="label opacity-50">{title}</h3>
                    <ul className="mt-3 grid gap-2 text-[13px] leading-[1.5] normal-case">
                      {items.map((item) => (
                        <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-cobalt">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div>
                  <h3 className="label opacity-50">Savjet s gradilišta</h3>
                  <p className="mt-3 text-[13px] leading-[1.6] normal-case opacity-85">{copy.tip}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="gutter py-[18vh]">
          <h2 className="display text-[clamp(30px,4.1vw,68px)]" data-up><Pw>
            {systems.length ? (
              <>
                Iz istog <em>sistema</em>
              </>
            ) : (
              <>
                Iz iste <em>kategorije</em>
              </>
            )}
          </Pw></h2>
          <div className={`mt-10 ${commerce.grid}`}>
            {related.map((item) => (
              <CatalogProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </MotionScope>
  )
}
