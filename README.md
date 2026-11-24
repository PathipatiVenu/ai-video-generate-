# AI Video Generate — Remotion short-video studio

Code-generated vertical videos (9:16, 1080×1920) for Instagram Reels, YouTube Shorts and TikTok, built with
[Remotion](https://www.remotion.dev) (React → MP4). Every video has an AI voice-over, synced animations,
transitions, sound effects and background music — and the whole timeline is computed from the voice-over,
so changing the voice automatically re-times every scene.

| Composition ID | Video | Length |
|---|---|---|
| `DockerInstall` | "Docker Installation on Windows 11" — step-by-step tutorial | ~68.6 s |
| `HeatedGloves` | "Electric Heated Gloves" — product advertisement | ~44.1 s |
| `Panchayat` | "Panchayat Elections in India – Explained Simply!" — civic explainer | ~115 s |
| `MyComp` | Empty starter composition from the Remotion template | — |

Everything runs on a normal laptop — no GPU and no paid API needed.

---

## 1. Requirements

Install these once:

| Tool | Version | Needed for | Download |
|---|---|---|---|
| **Node.js** | 20.19+, 22.13+ or 24+ | Preview and render the videos (required) | https://nodejs.org |
| **Git** | any | Cloning the repo | https://git-scm.com |
| **Python** | 3.10+ | *Optional* — only to re-generate voice, music or product crops | https://www.python.org |
| **FFmpeg** | any recent | *Optional* — used by the Python voice script | https://ffmpeg.org (Windows: `winget install Gyan.FFmpeg`) |

Check what you have (PowerShell or any terminal):

```
node --version
git --version
python --version
ffmpeg -version
```

---

## 2. Get the code

```
git clone https://github.com/PathipatiVenu/ai-video-generate-.git
cd ai-video-generate-
```

---

## 3. Install the dependencies

```
npm install
```

This installs Remotion and its packages into `node_modules/` (takes 1–3 minutes the first time).

---

## 4. Preview the videos (Remotion Studio)

```
npm run dev
```

Then open **http://localhost:3000** in your browser.

- In the left sidebar open the **Shorts** folder and click **DockerInstall** or **HeatedGloves**.
- Press **Space** to play, scrub the timeline, and listen with sound on.
- Direct links: http://localhost:3000/DockerInstall, http://localhost:3000/HeatedGloves and http://localhost:3000/Panchayat
- Stop Studio with **Ctrl + C** in the terminal.

---

## 5. Render the videos to MP4

Open a second terminal in the project folder (or stop Studio first) and run:

```
npx remotion render DockerInstall out/docker-install.mp4
npx remotion render HeatedGloves out/heated-gloves.mp4
npx remotion render Panchayat out/panchayat-elections.mp4
```

- The finished files appear in the `out/` folder (this folder is git-ignored).
- The **first render** downloads a headless Chrome (~130 MB) automatically — that's normal.
- Plug your laptop into the charger and close heavy apps for faster renders (a 45–70 s video takes a few minutes).
- You can also render from Studio: open a composition → click **Render** (top right).

Output format: H.264 MP4, 1080×1920, 30 FPS, AAC audio — ready to upload to Reels/Shorts/TikTok.

---

## 6. (Optional) Re-generate voice, music and images

The generated assets are already committed in `public/`, so **you can skip this section** unless you want to
change the script, voice or music.

### 6.1 Install the Python packages (once)

```
pip install edge-tts numpy scipy pillow
```

### 6.2 Change the voice-over

1. Open `tools/heated-gloves/make_voice.py` (or `tools/docker-install/make_voice.py`).
2. Edit the sentences in the `LINES` list (the 2nd column is the script, the 3rd is how the AI pronounces it).
3. Optionally change `VOICE` (e.g. `en-IN-PrabhatNeural`, `en-IN-NeerjaNeural`, `en-US-JennyNeural`) or `RATE`.
4. Run it:

   ```
   python tools/heated-gloves/make_voice.py
   ```

   This creates one WAV per sentence in `public/heated-gloves/voice/`, trims the silence, and rewrites
   `src/HeatedGloves/voice.ts` with the exact durations. Every scene re-times itself automatically.
   (edge-tts uses Microsoft Edge's free online voices — an internet connection is required.)

### 6.3 Re-generate sound effects and background music

```
python tools/docker-install/make_audio.py
python tools/heated-gloves/make_audio.py
python tools/panchayat/make_audio.py
```

All SFX and BGM are synthesized from code (no samples), so there are no music-licensing issues.

### 6.4 Re-crop the product photos (gloves ad)

The product shots are cut from `public/heated-gloves/images/source-collage.png`:

```
python tools/heated-gloves/crop_product.py
```

Adjust the boxes in the `CROPS` dictionary if you replace the collage with a new product image.

### 6.5 Render preview stills (quick visual check)

```
node tools/docker-install/stills.mjs 30 300 900
```

For the gloves ad (PowerShell):

```
$env:COMP="HeatedGloves"; node tools/heated-gloves/stills.mjs 40 240 600 960
```

JPG frames are written to `out/stills/`.

---

## 7. Make a new video from an existing one

1. **Copy the folder** `src/HeatedGloves` → `src/MyNewVideo` (and `tools/heated-gloves` → `tools/my-new-video`).
2. **Assets:** put your images in `public/my-new-video/images/` and change the paths in `src/MyNewVideo/theme.ts`.
3. **Script:** edit `LINES` in `tools/my-new-video/make_voice.py`, change the output folder names inside it, then run it.
4. **Timeline:** in `src/MyNewVideo/timeline.ts` list your sentence IDs per section in `SECTIONS`.
5. **Scenes:** edit the files in `src/MyNewVideo/scenes/` — use `localLine()` / `atWord()` to start animations on specific words.
6. **Register** it in `src/Root.tsx`:

   ```tsx
   <Composition
     id="MyNewVideo"
     component={MyNewVideo}
     durationInFrames={MyTimeline.TOTAL_FRAMES}
     fps={30}
     width={1080}
     height={1920}
   />
   ```

7. Preview with `npm run dev`, then render with `npx remotion render MyNewVideo out/my-new-video.mp4`.

---

## 8. Project structure

```
├── src/
│   ├── index.ts                  # Remotion entry point
│   ├── Root.tsx                  # Registers all compositions
│   ├── Composition.tsx           # Empty starter composition (MyComp)
│   ├── DockerInstall/
│   │   ├── DockerInstall.tsx     # Main composition: scenes, transitions, voice, ducked BGM
│   │   ├── timeline.ts           # All timing, computed from the voice clip lengths
│   │   ├── voice.ts              # AUTO-GENERATED voice clip durations
│   │   ├── theme.ts              # Colours, fonts, asset paths
│   │   ├── components/           # Shared toolkit: grid background, camera, Ken Burns, windows,
│   │   │                         #   cursor, icons, confetti, scene transitions, Beat/Sfx helpers
│   │   └── scenes/               # Hook, Step1–Step4, Ending
│   ├── HeatedGloves/
│   │   ├── HeatedGloves.tsx      # Main composition
│   │   ├── timeline.ts, voice.ts, theme.ts
│   │   ├── components/fx.tsx     # Snow, frost, thermometer, heat glow, USB plug, tap ripples, labels
│   │   └── scenes/               # Hook, Intro, Features, Styles, Price, Cta
│   └── Panchayat/
│       ├── Panchayat.tsx         # Main composition (7 scenes)
│       ├── timeline.ts, voice.ts, theme.ts
│       ├── components/kit.tsx    # Icons, photo cards, section badges, flag card
│       └── scenes/               # Intro, Part1–Part5, Ending
├── public/
│   ├── docker-install/           # images/, voice/, sfx/, bgm/, CREDITS.md
│   ├── heated-gloves/            # images/, voice/, sfx/, bgm/, CREDITS.md
│   └── panchayat/                # images/, voice/, sfx/, bgm/, CREDITS.md
├── tools/
│   ├── docker-install/           # make_voice.py, make_audio.py, stills.mjs, README.md
│   ├── heated-gloves/            # crop_product.py, make_voice.py, make_audio.py, stills.mjs, README.md
│   └── panchayat/                # make_voice.py, make_audio.py, README.md
├── remotion.config.ts            # Remotion CLI settings
├── package.json                  # npm scripts: dev, build, lint
└── out/                          # Rendered MP4s and stills (git-ignored)
```

### How the timing works

1. `make_voice.py` creates one voice clip per sentence and writes their durations to `voice.ts`.
2. `timeline.ts` lays the clips out one after another (with short pauses) and computes each scene's start/end.
3. Each scene starts its animations and sound effects relative to the sentence being spoken
   (`atWord(scene, line, 0.6)` = "60% of the way through that sentence").
4. The background music volume automatically ducks while the voice is speaking.

---

## 9. Useful commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Open Remotion Studio (preview) at http://localhost:3000 |
| `npx remotion render <ID> out/<name>.mp4` | Render a composition to MP4 |
| `npx remotion still <ID> out/frame.png --frame=120` | Render a single frame as an image |
| `npm run lint` | ESLint + TypeScript check |
| `npx remotion upgrade` | Upgrade Remotion packages |

---

## 10. Troubleshooting

| Problem | Fix |
|---|---|
| `npm run dev` says port 3000 is in use | Run `npx remotion studio --port 3001` |
| First render is slow / downloading Chrome | Normal on first run; it's cached afterwards |
| `ModuleNotFoundError: edge_tts` | `pip install edge-tts` (and run the script with the same Python) |
| `ffprobe` / `ffmpeg` not found | Install FFmpeg and reopen the terminal so it's on your PATH |
| No sound in Studio | Click the speaker icon in Studio's toolbar to unmute |
| Render runs out of memory | Close other apps, or add `--concurrency=2` to the render command |

---

## 11. Credits & licences

- Image, voice and sound-effect sources and licences are listed in
  `public/docker-install/CREDITS.md`, `public/heated-gloves/CREDITS.md` and `public/panchayat/CREDITS.md`.
  Some photos are **CC BY / CC BY-SA** — paste the credit line from those files into your post description.
- Product photos in `public/heated-gloves/images/` come from the product listing image.
- Docker, Windows and Walmart names/logos are trademarks of their owners; they appear only to describe the products.
- Verify prices and store availability shown in the product ad before publishing it.
- Remotion is free for individuals and small companies; larger companies need a licence —
  see https://www.remotion.dev/license.
