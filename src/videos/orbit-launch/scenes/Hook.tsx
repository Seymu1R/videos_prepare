import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE_IN, EASE_OUT, tween } from "../theme";

/** 0–3s: big-number slam with impact shake. The hook. */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Impact flash
  const flashScale = tween(frame, [0, 12], [0.2, 4.5]);
  const flashOpacity = tween(frame, [0, 12], [0.85, 0]);

  // Number slam
  const slam = spring({ frame: frame - 2, fps, config: { damping: 11, stiffness: 170, mass: 0.9 } });
  const numScale = interpolate(slam, [0, 1], [2.6, 1]);
  const numBlur = interpolate(slam, [0, 0.8], [24, 0], { extrapolateRight: "clamp" });
  const numOpacity = tween(frame, [2, 6], [0, 1]);
  const count = Math.round(tween(frame, [0, 20], [0, 10]));

  // Camera shake, decaying from the impact frame
  const since = frame - 8;
  const amp = since >= 0 ? 22 * Math.exp(-since / 5) : 0;
  const shakeX = Math.sin(frame * 2.3) * amp;
  const shakeY = Math.cos(frame * 3.1) * amp;

  // Exit: zoom-through
  const exitScale = tween(frame, [74, 90], [1, 1.35], EASE_IN);
  const exitOpacity = tween(frame, [76, 90], [1, 0], EASE_IN);
  const exitBlur = tween(frame, [74, 90], [0, 18], EASE_IN);

  const line = (delay: number) => ({
    opacity: tween(frame, [delay, delay + 10], [0, 1]),
    transform: `translateY(${tween(frame, [delay, delay + 16], [60, 0])}px)`,
    filter: `blur(${tween(frame, [delay, delay + 12], [10, 0])}px)`,
  });

  const strike = tween(frame, [40, 52], [0, 1], EASE_OUT);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${exitScale})`,
        opacity: exitOpacity,
        filter: `blur(${exitBlur}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,77,109,0.4) 40%, transparent 70%)",
          transform: `scale(${flashScale})`,
          opacity: flashOpacity,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -120 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            transform: `scale(${numScale})`,
            filter: `blur(${numBlur}px)`,
            opacity: numOpacity,
          }}
        >
          <span
            style={{
              fontSize: 400,
              fontWeight: 900,
              letterSpacing: -20,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              backgroundImage: "linear-gradient(180deg, #FFFFFF 30%, #FFB3C0 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {count}
          </span>
          <span style={{ fontSize: 140, fontWeight: 800, color: C.red, marginLeft: 18 }}>hrs</span>
        </div>
        <div style={{ fontSize: 80, fontWeight: 500, color: C.muted, marginTop: 10, ...line(16) }}>
          every week
        </div>
        <div style={{ fontSize: 100, fontWeight: 800, marginTop: 14, letterSpacing: -2, ...line(22) }}>
          lost to{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            busywork.
            <span
              style={{
                position: "absolute",
                left: -8,
                right: -8,
                top: "54%",
                height: 12,
                borderRadius: 6,
                background: C.red,
                boxShadow: `0 0 24px ${C.red}`,
                transform: `scaleX(${strike})`,
                transformOrigin: "left center",
              }}
            />
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
