'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

declare global {
  interface Window {
    /** Lenis instanca koju SmoothScroll ostavlja za programsko skrolovanje (hero, mali znak, testovi). */
    __gcLenis?: {
      scrollTo: (y: number, o?: Record<string, unknown>) => void
      stop?: () => void
      start?: () => void
      options?: Record<string, unknown>
    } | null
  }
}

// Lenis mora da vozi GSAP-ov ticker, inače animacije "kasne" za skrolom.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1 }}>
      <ScrollSync />
      {children}
    </ReactLenis>
  )
}

function ScrollSync() {
  const lenis = useLenis()

  // Ručno vraćanje pozicije sprečava kasni skok kad se stranica hidrira.
  // Ne pomjeramo korisnika na vrh: možda je već počeo da skroluje.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    // React je preuzeo stranicu: dijelovi koji zavise od podataka iz browsera (prijava, korpa) se sada pokažu.
    document.documentElement.setAttribute('data-hydrated', '')
  }, [])

  useEffect(() => {
    if (!lenis) return
    const activeLenis = lenis
    function update(time: number) {
      activeLenis.raf(time * 1000)
      // Ostavljamo ručku za programsko skrolovanje (npr. scrubber u Kaolin sekciji).
      window.__gcLenis = activeLenis
    }
    window.__gcLenis = lenis
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    lenis.on('scroll', ScrollTrigger.update)
    lenis.resize()
    ScrollTrigger.update()
    // Visina stranice se mijenja i posle učitavanja (pinovane sekcije, 3D scena, slike). Lenis pamti
    // staru granicu skrola, pa bi stao prije dna (footer odsječen). Mjeri se ponovo poslije svakog
    // ScrollTrigger osvježavanja i kad se promijeni visina tijela stranice.
    const resize = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', resize)
    const ro = new ResizeObserver(resize)
    ro.observe(document.body)

    return () => {
      gsap.ticker.remove(update)
      lenis.off('scroll', ScrollTrigger.update)
      ScrollTrigger.removeEventListener('refresh', resize)
      ro.disconnect()
      if (window.__gcLenis === lenis) window.__gcLenis = null
    }
  }, [lenis])

  return null
}
