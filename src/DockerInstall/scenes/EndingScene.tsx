import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, Sfx} from '../components/Beat';
import {C, FONT, IMG, SFX, SHADOW} from '../theme';
import {localLine, sceneDuration, TR} from '../timeline';
import {CL, Cursor, EASE_IN_OUT, GridBackground, Icon, KenBurns, LightSweep, Particles} from '../components/ui';

const S = 'ending' as const;

/**
 * "That's it! You've successfully installed Docker on Windows. Follow me for
 *  more simple DevOps tutorials, and let's learn Docker step by step!"
 */
export const EndingScene: React.FC = () => {
  const total = sceneDuration(S);
  const thats = localLine(S, 'thatsIt');
  const follow = localLine(S, 'follow');
  const clickAt = follow.from + Math.round(follow.dur * 0.18); // "Follow me"
  const stairsAt = follow.from + Math.round(follow.dur * 0.62); // "...learn Docker step by step"

  return (
    <AbsoluteFill>
      <GridBackground tint={C.blue} tint2={C.amber} base={C.bgWarm} />

      <Beat name="Recap" from={0} dur={follow.from + 6} fadeIn={0} fadeOut={14} exitScale={0.9}>
        <RecapBeat startTicks={thats.from + 18} />
      </Beat>

      <Beat name="Follow CTA" from={follow.from - 8} dur={total - follow.from + 8} fadeIn={12} fadeOut={0}>
        <FollowBeat clickAt={clickAt - (follow.from - 8)} stairsAt={stairsAt - (follow.from - 8)} dur={total - follow.from + 8} />
      </Beat>

      <Sfx src={SFX.whoosh} at={2} volume={0.4} name="Whoosh – recap" />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} src={SFX.tick} at={thats.from + 18 + i * 12} volume={0.45} name={`Tick – recap ${i + 1}`} />
      ))}
      <Sfx src={SFX.whip} at={follow.from - 8} volume={0.45} name="Whip – CTA" />
      <Sfx src={SFX.click} at={clickAt} volume={0.55} name="Click – follow" />
      <Sfx src={SFX.notify} at={clickAt + 6} volume={0.4} name="Notify – following" />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`s${i}`} src={SFX.pop} at={stairsAt + i * 7} volume={0.4} name={`Pop – step ${i + 1}`} />
      ))}
      <Sfx src={SFX.shimmer} at={total - 50} volume={0.3} name="Shimmer – end" />
    </AbsoluteFill>
  );
};

const RECAP = [
  {label: 'Download', icon: Icon.Download},
  {label: 'Install + WSL 2', icon: Icon.Box},
  {label: 'Start Engine', icon: Icon.Power},
  {label: 'Verify', icon: Icon.Terminal},
];

const RecapBeat: React.FC<{startTicks: number}> = ({startTicks}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const head = spring({frame: frame - TR, fps, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <Particles count={18} seed="end1" color={C.amber} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 260, display: 'flex', alignItems: 'center', gap: 22, opacity: head, scale: String(0.7 + 0.3 * head)}}>
          <div style={{background: C.white, borderRadius: 36, padding: '34px 40px', boxShadow: SHADOW.card}}>
            <Img src={IMG.dockerLogo} style={{height: 64}} />
          </div>
          <div style={{fontFamily: FONT.display, fontSize: 70, fontWeight: 700, color: C.blue}}>+</div>
          <div style={{background: C.white, borderRadius: 36, padding: '40px 40px', boxShadow: SHADOW.card}}>
            <Img src={IMG.windows} style={{height: 50}} />
          </div>
        </div>
        <div style={{position: 'absolute', top: 560, width: 920, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34}}>
          {RECAP.map((r, i) => {
            const at = TR + 8 + i * 6;
            const s = spring({frame: frame - at, fps, config: {damping: 13}});
            const tick = spring({frame: frame - (startTicks + i * 12), fps, config: {damping: 10}});
            const I = r.icon;
            return (
              <div
                key={r.label}
                style={{
                  height: 380,
                  borderRadius: 44,
                  background: C.white,
                  boxShadow: SHADOW.card,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 26,
                  position: 'relative',
                  opacity: s,
                  translate: `0px ${(1 - s) * 200}px`,
                  border: tick > 0.5 ? `4px solid ${C.green}` : '4px solid transparent',
                }}
              >
                <div style={{position: 'absolute', top: 24, left: 30, fontFamily: FONT.display, fontWeight: 700, fontSize: 34, color: C.blueSoft}}>0{i + 1}</div>
                <div style={{width: 140, height: 140, borderRadius: 40, background: C.blueSoft, display: 'grid', placeItems: 'center'}}>
                  <I size={86} color={C.blue} stroke={2} />
                </div>
                <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 38, color: C.navy, textAlign: 'center'}}>{r.label}</div>
                <div
                  style={{
                    position: 'absolute',
                    top: -22,
                    right: -22,
                    width: 84,
                    height: 84,
                    borderRadius: 999,
                    background: C.green,
                    border: `6px solid ${C.white}`,
                    display: 'grid',
                    placeItems: 'center',
                    scale: String(tick),
                  }}
                >
                  <Icon.Check size={50} color={C.white} stroke={3.2} />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FollowBeat: React.FC<{clickAt: number; stairsAt: number; dur: number}> = ({clickAt, stairsAt, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame: frame - 4, fps, config: {damping: 15}});
  const following = frame >= clickAt;
  const press = following && frame < clickAt + 6;
  const endLock = spring({frame: frame - (dur - 46), fps, config: {damping: 16}});
  // Docker icon hops up the stairs, one step at a time
  const hop = (i: number) => spring({frame: frame - (stairsAt + i * 7), fps, config: {damping: 11, stiffness: 180}});
  const level = [0, 1, 2, 3].reduce((acc, i) => acc + hop(i), 0);
  const STEP_W = 190;
  const STEP_H = 110;
  return (
    <AbsoluteFill>
      <KenBurns
        src={IMG.datacenter}
        dur={dur}
        zoom={[1.15, 1.3]}
        pan={['0px 0px', '-50px 0px']}
        overlay="linear-gradient(180deg, rgba(255,248,238,0.80) 0%, rgba(255,248,238,0.55) 40%, rgba(245,248,255,0.92) 100%)"
      />
      <Particles count={22} seed="end2" color={C.blue} />
      <AbsoluteFill style={{alignItems: 'center', opacity: 1 - endLock * 0.0}}>
        {/* creator card + follow button */}
        <div
          style={{
            position: 'absolute',
            top: 280,
            width: 880,
            padding: '50px 50px',
            borderRadius: 50,
            background: 'rgba(255,255,255,0.9)',
            boxShadow: SHADOW.card,
            display: 'flex',
            alignItems: 'center',
            gap: 34,
            opacity: card,
            translate: `0px ${(1 - card) * -200}px`,
          }}
        >
          <div style={{width: 150, height: 150, borderRadius: 999, background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`, display: 'grid', placeItems: 'center', flexShrink: 0}}>
            <Icon.Terminal size={86} color={C.white} stroke={2} />
          </div>
          <div style={{flex: 1}}>
            <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 50, color: C.navy}}>DevOps Tutorials</div>
            <div
              style={{
                marginTop: 22,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                padding: '18px 38px',
                borderRadius: 999,
                background: following ? C.white : `linear-gradient(135deg, ${C.blue}, ${C.blueDeep})`,
                border: following ? `4px solid ${C.blue}` : '4px solid transparent',
                color: following ? C.blue : C.white,
                fontFamily: FONT.body,
                fontWeight: 800,
                fontSize: 38,
                scale: press ? '0.92' : '1',
                boxShadow: following ? 'none' : SHADOW.glow,
              }}
            >
              {following ? <Icon.Check size={40} color={C.blue} stroke={3} /> : <Icon.Bell size={38} color={C.white} stroke={2.4} />}
              {following ? 'Following' : 'Follow'}
            </div>
          </div>
        </div>

        {/* staircase: "learn Docker step by step" */}
        <div style={{position: 'absolute', left: 140, top: 1230, width: 800, height: 520}}>
          {[0, 1, 2, 3].map((i) => {
            const s = spring({frame: frame - (14 + i * 5), fps, config: {damping: 14}});
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: i * STEP_W,
                  bottom: 120,
                  width: STEP_W - 14,
                  height: STEP_H * (i + 1) * s,
                  borderRadius: '22px 22px 8px 8px',
                  background: hop(i) > 0.5 ? `linear-gradient(180deg, ${C.blue}, ${C.blueDeep})` : 'linear-gradient(180deg, #FFFFFF, #E4ECFB)',
                  boxShadow: SHADOW.soft,
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: 18,
                  fontFamily: FONT.display,
                  fontWeight: 700,
                  fontSize: 40,
                  color: hop(i) > 0.5 ? C.white : C.blue,
                }}
              >
                {i + 1}
              </div>
            );
          })}
          {/* hopping Docker icon */}
          <div
            style={{
              position: 'absolute',
              left: interpolate(level, [0, 4], [-150, 3 * STEP_W + 8], CL),
              bottom: 120 + interpolate(level, [0, 1, 2, 3, 4], [0, STEP_H, STEP_H * 2, STEP_H * 3, STEP_H * 4], CL) + Math.abs(Math.sin(level * Math.PI)) * 70,
              width: 170,
              opacity: interpolate(frame, [stairsAt - 14, stairsAt - 4], [0, 1], CL),
            }}
          >
            <Img src={IMG.dockerIcon} style={{width: 170, filter: 'drop-shadow(0 12px 14px rgba(29,99,237,0.35))'}} />
          </div>
        </div>

        {/* final lock-up */}
        <div
          style={{
            position: 'absolute',
            top: 760,
            width: 760,
            padding: '44px 60px',
            borderRadius: 44,
            background: C.white,
            boxShadow: SHADOW.card,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 26,
            opacity: interpolate(frame, [12, 26], [0, 1], {...CL, easing: EASE_IN_OUT}),
            scale: String(1 + endLock * 0.06),
            overflow: 'hidden',
          }}
        >
          <Img src={IMG.dockerLogo} style={{width: 560}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.body, fontWeight: 700, fontSize: 38, color: C.slate}}>
            <Icon.Stairs size={46} color={C.blue} stroke={2.4} /> step by step
          </div>
          <LightSweep at={dur - 44} dur={24} />
        </div>
      </AbsoluteFill>
      <Cursor
        appearAt={clickAt - 22}
        path={[
          {f: clickAt - 22, x: 980, y: 760},
          {f: clickAt - 2, x: 470, y: 462},
          {f: clickAt + 30, x: 620, y: 600},
        ]}
        clicks={[clickAt]}
        hideAt={clickAt + 34}
      />
    </AbsoluteFill>
  );
};
