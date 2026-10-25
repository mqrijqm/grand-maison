// Kalkulatori proizvođača čije proizvode Grand Company prodaje (prodajno mjesto prema javnim listama
// prodajnih mjesta Wienerbergera). Nazivi su sa stranica proizvođača (provjereno 2026-10-11):
//   https://www.wienerberger.ba/alati-i-servisi/alati-za-krov/kalkulatori.html
//   https://www.wienerberger.ba/alati-i-servisi/alati-za-zid/kalkulatori.html
// Opisi su naši. Samo link na njihov sajt: bez iframe-a, bez njihovog koda, slika i logotipa.
// Kalkulator za analizu cijene vanjskih zidova je namjerno izostavljen (na njihovom sajtu ne radi ispravno).

export type CalcArt = 'roof-mono' | 'roof-gable' | 'u-value' | 'order'

export type ManufacturerCalc = {
  id: string
  group: 'krov' | 'zid'
  title: string
  text: string
  href: string
  art: CalcArt
  /** Prava fotografija izbliza (Pexels, izvor u public/stock/credits.json), Codex: crop i ton. */
  image: string
  /** English parallel text (additive) */
  titleEn?: string
  textEn?: string
}

const WB = 'https://www.wienerberger.ba/alati-i-servisi'

export const CALC_GROUPS: { id: ManufacturerCalc['group']; label: string; labelEn: string; brand: string }[] = [
  { id: 'krov', label: 'Krov', labelEn: 'Roof', brand: 'Tondach' },
  { id: 'zid', label: 'Zid', labelEn: 'Wall', brand: 'Porotherm' },
]

export const MANUFACTURER_CALCS: ManufacturerCalc[] = [
  {
    id: 'tondach-jednostresni',
    group: 'krov',
    title: 'Kalkulator za Tondach jednostrešni krov',
    text: 'Izračun Tondach materijala za krov sa jednom kosinom.',
    titleEn: 'Tondach mono-pitch roof calculator',
    textEn: 'Calculate the Tondach material for a roof with a single slope.',
    href: `${WB}/alati-za-krov/kalkulatori/kalkulator-za-tondach-jednostresni-krov.html`,
    art: 'roof-mono',
    image: '/calculators/roof-mono.webp',
  },
  {
    id: 'tondach-dvostresni',
    group: 'krov',
    title: 'Kalkulator za Tondach dvostrešni krov',
    text: 'Izračun Tondach materijala za krov sa dvije kosine.',
    titleEn: 'Tondach gable roof calculator',
    textEn: 'Calculate the Tondach material for a roof with two slopes.',
    href: `${WB}/alati-za-krov/kalkulatori/kalkulator-za-tondach-dvostresni-krov.html`,
    art: 'roof-gable',
    image: '/calculators/roof-gable.webp',
  },
  {
    id: 'porotherm-u-vrijednost',
    group: 'zid',
    title: 'Izračun U-vrijednosti zida',
    text: 'Provjerite toplotne karakteristike zida od Porotherm opeke.',
    titleEn: 'Wall U-value calculation',
    textEn: 'Check the thermal performance of a Porotherm clay block wall.',
    href: `${WB}/alati-za-zid/kalkulatori/wienerberger-kalkulator-za-izracun-U-vrijednost-zida.html`,
    art: 'u-value',
    image: '/calculators/u-value.webp',
  },
  {
    id: 'wienerberger-izracun-materijala',
    group: 'zid',
    title: 'Besplatan izračun materijala',
    text: 'Pošaljite podatke o objektu, a Wienerberger besplatno računa količinu za Tondach krov i Porotherm zid.',
    titleEn: 'Free material calculation',
    textEn: 'Send your building details and Wienerberger will calculate the quantities for a Tondach roof and a Porotherm wall free of charge.',
    href: `${WB}/alati-za-zid/kalkulatori/narucite-besplatni-izracun-materijala.html`,
    art: 'order',
    image: '/calculators/order.webp',
  },
]
