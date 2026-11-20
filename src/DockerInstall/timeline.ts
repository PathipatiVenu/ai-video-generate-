import {VOICE_LINES} from './voice';

/**
 * The whole edit is driven by the real voice-over clip lengths (voice.ts).
 * Change the voice → re-run make_voice.py → every scene re-times itself.
 */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Frames used by scene-to-scene transitions (old + new scene overlap). */
export const TR = 14;

const LEAD_IN = 10; // visual hook starts before the first word
const GAP = 7; // pause between lines inside a section
const SECTION_GAP = 20; // breathing room between steps
const TAIL = 54; // hold the final visual after the last word

export const SECTIONS = [
  {id: 'hook', lines: ['hey', 'containers', 'letsInstall']},
  {id: 'step1', lines: ['browser', 'download']},
  {id: 'step2', lines: ['installer', 'wsl']},
  {id: 'step3', lines: ['restart', 'engine']},
  {id: 'step4', lines: ['version', 'helloWorld', 'congrats', 'installed']},
  {id: 'ending', lines: ['thatsIt', 'follow']},
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
export type LineId = (typeof SECTIONS)[number]['lines'][number];

export type LineTiming = {from: number; dur: number; end: number; file: string};

const byId = new Map(VOICE_LINES.map((l) => [l.id, l]));

const lines = {} as Record<LineId, LineTiming>;
const sections = {} as Record<SectionId, {start: number; end: number; index: number}>;

let cursor = LEAD_IN;
SECTIONS.forEach((section, si) => {
  if (si > 0) cursor += SECTION_GAP;
  const sectionStart = si === 0 ? 0 : cursor - 12; // transition lands just before the voice
  section.lines.forEach((id, li) => {
    const v = byId.get(id);
    if (!v) throw new Error(`Missing voice line "${id}" — run tools/docker-install/make_voice.py`);
    if (li > 0) cursor += GAP;
    const dur = Math.ceil(v.seconds * FPS);
    lines[id] = {from: cursor, dur, end: cursor + dur, file: v.file};
    cursor += dur;
  });
  sections[section.id] = {start: sectionStart, end: 0, index: si};
});

export const TOTAL_FRAMES = cursor + TAIL;

SECTIONS.forEach((section, si) => {
  const next = SECTIONS[si + 1];
  sections[section.id].end = next ? sections[next.id].start : TOTAL_FRAMES;
});

export const LINES = lines;
export const SECTION_RANGES = sections;

/** Where a scene's <Sequence> starts (overlaps the previous scene by TR frames). */
export const sceneFrom = (id: SectionId) => {
  const s = sections[id];
  return s.index === 0 ? 0 : s.start - TR;
};

export const sceneDuration = (id: SectionId) => sections[id].end - sceneFrom(id);

/** A line's start/end relative to its scene's local frame 0. */
export const localLine = (scene: SectionId, id: LineId) => {
  const off = sceneFrom(scene);
  const l = lines[id];
  return {from: l.from - off, end: l.end - off, dur: l.dur};
};
