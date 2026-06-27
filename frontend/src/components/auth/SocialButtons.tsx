import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/store/user";
import { useLang } from "@/i18n/LanguageContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

declare const google: {
  accounts: {
    id: {
      initialize: (config: { client_id: string; callback: (r: { credential: string }) => void }) => void;
      renderButton: (parent: HTMLElement, options: object) => void;
    };
  };
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
  </svg>
);

export const SocialButtons = () => {
  const { signIn, user } = useUser();
  const { t } = useLang();
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [pendingNav, setPendingNav] = useState(false);

  useEffect(() => {
    if (pendingNav && user) {
      setPendingNav(false);
      navigate("/dashboard");
    }
  }, [user, pendingNav, navigate]);

  useEffect(() => {
    const init = () => {
      if (typeof google === "undefined" || !overlayRef.current) return;
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          try {
            const { token, profile } = await api.googleAuth(credential);
            signIn(profile, token);
            setPendingNav(true);
          } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Google sign-in failed.");
          }
        },
      });
      google.accounts.id.renderButton(overlayRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        width: overlayRef.current.offsetWidth || 400,
      });
    };

    init();
    // retry until GIS script finishes loading
    const interval = setInterval(() => {
      if (typeof google !== "undefined") { init(); clearInterval(interval); }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <div className="relative w-full h-12">
        {/* visible custom button */}
        <div className="absolute inset-0 rounded-xl bg-card border border-border flex items-center justify-center gap-3 font-medium text-sm pointer-events-none select-none">
          <GoogleIcon />
          {t.auth.login.continueWithGoogle}
        </div>
        {/* invisible Google button rendered on top — captures the click */}
        <div ref={overlayRef} className="absolute inset-0 overflow-hidden rounded-xl opacity-[0.01] cursor-pointer" />
      </div>
    </div>
  );
};
