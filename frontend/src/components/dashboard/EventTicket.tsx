import { useUser } from "@/store/user";
import { useLang } from "@/i18n/LanguageContext";
import { Calendar, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export const EventTicket = () => {
  const { user } = useUser();
  const { t } = useLang();
  const ticketId = user?.ticketId ?? "";
  const displayId = ticketId
    ? "RWFD-" + ticketId.replace(/-/g, "").slice(0, 8).toUpperCase()
    : "RWFD-PENDING";
  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const qrValue = ticketId ? `${appUrl}/ticket/${ticketId}` : "";

  return (
    <div className="relative max-w-md mx-auto">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/20 blur-2xl rounded-3xl" />

      <div className="relative bg-gradient-card border border-primary/30 rounded-3xl overflow-hidden shadow-glow">
        {/* Top */}
        <div className="p-6 bg-gradient-to-br from-primary/15 to-transparent border-b border-dashed border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] tracking-widest text-primary font-bold mb-1">RAWAFED FINTECH 2026</div>
              <h3 className="display-font text-2xl font-bold">{t.dashboard.ticketTitle}</h3>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div>{t.dashboard.ticketLabel}</div>
              <div className="font-mono text-foreground">{displayId}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-[10px] tracking-wider text-muted-foreground mb-1">{t.dashboard.attendee}</div>
              <div className="font-semibold">{user ? `${user.firstName} ${user.lastName}` : "Guest"}</div>
            </div>
            <div>
              <div className="text-[10px] tracking-wider text-muted-foreground mb-1">{t.dashboard.access}</div>
              <div className="font-semibold text-primary">{t.dashboard.allAreas}</div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <div className="text-[10px] text-muted-foreground">{t.dashboard.date}</div>
                <div className="font-semibold text-xs">18-19 May 2026</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <div>
                <div className="text-[10px] text-muted-foreground">{t.dashboard.location}</div>
                <div className="font-semibold text-xs">{t.auth.layout.stats.location}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Perforation */}
        <div className="relative h-6 bg-background flex items-center">
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-background border border-primary/30" />
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-background border border-primary/30" />
          <div className="flex-1 mx-6 border-t border-dashed border-border" />
        </div>

        {/* QR */}
        <div className="p-6 flex flex-col items-center gap-4">
          {ticketId ? (
            <div className="rounded-lg bg-white p-3 w-full max-w-[200px]">
              <QRCodeSVG
                value={qrValue}
                size={160}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          ) : (
            <div className="w-full max-w-[200px] aspect-square rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground text-center px-4">
              {t.dashboard.qrPending}
            </div>
          )}
          <p className="text-xs text-muted-foreground text-center">{t.dashboard.scanEntrance}</p>

        </div>
      </div>
    </div>
  );
};
