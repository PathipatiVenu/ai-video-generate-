import {Clapperboard, Cpu, GraduationCap, Newspaper, ShoppingBag, Sparkles, Zap} from 'lucide-react';

export const RATIOS = [
  {k: '9:16', name: 'Vertical', use: 'Reels · Shorts · TikTok', w: 18, h: 32},
  {k: '4:5', name: 'Portrait', use: 'Instagram feed', w: 24, h: 30},
  {k: '1:1', name: 'Square', use: 'Feed · Facebook', w: 28, h: 28},
  {k: '16:9', name: 'Landscape', use: 'YouTube', w: 36, h: 20},
];

// Editing styles — each one changes colours, motion, transitions, SFX and music energy.
export const STYLES = [
  {k: 'cinematic-edu', name: 'Cinematic educational', d: 'Real photos, diagrams, smooth camera, calm transitions.', Icon: GraduationCap, bg: '#FFF7EC', g: 'rgba(232,119,11,.16)', fg: '#14171f', a: 'Learn', b: 'clearly'},
  {k: 'tech', name: 'Tech explainer', d: 'UI mockups, terminals, crisp clicks and whooshes.', Icon: Cpu, bg: '#EEF4FF', g: 'rgba(29,99,237,.16)', fg: '#0B3FAE', a: 'Build', b: 'faster'},
  {k: 'product', name: 'Product ad', d: 'Hero shots, price slams, warm glow and a strong CTA.', Icon: ShoppingBag, bg: '#FFF1E6', g: 'rgba(255,122,26,.18)', fg: '#B3470A', a: 'Only', b: '$5'},
  {k: 'energetic', name: 'Energetic', d: 'Fast cuts, zoom punches and impact hits. Made for hooks.', Icon: Zap, bg: '#FFF0F0', g: 'rgba(229,50,45,.16)', fg: '#B31F1B', a: 'Never', b: 'stop'},
  {k: 'documentary', name: 'Documentary', d: 'Ken Burns photos, slow pushes, soft fades.', Icon: Clapperboard, bg: '#F3F1EA', g: 'rgba(80,70,40,.14)', fg: '#3E3826', a: 'True', b: 'story'},
  {k: 'news', name: 'News & facts', d: 'Lower thirds, data cards and tidy wipes.', Icon: Newspaper, bg: '#EEF1F5', g: 'rgba(30,58,138,.14)', fg: '#1E3A8A', a: 'Top', b: 'facts'},
  {k: 'aesthetic', name: 'Clean aesthetic', d: 'Soft pastel colour, sparkles and gentle reveals.', Icon: Sparkles, bg: '#F7F0FF', g: 'rgba(140,110,200,.16)', fg: '#5B3B99', a: 'Soft', b: 'glow'},
];

// Background themes — all light (no black theme).
export const BACKGROUNDS = [
  {k: 'grid-light', name: 'Light grid', css: 'linear-gradient(#ece3d6 1px, transparent 1px) 0 0/14px 14px, linear-gradient(90deg, #ece3d6 1px, #fbf8f3 1px) 0 0/14px 14px'},
  {k: 'warm', name: 'Warm cream', css: 'radial-gradient(circle at 30% 30%, #ffd8b0, #fff6ea 70%)'},
  {k: 'tricolor', name: 'Tricolour', css: 'linear-gradient(180deg, #ffe2c4 0%, #ffffff 50%, #d8f0d2 100%)'},
  {k: 'soft-blue', name: 'Soft blue', css: 'radial-gradient(circle at 70% 30%, #c9dcff, #f2f6ff 70%)'},
  {k: 'pastel', name: 'Pastel', css: 'linear-gradient(135deg, #fde2f0, #e6e0ff 50%, #d9f4f0)'},
  {k: 'auto', name: 'Match topic', css: 'conic-gradient(from 45deg, #ffd8b0, #c9dcff, #d8f0d2, #fde2f0, #ffd8b0)'},
];

export const MUSIC = [
  ['original', 'Original'],
  ['upload', 'Upload'],
  ['none', 'None'],
];

export const COPY_ASPECTS = [
  {k: 'pacing', label: 'Pacing & cut rhythm'},
  {k: 'transitions', label: 'Transitions'},
  {k: 'motion', label: 'Camera moves'},
  {k: 'color', label: 'Colour grade'},
  {k: 'text', label: 'Text style'},
  {k: 'sfx', label: 'Sound effects'},
  {k: 'music', label: 'Music energy'},
];

export const QUALITY = [
  ['draft', 'Draft 540p'],
  ['hd', 'HD 1080p'],
];
