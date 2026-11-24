import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CL, EASE_OUT, KenBurns, LightSweep} from '../../DockerInstall/components/ui';
import {FONT, IMG, P, SHADOW} from '../theme';

// ------------------------------------------------------------------ icons
type IP = {size?: number; color?: string; stroke?: number};
const Svg: React.FC<IP & {children: React.ReactNode}> = ({size = 64, color = P.navy, stroke = 2, children}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const I = {
  Hut: (p: IP) => (
    <Svg {...p}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </Svg>
  ),
  Person: (p: IP) => (
    <Svg {...p}>
      <circle cx="12" cy="7.5" r="4" />
      <path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5" />
    </Svg>
  ),
  Users: (p: IP) => (
    <Svg {...p}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2" />
      <circle cx="17" cy="9" r="2.8" />
      <path d="M16 13.9c3.2.3 5.5 2.7 5.5 5.8" />
    </Svg>
  ),
  Woman: (p: IP) => (
    <Svg {...p}>
      <circle cx="12" cy="6.5" r="3.5" />
      <path d="M12 10.5l-5 9.5h10z" />
      <path d="M10 20v2M14 20v2" />
    </Svg>
  ),
  Road: (p: IP) => (
    <Svg {...p}>
      <path d="M8 2L4 22M16 2l4 20" />
      <path d="M12 3v3M12 10v3M12 17v4" />
    </Svg>
  ),
  Drop: (p: IP) => (
    <Svg {...p}>
      <path d="M12 2.5S5 10.2 5 14.5a7 7 0 0 0 14 0C19 10.2 12 2.5 12 2.5z" />
    </Svg>
  ),
  Bulb: (p: IP) => (
    <Svg {...p}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2v.5h5v-.5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" />
    </Svg>
  ),
  Broom: (p: IP) => (
    <Svg {...p}>
      <path d="M19 3l-7 7" />
      <path d="M12 10l-6 4 4 7 6-4z" />
      <path d="M8 16l3 4M10 15l3 4" />
    </Svg>
  ),
  Gift: (p: IP) => (
    <Svg {...p}>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M3 12h18M12 8v13" />
      <path d="M12 8C10 4 6.5 4.5 7 7c.3 1 2.5 1 5 1zM12 8c2-4 5.5-3.5 5-1-.3 1-2.5 1-5 1z" />
    </Svg>
  ),
  Plan: (p: IP) => (
    <Svg {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9M13 13h5M13 17h3" />
    </Svg>
  ),
  Meeting: (p: IP) => (
    <Svg {...p}>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="10" r="2.2" />
      <circle cx="19" cy="10" r="2.2" />
      <ellipse cx="12" cy="16" rx="7" ry="3" />
    </Svg>
  ),
  Handshake: (p: IP) => (
    <Svg {...p}>
      <path d="M2 11l4-4 4 2 3-2 4 1 5 3" />
      <path d="M6 13l4 4c.8.8 2 .8 2.8 0l4.7-4.7" />
      <path d="M2 11l4 2M22 11l-4.5 2" />
    </Svg>
  ),
  Wrench: (p: IP) => (
    <Svg {...p}>
      <path d="M14.7 6.3a4 4 0 0 0 5 5L22 13.6 13.6 22l-2.3-2.3a4 4 0 0 0-5-5L2 10.4 10.4 2z" opacity="0" />
      <path d="M15 6a4 4 0 1 0 3 3l-8 8-3 1 1-3z" />
    </Svg>
  ),
  Growth: (p: IP) => (
    <Svg {...p}>
      <path d="M3 20h18" />
      <path d="M5 16l5-5 4 3 6-7" />
      <path d="M15 7h5v5" />
    </Svg>
  ),
  Book: (p: IP) => (
    <Svg {...p}>
      <path d="M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z" />
      <path d="M8 9h6M8 13h6" />
    </Svg>
  ),
  List: (p: IP) => (
    <Svg {...p}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </Svg>
  ),
  Check: (p: IP) => (
    <Svg {...p}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Svg>
  ),
  Star: (p: IP) => (
    <Svg {...p}>
      <path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" />
    </Svg>
  ),
  Question: (p: IP) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.3-2.5 4M12 17.5h.01" />
    </Svg>
  ),
  Share: (p: IP) => (
    <Svg {...p}>
      <circle cx="18" cy="5" r="2.6" />
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="19" r="2.6" />
      <path d="M8.3 10.8l7.4-4.4M8.3 13.2l7.4 4.4" />
    </Svg>
  ),
  Bell: (p: IP) => (
    <Svg {...p}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
    </Svg>
  ),
  Building: (p: IP) => (
    <Svg {...p}>
      <path d="M3 21h18M5 21V8l7-5 7 5v13" />
      <path d="M9 21v-5h6v5M9 11h.01M15 11h.01" />
    </Svg>
  ),
  Seat: (p: IP) => (
    <Svg {...p}>
      <path d="M7 3h10v9H7z" />
      <path d="M5 12h14v4H5zM7 16v5M17 16v5" />
    </Svg>
  ),
};

// ------------------------------------------------------------------ pieces
/** Rounded real-photo card with Ken Burns inside and a spring entrance. */
export const PhotoCard: React.FC<{
  src: string;
  at: number;
  x: number;
  y: number;
  w: number;
  h: number;
  dur?: number;
  from?: 'scale' | 'left' | 'right' | 'bottom' | 'top';
  rotate?: number;
  zoom?: [number, number];
  caption?: string;
  style?: React.CSSProperties;
}> = ({src, at, x, y, w, h, dur = 200, from = 'scale', rotate = 0, zoom = [1.08, 1.2], caption, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 14, stiffness: 140}});
  const off = {scale: '0px 0px', left: `${(1 - s) * -900}px 0px`, right: `${(1 - s) * 900}px 0px`, bottom: `0px ${(1 - s) * 800}px`, top: `0px ${(1 - s) * -800}px`}[from];
  if (frame < at - 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 40,
        overflow: 'hidden',
        border: `8px solid ${P.paper}`,
        boxShadow: SHADOW.card,
        opacity: Math.min(1, s * 1.6),
        scale: from === 'scale' ? String(0.55 + 0.45 * s) : '1',
        translate: off,
        rotate: `${rotate * s}deg`,
        ...style,
      }}
    >
      <KenBurns src={src} dur={dur} zoom={zoom} />
      {caption ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '60px 26px 20px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.92) 60%)',
            fontFamily: FONT.body,
            fontWeight: 800,
            fontSize: 34,
            color: P.ink,
          }}
        >
          {caption}
        </div>
      ) : null}
      <LightSweep at={at + 10} dur={22} opacity={0.45} />
    </div>
  );
};

/** Section title badge: "02  Who can contest?" */
export const SectionBadge: React.FC<{n: number; title: string; at: number; color?: string}> = ({n, title, at, color = P.saffron}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 14}});
  const line = interpolate(frame, [at + 6, at + 26], [0, 1], {...CL, easing: EASE_OUT});
  return (
    <div style={{position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: s, translate: `0px ${(1 - s) * -60}px`, zIndex: 20}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 34px 12px 14px', borderRadius: 999, background: P.paper, boxShadow: SHADOW.soft, border: `3px solid ${color}44`}}>
        <div style={{width: 64, height: 64, borderRadius: 99, background: color, color: P.paper, display: 'grid', placeItems: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 32}}>
          {String(n).padStart(2, '0')}
        </div>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 40, color: P.ink}}>{title}</div>
      </div>
      <TriLine width={300 * line} />
    </div>
  );
};

/** Saffron / white / green underline. */
export const TriLine: React.FC<{width: number; height?: number}> = ({width, height = 8}) => (
  <div style={{display: 'flex', width, height, borderRadius: height, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
    <div style={{flex: 1, background: P.saffron}} />
    <div style={{flex: 1, background: '#F4F4F4'}} />
    <div style={{flex: 1, background: P.green}} />
  </div>
);

/** Round icon tile with label that springs in. */
export const IconTile: React.FC<{
  icon: (p: IP) => React.ReactElement;
  label: string;
  at: number;
  x: number;
  y: number;
  w?: number;
  color?: string;
  active?: boolean;
}> = ({icon: Ico, label, at, x, y, w = 440, color = P.navy, active = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 12, stiffness: 150}});
  if (frame < at - 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '22px 26px',
        borderRadius: 32,
        background: P.paper,
        boxShadow: active ? SHADOW.glow(color) : SHADOW.soft,
        opacity: Math.min(1, s * 1.5),
        scale: String(0.5 + 0.5 * s),
        translate: `0px ${(1 - s) * 80}px`,
      }}
    >
      <div style={{width: 92, height: 92, flexShrink: 0, borderRadius: 26, background: `${color}1c`, display: 'grid', placeItems: 'center'}}>
        <Ico size={60} color={color} stroke={2.1} />
      </div>
      <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 34, color: P.ink, lineHeight: 1.15}}>{label}</div>
    </div>
  );
};

/** The Indian flag card, gently waving. */
export const FlagCard: React.FC<{at: number; x: number; y: number; w: number}> = ({at, x, y, w}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 13}});
  const wave = Math.sin(frame / 9) * 3;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: s, scale: String(0.5 + 0.5 * s), rotate: `${wave * 0.4}deg`}}>
      <div style={{borderRadius: 18, overflow: 'hidden', boxShadow: SHADOW.card, border: `6px solid ${P.paper}`, transform: `perspective(900px) rotateY(${wave * 2}deg)`}}>
        <Img src={IMG.flag} style={{width: '100%', display: 'block'}} />
      </div>
    </div>
  );
};

/** Full-bleed photo backdrop softened with a light wash (keeps the theme light). */
export const PhotoBackdrop: React.FC<{src: string; dur: number; wash?: number; zoom?: [number, number]}> = ({src, dur, wash = 0.55, zoom = [1.12, 1.25]}) => (
  <AbsoluteFill>
    <KenBurns src={src} dur={dur} zoom={zoom} overlay={`linear-gradient(180deg, rgba(255,251,243,${wash + 0.2}) 0%, rgba(255,251,243,${wash}) 40%, rgba(255,251,243,${wash + 0.3}) 100%)`} />
  </AbsoluteFill>
);
