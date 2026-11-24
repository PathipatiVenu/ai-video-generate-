import {useState} from 'react';
import {Check, CircleDashed, Loader2, Minus, X} from 'lucide-react';
import {api} from '../../api';
import {StepHead} from '../../components/Stepper';

export default function GenerateStep({job, toast, onCancelled}) {
  const [cancelling, setCancelling] = useState(false);
  if (!job) {
    return (
      <section className="panel" style={{display: 'grid', placeItems: 'center', minHeight: 260}}>
        <Loader2 className="spin" />
      </section>
    );
  }
  const cancelled = job.status === 'cancelled';

  const cancel = async () => {
    setCancelling(true);
    try {
      await api.cancel(job.id);
      toast('Stopped. Your script and choices are kept.');
      onCancelled();
    } catch (e) {
      toast(e.message, 'err');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <section className="panel stack">
      <StepHead n={4} title={cancelled ? 'Stopped' : 'Creating your video'} sub={job.title} />
      <div className="stack-s">
        <div className="row" style={{alignItems: 'center'}}>
          <div className="bigbar" style={{flex: '1 1 auto'}} role="progressbar" aria-valuenow={job.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Overall progress">
            <i style={{width: `${job.progress}%`}} />
          </div>
          <b className="tnum" style={{flex: '0 0 auto', fontFamily: 'var(--font-display)', fontSize: 22}}>
            {job.progress}%
          </b>
        </div>
      </div>

      <ol className="stages" aria-label="Progress">
        {job.stages.map((s) => (
          <li key={s.k} className="stage" data-s={s.state}>
            <span className="ic" aria-hidden="true">
              {s.state === 'done' ? <Check size={16} strokeWidth={3} /> : s.state === 'running' ? <Loader2 size={16} className="spin" /> : s.state === 'skipped' ? <Minus size={16} /> : <CircleDashed size={16} />}
            </span>
            <span style={{fontWeight: 600}}>{s.label}</span>
            <span className="hint tnum">{s.state === 'running' ? `${s.pct || 0}%` : s.state === 'done' ? 'Done' : ''}</span>
            {s.state === 'running' && (
              <span className="pbar">
                <i style={{width: `${s.pct || 0}%`}} />
              </span>
            )}
          </li>
        ))}
      </ol>

      {job.error && <div className="banner err">{job.error}</div>}

      <div className="panel-foot">
        <span className="hint">You can switch to another page — the video keeps rendering and opens here when it's ready.</span>
        {!cancelled && (
          <div className="right">
            <button className="btn quiet danger" onClick={cancel} disabled={cancelling}>
              <X size={16} /> Stop
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
