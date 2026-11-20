import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, Sfx} from '../components/Beat';
import {C, FONT, IMG, SFX, SHADOW} from '../theme';
import {localLine, sceneDuration, TR} from '../timeline';
import {Camera, CL, GridBackground, Icon, KenBurns, LightSweep, Particles, StepBadge, WindowFrame, prog} from '../components/ui';

const S = 'step3' as const;

/**
 * "After installation, restart your computer if required. Open Docker Desktop
 *  and wait until the Docker Engine is running."
 */
export const Step3Scene: React.FC = () => {
  const total = sceneDuration(S);
  const restart = localLine(S, 'restart');
  const engine = localLine(S, 'engine');
  const runningAt = engine.from + Math.round(engine.dur * 0.72); // "...Engine is running"
  const ifReqAt = restart.from + Math.round(restart.dur * 0.68);

  return (
    <AbsoluteFill>
      <GridBackground tint={C.cyan} tint2={C.blue} />

      {/* A — restart over a real laptop photo */}
      <Beat name="Restart computer" from={0} dur={engine.from + 6} fadeIn={0} fadeOut={14} exitScale={1.15}>
        <RestartBeat dur={engine.from + 6} ifReqAt={ifReqAt} />
      </Beat>

      {/* B — Docker Desktop, engine starting → running */}
      <Beat name="Docker Desktop engine" from={engine.from - 8} dur={total - engine.from + 8} fadeIn={12} fadeOut={0}>
        <EngineBeat runningAt={runningAt - (engine.from - 8)} dur={total - engine.from + 8} />
      </Beat>

      <StepBadge n={3} label="START DOCKER" />

      <Sfx src={SFX.riser} at={restart.from - 6} volume={0.3} name="Riser – restart" />
      <Sfx src={SFX.pop} at={ifReqAt} volume={0.4} name="Pop – if required" />
      <Sfx src={SFX.whoosh} at={engine.from - 10} volume={0.45} name="Whoosh – app" />
      <Sfx src={SFX.click} at={engine.from + 4} volume={0.4} name="Click – open app" />
      <Sfx src={SFX.notify} at={runningAt} volume={0.5} name="Notify – engine running" />
      <Sfx src={SFX.shimmer} at={runningAt + 2} volume={0.3} name="Shimmer – running" />
    </AbsoluteFill>
  );
};

const RestartBeat: React.FC<{dur: number; ifReqAt: number}> = ({dur, ifReqAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({frame: frame - (TR + 6), fps, config: {damping: 14}});
  const chip = spring({frame: frame - ifReqAt, fps, config: {damping: 11}});
  return (
    <AbsoluteFill>
      <KenBurns
        src={IMG.laptopTyping}
        dur={dur}
        zoom={[1.3, 1.12]}
        pan={['40px 0px', '-40px 20px']}
        blurIn={TR + 8}
        overlay="linear-gradient(180deg, rgba(245,248,255,0.92) 0%, rgba(245,248,255,0.55) 35%, rgba(245,248,255,0.45) 62%, rgba(245,248,255,0.95) 100%)"
      />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            width: 560,
            height: 560,
            borderRadius: 80,
            background: 'rgba(255,255,255,0.93)',
            backdropFilter: 'blur(18px)',
            boxShadow: SHADOW.card,
            border: '2px solid rgba(255,255,255,0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 40,
            scale: String(0.6 + 0.4 * card),
            opacity: card,
          }}
        >
          {/* Windows-style dot spinner around a restart icon */}
          <div style={{position: 'relative', width: 240, height: 240, display: 'grid', placeItems: 'center'}}>
            {new Array(6).fill(0).map((_, i) => {
              const a = ((frame * 6 - i * 22) * Math.PI) / 180;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: 22,
                    height: 22,
                    borderRadius: 99,
                    background: C.blue,
                    opacity: 1 - i * 0.14,
                    left: 120 + Math.cos(a) * 105 - 11,
                    top: 120 + Math.sin(a) * 105 - 11,
                  }}
                />
              );
            })}
            <div style={{rotate: `${frame * 4}deg`}}>
              <Icon.Refresh size={130} color={C.blue} stroke={2.2} />
            </div>
          </div>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 52, color: C.navy}}>Restarting…</div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 1330,
            padding: '16px 34px',
            borderRadius: 999,
            background: C.amber,
            color: C.white,
            fontFamily: FONT.body,
            fontWeight: 700,
            fontSize: 36,
            scale: String(chip),
            boxShadow: SHADOW.soft,
          }}
        >
          Only if required
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const NAV = [
  {label: 'Containers', icon: Icon.Box},
  {label: 'Images', icon: Icon.File},
  {label: 'Volumes', icon: Icon.Database},
  {label: 'Settings', icon: Icon.Gear},
];

const EngineBeat: React.FC<{runningAt: number; dur: number}> = ({runningAt, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const win = spring({frame: frame - 2, fps, config: {damping: 15}});
  const running = frame >= runningAt;
  const pulse = 1 + Math.sin(frame / 5) * (running ? 0.02 : 0.05);
  const runP = spring({frame: frame - runningAt, fps, config: {damping: 12}});
  const glow = interpolate(frame, [runningAt, runningAt + 14], [0, 1], CL);
  return (
    <AbsoluteFill>
      <Particles count={20} seed="eng" color={C.cyan} />
      <Camera dur={dur} from={1} to={1.06} driftY={-10}>
        <div style={{position: 'absolute', left: 60, top: 460, opacity: win, translate: `0px ${(1 - win) * 300}px`}}>
          <WindowFrame title="Docker Desktop" icon={<Img src={IMG.dockerIcon} style={{width: 40}} />} width={960} height={1020}>
            <div style={{display: 'flex', height: '100%'}}>
              {/* sidebar */}
              <div style={{width: 300, background: '#F4F7FC', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 14}}>
                {NAV.map((n, i) => {
                  const I = n.icon;
                  const v = prog(frame, 8 + i * 5, 12);
                  return (
                    <div
                      key={n.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '18px 18px',
                        borderRadius: 16,
                        background: i === 0 ? C.blueSoft : 'transparent',
                        color: i === 0 ? C.blue : C.slate,
                        fontFamily: FONT.body,
                        fontWeight: 600,
                        fontSize: 28,
                        opacity: v,
                        translate: `${(1 - v) * -30}px 0px`,
                      }}
                    >
                      <I size={34} color={i === 0 ? C.blue : C.slate} /> {n.label}
                    </div>
                  );
                })}
              </div>
              {/* main */}
              <div style={{flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40}}>
                <div
                  style={{
                    width: 330,
                    height: 330,
                    borderRadius: 999,
                    background: running ? 'radial-gradient(circle, #E9FBEF 0%, #FFFFFF 70%)' : 'radial-gradient(circle, #EEF4FF 0%, #FFFFFF 70%)',
                    display: 'grid',
                    placeItems: 'center',
                    scale: String(pulse),
                    boxShadow: running ? `0 0 0 ${10 * glow}px ${C.green}22, 0 0 80px ${C.green}55` : `0 0 0 10px ${C.blue}11`,
                  }}
                >
                  <Img src={IMG.dockerIcon} style={{width: 230}} />
                </div>
                <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 44, color: C.navy}}>Docker Engine</div>
              </div>
            </div>
            {/* status bar */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 96,
                background: running ? '#EAFBF0' : '#FFF7E8',
                borderTop: '2px solid #EEF2F8',
                display: 'flex',
                alignItems: 'center',
                padding: '0 30px',
                gap: 18,
                fontFamily: FONT.body,
                fontWeight: 700,
                fontSize: 32,
                color: running ? C.green : '#B7791F',
                overflow: 'hidden',
              }}
            >
              {running ? (
                <div style={{width: 26, height: 26, borderRadius: 99, background: C.green, scale: String(0.6 + 0.4 * runP), boxShadow: `0 0 0 ${8 * glow}px ${C.green}33`}} />
              ) : (
                <div style={{width: 26, height: 26, borderRadius: 99, border: `4px solid ${C.amber}`, borderTopColor: 'transparent', rotate: `${frame * 14}deg`}} />
              )}
              {running ? 'Engine running' : 'Engine starting…'}
              <LightSweep at={runningAt} dur={18} />
            </div>
          </WindowFrame>
        </div>
      </Camera>
      {/* green "running" check badge */}
      <div
        style={{
          position: 'absolute',
          right: 70,
          top: 410,
          width: 140,
          height: 140,
          borderRadius: 999,
          background: C.green,
          display: 'grid',
          placeItems: 'center',
          scale: String(running ? runP : 0),
          boxShadow: SHADOW.soft,
          rotate: `${(1 - runP) * -40}deg`,
        }}
      >
        <Icon.Check size={90} color={C.white} stroke={3} />
      </div>
    </AbsoluteFill>
  );
};
