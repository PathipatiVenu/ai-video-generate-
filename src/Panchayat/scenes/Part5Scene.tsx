import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../DockerInstall/components/Beat';
import {CL, EASE_OUT, GridBackground, LightSweep, Particles} from '../../DockerInstall/components/ui';
import {I, SectionBadge} from '../components/kit';
import {FONT, IMG, P, SFX, SHADOW} from '../theme';
import {localLine, TR} from '../timeline';

const S = 'part5' as const;

const LEVELS = [
  {line: 'first' as const, n: '1', name: 'Gram Panchayat', level: 'Village level', img: IMG.gpOffice, color: P.green, icon: I.Hut},
  {line: 'second' as const, n: '2', name: 'Mandal / Block Panchayat', level: 'Intermediate level', img: IMG.samiti, color: P.navy, icon: I.Building},
  {line: 'third' as const, n: '3', name: 'Zilla Parishad', level: 'District level', img: IMG.zilla, color: P.saffronDeep, icon: I.Building},
];

/**
 * "India generally has three levels of Panchayat governance: First, Gram Panchayat at the village
 *  level. Second, Mandal or Block Panchayat at the intermediate level. Third, Zilla Parishad at
 *  the district level."
 */
export const Part5Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const three = localLine(S, 'threeLevels');
  const starts = LEVELS.map((l) => localLine(S, l.line).from - 2);
  const big3 = spring({frame: frame - (three.from + 4), fps, config: {damping: 11}});
  const shrink = interpolate(frame, [starts[0] - 14, starts[0] + 4], [0, 1], {...CL, easing: EASE_OUT});

  // pyramid: level 1 at the bottom (widest) → level 3 at the top
  const tierY = [1280, 960, 640];
  const tierW = [980, 860, 740];

  return (
    <AbsoluteFill>
      <GridBackground base={P.cream} tint={P.navy} tint2={P.saffron} line={P.gridNavy} perspective />
      <Particles count={14} seed="p5" color={P.navy} />
      <SectionBadge n={5} title="Three levels" at={TR} color={P.navy} />

      {/* big "3" for the intro sentence */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 1 - shrink}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, scale: String(big3)}}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 380, color: P.navy, lineHeight: 1}}>3</div>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 70, color: P.ink, lineHeight: 1.05}}>
            levels of
            <br />
            governance
          </div>
        </div>
      </AbsoluteFill>

      {/* connector arrows between tiers */}
      {[0, 1].map((i) => {
        const p = interpolate(frame, [starts[i + 1] - 6, starts[i + 1] + 8], [0, 1], CL);
        return <div key={i} style={{position: 'absolute', left: 535, top: tierY[i] - 70, width: 10, height: 70 * p, background: `linear-gradient(${LEVELS[i + 1].color}, ${LEVELS[i].color})`, borderRadius: 5}} />;
      })}

      {LEVELS.map((lv, i) => {
        const s = spring({frame: frame - starts[i], fps, config: {damping: 13, stiffness: 140}});
        const active = frame >= starts[i] && (i === LEVELS.length - 1 || frame < starts[i + 1]);
        const Ico = lv.icon;
        return (
          <div
            key={lv.line}
            style={{
              position: 'absolute',
              left: (1080 - tierW[i]) / 2,
              top: tierY[i],
              width: tierW[i],
              height: 250,
              borderRadius: 40,
              background: P.paper,
              boxShadow: active ? SHADOW.glow(lv.color) : SHADOW.card,
              border: `5px solid ${lv.color}`,
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              opacity: Math.min(1, s * 1.5),
              translate: `0px ${(1 - s) * 400}px`,
              scale: String(0.7 + 0.3 * s),
            }}
          >
            <div style={{width: 250, height: '100%', flexShrink: 0, position: 'relative'}}>
              <Img src={lv.img} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <div style={{position: 'absolute', left: 14, top: 14, width: 70, height: 70, borderRadius: 99, background: lv.color, color: P.paper, display: 'grid', placeItems: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 42, border: `5px solid ${P.paper}`}}>
                {lv.n}
              </div>
            </div>
            <div style={{flex: 1, padding: '0 30px'}}>
              <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: lv.name.length > 18 ? 42 : 50, color: P.ink, lineHeight: 1.05}}>{lv.name}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, fontFamily: FONT.body, fontWeight: 800, fontSize: 32, color: lv.color}}>
                <Ico size={38} color={lv.color} stroke={2.2} /> {lv.level}
              </div>
            </div>
            <LightSweep at={starts[i] + 10} dur={20} opacity={0.5} />
          </div>
        );
      })}

      <Sfx src={SFX.whoosh} at={TR} volume={0.4} name="Whoosh – section 5" />
      <Sfx src={SFX.impact} at={three.from + 4} volume={0.4} name="Impact – 3 levels" />
      {LEVELS.map((lv, i) => (
        <React.Fragment key={lv.line}>
          <Sfx src={SFX.whip} at={starts[i] - 2} volume={0.4} name={`Whip – level ${i + 1}`} />
          <Sfx src={SFX.stamp} at={starts[i] + 8} volume={0.35} name={`Thud – level ${i + 1}`} />
        </React.Fragment>
      ))}
      <Sfx src={SFX.shimmer} at={starts[2] + 30} volume={0.3} name="Shimmer – pyramid complete" />
    </AbsoluteFill>
  );
};
