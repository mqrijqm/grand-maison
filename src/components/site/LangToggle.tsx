'use client'

import { useLang } from '@/lib/i18n'

// Mali SR / EN preklopnik: aktivni jezik je pun, drugi prigušen. Jedan klik mijenja jezik cijelog sajta.
export default function LangToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang()
  return (
    <div className={`lang ${className}`} role="group" aria-label={lang === 'en' ? 'Language' : 'Jezik'}>
      {(['sr', 'en'] as const).map((l, i) => (
        <span key={l} className="lang__item">
          {i > 0 && <i aria-hidden />}
          <button type="button" onClick={() => setLang(l)} aria-pressed={lang === l} lang={l === 'en' ? 'en' : 'sr'} className={lang === l ? 'is-on' : ''}>
            {l}
          </button>
        </span>
      ))}
    </div>
  )
}
