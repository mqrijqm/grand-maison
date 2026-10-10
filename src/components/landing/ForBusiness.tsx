'use client'

import Showcase from '@/components/business/portal/Showcase'
import SquareDissolve from '@/components/ui/SquareDissolve'
import s from '@/components/portal/Portal.module.css'

// Odmah ispod B2B blokova (Bento), iste širine i tik uz njih: isti interaktivni portal kao na
// /za-firme, bez uvodnog teksta i bez koraka scenarija. Pri dnu niču kvadratići, prvo blijedi pa
// jarko plavi, i nastavljaju se u plavi prelaz sekcije ispod (BrandsSplit).
export default function ForBusiness() {
  return (
    <section id="za-firme" aria-label="B2B portal, interaktivni prikaz" className={s.forBiz}>
      <div className={s.forBizInner}>
        <Showcase light steps={false} />
      </div>
      <SquareDissolve className={s.forBizDissolve} color="var(--cobalt)" tint solid={false} />
    </section>
  )
}
