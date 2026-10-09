// Sadržaj za firme (početna + /za-firme). Izvor: verifikovani research 2026-09-17.
// Javne nabavke (2015, 2025) su potvrđene u Akta registru; rabati, krediti i ERP NISU potvrđeni,
// pa se pominju samo kao "po dogovoru s prodajom", nikad kao postojeći uslov.

export const BUSINESS_OFFERS = [
  {
    title: 'Ponuda prema vašem projektu',
    text: 'Opišite šta gradite ili navedite šifre i količine. Prodaja provjerava program i dostupnost i šalje vam ponudu.',
  },
  {
    title: 'Nabavka za projekat',
    text: 'Lokacija, rok i faze radova na jednom upitu. Preuzimanje na stovarištu ili dostava po dogovoru.',
  },
] as const

export const BUSINESS_FACTS = [
  { value: '209.290 KM', label: 'Okvirni sporazum za građevinski materijal, 2015.' },
  { value: '2025', label: 'Direktni sporazum, JU Sportski centar Borik' },
] as const

// Ko kupuje. Fotografije su ilustrativne (Pexels), osim gdje je navedeno stovarište.
export const AUDIENCES = [
  {
    title: 'Građevinske firme i izvođači',
    text: 'Materijal za cijelo gradilište na jednom upitu, po fazama radova.',
    image: '/editorial/firme/skele.webp',
    alt: 'Radnici na skeli zgrade u izgradnji',
  },
  {
    title: 'Majstori i zanatske radnje',
    text: 'Suha gradnja, kamena vuna i građevinska hemija za unutrašnje radove.',
    image: '/photos/taping.webp',
    alt: 'Majstor obrađuje spojeve gips-kartonskih ploča na plafonu',
  },
  {
    title: 'Investitori i stambena gradnja',
    text: 'Od zidova i krova do završne obrade, uz ponudu za cijeli objekat.',
    image: '/stock/house-scaffold.webp',
    alt: 'Kuća u izgradnji sa skelom',
  },
  {
    title: 'Javne ustanove i održavanje',
    text: 'Građevinski materijal za održavanje objekata, kroz javne nabavke i direktne sporazume.',
    image: '/editorial/firme/javni-objekat.webp',
    alt: 'Fasada javnog objekta',
  },
] as const

export const BUSINESS_STEPS = [
  { title: 'Upit', text: 'Šta gradite, šifre ili opis, količine, adresa i rok.' },
  { title: 'Ponuda', text: 'Prodaja provjerava program, količine i dostupnost.' },
  { title: 'Potvrda', text: 'Potvrdite ponudu; dogovaramo termin preuzimanja ili dostave.' },
  { title: 'Isporuka', text: 'Preuzimanje na stovarištu ili dostava na adresu u gradu.' },
] as const

// Javne nabavke — javno objavljene dodjele ugovora (Akta.ba).
export const TENDERS = [
  {
    year: '2015',
    title: 'Okvirni sporazum za građevinski materijal',
    detail: 'Najuspješniji ponuđač · 209.290,20 KM bez PDV-a',
  },
  {
    year: '2025',
    title: 'Građevinski materijal za održavanje objekata',
    detail: 'Direktni sporazum · JU Sportski centar Borik, Banja Luka',
  },
] as const
