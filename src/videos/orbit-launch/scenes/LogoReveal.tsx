import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LogoMark } from "../LogoMark";
import { C, EASE_IN, EASE_IN_OUT, HEIGHT, LOGO_Y, gradientText, tween } from "../theme";

/** 6.0–9.6s: singularity dot blooms into the Orbit mark + wordmark. */
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const core = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 140 } });
  const ring = tween(frame, [6, 36], [0, 1]);
  const angle = tween(frame, [6, 36], [0, 360]) + Math.max(0, frame - 36) * 4;

  const shock = tween(frame, [4, 30], [0, 1]);

  const push = tween(frame, [0, 108], [1, 1.06], EASE_IN_OUT);
  const exit = tween(frame, [96, 108], [0, 1], EASE_IN);

  const letters = "orbit".split("");

  const tag = (delay: number) => ({
    display: "inline-block" as const,
    opacity: tween(frame, [delay, delay + 10], [0, 1]),
    transform: `translateY(${tween(frame, [delay, delay + 16], [40, 0])}px)`,
    filter: `blur(${tween(frame, [delay, delay + 12], [8, 0])}px)`,
  });

  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${-520 * exit}px) scale(${push})`,
        transformOrigin: `50% ${HEIGHT / 2 + LOGO_Y}px`,
        opacity: 1 - exit,
        filter: `blur(${20 * exit}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `calc(50% + ${LOGO_Y}px)`,
          left: "50%",
          width: 200,
          height: 200,
          margin: -100,
          borderRadius: "50%",
          border: `4px solid ${C.violet}`,
          transform: `scale(${1 + shock * 5})`,
          opacity: 0.7 * (1 - shock),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: HEIGHT / 2 + LOGO_Y - 180,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LogoMark size={360} core={core} ring={ring} angle={angle} />
        <div style={{ display: "flex", marginTop: 30, fontSize: 210, fontWeight: 900, letterSpacing: -8, lineHeight: 1 }}>
          {letters.map((l, i) => {
            const d = 18 + i * 3;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: tween(frame, [d, d + 8], [0, 1]),
                  transform: `translateY(${tween(frame, [d, d + 18], [90, 0])}px)`,
                  filter: `blur(${tween(frame, [d, d + 12], [14, 0])}px)`,
                }}
              >
                {l}
              </span>
            );
          })}
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 36, letterSpacing: -1.5 }}>
          <span style={tag(42)}>Your work.</span>{" "}
          <span style={{ ...tag(48), ...gradientText }}>On autopilot.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
