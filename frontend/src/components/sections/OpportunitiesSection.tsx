import { useLang } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, BarChart3, Banknote, Shield, MapPin, ArrowRight } from "lucide-react";
import { useUser } from "@/store/user";

const jobIcons = [Code2, BarChart3, Banknote, Shield];

const OpportunitiesSection = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const { user } = useUser();

  const handleViewAll = () => {
    if (user) navigate("/explore");
    else navigate("/signup");
  };

  return (
    <section id="opportunities" className="section-pad relative overflow-hidden scroll-mt-32">
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary shadow-glow" />
            <span className="text-xs font-bold tracking-widest text-primary">{t.opportunities.kicker}</span>
          </div>
          <h2 className="display-font text-4xl md:text-6xl font-bold leading-tight mb-6">
            {t.opportunities.title1}
            <br />
            {t.opportunities.title2} <span className="text-gradient">{t.opportunities.title3}</span>
          </h2>
          <p className="text-muted-foreground max-w-md mb-10">{t.opportunities.desc}</p>
          <div className="w-32 h-px bg-gradient-to-r from-primary to-transparent mb-10" />
          <Button onClick={handleViewAll} variant="hero" size="lg">
            {t.opportunities.viewAll} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {t.opportunities.jobs.map((job, i) => {
            const Icon = jobIcons[i];
            return (
              <div key={i} className="glow-card rounded-3xl p-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="display-font text-xl font-bold leading-tight mb-3">{job.title}</h3>
                <p className="text-primary font-semibold mb-6 text-xl text-center">{job.company}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-xs px-3 py-1 rounded-full bg-muted/50 text-muted-foreground">{job.type}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesSection;
