'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import ProductGlyph from '@/components/art/ProductGlyph'
import Icon from '@/components/portal/Icon'
import LogoMark from '@/components/site/LogoMark'
import { PRODUCT_MAP } from '@/lib/shop'
import { tl, useLang, type Lang, type L10n } from '@/lib/i18n'
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
  dateAgoL,
  docL,
  groupL,
  listNameL,
  modeL,
  nameL,
  offerStatusL,
  offerTitleL,
  siteL,
  slotL,
  stepL,
  unitL,
  unitText,
  userL,

  weight,
  packsL,
  SLOTS,
  type Line,
  type Offer,
  type Order,
} from '@/lib/b2b-demo'
import { AdminView, CreditCard, NotificationsView, PaymentSeg, ReorderCard, RoleSwitch, SALES_START, SaldoCard, TeamView, can, creditState, firmAmount, firmPrice, notesFor, otherPrice, roleLabel, stockLine, type Payment, type Role, type SalesEvent } from '@/components/portal/extra-views'
import x from '@/components/portal/extra.module.css'
import s from './Showcase.module.css'

// Interaktivni prikaz predloženog B2B portala (demo). Sve je lokalno stanje u browseru:
// upit se ne šalje, ponudu "pripremi" simulacija, statusi se pomjeraju dugmetom.
// Fokus je na naručivanju materijala, ne na analitici. Dodaci (demo, jasno označeni): zalihe po lokaciji,
// saldo i otvorene stavke, plaćanje odgodom ili avansom, obavještenja sa primjerom mejla i admin za prodaju.

type View = 'pregled' | 'materijali' | 'ponude' | 'narudzbe' | 'gradilista' | 'dokumenti' | 'obavjestenja' | 'tim' | 'admin'
const NAV: { id: View; label: string; en: string; icon: string }[] = [
  { id: 'pregled', label: 'Pregled', en: 'Overview', icon: 'pregled' },
  { id: 'materijali', label: 'Materijali', en: 'Materials', icon: 'brza' },
  { id: 'ponude', label: 'Ponude', en: 'Offers', icon: 'ponude' },
  { id: 'narudzbe', label: 'Narudžbe', en: 'Orders', icon: 'narudzbe' },
  { id: 'gradilista', label: 'Gradilišta', en: 'Sites', icon: 'gradilista' },
  { id: 'dokumenti', label: 'Dokumenti', en: 'Documents', icon: 'dokumenti' },
  { id: 'obavjestenja', label: 'Obavještenja', en: 'Notifications', icon: 'bell' },
  { id: 'tim', label: 'Tim i prava', en: 'Team and permissions', icon: 'tim' },
  { id: 'admin', label: 'Admin (prodaja)', en: 'Admin (sales)', icon: 'admin' },
]
const GROUPS_NAV: { label: string; en: string; ids: View[] }[] = [
  { label: 'Nabavka', en: 'Procurement', ids: ['pregled', 'materijali', 'ponude', 'narudzbe'] },
  { label: 'Projekti', en: 'Projects', ids: ['gradilista'] },
  { label: 'Nalog', en: 'Account', ids: ['dokumenti', 'obavjestenja', 'tim'] },
  { label: 'Grand Company', en: 'Grand Company', ids: ['admin'] },
]
// Aktivnost je dvojezična (par sr/en) jer se čuva u stanju i može se prikazati nakon promjene jezika.
type Feed = { t: L10n; kind: string; text: L10n; meta: L10n }
const b = (sr: string, en: string): L10n => ({ sr, en })
const ROLE_EN: Record<Role, string> = { vlasnik: 'Owner', sef: 'Site manager', majstor: 'Site worker', racunovodstvo: 'Accounting' }
const payL = (p: Payment, lang: Lang) => (lang === 'en' ? (p === 'Odgoda' ? 'deferred payment' : 'advance payment') : p.toLowerCase())
const kmdL = (n: number, lang: Lang) => `${n.toLocaleString(lang === 'en' ? 'en-US' : 'de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} KM`
const CAPTION_EN: Record<View, [string, string]> = {
  pregled: ['Overview', 'What needs your decision today: offers to confirm, deliveries and inquiries to continue.'],
  materijali: ['Materials and quick order', 'Pick items, enter quantities and send a single inquiry for several products.'],
  ponude: ['Offers', 'Offers that sales prepares from your inquiry. Check the line items and confirm.'],
  narudzbe: ['Orders', 'The status of each order and the agreed delivery or collection.'],
  gradilista: ['Sites', 'Inquiries, offers and orders sorted by delivery location.'],
  dokumenti: ['Documents and balance', 'How much you owe, what the limit is and which invoices are due. Export everything to Excel in one click.'],
  tim: ['Team and permissions', 'Who can do what in your company: a site worker sends inquiries, a manager confirms, accounting sees invoices, the owner sees everything.'],
  obavjestenja: ['Notifications', 'Orders, status changes and invoices nearing their due date; the same arrives by email.'],
  admin: ['Admin · Grand Company', 'The sales view: companies awaiting approval, price lists per client and the orders of all clients.'],
}
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
const orderStatus = (o: Order, lang: Lang = 'sr') =>
  o.step === 3
    ? o.mode === 'Preuzimanje'
      ? lang === 'en' ? 'Ready for collection' : 'Spremno za preuzimanje'
      : lang === 'en' ? 'On the way to the site' : 'Na putu ka gradilištu'
    : o.step === 4
      ? o.mode === 'Preuzimanje'
        ? lang === 'en' ? 'Collected' : 'Preuzeto'
        : lang === 'en' ? 'Delivered' : 'Isporučeno'
      : stepL(STEPS[o.step], lang)

/** Korak vođenog objašnjenja (sekcija ispod portala): koji ekran i šta kursor radi. */
export type TourStep = 'pregled' | 'materijali' | 'upit' | 'ponude' | 'narudzbe' | 'gradilista'

export default function Showcase({ tour, light, steps: showSteps = true }: { tour?: TourStep; light?: boolean; steps?: boolean } = {}) {
  const { t, lang } = useLang()
  const name = (sku: string) => nameL(sku, lang)
  const unit = (sku: string) => unitL(sku, lang)
  const site = (id: string) => siteL(id, lang)
  const roleName = (r: Role) => (lang === 'en' ? ROLE_EN[r] : roleLabel(r))
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
    { t: b('juče', 'yesterday'), kind: 'ponude', text: b('Ponuda P-26-0142 je spremna', 'Offer P-26-0142 is ready'), meta: b('Lamela A · 5 stavki · prodaja', 'Lamela A · 5 items · sales') },
    { t: b('juče', 'yesterday'), kind: 'isporuke', text: b('GC-26-04498 spremna za preuzimanje', 'GC-26-04498 ready for collection'), meta: b('Stovarište · danas 13–15h', 'Yard · today 13:00–15:00') },
    { t: b('2 dana', '2 days'), kind: 'narudzbe', text: b('GC-26-04512 u pripremi', 'GC-26-04512 in preparation'), meta: b('Lamela A · dostava sutra 08–10h', 'Lamela A · delivery tomorrow 08:00–10:00') },
    { t: b('27.09.', 'Sep 27'), kind: 'dokumenti', text: b('Otpremnica uz GC-26-04402', 'Delivery note for GC-26-04402'), meta: b('Lamela A · isporučeno', 'Lamela A · delivered') },
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
  const log = (text: L10n, kind = 'ponude', meta: L10n = b('simulacija', 'simulation')) => setActivity((a) => [{ t: b('sad', 'now'), kind, text, meta }, ...a].slice(0, 5))
  const go = (v: View) => {
    if (!ROLE_VIEWS[role].includes(v)) {
      say(t(`Uloga ${roleLabel(role)} nema pristup ovom ekranu (demo prava)`, `The ${roleName(role)} role has no access to this screen (demo permissions)`))
      return
    }
    setView(v)
  }
  const switchRole = (r: Role) => {
    setRole(r)
    if (!ROLE_VIEWS[r].includes(view)) setView('pregled')
    say(t(`Prijavljeni kao: ${roleLabel(r)}`, `Signed in as: ${roleName(r)}`))
  }

  const addLine = (sku: string, qty: number) => {
    setDraft((d) => (d.some((l) => l.sku === sku) ? d.map((l) => (l.sku === sku ? { ...l, qty: l.qty + qty } : l)) : [...d, { sku, qty }]))
    mark('added')
  }
  const loadLines = (lines: Line[], label: string) => {
    setDraft(lines.map((l) => ({ ...l })))
    go('materijali')
    say(t(`${label}: stavke su u upitu, možete ih mijenjati`, `${label}: the items are in your inquiry, you can edit them`))
  }

  const send = () => {
    if (!draft.length) return
    const no = `P-26-0${seq.current++}`
    const lines = draft
    setOffers((o) => [{ no, site: draftSite, title: `Upit, ${lines.length} stavki · ${payL(payment, 'sr')}`, titleEn: `Inquiry, ${lines.length} items · ${payL(payment, 'en')}`, lines, status: 'Kod prodaje', validDays: 14, days: 0, demo: true }, ...o])
    setOfferSel(no)
    setDraft([])
    mark('sent')
    log(b('Upit poslat prodaji', 'Inquiry sent to sales'), 'ponude', b(`${siteL(draftSite, 'sr').name} · ${draft.length} stavki · simulacija`, `${siteL(draftSite, 'en').name} · ${draft.length} items · simulation`))
    setSales((e) => [
      lang === 'en'
        ? { id: `u-${no}`, t: 'now', title: `New inquiry ${no}: ${FIRM.name}`, meta: `${site(draftSite).name} · ${draft.length} items · ${payL(payment, 'en')} · sent by: ${roleName(role)}`, channels: ['SMS', 'Email', 'Portal'], urgent: true }
        : { id: `u-${no}`, t: 'sad', title: `Novi upit ${no}: ${FIRM.name}`, meta: `${site(draftSite).name} · ${draft.length} stavki · ${payL(payment, 'sr')} · poslao: ${roleLabel(role)}`, channels: ['SMS', 'Mejl', 'Portal'], urgent: true },
      ...e,
    ])
    say(t('Simulacija: upit je kod prodaje. U demu se ništa ne šalje.', 'Simulation: the inquiry is with sales. Nothing is sent in the demo.'))
    go('ponude')
    // Simulacija: prodaja priprema ponudu.
    timers.current.push(
      setTimeout(() => {
        setOffers((o) => o.map((x) => (x.no === no ? { ...x, status: 'Čeka potvrdu', title: `Ponuda po vašem upitu, ${lines.length} stavki`, titleEn: `Offer from your inquiry, ${lines.length} items` } : x)))
        log(b(`Ponuda ${no} je spremna`, `Offer ${no} is ready`), 'ponude', b(`${siteL(draftSite, 'sr').name} · prodaja · simulacija`, `${siteL(draftSite, 'en').name} · sales · simulation`))
        say(t(`Simulacija: stigla je ponuda ${no}`, `Simulation: offer ${no} has arrived`))
      }, 2600),
    )
  }
  const confirm = (o: Offer) => {
    setOffers((all) => all.map((x) => (x.no === o.no ? { ...x, status: 'Potvrđena' } : x)))
    const no = `GC-26-0${4520 + seq.current++}`
    setOrders((all) => [{ no, site: o.site, step: 1, mode, slot: mode === 'Dostava' ? `${slot} (prijedlog, potvrđuje prodaja)` : 'Termin preuzimanja dogovara prodaja', lines: o.lines, days: 0, from: o.no }, ...all])
    setOrderSel(no)
    mark('confirmed')
    log(b(`${no} je potvrđena`, `${no} is confirmed`), 'narudzbe', b(`Po ponudi ${o.no} · simulacija`, `From offer ${o.no} · simulation`))
    say(t(`Simulacija: ponuda potvrđena, narudžba ${no} je otvorena`, `Simulation: offer confirmed, order ${no} is open`))
  }
  const advance = (o: Order) => {
    const step = Math.min(4, o.step + 1)
    setOrders((all) => all.map((x) => (x.no === o.no ? { ...x, step, slot: step === 3 ? (x.mode === 'Dostava' ? 'Danas, 08–10h' : 'Danas, 13–15h') : step === 4 ? 'Završeno danas' : x.slot } : x)))
    mark('tracked')
    log(b(`${o.no}: ${orderStatus({ ...o, step }, 'sr').toLowerCase()}`, `${o.no}: ${orderStatus({ ...o, step }, 'en').toLowerCase()}`), step >= 3 ? 'isporuke' : 'narudzbe', b(`${siteL(o.site, 'sr').name} · simulacija`, `${siteL(o.site, 'en').name} · simulation`))
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
    return MATERIALS.filter((m) => (group === 'sve' || m.group === group) && (!q || m.name.toLowerCase().includes(q) || nameL(m.sku, 'en').toLowerCase().includes(q) || m.sku.toLowerCase().includes(q)))
  }, [query, group])
  const [title, sub] = (lang === 'en' ? CAPTION_EN : CAPTION)[view]
  const notes = notesFor(orders, pending.length)

  const steps: { k: keyof typeof done; label: string; view: View }[] = [
    { k: 'added', label: t('Dodajte materijal', 'Add material'), view: 'materijali' },
    { k: 'sent', label: t('Pošaljite upit', 'Send an inquiry'), view: 'materijali' },
    { k: 'confirmed', label: t('Potvrdite ponudu', 'Confirm the offer'), view: 'ponude' },
    { k: 'tracked', label: t('Pratite narudžbu', 'Track the order'), view: 'narudzbe' },
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
          <span className={s.demo}>{t('Demo podaci', 'Demo data')}</span>
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
                <i>{roleName(role)}</i>
              </span>
              <em className={s.demoTag}>Demo</em>
            </div>
            <RoleSwitch role={role} onChange={switchRole} />
            <nav className={s.nav} aria-label={t('Portal (demo)', 'Portal (demo)')}>
              {GROUPS_NAV.map((g) => (
                <div key={g.label} className={s.navGroup}>
                  <span className={s.navLabel}>{t(g.label, g.en)}</span>
                  {NAV.filter((n) => g.ids.includes(n.id)).map((n) => {
                    const count = n.id === 'ponude' ? pending.length : n.id === 'narudzbe' ? active.length : n.id === 'gradilista' ? SITES.length : n.id === 'materijali' ? draft.length : n.id === 'obavjestenja' ? notes.length : 0
                    return (
                      <button key={n.id} type="button" aria-current={view === n.id || undefined} className={ROLE_VIEWS[role].includes(n.id) ? undefined : x.locked} title={ROLE_VIEWS[role].includes(n.id) ? undefined : t(`Nije dozvoljeno za ulogu ${roleLabel(role)}`, `Not allowed for the ${roleName(role)} role`)} onClick={() => go(n.id)}>
                        <Icon name={n.icon} />
                        <span>{t(n.label, n.en)}</span>
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
              <section className={s.stage} aria-label={t('Ponuda koja čeka potvrdu', 'Offer awaiting confirmation')}>
                <div className={s.stageInfo}>
                  <div>
                    <h3>{t('Pregled', 'Overview')}</h3>
                    <p>{t('Šta danas čeka vašu odluku na gradilištima DEMO GRADNJA d.o.o.', 'What needs your decision today on the DEMO GRADNJA d.o.o. sites.')}</p>
                  </div>
                  <div className={s.stagePick}>
                    <span>
                      {t('Ponuda', 'Offer')} {stageOffer.no} · {stageLine.sku} · {stageLine.qty} {unit(stageLine.sku)}
                    </span>
                    <b>{name(stageLine.sku)}</b>
                    <div className={s.stageTools}>
                      <button type="button" aria-label={t('Prethodna stavka', 'Previous item')} onClick={() => setStageSel((i) => (i + stageOffer.lines.length - 1) % stageOffer.lines.length)}>
                        <Icon name="back" />
                      </button>
                      <span>
                        {String(stageIdx + 1).padStart(2, '0')} / {String(stageOffer.lines.length).padStart(2, '0')}
                      </span>
                      <button type="button" aria-label={t('Sljedeća stavka', 'Next item')} onClick={() => setStageSel((i) => (i + 1) % stageOffer.lines.length)}>
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
                        {t('Pregledaj ponudu', 'Review offer')}
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
                  <Icon name="plus" /> {t('Novi upit', 'New inquiry')}
                </button>
              )}
            </header>

            <div className={s.canvas} key={view}>
              {view === 'pregled' && (
                // Pregled: samo ono što čeka odluku. Plava scena (ponuda) je iznad; ispod narudžbe u toku i tok.
                <div className={s.cols}>
                  {can(role, 'fakture') && <CreditCard orders={orders} onDocs={() => go('dokumenti')} />}
                  {can(role, 'upit') && <ReorderCard orders={orders} onReorder={(o) => loadLines(o.lines, t(`Narudžba ${o.no}`, `Order ${o.no}`))} />}
                  <section className={s.card}>
                    <h4>{t('Narudžbe u toku', 'Orders in progress')}</h4>
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
                                {o.mode === 'Dostava' ? site(o.site).name : t('Stovarište', 'Yard')} · {slotL(o.slot, lang)}
                              </i>
                            </span>
                            <Status o={o} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className={s.card}>
                    <h4>{t('Uživo', 'Live')}</h4>
                    <ul className={s.rows}>
                      {activity.slice(0, 3).map((a, i) => (
                        <li key={`${a.text.sr}-${i}`} data-new={(i === 0 && a.t.sr === 'sad') || undefined}>
                          <button type="button" className={s.rowBtn} onClick={() => go(a.kind === 'ponude' ? 'ponude' : a.kind === 'dokumenti' ? 'dokumenti' : 'narudzbe')}>
                            <span>
                              <b>{tl(a.text, lang)}</b>
                              <i>{tl(a.meta, lang)}</i>
                            </span>
                            <time className={s.time}>{tl(a.t, lang)}</time>
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
                    <h4>{t('Dodajte materijal', 'Add material')}</h4>
                    {/* E-shop pretraga: grupa iz padajuće liste + polje; rezultati se otvaraju ispod polja. */}
                    <div className={s.finder}>
                      <select className={s.groupSelect} value={group} onChange={(e) => { setGroup(e.target.value); setFinderOpen(true) }} aria-label={t('Grupa materijala', 'Material group')}>
                        <option value="sve">{t('Sve grupe', 'All groups')}</option>
                        {GROUPS.map((g) => (
                          <option key={g.id} value={g.id}>
                            {groupL(g.id, g.label, lang)}
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
                          placeholder={t('Šifra ili naziv, npr. CW 75', 'Code or name, e.g. CW 75')}
                          aria-label={t('Traži materijal', 'Search materials')}
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
                                    <b>{name(m.sku)}</b>
                                    <i>{m.sku}</i>
                                    <i>{stockLine(m.sku)}</i>
                                    {can(role, 'cijene') && (
                                      <i className={x.price}>
                                        {t('Vaša cijena', 'Your price')} {kmdL(firmPrice(m.sku), lang)}/{unitText(m.unit, lang)} · {t('druga firma', 'other company')} {kmdL(otherPrice(m.sku), lang)}
                                      </i>
                                    )}
                                  </span>
                                  <em>{has ? `✓ ${has.toLocaleString(lang === 'en' ? 'en-US' : 'de-DE')} ${unitText(m.unit, lang)}` : t('+ Dodaj', '+ Add')}</em>
                                </button>
                              </li>
                            )
                          })}
                          {list.length === 0 && <li className={s.empty}>{t('Nema materijala za ovu pretragu.', 'No materials match this search.')}</li>}
                          {list.length > 6 && <li className={s.more}>{t(`Još ${list.length - 6}, suzite pretragu`, `${list.length - 6} more, narrow your search`)}</li>}
                        </ul>
                      )}
                    </div>
                    <p className={s.fine}>{t('Količinu mijenjate u upitu desno.', 'You change the quantity in the inquiry on the right.')}</p>
                  </section>

                  <aside className={`${s.card} ${s.request}`}>
                    <h4>{t('Vaš upit', 'Your inquiry')}</h4>
                    <label className={s.field}>
                      <span>{t('Gradilište', 'Construction site')}</span>
                      <select data-t="site" value={draftSite} onChange={(e) => setDraftSite(e.target.value)}>
                        {SITES.map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className={s.seg} role="radiogroup" aria-label={t('Način preuzimanja', 'Delivery method')}>
                      {(['Dostava', 'Preuzimanje'] as const).map((m) => (
                        <button key={m} type="button" data-t={`mode-${m}`} role="radio" aria-checked={mode === m} onClick={() => setMode(m)}>
                          {m === 'Dostava' ? t('Dostava na gradilište', 'Delivery to the site') : t('Preuzimanje na stovarištu', 'Collection at the yard')}
                        </button>
                      ))}
                    </div>
                    {mode === 'Dostava' ? (
                      <div className={s.delivery}>
                        <label className={s.field}>
                          <span>{t('Željeni termin', 'Preferred time slot')}</span>
                          <select value={slot} onChange={(e) => setSlot(e.target.value)}>
                            {SLOTS.map((x) => (
                              <option key={x} value={x}>
                                {slotL(x, lang)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <p className={s.fine}>
                          {site(draftSite).address} · {t('kontakt na gradilištu:', 'site contact:')} {site(draftSite).lead}
                        </p>
                      </div>
                    ) : (
                      <p className={`${s.fine} ${s.delivery}`}>{t('Stovarište, Ul. Nenada Kostića 151, Banja Luka · 07:00–16:00', 'Yard, Ul. Nenada Kostića 151, Banja Luka · 07:00–16:00')}</p>
                    )}
                    {draft.length === 0 ? (
                      <p className={s.empty}>{t('Upit je prazan. Dodajte materijal iz liste ili učitajte sačuvanu listu.', 'Your inquiry is empty. Add material from the list or load a saved list.')}</p>
                    ) : (
                      <ul className={s.lines}>
                        {draft.map((l) => (
                          <li key={l.sku}>
                            <span>
                              <b>{name(l.sku)}</b>
                              <i>
                                {l.sku}
                                {packsL(l, lang) ? ` · ${packsL(l, lang)}` : ''}
                              </i>
                            </span>
                            <Qty value={l.qty} unit={unit(l.sku)} onChange={(q) => setDraft((d) => (q <= 0 ? d.filter((x) => x.sku !== l.sku) : d.map((x) => (x.sku === l.sku ? { ...x, qty: q } : x))))} />
                          </li>
                        ))}
                      </ul>
                    )}
                    <label className={s.field}>
                      <span>{t('Sačuvana lista', 'Saved list')}</span>
                      <select value="" onChange={(e) => e.target.value && loadLines(LISTS.find((l) => l.id === e.target.value)!.lines, listNameL(LISTS.find((l) => l.id === e.target.value)!, lang))}>
                        <option value="">{t('Učitaj listu…', 'Load a list…')}</option>
                        {LISTS.map((l) => (
                          <option key={l.id} value={l.id}>
                            {listNameL(l, lang)}
                          </option>
                        ))}
                      </select>
                    </label>
                    {draft.length > 0 && (
                      <p className={s.weight}>
                        <span>{t('Ukupna težina (okvirno)', 'Total weight (approx.)')}</span>
                        <b>{(weight(draft) / 1000).toLocaleString(lang === 'en' ? 'en-US' : 'de-DE', { maximumFractionDigits: 1 })} t</b>
                      </p>
                    )}
                    {can(role, 'cijene') && draft.length > 0 && (
                      <p className={s.weight}>
                        <span>{t('Vaš iznos (cjenovnik firme, demo)', 'Your total (company price list, demo)')}</span>
                        <b>{kmdL(firmAmount(draft), lang)}</b>
                      </p>
                    )}
                    <PaymentSeg value={payment} onChange={setPayment} />
                    {payment === 'Odgoda' && can(role, 'cijene') && firmAmount(draft) > creditState(orders).free && draft.length > 0 && (
                      <p className={x.limitWarn}>
                        {t(`Upit prelazi slobodan limit (${kmdL(creditState(orders).free, 'sr')}). Prodaja će tražiti avans ili uplatu dospjelih faktura prije isporuke.`, `The inquiry exceeds your available limit (${kmdL(creditState(orders).free, 'en')}). Sales will ask for an advance payment or payment of overdue invoices before delivery.`)}
                      </p>
                    )}
                    {!can(role, 'cijene') && <p className={x.lockNote}>{t(`Kao ${roleLabel(role).toLowerCase()} šaljete upit bez cijena; cijene i ponudu vidi šef ili vlasnik.`, `As ${roleName(role).toLowerCase()} you send inquiries without prices; prices and the offer are visible to the manager or owner.`)}</p>}
                    <button type="button" data-t="send" className={`${s.primary} ${s.wide}`} disabled={!draft.length || !can(role, 'upit')} onClick={send}>
                      {t('Pošalji upit (demo)', 'Send inquiry (demo)')} <Icon name="arrow" />
                    </button>
                    <p className={s.fine}>{t('Cijene i rok dobijate u ponudi prodaje. U demu se upit ne šalje.', 'Prices and lead time come with the sales offer. Nothing is sent in the demo.')}</p>
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
                                {site(o.site).name} · {o.lines.length} {t('stavki', 'items')}
                              </i>
                            </span>
                            <span className={s.chip} data-k={o.status === 'Čeka potvrdu' ? 'act' : o.status === 'Potvrđena' ? 'done' : 'wait'}>
                              {offerStatusL(o.status, lang)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className={`${s.card} ${s.detail}`} aria-live="polite">
                    <div className={s.detailHead}>
                      <span>
                        <span className={s.kicker}>{t('Ponuda', 'Offer')} {offer.no}</span>
                        <b>{offerTitleL(offer, lang)}</b>
                        <i>
                          {site(offer.site).name} · {offer.days === 0 ? t('danas', 'today') : t(`prije ${offer.days} ${offer.days === 1 ? 'dan' : 'dana'}`, `${offer.days} ${offer.days === 1 ? 'day' : 'days'} ago`)} · {t(`važi ${offer.validDays} dana`, `valid for ${offer.validDays} days`)}
                        </i>
                      </span>
                      <span className={s.chip} data-k={offer.status === 'Čeka potvrdu' ? 'act' : offer.status === 'Potvrđena' ? 'done' : 'wait'}>
                        {offerStatusL(offer.status, lang)}
                      </span>
                    </div>
                    {offer.status === 'Kod prodaje' ? (
                      <p className={s.wait}>
                        <i />
                        {t('Prodaja priprema ponudu po vašem upitu (simulacija)…', 'Sales is preparing an offer from your inquiry (simulation)…')}
                      </p>
                    ) : (
                      <>
                        <table data-t="offer-lines" className={s.table}>
                          <thead>
                            <tr>
                              <th>{t('Artikal', 'Item')}</th>
                              <th>{t('Količina', 'Quantity')}</th>
                              <th>{can(role, 'cijene') ? t('Vaša cijena (demo)', 'Your price (demo)') : t('Iznos', 'Amount')}</th>
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
                                <td>{can(role, 'cijene') ? kmdL(firmPrice(l.sku) * l.qty, lang) : t('skriveno za ulogu', 'hidden for this role')}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={2}>{t('Ukupno', 'Total')}</td>
                              <td>{can(role, 'cijene') ? kmdL(firmAmount(offer.lines), lang) : '—'}</td>
                            </tr>
                          </tfoot>
                        </table>
                        <div className={s.actions}>
                          {offer.status === 'Čeka potvrdu' ? (
                            can(role, 'potvrda') ? (
                              <button type="button" data-t="confirm" className={s.primary} onClick={() => confirm(offer)}>
                                {t('Potvrdi ponudu (demo)', 'Confirm offer (demo)')} <Icon name="check" />
                              </button>
                            ) : (
                              <p className={x.lockNote}>{t('Ponudu potvrđuje šef gradilišta ili vlasnik. Vi je vidite, ali ne možete potvrditi.', 'Offers are confirmed by the site manager or the owner. You can see this one but cannot confirm it.')}</p>
                            )
                          ) : (
                            <button type="button" className={s.primary} onClick={() => go('narudzbe')}>
                              {t('Pratite narudžbu', 'Track the order')} <Icon name="arrow" />
                            </button>
                          )}
                          <button type="button" className={s.ghost} onClick={() => loadLines(offer.lines, t(`Ponuda ${offer.no}`, `Offer ${offer.no}`))}>
                            {t('Izmijeni u upitu', 'Edit in inquiry')}
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
                                {site(o.site).name} · {slotL(o.slot, lang)}
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
                        <span className={s.kicker}>{t('Narudžba', 'Order')} {order.no}</span>
                        <b>{orderStatus(order, lang)}</b>
                        <i>
                          {order.from ? t(`Po ponudi ${order.from} · `, `From offer ${order.from} · `) : ''}
                          {site(order.site).name}
                        </i>
                      </span>
                      <Status o={order} />
                    </div>
                    <ol data-t="track" className={s.track}>
                      {STEPS.map((st, i) => (
                        <li key={st} data-done={i <= order.step || undefined} data-now={i === order.step || undefined}>
                          <i />
                          <span>{stepL(st, lang)}</span>
                        </li>
                      ))}
                    </ol>
                    <dl className={s.facts}>
                      <div>
                        <dt>{modeL(order.mode, lang)}</dt>
                        <dd>{slotL(order.slot, lang)}</dd>
                      </div>
                      <div>
                        <dt>{t('Mjesto', 'Location')}</dt>
                        <dd>{order.mode === 'Preuzimanje' ? t('Stovarište, Nenada Kostića 151', 'Yard, Nenada Kostića 151') : site(order.site).address}</dd>
                      </div>
                      <div>
                        <dt>{t('Stavke', 'Items')}</dt>
                        <dd>{order.lines.map((l) => `${name(l.sku)} × ${l.qty} ${unit(l.sku)}`).join(' · ')}</dd>
                      </div>
                    </dl>
                    <div className={s.actions}>
                      {order.step < 4 && (
                        <button type="button" data-t="advance" className={s.ghost} onClick={() => advance(order)}>
                          {t('Prikaži sljedeći status (demo)', 'Show next status (demo)')}
                        </button>
                      )}
                      {can(role, 'upit') && (
                        <button type="button" data-t="reorder" className={s.primary} onClick={() => loadLines(order.lines, t(`Narudžba ${order.no}`, `Order ${order.no}`))}>
                          <Icon name="repeat" /> {t('Ponovi narudžbu', 'Repeat order')}
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
                            <dt>{t('Otvorene ponude', 'Open offers')}</dt>
                            <dd>{o}</dd>
                          </div>
                          <div>
                            <dt>{t('Narudžbe u toku', 'Orders in progress')}</dt>
                            <dd>{a.length}</dd>
                          </div>
                          <div>
                            <dt>{t('Sljedeće', 'Next')}</dt>
                            <dd>{a[0] ? `${modeL(a[0].mode, lang)}: ${slotL(a[0].slot, lang)}` : t('Nema zakazano', 'Nothing scheduled')}</dd>
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
                          {t('Novi upit za ovo gradilište', 'New inquiry for this site')}
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
                    <h4>{t('Dokumenti', 'Documents')}</h4>
                    <ul className={s.rows}>
                      {DOCS.map((d) => {
                        const dd = docL(d, lang)
                        return (
                        <li key={d.id}>
                          <span>
                            <b>{dd.title}</b>
                            <i>
                              {dd.kind} · {dd.ref} · {dateAgoL(d.days, lang)}
                            </i>
                          </span>
                          <button type="button" className={s.ghost} onClick={() => say(t('Demo: u pravom portalu ovdje se preuzima PDF', 'Demo: in the real portal a PDF is downloaded here'))}>
                            <Icon name="down" /> {t('Primjer', 'Sample')}
                          </button>
                        </li>
                        )
                      })}
                    </ul>
                  </section>
                  </div>
                  <aside className={s.card}>
                    <h4>{t('Korisnici naloga', 'Account users')}</h4>
                    <ul className={s.rows}>
                      {USERS.map((u) => (
                        <li key={u.initials}>
                          <span className={s.avatarSm}>{u.initials}</span>
                          <span>
                            <b>{userL(u, lang).name}</b>
                            <i>{userL(u, lang).role}</i>
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
  const { lang } = useLang()
  return (
    <span className={s.chip} data-k={statusKind(o) === 'done' ? 'done' : statusKind(o) === 'ready' ? 'act' : 'wait'}>
      {orderStatus(o, lang)}
    </span>
  )
}

function Qty({ value, unit, onChange }: { value: number; unit: string; onChange: (n: number) => void }) {
  const { t } = useLang()
  return (
    <span className={s.qty}>
      <button type="button" aria-label={t('Manje', 'Less')} onClick={() => onChange(value - 1)}>
        −
      </button>
      <input type="number" min={0} value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} aria-label={t(`Količina u ${unit}`, `Quantity in ${unit}`)} />
      <em>{unit}</em>
      <button type="button" aria-label={t('Više', 'More')} onClick={() => onChange(value + 1)}>
        +
      </button>
    </span>
  )
}
