# Motion & composition patterns

Style-agnostic building blocks. Mix them to fit the brief; each code snippet assumes the helpers from `scaffold.md` (`tween`, `rise`, `shake`, `EASE`, `SPRING`).

## Core rules
- No linear motion. Entrances use `EASE.out` or a spring, exits use `EASE.in`, moves within a scene use `EASE.inOut`.
- Animate with the individual CSS properties `translate`, `scale`, `rotate` (not `transform` strings). They compose with each other and with a parent's.
- CSS `transition`/`animation` and Tailwind animation classes do not render. Everything comes from `useCurrentFrame()`.
- Deterministic randomness only: `random("seed-" + i)` from `remotion`, never `Math.random()`.
- Stagger rhythm: 3 frames between letters, 4–6 between words, 10–12 between cards/rows.
- Hold each readable message at least ~1 s (30 frames) after it finishes entering.

## Spring presets (`SPRING`)
| Preset | Feel | Use for |
|---|---|---|
| `snappy` | fast, no overshoot | UI panels, cards, precise motion |
| `bouncy` | overshoot + settle | buttons, stamps, playful pops, impact slams |
| `gentle` | soft, slow | luxury, calm, big hero objects |
| `heavy` | weighty drop | product drops, large objects landing |

Map a spring to any range: `interpolate(s, [0, 1], [from, to])`. A spring can overshoot past 1 — use that for slams (`scale` from 2.4 → 1).

## Layout & safe zones
| Platform | Size | SAFE (top / bottom / sides) | Headline min | Supporting min |
|---|---|---|---|---|
| `tiktok` 9:16 | 1080×1920 | 220 / 340 / 90 | 100 px | 44 px |
| `youtube` 16:9 | 1920×1080 | 100 / 120 / 140 | 100 px | 44 px |
| 1:1 (only if asked) | 1080×1080 | 100 / 120 / 90 | 96 px | 44 px |

`tiktok` safe zones keep text clear of the TikTok/Reels/Shorts UI (caption and buttons at the bottom, icons on the right). `youtube` is a standard title-safe margin; the player controls only cover the bottom ~120 px when paused.

### Composing for 16:9 (`youtube`)
- Split the frame: text block on one side (left-aligned), hero visual on the other. Alternate sides between scenes for rhythm.
- Headlines are one or two lines, not three — the frame is wide, not tall. Reflow stacks (cards, list items) into rows or a 2×2 grid.
- Big hero numbers/words: ~200–300 px, still within one half of the frame.
- Camera moves read stronger horizontally: prefer whip-left/right and lateral parallax over vertical whips.
- Shared-element anchors move to the hero side (`LAYOUT.youtube.hero`), e.g. `x: 420` instead of `y: 120`.

One focal point per scene. Big numbers/hero words 200–400 px. Anything inside a fixed-size container (badge, circle, button) must fit with margin: size the text to the container and check it in QC.

## Hooks (first 0–2 s, motion from frame 0)
- **Number slam:** big number or stat springs from `scale 2.4 → 1` with blur 22 → 0, counts up with `Math.round(tween(...))`, `shake()` at impact frame.
- **Impact burst:** frame 0 radial flash circle `scale 0.2 → 4.5`, opacity `0.85 → 0` over 12 frames, then the hero lands.
- **Alarm / pulse rings:** concentric rings spawned every 8–10 frames, each `scale 0.5 → 2.7`, opacity `0.55 → 0`.
- **Question slam:** a provocative 2–4 word question, words springing in with 5-frame stagger, one word in accent colour.
- **Strike-through / correction:** text appears, a bar `scaleX 0 → 1` (origin left) crosses out the "problem" word.
- **Before → after split:** two halves wipe in from opposite sides.

```tsx
const slam = spring({ frame: frame - 2, fps, config: SPRING.bouncy });
style={{
  scale: `${interpolate(slam, [0, 1], [2.4, 1])}`,
  filter: `blur(${interpolate(slam, [0, 0.8], [22, 0], { extrapolateRight: "clamp" })}px)`,
  opacity: tween(frame, [2, 6], [0, 1]),
  translate: shake(frame, 8, 22),
}}
```

## Transitions (scenes overlap 6–10 frames)
The outgoing scene's exit and the incoming scene's entry happen during the overlap, so they read as one move.

| Transition | Outgoing (last ~14 f) | Incoming (first ~14 f) |
|---|---|---|
| **Zoom-through** | `scale 1 → 1.35`, blur 0 → 18, fade (EASE.in) | `scale 0.86 → 1`, fade in |
| **Whip up** | `translate 0 → -520px`, blur 0 → 20, fade (EASE.in) | `translate +520px → 0`, blur 20 → 0 |
| **Collapse to point** | elements fly to an anchor, `scale → 0`, spin (EASE.in), a glowing dot remains | the dot blooms into the next hero |
| **Shared-element morph** | element holds still at its final pose and hides on the handoff frame | the same component renders at the identical pose on its frame 0, then moves (EASE.inOut) |
| **Scale-down** | `scale 1 → 0.9`, blur, fade | spring in |
| **Mask wipe** | — | `clipPath: inset(0 ${100 - p*100}% 0 0)` with p eased |

### Shared-element handoff — get it exact
1. Put the anchor in `theme.ts` (e.g. `HERO_Y = -180` offset from screen centre). Both scenes position the element from that one constant.
2. Pass the absolute composition frame into anything time-based (waves, steam, rotation) so it does not jump: `t={frame + SCENES.<scene>.from}`.
3. The outgoing scene hides its copy on the frame the incoming scene starts (`frame >= SCENES.next.from - SCENES.this.from`), so the element is never drawn twice.
4. Check the frame just before and just after the handoff in QC.

## Camera simulation
- **Push-in:** whole scene `scale 1 → 1.06` across the scene with `EASE.inOut`. Set `transformOrigin` on the focal point.
- **Shake:** `translate: shake(frame, impactFrame, strength)` on the scene container. 15–25 px for impacts, 6–10 px for a buzzing tension shake.
- **Parallax:** background layers move at 0.3×, mid at 0.6×, foreground at 1×.

## Reusable effects
- **Count-up:** `Math.round(tween(frame, [a, b], [0, target]))` or `.toFixed(1)`; use `fontVariantNumeric: "tabular-nums"` so digits do not jitter.
- **SVG stroke draw:** `strokeDasharray={L}` and `strokeDashoffset={L * (1 - p)}`; for a circle `L = 2πr`, rotate -90° to start at the top.
- **Check mark:** path `M11 25 L20 34 L37 15` in a 48 viewBox, length ≈ 40, drawn with stroke draw.
- **Shimmer sweep:** a skewed white gradient strip inside an `overflow: hidden` button, `translate` from −width to +width over ~20 frames.
- **Glow pulse:** `boxShadow` blur `50 + pulse * 40` with `pulse = 0.5 + 0.5 * Math.sin(frame / 4.5)`.
- **Blink:** never a hard step; `0.7 + 0.3 * Math.cos(...)`, and keep it fully visible at the hook's impact moment.
- **Text on a circle:** SVG `<textPath>` with `textLength={2 * Math.PI * r - 24}` and `lengthAdjust="spacing"` so the ends never overlap.
- **Gradient text:** apply `gradientText` to a span. Do not put it on a parent whose letters are individually transformed — give each word its own gradient span instead.
- **Particles/burst:** N items at angle `i / N * 2π`, distance driven by one spring, then fade.

## Story arcs (pick one, adapt the beats)
| Arc | Beats |
|---|---|
| Problem → solution | hook pain → amplify the chaos → reveal → proof/features → CTA |
| Product reveal | teaser/silhouette → reveal → 3 key features → price/offer → CTA |
| Stat story | shocking number → context → what changes → result number → CTA |
| Event / announcement | date slam → what → who/where → why come → CTA |
| Before / after | before state → transformation moment → after state → CTA |
