import type { Lang } from './i18n'

// Engleski za demo portal (Dashboard, views, b2b-views, extra-views).
// Podaci u portal-demo.ts, portal.ts, portal-b2b.ts i b2b-demo.ts ostaju srpski (oni su i ključevi u logici:
// statusi, filteri...). Ovdje je rječnik "srpski tekst -> engleski" koji se primjenjuje tek pri prikazu,
// pa nijedan postojeći izvezeni podatak nije mijenjan. Nepoznat tekst vraća se nepromijenjen.

const EN: Record<string, string> = {
  // ——— Firma, gradilišta ———
  'Demo nabavka': 'Demo procurement',
  'Demo poslovođa 1': 'Demo site manager 1',
  'Demo poslovođa 2': 'Demo site manager 2',
  'Demo poslovođa 3': 'Demo site manager 3',
  'Demo računovodstvo': 'Demo accounting',
  'Demo gradilište A — stambena lamela': 'Demo site A — residential block',
  'Demo gradilište B — poslovni prostor': 'Demo site B — office space',
  'Demo gradilište C — porodična kuća': 'Demo site C — family house',
  'Demo gradilište A — stan': 'Demo site A — apartment',
  'Demo gradilište B — stambeni objekat': 'Demo site B — residential building',
  'Demo gradilište C — poslovni prostor': 'Demo site C — office space',
  'Demo gradilište D — lamela': 'Demo site D — residential block',
  'Demo gradilište E — poslovni objekat': 'Demo site E — commercial building',
  'Lamela A': 'Block A',
  'Poslovni B': 'Office B',
  'Kuća C': 'House C',
  'Lamela A, stambeni objekat': 'Block A, residential building',
  'Poslovni prostor B': 'Office space B',
  'Porodična kuća C': 'Family house C',
  'Banja Luka, demo adresa 1': 'Banja Luka, demo address 1',
  'Banja Luka, demo adresa 2': 'Banja Luka, demo address 2',
  'Banja Luka, demo': 'Banja Luka, demo',
  'Banja Luka (demo adresa)': 'Banja Luka (demo address)',
  'Pregradni zidovi, sprat 3': 'Partition walls, floor 3',
  'Spušteni plafoni': 'Suspended ceilings',
  'Krov i izolacija': 'Roof and insulation',
  'Nivo 1': 'Tier 1',
  'Nivo 2': 'Tier 2',
  'Nivo 3': 'Tier 3',
  Gost: 'Guest',
  'Projektni dogovor: suha gradnja': 'Project deal: drywall',

  // ——— Statusi, vrste ———
  Sve: 'All',
  Spremna: 'Ready',
  'U obradi': 'Processing',
  Prihvaćena: 'Accepted',
  Istekla: 'Expired',
  Aktivne: 'Active',
  Završene: 'Completed',
  Primljena: 'Received',
  Potvrđena: 'Confirmed',
  'U pripremi': 'In preparation',
  Isporučena: 'Delivered',
  Dostava: 'Delivery',
  Preuzimanje: 'Pickup',
  Isporučeno: 'Delivered',
  Preuzeto: 'Picked up',
  'Spremno za preuzimanje': 'Ready for pickup',
  'Na putu ka gradilištu': 'On the way to site',
  Faktura: 'Invoice',
  Otpremnica: 'Delivery note',
  Ponuda: 'Quote',
  'Tehnički list': 'Data sheet',
  Plaćena: 'Paid',
  Otvorena: 'Open',
  Dospijeva: 'Due soon',
  Kasni: 'Overdue',
  Odgoda: 'Deferred',
  Avans: 'Advance',
  Odobrena: 'Approved',
  Odbijena: 'Rejected',
  Narudžba: 'Order',
  Pon: 'Mon',
  Uto: 'Tue',
  Sri: 'Wed',
  Čet: 'Thu',
  Pet: 'Fri',
  Sub: 'Sat',

  // ——— Termini ———
  'Sutra 08–10h': 'Tomorrow 08–10h',
  'Danas 13–15h': 'Today 13–15h',
  'Čet 07–09h': 'Thu 07–09h',
  'Pet 10–12h': 'Fri 10–12h',
  'Sutra, 08–10h': 'Tomorrow, 08–10h',
  'Danas, 13–15h': 'Today, 13–15h',
  'Isporučeno 27.09.': 'Delivered 27 Sep',
  'Preuzeto 21.09.': 'Picked up 21 Sep',
  'Sutra, 07–09h': 'Tomorrow, 07–09h',
  'Sutra, 10–12h': 'Tomorrow, 10–12h',
  'Prekosutra, 07–09h': 'Day after tomorrow, 07–09h',
  'Prekosutra, 12–14h': 'Day after tomorrow, 12–14h',
  'Ploče GKB, CW 75, vuna': 'GKB boards, CW 75, wool',
  'CD/UD profili, ovjesi': 'CD/UD profiles, hangers',
  'GKB 260 m², CW 75': 'GKB 260 m², CW 75',
  'Staklena vuna 140 m²': 'Glass wool 140 m²',
  'GKBI, masa, traka': 'GKBI, compound, tape',
  'Vuna 100 mm, vijci': 'Wool 100 mm, screws',
  'Dopuna — pribor': 'Top-up — accessories',

  // ——— Ponude, liste, dokumenti ———
  'Pregradni zidovi, sprat 3 — prema planu iz kalkulatora': 'Partition walls, floor 3 — based on the calculator plan',
  'Spušteni plafon, open space 210 m²': 'Suspended ceiling, open space 210 m²',
  'Izolacija potkrovlja': 'Attic insulation',
  'Sprat 2 — dopuna': 'Floor 2 — top-up',
  'Fasada — varijanta 1': 'Facade — option 1',
  'Pregradni zid 100 mm — tipski stan': 'Partition wall 100 mm — typical apartment',
  'Spušteni plafon — kancelarija': 'Suspended ceiling — office',
  'Standardna adaptacija kupatila': 'Standard bathroom renovation',
  'Potkrovlje — izolacija': 'Attic — insulation',
  'Pregradni zid 100 mm, tipski stan': 'Partition wall 100 mm, typical apartment',
  'Spušteni plafon, kancelarija': 'Suspended ceiling, office',
  'Kupatilo, impregnirane ploče': 'Bathroom, moisture-resistant boards',
  Kalkulator: 'Calculator',
  Ručno: 'Manual',
  'Narudžba GC-26-04498': 'Order GC-26-04498',
  'Faktura IF-26-00901': 'Invoice IF-26-00901',
  'Faktura IF-26-00862': 'Invoice IF-26-00862',
  'Faktura IF-26-00802': 'Invoice IF-26-00802',
  'Otpremnica uz GC-26-04402': 'Delivery note for GC-26-04402',
  'Otpremnica uz GC-26-04371': 'Delivery note for GC-26-04371',
  'Faktura uz GC-26-04402': 'Invoice for GC-26-04402',
  'Ponuda P-26-0142 (PDF)': 'Quote P-26-0142 (PDF)',
  'Ponuda P-26-0142': 'Quote P-26-0142',
  'Gips-kartonska ploča GKB': 'GKB plasterboard',
  'Gips-kartonska ploča GKB — tehnički list (demo)': 'GKB plasterboard — data sheet (demo)',
  'Kamena vuna — tehnički list (demo)': 'Stone wool — data sheet (demo)',
  'Kamena vuna': 'Stone wool',

  // ——— Tim ———
  'Administrator naloga': 'Account administrator',
  'Sve: ponude, narudžbe, dokumenti, tim': 'Everything: quotes, orders, documents, team',
  'Poslovođa · Lamela A': 'Site manager · Block A',
  'Poslovođa · Poslovni B': 'Site manager · Office B',
  'Zahtjev za materijal do 2.000 KM bez odobrenja': 'Material requests up to 2,000 KM without approval',
  'Zahtjev za materijal, uvid u isporuke': 'Material requests, delivery visibility',
  Računovodstvo: 'Accounting',
  'Fakture i otpremnice, bez naručivanja': 'Invoices and delivery notes, no ordering',
  'Nabavka · šalje upite i potvrđuje ponude': 'Procurement · sends inquiries and confirms quotes',
  'Uvid u dokumente': 'Document access',
  'Fali profila za zid u hodniku': 'Short on profiles for the hallway wall',
  'Dopuna ploča za plafon': 'Top-up of ceiling boards',

  // ——— Nabavka po kategoriji ———
  'Suha gradnja': 'Drywall',
  'Kamena vuna i izolacija': 'Stone wool and insulation',
  'Građevinska hemija': 'Construction chemicals',
  'Krovni i zidni sistemi': 'Roofing and wall systems',
  'Drvni program': 'Timber range',
  'Sanitarna oprema': 'Sanitary ware',
  Izolacija: 'Insulation',
  'Veziva i vrećasti materijali': 'Binders and bagged materials',
  'Pribor i oprema': 'Accessories and equipment',
  'Mase i ljepila': 'Compounds and adhesives',
  Pribor: 'Accessories',
  'Ostali proizvođači': 'Other manufacturers',

  // ——— Metrike ———
  'Nabavka · ovaj mjesec': 'Procurement · this month',
  'Otvorene ponude': 'Open quotes',
  'Aktivne narudžbe': 'Active orders',
  'Isporuke ove sedmice': 'Deliveries this week',
  'Otvoreni računi': 'Open invoices',
  'Aktivna gradilišta': 'Active sites',
  '18.420 KM': '18,420 KM',
  '11.350 KM': '11,350 KM',
  ponude: 'quotes',
  narudžbe: 'orders',
  isporuke: 'deliveries',
  gradilišta: 'sites',

  // ——— Živi tok ———
  sad: 'now',
  'Ponuda P-26-0142 je spremna': 'Quote P-26-0142 is ready',
  'Lamela A · 8 stavki · prodaja': 'Block A · 8 items · sales',
  'GC-26-04498 spremna za preuzimanje': 'GC-26-04498 ready for pickup',
  'Stovarište · danas 13–15h': 'Warehouse · today 13–15h',
  'Demo poslovođa 1 traži odobrenje': 'Demo site manager 1 requests approval',
  'Otpremnica OT-26-01877 dodata': 'Delivery note OT-26-01877 added',
  'Uz narudžbu GC-26-04402': 'For order GC-26-04402',
  'GC-26-04512 je potvrđena': 'GC-26-04512 is confirmed',
  'Lamela A · dostava sutra 08–10h': 'Block A · delivery tomorrow 08–10h',
  'Prodaja je odgovorila na upit': 'Sales replied to your inquiry',
  'Poslovni B · plafon 210 m²': 'Office B · ceiling 210 m²',
  'Isporuka GC-26-04477 zakazana': 'Delivery GC-26-04477 scheduled',
  'Kuća C · četvrtak 07–09h': 'House C · Thursday 07–09h',
  'Faktura IF-26-00901 izdata': 'Invoice IF-26-00901 issued',
  'Valuta po dogovoru': 'Payment terms as agreed',
  'Demo poslovođa 2 dodao listu': 'Demo site manager 2 added a list',
  'GC-26-04460 u pripremi': 'GC-26-04460 in preparation',
  'Lamela A · 3 stavke': 'Block A · 3 items',
  'Ponuda P-26-0131 ističe za 4 dana': 'Quote P-26-0131 expires in 4 days',
  'Kuća C · izolacija potkrovlja': 'House C · attic insulation',

  // ——— Extra views ———
  Vlasnik: 'Owner',
  'Šef gradilišta': 'Site manager',
  Majstor: 'Tradesperson',
  'Demo vlasnik': 'Demo owner',
  'Demo šef · Lamela A': 'Demo manager · Block A',
  'Demo majstor · Lamela A': 'Demo tradesperson · Block A',
  'Šalje upit za materijal': 'Sends material inquiries',
  'Vidi cijene firme': 'Sees company prices',
  'Potvrđuje ponudu': 'Confirms quotes',
  'Prati narudžbe i isporuke': 'Tracks orders and deliveries',
  'Vidi fakture, dug i limit': 'Sees invoices, balance and limit',
  'Dodaje korisnike i prava': 'Adds users and permissions',
  'Demo vlasnik · 065 000 111': 'Demo owner · 065 000 111',
  'Demo majstor · 066 000 222': 'Demo tradesperson · 066 000 222',
  juče: 'yesterday',
  Mejl: 'Email',
  'Novi upit: DEMO GRADNJA d.o.o.': 'New inquiry: DEMO GRADNJA d.o.o.',
  'Lamela A · 5 stavki · odgovor do 12:00': 'Block A · 5 items · reply by 12:00',
  'Ponuda P-26-0142 ističe za 2 dana': 'Quote P-26-0142 expires in 2 days',
  'DEMO GRADNJA · podsjetnik prodavcu': 'DEMO GRADNJA · reminder for the sales rep',
  'Firma traži odobrenje naloga': 'Company requests account approval',
  'Limit skoro iskorišten': 'Limit almost used up',
  'DEMO GRADNJA · ostalo manje od 5 % limita · provjeriti prije isporuke': 'DEMO GRADNJA · less than 5 % of limit left · check before delivery',
  'Narudžba potvrđena': 'Order confirmed',
  'Promjena statusa': 'Status change',
  'Faktura dospijeva': 'Invoice due',
  Ponude: 'Quotes',
  Stovarište: 'Warehouse',
  'Brza narudžba': 'Quick order',
  Uvezeno: 'Imported',
  'narudžba kreirana (demo)': 'order created (demo)',
  Korpa: 'Cart',
}

// Pojedinačni nazivi artikala za prikaz (katalog je u src/gc, srpski).
type P = { name: string; spec: string; desc: string }
export const PRODUCT_EN: Record<string, P> = {
  'GKP-001': { name: 'Plasterboard GKB 12.5 mm', spec: '2000 × 1250 × 12.5 mm, board 2.5 m²', desc: 'Standard board for walls and ceilings in dry rooms.' },
  'GKP-002': { name: 'Moisture-resistant plasterboard GKBI 12.5 mm', spec: '2000 × 1250 × 12.5 mm, board 2.5 m²', desc: 'Moisture-resistant green board for bathrooms, kitchens and laundry rooms.' },
  'GKP-003': { name: 'Fire-resistant plasterboard GKF 12.5 mm', spec: '2000 × 1250 × 12.5 mm, board 2.5 m²', desc: 'Red board for fire-protection linings, reaction to fire class A2-s1,d0.' },
  'GKP-004': { name: 'Hard plasterboard 12.5 mm', spec: '2000 × 1250 × 12.5 mm, board 2.5 m²', desc: 'Extra-strong board with better sound insulation and resistance to fire and impact.' },
  'PRF-075': { name: 'Galvanised wall profile CW 75', spec: '3000 × 75 × 50 mm, 0.6 mm sheet', desc: 'Vertical profile for 10 cm partition walls.' },
  'PRF-UW75': { name: 'Galvanised track profile UW 75', spec: '4000 × 75 × 40 mm, 0.6 mm sheet', desc: 'Horizontal track profile fixed to the floor and ceiling.' },
  'PRF-CD60': { name: 'Galvanised ceiling profile CD 60/27', spec: '4000 × 60 × 27 mm, 0.6 mm sheet', desc: 'Load-bearing and mounting profile for suspended ceilings.' },
  'PRF-UD28': { name: 'Galvanised perimeter profile UD 28/27', spec: '3000 × 28 × 27 mm, 0.6 mm sheet', desc: 'Perimeter profile fixed along the wall for suspended ceilings.' },
  'ISO-001': { name: 'Stone wool board 50 mm', spec: 'Thickness 50 mm, board 1000 × 600 mm', desc: 'For partition walls: thermal and sound insulation, non-combustible.' },
  'ISO-002': { name: 'Stone wool board 100 mm', spec: 'Thickness 100 mm, board 1000 × 600 mm', desc: 'For high-insulation walls and attics.' },
  'CHM-001': { name: 'Gypsum jointing compound', spec: 'Bag 5 kg', desc: 'High-strength compound for filling plasterboard joints without tape.' },
  'CHM-002': { name: 'Gypsum joint filler', spec: 'Bag 25 kg', desc: 'Standard gypsum joint filler, used with tape.' },
  'ACC-001': { name: 'Self-drilling screws 3.5 × 25 mm', spec: 'Box of 1000 pcs', desc: 'For fixing a single layer of plasterboard to metal profiles.' },
  'ACC-003': { name: 'Fibreglass jointing tape', spec: 'Roll 25 m', desc: 'Self-adhesive mesh for reinforcing plasterboard joints.' },
  'ACC-006': { name: 'Direct hanger for CD profile 120 mm', spec: 'Pack of 100 pcs', desc: 'For mounting a ceiling frame made of CD 60/27 profiles.' },
}
const UNIT_EN: Record<string, string> = { kom: 'pcs', kut: 'box', pak: 'pack', komplet: 'set', 'jed.': 'unit', paleta: 'pallet', ploča: 'board', rolna: 'roll', vreća: 'bag' }

export const pName = (sku: string, fallback: string, lang: Lang) => (lang === 'en' ? PRODUCT_EN[sku]?.name ?? fallback : fallback)
export const pSpec = (sku: string, fallback: string, lang: Lang) => (lang === 'en' ? PRODUCT_EN[sku]?.spec ?? fallback : fallback)
export const pDesc = (sku: string, fallback: string, lang: Lang) => (lang === 'en' ? PRODUCT_EN[sku]?.desc ?? fallback : fallback)
export const uName = (u: string, lang: Lang) => (lang === 'en' ? UNIT_EN[u] ?? u : u)

/** Decimalni zarez -> tačka (12,5 mm -> 12.5 mm) i tačka hiljada -> zarez, samo za engleski. */
export const swapNum = (s: string, lang: Lang) => (lang === 'en' ? s.replace(/\d[\d.,]*\d|\d/g, (m) => m.replace(/[.,]/g, (c) => (c === '.' ? ',' : '.'))) : s)
export const decDot = (s: string, lang: Lang) => (lang === 'en' ? s.replace(/(\d),(\d)/g, '$1.$2') : s)
export const numLocale = (lang: Lang) => (lang === 'en' ? 'en-US' : 'de-DE')
export const moneyL = (n: number, lang: Lang) => `${n.toLocaleString(numLocale(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} KM`
export const kmL = (n: number, lang: Lang) => `${Math.round(n).toLocaleString(numLocale(lang))} KM`
export const n2L = (n: number, lang: Lang) => n.toLocaleString(numLocale(lang), { maximumFractionDigits: 2 })
export const dateLocale = (lang: Lang) => (lang === 'en' ? 'en-GB' : 'de-DE')

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many)
const stepEn = (s: string) => EN[s.charAt(0).toUpperCase() + s.slice(1)]?.toLowerCase() ?? s

// Dinamički sastavljeni tekstovi (brojevi + riječi) koji se ne mogu staviti u rječnik jedan po jedan.
const PATTERNS: [RegExp, (m: RegExpExecArray) => string][] = [
  [/^(\d+) stavk(?:a|e|i)$/, (m) => `${m[1]} ${plural(Number(m[1]), 'item', 'items')}`],
  [/^(\d+) ponuda čeka vašu potvrdu$/, (m) => `${m[1]} ${plural(Number(m[1]), 'quote awaits', 'quotes await')} your confirmation`],
  [/^Narudžba (\S+) je potvrđena$/, (m) => `Order ${m[1]} is confirmed`],
  [/^Narudžba (\S+)$/, (m) => `Order ${m[1]}`],
  [/^Ponuda (\S+)$/, (m) => `Quote ${m[1]}`],
  [/^(\S+): (primljena|potvrđena|u pripremi|spremna|isporučena)$/, (m) => `${m[1]}: ${stepEn(m[2])}`],
  [/^Faktura (\S+) kasni (\d+) dana$/, (m) => `Invoice ${m[1]} is ${m[2]} days overdue`],
  [/^Faktura (\S+) dospijeva za (\d+) dana$/, (m) => `Invoice ${m[1]} is due in ${m[2]} days`],
  [/^(\d{1,3}(?:\.\d{3})*(?:,\d+)?) KM$/, (m) => `${swapNum(m[1], 'en')} KM`],
  [/^Ponovljena (\S+)$/, (m) => `Reorder of ${m[1]}`],
  [/^Zahtjev: (.+)$/, (m) => `Request: ${tr(m[1], 'en')}`],
  [/^(Odobren|Odbijen) zahtjev — (.+)$/, (m) => `Request ${m[1] === 'Odobren' ? 'approved' : 'rejected'} — ${tr(m[2], 'en')}`],
  [/^Ponuda (\S+) prihvaćena$/, (m) => `Quote ${m[1]} accepted`],
  [/^Isporuka (\S+) zakazana$/, (m) => `Delivery ${m[1]} scheduled`],
]

/** Prevod srpskog teksta iz demo podataka; za 'sr' vraća ulaz. */
export function tr(s: string, lang: Lang): string {
  if (lang !== 'en' || !s) return s
  const hit = EN[s]
  if (hit !== undefined) return hit
  for (const [re, f] of PATTERNS) {
    const m = re.exec(s)
    if (m) return f(m)
  }
  if (s.includes(' · ')) return s.split(' · ').map((p) => tr(p, lang)).join(' · ')
  if (s.includes(', ')) {
    const parts = s.split(', ')
    const out = parts.map((p) => EN[p] ?? p)
    if (out.some((p, i) => p !== parts[i])) return out.join(', ')
  }
  return s
}
