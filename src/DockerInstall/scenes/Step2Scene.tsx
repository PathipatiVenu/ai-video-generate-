import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../components/Beat';
import {C, FONT, IMG, SFX, SHADOW} from '../theme';
import {localLine, TR} from '../timeline';
import {CL, Cursor, EASE_IN_OUT, EASE_OUT, GridBackground, Icon, LightSweep, Particles, StepBadge, WindowFrame, prog} from '../components/ui';

const S = 'step2' as const;

/**
 * "Once the download is complete, open the installer and follow the setup
 *  instructions. Make sure the WSL 2 option is enabled when prompted."
 */
export const Step2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inst = localLine(S, 'installer');
  const wsl = localLine(S, 'wsl');

  const dbl = inst.from + Math.round(inst.dur * 0.3); // "...open the installer"
  const winAt = dbl + 8;
  const promptAt = wsl.from - 2;
  const tickAt = wsl.from + Math.round(wsl.dur * 0.42); // "...WSL 2 option is enabled"
  const okAt = wsl.end + 2;

  const fileIn = spring({frame: frame - (TR + 2), fps, config: {damping: 12}});
  const fileOut = prog(frame, winAt - 2, 10);
  const winIn = spring({frame: frame - winAt, fps, config: {damping: 16}});
  // camera push into the WSL checkbox
  const push = interpolate(frame, [tickAt - 22, tickAt + 4, okAt + 10, okAt + 26], [0, 1, 1, 0.35], {...CL, easing: EASE_IN_OUT});

  return (
    <AbsoluteFill>
      <GridBackground tint="#8B5CF6" tint2={C.blue} />
      <Particles count={16} seed="s2" />
      <StepBadge n={2} label="INSTALL" />

      <AbsoluteFill
        style={{
          scale: String(1 + push * 0.2),
          translate: `0px ${push * -40}px`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* installer file on a desktop */}
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 22,
              scale: String((0.5 + 0.5 * fileIn) * (1 - fileOut * 0.6)),
              opacity: fileIn * (1 - fileOut),
            }}
          >
            <div style={{width: 260, height: 300, borderRadius: 36, background: C.white, boxShadow: SHADOW.card, display: 'grid', placeItems: 'center', position: 'relative'}}>
              <Icon.File size={210} color={C.blueSoft} stroke={1.2} />
              <Img src={IMG.dockerIcon} style={{position: 'absolute', width: 140, top: 120}} />
            </div>
            <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 34, color: C.navy}}>Docker Desktop Installer.exe</div>
          </div>
        </AbsoluteFill>

        {/* installer window */}
        <div style={{position: 'absolute', left: 70, top: 470, opacity: winIn, scale: String(0.4 + 0.6 * winIn), transformOrigin: '50% 40%'}}>
          <WindowFrame title="Docker Desktop Installer" icon={<Img src={IMG.dockerIcon} style={{width: 40}} />} width={940} height={860}>
            <InstallerBody frame={frame - winAt} />
          </WindowFrame>
        </div>

        {/* WSL 2 configuration prompt */}
        <ConfigPrompt at={promptAt} tickAt={tickAt} okAt={okAt} />

        <Cursor
          appearAt={dbl - 26}
          path={[
            {f: dbl - 26, x: 860, y: 1450},
            {f: dbl - 6, x: 590, y: 1000},
            {f: winAt + 10, x: 600, y: 1010},
            {f: tickAt - 10, x: 219, y: 980},
            {f: tickAt + 8, x: 219, y: 980},
            {f: okAt - 4, x: 812, y: 1235},
            {f: okAt + 30, x: 860, y: 1300},
          ]}
          clicks={[dbl, dbl + 5, tickAt, okAt]}
        />
      </AbsoluteFill>

      <Sfx src={SFX.pop} at={TR + 4} volume={0.45} name="Pop – installer file" />
      <Sfx src={SFX.click} at={dbl} volume={0.5} name="Click 1" />
      <Sfx src={SFX.click} at={dbl + 5} volume={0.5} name="Click 2" />
      <Sfx src={SFX.whoosh} at={winAt - 2} volume={0.45} name="Whoosh – window" />
      <Sfx src={SFX.notify} at={promptAt + 2} volume={0.4} name="Notify – prompt" />
      <Sfx src={SFX.switch} at={tickAt} volume={0.6} name="Switch – WSL 2 tick" />
      <Sfx src={SFX.shimmer} at={tickAt + 4} volume={0.3} name="Shimmer – WSL 2" />
      <Sfx src={SFX.click} at={okAt} volume={0.5} name="Click – OK" />
    </AbsoluteFill>
  );
};

const STEPS = ['Unpacking files', 'Installing components', 'Configuring Docker Desktop'];

const InstallerBody: React.FC<{frame: number}> = ({frame}) => {
  const p = interpolate(frame, [6, 130], [0, 0.78], {...CL, easing: EASE_OUT});
  return (
    <AbsoluteFill style={{padding: '60px 60px', background: 'linear-gradient(180deg, #FFFFFF, #F3F7FF)'}}>
      <Img src={IMG.dockerLogo} style={{width: 420}} />
      <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 54, color: C.navy, marginTop: 50}}>Installing Docker Desktop</div>
      <div style={{height: 22, borderRadius: 12, background: '#E3E9F4', marginTop: 40, overflow: 'hidden', position: 'relative'}}>
        <div style={{height: '100%', width: `${p * 100}%`, borderRadius: 12, background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`}} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 30, marginTop: 50}}>
        {STEPS.map((s, i) => {
          const at = 12 + i * 34;
          const done = frame > at + 30;
          const vis = prog(frame, at, 12);
          return (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 22, opacity: vis, translate: `${(1 - vis) * 40}px 0px`}}>
              <div style={{width: 52, height: 52, borderRadius: 999, background: done ? C.greenSoft : C.blueSoft, display: 'grid', placeItems: 'center'}}>
                {done ? (
                  <Icon.Check size={34} color={C.green} stroke={3} />
                ) : (
                  <div style={{width: 26, height: 26, borderRadius: 99, border: `4px solid ${C.blue}`, borderTopColor: 'transparent', rotate: `${frame * 14}deg`}} />
                )}
              </div>
              <div style={{fontFamily: FONT.body, fontSize: 36, fontWeight: 600, color: done ? C.navy : C.slate}}>{s}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ConfigPrompt: React.FC<{at: number; tickAt: number; okAt: number}> = ({at, tickAt, okAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 14}});
  const tick = spring({frame: frame - tickAt, fps, config: {damping: 10, stiffness: 200}});
  const glow = interpolate(frame, [tickAt, tickAt + 10, tickAt + 40], [0, 1, 0.6], CL);
  const okPressed = frame >= okAt && frame < okAt + 6;
  const chip = spring({frame: frame - (tickAt + 10), fps, config: {damping: 12}});
  if (frame < at) return null;
  return (
    <>
      <AbsoluteFill style={{background: `rgba(245,248,255,${0.55 * s})`}} />
      <div style={{position: 'absolute', left: 110, top: 700, scale: String(0.7 + 0.3 * s), opacity: s}}>
        <WindowFrame title="Configuration" icon={<Img src={IMG.dockerIcon} style={{width: 40}} />} width={860} height={640}>
          <div style={{padding: '50px 54px', fontFamily: FONT.body}}>
            <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 48, color: C.navy}}>Configuration</div>
            {/* WSL 2 option */}
            <div
              style={{
                marginTop: 46,
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                padding: '24px 26px',
                borderRadius: 22,
                background: glow > 0 ? '#EEF4FF' : 'transparent',
                boxShadow: glow > 0 ? `0 0 0 ${4 * glow}px ${C.blue}55, 0 10px 40px -10px ${C.blue}${Math.round(glow * 120).toString(16).padStart(2, '0')}` : undefined,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{width: 58, height: 58, flexShrink: 0, borderRadius: 14, border: `4px solid ${C.blue}`, background: tick > 0.05 ? C.blue : C.white, display: 'grid', placeItems: 'center'}}>
                <div style={{scale: String(tick)}}>
                  <Icon.Check size={44} color={C.white} stroke={3.4} />
                </div>
              </div>
              <div style={{fontSize: 36, fontWeight: 600, color: C.navy, lineHeight: 1.25}}>
                Use <b style={{color: C.blue}}>WSL 2</b> instead of Hyper-V (recommended)
              </div>
              <LightSweep at={tickAt + 2} dur={20} />
            </div>
            <div style={{marginTop: 18, display: 'flex', alignItems: 'center', gap: 26, padding: '24px 26px', opacity: 0.75}}>
              <div style={{width: 58, height: 58, borderRadius: 14, border: `4px solid ${C.blue}`, background: C.blue, display: 'grid', placeItems: 'center'}}>
                <Icon.Check size={44} color={C.white} stroke={3.4} />
              </div>
              <div style={{fontSize: 36, fontWeight: 600, color: C.slate}}>Add shortcut to desktop</div>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 34}}>
              <div style={{padding: '22px 70px', borderRadius: 16, background: C.blue, color: C.white, fontWeight: 700, fontSize: 36, scale: okPressed ? '0.94' : '1'}}>OK</div>
            </div>
          </div>
        </WindowFrame>
      </div>
      {/* WSL 2 enabled chip */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1390,
          display: 'flex',
          justifyContent: 'center',
          opacity: chip,
          translate: `0px ${(1 - chip) * 60}px`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '18px 34px', borderRadius: 999, background: C.green, color: C.white, fontFamily: FONT.body, fontWeight: 700, fontSize: 38, boxShadow: SHADOW.soft}}>
          <Icon.Check size={40} color={C.white} stroke={3} /> WSL 2 enabled
        </div>
      </div>
    </>
  );
};
