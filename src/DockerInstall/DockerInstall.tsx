import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile} from 'remotion';
import {SceneEnter} from './components/ui';
import {EndingScene} from './scenes/EndingScene';
import {HookScene} from './scenes/HookScene';
import {Step1Scene} from './scenes/Step1Scene';
import {Step2Scene} from './scenes/Step2Scene';
import {Step3Scene} from './scenes/Step3Scene';
import {Step4Scene} from './scenes/Step4Scene';
import {BGM} from './theme';
import {LINES, sceneDuration, sceneFrom, TOTAL_FRAMES} from './timeline';

/**
 * "Docker Installation on Windows 11" — 9:16 cinematic educational short.
 * Every scene and SFX is timed from the real AI voice-over (see timeline.ts).
 */
export const DockerInstall: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#F5F8FF'}}>
      {/* ---------------- VISUAL TRACK (each scene enters with a different transition) */}
      <Sequence name="Hook" from={sceneFrom('hook')} durationInFrames={sceneDuration('hook')}>
        <SceneEnter type="none">
          <HookScene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Step 1 – Download" from={sceneFrom('step1')} durationInFrames={sceneDuration('step1')}>
        <SceneEnter type="zoom">
          <Step1Scene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Step 2 – Install + WSL 2" from={sceneFrom('step2')} durationInFrames={sceneDuration('step2')}>
        <SceneEnter type="wipe">
          <Step2Scene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Step 3 – Restart + Engine" from={sceneFrom('step3')} durationInFrames={sceneDuration('step3')}>
        <SceneEnter type="circle">
          <Step3Scene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Step 4 – Verify" from={sceneFrom('step4')} durationInFrames={sceneDuration('step4')}>
        <SceneEnter type="slide">
          <Step4Scene />
        </SceneEnter>
      </Sequence>
      <Sequence name="Ending – CTA" from={sceneFrom('ending')} durationInFrames={sceneDuration('ending')}>
        <SceneEnter type="flash">
          <EndingScene />
        </SceneEnter>
      </Sequence>

      {/* ---------------- VOICE-OVER (AI, one clip per script line) */}
      {Object.entries(LINES).map(([id, l]) => (
        <Audio key={id} name={`VO – ${id}`} src={staticFile(l.file)} from={l.from} volume={0.85} />
      ))}

      {/* ---------------- BGM, ducked under the voice */}
      <Audio name="BGM" src={BGM} durationInFrames={TOTAL_FRAMES} volume={bgmVolume} />
    </AbsoluteFill>
  );
};

const SPEECH = Object.values(LINES).map((l) => [l.from, l.end] as const);

/** BGM sits low under speech, swells in pauses, fades in/out. */
const bgmVolume = (f: number) => {
  let dist = Infinity;
  for (const [a, b] of SPEECH) {
    if (f >= a && f <= b) {
      dist = 0;
      break;
    }
    dist = Math.min(dist, f < a ? a - f : f - b);
  }
  const duck = interpolate(dist, [0, 10], [0.11, 0.24], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeIn = interpolate(f, [0, 8], [0.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeOut = interpolate(f, [TOTAL_FRAMES - 40, TOTAL_FRAMES - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return duck * fadeIn * fadeOut;
};
