"""Synthesize original SFX + BGM for the "Docker Installation" video.

Everything here is generated from math (no samples), so the rights are clear.
Run:  python tools/docker-install/make_audio.py
Outputs: public/docker-install/sfx/synth-*.wav, public/docker-install/bgm/bgm.wav
"""
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, sosfilt_zi  # noqa: F401

SR = 48000
ROOT = Path(__file__).resolve().parents[2]
SFX = ROOT / "public" / "docker-install" / "sfx"
BGM = ROOT / "public" / "docker-install" / "bgm"
rng = np.random.default_rng(7)


def t_axis(sec):
    return np.arange(int(sec * SR)) / SR


def save(path, x, peak=0.9):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    m = np.max(np.abs(x)) or 1.0
    x = x / m * peak
    wavfile.write(path, SR, (x * 32767).astype(np.int16))
    print("wrote", path.relative_to(ROOT), f"{len(x) / SR:.2f}s")


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def swept_band(noise, f_start, f_end, width=0.6, blocks=120):
    """Band-pass noise whose centre frequency glides (block-wise filtering)."""
    out = np.zeros_like(noise)
    n = len(noise)
    edges = np.linspace(0, n, blocks + 1).astype(int)
    for i in range(blocks):
        a, b = edges[i], edges[i + 1]
        fc = f_start * (f_end / f_start) ** (i / blocks)
        lo, hi = fc * (1 - width / 2), min(fc * (1 + width / 2), SR / 2 - 100)
        pad = min(a, 2048)
        seg = bp(noise[a - pad:b], lo, hi)
        out[a:b] = seg[pad:]
    return out


# ---------------------------------------------------------------- SFX
def whoosh():
    t = t_axis(0.75)
    env = np.sin(np.pi * np.clip(t / 0.75, 0, 1)) ** 2.2
    n = rng.standard_normal(len(t))
    x = swept_band(n, 400, 3500) * env
    pan = np.linspace(-0.8, 0.8, len(t))
    return np.stack([x * (1 - pan) / 2, x * (1 + pan) / 2], axis=1)


def riser():
    t = t_axis(1.6)
    env = (t / 1.6) ** 2.0
    n = swept_band(rng.standard_normal(len(t)), 300, 6000, width=0.4)
    f = 180 * (8 ** (t / 1.6))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.35
    x = (n + tone) * env
    x[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))
    return x


def impact():
    t = t_axis(1.4)
    f = 95 * np.exp(-t * 3) + 38
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6)
    thump = lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 28) * 0.8
    air = hp(rng.standard_normal(len(t)), 4000) * np.exp(-t * 9) * 0.08
    return sub + thump + air


def pop():
    t = t_axis(0.16)
    f = 520 + 900 * (1 - np.exp(-t * 60))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 32)


def tick():
    t = t_axis(0.09)
    return bp(rng.standard_normal(len(t)), 1800, 5200) * np.exp(-t * 90) + \
        np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 70) * 0.4


def key_click(length=0.05):
    t = t_axis(length)
    body = bp(rng.standard_normal(len(t)), 1200 + rng.uniform(-300, 300), 6000) * np.exp(-t * 140)
    thock = np.sin(2 * np.pi * rng.uniform(180, 260) * t) * np.exp(-t * 90) * 0.5
    return body + thock


def typing(sec=1.8, rate=13):
    out = np.zeros(int(sec * SR))
    pos = 0.02
    while pos < sec - 0.06:
        c = key_click() * rng.uniform(0.55, 1.0)
        i = int(pos * SR)
        out[i:i + len(c)] += c
        pos += rng.uniform(0.6, 1.4) / rate
    return out


def enter_key():
    c = key_click(0.12) * 1.3
    return np.concatenate([c, np.zeros(int(0.05 * SR))])


def chime(notes, step=0.085, sec=1.6):
    out = np.zeros(int(sec * SR))
    for k, f in enumerate(notes):
        t = t_axis(sec - k * step)
        partials = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.01 * t)
                    + 0.12 * np.sin(2 * np.pi * f * 3.98 * t))
        s = partials * np.exp(-t * 3.2) * (1 - np.exp(-t * 400))
        i = int(k * step * SR)
        out[i:i + len(s)] += s
    return out


def notify():
    return chime([1318.5, 1975.5], step=0.11, sec=0.9)


def success():
    return chime([1046.5, 1318.5, 1568.0, 2093.0], step=0.08, sec=1.8)


def shimmer():
    t = t_axis(1.2)
    x = np.zeros(len(t))
    for f in [2093, 2637, 3136, 3951, 4186]:
        x += np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(5, 11) * t))
    env = np.sin(np.pi * np.clip(t / 1.2, 0, 1)) ** 1.5
    return x * env * 0.3 + swept_band(rng.standard_normal(len(t)), 3000, 9000, 0.5) * env * 0.25


# ---------------------------------------------------------------- BGM
def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def saw(f, t, detune=0.0):
    ph = (f * (1 + detune)) * t
    return 2 * (ph - np.floor(ph + 0.5))


def bgm(sec=80.0, bpm=100):
    beat = 60 / bpm
    bar = 4 * beat
    n = int(sec * SR)
    t = np.arange(n) / SR
    L = np.zeros(n)
    R = np.zeros(n)

    # A minor hopeful loop: Am - F - C - G (2 bars each)
    prog = [(57, [57, 60, 64, 69]), (53, [53, 57, 60, 65]), (48, [55, 60, 64, 67]), (55, [55, 59, 62, 67])]
    chord_len = 2 * bar

    # --- pads (detuned saws, low-passed, slow swell per chord)
    for ci in range(int(np.ceil(sec / chord_len))):
        root, notes = prog[ci % 4]
        a = int(ci * chord_len * SR)
        b = min(n, int((ci + 1) * chord_len * SR) + int(0.4 * SR))
        if a >= n:
            break
        tt = t[: b - a]
        env = np.clip(tt / 0.9, 0, 1) * np.clip((tt[-1] - tt) / 0.5, 0, 1)
        for note in notes:
            f = midi(note)
            L[a:b] += (saw(f, tt, -0.004) + saw(f, tt, 0.003)) * env * 0.05
            R[a:b] += (saw(f, tt, 0.004) + saw(f, tt, -0.002)) * env * 0.05
    L, R = lp(L, 1400), lp(R, 1500)

    # --- arpeggio pluck (8ths), enters at bar 2
    arp = np.zeros(n)
    eighth = beat / 2
    pattern = [0, 1, 2, 3, 2, 1, 3, 2]
    for k in range(int(sec / eighth)):
        start = k * eighth
        if start < bar * 2 or start > sec - bar * 2:
            continue
        ci = int(start // chord_len) % 4
        note = prog[ci][1][pattern[k % 8]] + 12
        tt = t_axis(0.5)
        s = (np.sin(2 * np.pi * midi(note) * tt) + 0.3 * saw(midi(note), tt)) * np.exp(-tt * 9) * (1 - np.exp(-tt * 600))
        i = int(start * SR)
        seg = s[: max(0, min(len(s), n - i))]
        arp[i:i + len(seg)] += seg * (0.9 if k % 2 == 0 else 0.6)
    arp = lp(arp, 4200) * 0.16
    # ping-pong-ish stereo delay
    d = int(eighth * 1.5 * SR)
    L += arp + np.concatenate([np.zeros(d), arp[:-d]]) * 0.35
    R += arp * 0.8 + np.concatenate([np.zeros(d // 2), arp[:-(d // 2)]]) * 0.4

    # --- sub bass pulse on 8ths, enters bar 4
    bass = np.zeros(n)
    for k in range(int(sec / eighth)):
        start = k * eighth
        if start < bar * 4 or start > sec - bar:
            continue
        ci = int(start // chord_len) % 4
        f = midi(prog[ci][0] - 12)
        tt = t_axis(eighth * 0.95)
        s = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 3) * (1 - np.exp(-tt * 300))
        i = int(start * SR)
        seg = s[: max(0, min(len(s), n - i))]
        bass[i:i + len(seg)] += seg * 0.22

    # --- soft kick on beats + hats on off-beats, enter bar 4
    drums = np.zeros(n)
    for k in range(int(sec / beat)):
        start = k * beat
        if start < bar * 4 or start > sec - bar:
            continue
        tt = t_axis(0.35)
        f = 110 * np.exp(-tt * 30) + 45
        kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 10)
        i = int(start * SR)
        seg = kick[: max(0, min(len(kick), n - i))]
        drums[i:i + len(seg)] += seg * 0.35
        hs = int((start + beat / 2) * SR)
        hat = hp(rng.standard_normal(int(0.05 * SR)), 7000) * np.exp(-t_axis(0.05) * 80) * 0.07
        seg = hat[: max(0, min(len(hat), n - hs))]
        drums[hs:hs + len(seg)] += seg
    # sidechain pump on pads from kick
    pump = np.ones(n)
    for k in range(int(sec / beat)):
        start = k * beat
        if start < bar * 4:
            continue
        i = int(start * SR)
        w = t_axis(beat)
        seg = 1 - 0.35 * np.exp(-w * 9)
        seg = seg[: max(0, min(len(seg), n - i))]
        pump[i:i + len(seg)] = seg
    L, R = L * pump + bass + drums, R * pump + bass + drums

    # fade in/out
    fade = np.clip(t / 2.0, 0, 1) * np.clip((sec - t) / 4.0, 0, 1)
    return np.stack([L * fade, R * fade], axis=1)


if __name__ == "__main__":
    SFX.mkdir(parents=True, exist_ok=True)
    BGM.mkdir(parents=True, exist_ok=True)
    save(SFX / "synth-whoosh.wav", whoosh(), 0.8)
    save(SFX / "synth-riser.wav", riser(), 0.7)
    save(SFX / "synth-impact.wav", impact(), 0.95)
    save(SFX / "synth-pop.wav", pop(), 0.7)
    save(SFX / "synth-tick.wav", tick(), 0.7)
    save(SFX / "synth-typing.wav", typing(), 0.6)
    save(SFX / "synth-enter.wav", enter_key(), 0.7)
    save(SFX / "synth-notify.wav", notify(), 0.6)
    save(SFX / "synth-success.wav", success(), 0.7)
    save(SFX / "synth-shimmer.wav", shimmer(), 0.5)
    save(BGM / "bgm.wav", bgm(), 0.85)
