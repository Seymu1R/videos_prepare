import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE_IN, LOGO_Y, SAFE, tween } from "../theme";

type Card = {
  name: string;
  color: string;
  title: string;
  body: string;
  x: number;
  y: number;
  rot: number;
  fromX: number;
  fromY: number;
};

// Target positions are offsets from screen center.
const CARDS: Card[] = [
  { name: "M", color: "#F59E0B", title: "Status update??", body: "Need it before the 3pm sync", x: -90, y: -330, rot: -4, fromX: -1200, fromY: -500 },
  { name: "J", color: "#10B981", title: "Meeting moved (again)", body: "Now 4:30 — sorry all!", x: 110, y: -150, rot: 3, fromX: 1200, fromY: -300 },
  { name: "R", color: "#3B82F6", title: "Re: Re: Fwd: Q3 deck", body: "Which version is final?", x: -120, y: 30, rot: -2, fromX: -1200, fromY: 200 },
  { name: "A", color: "#EC4899", title: "Who owns this task?", body: "Nobody replied in 2 days", x: 90, y: 210, rot: 4, fromX: 1200, fromY: 300 },
  { name: "K", color: "#8B5CF6", title: "Quick sync?", body: "Just 30 min, promise", x: -70, y: 390, rot: -3, fromX: -900, fromY: 1200 },
  { name: "#", color: C.red, title: "47 unread threads", body: "across 6 channels", x: 120, y: 570, rot: 2, fromX: 900, fromY: 1200 },
];

/** 2.7–6.2s: notification overload, then everything gets sucked into one point. */
export const Chaos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Enter as the hook zooms through us
  const enterScale = tween(frame, [0, 14], [0.86, 1]);
  const enterOpacity = tween(frame, [0, 10], [0, 1]);

  const headerOut = tween(frame, [64, 78], [0, 1], EASE_IN);
  const words = ["Sound", "familiar?"];

  // Singularity dot that the logo scene picks up
  const dot = tween(frame, [80, 98], [0, 1]);
  const dotOut = tween(frame, [100, 106], [1, 0]);

  return (
    <AbsoluteFill style={{ transform: `scale(${enterScale})`, opacity: enterOpacity }}>
      <div
        style={{
          position: "absolute",
          top: SAFE.top - 20,
          width: "100%",
          textAlign: "center",
          fontSize: 104,
          fontWeight: 800,
          letterSpacing: -3,
          opacity: 1 - headerOut,
          transform: `translateY(${-80 * headerOut}px)`,
        }}
      >
        {words.map((w, i) => {
          const d = 4 + i * 5;
          return (
            <span
              key={w}
              style={{
                display: "inline-block",
                marginRight: i === 0 ? 28 : 0,
                opacity: tween(frame, [d, d + 10], [0, 1]),
                transform: `translateY(${tween(frame, [d, d + 16], [50, 0])}px)`,
                filter: `blur(${tween(frame, [d, d + 12], [8, 0])}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>

      {CARDS.map((card, i) => {
        const delay = 8 + i * 5;
        const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120, mass: 0.8 } });
        const jitter = Math.sin((frame + i * 7) * 0.9) * tween(frame, [30, 66], [0, 1.6]);

        const pull = tween(frame, [66 + i * 2, 88 + i * 2], [0, 1], EASE_IN);
        const x = (card.fromX + (card.x - card.fromX) * s) * (1 - pull);
        const y = LOGO_Y + (card.fromY + (card.y - card.fromY) * s - LOGO_Y) * (1 - pull);
        const rot = card.rot + (1 - s) * (card.fromX > 0 ? 25 : -25) + jitter + pull * (i % 2 ? 300 : -300);
        const scale = 1 - pull;

        return (
          <div
            key={card.title}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 760,
              marginLeft: -380,
              marginTop: -80,
              transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
              opacity: s > 0.01 ? 1 - pull * pull : 0,
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "32px 36px",
              borderRadius: 36,
              background: "rgba(22,22,32,0.86)",
              border: `2px solid ${C.stroke}`,
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                width: 92,
                height: 92,
                flexShrink: 0,
                borderRadius: "50%",
                background: card.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 44,
                fontWeight: 800,
                color: "#0B0B12",
              }}
            >
              {card.name}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.15 }}>{card.title}</div>
              <div style={{ fontSize: 34, color: C.muted, marginTop: 6 }}>{card.body}</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.red, boxShadow: `0 0 18px ${C.red}` }} />
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: `calc(50% + ${LOGO_Y}px)`,
          width: 40,
          height: 40,
          margin: -20,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: `0 0 40px 12px ${C.violet}, 0 0 120px 40px rgba(124,92,255,0.5)`,
          transform: `scale(${dot})`,
          opacity: dotOut,
        }}
      />
    </AbsoluteFill>
  );
};
