# Script Studio — web UI

A friendly front end for the Remotion video engine in this repo. Write a script, add your own images / clips,
optionally drop in a **reference video whose editing you want copied**, pick a style, and get a finished MP4 you can
preview and download.

Design follows the *Aurelia* "cream glass" studio: warm cream canvas (#FAF6F0) with slowly floating ambient blobs,
frosted-glass sidebar and panels, Fraunces serif headings + Inter body, champagne-gold primary buttons, a glass
step bar of step cards, "Step 0X of 05" panel headers and an espresso phone preview with a notch — light theme only.

## Run it

```
cd studio/web
npm install
npm run dev
```

Open **http://localhost:5173**. It starts in **mock mode**: the whole flow works, and the finished video is a sample
MP4 taken from the repo's `out/` folder (render one first, e.g. `npx remotion render Panchayat out/panchayat-elections.mp4`).

Use a real backend instead (PowerShell):

```
$env:MOCK="0"; $env:BACKEND_URL="http://127.0.0.1:8000"; npm run dev
```

## The flow

| Step | What the user does |
|---|---|
| 1 Script | Title, full script (word count + estimated narration length), video size (9:16 / 4:5 / 1:1 / 16:9), AI voice **or** upload own voice-over |
| 2 Media | Drop images & video clips (used where the script mentions them), toggle free online images, add an **editing reference** video and choose what to copy (pacing, transitions, camera moves, colour, text style, SFX, music energy) |
| 3 Style | Editing style (Cinematic educational, Tech explainer, Product ad, Energetic, Documentary, News, Clean aesthetic), light background theme, music (original / upload / none), effect strength, sound effects, subtitles (off by default), quality, summary → **Create video** |
| 4 Generate | Live progress per stage, overall bar, progress ring in the phone preview, Stop button. Safe to switch pages. |
| 5 Download | The finished video plays in the phone frame; duration, resolution, fps, size; **Download MP4**, open in new tab, re-create with new style, or start a new video |

Plus **Videos** (all finished videos with play + download) and **Settings** (server status, pipeline stages).

## Backend contract

The UI only talks to these routes (implemented by `web/mock/mockApi.js`; a real Node backend must match):

| Method & path | Body / response |
|---|---|
| `GET /api/health` | `{mode: "mock" \| "live", ok}` |
| `GET /api/voices` | `[{id, name, lang, gender}]` — ids are edge-tts voice names |
| `POST /api/jobs` | multipart: `meta` (JSON of the form), `images[]`, `clips[]`, `reference`, `voiceover`, `music` → job |
| `GET /api/jobs/:id` | `{id, title, status: running\|done\|cancelled\|error, progress, stages[{k,label,state,pct}], result, error}` |
| `GET /api/jobs` | finished jobs |
| `POST /api/jobs/:id/cancel` | job |
| `GET /api/jobs/:id/video` | MP4 with HTTP Range support (for the player) |
| `GET /api/jobs/:id/download` | MP4 with `Content-Disposition: attachment` |

`result` = `{video_url, download_url, file_name, size_mb, width, height, fps}`.

### `meta` fields

`title, script, ratio, voiceMode ("ai"|"own"), voice, onlineImages, copy[] (reference aspects), style, background,
music ("original"|"upload"|"none"), sfx, captions, intensity ("subtle"|"balanced"|"bold"), quality ("draft"|"hd")`

## Wiring the real engine (next step)

The pieces already exist in `tools/` and `src/`:
1. `tools/*/make_voice.py` → voice clips from `meta.script` (or use the uploaded `voiceover`)
2. `tools/*/make_audio.py` → original BGM + SFX
3. Asset step → uploaded images/clips + Wikimedia/Openverse search when `onlineImages` is on
4. A data-driven Remotion composition that takes the scene plan as input props
5. `npx remotion render <id> out/<job>.mp4` → stream progress back into `stages`
