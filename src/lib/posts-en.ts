import type { Block, Post, PostTag } from './posts'
import type { Lang } from './i18n'
import { calcW111 } from './shop'

// English counterparts of src/lib/posts.ts (additive: Serbian content stays in posts.ts, keyed here by slug).

export const TAG_EN: Record<PostTag, string> = {
  'Vodič': 'Guide',
  Sistemi: 'Systems',
  Isporuka: 'Delivery',
  Materijal: 'Materials',
}
export const tagLabel = (tag: PostTag, lang: Lang) => (lang === 'en' ? TAG_EN[tag] : tag)

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const postDateEn = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${MONTHS_EN[m - 1]} ${d}, ${y}`
}

// Bill-of-materials strings come from shop.ts in Serbian ("10,25 m²", "4 ploča po 2,5 m²").
const UNIT_EN: Record<string, [string, string]> = {
  'ploča': ['boards', 'board'],
  komada: ['pieces', 'piece'],
  'vreća': ['bags', 'bag'],
  kutija: ['boxes', 'box'],
  rola: ['rolls', 'roll'],
  pakovanja: ['packs', 'pack'],
}
const num = (s: string) => s.replace(/\./g, '\u0000').replace(/,/g, '.').replace(/\u0000/g, ',')
const needEn = (need: string) => num(need).replace(/ kom$/, ' pcs')
const noteEn = (note: string) => {
  const m = note.match(/^(\d+) (ploča|komada|vreća|kutija|rola|pakovanja) po (.+?)(, po potrebi)?$/)
  if (m) {
    const [, n, unit, each, optional] = m
    const [many, one] = UNIT_EN[unit]
    const each2 = num(each).replace(/ komada$/, ' pieces')
    return `${n} ${Number(n) === 1 ? one : many}, ${each2} each${optional ? ', as needed' : ''}`
  }
  const sheets = note.match(/^(.+) m² ploča$/)
  if (sheets) return `${num(sheets[1])} m² of boards`
  return note
}

const w111 = calcW111({
  L: 4,
  H: 2.5,
  cladding: 'single',
  plateSku: 'GKP-001',
  cwSku: 'PRF-075',
  woolSku: 'ISO-001',
  fillerSku: 'CHM-001',
})

export type PostEn = { title: string; lead: string; body: Block[] }

export const POSTS_EN: Record<string, PostEn> = {
  'pregradni-zid-w111-korak-po-korak': {
    title: 'A partition wall, step by step',
    lead: 'The installation sequence for a standard wall with one board on each side.',
    body: [
      { t: 'h', text: 'Before you start' },
      {
        t: 'p',
        text: 'Transfer the wall axis to the floor, walls and ceiling. Check the services and the finished floor level before cutting any profiles.',
      },
      { t: 'h', text: 'Framing' },
      {
        t: 'list',
        items: [
          'Apply acoustic sealing tape to the UW track.',
          'Fix the UW track to the floor and ceiling, then set the CW studs at 62.5 cm centres.',
          'Face the CW openings the same way; every board joint must land on a stud.',
        ],
      },
      { t: 'h', text: 'Boarding and infill' },
      {
        t: 'p',
        text: 'Board the first side with GKB plasterboard, run the services, then fill the cavity completely with stone wool. '
          + 'Stagger the joints on the second side against the first.',
      },
      {
        t: 'note',
        text: 'Do not rest the boards directly on the floor. Leave a small gap and close it as the system requires.',
      },
      {
        t: 'spec',
        rows: [
          ['Profile', 'CW 75 + UW 75'],
          ['Finished thickness', '100 mm'],
        ],
      },
    ],
  },
  'gkb-gkbi-gkf-ili-tvrda': {
    title: 'GKB, GKBI or GKF: which board goes where',
    lead: 'Four boards that look alike, but are not interchangeable in every room.',
    body: [
      { t: 'h', text: 'Choose by requirement' },
      {
        t: 'p',
        text: 'GKB is the standard for dry rooms. GKBI is the moisture-resistant board for bathrooms, kitchens and laundries. '
          + 'GKF is used where the system needs a defined fire resistance, and the hard board is the high-strength choice where impact, load-bearing capacity and sound also matter.',
      },
      {
        t: 'spec',
        rows: [
          ['GKB', 'Standard walls and ceilings'],
          ['GKBI', 'Rooms with occasional moisture'],
          ['GKF', 'Fire-protection linings'],
          ['Hard board', 'Strength, acoustics, moisture and fire'],
        ],
      },
      {
        t: 'note',
        text: 'The board alone does not determine the wall class. The result depends on the complete, tested system and correct installation.',
      },
    ],
  },
  'kamena-ili-staklena-vuna': {
    title: 'Stone wool: walls and roofs',
    lead: 'Density, thickness and place of installation decide the practical choice.',
    body: [
      { t: 'h', text: 'For a partition wall' },
      {
        t: 'p',
        text: 'Semi-rigid stone wool slabs fit easily between the CW studs and absorb sound well. '
          + 'Cut them slightly wider than the cavity so they sit without gaps.',
      },
      { t: 'h', text: 'For a pitched roof' },
      {
        t: 'p',
        text: 'Stone wool slabs go between the rafters, snug and without gaps. '
          + 'Two layers with staggered joints reduce thermal bridging.',
      },
      {
        t: 'list',
        items: [
          'Do not compress the wool: compressing it loses the designed thickness.',
          'Fill the whole cavity without leaving cracks.',
          'Protect the material from rain and lasting moisture.',
        ],
      },
    ],
  },
  'obracun-materijala-za-10-m2-zida': {
    title: 'How to calculate materials for 10 m² of wall',
    lead: 'An example partition wall of 4 × 2.5 m (CW 75, single cladding), waste included.',
    body: [
      { t: 'h', text: 'Input dimensions' },
      {
        t: 'p',
        text: 'Area is length times height: 4 × 2.5 m = 10 m². '
          + 'Openings should be deducted according to how the wall is actually clad and how the openings are reinforced.',
      },
      { t: 'h', text: 'Indicative list' },
      { t: 'spec', rows: w111.items.map((item) => [item.sku, `${needEn(item.need)} — ${noteEn(item.note)}`]) },
      {
        t: 'note',
        text: 'This is the consumption norm for the given example, not a structural or fire-safety calculation. '
          + 'Confirm the final quantities against the drawings and the chosen system.',
      },
    ],
  },
  'istovar-kranom-priprema-gradilista': {
    title: 'Unloading on site: what to prepare',
    lead: 'Five checks before the truck arrives save time and protect the material.',
    body: [
      { t: 'h', text: 'Access and position' },
      {
        t: 'list',
        items: [
          'Confirm the width of the access road and the load-bearing capacity of the ground.',
          'Clear a place for the vehicle and for unloading the pallets.',
          'Check for cables, branches, balconies and other obstacles above the vehicle.',
          'Choose a flat, dry surface for the pallets.',
          'Name the person who receives the goods and checks the delivery note.',
        ],
      },
      {
        t: 'note',
        text: 'Goods are unloaded at the agreed accessible point. Moving them inside and protecting the material from the weather is the site’s responsibility.',
      },
    ],
  },
  'spusteni-plafon-na-cd-profilima': {
    title: 'A suspended ceiling on CD profiles',
    lead: 'The basic sequence for a CD profile frame and a flat lining.',
    body: [
      { t: 'h', text: 'Levelling' },
      {
        t: 'p',
        text: 'Mark the underside of the ceiling with a laser. Fix the UD track around the perimeter, with the appropriate separating tape.',
      },
      { t: 'h', text: 'Grid and hangers' },
      {
        t: 'p',
        text: 'Space the direct hangers and CD profiles according to the system data sheet and the weight of the lining. '
          + 'Board joints must have support, and services must not load the lining.',
      },
      {
        t: 'note',
        text: 'Spans and spacings depend on the system class, the number of layers and any additional load. '
          + 'Check the project and the data sheet before installation.',
      },
    ],
  },
}

/** Returns the post in the requested language (Serbian original, or English with the same slug/tag/date/art). */
export function localizePost(post: Post, lang: Lang): Post {
  if (lang !== 'en') return post
  const en = POSTS_EN[post.slug]
  return en ? { ...post, title: en.title, lead: en.lead, body: en.body } : post
}
