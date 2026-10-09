import { redirect } from 'next/navigation'

// B2B portal živi na /za-firme (glavna B2B stranica); stari link vodi tamo.
export default function Page() {
  redirect('/za-firme#demo')
}
