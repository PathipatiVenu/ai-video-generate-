import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, Sfx} from '../../DockerInstall/components/Beat';
import {CL, Cursor, EASE_IN_OUT, GridBackground, KenBurns, LightSweep, Particles} from '../../DockerInstall/components/ui';
import {FlagCard, I, PhotoCard, TriLine} from '../components/kit';
import {FONT, IMG, P, SFX, SHADOW} from '../theme';
import {atWord, localLine, sceneDuration, TR} from '../timeline';

const S = 'ending' as const;

/**
 * "Remember, winning a Panchayat election is not just about getting a position. It is about taking
 *  responsibility for village development. Share this video with others and follow for more simple
 *  explanations about Indian government and elections!"
 */
export const EndingScene: React.FC = () => {
  const total = sceneDuration(S);
  const share = localLine(S, 'share');
  const posAt = atWord(S, 'remember', 0.3); // "getting a position"
  const respAt = atWord(S, 'remember', 0.66); // "taking responsibility"
  const shareAt = atWord(S, 'share', 0.05);
  const followAt = atWord(S, 'share', 0.34);

  return (
    <AbsoluteFill>
      <GridBackground base={P.cream} tint={P.saffron} tint2={P.green} line={P.gridSaffron} />

      {/* A — position vs responsibility (balance) */}
      <Beat name="Position vs responsibility" from={0} dur={share.from + 8} fadeIn={0} fadeOut={12} exitScale={1.1}>
        <AbsoluteFill>
          <KenBurns src={IMG.village} dur={share.from} zoom={[1.15, 1.3]} overlay="linear-gradient(180deg, rgba(255,251,243,0.9) 0%, rgba(255,251,243,0.84) 50%, rgba(255,251,243,0.95) 100%)" />
          <Particles count={16} seed="end" color={P.saffron} />
          <Balance posAt={posAt} respAt={respAt} />
        </AbsoluteFill>
      </Beat>

      {/* B — share + follow CTA */}
      <Beat name="Share & follow" from={share.from - 4} dur={total - share.from + 4} fadeIn={10} fadeOut={0}>
        <CtaBeat shareAt={shareAt - share.from + 4} followAt={followAt - share.from + 4} dur={total - share.from + 4} />
      </Beat>

      <Sfx src={SFX.whoosh} at={TR} volume={0.35} name="Whoosh – ending" />
      <Sfx src={SFX.pop} at={posAt} volume={0.45} name="Pop – position" />
      <Sfx src={SFX.impact} at={respAt} volume={0.45} name="Impact – responsibility" />
      <Sfx src={SFX.shimmer} at={respAt + 6} volume={0.3} name="Shimmer – responsibility" />
      <Sfx src={SFX.whip} at={share.from - 6} volume={0.4} name="Whip – CTA" />
      <Sfx src={SFX.click} at={shareAt + 8} volume={0.5} name="Click – share" />
      <Sfx src={SFX.click} at={followAt + 8} volume={0.5} name="Click – follow" />
      <Sfx src={SFX.notify} at={followAt + 14} volume={0.4} name="Notify – following" />
      <Sfx src={SFX.success} at={share.end + 4} volume={0.4} name="Success – end card" />
    </AbsoluteFill>
  );
};

const Balance: React.FC<{posAt: number; respAt: number}> = ({posAt, respAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tilt = interpolate(frame, [posAt, posAt + 12, respAt, respAt + 18], [0, -8, -8, 14], {...CL, easing: EASE_IN_OUT});
  const left = spring({frame: frame - posAt, fps, config: {damping: 12}});
  const right = spring({frame: frame - respAt, fps, config: {damping: 12}});
  const beam = spring({frame: frame - TR, fps, config: {damping: 14}});
  const pan = (side: -1 | 1) => {
    const a = (tilt * Math.PI) / 180;
    return {x: 540 + side * 340 * Math.cos(a), y: 820 + side * 340 * Math.sin(a)};
  };
  const L = pan(-1);
  const R = pan(1);
  return (
    <AbsoluteFill style={{opacity: beam}}>
      {/* stand */}
      <div style={{position: 'absolute', left: 525, top: 820, width: 30, height: 520, borderRadius: 15, background: P.navy}} />
      <div style={{position: 'absolute', left: 380, top: 1320, width: 320, height: 40, borderRadius: 20, background: P.navy}} />
      {/* beam */}
      <div style={{position: 'absolute', left: 540 - 360, top: 810, width: 720, height: 22, borderRadius: 11, background: P.saffronDeep, rotate: `${tilt}deg`, transformOrigin: '50% 50%'}} />
      <div style={{position: 'absolute', left: 515, top: 795, width: 50, height: 50, borderRadius: 99, background: P.paper, border: `8px solid ${P.navy}`}} />
      {/* left pan: position */}
      <Pan x={L.x} y={L.y} s={left} color={P.slate} icon={<I.Star size={90} color={P.slate} stroke={2} />} label="Position" faded={frame >= respAt + 10} />
      {/* right pan: responsibility */}
      <Pan x={R.x} y={R.y} s={right} color={P.green} icon={<I.Growth size={90} color={P.green} stroke={2.2} />} label="Responsibility" glow />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1420, display: 'flex', justifyContent: 'center', opacity: right}}>
        <div style={{padding: '18px 40px', borderRadius: 999, background: P.green, color: P.paper, fontFamily: FONT.body, fontWeight: 800, fontSize: 42, boxShadow: SHADOW.soft, display: 'flex', alignItems: 'center', gap: 14}}>
          <I.Hut size={46} color={P.paper} stroke={2.2} /> Village development
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Pan: React.FC<{x: number; y: number; s: number; color: string; icon: React.ReactNode; label: string; glow?: boolean; faded?: boolean}> = ({x, y, s, color, icon, label, glow, faded}) => (
  <div style={{position: 'absolute', left: x - 150, top: y + 10, width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <div style={{width: 4, height: 120, background: `${P.navy}88`}} />
    <div
      style={{
        width: 300,
        padding: '26px 10px',
        borderRadius: 36,
        background: P.paper,
        boxShadow: glow && s > 0.5 ? SHADOW.glow(color) : SHADOW.card,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        opacity: faded ? 0.55 : 1,
      }}
    >
      <div style={{scale: String(s)}}>{icon}</div>
      <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 34, color, scale: String(s)}}>{label}</div>
    </div>
  </div>
);

const CtaBeat: React.FC<{shareAt: number; followAt: number; dur: number}> = ({shareAt, followAt, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame: frame - 2, fps, config: {damping: 14}});
  const shared = frame >= shareAt + 8;
  const following = frame >= followAt + 8;
  const lock = spring({frame: frame - (dur - 60), fps, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <GridBackground base={P.cream} tint={P.saffron} tint2={P.green} line={P.gridGreen} perspective />
      <Particles count={18} seed="cta" color={P.green} />
      <FlagCard at={4} x={330} y={300} w={420} />
      <div style={{position: 'absolute', left: 80, top: 640, width: 920, padding: '44px 46px', borderRadius: 50, background: P.paper, boxShadow: SHADOW.card, opacity: card, translate: `0px ${(1 - card) * 300}px`}}>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 60, color: P.ink, lineHeight: 1.05}}>Panchayat Elections</div>
        <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 36, color: P.slate, marginTop: 10}}>Indian government &amp; elections, explained simply</div>
        <div style={{marginTop: 18}}>
          <TriLine width={280} />
        </div>
        <div style={{display: 'flex', gap: 24, marginTop: 40}}>
          <CtaButton active={shared} at={shareAt} color={P.saffronDeep} icon={<I.Share size={44} color={shared ? P.saffronDeep : P.paper} stroke={2.4} />} label={shared ? 'Shared' : 'Share'} />
          <CtaButton active={following} at={followAt} color={P.green} icon={<I.Bell size={44} color={following ? P.green : P.paper} stroke={2.4} />} label={following ? 'Following' : 'Follow'} />
        </div>
      </div>
      {/* real village photos fill the lower half */}
      <PhotoCard src={IMG.gpOffice2} at={followAt + 14} x={60} y={1330} w={470} h={380} dur={dur} rotate={-3} />
      <PhotoCard src={IMG.gramSabha} at={followAt + 20} x={550} y={1330} w={470} h={380} dur={dur} rotate={3} />
      {/* final lock-up shimmer */}
      <div style={{position: 'absolute', left: 80, top: 1200, width: 920, display: 'flex', justifyContent: 'center', opacity: lock, scale: String(0.8 + 0.2 * lock)}}>
        <div style={{position: 'relative', overflow: 'hidden', padding: '20px 40px', borderRadius: 999, background: P.navy, color: P.paper, fontFamily: FONT.body, fontWeight: 800, fontSize: 38, display: 'flex', alignItems: 'center', gap: 16}}>
          <I.Book size={44} color={P.paper} stroke={2.2} /> More simple explanations
          <LightSweep at={dur - 50} dur={22} />
        </div>
      </div>
      <Cursor
        appearAt={shareAt - 18}
        path={[
          {f: shareAt - 18, x: 980, y: 1500},
          {f: shareAt + 6, x: 300, y: 1015},
          {f: followAt + 6, x: 760, y: 1015},
          {f: followAt + 36, x: 820, y: 1120},
        ]}
        clicks={[shareAt + 8, followAt + 8]}
        hideAt={followAt + 34}
      />
    </AbsoluteFill>
  );
};

const CtaButton: React.FC<{active: boolean; at: number; color: string; icon: React.ReactNode; label: string}> = ({active, at, color, icon, label}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 12}});
  const press = frame >= at + 8 && frame < at + 14;
  return (
    <div
      style={{
        flex: 1,
        height: 130,
        borderRadius: 999,
        background: active ? P.paper : color,
        border: `6px solid ${color}`,
        color: active ? color : P.paper,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontFamily: FONT.body,
        fontWeight: 800,
        fontSize: 44,
        boxShadow: active ? 'none' : SHADOW.glow(color),
        scale: String((0.6 + 0.4 * s) * (press ? 0.92 : 1)),
        opacity: Math.min(1, s * 1.5),
      }}
    >
      {icon}
      {label}
    </div>
  );
};
