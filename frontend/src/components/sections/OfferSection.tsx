import { useLang } from "@/i18n/LanguageContext";
import { Link2, Search, TrendingUp, ArrowRight } from "lucide-react";
import { CurvedCorner } from "@/components/decor/CurvedShapes";

const icons = [Link2, Search, TrendingUp];

const OfferSection = () => {
  const { t } = useLang();

  return (
    <section id="offer" className="section-pad relative scroll-mt-32 overflow-hidden">
      <CurvedCorner corner="tl" size={420} opacity={0.35} />
      <CurvedCorner corner="br" size={380} opacity={0.3} />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-1.5 rounded-full border border-primary/40 text-xs font-bold tracking-widest text-primary mb-6">
            {t.offer.kicker}
          </span>
          <h2 className="display-font text-4xl md:text-6xl font-bold mb-4">{t.offer.title}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{t.offer.desc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {t.offer.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="glow-card rounded-3xl p-8 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-8">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="display-font text-2xl font-bold mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-8">{card.sub}</p>
                <p className="text-sm text-muted-foreground/90 leading-relaxed mb-10">{card.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
