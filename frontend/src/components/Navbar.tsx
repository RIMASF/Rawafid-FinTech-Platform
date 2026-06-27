import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";
import { useUser } from "@/store/user";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X, LayoutDashboard, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import logo from "@/assets/rawafed-logo.png";

const Navbar = () => {
  const { t, toggle, lang } = useLang();
  const { user, signOut } = useUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");

  // Hash for each nav link. "" = top of page (Hero).
  const links = [
    { hash: "", id: "home", label: t.nav.home },
    { hash: "about", id: "about", label: t.nav.about },
    { hash: "agenda", id: "agenda", label: t.nav.highlights },
    { hash: "partners", id: "partners", label: t.nav.partners },
    { hash: "opportunities", id: "opportunities", label: t.nav.explore },
    { hash: "contact", id: "contact", label: t.nav.contact },
    ...(user ? [{ hash: "__dashboard", id: "dashboard", label: t.dashboard.title, to: "/dashboard" as const }] : []),
  ];

  // ScrollSpy — only active on the home route.
  useEffect(() => {
    if (pathname !== "/") return;
    const sectionIds = ["about", "agenda", "partners", "opportunities", "contact"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const update = () => {
      const offset = 200; // accounts for sticky navbar
      const y = window.scrollY + offset;
      let current = "home";
      for (const sec of sections) {
        if (sec.offsetTop <= y) current = sec.id;
      }
      // Near bottom -> last section
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        current = sections[sections.length - 1]?.id ?? current;
      }
      // Near top -> home
      if (window.scrollY < 100) current = "home";
      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, hash: string) => {
    if (hash === "__dashboard") return; // let router navigate to /dashboard
    if (pathname !== "/") return; // let router handle cross-route nav
    e.preventDefault();
    setOpen(false);
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveId("home");
      // clear hash from URL
      if (window.location.hash) navigate("/", { replace: true });
      return;
    }
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 md:px-10 h-16 md:h-20 flex items-center justify-between gap-5">
        <Link to="/" onClick={(e) => handleNavClick(e, "")} className="flex items-center shrink-0">
          <img src={logo} alt="Rawafed Fintech" className="h-8 md:h-10 w-auto object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = activeId === l.id;
            const to = (l as any).to ? (l as any).to : l.hash ? `/#${l.hash}` : "/";
            return (
              <Link
                key={l.id}
                to={to}
                onClick={(e) => handleNavClick(e, l.hash)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {l.label}
                {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-primary rounded-full shadow-glow" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-border hover:border-primary/50 text-xs font-medium transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === "en" ? "AR" : "EN"}
          </button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border hover:border-primary/50 transition-colors">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                      {(user.firstName?.[0] || "") + (user.lastName?.[0] || "")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.firstName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-semibold">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-muted-foreground font-normal truncate">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  {t.dashboard.title}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserIcon className="w-4 h-4 mr-2" />
                  {t.profile.title}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                    navigate("/");
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.dashboard.signOut}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex">
              <Link to="/login">{t.nav.login}</Link>
            </Button>
          )}
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-xl">
          <nav className="flex flex-col p-4 gap-1">
            {links.map((l) => {
              const active = activeId === l.id;
              const to = (l as any).to ? (l as any).to : l.hash ? `/#${l.hash}` : "/";
              return (
                <Link
                  key={l.id}
                  to={to}
                  onClick={(e) => handleNavClick(e, l.hash)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium ${active ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                >
                  {l.label}
                </Link>
              );
            })}
            {user && (
              <>
                <div className="h-px bg-border my-1" />
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" /> {t.profile.title}
                </Link>
                <button
                  onClick={() => { signOut(); navigate("/"); setOpen(false); }}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-destructive text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> {t.dashboard.signOut}
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
