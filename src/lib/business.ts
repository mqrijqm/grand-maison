import type { ViewId } from '@/components/portal/views'

// Sadržaj za /za-firme — glavna B2B stranica (faza "Grand Company Business", research 12.19).
// Portal je demo: izmišljena firma i podaci. Individualne cijene, rabat, odgođeno plaćanje i ERP
// veza NISU potvrđeni (research nivo C), pa stoje samo kao "predloženo nakon dogovora".

// Dashboard korak po korak: svaki korak prebaci dashboard na svoj ekran i zumira na bitan dio.
export type PortalStep = { view: ViewId; focus?: string; title: string; text: string; points: string[] }

// Uvodni koraci: kako firma koristi usluge preko portala, tri koraka. Svaki ima animiranu UI scenu
// (PartnerSteps / StepDemos): prijava, narudžba po šifri, ponuda i isporuka. Isti tok kao ACCESS_STEPS.
export type IntroDemo = 'login' | 'order' | 'track'
export const PORTAL_INTRO_STEPS: { demo: IntroDemo; title: string; text: string; points: string[] }[] = [
  {
    demo: 'login',
    title: 'Prijavite se na nalog firme',
    text: 'Nalog firme otvara prodaja Grand Company-ja. Prijavljujete se poslovnim mejlom, a kolege dobijaju svoje pristupe.',
    points: ['Jedan nalog za cijelu firmu', 'Pristup sa računara i telefona'],
  },
  {
    demo: 'order',
    title: 'Naručite po šifri',
    text: 'Upišite šifru i količinu, red po red, ili zalijepite tabelu iz Excela. Upit ide pravo prodaji.',
    points: ['Šifra se provjerava odmah', 'Sačuvane liste na jedan klik'],
  },
  {
    demo: 'track',
    title: 'Pratite ponudu i isporuku',
    text: 'Prodaja šalje ponudu, vi je prihvatate, a narudžbu pratite kroz status do termina dostave ili preuzimanja.',
    points: ['Termin isporuke na gradilište', 'Dokumenti na jednom mjestu'],
  },
]

export const PORTAL_STEPS: PortalStep[] = [
  {
    view: 'pregled',
    focus: 'credit',
    title: 'Kreditni okvir',
    text: 'Poslije prijave dočekuje vas vaš dashboard, ne reklame. Gore lijevo: odobreni limit, otvorene fakture, narudžbe u obradi i koliko je još dostupno za nabavku.',
    points: ['Bez poziva računovodstvu radi salda', 'Demo uslovi, stvarni po ugovoru'],
  },
  {
    view: 'pregled',
    focus: 'live-orders',
    title: 'Narudžbe u toku',
    text: 'Šta je u pripremi, šta je spremno za preuzimanje na stovarištu, a šta je na putu ka gradilištu, sa terminom.',
    points: ['Za poslovođe koji koordiniraju majstore', 'Klik vodi na narudžbu'],
  },
  {
    view: 'pregled',
    focus: 'quick-add',
    title: 'Brzi unos',
    text: 'Poznata šifra, količina i jedinica, pa u korpu, bez napuštanja početnog ekrana.',
    points: ['Ploča, m² ili paleta', 'Vaša neto cijena odmah'],
  },
  {
    view: 'pregled',
    focus: 'recent',
    title: 'Ponovite kupovinu',
    text: 'Posljednjih pet isporučenih narudžbi i šeme materijala, npr. „Standardna adaptacija kupatila“, ulaze u korpu jednim klikom, po današnjim cijenama.',
    points: ['Ponovi narudžbu', 'Šema materijala u korpu'],
  },
  {
    view: 'katalog',
    focus: 'catalog-table',
    title: 'Katalog za profesionalce',
    text: 'Tabela umjesto velikih slika: naziv, šifra, vaša cijena po jedinici, izbor jedinice mjere, zaliha i količina. Filteri po dužini, debljini i limu.',
    points: ['Pretraga razumije „rigips“, „kamenka“, „šrafovi“', 'Tehnički list na klik'],
  },
  {
    view: 'brza',
    focus: 'qo-table',
    title: 'Brza narudžba po šifri',
    text: 'Šifra, Tab, količina, Enter, i već ste u novom redu. Predmjer radova iz Excela ili CSV prevucite u tabelu.',
    points: ['Šifre koje nisu u asortimanu označene crveno', 'Skener barkoda sa ambalaže (demo)'],
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
    view: 'pregled',
    focus: 'docs-center',
    title: 'Dokumenti i odobrenja',
    text: 'Fakture, otpremnice i tehnički listovi kupljenih artikala, a pored njih zahtjevi poslovođa sa terena koji čekaju vaše odobrenje.',
    points: ['Računovodstvo vidi dokumente bez naručivanja', 'Odobren zahtjev ide pravo u korpu'],
  },
  {
    view: 'gradilista',
    focus: 'sites-compare',
    title: 'Gradilišta',
    text: 'U zaglavlju birate aktivno gradilište: mijenja se adresa isporuke i, gdje je dogovoreno, projektne cijene. Ovdje je nabavka po projektu u odnosu na plan.',
    points: ['Više gradilišta na jednom nalogu', 'Naručivanje direktno za gradilište'],
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
