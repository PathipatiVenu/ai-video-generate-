"""Synthesize SFX + an Indian-flavoured cinematic BGM for the Panchayat explainer.

Reuses the synth building blocks from tools/docker-install/make_audio.py.
Everything is generated from math (no samples), so the rights are clear.
Run:  python tools/panchayat/make_audio.py
"""
import importlib.util
import shutil
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("base", ROOT / "tools" / "docker-install" / "make_audio.py")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)

SR = base.SR
SFX = ROOT / "public" / "panchayat" / "sfx"
BGM = ROOT / "public" / "panchayat" / "bgm"
rng = np.random.default_rng(21)
t_axis, bp, lp, hp, save, midi = base.t_axis, base.bp, base.lp, base.hp, base.save, base.midi


def stamp():
    """Rubber-stamp / ballot thud."""
    t = t_axis(0.5)
    thud = np.sin(2 * np.pi * np.cumsum(140 * np.exp(-t * 25) + 60) / SR) * np.exp(-t * 18)
    slap = bp(rng.standard_normal(len(t)), 600, 4000) * np.exp(-t * 60) * 0.7
    return thud + slap


def page():
    """Paper flick for documents/lists."""
    t = t_axis(0.35)
    env = np.sin(np.pi * np.clip(t / 0.35, 0, 1)) ** 2
    return base.swept_band(rng.standard_normal(len(t)), 1800, 6000, width=0.8) * env


def tabla_dha(t):
    f = 95 * np.exp(-t * 6) + 70
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) + bp(rng.standard_normal(len(t)), 1500, 5000) * np.exp(-t * 50) * 0.25


def tabla_ta(t):
    return (np.sin(2 * np.pi * 520 * t) * 0.6 + np.sin(2 * np.pi * 1180 * t) * 0.3) * np.exp(-t * 22) + \
        bp(rng.standard_normal(len(t)), 2500, 8000) * np.exp(-t * 70) * 0.2


def pluck(f, sec=1.4):
    """Sitar-ish pluck: bright saw with slight upward bend and buzzing decay."""
    t = t_axis(sec)
    bend = f * (1 + 0.012 * (1 - np.exp(-t * 18)))
    ph = np.cumsum(bend) / SR
    tone = 2 * (ph - np.floor(ph + 0.5))
    buzz = np.sin(2 * np.pi * ph * 3) * 0.25
    return lp((tone + buzz) * np.exp(-t * 3.2) * (1 - np.exp(-t * 500)), 4500)


def bgm(sec=130.0, bpm=92):
    beat = 60 / bpm
    bar = 4 * beat
    n = int(sec * SR)
    t = np.arange(n) / SR
    L = np.zeros(n)
    R = np.zeros(n)

    # tanpura-style drone: D (Sa) + A (Pa) + D', slow shimmering
    for note, amp, det in [(50, 0.07, 0.0), (57, 0.05, 0.002), (62, 0.05, -0.002), (38, 0.06, 0.0)]:
        f = midi(note)
        wob = 1 + 0.25 * np.sin(2 * np.pi * (0.11 + det * 30) * t)
        L += (base.saw(f, t, det) * 0.6 + np.sin(2 * np.pi * f * t)) * amp * wob
        R += (base.saw(f, t, -det) * 0.6 + np.sin(2 * np.pi * f * t)) * amp * (2 - wob)
    L, R = lp(L, 1500), lp(R, 1600)

    # warm pad chords (D, G, A, D) under the drone
    prog = [[62, 66, 69], [62, 67, 71], [61, 64, 69], [62, 66, 69]]
    chord_len = 2 * bar
    pad = np.zeros(n)
    for ci in range(int(np.ceil(sec / chord_len))):
        a = int(ci * chord_len * SR)
        b = min(n, int((ci + 1) * chord_len * SR) + int(0.5 * SR))
        if a >= n:
            break
        tt = t[: b - a]
        env = np.clip(tt / 1.2, 0, 1) * np.clip((tt[-1] - tt) / 0.8, 0, 1)
        for note in prog[ci % 4]:
            pad[a:b] += np.sin(2 * np.pi * midi(note) * tt) * env * 0.04
    L += pad
    R += pad

    # sitar-ish melody on a D major pentatonic phrase, enters bar 3
    scale = [62, 64, 66, 69, 71, 74, 76]
    phrase = [0, 2, 3, 4, 3, 2, 1, 0, 3, 4, 5, 4, 3, 2, 3, None]
    eighth = beat / 2
    mel = np.zeros(n)
    for k in range(int(sec / eighth)):
        start = k * eighth
        p = phrase[k % 16]
        if p is None or start < bar * 2 or start > sec - bar * 2 or (k % 32) >= 24:
            continue
        s = pluck(midi(scale[p]), 1.2) * (0.9 if k % 2 == 0 else 0.6)
        i = int(start * SR)
        seg = s[: max(0, min(len(s), n - i))]
        mel[i:i + len(seg)] += seg
    mel *= 0.09
    d = int(beat * 0.75 * SR)
    L += mel + np.concatenate([np.zeros(d), mel[:-d]]) * 0.3
    R += mel * 0.8 + np.concatenate([np.zeros(d // 2), mel[:-(d // 2)]]) * 0.35

    # soft tabla-like groove (keherwa-ish 8-beat feel), enters bar 4
    groove = ['dha', None, 'ta', 'ta', 'dha', None, 'ta', None]
    perc = np.zeros(n)
    for k in range(int(sec / eighth)):
        start = k * eighth
        hit = groove[k % 8]
        if hit is None or start < bar * 4 or start > sec - bar:
            continue
        tt = t_axis(0.4)
        s = tabla_dha(tt) * 0.30 if hit == 'dha' else tabla_ta(tt) * 0.16
        i = int(start * SR)
        seg = s[: max(0, min(len(s), n - i))]
        perc[i:i + len(seg)] += seg
    L += perc
    R += perc

    fade = np.clip(t / 2.5, 0, 1) * np.clip((sec - t) / 4.0, 0, 1)
    return np.stack([L * fade, R * fade], axis=1)


if __name__ == "__main__":
    SFX.mkdir(parents=True, exist_ok=True)
    BGM.mkdir(parents=True, exist_ok=True)
    save(SFX / "synth-whoosh.wav", base.whoosh(), 0.8)
    save(SFX / "synth-riser.wav", base.riser(), 0.7)
    save(SFX / "synth-impact.wav", base.impact(), 0.95)
    save(SFX / "synth-pop.wav", base.pop(), 0.7)
    save(SFX / "synth-tick.wav", base.tick(), 0.7)
    save(SFX / "synth-notify.wav", base.notify(), 0.6)
    save(SFX / "synth-success.wav", base.success(), 0.7)
    save(SFX / "synth-shimmer.wav", base.shimmer(), 0.5)
    save(SFX / "synth-typing.wav", base.typing(), 0.6)
    save(SFX / "synth-stamp.wav", stamp(), 0.85)
    save(SFX / "synth-page.wav", page(), 0.6)
    save(BGM / "bgm.wav", bgm(), 0.85)
    src = ROOT / "public" / "docker-install" / "sfx"
    for name in ["whoosh", "whip", "mouse-click", "ding", "switch"]:
        shutil.copy(src / f"{name}.wav", SFX / f"{name}.wav")
    print("copied Remotion example SFX")
