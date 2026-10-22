# Videos — code-generated motion graphics (Remotion)

- Each video is self-contained in `src/videos/<slug>/` and registered as a `<Composition>` in `src/Root.tsx`.
- `src/videos/orbit-launch/` is the reference implementation (style, easing, scene structure).
- New videos: use the `/video` skill (`.claude/skills/video/SKILL.md`).
- Rendered files go to `out/` — git-ignored, never commit videos.
- Commands: `npm run studio` (preview), `npm run typecheck`, `npx remotion render <Id> out/<slug>.mp4`.
