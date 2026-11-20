import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, Sfx} from '../../DockerInstall/components/Beat';
import {CL, Cursor, GridBackground, LightSweep} from '../../DockerInstall/components/ui';
import {HeatGlow, Label, ProductCard, SnowFall, TapRipples, UsbPlug} from '../components/fx';
import {G, IMG, SFX} from '../theme';
import {atWord, localLine, sceneDuration, TR} from '../timeline';

const S = 'features' as const;

/**
 * "They come with a USB connection for heating, and the touchscreen-friendly design
 *  lets you use your smartphone without taking them off."
 */
export const FeaturesScene: React.FC = () => {
  const total = sceneDuration(S);
  const f = localLine(S, 'features');
  const usbAt = atWord(S, 'features', 0.13); // "USB connection"
  const heatAt = atWord(S, 'features', 0.3); // "for heating"
  const touchAt = atWord(S, 'features', 0.42); // "and the touchscreen-friendly design"
  const phoneAt = atWord(S, 'features', 0.62); // "use your smartphone"
  const offAt = atWord(S, 'features', 0.84); // "without taking them off"

  return (
    <AbsoluteFill>
      <GridBackground base={G.cream} tint={G.warm} tint2={G.ice} line={G.warmGrid} perspective />

      {/* A — USB heating */}
      <Beat name="USB heating" from={0} dur={touchAt + 8} fadeIn={0} fadeOut={12} exitScale={1.1}>
        <UsbBeat usbAt={usbAt} heatAt={heatAt} />
      </Beat>

      {/* B — touchscreen friendly, keep them on */}
      <Beat name="Touchscreen friendly" from={touchAt - 4} dur={total - touchAt + 4} fadeIn={12} fadeOut={0}>
        <TouchBeat labelAt={10} phoneAt={phoneAt - touchAt + 4} offAt={offAt - touchAt + 4} />
      </Beat>

      <Sfx src={SFX.whoosh} at={TR - 2} volume={0.4} name="Whoosh – features in" />
      <Sfx src={SFX.switch} at={usbAt + 20} volume={0.6} name="Plug click – USB" />
      <Sfx src={SFX.heat} at={heatAt} volume={0.5} name="Heat whoosh – heating" />
      <Sfx src={SFX.whip} at={touchAt - 6} volume={0.45} name="Whip – touchscreen" />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} src={SFX.tick} at={phoneAt + i * 9} volume={0.45} name={`Tap ${i + 1}`} />
      ))}
      <Sfx src={SFX.pop} at={offAt} volume={0.45} name="Pop – keep them on" />
      <Sfx src={SFX.notify} at={f.end - 10} volume={0.3} name="Notify – end of features" />
    </AbsoluteFill>
  );
};

const UsbBeat: React.FC<{usbAt: number; heatAt: number}> = ({usbAt, heatAt}) => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [heatAt - 4, heatAt + 20], [0, 1], CL);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center'}}>
        <HeatGlow size={1000} intensity={glow} style={{top: 240}} />
      </AbsoluteFill>
      <ProductCard src={IMG.blackFlip} at={TR} x={210} y={300} width={660} height={700} from="bottom" />
      {/* heat spreading over the gloves once powered */}
      <div
        style={{
          position: 'absolute',
          left: 210,
          top: 300,
          width: 660,
          height: 700,
          borderRadius: 44,
          background: `radial-gradient(ellipse 60% 45% at 50% 68%, rgba(255,110,20,${0.45 * glow}) 0%, rgba(255,110,20,0) 70%)`,
          mixBlendMode: 'multiply',
        }}
      />
      <UsbPlug at={usbAt} x={280} y={1070} />
      <Label at={usbAt + 18} y={1330} bg={G.navy}>
        USB powered heating
      </Label>
    </AbsoluteFill>
  );
};

const TouchBeat: React.FC<{labelAt: number; phoneAt: number; offAt: number}> = ({labelAt, phoneAt, offAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoom = interpolate(frame, [phoneAt - 10, phoneAt + 20], [1, 1.08], CL);
  const flip = spring({frame: frame - offAt, fps, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <SnowFall count={20} melt={1} seed="touch" />
      <div style={{position: 'absolute', inset: 0, scale: String(zoom)}}>
        <ProductCard src={IMG.phone} at={0} x={130} y={300} width={820} height={820} round />
        <div style={{position: 'absolute', left: 130, top: 300, width: 820, height: 820, borderRadius: '50%', overflow: 'hidden'}}>
          <TapRipples
            taps={[
              {f: phoneAt, x: 470, y: 330},
              {f: phoneAt + 9, x: 560, y: 260},
              {f: phoneAt + 18, x: 380, y: 300},
            ]}
          />
          <LightSweep at={labelAt + 4} dur={22} opacity={0.5} />
        </div>
      </div>
      <Label at={labelAt} y={1170} bg={G.iceDeep}>
        Touchscreen friendly
      </Label>
      {/* flip-top gloves on hands: no need to take them off */}
      <div style={{position: 'absolute', right: 40, top: 1250, scale: String(flip), rotate: `${(1 - flip) * 30}deg`}}>
        <div style={{width: 330, height: 330, borderRadius: '50%', overflow: 'hidden', border: `8px solid ${G.white}`, boxShadow: '0 20px 50px -15px rgba(27,42,68,0.35)'}}>
          <Img src={IMG.flipHands} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      </div>
      <Label at={offAt + 4} x={60} y={1380} bg={G.green} size={36}>
        Keep them on ✓
      </Label>
      <Cursor
        appearAt={phoneAt - 20}
        path={[
          {f: phoneAt - 20, x: 900, y: 1500},
          {f: phoneAt - 2, x: 130 + 470 * 1.0, y: 300 + 330},
          {f: phoneAt + 9, x: 130 + 560, y: 300 + 260},
          {f: phoneAt + 18, x: 130 + 380, y: 300 + 300},
          {f: phoneAt + 40, x: 760, y: 820},
        ]}
        clicks={[phoneAt, phoneAt + 9, phoneAt + 18]}
        hideAt={phoneAt + 40}
      />
    </AbsoluteFill>
  );
};
