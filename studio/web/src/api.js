async function req(path, opts = {}) {
  let res;
  try {
    res = await fetch(path, opts);
  } catch {
    throw new Error('Cannot reach the studio server. Is it still running?');
  }
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = typeof j.detail === 'string' ? j.detail : JSON.stringify(j.detail);
    } catch {
      /* keep status text */
    }
    throw new Error(msg);
  }
  return res.json();
}

/**
 * Backend contract (the mock in mock/mockApi.js implements it; a real Node backend should too):
 *   GET  /api/health                -> {mode, ok}
 *   GET  /api/voices                -> [{id, name, lang, gender}]
 *   POST /api/jobs  (multipart)     -> job   fields: meta (JSON), images[], clips[], reference, voiceover, music
 *   GET  /api/jobs                  -> [job]  (finished videos)
 *   GET  /api/jobs/:id              -> job   {id,title,status,progress,stages[],result{video_url,download_url,...},error}
 *   POST /api/jobs/:id/cancel       -> job
 *   GET  /api/jobs/:id/video        -> MP4 (supports Range)
 *   GET  /api/jobs/:id/download     -> MP4 as attachment
 */
export const api = {
  health: () => req('/api/health'),
  voices: () => req('/api/voices'),
  library: () => req('/api/jobs'),
  job: (id) => req(`/api/jobs/${id}`),
  cancel: (id) => req(`/api/jobs/${id}/cancel`, {method: 'POST'}),
  createJob: ({meta, images, clips, reference, voiceover, music}) => {
    const fd = new FormData();
    fd.append('meta', JSON.stringify(meta));
    images.forEach((f) => fd.append('images', f));
    clips.forEach((f) => fd.append('clips', f));
    if (reference) fd.append('reference', reference);
    if (voiceover) fd.append('voiceover', voiceover);
    if (music) fd.append('music', music);
    return req('/api/jobs', {method: 'POST', body: fd});
  },
};
