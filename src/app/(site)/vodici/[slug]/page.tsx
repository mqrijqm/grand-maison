import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleView from '@/components/posts/ArticleView'
import { POSTS, postBySlug } from '@/lib/posts'

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps<'/vodici/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = postBySlug(slug)
  return post
    ? { title: `${post.title} | Grand Company`, description: post.lead }
    : { title: 'Objava nije pronađena' }
}

// Tekst članka je u klijentskoj komponenti (SR/EN prekidač); ovdje ostaju rute i metadata.
export default async function ArticlePage({ params }: PageProps<'/vodici/[slug]'>) {
  const { slug } = await params
  if (!postBySlug(slug)) notFound()
  return <ArticleView slug={slug} />
}
