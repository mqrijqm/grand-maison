'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import PostList from '@/components/posts/PostList'
import { POSTS, postDate, postPhoto } from '@/lib/posts'
import { localizePost, postDateEn, tagLabel } from '@/lib/posts-en'
import { useLang } from '@/lib/i18n'
import Pw, { pw } from '@/components/ui/Pw'

// Vodiči (ranije "Objave"): naslov u sredini, jedna istaknuta objava preko cijele širine (crtež lijevo, tekst desno),
// pa mirna mreža ostalih. Crteži ostaju — to je jedino mjesto uz "Po namjeni" i brendove gdje ih ima.
export default function GuidesView() {
  const { t, lang } = useLang()
  const [first, ...rest] = POSTS
  const featured = localizePost(first, lang)
  return (
    <div className="pb-[16dvh]">
      <header className="px-5 pb-[10dvh] pt-[18dvh] text-center md:pt-[22dvh]">
        <h1 className="display text-[clamp(36px,11vw,190px)]"><Pw>
          {t(<>Znanje sa <em>gradilišta</em></>, <>Know-how from the <em>building site</em></>)}
        </Pw></h1>
        <p className="mx-auto mt-12 max-w-[38ch] text-[13px] text-ink/70">
          {t(
            'Od plana gradnje do izbora materijala: krenite od pitanja koje sada imate.',
            'From the build plan to choosing materials: start with the question you have right now.',
          )}
        </p>
      </header>

      <Link
        href={`/vodici/${featured.slug}`}
        className="group mx-5 grid items-center gap-10 md:mx-10 md:grid-cols-[1.25fr_1fr] md:gap-[6vw]"
        data-cursor={t('Čitaj', 'Read')}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-plate md:aspect-[16/11]">
          {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz /public, već u WebP */}
          <img decoding="async" src={postPhoto(featured.slug)} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-[var(--ease-out)] group-hover:scale-[1.03]" />
        </div>
        <div className="max-w-[540px] md:pr-[4vw]">
          <p className="label text-ink/50">{t('Najnovije', 'Latest')} · {tagLabel(featured.tag, lang)}</p>
          <h2 className="font-pretty mt-5 text-[clamp(36px,3.8vw,68px)] leading-[1.02] transition-colors duration-500 group-hover:text-signal">
            {pw(featured.title)}
          </h2>
          <p className="mt-6 max-w-[40ch] text-[12.5px] leading-[1.5] text-ink/70">{featured.lead}</p>
          <p className="mt-8 flex items-center gap-3 text-[14px] text-ink/55">
            <span className="size-1.5 rounded-full bg-signal" aria-hidden />
            {lang === 'en' ? postDateEn(featured.date) : postDate(featured.date)} · {featured.read} {t('min čitanja', 'min read')}
          </p>
        </div>
      </Link>

      <Suspense fallback={<div className="py-20 text-center text-ink/50">{t('Učitavanje…', 'Loading…')}</div>}>
        <PostList posts={rest} />
      </Suspense>
    </div>
  )
}
