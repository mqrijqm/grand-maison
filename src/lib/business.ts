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

// Ko kupuje. Fotografije su ilustrativne, sa gradilišta i radova (vidi /stock/credits.json).
export const AUDIENCES = [
  {
    title: 'Građevinske firme i izvođači',
    text: 'Materijal za više gradilišta na jednom nalogu, po fazama radova.',
    points: ['Narudžbe po gradilištu', 'Planirana isporuka na adresu objekta'],
    image: '/editorial/firme/skele.webp',
    alt: 'Fasadna skela uz stambenu zgradu u izgradnji',
  },
  {
    title: 'Majstori i specijalizovani podizvođači',
    text: 'Suha gradnja, izolacija i građevinska hemija za radove koji se ponavljaju.',
    points: ['Sačuvane liste za tipske radove', 'Preuzimanje na stovarištu'],
    image: '/editorial/firme/majstor.webp',
    alt: 'Majstor, okrenut leđima, oblaže zid od gips-kartonskih ploča',
  },
  {
    title: 'Investitori i nosioci projekata',
    text: 'Objedinjena ponuda za objekat i uvid u to šta je naručeno i isporučeno.',
    points: ['Objedinjene ponude', 'Dokumenti uz svaku narudžbu'],
    image: '/stock/house-scaffold.webp',
    alt: 'Kuća u izgradnji sa skelom',
  },
] as const

export const BENEFITS = [
  { title: 'Ponavljanje nabavke', text: 'Prošla narudžba ili lista postaje novi upit.' },
  { title: 'Narudžba po gradilištu', text: 'Svaki upit vezan za mjesto isporuke.' },
  { title: 'Objedinjene ponude', text: 'Više artikala, jedna ponuda prodaje.' },
  { title: 'Planirana isporuka', text: 'Dostava ili preuzimanje po dogovoru.' },
] as const
