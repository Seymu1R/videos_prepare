import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE_IN_OUT, tween } from "./theme";

/** Drifting aurora glows + perspective grid + vignette. Mood shifts red → violet after the problem act. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  // 0 = "problem" (warm), 1 = "solution" (cool). Shifts during the logo reveal.
  const mood = tween(frame, [170, 215], [0, 1], EASE_IN_OUT);
  const glowA = mood < 1 ? `rgba(255,77,109,${0.32 * (1 - mood)})` : "transparent";
  const glowB = `rgba(124,92,255,${0.12 + 0.3 * mood})`;
  const glowC = `rgba(34,211,238,${0.2 * mood})`;

  const ax = 50 + Math.sin(t * 0.7) * 14;
  const ay = 28 + Math.cos(t * 0.5) * 8;
  const bx = 40 + Math.cos(t * 0.6) * 18;
  const by = 72 + Math.sin(t * 0.8) * 8;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(900px 900px at ${ax}% ${ay}%, ${glowA}, transparent 70%)`,
            `radial-gradient(1000px 1000px at ${bx}% ${by}%, ${glowB}, transparent 70%)`,
            `radial-gradient(800px 800px at ${100 - ax}% ${50 + Math.sin(t) * 10}%, ${glowC}, transparent 70%)`,
          ].join(","),
        }}
      />
      {/* Perspective floor grid, scrolling toward camera */}
      <div
        style={{
          position: "absolute",
          left: "-50%",
          width: "200%",
          bottom: -200,
          height: 1100,
          transform: "perspective(900px) rotateX(62deg)",
          transformOrigin: "50% 100%",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.07) 2px, transparent 2px)",
          backgroundSize: "120px 120px",
          backgroundPosition: `0px ${(frame * 2.2) % 120}px`,
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.9), transparent 85%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.9), transparent 85%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, transparent 45%, ${C.bg} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
