import {useEffect, useMemo, useState} from 'react';
import {motion, useReducedMotion} from 'framer-motion';
import {BACKGROUNDS, STYLES} from '../options';
import {words} from '../util';

const C = 2 * Math.PI * 40;

/** Cycles through short keyword chunks of the script — a stand-in for on-screen keyword labels. */
function useKeyword(script, active) {
  const list = useMemo(() => {
    const w = words(script).filter((x) => x.replace(/[^\p{L}\p{N}]/gu, '').length > 4).slice(0, 40);
    return w.length ? w.map((x) => x.replace(/[^\p{L}\p{N}+$]/gu, '')) : ['Your', 'script', 'becomes', 'a', 'video'];
  }, [script]);
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [list]);
  useEffect(() => {
    if (!active) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % list.length), 1300);
    return () => clearInterval(t);
  }, [active, list]);
  return list[i];
}

/**
 * mode: 'draft' (live mock-up from the form), 'working' (progress ring), 'video' (finished MP4).
 */
export default function PhonePreview({form, imageUrl, mode = 'draft', progress = 0, stageLabel, videoUrl}) {
  const reduce = useReducedMotion();
  const kw = useKeyword(form.script, mode === 'draft' && !reduce);
  const style = STYLES.find((s) => s.k === form.style) || STYLES[0];
  const bg = BACKGROUNDS.find((b) => b.k === form.background) || BACKGROUNDS[0];
  const ar = form.ratio.replace(':', ' / ');

  return (
    <aside className="preview glass" aria-label="Video preview" style={{borderRadius: 24}}>
      <div className="preview-top">
        <h3>{mode === 'video' ? 'Final video' : 'Live preview'}</h3>
        <span className="badge">
          <i /> {form.ratio}
        </span>
      </div>
      <div className="phone" data-ar={form.ratio}>
        <div className="notch" aria-hidden="true" />
        <div className="screen" data-ar={form.ratio} style={{'--ar': ar}}>
          {mode === 'video' && videoUrl ? (
            <video key={videoUrl} src={videoUrl} controls playsInline preload="metadata" />
          ) : (
            <>
              <div className="wash" style={{background: bg.css}} />
              <div className="wash grid-bg" style={{'--g': style.g, opacity: 0.9}} />
              <div className="sc-title">{form.title || 'Your video title'}</div>
              <motion.div className="sc-card" animate={reduce ? undefined : {scale: [1, 1.06, 1], rotate: [0, 1.5, 0]}} transition={{duration: 6, repeat: Infinity, ease: 'easeInOut'}}>
                {imageUrl ? <img src={imageUrl} alt="" /> : <style.Icon size={60} color={style.fg} strokeWidth={1.5} />}
              </motion.div>
              <motion.div key={kw} className="sc-chip" initial={{opacity: 0, y: 8, scale: 0.9}} animate={{opacity: 1, y: 0, scale: 1}}>
                {kw}
              </motion.div>
            </>
          )}
          {mode === 'working' && (
            <div className="over" role="status">
              <div className="ring">
                <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(117,104,92,.18)" strokeWidth="7" />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="#c2964d"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    transform="rotate(-90 48 48)"
                    animate={{strokeDashoffset: C * (1 - progress / 100)}}
                    transition={{duration: 0.4, ease: 'linear'}}
                  />
                </svg>
                <b className="tnum">{Math.round(progress)}%</b>
              </div>
              <span style={{fontWeight: 600}}>{stageLabel}</span>
            </div>
          )}
        </div>
      </div>
      <p className="preview-note">
        {mode === 'video'
          ? 'This is your finished video.'
          : mode === 'working'
            ? 'Your video appears here as soon as it is ready.'
            : 'Live mock-up of your choices. The real video follows your voice-over scene by scene — no subtitles unless you turn them on.'}
      </p>
    </aside>
  );
}
