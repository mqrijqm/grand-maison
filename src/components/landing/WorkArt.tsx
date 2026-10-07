import UseArt from './UseArt'
import { box, line, poly, prism, type Proj, type V3 } from './iso'

export type WorkKind = 'suha-gradnja' | 'izolacija' | 'zidanje-krov' | 'kupatilo'
type Part = { shape: string; edges?: string; detail?: string; open?: boolean }

function masonry(): Part[][] {
  const o: Proj = { cx: 220, cy: 212, s: 1 }
  const blocks: Part[] = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * 43, z = row * 24
      const b = box(x, 36, z, 40, 30, 22, o)
      const openings = [8, 24].map(dx => poly([[x + dx, 43, z + 22], [x + dx + 9, 43, z + 22], [x + dx + 9, 57, z + 22], [x + dx, 57, z + 22]], o)).join('')
      blocks.push({ shape: b.sil, edges: b.edges, detail: openings })
    }
  }
  const roof = prism([[0, 112], [172, 160], [172, 153], [0, 105]], -8, 106, o)
  const tiles: string[] = []
  for (let y = 10; y < 97; y += 18) tiles.push(line([0, y, 112], [172, y, 160], o))
  for (let x = 42; x < 171; x += 42) tiles.push(line([x, -8, 112 + x * 48 / 172], [x, 98, 112 + x * 48 / 172], o))
  return [blocks, [{ shape: roof.back, open: true }, { shape: roof.links, open: true }, { shape: roof.front }, { shape: tiles.join(''), open: true }]]
}

function bathroom(): Part[][] {
  const o: Proj = { cx: 222, cy: 192, s: 1 }
  const floor = box(0, 0, 0, 180, 140, 3, o), back = box(0, 0, 3, 180, 3, 144, o), side = box(0, 3, 3, 3, 137, 144, o)
  const joints = [45, 90, 135].map(x => line([x, 3, 3], [x, 3, 147], o)).join('') + [39, 75, 111].map(z => line([0, 3, z], [180, 3, z], o)).join('')
  const stand = box(75, 26, 4, 82, 58, 68, o), top = box(70, 21, 72, 92, 68, 4, o)
  const ellipse = (rx: number, ry: number, z: number, start = 0, end = Math.PI * 2): V3[] => Array.from({ length: 49 }, (_, i) => { const a = start + (end - start) * i / 48; return [115 + rx * Math.cos(a), 56 + ry * Math.sin(a), z] })
  const bowl = poly([...ellipse(35, 25, 91, 0, Math.PI), ...ellipse(23, 15, 77, Math.PI, 0)], o)
  const rim = poly(ellipse(35, 25, 91), o), inner = poly(ellipse(30, 20, 91), o), drain = poly(ellipse(3, 2, 78), o)
  const tap = poly([[146, 32, 76], [146, 32, 113], [136, 32, 113], [127, 32, 108]], o, false)
  return [
    [{ shape: back.sil, edges: back.edges, detail: joints }, { shape: side.sil, edges: side.edges }, { shape: floor.sil, edges: floor.edges }],
    [{ shape: stand.sil, edges: stand.edges, detail: line([116, 84, 4], [116, 84, 72], o) }, { shape: top.sil, edges: top.edges }, { shape: bowl }, { shape: rim, open: true }, { shape: inner, open: true }, { shape: drain, open: true }, { shape: tap, open: true }],
  ]
}

function Scene({ kind }: { kind: 'zidanje-krov' | 'kupatilo' }) {
  const layers = kind === 'zidanje-krov' ? masonry() : bathroom()
  return <svg className="art w-full" viewBox={kind === 'zidanje-krov' ? '110 65 285 290' : '25 0 395 360'} fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinejoin="miter" strokeLinecap="square" data-axis="z" data-gap={kind === 'zidanje-krov' ? 12 : 0} role="img">
    <title>{kind === 'zidanje-krov' ? 'Shematski prikaz materijala za zidanje i krov' : 'Shematski prikaz sanitarne keramike u prostoru'}</title>
    {layers.map((parts, k) => <g key={k} data-layer={k}>{parts.map((p, i) => <g key={i}>
      <path d={p.shape} fill={p.open ? 'none' : 'var(--art-fill)'} data-d={0} />
      {p.edges && <path d={p.edges} data-d={1} />}
      {p.detail && <path d={p.detail} opacity={0.65} data-d={2} />}
    </g>)}</g>)}
  </svg>
}

export default function WorkArt({ kind }: { kind: WorkKind }) {
  return <div data-work-art className="w-full">
    {kind === 'suha-gradnja' ? <div className="grid grid-cols-2 items-center gap-6">
      <div><UseArt use="pregradni-zid" className="w-full" title="Presjek pregradnog zida: ploče, profili i izolacija" /><p className="label mt-5 opacity-60">Zid</p></div>
      <div><UseArt use="spusteni-plafon" className="w-full" title="Shematski presjek spuštenog plafona" /><p className="label mt-5 opacity-60">Plafon</p></div>
    </div> : kind === 'izolacija' ? <UseArt use="fasada" className="mx-auto w-full max-w-[470px]" title="Shematski prikaz slojeva izolacije zida" /> : <Scene kind={kind} />}
  </div>
}
