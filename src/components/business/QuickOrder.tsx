'use client'

import { useId, useMemo, useState } from 'react'
import Cta from '@/components/ui/Cta'
import { addToCart, notify, openCart } from '@/lib/cart'
import { PRODUCTS, PRODUCT_MAP, plural } from '@/lib/shop'
import styles from './Business.module.css'

// Brza narudžba po šifri (Quick Order iz researcha, tačka 12.9): tabela šifra / količina, provjera šifre
// dok se kuca i "Dodaj sve u upit" — stavke idu u postojeću korpu/upit. Šifre iz Excela se mogu
// zalijepiti (šifra pa količina u redu, odvojeno tabom, ; ili razmakom). Šifre su iz demo kataloga.

type Row = { id: number; sku: string; qty: string }

let seq = 0
const blank = (sku = '', qty = ''): Row => ({ id: ++seq, sku, qty })

const norm = (s: string) => s.trim().toUpperCase()
const parseQty = (s: string) => {
  const n = parseFloat(s.replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : 0
}

/** "GKP-001;40" / "GKP-001\t40" / "GKP-001 40" → redovi; prazne i neispravne linije se preskaču. */
function parsePaste(text: string): Row[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim().split(/[\t;,]+|\s+/).filter(Boolean))
    .filter((cells) => cells.length >= 1)
    .map(([sku, qty = '']) => blank(norm(sku), qty))
}

const EXAMPLE = 'GKP-001\t40\nPRF-075\t24\nISO-001\t18'

export default function QuickOrder() {
  const listId = useId()
  const [rows, setRows] = useState<Row[]>(() => [blank('GKP-001', '40'), blank('PRF-075', '24'), blank()])
  const [paste, setPaste] = useState(false)
  const [pasteText, setPasteText] = useState('')

  const checked = useMemo(
    () =>
      rows.map((r) => {
        const p = PRODUCT_MAP[norm(r.sku)]
        const qty = parseQty(r.qty)
        return { ...r, product: p, qtyOk: qty > 0, qty, empty: !r.sku.trim() && !r.qty.trim() }
      }),
    [rows],
  )
  const ready = checked.filter((r) => r.product && r.qtyOk)

  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const remove = (id: number) => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : [blank()]))

  const addAll = () => {
    if (!ready.length) return
    ready.forEach((r) => addToCart(r.product!.id, r.qty))
    notify(`${ready.length} ${plural(ready.length, 'stavka dodata', 'stavke dodate', 'stavki dodato')} u upit`, { label: 'Korpa', open: 'cart' })
    openCart()
  }

  const applyPaste = () => {
    const parsed = parsePaste(pasteText)
    if (!parsed.length) return
    setRows((rs) => [...rs.filter((r) => r.sku.trim() || r.qty.trim()), ...parsed])
    setPasteText('')
    setPaste(false)
  }

  return (
    <div className={styles.qo}>
      <datalist id={listId}>
        {PRODUCTS.map((p) => (
          <option key={p.sku} value={p.sku}>
            {p.name}
          </option>
        ))}
      </datalist>

      <div className={styles.qoHead} aria-hidden>
        <span>Šifra</span>
        <span>Artikal</span>
        <span>Količina</span>
        <span />
      </div>

      <ul className={styles.qoRows}>
        {checked.map((r, i) => {
          const unknown = !r.empty && r.sku.trim() && !r.product
          return (
            <li key={r.id} className={`${styles.qoRow} ${unknown ? styles.qoBad : ''} ${r.product && r.qtyOk ? styles.qoOk : ''}`}>
              <input
                className={styles.qoInput}
                value={r.sku}
                onChange={(e) => update(r.id, { sku: e.target.value.toUpperCase() })}
                list={listId}
                placeholder="npr. GKP-001"
                aria-label={`Šifra, red ${i + 1}`}
                autoComplete="off"
                spellCheck={false}
              />
              <span className={styles.qoName}>
                {r.product ? r.product.name : unknown ? 'Nepoznata šifra' : <span className="opacity-40">—</span>}
              </span>
              <span className={styles.qoQtyWrap}>
                <input
                  className={`${styles.qoInput} ${styles.qoQty}`}
                  value={r.qty}
                  onChange={(e) => update(r.id, { qty: e.target.value })}
                  inputMode="decimal"
                  placeholder="0"
                  aria-label={`Količina, red ${i + 1}`}
                />
                <span className={styles.qoUnit}>{r.product?.unit ?? ''}</span>
              </span>
              <button type="button" className={styles.qoRemove} onClick={() => remove(r.id)} aria-label={`Ukloni red ${i + 1}`}>
                ×
              </button>
            </li>
          )
        })}
      </ul>

      <div className={styles.qoTools}>
        <button type="button" className={styles.qoTool} onClick={() => setRows((rs) => [...rs, blank()])}>
          + Novi red
        </button>
        <button type="button" className={styles.qoTool} onClick={() => setPaste((v) => !v)} aria-expanded={paste}>
          Zalijepite iz Excela
        </button>
      </div>

      {paste && (
        <div className={styles.qoPaste}>
          <label className="label opacity-60" htmlFor={`${listId}-paste`}>
            Šifra i količina, jedan artikal po redu
          </label>
          <textarea
            id={`${listId}-paste`}
            className={styles.qoArea}
            rows={5}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={EXAMPLE}
            spellCheck={false}
          />
          <div>
            <Cta onClick={applyPaste}>Prebaci u tabelu</Cta>
          </div>
        </div>
      )}

      <div className={styles.qoFoot}>
        <p className={styles.qoCount}>
          <strong>{ready.length}</strong> {plural(ready.length, 'stavka spremna', 'stavke spremne', 'stavki spremno')}
        </p>
        <Cta onClick={addAll} solid>
          Dodaj u upit
        </Cta>
      </div>
    </div>
  )
}
