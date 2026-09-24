export type RenderQuality = "low" | "medium" | "high";

export interface RenderProfile {
  quality: RenderQuality;
  pixelRatio: number;
  playingFps: number;
  idleFps: number;
}

const LOW_PROFILE_SESSION_KEY = "kurye35-low-render-profile";

const LOW_PROFILE: RenderProfile = {
  quality: "low",
  pixelRatio: 1,
  playingFps: 30,
  idleFps: 20,
};

export function getInitialRenderProfile(isTouchDevice: boolean): RenderProfile {
  try {
    if (sessionStorage.getItem(LOW_PROFILE_SESSION_KEY) === "1") {
      return { ...LOW_PROFILE };
    }
  } catch {
    // Depolama kapalıysa cihaz sinyalleriyle devam et.
  }

  // Mobil tarayıcıların donanım bilgileri eksik veya yanıltıcı olabiliyor.
  // Dokunmatik cihazlarda ilk birkaç saniye profil aramak yerine baştan eşit
  // aralıklı 30 FPS kullanmak daha tutarlı bir oyun hissi verir.
  if (isTouchDevice) {
    return { ...LOW_PROFILE };
  }

  return {
    quality: "high",
    pixelRatio: Math.min(1.75, window.devicePixelRatio || 1),
    playingFps: 60,
    idleFps: 30,
  };
}

export function downgradeRenderProfile(profile: RenderProfile): RenderProfile {
  if (profile.quality === "high") {
    return { quality: "medium", pixelRatio: 1.15, playingFps: 60, idleFps: 30 };
  }

  try {
    sessionStorage.setItem(LOW_PROFILE_SESSION_KEY, "1");
  } catch {
    // Depolama kapalı olsa da mevcut oturum düşük profilde devam eder.
  }
  return { ...LOW_PROFILE };
}
