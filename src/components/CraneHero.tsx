'use client'

import { Fragment, useEffect, useRef } from 'react'
import { useLang } from '@/lib/i18n'

declare global {
  interface Window {
    /** Ručka koju ostavlja public/crane/crane-hero.js da bi scena mogla da se ugasi. */
    __gcCrane?: { dispose: () => void } | null
    /** Rano pokretanje scene na direktnom dolasku na početnu. */
    __gcCraneBoot?: Promise<unknown> | null
    /** Slab uređaj ili rani skrol: ne pokušavaj ponovo tešku 3D scenu. */
    __gcCraneAbort?: boolean
    /** Da li je 3D scena spremna. Uvodni splash čeka ovaj flag prije nego pusti animaciju. */
    __gcCraneReady?: boolean
  }
}

// 3D scena krana (Three.js) je preuzeta sa grandcompany sajta i stoji u public/crane/.
// Učitava se kao ES modul iz `public` foldera, a ne kroz bundler: tako moduli zadržavaju
// iste relativne putanje do Three.js-a i ne ulaze u JS bundle ostatka sajta.
const SCRIPT = '/crane/crane-hero.js'

// Rečenica koja se na kraju hero-a (kad kamera izađe kroz prozor i vidi se opet nebo)
// polako ispisuje, slovo po slovo. Skrol je vozi: scena postavlja `--type-p` (0..1) na sekciju,
// a svako slovo ima svoj prag `--th` i pojavi se (mekano) tačno kad skrol stigne dotle.
const PHRASES = {
  sr: 'Građevinski materijal za profesionalce. Veleprodaja. Dostava po Banjoj Luci.',
  en: 'Building materials for professionals. Wholesale. Delivery across Banja Luka.',
}
// Demo font nema slova sa dijakriticima: ispisujemo osnovno slovo iz fonta, a znak iznad
// (kvačicu/akcenat) dodaje CSS. Kad se kupi puna verzija fonta, ovo se može isključiti.
const DEMO_FONT_WITHOUT_DIACRITICS = false
const MARKS: Record<string, [string, string]> = {
  š: ['s', 'ˇ'], č: ['c', 'ˇ'], ž: ['z', 'ˇ'], ć: ['c', '´'], đ: ['d', '-'],
}
// Slova se drže u rečima (nowrap), da se reč nikad ne prelomi usred slova na uskom ekranu.
function buildGlyphs(phrase: string) {
  const total = [...phrase].length
  let cursor = 0
  return phrase.split(' ').map((word) => {
    const glyphs = [...word].map((glyph) => {
      const mark = DEMO_FONT_WITHOUT_DIACRITICS ? MARKS[glyph] : undefined
      return { glyph: mark ? mark[0] : glyph, mark: mark?.[1], th: (cursor++ / total) * 0.94 }
    })
    cursor++ // razmak iza reči
    return glyphs
  })
}
const GLYPHS = { sr: buildGlyphs(PHRASES.sr), en: buildGlyphs(PHRASES.en) }

// Scena se pinuje; sve na njoj je štampa u tačkama (kobalt mastilo na papiru) koja mijenja boju
// i raster po poglavljima. Ostatak visine je prazan prostor (story-immersion) kroz koji se
// animacija krana odigra.
export default function CraneHero() {
  const { lang } = useLang()
  const PHRASE = PHRASES[lang]
  const WORD_GLYPHS = GLYPHS[lang]
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    let script: HTMLScriptElement | null = null
    let safety = 0
    // 3D scena radi i na telefonu (crane-quality.js tamo spušta rezoluciju). Statična slika ostaje
    // samo uz sistemsko "smanji pokrete" ili na stvarno slabom uređaju (≤ 2 jezgra ili ≤ 2 GB RAM-a).
    const nav = navigator as Navigator & { deviceMemory?: number }
    const lowEnd = (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory || 8) <= 2
    const reducedMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const staticMedia = { get matches() { return lowEnd || reducedMedia.matches } }
    const fallback = () => {
      if (staticMedia.matches || window.__gcCraneReady || window.__gcCraneAbort) return
      window.__gcCraneAbort = true
      window.__gcCrane?.dispose()
      script?.remove()
      script = null
      root.current?.classList.add('crane-static')
      window.__gcCraneReady = true
      window.dispatchEvent(new CustomEvent('gc:crane-ready'))
    }
    const start = () => {
      if (staticMedia.matches || window.__gcCraneAbort || window.__gcCraneBoot || script) return
      script = document.createElement('script')
      script.type = 'module'
      // Nova montaža mora ponovo izvršiti modul poslije klijentske navigacije.
      script.src = `${SCRIPT}?m=${Date.now()}`
      document.body.appendChild(script)
      // Sporiji laptopi na mreži znaju trebati više od 9 s (three.js + šejderi); prerano odustajanje
      // je ostavljalo hero kao statičnu sliku.
      safety = window.setTimeout(fallback, 25000)
    }
    const updateMode = () => {
      if (staticMedia.matches) {
        root.current?.classList.add('crane-static')
        window.__gcCrane?.dispose()
        script?.remove()
        script = null
        window.clearTimeout(safety)
        window.__gcCraneBoot = null
        window.__gcCraneReady = true
        window.dispatchEvent(new CustomEvent('gc:crane-ready'))
      } else if (window.__gcCraneAbort) {
        root.current?.classList.add('crane-static')
        window.__gcCraneReady = true
      } else {
        root.current?.classList.remove('crane-static')
        if (!root.current?.classList.contains('crane-ready')) window.__gcCraneReady = false
        start()
      }
    }
    updateMode()
    reducedMedia.addEventListener('change', updateMode)
    window.addEventListener('gc:crane-boot-failed', start)
    const onReady = () => window.clearTimeout(safety)
    window.addEventListener('gc:crane-ready', onReady)

    return () => {
      window.clearTimeout(safety)
      window.removeEventListener('gc:crane-ready', onReady)
      reducedMedia.removeEventListener('change', updateMode)
      window.removeEventListener('gc:crane-boot-failed', start)
      script?.remove()
      window.__gcCrane?.dispose()
      window.__gcCraneBoot = null
      window.__gcCraneReady = false
    }
  }, [])

  return (
    <>
      {/* Prazan pojas: scena počinje tačno ispod fiksnog wordmarka. */}
      <div className="story-spacer" aria-hidden />

      <section id="hero" ref={root} className="construction-story">
        <div className="crane-stage" aria-hidden="true">
          {/* Prvi kadar je slika iste scene: kran se vidi odmah, a WebGL se meko pojavi preko nje. */}
          <figure className="crane-viewport">
            <picture className="crane-fallback">
              <source media="(max-width: 599px)" srcSet="/crane/hero-fallback-780.webp" />
              <source media="(max-width: 1023px)" srcSet="/crane/hero-fallback-768.webp" />
              <source media="(min-width: 1920px)" srcSet="/crane/hero-fallback-2560.webp" />
              <img src="/crane/hero-fallback-1440.webp" alt="" width={1440} height={900} fetchPriority="high" decoding="async" />
            </picture>
            <canvas suppressHydrationWarning />
          </figure>

          <div className="scene-caption">
            <span className="scene-meter">
              <i />
            </span>
          </div>

          <p key={lang} className="story-type">
            {WORD_GLYPHS.map((glyphs, w) => (
              <Fragment key={w}>
                {w > 0 ? ' ' : null}
                <span className="story-word">
                  {glyphs.map(({ glyph, mark, th }, i) => (
                    // Pragovi idu do 0.94; slovo se otkriva preko ~0.06, pa je sve gotovo do 1.
                    <span
                      key={i}
                      className={mark ? 'story-mark' : undefined}
                      data-mark={mark}
                      style={{ '--th': th.toFixed(4) } as React.CSSProperties}
                    >
                      {glyph}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </p>
        </div>

        <div className="story-content">
          {/* Scena je aria-hidden, pa rečenicu iznosimo i kao pravi tekst za čitače ekrana. */}
          <p className="sr-only">{PHRASE}</p>
          <section className="story-section story-opening">

          </section>

          <div className="story-immersion" aria-hidden="true" />
          {/* Dodatni skrol na kraju: scena ostaje pinovana na nebu dok se rečenica ispisuje,
              pa još kratko miruje da se ne "proleti" pored nje. Scena ga isključuje iz svog računa. */}
          <div className="story-outro" aria-hidden="true" />
        </div>
      </section>
    </>
  )
}
