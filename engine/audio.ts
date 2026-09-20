let audioCtx: AudioContext | null = null;

function ensureAudio(): void {
  if (typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!audioCtx && AudioContextClass) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
}

export function playTone(
  startFreq: number,
  endFreq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.05
): void {
  try {
    ensureAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Ses desteği olmayan veya sessize alınmış tarayıcılar için yut
  }
}

export type SoundType = "move" | "pickup" | "hit" | "nos" | "siren" | "success";

export function playSound(type: SoundType): void {
  if (type === "move") {
    playTone(190, 120, 0.07, "sine", 0.035);
  } else if (type === "pickup") {
    playTone(540, 840, 0.13, "triangle", 0.07);
    setTimeout(() => playTone(760, 1120, 0.1, "triangle", 0.045), 55);
  } else if (type === "hit") {
    playTone(95, 26, 0.3, "sawtooth", 0.18);
  } else if (type === "nos") {
    playTone(95, 680, 0.34, "sawtooth", 0.085);
  } else if (type === "siren") {
    playTone(650, 920, 0.18, "square", 0.038);
    setTimeout(() => playTone(920, 650, 0.18, "square", 0.032), 190);
  } else if (type === "success") {
    playTone(430, 650, 0.1, "triangle", 0.05);
    setTimeout(() => playTone(650, 980, 0.16, "triangle", 0.05), 80);
  }
}
