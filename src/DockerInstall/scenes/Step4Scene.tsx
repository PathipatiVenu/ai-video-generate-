import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../components/Beat';
import {C, FONT, IMG, SFX, SHADOW} from '../theme';
import {localLine, TR} from '../timeline';
import {CL, Confetti, EASE_IN_OUT, GridBackground, Icon, LightSweep, Particles, StepBadge, WindowFrame, prog, typed} from '../components/ui';

const S = 'step4' as const;
const PROMPT = 'PS C:\\Users\\you>';
const CMD1 = 'docker --version';
const CMD2 = 'docker run hello-world';
const CPF = 0.8; // typing speed (chars per frame)

// Real `docker run hello-world` output (first lines).
const HELLO_OUT = [
  {t: "Unable to find image 'hello-world:latest' locally", c: '#6B7A96'},
  {t: 'latest: Pulling from library/hello-world', c: '#6B7A96'},
  {t: 'Pull complete', c: '#6B7A96'},
  {t: 'Status: Downloaded newer image for hello-world:latest', c: '#6B7A96'},
  {t: '', c: ''},
  {t: 'Hello from Docker!', c: C.green, hero: true},
  {t: 'This message shows that your installation appears', c: C.navy},
  {t: 'to be working correctly.', c: C.navy},
];

/**
 * "Now, open your terminal and run this command: docker --version.
 *  To verify that Docker is working properly, run: docker run hello-world.
 *  If you see the Hello from Docker message, congratulations!
 *  Docker is successfully installed."
 */
export const Step4Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = localLine(S, 'version');
  const h = localLine(S, 'helloWorld');
  const cg = localLine(S, 'congrats');
  const ins = localLine(S, 'installed');

  const t1 = v.from + Math.round(v.dur * 0.62); // "...docker --version"
  const t1End = t1 + Math.ceil(CMD1.length / CPF);
  const out1 = t1End + 6;
  const t2 = h.from + Math.round(h.dur * 0.6); // "...run: docker run hello-world"
  const t2End = t2 + Math.ceil(CMD2.length / CPF);
  const out2 = t2End + 6; // output lines stream in from here
  const zoomAt = cg.from + 2; // "If you see the Hello from Docker message"
  const confettiAt = cg.from + Math.round(cg.dur * 0.62); // "congratulations!"
  const successAt = ins.from - 2;

  const term = spring({frame: frame - (TR + 2), fps, config: {damping: 16}});
  // camera: zoom into "Hello from Docker!" then pull back for the success card
  const z = interpolate(frame, [zoomAt - 8, zoomAt + 14, successAt - 6, successAt + 10], [0, 1, 1, 0], {...CL, easing: EASE_IN_OUT});
  const success = spring({frame: frame - successAt, fps, config: {damping: 13}});

  return (
    <AbsoluteFill>
      <GridBackground tint={C.blue} tint2={C.green} />
      <Particles count={16} seed="s4" />
      <StepBadge n={4} label="VERIFY" />

      <AbsoluteFill
        style={{
          scale: String(1 + z * 0.35),
          translate: `${z * 175}px ${z * -230}px`,
          filter: `blur(${success * 10}px)`,
          opacity: 1 - success * 0.35,
        }}
      >
        <div style={{position: 'absolute', left: 40, top: 430, opacity: term, translate: `0px ${(1 - term) * 400}px`, scale: String(0.85 + 0.15 * term)}}>
          <WindowFrame title="Windows PowerShell" icon={<Icon.Terminal size={40} color={C.blue} />} width={1000} height={900}>
            <div style={{padding: '34px 34px', fontFamily: FONT.mono, fontSize: 31, lineHeight: 1.55, color: C.navy, background: 'linear-gradient(180deg, #FFFFFF, #F4F8FF)', height: '100%'}}>
              <Line>
                <span style={{color: C.blue, fontWeight: 700}}>{PROMPT}</span> <span>{typed(CMD1, frame, t1, CPF)}</span>
                {frame < t1End + 2 ? <Caret /> : null}
              </Line>
              {frame >= out1 ? (
                <Line fade={prog(frame, out1, 8)}>
                  <span style={{color: C.green, fontWeight: 700}}>Docker version 28.4.0</span>
                </Line>
              ) : null}
              {frame >= out1 + 6 ? (
                <Line>
                  <span style={{color: C.blue, fontWeight: 700}}>{PROMPT}</span> <span>{typed(CMD2, frame, t2, CPF)}</span>
                  {frame < t2End + 2 ? <Caret /> : null}
                </Line>
              ) : null}
              {HELLO_OUT.map((l, i) => {
                const at = out2 + i * 4;
                if (frame < at) return null;
                if (l.hero) {
                  return (
                    <div key={i} style={{position: 'relative', margin: '6px -12px', padding: '6px 12px', borderRadius: 12, background: `rgba(22,163,74,${0.1 + z * 0.08})`, boxShadow: z > 0 ? `0 0 0 ${3 * z}px ${C.green}, 0 0 ${40 * z}px ${C.green}66` : undefined, overflow: 'hidden'}}>
                      <span style={{color: l.c, fontWeight: 700, fontSize: 36}}>{l.t}</span>
                      <LightSweep at={zoomAt + 8} dur={20} opacity={0.4} />
                    </div>
                  );
                }
                return (
                  <Line key={i} fade={prog(frame, at, 6)}>
                    <span style={{color: l.c, fontSize: 27}}>{l.t || ' '}</span>
                  </Line>
                );
              })}
            </div>
          </WindowFrame>
        </div>
        {/* version callout */}
        <Callout at={out1 + 4} until={t2 - 4} top={600} text="Version check" />
      </AbsoluteFill>

      <Confetti at={confettiAt} x={540} y={760} />

      {/* success card — "Docker is successfully installed." */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', pointerEvents: 'none'}}>
        <div
          style={{
            width: 760,
            padding: '70px 60px',
            borderRadius: 60,
            background: C.white,
            boxShadow: SHADOW.card,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 40,
            opacity: success,
            scale: String(0.5 + 0.5 * success),
            translate: `0px ${(1 - success) * 200}px`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{position: 'relative'}}>
            <Img src={IMG.dockerIcon} style={{width: 380}} />
            <div
              style={{
                position: 'absolute',
                right: -40,
                bottom: -40,
                width: 150,
                height: 150,
                borderRadius: 999,
                background: C.green,
                border: `8px solid ${C.white}`,
                display: 'grid',
                placeItems: 'center',
                scale: String(spring({frame: frame - successAt - 8, fps, config: {damping: 9}})),
              }}
            >
              <Icon.Check size={90} color={C.white} stroke={3.2} />
            </div>
          </div>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 64, color: C.navy}}>Installed</div>
          <LightSweep at={successAt + 12} dur={22} />
        </div>
      </AbsoluteFill>

      <Sfx src={SFX.whoosh} at={TR} volume={0.4} name="Whoosh – terminal" />
      <Sfx src={SFX.typing} at={t1} volume={0.5} name="Typing – version" />
      <Sfx src={SFX.enter} at={t1End + 2} volume={0.55} name="Enter – version" />
      <Sfx src={SFX.pop} at={out1} volume={0.35} name="Pop – version output" />
      <Sfx src={SFX.typing} at={t2} volume={0.5} name="Typing – hello-world" />
      <Sfx src={SFX.enter} at={t2End + 2} volume={0.55} name="Enter – hello-world" />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} src={SFX.tick} at={out2 + i * 5} volume={0.25} name={`Output line ${i + 1}`} />
      ))}
      <Sfx src={SFX.riser} at={zoomAt - 20} volume={0.3} name="Riser – zoom" />
      <Sfx src={SFX.shimmer} at={zoomAt + 6} volume={0.35} name="Shimmer – Hello from Docker" />
      <Sfx src={SFX.success} at={confettiAt} volume={0.55} name="Success – congratulations" />
      <Sfx src={SFX.impact} at={successAt + 2} volume={0.42} name="Impact – installed" />
      <Sfx src={SFX.ding} at={successAt + 10} volume={0.35} name="Ding – check" />
    </AbsoluteFill>
  );
};

const Line: React.FC<{children: React.ReactNode; fade?: number}> = ({children, fade = 1}) => (
  <div style={{opacity: fade, translate: `0px ${(1 - fade) * 10}px`, whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{children}</div>
);

const Caret: React.FC = () => {
  const frame = useCurrentFrame();
  return <span style={{display: 'inline-block', width: 16, height: 34, marginLeft: 4, background: C.blue, opacity: Math.floor(frame / 8) % 2 ? 0 : 1, verticalAlign: 'middle'}} />;
};

const Callout: React.FC<{at: number; until: number; top: number; text: string}> = ({at, until, top, text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 12}});
  const out = interpolate(frame, [until - 8, until], [1, 0], CL);
  if (frame < at || frame > until) return null;
  return (
    <div
      style={{
        position: 'absolute',
        right: 60,
        top,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 28px',
        borderRadius: 999,
        background: C.green,
        color: C.white,
        fontFamily: FONT.body,
        fontWeight: 700,
        fontSize: 32,
        boxShadow: SHADOW.soft,
        scale: String(s),
        opacity: out,
      }}
    >
      <Icon.Check size={36} color={C.white} stroke={3} />
      {text}
    </div>
  );
};
