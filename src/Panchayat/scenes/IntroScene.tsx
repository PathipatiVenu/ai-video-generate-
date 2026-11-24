import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, Sfx} from '../../DockerInstall/components/Beat';
import {CL, EASE_IN_OUT, GridBackground, KenBurns, LightSweep, Particles} from '../../DockerInstall/components/ui';
import {FlagCard, I, PhotoCard, TriLine} from '../components/kit';
import {FONT, IMG, P, SFX, SHADOW} from '../theme';
import {atWord, localLine, sceneDuration} from '../timeline';

const S = 'intro' as const;

/**
 * "Do you know how Panchayat elections work in India? Who can contest, how many villages come
 *  under one Panchayat, and what powers does a person get after winning? Let's understand!"
 */
export const IntroScene: React.FC = () => {
  const total = sceneDuration(S);
  const q = localLine(S, 'questions');
  const lets = localLine(S, 'letsUnderstand');
  const q1 = atWord(S, 'questions', 0.02);
  const q2 = atWord(S, 'questions', 0.3);
  const q3 = atWord(S, 'questions', 0.66);

  return (
    <AbsoluteFill>
      <GridBackground base={P.cream} tint={P.saffron} tint2={P.green} line={P.gridSaffron} />

      {/* A — hook: real Indian village + flag + voting ink */}
      <Beat name="Hook – village & election" from={0} dur={q.from + 10} fadeIn={0} fadeOut={12} exitScale={1.1}>
        <HookBeat dur={q.from + 10} />
      </Beat>

      {/* B — three questions */}
      <Beat name="Three questions" from={q.from} dur={lets.from - q.from + 8} fadeIn={10} fadeOut={10} exitScale={1.15}>
        <AbsoluteFill>
          <KenBurns src={IMG.gramSabha} dur={lets.from - q.from} zoom={[1.15, 1.3]} style={{opacity: 0.14, filter: 'blur(4px)'}} />
          <Particles count={16} seed="q" color={P.saffron} />
          <QuestionCard at={q1 - q.from} y={360} n={1} icon={I.Person} color={P.saffron} text="Who can contest?" />
          <QuestionCard at={q2 - q.from} y={700} n={2} icon={I.Hut} color={P.navy} text="How many villages?" />
          <QuestionCard at={q3 - q.from} y={1040} n={3} icon={I.Star} color={P.green} text="What powers?" />
        </AbsoluteFill>
      </Beat>

      {/* C — "Let's understand!" title */}
      <Beat name="Let's understand" from={lets.from - 2} dur={total - lets.from + 2} fadeIn={6} fadeOut={0}>
        <TitleBeat />
      </Beat>

      <Sfx src={SFX.impact} at={1} volume={0.5} name="Impact – hook" />
      <Sfx src={SFX.shimmer} at={10} volume={0.3} name="Shimmer – flag" />
      <Sfx src={SFX.stamp} at={34} volume={0.55} name="Stamp – ink photo" />
      <Sfx src={SFX.whoosh} at={q.from - 6} volume={0.45} name="Whoosh – questions" />
      <Sfx src={SFX.pop} at={q1} volume={0.45} name="Pop – Q1" />
      <Sfx src={SFX.pop} at={q2} volume={0.45} name="Pop – Q2" />
      <Sfx src={SFX.pop} at={q3} volume={0.45} name="Pop – Q3" />
      <Sfx src={SFX.riser} at={lets.from - 36} volume={0.35} name="Riser – lets understand" />
      <Sfx src={SFX.impact} at={lets.from} volume={0.4} name="Impact – title" />
      <Sfx src={SFX.ding} at={lets.from + 8} volume={0.3} name="Ding – title" />
    </AbsoluteFill>
  );
};

const HookBeat: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = spring({frame: frame - 16, fps, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <KenBurns
        src={IMG.village}
        dur={dur}
        zoom={[1.4, 1.2]}
        pan={['-80px 0px', '60px -20px']}
        overlay="linear-gradient(180deg, rgba(255,251,243,0.35) 0%, rgba(255,251,243,0) 35%, rgba(255,251,243,0.5) 70%, rgba(255,251,243,0.96) 100%)"
      />
      <Particles count={14} seed="hook" color="#FFFFFF" />
      <FlagCard at={4} x={300} y={300} w={480} />
      <PhotoCard src={IMG.inkFinger} at={30} x={600} y={820} w={380} h={420} rotate={6} dur={dur} />
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 1050,
          width: 560,
          padding: '34px 38px',
          borderRadius: 40,
          background: 'rgba(255,255,255,0.94)',
          boxShadow: SHADOW.card,
          opacity: title,
          translate: `${(1 - title) * -500}px 0px`,
        }}
      >
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 64, lineHeight: 1.02, color: P.ink}}>Panchayat Elections</div>
        <div style={{marginTop: 16}}>
          <TriLine width={240} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const QuestionCard: React.FC<{at: number; y: number; n: number; icon: (p: {size?: number; color?: string; stroke?: number}) => React.ReactElement; color: string; text: string}> = ({
  at,
  y,
  n,
  icon: Ico,
  color,
  text,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 12, stiffness: 150}});
  if (frame < at - 1) return null;
  const fromLeft = n % 2 === 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        top: y,
        width: 920,
        height: 270,
        borderRadius: 48,
        background: P.paper,
        boxShadow: SHADOW.glow(color),
        display: 'flex',
        alignItems: 'center',
        gap: 36,
        padding: '0 46px',
        opacity: Math.min(1, s * 1.5),
        translate: `${(1 - s) * (fromLeft ? -1100 : 1100)}px 0px`,
        overflow: 'hidden',
      }}
    >
      <div style={{width: 160, height: 160, flexShrink: 0, borderRadius: 44, background: `${color}1f`, display: 'grid', placeItems: 'center', position: 'relative'}}>
        <Ico size={104} color={color} stroke={1.9} />
        <div style={{position: 'absolute', top: -14, right: -14, width: 62, height: 62, borderRadius: 99, background: color, color: P.paper, display: 'grid', placeItems: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 40}}>?</div>
      </div>
      <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 64, color: P.ink, lineHeight: 1.05}}>{text}</div>
      <LightSweep at={at + 8} dur={20} opacity={0.5} />
    </div>
  );
};

const TitleBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 2, fps, config: {damping: 11}});
  const line = interpolate(frame, [6, 24], [0, 1], {...CL, easing: EASE_IN_OUT});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <GridBackground base={P.cream} tint={P.saffron} tint2={P.green} line={P.gridGreen} perspective />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, scale: String(0.6 + 0.4 * s), opacity: s}}>
        <div style={{width: 220, height: 220, borderRadius: 60, background: P.paper, boxShadow: SHADOW.glow(P.saffron), display: 'grid', placeItems: 'center'}}>
          <I.Book size={140} color={P.saffronDeep} stroke={1.8} />
        </div>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 96, color: P.ink, textAlign: 'center', lineHeight: 1}}>Explained</div>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 96, color: P.green, textAlign: 'center', lineHeight: 1}}>Simply</div>
        <TriLine width={420 * line} height={12} />
      </div>
    </AbsoluteFill>
  );
};
