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
        {/* Šta prodajemo → za koje radove → prednosti → asortiman → stovarište → kontakt (podnožje). */}
        <Intro />
        <UsesSplit />
        <BrandsSplit />
        {/* Usputna sekcija pred podnožje: stovarište (foto → plava ilustracija na hover). */}
        <Yard />
        <Footer />
      </main>
      <CartDrawer />
      <Panels />
    </>
  );
}
