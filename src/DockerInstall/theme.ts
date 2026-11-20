import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as loadDisplay} from '@remotion/google-fonts/SpaceGrotesk';
import {staticFile} from 'remotion';

const inter = loadInter('normal', {weights: ['400', '500', '600', '700', '800'], subsets: ['latin']});
const mono = loadMono('normal', {weights: ['400', '500', '700'], subsets: ['latin']});
const display = loadDisplay('normal', {weights: ['500', '600', '700'], subsets: ['latin']});

export const FONT = {
  body: inter.fontFamily,
  mono: mono.fontFamily,
  display: display.fontFamily,
};

// Light, cinematic-educational palette built around Docker blue. No black theme.
export const C = {
  bg: '#F5F8FF',
  bgWarm: '#FFF8EE',
  grid: 'rgba(29, 99, 237, 0.10)',
  gridStrong: 'rgba(29, 99, 237, 0.22)',
  blue: '#1D63ED',
  blueDeep: '#0B3FAE',
  blueSoft: '#DCE8FF',
  cyan: '#22C1EE',
  navy: '#0B1F44',
  slate: '#51607A',
  white: '#FFFFFF',
  green: '#16A34A',
  greenSoft: '#DCFCE7',
  amber: '#F59E0B',
  coral: '#FF6B5B',
  terminal: '#10213F',
  terminalText: '#D6E4FF',
};

export const SHADOW = {
  card: '0 30px 80px -20px rgba(11, 31, 68, 0.28), 0 8px 24px -8px rgba(11, 31, 68, 0.12)',
  soft: '0 14px 40px -12px rgba(11, 31, 68, 0.22)',
  glow: '0 0 0 6px rgba(29, 99, 237, 0.18), 0 20px 60px -10px rgba(29, 99, 237, 0.55)',
};

export const A = (p: string) => staticFile(`docker-install/${p}`);

export const IMG = {
  dockerLogo: A('images/docker-logo-blue.svg'),
  dockerLogoWhite: A('images/docker-logo-white.svg'),
  dockerIcon: A('images/docker-icon-blue.svg'),
  windows: A('images/windows11-logo.svg'),
  containers: A('images/containers.jpg'),
  laptopTyping: A('images/laptop-typing.jpg'),
  handLaptop: A('images/hand-laptop.jpg'),
  datacenter: A('images/datacenter.jpg'),
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
  typing: A('sfx/synth-typing.wav'),
  enter: A('sfx/synth-enter.wav'),
  notify: A('sfx/synth-notify.wav'),
  success: A('sfx/synth-success.wav'),
  shimmer: A('sfx/synth-shimmer.wav'),
};

export const BGM = A('bgm/bgm.wav');
