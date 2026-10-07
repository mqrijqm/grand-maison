'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { COMPANY } from '@/gc/gc'
import { OFFERINGS } from '@/lib/offerings'
import { PRODUCTS } from '@/lib/shop'
import { QUOTE_MAX_BYTES, QUOTE_MAX_FILES, QUOTE_FILE_TYPES, quoteText, readQuote, validateQuote, type QuoteRequest } from '@/lib/quote-request'
import styles from './QuoteSection.module.css'

type Draft = { data: QuoteRequest; files: File[] }
function base64(bytes: Uint8Array) {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192))
  return btoa(binary)
}
function lines(value: string) { return value.match(/.{1,76}/g)?.join('\r\n') ?? '' }
async function downloadDraft(draft: Draft) {
  const boundary = `grand-${crypto.randomUUID()}`
  const subject = base64(new TextEncoder().encode('Upit za ponudu — Grand Company'))
  const parts = [
    `To: ${COMPANY.emailInfo}`, `Subject: =?UTF-8?B?${subject}?=`, 'X-Unsent: 1', 'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`, '', `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '',
    lines(base64(new TextEncoder().encode(quoteText(draft.data)))),
  ]
  for (const file of draft.files) {
    const name = encodeURIComponent(file.name)
    parts.push(`--${boundary}`, `Content-Type: ${file.type || 'application/octet-stream'}`,
      `Content-Disposition: attachment; filename*=UTF-8''${name}`, 'Content-Transfer-Encoding: base64', '',
      lines(base64(new Uint8Array(await file.arrayBuffer()))))
  }
  parts.push(`--${boundary}--`, '')
  const url = URL.createObjectURL(new Blob([parts.join('\r\n')], { type: 'message/rfc822' }))
  const link = document.createElement('a')
  link.href = url; link.download = 'grandcompany-upit.eml'; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function QuoteSection({ standalone = false }: { standalone?: boolean }) {
  const form = useRef<HTMLFormElement>(null)
  const upload = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [method, setMethod] = useState('dostava')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const Heading = standalone ? 'h1' : 'h2'

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const program = OFFERINGS.find(item => item.id === query.get('program'))
    const product = PRODUCTS.find(item => item.sku === query.get('artikal'))
    const field = (name: string) => form.current?.elements.namedItem(name) as HTMLInputElement | null
    if (program && field('program')) field('program')!.value = program.name
    if (product && field('materials')) field('materials')!.value = product.name + '\nKoličina: '
    if (query.get('vrsta') === 'dokumentacija' && field('note')) field('note')!.value = 'Tražim tehničku dokumentaciju za materijal naveden u upitu.'
  }, [])

  function addFiles(selected: FileList | null) {
    if (!selected) return
    const next = [...files, ...Array.from(selected)].filter((file, i, list) => list.findIndex(other => other.name === file.name && other.size === file.size) === i)
    if (next.length > QUOTE_MAX_FILES || next.reduce((sum, file) => sum + file.size, 0) > QUOTE_MAX_BYTES) setMessage('Dodajte do 3 priloga, ukupno do 3 MB.')
    else if (next.some(file => !QUOTE_FILE_TYPES.test(file.name) || !file.size)) setMessage('Dodajte PDF, Excel ili fotografiju spiska koja nije prazna.')
    else { setFiles(next); setMessage(''); setDraft(null) }
    if (upload.current) upload.current.value = ''
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload = new FormData(event.currentTarget)
    files.forEach(file => payload.append('attachments', file))
    const data = readQuote(payload)
    const error = validateQuote(data, files)
    setDraft(null)
    if (error) { setMessage(error); return }
    setPending(true); setMessage('')
    try {
      const response = await fetch('/api/quote', { method: 'POST', body: payload })
      const result = await response.json()
      if (response.ok && result.sent) {
        setMessage('Upit je poslan prodaji. Kopiju spiska sačuvajte za dalji dogovor.')
        form.current?.reset(); setFiles([]); setMethod('dostava')
      } else {
        setMessage(result.error || 'Upit nije poslan. Pošaljite ga e-poštom.')
        if (response.status >= 500) setDraft({ data, files: [...files] })
      }
    } catch {
      setMessage('Slanje nije potvrđeno. Upit možete pripremiti za e-poštu.'); setDraft({ data, files: [...files] })
    } finally { setPending(false) }
  }

  return (
    <section id="ponuda" className={`${styles.section} ${standalone ? styles.standalone : ''}`} aria-labelledby="quote-title">
      <div className={`gutter ${styles.layout}`}>
        <div className={styles.pitch}>
          <p className="label mb-6 opacity-70">Upit za ponudu</p>
          <Heading id="quote-title" className={`display ${styles.title}`}>Imate spisak materijala?</Heading>
          <p className={styles.lead}>Pošaljite materijal, količine, lokaciju i željeni rok. Poslovni nalog nije potreban.</p>
          <div className={styles.contact}><p className="label mb-3 opacity-70">Razgovarajte s prodajom</p><a href={COMPANY.phoneLandlineHref}>{COMPANY.phoneLandline}</a><a href={`mailto:${COMPANY.emailInfo}`}>{COMPANY.emailInfo}</a></div>
        </div>
        <form ref={form} className={styles.form} onSubmit={submit} onChangeCapture={() => { if (!pending) { setMessage(''); setDraft(null) } }}>
          <fieldset className={styles.group} disabled={pending}>
            <legend className={styles.legend}><span>01</span>Vaš kontakt</legend>
            <div className={styles.fields}>
              <label className={`${styles.field} ${styles.full}`}><span className={styles.label}>Ime ili firma *</span><input className={styles.input} name="name" autoComplete="organization" required maxLength={200} /></label>
              <label className={styles.field}><span className={styles.label}>E-pošta</span><input className={styles.input} name="email" type="email" autoComplete="email" maxLength={254} /></label>
              <label className={styles.field}><span className={styles.label}>Telefon</span><input className={styles.input} name="phone" type="tel" autoComplete="tel" maxLength={80} /></label>
            </div><p className={styles.help}>Navedite e-poštu ili telefon za odgovor.</p>
          </fieldset>
          <fieldset className={styles.group} disabled={pending}>
            <legend className={styles.legend}><span>02</span>Materijal i količine</legend>
            <label className={styles.field}><span className={styles.label}>Oblast ponude</span><select className={styles.input} name="program" defaultValue=""><option value="">Prema vašem spisku</option>{OFFERINGS.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label>
            <label className={`${styles.field} mt-5`}><span className={styles.label}>Šta vam je potrebno?</span><textarea className={styles.input} name="materials" maxLength={6000} placeholder={'Materijal / specifikacija · količina · jedinica\nIli priložite postojeći spisak.'} /></label>
            <input ref={upload} type="file" multiple accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png,.webp" className="sr-only" tabIndex={-1} aria-label="Priložite spisak materijala" onChange={event => addFiles(event.target.files)} />
            <button type="button" className={styles.upload} onClick={() => upload.current?.click()}><span>Dodajte spisak</span><span aria-hidden>＋</span></button>
            <p className={styles.help}>PDF, Excel ili fotografija · do 3 priloga, ukupno 3 MB.</p>
            {files.length > 0 && <ul className={styles.files}>{files.map((file, i) => <li key={`${file.name}-${file.size}`}><span>{file.name}</span><button type="button" aria-label={`Uklonite ${file.name}`} onClick={() => { setFiles(files.filter((_, index) => index !== i)); setDraft(null) }}>×</button></li>)}</ul>}
          </fieldset>
          <fieldset className={styles.group} disabled={pending}>
            <legend className={styles.legend}><span>03</span>Lokacija i rok</legend>
            <div className={styles.radios}>{[['dostava', 'Dostava'], ['preuzimanje', 'Preuzimanje u stovarištu']].map(([value, label]) => <label className={styles.radio} key={value}><input type="radio" name="method" value={value} checked={method === value} onChange={() => setMethod(value)} />{label}</label>)}</div>
            <div className={styles.fields}>
              {method === 'dostava' && <label className={styles.field}><span className={styles.label}>Mjesto isporuke *</span><input className={styles.input} name="location" autoComplete="street-address" required maxLength={300} /></label>}
              <label className={styles.field}><span className={styles.label}>Željeni rok</span><input className={styles.input} name="deadline" type="date" /></label>
              <label className={`${styles.field} ${styles.full}`}><span className={styles.label}>Dodatna napomena</span><textarea className={styles.input} name="note" maxLength={6000} placeholder="Faza radova, pristup lokaciji ili dodatne specifikacije." /></label>
            </div>
          </fieldset>
          <button className={styles.submit} type="submit" disabled={pending}><span>{pending ? 'Slanje upita…' : 'Pošalji upit za ponudu'}</span><span aria-hidden>→</span></button>
          <p className={styles.privacy}>Podatke koristimo za odgovor na upit. <Link href="/politika-privatnosti">Politika privatnosti</Link></p>
          {message && <div className={styles.status} role="status" aria-live="polite"><p>{message}</p>{draft && <><div className={styles.statusActions}><a href={`mailto:${COMPANY.emailInfo}?subject=${encodeURIComponent('Upit za ponudu')}&body=${encodeURIComponent(quoteText(draft.data))}`}>Otvorite e-poštu</a><button type="button" onClick={() => void downloadDraft(draft)}>Preuzmite poruku s prilozima</button></div><p className={styles.help}>Preuzetu poruku otvorite u aplikaciji za e-poštu i pošaljite je prodaji. Ako koristite prvi link, priloge dodajte u e-poštu.</p></>}</div>}
        </form>
      </div>
    </section>
  )
}
