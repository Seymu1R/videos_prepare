---
name: video
description: Generate a new motion-graphics video (Remotion) from a short brief — topic, duration, aspect ratio, language. Plans a shot list, writes the composition in src/videos/<slug>/, QC-checks stills, and renders out/<slug>.mp4. Use when the user says /video, "yeni video", "video yarat", or asks for a new animated video.
argument-hint: "<mövzu / topic>, [müddət, e.g. 15s], [9:16 | 16:9 | 1:1], [dil / language]"
---

# New video

Brief from the user: `$ARGUMENTS`

## 0. Parse the brief
- Topic is required. If `$ARGUMENTS` is empty, ask for it once (one short question), then proceed.
- Defaults when not given: **15 s**, **9:16 (1080×1920)**, **30 fps**, text language = the language the brief is written in (Azerbaijani brief → Azerbaijani on-screen text; use correct letters ə ğ ı ö ü ç ş).
- 16:9 → 1920×1080, 1:1 → 1080×1080.
- Pick a kebab-case `<slug>` (e.g. `coffee-shop-promo`) and a PascalCase composition id (e.g. `CoffeeShopPromo`). If `src/videos/<slug>/` exists, append `-2`, `-3`…

## 0.5 Load the official Remotion skills (every run)
Before writing any code, invoke the `remotion-best-practices` skill and read the references it routes to for this task — at minimum `remotion-create/REFERENCE.md` and `remotion-markup/REFERENCE.md` (paths relative to `.claude/skills/remotion-best-practices/`). Also load `remotion-captions`, `remotion-maps` or `remotion-multimedia` when the brief needs captions, maps or video/audio files.

Where they conflict with this skill, **this skill wins**:
- The project already exists — never scaffold a new one or run `create-video`.
- The user wants a finished MP4: always render (step 4). Do not start Remotion Studio (it is a long-running process and blocks headless runs); the user can run `npm run studio` themselves.
- Keep the `src/videos/<slug>/` structure.

## 1. Shot list (print it, do not wait for approval)
Second-by-second table: time, frame range, shot name, keyframes (entries, staggers, transitions, camera push/shake). Rules:
- A strong visual hook in the first 2 s — motion from frame 0 (slam, burst, count-up, shake).
- Problem → tension → solution/reveal → payoff → CTA is a good default arc; adapt to the topic.
- Scenes overlap 6–10 frames; every cut is a motion transition (zoom-through, whip, collapse/morph), never a hard cut.

## 2. Code
Create `src/videos/<slug>/` modeled on `src/videos/orbit-launch/` (read it first — reuse its patterns, don't import from it):
- `theme.ts` — FPS/WIDTH/HEIGHT/DURATION, SAFE margins, palette, `EASE_OUT = Easing.bezier(0.16,1,0.3,1)`, `EASE_IN`, `tween()` clamped helper, font via `@remotion/google-fonts` (pick a font that supports the text language; Inter works for Azerbaijani).
- `<Name>.tsx` — `<Sequence>` timeline; `Background.tsx`; `scenes/*.tsx`, one per shot.
- Register a new `<Composition>` in `src/Root.tsx` (keep the existing ones).

Motion & design rules:
- NO linear motion: everything through `spring()` or eased `tween()`. All timing in exact frames via `useCurrentFrame()`.
- Dark mode, high contrast, bold type, gradient accents. Visual style may follow the topic (e.g. warm palette for food), but keep it premium.
- Readability: at 1080 px width, body text ≥ 34 px, headlines ≥ 100 px. Keep text inside SAFE (vertical: top 220, bottom 340, sides 90).
- No placeholder comments, no real brand logos/names unless the user supplies their own brand.
- Only depend on packages already in package.json. If something else is truly needed, `npm install` an exact version.

## 3. Verify
1. `npm run typecheck` — fix all errors.
2. Render 6–8 QC stills at key frames (hook impact, mid-scene, each transition, final frame):
   `npx remotion still <Id> out/qc/<slug>/f<N>.png --frame=<N> --scale=0.5 --log=error`
   then tile them: `ffmpeg -loglevel error -y -i ... -filter_complex "hstack=inputs=N" out/qc/<slug>/sheet.png` and **look at the sheet**.
3. Self-evaluate: hook impact (0–2 s), readability, motion smoothness, element alignment across transitions, text clipping/overflow. Fix every flaw found and re-check the affected frames.

## 4. Render
`npx remotion render <Id> out/<slug>.mp4 --log=error`, then confirm with
`ffprobe -v error -show_entries stream=width,height,r_frame_rate,nb_frames -of csv=p=0 out/<slug>.mp4`.

## 5. Report (in the user's language)
- Full path of the MP4.
- The shot list (short).
- Flaws found in QC and what was fixed.
- Do NOT git commit unless asked. `out/` is git-ignored on purpose.
