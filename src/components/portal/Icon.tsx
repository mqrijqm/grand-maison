// Tanke ikonice za portal: 16×16, linija 1.25, bez ispune — isti potez kao okviri navbara.
const PATHS: Record<string, string> = {
  pregled: 'M2.5 2.5h4.5v5H2.5zM9 2.5h4.5v3H9zM9 7.5h4.5v6H9zM2.5 9.5h4.5v4H2.5z',
  brza: 'M9 1.5 3.5 9h4l-1 5.5L12.5 7h-4z',
  ponude: 'M4 1.5h5.5L12.5 4.5v10H4zM9.5 1.5v3h3M6 8h4.5M6 10.5h4.5',
  narudzbe: 'M2 4.5 8 1.5l6 3v7l-6 3-6-3zM2 4.5l6 3 6-3M8 7.5v7',
  isporuke: 'M1.5 3.5h8v7h-8zM9.5 6h3l2 2.5v2h-5M4 12.5a1.25 1.25 0 1 0 0 .01M12 12.5a1.25 1.25 0 1 0 0 .01',
  gradilista: 'M8 14.5s4.5-4.2 4.5-7.5a4.5 4.5 0 0 0-9 0c0 3.3 4.5 7.5 4.5 7.5zM8 5.5v3M6.5 7h3',
  liste: 'M5.5 3.5h8M5.5 8h8M5.5 12.5h8M2.5 3.5h1M2.5 8h1M2.5 12.5h1',
  dokumenti: 'M1.5 4.5h5l1.5-2h6.5v10.5h-13z',
  tim: 'M5.5 7a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5zM1.5 13.5c0-2.2 1.8-4 4-4s4 1.8 4 4M11 6.5a1.75 1.75 0 1 0 0-3.5M12 9.6c1.5.4 2.5 1.8 2.5 3.4',
  search: 'M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM10.6 10.6l3.9 3.9',
  plus: 'M8 3v10M3 8h10',
  arrow: 'M3 8h10M9 4l4 4-4 4',
  back: 'M13 8H3M7 4 3 8l4 4',
  check: 'M3 8.5 6.5 12 13 4.5',
  x: 'M4 4l8 8M12 4l-8 8',
  down: 'M8 2.5v9M4 8l4 4 4-4M2.5 13.5h11',
  upload: 'M8 11.5v-9M4 6l4-4 4 4M2.5 13.5h11',
  repeat: 'M2.5 7V5.5h9.5L10 3.5M13.5 9v1.5H4l2 2',
}

export default function Icon({ name, className }: { name: keyof typeof PATHS | string; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square">
      <path d={PATHS[name] ?? ''} />
    </svg>
  )
}
