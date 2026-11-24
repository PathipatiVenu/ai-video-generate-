import {Check} from 'lucide-react';

export const STEPS = [
  {title: 'Script', sub: 'Title, script & voice'},
  {title: 'Media', sub: 'Images, clips & reference'},
  {title: 'Style', sub: 'Look, music & effects'},
  {title: 'Generate', sub: 'Rendering your video'},
  {title: 'Download', sub: 'Preview & save MP4'},
];

/** Glass bar of step cards. Passed steps can be revisited; future steps are locked. */
export default function Stepper({current, maxReached, onGo, locked}) {
  return (
    <ol className="stepper glass" aria-label="Steps">
      {STEPS.map((st, i) => {
        const s = i < current ? 'done' : i === current ? 'active' : 'todo';
        const canGo = !locked && i !== current && i <= maxReached && i < 3;
        return (
          <li key={st.title} data-s={s}>
            <button type="button" disabled={!canGo} onClick={() => onGo(i)} aria-current={s === 'active' ? 'step' : undefined}>
              <span className="n">{s === 'done' ? <Check size={14} strokeWidth={3} /> : i + 1}</span>
              <span style={{minWidth: 0}}>
                <span className="t">{st.title}</span>
                <span className="s">{st.sub}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** "Step 01 of 05" + serif title header used at the top of every step panel. */
export function StepHead({n, title, sub, right}) {
  return (
    <div className="step-head">
      <div>
        <p>
          Step {String(n).padStart(2, '0')} of {String(STEPS.length).padStart(2, '0')}
        </p>
        <h2>{title}</h2>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {right}
    </div>
  );
}
