import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../DockerInstall/components/Beat';
import {CL, EASE_IN_OUT, GridBackground, KenBurns, LightSweep, Particles} from '../../DockerInstall/components/ui';
import {I, SectionBadge} from '../components/kit';
import {FONT, IMG, P, SFX, SHADOW} from '../theme';
import {LineId, localLine, TR} from '../timeline';

const S = 'part4' as const;

type Item = {line: LineId; label: string; icon: (p: {size?: number; color?: string; stroke?: number}) => React.ReactElement; img: string; color: string};

const ITEMS: Item[] = [
  {line: 'roads', label: 'Village roads', icon: I.Road, img: IMG.villageRoad, color: P.saffronDeep},
  {line: 'water', label: 'Drinking water', icon: I.Drop, img: IMG.handPump, color: '#0EA5E9'},
  {line: 'lights', label: 'Streetlights & sanitation', icon: I.Bulb, img: IMG.streetLight, color: '#EAB308'},
  {line: 'schemes', label: 'Welfare schemes', icon: I.Gift, img: IMG.womenFarmers, color: P.purple},
  {line: 'plan', label: 'Development projects', icon: I.Plan, img: IMG.paddy, color: P.green},
  {line: 'gramSabha', label: 'Gram Sabha & members', icon: I.Meeting, img: IMG.gramSabha, color: P.navy},
];

/**
 * "Their responsibilities include: Improving village roads. Arranging drinking water facilities.
 *  Maintaining streetlights and sanitation. Supporting government welfare schemes. Helping plan
 *  village development projects. Working with the Gram Sabha and Panchayat members."
 */
export const Part4Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = localLine(S, 'respInclude');
  const starts = ITEMS.map((it) => localLine(S, it.line).from - 4);
  const active = starts.reduce((acc, st, i) => (frame >= st ? i : acc), -1);
  const panel = spring({frame: frame - (intro.from - 4), fps, config: {damping: 14}});

  return (
    <AbsoluteFill>
      <GridBackground base={P.cream} tint={P.green} tint2={P.saffron} line={P.gridGreen} />
      <Particles count={12} seed="p4" color={P.saffron} />
      <SectionBadge n={4} title="Responsibilities" at={TR} color={P.green} />

      {/* photo stage: each responsibility gets its real photo */}
      <div style={{position: 'absolute', left: 60, top: 370, width: 960, height: 640, borderRadius: 44, overflow: 'hidden', border: `8px solid ${P.paper}`, boxShadow: SHADOW.card, opacity: panel, scale: String(0.8 + 0.2 * panel)}}>
        {active < 0 ? (
          <AbsoluteFill style={{background: `linear-gradient(150deg, ${P.greenSoft}, ${P.saffronSoft})`, display: 'grid', placeItems: 'center'}}>
            <I.List size={260} color={P.green} stroke={1.4} />
          </AbsoluteFill>
        ) : null}
        {ITEMS.map((it, i) => {
          if (i > active || i < active - 1) return null;
          const st = starts[i];
          const p = interpolate(frame, [st, st + 12], [0, 1], {...CL, easing: EASE_IN_OUT});
          return (
            <AbsoluteFill key={it.line} style={{clipPath: i === active ? `inset(0 ${(1 - p) * 100}% 0 0 round 0)` : undefined}}>
              <KenBurns src={it.img} dur={90} zoom={[1.22, 1.08]} />
              <div style={{position: 'absolute', left: 30, top: 30, width: 120, height: 120, borderRadius: 34, background: P.paper, display: 'grid', placeItems: 'center', boxShadow: SHADOW.soft}}>
                <it.icon size={78} color={it.color} stroke={2.1} />
              </div>
              <LightSweep at={st + 8} dur={20} opacity={0.4} />
            </AbsoluteFill>
          );
        })}
      </div>

      {/* checklist */}
      <div style={{position: 'absolute', left: 60, top: 1050, width: 960, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
        {ITEMS.map((it, i) => {
          const s = spring({frame: frame - starts[i], fps, config: {damping: 12, stiffness: 160}});
          const on = frame >= starts[i];
          const isActive = i === active;
          return (
            <div
              key={it.line}
              style={{
                height: 130,
                borderRadius: 30,
                background: P.paper,
                boxShadow: isActive ? SHADOW.glow(it.color) : SHADOW.soft,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '0 20px',
                opacity: on ? 1 : 0.35,
                scale: String(on ? 0.9 + 0.1 * s : 0.9),
              }}
            >
              <div style={{width: 74, height: 74, flexShrink: 0, borderRadius: 22, background: on ? `${it.color}22` : '#EEF1F6', display: 'grid', placeItems: 'center', position: 'relative'}}>
                <it.icon size={46} color={on ? it.color : '#A8B0C0'} stroke={2.1} />
                {on ? (
                  <div style={{position: 'absolute', right: -10, bottom: -10, width: 38, height: 38, borderRadius: 99, background: P.green, border: `4px solid ${P.paper}`, display: 'grid', placeItems: 'center', scale: String(s)}}>
                    <I.Check size={24} color={P.paper} stroke={3.4} />
                  </div>
                ) : null}
              </div>
              <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: on ? P.ink : '#9AA3B2', lineHeight: 1.1}}>{it.label}</div>
            </div>
          );
        })}
      </div>

      <Sfx src={SFX.whoosh} at={TR} volume={0.4} name="Whoosh – section 4" />
      <Sfx src={SFX.page} at={intro.from} volume={0.45} name="Page – list" />
      {ITEMS.map((it, i) => (
        <React.Fragment key={it.line}>
          <Sfx src={SFX.whooshShort} at={starts[i]} volume={0.35} name={`Swipe – ${it.label}`} />
          <Sfx src={SFX.tick} at={starts[i] + 6} volume={0.45} name={`Tick – ${it.label}`} />
        </React.Fragment>
      ))}
      <Sfx src={SFX.success} at={starts[ITEMS.length - 1] + 30} volume={0.35} name="Success – all done" />
    </AbsoluteFill>
  );
};
