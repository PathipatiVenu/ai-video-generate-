import {useEffect, useState} from 'react';
import {Check, Download, ExternalLink, Pencil, Plus} from 'lucide-react';
import {fmtTime} from '../../util';
import {StepHead} from '../../components/Stepper';

/** Reads the real duration from the video file's metadata. */
function useDuration(url) {
  const [d, setD] = useState(null);
  useEffect(() => {
    if (!url) return undefined;
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.src = url;
    const on = () => setD(v.duration);
    v.addEventListener('loadedmetadata', on);
    return () => {
      v.removeEventListener('loadedmetadata', on);
      v.src = '';
    };
  }, [url]);
  return d;
}

export default function ResultStep({job, onNew, onEdit}) {
  const r = job?.result;
  const duration = useDuration(r?.video_url);
  if (!r) return null;

  return (
    <section className="panel stack">
      <StepHead
        n={5}
        title="Your video is ready"
        sub={job.title}
        right={
          <span className="result-head">
            <span className="okc" aria-hidden="true">
              <Check size={22} strokeWidth={3} />
            </span>
          </span>
        }
      />

      <div className="specs">
        <div className="spec">
          <small>Duration</small>
          <b className="tnum">{fmtTime(duration)}</b>
        </div>
        <div className="spec">
          <small>Resolution</small>
          <b className="tnum">
            {r.width}×{r.height}
          </b>
        </div>
        <div className="spec">
          <small>Frame rate</small>
          <b className="tnum">{r.fps} fps</b>
        </div>
        <div className="spec">
          <small>File size</small>
          <b className="tnum">{r.size_mb} MB</b>
        </div>
      </div>

      <div className="actions">
        <a className="btn primary lg" href={r.download_url} download={r.file_name}>
          <Download size={19} /> Download MP4
        </a>
        <a className="btn lg" href={r.video_url} target="_blank" rel="noreferrer">
          <ExternalLink size={18} /> Open in new tab
        </a>
      </div>

      {r.mock_note && <div className="banner info">{r.mock_note} Connect the real backend to render your own script.</div>}

      <div className="panel-foot">
        <button className="btn" onClick={onEdit}>
          <Pencil size={16} /> Change style &amp; re-create
        </button>
        <div className="right">
          <button className="btn dark" onClick={onNew}>
            <Plus size={17} /> New video
          </button>
        </div>
      </div>
    </section>
  );
}
