import { gsap, SplitText } from './gsap'
import { EASE } from './motion'

// Nijanse sive za ploče koje zamjenjuju fotografije.
export const TONES = ['#d7d9dd', '#cbcdd2', '#dcdee1', '#c2c5ca', '#d2d4d8']

const OPEN = 'inset(0% 0% 0% 0%)'
const CLOSED = 'inset(0% 50% 0% 50%)'

// Otvaranje sive ploče: clip-path krene od srednje linije, a unutrašnjost se smiruje sa zuma 1.2 na 1.
// Uvijek fromTo: browser sažima inset(a b a b) u inset(a b), pa bi `to` pročitao pogrešan broj vrijednosti.
export function revealMedia(media: Element, reduce: boolean, start = 'top bottom') {
  const scale = media.querySelector('[data-scale]')
  if (reduce) {
    gsap.set(media, { clipPath: OPEN })
    return
  }
  gsap.fromTo(
    media,
    { clipPath: CLOSED },
    {
      clipPath: OPEN,
      duration: 0.35,
      ease: EASE.out,
      scrollTrigger: { trigger: media, start },
    },
  )
  if (scale) {
    gsap.fromTo(
      scale,
      { scale: 1.06 },
      { scale: 1, duration: 0.5, ease: EASE.out, force3D: true, scrollTrigger: { trigger: media, start } },
    )
  }
}

// Paragraf po redovima: svaki red izranja iz maske. `autoSplit` ponovo dijeli tekst kad se promijeni širina ili font.
export function revealLines(el: Element, reduce: boolean, start = 'top 88%') {
  SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'ln',
    autoSplit: true,
    onSplit(self) {
      gsap.set(el, { visibility: 'visible' })
      if (reduce) return
      return gsap.from(self.lines, {
        yPercent: 120,
        duration: 0.6,
        ease: EASE.quint,
        stagger: 0.04,
        scrollTrigger: { trigger: el, start },
      })
    },
  })
}

// Telefon i tablet: isti pokret maske, ali po riječima. Podjela na slova pravi stotine elemenata i za svaki
// GSAP čita stil (getComputedStyle), pa se na sporijem telefonu stranica zamrzne na učitavanju.
const TOUCH = '(hover: none), (pointer: coarse), (max-width: 1023px)'

// Kratki naslovi slovo po slovo (desktop) ili riječ po riječ (telefon). Riječi se ne lome usred riječi.
export function revealChars(el: Element, reduce: boolean, start = 'top 88%', trigger: Element = el) {
  if (!reduce && window.matchMedia(TOUCH).matches) {
    const words = SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'wd' })
    gsap.set(el, { visibility: 'visible' })
    gsap.from(words.words, { yPercent: 120, duration: 0.55, ease: EASE.quint, stagger: 0.05, scrollTrigger: { trigger, start } })
    return words
  }
  const split = SplitText.create(el, { type: 'words,chars', mask: 'chars', charsClass: 'ch' })
  gsap.set(el, { visibility: 'visible' })
  if (reduce) return split
  gsap.from(split.chars, {
    yPercent: 120,
    duration: 0.5,
    ease: EASE.quint,
    stagger: 0.012,
    scrollTrigger: { trigger, start },
  })
  return split
}
