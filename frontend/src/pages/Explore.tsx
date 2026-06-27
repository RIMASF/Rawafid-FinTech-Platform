import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LanguageContext";
import { Search, MapPin, SlidersHorizontal, Bookmark } from "lucide-react";
import { CurvedCorner } from "@/components/decor/CurvedShapes";
import { useUser } from "@/store/user";
import { useSavedJobs } from "@/store/useSavedJobs";
import { toast } from "sonner";

type Job = {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  category: string;
  short: string;
};

const JOBS: Job[] = [
  { id: "1", title: "Opportunities", company: "Alinma Bank", type: "Full-time", location: "Riyadh", category: "Finance", short: "FIN" },
  { id: "2", title: "Opportunities", company: "Zid", type: "Internship", location: "Riyadh", category: "Tech", short: "TEC" },
  { id: "3", title: "Opportunities", company: "Hakbah", type: "Co-op", location: "Riyadh", category: "Finance", short: "FIN" },
  { id: "4", title: "Opportunities", company: "Baims", type: "Full-time", location: "Riyadh", category: "Finance", short: "FIN" },
  { id: "5", title: "", company: "", type: "", location: "Riyadh", category: "", short: "" },
  { id: "6", title: "", company: "", type: "", location: "Riyadh", category: "", short: "" },
  { id: "7", title: "", company: "", type: "", location: "Riyadh", category: "", short: "" },
  { id: "8", title: "", company: "", type: "", location: "Riyadh", category: "", short: "" },
];

const TYPES = ["All Types", "Full-time", "Internship", "Co-op"];
const LOCATIONS = ["All Locations", "Riyadh"];
const CATEGORIES = ["All Categories", "Finance", "Tech"];

const Explore = () => {
  const { user } = useUser();
  const { t } = useLang();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All Categories");
  const [type, setType] = useState("All Types");
  const [loc, setLoc] = useState("All Locations");
  const { isSaved, toggle } = useSavedJobs();

  const filtered = useMemo(
    () =>
      JOBS.filter((j) => {
        if (q && !`${j.title} ${j.company} ${j.category}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (cat !== "All Categories" && j.category !== cat) return false;
        if (type !== "All Types" && j.type !== type) return false;
        if (loc !== "All Locations" && j.location !== loc) return false;
        return true;
      }),
    [q, cat, type, loc]
  );

  if (!user) return <Navigate to="/signup" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="section-pad relative overflow-hidden">
          <CurvedCorner corner="tr" size={500} opacity={0.45} />
          <CurvedCorner corner="bl" size={420} opacity={0.35} />

          <div className="relative max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5">
              <span className="w-2 h-2 rounded-full bg-primary shadow-glow" />
              <span className="text-xs font-bold tracking-widest text-primary">{t.explore.title.toUpperCase()}</span>
            </div>

            <h1 className="display-font text-3xl sm:text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
              <span className="block text-foreground">{t.explore.title}</span>
              <span className="block text-gradient">{t.explore.subtitle}</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mb-10">
              {t.explore.subtitle}
            </p>

            {/* Filter bar */}
            <div className="glow-card rounded-2xl sm:rounded-full px-3 py-3 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 mb-12">
              <div className="flex items-center gap-2 flex-1 min-w-0 px-4">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t.explore.search}
                  className="border-0 bg-transparent h-10 focus-visible:ring-0 px-0 w-full"
                />
              </div>

              <div className="flex flex-wrap gap-2 sm:contents">
                <FilterSelect value={cat} onChange={setCat} options={CATEGORIES} t={t} />
                <FilterSelect value={type} onChange={setType} options={TYPES} t={t} />
                <FilterSelect value={loc} onChange={setLoc} options={LOCATIONS} t={t} />
                <Button variant="hero" size="sm" className="rounded-full flex-1 sm:flex-none">
                  <SlidersHorizontal className="w-4 h-4" /> {t.explore.filter}
                </Button>
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((j) => {
                const saved = isSaved(j.id);
                return (
                <article key={j.id} className="glow-card rounded-3xl p-5 group flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/30 text-primary text-[11px] font-bold tracking-wider">
                      {j.short}
                    </div>
                    <button
                      type="button"
                      aria-label={saved ? "Remove from saved" : "Save opportunity"}
                      onClick={() => {
                        toggle(j.id);
                        toast.success(saved ? "Removed from saved" : "Saved to your dashboard");
                      }}
                      className={`w-8 h-8 rounded-md border flex items-center justify-center transition-colors ${
                        saved ? "bg-primary/20 border-primary text-primary" : "border-border text-muted-foreground hover:text-primary hover:border-primary/40"
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <h3 className="display-font text-lg font-bold leading-tight mb-1">{j.title}</h3>
                  <p className="text-primary font-semibold text-sm mb-1">{j.company}</p>
                  <p className="text-xs text-muted-foreground mb-5 flex items-center gap-1">
                    {j.type === "Full-time" ? t.dashboard.fullTime : j.type === "Internship" ? t.dashboard.internship : t.dashboard.coop} · <MapPin className="w-3 h-3" /> {j.location}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border/50">
                    <span className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                      {j.category}
                    </span>
                  </div>
                </article>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-16">{t.explore.noResults}</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const FilterSelect = ({
  value,
  onChange,
  options,
  t,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  t: any;
}) => {
  const getLabel = (val: string) => {
    if (val === "All Categories") return t.explore.filter;
    if (val === "All Types") return t.dashboard.type;
    if (val === "All Locations") return t.dashboard.location;
    if (val === "Full-time") return t.dashboard.fullTime;
    if (val === "Internship") return t.dashboard.internship;
    if (val === "Co-op") return t.dashboard.coop;
    return val;
  };

  return (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-muted/40 border border-border rounded-full px-5 pr-9 h-10 text-xs font-medium hover:border-primary/40 transition-colors cursor-pointer"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {getLabel(o)}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">
      ▼
    </span>
  </div>
);
};

export default Explore;
