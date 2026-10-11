'use client'

// Cijena artikla. Javnog cjenovnika nema, pa se umjesto iznosa svuda prikazuje "Cijena na upit"
// (katalog, stranica artikla, korpa). Props ostaju isti da pozivi ne moraju da se mijenjaju.
export default function Price({ className = '' }: { value?: number; qty?: number; unit?: string; className?: string }) {
  return <span className={className}>Cijena na upit</span>
}
