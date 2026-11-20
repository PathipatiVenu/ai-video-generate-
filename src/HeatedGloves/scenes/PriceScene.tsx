import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../DockerInstall/components/Beat';
import {CL, Confetti, EASE_IN_OUT, GridBackground, KenBurns, LightSweep, Particles} from '../../DockerInstall/components/ui';
import {Label} from '../components/fx';
import {FONT, G, IMG, SFX, SHADOW} from '../theme';
import {atWord, localLine, sceneDuration, TR} from '../timeline';

const S = 'price' as const;

/** "And guess what? They're just five dollars at Walmart!" */
export const PriceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = sceneDuration(S);
  const guess = localLine(S, 'guess');
  const price = localLine(S, 'price');
  const slamAt = atWord(S, 'price', 0.42); // "five dollars"
  const storeAt = atWord(S, 'price', 0.78); // "at Walmart"

  const tagIn = spring({frame: frame - (guess.from - 2), fps, config: {damping: 12}});
  const slam = spring({frame: frame - slamAt, fps, config: {damping: 9, stiffness: 220}});
  const store = interpolate(frame, [price.from - 4, price.from + 16], [0, 1], {...CL, easing: EASE_IN_OUT});
  const wobble = frame < slamAt ? Math.sin(frame / 2.2) * 6 : 0;
  const shake = frame >= slamAt && frame < slamAt + 10 ? Math.sin((frame - slamAt) * 3) * (10 - (frame - slamAt)) : 0;

  return (
    <AbsoluteFill style={{translate: `${shake}px ${shake * 0.6}px`}}>
      <GridBackground base="#FFFBEF" tint={G.walmartYellow} tint2={G.walmartBlue} line="rgba(0, 113, 206, 0.12)" />
      <Particles count={18} seed="price" color={G.walmartYellow} />

      {/* real Walmart store photo */}
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 250,
          width: 980,
          height: 640,
          borderRadius: 48,
          overflow: 'hidden',
          boxShadow: SHADOW.card,
          opacity: store,
          translate: `0px ${(1 - store) * -120}px`,
        }}
      >
        <KenBurns src={IMG.walmart} dur={total - price.from + 10} zoom={[1.05, 1.18]} pan={['0px 0px', '-30px 10px']} />
        <LightSweep at={storeAt} dur={22} />
      </div>

      {/* price tag: "?" during "guess what", then $5 slam */}
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div
          style={{
            position: 'absolute',
            top: frame < price.from ? 620 : 940,
            width: 640,
            height: 380,
            borderRadius: '40px 40px 40px 40px',
            background: frame >= slamAt ? G.walmartYellow : G.white,
            boxShadow: frame >= slamAt ? `0 30px 80px -20px ${G.walmartYellow}, ${SHADOW.card}` : SHADOW.card,
            display: 'grid',
            placeItems: 'center',
            scale: String(tagIn * (frame >= slamAt ? 0.9 + 0.1 * slam + (1 - slam) * 0.6 : 1)),
            rotate: `${wobble - 4}deg`,
          }}
        >
          <div style={{position: 'absolute', left: 34, top: '50%', width: 44, height: 44, marginTop: -22, borderRadius: 99, background: G.cream, border: `6px solid ${G.navy}22`}} />
          {frame < slamAt ? (
            <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 230, color: G.walmartBlue, lineHeight: 1}}>?</div>
          ) : (
            <div style={{textAlign: 'center', fontFamily: FONT.display, color: G.navy, lineHeight: 1}}>
              <div style={{fontSize: 52, fontWeight: 700, letterSpacing: 6}}>JUST</div>
              <div style={{fontSize: 230, fontWeight: 700}}>$5</div>
            </div>
          )}
        </div>
      </AbsoluteFill>
      <Confetti at={slamAt + 2} x={540} y={1100} count={80} />

      <Label at={storeAt} y={1370} bg={G.walmartBlue} size={48}>
        <Spark /> at Walmart
      </Label>

      <Sfx src={SFX.riser} at={guess.from - 24} volume={0.4} name="Riser – guess what" />
      <Sfx src={SFX.pop} at={guess.from} volume={0.4} name="Pop – mystery tag" />
      <Sfx src={SFX.whoosh} at={price.from - 6} volume={0.45} name="Whoosh – store" />
      <Sfx src={SFX.impact} at={slamAt} volume={0.45} name="Impact – $5 slam" />
      <Sfx src={SFX.cash} at={slamAt + 1} volume={0.6} name="Cash register – $5" />
      <Sfx src={SFX.ding} at={storeAt} volume={0.35} name="Ding – at Walmart" />
      <Sfx src={SFX.whoosh} at={TR - 6} volume={0.3} name="Whoosh – scene in" />
    </AbsoluteFill>
  );
};

/** Simple 6-ray spark (generic, not the trademark artwork). */
const Spark: React.FC = () => (
  <svg width={44} height={44} viewBox="0 0 24 24">
    {[0, 60, 120, 180, 240, 300].map((a) => (
      <rect key={a} x="10.6" y="1.5" width="2.8" height="7" rx="1.4" fill={G.walmartYellow} transform={`rotate(${a} 12 12)`} />
    ))}
  </svg>
);
