// English sidecar for src/gc/gc-data.json. Additive: the Serbian data stays the source of truth,
// this file only holds the English parallel text, keyed by the same ids / skus / array indices.

import type { CategoryId } from './gc'

export type Lang = 'sr' | 'en'

export const CATEGORIES_EN: Record<CategoryId, { label: string; lead: string; usage: string }> = {
  'suha-gradnja': {
    label: 'Drywall',
    lead: 'Plasterboard and galvanised profiles',
    usage:
      'Drywall systems for partition walls, linings and suspended ceilings. Boards differ by the colour of the card: white is standard, green is moisture-resistant, red is fire-rated, and blue is a hard board of increased strength. Profiles are chosen by wall thickness and system.',
  },
  izolacija: {
    label: 'Insulation',
    lead: 'Stone wool slabs',
    usage:
      'Thermal and acoustic insulation for partition walls, attics and roofs. Stone wool is non-combustible and absorbs sound well.',
  },
  veziva: {
    label: 'Binders and bagged materials',
    lead: 'Plaster compounds for joints and filling',
    usage:
      'Plaster compounds for joints and filling. Keep bags on a pallet, in the dry and protected from moisture, and use them before the expiry date printed on the pack.',
  },
  oprema: {
    label: 'Accessories and equipment',
    lead: 'Tapes, hangers and fixings',
    usage:
      'Accessories for installing drywall systems: joint reinforcement tapes, acoustic tapes under the track profiles and direct hangers for ceilings.',
  },
}

export const PRODUCTS_EN: Record<string, { name: string; spec: string; desc: string; pack?: string }> = {
  'GKP-001': {
    name: 'Plasterboard GKB 12.5 mm',
    spec: '2000 × 1250 × 12.5 mm, board 2.5 m²',
    desc: 'Standard board for walls and ceilings in dry rooms.',
    pack: 'board',
  },
  'GKP-002': {
    name: 'Moisture-resistant plasterboard GKBI 12.5 mm',
    spec: '2000 × 1250 × 12.5 mm, board 2.5 m²',
    desc: 'Moisture-resistant green board for bathrooms, kitchens and laundry rooms.',
    pack: 'board',
  },
  'GKP-003': {
    name: 'Fire-rated plasterboard GKF 12.5 mm',
    spec: '2000 × 1250 × 12.5 mm, board 2.5 m²',
    desc: 'Red board for fire-protection linings, reaction-to-fire class A2-s1,d0.',
    pack: 'board',
  },
  'GKP-004': {
    name: 'Hard plasterboard 12.5 mm',
    spec: '2000 × 1250 × 12.5 mm, board 2.5 m²',
    desc: 'Extra-strong board with better sound insulation and resistance to fire and impact.',
    pack: 'board',
  },
  'PRF-075': {
    name: 'Galvanised wall stud CW 75',
    spec: '3000 × 75 × 50 mm, 0.6 mm sheet',
    desc: 'Vertical stud for 10 cm thick partition walls.',
  },
  'PRF-UW75': {
    name: 'Galvanised track UW 75',
    spec: '4000 × 75 × 40 mm, 0.6 mm sheet',
    desc: 'Horizontal track fixed to the floor and the ceiling.',
  },
  'PRF-CD60': {
    name: 'Galvanised ceiling profile CD 60/27',
    spec: '4000 × 60 × 27 mm, 0.6 mm sheet',
    desc: 'Main carrying and fixing profile for suspended ceilings.',
  },
  'PRF-UD28': {
    name: 'Galvanised perimeter profile UD 28/27',
    spec: '3000 × 28 × 27 mm, 0.6 mm sheet',
    desc: 'Perimeter profile fixed to the wall for suspended ceilings.',
  },
  'ISO-001': {
    name: 'Stone wool slab 50 mm',
    spec: 'Thickness 50 mm, slab 1000 × 600 mm',
    desc: 'For partition walls: thermal and acoustic insulation, non-combustible.',
    pack: 'slab',
  },
  'ISO-002': {
    name: 'Stone wool slab 100 mm',
    spec: 'Thickness 100 mm, slab 1000 × 600 mm',
    desc: 'For highly insulated walls and attics.',
    pack: 'slab',
  },
  'CHM-001': {
    name: 'Plaster jointing compound',
    spec: '5 kg bag',
    desc: 'High-strength compound for filling plasterboard joints without tape.',
  },
  'CHM-002': {
    name: 'Plaster joint filler',
    spec: '25 kg bag',
    desc: 'Standard plaster filler for joints, used with jointing tape.',
  },
  'ACC-001': {
    name: 'Self-tapping screws 3.5 × 25 mm',
    spec: 'Box of 1,000 pcs',
    desc: 'For fixing a single layer of plasterboard to metal profiles.',
  },
  'ACC-003': {
    name: 'Fibreglass jointing tape',
    spec: '25 m roll',
    desc: 'Self-adhesive mesh for reinforcing plasterboard joints.',
  },
  'ACC-006': {
    name: 'Direct hanger for CD profile 120 mm',
    spec: 'Pack of 100 pcs',
    desc: 'For installing a ceiling frame made of CD 60/27 profiles.',
  },
}

/** Sales / pack unit labels (data keeps the Serbian value). */
export const UNIT_EN: Record<string, string> = {
  'm²': 'm²',
  kom: 'pcs',
  kut: 'box',
  pak: 'pack',
  'vreća': 'bag',
  rolna: 'roll',
  komplet: 'kit',
  m: 'm',
  kg: 'kg',
  t: 't',
}

/** Pack names that appear in app text ('1 ploča ≈ ...'). */
export const PACKNAME_EN: Record<string, string> = { 'ploča': 'board', rolna: 'roll', 'kom (3 m)': 'pcs (3 m)', 'kom (4 m)': 'pcs (4 m)', 'vreća 5 kg': '5 kg bag', kutija: 'box', 'rolna 25 m': '25 m roll' }

export const BRAND_EN: Record<string, string> = {
  'Ostali proizvođači': 'Other manufacturers',
}

export const PARTNER_TIERS_EN: { name: string; who: string; rebate: string; limit: string; days: string }[] = [
  { name: 'Retail', who: 'Individuals and investors without a contract', rebate: '0%', limit: 'No credit limit', days: 'Payment on pickup or by proforma invoice' },
  { name: 'Level 1', who: 'Tradespeople and small contractors', rebate: '10%', limit: 'Indicatively up to 15,000 KM', days: 'Payment term 30 days' },
  { name: 'Level 2', who: 'Mid-sized construction companies', rebate: '15%', limit: 'Indicatively up to 30,000 KM', days: 'Payment term 60 days' },
  { name: 'Level 3', who: 'Large contract partners', rebate: '18–22%', limit: 'From 50,000 KM', days: 'Payment term 90 days' },
]

export const WALL_SYSTEMS_EN: Record<string, { name: string; use: string; build: string }> = {
  W111: {
    name: 'Partition wall, single lining',
    use: 'Standard partition in an apartment or office.',
    build: '1 × GKB 12.5 mm on each side, CW 75 at 62.5 cm centres, 50 mm stone wool',
  },
  W112: {
    name: 'Partition wall, double lining',
    use: 'When you need more sound insulation and impact resistance — corridors, clinics, hotels.',
    build: '2 × GKB 12.5 mm on each side, CW 75, 50 mm stone wool',
  },
  W115: {
    name: 'Wall with a double stud frame',
    use: 'A wall between two apartments or next to a stairwell, where sound insulation is the key requirement.',
    build: '2 × GKB 12.5 mm on the outside, two separate rows of CW 50, wool in both cavities',
  },
  D112: {
    name: 'Suspended ceiling on a double frame',
    use: 'A ceiling below concrete or the roof structure, with space for services.',
    build: 'GKB 12.5 mm on a crossed CD grid, direct hangers, perimeter UD profile',
  },
}

export const ORDER_STEPS_EN: [string, string][] = [
  ['Selection', 'Pick items in the catalogue, or let the calculator work out the material from your wall dimensions.'],
  ['Enquiry or order', 'The basket sends an enquiry. Partners order at their own price after signing in.'],
  ['Confirmation and lead time', 'We confirm stock and a date. Items in stock ship the same or the next day.'],
  ['Unloading', 'Delivery and unloading are agreed according to the site and the type of goods — crane unloading is available on request.'],
]

export const FAQ_EN: [string, string][] = [
  [
    'Do you have the goods in stock, or is there a wait?',
    'Stock levels on the site are indicative. A green “in stock” means we normally carry the item, but we confirm exact availability and quantities before the order. For larger quantities, please call, as another order may coincide with yours.',
  ],
  [
    'Do I get a certificate and declaration with the goods?',
    'Yes. We issue the CE declaration and the fire certificate with the delivery note, for technical acceptance. For drywall systems we also provide the system datasheet.',
  ],
  [
    'Is there a minimum order?',
    'Not for retail. For crane delivery we charge for the vehicle call-out, so for less than one pallet it usually pays off more to collect from the yard.',
  ],
  [
    'Do you cut boards to size?',
    'No. Boards come in the full 2000 × 1250 mm format. The calculator accounts for waste and rounds up to whole boards, so you do not buy surplus by guesswork.',
  ],
  [
    'Can I return leftover material?',
    'We take back unopened and undamaged packs with the delivery note within 15 days. We cannot accept bags of binder that have stood in damp conditions.',
  ],
  [
    'How do companies pay?',
    'Contract partners pay by invoice, with a payment term of up to 90 days against a promissory note or bank guarantee. You can see the credit limit and open items in the portal.',
  ],
]

export const BRAND_NOTES_EN: [string, string][] = [
  ['Baumalt', 'Construction chemicals.'],
  ['Tondach', 'Roof tiles and roofing systems (Wienerberger).'],
  ['Porotherm', 'Clay masonry blocks (Wienerberger).'],
]

export const DELIVERY_ZONES_EN: Record<string, string> = { bl: 'Banja Luka (city area)' }

export const STOCK_LABEL_EN = { high: 'In stock', mid: 'Limited', low: 'Low stock' } as const
