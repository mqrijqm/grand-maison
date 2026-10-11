'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import ProductGlyph from '@/components/art/ProductGlyph'
import Icon from '@/components/portal/Icon'
import LogoMark from '@/components/site/LogoMark'
import { PRODUCT_MAP } from '@/lib/shop'
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
  dateAgo,
  name,
  site,
  unit,
  weight,
  packs,
  SLOTS,
  type Line,
  type Offer,
  type Order,
} from '@/lib/b2b-demo'
import { AdminView, CreditCard, NotificationsView, PaymentSeg, ReorderCard, RoleSwitch, SALES_START, SaldoCard, TeamView, can, creditState, firmAmount, firmPrice, kmd, notesFor, otherPrice, roleLabel, stockLine, type Payment, type Role, type SalesEvent } from '@/components/portal/extra-views'
import x from '@/components/portal/extra.module.css'
import s from './Showcase.module.css'

// Interaktivni prikaz predloženog B2B portala (demo). Sve je lokalno stanje u browseru:
// upit se ne šalje, ponudu "pripremi" simulacija, statusi se pomjeraju dugmetom.
// Fokus je na naručivanju materijala, ne na analitici. Dodaci (demo, jasno označeni): zalihe po lokaciji,
// saldo i otvorene stavke, plaćanje odgodom ili avansom, obavještenja sa primjerom mejla i admin za prodaju.

type View = 'pregled' | 'materijali' | 'ponude' | 'narudzbe' | 'gradilista' | 'dokumenti' | 'obavjestenja' | 'tim' | 'admin'
const NAV: { id: View; label: string; icon: string }[] = [
  { id: 'pregled', label: 'Pregled', icon: 'pregled' },
  { id: 'materijali', label: 'Materijali', icon: 'brza' },
  { id: 'ponude', label: 'Ponude', icon: 'ponude' },
  { id: 'narudzbe', label: 'Narudžbe', icon: 'narudzbe' },
  { id: 'gradilista', label: 'Gradilišta', icon: 'gradilista' },
  { id: 'dokumenti', label: 'Dokumenti', icon: 'dokumenti' },
  { id: 'obavjestenja', label: 'Obavještenja', icon: 'bell' },
  { id: 'tim', label: 'Tim i prava', icon: 'tim' },
  { id: 'admin', label: 'Admin (prodaja)', icon: 'admin' },
]
const GROUPS_NAV: { label: string; ids: View[] }[] = [
  { label: 'Nabavka', ids: ['pregled', 'materijali', 'ponude', 'narudzbe'] },
  { label: 'Projekti', ids: ['gradilista'] },
  { label: 'Nalog', ids: ['dokumenti', 'obavjestenja', 'tim'] },
  { label: 'Grand Company', ids: ['admin'] },
]
type Feed = { t: string; kind: string; text: string; meta: string }
const CAPTION: Record<View, [string, string]> = {
  pregled: ['Pregled', 'Šta danas čeka vašu odluku: ponude za potvrdu, isporuke i nastavak upita.'],
  materijali: ['Materijali i brza narudžba', 'Odaberite artikle, upišite količine i pošaljite jedan upit za više proizvoda.'],
  ponude: ['Ponude', 'Ponude koje prodaja pripremi po vašem upitu. Provjerite stavke i potvrdite.'],
  narudzbe: ['Narudžbe', 'Status svake narudžbe i dogovorena dostava ili preuzimanje.'],
  gradilista: ['Gradilišta', 'Upiti, ponude i narudžbe razvrstani po mjestu isporuke.'],
  dokumenti: ['Dokumenti i dug', 'Koliko dugujete, koliki je limit i koje fakture treba platiti. Sve izvezete u Excel jednim klikom.'],
  tim: ['Tim i prava', 'Ko u firmi šta smije: majstor šalje upit, šef potvrđuje, računovodstvo vidi fakture, vlasnik sve.'],
  obavjestenja: ['Obavještenja', 'Narudžbe, promjene statusa i fakture pred dospijećem; isto stiže i e-poštom.'],
  admin: ['Admin · Grand Company', 'Pogled prodaje: firme na odobrenju, cjenovnici po klijentu i narudžbe svih klijenata.'],
}
const ROLE_VIEWS: Record<Role, View[]> = {
  vlasnik: ['pregled', 'materijali', 'ponude', 'narudzbe', 'gradilista', 'dokumenti', 'obavjestenja', 'tim', 'admin'],
  sef: ['pregled', 'materijali', 'ponude', 'narudzbe', 'gradilista', 'obavjestenja', 'tim', 'admin'],
  majstor: ['pregled', 'materijali', 'ponude', 'narudzbe', 'gradilista', 'obavjestenja', 'tim', 'admin'],
  racunovodstvo: ['pregled', 'narudzbe', 'dokumenti', 'obavjestenja', 'tim', 'admin'],
}
const statusKind = (o: Order) => (o.step >= 4 ? 'done' : o.step === 3 ? 'ready' : 'prep')
const orderStatus = (o: Order) => (o.step === 3 ? (o.mode === 'Preuzimanje' ? 'Spremno za preuzimanje' : 'Na putu ka gradilištu') : o.step === 4 ? (o.mode === 'Preuzimanje' ? 'Preuzeto' : 'Isporučeno') : STEPS[o.step])

/** Korak vođenog objašnjenja (sekcija ispod portala): koji ekran i šta kursor radi. */
export type TourStep = 'pregled' | 'materijali' | 'upit' | 'ponude' | 'narudzbe' | 'gradilista'

export default function Showcase({ tour, light, steps: showSteps = true }: { tour?: TourStep; light?: boolean; steps?: boolean } = {}) {
  const [view, setView] = useState<View>('pregled')
  // Korak koji je korisnik kliknuo u traci iznad prozora (null = još ništa nije kliknuto).
  const [picked, setPicked] = useState<string | null>(null)
  const [draft, setDraft] = useState<Line[]>([
    { sku: 'GKP-001', qty: 120 },
    { sku: 'PRF-075', qty: 40 },
  ])
  const [draftSite, setDraftSite] = useState('a')
  const [mode, setMode] = useState<'Dostava' | 'Preuzimanje'>('Dostava')
  const [payment, setPayment] = useState<Payment>('Odgoda')
  const [role, setRole] = useState<Role>('vlasnik')
  const [sales, setSales] = useState<SalesEvent[]>(SALES_START)
  const [offers, setOffers] = useState<Offer[]>(OFFERS)
  const [orders, setOrders] = useState<Order[]>(ORDERS)
  const [offerSel, setOfferSel] = useState(OFFERS[0].no)
  const [orderSel, setOrderSel] = useState(ORDERS[0].no)
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<string>('sve')
  const [finderOpen, setFinderOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [activity, setActivity] = useState<Feed[]>([
    { t: 'juče', kind: 'ponude', text: 'Ponuda P-26-0142 je spremna', meta: 'Lamela A · 5 stavki · prodaja' },
    { t: 'juče', kind: 'isporuke', text: 'GC-26-04498 spremna za preuzimanje', meta: 'Stovarište · danas 13–15h' },
    { t: '2 dana', kind: 'narudzbe', text: 'GC-26-04512 u pripremi', meta: 'Lamela A · dostava sutra 08–10h' },
    { t: '27.09.', kind: 'dokumenti', text: 'Otpremnica uz GC-26-04402', meta: 'Lamela A · isporučeno' },
  ])
  const [stageSel, setStageSel] = useState(0)
  const [slot, setSlot] = useState(SLOTS[0])
  // Vođeni scenarij: četiri koraka jedne narudžbe, štikliraju se dok ih kupac prolazi.
  const [done, setDone] = useState({ added: false, sent: false, confirmed: false, tracked: false })
  const mark = (k: keyof typeof done) => setDone((d) => (d[k] ? d : { ...d, [k]: true }))
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const seq = useRef(150)
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  // Koraci "Kako funkcioniše" na stranici otvaraju odgovarajući ekran portala.
  useEffect(() => {
    const on = (e: Event) => {
      const v = (e as CustomEvent<View>).detail
      if (NAV.some((n) => n.id === v)) {
        setRole('vlasnik')
        setView(v)
      }
    }
    window.addEventListener('gc-portal', on)
    return () => window.removeEventListener('gc-portal', on)
  }, [])
  // ——— Vođenje: lažni kursor ide do elementa (data-t), kuca i klikće, sve na pravom interfejsu ———
  const winRef = useRef<HTMLDivElement>(null)
  const cur = useRef<HTMLSpanElement>(null)
  const [press, setPress] = useState(false)
  useEffect(() => {
    if (!tour) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let alive = true
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
    const el = (t: string) => winRef.current?.querySelector<HTMLElement>(`[data-t="${t}"]`) ?? null
    const moveTo = async (t: string) => {
      const n = el(t), w = winRef.current, c = cur.current
      if (!n || !w || !c) return
      const a = w.getBoundingClientRect(), b = n.getBoundingClientRect()
      c.style.opacity = '1'
      c.style.transform = `translate(${b.left - a.left + Math.min(b.width * 0.5, 70)}px, ${b.top - a.top + b.height * 0.6}px)`
      await wait(reduce ? 0 : 650)
    }
    const click = async (t: string) => {
      await moveTo(t)
      if (!alive) return
      setPress(true)
      await wait(140)
      setPress(false)
      el(t)?.click()
      await wait(500)
    }
    const typeQuery = async (text: string) => {
      for (let i = 1; i <= text.length && alive; i++) {
        setQuery(text.slice(0, i))
        await wait(reduce ? 0 : 110)
      }
    }
    const run = async () => {
      if (cur.current) cur.current.style.opacity = '0'
      await wait(300)
      if (tour === 'pregled') {
        setView('pregled')
        await wait(500)
        for (let i = 1; i <= 3 && alive; i++) {
          await moveTo(`stage-${i}`)
          setStageSel(i)
          await wait(700)
        }
        await moveTo('stage-cta')
      } else if (tour === 'materijali') {
        setView('materijali')
        setQuery('')
        setGroup('sve')
        await wait(500)
        await moveTo('search')
        await typeQuery('CW 75')
        await wait(500)
        await click('add-PRF-075')
      } else if (tour === 'upit') {
        setView('materijali')
        await wait(500)
        await moveTo('site')
        await wait(500)
        await click('mode-Dostava')
        await moveTo('send')
      } else if (tour === 'ponude') {
        setView('ponude')
        setOfferSel(OFFERS[0].no)
        await wait(500)
        await moveTo('offer-lines')
        await wait(500)
        await moveTo('confirm')
      } else if (tour === 'narudzbe') {
        setView('narudzbe')
        setOrderSel(ORDERS[0].no)
        await wait(500)
        await moveTo('track')
        await wait(400)
        await click('advance')
        await moveTo('reorder')
      } else if (tour === 'gradilista') {
        setView('gradilista')
        await wait(500)
        await moveTo('site-a')
        await wait(500)
        await moveTo('site-b')
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [tour])



  const say = (text: string) => {
    setToast(text)
    timers.current.push(setTimeout(() => setToast((t) => (t === text ? null : t)), 3200))
  }
  const log = (text: string, kind = 'ponude', meta = 'simulacija') => setActivity((a) => [{ t: 'sad', kind, text, meta }, ...a].slice(0, 5))
  const go = (v: View) => {
    if (!ROLE_VIEWS[role].includes(v)) {
      say(`Uloga ${roleLabel(role)} nema pristup ovom ekranu (demo prava)`)
      return
    }
    setView(v)
  }
  const switchRole = (r: Role) => {
    setRole(r)
    if (!ROLE_VIEWS[r].includes(view)) setView('pregled')
    say(`Prijavljeni kao: ${roleLabel(r)}`)
  }

  const addLine = (sku: string, qty: number) => {
    setDraft((d) => (d.some((l) => l.sku === sku) ? d.map((l) => (l.sku === sku ? { ...l, qty: l.qty + qty } : l)) : [...d, { sku, qty }]))
    mark('added')
  }
  const loadLines = (lines: Line[], label: string) => {
    setDraft(lines.map((l) => ({ ...l })))
    go('materijali')
    say(`${label}: stavke su u upitu, možete ih mijenjati`)
  }

  const send = () => {
    if (!draft.length) return
    const no = `P-26-0${seq.current++}`
    const lines = draft
    setOffers((o) => [{ no, site: draftSite, title: `Upit, ${lines.length} stavki · ${payment.toLowerCase()}`, lines, status: 'Kod prodaje', validDays: 14, days: 0, demo: true }, ...o])
    setOfferSel(no)
    setDraft([])
    mark('sent')
    log('Upit poslat prodaji', 'ponude', `${site(draftSite).name} · ${draft.length} stavki · simulacija`)
    setSales((e) => [{ id: `u-${no}`, t: 'sad', title: `Novi upit ${no}: ${FIRM.name}`, meta: `${site(draftSite).name} · ${draft.length} stavki · ${payment.toLowerCase()} · poslao: ${roleLabel(role)}`, channels: ['SMS', 'Mejl', 'Portal'], urgent: true }, ...e])
    say('Simulacija: upit je kod prodaje. U demu se ništa ne šalje.')
    go('ponude')
    // Simulacija: prodaja priprema ponudu.
    timers.current.push(
      setTimeout(() => {
        setOffers((o) => o.map((x) => (x.no === no ? { ...x, status: 'Čeka potvrdu', title: `Ponuda po vašem upitu, ${lines.length} stavki` } : x)))
        log(`Ponuda ${no} je spremna`, 'ponude', `${site(draftSite).name} · prodaja · simulacija`)
        say(`Simulacija: stigla je ponuda ${no}`)
      }, 2600),
    )
  }
  const confirm = (o: Offer) => {
    setOffers((all) => all.map((x) => (x.no === o.no ? { ...x, status: 'Potvrđena' } : x)))
    const no = `GC-26-0${4520 + seq.current++}`
    setOrders((all) => [{ no, site: o.site, step: 1, mode, slot: mode === 'Dostava' ? `${slot} (prijedlog, potvrđuje prodaja)` : 'Termin preuzimanja dogovara prodaja', lines: o.lines, days: 0, from: o.no }, ...all])
    setOrderSel(no)
    mark('confirmed')
    log(`${no} je potvrđena`, 'narudzbe', `Po ponudi ${o.no} · simulacija`)
    say(`Simulacija: ponuda potvrđena, narudžba ${no} je otvorena`)
  }
  const advance = (o: Order) => {
    const step = Math.min(4, o.step + 1)
    setOrders((all) => all.map((x) => (x.no === o.no ? { ...x, step, slot: step === 3 ? (x.mode === 'Dostava' ? 'Danas, 08–10h' : 'Danas, 13–15h') : step === 4 ? 'Završeno danas' : x.slot } : x)))
    mark('tracked')
    log(`${o.no}: ${orderStatus({ ...o, step }).toLowerCase()}`, step >= 3 ? 'isporuke' : 'narudzbe', `${site(o.site).name} · simulacija`)
  }

  const offer = offers.find((o) => o.no === offerSel) ?? offers[0]
  // Plava scena na Pregledu: stavke ponude koja čeka potvrdu (ili zadnje potvrđene).
  const stageOffer = offers.find((o) => o.status === 'Čeka potvrdu') ?? offers.find((o) => o.lines.length) ?? null
  const stageIdx = stageOffer ? stageSel % stageOffer.lines.length : 0
  const stageLine = stageOffer ? stageOffer.lines[stageIdx] : { sku: '', qty: 0 }
  const order = orders.find((o) => o.no === orderSel) ?? orders[0]
  const pending = offers.filter((o) => o.status === 'Čeka potvrdu')
  const active = orders.filter((o) => o.step < 4)
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MATERIALS.filter((m) => (group === 'sve' || m.group === group) && (!q || m.name.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q)))
  }, [query, group])
  const [title, sub] = CAPTION[view]
  const notes = notesFor(orders, pending.length)

  const steps: { k: keyof typeof done; label: string; view: View }[] = [
    { k: 'added', label: 'Dodajte materijal', view: 'materijali' },
    { k: 'sent', label: 'Pošaljite upit', view: 'materijali' },
    { k: 'confirmed', label: 'Potvrdite ponudu', view: 'ponude' },
    { k: 'tracked', label: 'Pratite narudžbu', view: 'narudzbe' },
  ]
  const nextStep = steps.find((x) => !done[x.k])
  // Aktivan (plavi) je korak koji je korisnik kliknuo; dok ništa nije kliknuto, to je sljedeći nedovršeni.
  const activeStep = picked ?? nextStep?.k

  return (
    <div className={s.wrap} data-light={light || undefined}>
      {!tour && showSteps && <div className={s.scenario}>
        <ol className={s.scenarioSteps}>
          {steps.map((x, i) => (
            <li key={x.k}>
              <button
                type="button"
                data-done={done[x.k] || undefined}
                data-next={activeStep === x.k || undefined}
                aria-pressed={activeStep === x.k}
                onClick={() => {
                  setPicked(x.k)
                  setView(x.view)
                }}
              >
                <i>{done[x.k] ? '✓' : i + 1}</i>
                {x.label}
              </button>
            </li>
          ))}
        </ol>
      </div>}

      <div ref={winRef} className={s.window} data-view={view} data-tour={tour ? '' : undefined}>
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
            <p className={s.brand}>
              <LogoMark className={s.brandMark} />
              Grand Company <span>Portal</span>
            </p>
            <div className={s.account}>
              <span className={s.avatar}>{FIRM.short}</span>
              <span>
                <b>{FIRM.name}</b>
                <i>{roleLabel(role)}</i>
              </span>
              <em className={s.demoTag}>Demo</em>
            </div>
            <RoleSwitch role={role} onChange={switchRole} />
            <nav className={s.nav} aria-label="Portal (demo)">
              {GROUPS_NAV.map((g) => (
                <div key={g.label} className={s.navGroup}>
                  <span className={s.navLabel}>{g.label}</span>
                  {NAV.filter((n) => g.ids.includes(n.id)).map((n) => {
                    const count = n.id === 'ponude' ? pending.length : n.id === 'narudzbe' ? active.length : n.id === 'gradilista' ? SITES.length : n.id === 'materijali' ? draft.length : n.id === 'obavjestenja' ? notes.length : 0
                    return (
                      <button key={n.id} type="button" aria-current={view === n.id || undefined} className={ROLE_VIEWS[role].includes(n.id) ? undefined : x.locked} title={ROLE_VIEWS[role].includes(n.id) ? undefined : `Nije dozvoljeno za ulogu ${roleLabel(role)}`} onClick={() => go(n.id)}>
                        <Icon name={n.icon} />
                        <span>{n.label}</span>
                        {count > 0 && <em>{count}</em>}
                      </button>
                    )
                  })}
                </div>
              ))}
            </nav>
          </aside>

          <main className={s.main}>
            {view === 'pregled' && stageOffer && (
              <section className={s.stage} aria-label="Ponuda koja čeka potvrdu">
                <div className={s.stageInfo}>
                  <div>
                    <h3>Pregled</h3>
                    <p>Šta danas čeka vašu odluku na gradilištima DEMO GRADNJA d.o.o.</p>
                  </div>
                  <div className={s.stagePick}>
                    <span>
                      Ponuda {stageOffer.no} · {stageLine.sku} · {stageLine.qty} {unit(stageLine.sku)}
                    </span>
                    <b>{name(stageLine.sku)}</b>
                    <div className={s.stageTools}>
                      <button type="button" aria-label="Prethodna stavka" onClick={() => setStageSel((i) => (i + stageOffer.lines.length - 1) % stageOffer.lines.length)}>
                        <Icon name="back" />
                      </button>
                      <span>
                        {String(stageIdx + 1).padStart(2, '0')} / {String(stageOffer.lines.length).padStart(2, '0')}
                      </span>
                      <button type="button" aria-label="Sljedeća stavka" onClick={() => setStageSel((i) => (i + 1) % stageOffer.lines.length)}>
                        <Icon name="arrow" />
                      </button>
                      <button
                        type="button"
                        data-t="stage-cta"
                        className={`${s.stageCta} ${s.glow}`}
                        onClick={() => {
                          setOfferSel(stageOffer.no)
                          go('ponude')
                        }}
                      >
                        Pregledaj ponudu
                      </button>
                    </div>
                  </div>
                </div>
                <ul className={s.stageList}>
                  {stageOffer.lines.map((l, i) => (
                    <li key={l.sku}>
                      <button type="button" data-t={`stage-${i}`} data-on={i === stageIdx || undefined} onClick={() => setStageSel(i)} onMouseEnter={() => setStageSel(i)}>
                        <span className={s.mono}>{l.sku}</span>
                        <span>{name(l.sku)}</span>
                        <b>
                          {l.qty} {unit(l.sku)}
                        </b>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <header className={s.head} hidden={view === 'pregled' && !!stageOffer}>
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
                // Pregled: samo ono što čeka odluku. Plava scena (ponuda) je iznad; ispod narudžbe u toku i tok.
                <div className={s.cols}>
                  {can(role, 'fakture') && <CreditCard orders={orders} onDocs={() => go('dokumenti')} />}
                  {can(role, 'upit') && <ReorderCard orders={orders} onReorder={(o) => loadLines(o.lines, `Narudžba ${o.no}`)} />}
                  <section className={s.card}>
                    <h4>Narudžbe u toku</h4>
                    <ul className={s.rows}>
                      {active.slice(0, 3).map((o) => (
                        <li key={o.no}>
                          <button
                            type="button"
                            className={s.rowBtn}
                            onClick={() => {
                              setOrderSel(o.no)
                              go('narudzbe')
                            }}
                          >
                            <span>
                              <b>{o.no}</b>
                              <i>
                                {o.mode === 'Dostava' ? site(o.site).name : 'Stovarište'} · {o.slot}
                              </i>
                            </span>
                            <Status o={o} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className={s.card}>
                    <h4>Uživo</h4>
                    <ul className={s.rows}>
                      {activity.slice(0, 3).map((a, i) => (
                        <li key={`${a.text}-${i}`} data-new={(i === 0 && a.t === 'sad') || undefined}>
                          <button type="button" className={s.rowBtn} onClick={() => go(a.kind === 'ponude' ? 'ponude' : a.kind === 'dokumenti' ? 'dokumenti' : 'narudzbe')}>
                            <span>
                              <b>{a.text}</b>
                              <i>{a.meta}</i>
                            </span>
                            <time className={s.time}>{a.t}</time>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              )}

              {view === 'materijali' && (
                <div className={s.split}>
                  <section className={s.card}>
                    <h4>Dodajte materijal</h4>
                    {/* E-shop pretraga: grupa iz padajuće liste + polje; rezultati se otvaraju ispod polja. */}
                    <div className={s.finder}>
                      <select className={s.groupSelect} value={group} onChange={(e) => { setGroup(e.target.value); setFinderOpen(true) }} aria-label="Grupa materijala">
                        <option value="sve">Sve grupe</option>
                        {GROUPS.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                      <label className={s.search}>
                        <Icon name="search" />
                        <input
                          data-t="search"
                          value={query}
                          onChange={(e) => { setQuery(e.target.value); setFinderOpen(true) }}
                          onFocus={() => setFinderOpen(true)}
                          onBlur={() => setTimeout(() => setFinderOpen(false), 180)}
                          onKeyDown={(e) => { if (e.key === 'Escape') setFinderOpen(false) }}
                          placeholder="Šifra ili naziv, npr. CW 75"
                          aria-label="Traži materijal"
                          role="combobox"
                          aria-expanded={finderOpen}
                          aria-controls="mat-results"
                        />
                      </label>
                      {finderOpen && (
                        <ul id="mat-results" role="listbox" className={s.results}>
                          {list.slice(0, 6).map((m) => {
                            const has = draft.find((l) => l.sku === m.sku)?.qty
                            return (
                              <li key={m.sku} role="option" aria-selected={!!has}>
                                <button type="button" data-t={`add-${m.sku}`} onClick={() => { addLine(m.sku, m.pack ? Math.round(m.pack.size * 10 * 10) / 10 : 10); setFinderOpen(false); setQuery('') }}>
                                  <span className={s.glyph} aria-hidden>
                                    {PRODUCT_MAP[m.sku] && <ProductGlyph product={PRODUCT_MAP[m.sku]} kind={m.sku.startsWith('GKP-') ? 'board' : undefined} />}
                                  </span>
                                  <span className={s.resName}>
                                    <b>{m.name}</b>
                                    <i>{m.sku}</i>
                                    <i>{stockLine(m.sku)}</i>
                                    {can(role, 'cijene') && (
                                      <i className={x.price}>
                                        Vaša cijena {kmd(firmPrice(m.sku))}/{m.unit} · druga firma {kmd(otherPrice(m.sku))}
                                      </i>
                                    )}
                                  </span>
                                  <em>{has ? `✓ ${has.toLocaleString('de-DE')} ${m.unit}` : '+ Dodaj'}</em>
                                </button>
                              </li>
                            )
                          })}
                          {list.length === 0 && <li className={s.empty}>Nema materijala za ovu pretragu.</li>}
                          {list.length > 6 && <li className={s.more}>Još {list.length - 6}, suzite pretragu</li>}
                        </ul>
                      )}
                    </div>
                    <p className={s.fine}>Količinu mijenjate u upitu desno.</p>
                  </section>

                  <aside className={`${s.card} ${s.request}`}>
                    <h4>Vaš upit</h4>
                    <label className={s.field}>
                      <span>Gradilište</span>
                      <select data-t="site" value={draftSite} onChange={(e) => setDraftSite(e.target.value)}>
                        {SITES.map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className={s.seg} role="radiogroup" aria-label="Način preuzimanja">
                      {(['Dostava', 'Preuzimanje'] as const).map((m) => (
                        <button key={m} type="button" data-t={`mode-${m}`} role="radio" aria-checked={mode === m} onClick={() => setMode(m)}>
                          {m === 'Dostava' ? 'Dostava na gradilište' : 'Preuzimanje na stovarištu'}
                        </button>
                      ))}
                    </div>
                    {mode === 'Dostava' ? (
                      <div className={s.delivery}>
                        <label className={s.field}>
                          <span>Željeni termin</span>
                          <select value={slot} onChange={(e) => setSlot(e.target.value)}>
                            {SLOTS.map((x) => (
                              <option key={x}>{x}</option>
                            ))}
                          </select>
                        </label>
                        <p className={s.fine}>
                          {site(draftSite).address} · kontakt na gradilištu: {site(draftSite).lead}
                        </p>
                      </div>
                    ) : (
                      <p className={`${s.fine} ${s.delivery}`}>Stovarište, Ul. Nenada Kostića 151, Banja Luka · 07:00–16:00</p>
                    )}
                    {draft.length === 0 ? (
                      <p className={s.empty}>Upit je prazan. Dodajte materijal iz liste ili učitajte sačuvanu listu.</p>
                    ) : (
                      <ul className={s.lines}>
                        {draft.map((l) => (
                          <li key={l.sku}>
                            <span>
                              <b>{name(l.sku)}</b>
                              <i>
                                {l.sku}
                                {packs(l) ? ` · ${packs(l)}` : ''}
                              </i>
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
                    {draft.length > 0 && (
                      <p className={s.weight}>
                        <span>Ukupna težina (okvirno)</span>
                        <b>{(weight(draft) / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 })} t</b>
                      </p>
                    )}
                    {can(role, 'cijene') && draft.length > 0 && (
                      <p className={s.weight}>
                        <span>Vaš iznos (cjenovnik firme, demo)</span>
                        <b>{kmd(firmAmount(draft))}</b>
                      </p>
                    )}
                    <PaymentSeg value={payment} onChange={setPayment} />
                    {payment === 'Odgoda' && can(role, 'cijene') && firmAmount(draft) > creditState(orders).free && draft.length > 0 && (
                      <p className={x.limitWarn}>
                        Upit prelazi slobodan limit ({kmd(creditState(orders).free)}). Prodaja će tražiti avans ili uplatu dospjelih faktura prije isporuke.
                      </p>
                    )}
                    {!can(role, 'cijene') && <p className={x.lockNote}>Kao {roleLabel(role).toLowerCase()} šaljete upit bez cijena; cijene i ponudu vidi šef ili vlasnik.</p>}
                    <button type="button" data-t="send" className={`${s.primary} ${s.wide}`} disabled={!draft.length || !can(role, 'upit')} onClick={send}>
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
                        <table data-t="offer-lines" className={s.table}>
                          <thead>
                            <tr>
                              <th>Artikal</th>
                              <th>Količina</th>
                              <th>{can(role, 'cijene') ? 'Vaša cijena (demo)' : 'Iznos'}</th>
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
                                <td>{can(role, 'cijene') ? kmd(firmPrice(l.sku) * l.qty) : 'skriveno za ulogu'}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={2}>Ukupno</td>
                              <td>{can(role, 'cijene') ? kmd(firmAmount(offer.lines)) : '—'}</td>
                            </tr>
                          </tfoot>
                        </table>
                        <div className={s.actions}>
                          {offer.status === 'Čeka potvrdu' ? (
                            can(role, 'potvrda') ? (
                              <button type="button" data-t="confirm" className={s.primary} onClick={() => confirm(offer)}>
                                Potvrdi ponudu (demo) <Icon name="check" />
                              </button>
                            ) : (
                              <p className={x.lockNote}>Ponudu potvrđuje šef gradilišta ili vlasnik. Vi je vidite, ali ne možete potvrditi.</p>
                            )
                          ) : (
                            <button type="button" className={s.primary} onClick={() => go('narudzbe')}>
                              Pratite narudžbu <Icon name="arrow" />
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
                    <ol data-t="track" className={s.track}>
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
                        <button type="button" data-t="advance" className={s.ghost} onClick={() => advance(order)}>
                          Prikaži sljedeći status (demo)
                        </button>
                      )}
                      {can(role, 'upit') && (
                        <button type="button" data-t="reorder" className={s.primary} onClick={() => loadLines(order.lines, `Narudžba ${order.no}`)}>
                          <Icon name="repeat" /> Ponovi narudžbu
                        </button>
                      )}
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
                      <section key={x.id} data-t={`site-${x.id}`} className={s.card}>
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
                  <div className={s.tools}>
                  <SaldoCard orders={orders} />
                  <section className={s.card}>
                    <h4>Dokumenti</h4>
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
                  </div>
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
              {view === 'obavjestenja' && <NotificationsView notes={notes} onOpen={(v) => go(v as View)} />}
              {view === 'tim' && <TeamView role={role} onRole={switchRole} />}
              {view === 'admin' && <AdminView orders={orders} advance={advance} events={sales} />}
            </div>
          </main>
        </div>
        {tour && (
          <span ref={cur} className={s.cursor} data-press={press || undefined} aria-hidden>
            <svg viewBox="0 0 20 22">
              <path d="M2 1.5v16.2l4.3-4.1 2.8 6.6 3-1.3-2.8-6.5H15z" />
            </svg>
          </span>
        )}
        <div className={s.toast} data-on={toast ? true : undefined} role="status" aria-live="polite">
          <Icon name="check" />
          {toast}
        </div>
      </div>
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
