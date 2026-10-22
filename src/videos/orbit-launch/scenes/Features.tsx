import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE_IN, GRADIENT, SAFE, gradientText, tween } from "../theme";

const ROWS = [
  { title: "Meeting notes", body: "Summarized in seconds" },
  { title: "Task triage", body: "Assigned before you ask" },
  { title: "Status reports", body: "Written for you, every Friday" },
];

const CHECK_LEN = 40;

/** 9.4–13.2s: product panel with auto-checking features and the "10 hrs back" payoff. */
export const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continue the whip from the logo scene: arrive from below with motion blur
  const enterY = tween(frame, [0, 16], [520, 0]);
  const enterBlur = tween(frame, [0, 12], [20, 0]);

  const panel = spring({ frame: frame - 6, fps, config: { damping: 16, stiffness: 110 } });

  const exit = tween(frame, [102, 114], [0, 1], EASE_IN);

  const hours = tween(frame, [54, 86], [0, 10]);
  const bar = tween(frame, [54, 86], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        transform: `translateY(${enterY}px) scale(${1 - 0.1 * exit})`,
        filter: `blur(${enterBlur + 16 * exit}px)`,
        opacity: 1 - exit,
      }}
    >
      <div
        style={{
          marginTop: SAFE.top - 20,
          textAlign: "center",
          fontSize: 116,
          fontWeight: 900,
          letterSpacing: -4,
          lineHeight: 1.02,
        }}
      >
        <div>Everything.</div>
        <div style={gradientText}>Automated.</div>
      </div>

      <div
        style={{
          marginTop: 70,
          width: 900,
          padding: 52,
          borderRadius: 48,
          background: C.panel,
          border: `2px solid ${C.stroke}`,
          boxShadow: "0 40px 100px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          transform: `translateY(${(1 - panel) * 240}px) scale(${0.92 + 0.08 * panel})`,
          opacity: Math.min(1, panel * 1.5),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 20, height: 20, borderRadius: "50%", background: c }} />
          ))}
          <div style={{ marginLeft: 16, fontSize: 32, color: C.muted, fontWeight: 500 }}>orbit · this week</div>
        </div>

        {ROWS.map((row, i) => {
          const d = 16 + i * 12;
          const check = tween(frame, [d + 6, d + 18], [0, 1]);
          const pop = spring({ frame: frame - d - 6, fps, config: { damping: 9, stiffness: 200 } });
          return (
            <div
              key={row.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 32,
                padding: "26px 0",
                borderTop: i === 0 ? "none" : `2px solid ${C.stroke}`,
                opacity: tween(frame, [d, d + 10], [0, 1]),
                transform: `translateX(${tween(frame, [d, d + 18], [-70, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 84,
                  height: 84,
                  flexShrink: 0,
                  borderRadius: 24,
                  background: GRADIENT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${0.7 + 0.3 * pop})`,
                  boxShadow: `0 0 ${30 * check}px rgba(124,92,255,0.6)`,
                }}
              >
                <svg width={48} height={48} viewBox="0 0 48 48">
                  <path
                    d="M11 25 L20 34 L37 15"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={CHECK_LEN}
                    strokeDashoffset={CHECK_LEN * (1 - check)}
                  />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 50, fontWeight: 700, letterSpacing: -1 }}>{row.title}</div>
                <div style={{ fontSize: 36, color: C.muted, marginTop: 4 }}>{row.body}</div>
              </div>
            </div>
          );
        })}

        <div
          style={{
            marginTop: 30,
            padding: 40,
            borderRadius: 32,
            background: "rgba(124,92,255,0.10)",
            border: "2px solid rgba(124,92,255,0.35)",
            opacity: tween(frame, [48, 58], [0, 1]),
            transform: `translateY(${tween(frame, [48, 64], [40, 0])}px)`,
          }}
        >
          <div style={{ fontSize: 34, color: C.muted, fontWeight: 500 }}>Time back this week</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 6 }}>
            <span
              style={{
                fontSize: 130,
                fontWeight: 900,
                letterSpacing: -5,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                ...gradientText,
              }}
            >
              +{hours.toFixed(1)}
            </span>
            <span style={{ fontSize: 56, fontWeight: 800 }}>hrs</span>
          </div>
          <div style={{ marginTop: 24, height: 18, borderRadius: 9, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div
              style={{
                width: `${bar * 100}%`,
                height: "100%",
                borderRadius: 9,
                background: GRADIENT,
                boxShadow: `0 0 24px ${C.cyan}`,
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
