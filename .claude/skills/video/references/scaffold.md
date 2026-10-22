# File scaffold

Every video is built from scratch in `src/videos/<slug>/`. Do not read or copy other folders in `src/videos/`: they are local-only, may not exist on this machine, and copying them makes every video look the same.

```
src/videos/<slug>/
  index.ts          ← registration, one entry per requested platform (auto-discovered by src/Root.tsx)
  theme.ts          ← timing table, palette, fonts, per-platform LAYOUT, easing/spring presets, helpers
  <Name>.tsx        ← timeline: Background + one <Sequence> per scene
  Background.tsx    ← persistent animated backdrop (never cuts)
  Sfx.tsx           ← SFX cue list, synced to the scenes' frame constants (see sound.md)
  scenes/<Scene>.tsx
  <Shared>.tsx      ← optional: shared visual elements (logo mark, product, icon) reused across scenes
```

Fill every `<…>` slot. The finished code must contain no slots and no placeholder comments.

## Platforms

| Platform | Size | Where it is posted | Composition id |
|---|---|---|---|
| `youtube` | 1920×1080 (16:9) | YouTube, Facebook, LinkedIn, X | `<Name>Youtube` |
| `tiktok` | 1080×1920 (9:16) | TikTok, Instagram Reels/Stories, YouTube Shorts | `<Name>Tiktok` |
| `square` (only if asked) | 1080×1080 (1:1) | feed posts | `<Name>Square` — add a `square` entry to `LAYOUT` and a `width === height` branch in `useLayout` |

One codebase serves both: the same scenes, timing and story, with layout chosen per platform through `useLayout()`. A 16:9 frame is **not** a cropped 9:16 frame — re-compose it: text and hero side by side, wider spacing, smaller relative type.

## index.ts

List only the platforms the user asked for.

```ts
import { PLATFORMS, type Platform, type VideoEntry } from "../../types";
import { <Name> } from "./<Name>";
import { DURATION, FPS } from "./theme";

const entry = (platform: Platform): VideoEntry => ({
  id: `<Name>${PLATFORMS[platform].suffix}`,
  component: <Name>,
  durationInFrames: DURATION,
  fps: FPS,
  width: PLATFORMS[platform].width,
  height: PLATFORMS[platform].height,
});

export const videos: VideoEntry[] = [entry("youtube"), entry("tiktok")];
```

## theme.ts

Swap fonts, palette and presets for the chosen style (see `styles.md`). Keep the helpers and the `LAYOUT`/`useLayout` structure; tune the numbers per video.

```ts
import { Easing, interpolate, useVideoConfig } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadDisplay } from "@remotion/google-fonts/<DisplayFont>";

// latin-ext is required for Azerbaijani/Turkish letters (ə ğ ı ş ç ö ü İ).
export const { fontFamily: sans } = loadSans("normal", {
  weights: ["400", "500", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});
export const { fontFamily: display } = loadDisplay("normal", {
  weights: ["<w1>", "<w2>"],
  subsets: ["latin", "latin-ext"],
});

export const FPS = 30;
export const DURATION = <seconds> * FPS;

// Scenes overlap 6–10 frames so every cut is a motion transition.
export const SCENES = {
  <hook>: { from: 0, durationInFrames: <n> },
  <scene2>: { from: <n - overlap>, durationInFrames: <n> },
  <cta>: { from: <…>, durationInFrames: <until DURATION> },
} as const;

/** Per-platform layout. `hero` is the shared-element anchor as an offset from the frame centre. */
export const LAYOUT = {
  tiktok: {
    safe: { x: 90, top: 220, bottom: 340 },
    type: { hero: 260, headline: 120, body: 48 },
    direction: "column",
    hero: { x: 0, y: <120> },
  },
  youtube: {
    safe: { x: 140, top: 100, bottom: 120 },
    type: { hero: 220, headline: 110, body: 46 },
    direction: "row",
    hero: { x: <420>, y: 0 },
  },
} as const;

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const platform = width > height ? "youtube" : "tiktok";
  return { platform, wide: platform === "youtube", width, height, ...LAYOUT[platform] };
};

export const C = {
  bg: "<#…>",
  text: "<#…>",
  muted: "<#…>",
  accent: "<#…>",
  accent2: "<#…>",
  panel: "<rgba(…)>",
  stroke: "<rgba(…)>",
};

export const GRADIENT = `linear-gradient(100deg, ${C.accent} 0%, ${C.accent2} 100%)`;

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
};

export const SPRING = {
  snappy: { damping: 20, stiffness: 200 },
  bouncy: { damping: 10, stiffness: 170, mass: 0.9 },
  gentle: { damping: 18, stiffness: 90 },
  heavy: { damping: 14, stiffness: 80, mass: 1.6 },
};

/** Clamped, eased interpolation between two frames. */
export const tween = (
  frame: number,
  [f0, f1]: [number, number],
  [v0, v1]: [number, number],
  easing: (t: number) => number = EASE.out,
) => interpolate(frame, [f0, f1], [v0, v1], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Fade + rise + de-blur entry starting at `delay`. */
export const rise = (frame: number, delay: number, distance = 60): React.CSSProperties => ({
  opacity: tween(frame, [delay, delay + 10], [0, 1]),
  translate: `0px ${tween(frame, [delay, delay + 16], [distance, 0])}px`,
  filter: `blur(${tween(frame, [delay, delay + 12], [10, 0])}px)`,
});

/** Camera shake that kicks at `at` and decays. Returns a CSS translate value. */
export const shake = (frame: number, at: number, strength = 20, decay = 4.5) => {
  const a = frame >= at ? strength * Math.exp(-(frame - at) / decay) : 0;
  return `${Math.sin(frame * 4.7) * a}px ${Math.cos(frame * 3.9) * a}px`;
};

export const gradientText: React.CSSProperties = {
  backgroundImage: GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
```

## <Name>.tsx

```tsx
import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "./Background";
import { Sfx } from "./Sfx";
import { <Hook> } from "./scenes/<Hook>";
import { <Cta> } from "./scenes/<Cta>";
import { C, SCENES, sans } from "./theme";

export const <Name>: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: sans, color: C.text }}>
    <Background />
    <Sfx />
    <Sequence {...SCENES.<hook>} name="<Hook>">
      <<Hook> />
    </Sequence>
    <Sequence {...SCENES.<cta>} name="<Cta>">
      <<Cta> />
    </Sequence>
  </AbsoluteFill>
);
```

## Background.tsx

The backdrop runs on the composition frame and never cuts, so it carries continuity across scenes. Pick one or two layers that fit the style: drifting radial glows, a perspective grid, bokeh particles (deterministic via `random(seed)`), slow gradient shift, colour-block wipes, noise. Size glows relative to the frame (`Math.max(width, height)`) so they work in both formats. End with a vignette when the style allows.

```tsx
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE, tween, useLayout } from "./theme";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useLayout();
  const t = frame / 30;
  const r = Math.max(width, height) * 0.5;
  // 0→1 mood shift at the reveal (e.g. problem colour → solution colour)
  const mood = tween(frame, [<revealStart>, <revealEnd>], [0, 1], EASE.inOut);
  const ax = 50 + Math.sin(t * 0.6) * 16;
  const ay = 30 + Math.cos(t * 0.5) * 8;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(${r}px ${r}px at ${ax}% ${ay}%, <colour A with alpha × (1 - mood)>, transparent 70%)`,
            `radial-gradient(${r}px ${r}px at ${100 - ax}% 75%, <colour B with alpha × mood>, transparent 70%)`,
          ].join(","),
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 45%, ${C.bg} 100%)` }} />
    </AbsoluteFill>
  );
};
```

## Scene template

Every scene: an **enter** that continues the previous scene's exit, staggered content, an **exit** in its last 10–14 frames. Local frame 0 is the scene's `from`. Layout comes from `useLayout()`: on `tiktok` the text block sits above the hero (column), on `youtube` beside it (row).

```tsx
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, SPRING, gradientText, rise, tween, useLayout } from "../theme";

export const <Scene>: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wide, safe, type, direction } = useLayout();
  const D = <durationInFrames of this scene>;

  const enter = tween(frame, [0, 14], [0, 1]);
  const exit = tween(frame, [D - 12, D], [0, 1], EASE.in);
  const pop = spring({ frame: frame - 8, fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill
      style={{
        flexDirection: direction,
        alignItems: "center",
        justifyContent: "center",
        gap: wide ? 120 : 80,
        padding: `${safe.top}px ${safe.x}px ${safe.bottom}px`,
        opacity: enter * (1 - exit),
        scale: `${0.88 + 0.12 * enter + 0.3 * exit}`,
        filter: `blur(${16 * exit}px)`,
      }}
    >
      <div style={{ flex: wide ? 1 : undefined, textAlign: wide ? "left" : "center" }}>
        <div style={{ fontSize: type.headline, fontWeight: 900, lineHeight: 1.02, ...rise(frame, 4) }}>
          <first line> <span style={gradientText}><accent words></span>
        </div>
        <div style={{ marginTop: 24, color: C.muted, fontSize: type.body, ...rise(frame, 10) }}><supporting line></div>
      </div>
      <div style={{ flex: wide ? 1 : undefined, display: "flex", justifyContent: "center", scale: `${pop}` }}>
        <hero visual>
      </div>
    </AbsoluteFill>
  );
};
```

For absolutely-positioned shared elements, place them from `useLayout().hero` (`left: calc(50% + ${hero.x}px)`, `top: calc(50% + ${hero.y}px)`) so the handoff lands on the same pixel in both formats.
