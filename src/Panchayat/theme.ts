import {staticFile} from 'remotion';

export {FONT} from '../DockerInstall/theme';

// Light tricolour-inspired palette (saffron / white / green / navy). No black theme.
export const P = {
  cream: '#FFFBF3',
  paper: '#FFFFFF',
  saffron: '#FF9933',
  saffronDeep: '#E8770B',
  saffronSoft: '#FFE9D1',
  green: '#138808',
  greenDeep: '#0E6B06',
  greenSoft: '#DDF3D8',
  navy: '#1E3A8A',
  navySoft: '#DCE5FA',
  ink: '#1F2937',
  slate: '#5B6478',
  purple: '#6D28D9',
  red: '#DC2626',
  gridSaffron: 'rgba(232, 119, 11, 0.12)',
  gridGreen: 'rgba(19, 136, 8, 0.12)',
  gridNavy: 'rgba(30, 58, 138, 0.11)',
};

export const SHADOW = {
  card: '0 30px 80px -20px rgba(31, 41, 55, 0.30), 0 8px 24px -8px rgba(31, 41, 55, 0.12)',
  soft: '0 14px 40px -12px rgba(31, 41, 55, 0.24)',
  glow: (c: string) => `0 0 0 6px ${c}2e, 0 24px 60px -12px ${c}aa`,
};

const A = (p: string) => staticFile(`panchayat/${p}`);

export const IMG = {
  village: A('images/village.jpg'),
  paddy: A('images/paddy.jpg'),
  womenFarmers: A('images/women-farmers.jpg'),
  gpOffice: A('images/gp-office.jpg'),
  gpOffice2: A('images/gp-office-2.png'),
  gramSabha: A('images/gram-sabha.jpg'),
  inkFinger: A('images/ink-finger.jpg'),
  villageRoad: A('images/village-road.jpg'),
  handPump: A('images/hand-pump.jpg'),
  streetLight: A('images/street-light.jpg'),
  samiti: A('images/samiti.jpg'),
  zilla: A('images/zilla.jpg'),
  flag: A('images/flag-india.svg'),
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
  typing: A('sfx/synth-typing.wav'),
  stamp: A('sfx/synth-stamp.wav'),
  page: A('sfx/synth-page.wav'),
};

export const BGM = A('bgm/bgm.wav');
