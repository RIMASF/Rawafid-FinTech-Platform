import { useState, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

/**
 * Password input with an eye icon.
 * - Hover the eye to reveal the password.
 * - Click the eye to toggle reveal on/off (sticky).
 */
export const PasswordInput = ({ className = "", ...props }: PasswordInputProps) => {
  const [hovering, setHovering] = useState(false);
  const [locked, setLocked] = useState(false);

  const visible = hovering || locked;

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={`h-12 rounded-xl pr-12 ${className}`}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        onClick={() => setLocked((l) => !l)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-primary transition-colors"
        tabIndex={-1}
      >
        {visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
      </button>
    </div>
  );
};
