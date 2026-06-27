import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";

const HeroSection = () => {
  const { t } = useLang();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-32">
        <div className="animate-fade-up max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-primary/30 bg-primary/5">
            <span className="text-xs font-semibold tracking-widest text-primary">{t.hero.kicker}</span>
          </div>

          <h1 className="display-font text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight">
            <span className="block text-foreground">{t.hero.title1}</span>
            <span className="block text-gradient">{t.hero.title2}</span>
            <span className="block text-foreground">{t.hero.title3}</span>
          </h1>

          <p className="mt-8 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
            {t.hero.desc}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            {t.hero.tags.map((tag, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${i === 0 ? "bg-primary shadow-glow" : "bg-primary/60"}`} />
                <span className="text-sm font-medium">{tag}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild variant="hero" size="lg">
              <Link to="/signup">
                {t.hero.cta1} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild variant="neon" size="lg">
              <a
                href="#opportunities"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {t.hero.cta2} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>
            </Button>
          </div>
        </div>

        {/* Vertical brand label */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:block">
          <span className="display-font text-[10px] tracking-[0.4em] text-primary/70 [writing-mode:vertical-rl] rotate-180">
            RAWAFED FINTECH
          </span>
        </div>
      </div>
    </section>
  );
};


export default HeroSection;
