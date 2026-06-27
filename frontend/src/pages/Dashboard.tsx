import { Navigate, Link } from "react-router-dom";
import { useUser } from "@/store/user";
import { useLang } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { EventTicket } from "@/components/dashboard/EventTicket";
import { PartnerMarks } from "@/components/dashboard/PartnerLogos";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Calendar, MapPin } from "lucide-react";
import { CurvedCorner } from "@/components/decor/CurvedShapes";
import { useSavedJobs } from "@/store/useSavedJobs";

const opportunities = [
  { company: "Alinma Bank", type: "Full-time", location: "Riyadh" },
  { company: "Hakbah", type: "Co-op", location: "Riyadh" },
  { company: "Baims", type: "Full-time", location: "Riyadh" },
  { company: "Zid", type: "Internship", location: "Riyadh" },
];

const Dashboard = () => {
  const { user, signOut } = useUser();
  const { t } = useLang();
  const { count } = useSavedJobs();


  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-10 md:py-16 relative overflow-hidden">
        <CurvedCorner corner="tr" size={420} opacity={0.35} />
        <CurvedCorner corner="bl" size={360} opacity={0.25} />
        <div className="relative">
        {/* Welcome */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs font-bold tracking-widest text-primary">{t.dashboard.title}</span>
            </div>
            <h1 className="display-font text-4xl md:text-5xl font-bold">
              {t.dashboard.welcome}, <span className="text-gradient">{user.firstName}</span>
            </h1>
            <p className="text-muted-foreground mt-2">{t.dashboard.subtitle}</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={signOut}>{t.dashboard.signOut}</Button>
        </div>

        {/* Stats */}
         <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {[
          { icon: Briefcase, label: t.dashboard.savedOpportunities, value: String(count) },
        ].map((s, i) => (
            <div key={i} className="glow-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold display-font">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
          {/* Ticket */}
          <div>
            <h2 className="display-font text-2xl font-bold mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> {t.dashboard.yourTicket}
            </h2>
            <EventTicket />
          </div>

          {/* Opportunities */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="display-font text-2xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> {t.dashboard.recommendedForYou}
              </h2>
              <Link to="/explore" className="text-sm text-primary font-semibold inline-flex items-center gap-1">
                {t.dashboard.viewAll} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {opportunities.map((job, i) => (
                <div key={i} className="glow-card rounded-2xl p-5 group cursor-pointer">
                  <div className="h-9 mb-4 flex items-center">
                    {PartnerMarks[job.company] || <span className="text-sm font-bold">{job.company}</span>}
                  </div>
                  <p className="text-primary font-medium text-xs mb-4">{job.company}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground font-medium">
                      {job.type === "Full-time" ? t.dashboard.fullTime : job.type === "Internship" ? t.dashboard.internship : t.dashboard.coop}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {t.auth.layout.stats.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
