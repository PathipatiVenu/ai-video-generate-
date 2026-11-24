import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Film, ImageIcon, Music2, UploadCloud, X} from 'lucide-react';
import {fileKind} from '../util';

export function useToasts() {
  const [items, setItems] = useState([]);
  const toast = useCallback((text, k = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setItems((x) => [...x, {id, text, k}]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 4200);
  }, []);
  return [items, toast];
}

export function Toasts({items}) {
  return (
    <div className="toasts" role="status" aria-live="polite">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div key={t.id} className="toast" data-k={t.k} initial={{opacity: 0, y: 12}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 8}}>
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function Switch({checked, onChange, title, desc}) {
  return (
    <button type="button" role="switch" aria-checked={checked} className="switch" onClick={() => onChange(!checked)}>
      <span className="tog" aria-hidden="true" />
      <span>
        <b>{title}</b>
        {desc && <span className="d">{desc}</span>}
      </span>
    </button>
  );
}

/** Segmented control. options: [[value, label, Icon?]] */
export function Seg({value, onChange, options, label}) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map(([v, l, Icon]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)}>
          {Icon && <Icon size={15} />}
          {l}
        </button>
      ))}
    </div>
  );
}

/** Drag & drop file picker. */
export function Dropzone({accept, multiple, onFiles, title, desc, icon: Icon = UploadCloud, compact, button}) {
  const [over, setOver] = useState(false);
  const pick = (list) => {
    const arr = [...list].filter((f) => !accept || accept.split(',').some((a) => (a.endsWith('/*') ? f.type.startsWith(a.slice(0, -1)) : f.type === a || f.name.endsWith(a))));
    if (arr.length) onFiles(multiple ? arr : [arr[0]]);
  };
  return (
    <div
      className={`drop${compact ? ' compact' : ''}`}
      data-over={over}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        pick(e.dataTransfer.files);
      }}
    >
      <span className="big" aria-hidden="true">
        <Icon size={24} />
      </span>
      <span>
        <b>{title}</b>
        {desc && <span className="hint" style={{display: 'block'}}>{desc}</span>}
      </span>
      {button && <span className="btn sm">{button}</span>}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        aria-label={title}
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}

/** Thumbnails for uploaded images / videos with remove buttons. */
export function FileGrid({files, onRemove}) {
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => urls.forEach(URL.revokeObjectURL), [urls]);
  if (!files.length) return null;
  return (
    <div className="files">
      <AnimatePresence initial={false}>
        {files.map((f, i) => {
          const kind = fileKind(f);
          return (
            <motion.div key={f.name + f.size + f.lastModified} className="fcard" layout initial={{opacity: 0, scale: 0.85}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.85}}>
              {kind === 'video' ? <video src={urls[i]} muted playsInline preload="metadata" /> : kind === 'image' ? <img src={urls[i]} alt={f.name} /> : null}
              <span className="kind">
                {kind === 'video' ? <Film size={12} /> : kind === 'audio' ? <Music2 size={12} /> : <ImageIcon size={12} />}
                {kind}
              </span>
              <button type="button" className="x" onClick={() => onRemove(i)} aria-label={`Remove ${f.name}`}>
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/** Small "file attached" row (audio, single files). */
export function FileRow({file, onRemove, icon: Icon = Music2}) {
  const ref = useRef(null);
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);
  if (!file) return null;
  return (
    <div className="drop compact" style={{borderStyle: 'solid'}}>
      <span className="big" aria-hidden="true">
        <Icon size={22} />
      </span>
      <span style={{minWidth: 0}}>
        <b style={{display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{file.name}</b>
        {fileKind(file) === 'audio' && <audio ref={ref} src={url} controls style={{width: '100%', height: 34, marginTop: 6}} />}
      </span>
      <button type="button" className="btn sm quiet danger" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
