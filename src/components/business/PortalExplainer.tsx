'use client'

import { useEffect, useRef, useState } from 'react'
import Dashboard from '@/components/portal/Dashboard'
import { PORTAL_GROUPS } from '@/lib/business'
import styles from './Business.module.css'

// Dashboard korak po korak: lijevo objašnjenja, desno zalijepljen dashboard. Dok se čita korak,
// dashboard se sam prebaci na taj ekran i kamera zumira na dio o kome je riječ.
// Na telefonu nema zalijepljenog prozora: koraci su kartice, a živi demo je iznad.
// Dvije grupe (početak saradnje, svakodnevni rad), brojevi idu redom kroz obje.
const STEPS = PORTAL_GROUPS.flatMap((g) => g.steps)
export default function PortalExplainer() {
  const list = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const items = [...list.current!.querySelectorAll<HTMLElement>('[data-step]')]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    items.forEach((i) => io.observe(i))
    return () => io.disconnect()
  }, [])

  const step = STEPS[active]
  let n = 0

  return (
    <div className={styles.explain}>
      <div ref={list} className={styles.explainSteps}>
        {PORTAL_GROUPS.map((g) => (
          <div key={g.title} className={styles.explainGroup}>
            <header className={styles.explainGroupHead}>
              <p className={`label ${styles.kicker}`}>{g.kicker}</p>
              <h3 className={styles.explainGroupTitle}>{g.title}</h3>
            </header>
            <ol>
              {g.steps.map((s) => {
                const i = n++
                const num = String(i + 1).padStart(2, '0')
                return (
                  <li key={s.title} data-step={i} data-on={i === active || undefined} className={styles.explainStep}>
                    <span aria-hidden className={styles.explainNum}>{num}</span>
                    <p className={`label ${styles.explainLabel}`}>Korak {num}</p>
                    <h4 className={styles.explainTitle}>{s.title}</h4>
                    <p className={styles.explainText}>{s.text}</p>
                    <ul className={styles.explainPoints}>
                      {s.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>
      <div className={styles.explainStage}>
        <div className={styles.explainSticky}>
          <p className={`label ${styles.explainNow}`}>
            <i />
            {String(active + 1).padStart(2, '0')} · {step.title}
          </p>
          <Dashboard variant="compact" tour={false} show={{ view: step.view, focus: step.focus }} />
        </div>
      </div>
    </div>
  )
}
