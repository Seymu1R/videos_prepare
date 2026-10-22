import { C } from "./theme";

const R_RING = 150;
const CIRC = 2 * Math.PI * R_RING;

/**
 * Orbit logo: gradient planet + drawn ring + orbiting satellite.
 * @param core  0→1 planet growth
 * @param ring  0→1 ring stroke draw
 * @param angle satellite angle in degrees
 */
export const LogoMark: React.FC<{ size: number; core: number; ring: number; angle: number }> = ({
  size,
  core,
  ring,
  angle,
}) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  const sx = 180 + Math.cos(rad) * R_RING;
  const sy = 180 + Math.sin(rad) * R_RING;
  return (
    <svg width={size} height={size} viewBox="0 0 360 360" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="orbit-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.violet} />
          <stop offset="100%" stopColor={C.cyan} />
        </linearGradient>
        <radialGradient id="orbit-core" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor={C.violet} />
        </radialGradient>
        <filter id="orbit-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx={180}
        cy={180}
        r={R_RING}
        fill="none"
        stroke="url(#orbit-g)"
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={CIRC}
        strokeDashoffset={CIRC * (1 - ring)}
        transform="rotate(-90 180 180)"
        filter="url(#orbit-glow)"
      />
      <circle cx={180} cy={180} r={20 + 52 * core} fill="url(#orbit-core)" filter="url(#orbit-glow)" />
      {ring > 0.02 && <circle cx={sx} cy={sy} r={18} fill="#fff" filter="url(#orbit-glow)" />}
    </svg>
  );
};
