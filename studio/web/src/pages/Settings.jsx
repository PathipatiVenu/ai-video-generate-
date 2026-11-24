import {CheckCircle2, CircleAlert, Server} from 'lucide-react';

const PIPELINE = [
  ['Script analysis', 'Splits the script into scenes and visual beats (never rewrites it).'],
  ['Voice-over', 'Your recording, or an AI voice (edge-tts) read exactly from the script.'],
  ['Visuals', 'Your images & clips first, then free online images, then motion graphics.'],
  ['Reference edit', 'Copies pacing, transitions, camera moves and colour from your reference video.'],
  ['Audio', 'Original music ducked under the voice + synced sound effects.'],
  ['Render', 'Remotion renders the MP4 (H.264, 30 fps).'],
];

export default function Settings({health}) {
  const mock = health?.mode === 'mock';
  return (
    <>
      <header className="page-head">
        <div>
          <h1>Settings</h1>
          <p className="muted">Connection to the video engine and what each stage does.</p>
        </div>
      </header>
      <div className="stack">
        <section className="panel stack-s">
          <h3 className="section-title">
            <Server size={20} /> Studio server
          </h3>
          {!health ? (
            <div className="banner err">
              <CircleAlert size={18} /> Cannot reach the server. Start it with <code>npm run dev</code> in <code>studio/web</code>.
            </div>
          ) : mock ? (
            <div className="banner warn">
              <CircleAlert size={18} />
              <span>
                <b>Mock backend.</b> The interface works end to end, but finished videos are a sample MP4 from <code>out/</code>
                {health.sample_video ? '' : ' (none found yet — render one with Remotion)'}. To use a real backend run (PowerShell) <code>$env:MOCK="0"; $env:BACKEND_URL="http://127.0.0.1:8000"; npm run dev</code>.
              </span>
            </div>
          ) : (
            <div className="banner ok">
              <CheckCircle2 size={18} /> Connected to the studio server.
            </div>
          )}
        </section>
        <section className="panel stack-s">
          <h3 className="section-title">How your video is made</h3>
          <div className="summary">
            {PIPELINE.map(([k, d], i) => (
              <div className="sum" key={k}>
                <small>Stage {i + 1}</small>
                <b>{k}</b>
                <span className="hint">{d}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
