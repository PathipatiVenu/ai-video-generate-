# Docker Installation on Windows 11 — Remotion short

- Composition ID: `DockerInstall` (in the "Shorts" folder in Studio)
- 1080 × 1920 (9:16), 30 FPS, ~68.6 s — length comes from the AI voice-over
- Style: cinematic educational, light grid backgrounds, Docker blue

## Preview
```
cd C:\Users\venup\Ai-Video-editing
npm run dev
```
Open http://localhost:3000/DockerInstall

## Render
```
cd C:\Users\venup\Ai-Video-editing
npx remotion render DockerInstall out\docker-install.mp4
```

## Files
| Path | What |
|---|---|
| src/DockerInstall/DockerInstall.tsx | Main composition: scenes, transitions, voice, BGM ducking |
| src/DockerInstall/timeline.ts | All timing, computed from the voice clip lengths |
| src/DockerInstall/voice.ts | Auto-generated voice clip durations |
| src/DockerInstall/theme.ts | Colours, fonts, asset paths |
| src/DockerInstall/components/ | Grid background, camera, Ken Burns, windows, cursor, icons, confetti, transitions |
| src/DockerInstall/scenes/ | Hook, Step 1–4, Ending |
| public/docker-install/ | images/, voice/, sfx/, bgm/, CREDITS.md |
| tools/docker-install/make_voice.py | Re-generates the AI voice (edge-tts, en-IN-PrabhatNeural) |
| tools/docker-install/make_audio.py | Re-generates the synth SFX + BGM |
| tools/docker-install/stills.mjs | Renders preview stills of chosen frames |

## Change the voice
Edit `VOICE` / `RATE` in make_voice.py, then:
```
python tools/docker-install/make_voice.py
```
Every scene re-times itself automatically.

## Credits
See public/docker-install/CREDITS.md. Add the CC BY / CC BY-SA photo credits to your post description.
