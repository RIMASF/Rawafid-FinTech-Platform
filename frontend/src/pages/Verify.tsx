import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLang } from "@/i18n/LanguageContext";
import { toast } from "sonner";
import { Mail, Loader2, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { useUser } from "@/store/user";

const OTP_TTL_SECONDS = 10 * 60;

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
};

const Verify = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { t } = useLang();
  const email = (location.state as { email?: string } | null)?.email || "";
  const { signIn, user } = useUser();

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [expiresIn, setExpiresIn] = useState(OTP_TTL_SECONDS);
  const [pendingNav, setPendingNav] = useState(false);
  const autoSubmitted = useRef(false);

  useEffect(() => {
    if (!email) nav("/signup", { replace: true });
  }, [email, nav]);

  useEffect(() => {
    if (pendingNav && user) {
      setPendingNav(false);
      nav("/dashboard", { replace: true });
    }
  }, [user, pendingNav, nav]);

  useEffect(() => {
    if (expiresIn <= 0) return;
    const t = setInterval(() => setExpiresIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [expiresIn]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const verify = async (codeValue?: string) => {
    const token = codeValue ?? code;
    if (token.length !== 6 || submitting) return;
    setSubmitting(true);
    try {
      const { token: jwt, profile } = await api.verifyOtp(email, token);
      signIn(profile, jwt);
      toast.success(t.auth.verify.accountActivated);
      setPendingNav(true);
    } catch (err: unknown) {
      autoSubmitted.current = false;
      const msg = err instanceof Error ? err.message : t.auth.verify.invalidCode;
      const isExpired = (err as { status?: number }).status === 400 && msg.toLowerCase().includes("expired");
      if (isExpired) setExpiresIn(0);
      toast.error(msg);
      setCode("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (val: string) => {
    setCode(val);
    if (val.length === 6 && !autoSubmitted.current && !submitting && expiresIn > 0) {
      autoSubmitted.current = true;
      verify(val);
    }
  };

  const resend = async () => {
    if (cooldown > 0 || !email) return;
    setResending(true);
    try {
      await api.resendOtp(email);
      toast.success(t.auth.verify.resend);
      setCooldown(30);
      setExpiresIn(OTP_TTL_SECONDS);
      autoSubmitted.current = false;
      setCode("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t.auth.verify.invalidCode);
    } finally {
      setResending(false);
    }
  };

  const expired = expiresIn <= 0;

  return (
    <AuthLayout title={t.auth.verify.title} subtitle={t.auth.verify.subtitle}>
      <div className="flex flex-col items-center">
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
            <Mail className="h-7 w-7 text-primary" />
          </div>
        </div>
        {email && (
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm">
            <span className="truncate text-foreground/80">{email}</span>
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); verify(); }} className="space-y-5">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={handleChange} autoFocus disabled={expired || submitting}>
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} className="h-11 w-10 sm:h-14 sm:w-12 text-lg sm:text-xl" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-sm">
          <Clock className={`h-4 w-4 ${expired ? "text-destructive" : "text-muted-foreground"}`} />
          {expired ? (
            <span className="text-destructive font-medium">{t.auth.verify.codeExpired}</span>
          ) : (
            <span className="text-muted-foreground">
              {t.auth.verify.expiresIn} <span className="font-mono font-medium text-foreground">{formatTime(expiresIn)}</span>
            </span>
          )}
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={code.length !== 6 || submitting || expired}>
          {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.auth.verify.verifying}</> : t.auth.verify.activate}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          {t.auth.verify.didntGet}{" "}
          <button type="button" onClick={resend} disabled={cooldown > 0 || resending}
            className="text-primary font-semibold hover:underline disabled:opacity-50 disabled:no-underline">
            {cooldown > 0 ? `${t.auth.verify.resendIn} ${cooldown}s` : resending ? t.auth.verify.sending : t.auth.verify.resend}
          </button>
        </div>
      </form>

      <p className="mt-6 text-sm text-center text-muted-foreground">
        {t.auth.verify.wrongEmail} <Link to="/signup" className="text-primary font-semibold hover:underline">{t.auth.verify.startOver}</Link>
      </p>
    </AuthLayout>
  );
};

export default Verify;
