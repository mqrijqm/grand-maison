import type { PostArtKind } from '@/components/art/PostArt'
import { calcW111 } from './shop'

export type PostTag = 'Vodič' | 'Sistemi' | 'Isporuka' | 'Materijal'
export type Block =
  | { t: 'p'; text: string }
  | { t: 'h'; text: string }
  | { t: 'list'; items: string[] }
  | { t: 'spec'; rows: [string, string][] }
  | { t: 'note'; text: string }
export type Post = {
  slug: string
  title: string
  lead: string
  tag: PostTag
  date: string
  read: number
  art: PostArtKind
  body: Block[]
  skus?: string[]
}

export const POST_TAGS: PostTag[] = ['Vodič', 'Sistemi', 'Isporuka', 'Materijal']
export const postDate = (iso: string) => `${iso.split('-').reverse().join('.')}.`

const w111 = calcW111({
  L: 4,
  H: 2.5,
  cladding: 'single',
  plateSku: 'GKP-001',
  cwSku: 'PRF-075',
  woolSku: 'ISO-001',
  fillerSku: 'CHM-001',
})

export const POSTS: Post[] = [
  {
    slug: 'pregradni-zid-w111-korak-po-korak',
    title: 'Pregradni zid, korak po korak',
    lead: 'Redoslijed montaže standardnog zida sa jednom pločom sa svake strane.',
    tag: 'Sistemi',
    date: '2026-09-18',
    read: 7,
    art: 'wall-section',
    skus: ['GKP-001', 'PRF-075', 'PRF-UW75', 'ISO-001', 'ACC-001', 'ACC-003'],
    body: [
      { t: 'h', text: 'Prije montaže' },
      {
        t: 'p',
        text: 'Prenesite osu zida na pod, zidove i plafon. Provjerite instalacije i završnu visinu poda prije rezanja profila.',
      },
      { t: 'h', text: 'Potkonstrukcija' },
      {
        t: 'list',
        items: [
          'Na UW profil postavite zvučno-izolacionu traku.',
          'UW pričvrstite za pod i plafon, a CW profile postavite na osni razmak 62,5 cm.',
          'Otvor CW profila usmjerite na istu stranu; spoj ploča mora pasti na profil.',
        ],
      },
      { t: 'h', text: 'Obloga i ispuna' },
      {
        t: 'p',
        text: 'Prvu stranu obložite GKB pločama, provedite instalacije, zatim potpuno ispunite šupljinu kamenom vunom. '
          + 'Spojeve druge strane pomjerite u odnosu na prvu.',
      },
      {
        t: 'note',
        text: 'Ploče ne oslanjajte direktno na pod. Ostavite mali razmak i zatvorite ga prema zahtjevu sistema.',
      },
      {
        t: 'spec',
        rows: [
          ['Profil', 'CW 75 + UW 75'],
          ['Gotova debljina', '100 mm'],
        ],
      },
    ],
  },
  {
    slug: 'gkb-gkbi-gkf-ili-tvrda',
    title: 'GKB, GKBI ili GKF — koju ploču gdje',
    lead: 'Četiri ploče izgledaju slično, ali nisu zamjenjive u svakoj prostoriji.',
    tag: 'Materijal',
    date: '2026-08-26',
    read: 5,
    art: 'pallet',
    skus: ['GKP-001', 'GKP-002', 'GKP-003', 'GKP-004'],
    body: [
      { t: 'h', text: 'Birajte prema zahtjevu' },
      {
        t: 'p',
        text: 'GKB je standard za suhe prostorije. GKBI je impregnirana ploča za kupatila, kuhinje i vešernice. '
          + 'GKF se koristi kada sistem mora imati definisanu otpornost na požar, a tvrda ploča povećane čvrstoće kada su uz to važni udar, nosivost i zvuk.',
      },
      {
        t: 'spec',
        rows: [
          ['GKB', 'Standardni zidovi i plafoni'],
          ['GKBI', 'Prostorije sa povremenom vlagom'],
          ['GKF', 'Protivpožarne obloge'],
          ['Tvrda ploča', 'Čvrstoća, zvuk, vlaga i požar'],
        ],
      },
      {
        t: 'note',
        text: 'Sama ploča ne određuje klasu zida. Rezultat zavisi od kompletnog, ispitanog sistema i tačne montaže.',
      },
    ],
  },
  {
    slug: 'kamena-ili-staklena-vuna',
    title: 'Kamena vuna: zid i krov',
    lead: 'Gustoća, debljina i mjesto ugradnje određuju praktičan izbor.',
    tag: 'Materijal',
    date: '2026-07-21',
    read: 5,
    art: 'attic',
    skus: ['ISO-001', 'ISO-002'],
    body: [
      { t: 'h', text: 'Za pregradni zid' },
      {
        t: 'p',
        text: 'Polutvrda kamena vuna u pločama jednostavno se uklapa između CW profila i dobro prigušuje zvuk. '
          + 'Režite je malo šire od polja da ostane bez zazora.',
      },
      { t: 'h', text: 'Za kosi krov' },
      {
        t: 'p',
        text: 'Kamena vuna u pločama postavlja se između rogova, tijesno i bez zazora. '
          + 'Dva sloja sa pomjerenim spojevima smanjuju toplotne mostove.',
      },
      {
        t: 'list',
        items: [
          'Ne sabijajte vunu: sabijanjem gubi projektovanu debljinu.',
          'Popunite cijelo polje bez pukotina.',
          'Zaštitite materijal od kiše i trajne vlage.',
        ],
      },
    ],
  },
  {
    slug: 'obracun-materijala-za-10-m2-zida',
    title: 'Kako se obračunava materijal za 10 m² zida',
    lead: 'Primjer pregradnog zida 4 × 2,5 m (CW 75, jednostruka obloga), sa uračunatim otpadom.',
    tag: 'Vodič',
    date: '2026-05-19',
    read: 6,
    art: 'calculator',
    skus: w111.items.map((item) => item.sku),
    body: [
      { t: 'h', text: 'Ulazne mjere' },
      {
        t: 'p',
        text: 'Površina je dužina puta visina: 4 × 2,5 m = 10 m². '
          + 'Otvore treba obračunati prema stvarnom načinu oblaganja i ojačanjima oko njih.',
      },
      { t: 'h', text: 'Orijentaciona lista' },
      { t: 'spec', rows: w111.items.map((item) => [item.sku, `${item.need} — ${item.note}`]) },
      {
        t: 'note',
        text: 'Ovo je norma za zadati primjer, ne statički ni protivpožarni proračun. '
          + 'Konačnu količinu provjerite prema nacrtu i izabranom sistemu.',
      },
    ],
  },
  {
    slug: 'istovar-kranom-priprema-gradilista',
    title: 'Istovar na gradilištu: šta pripremiti',
    lead: 'Pet provjera prije dolaska kamiona štedi vrijeme i čuva materijal.',
    tag: 'Isporuka',
    date: '2026-04-15',
    read: 4,
    art: 'crane',
    body: [
      { t: 'h', text: 'Pristup i pozicija' },
      {
        t: 'list',
        items: [
          'Potvrdite širinu prilaza i nosivost podloge.',
          'Oslobodite mjesto za vozilo i istovar paleta.',
          'Provjerite kablove, grane, balkone i druge prepreke iznad vozila.',
          'Odredite ravnu, suhu podlogu za palete.',
          'Imenujte osobu koja preuzima robu i provjerava otpremnicu.',
        ],
      },
      {
        t: 'note',
        text: 'Roba se istovara na dogovoreno dostupno mjesto. Unutrašnji prenos i zaštitu materijala od vremena organizuje gradilište.',
      },
    ],
  },
  {
    slug: 'spusteni-plafon-na-cd-profilima',
    title: 'Spušteni plafon na CD profilima',
    lead: 'Osnovni redoslijed za potkonstrukciju od CD profila i ravnu oblogu.',
    tag: 'Sistemi',
    date: '2026-03-11',
    read: 6,
    art: 'ceiling-grid',
    skus: ['GKP-001', 'PRF-CD60', 'PRF-UD28', 'ACC-001', 'ACC-006'],
    body: [
      { t: 'h', text: 'Nivelacija' },
      {
        t: 'p',
        text: 'Laserom označite donju ravan plafona. UD profil postavite po obodu, uz odgovarajuću razdvojnu traku.',
      },
      { t: 'h', text: 'Rešetka i ovjesi' },
      {
        t: 'p',
        text: 'Direktne ovjese i CD profile rasporedite prema tehničkom listu sistema i masi obloge. '
          + 'Spojevi ploča moraju imati oslonac, a instalacije ne smiju opterećivati oblogu.',
      },
      {
        t: 'note',
        text: 'Rasponi i razmaci zavise od klase sistema, broja slojeva i dodatnog opterećenja. '
          + 'Prije montaže provjerite projekt i tehnički list.',
      },
    ],
  },
]

/** Fotografija vodiča (krupni plan materijala ili rada, generisano za ovaj sajt), u /public/editorial/posts. */
export const postPhoto = (slug: string) => `/editorial/posts/${slug}.webp`

export const postBySlug = (slug: string) => POSTS.find((post) => post.slug === slug)
