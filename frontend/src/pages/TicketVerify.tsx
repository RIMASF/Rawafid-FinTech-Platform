import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import logo from "@/assets/rawafed-logo.png";
import { CheckCircle, XCircle, Loader2, Calendar, MapPin, User } from "lucide-react";

type TicketData = {
  valid: boolean;
  message?: string;
  user?: { name: string; role: string };
};

const TicketVerify = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [data, setData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketId) return;
    api.verifyTicket(ticketId)
      .then(setData)
      .catch(() => setData({ valid: false, checkedIn: false, message: "Invalid or expired ticket." }))
      .finally(() => setLoading(false));
  }, [ticketId]);

  const displayId = ticketId
    ? "RWFD-" + ticketId.replace(/-/g, "").slice(0, 8).toUpperCase()
    : "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      {/* Logo */}
      <Link to="/" className="mb-8">
        <img src={logo} alt="Rawafed Fintech" className="h-14 w-auto object-contain" />
      </Link>

      <div className="w-full max-w-sm glow-card rounded-3xl overflow-hidden">
        {/* Header bar */}
        <div className="bg-gradient-to-br from-primary/20 to-transparent px-6 py-5 border-b border-border/50">
          <p className="text-[10px] font-bold tracking-widest text-primary mb-1">RAWAFED FINTECH 2026</p>
          <h1 className="display-font text-xl font-bold">Ticket Verification</h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">{displayId}</p>
        </div>

        <div className="px-6 py-8 flex flex-col items-center gap-6">
          {loading ? (
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          ) : data?.valid ? (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/15">
                <CheckCircle className="w-9 h-9 text-primary" />
              </div>

              <div className="text-center">
                <p className="text-lg font-bold mb-1 text-primary">Valid Ticket</p>
                <p className="text-xs text-muted-foreground">This ticket is valid for entry.</p>
              </div>

              {data.user && (
                <div className="w-full space-y-3">
                  <div className="glow-card rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Attendee</p>
                      <p className="font-semibold text-sm">{data.user.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="glow-card rounded-2xl p-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">Date</p>
                        <p className="font-semibold text-xs">18-19 May 2026</p>
                      </div>
                    </div>
                    <div className="glow-card rounded-2xl p-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">Location</p>
                        <p className="font-semibold text-xs">Riyadh, SA</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center">
                <XCircle className="w-9 h-9 text-destructive" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-destructive mb-1">Invalid Ticket</p>
                <p className="text-xs text-muted-foreground">{data?.message || "This ticket could not be verified."}</p>
              </div>
            </>
          )}
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-[10px] text-muted-foreground">Rawafed Fintech 2026 · Imam Mohammad Ibn Saud University · Riyadh</p>
        </div>
      </div>
    </div>
  );
};

export default TicketVerify;
