import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Beat, Sfx} from '../../DockerInstall/components/Beat';
import {Camera, CL, EASE_IN_OUT, GridBackground, KenBurns, LightSweep} from '../../DockerInstall/components/ui';
import {HeatGlow, HeatWaves, Label, ProductCard, SnowFall, Thermometer} from '../components/fx';
import {G, IMG, SFX} from '../theme';
import {atWord, localLine, sceneDuration, TR} from '../timeline';

const S = 'intro' as const;

/** "These are electric heated gloves! They're designed to help keep your hands warm when the temperature drops." */
export const IntroScene: React.FC = () => {
  const total = sceneDuration(S);
  const these = localLine(S, 'these');
  const designed = localLine(S, 'designed');
  const warmAt = atWord(S, 'designed', 0.42); // "...keep your hands warm"
  const dropsAt = atWord(S, 'designed', 0.8); // "...temperature drops"

  return (
    <AbsoluteFill>
      <GridBackground base={G.cream} tint={G.warm} tint2={G.gold} line={G.warmGrid} />
      <SnowFall count={34} melt={1} seed="embers" />

      {/* A — hero reveal */}
      <Beat name="Hero: heated gloves" from={0} dur={designed.from + 8} fadeIn={0} fadeOut={12} exitScale={0.9}>
        <Camera dur={designed.from + 8} from={1} to={1.06}>
          <AbsoluteFill style={{alignItems: 'center'}}>
            <HeatGlow size={1150} style={{top: 260}} />
          </AbsoluteFill>
          <ProductCard src={IMG.heatedPair} at={these.from - 6} x={150} y={330} width={780} height={800} />
          <SweepAt at={these.from + 14} />
          <Label at={atWord(S, 'these', 0.45)} y={1230} bg={G.warm} size={46}>
            Electric Heated Gloves
          </Label>
        </Camera>
      </Beat>

      {/* B — keeps hands warm when it gets cold */}
      <Beat name="Warm when it's cold" from={designed.from} dur={total - designed.from} fadeIn={10} fadeOut={0}>
        <WarmBeat start={0} warmAt={warmAt - designed.from} dropsAt={dropsAt - designed.from} dur={total - designed.from} />
      </Beat>

      <Sfx src={SFX.impact} at={these.from - 4} volume={0.45} name="Impact – reveal" />
      <Sfx src={SFX.heat} at={these.from + 2} volume={0.5} name="Heat whoosh – hero" />
      <Sfx src={SFX.pop} at={atWord(S, 'these', 0.45)} volume={0.4} name="Pop – name label" />
      <Sfx src={SFX.whip} at={designed.from - 4} volume={0.45} name="Whip – warm beat" />
      <Sfx src={SFX.riser} at={warmAt - 30} volume={0.3} name="Riser – warming up" />
      <Sfx src={SFX.pop} at={warmAt} volume={0.4} name="Pop – warm label" />
      <Sfx src={SFX.freeze} at={dropsAt} volume={0.3} name="Freeze – temperature drops" />
      <Sfx src={SFX.whoosh} at={TR - 4} volume={0.35} name="Whoosh – scene in" />
    </AbsoluteFill>
  );
};

const SweepAt: React.FC<{at: number}> = ({at}) => (
  <div style={{position: 'absolute', left: 150, top: 330, width: 780, height: 800, borderRadius: 44, overflow: 'hidden'}}>
    <LightSweep at={at} dur={24} />
  </div>
);

const WarmBeat: React.FC<{start: number; warmAt: number; dropsAt: number; dur: number}> = ({warmAt, dropsAt, dur}) => {
  const frame = useCurrentFrame();
  const level = interpolate(frame, [6, warmAt + 20], [0.08, 0.92], {...CL, easing: EASE_IN_OUT});
  const snowIn = interpolate(frame, [dropsAt - 6, dropsAt + 10], [0, 1], CL);
  return (
    <AbsoluteFill>
      {/* real winter photo strip on the left: "when the temperature drops" */}
      <div style={{position: 'absolute', left: 60, top: 1010, width: 400, height: 400, borderRadius: 40, overflow: 'hidden', opacity: snowIn, scale: String(0.8 + 0.2 * snowIn), boxShadow: '0 20px 50px -15px rgba(27,42,68,0.35)'}}>
        <KenBurns src={IMG.snowTrees} dur={dur} zoom={[1.2, 1.35]} />
        <SnowFall count={14} seed="strip" />
      </div>
      <AbsoluteFill style={{alignItems: 'center'}}>
        <HeatGlow size={1000} intensity={level} style={{top: 200}} />
      </AbsoluteFill>
      <ProductCard src={IMG.heatHand} at={2} x={200} y={300} width={640} height={700} pad={0} from="right" />
      <HeatWaves x={520} y={330} at={warmAt - 8} />
      <Thermometer level={level} style={{left: 880, top: 520}} />
      <Label at={warmAt} x={500} y={1110} bg={G.warm}>
        Keeps hands warm
      </Label>
    </AbsoluteFill>
  );
};
