// Generate realistic animal and machine sound WAV files
// Run with: node scripts/generate-sounds.js

const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'sounds');

function createWavBuffer(samples) {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const val = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(val * 32767), 44 + i * 2);
  }
  return buffer;
}

function noise() { return Math.random() * 2 - 1; }

function lowpass(samples, cutoff) {
  const rc = 1.0 / (cutoff * 2 * Math.PI);
  const dt = 1.0 / SAMPLE_RATE;
  const alpha = dt / (rc + dt);
  const out = new Float64Array(samples.length);
  out[0] = samples[0];
  for (let i = 1; i < samples.length; i++) {
    out[i] = out[i-1] + alpha * (samples[i] - out[i-1]);
  }
  return out;
}

function envelope(samples, attack, sustain, release) {
  const attackSamples = Math.floor(attack * SAMPLE_RATE);
  const sustainEnd = Math.floor((attack + sustain) * SAMPLE_RATE);
  const totalSamples = Math.floor((attack + sustain + release) * SAMPLE_RATE);
  const out = new Float64Array(Math.min(totalSamples, samples.length));
  for (let i = 0; i < out.length; i++) {
    let env = 1;
    if (i < attackSamples) env = i / attackSamples;
    else if (i > sustainEnd) env = 1 - (i - sustainEnd) / (totalSamples - sustainEnd);
    out[i] = samples[i] * Math.max(0, env);
  }
  return out;
}

// COW - deep "moo" with formants
function generateCow() {
  const dur = 1.2;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const f0 = 120 + 15 * Math.sin(2 * Math.PI * 4 * t); // vibrato
    // Glottal pulse train
    let pulse = 0;
    for (let h = 1; h <= 12; h++) {
      pulse += (1/h) * Math.sin(2 * Math.PI * f0 * h * t);
    }
    // Formants for "oo" sound: F1=300, F2=800
    const formant1 = Math.sin(2 * Math.PI * 300 * t) * 0.5;
    const formant2 = Math.sin(2 * Math.PI * 800 * t) * 0.3;
    samples[i] = (pulse * 0.4 + formant1 * 0.3 + formant2 * 0.2) * 0.6;
  }
  return envelope(lowpass(samples, 1200), 0.1, 0.7, 0.4);
}

// DOG - short sharp barks
function generateDog() {
  const dur = 0.8;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let bark = 0; bark < 2; bark++) {
    const start = Math.floor(bark * 0.35 * SAMPLE_RATE);
    const barkLen = Math.floor(0.15 * SAMPLE_RATE);
    for (let i = 0; i < barkLen && (start + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      const f0 = 250 + 200 * Math.exp(-t * 15);
      let s = 0;
      for (let h = 1; h <= 8; h++) s += (1/(h*h)) * Math.sin(2 * Math.PI * f0 * h * t);
      const barkEnv = Math.exp(-t * 12) * (1 - Math.exp(-t * 200));
      // Add noise burst for "b" attack
      const noiseAmt = Math.exp(-t * 40) * noise() * 0.4;
      samples[start + i] = (s * 0.5 + noiseAmt) * barkEnv * 0.7;
    }
  }
  return samples;
}

// CAT - smooth meow with formant transitions
function generateCat() {
  const dur = 0.8;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const f0 = 400 + 200 * Math.sin(Math.PI * t / dur); // pitch contour
    let s = 0;
    for (let h = 1; h <= 6; h++) s += (1/h) * Math.sin(2 * Math.PI * f0 * h * t);
    // "ee" to "ow" formant transition
    const blend = t / dur;
    const f1 = 600 * (1 - blend) + 400 * blend;
    const formant = Math.sin(2 * Math.PI * f1 * t) * 0.3;
    samples[i] = (s * 0.4 + formant * 0.3) * 0.6;
  }
  return envelope(samples, 0.05, 0.5, 0.25);
}

// LION - powerful roar with subharmonics
function generateLion() {
  const dur = 1.5;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const f0 = 80 + 30 * Math.sin(2 * Math.PI * 3 * t);
    let s = 0;
    for (let h = 1; h <= 15; h++) s += (1/Math.sqrt(h)) * Math.sin(2 * Math.PI * f0 * h * t);
    // Rumble noise
    const rumble = lowpass(new Float64Array([noise()])[Symbol.iterator] ? [noise() * 0.3] : [0], 300)[0] || noise() * 0.15;
    samples[i] = (s * 0.4 + noise() * 0.12) * 0.7;
  }
  const env = envelope(samples, 0.15, 0.8, 0.55);
  return lowpass(env, 800);
}

// BIRD - cheerful chirp chirp with frequency sweeps
function generateBird() {
  const dur = 0.8;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  const chirps = [0, 0.2, 0.4, 0.55];
  for (const chirpStart of chirps) {
    const chirpLen = 0.1;
    const start = Math.floor(chirpStart * SAMPLE_RATE);
    const len = Math.floor(chirpLen * SAMPLE_RATE);
    for (let i = 0; i < len && (start + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      const f = 3000 + 1500 * Math.sin(2 * Math.PI * 30 * t); // rapid frequency sweep
      const chirpEnv = Math.sin(Math.PI * t / chirpLen);
      samples[start + i] += Math.sin(2 * Math.PI * f * t) * chirpEnv * 0.5;
    }
  }
  return samples;
}

// ELEPHANT - trumpet call with brass-like overtones
function generateElephant() {
  const dur = 1.2;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const f0 = 250 + 300 * (t / dur) + 20 * Math.sin(2 * Math.PI * 6 * t);
    let s = 0;
    for (let h = 1; h <= 10; h++) {
      const amp = 1 / (h * 0.8);
      s += amp * Math.sin(2 * Math.PI * f0 * h * t);
    }
    // Brass-like buzz
    const buzzNoise = noise() * 0.08 * Math.sin(2 * Math.PI * f0 * t);
    samples[i] = (s * 0.3 + buzzNoise) * 0.7;
  }
  return envelope(samples, 0.08, 0.7, 0.42);
}

// DUCK - nasal quack
function generateDuck() {
  const dur = 0.6;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let q = 0; q < 3; q++) {
    const start = Math.floor(q * 0.18 * SAMPLE_RATE);
    const qLen = Math.floor(0.1 * SAMPLE_RATE);
    for (let i = 0; i < qLen && (start + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      const f0 = 400 - 150 * (t / 0.1);
      let s = 0;
      for (let h = 1; h <= 5; h++) s += (1/h) * Math.sin(2 * Math.PI * f0 * h * t);
      // Nasal quality
      const nasal = Math.sin(2 * Math.PI * 1800 * t) * 0.2;
      const env = Math.exp(-t * 15) * (1 - Math.exp(-t * 500));
      samples[start + i] = (s * 0.4 + nasal) * env * 0.6;
    }
  }
  return samples;
}

// FROG - ribbit with resonant body
function generateFrog() {
  const dur = 0.7;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let r = 0; r < 2; r++) {
    const start = Math.floor(r * 0.35 * SAMPLE_RATE);
    const rLen = Math.floor(0.2 * SAMPLE_RATE);
    for (let i = 0; i < rLen && (start + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      const f0 = 200 + 600 * Math.exp(-t * 20);
      const s = Math.sin(2 * Math.PI * f0 * t) + 0.5 * Math.sin(2 * Math.PI * f0 * 2 * t);
      const env = (1 - Math.exp(-t * 200)) * Math.exp(-t * 8);
      samples[start + i] = s * env * 0.5;
    }
  }
  return samples;
}

// PIG - oink with nasal squealy quality
function generatePig() {
  const dur = 0.6;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let o = 0; o < 2; o++) {
    const start = Math.floor(o * 0.28 * SAMPLE_RATE);
    const oLen = Math.floor(0.18 * SAMPLE_RATE);
    for (let i = 0; i < oLen && (start + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      const f0 = 300 + 150 * Math.sin(2 * Math.PI * 8 * t);
      let s = 0;
      for (let h = 1; h <= 6; h++) s += (1/(h*0.7)) * Math.sin(2 * Math.PI * f0 * h * t);
      const nasalEnv = Math.sin(Math.PI * t / 0.18);
      samples[start + i] = s * nasalEnv * 0.4;
    }
  }
  return lowpass(samples, 2000);
}

// HORSE - whinny with vibrato
function generateHorse() {
  const dur = 1.0;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const f0 = 400 + 200 * (t < 0.3 ? t/0.3 : 1 - (t-0.3)/0.7) + 30 * Math.sin(2 * Math.PI * 20 * t);
    let s = 0;
    for (let h = 1; h <= 8; h++) s += (1/h) * Math.sin(2 * Math.PI * f0 * h * t);
    samples[i] = s * 0.35;
  }
  return envelope(samples, 0.05, 0.5, 0.45);
}

// MONKEY - "oo oo ah ah" quick rising calls
function generateMonkey() {
  const dur = 0.8;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  const calls = [
    { start: 0, len: 0.12, f: 500 },
    { start: 0.15, len: 0.12, f: 550 },
    { start: 0.35, len: 0.12, f: 800 },
    { start: 0.5, len: 0.12, f: 900 },
  ];
  for (const c of calls) {
    const s0 = Math.floor(c.start * SAMPLE_RATE);
    const sLen = Math.floor(c.len * SAMPLE_RATE);
    for (let i = 0; i < sLen && (s0 + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      const f = c.f + 200 * (t / c.len);
      const s = Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t);
      const env = Math.sin(Math.PI * t / c.len);
      samples[s0 + i] = s * env * 0.45;
    }
  }
  return samples;
}

// BEE - buzzing
function generateBee() {
  const dur = 0.8;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const f0 = 150 + 30 * Math.sin(2 * Math.PI * 8 * t);
    let s = 0;
    for (let h = 1; h <= 20; h++) s += (1/(h*h)) * Math.sin(2 * Math.PI * f0 * h * t);
    samples[i] = s * 0.3;
  }
  return envelope(samples, 0.05, 0.5, 0.25);
}

// OWL - "hoo hoo"
function generateOwl() {
  const dur = 0.9;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let h = 0; h < 2; h++) {
    const start = Math.floor(h * 0.45 * SAMPLE_RATE);
    const hLen = Math.floor(0.3 * SAMPLE_RATE);
    for (let i = 0; i < hLen && (start + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      const f = 350 - 50 * (t / 0.3);
      const s = Math.sin(2 * Math.PI * f * t) * 0.6 + Math.sin(2 * Math.PI * f * 2 * t) * 0.2;
      const env = Math.sin(Math.PI * t / 0.3);
      samples[start + i] = s * env * 0.5;
    }
  }
  return lowpass(samples, 800);
}

// BEAR - deep growl
function generateBear() {
  const dur = 1.0;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const f0 = 70 + 20 * Math.sin(2 * Math.PI * 5 * t);
    let s = 0;
    for (let h = 1; h <= 12; h++) s += (1/Math.sqrt(h)) * Math.sin(2 * Math.PI * f0 * h * t);
    samples[i] = (s * 0.35 + noise() * 0.1) * 0.6;
  }
  return envelope(lowpass(samples, 600), 0.1, 0.6, 0.3);
}

// SHEEP/GOAT - "baa"
function generateSheep() {
  const dur = 0.8;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const f0 = 250 + 10 * Math.sin(2 * Math.PI * 6 * t); // vibrato
    let s = 0;
    for (let h = 1; h <= 8; h++) s += (1/h) * Math.sin(2 * Math.PI * f0 * h * t);
    // "aa" formant
    const formant = Math.sin(2 * Math.PI * 700 * t) * 0.3;
    samples[i] = (s * 0.35 + formant) * 0.5;
  }
  return envelope(samples, 0.05, 0.45, 0.3);
}

// Clock tick tock
function generateClock() {
  const dur = 1.2;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let tick = 0; tick < 4; tick++) {
    const start = Math.floor(tick * 0.3 * SAMPLE_RATE);
    const tLen = Math.floor(0.02 * SAMPLE_RATE);
    const freq = tick % 2 === 0 ? 2000 : 1500;
    for (let i = 0; i < tLen && (start + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      samples[start + i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 100) * 0.5;
    }
  }
  return samples;
}

// Phone ring
function generatePhone() {
  const dur = 0.8;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let ring = 0; ring < 3; ring++) {
    const start = Math.floor(ring * 0.25 * SAMPLE_RATE);
    const rLen = Math.floor(0.15 * SAMPLE_RATE);
    for (let i = 0; i < rLen && (start + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      const s = Math.sin(2 * Math.PI * 1200 * t) + Math.sin(2 * Math.PI * 1400 * t);
      const env = Math.sin(Math.PI * t / 0.15);
      samples[start + i] = s * env * 0.25;
    }
  }
  return samples;
}

// Background music - gentle cheerful loop
function generateBgMusic() {
  const dur = 16; // 16 second loop
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);

  // C major pentatonic melody
  const notes = [262, 294, 330, 392, 440, 524, 440, 392, 330, 294, 262, 294, 330, 392, 524, 440];
  const noteLen = dur / notes.length;

  for (let ni = 0; ni < notes.length; ni++) {
    const freq = notes[ni];
    const start = Math.floor(ni * noteLen * SAMPLE_RATE);
    const len = Math.floor(noteLen * SAMPLE_RATE);
    for (let i = 0; i < len && (start + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      // Soft bell/music box tone
      const s = Math.sin(2 * Math.PI * freq * t) * 0.6
        + Math.sin(2 * Math.PI * freq * 2 * t) * 0.2
        + Math.sin(2 * Math.PI * freq * 3 * t) * 0.1;
      // Gentle envelope per note
      const attack = Math.min(1, t * 20);
      const decay = Math.exp(-t * 2.5);
      samples[start + i] += s * attack * decay * 0.12; // Very quiet background
    }
  }

  // Add gentle bass drone
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    samples[i] += Math.sin(2 * Math.PI * 130 * t) * 0.03; // very gentle C bass
  }

  return samples;
}

// Match sound - happy ascending chime
function generateMatchSound() {
  const dur = 0.8;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  const notes = [523, 659, 784, 1047];
  for (let ni = 0; ni < notes.length; ni++) {
    const freq = notes[ni];
    const start = Math.floor(ni * 0.1 * SAMPLE_RATE);
    const len = Math.floor(0.4 * SAMPLE_RATE);
    for (let i = 0; i < len && (start + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      const s = Math.sin(2 * Math.PI * freq * t) * 0.4 + Math.sin(2 * Math.PI * freq * 2 * t) * 0.15;
      samples[start + i] += s * Math.exp(-t * 4) * 0.5;
    }
  }
  return samples;
}

// Mismatch sound - gentle "nope"
function generateMismatchSound() {
  const dur = 0.5;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const f = 350 - 200 * t;
    samples[i] = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 4) * 0.3;
  }
  return samples;
}

// Flip sound - quick swoosh
function generateFlipSound() {
  const dur = 0.12;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const f = 400 + 2000 * t / dur;
    samples[i] = (noise() * 0.5 + Math.sin(2 * Math.PI * f * t) * 0.3) * Math.exp(-t * 20) * 0.4;
  }
  return samples;
}

// Victory fanfare
function generateVictory() {
  const dur = 2.0;
  const n = Math.floor(dur * SAMPLE_RATE);
  const samples = new Float64Array(n);
  const melody = [
    { f: 523, t: 0, d: 0.2 }, { f: 659, t: 0.2, d: 0.2 },
    { f: 784, t: 0.4, d: 0.2 }, { f: 1047, t: 0.6, d: 0.6 },
    { f: 784, t: 1.0, d: 0.2 }, { f: 1047, t: 1.2, d: 0.8 },
  ];
  for (const note of melody) {
    const start = Math.floor(note.t * SAMPLE_RATE);
    const len = Math.floor(note.d * SAMPLE_RATE);
    for (let i = 0; i < len && (start + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      const s = Math.sin(2 * Math.PI * note.f * t) * 0.4
        + Math.sin(2 * Math.PI * note.f * 1.5 * t) * 0.15;
      const env = Math.min(1, t * 20) * Math.exp(-t / note.d * 1.5);
      samples[start + i] += s * env * 0.5;
    }
  }
  return samples;
}

const SOUNDS = {
  cow: generateCow,
  dog: generateDog,
  cat: generateCat,
  lion: generateLion,
  bird: generateBird,
  elephant: generateElephant,
  duck: generateDuck,
  frog: generateFrog,
  pig: generatePig,
  horse: generateHorse,
  monkey: generateMonkey,
  bee: generateBee,
  owl: generateOwl,
  bear: generateBear,
  sheep: generateSheep,
  clock: generateClock,
  phone: generatePhone,
  'bg-music': generateBgMusic,
  match: generateMatchSound,
  mismatch: generateMismatchSound,
  flip: generateFlipSound,
  victory: generateVictory,
};

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const [name, generator] of Object.entries(SOUNDS)) {
  const samples = generator();
  const wav = createWavBuffer(Array.from(samples));
  const outPath = path.join(OUTPUT_DIR, `${name}.wav`);
  fs.writeFileSync(outPath, wav);
  console.log(`Generated ${outPath} (${(wav.length / 1024).toFixed(1)} KB)`);
}

console.log('\nDone! All sounds generated.');
