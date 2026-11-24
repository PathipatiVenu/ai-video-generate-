"""Generate the AI voice-over for the "Panchayat Elections in India" explainer.

One MP3 per script line (so every scene can sync exactly to its line),
then writes src/DockerInstall/voice.ts with each clip's duration.

Run:  python -I tools/panchayat/make_voice.py
Needs: pip install edge-tts   (uses Microsoft Edge online neural voices)
"""
import asyncio
import json
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "public" / "panchayat" / "voice"
TS_OUT = ROOT / "src" / "Panchayat" / "voice.ts"

VOICE = "en-IN-PrabhatNeural"  # natural Indian English male voice
RATE = "+5%"

# id, exact script line (shown in code for reference), spoken form for TTS.
# Spoken form only changes HOW commands are pronounced, never the words.
LINES = [
    ('doYouKnow', 'Do you know how Panchayat elections work in India?',
     'Do you know how Panchayat elections work in India?'),
    ('questions', 'Who can contest, how many villages come under one Panchayat, and what powers does a person get after winning?',
     'Who can contest? How many villages come under one Panchayat? And what powers does a person get after winning?'),
    ('letsUnderstand', "Let's understand!",
     "Let's understand!"),
    ('gpIs', 'A Gram Panchayat is a local government body that looks after village development.',
     'A Gram Panchayat is a local government body that looks after village development.'),
    ('gpCover', 'One Gram Panchayat may cover one village or a group of nearby villages.',
     'One Gram Panchayat may cover one village or a group of nearby villages.'),
    ('noFixed', 'There is no fixed number of villages for every Panchayat.',
     'There is no fixed number of villages for every Panchayat.'),
    ('depends', 'It depends on population and state government rules.',
     'It depends on population and state government rules.'),
    ('age21', 'Generally, a person must be at least 21 years old and their name must be on the relevant electoral roll.',
     'Generally, a person must be at least twenty-one years old, and their name must be on the relevant electoral roll.'),
    ('stateLaws', "They must also satisfy the other eligibility conditions under their state's Panchayat laws.",
     "They must also satisfy the other eligibility conditions under their state's Panchayat laws."),
    ('reserved', 'Some seats are reserved for women and eligible communities.',
     'Some seats are reserved for women and eligible communities.'),
    ('winsHead', 'If a person wins the Sarpanch election, they become the head of the Gram Panchayat.',
     'If a person wins the Sarpanch election, they become the head of the Gram Panchayat.'),
    ('duties', 'They help lead village development activities, coordinate with government officials, attend Panchayat meetings and work to solve local problems.',
     'They help lead village development activities, coordinate with government officials, attend Panchayat meetings, and work to solve local problems.'),
    ('respInclude', 'Their responsibilities include:',
     'Their responsibilities include:'),
    ('roads', 'Improving village roads.',
     'Improving village roads.'),
    ('water', 'Arranging drinking water facilities.',
     'Arranging drinking water facilities.'),
    ('lights', 'Maintaining streetlights and sanitation.',
     'Maintaining streetlights and sanitation.'),
    ('schemes', 'Supporting government welfare schemes.',
     'Supporting government welfare schemes.'),
    ('plan', 'Helping plan village development projects.',
     'Helping plan village development projects.'),
    ('gramSabha', 'Working with the Gram Sabha and Panchayat members.',
     'Working with the Gram Sabha and Panchayat members.'),
    ('threeLevels', 'India generally has three levels of Panchayat governance:',
     'India generally has three levels of Panchayat governance:'),
    ('first', 'First, Gram Panchayat at the village level.',
     'First, Gram Panchayat at the village level.'),
    ('second', 'Second, Mandal or Block Panchayat at the intermediate level.',
     'Second, Mandal or Block Panchayat at the intermediate level.'),
    ('third', 'Third, Zilla Parishad at the district level.',
     'Third, Zilla Parishad at the district level.'),
    ('remember', 'Remember, winning a Panchayat election is not just about getting a position. It is about taking responsibility for village development.',
     'Remember, winning a Panchayat election is not just about getting a position... It is about taking responsibility for village development.'),
    ('share', 'Share this video with others and follow for more simple explanations about Indian government and elections!',
     'Share this video with others and follow for more simple explanations about Indian government and elections!'),
]


def duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return float(out)


async def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TS_OUT.parent.mkdir(parents=True, exist_ok=True)
    result = []
    for line_id, script, spoken in LINES:
        raw = OUT_DIR / f"{line_id}.raw.mp3"
        target = OUT_DIR / f"{line_id}.wav"
        await edge_tts.Communicate(spoken, VOICE, rate=RATE).save(str(raw))
        # Trim leading/trailing silence so scene timing follows the actual speech.
        trim = ("silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,"
                "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af", trim,
                        "-ar", "48000", "-ac", "1", str(target)], check=True)
        raw.unlink()
        secs = duration(target)
        result.append({"id": line_id, "file": f"panchayat/voice/{line_id}.wav",
                       "seconds": round(secs, 3), "script": script})
        print(f"{line_id:12s} {secs:6.2f}s  {script}")

    body = json.dumps(result, indent=2)
    TS_OUT.write_text(
        "// AUTO-GENERATED by tools/panchayat/make_voice.py — do not edit by hand.\n"
        "export type VoiceLine = {id: string; file: string; seconds: number; script: string};\n\n"
        f"export const VOICE_LINES: VoiceLine[] = {body};\n",
        encoding="utf-8",
    )
    print("total speech:", round(sum(r["seconds"] for r in result), 2), "s")


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
