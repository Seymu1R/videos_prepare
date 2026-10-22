import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

/** Royalty-free kit in public/audio/sfx/, synthesized by scripts/make-sfx.sh. */
export type Sound = "hit" | "stamp" | "pop" | "whoosh" | "swish" | "fall" | "ding";

/** `at` is a composition frame; volume 0–1. */
export type SfxCue = { at: number; sound: Sound; volume: number };

// Longest sound (ding) is 1.2 s.
const MAX_FRAMES = 40;

export const SfxTrack: React.FC<{ cues: SfxCue[] }> = ({ cues }) => (
  <>
    {cues.map((c) => (
      <Sequence
        key={`${c.at}-${c.sound}`}
        from={c.at}
        durationInFrames={MAX_FRAMES}
        name={`sfx ${c.sound}`}
        layout="none"
      >
        <Audio src={staticFile(`audio/sfx/${c.sound}.wav`)} volume={c.volume} />
      </Sequence>
    ))}
  </>
);
