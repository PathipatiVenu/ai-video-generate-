import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, Sfx} from '../../DockerInstall/components/Beat';
import {CL, EASE_OUT, GridBackground, LightSweep, Particles} from '../../DockerInstall/components/ui';
import {Label} from '../../HeatedGloves/components/fx';
import {I, PhotoCard, SectionBadge} from '../components/kit';
import {FONT, IMG, P, SFX, SHADOW} from '../theme';
import {atWord, localLine, sceneDuration, TR} from '../timeline';

const S = 'part2' as const;

/**
 * "Generally, a person must be at least 21 years old and their name must be on the relevant
 *  electoral roll. They must also satisfy the other eligibility conditions under their state's
 *  Panchayat laws. Some seats are reserved for women and eligible communities."
 */
export const Part2Scene: React.FC = () => {
  const total = sceneDuration(S);
  const laws = localLine(S, 'stateLaws');
  const res = localLine(S, 'reserved');
  const ageAt = atWord(S, 'age21', 0.22); // "at least 21 years old"
  const rollAt = atWord(S, 'age21', 0.62); // "...on the relevant electoral roll"
  const lawsAt = atWord(S, 'stateLaws', 0.7); // "state's Panchayat laws"

  return (
    <AbsoluteFill>
      <GridBackground base={P.cream} tint={P.saffron} tint2={P.navy} line={P.gridNavy} />
      <Particles count={14} seed="p2" color={P.saffron} />

      {/* A — 21+ and electoral roll */}
      <Beat name="Age 21+ & electoral roll" from={0} dur={laws.from + 8} fadeIn={0} fadeOut={12}>
        <AgeRollBeat ageAt={ageAt} rollAt={rollAt} />
      </Beat>

      {/* B — eligibility under state Panchayat laws */}
      <Beat name="State eligibility conditions" from={laws.from} dur={res.from - laws.from + 8} fadeIn={10} fadeOut={10}>
        <LawsBeat lawsAt={lawsAt - laws.from} />
      </Beat>

      {/* C — reserved seats */}
      <Beat name="Reserved seats" from={res.from} dur={total - res.from} fadeIn={10} fadeOut={0}>
        <ReservedBeat womenAt={atWord(S, 'reserved', 0.55) - res.from} commAt={atWord(S, 'reserved', 0.75) - res.from} dur={total - res.from} />
      </Beat>

      <SectionBadge n={2} title="Who can contest?" at={TR} color={P.saffronDeep} />

      <Sfx src={SFX.whoosh} at={TR} volume={0.4} name="Whoosh – section 2" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sfx key={i} src={SFX.tick} at={ageAt - 18 + i * 3} volume={0.22} name={`Tick – age count ${i + 1}`} />
      ))}
      <Sfx src={SFX.impact} at={ageAt} volume={0.4} name="Impact – 21+" />
      <Sfx src={SFX.page} at={rollAt - 8} volume={0.5} name="Page – electoral roll" />
      <Sfx src={SFX.switch} at={rollAt + 14} volume={0.5} name="Highlight – your name" />
      <Sfx src={SFX.page} at={laws.from + 2} volume={0.45} name="Page – law book" />
      {[0, 1, 2].map((i) => (
        <Sfx key={`c${i}`} src={SFX.tick} at={laws.from + 22 + i * 14} volume={0.45} name={`Tick – condition ${i + 1}`} />
      ))}
      <Sfx src={SFX.stamp} at={lawsAt} volume={0.4} name="Stamp – state laws" />
      <Sfx src={SFX.whip} at={res.from - 4} volume={0.4} name="Whip – seats" />
      <Sfx src={SFX.shimmer} at={atWord(S, 'reserved', 0.55)} volume={0.35} name="Shimmer – reserved" />
    </AbsoluteFill>
  );
};

const AgeRollBeat: React.FC<{ageAt: number; rollAt: number}> = ({ageAt, rollAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const count = Math.round(interpolate(frame, [ageAt - 20, ageAt], [0, 21], {...CL, easing: EASE_OUT}));
  const badge = spring({frame: frame - (ageAt - 22), fps, config: {damping: 12}});
  const done = frame >= ageAt;
  const lift = interpolate(frame, [rollAt - 14, rollAt + 6], [0, 1], {...CL, easing: EASE_OUT});
  const roll = spring({frame: frame - (rollAt - 10), fps, config: {damping: 14}});
  const hl = interpolate(frame, [rollAt + 12, rollAt + 26], [0, 1], CL);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      {/* age badge */}
      <div
        style={{
          position: 'absolute',
          top: interpolate(lift, [0, 1], [560, 340]),
          width: 520,
          height: 520,
          scale: String((0.5 + 0.5 * badge) * interpolate(lift, [0, 1], [1, 0.62])),
          borderRadius: 999,
          background: P.paper,
          border: `14px solid ${done ? P.saffron : P.navySoft}`,
          boxShadow: done ? SHADOW.glow(P.saffron) : SHADOW.card,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: badge,
        }}
      >
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 220, color: P.ink, lineHeight: 0.9}}>
          {count}
          {done ? <span style={{color: P.saffronDeep}}>+</span> : null}
        </div>
        <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 44, color: P.slate}}>years old</div>
      </div>
      {/* electoral roll */}
      <div
        style={{
          position: 'absolute',
          top: 820,
          width: 880,
          padding: '40px 44px',
          borderRadius: 44,
          background: P.paper,
          boxShadow: SHADOW.card,
          opacity: roll,
          translate: `0px ${(1 - roll) * 600}px`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: FONT.display, fontWeight: 700, fontSize: 46, color: P.ink}}>
          <I.List size={58} color={P.navy} stroke={2} /> Electoral roll
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 30}}>
          {[0, 1, 2, 3, 4].map((i) => {
            const me = i === 2;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  padding: '16px 18px',
                  borderRadius: 18,
                  background: me ? `rgba(19,136,8,${0.12 * hl})` : 'transparent',
                  boxShadow: me && hl > 0 ? `0 0 0 ${4 * hl}px ${P.green}` : undefined,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{width: 56, height: 56, borderRadius: 99, background: me ? P.greenSoft : '#EEF1F6', display: 'grid', placeItems: 'center'}}>
                  <I.Person size={34} color={me ? P.green : '#A8B0C0'} />
                </div>
                <div style={{flex: 1, height: 18, borderRadius: 9, background: me ? `${P.green}55` : '#E6EAF1', maxWidth: me ? 420 : 300 + ((i * 70) % 160)}} />
                {me ? (
                  <div style={{scale: String(hl), display: 'flex', alignItems: 'center', gap: 8, color: P.green, fontFamily: FONT.body, fontWeight: 800, fontSize: 32}}>
                    <I.Check size={42} color={P.green} stroke={3} /> Your name
                  </div>
                ) : null}
                {me ? <LightSweep at={rollAt + 14} dur={18} opacity={0.6} /> : null}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CONDITIONS = [0, 1, 2]; // three generic condition rows

const LawsBeat: React.FC<{lawsAt: number}> = ({lawsAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const book = spring({frame: frame - 2, fps, config: {damping: 13}});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 400, width: 880, padding: '46px 50px', borderRadius: 50, background: P.paper, boxShadow: SHADOW.card, opacity: book, scale: String(0.7 + 0.3 * book)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
          <div style={{width: 150, height: 150, borderRadius: 40, background: P.navySoft, display: 'grid', placeItems: 'center'}}>
            <I.Book size={100} color={P.navy} stroke={1.8} />
          </div>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 56, color: P.ink, lineHeight: 1.05}}>Eligibility conditions</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 24, marginTop: 40}}>
          {CONDITIONS.map((i) => {
            const at = 20 + i * 14;
            const t = spring({frame: frame - at, fps, config: {damping: 10, stiffness: 200}});
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, opacity: interpolate(frame, [at - 6, at], [0.35, 1], CL)}}>
                <div style={{width: 64, height: 64, borderRadius: 18, border: `5px solid ${P.green}`, background: t > 0.1 ? P.green : P.paper, display: 'grid', placeItems: 'center'}}>
                  <div style={{scale: String(t)}}>
                    <I.Check size={46} color={P.paper} stroke={3.4} />
                  </div>
                </div>
                <div style={{height: 22, borderRadius: 11, background: '#E3E8F0', width: 420 + i * 60}} />
              </div>
            );
          })}
        </div>
      </div>
      <Label at={lawsAt} y={1180} bg={P.navy} size={44}>
        State Panchayat laws
      </Label>
    </AbsoluteFill>
  );
};

const ReservedBeat: React.FC<{womenAt: number; commAt: number; dur: number}> = ({womenAt, commAt, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const COLS = 5;
  const seats = new Array(15).fill(0);
  const women = new Set([1, 5, 8, 12, 13]);
  const comm = new Set([3, 10]);
  return (
    <AbsoluteFill>
      <PhotoCard src={IMG.womenFarmers} at={2} x={60} y={360} w={960} h={520} dur={dur} />
      <div style={{position: 'absolute', left: 90, top: 960, width: 900, display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 26}}>
        {seats.map((_, i) => {
          const s = spring({frame: frame - (6 + i * 2), fps, config: {damping: 12}});
          const isW = women.has(i) && frame >= womenAt + (i % 3) * 3;
          const isC = comm.has(i) && frame >= commAt + (i % 2) * 3;
          const color = isW ? P.saffron : isC ? P.green : '#C9D0DC';
          return (
            <div key={i} style={{height: 150, borderRadius: 30, background: P.paper, boxShadow: isW || isC ? SHADOW.glow(color) : SHADOW.soft, display: 'grid', placeItems: 'center', scale: String(s)}}>
              {isW ? <I.Woman size={84} color={color} stroke={2} /> : <I.Seat size={80} color={color} stroke={2} />}
            </div>
          );
        })}
      </div>
      <Label at={womenAt + 4} x={90} y={1540} bg={P.saffronDeep} size={36}>
        Women
      </Label>
      <Label at={commAt + 4} x={340} y={1540} bg={P.green} size={36}>
        Eligible communities
      </Label>
    </AbsoluteFill>
  );
};
