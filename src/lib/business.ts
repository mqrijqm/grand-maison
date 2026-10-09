import type { ViewId } from '@/components/portal/views'

// Sadržaj za /za-firme — glavna B2B stranica (faza "Grand Company Business", research 12.19).
// Portal je demo: izmišljena firma i podaci. Individualne cijene, rabat, odgođeno plaćanje i ERP
// veza NISU potvrđeni (research nivo C), pa stoje samo kao "predloženo nakon dogovora".

// Dashboard korak po korak: svaki korak prebaci dashboard na svoj ekran i zumira na bitan dio.
export const PORTAL_STEPS: { view: ViewId; focus?: string; title: string; text: string; points: string[] }[] = [
  {
    view: 'pregled',
    focus: 'chart',
    title: 'Pregled nabavke',
    text: 'Prvi ekran poslije prijave: koliko je firma nabavila ovaj mjesec, otvorene ponude, aktivne narudžbe i isporuke ove sedmice.',
    points: ['Klik na brojku otvara grafikon za 30 dana', 'Poređenje sa prošlim periodom', 'Nabavka po kategoriji materijala'],
  },
  {
    view: 'pregled',
    focus: 'feed',
    title: 'Uživo',
    text: 'Sve što se desi na nalogu firme stiže u jedan tok: nova ponuda, potvrđena narudžba, zakazana isporuka, nova faktura.',
    points: ['Bez traženja po mejlovima', 'Klik vodi pravo na ponudu ili narudžbu'],
  },
  {
    view: 'brza',
    focus: 'qo-table',
    title: 'Brza narudžba po šifri',
    text: 'Za one koji znaju šta im treba: šifra i količina, red po red, ili cijela tabela zalijepljena iz Excela.',
    points: ['Šifra se provjerava odmah', 'Često naručivani artikli na jedan klik', 'Sve ide u upit, ponudu potvrđuje prodaja'],
  },
  {
    view: 'ponude',
    focus: 'quote-detail',
    title: 'Ponude',
    text: 'Ponude koje je prodaja pripremila po vašim upitima, sa stavkama, rokom važenja i statusom.',
    points: ['Prihvatite ponudu jednim klikom', 'Izmijenite stavke prije potvrde'],
  },
  {
    view: 'narudzbe',
    focus: 'order-detail',
    title: 'Narudžbe',
    text: 'Svaka narudžba ima status od prijema do isporuke, termin i način preuzimanja.',
    points: ['Pet koraka: primljena, potvrđena, u pripremi, spremna, isporučena', 'Ponovite staru narudžbu jednim klikom'],
  },
  {
    view: 'isporuke',
    title: 'Isporuke i preuzimanja',
    text: 'Sedmični kalendar: šta stiže na koje gradilište i šta se preuzima na stovarištu, po terminima.',
    points: ['Dostava i preuzimanje odvojeno označeni', 'Radno vrijeme stovarišta u kalendaru'],
  },
  {
    view: 'gradilista',
    focus: 'sites-compare',
    title: 'Gradilišta',
    text: 'Nabavka po projektu: koliko je nabavljeno u odnosu na plan, faza radova i sljedeći termin.',
    points: ['Više gradilišta na jednom nalogu', 'Naručivanje direktno za gradilište'],
  },
  {
    view: 'liste',
    title: 'Sačuvane liste',
    text: 'Liste iz kalkulatora materijala i ranijih narudžbi, spremne za novi upit kad krene sljedeći stan ili sprat.',
    points: ['Iz kalkulatora pravo u listu', 'Lista u brzu narudžbu jednim klikom'],
  },
  {
    view: 'dokumenti',
    title: 'Dokumenti',
    text: 'Fakture, otpremnice, ponude i tehnički listovi na jednom mjestu, sa pretragom i preuzimanjem.',
    points: ['Filter po vrsti dokumenta', 'Računovodstvo vidi dokumente bez naručivanja'],
  },
  {
    view: 'tim',
    focus: 'approvals',
    title: 'Tim i odobrenja',
    text: 'Više korisnika na nalogu firme, svako sa svojim pravima. Poslovođe šalju zahtjeve za materijal, nabavka ih odobrava.',
    points: ['Uloge: nabavka, poslovođa, računovodstvo', 'Odobren zahtjev ide pravo u upit'],
  },
]

// Šta dobija firma s nalogom.
export const B2B_FEATURES = [
  { title: 'Nalog firme', text: 'Jedan nalog za cijelu firmu, sa više korisnika i pravima po ulozi.' },
  { title: 'Brza narudžba', text: 'Šifre i količine, ili tabela iz Excela. Bez listanja kataloga.' },
  { title: 'Ponude online', text: 'Sve ponude prodaje na jednom mjestu, sa rokom važenja i prihvatanjem.' },
  { title: 'Praćenje narudžbi', text: 'Status svake narudžbe i termin isporuke ili preuzimanja.' },
  { title: 'Po gradilištu', text: 'Nabavka, narudžbe i termini razdvojeni po projektima.' },
  { title: 'Ponovi narudžbu', text: 'Stara narudžba ili sačuvana lista u novi upit jednim klikom.' },
  { title: 'Kalkulator u listu', text: 'Proračun zida iz kalkulatora postaje lista za naručivanje.' },
  { title: 'Dokumenti', text: 'Fakture, otpremnice i tehnički listovi, spremni za preuzimanje.' },
  { title: 'Odobrenja', text: 'Poslovođa traži materijal, nabavka odobrava prije slanja.' },
] as const

// Predloženo: zavisi od dogovora sa Grand Company-jem (nije postojeći uslov).
export const B2B_PROPOSED = [
  { title: 'Individualne cijene i rabat', text: 'Ugovorene cijene vidljive na nalogu firme, kada ih prodaja dogovori.' },
  { title: 'Odgođeno plaćanje', text: 'Valuta i okvir za plaćanje po ugovoru, sa pregledom otvorenih računa.' },
  { title: 'Veza sa ERP-om', text: 'Artikli, zalihe i cijene iz postojećeg sistema Grand Company-ja, bez ručnog unosa.' },
] as const

// Ko kupuje. Fotografije su ilustrativne (Pexels), osim gdje je navedeno stovarište.
export const AUDIENCES = [
  {
    title: 'Građevinske firme i izvođači',
    text: 'Materijal za cijelo gradilište na jednom nalogu, po fazama radova.',
    image: '/editorial/firme/skele.webp',
    alt: 'Fasadna skela uz stambenu zgradu u izgradnji',
  },
  {
    title: 'Majstori i zanatske radnje',
    text: 'Suha gradnja, kamena vuna i građevinska hemija za unutrašnje radove.',
    image: '/editorial/firme/majstor.webp',
    alt: 'Majstor, okrenut leđima, oblaže zid od gips-kartonskih ploča',
  },
  {
    title: 'Investitori i stambena gradnja',
    text: 'Od zidova i krova do završne obrade, uz ponudu za cijeli objekat.',
    image: '/stock/house-scaffold.webp',
    alt: 'Kuća u izgradnji sa skelom',
  },
  {
    title: 'Javne ustanove i održavanje',
    text: 'Građevinski materijal za održavanje objekata.',
    image: '/editorial/firme/javni-objekat.webp',
    alt: 'Fasada javnog objekta',
  },
] as const

// Kako firma dobija nalog.
export const ACCESS_STEPS = [
  { title: 'Zahtjev', text: 'Pošaljite naziv firme, kontakt i šta najčešće nabavljate.' },
  { title: 'Razgovor', text: 'Prodaja provjerava program, količine i način saradnje.' },
  { title: 'Nalog', text: 'Otvaramo nalog firme i korisnike: nabavku, poslovođe, računovodstvo.' },
  { title: 'Naručivanje', text: 'Naručujete sami, a prodaja potvrđuje ponude i termine.' },
] as const

export const PHASES = [
  { n: 'Faza 1', t: 'Grand Company Digital', d: 'Sajt, katalog, pretraga, kalkulator materijala, upit za ponudu.' },
  { n: 'Faza 2', t: 'Grand Company Business', d: 'B2B portal: nalog firme, brza narudžba, ponude, narudžbe, dokumenti, tim.', on: true },
  { n: 'Faza 3', t: 'Grand Company Connected', d: 'Veza sa postojećim ERP i skladišnim sistemom: artikli, zalihe i cijene bez ručnog unosa.' },
] as const
