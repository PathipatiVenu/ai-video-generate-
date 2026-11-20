import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile} from 'remotion';
import {SceneEnter} from '../DockerInstall/components/ui';
import {CtaScene} from './scenes/CtaScene';
import {FeaturesScene} from './scenes/FeaturesScene';
import {HookScene} from './scenes/HookScene';
import {IntroScene} from './scenes/IntroScene';
import {PriceScene} from './scenes/PriceScene';
import {StylesScene} from './scenes/StylesScene';
import {BGM} from './theme';
import {LINES, sceneDuration, sceneFrom, TOTAL_FRAMES} from './timeline';

/**
 * "Electric Heated Gloves – Only $5 at Walmart!" — 9:16 product ad.
 * Built on the same toolkit as the Docker video; timing follows the AI voice-over.
 */
export const HeatedGloves: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#FFF7EE'}}>
      <Sequence name="Hook – freezing hands" from={sceneFrom('hook')} durationInFrames={sceneDuration('hook')}>
        <SceneEnter type="none">
          <HookScene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Intro – heated gloves" from={sceneFrom('intro')} durationInFrames={sceneDuration('intro')}>
        <SceneEnter type="flash">
          <IntroScene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Features – USB + touchscreen" from={sceneFrom('features')} durationInFrames={sceneDuration('features')}>
        <SceneEnter type="wipe">
          <FeaturesScene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Styles – colours" from={sceneFrom('styles')} durationInFrames={sceneDuration('styles')}>
        <SceneEnter type="circle">
          <StylesScene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Price – $5 at Walmart" from={sceneFrom('price')} durationInFrames={sceneDuration('price')}>
        <SceneEnter type="zoom">
          <PriceScene />
        </SceneEnter>
      </Sequence>
      <Sequence name="CTA – check out + share" from={sceneFrom('cta')} durationInFrames={sceneDuration('cta')}>
        <SceneEnter type="slide">
          <CtaScene />
        </SceneEnter>
      </Sequence>

      {/* AI voice-over, one clip per script sentence */}
      {Object.entries(LINES).map(([id, l]) => (
        <Audio key={id} name={`VO – ${id}`} src={staticFile(l.file)} from={l.from} volume={0.85} />
      ))}

      {/* Warm BGM, ducked under the voice */}
      <Audio name="BGM" src={BGM} durationInFrames={TOTAL_FRAMES} volume={bgmVolume} />
    </AbsoluteFill>
  );
};

const SPEECH = Object.values(LINES).map((l) => [l.from, l.end] as const);
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const bgmVolume = (f: number) => {
  let dist = Infinity;
  for (const [a, b] of SPEECH) {
    if (f >= a && f <= b) {
      dist = 0;
      break;
    }
    dist = Math.min(dist, f < a ? a - f : f - b);
  }
  const duck = interpolate(dist, [0, 10], [0.12, 0.26], CL);
  const fadeOut = interpolate(f, [TOTAL_FRAMES - 40, TOTAL_FRAMES - 2], [1, 0], CL);
  return duck * fadeOut;
};
