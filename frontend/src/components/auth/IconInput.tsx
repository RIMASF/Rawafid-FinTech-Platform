import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";

interface IconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: string;
  label?: string;
}

export const IconInput = ({ icon, label, className = "", ...props }: IconInputProps) => (
  <div>
    {label && <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>}
    <div className="relative">
      <img
        src={icon}
        alt=""
        aria-hidden
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none opacity-90 [filter:drop-shadow(0_0_6px_hsl(var(--primary)/0.5))]"
      />
      <Input {...props} className={`h-12 rounded-xl pl-12 ${className}`} />
    </div>
  </div>
);

interface IconSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon: string;
  label?: string;
  children: React.ReactNode;
}

export const IconSelect = ({ icon, label, children, className = "", ...props }: IconSelectProps) => (
  <div>
    {label && <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>}
    <div className="relative">
      <img
        src={icon}
        alt=""
        aria-hidden
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none opacity-90 [filter:drop-shadow(0_0_6px_hsl(var(--primary)/0.5))]"
      />
      <select
        {...props}
        className={`w-full h-12 rounded-xl bg-background border border-input pl-12 pr-3 text-sm appearance-none ${className}`}
      >
        {children}
      </select>
    </div>
  </div>
);
