import { Composition } from "remotion";
import { OrbitLaunch } from "./videos/orbit-launch/OrbitLaunch";
import * as orbit from "./videos/orbit-launch/theme";

// Every video lives in src/videos/<slug>/ and is registered here as one <Composition>.
export const Root: React.FC = () => (
  <>
    <Composition
      id="OrbitLaunch"
      component={OrbitLaunch}
      durationInFrames={orbit.DURATION}
      fps={orbit.FPS}
      width={orbit.WIDTH}
      height={orbit.HEIGHT}
    />
  </>
);
