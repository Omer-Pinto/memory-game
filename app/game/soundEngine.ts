// Sound engine — match/mismatch feedback only

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.3) {
  if (typeof window === "undefined") return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
    setTimeout(() => ctx.close(), (duration + 0.1) * 1000);
  } catch {}
}

export function playMatchSound() {
  // Happy ascending chime
  playTone(523, 0.15, "sine", 0.25);
  setTimeout(() => playTone(659, 0.15, "sine", 0.25), 100);
  setTimeout(() => playTone(784, 0.3, "sine", 0.3), 200);
}

export function playMismatchSound() {
  // Gentle descending tone
  playTone(350, 0.2, "sine", 0.2);
  setTimeout(() => playTone(280, 0.3, "sine", 0.2), 150);
}
