import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Event = {
  id: string;
  type: string;
  title: { en: string; ar: string };
  speaker?: { en: string; ar: string };
  role?: { en: string; ar: string };
  time: string;
  speakerImage?: string;
  formLink?: string;
};

const DAY1_EVENTS: Event[] = [
  {
    id: "d1-1",
    type: "Reception",
    time: "12:00 – 1:20",
    title: { en: "Reception & Registration", ar: "الاستقبال والتسجيل" },
  },
  {
    id: "d1-2",
    type: "Launching",
    time: "1:30 – 2:00",
    title: { en: "Rawafed Fintech Exhibition Launch", ar: "تدشين معرض روافد فنتك" },
  },
  {
    id: "d1-3",
    type: "Workshop",
    time: "1:30 – 2:10",
    title: { en: "Emotional Intelligence in the Workplace", ar: "الذكاء العاطفي في بيئة العمل" },
    speaker: { en: "Ahmed Al-Suhaim", ar: "احمد السحيم" },
    role: { en: "Senior Quality and Training Monitor", ar: "كبير مراقبة جودة وتدريب" },
  },
  {
    id: "d1-4",
    type: "Talk session",
    time: "2:05 – 2:50",
    title: { en: "The Importance of Technology in Raising Financial Awareness", ar: "أهمية التقنية في رفع الوعي المالي" },
    speaker: { en: "Dr. Mohammed Makni", ar: "د.محمد مكني" },
    role: { en: "Dean of Business College", ar: "عميد كلية الأعمال" },
  },
  {
    id: "d1-5",
    type: "Workshop",
    time: "2:15 – 2:55",
    title: { en: "From Idea to First Sale", ar: "من فكرة إلى اول بيع" },
    speaker: { en: "Ibrahim Majrashi", ar: "ابراهيم مجرشي" },
    role: { en: "Account Manager at Zid", ar: "account manager شركة زد" },
  },
  {
    id: "d1-6",
    type: "Talk session",
    time: "2:55 – 3:40",
    title: { en: "Infrastructure of Fintech in Saudi Arabia", ar: "البنية التحتية للتقنية المالية في السعودية" },
    speaker: { en: "Eng. Mohammed Al-Mujtaba", ar: "م. محمد المجتبى" },
    role: { en: "Senior Infrastructure Engineer at Ebra AI", ar: "مهندس أول في مجال البنية التحتية والتطوير والتشغيل لدى شركة Ebra AI" },
  },
  {
    id: "d1-7",
    type: "Workshop",
    time: "3:45 – 4:25",
    title: { en: "How to Build Your Career in FinTech?", ar: "كيف تبني مسارك المهني في الفنتك؟" },
    speaker: { en: "Yousef Al-Mutairi", ar: "يوسف المطيري" },
    role: { en: "Senior Product Manager at Tamara", ar: "مدير منتجات أول لتمارا" },
  },
  {
    id: "d1-8",
    type: "Talk session",
    time: "3:45 – 4:30",
    title: { en: "What is FinTech and What are the Growth Opportunities in the Local Market?", ar: "ما هي التقنية المالية فعلياً وما هي فرص النمو في السوق المحلي؟" },
    speaker: { en: "Abdullah Al-Harthi", ar: "عبدالله الحارثي" },
    role: { en: "CEO at Mutaahhidoun", ar: "CEO شركة متعهدون" },
  },
  {
    id: "d1-10",
    type: "Talk session",
    time: "4:35 – 5:20",
    title: { en: "Sell like pro", ar: "بع كالمحترف" },
    speaker: { en: "Abdullah Al-Sharif", ar: "عبدالله الشريف" },
    role: { en: "Strategy Manager", ar: "مدير الاستراتيجية" },
  },
  {
    id: "d1-11",
    type: "Workshop",
    time: "5:15 – 5:55",
    title: { en: "FinTech at Misk Foundation", ar: "التقنية المالية بمسك الخيريه" },
    speaker: { en: "Hamed Al-Otaibi", ar: "حامد العتيبي" },
    role: { en: "Chairman of Darb Al-Istidama", ar: "رئيس مجلس امناء مؤسسه درب الاستدامة الاهليه" },
  },
  {
    id: "d1-12",
    type: "Talk session",
    time: "5:25 – 6:10",
    title: { en: "The Future of FinTech in the Kingdom", ar: "مستقبل التقنية المالية في المملكة" },
    speaker: { en: "Falak", ar: "شركة فلك" },
    role: { en: "Falak Speaker", ar: "شركة فلك" },
  },
  {
    id: "d1-13",
    type: "Talk session",
    time: "6:15 – 7:00",
    title: { en: "Open Source Software: From Collective Innovation to Leading the Financial Revolution", ar: "البرمجيات مفتوحة المصدر: من الابتكار الجماعي إلى قيادة الثورة المالية" },
    speaker: { en: "Khalid Al-Ghamdi", ar: "خالد الغامدي" },
    role: { en: "FOSS Technical Leader", ar: "قائد تقني البرمجيات الحرة و مفتوحة المصدر" },
  },
];

const DAY2_EVENTS: Event[] = [
  {
    id: "d2-1",
    type: "Reception",
    time: "12:00 – 1:20",
    title: { en: "Reception & Registration", ar: "الاستقبال والتسجيل" },
  },
  {
    id: "d2-2",
    type: "Talk session",
    time: "1:00 – 1:45",
    title: { en: "The Importance of Technology in Raising Financial Awareness", ar: "أهمية التقنية في رفع الوعي المالي" },
    speaker: { en: "Dr. Mohammed Makni", ar: "د.محمد مكني" },
    role: { en: "Dean of Business College", ar: "عميد كلية الأعمال" },
  },
  {
    id: "d2-3",
    type: "Workshop",
    time: "1:30 – 2:10",
    title: { en: "Leading Corporate Future through ERP and AI", ar: "قيادة المستقبل المؤسسي عبر ERP والذكاء الاصطناعي" },
    speaker: { en: "Majed Al-Hammadi", ar: "ماجد الحمادي" },
    role: { en: "Marketing & Corporate Communication Manager", ar: "مدير التسويق و الاتصال المؤسسي" },
    formLink: "https://forms.gle/hzJigavZjrhb94H39",
  },
  {
    id: "d2-4",
    type: "Talk session",
    time: "1:50 – 2:35",
    title: { en: "Infrastructure of Fintech in Saudi Arabia", ar: "البنية التحتية للتقنية المالية في السعودية" },
    speaker: { en: "Eng. Mohammed Al-Mujtaba", ar: "م. محمد المجتبى" },
    role: { en: "Senior Infrastructure Engineer at Ebra AI", ar: "مهندس أول في مجال البنية التحتية والتطوير والتشغيل لدى شركة Ebra AI" },
  },
  {
    id: "d2-5",
    type: "Workshop",
    time: "2:15 – 2:55",
    title: { en: "Emotional Intelligence in the Workplace", ar: "الذكاء العاطفي في بيئة العمل" },
    speaker: { en: "Ahmed Al-Suhaim", ar: "احمد السحيم" },
    role: { en: "Senior Quality and Training Monitor", ar: "كبير مراقبة جودة وتدريب" },
    formLink: "https://forms.gle/XyWnDeJvKS2rZmnw7",
  },
  {
    id: "d2-6",
    type: "Talk session",
    time: "2:40 – 3:25",
    title: { en: "M&A in the FinTech Sector", ar: "الاندماجات والاستحواذات في قطاع التقنية المالية" },
    speaker: { en: "Talal Al-Hogail & Dr. Abdullah Al-Salloum", ar: "طلال الحقيل و د. عبدالله السلوم" },
    role: { en: "M&A Managers & Finance Experts", ar: "إدارة الاندماجات و أستاذ المالية" },
  },
  {
    id: "d2-7",
    type: "Workshop",
    time: "3:00 – 3:40",
    title: { en: "From Idea to First Sale", ar: "من فكرة إلى اول بيع" },
    speaker: { en: "Ibrahim Majrashi", ar: "ابراهيم مجرشي" },
    role: { en: "Account Manager at Zid", ar: "account manager لشركة زد" },
    formLink: "https://forms.gle/aMbYNq44ASKrq6eC6",
  },
  {
    id: "d2-8",
    type: "Talk session",
    time: "3:30 – 4:15",
    title: { en: "Modern Payment Methods", ar: "وسائل الدفع الحديثة" },
    speaker: { en: "Abduljalil Al-Riyadh", ar: "عبدالجليل الرياض" },
    role: { en: "General Manager of Connection Products - ANB", ar: "مديرعام لمنتجات الربط - البنك العربي الوطني" },
  },
  {
    id: "d2-9",
    type: "Workshop",
    time: "3:45 – 4:25",
    title: { en: "How to Build Your Career in FinTech?", ar: "كيف تبني مسارك المهني في الفنتك؟" },
    speaker: { en: "Yousef Al-Mutairi", ar: "يوسف المطيري" },
    role: { en: "Senior Product Manager at Tamara", ar: "مدير منتجات أول لتمارا" },
    formLink: "https://forms.gle/5LKdPMCYDeFjnHkU7",
  },
  {
    id: "d2-10",
    type: "Talk session",
    time: "4:20 – 5:05",
    title: { en: "Sell like pro", ar: "بع كالمحترف" },
    speaker: { en: "Abdullah Al-Sharif", ar: "عبدالله الشريف" },
    role: { en: "Strategy Manager", ar: "مدير الاستراتيجية شركة الريادة الماسية" },
  },
  {
    id: "d2-11",
    type: "Talk session",
    time: "5:10 – 5:55",
    title: { en: "What is FinTech and What are the Growth Opportunities in the Local Market?", ar: "ما هي التقنية المالية فعلياً وما هي فرص النمو في السوق المحلي؟" },
    speaker: { en: "Abdullah Al-Harthi", ar: "عبدالله الحارثي" },
    role: { en: "CEO at Mutaahhidoun", ar: "CEO شركة متعهدون" },
  },
  {
    id: "d2-12",
    type: "Talk session",
    time: "6:00 – 6:45",
    title: { en: "What is FinTech and What are the Growth Opportunities in the Local Market?", ar: "ما هي التقنية المالية فعلياً وما هي فرص النمو في السوق المحلي؟" },
    speaker: { en: "Abdullah Al-Enezi", ar: "عبدالله العنزي" },
    role: { en: "Project Manager at Elm", ar: "مدير مشاريع في شركة عِلم" },
  },
  {
    id: "d2-13b",
    type: "Workshop",
    time: "6:00 – 6:40",
    title: { en: "Exploring the impact of PDPL in E-Business", ar: "استكشاف أثر نظام حماية البيانات الشخصية في التجارة الإلكترونية" },
    speaker: { en: "Ahmed Almalki", ar: "أحمد المالكي" },
    role: { en: "Cybersecurity Manager", ar: "مدير الأمن السيبراني" },
    formLink: "https://forms.gle/9vLAxqkr223irzUv6",
  },
  {
    id: "d2-13",
    type: "Talk session",
    time: "6:50 – 7:35",
    title: { en: "FinTech at Misk Foundation", ar: "التقنية المالية بمسك الخيريه" },
    speaker: { en: "Hamed Al-Otaibi", ar: "حامد العتيبي" },
    role: { en: "Chairman of Darb Al-Istidama", ar: "رئيس مجلس امناء مؤسسه درب الاستدامة الاهليه" },
  },
  {
    id: "d2-14",
    type: "Launching",
    time: "7:45 – 8:30",
    title: { en: "Rawafed Fintech Closing Ceremony", ar: "الحفل الختامي لروافد فنتك" },
  },
];

const TYPE_COLORS: Record<string, string> = {
  Workshop: "bg-primary/15 text-primary border-primary/30",
  "Talk session": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Reception: "bg-muted text-muted-foreground border-border",
  Launching: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const TYPE_AR: Record<string, string> = {
  Workshop: "ورشة عمل",
  "Talk session": "جلسة حوارية",
  Reception: "استقبال",
  Launching: "تدشين",
};

const ScheduleSection = () => {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [activeDay, setActiveDay] = useState<0 | 1>(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const events = activeDay === 0 ? DAY1_EVENTS : DAY2_EVENTS;

  return (
    <section id="agenda" className="scroll-mt-32">
      <div className="section-pad">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-primary">{ar ? "البرنامج" : "AGENDA"}</span>
            <h2 className="display-font text-3xl sm:text-5xl md:text-7xl font-bold mt-4 mb-4">
              {ar ? "يومان من" : "Two Days of"} <span className="text-gradient">{ar ? "الابتكار" : "Innovation"}</span>
            </h2>
            <p className="text-muted-foreground">
              {ar ? "اضغط على أي جلسة لاستكشاف التفاصيل والتسجيل." : "Click any session to view details and register."}
            </p>
          </div>

          {/* Day Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center p-1 bg-muted/50 border border-border/50 rounded-full">
              {[
                { label: ar ? "١٨ مايو · رجال" : "MAY 18 · Male", day: 0 },
                { label: ar ? "١٩ مايو · نساء" : "MAY 19 · Female", day: 1 },
              ].map(({ label, day }) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day as 0 | 1)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200",
                    activeDay === day
                      ? "bg-primary text-black shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div className="flex flex-col gap-2">
            {events.map((event) => {
              const isInteractive = !!event.speaker;
              const colorClass = TYPE_COLORS[event.type] || "bg-muted text-muted-foreground border-border";

              return (
                <div
                  key={event.id}
                  onClick={() => isInteractive && setSelectedEvent(event)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200",
                    isInteractive
                      ? "glow-card cursor-pointer hover:border-primary/40"
                      : "bg-muted/20 border-border/30 opacity-60"
                  )}
                >
                  {/* Time */}
                  <div className="font-mono text-xs text-muted-foreground shrink-0 w-16 text-center tabular-nums">
                    {event.time}
                  </div>

                  {/* Divider */}
                  <div className="w-px self-stretch bg-border shrink-0" />

                  {/* Type badge + Title + Speaker */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border self-start", colorClass)}>
                      {ar ? (TYPE_AR[event.type] || event.type) : event.type}
                    </span>
                    <p className="font-semibold text-sm leading-snug">{event.title[lang]}</p>
                    {event.speaker && (
                      <p className="text-xs text-muted-foreground">{event.speaker[lang]}</p>
                    )}
                  </div>

                  {/* Register badge or arrow */}
                  {isInteractive && (
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      {event.formLink && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {ar ? "تسجيل" : "Register"}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[420px] border-primary/20 bg-background/95 backdrop-blur-xl">
          {selectedEvent && (
            <div className="flex flex-col gap-5 pt-2">
              {/* Speaker */}
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-primary ring-offset-2 ring-offset-background shrink-0">
                  {selectedEvent.speakerImage && <img src={selectedEvent.speakerImage} alt={selectedEvent.speaker?.[lang]} className="object-cover" />}
                  <AvatarFallback className="bg-muted"><User className="h-6 w-6 text-muted-foreground" /></AvatarFallback>
                </Avatar>
                <div>
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mb-1 inline-flex", TYPE_COLORS[selectedEvent.type] || "")}>
                    {ar ? (TYPE_AR[selectedEvent.type] || selectedEvent.type) : selectedEvent.type}
                  </span>
                  <DialogTitle className="text-base font-bold leading-tight">{selectedEvent.speaker?.[lang]}</DialogTitle>
                  <p className="text-xs text-muted-foreground">{selectedEvent.role?.[lang]}</p>
                </div>
              </div>

              {/* Session info */}
              <div className="glow-card rounded-2xl p-4">
                <p className="font-semibold text-sm mb-2">{selectedEvent.title[lang]}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {activeDay === 0 ? (ar ? "١٨ مايو" : "May 18") : (ar ? "١٩ مايو" : "May 19")} · {selectedEvent.time}
                </p>
              </div>

              {/* Register button */}
              {selectedEvent.formLink && (
                <a
                  href={selectedEvent.formLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  {ar ? "سجّل الآن" : "Register Now"}
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ScheduleSection;
