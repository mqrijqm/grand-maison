'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

// Broj koji se "zakotrlja" do nove vrijednosti kad se unos promijeni. React iscrta samo početnu
// vrijednost; dalje tekst piše GSAP, pa nema sukoba između React-a i animacije.
// Uz prefers-reduced-motion broj se samo zamijeni.

const fmt = (n: number, d: number) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d })

export default function Num({ value, decimals = 0, className }: { value: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const cur = useRef({ v: value })
  const [first] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const o = cur.current
    const t = gsap.to(o, {
      v: value,
      duration: reduce ? 0 : 0.7,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = fmt(decimals ? o.v : Math.round(o.v), decimals)
      },
    })
    return () => {
      t.kill()
    }
  }, [value, decimals])

  return (
    <span ref={ref} className={className}>
      {fmt(first, decimals)}
    </span>
  )
}
