import {staticFile} from 'remotion';

export {FONT} from '../DockerInstall/theme';

// Winter → warmth palette. Light backgrounds only (no black theme).
export const G = {
  snow: '#F4F9FF',
  ice: '#BFE3FF',
  iceDeep: '#3D8FD6',
  iceGrid: 'rgba(61, 143, 214, 0.14)',
  cream: '#FFF7EE',
  warmGrid: 'rgba(255, 122, 26, 0.13)',
  warm: '#FF7A1A',
  warmSoft: '#FFE3C8',
  ember: '#FF4D00',
  gold: '#FFB020',
  navy: '#1B2A44',
  slate: '#5B6478',
  white: '#FFFFFF',
  green: '#16A34A',
  walmartBlue: '#0071CE',
  walmartYellow: '#FFC220',
};

export const SHADOW = {
  card: '0 30px 80px -20px rgba(27, 42, 68, 0.28), 0 8px 24px -8px rgba(27, 42, 68, 0.12)',
  soft: '0 14px 40px -12px rgba(27, 42, 68, 0.22)',
  warmGlow: '0 0 0 6px rgba(255, 122, 26, 0.18), 0 24px 70px -10px rgba(255, 122, 26, 0.6)',
};

const A = (p: string) => staticFile(`heated-gloves/${p}`);

export const IMG = {
  heatedPair: A('images/p-heated-pair.png'),
  heatHand: A('images/p-heat-hand.png'),
  phone: A('images/p-phone.png'),
  flipHands: A('images/p-flip-hands.png'),
  pinkPair: A('images/p-pink-pair.png'),
  navy: A('images/p-navy.png'),
  blackFlip: A('images/p-black-flip.png'),
  mint: A('images/p-mint.png'),
  blue: A('images/p-blue.png'),
  grey: A('images/p-grey.png'),
  frost: A('images/frost-window.jpg'),
  ice: A('images/ice-crystals.jpg'),
  snowyCity: A('images/snowy-city.jpg'),
  snowTrees: A('images/snow-trees.jpg'),
  walmart: A('images/walmart-store.jpg'),
};

export const SFX = {
  whoosh: A('sfx/synth-whoosh.wav'),
  whooshShort: A('sfx/whoosh.wav'),
  whip: A('sfx/whip.wav'),
  click: A('sfx/mouse-click.wav'),
  ding: A('sfx/ding.wav'),
  switch: A('sfx/switch.wav'),
  riser: A('sfx/synth-riser.wav'),
  impact: A('sfx/synth-impact.wav'),
  pop: A('sfx/synth-pop.wav'),
  tick: A('sfx/synth-tick.wav'),
  notify: A('sfx/synth-notify.wav'),
  success: A('sfx/synth-success.wav'),
  shimmer: A('sfx/synth-shimmer.wav'),
  wind: A('sfx/synth-wind.wav'),
  freeze: A('sfx/synth-freeze.wav'),
  heat: A('sfx/synth-heat.wav'),
  cash: A('sfx/synth-cash.wav'),
  send: A('sfx/synth-send.wav'),
};

export const BGM = A('bgm/bgm.wav');
