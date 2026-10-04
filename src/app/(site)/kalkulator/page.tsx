import W111Calculator from '@/components/calc/W111Calculator'
import Pw from '@/components/ui/Pw'

export const metadata = {
  title: 'Kalkulator W111 | Grand Company',
  description: 'Unesite površinu pregradnog zida i dobijte orijentacioni proračun materijala za sistem W111, sa rezervom za otpad i cijenama.',
}

// Kalkulator materijala za pregradni zid po sistemu W111: naslov kao na ostalim stranicama, pa unos,
// presjek zida u razmjeri i orijentacioni proračun materijala sa "Dodaj sve u korpu".
export default function CalculatorPage() {
  return (
    <div className="pb-[16dvh]">
      <header className="px-5 pb-[8dvh] pt-[18dvh] text-center md:pt-[20dvh]">
        <p className="label text-ink/50">Sistem W111 · pregradni zid</p>
        <h1 className="display mt-6 text-[clamp(34px,12.5vw,170px)]">
          <Pw>Kalkulator</Pw>
        </h1>
        <p className="mx-auto mt-10 max-w-[46ch] text-[13px] text-ink/70">
          Unesite površinu zida i izaberite oblogu — dobijate orijentacioni proračun materijala, spreman za korpu.
        </p>
      </header>
      <W111Calculator />
    </div>
  )
}
