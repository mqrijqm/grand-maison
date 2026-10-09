'use client'

import { useEffect, useRef, useState } from 'react'
import Dashboard from '@/components/portal/Dashboard'
import { PORTAL_STEPS } from '@/lib/business'
import styles from './Business.module.css'

// Dashboard korak po korak: lijevo objašnjenja, desno zalijepljen dashboard. Dok se čita korak,
// dashboard se sam prebaci na taj ekran i kamera zumira na dio o kome je riječ.
// Na telefonu nema zalijepljenog prozora: koraci su kartice, a živi demo je iznad.
export default function PortalExplainer() {
  const list = useRef<HTMLOListElement>(null)
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

  const step = PORTAL_STEPS[active]

  return (
    <div className={styles.explain}>
      <ol ref={list} className={styles.explainSteps}>
        {PORTAL_STEPS.map((s, i) => (
          <li key={s.title} data-step={i} data-on={i === active || undefined} className={styles.explainStep}>
            <span className={styles.explainNum}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className={styles.explainTitle}>{s.title}</h3>
            <p className={styles.explainText}>{s.text}</p>
            <ul className={styles.explainPoints}>
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
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
