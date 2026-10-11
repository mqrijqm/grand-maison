import Footer from "@/components/Footer";
import CraneHero from "@/components/CraneHero";
import SiteChrome from "@/components/SiteChrome";
import SiteHeader from "@/components/site/SiteHeader";
import CartDrawer from "@/components/shop/CartDrawer";
import Panels from "@/components/shop/Panels";
import BrandsSplit from "@/components/landing/BrandsSplit";
import Intro from "@/components/landing/Intro";
import SkySwipe from "@/components/landing/SkySwipe";
import UsesSplit from "@/components/landing/UsesSplit";
import HowItWorks from "@/components/landing/HowItWorks";
import WallCalculator from "@/components/calc/WallCalculator";
import CalculatorsHub from "@/components/calc/CalculatorsHub";
import { SHOW_DRYWALL_CALC } from "@/lib/flags";
import Bento from "@/components/landing/Bento";
import ForBusiness from "@/components/landing/ForBusiness";
import QuoteBand from "@/components/landing/QuoteBand";
import Yard from "@/components/landing/Yard";
import AssortmentIndex from "@/components/landing/AssortmentIndex";
import Values from "@/components/landing/Values";
import Reviews from "@/components/landing/Reviews";

// Početna sa naglaskom na nabavku za firme i izvođače.
export default function Home() {
  return (
    <>
      <SiteChrome />
      {/* Navbar: tokom herosa ispod velikog wordmarka; kad se hero pređe, wordmark se smanji u logo
          u sredini navbara, a navbar ostaje zalijepljen za vrh. */}
      <SiteHeader variant="home" />
      {/* home-flow: velik razmak između sekcija (globals.css) */}
      <main className="home-flow">
        <CraneHero />
        <SkySwipe />
        {/* Šta prodajemo → šta gradite → kako se naručuje → koliko treba → za firme → prednosti →
            stovarište → završni poziv → podnožje. */}
        <Intro />
        <UsesSplit />
        {/* Asortiman sa starog sajta + potvrđeni proizvođači (dodato). */}
        <AssortmentIndex />
        <HowItWorks />
        {/* Kalkulatori: proizvođača (Wienerberger) dok asortiman suhe gradnje nije potvrđen; kalkulator
            pregradnog zida se vraća zastavicom SHOW_DRYWALL_CALC (lib/flags.ts). */}
        {SHOW_DRYWALL_CALC ? <WallCalculator embedded /> : <CalculatorsHub embedded />}
        {/* B2B portal: plava, tamna i foto kartica (vraćeno iz ranije verzije), pa živi dashboard. */}
        <Bento />
        <ForBusiness />
        <BrandsSplit />
        {/* "Kvalitet na prvom mjestu!" — tekst sa starog sajta (dodato). */}
        <Values />
        {/* Recenzije kupaca (Kupci.com) odmah ispod "Izbor je Vaš!", pa odmah dvije fotografije
            stovarišta preko cijele širine (foto → plava na hover), bez naslova. */}
        <Reviews />
        <Yard />
        <QuoteBand />
        <Footer />
      </main>
      <CartDrawer />
      <Panels />
    </>
  );
}
