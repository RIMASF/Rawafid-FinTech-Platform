import { useLang } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/footer-logo.png";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const linkHrefs = ["/", "/#about", "/#partners", "/explore"];

const Footer = () => {
  const { t } = useLang();

  return (
    <footer className="bg-background text-foreground border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img
              src={logo}
              alt="Rawafed Fintech"
              className="h-20 md:h-28 w-auto object-contain mb-4 drop-shadow-[0_0_20px_hsl(var(--primary)/0.35)]"
            />
            <p className="text-xs leading-relaxed opacity-70">{t.footer.tagline}</p>
          </div>

          {/* Quick Links */}
          <div className="mt-6">
            <h4 className="text-primary font-bold text-sm mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2.5 text-xs opacity-80">
              {t.footer.links.map((label, i) => (
                <li key={i}>
                  <Link
                    to={linkHrefs[i] ?? "/"}
                    className="hover:text-primary hover:opacity-100 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Info */}
          <div className="mt-6">
            <h4 className="text-primary font-bold text-sm mb-4">{t.footer.eventInfo}</h4>
            <ul className="space-y-3 text-xs opacity-80">
              <li className="flex items-start gap-2">
                <Calendar className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                <span>{t.footer.eventDate}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                <span>{t.footer.eventVenue}</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="mt-6">
            <h4 className="text-primary font-bold text-sm mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3 text-xs opacity-80">
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                <a
                  href="mailto:info@rawafedfintech.com"
                  className="hover:text-primary hover:opacity-100 transition-colors break-all"
                >
                  info@rawafedfintech.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                <div className="space-y-1">
                  <a href="tel:+966531265813" className="block hover:text-primary hover:opacity-100 transition-colors">
                    +966 53 126 5813
                  </a>
                  <a href="tel:+966536908999" className="block hover:text-primary hover:opacity-100 transition-colors">
                    +966 53 690 8999
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="mt-6">
            <h4 className="text-primary font-bold text-sm mb-4">{t.footer.followUs}</h4>
            <div className="flex gap-2">
              <a
                href="https://x.com/RawafedFintech?s=20"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 hover:text-primary transition-all"
              >
                <XIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/%D8%B1%D9%88%D8%A7%D9%81%D8%AF-%D9%81%D9%86%D8%AA%D9%83/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 hover:text-primary transition-all"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-wrap justify-between gap-4 text-xs opacity-60">
          <span>{t.footer.rights}</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary hover:opacity-100 transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-primary hover:opacity-100 transition-colors">{t.footer.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
