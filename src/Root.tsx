import { Composition } from "remotion";
import type { VideoEntry } from "./types";

// Auto-discovers every src/videos/<slug>/index.ts — never edit this file to add a video.
const context = require.context("./videos", true, /^\.\/[^/]+\/index\.ts$/);
const videos = context
  .keys()
  .map((key) => context<{ video?: VideoEntry }>(key).video)
  // A half-written video folder must not break every other video.
  .filter((v): v is VideoEntry => v !== undefined)
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
