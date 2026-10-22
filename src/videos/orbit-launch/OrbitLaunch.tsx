import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "./Background";
import { Hook } from "./scenes/Hook";
import { Chaos } from "./scenes/Chaos";
import { LogoReveal } from "./scenes/LogoReveal";
import { Features } from "./scenes/Features";
import { CTA } from "./scenes/CTA";
import { C, fontFamily } from "./theme";

// Scenes overlap by 6–10 frames so every cut is a motion transition.
export const SCENES = {
  hook: { from: 0, duration: 90 },
  chaos: { from: 80, duration: 106 },
  logo: { from: 180, duration: 108 },
  features: { from: 282, duration: 114 },
  cta: { from: 390, duration: 60 },
} as const;

export const OrbitLaunch: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily, color: C.text }}>
    <Background />
    <Sequence {...SCENES.hook} name="Hook">
      <Hook />
    </Sequence>
    <Sequence {...SCENES.chaos} name="Chaos">
      <Chaos />
    </Sequence>
    <Sequence {...SCENES.logo} name="Logo">
      <LogoReveal />
    </Sequence>
    <Sequence {...SCENES.features} name="Features">
      <Features />
    </Sequence>
    <Sequence {...SCENES.cta} name="CTA">
      <CTA />
    </Sequence>
  </AbsoluteFill>
);
