'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { COMPANY } from '@/gc/gc'
import { OFFERINGS } from '@/lib/offerings'
import { PRODUCTS, pName } from '@/lib/shop'
import { PROGRAM_ITEMS_EN } from '@/lib/catalog-copy-en'
import { PROGRAM_ITEMS } from '@/lib/catalog-copy'
import { useLang } from '@/lib/i18n'
import { cartLines, useShop } from '@/lib/cart'
import { inquiryTextFromQuery } from '@/lib/catalog-inquiry'
import { QUOTE_FILE_TYPES, QUOTE_MAX_BYTES, QUOTE_MAX_FILES, quoteMsg, quoteText, validateQuote, type QuoteRequest } from '@/lib/quote-request'
import s from './QuoteDesk.module.css'

// /upit-za-izvodjace — upit za ponudu kao mali "dashboard": lijevo četiri kratka koraka koji klize
// vodoravno (šta gradite → materijal → preuzimanje → kontakt), desno kartica upita koja se puni dok
// kupac kuca, sa procentom popunjenosti i onim što slijedi poslije slanja. Slanje ide na /api/quote;
// ako slanje nije moguće, upit se pripremi za e-poštu.

const STEPS = ['Šta gradite', 'Materijal', 'Preuzimanje', 'Kontakt'] as const
const STEPS_EN = ['What you are building', 'Materials', 'Delivery', 'Contact'] as const
const OFFER_EN: Record<string, string> = {
  'suha-gradnja': 'Drywall',
  izolacija: 'Insulation',
  'zidni-krovni': 'Wall and roof range',
  veziva: 'Construction chemicals and binders',
  'drvni-program': 'Timber range',
  'sanitarna-oprema': 'Sanitaryware',
  'ostali-program': 'Other range',
}
const PROGRAM_HINT: Record<string, string> = {
  'suha-gradnja': 'Zid, plafon, potkrovlje',
  izolacija: 'Kamena vuna, fasada',
  'zidni-krovni': 'Zidanje, crijep, krov',
  veziva: 'Ljepila, mase, mortovi',
  'drvni-program': 'Građa, daske, letve',
  'sanitarna-oprema': 'Kupatilo',
  'ostali-program': 'Dimnjaci, cijevi, opločnici, hidroizolacija',
}
const AFTER = ['Upit stiže prodaji', 'Prodaja provjerava program i količine', 'Dobijate ponudu e-poštom ili telefonom', 'Potvrdite i dogovaramo termin']
const AFTER_EN = ['Your enquiry reaches sales', 'Sales checks the range and quantities', 'You receive a quote by email or phone', 'You confirm and we agree the date']
const PROGRAM_HINT_EN: Record<string, string> = {
  'suha-gradnja': 'Wall, ceiling, attic',
  izolacija: 'Stone wool, facade',
  'zidni-krovni': 'Masonry, roof tiles, roofing',
  veziva: 'Adhesives, compounds, mortars',
  'drvni-program': 'Timber, boards, battens',
  'sanitarna-oprema': 'Bathroom',
  'ostali-program': 'Chimneys, pipes, paving, waterproofing',
}

type Draft = { data: QuoteRequest; files: File[] }

export default function QuoteDesk() {
  const { t, lang } = useLang()
  const en = lang === 'en'
  const tr = (msg: string | null) => (msg ? quoteMsg(msg, lang) : msg)
  const lastGen = useRef({ materials: '', desc: '', note: '' })
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
  // Opciono: rezultat iz Wienerberger kalkulatora (link ili prepisane količine); ide u napomenu upita.
  const [calcResult, setCalcResult] = useState('')
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
    const fromQuery = inquiryTextFromQuery(q, lang)
    const prod = PRODUCTS.find((x) => x.sku === q.get('artikal'))
    const vrsta = q.get('vrsta')
    // ?naziv= dolazi iz kartica provjerenih proizvođača u katalogu (Porotherm, Tondach, Baumalt).
    const naziv = (q.get('naziv') || '').slice(0, 120)
    // Naziv iz kataloga je srpski; na engleskom se prikazuje engleski naziv istog artikla.
    const programItem = PROGRAM_ITEMS.find((x) => x.name === naziv)
    const nazivL = lang === 'en' && programItem ? (PROGRAM_ITEMS_EN[programItem.id]?.name ?? naziv) : naziv
    const qtyWord = lang === 'en' ? 'Quantity' : 'Količina'
    // Prefill se osvježava pri promjeni jezika, ali samo ako ga korisnik u međuvremenu nije mijenjao.
    const sync = (set: (fn: (cur: string) => string) => void, key: 'materials' | 'desc' | 'note', next: string) => {
      set((cur) => (cur === '' || cur === lastGen.current[key] ? next : cur))
      lastGen.current[key] = next
    }
    const timer = window.setTimeout(() => {
      if (p) setProgram(p.name)
      if (fromQuery) sync(setMaterials, 'materials', fromQuery)
      else if (prod) sync(setMaterials, 'materials', `${pName(prod, lang)}\n${qtyWord}: `)
      else if (naziv) sync(setMaterials, 'materials', `${nazivL}\n${qtyWord}: `)
      if (vrsta === 'saradnja') sync(setDesc, 'desc', t('Želimo dogovoriti redovnu nabavku za firmu (nalog na B2B portalu). Šta najčešće nabavljamo: ', 'We would like to arrange regular purchasing for our company (a B2B portal account). What we buy most often: '))
      if (vrsta === 'projekat') sync(setDesc, 'desc', t('Nabavka materijala za projekat. Faza radova i termini: ', 'Material supply for a project. Stage of works and deadlines: '))
      if (vrsta === 'dokumentacija') sync(setNote, 'note', t('Tražim tehničku dokumentaciju za materijal naveden u upitu.', 'I am requesting technical documentation for the material listed in the enquiry.'))
      if (q.get('izvor') === 'kalkulator') sync(setNote, 'note', t('Dolazim sa stranice Kalkulatori; rezultat iz Wienerberger kalkulatora je u upitu.', 'I am coming from the Calculators page; the result from the Wienerberger calculator is in the enquiry.'))
    }, 0)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- t je funkcija jezika; dovoljno je lang
  }, [lang])

  const cartText = cartItems.map((l) => `${en ? (l.nameEn ?? l.name) : l.name}${(en ? l.specEn : l.spec) ? `, ${en ? l.specEn : l.spec}` : ''}\n${en ? 'Quantity' : 'Količina'}: ${l.qty} ${en ? (l.unitEn ?? l.unit) : l.unit}`).join('\n\n')
  const allMaterials = [desc && `${en ? 'Description' : 'Opis'}: ${desc}`, useCart && cartText && `${en ? 'From the basket' : 'Iz korpe'}:\n${cartText}`, materials].filter(Boolean).join('\n\n')
  const data: QuoteRequest = { name: name.trim(), email: email.trim(), phone: phone.trim(), program, materials: allMaterials.trim(), method, location: location.trim(), deadline, note: [note.trim(), calcResult.trim() && `${en ? 'Result from the Wienerberger calculator' : 'Rezultat iz Wienerberger kalkulatora'}: ${calcResult.trim()}`].filter(Boolean).join('\n') }

  // Šta svaki korak traži prije "Dalje"
  const stepError = (i: number) => {
    if (i === 0 && !program && !desc.trim()) return t('Izaberite program ili ukratko opišite šta gradite.', 'Choose a range or briefly describe what you are building.')
    if (i === 1 && !allMaterials.trim() && !files.length) return t('Navedite materijal, uključite korpu ili priložite plan.', 'List the material, include the basket or attach a plan.')
    if (i === 2 && method === 'dostava' && !location.trim()) return t('Navedite mjesto isporuke.', 'Enter the delivery location.')
    if (i === 3) return tr(validateQuote(data, files))
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
    if (next.length > QUOTE_MAX_FILES || next.reduce((a, f) => a + f.size, 0) > QUOTE_MAX_BYTES) setError(t('Dodajte do 3 priloga, ukupno do 3 MB.', 'Add up to 3 attachments, 3 MB in total.'))
    else if (next.some((f) => !QUOTE_FILE_TYPES.test(f.name) || !f.size)) setError(t('Dodajte PDF, Excel ili fotografiju.', 'Add a PDF, Excel file or photo.'))
    else {
      setFiles(next)
      setError('')
    }
    if (upload.current) upload.current.value = ''
  }

  async function send() {
    const e = validateQuote(data, files)
    if (e) {
      setError(tr(e) ?? e)
      return
    }
    setPending(true)
    setError('')
    setDraft(null)
    const body = new FormData()
    Object.entries(data).forEach(([k, v]) => body.append(k, v))
    body.append('lang', lang)
    files.forEach((f) => body.append('attachments', f))
    try {
      const res = await fetch('/api/quote', { method: 'POST', body })
      const json = await res.json()
      if (res.ok && json.sent) setSent(true)
      else {
        setError(json.error || t('Upit nije poslan.', 'Your enquiry was not sent.'))
        if (res.status >= 500) setDraft({ data, files: [...files] })
      }
    } catch {
      setError(t('Slanje nije potvrđeno. Upit možete poslati e-poštom.', 'Sending could not be confirmed. You can send your enquiry by email.'))
      setDraft({ data, files: [...files] })
    } finally {
      setPending(false)
    }
  }

  const summary: [string, string][] = [
    [t('Program', 'Range'), program ? (en ? (OFFERINGS.find((o) => o.name === program) ? OFFER_EN[OFFERINGS.find((o) => o.name === program)!.id] : program) : program) : desc ? t('Prema opisu', 'As described') : '—'],
    [t('Materijal', 'Materials'), [useCart && cartItems.length ? t(`${cartItems.length} iz korpe`, `${cartItems.length} from the basket`) : '', materials.trim() ? t('vaša lista', 'your list') : ''].filter(Boolean).join(' + ') || '—'],
    [t('Prilozi', 'Attachments'), files.length ? (en ? `${files.length} ${files.length === 1 ? 'file' : 'files'}` : `${files.length} ${files.length === 1 ? 'fajl' : 'fajla'}`) : '—'],
    [t('Preuzimanje', 'Delivery'), method === 'dostava' ? (location ? `${t('Dostava', 'Delivery')} · ${location}` : t('Dostava', 'Delivery')) : t('Stovarište, Nenada Kostića 151', 'Yard, Nenada Kostića 151')],
    [t('Rok', 'Deadline'), deadline ? new Date(deadline).toLocaleDateString(en ? 'en-GB' : 'de-DE') : t('Po dogovoru', 'By agreement')],
    [t('Kontakt', 'Contact'), name ? `${name}${phone ? ` · ${phone}` : email ? ` · ${email}` : ''}` : '—'],
  ]

  return (
    <section className={s.page} aria-labelledby="quote-title">
      <div className={s.inner}>
        <header className={s.head}>
          <p className="label">{t('Upit za ponudu', 'Request a quote')}</p>
          <h1 id="quote-title" className={`display ${s.title}`}>
            {t('Recite nam šta gradite', 'Tell us what you are building')}
          </h1>
          <p className={s.lead}>{t('Četiri kratka koraka. Ponudu vam šalje prodaja, nalog nije potreban.', 'Four short steps. Sales sends you the quote — no account needed.')}</p>
        </header>

        <div className={s.desk}>
          {/* ——— Koraci ——— */}
          <div className={s.flow}>
            <ol className={s.tabs}>
              {STEPS.map((stepName, i) => (
                <li key={stepName}>
                  <button type="button" onClick={() => go(i)} aria-current={i === step || undefined} data-done={(done[i] && i !== step) || undefined} disabled={sent}>
                    <b>{done[i] && i !== step ? '✓' : i + 1}</b>
                    <span>{en ? STEPS_EN[i] : stepName}</span>
                  </button>
                </li>
              ))}
            </ol>

            {sent ? (
              <div className={s.sent} role="status">
                <b>{t('Upit je poslan.', 'Your enquiry has been sent.')}</b>
                <p>{t('Prodaja ga provjerava i javlja vam se sa ponudom. Za hitne upite pozovite', 'Sales will review it and get back to you with a quote. For urgent enquiries call')} {COMPANY.phoneLandline}.</p>
                <Link href="/prodavnica" className={s.btnLight}>
                  {t('Nazad u asortiman →', 'Back to the range →')}
                </Link>
              </div>
            ) : (
              <div className={s.viewport}>
                <div ref={track} className={s.track} style={{ transform: `translateX(${-step * 100}%)` }}>
                  {/* 1. Šta gradite */}
                  <fieldset data-panel={0} className={s.panel} disabled={step !== 0} aria-hidden={step !== 0}>
                    <legend className="sr-only">{t('Šta gradite', 'What you are building')}</legend>
                    <p className={s.q}>{t('Za koji posao vam treba materijal?', 'What job do you need the material for?')}</p>
                    <div className={s.tiles}>
                      {OFFERINGS.map((o) => (
                        <button key={o.id} type="button" className={s.tile} aria-pressed={program === o.name} onClick={() => setProgram(program === o.name ? '' : o.name)}>
                          <b>{en ? (OFFER_EN[o.id] ?? o.name) : o.name}</b>
                          <span>{en ? PROGRAM_HINT_EN[o.id] : PROGRAM_HINT[o.id]}</span>
                        </button>
                      ))}
                    </div>
                    <label className={s.field}>
                      <span>{t('Ukratko o projektu', 'About the project in brief')}</span>
                      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={t('npr. pregradni zidovi u stanu, oko 25 m²', 'e.g. partition walls in an apartment, about 25 m²')} maxLength={600} />
                    </label>
                  </fieldset>

                  {/* 2. Materijal */}
                  <fieldset data-panel={1} className={s.panel} disabled={step !== 1} aria-hidden={step !== 1}>
                    <legend className="sr-only">{t('Materijal', 'Materials')}</legend>
                    <p className={s.q}>{t('Šta vam treba i koliko? Ako ne znate, preskočite.', 'What do you need and how much? If you are not sure, skip this.')}</p>
                    <div className={s.row}>
                      <label className={`${s.field} ${s.grow}`}>
                        <span>{t('Materijal i količine', 'Materials and quantities')}</span>
                        <textarea value={materials} onChange={(e) => setMaterials(e.target.value)} rows={5} maxLength={5000} placeholder={t('npr. GKB ploča 12,5 mm — 60 m²\nCW 75 profil — 40 kom', 'e.g. GKB plasterboard 12.5 mm — 60 m²\nCW 75 profile — 40 pcs')} />
                      </label>
                      <div className={s.side}>
                        {cartItems.length > 0 && (
                          <label className={s.check}>
                            <input type="checkbox" checked={useCart} onChange={(e) => setUseCart(e.target.checked)} />
                            <span>
                              <b>{t('Dodaj artikle iz korpe', 'Add items from the basket')}</b>
                              <i>
                                {en ? `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} in the basket` : `${cartItems.length} ${cartItems.length === 1 ? 'stavka' : 'stavki'} u korpi`}
                              </i>
                            </span>
                          </label>
                        )}
                        <input ref={upload} type="file" multiple accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png,.webp" className="sr-only" tabIndex={-1} onChange={(e) => addFiles(e.target.files)} />
                        <button type="button" className={s.upload} onClick={() => upload.current?.click()}>
                          <b>{t('＋ Priložite plan ili predmjer', '＋ Attach a plan or bill of quantities')}</b>
                          <i>{t('PDF, Excel ili fotografija · do 3 fajla', 'PDF, Excel or photo · up to 3 files')}</i>
                        </button>
                        {files.length > 0 && (
                          <ul className={s.files}>
                            {files.map((f, i) => (
                              <li key={`${f.name}-${f.size}`}>
                                <span>{f.name}</span>
                                <button type="button" aria-label={`${t('Ukloni', 'Remove')} ${f.name}`} onClick={() => setFiles(files.filter((_, k) => k !== i))}>
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        <Link href="/kalkulator" className={s.calcLink}>
                          {t('Ne znate količine? Kalkulatori za krov i zid →', 'Not sure about quantities? Roof and wall calculators →')}
                        </Link>
                        <label className={s.field}>
                          <span>{t('Rezultat iz Wienerberger kalkulatora (opciono)', 'Result from the Wienerberger calculator (optional)')}</span>
                          <textarea
                            value={calcResult}
                            onChange={(e) => setCalcResult(e.target.value)}
                            maxLength={2000}
                            rows={3}
                            placeholder={t('Zalijepite link ili prepišite količine iz kalkulatora', 'Paste the link or copy the quantities from the calculator')}
                          />
                        </label>
                      </div>
                    </div>
                  </fieldset>

                  {/* 3. Preuzimanje */}
                  <fieldset data-panel={2} className={s.panel} disabled={step !== 2} aria-hidden={step !== 2}>
                    <legend className="sr-only">{t('Preuzimanje', 'Delivery')}</legend>
                    <p className={s.q}>{t('Kako i do kada vam treba?', 'How and by when do you need it?')}</p>
                    <div className={s.choice}>
                      {(
                        [
                          ['dostava', t('Dostava', 'Delivery'), t('Na vašu adresu ili gradilište', 'To your address or building site')],
                          ['preuzimanje', t('Preuzimam sam', 'I will collect'), t('Stovarište, Nenada Kostića 151', 'Yard, Nenada Kostića 151')],
                        ] as const
                      ).map(([v, label, h]) => (
                        <button key={v} type="button" className={s.tile} aria-pressed={method === v} onClick={() => setMethod(v)}>
                          <b>{label}</b>
                          <span>{h}</span>
                        </button>
                      ))}
                    </div>
                    <div className={s.row}>
                      {method === 'dostava' && (
                        <label className={`${s.field} ${s.grow}`}>
                          <span>{t('Mjesto isporuke *', 'Delivery location *')}</span>
                          <input value={location} onChange={(e) => setLocation(e.target.value)} autoComplete="street-address" maxLength={300} placeholder={t('Ulica i mjesto', 'Street and town')} />
                        </label>
                      )}
                      <label className={s.field}>
                        <span>{t('Do kada vam treba', 'Needed by')}</span>
                        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                      </label>
                    </div>
                  </fieldset>

                  {/* 4. Kontakt */}
                  <fieldset data-panel={3} className={s.panel} disabled={step !== 3} aria-hidden={step !== 3}>
                    <legend className="sr-only">{t('Kontakt', 'Contact')}</legend>
                    <p className={s.q}>{t('Kome da pošaljemo ponudu?', 'Who should we send the quote to?')}</p>
                    <div className={s.row}>
                      <label className={`${s.field} ${s.grow}`}>
                        <span>{t('Ime ili firma *', 'Name or company *')}</span>
                        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="organization" maxLength={200} />
                      </label>
                      <label className={`${s.field} ${s.grow}`}>
                        <span>{t('Telefon', 'Phone')}</span>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" autoComplete="tel" maxLength={80} />
                      </label>
                      <label className={`${s.field} ${s.grow}`}>
                        <span>{t('E-pošta', 'Email')}</span>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" maxLength={254} />
                      </label>
                    </div>
                    <label className={s.field}>
                      <span>{t('Napomena', 'Note')}</span>
                      <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} placeholder={t('Pristup lokaciji, faza radova, posebni zahtjevi', 'Site access, stage of works, special requirements')} />
                    </label>
                    <p className={s.hint}>
                      {t('Dovoljan je telefon ili e-pošta. Podatke koristimo samo za odgovor.', 'A phone number or email is enough. We use your details only to reply.')} <Link href="/politika-privatnosti">{t('Privatnost', 'Privacy')}</Link>
                    </p>
                  </fieldset>
                </div>
              </div>
            )}

            {!sent && (
              <div className={s.nav}>
                <button type="button" className={s.back} onClick={() => go(step - 1)} disabled={step === 0}>
                  {t('← Nazad', '← Back')}
                </button>
                <p className={s.error} role="alert">
                  {error}
                </p>
                {step < 3 ? (
                  <button type="button" className={s.next} onClick={() => go(step + 1)}>
                    {t('Dalje', 'Next')}: {en ? STEPS_EN[step + 1] : STEPS[step + 1]} →
                  </button>
                ) : (
                  <button type="button" className={s.next} onClick={send} disabled={pending}>
                    {pending ? t('Slanje…', 'Sending…') : t('Pošalji upit →', 'Send enquiry →')}
                  </button>
                )}
              </div>
            )}
            {draft && (
              <div className={s.draft}>
                <a href={`mailto:${COMPANY.emailInfo}?subject=${encodeURIComponent('Upit za ponudu')}&body=${encodeURIComponent(quoteText(draft.data))}`}>{t('Pošaljite upit e-poštom', 'Send the enquiry by email')}</a>
                <span>{t('ili pozovite', 'or call')} {COMPANY.phoneLandline}</span>
              </div>
            )}
          </div>

          {/* ——— Mini dashboard upita ——— */}
          <aside className={s.card} aria-label={t('Vaš upit', 'Your enquiry')}>
            <div className={s.cardHead}>
              <span>{t('Vaš upit', 'Your enquiry')}</span>
              <em data-sent={sent || undefined}>{sent ? t('Poslano', 'Sent') : t('U pripremi', 'Draft')}</em>
            </div>
            <div className={s.meter}>
              <span>{t('Popunjeno', 'Completed')}</span>
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
              <span>{t('Šta slijedi', 'What happens next')}</span>
              <ol>
                {(en ? AFTER_EN : AFTER).map((a, i) => (
                  <li key={a} data-on={(sent && i === 0) || undefined}>
                    <b>{i + 1}</b>
                    {a}
                  </li>
                ))}
              </ol>
            </div>
            <div className={s.cardFoot}>
              <span>{t('Prodaja', 'Sales')}</span>
              <a href={COMPANY.phoneLandlineHref}>{COMPANY.phoneLandline}</a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
