import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, Sfx} from '../../DockerInstall/components/Beat';
import {CL, Confetti, EASE_OUT, GridBackground, LightSweep, Particles} from '../../DockerInstall/components/ui';
import {Label} from '../../HeatedGloves/components/fx';
import {I, IconTile, PhotoCard, SectionBadge} from '../components/kit';
import {FONT, IMG, P, SFX, SHADOW} from '../theme';
import {atWord, localLine, sceneDuration, TR} from '../timeline';

const S = 'part3' as const;

/**
 * "If a person wins the Sarpanch election, they become the head of the Gram Panchayat.
 *  They help lead village development activities, coordinate with government officials,
 *  attend Panchayat meetings and work to solve local problems."
 */
export const Part3Scene: React.FC = () => {
  const total = sceneDuration(S);
  const duties = localLine(S, 'duties');
  const winAt = atWord(S, 'winsHead', 0.38); // "wins the Sarpanch election"
  const headAt = atWord(S, 'winsHead', 0.72); // "head of the Gram Panchayat"
  const d1 = atWord(S, 'duties', 0.04);
  const d2 = atWord(S, 'duties', 0.34);
  const d3 = atWord(S, 'duties', 0.6);
  const d4 = atWord(S, 'duties', 0.8);

  return (
    <AbsoluteFill>
      <GridBackground base={P.cream} tint={P.saffron} tint2={P.green} line={P.gridSaffron} />
      <Particles count={14} seed="p3" color={P.green} />

      {/* A — wins → Sarpanch, head of the Gram Panchayat */}
      <Beat name="Wins → Sarpanch" from={0} dur={duties.from + 8} fadeIn={0} fadeOut={12} exitScale={0.9}>
        <SarpanchBeat winAt={winAt} headAt={headAt} />
      </Beat>

      {/* B — what the Sarpanch does */}
      <Beat name="Sarpanch duties" from={duties.from} dur={total - duties.from} fadeIn={10} fadeOut={0}>
        <AbsoluteFill>
          <PhotoCard src={IMG.gramSabha} at={d3 - duties.from - 6} x={60} y={360} w={960} h={470} dur={total - duties.from} />
          <IconTile icon={I.Growth} label="Lead village development" at={d1 - duties.from} x={60} y={900} w={960} color={P.green} />
          <IconTile icon={I.Handshake} label="Coordinate with officials" at={d2 - duties.from} x={60} y={1070} w={960} color={P.navy} />
          <IconTile icon={I.Meeting} label="Attend Panchayat meetings" at={d3 - duties.from} x={60} y={1240} w={960} color={P.saffronDeep} />
          <IconTile icon={I.Wrench} label="Solve local problems" at={d4 - duties.from} x={60} y={1410} w={960} color={P.purple} />
        </AbsoluteFill>
      </Beat>

      <SectionBadge n={3} title="If a person wins" at={TR} color={P.navy} />

      <Sfx src={SFX.whoosh} at={TR} volume={0.4} name="Whoosh – section 3" />
      <Sfx src={SFX.stamp} at={winAt - 10} volume={0.6} name="Stamp – ballot" />
      <Sfx src={SFX.success} at={winAt} volume={0.45} name="Success – wins" />
      <Sfx src={SFX.impact} at={headAt} volume={0.4} name="Impact – head" />
      <Sfx src={SFX.shimmer} at={headAt + 4} volume={0.3} name="Shimmer – Sarpanch badge" />
      <Sfx src={SFX.whip} at={duties.from - 4} volume={0.4} name="Whip – duties" />
      {[d1, d2, d3, d4].map((d, i) => (
        <Sfx key={i} src={SFX.pop} at={d} volume={0.42} name={`Pop – duty ${i + 1}`} />
      ))}
    </AbsoluteFill>
  );
};

const SarpanchBeat: React.FC<{winAt: number; headAt: number}> = ({winAt, headAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ballot = spring({frame: frame - (TR + 4), fps, config: {damping: 14}});
  const stampP = interpolate(frame, [winAt - 14, winAt - 10], [0, 1], CL);
  const stamped = frame >= winAt - 10;
  const lift = interpolate(frame, [winAt + 4, winAt + 24], [0, 1], {...CL, easing: EASE_OUT});
  const person = spring({frame: frame - (winAt + 6), fps, config: {damping: 12}});
  const sash = spring({frame: frame - headAt, fps, config: {damping: 10}});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      {/* ballot paper with stamp */}
      <div
        style={{
          position: 'absolute',
          top: interpolate(lift, [0, 1], [480, 1330]),
          width: 640,
          height: 400,
          borderRadius: 30,
          background: P.paper,
          boxShadow: SHADOW.card,
          padding: '34px 40px',
          opacity: ballot,
          scale: String((0.7 + 0.3 * ballot) * interpolate(lift, [0, 1], [1, 0.6])),
          rotate: `${-3 + lift * 6}deg`,
        }}
      >
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 40, color: P.ink}}>Ballot</div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 24}}>
            <div style={{width: 60, height: 60, borderRadius: 14, border: `4px solid ${P.slate}55`, display: 'grid', placeItems: 'center'}}>
              {i === 1 && stamped ? <div style={{width: 46, height: 46, borderRadius: 99, border: `6px solid ${P.purple}`, scale: String(1.4 - stampP * 0.4), opacity: stampP}} /> : null}
            </div>
            <div style={{height: 18, borderRadius: 9, background: '#E3E8F0', width: 300 + i * 50}} />
          </div>
        ))}
      </div>
      {/* winner → Sarpanch */}
      <div style={{position: 'absolute', top: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, opacity: person, scale: String(0.4 + 0.6 * person)}}>
        <div style={{position: 'relative', width: 420, height: 420, borderRadius: 999, background: P.paper, border: `14px solid ${P.saffron}`, boxShadow: SHADOW.glow(P.saffron), display: 'grid', placeItems: 'center'}}>
          <I.Person size={260} color={P.navy} stroke={1.6} />
          <div style={{position: 'absolute', top: -30, right: -10, width: 130, height: 130, borderRadius: 99, background: P.saffron, display: 'grid', placeItems: 'center', scale: String(sash), rotate: `${(1 - sash) * -60}deg`, border: `6px solid ${P.paper}`}}>
            <I.Star size={80} color={P.paper} stroke={2.4} />
          </div>
        </div>
        <div style={{position: 'relative', padding: '18px 60px', borderRadius: 999, background: `linear-gradient(90deg, ${P.saffron}, ${P.saffronDeep})`, color: P.paper, fontFamily: FONT.display, fontWeight: 700, fontSize: 68, scale: String(sash), overflow: 'hidden'}}>
          Sarpanch
          <LightSweep at={headAt + 6} dur={20} />
        </div>
      </div>
      <Label at={headAt + 6} y={1060} bg={P.green} size={42}>
        Head of the Gram Panchayat
      </Label>
      <Confetti at={winAt} x={540} y={620} count={60} />
    </AbsoluteFill>
  );
};
