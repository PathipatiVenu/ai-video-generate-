import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {Beat, Sfx} from '../components/Beat';
import {C, FONT, IMG, SFX, SHADOW} from '../theme';
import {localLine, sceneDuration} from '../timeline';
import {CL, EASE_IN_OUT, EASE_OUT, GridBackground, Icon, KenBurns, LightSweep, Particles, prog} from '../components/ui';

const S = 'hook' as const;

/**
 * "Hey everyone! Want to run applications inside containers without installing
 *  everything manually? Let's install Docker on Windows in less than a minute!"
 */
export const HookScene: React.FC = () => {
  const total = sceneDuration(S);
  const hey = localLine(S, 'hey');
  const cont = localLine(S, 'containers');
  const lets = localLine(S, 'letsInstall');
  const manualAt = cont.from + Math.round(cont.dur * 0.5); // "...without installing everything manually"

  return (
    <AbsoluteFill>
      <GridBackground />

      {/* A — hook: real container-port photo + Docker icon slam */}
      <Beat name="Hook photo + Docker icon" from={0} dur={cont.from + 14} fadeIn={0} fadeOut={12}>
        <HookOpen dur={cont.from + 14} />
      </Beat>

      {/* B — apps go into a container; manual installs get crossed out */}
      <Beat name="Apps into containers" from={cont.from} dur={lets.from - cont.from + 10} fadeOut={12} exitScale={1.25}>
        <ContainersBeat manualAt={manualAt - cont.from} dur={lets.from - cont.from + 10} />
      </Beat>

      {/* C — Docker + Windows in less than a minute */}
      <Beat name="Docker + Windows < 1 min" from={lets.from} dur={total - lets.from} fadeIn={8} fadeOut={0}>
        <DockerWindowsBeat dur={total - lets.from} />
      </Beat>

      {/* SFX */}
      <Sfx src={SFX.impact} at={1} volume={0.55} name="Impact – hook" />
      <Sfx src={SFX.shimmer} at={hey.from} volume={0.35} name="Shimmer – hey" />
      <Sfx src={SFX.whoosh} at={cont.from - 4} volume={0.45} name="Whoosh – containers" />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} src={SFX.pop} at={cont.from + 18 + i * 9} volume={0.45} name={`Pop – app ${i + 1}`} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`x${i}`} src={SFX.tick} at={manualAt + 10 + i * 8} volume={0.4} name={`Strike ${i + 1}`} />
      ))}
      <Sfx src={SFX.whip} at={lets.from - 6} volume={0.5} name="Whip – lets install" />
      <Sfx src={SFX.pop} at={lets.from + 14} volume={0.45} name="Pop – Windows" />
      <Sfx src={SFX.riser} at={lets.from + lets.dur - 46} volume={0.35} name="Riser – stopwatch" />
      <Sfx src={SFX.ding} at={lets.from + lets.dur - 4} volume={0.35} name="Ding – under a minute" />
    </AbsoluteFill>
  );
};

const HookOpen: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 1, fps, config: {damping: 11, stiffness: 170}});
  const ring = interpolate(frame, [2, 30], [0, 1], CL);
  return (
    <AbsoluteFill>
      <KenBurns
        src={IMG.containers}
        dur={dur}
        zoom={[1.35, 1.15]}
        pan={['-60px 0px', '40px -20px']}
        overlay="linear-gradient(180deg, rgba(245,248,255,0.25) 0%, rgba(245,248,255,0) 35%, rgba(245,248,255,0.55) 75%, rgba(245,248,255,0.95) 100%)"
      />
      <Particles color={C.white} count={20} seed="hook" />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 520,
            borderRadius: '50%',
            border: `6px solid ${C.white}`,
            opacity: 1 - ring,
            scale: String(0.6 + ring * 1.4),
          }}
        />
        <div
          style={{
            width: 380,
            height: 380,
            borderRadius: 90,
            background: C.white,
            boxShadow: SHADOW.glow,
            display: 'grid',
            placeItems: 'center',
            scale: String(0.3 + s * 0.7),
            rotate: `${(1 - s) * -18}deg`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Img src={IMG.dockerIcon} style={{width: 270}} />
          <LightSweep at={14} dur={20} opacity={0.9} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const APPS = [
  {label: 'Web App', icon: Icon.Globe, color: C.blue},
  {label: 'Database', icon: Icon.Database, color: '#0EA5A4'},
  {label: 'API', icon: Icon.Gear, color: '#8B5CF6'},
];
const MANUAL = ['Node.js', 'Python', 'MySQL', 'Dependencies'];

const ContainersBeat: React.FC<{manualAt: number; dur: number}> = ({manualAt, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const boxIn = spring({frame: frame - 2, fps, config: {damping: 15}});
  const lift = interpolate(frame, [manualAt - 6, manualAt + 14], [0, 1], {...CL, easing: EASE_IN_OUT});
  return (
    <AbsoluteFill>
      {/* faint photo layer keeps the real-world container context */}
      <KenBurns src={IMG.containers} dur={dur} zoom={[1.15, 1.3]} style={{opacity: 0.18, filter: 'blur(6px) saturate(1.2)'}} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        {/* container box */}
        <div
          style={{
            position: 'absolute',
            top: interpolate(lift, [0, 1], [620, 380]),
            width: 860,
            height: 560,
            scale: String(interpolate(lift, [0, 1], [1, 0.82]) * (0.6 + 0.4 * boxIn)),
            opacity: boxIn,
            borderRadius: 48,
            background: 'linear-gradient(160deg, rgba(255,255,255,0.92), rgba(220,232,255,0.85))',
            border: `5px solid ${C.blue}`,
            boxShadow: SHADOW.card,
          }}
        >
          {/* container ribs */}
          {new Array(9).fill(0).map((_, i) => (
            <div key={i} style={{position: 'absolute', top: 24, bottom: 24, left: 60 + i * 92, width: 6, borderRadius: 6, background: 'rgba(29,99,237,0.10)'}} />
          ))}
          <div
            style={{
              position: 'absolute',
              top: -38,
              left: 50,
              padding: '12px 26px',
              borderRadius: 999,
              background: C.blue,
              color: C.white,
              fontFamily: FONT.display,
              fontWeight: 700,
              fontSize: 34,
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <Icon.Box size={38} color={C.white} stroke={2.4} /> container
          </div>
          <div style={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 36}}>
            {APPS.map((app, i) => {
              const at = 16 + i * 9;
              const d = spring({frame: frame - at, fps, config: {damping: 12, stiffness: 160}});
              const A = app.icon;
              return (
                <div
                  key={app.label}
                  style={{
                    width: 230,
                    height: 270,
                    borderRadius: 34,
                    background: C.white,
                    boxShadow: SHADOW.soft,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 22,
                    translate: `0px ${(1 - d) * -700}px`,
                    rotate: `${(1 - d) * (i - 1) * 25}deg`,
                    opacity: d > 0.01 ? 1 : 0,
                  }}
                >
                  <div style={{width: 120, height: 120, borderRadius: 30, background: `${app.color}18`, display: 'grid', placeItems: 'center'}}>
                    <A size={78} color={app.color} stroke={1.9} />
                  </div>
                  <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 32, color: C.navy}}>{app.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* manual installs crossed out */}
        <div
          style={{
            position: 'absolute',
            top: 960,
            width: 760,
            padding: '34px 44px',
            borderRadius: 40,
            background: C.white,
            boxShadow: SHADOW.card,
            opacity: lift,
            translate: `0px ${(1 - lift) * 120}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 30, color: C.slate, letterSpacing: 2}}>MANUAL INSTALLS</div>
          {MANUAL.map((m, i) => {
            const strike = prog(frame, manualAt + 10 + i * 8, 10);
            return (
              <div key={m} style={{display: 'flex', alignItems: 'center', gap: 22, position: 'relative'}}>
                <div style={{width: 50, height: 50, borderRadius: 14, background: strike > 0.5 ? '#FFE4E1' : C.blueSoft, display: 'grid', placeItems: 'center', color: C.coral, fontWeight: 800, fontSize: 30, fontFamily: FONT.body}}>
                  {strike > 0.5 ? '✕' : ''}
                </div>
                <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 44, color: strike > 0.5 ? '#9AA6BC' : C.navy}}>{m}</div>
                <div style={{position: 'absolute', left: 72, top: '52%', height: 6, borderRadius: 6, width: 420 * strike, background: C.coral}} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const DockerWindowsBeat: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dIn = spring({frame: frame - 2, fps, config: {damping: 14}});
  const plus = spring({frame: frame - 10, fps, config: {damping: 10}});
  const wIn = spring({frame: frame - 14, fps, config: {damping: 14}});
  const clockIn = spring({frame: frame - 30, fps, config: {damping: 14}});
  const sweep = interpolate(frame, [34, dur - 8], [0, 0.92], {...CL, easing: EASE_OUT});
  const R = 170;
  const circ = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <GridBackground tint={C.blue} tint2="#8B5CF6" />
      <Particles count={18} seed="dw" />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 330, width: 820, opacity: dIn, translate: `${(1 - dIn) * -500}px 0px`}}>
          <div style={{background: C.white, borderRadius: 44, padding: '56px 70px', boxShadow: SHADOW.card, position: 'relative', overflow: 'hidden'}}>
            <Img src={IMG.dockerLogo} style={{width: '100%'}} />
            <LightSweep at={22} dur={22} />
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 590,
            width: 110,
            height: 110,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`,
            color: C.white,
            fontSize: 80,
            fontWeight: 800,
            fontFamily: FONT.display,
            display: 'grid',
            placeItems: 'center',
            scale: String(plus),
            boxShadow: SHADOW.glow,
            zIndex: 2,
          }}
        >
          +
        </div>
        <div style={{position: 'absolute', top: 740, width: 820, opacity: wIn, translate: `${(1 - wIn) * 500}px 0px`}}>
          <div style={{background: C.white, borderRadius: 44, padding: '60px 90px', boxShadow: SHADOW.card}}>
            <Img src={IMG.windows} style={{width: '100%'}} />
          </div>
        </div>
        {/* stopwatch: "in less than a minute" */}
        <div style={{position: 'absolute', top: 1040, opacity: clockIn, scale: String(0.6 + 0.4 * clockIn), display: 'grid', placeItems: 'center'}}>
          <svg width={2 * R + 40} height={2 * R + 40} style={{rotate: '-90deg'}}>
            <circle cx={R + 20} cy={R + 20} r={R} stroke={C.blueSoft} strokeWidth={22} fill={C.white} />
            <circle
              cx={R + 20}
              cy={R + 20}
              r={R}
              stroke="url(#g)"
              strokeWidth={22}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - sweep)}
            />
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={C.cyan} />
                <stop offset="100%" stopColor={C.blue} />
              </linearGradient>
            </defs>
          </svg>
          <div style={{position: 'absolute', textAlign: 'center', fontFamily: FONT.display, color: C.navy}}>
            <div style={{fontSize: 96, fontWeight: 700, lineHeight: 1}}>&lt;1</div>
            <div style={{fontSize: 40, fontWeight: 600, color: C.slate}}>minute</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
