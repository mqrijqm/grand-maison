import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/catalog/ProductDetail'
import { PRODUCTS } from '@/lib/shop'

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ sku: product.sku }))
}

// Metapodaci se generišu na serveru (jedan jezik): srpski. Tekst same stranice prati izabrani jezik.
export async function generateMetadata({ params }: PageProps<'/prodavnica/[sku]'>): Promise<Metadata> {
  const { sku } = await params
  const product = PRODUCTS.find((item) => item.sku === sku)
  return product ? { title: `${product.name} | Grand Company`, description: product.desc } : { title: 'Artikal nije pronađen' }
}

// Stranica artikla (sadržaj je u components/catalog/ProductDetail, klijentska komponenta zbog prevoda).
export default async function ProductPage({ params }: PageProps<'/prodavnica/[sku]'>) {
  const { sku } = await params
  const product = PRODUCTS.find((item) => item.sku === sku)
  if (!product) notFound()
  return <ProductDetail sku={product.sku} />
}
