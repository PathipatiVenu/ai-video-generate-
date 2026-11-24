import {useCallback, useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {FolderOpen, Menu, Plus, Settings as SettingsIcon, Sparkles, X} from 'lucide-react';
import {api} from './api';
import {Toasts, useToasts} from './components/ui';
import Create from './pages/Create.jsx';
import Library from './pages/Library.jsx';
import Settings from './pages/Settings.jsx';
import {ls} from './util';

const ROUTES = ['create', 'library', 'settings'];
const NAV = [
  {k: 'create', label: 'Create Video', Icon: Sparkles},
  {k: 'library', label: 'Library', Icon: FolderOpen},
  {k: 'settings', label: 'Settings', Icon: SettingsIcon},
];
const TITLES = {
  create: ['Studio', 'Create Video'],
  library: ['Studio', 'Library'],
  settings: ['Workspace', 'Settings'],
};

function useRoute() {
  const read = () => {
    const r = window.location.hash.replace(/^#\/?/, '');
    return ROUTES.includes(r) ? r : 'create';
  };
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const f = () => setRoute(read());
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  return [route, (r) => (window.location.hash = `/${r}`)];
}

/** Warm cream canvas with slowly floating blurred blobs. */
function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <i className="a" />
      <i className="b" />
      <i className="c" />
      <i className="d" />
    </div>
  );
}

function NavList({route, go}) {
  return (
    <nav className="nav" aria-label="Primary studio navigation">
      {NAV.map(({k, label, Icon}) => (
        <button key={k} type="button" aria-current={route === k ? 'page' : undefined} onClick={() => go(k)}>
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function ServerStatus({health, onClick}) {
  const s = !health ? 'bad' : health.mode === 'mock' ? 'mock' : 'ok';
  const [title, sub] = !health ? ['Server offline', 'Start npm run dev'] : health.mode === 'mock' ? ['Demo mode', 'Mock video engine'] : ['Engine connected', 'Rendering live'];
  return (
    <button type="button" className="status" data-s={s} onClick={onClick} title="Open settings">
      <i />
      <span>
        <b>{title}</b>
        <small>{sub}</small>
      </span>
    </button>
  );
}

export default function App() {
  const [route, setRoute] = useRoute();
  const [menu, setMenu] = useState(false);
  const [toasts, toast] = useToasts();
  const [health, setHealth] = useState(null);
  const [voices, setVoices] = useState([]);
  const [jobId, setJobIdState] = useState(() => ls.get('studio.job'));
  const setJobId = useCallback((id) => {
    ls.set('studio.job', id);
    setJobIdState(id);
  }, []);
  const go = (r) => {
    setRoute(r);
    setMenu(false);
  };

  useEffect(() => {
    const ping = () => api.health().then(setHealth).catch(() => setHealth(null));
    ping();
    api.voices().then(setVoices).catch(() => {});
    const t = setInterval(ping, 20000);
    return () => clearInterval(t);
  }, []);

  const [section, title] = TITLES[route];

  return (
    <div className="app">
      <Ambient />

      {/* Desktop glass sidebar */}
      <aside className="side">
        <div>
          <button type="button" className="brand" onClick={() => go('create')}>
            <span className="mark">SS</span>
            <span className="name">Script Studio</span>
          </button>
          <NavList route={route} go={go} />
        </div>
        <div className="side-foot">
          <ServerStatus health={health} onClick={() => go('settings')} />
        </div>
      </aside>

      {/* Mobile header + drawer */}
      <div className="mobilebar">
        <button type="button" className="brand" onClick={() => go('create')}>
          <span className="mark">SS</span>
          <span className="name">Script Studio</span>
        </button>
        <button type="button" className="icon-btn" onClick={() => setMenu((m) => !m)} aria-label="Toggle navigation menu" aria-expanded={menu}>
          {menu ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {menu && (
        <div className="drawer">
          <NavList route={route} go={go} />
          <ServerStatus health={health} onClick={() => go('settings')} />
        </div>
      )}

      <div className="workspace">
        <header className="topbar">
          <div className="crumbs">
            <span>{section}</span>
            <span className="sl" aria-hidden="true">
              /
            </span>
            <h1>{title}</h1>
          </div>
          {route === 'create' ? (
            <button type="button" className="btn sm" onClick={() => go('library')}>
              Open Library
            </button>
          ) : (
            <button type="button" className="btn sm primary" onClick={() => go('create')}>
              <Plus size={14} /> Create Video
            </button>
          )}
        </header>

        <main className="main">
          {/* Create stays mounted so a running job keeps polling while you browse. */}
          <div hidden={route !== 'create'}>
            <Create jobId={jobId} setJobId={setJobId} voices={voices} toast={toast} />
          </div>
          <AnimatePresence mode="wait">
            {route === 'library' && (
              <motion.div key="lib" initial={{opacity: 0, y: 6}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -4}} transition={{duration: 0.16, ease: [0.16, 1, 0.3, 1]}}>
                <Library goto={go} />
              </motion.div>
            )}
            {route === 'settings' && (
              <motion.div key="set" initial={{opacity: 0, y: 6}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -4}} transition={{duration: 0.16, ease: [0.16, 1, 0.3, 1]}}>
                <Settings health={health} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <Toasts items={toasts} />
    </div>
  );
}
