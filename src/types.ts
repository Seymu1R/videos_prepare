import type { ComponentType } from "react";

/** What every src/videos/<slug>/index.ts exports as `video`; Root registers it automatically. */
export type VideoEntry = {
  id: string;
  component: ComponentType<Record<string, unknown>>;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
};
