import {useCallback, useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {api} from '../api';
import PhonePreview from '../components/PhonePreview';
import Stepper from '../components/Stepper';
import {ls} from '../util';
import ScriptStep from './create/ScriptStep';
import MediaStep from './create/MediaStep';
import StyleStep from './create/StyleStep';
import GenerateStep from './create/GenerateStep';
import ResultStep from './create/ResultStep';

export const BASE_FORM = {
  title: '',
  script: '',
  ratio: '9:16',
  voiceMode: 'ai', // 'ai' | 'own'
  voice: 'en-IN-PrabhatNeural',
  onlineImages: true,
  copy: ['pacing', 'transitions', 'motion', 'sfx'],
  style: 'cinematic-edu',
  background: 'warm',
  music: 'original',
  sfx: true,
  captions: false,
  intensity: 'balanced',
  quality: 'hd',
};
const EMPTY_FILES = {media: [], reference: null, voiceover: null, music: null};
const slide = {initial: {opacity: 0, x: 18}, animate: {opacity: 1, x: 0}, exit: {opacity: 0, x: -18}, transition: {duration: 0.2}};

export default function Create({jobId, setJobId, voices, toast}) {
  const [form, setForm] = useState(() => ({...BASE_FORM, ...ls.get('studio.form', {})}));
  const [files, setFiles] = useState(EMPTY_FILES);
  const [step, setStep] = useState(jobId ? 3 : 0);
  const [maxReached, setMaxReached] = useState(jobId ? 3 : 0);
  const [job, setJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = useCallback((patch) => setForm((f) => ({...f, ...patch})), []);
  useEffect(() => ls.set('studio.form', form), [form]);

  const go = (n) => {
    setStep(n);
    setMaxReached((m) => Math.max(m, n));
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  // Poll the running job.
  useEffect(() => {
    if (!jobId) return undefined;
    let stop = false;
    let timer;
    const tick = async () => {
      try {
        const j = await api.job(jobId);
        if (stop) return;
        setJob(j);
        if (j.status === 'done') {
          setStep(4);
          setMaxReached(4);
          return;
        }
        if (j.status === 'cancelled' || j.status === 'error') return;
        timer = setTimeout(tick, 900);
      } catch (e) {
        if (stop) return;
        toast(e.message, 'err');
        setJobId(null);
        setStep(2);
      }
    };
    tick();
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [jobId, setJobId, toast]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const images = files.media.filter((f) => f.type.startsWith('image/'));
      const clips = files.media.filter((f) => f.type.startsWith('video/'));
      const title = form.title.trim() || form.script.trim().split('\n')[0].slice(0, 60);
      const j = await api.createJob({
        meta: {...form, title, voice: form.voiceMode === 'ai' ? form.voice : 'own-voiceover', copy: files.reference ? form.copy : []},
        images,
        clips,
        reference: files.reference,
        voiceover: form.voiceMode === 'own' ? files.voiceover : null,
        music: form.music === 'upload' ? files.music : null,
      });
      setJob(j);
      setJobId(j.id);
      go(3);
    } catch (e) {
      toast(e.message, 'err');
    } finally {
      setSubmitting(false);
    }
  };

  const startOver = (keepScript) => {
    setJobId(null);
    setJob(null);
    if (!keepScript) {
      setForm({...BASE_FORM});
      setFiles(EMPTY_FILES);
      setMaxReached(0);
      setStep(0);
    } else {
      go(2);
    }
  };

  const firstImage = useMemo(() => files.media.find((f) => f.type.startsWith('image/')), [files.media]);
  const imageUrl = useMemo(() => (firstImage ? URL.createObjectURL(firstImage) : null), [firstImage]);
  useEffect(() => () => imageUrl && URL.revokeObjectURL(imageUrl), [imageUrl]);

  const running = job && job.status === 'running';
  const stage = job?.stages?.find((s) => s.state === 'running');
  const mode = step === 4 && job?.result ? 'video' : step === 3 && running ? 'working' : 'draft';

  return (
    <>
      <Stepper current={step} maxReached={maxReached} onGo={go} locked={!!running} />
      <div className="create-grid">
        <div>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" {...slide}>
                <ScriptStep form={form} set={set} voices={voices} files={files} setFiles={setFiles} next={() => go(1)} />
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="s1" {...slide}>
                <MediaStep form={form} set={set} files={files} setFiles={setFiles} back={() => go(0)} next={() => go(2)} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" {...slide}>
                <StyleStep form={form} set={set} files={files} setFiles={setFiles} voices={voices} back={() => go(1)} submit={submit} submitting={submitting} />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" {...slide}>
                <GenerateStep job={job} toast={toast} onCancelled={() => startOver(true)} />
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="s4" {...slide}>
                <ResultStep job={job} onNew={() => startOver(false)} onEdit={() => startOver(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <PhonePreview form={form} imageUrl={imageUrl} mode={mode} progress={job?.progress || 0} stageLabel={stage?.label || 'Starting…'} videoUrl={job?.result?.video_url} />
      </div>
    </>
  );
}
