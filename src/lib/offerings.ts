// Programski ulazi. Fotografije su ilustracije materijala, ne dokaz zaliha ili opreme firme.
// Širi program vodi na postojeći pregled ili upit dok konkretne artikle firma ne potvrdi.
export const OFFERINGS = [
  {
    id: 'suha-gradnja', name: 'Suha gradnja',
    keywords: ['Ploče', 'Profili', 'Pribor'],
    description: 'Ploče, profili i pribor za pregradne zidove, plafone i oblaganje.',
    image: '/editorial/programs/suha-gradnja.webp',
    alt: 'Složene gipsane ploče i pocinčani profili — ilustracija programa suhe gradnje',
    href: '/prodavnica?kategorija=suha-gradnja', cta: 'Pogledajte suhu gradnju', mode: 'Katalog',
  },
  {
    id: 'izolacija', name: 'Izolacija',
    keywords: ['Toplota', 'Zvuk', 'Namjena'],
    description: 'Materijali za toplotnu i zvučnu izolaciju, prema mjestu ugradnje.',
    image: '/editorial/programs/izolacija.webp',
    alt: 'Ploče kamene vune s vidljivim vlaknima — ilustracija izolacionih materijala',
    href: '/prodavnica?kategorija=izolacija', cta: 'Pogledajte izolaciju', mode: 'Katalog',
  },
  {
    id: 'zidni-krovni', name: 'Zidni i krovni program',
    keywords: ['Program', 'Količine', 'Specifikacija'],
    description: 'Pošaljite specifikaciju za provjeru programa i dostupnosti.',
    image: '/editorial/programs/zidni-krovni.webp',
    alt: 'Opeka i glineni crijep — ilustracija zidnog i krovnog programa',
    href: '/upit-za-izvodjace?program=zidni-krovni', cta: 'Pošaljite specifikaciju', mode: 'Po upitu',
  },
  {
    id: 'veziva', name: 'Građevinska hemija i veziva',
    keywords: ['Ljepila', 'Mase', 'Veziva'],
    description: 'Ljepila, mase i veziva za pripremu, povezivanje i završnu obradu.',
    image: '/editorial/programs/veziva.webp',
    alt: 'Vreće veziva, uzorak maltera i gleterica — ilustracija građevinske hemije',
    href: '/prodavnica?kategorija=veziva', cta: 'Pogledajte hemiju i veziva', mode: 'Katalog',
  },
  {
    id: 'drvni-program', name: 'Drvni program',
    keywords: ['Materijal', 'Dimenzije', 'Količine'],
    description: 'Pregled programa i upit za materijal, dimenzije i potrebne količine.',
    image: '/editorial/programs/drvni-program.webp',
    alt: 'Složene drvene grede i daske — ilustracija drvnog programa',
    href: '/prodavnica#program-drvo', cta: 'Pogledajte drvni program', mode: 'Po upitu',
  },
  {
    id: 'sanitarna-oprema', name: 'Sanitarna oprema',
    keywords: ['Program', 'Prostor', 'Ponuda'],
    description: 'Pregled sanitarnog programa i ponuda prema potrebama prostora.',
    image: '/editorial/programs/sanitarna-oprema.webp',
    alt: 'Bijela sanitarna keramika i hromirana slavina — ilustracija sanitarnog programa',
    href: '/prodavnica#program-sanitarije', cta: 'Pogledajte sanitarni program', mode: 'Po upitu',
  },
] as const
