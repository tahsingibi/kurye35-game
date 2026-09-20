import { MISSIONS_DATA, ACHIEVEMENTS_DATA } from "./constants";
import { t } from "@/utils/localization";
import type { RoutePhaseInfo } from "./types";

export function getRoutePhase(deliveries: number): number {
  if (deliveries < 3) return 0;
  if (deliveries < 5) return 1;
  if (deliveries < 9) return 2;
  if (deliveries < 14) return 3;
  return 4;
}

export function getPhaseInfo(phase: number): RoutePhaseInfo {
  const keys = ["konak", "kordon", "altinyol", "karsiyaka", "cevre_yolu"] as const;
  const key = keys[phase] || "cevre_yolu";
  return {
    name: t(`phases.${key}.name`),
    sub: t(`phases.${key}.sub`),
  };
}

export function getMissionProgressText(
  missionIndex: number,
  deliveries: number,
  startDeliveries: number,
  cleanFrames: number,
  missionTimer: number
): string {
  const m = MISSIONS_DATA[missionIndex];
  if (!m) return "";
  if (m.type === "delta") {
    return `${Math.max(0, deliveries - startDeliveries)}/${m.target}`;
  }
  if (m.type === "timed") {
    return `${Math.max(0, deliveries - startDeliveries)}/${m.target} · ${Math.ceil(missionTimer / 60)}s`;
  }
  if (m.type === "clean") {
    return `${Math.min(m.target, Math.floor(cleanFrames / 60))}/${m.target}s`;
  }
  return `${deliveries}/${m.target}`;
}

export function loadStoredAchievements(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem("kurye35_achievements");
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function saveAchievements(unlocked: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("kurye35_achievements", JSON.stringify([...unlocked]));
  } catch {}
}

export function loadScores(): { highScore: number; bestDeliveries: number } {
  if (typeof window === "undefined") return { highScore: 0, bestDeliveries: 0 };
  try {
    return {
      highScore: +(localStorage.getItem("kurye35_score") || 0),
      bestDeliveries: +(localStorage.getItem("kurye35_deliveries") || 0),
    };
  } catch {
    return { highScore: 0, bestDeliveries: 0 };
  }
}

export function saveScores(score: number, deliveries: number): void {
  if (typeof window === "undefined") return;
  try {
    const prevScore = +(localStorage.getItem("kurye35_score") || 0);
    const prevDel = +(localStorage.getItem("kurye35_deliveries") || 0);
    if (score > prevScore) localStorage.setItem("kurye35_score", String(Math.floor(score)));
    if (deliveries > prevDel) localStorage.setItem("kurye35_deliveries", String(deliveries));
  } catch {}
}
