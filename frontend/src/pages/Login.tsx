import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/store/user";
import { useLang } from "@/i18n/LanguageContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

const Login = () => {
  const { signIn, user } = useUser();
  const { t } = useLang();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [pendingNav, setPendingNav] = useState(false);

  useEffect(() => {
    if (pendingNav && user) {
      setPendingNav(false);
      nav("/dashboard");
    }
  }, [user, pendingNav, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { token, profile } = await api.login(form.email, form.password);
      signIn(profile, token);
      setPendingNav(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.auth.login.loginFailed;
      if (msg.toLowerCase().includes("verified")) {
        toast.error(t.auth.login.notVerified);
        nav("/verify", { state: { email: form.email } });
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title={t.auth.login.title} subtitle={t.auth.login.subtitle}>
      <SocialButtons />
      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex-1 h-px bg-border" /> {t.auth.login.or} <div className="flex-1 h-px bg-border" />
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.auth.login.email}</label>
          <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="h-12 rounded-xl" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.auth.login.password}</label>
          <Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="h-12 rounded-xl" />
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
          {submitting ? t.auth.login.loggingIn : t.auth.login.submit}
        </Button>
      </form>
      <p className="mt-6 text-sm text-center text-muted-foreground">
        {t.auth.login.noAccount} <Link to="/signup" className="text-primary font-semibold hover:underline">{t.auth.login.signup}</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
