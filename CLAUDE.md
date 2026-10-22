# Videos — code-generated motion graphics (Remotion)

- Each video is self-contained in `src/videos/<slug>/`; its `index.ts` exports `video: VideoEntry` and `src/Root.tsx` auto-discovers it (don't edit Root to add videos).
- Git holds only the skeleton (skills, config, Root, the `orbit-launch` reference). Generated videos in `src/videos/*` and `out/` are git-ignored and stay local.
- `src/videos/orbit-launch/` is the reference implementation (style, easing, scene structure).
- New videos: use the `/video` skill (`.claude/skills/video/SKILL.md`).
- Rendered files go to `out/` — git-ignored, never commit videos.
- Commands: `npm run studio` (preview), `npm run typecheck`, `npx remotion render <Id> out/<slug>.mp4`.
- Official Remotion skills (`remotion-*`) are vendored in `.claude/skills/` (tracked in `skills-lock.json`). `/video` loads them every run. Update with `npx skills update -p -y`.
