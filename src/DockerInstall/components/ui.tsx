import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, FONT, SHADOW} from '../theme';
import {TR} from '../timeline';

export const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** 0→1 progress between two frames with a nice ease. */
export const prog = (frame: number, from: number, dur: number, easing = EASE_OUT) =>
  interpolate(frame, [from, from + dur], [0, 1], {...CL, easing});

/** Spring that starts at `delay` frames. */
export const useSpr = (delay: number, damping = 14, mass = 0.8) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, mass, stiffness: 140}});
};

/** Typewriter helper. */
export const typed = (text: string, frame: number, start: number, charsPerFrame = 0.55) =>
  text.slice(0, Math.max(0, Math.floor((frame - start) * charsPerFrame)));

// ------------------------------------------------------------------ backgrounds
type GridProps = {
  tint?: string; // main glow colour
  tint2?: string; // secondary glow
  base?: string;
  perspective?: boolean;
  cell?: number;
  line?: string; // grid line colour
};

/** Light animated grid — the visual base of the whole video (never black). */
export const GridBackground: React.FC<GridProps> = ({
  tint = C.blue,
  tint2 = C.cyan,
  base = C.bg,
  perspective = false,
  cell = 72,
  line = C.grid,
}) => {
  const frame = useCurrentFrame();
  const drift = frame * 0.6;
  const grid: React.CSSProperties = {
    position: 'absolute',
    inset: perspective ? '-60% -40% -10% -40%' : -cell,
    backgroundImage: `linear-gradient(${line} 2px, transparent 2px), linear-gradient(90deg, ${line} 2px, transparent 2px)`,
    backgroundSize: `${cell}px ${cell}px`,
    backgroundPosition: `${drift % cell}px ${(drift * 0.7) % cell}px`,
    transform: perspective ? 'perspective(900px) rotateX(58deg)' : undefined,
    transformOrigin: '50% 100%',
    maskImage: perspective
      ? 'linear-gradient(to top, black 30%, transparent 85%)'
      : 'radial-gradient(ellipse 80% 70% at 50% 45%, black 40%, transparent 100%)',
  };
  const blobX = Math.sin(frame / 70) * 120;
  const blobY = Math.cos(frame / 90) * 160;
  return (
    <AbsoluteFill style={{backgroundColor: base, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          left: -300 + blobX,
          top: 80 + blobY,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${tint}33 0%, ${tint}00 65%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          right: -320 - blobX,
          bottom: 60 - blobY,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${tint2}30 0%, ${tint2}00 65%)`,
        }}
      />
      <div style={grid} />
      {/* soft light vignette (bluish, not dark) */}
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse 90% 75% at 50% 45%, transparent 55%, rgba(29,99,237,0.10) 100%)'}}
      />
    </AbsoluteFill>
  );
};

/** Floating dust particles for depth. */
export const Particles: React.FC<{count?: number; color?: string; seed?: string}> = ({
  count = 26,
  color = C.blue,
  seed = 'p',
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`${seed}x${i}`) * width;
        const speed = 0.4 + random(`${seed}s${i}`) * 1.2;
        const y = (random(`${seed}y${i}`) * height - frame * speed + height * 4) % (height + 40);
        const size = 4 + random(`${seed}r${i}`) * 10;
        const o = 0.15 + random(`${seed}o${i}`) * 0.35;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.sin((frame + i * 20) / 30) * 14,
              top: y,
              width: size,
              height: size,
              borderRadius: size,
              background: color,
              opacity: o,
              filter: 'blur(1px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Slow camera move applied to a whole scene. */
export const Camera: React.FC<{
  children: React.ReactNode;
  from?: number;
  to?: number;
  dur: number;
  driftX?: number;
  driftY?: number;
  rotate?: number;
}> = ({children, from = 1, to = 1.06, dur, driftX = 0, driftY = 0, rotate = 0}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        scale: String(interpolate(frame, [0, dur], [from, to], {...CL, easing: EASE_IN_OUT})),
        translate: `${interpolate(frame, [0, dur], [0, driftX], CL)}px ${interpolate(frame, [0, dur], [0, driftY], CL)}px`,
        rotate: `${interpolate(frame, [0, dur], [0, rotate], CL)}deg`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Ken Burns photo with optional blur-to-sharp reveal. */
export const KenBurns: React.FC<{
  src: string;
  dur: number;
  zoom?: [number, number];
  pan?: [string, string];
  blurIn?: number;
  style?: React.CSSProperties;
  overlay?: string;
}> = ({src, dur, zoom = [1.08, 1.22], pan = ['0px 0px', '-40px -30px'], blurIn = 0, style, overlay}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          scale: String(interpolate(frame, [0, dur], zoom, {...CL, easing: EASE_IN_OUT})),
          translate: lerpPan(pan, frame / dur),
          filter: blurIn ? `blur(${interpolate(frame, [0, blurIn], [24, 0], {...CL, easing: EASE_OUT})}px)` : undefined,
        }}
      />
      {overlay ? <AbsoluteFill style={{background: overlay}} /> : null}
    </AbsoluteFill>
  );
};

const lerpPan = (pan: [string, string], t: number) => {
  const a = pan[0].split(' ').map(parseFloat);
  const b = pan[1].split(' ').map(parseFloat);
  const e = EASE_IN_OUT(Math.min(1, Math.max(0, t)));
  return `${a[0] + (b[0] - a[0]) * e}px ${a[1] + (b[1] - a[1]) * e}px`;
};

// ------------------------------------------------------------------ transitions
export type EnterType = 'zoom' | 'wipe' | 'circle' | 'slide' | 'flash' | 'none';

/** Entrance presentation for a scene; plays during the first TR frames (overlapping the previous scene). */
export const SceneEnter: React.FC<{type: EnterType; children: React.ReactNode}> = ({type, children}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, TR], [0, 1], {...CL, easing: EASE_IN_OUT});
  if (type === 'none' || p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  if (type === 'zoom') {
    return (
      <AbsoluteFill style={{opacity: p, scale: String(1.35 - 0.35 * p), filter: `blur(${(1 - p) * 18}px)`}}>
        {children}
      </AbsoluteFill>
    );
  }
  if (type === 'wipe') {
    const x = -40 + p * 180;
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{clipPath: `polygon(0 0, ${x}% 0, ${x - 40}% 100%, 0 100%)`}}>{children}</AbsoluteFill>
        <AbsoluteFill
          style={{
            clipPath: `polygon(${x}% 0, ${x + 6}% 0, ${x - 34}% 100%, ${x - 40}% 100%)`,
            background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`,
          }}
        />
      </AbsoluteFill>
    );
  }
  if (type === 'circle') {
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{clipPath: `circle(${p * 78}% at 50% 48%)`}}>{children}</AbsoluteFill>
        <AbsoluteFill
          style={{
            clipPath: `circle(${p * 78 + 1.5}% at 50% 48%)`,
            background: C.blue,
            opacity: 0.9 * (1 - p),
            zIndex: -1,
          }}
        />
      </AbsoluteFill>
    );
  }
  if (type === 'slide') {
    return (
      <AbsoluteFill style={{translate: `0px ${(1 - p) * 1920}px`, filter: `blur(${(1 - p) * 8}px)`}}>
        {children}
      </AbsoluteFill>
    );
  }
  // flash
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: p}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{background: C.white, opacity: Math.sin(p * Math.PI) * 0.95}} />
    </AbsoluteFill>
  );
};

/** Diagonal light sweep across an element/scene. */
export const LightSweep: React.FC<{at: number; dur?: number; opacity?: number}> = ({at, dur = 22, opacity = 0.7}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [-0.4, 1.4], CL);
  if (frame < at || frame > at + dur) return null;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(115deg, transparent ${p * 100 - 12}%, rgba(255,255,255,${opacity}) ${p * 100}%, transparent ${p * 100 + 12}%)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
};

// ------------------------------------------------------------------ UI pieces
/** Windows 11–style app window. */
export const WindowFrame: React.FC<{
  title: string;
  icon?: React.ReactNode;
  width: number;
  height: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  dark?: boolean;
}> = ({title, icon, width, height, children, style, dark}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 26,
      overflow: 'hidden',
      background: dark ? C.terminal : C.white,
      boxShadow: SHADOW.card,
      border: `2px solid ${dark ? '#24365C' : 'rgba(11,31,68,0.08)'}`,
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    <div
      style={{
        height: 70,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 26px',
        background: dark ? '#1A2D52' : '#F1F4FA',
        color: dark ? C.terminalText : C.navy,
        fontFamily: FONT.body,
        fontSize: 26,
        fontWeight: 600,
      }}
    >
      {icon}
      <span style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden'}}>{title}</span>
      <span style={{display: 'flex', gap: 34, fontSize: 24, opacity: 0.6, fontWeight: 400}}>
        <span>─</span>
        <span>☐</span>
        <span>✕</span>
      </span>
    </div>
    <div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>{children}</div>
  </div>
);

/** Mouse cursor that follows keyframes and shows click ripples. */
export const Cursor: React.FC<{
  path: {f: number; x: number; y: number}[];
  clicks?: number[];
  appearAt?: number;
  hideAt?: number;
}> = ({path, clicks = [], appearAt, hideAt}) => {
  const frame = useCurrentFrame();
  const fs = path.map((p) => p.f);
  const x = interpolate(frame, fs, path.map((p) => p.x), {...CL, easing: EASE_IN_OUT});
  const y = interpolate(frame, fs, path.map((p) => p.y), {...CL, easing: EASE_IN_OUT});
  const start = appearAt ?? path[0].f;
  const opacity = interpolate(frame, [start, start + 6], [0, 1], CL) * (hideAt === undefined ? 1 : interpolate(frame, [hideAt, hideAt + 8], [1, 0], CL));
  const pressed = clicks.some((c) => frame >= c && frame < c + 5);
  return (
    <>
      {clicks.map((c) => {
        const p = interpolate(frame, [c, c + 16], [0, 1], CL);
        if (frame < c || p >= 1) return null;
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: x - 50 * p,
              top: y - 50 * p,
              width: 100 * p,
              height: 100 * p,
              borderRadius: '50%',
              border: `5px solid ${C.blue}`,
              opacity: 1 - p,
            }}
          />
        );
      })}
      <svg
        width={58}
        height={58}
        viewBox="0 0 24 24"
        style={{position: 'absolute', left: x - 6, top: y - 4, opacity, scale: pressed ? '0.85' : '1', filter: 'drop-shadow(0 6px 8px rgba(11,31,68,0.35))'}}
      >
        <path d="M4 2l15 9.5-6.6 1.3 3.9 7.2-2.9 1.5-3.8-7.2L4 19z" fill={C.white} stroke={C.navy} strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/** "STEP 01" badge with animated number. */
export const StepBadge: React.FC<{n: number; label: string; at?: number}> = ({n, label, at = TR}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 13}});
  const lineW = interpolate(frame, [at + 6, at + 26], [0, 1], {...CL, easing: EASE_OUT});
  return (
    <div
      style={{
        position: 'absolute',
        top: 210,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        opacity: s,
        translate: `0px ${(1 - s) * -60}px`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '14px 34px 14px 16px',
          background: C.white,
          borderRadius: 999,
          boxShadow: SHADOW.soft,
          border: `2px solid ${C.blueSoft}`,
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`,
            color: C.white,
            display: 'grid',
            placeItems: 'center',
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 34,
          }}
        >
          {String(n).padStart(2, '0')}
        </div>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 40, color: C.navy, letterSpacing: 1}}>
          {label}
        </div>
      </div>
      <div style={{height: 5, width: 260 * lineW, borderRadius: 5, background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`}} />
    </div>
  );
};

/** Pill/chip label. */
export const Chip: React.FC<{children: React.ReactNode; color?: string; bg?: string; style?: React.CSSProperties}> = ({
  children,
  color = C.blue,
  bg = C.white,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 28px',
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: FONT.body,
      fontWeight: 700,
      fontSize: 34,
      boxShadow: SHADOW.soft,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Deterministic confetti burst. */
export const Confetti: React.FC<{at: number; x?: number; y?: number; count?: number}> = ({at, x = 540, y = 900, count = 70}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 75) return null;
  const colors = [C.blue, C.cyan, C.green, C.amber, C.coral, '#8B5CF6'];
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const ang = random(`ca${i}`) * Math.PI * 2;
        const v = 14 + random(`cv${i}`) * 26;
        const px = x + Math.cos(ang) * v * t * 0.9;
        const py = y + Math.sin(ang) * v * t * 0.9 + 0.55 * t * t;
        const rot = t * (8 + random(`cr${i}`) * 20);
        const w = 12 + random(`cw${i}`) * 14;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: w,
              height: w * 0.5,
              background: colors[i % colors.length],
              rotate: `${rot}deg`,
              opacity: interpolate(t, [45, 75], [1, 0], CL),
              borderRadius: 3,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ icons
type IconProps = {size?: number; color?: string; stroke?: number};
const Svg: React.FC<IconProps & {children: React.ReactNode}> = ({size = 64, color = C.blue, stroke = 2, children}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const Icon = {
  Globe: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19M12 2.5c2.6 2.8 3.9 6 3.9 9.5S14.6 18.7 12 21.5C9.4 18.7 8.1 15.5 8.1 12S9.4 5.3 12 2.5z" />
    </Svg>
  ),
  Database: (p: IconProps) => (
    <Svg {...p}>
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </Svg>
  ),
  Gear: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </Svg>
  ),
  Download: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
    </Svg>
  ),
  Check: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Svg>
  ),
  Refresh: (p: IconProps) => (
    <Svg {...p}>
      <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
    </Svg>
  ),
  Terminal: (p: IconProps) => (
    <Svg {...p}>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <path d="M6.5 9.5l3 2.5-3 2.5M12 15h5" />
    </Svg>
  ),
  Shield: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </Svg>
  ),
  Search: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20.5 20.5l-4.5-4.5" />
    </Svg>
  ),
  Box: (p: IconProps) => (
    <Svg {...p}>
      <path d="M21 7.5l-9-5-9 5v9l9 5 9-5z" />
      <path d="M3 7.5l9 5 9-5M12 12.5v9" />
    </Svg>
  ),
  Bell: (p: IconProps) => (
    <Svg {...p}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
    </Svg>
  ),
  Power: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 2.5v9M6.4 6.4a8 8 0 1 0 11.2 0" />
    </Svg>
  ),
  File: (p: IconProps) => (
    <Svg {...p}>
      <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z" />
      <path d="M14 2.5V8h5.5" />
    </Svg>
  ),
  Stairs: (p: IconProps) => (
    <Svg {...p}>
      <path d="M3 20h5v-5h5v-5h5V5h3" />
    </Svg>
  ),
};
