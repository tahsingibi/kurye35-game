import { getSoundSettings, SoundSettings, VehicleType } from "@/utils/settings";

let audioCtx: AudioContext | null = null;
let soundMuted = false;
let channelSettings: SoundSettings = {
  master: true,
  vehicle: true,
  ambience: true,
  effects: true,
};

if (typeof window !== "undefined") {
  channelSettings = getSoundSettings();
  soundMuted = !channelSettings.master;
}

export function setSoundMuted(muted: boolean): void {
  soundMuted = muted;
  channelSettings.master = !muted;
  if (muted) {
    stopEngineSound();
  }
}

export function setAudioSettings(settings: SoundSettings): void {
  channelSettings = { ...settings };
  soundMuted = !settings.master;
  if (soundMuted || !settings.vehicle) stopEngineSound();
}

export function isSoundMuted(): boolean {
  return soundMuted;
}

function ensureAudio(): AudioContext | null {
  if (typeof window === "undefined" || soundMuted) return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!audioCtx && AudioContextClass) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playTone(
  startFreq: number,
  endFreq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.05
): void {
  if (soundMuted) return;
  try {
    const ctx = ensureAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  } catch {}
}

export type SoundType = "move" | "pickup" | "hit" | "nos" | "siren" | "success";

export function playSound(type: SoundType): void {
  if (soundMuted || !channelSettings.effects) return;
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

// ---------------------------------------------------------------------------
// DOYURUCU, KADİFE GİBİ TOK MOTOR & ORTAM SESİ SENTEZLEYİCİSİ
// ---------------------------------------------------------------------------
interface AudioState {
  osc1: OscillatorNode;
  osc2: OscillatorNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
  filter: BiquadFilterNode;
  engineGain: GainNode;
  noiseSource: AudioBufferSourceNode;
  windFilter: BiquadFilterNode;
  windGain: GainNode;
  rainFilter: BiquadFilterNode;
  rainGain: GainNode;
  nightFilter: BiquadFilterNode;
  nightGain: GainNode;
  activeType: VehicleType;
}

let activeAudio: AudioState | null = null;
let sharedNoiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (sharedNoiseBuffer) return sharedNoiseBuffer;
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  sharedNoiseBuffer = buffer;
  return buffer;
}

export function startEngineSound(vehicleType: VehicleType): void {
  if (soundMuted || !channelSettings.vehicle || typeof window === "undefined") return;
  try {
    const ctx = ensureAudio();
    if (!ctx) return;

    if (activeAudio) {
      if (activeAudio.activeType === vehicleType) return;
      stopEngineSound();
    }

    const now = ctx.currentTime;

    // 1. Motor Ana Osilatörleri: Sivri testere dişi yerine yumuşak triangle/sine
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const engineGain = ctx.createGain();

    // 2. Silindir Ateşleme / Canlı Titreşim LFO (Çok yumuşak ritmik nabız)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = vehicleType === "car" ? 7 : 9;
    lfoGain.gain.value = vehicleType === "car" ? 2.5 : 4;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    if (vehicleType === "car") {
      // Araba: Derin, tok bas homurtu (triangle + sine)
      osc1.type = "triangle";
      osc2.type = "sine";
      osc1.frequency.value = 38;
      osc2.frequency.value = 76;
      filter.type = "lowpass";
      filter.frequency.value = 220;
      filter.Q.value = 1.0;
      engineGain.gain.value = 0.008;
    } else {
      // Motosiklet: Tok, kulak tırmalamayan 2 silindir (triangle + sine)
      osc1.type = "triangle";
      osc2.type = "sine";
      osc1.frequency.value = 58;
      osc2.frequency.value = 116;
      filter.type = "lowpass";
      filter.frequency.value = 320;
      filter.Q.value = 1.1;
      engineGain.gain.value = 0.007;
    }

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(engineGain);
    engineGain.connect(ctx.destination);

    // 3. Rüzgar, Yol & Asfalt Akışı (Gürültü Tabanlı)
    const noiseBuffer = getNoiseBuffer(ctx);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Rüzgar / Hız Filtresi
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.value = 350;
    windFilter.Q.value = 0.7;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.004;

    // Yağmur / Islak Asfalt Filtresi
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = "highpass";
    rainFilter.frequency.value = 1100;
    const rainGain = ctx.createGain();
    rainGain.gain.value = 0;

    // Gece Esintisi Filtresi
    const nightFilter = ctx.createBiquadFilter();
    nightFilter.type = "lowpass";
    nightFilter.frequency.value = 200;
    const nightGain = ctx.createGain();
    nightGain.gain.value = 0;

    noiseSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(ctx.destination);

    noiseSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(ctx.destination);

    noiseSource.connect(nightFilter);
    nightFilter.connect(nightGain);
    nightGain.connect(ctx.destination);

    // Başlat
    osc1.start(now);
    osc2.start(now);
    lfo.start(now);
    noiseSource.start(now);

    activeAudio = {
      osc1,
      osc2,
      lfo,
      lfoGain,
      filter,
      engineGain,
      noiseSource,
      windFilter,
      windGain,
      rainFilter,
      rainGain,
      nightFilter,
      nightGain,
      activeType: vehicleType,
    };
  } catch {}
}

export function updateEngineSound(
  speed: number,
  throttle: boolean,
  brake: boolean,
  boosting: boolean,
  vehicleType: VehicleType,
  rain = 0,
  nightVal = 0
): void {
  if (soundMuted || !channelSettings.vehicle || !activeAudio) {
    if (!soundMuted && channelSettings.vehicle && !activeAudio) {
      startEngineSound(vehicleType);
    }
    return;
  }

  try {
    const ctx = ensureAudio();
    if (!ctx || ctx.state !== "running") return;

    if (activeAudio.activeType !== vehicleType) {
      startEngineSound(vehicleType);
      return;
    }

    const now = ctx.currentTime;
    // Doyum eğrisi: Hız arttıkça ses tavan yapıp kulağı delmesin, yumuşakça doyuma ulaşsın
    const rawSpeedRatio = Math.max(0, Math.min(1, (speed - 1) / 9.5));
    const speedRatio = Math.pow(rawSpeedRatio, 0.7);

    if (vehicleType === "car") {
      // Tok, sakin araba egzozu (asla tizleşmez)
      let baseFreq = 36 + speedRatio * 30;
      if (throttle) baseFreq += 10;
      if (brake) baseFreq = Math.max(30, baseFreq - 8);
      if (boosting) baseFreq += 16;

      activeAudio.osc1.frequency.setTargetAtTime(baseFreq, now, 0.16);
      activeAudio.osc2.frequency.setTargetAtTime(baseFreq * 1.5, now, 0.16);

      // Lowpass filtre: Tiz sesleri tamamen tıraşlar, tok bas homurtu bırakır
      let targetFilter = 180 + speedRatio * 110 + (throttle ? 40 : 0) + (boosting ? 80 : 0);
      activeAudio.filter.frequency.setTargetAtTime(targetFilter, now, 0.16);

      // Ses seviyesi: Kulak yormayan yumuşak arka plan egzoz seviyesi
      let targetEngineVol = throttle
        ? 0.011 + speedRatio * 0.005
        : 0.005 + speedRatio * 0.003;
      if (boosting) targetEngineVol += 0.006;
      activeAudio.engineGain.gain.setTargetAtTime(channelSettings.vehicle ? targetEngineVol : 0, now, 0.16);
    } else {
      // Motosiklet: Kulak delen testere dişi yerine tok, ritmik 2 silindir kurye motoru
      let baseFreq = 54 + speedRatio * 42;
      if (throttle) baseFreq += 14;
      if (brake) baseFreq = Math.max(46, baseFreq - 12);
      if (boosting) baseFreq += 22;

      activeAudio.osc1.frequency.setTargetAtTime(baseFreq, now, 0.14);
      activeAudio.osc2.frequency.setTargetAtTime(baseFreq * 2, now, 0.14);

      // Lowpass filtre ile tiz vızıltı yok edilir
      let targetFilter = 250 + speedRatio * 140 + (throttle ? 50 : 0) + (boosting ? 110 : 0);
      activeAudio.filter.frequency.setTargetAtTime(targetFilter, now, 0.14);

      let targetEngineVol = throttle
        ? 0.010 + speedRatio * 0.005
        : 0.005 + speedRatio * 0.002;
      if (boosting) targetEngineVol += 0.005;
      activeAudio.engineGain.gain.setTargetAtTime(channelSettings.vehicle ? targetEngineVol : 0, now, 0.14);
    }

    // 2. Rüzgar & Asfalt Sürtünme Sesi (Hızlandıkça organik yol akışı)
    const windTargetGain = 0.004 + speedRatio * 0.020 + (boosting ? 0.012 : 0);
    const windTargetFreq = 280 + speedRatio * 480;
    activeAudio.windGain.gain.setTargetAtTime(channelSettings.ambience ? windTargetGain : 0, now, 0.18);
    activeAudio.windFilter.frequency.setTargetAtTime(windTargetFreq, now, 0.18);

    // 3. Yağmur & Islak Asfalt Ambiyansı
    const rainTargetVol = rain > 0 ? 0.008 + rain * 0.022 : 0;
    activeAudio.rainGain.gain.setTargetAtTime(channelSettings.ambience ? rainTargetVol : 0, now, 0.3);

    // 4. Gece Sakinliği Ambiyansı
    const nightTargetVol = nightVal > 0.3 ? (nightVal - 0.3) * 0.010 : 0;
    activeAudio.nightGain.gain.setTargetAtTime(channelSettings.ambience ? nightTargetVol : 0, now, 0.4);
  } catch {}
}

export function stopEngineSound(): void {
  if (!activeAudio) return;
  try {
    const ctx = audioCtx;
    if (ctx && ctx.state === "running") {
      const now = ctx.currentTime;
      activeAudio.engineGain.gain.linearRampToValueAtTime(0.0001, now + 0.1);
      activeAudio.windGain.gain.linearRampToValueAtTime(0.0001, now + 0.1);
      activeAudio.rainGain.gain.linearRampToValueAtTime(0.0001, now + 0.1);
      activeAudio.nightGain.gain.linearRampToValueAtTime(0.0001, now + 0.1);

      const s = activeAudio;
      setTimeout(() => {
        try {
          s.osc1.stop();
          s.osc2.stop();
          s.lfo.stop();
          s.noiseSource.stop();
          s.osc1.disconnect();
          s.osc2.disconnect();
          s.lfo.disconnect();
          s.lfoGain.disconnect();
          s.filter.disconnect();
          s.engineGain.disconnect();
          s.noiseSource.disconnect();
          s.windFilter.disconnect();
          s.windGain.disconnect();
          s.rainFilter.disconnect();
          s.rainGain.disconnect();
          s.nightFilter.disconnect();
          s.nightGain.disconnect();
        } catch {}
      }, 120);
    }
  } catch {}
  activeAudio = null;
}

export function playVehicleRev(vehicleType: VehicleType): void {
  if (soundMuted || !channelSettings.vehicle) return;
  try {
    const ctx = ensureAudio();
    if (!ctx) return;

    if (vehicleType === "car") {
      playTone(42, 85, 0.28, "triangle", 0.04);
      setTimeout(() => playTone(85, 48, 0.34, "sine", 0.03), 240);
    } else {
      playTone(60, 115, 0.22, "triangle", 0.035);
      setTimeout(() => playTone(115, 70, 0.28, "sine", 0.025), 200);
    }
  } catch {}
}
