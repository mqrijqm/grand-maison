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
    `Program: ${data.program || 'Nije izabran'}`, '', 'MATERIJAL I KOLIČINE', data.materials || 'Prema priloženom planu', '',
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
const EN_ERR: Record<string, string> = {
  'Navedite ime ili firmu i barem jedan kontakt.': 'Enter your name or company and at least one contact detail.',
  'Provjerite adresu e-pošte.': 'Check the email address.',
  'Opišite šta gradite ili priložite plan.': 'Describe what you are building or attach a plan.',
  'Odaberite način preuzimanja.': 'Choose how you want to receive the goods.',
  'Navedite mjesto isporuke.': 'Enter the delivery location.',
  'Skratite tekst ili ga priložite kao dokument.': 'Shorten the text or attach it as a document.',
  'Dodajte do 3 priloga, ukupno do 3 MB.': 'Add up to 3 attachments, 3 MB in total.',
  'Priložite PDF, Excel ili fotografiju.': 'Attach a PDF, Excel file or photo.',
  'Upit pošaljite putem obrasca na sajtu.': 'Please send your enquiry through the form on the site.',
  'Prilozi mogu imati ukupno do 3 MB.': 'Attachments can total up to 3 MB.',
  'Provjerite podatke u upitu.': 'Check the details in your enquiry.',
  'Upit još nije poslan. Pošaljite ga e-poštom.': 'Your enquiry has not been sent yet. Please send it by email.',
  'Upit nije poslan. Pokušajte ponovo ili ga pošaljite e-poštom.': 'Your enquiry was not sent. Try again or send it by email.',
  'Slanje nije potvrđeno. Kontaktirajte prodaju prije ponovnog slanja.': 'Sending could not be confirmed. Contact sales before sending again.',
}
/** Poruka greške na izabranom jeziku (tekstovi u kodu ostaju srpski, engleski je paralelan). */
export const quoteMsg = (msg: string, lang?: string) => (lang === 'en' ? (EN_ERR[msg] ?? msg) : msg)

export function validateQuote(data: QuoteRequest, files: File[]) {
  return validateQuoteSr(data, files)
}
function validateQuoteSr(data: QuoteRequest, files: File[]) {
  if (!data.name || (!data.email && !data.phone)) return 'Navedite ime ili firmu i barem jedan kontakt.'
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Provjerite adresu e-pošte.'
  if (!data.materials && !files.length) return 'Opišite šta gradite ili priložite plan.'
  if (!['preuzimanje', 'dostava'].includes(data.method)) return 'Odaberite način preuzimanja.'
  if (data.method === 'dostava' && !data.location) return 'Navedite mjesto isporuke.'
  if (Object.values(data).some(value => value.length > 6000)) return 'Skratite tekst ili ga priložite kao dokument.'
  if (files.length > QUOTE_MAX_FILES || files.reduce((sum, file) => sum + file.size, 0) > QUOTE_MAX_BYTES) return 'Dodajte do 3 priloga, ukupno do 3 MB.'
  if (files.some(file => !QUOTE_FILE_TYPES.test(file.name))) return 'Priložite PDF, Excel ili fotografiju.'
  return null
}
