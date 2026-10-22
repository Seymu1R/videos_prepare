# Sound design (SFX)

Every video gets an SFX track synced to its motion. The kit is royalty-free (synthesized by `scripts/make-sfx.sh`) and lives in `public/audio/sfx/`. If that folder is missing, run `npm run sfx` (needs ffmpeg).

## The kit

| Sound | Length | Character | Use for |
|---|---|---|---|
| `hit` | 0.9 s | sub-bass drop + transient click | big impacts: hero slam, object landing, price slam, final CTA slam |
| `stamp` | 0.4 s | punchy mid thump | stickers/badges/cards slapping down, headline word slams |
| `pop` | 0.15 s | bright blip | small entries: lines of text, icons, list items, buttons appearing |
| `whoosh` | 0.55 s | swelling noise, peaks at ~0.27 s | scene transitions, wipes, whips, things flying off screen |
| `swish` | 0.22 s | short airy noise | strike-throughs, underlines, quick sweeps, check marks |
| `fall` | 0.42 s | descending whistle | an object dropping before it lands |
| `ding` | 1.2 s | bright chime | CTA button/shimmer, success moment, final beat |

## Wiring

Create `src/videos/<slug>/Sfx.tsx` and render `<Sfx />` right after `<Background />` in `<Name>.tsx`:

```tsx
import { SfxTrack, type SfxCue } from "../../sfx";

// Composition frames, synced to the impacts, shakes and wipes in the scenes.
const CUES: SfxCue[] = [
  // <Scene>: <what happens>
  { at: <frame>, sound: "<sound>", volume: <0–1> },
];

export const Sfx: React.FC = () => <SfxTrack cues={CUES} />;
```

`at` is a **composition** frame: scene `from` + local frame. Derive every cue from constants already in the code (shake frames, spring delays, `SCENES.*.from`) — never guess.

## Timing rules

| Event in the code | Cue frame |
|---|---|
| `shake(frame, at, …)` impact | `hit` at the shake's `at` |
| Spring slam `scale 2.4 → 1` starting at `d` | `hit`/`stamp` at `d + 4` to `d + 5` (when it first reaches full size) |
| Sticker/card spring starting at `d` | `stamp` at `d + 3` |
| `rise()` or pop-in starting at `d` | `pop` at `d` to `d + 2` |
| Wipe/transition centred on frame `w` | `whoosh` at `w - 8` (its peak lands on the cut) |
| Elements flying away starting at `d` | `whoosh` at `d` (merge with the next transition's whoosh if within 12 frames) |
| Strike-through/underline drawing from `d` | `swish` at `d` |
| Object landing at `L` | `fall` at `L - 14`, then `hit` at `L` |
| CTA shimmer/button glow start | `ding` |

## Mix rules
- Volumes: `hit` 0.8–1, `stamp` 0.7–0.85, `whoosh` 0.55–0.75, `swish` 0.5–0.6, `pop` 0.4–0.55, `fall` 0.6–0.7, `ding` 0.6–0.7. Secondary repeats quieter than the first.
- Density: at most one cue every 4 frames, no two `hit`s within 10 frames, and leave at least one quiet second so the impacts stay punchy.
- First cue at frame 0 (a `whoosh` that peaks on the hook impact works well); last cue is usually `ding` on the CTA.
- Same cues for every platform: the timing is shared, so `youtube` and `tiktok` use one `Sfx.tsx`.

## Per style
| Style | Use | Avoid |
|---|---|---|
| Dark Tech | whoosh, hit, pop, swish, ding | — |
| Warm Premium | whoosh (0.5), pop, ding, soft stamp (0.5) | hit above 0.6, fall |
| Light Minimal | whoosh (0.4), pop (0.35), ding | hit, stamp, fall |
| Bold Pop | everything, loud and dense | — |
| Neon Night | hit, whoosh, swish, pop | ding (use a pop instead) |
| Luxury Editorial | whoosh (0.4), ding (0.5) | hit, stamp, pop, fall |
| Playful Kids | pop, stamp, fall, ding, whoosh | hit above 0.6 |

## Verify
1. After rendering, confirm the MP4 has an audio stream: `ffprobe -v error -show_entries stream=codec_type -of csv=p=0 out/<file>.mp4` lists `audio`.
2. Loudness and peak: `ffmpeg -hide_banner -i out/<file>.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary`. True peak must be ≤ −1 dBFS; SFX-only tracks typically land around −20 to −15 LUFS. If the peak is above −1, lower the loudest cues.
3. Sync: draw the waveform with red markers on the main impact frames and **look at it** — each transient must start on its marker:
   ```bash
   W=1800; N=<DURATION>; boxes=""; for f in <impact frames>; do x=$(( f * W / N )); boxes="$boxes,drawbox=x=$x:y=0:w=3:h=300:color=red@0.9:t=fill"; done
   ffmpeg -loglevel error -y -i out/<file>.mp4 -filter_complex "[0:a]showwavespic=s=${W}x300:colors=black,format=rgba[w];color=c=white:s=${W}x300[bg];[bg][w]overlay=format=auto${boxes}" -frames:v 1 out/qc/<slug>/waveform.png
   ```
4. You cannot hear the result: say so in the report and ask the user to listen and flag any sound that is too loud, too quiet or cheap-sounding.
