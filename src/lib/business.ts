import { COMPANY as GC } from '@/gc/gc'

// Sadržaj za firme (početna + /za-firme). Izvor: verifikovani research 2026-09-17.
// Javne nabavke (2015, 2025) su potvrđene u Akta registru; rabati, krediti i ERP NISU potvrđeni,
// pa se pominju samo kao "po dogovoru s prodajom", nikad kao postojeći uslov.

export const BUSINESS_OFFERS = [
  {
    title: 'Ponuda po vašem spisku',
    text: 'Pošaljite šifre ili opis materijala i količine. Prodaja provjerava program i dostupnost i šalje vam ponudu.',
  },
  {
    title: 'Nabavka za projekat',
    text: 'Lokacija gradilišta, rok i faze radova na jednom upitu, sa preuzimanjem ili dostavom po dogovoru.',
  },
  {
    title: 'Redovna saradnja',
    text: 'Za firme koje stalno grade: cijene, plaćanje i dostavu dogovarate direktno s prodajom.',
  },
] as const

export const BUSINESS_FACTS = [
  { value: String(GC.founded), label: 'Godina osnivanja' },
  { value: '6', label: 'Programa materijala' },
  { value: '2015\n2025', label: 'Ugovori iz javnih nabavki' },
] as const

// Ko kupuje. Fotografije su ilustrativne (Pexels), osim gdje je navedeno stovarište.
export const AUDIENCES = [
  {
    title: 'Građevinske firme i izvođači',
    text: 'Materijal za cijelo gradilište na jednom spisku, po fazama radova.',
    image: '/editorial/firme/skele.webp',
    alt: 'Radnici na skeli zgrade u izgradnji',
  },
  {
    title: 'Majstori i zanatske radnje',
    text: 'Suha gradnja, izolacija i fasade: ploče, profili, vuna, ljepila i mase.',
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
  { title: 'Spisak', text: 'Šifre ili opis, količine, adresa gradilišta i rok.' },
  { title: 'Ponuda', text: 'Prodaja provjerava program, količine i dostupnost.' },
  { title: 'Potvrda', text: 'Potvrdite ponudu; dogovaramo termin preuzimanja ili dostave.' },
  { title: 'Isporuka', text: 'Preuzimanje na stovarištu ili dostava na gradilište.' },
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
