export const QUOTE_MAX_BYTES = 3 * 1024 * 1024
export const QUOTE_MAX_FILES = 3
export const QUOTE_FILE_TYPES = /\.(pdf|xlsx?|jpe?g|png|webp)$/i
export type QuoteRequest = {
  name: string; email: string; phone: string; program: string; materials: string
  method: string; location: string; deadline: string; note: string
}
export function quoteText(data: QuoteRequest) {
  return [
    'UPIT ZA PONUDU', '',
    `Ime ili firma: ${data.name}`, `E-pošta: ${data.email || '—'}`, `Telefon: ${data.phone || '—'}`,
    `Program: ${data.program || 'Prema spisku'}`, '', 'MATERIJAL I KOLIČINE', data.materials || 'Prema priloženom spisku', '',
    `Način: ${data.method === 'preuzimanje' ? 'Lično preuzimanje' : 'Dostava'}`,
    `Lokacija: ${data.location || '—'}`, `Željeni rok: ${data.deadline || 'Po dogovoru'}`,
    '', 'NAPOMENA', data.note || '—',
  ].join('\n')
}
export function readQuote(form: FormData): QuoteRequest {
  const get = (name: string) => String(form.get(name) ?? '').trim()
  return { name: get('name'), email: get('email'), phone: get('phone'), program: get('program'),
    materials: get('materials'), method: get('method'), location: get('location'),
    deadline: get('deadline'), note: get('note') }
}
export function validateQuote(data: QuoteRequest, files: File[]) {
  if (!data.name || (!data.email && !data.phone)) return 'Navedite ime ili firmu i barem jedan kontakt.'
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Provjerite adresu e-pošte.'
  if (!data.materials && !files.length) return 'Unesite materijal i količine ili priložite spisak.'
  if (!['preuzimanje', 'dostava'].includes(data.method)) return 'Odaberite način preuzimanja.'
  if (data.method === 'dostava' && !data.location) return 'Navedite mjesto isporuke.'
  if (Object.values(data).some(value => value.length > 6000)) return 'Skratite tekst ili priložite spisak u dokumentu.'
  if (files.length > QUOTE_MAX_FILES || files.reduce((sum, file) => sum + file.size, 0) > QUOTE_MAX_BYTES) return 'Dodajte do 3 priloga, ukupno do 3 MB.'
  if (files.some(file => !QUOTE_FILE_TYPES.test(file.name))) return 'Priložite PDF, Excel ili fotografiju spiska.'
  return null
}
