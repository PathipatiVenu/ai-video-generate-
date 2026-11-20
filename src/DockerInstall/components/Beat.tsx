import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {CL, EASE_IN_OUT} from './ui';

/**
 * A visual beat inside a scene: mounts at `from` for `dur` frames and
 * cross-fades in/out over `fade` frames so beats blend into each other.
 */
export const Beat: React.FC<{
  from: number;
  dur: number;
  name: string;
  fadeIn?: number;
  fadeOut?: number;
  exitScale?: number;
  children: React.ReactNode;
}> = ({from, dur, name, fadeIn = 10, fadeOut = 10, exitScale = 1.06, children}) => (
  <Sequence from={from} durationInFrames={dur} name={name}>
    <BeatFade dur={dur} fadeIn={fadeIn} fadeOut={fadeOut} exitScale={exitScale}>
      {children}
    </BeatFade>
  </Sequence>
);

const BeatFade: React.FC<{dur: number; fadeIn: number; fadeOut: number; exitScale: number; children: React.ReactNode}> = ({
  dur,
  fadeIn,
  fadeOut,
  exitScale,
  children,
}) => {
  const frame = useCurrentFrame();
  const inP = fadeIn ? interpolate(frame, [0, fadeIn], [0, 1], {...CL, easing: EASE_IN_OUT}) : 1;
  const outP = fadeOut ? interpolate(frame, [dur - fadeOut, dur], [1, 0], {...CL, easing: EASE_IN_OUT}) : 1;
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(inP, outP),
        scale: String(1 + (1 - outP) * (exitScale - 1)),
        filter: outP < 1 ? `blur(${(1 - outP) * 10}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Sound effect placed at a frame (relative to the parent sequence). */
export const Sfx: React.FC<{src: string; at: number; volume?: number; name?: string}> = ({src, at, volume = 0.5, name}) => (
  <Audio src={src} from={Math.max(0, Math.round(at))} volume={volume} name={name ?? 'SFX'} />
);
