import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile} from 'remotion';
import {SceneEnter} from '../DockerInstall/components/ui';
import {EndingScene} from './scenes/EndingScene';
import {IntroScene} from './scenes/IntroScene';
import {Part1Scene} from './scenes/Part1Scene';
import {Part2Scene} from './scenes/Part2Scene';
import {Part3Scene} from './scenes/Part3Scene';
import {Part4Scene} from './scenes/Part4Scene';
import {Part5Scene} from './scenes/Part5Scene';
import {BGM} from './theme';
import {LINES, sceneDuration, sceneFrom, TOTAL_FRAMES} from './timeline';

/**
 * "Panchayat Elections in India – Explained Simply!" — 9:16 cinematic educational explainer.
 * Built on the shared toolkit; every scene is timed from the AI voice-over (timeline.ts).
 */
export const Panchayat: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#FFFBF3'}}>
      <Sequence name="Intro – questions" from={sceneFrom('intro')} durationInFrames={sceneDuration('intro')}>
        <SceneEnter type="none">
          <IntroScene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Part 1 – What is a Gram Panchayat" from={sceneFrom('part1')} durationInFrames={sceneDuration('part1')}>
        <SceneEnter type="zoom">
          <Part1Scene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Part 2 – Who can contest" from={sceneFrom('part2')} durationInFrames={sceneDuration('part2')}>
        <SceneEnter type="wipe">
          <Part2Scene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Part 3 – If a person wins" from={sceneFrom('part3')} durationInFrames={sceneDuration('part3')}>
        <SceneEnter type="circle">
          <Part3Scene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Part 4 – Responsibilities" from={sceneFrom('part4')} durationInFrames={sceneDuration('part4')}>
        <SceneEnter type="slide">
          <Part4Scene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Part 5 – Three levels" from={sceneFrom('part5')} durationInFrames={sceneDuration('part5')}>
        <SceneEnter type="wipe">
          <Part5Scene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Ending – share & follow" from={sceneFrom('ending')} durationInFrames={sceneDuration('ending')}>
        <SceneEnter type="flash">
          <EndingScene />
        </SceneEnter>
      </Sequence>

      {/* AI voice-over, one clip per script sentence */}
      {Object.entries(LINES).map(([id, l]) => (
        <Audio key={id} name={`VO – ${id}`} src={staticFile(l.file)} from={l.from} volume={0.85} />
      ))}

      {/* Indian-flavoured cinematic BGM, ducked under the voice */}
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
  const fadeOut = interpolate(f, [TOTAL_FRAMES - 45, TOTAL_FRAMES - 2], [1, 0], CL);
  return duck * fadeOut;
};
