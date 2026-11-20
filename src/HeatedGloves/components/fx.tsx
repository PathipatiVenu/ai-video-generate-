import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CL, EASE_OUT} from '../../DockerInstall/components/ui';
import {FONT, G, IMG, SHADOW} from '../theme';

/** Falling snow (deterministic). `melt` 0→1 turns flakes into warm embers rising. */
export const SnowFall: React.FC<{count?: number; melt?: number; seed?: string}> = ({count = 60, melt = 0, seed = 'snow'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const size = 6 + random(`${seed}s${i}`) * 16;
        const speed = 1.4 + random(`${seed}v${i}`) * 3;
        const x0 = random(`${seed}x${i}`) * width;
        const fall = (random(`${seed}y${i}`) * height + frame * speed) % (height + 60);
        const rise = height - ((random(`${seed}y${i}`) * height + frame * speed * 0.8) % (height + 60));
        const y = fall * (1 - melt) + rise * melt;
        const x = x0 + Math.sin((frame + i * 30) / (24 + (i % 7) * 4)) * 26;
        const color = melt > 0.5 ? (i % 3 ? G.warm : G.gold) : G.white;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size * (1 - melt * 0.5),
              height: size * (1 - melt * 0.5),
              borderRadius: 99,
              background: color,
              opacity: 0.85,
              boxShadow: melt > 0.5 ? `0 0 12px ${G.warm}` : '0 0 6px rgba(255,255,255,0.9)',
              filter: size > 16 ? 'blur(1.5px)' : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Real frost photo creeping in from the edges (radial mask). */
export const FrostCreep: React.FC<{from: number; dur: number; max?: number; thaw?: number}> = ({from, dur, max = 0.85, thaw}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, from + dur], [0, 1], {...CL, easing: EASE_OUT});
  const t = thaw === undefined ? 0 : interpolate(frame, [thaw, thaw + 16], [0, 1], CL);
  const hole = 70 - p * 42 + t * 60; // % radius of the clear centre
  return (
    <AbsoluteFill
      style={{
        opacity: max * (1 - t),
        maskImage: `radial-gradient(ellipse at 50% 50%, transparent ${hole}%, black ${hole + 22}%)`,
        mixBlendMode: 'screen',
      }}
    >
      <Img src={IMG.frost} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.25) saturate(0.6) hue-rotate(170deg)'}} />
    </AbsoluteFill>
  );
};

/** Vertical thermometer; `level` 0..1, colour runs icy blue → hot orange. */
export const Thermometer: React.FC<{level: number; style?: React.CSSProperties}> = ({level, style}) => {
  const hot = level > 0.5;
  const color = interpolateColor(level);
  return (
    <div style={{position: 'absolute', width: 120, height: 560, ...style}}>
      <div style={{position: 'absolute', left: 34, top: 0, width: 52, height: 470, borderRadius: 40, background: G.white, boxShadow: SHADOW.soft, overflow: 'hidden', border: `4px solid ${G.white}`}}>
        <div style={{position: 'absolute', left: 8, right: 8, bottom: 0, height: `${8 + level * 88}%`, borderRadius: 30, background: color}} />
        {[0.2, 0.4, 0.6, 0.8].map((m) => (
          <div key={m} style={{position: 'absolute', right: 0, top: `${(1 - m) * 100}%`, width: 14, height: 4, background: 'rgba(27,42,68,0.25)'}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, bottom: 0, width: 120, height: 120, borderRadius: 99, background: color, border: `8px solid ${G.white}`, boxShadow: hot ? `0 0 50px ${G.warm}` : `0 0 40px ${G.ice}`}} />
    </div>
  );
};

const interpolateColor = (t: number) => {
  const a = [61, 143, 214];
  const b = [255, 90, 20];
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * Math.min(1, Math.max(0, t))));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

/** Pulsing warm glow behind a product. */
export const HeatGlow: React.FC<{size?: number; intensity?: number; style?: React.CSSProperties}> = ({size = 900, intensity = 1, style}) => {
  const frame = useCurrentFrame();
  const pulse = 0.85 + Math.sin(frame / 7) * 0.15;
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,122,26,${0.55 * intensity}) 0%, rgba(255,176,32,${0.25 * intensity}) 35%, rgba(255,176,32,0) 68%)`,
        scale: String(pulse),
        ...style,
      }}
    />
  );
};

/** Wavy heat lines rising. */
export const HeatWaves: React.FC<{x: number; y: number; at?: number}> = ({x, y, at = 0}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <svg width={360} height={300} style={{position: 'absolute', left: x - 180, top: y - 300, overflow: 'visible'}}>
      {[0, 1, 2].map((i) => {
        const t = ((frame - at) / 40 + i / 3) % 1;
        const d = `M ${80 + i * 100} 300 C ${50 + i * 100} 230, ${110 + i * 100} 170, ${80 + i * 100} 100 S ${50 + i * 100} 20, ${80 + i * 100} 0`;
        return (
          <path
            key={i}
            d={d}
            stroke={G.warm}
            strokeWidth={10}
            strokeLinecap="round"
            fill="none"
            opacity={Math.sin(t * Math.PI) * 0.8}
            style={{translate: `0px ${-t * 80}px`}}
          />
        );
      })}
    </svg>
  );
};

/** White product card that springs in. */
export const ProductCard: React.FC<{
  src: string;
  at: number;
  width: number;
  height: number;
  x: number;
  y: number;
  rotate?: number;
  round?: boolean;
  pad?: number;
  style?: React.CSSProperties;
  from?: 'bottom' | 'left' | 'right' | 'scale';
}> = ({src, at, width, height, x, y, rotate = 0, round, pad = 24, style, from = 'scale'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 13, stiffness: 150}});
  const off =
    from === 'bottom' ? `0px ${(1 - s) * 700}px` : from === 'left' ? `${(1 - s) * -900}px 0px` : from === 'right' ? `${(1 - s) * 900}px 0px` : '0px 0px';
  const float = Math.sin((frame + x) / 30) * 8;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + float,
        width,
        height,
        padding: round ? 0 : pad,
        borderRadius: round ? '50%' : 44,
        background: G.white,
        boxShadow: SHADOW.card,
        overflow: 'hidden',
        opacity: s > 0.01 ? Math.min(1, s * 1.5) : 0,
        scale: from === 'scale' ? String(0.4 + 0.6 * s) : '1',
        translate: off,
        rotate: `${rotate * s + (1 - s) * rotate * 3}deg`,
        ...style,
      }}
    >
      <Img src={src} style={{width: '100%', height: '100%', objectFit: round ? 'cover' : 'contain'}} />
    </div>
  );
};

/** Pill label (keywords only). */
export const Label: React.FC<{at: number; x?: number; y: number; bg?: string; color?: string; children: React.ReactNode; size?: number}> = ({
  at,
  x,
  y,
  bg = G.warm,
  color = G.white,
  children,
  size = 40,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 11}});
  if (frame < at) return null;
  return (
    <div style={{position: 'absolute', left: x ?? 0, right: x === undefined ? 0 : undefined, top: y, display: 'flex', justifyContent: x === undefined ? 'center' : 'flex-start'}}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 34px',
          borderRadius: 999,
          background: bg,
          color,
          fontFamily: FONT.body,
          fontWeight: 800,
          fontSize: size,
          boxShadow: SHADOW.soft,
          scale: String(s),
          rotate: `${(1 - s) * -12}deg`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** USB-A plug sliding into a port, with a spark when connected. */
export const UsbPlug: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 22], [0, 1], {...CL, easing: EASE_OUT});
  const spark = interpolate(frame, [at + 20, at + 34], [0, 1], CL);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 520, height: 160, scale: '1.45', transformOrigin: '50% 50%'}}>
      {/* power bank / laptop port */}
      <div style={{position: 'absolute', right: 0, top: 10, width: 200, height: 140, borderRadius: 30, background: 'linear-gradient(160deg, #FFFFFF, #E6ECF5)', boxShadow: SHADOW.soft, display: 'grid', placeItems: 'center'}}>
        <div style={{width: 70, height: 30, borderRadius: 6, background: G.navy, boxShadow: spark > 0 && spark < 1 ? `0 0 ${30 * Math.sin(spark * Math.PI)}px ${G.gold}` : undefined}} />
      </div>
      {/* cable + plug */}
      <div style={{position: 'absolute', top: 66, left: 0, height: 26, width: 120 + p * 140, borderRadius: 13, background: '#F2F4F8', boxShadow: SHADOW.soft}} />
      <div style={{position: 'absolute', top: 48, left: 110 + p * 140, width: 120, height: 62, borderRadius: 12, background: '#FFFFFF', boxShadow: SHADOW.soft, border: '3px solid #DDE3EE'}}>
        <div style={{position: 'absolute', right: -36, top: 12, width: 40, height: 32, borderRadius: 4, background: '#C9D1DE'}} />
      </div>
      {spark > 0 && spark < 1 ? (
        <div style={{position: 'absolute', right: 150, top: 30, width: 100, height: 100, borderRadius: 99, border: `6px solid ${G.gold}`, opacity: 1 - spark, scale: String(0.4 + spark * 1.4)}} />
      ) : null}
    </div>
  );
};

/** Finger-tap ripples on a touchscreen. */
export const TapRipples: React.FC<{taps: {f: number; x: number; y: number}[]}> = ({taps}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {taps.map((t, i) => {
        const p = interpolate(frame, [t.f, t.f + 18], [0, 1], CL);
        if (frame < t.f || p >= 1) return null;
        return (
          <div key={i} style={{position: 'absolute', left: t.x - 60 * p, top: t.y - 60 * p, width: 120 * p, height: 120 * p, borderRadius: 99, border: `6px solid ${G.white}`, background: 'rgba(255,255,255,0.25)', opacity: 1 - p}} />
        );
      })}
    </>
  );
};
