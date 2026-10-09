import Footer from "@/components/Footer";
import CraneHero from "@/components/CraneHero";
import SiteChrome from "@/components/SiteChrome";
import SiteHeader from "@/components/site/SiteHeader";
import CartDrawer from "@/components/shop/CartDrawer";
import Panels from "@/components/shop/Panels";
import BrandsSplit from "@/components/landing/BrandsSplit";
import Intro from "@/components/landing/Intro";
import Yard from "@/components/landing/Yard";
import SkySwipe from "@/components/landing/SkySwipe";
import UsesSplit from "@/components/landing/UsesSplit";
import HowItWorks from "@/components/landing/HowItWorks";
import WallCalculator from "@/components/calc/WallCalculator";
import ForBusiness from "@/components/landing/ForBusiness";
import QuoteBand from "@/components/landing/QuoteBand";

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
        <HowItWorks />
        {/* Pravi kalkulator (ista tabla kao /kalkulator), ne statičan primjer. */}
        <WallCalculator embedded />
        <ForBusiness />
        <BrandsSplit />
        {/* Stovarište (foto → plava ilustracija na hover). */}
        <Yard />
        <QuoteBand />
        <Footer />
      </main>
      <CartDrawer />
      <Panels />
    </>
  );
}
