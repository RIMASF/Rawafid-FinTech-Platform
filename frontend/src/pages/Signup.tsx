import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { IconInput, IconSelect } from "@/components/auth/IconInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/i18n/LanguageContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Check, GraduationCap, Briefcase, Building2, User } from "lucide-react";
import profileIcon from "@/assets/icons/profile.svg";
import genderIcon from "@/assets/icons/gender.svg";

type Role = "student" | "employee" | "other" | "";

const Signup = () => {
  const nav = useNavigate();
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [pwError, setPwError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    role: "" as Role,
    firstName: "",
    lastName: "",
    gender: "Female",
    email: "",
    password: "",
    confirmPassword: "",
    linkedin: "",
    phone: "",
    // student
    studentId: "",
    university: "",
    major: "",
    gradYear: "",
    // employee
    jobTitle: "",
    yearsExperience: "",
  });

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const next = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) {
      if (!form.role) return;
      setStep(1);
      return;
    }
    if (step === 1) {
      if (form.password.length < 8) {
        setPwError(t.auth.signup.passwordMin);
        return;
      }
      if (form.password !== form.confirmPassword) {
        setPwError(t.auth.signup.passwordMismatch);
        return;
      }
      if (!/^\d{9}$/.test(form.phone)) {
        setPwError(t.auth.signup.phoneInvalid);
        return;
      }
      setPwError("");
      // "Other" has no role-specific details — submit directly
      if (form.role === "other") {
        await submitSignup();
        return;
      }
      setStep(2);
      return;
    }
    await submitSignup();
  };

  const submitSignup = async () => {
    setSubmitting(true);
    try {
      const { resent } = await api.signup({
        email: form.email,
        password: form.password,
        role: form.role,
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        phone: `+966${form.phone}`,
        linkedin: form.linkedin || undefined,
        studentId: form.role === "student" ? form.studentId : undefined,
        university: form.role === "student" ? form.university : undefined,
        major: form.role === "student" ? form.major : undefined,
        gradYear: form.role === "student" ? form.gradYear : undefined,
        jobTitle: form.role === "employee" ? form.jobTitle : undefined,
        yearsExperience: form.role === "employee" ? form.yearsExperience : undefined,
      });
      toast.success(resent ? t.auth.signup.verificationSent : t.auth.signup.verificationInitial);
      nav("/verify", { state: { email: form.email } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.auth.signup.accountCreationError;
      if (/password/i.test(msg)) {
        setPwError(msg);
        setStep(1);
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title={t.auth.signup.title} subtitle={t.auth.signup.subtitle}>
      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {t.auth.signup.steps.map((s, i) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < step ? "bg-primary text-primary-foreground"
              : i === step ? "bg-primary/20 text-primary border border-primary"
              : "bg-muted text-muted-foreground"
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < t.auth.signup.steps.length - 1 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <SocialButtons />
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> {t.auth.login.or} <div className="flex-1 h-px bg-border" />
          </div>
        </>
      )}

      <form onSubmit={next} className="space-y-4">
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              { value: "student", label: t.auth.signup.student, desc: t.auth.signup.studentDesc, Icon: GraduationCap },
              { value: "employee", label: t.auth.signup.employee, desc: t.auth.signup.employeeDesc, Icon: Briefcase },
              { value: "other", label: t.auth.signup.other, desc: t.auth.signup.otherDesc, Icon: User },
            ] as const).map((opt) => {
              const selected = form.role === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update("role", opt.value)}
                  className={`p-4 sm:p-6 rounded-2xl border text-left transition-all ${
                    selected
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <opt.Icon className={`w-6 h-6 sm:w-7 sm:h-7 mb-2 sm:mb-3 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="font-semibold text-sm sm:text-base">{opt.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        )}

        {step === 1 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <IconInput
                icon={profileIcon}
                label={t.auth.signup.firstName}
                required
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                placeholder="Nouf"
              />
              <IconInput
                icon={profileIcon}
                label={t.auth.signup.lastName}
                required
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                placeholder="Al-Saud"
              />
            </div>

            <IconSelect
              icon={genderIcon}
              label={t.auth.signup.gender}
              required
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
            >
              <option>{t.auth.signup.female}</option>
              <option>{t.auth.signup.male}</option>
            </IconSelect>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.auth.login.email}</label>
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className="h-12 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.auth.login.password}</label>
              <PasswordInput
                required
                minLength={8}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.auth.signup.confirm}</label>
              <PasswordInput
                required
                minLength={8}
                value={form.confirmPassword}
                onChange={(e) => {
                  update("confirmPassword", e.target.value);
                  if (pwError) setPwError("");
                }}
                placeholder="Re-enter your password"
              />
              {pwError && <p className="text-xs text-destructive mt-1.5">{pwError}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.auth.signup.phone}</label>
              <div className="flex h-12 rounded-xl border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                <span className="flex items-center px-3 text-sm font-medium text-foreground bg-muted/40 border-r border-input select-none">
                  +966
                </span>
                <Input
                  type="tel"
                  required
                  inputMode="numeric"
                  pattern="\d{9}"
                  maxLength={9}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 9))}
                  placeholder="5XXXXXXXX"
                  className="h-full border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                {t.auth.signup.linkedin} <span className="text-muted-foreground/70">(optional)</span>
              </label>
              <Input
                type="url"
                value={form.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/your-handle"
                className="h-12 rounded-xl"
              />
            </div>
          </>
        )}

        {step === 2 && form.role === "student" && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.auth.signup.university}</label>
              <Select value={form.university} onValueChange={(v) => update("university", v)} required>
                <SelectTrigger className="h-12 rounded-xl pl-11 relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                  <SelectValue placeholder="Select your university / college" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {[
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
                  ].map((u) => (
                    <SelectItem
                      key={u.en}
                      value={u.en}
                      className="group py-2.5 focus:bg-primary/15 focus:text-foreground data-[state=checked]:text-foreground"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{u.en}</span>
                        <span
                          dir="rtl"
                          className="text-xs text-muted-foreground group-focus:text-foreground group-data-[state=checked]:text-foreground"
                        >
                          {u.ar}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.auth.signup.major}</label>
              <Input
                required
                value={form.major}
                onChange={(e) => update("major", e.target.value)}
                placeholder="e.g. Information Systems"
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.auth.signup.gradYear}</label>
              <Select value={form.gradYear} onValueChange={(v) => update("gradYear", v)} required>
                <SelectTrigger className="h-12 rounded-xl pl-11 relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                  <SelectValue placeholder="Select your current academic level" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {[
                    { value: "level-1-2", en: "Level 1 - 2 (First Year)", ar: "السنة الأولى" },
                    { value: "level-3-4", en: "Level 3 - 4 (Second Year)", ar: "السنة الثانية" },
                    { value: "level-5-6", en: "Level 5 - 6 (Third Year)", ar: "السنة الثالثة" },
                    { value: "level-7-8", en: "Level 7 - 8 (Fourth Year)", ar: "السنة الرابعة" },
                    { value: "level-9-10", en: "Level 9 - 10 (Fifth Year)", ar: "السنة الخامسة" },
                    { value: "graduate", en: "Graduate", ar: "خريج" },
                  ].map((lvl) => (
                    <SelectItem
                      key={lvl.value}
                      value={lvl.value}
                      className="group py-2.5 focus:bg-primary/15 focus:text-foreground data-[state=checked]:text-foreground"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{lvl.en}</span>
                        <span
                          dir="rtl"
                          className="text-xs text-muted-foreground group-focus:text-foreground group-data-[state=checked]:text-foreground"
                        >
                          {lvl.ar}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {step === 2 && form.role === "employee" && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.auth.signup.jobTitle}</label>
              <Input
                required
                value={form.jobTitle}
                onChange={(e) => update("jobTitle", e.target.value)}
                placeholder="e.g. Product Manager"
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.auth.signup.yearsExperience}</label>
              <Input
                type="number"
                required
                min={0}
                max={60}
                value={form.yearsExperience}
                onChange={(e) => update("yearsExperience", e.target.value)}
                placeholder="5"
                className="h-12 rounded-xl"
              />
            </div>
          </>
        )}


        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 rounded-full"
              onClick={() => setStep(step - 1)}
            >
              {t.auth.signup.back}
            </Button>
          )}
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="flex-1"
            disabled={(step === 0 && !form.role) || submitting}
          >
            {step === 2 || (step === 1 && form.role === "other") ? (submitting ? t.auth.signup.creatingAccount : t.auth.signup.submit) : t.auth.signup.next}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-sm text-center text-muted-foreground">
        {t.auth.signup.accountExists}{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          {t.auth.login.submit}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
