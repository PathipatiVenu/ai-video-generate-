export const ls = {
  get(k, fallback = null) {
    try {
      const v = localStorage.getItem(k);
      return v == null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(k, v) {
    try {
      if (v == null) localStorage.removeItem(k);
      else localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* private mode etc. */
    }
  },
};

export const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean);

/** Rough narration length: ~150 spoken words per minute plus a little breathing room. */
export const estSeconds = (script) => Math.round((words(script).length / 150) * 60 * 1.08);

export const fmtTime = (s) => {
  if (s == null || Number.isNaN(s)) return '–';
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
};

export const timeAgo = (ts) => {
  const d = (Date.now() - ts) / 1000;
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.round(d / 60)} min ago`;
  if (d < 86400) return `${Math.round(d / 3600)} h ago`;
  return new Date(ts).toLocaleDateString();
};

export const fileKind = (f) => (f.type.startsWith('video/') ? 'video' : f.type.startsWith('image/') ? 'image' : f.type.startsWith('audio/') ? 'audio' : 'other');

export const mb = (bytes) => `${(bytes / 1e6).toFixed(bytes > 1e7 ? 0 : 1)} MB`;
