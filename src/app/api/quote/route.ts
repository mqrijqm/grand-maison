import { COMPANY } from '@/gc/gc'
import { QUOTE_MAX_BYTES, quoteMsg, quoteText, readQuote, validateQuote } from '@/lib/quote-request'

export const runtime = 'nodejs'

// https://resend.com/docs/api-reference/emails/send-email
export async function POST(request: Request) {
  // Jezik korisnika (polje `lang` iz obrasca, ili zaglavlje X-Lang kad tijelo još nije pročitano); samo poruke greške se prevode.
  let lang = request.headers.get('x-lang') === 'en' ? 'en' : 'sr'
  const msg = (text: string) => quoteMsg(text, lang)
  const origin = request.headers.get('origin')
  const publicUrl = new URL(request.url)
  publicUrl.host = request.headers.get('host') || publicUrl.host
  if (origin && origin !== publicUrl.origin) return Response.json({ error: msg('Upit pošaljite putem obrasca na sajtu.') }, { status: 403 })
  if (Number(request.headers.get('content-length')) > QUOTE_MAX_BYTES + 100000) return Response.json({ error: msg('Prilozi mogu imati ukupno do 3 MB.') }, { status: 413 })
  let form: FormData
  try { form = await request.formData() }
  catch { return Response.json({ error: msg('Provjerite podatke u upitu.') }, { status: 400 }) }
  if (form.get('lang') === 'en') lang = 'en'
  const files = form.getAll('attachments').filter((value): value is File => value instanceof File && value.size > 0)
  const data = readQuote(form)
  const error = validateQuote(data, files)
  if (error) return Response.json({ error: msg(error) }, { status: 400 })
  const key = process.env.RESEND_API_KEY
  const from = process.env.GRAND_QUOTE_FROM
  if (!key || !from) return Response.json({ error: msg('Upit još nije poslan. Pošaljite ga e-poštom.'), code: 'email_unavailable' }, { status: 503 })
  try {
    const attachments = await Promise.all(files.map(async file => ({
      filename: file.name.replace(/[\r\n]/g, ''), content: Buffer.from(await file.arrayBuffer()).toString('base64'),
    })))
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from, to: [process.env.GRAND_QUOTE_TO || COMPANY.emailInfo],
        subject: `Upit za ponudu — ${data.name.replace(/[\r\n]/g, ' ').slice(0, 100)}`,
        ...(data.email ? { reply_to: data.email } : {}),
        text: quoteText(data), attachments,
      }),
    })
    if (!response.ok) return Response.json({ error: msg('Upit nije poslan. Pokušajte ponovo ili ga pošaljite e-poštom.') }, { status: 502 })
    return Response.json({ sent: true })
  } catch {
    return Response.json({ error: msg('Slanje nije potvrđeno. Kontaktirajte prodaju prije ponovnog slanja.') }, { status: 502 })
  }
}
