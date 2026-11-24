# Panchayat Elections in India – Explained Simply (Remotion)

- Composition ID: `Panchayat` (Shorts folder in Studio)
- 1080 × 1920 (9:16), 30 FPS, ~115 s (length comes from the AI voice-over, 25 sentence clips)
- Style: cinematic educational, light tricolour grids, real Wikimedia photos, icon diagrams

## Preview / render
    npm run dev                      # open http://localhost:3000/Panchayat
    npx remotion render Panchayat out/panchayat-elections.mp4

## Files
| Path | What |
|---|---|
| src/Panchayat/Panchayat.tsx | Main composition: 7 scenes, transitions, voice, ducked BGM |
| src/Panchayat/timeline.ts | Timing from the voice clips (`atWord` hits specific words) |
| src/Panchayat/theme.ts | Tricolour palette, asset paths |
| src/Panchayat/components/kit.tsx | Icons, photo cards, section badges, flag card, icon tiles |
| src/Panchayat/scenes/ | Intro, Part1–Part5, Ending |
| public/panchayat/ | images/, voice/, sfx/, bgm/, CREDITS.md |
| tools/panchayat/make_voice.py | AI voice (edge-tts, en-IN-PrabhatNeural) |
| tools/panchayat/make_audio.py | Synth SFX + Indian-flavoured BGM (drone, plucks, tabla-like groove) |

Photo credits (CC BY / CC BY-SA) are in public/panchayat/CREDITS.md — add them to the post description.
