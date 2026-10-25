'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'

// Dvojezičan sajt (SR / EN) bez posebnih ruta: izabrani jezik čuva se u localStorage i u html[lang].
// Server i prvi klijentski kadar uvijek crtaju srpski (da se hidratacija poklopi), pa se odmah
// po učitavanju prebaci na sačuvani izbor.
//
// Upotreba:
//   const { t, lang } = useLang();   t('Asortiman', 'Range')        — u klijentskim komponentama
//   <T sr="Asortiman" en="Range" />                                  — i u serverskim komponentama
//   const label = tl({ sr: '…', en: '…' }, lang)                     — za podatke u lib/*.ts
export type Lang = 'sr' | 'en'
export type L10n<T = string> = { sr: T; en: T }

const KEY = 'gc-lang'
const EVENT = 'gc:lang'

function read(): Lang {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'sr'
  } catch {
    return 'sr'
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: <T = string>(sr: T, en: T) => T }
const LangContext = createContext<Ctx>({ lang: 'sr', setLang: () => {}, t: (sr) => sr })

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, read, () => 'sr' as Lang)
  const setLang = useCallback((l: Lang) => {
    try {
      localStorage.setItem(KEY, l)
    } catch {}
    window.dispatchEvent(new Event(EVENT))
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'bs'
  }, [lang])
  const value = useMemo<Ctx>(() => ({ lang, setLang, t: (sr, en) => (lang === 'en' ? en : sr) }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

// Tekst u serverskim komponentama (ili bilo gdje gdje ne želiš hook).
export function T({ sr, en }: { sr: ReactNode; en: ReactNode }) {
  const { lang } = useLang()
  return <>{lang === 'en' ? en : sr}</>
}

// Izbor jezika iz para { sr, en } (podaci u lib/*.ts koji nisu komponente).
export function tl<V>(v: L10n<V>, lang: Lang): V {
  return lang === 'en' ? v.en : v.sr
}
