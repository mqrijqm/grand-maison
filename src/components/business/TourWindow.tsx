'use client'

import { useEffect, useRef, useState } from 'react'
import Icon from '@/components/portal/Icon'
import s from './TourWindow.module.css'

// Jedan stalni prozor portala za objašnjenje "ekran po ekran". Namjerno svedeno: ostatak ekrana su
// sivi blokovi, a pravi je samo element o kome je riječ. Kursor ga pokaže: kuca, bira, klikne.
// Prozor se ne mijenja između koraka (isti okvir i meni), mijenja se samo istaknuti dio.

export type TourStep = 'pregled' | 'materijali' | 'upit' | 'ponude' | 'narudzbe' | 'gradilista'

const NAV: { id: TourStep; label: string; icon: string }[] = [
  { id: 'pregled', label: 'Pregled', icon: 'pregled' },
  { id: 'materijali', label: 'Materijali', icon: 'brza' },
  { id: 'upit', label: 'Upit', icon: 'liste' },
  { id: 'ponude', label: 'Ponude', icon: 'ponude' },
  { id: 'narudzbe', label: 'Narudžbe', icon: 'narudzbe' },
  { id: 'gradilista', label: 'Gradilišta', icon: 'gradilista' },
]
const OFFER = [
  ['GKP-001', 'Gips-kartonska ploča GKB 12,5 mm', '420 m²'],
  ['PRF-075', 'Pocinčani zidni profil CW 75', '180 kom'],
  ['ISO-001', 'Kamena vuna u ploči 50 mm', '380 m²'],
]
const TRACK = ['Primljena', 'Potvrđena', 'U pripremi', 'Na putu', 'Isporučena']
const SITES = [
  ['Lamela A', 'Pregradni zidovi · 2 narudžbe'],
  ['Poslovni B', 'Spušteni plafoni · 1 ponuda'],
  ['Kuća C', 'Krov i izolacija · isporučeno'],
]

export default function TourWindow({ step }: { step: TourStep }) {
  const win = useRef<HTMLDivElement>(null)
  const cur = useRef<HTMLSpanElement>(null)
  const [press, setPress] = useState(false)
  const [row, setRow] = useState(0)
  const [query, setQuery] = useState('')
  const [added, setAdded] = useState(false)
  const [mode, setMode] = useState<'Dostava' | 'Preuzimanje'>('Preuzimanje')
  const [sent, setSent] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [stage, setStage] = useState(2)
  const [site, setSite] = useState(-1)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let alive = true
    const wait = (ms: number) => new Promise((r) => setTimeout(r, reduce ? 0 : ms))
    const at = (t: string) => win.current?.querySelector<HTMLElement>(`[data-t="${t}"]`) ?? null
    const move = async (t: string) => {
      const n = at(t), w = win.current, c = cur.current
      if (!n || !w || !c || !alive) return
      const a = w.getBoundingClientRect(), b = n.getBoundingClientRect()
      c.style.opacity = '1'
      c.style.transform = `translate(${b.left - a.left + Math.min(b.width * 0.55, 80)}px, ${b.top - a.top + b.height * 0.6}px)`
      await wait(700)
    }
    const click = async (t: string, then: () => void) => {
      await move(t)
      if (!alive) return
      setPress(true)
      await wait(140)
      setPress(false)
      then()
      await wait(500)
    }
    // Početno stanje koraka, pa kratka radnja kursora.
    const run = async () => {
      setRow(0); setQuery(''); setAdded(false); setMode('Preuzimanje'); setSent(false); setConfirmed(false); setStage(2); setSite(-1)
      await wait(350)
      if (step === 'pregled') {
        for (let i = 0; i < OFFER.length && alive; i++) {
          await move(`row-${i}`)
          setRow(i)
          await wait(600)
        }
      } else if (step === 'materijali') {
        await move('search')
        const text = 'CW 75'
        for (let i = 1; i <= text.length && alive; i++) {
          setQuery(text.slice(0, i))
          await wait(120)
        }
        await wait(350)
        await click('add', () => setAdded(true))
      } else if (step === 'upit') {
        await click('mode', () => setMode('Dostava'))
        await click('send', () => setSent(true))
      } else if (step === 'ponude') {
        await move('lines')
        await wait(400)
        await click('confirm', () => setConfirmed(true))
      } else if (step === 'narudzbe') {
        await click('next', () => setStage(3))
      } else if (step === 'gradilista') {
        for (let i = 0; i < SITES.length && alive; i++) {
          await move(`site-${i}`)
          setSite(i)
          await wait(500)
        }
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [step])

  return (
    <div ref={win} className={s.win} aria-hidden>
      <div className={s.chrome}>
        <span className={s.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={s.url}>portal.grandcompany.ba/{step}</span>
        <span className={s.demo}>Demo</span>
      </div>
      <div className={s.body}>
        <nav className={s.side}>
          <p className={s.brand}>Grand Company</p>
          {NAV.map((n) => (
            <span key={n.id} className={s.nav} data-on={n.id === step || undefined}>
              <Icon name={n.icon} />
              {n.label}
              {n.id === 'materijali' && added && <em>1</em>}
            </span>
          ))}
        </nav>
        <div className={s.main}>
          <div className={s.skelHead}>
            <i style={{ width: '38%' }} />
            <i style={{ width: '58%' }} />
          </div>

          <div className={s.focus} key={step}>
            {step === 'pregled' && (
              <div className={s.stage}>
                <p className={s.kick}>Ponuda P-26-0142 čeka potvrdu</p>
                <ul>
                  {OFFER.map(([sku, nm, q], i) => (
                    <li key={sku} data-t={`row-${i}`} data-on={i === row || undefined}>
                      <span className={s.mono}>{sku}</span>
                      <span>{nm}</span>
                      <b>{q}</b>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step === 'materijali' && (
              <div className={s.card}>
                <span className={s.search} data-t="search" data-on={query ? true : undefined}>
                  <Icon name="search" />
                  {query || <i>Šifra ili naziv</i>}
                  {query && <em className={s.caret} />}
                </span>
                <div className={s.result} data-show={query.length >= 5 || undefined}>
                  <span>
                    <b>Pocinčani zidni profil CW 75</b>
                    <i>PRF-075 · 3000 × 75 × 50 mm</i>
                  </span>
                  <span className={added ? s.done : s.btn} data-t="add">
                    {added ? '✓ 10 kom' : 'Dodaj'}
                  </span>
                </div>
              </div>
            )}

            {step === 'upit' && (
              <div className={s.card}>
                <p className={s.kick}>Gradilište</p>
                <span className={s.select}>Lamela A, stambeni objekat</span>
                <div className={s.seg}>
                  <span data-t="mode" data-on={mode === 'Dostava' || undefined}>
                    Dostava na gradilište
                  </span>
                  <span data-on={mode === 'Preuzimanje' || undefined}>Preuzimanje</span>
                </div>
                <span className={sent ? s.done : s.btn} data-t="send">
                  {sent ? '✓ Upit poslat prodaji' : 'Pošalji upit'}
                </span>
              </div>
            )}

            {step === 'ponude' && (
              <div className={s.card}>
                <div className={s.offerHead}>
                  <b>Ponuda P-26-0142</b>
                  <span className={s.chip} data-on={confirmed || undefined}>
                    {confirmed ? 'Potvrđena' : 'Čeka potvrdu'}
                  </span>
                </div>
                <ul className={s.lines} data-t="lines">
                  {OFFER.map(([sku, nm, q]) => (
                    <li key={sku}>
                      <span>{nm}</span>
                      <b>{q}</b>
                    </li>
                  ))}
                </ul>
                <span className={confirmed ? s.done : s.btn} data-t="confirm">
                  {confirmed ? '✓ Narudžba otvorena' : 'Potvrdi ponudu'}
                </span>
              </div>
            )}

            {step === 'narudzbe' && (
              <div className={s.card}>
                <div className={s.offerHead}>
                  <b>Narudžba GC-26-04512</b>
                  <span className={s.chip} data-on={stage >= 3 || undefined}>
                    {stage >= 3 ? 'Na putu ka gradilištu' : 'U pripremi'}
                  </span>
                </div>
                <ol className={s.track}>
                  {TRACK.map((t, i) => (
                    <li key={t} data-done={i <= stage || undefined}>
                      <i />
                      <span>{t}</span>
                    </li>
                  ))}
                </ol>
                <span className={s.ghost} data-t="next">
                  Prikaži sljedeći status
                </span>
              </div>
            )}

            {step === 'gradilista' && (
              <div className={s.sites}>
                {SITES.map(([nm, info], i) => (
                  <div key={nm} className={s.site} data-t={`site-${i}`} data-on={i === site || undefined}>
                    <b>{nm}</b>
                    <i>{info}</i>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={s.skelRow}>
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <span ref={cur} className={s.cursor} data-press={press || undefined}>
        <svg viewBox="0 0 20 22">
          <path d="M2 1.5v16.2l4.3-4.1 2.8 6.6 3-1.3-2.8-6.5H15z" />
        </svg>
      </span>
    </div>
  )
}
