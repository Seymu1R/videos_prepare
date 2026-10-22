---
name: video
description: Generate a new motion-graphics video (Remotion) from a short brief — topic, platform (YouTube 16:9 / TikTok-Instagram 9:16 / both), duration, style, language. Picks a design style, plans a shot list, builds the composition from scratch in src/videos/<slug>/, QC-checks stills, and renders out/<slug>.mp4. Use when the user says /video, "yeni video", "video yarat", or asks for a new animated video.
argument-hint: "<mövzu / topic>, [youtube | tiktok | hər ikisi], [müddət, e.g. 15s], [üslub / style], [dil / language]"
---

# New video

Brief from the user: `$ARGUMENTS`

This skill is self-contained: everything needed to build a high-end video from scratch is in this file and `references/`. Read all four reference files before writing code:
- [references/scaffold.md](references/scaffold.md) — file structure and code templates (theme, timeline, background, scene)
- [references/motion.md](references/motion.md) — easing/spring presets, hooks, transitions, camera, effects, story arcs, layout table
- [references/styles.md](references/styles.md) — design styles (palette, fonts, motion personality, background, elements)
- [references/sound.md](references/sound.md) — SFX kit, cue timing rules, mix levels per style, audio verification

## 0. Parse the brief
- Topic is required. If the brief is empty or is not a video topic, ask for it once (one short question), then proceed.
- **Platform** (see the table in `scaffold.md`):
  - `youtube` (also: YouTube, Facebook, LinkedIn, üfüqi, 16:9) → 1920×1080.
  - `tiktok` (also: TikTok, Instagram, Reels, Shorts, şaquli, 9:16) → 1080×1920.
  - `hər ikisi` / `both` → both compositions from one codebase, each with its own layout.
  - Not given → ask once with one short question offering the three choices. If you cannot ask (headless run), use `tiktok`.
  - An explicit 1:1 request → 1080×1080, registered like the others with suffix `Square`.
- Other defaults: **15 s**, **30 fps**, on-screen language = the language the brief is written in (Azerbaijani brief → Azerbaijani text with correct ə ğ ı ö ü ç ş İ).
- Style: use the one the user names; otherwise choose from `styles.md` by topic. A user-supplied brand (name, colours, logo, font) overrides the style's defaults.
- Pick a kebab-case `<slug>` and a PascalCase composition id. If `src/videos/<slug>/` exists, append `-2`, `-3`…

## 0.5 Load the official Remotion skills (every run)
Invoke the `remotion-best-practices` skill and read the references it routes to — at minimum `remotion-create/REFERENCE.md` and `remotion-markup/REFERENCE.md` (relative to `.claude/skills/remotion-best-practices/`). Also load `remotion-captions`, `remotion-maps` or `remotion-multimedia` when the brief needs captions, maps or video/audio files.

Where they conflict with this skill, **this skill wins**:
- The project already exists — never scaffold a new one or run `create-video`.
- The user wants a finished MP4: always render (step 4). Do not start Remotion Studio (long-running, blocks headless runs); the user can run `npm run studio` themselves.
- Register through `src/videos/<slug>/index.ts` (auto-discovered); never edit `src/Root.tsx`.

## 1. Creative plan (print it, do not wait for approval)
1. **Style** — name, palette, fonts, motion personality (one line each).
2. **Story arc** — from `motion.md`, adapted to the topic.
3. **Shot list** — table: time, frame range, shot, keyframes (entries, staggers, transitions, camera push/shake). Rules:
   - A strong visual hook in the first 2 s with motion from frame 0.
   - Scenes overlap 6–10 frames; every cut is a motion transition, never a hard cut.
   - Each scene has one focal point; each readable message holds ≥ 1 s.
   - Plan at least one continuity device (shared-element morph, collapse-to-point, persistent background mood shift).
   - For `hər ikisi`: one shot list (same timing), plus one line per scene on how the 16:9 layout differs.

## 2. Build from scratch
Create `src/videos/<slug>/` following `scaffold.md`, then add `Sfx.tsx` following `sound.md` (cues derived from the frame constants in the scenes). Do not read, import or copy other folders in `src/videos/` — they are local-only and would homogenise the look.

Non-negotiables:
- No linear motion: every animated value goes through a spring or an eased `tween()`. All timing in exact frames from `useCurrentFrame()`.
- Readability: sizes from the layout table in `motion.md`; all text inside SAFE; text inside fixed containers sized to fit.
- No placeholder comments or unfilled `<…>` slots. No real brand names/logos unless the user supplied their own.
- Illustrations are code: SVG/CSS shapes built for the topic (product, icon, logo mark). No external images unless the user provides them (then put them in `public/` and use `staticFile()`).
- Only packages already in `package.json`. If something else is truly needed, `npm install` an exact version.

## 3. Verify
1. `npm run typecheck` — fix all errors.
2. For **each** composition id, render 6–8 QC stills — hook impact frame, mid-hook, each transition (one frame before and after each handoff), each scene's busiest moment, final frame:
   `npx remotion still <Id> out/qc/<slug>/f<N>.png --frame=<N> --scale=0.5 --log=error`
   Tile them: `ffmpeg -loglevel error -y -i f1.png -i f2.png ... -filter_complex "hstack=inputs=N,scale=2400:-1" out/qc/<slug>/sheet.png` and **look at the sheet**.
3. Self-evaluate and fix every flaw, then re-render the affected frames:
   - Hook: is the first 2 s eye-catching, and is the key message fully legible at the impact frame?
   - Readability: sizes, contrast, nothing clipped or outside SAFE, glyphs (ə ş ğ İ) rendered in the right font.
   - Sound: audio stream present, true peak ≤ −1 dBFS, waveform transients on the impact markers (see `sound.md` → Verify).
   - Format fit: the 16:9 version is genuinely re-composed (side-by-side, no tall stacks running off the frame, no huge empty side bands); the 9:16 version keeps text out of the platform UI zones.
   - Smoothness: no linear moves, no pops, no element drawn twice during an overlap.
   - Alignment: shared elements land on the same pixel across handoffs.
   - Known pitfalls: blinking elements caught in their dim phase at a key frame; circular text whose ends overlap; big numbers/percentages overflowing a badge; gradient text on a parent of transformed letters; fonts without `latin-ext` falling back.

## 4. Render
For each composition: `npx remotion render <Name><Suffix> out/<slug>-<platform>.mp4 --log=error` (e.g. `out/gym-promo-youtube.mp4`, `out/gym-promo-tiktok.mp4`), then confirm with
`ffprobe -v error -show_entries stream=width,height,r_frame_rate,nb_frames -of csv=p=0 out/<slug>-<platform>.mp4`
and extract a 6-frame contact sheet from the MP4 to confirm the final file.

## 5. Report (in the user's language)
- Full path of each MP4, labelled with where to post it (YouTube/Facebook/LinkedIn vs TikTok/Instagram/Shorts).
- Style chosen and the shot list (short).
- Flaws found in QC and what was fixed.
- Sound: which events got which SFX, measured loudness/peak, and a request to listen (you cannot hear it).
- Assumptions to confirm (invented brand name, prices, dates, slogans).
- Video code (`src/videos/<slug>/`) and renders (`out/`) are git-ignored on purpose and stay local. Never force-add them.
