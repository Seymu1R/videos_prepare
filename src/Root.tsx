import { Composition } from "remotion";
import type { VideoEntry } from "./types";

// Auto-discovers every src/videos/<slug>/index.ts — never edit this file to add a video.
// A folder exports either `video` (one format) or `videos` (e.g. YouTube 16:9 + TikTok 9:16).
const context = require.context("./videos", true, /^\.\/[^/]+\/index\.ts$/);
const videos = context
  .keys()
  .flatMap((key) => {
    const mod = context<{ video?: VideoEntry; videos?: VideoEntry[] }>(key);
    // A half-written video folder must not break every other video.
    return [...(mod.videos ?? []), ...(mod.video ? [mod.video] : [])];
  })
  .sort((a, b) => a.id.localeCompare(b.id));

export const Root: React.FC = () => (
  <>
    {videos.map((v) => (
      <Composition
        key={v.id}
        id={v.id}
        component={v.component}
        durationInFrames={v.durationInFrames}
        fps={v.fps}
        width={v.width}
        height={v.height}
      />
    ))}
  </>
);
