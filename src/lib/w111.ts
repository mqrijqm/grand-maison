// Kalkulator utroška za pregradni zid po sistemu W111 (jednostruka potkonstrukcija, jednoslojna
// obloga; CW 75 na razmaku 625 mm) — dokumentacija Grand Company, tačka 6. Unos je površina zida
// u m², pa izbor obloge, ploče i vune. Normativi su ORIJENTACIONI (po Knauf tehničkom listu za
// W111) i nisu zamjena za projekat — količine se potvrđuju uz ponudu.

export type Cladding = 'single' | 'double'

/** Rezerva za otpad i rezanje. Knauf svoje količine prikazuje bez dodatka, pa se bira 0/5/10%. */
export const WASTE_OPTIONS = [0, 0.05, 0.1] as const
export const WASTE_DEFAULT = 0.05

export const PROFILE_MM = 75
export const BOARD_MM = 12.5

type Norm = {
  key: string
  label: string
  sku: string
  perM2: Record<Cladding, number>
  unit: string
  pack: number
  packName: string
  /** Opciono: ne ulazi u proračun ako nije uključeno (vuna, bandaž traka) */
  optional?: 'wool' | 'tape'
}

// Ploča se bira (GKB, GKBI, GKF, tvrda); ostalo je fiksno iz kataloga.
// Normativi su po m² zida (obje strane zajedno), prije rezerve za otpad.
export const NORMS: Norm[] = [
  { key: 'board', label: 'Gips-kartonska ploča 12,5 mm', sku: 'GKP-001', perM2: { single: 2, double: 4 }, unit: 'm²', pack: 2.5, packName: 'ploča' },
  { key: 'cw', label: 'Zidni profil CW 75', sku: 'PRF-075', perM2: { single: 2, double: 2 }, unit: 'm', pack: 3, packName: 'kom (3 m)' },
  { key: 'uw', label: 'Vodeći profil UW 75', sku: 'PRF-UW75', perM2: { single: 0.7, double: 0.7 }, unit: 'm', pack: 4, packName: 'kom (4 m)' },
  { key: 'wool', label: 'Kamena vuna 50 mm', sku: 'ISO-001', perM2: { single: 1, double: 1 }, unit: 'm²', pack: 0.6, packName: 'ploča', optional: 'wool' },
  // 0,5 kg/m² Uniflott za standardni W111 (Knauf tabela). Dvostruka obloga ima dvostruku dužinu
  // spojeva, pa je norma udvostručena — orijentaciono.
  { key: 'filler', label: 'Masa za spojeve', sku: 'CHM-001', perM2: { single: 0.5, double: 1 }, unit: 'kg', pack: 5, packName: 'vreća 5 kg' },
  { key: 'screws', label: 'Samourezni vijci', sku: 'ACC-001', perM2: { single: 30, double: 50 }, unit: 'kom', pack: 1000, packName: 'kutija' },
  // Bandaž traka NIJE standardni dio W111 uz Uniflott: tvornički rubovi ploča se mogu obrađivati
  // bez trake, a traka ide prema detalju — naročito na rezanim i poprečnim spojevima. Zato je
  // uključujemo samo po izboru.
  { key: 'tape', label: 'Bandaž traka za spojeve', sku: 'ACC-003', perM2: { single: 1.6, double: 1.6 }, unit: 'm', pack: 25, packName: 'rolna 25 m', optional: 'tape' },
]

export type W111Line = {
  key: string
  label: string
  sku: string
  /** potrebno, sa rezervom za otpad, u jedinici normativa (m², m, kg, kom) */
  need: number
  unit: string
  /** broj pakovanja koja se kupuju */
  packs: number
  packName: string
  /** količina za korpu, u jedinici artikla iz kataloga */
  cartQty: number
}

export type W111Opts = { wool: boolean; tape: boolean; waste: number }

export function calcW111Area(area: number, cladding: Cladding, plateSku: string, { wool, tape, waste }: W111Opts): W111Line[] {
  return NORMS.filter((n) => (n.optional === 'wool' ? wool : n.optional === 'tape' ? tape : true)).map((n) => {
    const need = area * n.perM2[cladding] * (1 + waste)
    const packs = Math.max(1, Math.ceil(need / n.pack - 1e-9))
    // Ploče i vuna se u katalogu prodaju po m² (cijela pakovanja), ostalo po komadu / kutiji / vreći.
    const byArea = n.key === 'board' || n.key === 'wool'
    return {
      key: n.key,
      label: n.label,
      sku: n.key === 'board' ? plateSku : n.sku,
      need,
      unit: n.unit,
      packs,
      packName: n.packName,
      cartQty: byArea ? Math.round(packs * n.pack * 100) / 100 : packs,
    }
  })
}

export const wallThickness = (c: Cladding) => PROFILE_MM + (c === 'double' ? 4 : 2) * BOARD_MM
