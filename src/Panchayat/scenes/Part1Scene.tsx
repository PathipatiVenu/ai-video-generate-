import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, Sfx} from '../../DockerInstall/components/Beat';
import {CL, EASE_IN_OUT, GridBackground, Particles} from '../../DockerInstall/components/ui';
import {Label} from '../../HeatedGloves/components/fx';
import {I, IconTile, PhotoBackdrop, PhotoCard, SectionBadge} from '../components/kit';
import {FONT, IMG, P, SFX, SHADOW} from '../theme';
import {atWord, localLine, sceneDuration, TR} from '../timeline';

const S = 'part1' as const;

/**
 * "A Gram Panchayat is a local government body that looks after village development.
 *  One Gram Panchayat may cover one village or a group of nearby villages. There is no fixed
 *  number of villages for every Panchayat. It depends on population and state government rules."
 */
export const Part1Scene: React.FC = () => {
  const total = sceneDuration(S);
  const cover = localLine(S, 'gpCover');
  const nofix = localLine(S, 'noFixed');
  const dep = localLine(S, 'depends');
  const groupAt = atWord(S, 'gpCover', 0.5); // "...or a group of nearby villages"
  const devAt = atWord(S, 'gpIs', 0.72); // "village development"
  const popAt = atWord(S, 'depends', 0.3);
  const rulesAt = atWord(S, 'depends', 0.62);

  return (
    <AbsoluteFill>
      <GridBackground base={P.cream} tint={P.green} tint2={P.saffron} line={P.gridGreen} />

      {/* A — what a Gram Panchayat is: real GP office photo */}
      <Beat name="Gram Panchayat office" from={0} dur={cover.from + 8} fadeIn={0} fadeOut={12} exitScale={1.1}>
        <AbsoluteFill>
          <Particles count={14} seed="p1" color={P.green} />
          <PhotoCard src={IMG.gpOffice2} at={TR + 4} x={60} y={400} w={960} h={650} dur={cover.from} />
          <Label at={atWord(S, 'gpIs', 0.3)} y={1110} bg={P.navy} size={42}>
            Local government body
          </Label>
          <IconTile icon={I.Growth} label="Village development" at={devAt} x={250} y={1250} w={580} color={P.green} />
        </AbsoluteFill>
      </Beat>

      {/* B — one village or a group of villages */}
      <Beat name="Village coverage diagram" from={cover.from} dur={nofix.from - cover.from + 8} fadeIn={10} fadeOut={10}>
        <CoverageDiagram groupAt={groupAt - cover.from} />
      </Beat>

      {/* C — no fixed number */}
      <Beat name="No fixed number" from={nofix.from} dur={dep.from - nofix.from + 8} fadeIn={10} fadeOut={10} exitScale={0.9}>
        <NoFixedBeat dur={dep.from - nofix.from} />
      </Beat>

      {/* D — depends on population + state rules */}
      <Beat name="Depends on population & rules" from={dep.from} dur={total - dep.from} fadeIn={10} fadeOut={0}>
        <AbsoluteFill>
          <PhotoBackdrop src={IMG.paddy} dur={total - dep.from} wash={0.62} />
          <FactorCard at={popAt - dep.from} y={470} icon={I.Users} color={P.saffronDeep} title="Population" bars />
          <FactorCard at={rulesAt - dep.from} y={900} icon={I.Book} color={P.navy} title="State government rules" />
        </AbsoluteFill>
      </Beat>

      <SectionBadge n={1} title="What is a Gram Panchayat?" at={TR} color={P.green} />

      <Sfx src={SFX.whoosh} at={TR} volume={0.4} name="Whoosh – section 1" />
      <Sfx src={SFX.pop} at={atWord(S, 'gpIs', 0.3)} volume={0.4} name="Pop – local govt" />
      <Sfx src={SFX.notify} at={devAt} volume={0.35} name="Notify – development" />
      <Sfx src={SFX.whip} at={cover.from - 4} volume={0.4} name="Whip – diagram" />
      <Sfx src={SFX.pop} at={cover.from + 14} volume={0.4} name="Pop – one village" />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} src={SFX.pop} at={groupAt + i * 5} volume={0.35} name={`Pop – village ${i + 2}`} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sfx key={`t${i}`} src={SFX.tick} at={nofix.from + 6 + i * 6} volume={0.25} name={`Tick – counter ${i + 1}`} />
      ))}
      <Sfx src={SFX.stamp} at={nofix.from + 44} volume={0.45} name="Stamp – no fixed number" />
      <Sfx src={SFX.pop} at={popAt} volume={0.45} name="Pop – population" />
      <Sfx src={SFX.page} at={rulesAt} volume={0.5} name="Page – state rules" />
    </AbsoluteFill>
  );
};

const VILLAGES = [
  {x: 540, y: 1250},
  {x: 210, y: 1130},
  {x: 870, y: 1130},
  {x: 260, y: 1440},
  {x: 820, y: 1440},
];

const CoverageDiagram: React.FC<{groupAt: number}> = ({groupAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hub = spring({frame: frame - 2, fps, config: {damping: 13}});
  const hubY = 640;
  return (
    <AbsoluteFill>
      <Particles count={14} seed="cov" color={P.navy} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {VILLAGES.map((v, i) => {
          const at = i === 0 ? 14 : groupAt + (i - 1) * 5;
          const p = interpolate(frame, [at, at + 14], [0, 1], {...CL, easing: EASE_IN_OUT});
          return (
            <line
              key={i}
              x1={540}
              y1={hubY + 120}
              x2={540 + (v.x - 540) * p}
              y2={hubY + 120 + (v.y - hubY - 120) * p}
              stroke={i === 0 ? P.green : P.saffron}
              strokeWidth={10}
              strokeDasharray="22 16"
              strokeDashoffset={-frame * 2}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {/* Gram Panchayat hub */}
      <div style={{position: 'absolute', left: 340, top: hubY - 120, width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, scale: String(hub), zIndex: 2}}>
        <div style={{width: 230, height: 230, borderRadius: 999, background: P.paper, border: `10px solid ${P.green}`, boxShadow: SHADOW.card, display: 'grid', placeItems: 'center'}}>
          <I.Building size={130} color={P.green} stroke={1.8} />
        </div>
        <div style={{padding: '10px 26px', borderRadius: 999, background: P.green, color: P.paper, fontFamily: FONT.body, fontWeight: 800, fontSize: 34}}>Gram Panchayat</div>
      </div>
      {VILLAGES.map((v, i) => {
        const at = i === 0 ? 20 : groupAt + 6 + (i - 1) * 5;
        const s = spring({frame: frame - at, fps, config: {damping: 11}});
        return (
          <div key={i} style={{position: 'absolute', left: v.x - 85, top: v.y - 85, width: 170, height: 170, borderRadius: 40, background: P.paper, boxShadow: SHADOW.soft, display: 'grid', placeItems: 'center', scale: String(s), zIndex: 2}}>
            <I.Hut size={100} color={i === 0 ? P.green : P.saffronDeep} stroke={1.9} />
          </div>
        );
      })}
      <Label at={groupAt + 26} y={1620} bg={P.saffronDeep} size={40}>
        1 village or a group
      </Label>
    </AbsoluteFill>
  );
};

const NoFixedBeat: React.FC<{dur: number}> = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seq = [1, 3, 5, 2, 7, 4];
  const idx = Math.min(seq.length - 1, Math.floor(Math.max(0, frame - 6) / 6));
  const settled = frame >= 44;
  const card = spring({frame: frame - 2, fps, config: {damping: 13}});
  const stamp = spring({frame: frame - 44, fps, config: {damping: 9, stiffness: 220}});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <Particles count={14} seed="nf" color={P.saffron} />
      <div style={{position: 'absolute', top: 470, width: 700, height: 640, borderRadius: 60, background: P.paper, boxShadow: SHADOW.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, scale: String(0.6 + 0.4 * card), opacity: card}}>
        <I.Hut size={130} color={P.saffronDeep} stroke={1.8} />
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 260, color: settled ? '#C9CED8' : P.ink, lineHeight: 1}}>{settled ? '?' : seq[idx]}</div>
        <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 38, color: P.slate}}>villages per Panchayat</div>
      </div>
      {settled ? (
        <div
          style={{
            position: 'absolute',
            top: 1180,
            padding: '20px 46px',
            borderRadius: 20,
            border: `8px solid ${P.red}`,
            color: P.red,
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 60,
            letterSpacing: 3,
            rotate: '-6deg',
            scale: String(0.6 + 0.4 * stamp * (2 - stamp)),
            opacity: Math.min(1, stamp * 2),
            background: 'rgba(255,255,255,0.9)',
          }}
        >
          NO FIXED NUMBER
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const FactorCard: React.FC<{at: number; y: number; icon: (p: {size?: number; color?: string; stroke?: number}) => React.ReactElement; color: string; title: string; bars?: boolean}> = ({
  at,
  y,
  icon: Ico,
  color,
  title,
  bars,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 13}});
  if (frame < at - 1) return null;
  return (
    <div style={{position: 'absolute', left: 80, top: y, width: 920, height: 360, borderRadius: 50, background: 'rgba(255,255,255,0.95)', boxShadow: SHADOW.glow(color), display: 'flex', alignItems: 'center', gap: 40, padding: '0 50px', opacity: Math.min(1, s * 1.5), translate: `${(1 - s) * 900}px 0px`}}>
      <div style={{width: 200, height: 200, flexShrink: 0, borderRadius: 52, background: `${color}1c`, display: 'grid', placeItems: 'center'}}>
        <Ico size={130} color={color} stroke={1.8} />
      </div>
      <div style={{flex: 1}}>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 56, color: P.ink, lineHeight: 1.05}}>{title}</div>
        {bars ? (
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 14, height: 110, marginTop: 20}}>
            {[0.35, 0.55, 0.8, 1].map((h, i) => (
              <div key={i} style={{width: 54, borderRadius: 10, background: color, height: `${h * 100 * interpolate(frame, [at + 6 + i * 4, at + 20 + i * 4], [0, 1], CL)}%`}} />
            ))}
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22}}>
            {[0.9, 0.7, 0.8].map((w, i) => (
              <div key={i} style={{height: 16, borderRadius: 8, background: `${color}33`, width: `${w * 100 * interpolate(frame, [at + 6 + i * 4, at + 22 + i * 4], [0, 1], CL)}%`}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
