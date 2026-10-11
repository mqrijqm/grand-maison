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
}

const WB = 'https://www.wienerberger.ba/alati-i-servisi'

export const CALC_GROUPS: { id: ManufacturerCalc['group']; label: string; brand: string }[] = [
  { id: 'krov', label: 'Krov', brand: 'Tondach' },
  { id: 'zid', label: 'Zid', brand: 'Porotherm' },
]

export const MANUFACTURER_CALCS: ManufacturerCalc[] = [
  {
    id: 'tondach-jednostresni',
    group: 'krov',
    title: 'Kalkulator za Tondach jednostrešni krov',
    text: 'Izračun Tondach materijala za krov sa jednom kosinom.',
    href: `${WB}/alati-za-krov/kalkulatori/kalkulator-za-tondach-jednostresni-krov.html`,
    art: 'roof-mono',
    image: '/calculators/roof-mono.webp',
  },
  {
    id: 'tondach-dvostresni',
    group: 'krov',
    title: 'Kalkulator za Tondach dvostrešni krov',
    text: 'Izračun Tondach materijala za krov sa dvije kosine.',
    href: `${WB}/alati-za-krov/kalkulatori/kalkulator-za-tondach-dvostresni-krov.html`,
    art: 'roof-gable',
    image: '/calculators/roof-gable.webp',
  },
  {
    id: 'porotherm-u-vrijednost',
    group: 'zid',
    title: 'Izračun U-vrijednosti zida',
    text: 'Provjerite toplotne karakteristike zida od Porotherm opeke.',
    href: `${WB}/alati-za-zid/kalkulatori/wienerberger-kalkulator-za-izracun-U-vrijednost-zida.html`,
    art: 'u-value',
    image: '/calculators/u-value.webp',
  },
  {
    id: 'wienerberger-izracun-materijala',
    group: 'zid',
    title: 'Besplatan izračun materijala',
    text: 'Pošaljite podatke o objektu, a Wienerberger besplatno računa količinu za Tondach krov i Porotherm zid.',
    href: `${WB}/alati-za-zid/kalkulatori/narucite-besplatni-izracun-materijala.html`,
    art: 'order',
    image: '/calculators/order.webp',
  },
]
