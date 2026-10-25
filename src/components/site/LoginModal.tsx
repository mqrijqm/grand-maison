'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLang } from '@/lib/i18n'
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

export default function LoginModal({ open, onClose, initialMode = 'login' }: { open: boolean; onClose: () => void; initialMode?: 'login' | 'register' }) {
  const { t, lang } = useLang()
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
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [reg, setReg] = useState({ name: '', jib: '', pdv: '', person: '', email: '', phone: '' })
  const [pending, setPending] = useState<Registration | null>(null)
  const [regError, setRegError] = useState('')

  useEffect(() => {
    if (!open) return
    const tm = setTimeout(() => {
      setPending(readReg())
      first.current?.focus()
    }, 60)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      clearTimeout(tm)
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firm.trim()) return setError(t('Upišite naziv firme ili JIB.', 'Enter the company name or JIB.'))
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError(t('Upišite ispravnu e-mail adresu.', 'Enter a valid e-mail address.'))
    if (pass.length < 6) return setError(t('Lozinka ima najmanje 6 znakova.', 'The password must be at least 6 characters.'))
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
    if (reg.name.trim().length < 2) return setRegError(t('Upišite naziv firme.', 'Enter the company name.'))
    if (!/^\d{13}$/.test(jib)) return setRegError(t('JIB ima 13 cifara.', 'The JIB has 13 digits.'))
    if (pdv && !/^\d{12}$/.test(pdv)) return setRegError(t('PDV broj ima 12 cifara (ili ostavite prazno ako firma nije u sistemu PDV-a).', 'The VAT number has 12 digits (or leave it empty if the company is not VAT-registered).'))
    if (reg.person.trim().length < 2) return setRegError(t('Upišite ime i prezime kontakt osobe.', "Enter the contact person's first and last name."))
    if (!/^\S+@\S+\.\S+$/.test(reg.email)) return setRegError(t('Upišite ispravnu e-mail adresu.', 'Enter a valid e-mail address.'))
    if (reg.phone.replace(/\D/g, '').length < 6) return setRegError(t('Upišite broj telefona.', 'Enter a phone number.'))
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
        <button type="button" className={s.close} onClick={onClose} aria-label={t('Zatvori prijavu', 'Close login')}>
          ×
        </button>
        <p className={s.brand}>
          Grand Company <span>Portal</span>
        </p>
        {mode === 'register' && pending ? (
          <div className={s.form} aria-live="polite">
            <h2 id={`${id}-t`} className={s.title}>
              {pending.status === 'approved' ? t('Nalog je odobren', 'Account approved') : pending.status === 'rejected' ? t('Zahtjev nije odobren', 'Request not approved') : t('Zahtjev čeka odobrenje', 'Request awaiting approval')}
            </h2>
            <ol className={s.steps}>
              <li data-state="done">
                <b>{t('Zahtjev poslat', 'Request sent')}</b>
                <span>{new Date(pending.sent).toLocaleDateString(lang === 'en' ? 'en-GB' : 'sr-Latn-BA')}</span>
              </li>
              <li data-state={pending.status ? 'done' : 'now'}>
                <b>{pending.status === 'rejected' ? t('Odbijeno', 'Declined') : pending.status === 'approved' ? t('Odobreno', 'Approved') : t('Čeka odobrenje', 'Awaiting approval')}</b>
                <span>{pending.status === 'rejected' ? t('Prodaja vam se javlja telefonom', 'Our sales team will call you') : t('Prodaja provjerava podatke firme', 'Our sales team is verifying the company details')}</span>
              </li>
              <li data-state={pending.status === 'approved' ? 'now' : 'next'}>
                <b>{t('Nalog aktivan', 'Account active')}</b>
                <span>{t('Vidite cijene i naručujete', 'See prices and place orders')}</span>
              </li>
            </ol>
            <dl className={s.summary}>
              <div>
                <dt>{t('Firma', 'Company')}</dt>
                <dd>{pending.name}</dd>
              </div>
              <div>
                <dt>JIB</dt>
                <dd>{pending.jib}</dd>
              </div>
              <div>
                <dt>{t('PDV broj', 'VAT number')}</dt>
                <dd>{pending.pdv || t('nije u sistemu PDV-a', 'not VAT-registered')}</dd>
              </div>
              <div>
                <dt>{t('Kontakt', 'Contact')}</dt>
                <dd>
                  {pending.person} · {pending.email} · {pending.phone}
                </dd>
              </div>
            </dl>
            <p className={s.note}>
              {t(
                'Prodaja ručno odobrava svaku firmu prije nego što vidi cijene i uslove. Kad je nalog aktivan, javljamo vam se e-poštom. Demo: zahtjev je sačuvan samo u ovom browseru i nije poslat.',
                'Our sales team approves every company manually before it can see prices and terms. Once the account is active, we will contact you by e-mail. Demo: the request is saved only in this browser and has not been sent.',
              )}
            </p>
            <button type="button" className={s.submit} onClick={() => setMode('login')}>
              {t('Na prijavu', 'Go to login')}
            </button>
            <button type="button" className={s.link} onClick={cancelRegistration}>
              {t('Povuci zahtjev i počni ponovo', 'Withdraw the request and start over')}
            </button>
          </div>
        ) : mode === 'register' ? (
          <form className={s.form} onSubmit={register} noValidate>
            <h2 id={`${id}-t`} className={s.title}>
              {t('Registracija firme', 'Company registration')}
            </h2>
            <p className={s.lead}>{t('Pošaljite podatke firme. Prodaja odobrava nalog prije nego što vidite cijene.', 'Send your company details. Our sales team approves the account before you can see prices.')}</p>
            <label className={s.field}>
              <span>{t('Naziv firme', 'Company name')}</span>
              <input {...field('name')} autoComplete="organization" placeholder={t('npr. DEMO GRADNJA d.o.o.', 'e.g. DEMO GRADNJA d.o.o.')} />
            </label>
            <div className={s.pair}>
              <label className={s.field}>
                <span>JIB</span>
                <input {...field('jib')} inputMode="numeric" placeholder={t('13 cifara', '13 digits')} maxLength={15} />
              </label>
              <label className={s.field}>
                <span>{t('PDV broj', 'VAT number')}</span>
                <input {...field('pdv')} inputMode="numeric" placeholder={t('12 cifara', '12 digits')} maxLength={14} />
              </label>
            </div>
            <label className={s.field}>
              <span>{t('Kontakt osoba', 'Contact person')}</span>
              <input {...field('person')} autoComplete="name" placeholder={t('Ime i prezime', 'First and last name')} />
            </label>
            <div className={s.pair}>
              <label className={s.field}>
                <span>{t('E-mail', 'E-mail')}</span>
                <input type="email" {...field('email')} autoComplete="email" placeholder="nabavka@firma.ba" />
              </label>
              <label className={s.field}>
                <span>{t('Telefon', 'Phone')}</span>
                <input type="tel" {...field('phone')} autoComplete="tel" placeholder="065 …" />
              </label>
            </div>
            {regError && (
              <p className={s.error} role="alert">
                {regError}
              </p>
            )}
            <button type="submit" className={s.submit}>
              {t('Pošalji zahtjev', 'Send request')}
            </button>
            <p className={s.foot}>
              {t('Firma već ima nalog?', 'Already have a company account?')}{' '}
              <button type="button" className={s.link} onClick={() => setMode('login')}>
                {t('Prijava', 'Log in')}
              </button>
            </p>
          </form>
        ) : !done ? (
          <form className={s.form} onSubmit={submit} noValidate>
            <h2 id={`${id}-t`} className={s.title}>
              {t('Prijava na nalog firme', 'Log in to your company account')}
            </h2>
            <label className={s.field}>
              <span>{t('Firma ili JIB', 'Company or JIB')}</span>
              <input ref={first} value={firm} onChange={(e) => setFirm(e.target.value)} autoComplete="organization" placeholder={t('npr. DEMO GRADNJA d.o.o.', 'e.g. DEMO GRADNJA d.o.o.')} />
            </label>
            <label className={s.field}>
              <span>{t('E-mail', 'E-mail')}</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" placeholder="nabavka@firma.ba" />
            </label>
            <label className={s.field}>
              <span>{t('Lozinka', 'Password')}</span>
              <span className={s.pass}>
                <input type={show ? 'text' : 'password'} value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? t('Sakrij lozinku', 'Hide password') : t('Prikaži lozinku', 'Show password')}>
                  {show ? t('Sakrij', 'Hide') : t('Prikaži', 'Show')}
                </button>
              </span>
            </label>
            <div className={s.row}>
              <label className={s.check}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                {t('Zapamti me na ovom uređaju', 'Remember me on this device')}
              </label>
              <Link href="/kontakt" onClick={onClose} className={s.link}>
                {t('Zaboravljena lozinka?', 'Forgot your password?')}
              </Link>
            </div>
            {error && (
              <p className={s.error} role="alert">
                {error}
              </p>
            )}
            <button type="submit" className={s.submit}>
              {t('Prijava', 'Log in')}
            </button>
            <p className={s.foot}>
              {pending ? t('Vaš zahtjev za nalog čeka odobrenje. ', 'Your account request is awaiting approval. ') : t('Nemate nalog? ', 'No account yet? ')}
              <button type="button" className={s.link} onClick={() => setMode('register')}>
                {pending ? t('Pogledajte status', 'View status') : t('Registrujte firmu', 'Register your company')}
              </button>
            </p>
          </form>
        ) : (
          <div className={s.form} aria-live="polite">
            <h2 id={`${id}-t`} className={s.title}>
              {t('Portal je u pripremi', 'The portal is coming soon')}
            </h2>
            <p className={s.note}>
              {t(
                'B2B portal je trenutno interaktivni prikaz, prava prijava još nije aktivna. Vaši podaci nisu poslati. Pogledajte kako portal radi na primjeru demo firme.',
                'The B2B portal is currently an interactive preview; real login is not active yet. Your details have not been sent. See how the portal works using a demo company.',
              )}
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
              {t('Otvori prikaz portala', 'Open the portal preview')}
            </button>
            <button
              type="button"
              className={s.link}
              onClick={() => {
                setDone(false)
                setMode('register')
              }}
            >
              {t('Zatražite poslovni nalog', 'Request a business account')}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
