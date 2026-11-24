import {FileAudio, Mic, Sparkles} from 'lucide-react';
import {Dropzone, FileRow, Seg} from '../../components/ui';
import {StepHead} from '../../components/Stepper';
import {RATIOS} from '../../options';
import {estSeconds, fmtTime, words} from '../../util';

const SAMPLE = `Do you know how Panchayat elections work in India? Who can contest, how many villages come under one Panchayat, and what powers does a person get after winning? Let's understand!

A Gram Panchayat is a local government body that looks after village development.`;

export default function ScriptStep({form, set, voices, files, setFiles, next}) {
  const wc = words(form.script).length;
  const secs = estSeconds(form.script);
  const voiceReady = form.voiceMode === 'ai' ? !!form.voice : !!files.voiceover;
  const ok = wc >= 5 && voiceReady;

  return (
    <section className="panel stack">
      <StepHead n={1} title="Write your script" sub="Your words are used exactly as written — every sentence gets its own visuals, motion and sound." />
      <div className="field">
        <label htmlFor="title" className="lbl">
          Video title
        </label>
        <input id="title" className="title-input" placeholder="Give your video a title…" value={form.title} onChange={(e) => set({title: e.target.value})} autoFocus />
      </div>

      <div className="field">
        <div className="row" style={{alignItems: 'center'}}>
          <label htmlFor="script" style={{fontWeight: 600}}>
            Your script
          </label>
          {!form.script && (
            <button type="button" className="link" style={{flex: '0 0 auto', fontSize: 13.5}} onClick={() => set({script: SAMPLE})}>
              Try a sample script
            </button>
          )}
        </div>
        <div className="script-box">
          <textarea
            id="script"
            className="textarea"
            value={form.script}
            onChange={(e) => set({script: e.target.value})}
            placeholder={'Paste or write the full narration here.\n\nThe video is built line by line from this script — every sentence gets its own visuals, motion and sound. Nothing is rewritten.'}
          />
          <div className="script-meta" aria-live="polite">
            <span>
              <b className="tnum">{wc}</b> words
            </span>
            <span>
              ≈ <b className="tnum">{fmtTime(secs)}</b> of narration
            </span>
            <span className="sp" />
            {secs > 90 && <span style={{color: 'var(--warn)'}}>Long for a Reel — that's fine, length follows the voice.</span>}
          </div>
        </div>
        <span className="hint">The script is used exactly as written. Video length follows the voice-over, so there's no fixed duration to set.</span>
      </div>

      <div className="field">
        <span className="lbl">Video size</span>
        <div className="ratios" role="radiogroup" aria-label="Video size">
          {RATIOS.map((r) => (
            <button key={r.k} type="button" role="radio" aria-checked={form.ratio === r.k} className="ratio" onClick={() => set({ratio: r.k})}>
              <span className="shape" style={{width: r.w, height: r.h}} aria-hidden="true" />
              <span>
                {r.k} · {r.name}
              </span>
              <small>{r.use}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="stack-s">
        <div className="row" style={{alignItems: 'center'}}>
          <h3 className="section-title" style={{flex: '1 1 auto'}}>
            Voice-over
          </h3>
          <div style={{flex: '0 0 auto'}}>
            <Seg
              label="Voice-over source"
              value={form.voiceMode}
              onChange={(v) => set({voiceMode: v})}
              options={[
                ['ai', 'AI voice', Sparkles],
                ['own', 'I have a voice-over', Mic],
              ]}
            />
          </div>
        </div>
        {form.voiceMode === 'ai' ? (
          <>
            <div className="voices" role="radiogroup" aria-label="AI voice">
              {(voices.length ? voices : [{id: 'en-IN-PrabhatNeural', name: 'Prabhat', lang: 'Indian English', gender: 'Male'}]).map((v) => (
                <button key={v.id} type="button" role="radio" aria-checked={form.voice === v.id} className="voice" onClick={() => set({voice: v.id})}>
                  <span className="av" aria-hidden="true">
                    {v.name[0]}
                  </span>
                  <span>
                    <b>{v.name}</b>
                    <small>
                      {v.lang} · {v.gender}
                    </small>
                  </span>
                </button>
              ))}
            </div>
            <span className="hint">The AI reads your script naturally, with pauses — it never adds or changes words.</span>
          </>
        ) : files.voiceover ? (
          <FileRow file={files.voiceover} icon={FileAudio} onRemove={() => setFiles((f) => ({...f, voiceover: null}))} />
        ) : (
          <Dropzone
            accept="audio/*"
            onFiles={([f]) => setFiles((x) => ({...x, voiceover: f}))}
            icon={Mic}
            title="Drop your voice-over here"
            desc="MP3, WAV or M4A. Your recording is used as-is and every scene is timed to it."
            button="Choose audio"
          />
        )}
      </div>

      <div className="panel-foot">
        <span className="hint">{!wc ? 'Start with your script.' : wc < 5 ? 'Add a little more script.' : !voiceReady ? 'Add your voice-over file or pick an AI voice.' : 'Looks good.'}</span>
        <div className="right">
          <button className="btn primary" disabled={!ok} onClick={next}>
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
