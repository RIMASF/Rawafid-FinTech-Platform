import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import OfferSection from "@/components/sections/OfferSection";
import ScheduleSection from "@/components/sections/ScheduleSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import OpportunitiesSection from "@/components/sections/OpportunitiesSection";
import ContactSection from "@/components/sections/ContactSection";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }, [hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <section id="agenda" className="scroll-mt-32">
          <ScheduleSection />
        </section>
        <section id="partners" className="scroll-mt-32">
          <SponsorsSection />
        </section>
        <OfferSection />
        <OpportunitiesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
