import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

// Plugini se registruju na jednom mjestu. Duplo registrovanje pravi bugove koji se vide samo u produkciji.
// DrawSVG crta outline ilustracije liniju po liniju; Flip animira promjenu rasporeda (filteri u katalogu).
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, Flip)

// Telefon: adresna traka se skuplja/širi dok se skroluje i mijenja visinu prozora. Bez ovoga
// ScrollTrigger svaki put preračunava sve pinove usred skrola (skokovi i zapinjanje).
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Flip, useGSAP }
