import CalculatorsHub from '@/components/calc/CalculatorsHub'
import WallCalculator from '@/components/calc/WallCalculator'
import { SHOW_DRYWALL_CALC } from '@/lib/flags'

export const metadata = SHOW_DRYWALL_CALC
  ? {
      title: 'Kalkulator materijala | Grand Company',
      description: 'Upišite dužinu i visinu pregradnog zida i dobijte orijentacioni proračun materijala, zaokružen na cijela pakovanja.',
    }
  : {
      title: 'Kalkulatori za krov i zid | Grand Company',
      description: 'Zvanični Wienerberger kalkulatori za Tondach krov i Porotherm zid: jednostrešni i dvostrešni krov, U-vrijednost zida i besplatan izračun materijala.',
    }

// Dok asortiman suhe gradnje nije potvrđen (SHOW_DRYWALL_CALC = false), ovdje su kalkulatori proizvođača
// (link na sajt Wienerbergera). Kalkulator pregradnog zida ostaje u kodu i vraća se zastavicom.
export default function CalculatorPage() {
  return SHOW_DRYWALL_CALC ? <WallCalculator /> : <CalculatorsHub />
}
