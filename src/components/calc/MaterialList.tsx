import type { W111Line } from '@/lib/w111'
import styles from './Calc.module.css'

// Rezultat kalkulatora kao uredna tabela: količina (desno poravnata, iste širine), naziv, pakovanje.
// Isti prikaz na početnoj i na /kalkulator.
export default function MaterialList({ lines, className = '' }: { lines: W111Line[]; className?: string }) {
  return (
    <ul data-bom-list className={`${styles.list} ${className}`}>
      {lines.map((l) => (
        <li key={l.key} data-bom className={styles.row}>
          <span className={styles.qty}>{l.packs}</span>
          <span className={styles.name}>{l.label}</span>
          <span className={styles.pack}>{l.packName}</span>
        </li>
      ))}
    </ul>
  )
}
