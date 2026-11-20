import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, Sfx} from '../../DockerInstall/components/Beat';
import {CL, EASE_IN_OUT, GridBackground, KenBurns, LightSweep} from '../../DockerInstall/components/ui';
import {FrostCreep, HeatGlow, Label, SnowFall, Thermometer} from '../components/fx';
import {FONT, G, IMG, SFX, SHADOW} from '../theme';
import {atWord, localLine, sceneDuration} from '../timeline';

const S = 'hook' as const;

/** "Are your hands always freezing during winter? Here's a cool little product you need to check out!" */
export const HookScene: React.FC = () => {
  const total = sceneDuration(S);
  const frozen = localLine(S, 'frozen');
  const cool = localLine(S, 'cool');
  const checkOut = atWord(S, 'cool', 0.72);

  return (
    <AbsoluteFill>
      <GridBackground base={G.snow} tint={G.ice} tint2={G.iceDeep} line={G.iceGrid} />

      {/* A — freezing winter: real snowy city photo, frost creeping, temperature falling */}
      <Beat name="Freezing winter" from={0} dur={cool.from + 10} fadeIn={0} fadeOut={12} exitScale={1.12}>
        <FreezingBeat dur={cool.from + 10} frozenEnd={frozen.end} />
      </Beat>

      {/* B — teaser of the product behind frosted glass */}
      <Beat name="Product teaser" from={cool.from} dur={total - cool.from} fadeIn={10} fadeOut={0}>
        <TeaserBeat revealAt={checkOut - cool.from} />
      </Beat>

      <Sfx src={SFX.wind} at={0} volume={0.5} name="Icy wind" />
      <Sfx src={SFX.impact} at={2} volume={0.45} name="Impact – hook" />
      <Sfx src={SFX.freeze} at={atWord(S, 'frozen', 0.45)} volume={0.55} name="Freeze crackle – freezing" />
      <Sfx src={SFX.whoosh} at={cool.from - 6} volume={0.45} name="Whoosh – teaser" />
      <Sfx src={SFX.heat} at={checkOut - 6} volume={0.55} name="Heat whoosh – check out" />
      <Sfx src={SFX.shimmer} at={checkOut + 6} volume={0.3} name="Shimmer – reveal" />
    </AbsoluteFill>
  );
};

const FreezingBeat: React.FC<{dur: number; frozenEnd: number}> = ({dur, frozenEnd}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const level = interpolate(frame, [4, frozenEnd], [0.62, 0.04], {...CL, easing: EASE_IN_OUT});
  const shake = frame < frozenEnd ? Math.sin(frame * 2.3) * 5 : 0;
  const flake = spring({frame: frame - 6, fps, config: {damping: 10}});
  return (
    <AbsoluteFill>
      <KenBurns
        src={IMG.snowyCity}
        dur={dur}
        zoom={[1.25, 1.1]}
        pan={['0px -40px', '0px 20px']}
        overlay="linear-gradient(180deg, rgba(244,249,255,0.55) 0%, rgba(191,227,255,0.25) 45%, rgba(244,249,255,0.85) 100%)"
      />
      <SnowFall count={70} />
      <FrostCreep from={0} dur={frozenEnd} max={0.9} />
      {/* big frozen snowflake badge */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            width: 430,
            height: 430,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.82)',
            border: `6px solid ${G.white}`,
            boxShadow: `0 0 0 18px rgba(191,227,255,0.45), ${SHADOW.card}`,
            display: 'grid',
            placeItems: 'center',
            scale: String(0.4 + 0.6 * flake),
            translate: `${shake}px 0px`,
          }}
        >
          <Snowflake size={270} rotate={frame * 0.8} />
        </div>
      </AbsoluteFill>
      <Thermometer level={level} style={{left: 70, top: 1080}} />
      <Label at={18} y={1340} bg={G.iceDeep}>
        Freezing hands?
      </Label>
    </AbsoluteFill>
  );
};

export const Snowflake: React.FC<{size: number; rotate?: number; color?: string}> = ({size, rotate = 0, color = G.iceDeep}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{rotate: `${rotate}deg`}}>
    {[0, 60, 120].map((a) => (
      <g key={a} transform={`rotate(${a} 50 50)`} stroke={color} strokeWidth={6} strokeLinecap="round">
        <line x1="50" y1="6" x2="50" y2="94" />
        <line x1="50" y1="20" x2="40" y2="10" />
        <line x1="50" y1="20" x2="60" y2="10" />
        <line x1="50" y1="80" x2="40" y2="90" />
        <line x1="50" y1="80" x2="60" y2="90" />
      </g>
    ))}
  </svg>
);

const TeaserBeat: React.FC<{revealAt: number}> = ({revealAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame: frame - 2, fps, config: {damping: 14}});
  const reveal = interpolate(frame, [revealAt - 4, revealAt + 16], [0, 1], {...CL, easing: EASE_IN_OUT});
  return (
    <AbsoluteFill>
      <GridBackground base={G.snow} tint={G.warm} tint2={G.ice} line={G.iceGrid} />
      <SnowFall count={40} seed="teaser" melt={reveal * 0.6} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <HeatGlow size={1100} intensity={0.3 + reveal * 0.8} style={{top: 260}} />
        <div
          style={{
            position: 'absolute',
            top: 380,
            width: 780,
            height: 800,
            borderRadius: 60,
            background: G.white,
            boxShadow: reveal > 0.5 ? SHADOW.warmGlow : SHADOW.card,
            overflow: 'hidden',
            scale: String(0.6 + 0.4 * card),
            opacity: card,
            rotate: `${(1 - card) * -8}deg`,
          }}
        >
          <Img src={IMG.heatedPair} style={{width: '100%', height: '100%', objectFit: 'contain', padding: 40, filter: `blur(${(1 - reveal) * 26}px)`, scale: String(1.15 - reveal * 0.15)}} />
          {/* frosted glass cover that wipes away */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, rgba(234,245,255,0.9), rgba(191,227,255,0.75))',
              clipPath: `inset(0 0 ${reveal * 100}% 0)`,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 220, color: G.iceDeep, opacity: 0.8}}>?</div>
          </div>
          <LightSweep at={revealAt + 10} dur={22} />
        </div>
      </AbsoluteFill>
      <Label at={revealAt + 6} y={1280} bg={G.warm}>
        Winter must-have
      </Label>
    </AbsoluteFill>
  );
};
