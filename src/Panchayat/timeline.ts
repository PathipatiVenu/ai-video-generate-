import {VOICE_LINES} from './voice';

/** Whole ad is timed from the real AI voice-over clips (voice.ts). */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TR = 14; // scene transition overlap (matches the shared SceneEnter)

const LEAD_IN = 8;
const GAP = 7;
const SECTION_GAP = 16;
const TAIL = 60;

export const SECTIONS = [
  {id: 'intro', lines: ['doYouKnow', 'questions', 'letsUnderstand']},
  {id: 'part1', lines: ['gpIs', 'gpCover', 'noFixed', 'depends']},
  {id: 'part2', lines: ['age21', 'stateLaws', 'reserved']},
  {id: 'part3', lines: ['winsHead', 'duties']},
  {id: 'part4', lines: ['respInclude', 'roads', 'water', 'lights', 'schemes', 'plan', 'gramSabha']},
  {id: 'part5', lines: ['threeLevels', 'first', 'second', 'third']},
  {id: 'ending', lines: ['remember', 'share']},
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
export type LineId = (typeof SECTIONS)[number]['lines'][number];

const byId = new Map(VOICE_LINES.map((l) => [l.id, l]));
const lines = {} as Record<LineId, {from: number; dur: number; end: number; file: string}>;
const sections = {} as Record<SectionId, {start: number; end: number; index: number}>;

let cursor = LEAD_IN;
SECTIONS.forEach((section, si) => {
  if (si > 0) cursor += SECTION_GAP;
  const start = si === 0 ? 0 : cursor - 10;
  section.lines.forEach((id, li) => {
    const v = byId.get(id);
    if (!v) throw new Error(`Missing voice line "${id}" — run tools/panchayat/make_voice.py`);
    if (li > 0) cursor += GAP;
    const dur = Math.ceil(v.seconds * FPS);
    lines[id] = {from: cursor, dur, end: cursor + dur, file: v.file};
    cursor += dur;
  });
  sections[section.id] = {start, end: 0, index: si};
});

export const TOTAL_FRAMES = cursor + TAIL;
SECTIONS.forEach((section, si) => {
  const next = SECTIONS[si + 1];
  sections[section.id].end = next ? sections[next.id].start : TOTAL_FRAMES;
});

export const LINES = lines;

export const sceneFrom = (id: SectionId) => (sections[id].index === 0 ? 0 : sections[id].start - TR);
export const sceneDuration = (id: SectionId) => sections[id].end - sceneFrom(id);

/** A voice line's timing relative to its scene's local frame 0. */
export const localLine = (scene: SectionId, id: LineId) => {
  const off = sceneFrom(scene);
  const l = lines[id];
  return {from: l.from - off, end: l.end - off, dur: l.dur};
};

/** Frame (scene-local) at a fraction of a line — used to hit specific words. */
export const atWord = (scene: SectionId, id: LineId, fraction: number) => {
  const l = localLine(scene, id);
  return l.from + Math.round(l.dur * fraction);
};
