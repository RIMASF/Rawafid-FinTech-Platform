import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LanguageContext";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { CurvedCorner } from "@/components/decor/CurvedShapes";

const ContactSection = () => {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <section id="contact" className="scroll-mt-32 section-pad relative overflow-hidden">
      <CurvedCorner corner="tl" size={460} opacity={0.45} />
      <CurvedCorner corner="br" size={520} opacity={0.5} />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-primary">{ar ? "تواصل" : "CONTACT"}</span>
          <h2 className="display-font text-3xl sm:text-5xl md:text-7xl font-bold mt-4">
            {ar ? "تواصل " : "Get in "}<span className="text-gradient">{ar ? "معنا" : "Touch"}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-8">
          <div className="space-y-4">
            {[
              { Icon: Mail, label: "Email", value: "rawafedfintech@gmail.com" },
              { Icon: Phone, label: "Phone", value: "+966 53 126 5813 +966 53 690 8999" },
              { Icon: MapPin, label: ar ? "العنوان" : "Address", value: ar ? "الرياض، السعودية" : "Riyadh, Saudi Arabia" },
            ].map((c, i) => (
              <div key={i} className="glow-card rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                  <c.Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                  <div className="font-semibold text-sm">{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); toast.success(ar ? "تم إرسال رسالتك!" : "Message sent!"); }}
            className="glow-card rounded-3xl p-5 md:p-8 space-y-4"
          >
            <input className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none transition-colors" placeholder={ar ? "الاسم" : "Name"} required />
            <input type="email" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none transition-colors" placeholder={ar ? "البريد الإلكتروني" : "Email"} required />
            <textarea rows={5} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none transition-colors resize-none" placeholder={ar ? "رسالتك" : "Your message"} required />
            <Button type="submit" variant="hero" size="lg" className="w-full">
              {ar ? "إرسال" : "Send Message"} <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
