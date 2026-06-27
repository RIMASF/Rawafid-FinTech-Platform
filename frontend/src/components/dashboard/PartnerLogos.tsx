// Stylized inline SVG marks for partners (illustrative, not official logos).
export const PartnerMarks: Record<string, JSX.Element> = {
  "STC Pay": (
    <svg viewBox="0 0 80 32" className="h-7">
      <rect x="0" y="0" width="80" height="32" rx="6" fill="hsl(280 80% 55%)" />
      <text x="40" y="21" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="13" fill="white">stc pay</text>
    </svg>
  ),
  "Alinma Bank": (
    <svg viewBox="0 0 80 32" className="h-7">
      <circle cx="14" cy="16" r="9" fill="none" stroke="hsl(160 80% 45%)" strokeWidth="2.5" />
      <text x="30" y="21" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="11" fill="hsl(var(--foreground))">Alinma</text>
    </svg>
  ),
  "Baims": (
    <svg viewBox="0 0 80 32" className="h-7">
      <rect x="2" y="6" width="20" height="20" fill="hsl(220 80% 55%)" />
      <rect x="6" y="10" width="12" height="12" fill="white" />
      <text x="26" y="21" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="11" fill="hsl(var(--foreground))">Baims</text>
    </svg>
  ),
  "Zid": (
    <svg viewBox="0 0 80 32" className="h-7">
      <path d="M6 20 L14 8 L22 20 Z" fill="hsl(35 90% 50%)" />
      <text x="28" y="21" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="11" fill="hsl(var(--foreground))">Zid</text>
    </svg>
  ),
  "Hakbah": (
    <svg viewBox="0 0 80 32" className="h-7">
      <circle cx="14" cy="16" r="10" fill="hsl(150 85% 45%)" />
      <text x="14" y="20" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="10" fill="white">Hakbah</text>
      <text x="30" y="21" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="11" fill="hsl(var(--foreground))"></text>
    </svg>
  ),
};
