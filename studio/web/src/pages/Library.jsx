import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {Clapperboard, Download, Play} from 'lucide-react';
import {api} from '../api';
import {timeAgo} from '../util';

export default function Library({goto}) {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    api.library().then(setItems).catch((e) => setErr(e.message));
  }, []);

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Your videos</h1>
          <p className="muted">Every video you've created. Play it here or download the MP4.</p>
        </div>
      </header>
      {err && <div className="banner err">{err}</div>}
      {items && items.length === 0 && (
        <div className="empty glass">
          <Clapperboard size={34} />
          <h2 style={{fontSize: 22}}>No videos yet</h2>
          <p className="muted">Finished videos appear here.</p>
          <button className="btn primary" onClick={() => goto('create')}>
            Create your first video
          </button>
        </div>
      )}
      <div className="lib">
        {(items || []).map((v, i) => (
          <motion.div key={v.id} className="vcard glass" initial={{opacity: 0, y: 12}} animate={{opacity: 1, y: 0}} transition={{delay: Math.min(i * 0.04, 0.4), duration: 0.25}}>
            <a className="cv" href={v.result.video_url} target="_blank" rel="noreferrer" aria-label={`Play ${v.title}`}>
              <video src={`${v.result.video_url}#t=1`} muted playsInline preload="metadata" />
              <span className="play">
                <Play size={34} fill="#fff" />
              </span>
            </a>
            <span>
              <b>{v.title}</b>
              <small>
                {v.params?.ratio} · {timeAgo(v.created)}
              </small>
            </span>
            <a className="btn sm" href={v.result.download_url} download={v.result.file_name}>
              <Download size={15} /> Download
            </a>
          </motion.div>
        ))}
      </div>
    </>
  );
}
