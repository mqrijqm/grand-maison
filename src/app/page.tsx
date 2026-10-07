import Footer from "@/components/Footer";
import CraneHero from "@/components/CraneHero";
import SiteChrome from "@/components/SiteChrome";
import SiteHeader from "@/components/site/SiteHeader";
import CartDrawer from "@/components/shop/CartDrawer";
import Panels from "@/components/shop/Panels";
import LoginModal from "@/components/b2b/LoginModal";
import Procurement from "@/components/landing/Procurement";
import Bento from "@/components/landing/Bento";
import BrandsSplit from "@/components/landing/BrandsSplit";
import Delivery from "@/components/landing/Delivery";
import Featured from "@/components/landing/Featured";
import Intro from "@/components/landing/Intro";
import StepBand from "@/components/ui/StepBand";
import PostsTeaser from "@/components/landing/PostsTeaser";
import Yard from "@/components/landing/Yard";
import QuoteSection from "@/components/landing/QuoteSection";
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
        {/* Program → materijal prema radovima → poslovna nabavka → postupak nabavke. */}
        <Intro />
        <UsesSplit />
        <Procurement />
        <Bento />
        <BrandsSplit />
        <Featured />
        <Delivery />
        <StepBand tone="navy" profile="valley" steps={11} aria-label="Vodiči" className="!z-[45]">
          <PostsTeaser />
        </StepBand>
        {/* Usputna sekcija pred podnožje: stovarište (foto → plava ilustracija na hover). */}
        <Yard />
        <QuoteSection />
        <Footer />
      </main>
      <CartDrawer />
      <Panels />
      <LoginModal />
    </>
  );
}
