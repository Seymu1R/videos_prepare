# Videos — code-generated motion graphics (Remotion)

**Start every session by reading `docs/SESSION_LOG.md`** (where we left off, decisions, next step). Before ending a session where something changed, update it and commit + push. The user writes in Azerbaijani; answer in Azerbaijani.

- New videos: use the `/video` skill (`.claude/skills/video/`). It is self-contained — scaffold templates, motion patterns and design styles live in its `references/`.
- Each video is built from scratch in `src/videos/<slug>/`; its `index.ts` exports `videos: VideoEntry[]` (one per platform: `youtube` 16:9, `tiktok` 9:16 — see `src/types.ts`) and `src/Root.tsx` auto-discovers it (never edit Root to add a video).
- Git holds only the skeleton: skills, config, `src/Root.tsx`, `src/types.ts`. Everything in `src/videos/*` and `out/` is git-ignored and stays local — never force-add.
- Sound: royalty-free SFX kit in `public/audio/sfx/` (tracked; regenerate with `npm run sfx`), played via `src/sfx.tsx`. Licensed music/voiceovers go in other `public/audio/*` folders, which are git-ignored — never commit them.
- Official Remotion skills (`remotion-*`) are vendored in `.claude/skills/` (tracked in `skills-lock.json`). `/video` loads them every run. Update with `npx skills update -p -y`.
- Commands: `npm run studio` (preview), `npm run typecheck`, `npx remotion render <Id> out/<slug>.mp4`.
