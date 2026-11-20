import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../DockerInstall/components/Beat';
import {Camera, CL, Cursor, GridBackground, Particles} from '../../DockerInstall/components/ui';
import {Label} from '../components/fx';
import {FONT, G, IMG, SFX, SHADOW} from '../theme';
import {atWord, localLine, sceneDuration, TR} from '../timeline';

const S = 'styles' as const;

const STYLES = [
  {src: IMG.navy, swatch: '#26315C'},
  {src: IMG.blackFlip, swatch: '#2B2B2E'},
  {src: IMG.mint, swatch: '#9FD8CF'},
  {src: IMG.blue, swatch: '#7393BE'},
  {src: IMG.grey, swatch: '#B9B9BC'},
  {src: IMG.pinkPair, swatch: '#F4B6C8'},
];
const PICK = 2; // the tile that gets "chosen"

const TILE_W = 310;
const TILE_H = 340;
const tilePos = (i: number) => ({x: 40 + (i % 3) * (TILE_W + 25), y: 470 + Math.floor(i / 3) * (TILE_H + 30)});

/** "And look at these different colors and styles! You can choose the design that matches your style." */
export const StylesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = sceneDuration(S);
  const colors = localLine(S, 'colors');
  const choose = localLine(S, 'choose');
  const popAt = (i: number) => colors.from + 4 + i * 6;
  const pickAt = atWord(S, 'choose', 0.55); // "...matches your style"
  // selection ring hops across the tiles, then lands on PICK
  const hop = Math.floor(interpolate(frame, [choose.from, pickAt], [0, 8 + PICK], CL)) % 6;
  const ringIdx = frame >= pickAt ? PICK : hop;
  const ringOn = frame >= choose.from;
  const chosen = spring({frame: frame - pickAt, fps, config: {damping: 12}});
  const ring = tilePos(ringIdx);

  return (
    <AbsoluteFill>
      <GridBackground base="#FBF7FF" tint="#F4B6C8" tint2="#9FD8CF" line="rgba(140, 110, 200, 0.12)" />
      <Particles count={18} seed="styles" color="#C9B6F2" />
      <Camera dur={total} from={1} to={1.04}>
        <Label at={TR + 2} y={250} bg={G.navy} size={44}>
          Colors &amp; styles
        </Label>
        {STYLES.map((s, i) => {
          const p = tilePos(i);
          const sp = spring({frame: frame - popAt(i), fps, config: {damping: 12, stiffness: 160}});
          const isPick = i === PICK;
          const dim = frame >= pickAt && !isPick ? 1 - 0.45 * chosen : 1;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                width: TILE_W,
                height: TILE_H,
                borderRadius: 36,
                background: G.white,
                boxShadow: SHADOW.card,
                padding: 18,
                opacity: Math.min(1, sp * 1.5) * dim,
                scale: String((0.3 + 0.7 * sp) * (isPick ? 1 + 0.12 * chosen : 1)),
                rotate: `${(1 - sp) * (i % 2 ? 14 : -14)}deg`,
                zIndex: isPick ? 2 : 1,
              }}
            >
              <Img src={s.src} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
              {isPick ? (
                <div
                  style={{
                    position: 'absolute',
                    top: -22,
                    right: -22,
                    width: 80,
                    height: 80,
                    borderRadius: 99,
                    background: G.green,
                    border: `6px solid ${G.white}`,
                    display: 'grid',
                    placeItems: 'center',
                    color: G.white,
                    fontSize: 44,
                    fontWeight: 800,
                    fontFamily: FONT.body,
                    scale: String(chosen),
                  }}
                >
                  ✓
                </div>
              ) : null}
            </div>
          );
        })}
        {ringOn ? (
          <div
            style={{
              position: 'absolute',
              left: ring.x - 12,
              top: ring.y - 12,
              width: TILE_W + 24,
              height: TILE_H + 24,
              borderRadius: 44,
              border: `8px solid ${G.warm}`,
              boxShadow: `0 0 30px ${G.warm}88`,
              scale: ringIdx === PICK && frame >= pickAt ? String(1 + 0.12 * chosen) : '1',
              zIndex: 3,
            }}
          />
        ) : null}
        {/* colour swatches */}
        <div style={{position: 'absolute', top: 1250, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 26}}>
          {STYLES.map((s, i) => {
            const sp = spring({frame: frame - (popAt(i) + 10), fps, config: {damping: 10}});
            const active = frame >= pickAt && i === PICK;
            return (
              <div
                key={i}
                style={{
                  width: 82,
                  height: 82,
                  borderRadius: 99,
                  background: s.swatch,
                  border: `6px solid ${G.white}`,
                  boxShadow: active ? `0 0 0 6px ${G.warm}, ${SHADOW.soft}` : SHADOW.soft,
                  scale: String(sp * (active ? 1.2 : 1)),
                }}
              />
            );
          })}
        </div>
        <Label at={pickAt + 4} y={1400} bg={G.warm}>
          Match your style
        </Label>
      </Camera>
      <Cursor
        appearAt={pickAt - 18}
        path={[
          {f: pickAt - 18, x: 980, y: 1500},
          {f: pickAt - 2, x: tilePos(PICK).x + TILE_W / 2, y: tilePos(PICK).y + TILE_H / 2},
          {f: pickAt + 30, x: tilePos(PICK).x + TILE_W / 2 + 60, y: tilePos(PICK).y + TILE_H / 2 + 90},
        ]}
        clicks={[pickAt]}
        hideAt={pickAt + 30}
      />

      <Sfx src={SFX.whoosh} at={TR - 4} volume={0.4} name="Whoosh – styles in" />
      {STYLES.map((_, i) => (
        <Sfx key={i} src={SFX.pop} at={popAt(i)} volume={0.4} name={`Pop – style ${i + 1}`} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Sfx key={`h${i}`} src={SFX.tick} at={choose.from + Math.round(((pickAt - choose.from) / (8 + PICK)) * i)} volume={0.22} name={`Tick – browse ${i + 1}`} />
      ))}
      <Sfx src={SFX.click} at={pickAt} volume={0.55} name="Click – choose" />
      <Sfx src={SFX.success} at={pickAt + 2} volume={0.4} name="Success – chosen" />
    </AbsoluteFill>
  );
};
