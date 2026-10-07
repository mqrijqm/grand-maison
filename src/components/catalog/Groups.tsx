'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Pw from '@/components/ui/Pw'
import { useMediaMotion } from '@/lib/media'

// Grupe asortimana izvan kataloga (dno prodavnice, #grupe). Ove oblasti pokrivaju stvarne
// tragove firme (EPS/XPS, blok i opeka, vrećasti materijali, mineralna izolacija, armatura,
// drvo, dugi profili, sanitarije), ali za njih nemamo potvrđene šifre, cijene ni stanje —
// zato stoje kao opisi grupa, bez cijena, sa upitom umjesto korpe.

type Group = { id: string; name: string; lead: string; items: string[] }

const GROUPS: Group[] = [
  {
    id: 'program-zidanje',
    name: 'Blok i opeka',
    lead: 'Zidni blokovi, opeka i prateći elementi za grubu gradnju.',
    items: ['Betonski blokovi i blok opeka', 'Puna i fasadna opeka', 'Gredice i nadvoji', 'Zidni dodaci i mort'],
  },
  {
    id: 'program-celik',
    name: 'Armaturne mreže i čelik',
    lead: 'Armatura i čelični proizvodi za betonske konstrukcije.',
    items: ['Armaturne mreže', 'Armaturno gvožđe', 'Čelični profili i nosači', 'Vezivo za armaturu'],
  },
  {
    id: 'program-drvo',
    name: 'Drvo i drvni program',
    lead: 'Građevinsko drvo, pločasti materijali i stolarija.',
    items: ['Rezana građa — grede i daske', 'Pločasti materijali', 'Lamperija i podne obloge', 'Stolarija'],
  },
  {
    id: 'program-sanitarije',
    name: 'Sanitarije',
    lead: 'Sanitarna oprema za kupatila i mokre čvorove.',
    items: ['Sanitarna keramika', 'Kade i tuš kabine', 'Slavine i ventili', 'Kupatilski namještaj i galanterija'],
  },
  {
    id: 'program-profili-cijevi',
    name: 'Dugi profili i cijevi',
    lead: 'Dugi elementi za instalacije i konstrukcije.',
    items: ['PVC i PP cijevi za instalacije', 'Metalne cijevi i fitinzi', 'Oluci i opšivi', 'Profili po mjeri'],
  },
]

const BRANDS = ['Baumit', 'Baumalt', 'Ceresit', 'Tondach', 'Porotherm']

export default function Groups() {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)

  return (
    <section ref={root} id="grupe" className="mt-[20vh]" aria-label="Grupe asortimana">
      <div className="gutter flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label opacity-60">Asortiman po grupama</p>
          <h2 data-up className="display mt-5 text-[clamp(34px,4.4vw,76px)] !leading-[0.95]">
            <Pw>
              Asortiman <em>po upitu</em>
            </Pw>
          </h2>
        </div>
        <p data-up className="max-w-[46ch] text-[12px] leading-[1.7] opacity-70">
          Pored kataloga, nabavljamo i šire grupe građevinskog materijala. Za njih ne prikazujemo šifre, cijene ni
          stanje — artikle opisujemo po grupama, a ponudu i dostupnost potvrđujemo po upitu.
        </p>
      </div>

      <div className="mt-[9vh] grid gap-px border-y border-ink/20 bg-ink/20 md:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((g) => (
          <article key={g.name} id={g.id} data-up className="flex scroll-mt-28 flex-col gap-5 bg-bg px-6 py-10 md:px-[2.4vw] md:py-[2.6vw]">
            <h3 className="font-pretty text-[clamp(21px,1.8vw,28px)] leading-[1.1]">{g.name}</h3>
            <p className="max-w-[34ch] text-[11.5px] leading-[1.6] opacity-65">{g.lead}</p>
            <ul className="flex flex-col gap-1.5 text-[11.5px] leading-[1.5]">
              {g.items.map((item) => (
                <li key={item} className="flex gap-2.5 opacity-80">
                  <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-ink/35" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-6 text-[10.5px] tracking-[0.08em] uppercase opacity-45">Cijena i dostupnost po upitu</p>
          </article>
        ))}

        {/* Šesta ćelija: brendovi koje možemo imenovati — bez tvrdnje o partnerstvu. */}
        <article data-up className="flex flex-col gap-5 bg-navy px-6 py-10 text-bg md:px-[2.4vw] md:py-[2.6vw]">
          <h3 className="font-pretty text-[clamp(21px,1.8vw,28px)] leading-[1.1]">Brendovi</h3>
          <p className="max-w-[34ch] text-[11.5px] leading-[1.6] opacity-75">
            Imena brendova navodimo tamo gdje postoji pokriće. Asortiman tih brendova nabavljamo prema upitu i
            trenutnoj ponudi dobavljača.
          </p>
          <ul className="flex flex-col gap-1.5 text-[12px]">
            {BRANDS.map((b) => (
              <li key={b} className="flex gap-2.5 opacity-90">
                <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-bg/45" />
                {b}
              </li>
            ))}
          </ul>
          <Link href="/upit-za-izvodjace" className="ulink mt-auto pt-6 text-[11.5px]">
            Pošalji upit →
          </Link>
        </article>
      </div>

      <div className="gutter mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[60ch] text-[11px] leading-[1.6] opacity-55">
          Za konkretan artikal, količinu i rok — javite šta vam treba, odgovaramo sa ponudom.
        </p>
        <Link href="/upit-za-izvodjace" className="ulink text-[11.5px]">
          Upit za izvođače i projekte →
        </Link>
      </div>
    </section>
  )
}
