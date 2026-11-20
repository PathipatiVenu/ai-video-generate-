# Electric Heated Gloves — Remotion ad

- Composition ID: `HeatedGloves` (Shorts folder in Studio)
- 1080 × 1920 (9:16), 30 FPS, ~44.1 s (length comes from the AI voice-over)
- Reuses the shared toolkit in `src/DockerInstall/components/` (camera, Ken Burns, transitions, cursor, confetti)

## Preview
    cd C:\Users\venup\Ai-Video-editing
    npm run dev
Open http://localhost:3000/HeatedGloves

## Render
    npx remotion render HeatedGloves out\heated-gloves.mp4

## Files
| Path | What |
|---|---|
| src/HeatedGloves/HeatedGloves.tsx | Main composition: 6 scenes, transitions, voice, ducked BGM |
| src/HeatedGloves/timeline.ts | Timing from the voice clips (`atWord` hits specific words) |
| src/HeatedGloves/theme.ts | Winter→warm palette, asset paths |
| src/HeatedGloves/components/fx.tsx | Snow, frost, thermometer, heat glow, USB plug, tap ripples, labels |
| src/HeatedGloves/scenes/ | Hook, Intro, Features, Styles, Price, CTA |
| public/heated-gloves/ | images/, voice/, sfx/, bgm/, CREDITS.md |
| tools/heated-gloves/crop_product.py | Cuts your collage into product shots |
| tools/heated-gloves/make_voice.py | AI voice (edge-tts, en-IN-PrabhatNeural) |
| tools/heated-gloves/make_audio.py | Synth SFX + warm BGM |

## New product next time
1. Put the product image in public/<name>/images and adjust the crop boxes.
2. Put your script lines in make_voice.py and run it.
3. Copy src/HeatedGloves → src/<Name>, swap images/labels, register in src/Root.tsx.
