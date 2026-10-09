'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { COMPANY } from '@/gc/gc'
import { OFFERINGS } from '@/lib/offerings'
import { PRODUCTS } from '@/lib/shop'
import { cartLines, useShop } from '@/lib/cart'
import { inquiryTextFromQuery } from '@/lib/catalog-inquiry'
import { QUOTE_FILE_TYPES, QUOTE_MAX_BYTES, QUOTE_MAX_FILES, quoteText, validateQuote, type QuoteRequest } from '@/lib/quote-request'
import s from './QuoteDesk.module.css'

// /upit-za-izvodjace — upit za ponudu kao mali "dashboard": lijevo četiri kratka koraka koji klize
// vodoravno (šta gradite → materijal → preuzimanje → kontakt), desno kartica upita koja se puni dok
// kupac kuca, sa procentom popunjenosti i onim što slijedi poslije slanja. Slanje ide na /api/quote;
// ako slanje nije moguće, upit se pripremi za e-poštu.

const STEPS = ['Šta gradite', 'Materijal', 'Preuzimanje', 'Kontakt'] as const
const PROGRAM_HINT: Record<string, string> = {
  'suha-gradnja': 'Zid, plafon, potkrovlje',
  izolacija: 'Kamena vuna, fasada',
  'zidni-krovni': 'Zidanje, crijep, krov',
  veziva: 'Ljepila, mase, mortovi',
  'drvni-program': 'Građa, daske, letve',
  'sanitarna-oprema': 'Kupatilo',
}
const AFTER = ['Upit stiže prodaji', 'Prodaja provjerava program i količine', 'Dobijate ponudu e-poštom ili telefonom', 'Potvrdite i dogovaramo termin']

type Draft = { data: QuoteRequest; files: File[] }

export default function QuoteDesk() {
  const [step, setStep] = useState(0)
  const [program, setProgram] = useState('')
  const [desc, setDesc] = useState('')
  const [materials, setMaterials] = useState('')
  const [useCart, setUseCart] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const [method, setMethod] = useState<'dostava' | 'preuzimanje'>('dostava')
  const [location, setLocation] = useState('')
  const [deadline, setDeadline] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [draft, setDraft] = useState<Draft | null>(null)
  const upload = useRef<HTMLInputElement>(null)
  const track = useRef<HTMLDivElement>(null)

  const { cart } = useShop()
  const cartItems = useMemo(() => cartLines(cart), [cart])

  // Popuna iz linka: ?program=, ?artikal=, ?materijal=, ?vrsta=
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const p = OFFERINGS.find((o) => o.id === q.get('program'))
    const fromQuery = inquiryTextFromQuery(q)
    const prod = PRODUCTS.find((x) => x.sku === q.get('artikal'))
    const vrsta = q.get('vrsta')
    const t = window.setTimeout(() => {
      if (p) setProgram(p.name)
      if (fromQuery) setMaterials(fromQuery)
      else if (prod) setMaterials(`${prod.name}\nKoličina: `)
      if (vrsta === 'saradnja') setDesc('Želimo dogovoriti redovnu nabavku za firmu (nalog na B2B portalu). Šta najčešće nabavljamo: ')
      if (vrsta === 'projekat') setDesc('Nabavka materijala za projekat. Faza radova i termini: ')
      if (vrsta === 'dokumentacija') setNote('Tražim tehničku dokumentaciju za materijal naveden u upitu.')
    }, 0)
    return () => window.clearTimeout(t)
  }, [])

  const cartText = cartItems.map((l) => `${l.name}${l.spec ? `, ${l.spec}` : ''}\nKoličina: ${l.qty} ${l.unit}`).join('\n\n')
  const allMaterials = [desc && `Opis: ${desc}`, useCart && cartText && `Iz korpe:\n${cartText}`, materials].filter(Boolean).join('\n\n')
  const data: QuoteRequest = { name: name.trim(), email: email.trim(), phone: phone.trim(), program, materials: allMaterials.trim(), method, location: location.trim(), deadline, note: note.trim() }

  // Šta svaki korak traži prije "Dalje"
  const stepError = (i: number) => {
    if (i === 0 && !program && !desc.trim()) return 'Izaberite program ili ukratko opišite šta gradite.'
    if (i === 1 && !allMaterials.trim() && !files.length) return 'Navedite materijal, uključite korpu ili priložite plan.'
    if (i === 2 && method === 'dostava' && !location.trim()) return 'Navedite mjesto isporuke.'
    if (i === 3) return validateQuote(data, files)
    return null
  }
  const done = [
    !!(program || desc.trim()),
    !!(allMaterials.trim() || files.length),
    method === 'preuzimanje' || !!location.trim(),
    !!(name.trim() && (email.trim() || phone.trim())),
  ]
  const pct = Math.round((done.filter(Boolean).length / done.length) * 100)

  const go = (i: number) => {
    if (i > step) {
      for (let k = step; k < i; k++) {
        const e = stepError(k)
        if (e) {
          setStep(k)
          setError(e)
          return
        }
      }
    }
    setError('')
    setStep(i)
    track.current?.querySelector<HTMLElement>(`[data-panel="${i}"] input, [data-panel="${i}"] textarea, [data-panel="${i}"] button`)?.focus({ preventScroll: true })
  }

  function addFiles(list: FileList | null) {
    if (!list) return
    const next = [...files, ...Array.from(list)].filter((f, i, all) => all.findIndex((o) => o.name === f.name && o.size === f.size) === i)
    if (next.length > QUOTE_MAX_FILES || next.reduce((a, f) => a + f.size, 0) > QUOTE_MAX_BYTES) setError('Dodajte do 3 priloga, ukupno do 3 MB.')
    else if (next.some((f) => !QUOTE_FILE_TYPES.test(f.name) || !f.size)) setError('Dodajte PDF, Excel ili fotografiju.')
    else {
      setFiles(next)
      setError('')
    }
    if (upload.current) upload.current.value = ''
  }

  async function send() {
    const e = validateQuote(data, files)
    if (e) {
      setError(e)
      return
    }
    setPending(true)
    setError('')
    setDraft(null)
    const body = new FormData()
    Object.entries(data).forEach(([k, v]) => body.append(k, v))
    files.forEach((f) => body.append('attachments', f))
    try {
      const res = await fetch('/api/quote', { method: 'POST', body })
      const json = await res.json()
      if (res.ok && json.sent) setSent(true)
      else {
        setError(json.error || 'Upit nije poslan.')
        if (res.status >= 500) setDraft({ data, files: [...files] })
      }
    } catch {
      setError('Slanje nije potvrđeno. Upit možete poslati e-poštom.')
      setDraft({ data, files: [...files] })
    } finally {
      setPending(false)
    }
  }

  const summary: [string, string][] = [
    ['Program', program || (desc ? 'Prema opisu' : '—')],
    ['Materijal', [useCart && cartItems.length ? `${cartItems.length} iz korpe` : '', materials.trim() ? 'vaša lista' : ''].filter(Boolean).join(' + ') || '—'],
    ['Prilozi', files.length ? `${files.length} ${files.length === 1 ? 'fajl' : 'fajla'}` : '—'],
    ['Preuzimanje', method === 'dostava' ? (location ? `Dostava · ${location}` : 'Dostava') : 'Stovarište, Nenada Kostića 151'],
    ['Rok', deadline ? new Date(deadline).toLocaleDateString('de-DE') : 'Po dogovoru'],
    ['Kontakt', name ? `${name}${phone ? ` · ${phone}` : email ? ` · ${email}` : ''}` : '—'],
  ]

  return (
    <section className={s.page} aria-labelledby="quote-title">
      <div className={s.inner}>
        <header className={s.head}>
          <p className="label">Upit za ponudu</p>
          <h1 id="quote-title" className={`display ${s.title}`}>
            Recite nam šta gradite
          </h1>
          <p className={s.lead}>Četiri kratka koraka. Ponudu vam šalje prodaja, nalog nije potreban.</p>
        </header>

        <div className={s.desk}>
          {/* ——— Koraci ——— */}
          <div className={s.flow}>
            <ol className={s.tabs}>
              {STEPS.map((t, i) => (
                <li key={t}>
                  <button type="button" onClick={() => go(i)} aria-current={i === step || undefined} data-done={(done[i] && i !== step) || undefined} disabled={sent}>
                    <b>{done[i] && i !== step ? '✓' : i + 1}</b>
                    <span>{t}</span>
                  </button>
                </li>
              ))}
            </ol>

            {sent ? (
              <div className={s.sent} role="status">
                <b>Upit je poslan.</b>
                <p>Prodaja ga provjerava i javlja vam se sa ponudom. Za hitne upite pozovite {COMPANY.phoneLandline}.</p>
                <Link href="/prodavnica" className={s.btnLight}>
                  Nazad u asortiman →
                </Link>
              </div>
            ) : (
              <div className={s.viewport}>
                <div ref={track} className={s.track} style={{ transform: `translateX(${-step * 100}%)` }}>
                  {/* 1. Šta gradite */}
                  <fieldset data-panel={0} className={s.panel} disabled={step !== 0} aria-hidden={step !== 0}>
                    <legend className="sr-only">Šta gradite</legend>
                    <p className={s.q}>Za koji posao vam treba materijal?</p>
                    <div className={s.tiles}>
                      {OFFERINGS.map((o) => (
                        <button key={o.id} type="button" className={s.tile} aria-pressed={program === o.name} onClick={() => setProgram(program === o.name ? '' : o.name)}>
                          <b>{o.name}</b>
                          <span>{PROGRAM_HINT[o.id]}</span>
                        </button>
                      ))}
                    </div>
                    <label className={s.field}>
                      <span>Ukratko o projektu</span>
                      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="npr. pregradni zidovi u stanu, oko 25 m²" maxLength={600} />
                    </label>
                  </fieldset>

                  {/* 2. Materijal */}
                  <fieldset data-panel={1} className={s.panel} disabled={step !== 1} aria-hidden={step !== 1}>
                    <legend className="sr-only">Materijal</legend>
                    <p className={s.q}>Šta vam treba i koliko? Ako ne znate, preskočite.</p>
                    <div className={s.row}>
                      <label className={`${s.field} ${s.grow}`}>
                        <span>Materijal i količine</span>
                        <textarea value={materials} onChange={(e) => setMaterials(e.target.value)} rows={5} maxLength={5000} placeholder={'npr. GKB ploča 12,5 mm — 60 m²\nCW 75 profil — 40 kom'} />
                      </label>
                      <div className={s.side}>
                        {cartItems.length > 0 && (
                          <label className={s.check}>
                            <input type="checkbox" checked={useCart} onChange={(e) => setUseCart(e.target.checked)} />
                            <span>
                              <b>Dodaj artikle iz korpe</b>
                              <i>
                                {cartItems.length} {cartItems.length === 1 ? 'stavka' : 'stavki'} u korpi
                              </i>
                            </span>
                          </label>
                        )}
                        <input ref={upload} type="file" multiple accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png,.webp" className="sr-only" tabIndex={-1} onChange={(e) => addFiles(e.target.files)} />
                        <button type="button" className={s.upload} onClick={() => upload.current?.click()}>
                          <b>＋ Priložite plan ili predmjer</b>
                          <i>PDF, Excel ili fotografija · do 3 fajla</i>
                        </button>
                        {files.length > 0 && (
                          <ul className={s.files}>
                            {files.map((f, i) => (
                              <li key={`${f.name}-${f.size}`}>
                                <span>{f.name}</span>
                                <button type="button" aria-label={`Ukloni ${f.name}`} onClick={() => setFiles(files.filter((_, k) => k !== i))}>
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        <Link href="/kalkulator" className={s.calcLink}>
                          Ne znate količine? Kalkulator →
                        </Link>
                      </div>
                    </div>
                  </fieldset>

                  {/* 3. Preuzimanje */}
                  <fieldset data-panel={2} className={s.panel} disabled={step !== 2} aria-hidden={step !== 2}>
                    <legend className="sr-only">Preuzimanje</legend>
                    <p className={s.q}>Kako i do kada vam treba?</p>
                    <div className={s.choice}>
                      {(
                        [
                          ['dostava', 'Dostava', 'Na vašu adresu ili gradilište'],
                          ['preuzimanje', 'Preuzimam sam', 'Stovarište, Nenada Kostića 151'],
                        ] as const
                      ).map(([v, t, h]) => (
                        <button key={v} type="button" className={s.tile} aria-pressed={method === v} onClick={() => setMethod(v)}>
                          <b>{t}</b>
                          <span>{h}</span>
                        </button>
                      ))}
                    </div>
                    <div className={s.row}>
                      {method === 'dostava' && (
                        <label className={`${s.field} ${s.grow}`}>
                          <span>Mjesto isporuke *</span>
                          <input value={location} onChange={(e) => setLocation(e.target.value)} autoComplete="street-address" maxLength={300} placeholder="Ulica i mjesto" />
                        </label>
                      )}
                      <label className={s.field}>
                        <span>Do kada vam treba</span>
                        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                      </label>
                    </div>
                  </fieldset>

                  {/* 4. Kontakt */}
                  <fieldset data-panel={3} className={s.panel} disabled={step !== 3} aria-hidden={step !== 3}>
                    <legend className="sr-only">Kontakt</legend>
                    <p className={s.q}>Kome da pošaljemo ponudu?</p>
                    <div className={s.row}>
                      <label className={`${s.field} ${s.grow}`}>
                        <span>Ime ili firma *</span>
                        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="organization" maxLength={200} />
                      </label>
                      <label className={`${s.field} ${s.grow}`}>
                        <span>Telefon</span>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" autoComplete="tel" maxLength={80} />
                      </label>
                      <label className={`${s.field} ${s.grow}`}>
                        <span>E-pošta</span>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" maxLength={254} />
                      </label>
                    </div>
                    <label className={s.field}>
                      <span>Napomena</span>
                      <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} placeholder="Pristup lokaciji, faza radova, posebni zahtjevi" />
                    </label>
                    <p className={s.hint}>
                      Dovoljan je telefon ili e-pošta. Podatke koristimo samo za odgovor. <Link href="/politika-privatnosti">Privatnost</Link>
                    </p>
                  </fieldset>
                </div>
              </div>
            )}

            {!sent && (
              <div className={s.nav}>
                <button type="button" className={s.back} onClick={() => go(step - 1)} disabled={step === 0}>
                  ← Nazad
                </button>
                <p className={s.error} role="alert">
                  {error}
                </p>
                {step < 3 ? (
                  <button type="button" className={s.next} onClick={() => go(step + 1)}>
                    Dalje: {STEPS[step + 1]} →
                  </button>
                ) : (
                  <button type="button" className={s.next} onClick={send} disabled={pending}>
                    {pending ? 'Slanje…' : 'Pošalji upit →'}
                  </button>
                )}
              </div>
            )}
            {draft && (
              <div className={s.draft}>
                <a href={`mailto:${COMPANY.emailInfo}?subject=${encodeURIComponent('Upit za ponudu')}&body=${encodeURIComponent(quoteText(draft.data))}`}>Pošaljite upit e-poštom</a>
                <span>ili pozovite {COMPANY.phoneLandline}</span>
              </div>
            )}
          </div>

          {/* ——— Mini dashboard upita ——— */}
          <aside className={s.card} aria-label="Vaš upit">
            <div className={s.cardHead}>
              <span>Vaš upit</span>
              <em data-sent={sent || undefined}>{sent ? 'Poslano' : 'U pripremi'}</em>
            </div>
            <div className={s.meter}>
              <span>Popunjeno</span>
              <b>{sent ? 100 : pct} %</b>
              <i>
                <i style={{ transform: `scaleX(${sent ? 1 : pct / 100})` }} />
              </i>
            </div>
            <dl className={s.sum}>
              {summary.map(([k, v]) => (
                <div key={k} data-empty={v === '—' || undefined}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className={s.after}>
              <span>Šta slijedi</span>
              <ol>
                {AFTER.map((a, i) => (
                  <li key={a} data-on={(sent && i === 0) || undefined}>
                    <b>{i + 1}</b>
                    {a}
                  </li>
                ))}
              </ol>
            </div>
            <div className={s.cardFoot}>
              <span>Prodaja</span>
              <a href={COMPANY.phoneLandlineHref}>{COMPANY.phoneLandline}</a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
