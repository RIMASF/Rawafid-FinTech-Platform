import { Link } from "react-router-dom";
import logo from "@/assets/rawafed-logo.png";
import { ReactNode } from "react";
import { CurvedCorner } from "@/components/decor/CurvedShapes";
import { useLang } from "@/i18n/LanguageContext";

export const AuthLayout = ({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) => {
  const { t } = useLang();
  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
      {/* Decorative side */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-primary/15 via-background to-background p-12 flex-col justify-between border-r border-border">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Rawafed Fintech" className="h-8 md:h-12 w-auto object-contain opacity-100" />
        </Link>

        <div className="my-auto relative z-10 -translate-y-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-primary">{t.auth.layout.kicker}</span>
          </div>
          <h2 className="display-font text-5xl font-bold leading-tight mb-4">
            {t.auth.layout.title1} <span className="text-gradient">{t.auth.layout.title2}</span> {t.auth.layout.title3}
          </h2>
          <p className="text-muted-foreground max-w-md">
            {t.auth.layout.desc}
          </p>
          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
            <div><div className="text-2xl font-bold text-foreground">20+</div>{t.auth.layout.stats.partners}</div>
            <div><div className="text-2xl font-bold text-foreground">300+</div>{t.auth.layout.stats.opportunities}</div>
            <div><div className="text-2xl font-bold text-foreground">{t.auth.layout.stats.days}</div>{t.auth.layout.stats.location}</div>
          </div>
        </div>

        <CurvedCorner corner="br" size={520} opacity={0.55} />
        <CurvedCorner corner="tl" size={320} opacity={0.25} />
      </div>

      {/* Form side */}
      <div className="flex flex-col items-center justify-start lg:justify-center p-6 md:p-12 pt-8 relative overflow-hidden min-h-screen lg:min-h-0">
        <CurvedCorner corner="br" size={360} opacity={0.3} className="hidden lg:block" />
        <Link to="/" className="lg:hidden flex items-center mb-6 self-start">
          <img src={logo} alt="Rawafed Fintech" className="h-10 w-auto object-contain" />
        </Link>
        <div className="w-full max-w-md">
          <h1 className="display-font text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-muted-foreground mb-8">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};
