import {useEffect, useMemo} from 'react';
import {Clapperboard, Globe, ImagePlus, Wand2} from 'lucide-react';
import {Dropzone, FileGrid, Switch} from '../../components/ui';
import {StepHead} from '../../components/Stepper';
import {COPY_ASPECTS} from '../../options';
import {mb} from '../../util';

export default function MediaStep({form, set, files, setFiles, back, next}) {
  const refUrl = useMemo(() => (files.reference ? URL.createObjectURL(files.reference) : null), [files.reference]);
  useEffect(() => () => refUrl && URL.revokeObjectURL(refUrl), [refUrl]);
  const images = files.media.filter((f) => f.type.startsWith('image/')).length;
  const clips = files.media.length - images;
  const toggleCopy = (k) => set({copy: form.copy.includes(k) ? form.copy.filter((x) => x !== k) : [...form.copy, k]});

  return (
    <section className="panel stack">
      <StepHead n={2} title="Add images, clips & a reference" sub="Everything here is optional — skip it and the studio builds the visuals for you." />
      {/* images & clips */}
      <div className="stack-s">
        <h3 className="section-title">
          Images &amp; clips for the video <span className="tag">Optional</span>
        </h3>
        <p className="muted" style={{fontSize: 14}}>
          Logos, product photos, screenshots, screen recordings, B-roll… Each one is placed where the script talks about it — nothing is replaced by a random image.
        </p>
        <Dropzone
          accept="image/*,video/*"
          multiple
          onFiles={(arr) => setFiles((f) => ({...f, media: [...f.media, ...arr].slice(0, 40)}))}
          icon={ImagePlus}
          title="Drop images and video clips"
          desc="PNG, JPG, WebP, SVG, MP4, MOV · up to 40 files"
          button="Browse files"
        />
        <FileGrid files={files.media} onRemove={(i) => setFiles((f) => ({...f, media: f.media.filter((_, j) => j !== i)}))} />
        {files.media.length > 0 && (
          <span className="hint">
            {images} image{images === 1 ? '' : 's'} · {clips} clip{clips === 1 ? '' : 's'}
          </span>
        )}
        <Switch
          checked={form.onlineImages}
          onChange={(v) => set({onlineImages: v})}
          title="Find free online images for the other scenes"
          desc="Uses openly licensed photos and logos (Wikimedia, Openverse) and lists the credits for your post description."
        />
      </div>

      <hr className="hr" />

      {/* reference edit */}
      <div className="stack-s">
        <h3 className="section-title">
          Editing reference <span className="tag">Optional</span>
        </h3>
        <p className="muted" style={{fontSize: 14}}>
          Have a video whose editing you love? Add it and the studio copies its <b>style</b> — pacing, transitions, camera moves — while the content comes from your script.
        </p>
        {!files.reference ? (
          <Dropzone accept="video/*" onFiles={([f]) => setFiles((x) => ({...x, reference: f}))} icon={Clapperboard} title="Drop a reference video" desc="MP4 or MOV, ideally under 2 minutes." button="Choose video" compact />
        ) : (
          <div className="refcard">
            <video src={refUrl} controls muted playsInline preload="metadata" />
            <div className="stack-s" style={{alignContent: 'start'}}>
              <div>
                <b style={{display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{files.reference.name}</b>
                <span className="hint">{mb(files.reference.size)}</span>
              </div>
              <span className="lbl" style={{fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6}}>
                <Wand2 size={16} /> What should we copy?
              </span>
              <div className="chips" role="group" aria-label="Copy from reference">
                {COPY_ASPECTS.map((a) => (
                  <button key={a.k} type="button" className="chip" aria-pressed={form.copy.includes(a.k)} onClick={() => toggleCopy(a.k)}>
                    {a.label}
                  </button>
                ))}
              </div>
              <span className="hint">We match the feel, not the footage or music — your video stays original.</span>
              <div>
                <button type="button" className="btn sm quiet danger" onClick={() => setFiles((x) => ({...x, reference: null}))}>
                  Remove reference
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!files.media.length && !form.onlineImages && (
        <div className="banner warn">
          <Globe size={18} />
          <span>No images added and online images are off — the studio will build the video from motion graphics and icons only.</span>
        </div>
      )}

      <div className="panel-foot">
        <button className="btn" onClick={back}>
          Back
        </button>
        <div className="right">
          <span className="hint">{files.media.length || files.reference ? 'Ready for styling.' : 'You can skip this step.'}</span>
          <button className="btn primary" onClick={next}>
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
