import { Easing, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "700", "800", "900"],
  subsets: ["latin"],
});

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 15 * FPS;

// Safe zones for Reels/TikTok UI overlays.
export const SAFE = { x: 90, top: 220, bottom: 340 };

// Vertical offset (from screen center) of the logo core: Chaos collapses into it, LogoReveal blooms from it.
export const LOGO_Y = -180;

export const C = {
  bg: "#06060A",
  text: "#F5F5FA",
  muted: "#8B8BA3",
  violet: "#7C5CFF",
  cyan: "#22D3EE",
  red: "#FF4D6D",
  panel: "rgba(255,255,255,0.045)",
  stroke: "rgba(255,255,255,0.10)",
};

export const GRADIENT = `linear-gradient(100deg, ${C.violet} 0%, #A78BFA 45%, ${C.cyan} 100%)`;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_IN_OUT = Easing.bezier(0.83, 0, 0.17, 1);

/** Clamped, eased interpolation between two frames. */
export const tween = (
  frame: number,
  [f0, f1]: [number, number],
  [v0, v1]: [number, number],
  easing: (t: number) => number = EASE_OUT,
) =>
  interpolate(frame, [f0, f1], [v0, v1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const gradientText: React.CSSProperties = {
  backgroundImage: GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
