'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import s from './LoginModal.module.css'

// Prijava u B2B portal (navbar). Isti izgled kao scena "Prijavite se na nalog firme" na /za-firme,
// ali sa pravim poljima i proširena za firmu (firma/JIB, korisnik, lozinka). Portal je demo:
// prijava se ne šalje nigdje, nego vodi na interaktivni prikaz portala i to jasno kaže.
// Registracija firme: naziv, JIB, PDV broj i kontakt; zahtjev dobija status "čeka odobrenje" (prodaja ga
// ručno odobrava prije nego što firma vidi cijene). Demo: zahtjev se pamti samo u ovom browseru.

type Registration = { name: string; jib: string; pdv: string; person: string; email: string; phone: string; sent: string; status?: 'approved' | 'rejected' }
const REG_KEY = 'grand-b2b-registration-v1'
const readReg = (): Registration | null => {
  try {
    return JSON.parse(window.localStorage.getItem(REG_KEY) || 'null')
  } catch {
    return null
  }
}

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const id = useId()
  const first = useRef<HTMLInputElement>(null)
  const [firm, setFirm] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [reg, setReg] = useState({ name: '', jib: '', pdv: '', person: '', email: '', phone: '' })
  const [pending, setPending] = useState<Registration | null>(null)
  const [regError, setRegError] = useState('')

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      setPending(readReg())
      first.current?.focus()
    }, 60)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firm.trim()) return setError('Upišite naziv firme ili JIB.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Upišite ispravnu e-mail adresu.')
    if (pass.length < 6) return setError('Lozinka ima najmanje 6 znakova.')
    setError('')
    setDone(true)
  }

  const field = (key: keyof typeof reg) => ({
    value: reg[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setReg((r) => ({ ...r, [key]: e.target.value })),
  })
  const register = (e: React.FormEvent) => {
    e.preventDefault()
    const jib = reg.jib.replace(/\s/g, '')
    const pdv = reg.pdv.replace(/\s/g, '')
    if (reg.name.trim().length < 2) return setRegError('Upišite naziv firme.')
    if (!/^\d{13}$/.test(jib)) return setRegError('JIB ima 13 cifara.')
    if (pdv && !/^\d{12}$/.test(pdv)) return setRegError('PDV broj ima 12 cifara (ili ostavite prazno ako firma nije u sistemu PDV-a).')
    if (reg.person.trim().length < 2) return setRegError('Upišite ime i prezime kontakt osobe.')
    if (!/^\S+@\S+\.\S+$/.test(reg.email)) return setRegError('Upišite ispravnu e-mail adresu.')
    if (reg.phone.replace(/\D/g, '').length < 6) return setRegError('Upišite broj telefona.')
    setRegError('')
    const next: Registration = { ...reg, jib, pdv, sent: new Date().toISOString() }
    try {
      window.localStorage.setItem(REG_KEY, JSON.stringify(next))
    } catch {}
    setPending(next)
  }
  const cancelRegistration = () => {
    try {
      window.localStorage.removeItem(REG_KEY)
    } catch {}
    setPending(null)
    setMode('register')
  }

  return createPortal(
    <div className={s.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={s.dialog} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`}>
        <button type="button" className={s.close} onClick={onClose} aria-label="Zatvori prijavu">
          ×
        </button>
        <p className={s.brand}>
          Grand Company <span>Portal</span>
        </p>
        {mode === 'register' && pending ? (
          <div className={s.form} aria-live="polite">
            <h2 id={`${id}-t`} className={s.title}>
              {pending.status === 'approved' ? 'Nalog je odobren' : pending.status === 'rejected' ? 'Zahtjev nije odobren' : 'Zahtjev čeka odobrenje'}
            </h2>
            <ol className={s.steps}>
              <li data-state="done">
                <b>Zahtjev poslat</b>
                <span>{new Date(pending.sent).toLocaleDateString('sr-Latn-BA')}</span>
              </li>
              <li data-state={pending.status ? 'done' : 'now'}>
                <b>{pending.status === 'rejected' ? 'Odbijeno' : pending.status === 'approved' ? 'Odobreno' : 'Čeka odobrenje'}</b>
                <span>{pending.status === 'rejected' ? 'Prodaja vam se javlja telefonom' : 'Prodaja provjerava podatke firme'}</span>
              </li>
              <li data-state={pending.status === 'approved' ? 'now' : 'next'}>
                <b>Nalog aktivan</b>
                <span>Vidite cijene i naručujete</span>
              </li>
            </ol>
            <dl className={s.summary}>
              <div>
                <dt>Firma</dt>
                <dd>{pending.name}</dd>
              </div>
              <div>
                <dt>JIB</dt>
                <dd>{pending.jib}</dd>
              </div>
              <div>
                <dt>PDV broj</dt>
                <dd>{pending.pdv || 'nije u sistemu PDV-a'}</dd>
              </div>
              <div>
                <dt>Kontakt</dt>
                <dd>
                  {pending.person} · {pending.email} · {pending.phone}
                </dd>
              </div>
            </dl>
            <p className={s.note}>
              Prodaja ručno odobrava svaku firmu prije nego što vidi cijene i uslove. Kad je nalog aktivan, javljamo vam se e-poštom. Demo: zahtjev je sačuvan samo u ovom browseru i nije poslat.
            </p>
            <button type="button" className={s.submit} onClick={() => setMode('login')}>
              Na prijavu
            </button>
            <button type="button" className={s.link} onClick={cancelRegistration}>
              Povuci zahtjev i počni ponovo
            </button>
          </div>
        ) : mode === 'register' ? (
          <form className={s.form} onSubmit={register} noValidate>
            <h2 id={`${id}-t`} className={s.title}>
              Registracija firme
            </h2>
            <p className={s.lead}>Pošaljite podatke firme. Prodaja odobrava nalog prije nego što vidite cijene.</p>
            <label className={s.field}>
              <span>Naziv firme</span>
              <input {...field('name')} autoComplete="organization" placeholder="npr. DEMO GRADNJA d.o.o." />
            </label>
            <div className={s.pair}>
              <label className={s.field}>
                <span>JIB</span>
                <input {...field('jib')} inputMode="numeric" placeholder="13 cifara" maxLength={15} />
              </label>
              <label className={s.field}>
                <span>PDV broj</span>
                <input {...field('pdv')} inputMode="numeric" placeholder="12 cifara" maxLength={14} />
              </label>
            </div>
            <label className={s.field}>
              <span>Kontakt osoba</span>
              <input {...field('person')} autoComplete="name" placeholder="Ime i prezime" />
            </label>
            <div className={s.pair}>
              <label className={s.field}>
                <span>E-mail</span>
                <input type="email" {...field('email')} autoComplete="email" placeholder="nabavka@firma.ba" />
              </label>
              <label className={s.field}>
                <span>Telefon</span>
                <input type="tel" {...field('phone')} autoComplete="tel" placeholder="065 …" />
              </label>
            </div>
            {regError && (
              <p className={s.error} role="alert">
                {regError}
              </p>
            )}
            <button type="submit" className={s.submit}>
              Pošalji zahtjev
            </button>
            <p className={s.foot}>
              Firma već ima nalog?{' '}
              <button type="button" className={s.link} onClick={() => setMode('login')}>
                Prijava
              </button>
            </p>
          </form>
        ) : !done ? (
          <form className={s.form} onSubmit={submit} noValidate>
            <h2 id={`${id}-t`} className={s.title}>
              Prijava na nalog firme
            </h2>
            <label className={s.field}>
              <span>Firma ili JIB</span>
              <input ref={first} value={firm} onChange={(e) => setFirm(e.target.value)} autoComplete="organization" placeholder="npr. DEMO GRADNJA d.o.o." />
            </label>
            <label className={s.field}>
              <span>E-mail</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" placeholder="nabavka@firma.ba" />
            </label>
            <label className={s.field}>
              <span>Lozinka</span>
              <span className={s.pass}>
                <input type={show ? 'text' : 'password'} value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Sakrij lozinku' : 'Prikaži lozinku'}>
                  {show ? 'Sakrij' : 'Prikaži'}
                </button>
              </span>
            </label>
            <div className={s.row}>
              <label className={s.check}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Zapamti me na ovom uređaju
              </label>
              <Link href="/kontakt" onClick={onClose} className={s.link}>
                Zaboravljena lozinka?
              </Link>
            </div>
            {error && (
              <p className={s.error} role="alert">
                {error}
              </p>
            )}
            <button type="submit" className={s.submit}>
              Prijava
            </button>
            <p className={s.foot}>
              {pending ? 'Vaš zahtjev za nalog čeka odobrenje. ' : 'Nemate nalog? '}
              <button type="button" className={s.link} onClick={() => setMode('register')}>
                {pending ? 'Pogledajte status' : 'Registrujte firmu'}
              </button>
            </p>
          </form>
        ) : (
          <div className={s.form} aria-live="polite">
            <h2 id={`${id}-t`} className={s.title}>
              Portal je u pripremi
            </h2>
            <p className={s.note}>
              B2B portal je trenutno interaktivni prikaz, prava prijava još nije aktivna. Vaši podaci nisu poslati. Pogledajte kako portal radi na primjeru demo firme.
            </p>
            <button
              type="button"
              className={s.submit}
              onClick={() => {
                onClose()
                setDone(false)
                router.push('/za-firme#portal')
              }}
            >
              Otvori prikaz portala
            </button>
            <Link href="/upit-za-izvodjace?vrsta=saradnja" onClick={onClose} className={s.link}>
              Zatražite poslovni nalog
            </Link>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
