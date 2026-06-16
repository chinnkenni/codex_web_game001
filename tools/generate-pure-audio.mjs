import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "assets", "audio");
const sampleRate = 44100;

function rng(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0xffffffff;
  };
}

function clamp(value, min = -0.98, max = 0.98) {
  return Math.max(min, Math.min(max, value));
}

function envelope(index, total, fadeSeconds = 0.35) {
  const fade = Math.max(1, Math.floor(sampleRate * fadeSeconds));
  const head = Math.min(1, index / fade);
  const tail = Math.min(1, (total - index - 1) / fade);
  return Math.min(head, tail);
}

function sine(time, hz, phase = 0) {
  return Math.sin(time * Math.PI * 2 * hz + phase);
}

function addDecayingTone(samples, startSeconds, hz, gain, decaySeconds, phase = 0) {
  const start = Math.floor(startSeconds * sampleRate);
  const length = Math.floor(decaySeconds * sampleRate);
  for (let i = 0; i < length && start + i < samples.length; i += 1) {
    const t = i / sampleRate;
    const env = Math.exp(-t / Math.max(0.001, decaySeconds * 0.28));
    const tone = sine(t, hz, phase) + 0.38 * sine(t, hz * 2.01, phase * 0.7);
    samples[start + i] += tone * gain * env;
  }
}

function makeAmbience(seconds, seed) {
  const random = rng(seed);
  const total = Math.floor(seconds * sampleRate);
  const samples = new Float32Array(total);
  let wind = 0;
  let rumble = 0;
  let staticBand = 0;

  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate;
    const white = random() * 2 - 1;
    const grit = random() * 2 - 1;
    wind += (white - wind) * 0.0026;
    rumble += (white - rumble) * 0.00045;
    staticBand += (grit - staticBand) * 0.18;
    const slowGate = 0.65 + 0.35 * sine(t, 0.035, 1.4);
    const drone =
      0.044 * sine(t, 52.4) +
      0.026 * sine(t, 78.8, 0.9) +
      0.014 * sine(t, 104.6, 2.1);
    const radio = staticBand * (0.012 + 0.006 * sine(t, 0.19));
    samples[i] =
      wind * 0.72 * slowGate +
      rumble * 1.1 +
      drone +
      radio;
    samples[i] *= envelope(i, total, 1.1);
  }

  addDecayingTone(samples, seconds * 0.28, 392, 0.048, 2.4, 0.2);
  addDecayingTone(samples, seconds * 0.71, 311, 0.034, 2.8, 1.7);
  return samples;
}

function makePressure(seconds, seed) {
  const random = rng(seed);
  const total = Math.floor(seconds * sampleRate);
  const samples = new Float32Array(total);
  let water = 0;
  let metal = 0;
  let hiss = 0;

  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate;
    const white = random() * 2 - 1;
    water += (white - water) * 0.0012;
    metal += (white - metal) * 0.008;
    hiss += (white - hiss) * 0.12;
    const pulse = Math.pow((sine(t, 0.88) + 1) / 2, 3);
    const drone =
      0.075 * sine(t, 43.5) +
      0.041 * sine(t, 65.2, 0.6) +
      0.028 * sine(t, 130.7, 1.2);
    const gate = water * 1.25 + metal * 0.18 + hiss * 0.018;
    samples[i] = gate + drone + pulse * 0.055 * sine(t, 92);
    samples[i] *= envelope(i, total, 1);
  }

  addDecayingTone(samples, seconds * 0.22, 146, 0.06, 3.2, 0.5);
  addDecayingTone(samples, seconds * 0.52, 116, 0.07, 4.1, 1.1);
  addDecayingTone(samples, seconds * 0.82, 98, 0.055, 3.8, 2.2);
  return samples;
}

function makeSuccess(seconds, seed) {
  const random = rng(seed);
  const total = Math.floor(seconds * sampleRate);
  const samples = new Float32Array(total);
  let paper = 0;

  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate;
    paper += ((random() * 2 - 1) - paper) * 0.24;
    samples[i] = paper * 0.02 * envelope(i, total, 0.08);
    samples[i] += 0.016 * sine(t, 68) * envelope(i, total, 0.22);
  }
  addDecayingTone(samples, 0.08, 523.25, 0.16, 1.8, 0);
  addDecayingTone(samples, 0.16, 783.99, 0.07, 1.2, 0.5);
  addDecayingTone(samples, 1.08, 392, 0.055, 1.4, 1.4);
  return samples;
}

function makeFail(seconds, seed) {
  const random = rng(seed);
  const total = Math.floor(seconds * sampleRate);
  const samples = new Float32Array(total);
  let staticClick = 0;
  let gate = 0;

  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate;
    const white = random() * 2 - 1;
    staticClick += (white - staticClick) * 0.34;
    gate += (white - gate) * 0.0018;
    const hit = t < 0.32 ? Math.exp(-t / 0.08) : 0;
    samples[i] =
      staticClick * 0.018 +
      gate * 0.74 +
      hit * 0.16 * sine(t, 72) +
      0.028 * sine(t, 49) * envelope(i, total, 0.16);
  }
  addDecayingTone(samples, 0.02, 146.8, 0.14, 1.5, 0.9);
  addDecayingTone(samples, 0.58, 92.5, 0.08, 2.2, 2.4);
  return samples;
}

function encodeWav(samples) {
  const channels = 1;
  const bytesPerSample = 2;
  const dataSize = samples.length * channels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * bytesPerSample, 28);
  buffer.writeUInt16LE(channels * bytesPerSample, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i += 1) {
    buffer.writeInt16LE(Math.round(clamp(samples[i]) * 32767), 44 + i * 2);
  }
  return buffer;
}

await mkdir(outDir, { recursive: true });

const outputs = [
  ["old-city-ambience.wav", makeAmbience(24, 0x0c17c17a)],
  ["awakening-pressure.wav", makePressure(20, 0x0b1ac05e)],
  ["receipt-success.wav", makeSuccess(3, 0x5acced)],
  ["receipt-fail.wav", makeFail(3.4, 0xfa11ed)]
];

for (const [name, samples] of outputs) {
  await writeFile(join(outDir, name), encodeWav(samples));
  console.log(name);
}
