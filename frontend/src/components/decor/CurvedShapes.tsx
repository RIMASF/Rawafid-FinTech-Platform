import { CSSProperties } from "react";
import cornerTL from "@/assets/decor-corner-2.png"; // bold top-left
import cornerBL from "@/assets/decor-corner-3.png"; // bold bottom-left
import cornerBR from "@/assets/decor-corner-1.png"; // faded bottom-right
import cornerBR2 from "@/assets/decor-corner-4.png"; // bold bottom-right
import patternImg from "@/assets/decor-pattern.png";

/**
 * Brand decorative corner accents — sourced from the official Rawafed asset set.
 * Pure <img> overlays, never block interaction.
 */

type CornerProps = {
  className?: string;
  style?: CSSProperties;
  corner?: "tl" | "tr" | "bl" | "br";
  /** rough size in pixels (width). Height auto-scales. */
  size?: number;
  /** opacity 0-1. Default 1 (assets are already light). */
  opacity?: number;
};

const cornerPosition = (corner: CornerProps["corner"]): CSSProperties => {
  switch (corner) {
    case "tl": return { top: 0, left: 0 };
    case "tr": return { top: 0, right: 0 };
    case "bl": return { bottom: 0, left: 0 };
    case "br":
    default:   return { bottom: 0, right: 0 };
  }
};

const cornerAsset = (corner: CornerProps["corner"]) => {
  switch (corner) {
    case "tl": return { src: cornerTL, transform: "none" };
    // mirror the TL asset for TR
    case "tr": return { src: cornerTL, transform: "scaleX(-1)" };
    case "bl": return { src: cornerBL, transform: "none" };
    case "br":
    default:   return { src: cornerBR2, transform: "none" };
  }
};

export const CurvedCorner = ({
  className = "",
  style,
  corner = "br",
  size = 480,
  opacity = 1,
}: CornerProps) => {
  const { src, transform } = cornerAsset(corner);
  return (
    <img
      aria-hidden
      src={src}
      alt=""
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width: size,
        height: "auto",
        transform,
        opacity,
        ...cornerPosition(corner),
        ...style,
      }}
    />
  );
};

/**
 * Faint repeating watermark using the official seamless pattern.
 */
export const CurvedPattern = ({
  className = "",
  opacity = 0.08,
}: {
  className?: string;
  opacity?: number;
}) => {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 select-none ${className}`}
      style={{
        opacity,
        backgroundImage: `url(${patternImg})`,
        backgroundRepeat: "repeat",
        backgroundSize: "320px auto",
      }}
    />
  );
};
