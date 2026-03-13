// Sound engine — MP3-based game sounds

const audioCache: Record<string, HTMLAudioElement> = {};

function getAudio(src: string): HTMLAudioElement {
  if (!audioCache[src]) {
    audioCache[src] = new Audio(src);
  }
  return audioCache[src];
}

function playSound(src: string, volume: number = 0.5) {
  if (typeof window === "undefined") return;
  try {
    const audio = getAudio(src);
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch {}
}

export function playMatchSound() {
  playSound("/assets/sounds/success.mp3", 0.6);
}

export function playMismatchSound() {
  playSound("/assets/sounds/failure.mp3", 0.5);
}

export function playComboSound() {
  playSound("/assets/sounds/combo.mp3", 0.7);
}

export function playVictorySound() {
  playSound("/assets/sounds/victory.mp3", 0.6);
}

export function playFlipSound() {
  playSound("/assets/sounds/flip_card.mp3", 0.4);
}
