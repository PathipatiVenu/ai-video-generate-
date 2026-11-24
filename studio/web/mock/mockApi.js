// Mock backend for the studio UI (runs inside the Vite dev server).
// It walks a job through the real pipeline stages and, when done, serves an MP4 that
// already exists in the Remotion project's out/ folder — so preview + download work today.
// Replace with the real Node backend later: same routes, same JSON shapes (see README).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(here, '../../../out'); // <repo>/out

export const STAGES = [
  {k: 'upload', label: 'Uploading your files', secs: 2},
  {k: 'reference', label: 'Studying your reference edit', secs: 3, needsRef: true},
  {k: 'script', label: 'Breaking the script into scenes', secs: 3},
  {k: 'voice', label: 'Recording the voice-over', secs: 4},
  {k: 'visuals', label: 'Placing images, clips and graphics', secs: 5},
  {k: 'audio', label: 'Adding music and sound effects', secs: 3},
  {k: 'render', label: 'Rendering the video', secs: 6},
];

const jobs = new Map();
let seq = 0;

const sampleVideo = () => {
  if (!fs.existsSync(OUT_DIR)) return null;
  const mp4s = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.mp4'));
  const pick = mp4s.find((f) => f.startsWith('panchayat')) || mp4s[0];
  return pick ? path.join(OUT_DIR, pick) : null;
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

/** Pull the JSON `meta` field and file names out of a multipart body (good enough for a mock). */
const parseMultipart = (buf) => {
  const text = buf.toString('latin1');
  const metaMatch = text.match(/name="meta"\r\n\r\n([\s\S]*?)\r\n--/);
  let meta = {};
  try {
    meta = metaMatch ? JSON.parse(Buffer.from(metaMatch[1], 'latin1').toString('utf8')) : {};
  } catch {
    meta = {};
  }
  const files = [...text.matchAll(/name="([^"]+)"; filename="([^"]*)"/g)].map((m) => ({field: m[1], name: m[2]}));
  return {meta, files};
};

const view = (job) => {
  const now = Date.now();
  const elapsed = (now - job.started) / 1000 / job.speed;
  const stages = job.stages;
  const total = stages.reduce((a, s) => a + s.secs, 0);
  let t = elapsed;
  let current = stages.length;
  const out = stages.map((s, i) => {
    if (job.cancelled) return {...s, state: i < job.cancelledAt ? 'done' : 'skipped'};
    if (t >= s.secs) {
      t -= s.secs;
      return {...s, state: 'done'};
    }
    if (current === stages.length) current = i;
    return {...s, state: i === current ? 'running' : 'todo', pct: i === current ? Math.round((t / s.secs) * 100) : 0};
  });
  const progress = job.cancelled ? job.cancelledProgress : Math.min(100, Math.round((elapsed / total) * 100));
  const done = !job.cancelled && elapsed >= total;
  const video = sampleVideo();
  return {
    id: job.id,
    title: job.meta.title || 'Untitled video',
    created: job.created,
    status: job.cancelled ? 'cancelled' : done ? 'done' : 'running',
    progress,
    stages: out,
    params: job.meta,
    files: job.files,
    error: done && !video ? 'Mock mode: no MP4 found in the out/ folder to show. Render one with Remotion first.' : '',
    result: done && video
      ? {
          video_url: `/api/jobs/${job.id}/video`,
          download_url: `/api/jobs/${job.id}/download`,
          file_name: `${(job.meta.title || 'video').replace(/[^\w-]+/g, '-').toLowerCase()}.mp4`,
          size_mb: +(fs.statSync(video).size / 1e6).toFixed(1),
          width: job.meta.ratio === '16:9' ? 1920 : 1080,
          height: job.meta.ratio === '16:9' ? 1080 : job.meta.ratio === '1:1' ? 1080 : 1920,
          fps: 30,
          mock_note: `Mock mode plays ${path.basename(video)} from out/.`,
        }
      : null,
  };
};

const json = (res, code, body) => {
  res.statusCode = code;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
};

const streamVideo = (req, res, file, download, name) => {
  const size = fs.statSync(file).size;
  res.setHeader('content-type', 'video/mp4');
  res.setHeader('accept-ranges', 'bytes');
  if (download) res.setHeader('content-disposition', `attachment; filename="${name}"`);
  const range = req.headers.range;
  if (range && !download) {
    const [s, e] = range.replace('bytes=', '').split('-');
    const start = parseInt(s, 10);
    const end = e ? parseInt(e, 10) : Math.min(start + 4 * 1024 * 1024, size - 1);
    res.statusCode = 206;
    res.setHeader('content-range', `bytes ${start}-${end}/${size}`);
    res.setHeader('content-length', end - start + 1);
    fs.createReadStream(file, {start, end}).pipe(res);
    return;
  }
  res.setHeader('content-length', size);
  fs.createReadStream(file).pipe(res);
};

export function mockApi() {
  return {
    name: 'studio-mock-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next();
        const url = new URL(req.url, 'http://x');
        const parts = url.pathname.split('/').filter(Boolean); // ['api','jobs',id,...]
        try {
          if (url.pathname === '/api/health') {
            return json(res, 200, {mode: 'mock', ok: true, sample_video: !!sampleVideo()});
          }
          if (url.pathname === '/api/voices') {
            return json(res, 200, [
              {id: 'en-IN-PrabhatNeural', name: 'Prabhat', lang: 'Indian English', gender: 'Male'},
              {id: 'en-IN-NeerjaNeural', name: 'Neerja', lang: 'Indian English', gender: 'Female'},
              {id: 'te-IN-MohanNeural', name: 'Mohan', lang: 'Telugu', gender: 'Male'},
              {id: 'hi-IN-MadhurNeural', name: 'Madhur', lang: 'Hindi', gender: 'Male'},
              {id: 'en-US-JennyNeural', name: 'Jenny', lang: 'US English', gender: 'Female'},
            ]);
          }
          if (url.pathname === '/api/jobs' && req.method === 'POST') {
            const {meta, files} = parseMultipart(await readBody(req));
            const id = `job${Date.now().toString(36)}${++seq}`;
            const hasRef = files.some((f) => f.field === 'reference');
            const job = {
              id,
              meta,
              files,
              created: Date.now(),
              started: Date.now(),
              speed: url.searchParams.get('speed') ? +url.searchParams.get('speed') : 1,
              stages: STAGES.filter((s) => !s.needsRef || hasRef),
            };
            jobs.set(id, job);
            return json(res, 200, view(job));
          }
          if (url.pathname === '/api/jobs' && req.method === 'GET') {
            const list = [...jobs.values()].map(view).filter((j) => j.status === 'done').reverse();
            return json(res, 200, list);
          }
          if (parts[1] === 'jobs' && parts[2]) {
            const job = jobs.get(parts[2]);
            if (!job) return json(res, 404, {detail: 'Video not found. Mock jobs reset when the dev server restarts.'});
            const action = parts[3];
            if (!action) return json(res, 200, view(job));
            if (action === 'cancel' && req.method === 'POST') {
              const v = view(job);
              job.cancelled = true;
              job.cancelledAt = v.stages.findIndex((s) => s.state !== 'done');
              job.cancelledProgress = v.progress;
              return json(res, 200, view(job));
            }
            if (action === 'video' || action === 'download') {
              const v = view(job);
              const file = sampleVideo();
              if (v.status !== 'done' || !file) return json(res, 409, {detail: 'The video is not ready yet.'});
              return streamVideo(req, res, file, action === 'download', v.result.file_name);
            }
          }
          return json(res, 404, {detail: 'Unknown API route.'});
        } catch (e) {
          return json(res, 500, {detail: String(e?.message || e)});
        }
      });
    },
  };
}
