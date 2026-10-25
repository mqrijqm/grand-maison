'use client'

/* eslint-disable @next/next/no-img-element -- fotografije iz /public, već u WebP */

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { POST_TAGS, postDate, postPhoto, type Post } from '@/lib/posts'
import { pw } from '@/components/ui/Pw'
import { useLang } from '@/lib/i18n'
import { localizePost, postDateEn, tagLabel } from '@/lib/posts-en'

// Filter po temi (tihi tekstualni izbor u sredini) i mreža objava sa crtežom na polju boje papira.
export default function PostList({ posts: source }: { posts: Post[] }) {
  const { t, lang } = useLang()
  const posts = source.map((post) => localizePost(post, lang))
  const search = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const tag = search.get('tema') ?? 'sve'
  const shown = tag === 'sve' ? posts : posts.filter((post) => post.tag === tag)

  const setTag = (value: string) => {
    const query = new URLSearchParams(search.toString())
    if (value === 'sve') query.delete('tema')
    else query.set('tema', value)
    router.replace(`${pathname}${query.size ? `?${query}` : ''}`, { scroll: false })
  }

  const tags = ['sve', ...POST_TAGS]

  return (
    <section className="mt-[18dvh]">
      <div role="tablist" aria-label={t('Tema', 'Topic')} className="flex flex-wrap justify-center gap-x-8 gap-y-3 px-5 text-[12.5px] max-md:gap-x-6 max-md:pl-8 max-md:flex-nowrap max-md:justify-start max-md:overflow-x-auto max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden max-md:[&>*]:shrink-0 max-md:[&>*]:whitespace-nowrap max-md:[&>*]:min-h-10">
        {tags.map((item) => {
          const on = tag === item
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setTag(item)}
              className={`relative flex items-center gap-2 transition-colors ${on ? 'italic text-ink' : 'text-ink/50 hover:text-ink'}`}
            >
              <span className={`size-1.5 rounded-full bg-signal transition-transform duration-500 ${on ? 'scale-100' : 'scale-0'}`} aria-hidden />
              {item === 'sve' ? t('Sve teme', 'All topics') : tagLabel(item as Post['tag'], lang)}
            </button>
          )
        })}
      </div>

      <div className="mt-[8dvh] grid gap-x-8 gap-y-20 px-5 md:grid-cols-2 md:px-10 xl:grid-cols-3">
        {shown.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/vodici/${post.slug}`} className="block" data-cursor={t('Čitaj', 'Read')}>
              <div className="relative aspect-[4/3] overflow-hidden bg-plate">
                <img decoding="async"
                  src={postPhoto(post.slug)}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-6 text-[14px] text-ink/50">
                {tagLabel(post.tag, lang)} · {post.read} min
              </p>
              <h2 className="font-pretty mt-2 max-w-[22ch] text-[clamp(26px,2.2vw,36px)] leading-[1.1] transition-colors duration-500 group-hover:text-signal">
                {pw(post.title)}
              </h2>
              <p className="sr-only">{lang === 'en' ? postDateEn(post.date) : postDate(post.date)}</p>
            </Link>
          </article>
        ))}
      </div>
      {!shown.length && <p className="mt-16 text-center text-ink/50">{t('Nema objava za ovu temu.', 'No guides on this topic yet.')}</p>}
    </section>
  )
}
