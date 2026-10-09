'use client'

import { usePortalPartner } from '@/lib/portal'
import PortalDashboard from './PortalDashboard'
import PortalIntro from './PortalIntro'

// /portal: bez prijave javni opis + demo prijava; prijavljen partner vidi svoj nalog.
export default function PortalPage() {
  const partner = usePortalPartner()
  return partner ? <PortalDashboard key={partner.id} partner={partner} /> : <PortalIntro />
}
