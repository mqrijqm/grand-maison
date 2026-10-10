'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '@/components/portal/Icon'
import {
  DOCS,
  FIRM,
  GROUPS,
  LISTS,
  MATERIALS,
  OFFERS,
  ORDERS,
  SITES,
  STEPS,
  USERS,
  amount,
  dateAgo,
  km,
  name,
  site,
  unit,
  type Line,
  type Offer,
  type Order,
} from '@/lib/b2b-demo'
import s from './Showcase.module.css'

// Interaktivni prikaz predloženog B2B portala (demo). Sve je lokalno stanje u browseru:
// upit se ne šalje, ponudu "pripremi" simulacija, statusi se pomjeraju dugmetom.
// Fokus je na naručivanju materijala, ne na analitici: nema grafikona, limita ni zaliha.

type View = 'pregled' | 'materijali' | 'ponude' | 'narudzbe' | 'gradilista' | 'dokumenti'
const NAV: { id: View; label: string; icon: string }[] = [
  { id: 'pregled', label: 'Pregled', icon: 'pregled' },
  { id: 'materijali', label: 'Materijali', icon: 'brza' },
  { id: 'ponude', label: 'Ponude', icon: 'ponude' },
  { id: 'narudzbe', label: 'Narudžbe', icon: 'narudzbe' },
  { id: 'gradilista', label: 'Gradilišta', icon: 'gradilista' },
  { id: 'dokumenti', label: 'Dokumenti', icon: 'dokumenti' },
]
const CAPTION: Record<View, [string, string]> = {
  pregled: ['Pregled', 'Šta danas čeka vašu odluku: ponude za potvrdu, isporuke i nastavak upita.'],
  materijali: ['Materijali i brza narudžba', 'Odaberite artikle, upišite količine i pošaljite jedan upit za više proizvoda.'],
  ponude: ['Ponude', 'Ponude koje prodaja pripremi po vašem upitu. Provjerite stavke i potvrdite.'],
  narudzbe: ['Narudžbe', 'Status svake narudžbe i dogovorena dostava ili preuzimanje.'],
  gradilista: ['Gradilišta', 'Upiti, ponude i narudžbe razvrstani po mjestu isporuke.'],
  dokumenti: ['Dokumenti', 'Ponude, otpremnice i fakture uz vaše narudžbe, na jednom mjestu.'],
}
const statusKind = (o: Order) => (o.step >= 4 ? 'done' : o.step === 3 ? 'ready' : 'prep')
const orderStatus = (o: Order) => (o.step === 3 ? (o.mode === 'Preuzimanje' ? 'Spremno za preuzimanje' : 'Na putu ka gradilištu') : o.step === 4 ? (o.mode === 'Preuzimanje' ? 'Preuzeto' : 'Isporučeno') : STEPS[o.step])

export default function Showcase() {
  const [view, setView] = useState<View>('pregled')
  const [draft, setDraft] = useState<Line[]>([
    { sku: 'GKP-001', qty: 120 },
    { sku: 'PRF-075', qty: 40 },
  ])
  const [draftSite, setDraftSite] = useState('a')
  const [mode, setMode] = useState<'Dostava' | 'Preuzimanje'>('Dostava')
  const [offers, setOffers] = useState<Offer[]>(OFFERS)
  const [orders, setOrders] = useState<Order[]>(ORDERS)
  const [offerSel, setOfferSel] = useState(OFFERS[0].no)
  const [orderSel, setOrderSel] = useState(ORDERS[0].no)
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<string>('sve')
  const [toast, setToast] = useState<string | null>(null)
  const [activity, setActivity] = useState<{ t: string; text: string }[]>([
    { t: 'Juče', text: 'Prodaja je poslala ponudu P-26-0142 za Lamelu A' },
    { t: 'Juče', text: 'GC-26-04498 je spremna za preuzimanje na stovarištu' },
    { t: '27.09.', text: 'GC-26-04402 isporučena na Lamelu A' },
  ])
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const seq = useRef(150)
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const say = (text: string) => {
    setToast(text)
    timers.current.push(setTimeout(() => setToast((t) => (t === text ? null : t)), 3200))
  }
  const log = (text: string) => setActivity((a) => [{ t: 'Sada', text }, ...a].slice(0, 6))
  const go = (v: View) => setView(v)

  const addLine = (sku: string, qty: number) =>
    setDraft((d) => (d.some((l) => l.sku === sku) ? d.map((l) => (l.sku === sku ? { ...l, qty: l.qty + qty } : l)) : [...d, { sku, qty }]))
  const loadLines = (lines: Line[], label: string) => {
    setDraft(lines.map((l) => ({ ...l })))
    go('materijali')
    say(`${label}: stavke su u upitu, možete ih mijenjati`)
  }

  const send = () => {
    if (!draft.length) return
    const no = `P-26-0${seq.current++}`
    const lines = draft
    setOffers((o) => [{ no, site: draftSite, title: `Upit, ${lines.length} stavki`, lines, status: 'Kod prodaje', validDays: 14, days: 0, demo: true }, ...o])
    setOfferSel(no)
    setDraft([])
    log(`Upit za ${site(draftSite).name} poslat prodaji (simulacija)`)
    say('Simulacija: upit je kod prodaje. U demu se ništa ne šalje.')
    go('ponude')
    // Simulacija: prodaja priprema ponudu.
    timers.current.push(
      setTimeout(() => {
        setOffers((o) => o.map((x) => (x.no === no ? { ...x, status: 'Čeka potvrdu', title: `Ponuda po vašem upitu, ${lines.length} stavki` } : x)))
        log(`Prodaja je pripremila ponudu ${no} (simulacija)`)
        say(`Simulacija: stigla je ponuda ${no}`)
      }, 2600),
    )
  }
  const confirm = (o: Offer) => {
    setOffers((all) => all.map((x) => (x.no === o.no ? { ...x, status: 'Potvrđena' } : x)))
    const no = `GC-26-0${4520 + seq.current++}`
    setOrders((all) => [{ no, site: o.site, step: 1, mode, slot: 'Termin dogovara prodaja', lines: o.lines, days: 0, from: o.no }, ...all])
    setOrderSel(no)
    log(`Ponuda ${o.no} potvrđena, otvorena narudžba ${no} (simulacija)`)
    say(`Simulacija: ponuda potvrđena, narudžba ${no} je otvorena`)
  }
  const advance = (o: Order) => {
    const step = Math.min(4, o.step + 1)
    setOrders((all) => all.map((x) => (x.no === o.no ? { ...x, step, slot: step === 3 ? (x.mode === 'Dostava' ? 'Danas, 08–10h' : 'Danas, 13–15h') : step === 4 ? 'Završeno danas' : x.slot } : x)))
    log(`${o.no}: ${orderStatus({ ...o, step })} (simulacija)`)
  }

  const offer = offers.find((o) => o.no === offerSel) ?? offers[0]
  const order = orders.find((o) => o.no === orderSel) ?? orders[0]
  const pending = offers.filter((o) => o.status === 'Čeka potvrdu')
  const active = orders.filter((o) => o.step < 4)
  const lastDone = orders.find((o) => o.step === 4)
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MATERIALS.filter((m) => (group === 'sve' || m.group === group) && (!q || m.name.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q)))
  }, [query, group])
  const [title, sub] = CAPTION[view]

  return (
    <div className={s.wrap}>
      <div className={s.window} data-view={view}>
        <div className={s.chrome} aria-hidden>
          <span className={s.dots}>
            <i />
            <i />
            <i />
          </span>
          <span className={s.url}>portal.grandcompany.ba/{view}</span>
          <span className={s.demo}>Demo podaci</span>
        </div>
        <div className={s.body}>
          <aside className={s.side}>
            <div className={s.account}>
              <span className={s.avatar}>{FIRM.short}</span>
              <span>
                <b>{FIRM.name}</b>
                <i>{FIRM.user}</i>
              </span>
            </div>
            <nav className={s.nav} aria-label="Portal (demo)">
              {NAV.map((n) => (
                <button key={n.id} type="button" aria-current={view === n.id || undefined} onClick={() => go(n.id)}>
                  <Icon name={n.icon} />
                  <span>{n.label}</span>
                  {n.id === 'ponude' && pending.length > 0 && <em>{pending.length}</em>}
                  {n.id === 'materijali' && draft.length > 0 && <em>{draft.length}</em>}
                </button>
              ))}
            </nav>
          </aside>

          <main className={s.main}>
            <header className={s.head}>
              <div>
                <h3>{title}</h3>
                <p>{sub}</p>
              </div>
              {view !== 'materijali' && (
                <button type="button" className={s.primary} onClick={() => go('materijali')}>
                  <Icon name="plus" /> Novi upit
                </button>
              )}
            </header>

            <div className={s.canvas} key={view}>
              {view === 'pregled' && (
                <>
                  <ul className={s.next} aria-label="Sljedeći koraci">
                    {pending.slice(0, 1).map((o) => (
                      <li key={o.no} data-k="offer">
                        <span className={s.kicker}>Ponuda čeka potvrdu</span>
                        <b>
                          {o.no} · {site(o.site).name}
                        </b>
                        <i>
                          {o.lines.length} stavki · važi {o.validDays} dana
                        </i>
                        <button
                          type="button"
                          className={s.primary}
                          onClick={() => {
                            setOfferSel(o.no)
                            go('ponude')
                          }}
                        >
                          Pregledaj ponudu
                        </button>
                      </li>
                    ))}
                    {active.slice(0, 2).map((o) => (
                      <li key={o.no}>
                        <span className={s.kicker}>{o.mode === 'Dostava' ? 'Dostava' : 'Preuzimanje'}</span>
                        <b>
                          {o.slot} · {o.mode === 'Dostava' ? site(o.site).name : 'Stovarište'}
                        </b>
                        <i>
                          {o.no} · <Status o={o} />
                        </i>
                        <button
                          type="button"
                          className={s.ghost}
                          onClick={() => {
                            setOrderSel(o.no)
                            go('narudzbe')
                          }}
                        >
                          Detalji
                        </button>
                      </li>
                    ))}
                    {draft.length > 0 && (
                      <li>
                        <span className={s.kicker}>Upit u pripremi</span>
                        <b>{draft.length} stavki, nije poslat</b>
                        <i>{site(draftSite).name}</i>
                        <button type="button" className={s.ghost} onClick={() => go('materijali')}>
                          Nastavi upit
                        </button>
                      </li>
                    )}
                  </ul>

                  <div className={s.cols}>
                    <section className={s.card}>
                      <h4>Brzo do materijala</h4>
                      <label className={s.search}>
                        <Icon name="search" />
                        <input
                          placeholder="Šifra ili naziv, npr. CW 75"
                          aria-label="Traži materijal"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setQuery(e.currentTarget.value)
                              go('materijali')
                            }
                          }}
                        />
                      </label>
                      <div className={s.chips}>
                        {GROUPS.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              setGroup(g.id)
                              go('materijali')
                            }}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                      <h4 className={s.sub}>Ponovite nabavku</h4>
                      <ul className={s.rows}>
                        {lastDone && (
                          <li>
                            <span>
                              <b>Narudžba {lastDone.no}</b>
                              <i>
                                {site(lastDone.site).name} · {lastDone.lines.length} stavki
                              </i>
                            </span>
                            <button type="button" className={s.ghost} onClick={() => loadLines(lastDone.lines, `Narudžba ${lastDone.no}`)}>
                              <Icon name="repeat" /> Ponovi
                            </button>
                          </li>
                        )}
                        {LISTS.slice(0, 2).map((l) => (
                          <li key={l.id}>
                            <span>
                              <b>{l.name}</b>
                              <i>Sačuvana lista · {l.lines.length} stavki</i>
                            </span>
                            <button type="button" className={s.ghost} onClick={() => loadLines(l.lines, l.name)}>
                              U upit
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section className={s.card}>
                      <h4>Nedavna aktivnost</h4>
                      <ul className={s.feed}>
                        {activity.map((a, i) => (
                          <li key={`${a.text}-${i}`}>
                            <time>{a.t}</time>
                            <span>{a.text}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </>
              )}

              {view === 'materijali' && (
                <div className={s.split}>
                  <section className={s.card}>
                    <div className={s.tools}>
                      <label className={s.search}>
                        <Icon name="search" />
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Šifra ili naziv" aria-label="Traži materijal" />
                      </label>
                      <div className={s.chips} role="tablist" aria-label="Grupe materijala">
                        <button type="button" role="tab" aria-selected={group === 'sve'} onClick={() => setGroup('sve')}>
                          Sve
                        </button>
                        {GROUPS.map((g) => (
                          <button key={g.id} type="button" role="tab" aria-selected={group === g.id} onClick={() => setGroup(g.id)}>
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <ul className={s.materials}>
                      {list.map((m) => (
                        <Material key={m.sku} m={m} inDraft={draft.find((l) => l.sku === m.sku)?.qty} onAdd={(q) => addLine(m.sku, q)} />
                      ))}
                      {list.length === 0 && <li className={s.empty}>Nema materijala za ovu pretragu.</li>}
                    </ul>
                  </section>

                  <aside className={`${s.card} ${s.request}`}>
                    <h4>Vaš upit</h4>
                    <label className={s.field}>
                      <span>Gradilište</span>
                      <select value={draftSite} onChange={(e) => setDraftSite(e.target.value)}>
                        {SITES.map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className={s.seg} role="radiogroup" aria-label="Način preuzimanja">
                      {(['Dostava', 'Preuzimanje'] as const).map((m) => (
                        <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)}>
                          {m === 'Dostava' ? 'Dostava na gradilište' : 'Preuzimanje na stovarištu'}
                        </button>
                      ))}
                    </div>
                    {draft.length === 0 ? (
                      <p className={s.empty}>Upit je prazan. Dodajte materijal iz liste ili učitajte sačuvanu listu.</p>
                    ) : (
                      <ul className={s.lines}>
                        {draft.map((l) => (
                          <li key={l.sku}>
                            <span>
                              <b>{name(l.sku)}</b>
                              <i>{l.sku}</i>
                            </span>
                            <Qty value={l.qty} unit={unit(l.sku)} onChange={(q) => setDraft((d) => (q <= 0 ? d.filter((x) => x.sku !== l.sku) : d.map((x) => (x.sku === l.sku ? { ...x, qty: q } : x))))} />
                          </li>
                        ))}
                      </ul>
                    )}
                    <label className={s.field}>
                      <span>Sačuvana lista</span>
                      <select value="" onChange={(e) => e.target.value && loadLines(LISTS.find((l) => l.id === e.target.value)!.lines, LISTS.find((l) => l.id === e.target.value)!.name)}>
                        <option value="">Učitaj listu…</option>
                        {LISTS.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button type="button" className={`${s.primary} ${s.wide}`} disabled={!draft.length} onClick={send}>
                      Pošalji upit (demo) <Icon name="arrow" />
                    </button>
                    <p className={s.fine}>Cijene i rok dobijate u ponudi prodaje. U demu se upit ne šalje.</p>
                  </aside>
                </div>
              )}

              {view === 'ponude' && offer && (
                <div className={s.split}>
                  <section className={s.card}>
                    <ul className={s.pick}>
                      {offers.map((o) => (
                        <li key={o.no}>
                          <button type="button" aria-pressed={o.no === offer.no} onClick={() => setOfferSel(o.no)}>
                            <span>
                              <b>{o.no}</b>
                              <i>
                                {site(o.site).name} · {o.lines.length} stavki
                              </i>
                            </span>
                            <span className={s.chip} data-k={o.status === 'Čeka potvrdu' ? 'act' : o.status === 'Potvrđena' ? 'done' : 'wait'}>
                              {o.status}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className={`${s.card} ${s.detail}`} aria-live="polite">
                    <div className={s.detailHead}>
                      <span>
                        <span className={s.kicker}>Ponuda {offer.no}</span>
                        <b>{offer.title}</b>
                        <i>
                          {site(offer.site).name} · {offer.days === 0 ? 'danas' : `prije ${offer.days} ${offer.days === 1 ? 'dan' : 'dana'}`} · važi {offer.validDays} dana
                        </i>
                      </span>
                      <span className={s.chip} data-k={offer.status === 'Čeka potvrdu' ? 'act' : offer.status === 'Potvrđena' ? 'done' : 'wait'}>
                        {offer.status}
                      </span>
                    </div>
                    {offer.status === 'Kod prodaje' ? (
                      <p className={s.wait}>
                        <i />
                        Prodaja priprema ponudu po vašem upitu (simulacija)…
                      </p>
                    ) : (
                      <>
                        <table className={s.table}>
                          <thead>
                            <tr>
                              <th>Artikal</th>
                              <th>Količina</th>
                              <th>Iznos (primjer)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {offer.lines.map((l) => (
                              <tr key={l.sku}>
                                <td>
                                  <b>{name(l.sku)}</b>
                                  <i>{l.sku}</i>
                                </td>
                                <td>
                                  {l.qty} {unit(l.sku)}
                                </td>
                                <td>{km(amount([l]))}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={2}>Ukupno (orijentaciono, primjer)</td>
                              <td>{km(amount(offer.lines))}</td>
                            </tr>
                          </tfoot>
                        </table>
                        <div className={s.actions}>
                          {offer.status === 'Čeka potvrdu' ? (
                            <button type="button" className={s.primary} onClick={() => confirm(offer)}>
                              Potvrdi ponudu (demo) <Icon name="check" />
                            </button>
                          ) : (
                            <button type="button" className={s.primary} onClick={() => go('narudzbe')}>
                              Pogledaj narudžbu <Icon name="arrow" />
                            </button>
                          )}
                          <button type="button" className={s.ghost} onClick={() => loadLines(offer.lines, `Ponuda ${offer.no}`)}>
                            Izmijeni u upitu
                          </button>
                        </div>
                      </>
                    )}
                  </section>
                </div>
              )}

              {view === 'narudzbe' && order && (
                <div className={s.split}>
                  <section className={s.card}>
                    <ul className={s.pick}>
                      {orders.map((o) => (
                        <li key={o.no}>
                          <button type="button" aria-pressed={o.no === order.no} onClick={() => setOrderSel(o.no)}>
                            <span>
                              <b>{o.no}</b>
                              <i>
                                {site(o.site).name} · {o.slot}
                              </i>
                            </span>
                            <Status o={o} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className={`${s.card} ${s.detail}`} aria-live="polite">
                    <div className={s.detailHead}>
                      <span>
                        <span className={s.kicker}>Narudžba {order.no}</span>
                        <b>{orderStatus(order)}</b>
                        <i>
                          {order.from ? `Po ponudi ${order.from} · ` : ''}
                          {site(order.site).name}
                        </i>
                      </span>
                      <Status o={order} />
                    </div>
                    <ol className={s.track}>
                      {STEPS.map((st, i) => (
                        <li key={st} data-done={i <= order.step || undefined} data-now={i === order.step || undefined}>
                          <i />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ol>
                    <dl className={s.facts}>
                      <div>
                        <dt>{order.mode}</dt>
                        <dd>{order.slot}</dd>
                      </div>
                      <div>
                        <dt>Mjesto</dt>
                        <dd>{order.mode === 'Preuzimanje' ? 'Stovarište, Nenada Kostića 151' : site(order.site).address}</dd>
                      </div>
                      <div>
                        <dt>Stavke</dt>
                        <dd>{order.lines.map((l) => `${name(l.sku)} × ${l.qty} ${unit(l.sku)}`).join(' · ')}</dd>
                      </div>
                    </dl>
                    <div className={s.actions}>
                      {order.step < 4 && (
                        <button type="button" className={s.ghost} onClick={() => advance(order)}>
                          Prikaži sljedeći status (demo)
                        </button>
                      )}
                      <button type="button" className={s.primary} onClick={() => loadLines(order.lines, `Narudžba ${order.no}`)}>
                        <Icon name="repeat" /> Ponovi narudžbu
                      </button>
                    </div>
                  </section>
                </div>
              )}

              {view === 'gradilista' && (
                <div className={s.sites}>
                  {SITES.map((x) => {
                    const o = offers.filter((y) => y.site === x.id && y.status !== 'Potvrđena').length
                    const a = orders.filter((y) => y.site === x.id && y.step < 4)
                    return (
                      <section key={x.id} className={s.card}>
                        <span className={s.kicker}>{x.phase}</span>
                        <h4>{x.name}</h4>
                        <p className={s.muted}>
                          {x.address} · {x.lead}
                        </p>
                        <dl className={s.facts}>
                          <div>
                            <dt>Otvorene ponude</dt>
                            <dd>{o}</dd>
                          </div>
                          <div>
                            <dt>Narudžbe u toku</dt>
                            <dd>{a.length}</dd>
                          </div>
                          <div>
                            <dt>Sljedeće</dt>
                            <dd>{a[0] ? `${a[0].mode}: ${a[0].slot}` : 'Nema zakazano'}</dd>
                          </div>
                        </dl>
                        <button
                          type="button"
                          className={s.ghost}
                          onClick={() => {
                            setDraftSite(x.id)
                            go('materijali')
                          }}
                        >
                          Novi upit za ovo gradilište
                        </button>
                      </section>
                    )
                  })}
                </div>
              )}

              {view === 'dokumenti' && (
                <div className={s.split}>
                  <section className={s.card}>
                    <ul className={s.rows}>
                      {DOCS.map((d) => (
                        <li key={d.id}>
                          <span>
                            <b>{d.title}</b>
                            <i>
                              {d.kind} · {d.ref} · {dateAgo(d.days)}
                            </i>
                          </span>
                          <button type="button" className={s.ghost} onClick={() => say('Demo: u pravom portalu ovdje se preuzima PDF')}>
                            <Icon name="down" /> Primjer
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <aside className={s.card}>
                    <h4>Korisnici naloga</h4>
                    <ul className={s.rows}>
                      {USERS.map((u) => (
                        <li key={u.initials}>
                          <span className={s.avatarSm}>{u.initials}</span>
                          <span>
                            <b>{u.name}</b>
                            <i>{u.role}</i>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </aside>
                </div>
              )}
            </div>
          </main>
        </div>
        <div className={s.toast} data-on={toast ? true : undefined} role="status" aria-live="polite">
          <Icon name="check" />
          {toast}
        </div>
      </div>
      <p className={s.note}>Interaktivni prikaz predloženog B2B portala. Podaci i procesi su demonstracioni.</p>
    </div>
  )
}

function Status({ o }: { o: Order }) {
  return (
    <span className={s.chip} data-k={statusKind(o) === 'done' ? 'done' : statusKind(o) === 'ready' ? 'act' : 'wait'}>
      {orderStatus(o)}
    </span>
  )
}

function Qty({ value, unit, onChange }: { value: number; unit: string; onChange: (n: number) => void }) {
  return (
    <span className={s.qty}>
      <button type="button" aria-label="Manje" onClick={() => onChange(value - 1)}>
        −
      </button>
      <input type="number" min={0} value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} aria-label={`Količina u ${unit}`} />
      <em>{unit}</em>
      <button type="button" aria-label="Više" onClick={() => onChange(value + 1)}>
        +
      </button>
    </span>
  )
}

function Material({ m, inDraft, onAdd }: { m: (typeof MATERIALS)[number]; inDraft?: number; onAdd: (q: number) => void }) {
  // Početna količina: deset pakovanja (ploča, rolna) ili deset komada.
  const [q, setQ] = useState(m.pack ? Math.round(m.pack.size * 10 * 10) / 10 : 10)
  return (
    <li className={s.material}>
      <span className={s.matName}>
        <b>{m.name}</b>
        <i>
          {m.sku} · {m.spec}
        </i>
      </span>
      <Qty value={q} unit={m.unit} onChange={(n) => setQ(Math.max(0, n))} />
      <button type="button" className={inDraft ? s.added : s.ghost} disabled={q <= 0} onClick={() => onAdd(q)} aria-label={inDraft ? `Dodaj još, u upitu je ${inDraft} ${m.unit}` : `Dodaj ${m.name} u upit`}>
        {inDraft ? `✓ ${inDraft.toLocaleString('de-DE')} ${m.unit}` : 'Dodaj'}
      </button>
    </li>
  )
}
