import {Loader2, Music2} from 'lucide-react';
import {Dropzone, FileRow, Seg, Switch} from '../../components/ui';
import {StepHead} from '../../components/Stepper';
import {BACKGROUNDS, MUSIC, QUALITY, RATIOS, STYLES} from '../../options';
import {estSeconds, fmtTime} from '../../util';

export default function StyleStep({form, set, files, setFiles, voices, back, submit, submitting}) {
  const voice = voices.find((v) => v.id === form.voice);
  const musicMissing = form.music === 'upload' && !files.music;
  const summary = [
    ['Length', `≈ ${fmtTime(estSeconds(form.script))} (follows the voice)`],
    ['Size', `${form.ratio} · ${RATIOS.find((r) => r.k === form.ratio)?.name}`],
    ['Voice', form.voiceMode === 'own' ? files.voiceover?.name || 'Your voice-over' : voice ? `AI · ${voice.name} (${voice.lang})` : 'AI voice'],
    ['Media', `${files.media.length} file${files.media.length === 1 ? '' : 's'}${form.onlineImages ? ' + online images' : ''}`],
    ['Reference', files.reference ? `${form.copy.length} aspects copied` : 'None'],
    ['Subtitles', form.captions ? 'On' : 'Off'],
  ];

  return (
    <section className="panel stack">
      <StepHead n={3} title="Choose the look & sound" sub="Pick an editing style, a light background, music and effects." />
      <div className="stack-s">
        <h3 className="section-title">Editing style</h3>
        <div className="presets" role="radiogroup" aria-label="Editing style">
          {STYLES.map((s) => (
            <button key={s.k} type="button" role="radio" aria-checked={form.style === s.k} className="preset" onClick={() => set({style: s.k})}>
              <span className="demo grid-bg" style={{background: s.bg, '--g': s.g}} aria-hidden="true">
                <b style={{color: s.fg}}>
                  {s.a} <span style={{color: '#e5322d'}}>{s.b}</span>
                </b>
              </span>
              <span>
                <span className="t">{s.name}</span>
                <span className="d">{s.d}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="stack-s">
        <h3 className="section-title">
          Background <span className="tag">Always light</span>
        </h3>
        <div className="swatches" role="radiogroup" aria-label="Background">
          {BACKGROUNDS.map((b) => (
            <button key={b.k} type="button" role="radio" aria-checked={form.background === b.k} className="swatch" onClick={() => set({background: b.k})}>
              <span style={{background: b.css}} />
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid2">
        <div className="field">
          <span className="lbl">Background music</span>
          <Seg label="Background music" value={form.music} onChange={(v) => set({music: v})} options={MUSIC} />
          <span className="hint">{form.music === 'original' ? 'Composed for this video, so there are no copyright problems.' : form.music === 'upload' ? 'Only use music you have the rights to.' : 'Voice and sound effects only.'}</span>
        </div>
        <div className="field">
          <span className="lbl">Transitions &amp; effects</span>
          <Seg
            label="Effect strength"
            value={form.intensity}
            onChange={(v) => set({intensity: v})}
            options={[
              ['subtle', 'Subtle'],
              ['balanced', 'Balanced'],
              ['bold', 'Bold'],
            ]}
          />
          <span className="hint">How strong camera moves, transitions and effects feel.</span>
        </div>
      </div>
      {form.music === 'upload' &&
        (files.music ? (
          <FileRow file={files.music} onRemove={() => setFiles((f) => ({...f, music: null}))} />
        ) : (
          <Dropzone accept="audio/*" onFiles={([f]) => setFiles((x) => ({...x, music: f}))} icon={Music2} title="Drop your music track" desc="MP3 or WAV. It's ducked under the voice automatically." button="Choose audio" compact />
        ))}

      <div className="grid2">
        <Switch checked={form.sfx} onChange={(v) => set({sfx: v})} title="Sound effects" desc="Whooshes, pops, clicks and hits synced to the visuals." />
        <Switch checked={form.captions} onChange={(v) => set({captions: v})} title="Subtitles" desc="Off by default — the story is told with visuals, not text." />
      </div>

      <div className="field">
        <span className="lbl">Quality</span>
        <Seg label="Quality" value={form.quality} onChange={(v) => set({quality: v})} options={QUALITY} />
      </div>

      <hr className="hr" />
      <div className="stack-s">
        <h3 className="section-title">Ready to create</h3>
        <div className="summary">
          {summary.map(([k, v]) => (
            <div className="sum" key={k}>
              <small>{k}</small>
              <b>{v}</b>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-foot">
        <button className="btn" onClick={back}>
          Back
        </button>
        <div className="right">
          {musicMissing && <span className="hint">Add your music file or pick another option.</span>}
          <button className="btn rec lg" disabled={submitting || musicMissing} onClick={submit}>
            {submitting ? <Loader2 size={18} className="spin" /> : <span className="dot" />}
            {submitting ? 'Sending…' : 'Create video'}
          </button>
        </div>
      </div>
    </section>
  );
}
