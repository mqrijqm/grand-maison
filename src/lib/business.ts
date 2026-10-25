// Sadržaj za /za-firme: predloženi B2B portal za kupce Grand Company-ja (demo).
// Portal je osnovno okruženje za naručivanje: nalog firme, izbor materijala, upiti, ponude, narudžbe,
// gradilišta i dokumenti. ERP veza, sinhronizacija zaliha i računovodstva, ugovorne cijene i kreditni
// limiti su poseban, napredni paket i ovdje se NE prikazuju kao postojeće funkcije.

export const CAPABILITIES = [
  { no: '01', title: 'Poslovni nalog', text: 'Jedan pregled za upite, ponude i narudžbe vaše firme.', snippet: 'account' },
  { no: '02', title: 'Brza narudžba materijala', text: 'Odaberite artikle, unesite količine i pošaljite upit za više proizvoda odjednom.', snippet: 'lines' },
  { no: '03', title: 'Ponude na jednom mjestu', text: 'Pregledajte ponude prodaje, provjerite stavke i potvrdite odgovarajuću ponudu.', snippet: 'offer' },
  { no: '04', title: 'Pregled narudžbi i isporuka', text: 'Provjerite status narudžbe i dostupne informacije o dogovorenoj dostavi ili preuzimanju.', snippet: 'track' },
  { no: '05', title: 'Ponovljena nabavka', text: 'Koristite ranije narudžbe i sačuvane liste kao osnovu za novi upit.', snippet: 'repeat' },
] as const

export const SECONDARY = [
  { title: 'Više korisnika u firmi', text: 'Nabavka, poslovođe i računovodstvo, svako sa svojim pristupom.' },
  { title: 'Po gradilištima', text: 'Upiti i narudžbe razvrstani po mjestu isporuke.' },
  { title: 'Dokumenti uz narudžbe', text: 'Ponude, otpremnice i fakture na jednom mjestu.' },
] as const

export const JOURNEY = [
  { no: '01', title: 'Odaberite materijal', text: 'Pretražite po šifri ili nazivu, ili krenite od grupe materijala.', detail: 'pick', view: 'materijali' },
  { no: '02', title: 'Pošaljite upit', text: 'Više artikala u jednom upitu, za izabrano gradilište.', detail: 'send', view: 'materijali' },
  { no: '03', title: 'Pregledajte i potvrdite ponudu', text: 'Prodaja priprema ponudu sa stavkama i rokom važenja.', detail: 'offer', view: 'ponude' },
  { no: '04', title: 'Pratite narudžbu', text: 'Status i dogovorena dostava ili preuzimanje na stovarištu.', detail: 'track', view: 'narudzbe' },
] as const

// Ko kupuje. Prikaz kao "Šta gradite?" na početnoj: linijski crtež posla umjesto fotografije.
export const AUDIENCES: { label: string; art: 'zidanje-krov' | 'suha-gradnja' | 'izolacija'; title: string; text: string; points: readonly string[]; image: string; alt: string }[] = [
  {
    label: 'Izvođači',
    art: 'zidanje-krov',
    title: 'Građevinske firme i izvođači',
    text: 'Materijal za više gradilišta na jednom nalogu, po fazama radova.',
    points: ['Narudžbe po gradilištu', 'Planirana isporuka na adresu objekta'],
    image: '/editorial/firme/skele.webp',
    alt: 'Fasadna skela uz stambenu zgradu u izgradnji',
  },
  {
    label: 'Podizvođači',
    art: 'suha-gradnja',
    title: 'Specijalizovani podizvođači',
    text: 'Suha gradnja, izolacija i građevinska hemija za radove koji se ponavljaju.',
    points: ['Sačuvane liste za tipske radove', 'Preuzimanje na stovarištu'],
    image: '/editorial/firme/majstor.webp',
    alt: 'Radnik, okrenut leđima, oblaže zid od gips-kartonskih ploča',
  },
  {
    label: 'Investitori',
    art: 'izolacija',
    title: 'Investitori i nosioci projekata',
    text: 'Objedinjena ponuda za objekat i uvid u to šta je naručeno i isporučeno.',
    points: ['Objedinjene ponude', 'Dokumenti uz svaku narudžbu'],
    image: '/stock/house-scaffold.webp',
    alt: 'Kuća u izgradnji sa skelom',
  },
]

export const BENEFITS = [
  { title: 'Ponavljanje nabavke', text: 'Prošla narudžba ili lista postaje novi upit.' },
  { title: 'Narudžba po gradilištu', text: 'Svaki upit vezan za mjesto isporuke.' },
  { title: 'Objedinjene ponude', text: 'Više artikala, jedna ponuda prodaje.' },
  { title: 'Planirana isporuka', text: 'Dostava ili preuzimanje po dogovoru.' },
] as const
// Uvodni koraci: kako firma koristi usluge preko portala, tri koraka. Svaki ima animiranu UI scenu
// (PartnerSteps / StepDemos): prijava, narudžba po šifri, ponuda i isporuka. Isti tok kao ACCESS_STEPS.
export type IntroDemo = 'login' | 'order' | 'track'
export const PORTAL_INTRO_STEPS: { demo: IntroDemo; title: string; text: string; points: string[] }[] = [
  {
    demo: 'login',
    title: 'Prijavite se na nalog firme',
    text: 'Nalog firme otvara prodaja Grand Company-ja. Poslije prijave odmah vidite svoj dashboard: kreditni okvir, narudžbe u toku i brzi unos šifre.',
    points: ['Bez reklama, samo vaša nabavka', 'Pristup sa računara i telefona'],
  },
  {
    demo: 'order',
    title: 'Naručite po šifri',
    text: 'Šifra, Tab, količina, Enter, i već ste u novom redu. Predmjer radova iz Excela ili CSV prevucite u tabelu. Upit ide pravo prodaji.',
    points: ['Šifra se provjerava odmah', 'Nepoznate šifre označene crveno'],
  },
  {
    demo: 'track',
    title: 'Pratite ponudu i isporuku',
    text: 'Prodaja šalje ponudu, vi je prihvatate, a narudžbu pratite do statusa „Na putu ka gradilištu“ ili „Spremno za preuzimanje“.',
    points: ['Termin isporuke na gradilište', 'Fakture i otpremnice na jednom mjestu'],
  },
]


// ——— English (additive): parallel arrays, same order as the Serbian ones above. ———
export const CAPABILITIES_EN: { title: string; text: string }[] = [
  { title: 'Business account', text: 'One view of your company’s inquiries, offers and orders.' },
  { title: 'Fast material ordering', text: 'Pick items, enter quantities and send one inquiry for several products at once.' },
  { title: 'Offers in one place', text: 'Review offers from sales, check the line items and confirm the right one.' },
  { title: 'Orders and deliveries', text: 'Check order status and the available details on agreed delivery or collection.' },
  { title: 'Repeat purchasing', text: 'Use earlier orders and saved lists as the starting point for a new inquiry.' },
]
export const SECONDARY_EN: { title: string; text: string }[] = [
  { title: 'Multiple users per company', text: 'Procurement, site supervisors and accounting, each with their own access.' },
  { title: 'By construction site', text: 'Inquiries and orders sorted by delivery location.' },
  { title: 'Documents with orders', text: 'Offers, delivery notes and invoices in one place.' },
]
export const JOURNEY_EN: { title: string; text: string }[] = [
  { title: 'Choose materials', text: 'Search by code or name, or start from a material group.' },
  { title: 'Send an inquiry', text: 'Several items in one inquiry, for the selected construction site.' },
  { title: 'Review and confirm the offer', text: 'Sales prepares an offer with line items and a validity period.' },
  { title: 'Track the order', text: 'Status and agreed delivery, or collection at the yard.' },
]
export const AUDIENCES_EN: { label: string; title: string; text: string; points: string[]; alt: string }[] = [
  {
    label: 'Contractors',
    title: 'Construction companies and contractors',
    text: 'Materials for multiple sites on a single account, organised by construction phase.',
    points: ['Orders per construction site', 'Scheduled delivery to the site address'],
    alt: 'Facade scaffolding beside a residential building under construction',
  },
  {
    label: 'Subcontractors',
    title: 'Specialist subcontractors',
    text: 'Drywall, insulation and construction chemicals for recurring work.',
    points: ['Saved lists for standard jobs', 'Collection at the yard'],
    alt: 'A worker, seen from behind, lining a wall with plasterboard',
  },
  {
    label: 'Investors',
    title: 'Investors and project owners',
    text: 'A consolidated offer per building and a clear view of what was ordered and delivered.',
    points: ['Consolidated offers', 'Documents with every order'],
    alt: 'House under construction with scaffolding',
  },
]
export const BENEFITS_EN: { title: string; text: string }[] = [
  { title: 'Repeat purchasing', text: 'A past order or list becomes a new inquiry.' },
  { title: 'Orders per site', text: 'Every inquiry tied to a delivery location.' },
  { title: 'Consolidated offers', text: 'Multiple items, one offer from sales.' },
  { title: 'Scheduled delivery', text: 'Delivery or collection as agreed.' },
]
export const PORTAL_INTRO_STEPS_EN: { title: string; text: string; points: string[] }[] = [
  {
    title: 'Sign in to your company account',
    text: 'Your company account is opened by Grand Company sales. After signing in you see your dashboard right away: credit limit, orders in progress and quick code entry.',
    points: ['No ads, just your procurement', 'Access from computer and phone'],
  },
  {
    title: 'Order by code',
    text: 'Code, Tab, quantity, Enter, and you are on a new line. Drag a bill of quantities from Excel or CSV into the table. The inquiry goes straight to sales.',
    points: ['Codes are checked instantly', 'Unknown codes are marked in red'],
  },
  {
    title: 'Track the offer and delivery',
    text: 'Sales sends an offer, you accept it, and you follow the order through to “On the way to the site” or “Ready for collection”.',
    points: ['Delivery slot at the construction site', 'Invoices and delivery notes in one place'],
  },
]
