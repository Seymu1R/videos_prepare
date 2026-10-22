import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LogoMark } from "../LogoMark";
import { C, GRADIENT, gradientText, tween } from "../theme";

/** 13–15s: payoff line + call to action. */
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logo = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  const word = (i: number) => {
    const s = spring({ frame: frame - 3 - i * 4, fps, config: { damping: 12, stiffness: 150 } });
    return {
      display: "inline-block" as const,
      opacity: Math.min(1, s * 1.4),
      transform: `translateY(${(1 - s) * 90}px) scale(${interpolate(s, [0, 1], [0.6, 1])})`,
    };
  };

  const btn = spring({ frame: frame - 16, fps, config: { damping: 9, stiffness: 160 } });
  const pulse = 0.5 + 0.5 * Math.sin((frame - 16) / 4.5);
  const shimmerX = tween(frame, [28, 48], [-500, 900]);
  const arrow = Math.sin(frame / 4) * 8;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: tween(frame, [0, 6], [0, 1]) }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -100 }}>
        <div style={{ transform: `scale(${logo})`, opacity: logo }}>
          <LogoMark size={150} core={1} ring={1} angle={frame * 6} />
        </div>
        <div style={{ marginTop: 40, textAlign: "center", fontSize: 136, fontWeight: 900, letterSpacing: -5, lineHeight: 1.02 }}>
          <div>
            <span style={word(0)}>Get</span> <span style={word(1)}>your</span>
          </div>
          <div>
            <span style={{ ...word(2), ...gradientText }}>week</span>{" "}
            <span style={{ ...word(3), ...gradientText }}>back.</span>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            marginTop: 80,
            width: 640,
            height: 150,
            borderRadius: 75,
            background: GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            overflow: "hidden",
            transform: `scale(${btn})`,
            boxShadow: `0 0 ${50 + pulse * 40}px rgba(124,92,255,${0.45 + pulse * 0.25}), 0 20px 50px rgba(0,0,0,0.5)`,
          }}
        >
          <span style={{ fontSize: 58, fontWeight: 800, color: "#fff" }}>Start free</span>
          <span style={{ fontSize: 58, fontWeight: 800, color: "#fff", transform: `translateX(${arrow}px)` }}>→</span>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 160,
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
              transform: `translateX(${shimmerX}px) skewX(-20deg)`,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 38,
            color: C.muted,
            fontWeight: 500,
            opacity: tween(frame, [26, 38], [0, 1]),
            transform: `translateY(${tween(frame, [26, 40], [24, 0])}px)`,
          }}
        >
          Free for teams up to 10
        </div>
      </div>
    </AbsoluteFill>
  );
};
