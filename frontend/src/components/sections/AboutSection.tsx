import { useLang } from "@/i18n/LanguageContext";
import { Target, Eye, Users } from "lucide-react";
import { CurvedCorner, CurvedPattern } from "@/components/decor/CurvedShapes";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// Target: May 19, 2026 12:00 PM Riyadh time (UTC+3) => 2026-05-19T09:00:00Z
const TARGET_MS = Date.UTC(2026, 4, 19, 9, 0, 0);

const useCountdown = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, TARGET_MS - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
};

const AboutSection = () => {
  const { lang } = useLang();
  const ar = lang === "ar";
  const { days, hours, minutes, seconds } = useCountdown();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const [stats, setStats] = useState({ fintechCompanies: 0, opportunities: 0, attendees: 0 });

  useEffect(() => {
    api.getStats().then((s) => setStats({ fintechCompanies: s.fintechCompanies, opportunities: s.opportunities, attendees: s.attendees })).catch(() => {});
  }, []);

  return (
    <section id="about" className="scroll-mt-32">
      <div className="section-pad relative overflow-hidden">
        <CurvedCorner corner="tr" size={520} opacity={0.5} />
        <CurvedCorner corner="bl" size={380} opacity={0.3} />
        <div className="relative max-w-5xl mx-auto text-center">
          <span className="text-xs font-bold tracking-widest text-primary">{ar ? "عن المنصة" : "ABOUT US"}</span>
          <h2 className="display-font text-5xl md:text-7xl font-bold mt-4 mb-6">
            {ar ? "نربط الابتكار" : "Connecting Innovation"} <span className="text-gradient">{ar ? "بالفرص" : "with Opportunity"}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {ar
              ? "روافد فنتك هي المنصة الرائدة في المملكة لربط شركات التقنية المالية بالكفاءات الواعدة والشركاء الاستراتيجيين."
              : "Rawafed Fintech is the Kingdom's leading platform connecting fintech companies with promising talent and strategic partners."}
          </p>
        </div>
      </div>

      <div className="section-pad">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          {[
            { Icon: Target, title: ar ? "رسالتنا" : "Our Mission", body: ar ? "تمكين الجيل القادم من قادة الفنتك في المملكة." : "Empowering the next generation of fintech leaders in the Kingdom." },
            {
              Icon: Eye,
              title: ar ? "رؤيتنا" : "Our Vision",
              body: ar ? (
                <>
                  بدأت روافد فنتك كرؤية مشتركة بين طالبتين: جود المتخصصة في المالية، والعنود المتخصصة في نظم المعلومات الإدارية؛ حيث جمعتهما الرغبة في ابتكار كيان ذي قيمة يدمج بين عالمي المال والتقنية.
                  {"\n\n"}
                  بالتعاون مع{" "}
                  <a
                    href="https://www.linkedin.com/in/muhannad-alharbi-56b888347?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#29f598] hover:underline [text-shadow:0_0_8px_#29f598]"
                  >
                    نادي الماليه
                  </a>
                  {" و"}
                  <a
                    href="https://www.linkedin.com/in/jumanah-alorayyidh-694451288?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#29f598] hover:underline [text-shadow:0_0_8px_#29f598]"
                  >
                    نادي تيكنيشن
                  </a>
                  ، نمت هذه المبادرة إلى منصة أوسع تمكّن الطلاب من خلال الابتكار، والقيادة، والتعاون بين التخصصات.
                  {"\n\n"}
                  استلهاماً من النمو المتسارع لقطاع التقنية المالية، أنشأنا هذا المشروع ليكون رمزاً للابتكار، والطموح، وقوة الشباب. هدفنا هو إلهام الطلاب، وتحفيز الإبداع، وخلق فرص واعدة لقادة المستقبل.
                  {"\n\n"}
                  بالنسبة لنا، روافد فنتك هي أكثر من مجرد مشروع؛ إنها انعكاس للشغف والنمو، وإيمان راسخ بأن الطلاب قادرون على ابتكار أفكار تترك أثراً حقيقياً وملموساً.
                  {"\n"}
                  نظم المعلومات الإدارية:{" "}
                  <a
                    href="https://www.linkedin.com/in/alanoud-alqahtani338?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#29f598] hover:underline [text-shadow:0_0_8px_#29f598]"
                  >
                    العنود القحطاني
                  </a>
                  {"\n"}
                  المالية والاستثمار:{" "}
                  <a
                    href="https://www.linkedin.com/in/joud-altrise-462621233?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#29f598] hover:underline [text-shadow:0_0_8px_#29f598]"
                  >
                    جود الطريسي
                  </a>
                </>
              ) : (
                <>
                  Rawafed FinTech began as a shared vision between two students, Joud in Finance and Alanoud in Management Information Systems, who wanted to create something meaningful by combining finance and technology.
                  {"\n\n"}
                  In collaboration with the{" "}
                  <a
                    href="https://www.linkedin.com/in/muhannad-alharbi-56b888347?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#29f598] hover:underline [text-shadow:0_0_8px_#29f598]"
                  >
                    Finance Club
                  </a>
                  {" and "}
                  <a
                    href="https://www.linkedin.com/in/jumanah-alorayyidh-694451288?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#29f598] hover:underline [text-shadow:0_0_8px_#29f598]"
                  >
                    TechNation Club
                  </a>
                  , this initiative grew into a broader platform that empowers students through innovation, leadership, and cross-disciplinary collaboration.
                  {"\n\n"}
                  Inspired by the rapid growth of fintech, we built this project to represent innovation, ambition, and the power of youth. Our goal is to inspire students, encourage creativity, and create opportunities for future leaders.
                  {"\n\n"}
                  For us, Rawafed FinTech is more than a project. It is a reflection of passion, growth, and the belief that students can create ideas that make a real impact.
                  {"\n"}
                  MIS:{" "}
                  <a
                    href="https://www.linkedin.com/in/alanoud-alqahtani338?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#29f598] hover:underline [text-shadow:0_0_8px_#29f598]"
                  >
                    Alanoud Alqahtani
                  </a>
                  {"\n"}
                  Finance and Investment:{" "}
                  <a
                    href="https://www.linkedin.com/in/joud-altrise-462621233?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#29f598] hover:underline [text-shadow:0_0_8px_#29f598]"
                  >
                    Joud Altrise
                  </a>
                </>
              ),
            },
            { Icon: Users, title: ar ? "قيمنا" : "Our Values", body: ar ? "الابتكار، الشفافية، والتعاون من أجل مستقبل مالي أفضل." : "Innovation, transparency, and collaboration for a better financial future." },
          ].map((c, i) => (
            <div key={i} className="glow-card rounded-3xl p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-6">
                <c.Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="display-font text-2xl font-bold mb-3">{c.title}</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section-pad relative overflow-hidden">
        <CurvedPattern opacity={0.05} />
        <div className="relative max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { v: stats.fintechCompanies > 0 ? `${stats.fintechCompanies}+` : "...", l: ar ? "شركة فنتك" : "Fintech Companies" },
            { v: stats.opportunities > 0 ? `${stats.opportunities}+` : "...", l: ar ? "فرصة عمل" : "Opportunities" },
            {
              countdown: true,
              l: ar ? "العد التنازلي حتى ١٨-١٩ مايو" : "Countdown to May 18-19",
            },
            { v: stats.attendees > 0 ? `${stats.attendees}+` : "...", l: ar ? "حضور" : "Attendees" },
          ].map((s: any, i) => (
            <div key={i}>
              {s.countdown ? (
                <div className="display-font font-bold text-gradient mb-2 flex items-end justify-center gap-1.5 md:gap-2 leading-none" dir="ltr">
                  {[
                    { v: days, lbl: ar ? "ي" : "D" },
                    { v: hours, lbl: ar ? "س" : "H" },
                    { v: minutes, lbl: ar ? "د" : "M" },
                    { v: seconds, lbl: ar ? "ث" : "S" },
                  ].map((u, k) => (
                    <div key={k} className="flex flex-col items-center">
                      <span className="text-2xl md:text-4xl tabular-nums">{pad(u.v)}</span>
                      <span className="text-[9px] md:text-[10px] text-muted-foreground font-medium tracking-widest mt-1">{u.lbl}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="display-font text-5xl md:text-6xl font-bold text-gradient mb-2">{s.v}</div>
              )}
              <div className="text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
