import WallCalculator from '@/components/calc/WallCalculator'

export const metadata = {
  title: 'Kalkulator materijala | Grand Company',
  description: 'Upišite dužinu i visinu pregradnog zida i dobijte orijentacioni proračun materijala, zaokružen na cijela pakovanja.',
}

// Kalkulator pregradnog zida (research, tačka 12.5): dužina × visina → površina → materijal → upit.
export default function CalculatorPage() {
  return <WallCalculator />
}
