'use client'

/* eslint-disable @next/next/no-img-element -- studijske fotografije iz /public, već optimizovane u WebP */

import Link from 'next/link'
import ProductBuy from '@/components/catalog/ProductBuy'
import CatalogProductCard from '@/components/catalog/CatalogProductCard'
import commerce from '@/components/catalog/CatalogCommerce.module.css'
import support from '@/components/catalog/CatalogSupport.module.css'
import MotionScope from '@/components/shop/MotionScope'
import { WALL_SYSTEMS } from '@/gc/gc'
import { ARTICLE_COPY } from '@/lib/catalog-copy'
import { ARTICLE_COPY_EN } from '@/lib/catalog-copy-en'
import { useLang } from '@/lib/i18n'
import { PRODUCTS, USES, categoryName, massLabelL, packNameL, pDesc, pName, pSpec, qtyLabelL, unitL, workName } from '@/lib/shop'
import Pw from '@/components/ui/Pw'
import Price from '@/components/b2b/Price'

// Stranica artikla: velika fotografija lijevo (lijepi se dok se skrola), desno ime, cijena,
// kratak opis i kupovina; ispod tanka lista podataka i artikli iz istog sistema.
// Klijentska komponenta, da tekstovi (uključujući aria atribute) prate izabrani jezik.
export default function ProductDetail({ sku }: { sku: string }) {
  const { t, lang } = useLang()
  const en = lang === 'en'
  const product = PRODUCTS.find((item) => item.sku === sku)
  if (!product) return null

  const systems = WALL_SYSTEMS.filter((system) => system.skus.includes(product.sku))
  const systemSkus = new Set(systems.flatMap((s) => s.skus))
  const related = [
    ...PRODUCTS.filter((item) => item.id !== product.id && systemSkus.has(item.sku) && item.category !== product.category),
    ...PRODUCTS.filter((item) => item.id !== product.id && item.category === product.category),
  ]
    .filter((item, i, all) => all.findIndex((x) => x.id === item.id) === i)
    .slice(0, 4)

  const copy = en ? (ARTICLE_COPY_EN[product.sku] ?? ARTICLE_COPY[product.sku]) : ARTICLE_COPY[product.sku]
  const uses = USES.filter((u) => product.uses.includes(u.id))
  const name = pName(product, lang)
  const specs: [string, string][] = [
    [t('Specifikacija', 'Specification'), pSpec(product, lang)],
    [t('Jedinica prodaje', 'Sales unit'), unitL(product.unit, lang)],
    // Pakovanje se prikazuje samo gdje je veličina izražena u jedinici artikla (m²); kod vreća i
    // kutija isto piše u specifikaciji ("Vreća 5 kg"), pa se ne ponavlja.
    ...(product.pack && product.unit === 'm²' ? [[t('Pakovanje', 'Pack'), `${qtyLabelL(product.pack.size, product.unit, lang)} — 1 ${packNameL(product.pack.name, lang)}`] as [string, string]] : []),
    [t('Masa', 'Weight'), massLabelL(product, lang)],
    // Javni izvori potvrđuju sistem suhe gradnje i kamenu vunu, ne pojedinačne artikle.
    [t('Brend', 'Brand'), t('Primjer artikla, proizvođača potvrđuje prodaja', 'Sample item; sales confirms the manufacturer')],
    [t('Šifra', 'Code'), product.sku],
  ]

  return (
    <MotionScope>
      <section className="grid md:-mt-16 md:grid-cols-2">
        <div className="md:sticky md:top-0 md:h-svh md:self-start">
          <div className="shot h-[min(120vw,80svh)] md:h-full" data-curtain data-float>
            <img decoding="async" src={product.image} alt={name} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          </div>
        </div>

        <div className="flex flex-col justify-center px-5 py-16 md:min-h-svh md:px-[6vw] md:py-[16vh]">
          <nav className="fade-up text-[13px] opacity-60" aria-label={t('Putanja', 'Breadcrumb')}>
            <Link href="/prodavnica" className="ulink">
              {t('Katalog', 'Catalogue')}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/prodavnica?kategorija=${product.category}#artikli`} className="ulink">
              {categoryName(product.category, lang)}
            </Link>
          </nav>

          <h1 className="display fade-up mt-6 text-[clamp(38px,4.6vw,84px)] !leading-[1]" style={{ animationDelay: '0.08s' }}><Pw>
            {name}
          </Pw></h1>

          <p className="fade-up mt-6 text-[clamp(22px,1.8vw,30px)] tabular-nums" style={{ animationDelay: '0.16s' }}>
            <Price /> <span className="text-[0.6em] opacity-50">· {t('pošaljite upit za ponudu', 'send an enquiry for a quote')}</span>
          </p>

          <p className="fade-up mt-8 max-w-[44ch] text-[13px] leading-[1.55] opacity-80" style={{ animationDelay: '0.24s' }}>
            {copy?.lead ?? pDesc(product, lang)}
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
            <Link href={`/upit-za-izvodjace?artikal=${product.sku}&vrsta=dokumentacija`}>{t('Zatražite tehnički list ovog artikla', 'Request the datasheet for this item')} <span aria-hidden>↗</span></Link>
            <Link href="/dostava">{t('Provjerite dostavu i preuzimanje', 'Check delivery and pickup')} <span aria-hidden>↗</span></Link>
          </div>


          {uses.length > 0 && (
            <p className="mt-8 flex flex-wrap gap-x-5 gap-y-1 text-[14px]" data-up>
              <span className="opacity-50">{t('Za radove', 'For work on')}:</span>
              {uses.map((u) => (
                <span key={u.id}>{workName(u.id, lang)}</span>
              ))}
            </p>
          )}
        </div>
      </section>

      {copy && (
        <section className="gutter border-t border-ink/15 py-[12vh]" aria-labelledby="about-product">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-[6vw]">
            <div>
              <p className="label opacity-55" data-up>{t('O artiklu', 'About the item')}</p>
              <h2 id="about-product" className="display mt-5 text-[clamp(30px,4vw,64px)] !leading-[0.98]" data-up><Pw>{t('Šta je i kako se koristi', 'What it is and how to use it')}</Pw></h2>
            </div>
            <div data-up>
              {copy.body.map((paragraph) => (
                <p key={paragraph} className="mb-5 max-w-[62ch] text-[14px] leading-[1.75] opacity-80 normal-case">{paragraph}</p>
              ))}
              <div className="mt-10 grid gap-8 border-t border-ink/15 pt-8 sm:grid-cols-3">
                {([[t('Gdje se koristi', 'Where it is used'), copy.uses], [t('Najčešće uz', 'Often used with'), copy.together]] as const).map(([title, items]) => (
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
                  <h3 className="label opacity-50">{t('Savjet s gradilišta', 'Tip from the site')}</h3>
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
              en ? (
                <>
                  From the same <em>system</em>
                </>
              ) : (
                <>
                  Iz istog <em>sistema</em>
                </>
              )
            ) : en ? (
              <>
                From the same <em>category</em>
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
