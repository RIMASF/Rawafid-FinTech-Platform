import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@/store/user";
import { useLang } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Building2, GraduationCap, Pencil, X } from "lucide-react";
import { api } from "@/lib/api";

const UNIVERSITIES = [
  { en: "King Saud University", ar: "جامعة الملك سعود" },
  { en: "Imam Mohammad Ibn Saud Islamic University", ar: "جامعة الإمام محمد بن سعود الإسلامية" },
  { en: "Princess Nourah Bint Abdulrahman University", ar: "جامعة الأميرة نورة بنت عبد الرحمن" },
  { en: "King Saud bin Abdulaziz University for Health Sciences", ar: "جامعة الملك سعود بن عبد العزيز للعلوم الصحية" },
  { en: "Saudi Electronic University", ar: "الجامعة السعودية الإلكترونية" },
  { en: "Naif Arab University for Security Sciences", ar: "جامعة نايف العربية للعلوم الأمنية" },
  { en: "Alfaisal University", ar: "جامعة الفيصل" },
  { en: "Prince Sultan University", ar: "جامعة الأمير سلطان" },
  { en: "Dar Al Uloom University", ar: "جامعة دار العلوم" },
  { en: "Riyadh Elm University", ar: "جامعة رياض العلم" },
  { en: "Al Yamamah University", ar: "جامعة اليمامة" },
  { en: "Arab Open University", ar: "الجامعة العربية المفتوحة" },
  { en: "Al-Farabi Colleges", ar: "كليات الفارابي" },
  { en: "Almaarefa University", ar: "جامعة المعرفة" },
];

const LEVELS = [
  { value: "level-1-2", en: "Level 1 - 2 (First Year)", ar: "السنة الأولى" },
  { value: "level-3-4", en: "Level 3 - 4 (Second Year)", ar: "السنة الثانية" },
  { value: "level-5-6", en: "Level 5 - 6 (Third Year)", ar: "السنة الثالثة" },
  { value: "level-7-8", en: "Level 7 - 8 (Fourth Year)", ar: "السنة الرابعة" },
  { value: "level-9-10", en: "Level 9 - 10 (Fifth Year)", ar: "السنة الخامسة" },
  { value: "graduate", en: "Graduate", ar: "خريج" },
];

const Profile = () => {
  const { user, token, signIn, signOut } = useUser();
  const { t, lang } = useLang();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });

  const setField = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      toast({ title: t.profile.missingFields, description: t.profile.nameEmailRequired, variant: "destructive" as any });
      return;
    }
    if (user.role === "student" && (!form.university || !form.gradYear || !form.major?.trim())) {
      toast({ title: t.profile.missingAcademic, description: t.profile.academicRequired, variant: "destructive" as any });
      return;
    }
    try {
      if (token) {
        const updated = await api.updateProfile(token, form);
        signIn(updated);
      } else {
        signIn(form);
      }
      setEditing(false);
      toast({ title: t.profile.profileUpdated, description: t.profile.informationSaved });
    } catch (err: unknown) {
      const e = err as Error & { status?: number };
      if (e.status === 401) {
        signOut();
        navigate("/login");
        return;
      }
      toast({ title: t.profile.error, description: e.message || t.profile.couldNotSave, variant: "destructive" as any });
    }
  };

  const cancel = () => {
    setForm({ ...user });
    setEditing(false);
  };

  const levelLabel = LEVELS.find((l) => l.value === form.gradYear)?.en ?? form.gradYear ?? "—";

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Brand fluid background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-30"
             style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.5), transparent 70%)" }} />
        <div className="absolute top-1/3 -right-32 w-[520px] h-[520px] rounded-full blur-3xl opacity-25"
             style={{ background: "radial-gradient(circle, #29f598, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full blur-3xl opacity-20"
             style={{ background: "radial-gradient(circle, #05423a, transparent 70%)" }} />
      </div>

      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 md:px-10 py-10 md:py-16">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {t.profile.backToDashboard}
        </button>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="display-font text-3xl md:text-4xl font-bold mb-2">
              {t.profile.title}
            </h1>
            <p className="text-muted-foreground">
              {editing ? t.auth.signup.creatingAccount : t.profile.title}
            </p>
          </div>
          {!editing && (
            <Button onClick={() => setEditing(true)} variant="hero" className="rounded-full gap-2">
              <Pencil className="w-4 h-4" /> {t.profile.edit}
            </Button>
          )}
        </div>

        <form onSubmit={onSave} className="glow-card rounded-2xl p-6 md:p-8 space-y-5 backdrop-blur-sm">
          {/* Full name */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t.profile.firstName}</Label>
              <Input id="firstName" value={form.firstName} onChange={setField("firstName")} disabled={!editing} required className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t.profile.lastName}</Label>
              <Input id="lastName" value={form.lastName} onChange={setField("lastName")} disabled={!editing} required className="h-12 rounded-xl" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.login.email}</Label>
            <Input id="email" type="email" value={form.email} onChange={setField("email")} disabled={!editing} required className="h-12 rounded-xl" />
          </div>

          {/* Optional gender + linkedin */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">{t.auth.signup.gender}</Label>
              <Input id="gender" value={form.gender} onChange={setField("gender")} disabled={!editing} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">{t.auth.signup.linkedin}</Label>
              <Input id="linkedin" value={form.linkedin || ""} onChange={setField("linkedin")} disabled={!editing} placeholder="https://linkedin.com/in/..." className="h-12 rounded-xl" />
            </div>
          </div>

          {user.role === "student" ? (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">{t.auth.signup.studentId}</Label>
                  <Input id="studentId" value={form.studentId || ""} onChange={setField("studentId")} disabled={!editing} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">{t.auth.signup.major}</Label>
                  <Input id="major" value={form.major || ""} onChange={setField("major")} disabled={!editing} required placeholder={lang === "ar" ? "مثال: نظم المعلومات" : "e.g. Information Systems"} className="h-12 rounded-xl" />
                </div>
              </div>

              {/* University */}
              <div className="space-y-2">
                <Label>{t.auth.signup.university}</Label>
                {editing ? (
                  <Select value={form.university || ""} onValueChange={(v) => setForm((f) => ({ ...f, university: v }))}>
                    <SelectTrigger className="h-12 rounded-xl pl-11 relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                      <SelectValue placeholder={lang === "ar" ? "اختر جامعتك" : "Select your university / college"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {UNIVERSITIES.map((u) => (
                        <SelectItem
                          key={u.en}
                          value={u.en}
                          className="group py-2.5 focus:bg-primary/15 focus:text-foreground data-[state=checked]:text-foreground"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{lang === "ar" ? u.ar : u.en}</span>
                            <span dir="rtl" className="text-xs text-muted-foreground group-focus:text-foreground group-data-[state=checked]:text-foreground">
                              {u.ar}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={form.university || "—"} disabled className="h-12 rounded-xl" />
                )}
              </div>

              {/* Academic Level */}
              <div className="space-y-2">
                <Label>{t.profile.graduationLevel}</Label>
                {editing ? (
                  <Select value={form.gradYear || ""} onValueChange={(v) => setForm((f) => ({ ...f, gradYear: v }))}>
                    <SelectTrigger className="h-12 rounded-xl pl-11 relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                      <SelectValue placeholder={lang === "ar" ? "اختر مستواك الأكاديمي" : "Select your current academic level"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {LEVELS.map((lvl) => (
                        <SelectItem
                          key={lvl.value}
                          value={lvl.value}
                          className="group py-2.5 focus:bg-primary/15 focus:text-foreground data-[state=checked]:text-foreground"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{lang === "ar" ? lvl.ar : lvl.en}</span>
                            <span dir="rtl" className="text-xs text-muted-foreground group-focus:text-foreground group-data-[state=checked]:text-foreground">
                              {lvl.ar}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={levelLabel} disabled className="h-12 rounded-xl" />
                )}
              </div>
            </>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">{t.auth.signup.jobTitle}</Label>
                <Input id="jobTitle" value={form.jobTitle || ""} onChange={setField("jobTitle")} disabled={!editing} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">{t.auth.signup.yearsExperience}</Label>
                <Input id="yearsExperience" value={form.yearsExperience || ""} onChange={setField("yearsExperience")} disabled={!editing} className="h-12 rounded-xl" />
              </div>
            </div>
          )}

          {editing && (
            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="hero" size="lg" className="flex-1">{t.profile.save}</Button>
              <Button type="button" variant="outline" size="lg" className="rounded-full gap-2" onClick={cancel}>
                <X className="w-4 h-4" /> {t.profile.cancel}
              </Button>
            </div>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
