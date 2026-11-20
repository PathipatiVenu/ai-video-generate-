import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, Sfx} from '../../DockerInstall/components/Beat';
import {CL, Cursor, EASE_IN_OUT, GridBackground, KenBurns, LightSweep} from '../../DockerInstall/components/ui';
import {HeatGlow, Label, ProductCard, SnowFall} from '../components/fx';
import {FONT, G, IMG, SFX, SHADOW} from '../theme';
import {atWord, localLine, sceneDuration, TR} from '../timeline';
import {Snowflake} from './HookScene';

const S = 'cta' as const;

/**
 * "That's a budget-friendly winter find! Check them out at Walmart, and don't forget
 *  to share this with someone who always has cold hands!"
 */
export const CtaScene: React.FC = () => {
  const total = sceneDuration(S);
  const check = localLine(S, 'checkout');
  const shareAt = atWord(S, 'checkout', 0.4); // "...don't forget to share this"
  const coldAt = atWord(S, 'checkout', 0.8); // "...always has cold hands"

  return (
    <AbsoluteFill>
      <GridBackground base={G.cream} tint={G.warm} tint2={G.walmartBlue} line={G.warmGrid} />

      {/* A — budget-friendly winter find */}
      <Beat name="Budget-friendly winter find" from={0} dur={check.from + 8} fadeIn={0} fadeOut={12} exitScale={0.92}>
        <SnowFall count={30} seed="cta1" />
        <AbsoluteFill style={{alignItems: 'center'}}>
          <HeatGlow size={1000} style={{top: 260}} />
        </AbsoluteFill>
        <ProductCard src={IMG.heatedPair} at={TR} x={170} y={330} width={740} height={760} />
        <Label at={atWord(S, 'budget', 0.2)} y={1170} bg={G.green} size={46}>
          Budget-friendly
        </Label>
        <Label at={atWord(S, 'budget', 0.65)} y={1290} bg={G.iceDeep} size={46}>
          Winter find
        </Label>
      </Beat>

      {/* B — check them out at Walmart + share with a cold-handed friend */}
      <Beat name="Walmart + share" from={check.from} dur={total - check.from} fadeIn={10} fadeOut={0}>
        <ShareBeat shareAt={shareAt - check.from} coldAt={coldAt - check.from} dur={total - check.from} />
      </Beat>

      <Sfx src={SFX.whip} at={TR - 6} volume={0.4} name="Whip – CTA in" />
      <Sfx src={SFX.pop} at={atWord(S, 'budget', 0.2)} volume={0.45} name="Pop – budget" />
      <Sfx src={SFX.pop} at={atWord(S, 'budget', 0.65)} volume={0.45} name="Pop – winter find" />
      <Sfx src={SFX.whoosh} at={check.from - 6} volume={0.45} name="Whoosh – Walmart" />
      <Sfx src={SFX.ding} at={check.from + 22} volume={0.35} name="Ding – cart" />
      <Sfx src={SFX.click} at={shareAt} volume={0.55} name="Click – share" />
      <Sfx src={SFX.send} at={shareAt + 4} volume={0.6} name="Send – share" />
      <Sfx src={SFX.freeze} at={coldAt - 10} volume={0.35} name="Freeze – cold hands" />
      <Sfx src={SFX.heat} at={coldAt + 6} volume={0.5} name="Heat – warmed up" />
      <Sfx src={SFX.success} at={check.end + 6} volume={0.45} name="Success – end card" />
    </AbsoluteFill>
  );
};

const ShareBeat: React.FC<{shareAt: number; coldAt: number; dur: number}> = ({shareAt, coldAt, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shop = spring({frame: frame - 2, fps, config: {damping: 14}});
  const drop = spring({frame: frame - 12, fps, config: {damping: 11}});
  const share = spring({frame: frame - (shareAt - 18), fps, config: {damping: 14}});
  const fly = interpolate(frame, [shareAt + 2, shareAt + 22], [0, 1], {...CL, easing: EASE_IN_OUT});
  const friend = spring({frame: frame - (shareAt + 14), fps, config: {damping: 12}});
  const warm = interpolate(frame, [coldAt + 4, coldAt + 24], [0, 1], CL);
  const pressed = frame >= shareAt && frame < shareAt + 6;
  return (
    <AbsoluteFill>
      {/* Walmart store card with the gloves dropping into a cart */}
      <div style={{position: 'absolute', left: 50, top: 240, width: 980, height: 560, borderRadius: 48, overflow: 'hidden', boxShadow: SHADOW.card, opacity: shop, scale: String(0.85 + 0.15 * shop)}}>
        <KenBurns src={IMG.walmart} dur={dur} zoom={[1.1, 1.25]} overlay="linear-gradient(180deg, rgba(255,255,255,0) 50%, rgba(255,247,238,0.85) 100%)" />
      </div>
      <div style={{position: 'absolute', left: 340, top: 560, display: 'flex', alignItems: 'flex-end', gap: 0}}>
        <div style={{position: 'relative', width: 400, height: 300}}>
          <div style={{position: 'absolute', left: 80, top: -200 + drop * 160, width: 240, height: 240, borderRadius: 40, background: G.white, boxShadow: SHADOW.card, padding: 14, rotate: `${(1 - drop) * 25}deg`, opacity: Math.min(1, drop * 2)}}>
            <Img src={IMG.heatedPair} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
          </div>
          <Cart />
        </div>
      </div>

      {/* share card */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 960,
          width: 940,
          padding: '34px 40px',
          borderRadius: 44,
          background: G.white,
          boxShadow: SHADOW.card,
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          opacity: share,
          translate: `0px ${(1 - share) * 300}px`,
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 99,
            background: `linear-gradient(135deg, ${G.warm}, ${G.gold})`,
            display: 'grid',
            placeItems: 'center',
            scale: pressed ? '0.9' : '1',
            boxShadow: SHADOW.warmGlow,
            flexShrink: 0,
          }}
        >
          <PaperPlane size={80} />
        </div>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 52, color: G.navy, flex: 1}}>Share with a friend</div>
        {/* flying plane */}
        {fly > 0 && fly < 1 ? (
          <div style={{position: 'absolute', left: 120 + fly * 640, top: 40 + Math.sin(fly * Math.PI) * -140 + fly * 300, rotate: `${20 + fly * 30}deg`}}>
            <PaperPlane size={70} color={G.warm} />
          </div>
        ) : null}
      </div>

      {/* friend with cold hands → warmed up */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1260,
          display: 'flex',
          justifyContent: 'center',
          opacity: friend,
          scale: String(0.5 + 0.5 * friend),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 26,
            padding: '24px 40px 24px 24px',
            borderRadius: 999,
            background: warm > 0.5 ? G.warmSoft : '#E3F2FF',
            border: `5px solid ${warm > 0.5 ? G.warm : G.ice}`,
            boxShadow: SHADOW.soft,
          }}
        >
          <div style={{width: 120, height: 120, borderRadius: 99, background: warm > 0.5 ? G.warm : G.iceDeep, display: 'grid', placeItems: 'center'}}>
            {warm > 0.5 ? <Img src={IMG.heatHand} style={{width: 120, height: 120, borderRadius: 99, objectFit: 'cover'}} /> : <Snowflake size={80} color={G.white} rotate={frame * 2} />}
          </div>
          <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 40, color: G.navy}}>{warm > 0.5 ? 'Warm hands!' : 'Friend with cold hands'}</div>
        </div>
      </div>

      <Cursor
        appearAt={shareAt - 20}
        path={[
          {f: shareAt - 20, x: 980, y: 1550},
          {f: shareAt - 2, x: 70 + 40 + 75, y: 960 + 34 + 75},
          {f: shareAt + 30, x: 330, y: 1150},
        ]}
        clicks={[shareAt]}
        hideAt={shareAt + 28}
      />
      <EndLockup at={dur - 56} />
    </AbsoluteFill>
  );
};

const EndLockup: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 14}});
  if (frame < at) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: `rgba(255,247,238,${0.94 * s})`}}>
      <div style={{width: 820, padding: '50px 50px 44px', borderRadius: 56, background: G.white, boxShadow: SHADOW.card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, scale: String(0.7 + 0.3 * s), opacity: s, overflow: 'hidden', position: 'relative'}}>
        <HeatGlow size={700} intensity={0.6} style={{top: -120}} />
        <Img src={IMG.heatedPair} style={{width: 460, height: 470, objectFit: 'contain', position: 'relative'}} />
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 58, color: G.navy, position: 'relative'}}>Electric Heated Gloves</div>
        <div style={{display: 'flex', gap: 18, position: 'relative'}}>
          <div style={{padding: '14px 32px', borderRadius: 999, background: G.walmartYellow, fontFamily: FONT.display, fontWeight: 700, fontSize: 48, color: G.navy}}>$5</div>
          <div style={{padding: '14px 32px', borderRadius: 999, background: G.walmartBlue, fontFamily: FONT.body, fontWeight: 800, fontSize: 40, color: G.white, display: 'flex', alignItems: 'center'}}>at Walmart</div>
        </div>
        <LightSweep at={at + 16} dur={24} />
      </div>
    </AbsoluteFill>
  );
};

const PaperPlane: React.FC<{size: number; color?: string}> = ({size, color = G.white}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
  </svg>
);

const Cart: React.FC = () => (
  <svg width={400} height={300} viewBox="0 0 40 30" style={{position: 'absolute', left: 0, top: 0}}>
    <path d="M2 4h5l4 16h20l4-12H9" fill="rgba(255,255,255,0.92)" stroke={G.walmartBlue} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    <circle cx="14" cy="25" r="2.5" fill={G.walmartBlue} />
    <circle cx="28" cy="25" r="2.5" fill={G.walmartBlue} />
  </svg>
);
