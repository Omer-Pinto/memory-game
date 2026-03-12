// Sound engine using speech synthesis for Hebrew labels

const audioCache = new Map<string, HTMLAudioElement>();
let bgMusicCtx: AudioContext | null = null;
let bgMusicStarted = false;
let bgMusicNodes: AudioNode[] = [];

function loadSound(path: string): HTMLAudioElement {
  if (audioCache.has(path)) return audioCache.get(path)!;
  if (typeof window === "undefined") return new Audio();
  const audio = new Audio(path);
  audio.preload = "auto";
  audioCache.set(path, audio);
  return audio;
}

function playSound(path: string, volume: number = 0.7): HTMLAudioElement {
  try {
    const cached = loadSound(path);
    const audio = cached.cloneNode(true) as HTMLAudioElement;
    audio.volume = volume;
    audio.play().catch(() => {});
    return audio;
  } catch {
    return new Audio();
  }
}

// Speak text in Hebrew with a child-friendly voice
function speakText(text: string, lang: string = "he-IL", rate: number = 0.85, pitch: number = 1.4) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }
}

// Play card sound: speak the Hebrew label
export function playCardSound(_themeItemId: string, label: string) {
  try {
    speakText(label, "he-IL", 0.8, 1.4);
  } catch {
    // Audio not available
  }
}

export function speakLabel(text: string) {
  speakText(text, "he-IL", 0.85, 1.4);
}

export function speakTurn(name: string) {
  speakText(`${name}, \u05D4\u05EA\u05D5\u05E8 \u05E9\u05DC\u05DA!`, "he-IL", 0.9, 1.3);
}

export function playMatchSound() {
  playSound("/sounds/match.wav", 0.6);
}

export function playMismatchSound() {
  playSound("/sounds/mismatch.wav", 0.5);
}

export function playFlipSound() {
  playSound("/sounds/flip.wav", 0.4);
}

export function playVictorySound() {
  playSound("/sounds/victory.wav", 0.7);
}

export function playComboSound(streak: number) {
  playSound("/sounds/match.wav", Math.min(0.5 + streak * 0.1, 1.0));
}

export function speakEncouragement(message: string) {
  setTimeout(() => speakText(message, "he-IL", 0.9, 1.5), 600);
}

export function vibrateMatch() {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  } catch {}
}

export function vibrateMismatch() {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(100);
    }
  } catch {}
}

// Generate a magical music-box melody using Web Audio API
function createMagicMelody(ctx: AudioContext, masterGain: GainNode) {
  // Pentatonic scale notes (magical/icy feel) in Hz
  const notes = [
    523.25, 587.33, 659.25, 783.99, 880.00, // C5 D5 E5 G5 A5
    1046.50, 987.77, 880.00, 783.99, 659.25, // C6 B5 A5 G5 E5
    587.33, 659.25, 783.99, 880.00, 1046.50, // D5 E5 G5 A5 C6
    783.99, 659.25, 587.33, 523.25, 659.25,  // G5 E5 D5 C5 E5
  ];
  const noteDuration = 0.45;
  const loopLength = notes.length * noteDuration;

  function scheduleLoop(startTime: number) {
    notes.forEach((freq, i) => {
      const t = startTime + i * noteDuration;

      // Main bell/music-box tone
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.12, t + 0.02);
      env.gain.exponentialRampToValueAtTime(0.001, t + noteDuration * 0.9);
      osc.connect(env);
      env.connect(masterGain);
      osc.start(t);
      osc.stop(t + noteDuration);

      // Shimmery harmonic overtone (icy sparkle)
      const osc2 = ctx.createOscillator();
      const env2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 3, t); // 3rd harmonic
      env2.gain.setValueAtTime(0, t);
      env2.gain.linearRampToValueAtTime(0.03, t + 0.01);
      env2.gain.exponentialRampToValueAtTime(0.001, t + noteDuration * 0.5);
      osc2.connect(env2);
      env2.connect(masterGain);
      osc2.start(t);
      osc2.stop(t + noteDuration);
    });
  }

  // Schedule several loops ahead, then repeat
  let nextStart = ctx.currentTime + 0.1;
  function scheduleAhead() {
    for (let i = 0; i < 4; i++) {
      scheduleLoop(nextStart + i * loopLength);
    }
    nextStart += 4 * loopLength;
  }
  scheduleAhead();
  const interval = setInterval(() => {
    if (ctx.state === "closed") { clearInterval(interval); return; }
    scheduleAhead();
  }, loopLength * 4 * 1000 * 0.8);
  return interval;
}

export function startBackgroundMusic() {
  if (bgMusicStarted || typeof window === "undefined") return;
  try {
    bgMusicCtx = new AudioContext();
    const masterGain = bgMusicCtx.createGain();
    masterGain.gain.setValueAtTime(0.15, bgMusicCtx.currentTime);
    masterGain.connect(bgMusicCtx.destination);
    bgMusicNodes.push(masterGain);
    const interval = createMagicMelody(bgMusicCtx, masterGain);
    (bgMusicCtx as unknown as Record<string, unknown>).__interval = interval;
    bgMusicStarted = true;
  } catch {}
}

export function stopBackgroundMusic() {
  if (bgMusicCtx) {
    const interval = (bgMusicCtx as unknown as Record<string, unknown>).__interval as ReturnType<typeof setInterval>;
    if (interval) clearInterval(interval);
    bgMusicCtx.close().catch(() => {});
    bgMusicCtx = null;
    bgMusicNodes = [];
    bgMusicStarted = false;
  }
}

export function setBgMusicVolume(vol: number) {
  if (bgMusicCtx && bgMusicNodes.length > 0) {
    (bgMusicNodes[0] as GainNode).gain.setValueAtTime(vol, bgMusicCtx.currentTime);
  }
}

export function preloadSounds() {
  if (typeof window === "undefined") return;
  ["/sounds/flip.wav", "/sounds/match.wav", "/sounds/mismatch.wav", "/sounds/victory.wav"].forEach(loadSound);
}

