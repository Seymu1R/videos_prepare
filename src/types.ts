import type { ComponentType } from "react";

/** What every src/videos/<slug>/index.ts exports as `video` (or `videos`); Root registers it automatically. */
export type VideoEntry = {
  id: string;
  component: ComponentType<Record<string, unknown>>;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
};

/** Publishing targets. youtube = YouTube, Facebook, LinkedIn, X; tiktok = TikTok, Instagram Reels/Stories, YouTube Shorts. */
export const PLATFORMS = {
  youtube: { width: 1920, height: 1080, suffix: "Youtube" },
  tiktok: { width: 1080, height: 1920, suffix: "Tiktok" },
  square: { width: 1080, height: 1080, suffix: "Square" },
} as const;

export type Platform = keyof typeof PLATFORMS;
