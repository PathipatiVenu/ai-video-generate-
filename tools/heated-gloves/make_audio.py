"""Synthesize SFX + a warm, cozy BGM for the "Electric Heated Gloves" ad.

Reuses the synth building blocks from tools/docker-install/make_audio.py and
adds winter/shopping sounds (icy wind, freeze crackle, heat whoosh, cash register).
Run:  python tools/heated-gloves/make_audio.py
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
SFX = ROOT / "public" / "heated-gloves" / "sfx"
BGM = ROOT / "public" / "heated-gloves" / "bgm"
rng = np.random.default_rng(11)
t_axis, bp, lp, hp, swept_band, save = base.t_axis, base.bp, base.lp, base.hp, base.swept_band, base.save


def icy_wind(sec=3.0):
    t = t_axis(sec)
    n = rng.standard_normal(len(t))
    gust = 0.55 + 0.45 * np.sin(2 * np.pi * 0.45 * t) * np.sin(2 * np.pi * 0.17 * t + 1)
    x = swept_band(n, 500, 1400, width=0.5) * gust + hp(n, 3000) * 0.08
    env = np.clip(t / 0.4, 0, 1) * np.clip((sec - t) / 0.8, 0, 1)
    return x * env


def freeze():
    """Icy crackle: many tiny high clicks with a cold shimmer."""
    sec = 1.1
    out = np.zeros(int(sec * SR))
    for _ in range(90):
        at = rng.uniform(0, sec * 0.8)
        c = bp(rng.standard_normal(int(0.012 * SR)), 3000, 11000) * rng.uniform(0.2, 1)
        i = int(at * SR)
        out[i:i + len(c)] += c * np.exp(-at * 2.5)
    return out + base.shimmer()[: len(out)] * 0.4


def heat_whoosh():
    """Warm rising whoosh with a low 'glow' tone."""
    t = t_axis(1.4)
    env = np.sin(np.pi * np.clip(t / 1.4, 0, 1)) ** 1.6
    air = swept_band(rng.standard_normal(len(t)), 200, 1600, width=0.7) * env
    glow = np.sin(2 * np.pi * np.cumsum(110 + 90 * t / 1.4) / SR) * env * 0.5
    return air + glow


def cash_register():
    """'Ka-ching': drawer thunk + bright bell."""
    thunk = base.impact()[: int(0.25 * SR)] * 0.5
    bell = base.chime([2093.0, 2637.0, 3136.0], step=0.03, sec=1.4)
    out = np.zeros(int(1.6 * SR))
    out[: len(thunk)] += thunk
    i = int(0.12 * SR)
    out[i:i + len(bell)] += bell[: len(out) - i] * 1.2
    return out


def send():
    """Share 'swoosh-up' for the share CTA."""
    t = t_axis(0.5)
    f = 500 * (6 ** (t / 0.5))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5) * 0.5
    return tone + swept_band(rng.standard_normal(len(t)), 800, 6000, 0.5) * np.sin(np.pi * t / 0.5) * 0.6


def bgm(sec=52.0, bpm=104):
    """Cozy, warm loop in D major with soft bells — lighter than the Docker track."""
    beat = 60 / bpm
    bar = 4 * beat
    n = int(sec * SR)
    t = np.arange(n) / SR
    L = np.zeros(n)
    R = np.zeros(n)
    m = base.midi
    prog = [(50, [62, 66, 69, 74]), (47, [59, 62, 66, 71]), (43, [55, 59, 62, 67]), (45, [57, 61, 64, 69])]  # D Bm G A
    chord_len = 2 * bar
    for ci in range(int(np.ceil(sec / chord_len))):
        root, notes = prog[ci % 4]
        a = int(ci * chord_len * SR)
        b = min(n, int((ci + 1) * chord_len * SR) + int(0.4 * SR))
        if a >= n:
            break
        tt = t[: b - a]
        env = np.clip(tt / 0.6, 0, 1) * np.clip((tt[-1] - tt) / 0.5, 0, 1)
        for note in notes:
            f = m(note)
            L[a:b] += (base.saw(f, tt, -0.003) + np.sin(2 * np.pi * f * tt)) * env * 0.04
            R[a:b] += (base.saw(f, tt, 0.003) + np.sin(2 * np.pi * f * tt)) * env * 0.04
    L, R = lp(L, 1800), lp(R, 1900)

    # glockenspiel-style bells on a syncopated pattern
    eighth = beat / 2
    bells = np.zeros(n)
    pattern = [0, None, 2, 1, None, 3, 2, None]
    for k in range(int(sec / eighth)):
        start = k * eighth
        p = pattern[k % 8]
        if p is None or start < bar or start > sec - bar:
            continue
        ci = int(start // chord_len) % 4
        f = m(prog[ci][1][p] + 12)
        tt = t_axis(0.9)
        s = (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 8)) * np.exp(-tt * 4.5)
        i = int(start * SR)
        seg = s[: max(0, min(len(s), n - i))]
        bells[i:i + len(seg)] += seg
    bells = bells * 0.12
    d = int(beat * 0.75 * SR)
    L += bells + np.concatenate([np.zeros(d), bells[:-d]]) * 0.3
    R += bells * 0.85 + np.concatenate([np.zeros(d // 2), bells[:-(d // 2)]]) * 0.35

    # soft groove: kick, snap on 2 & 4, shaker 8ths, plucked bass
    drums = np.zeros(n)
    for k in range(int(sec / beat)):
        start = k * beat
        if start < bar * 2 or start > sec - bar:
            continue
        i = int(start * SR)
        if k % 2 == 0:
            tt = t_axis(0.3)
            kick = np.sin(2 * np.pi * np.cumsum(100 * np.exp(-tt * 28) + 48) / SR) * np.exp(-tt * 11)
            seg = kick[: max(0, min(len(kick), n - i))]
            drums[i:i + len(seg)] += seg * 0.32
        else:
            snap = bp(rng.standard_normal(int(0.12 * SR)), 1200, 6000) * np.exp(-t_axis(0.12) * 35)
            seg = snap[: max(0, min(len(snap), n - i))]
            drums[i:i + len(seg)] += seg * 0.12
        for half in (0, 0.5):
            j = int((start + half * beat) * SR)
            sh = hp(rng.standard_normal(int(0.06 * SR)), 6500) * np.exp(-t_axis(0.06) * 60) * 0.05
            seg = sh[: max(0, min(len(sh), n - j))]
            drums[j:j + len(seg)] += seg
        ci = int(start // chord_len) % 4
        tt = t_axis(beat * 0.9)
        bass = np.sin(2 * np.pi * m(prog[ci][0]) * tt) * np.exp(-tt * 4) * (1 - np.exp(-tt * 400))
        seg = bass[: max(0, min(len(bass), n - i))]
        drums[i:i + len(seg)] += seg * 0.2
    L, R = L + drums, R + drums
    fade = np.clip(t / 1.5, 0, 1) * np.clip((sec - t) / 3.0, 0, 1)
    return np.stack([L * fade, R * fade], axis=1)


if __name__ == "__main__":
    SFX.mkdir(parents=True, exist_ok=True)
    BGM.mkdir(parents=True, exist_ok=True)
    # shared sounds from the Docker video's generator
    save(SFX / "synth-whoosh.wav", base.whoosh(), 0.8)
    save(SFX / "synth-riser.wav", base.riser(), 0.7)
    save(SFX / "synth-impact.wav", base.impact(), 0.95)
    save(SFX / "synth-pop.wav", base.pop(), 0.7)
    save(SFX / "synth-tick.wav", base.tick(), 0.7)
    save(SFX / "synth-notify.wav", base.notify(), 0.6)
    save(SFX / "synth-success.wav", base.success(), 0.7)
    save(SFX / "synth-shimmer.wav", base.shimmer(), 0.5)
    # new winter / shopping sounds
    save(SFX / "synth-wind.wav", icy_wind(), 0.6)
    save(SFX / "synth-freeze.wav", freeze(), 0.6)
    save(SFX / "synth-heat.wav", heat_whoosh(), 0.75)
    save(SFX / "synth-cash.wav", cash_register(), 0.8)
    save(SFX / "synth-send.wav", send(), 0.6)
    save(BGM / "bgm.wav", bgm(), 0.85)
    # Remotion example SFX already downloaded for the Docker video
    src = ROOT / "public" / "docker-install" / "sfx"
    for name in ["whoosh", "whip", "mouse-click", "ding", "switch"]:
        shutil.copy(src / f"{name}.wav", SFX / f"{name}.wav")
    print("copied Remotion example SFX")
