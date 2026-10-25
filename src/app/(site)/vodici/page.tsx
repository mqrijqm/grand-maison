import GuidesView from '@/components/posts/GuidesView'

export const metadata = {
  title: 'Vodiči | Grand Company',
  description: 'Praktični vodiči o suhoj gradnji, izolaciji, fasadi i isporuci.',
}

// Tekst stranice je u klijentskoj komponenti (SR/EN prekidač).
export default function PostsPage() {
  return <GuidesView />
}
