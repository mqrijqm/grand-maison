'use client'

import { useEffect, useRef } from 'react'

// Pozadina footera je tamni sloj sa diskretnim rasterom iznad jarkog kobalta. Kursor kroz taj
// sloj pravi meke, spojene otvore i tako ostavlja plavi trag — kao da je boja fizički ispod
// footera. Trag ostaje do narednog resizea/reloada. Na dodirnim ekranima ostaje miran raster.

const STEP = 9 // razmak tačaka u CSS pikselima
const DOT = 1.75 // najveći poluprečnik tačke
const BRUSH = 132 // poluprečnik traga kursora
const COBALT = '49,86,234'

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
// Glatki šum niske frekvencije: lavirint je gust u "oblacima", a između ostaju prazna polja.
function noise(x: number, y: number) {
  const i = Math.floor(x), j = Math.floor(y)
  const fx = x - i, fy = y - j
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy)
  const a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), d = hash(i + 1, j + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

// Veličina tačke prati blagi šum, pa raster ima "oblake" gušćih i rjeđih tačaka (kao štampa).
function drawDots(ctx: CanvasRenderingContext2D, cols: number, rows: number, s: number) {
  ctx.beginPath()
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const n = noise(x / 14, y / 14) * 0.7 + noise(x / 5 + 30, y / 5) * 0.3
      const r = DOT * (0.3 + 0.7 * n) * s
      if (r < 0.45 * s) continue
      const px = (x * STEP + (y % 2) * STEP * 0.5) * s, py = y * STEP * s
      ctx.moveTo(px + r, py)
      ctx.arc(px, py, r, 0, Math.PI * 2)
    }
  }
  ctx.fill()
}

export default function FooterDots({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const follow = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const glow = follow.current
    const host = canvas?.parentElement
    if (!canvas || !glow || !host) return
    const ctx = canvas.getContext('2d')!
    const interactive = window.matchMedia('(pointer: fine)').matches

    let dpr = 1, w = 0, h = 0
    let previous: { x: number; y: number } | null = null

    function build() {
      canvas!.style.backgroundColor = 'var(--ink)'
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = host!.clientWidth
      h = host!.clientHeight
      const W = Math.max(1, Math.round(w * dpr)), H = Math.max(1, Math.round(h * dpr))
      canvas!.width = W
      canvas!.height = H
      const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#1b2436'
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = ink
      ctx.fillRect(0, 0, W, H)
      const cols = Math.ceil(w / STEP) + 2, rows = Math.ceil(h / STEP) + 2
      ctx.fillStyle = `rgba(${COBALT},0.28)`
      drawDots(ctx, cols, rows, dpr)
      previous = null
      canvas!.style.backgroundColor = 'transparent'
    }

    function dab(x: number, y: number) {
      const px = x * dpr, py = y * dpr, radius = BRUSH * dpr
      const grad = ctx.createRadialGradient(px, py, 0, px, py, radius)
      grad.addColorStop(0, 'rgba(0,0,0,0.98)')
      grad.addColorStop(0.58, 'rgba(0,0,0,0.82)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = grad
      ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2)
      ctx.globalCompositeOperation = 'source-over'
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = host.getBoundingClientRect()
      const next = { x: e.clientX - r.left, y: e.clientY - r.top }
      if (next.x < 0 || next.y < 0 || next.x > r.width || next.y > r.height) {
        previous = null
        glow.removeAttribute('data-active')
        return
      }
      glow.style.setProperty('--footer-x', `${next.x}px`)
      glow.style.setProperty('--footer-y', `${next.y}px`)
      glow.setAttribute('data-active', '')
      if (!previous) {
        dab(next.x, next.y)
      } else {
        const dx = next.x - previous.x, dy = next.y - previous.y
        const distance = Math.hypot(dx, dy)
        const steps = Math.max(1, Math.ceil(distance / (BRUSH * 0.22)))
        for (let i = 1; i <= steps; i++) {
          const t = i / steps
          dab(previous.x + dx * t, previous.y + dy * t)
        }
      }
      previous = next
    }

    let pending = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(pending)
      pending = requestAnimationFrame(build)
    })
    ro.observe(host)
    if (interactive) window.addEventListener('pointermove', onMove, { passive: true })
    build()

    return () => {
      cancelAnimationFrame(pending)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <>
      <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full bg-ink ${className}`} />
      <div ref={follow} aria-hidden className="footer-cursor-follow pointer-events-none absolute inset-0" />
    </>
  )
}
