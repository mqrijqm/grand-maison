'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import s from './LoginModal.module.css'

// Prijava u B2B portal (navbar). Isti izgled kao scena "Prijavite se na nalog firme" na /za-firme,
// ali sa pravim poljima i proširena za firmu (firma/JIB, korisnik, lozinka). Portal je demo:
// prijava se ne šalje nigdje, nego vodi na interaktivni prikaz portala i to jasno kaže.
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

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => first.current?.focus(), 60)
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

  return createPortal(
    <div className={s.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={s.dialog} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`}>
        <button type="button" className={s.close} onClick={onClose} aria-label="Zatvori prijavu">
          ×
        </button>
        <p className={s.brand}>
          Grand Company <span>Portal</span>
        </p>
        {!done ? (
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
              Nemate nalog?{' '}
              <Link href="/upit-za-izvodjace?vrsta=saradnja" onClick={onClose} className={s.link}>
                Zatražite poslovni nalog
              </Link>
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
