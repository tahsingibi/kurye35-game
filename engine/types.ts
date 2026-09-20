export enum GameStateEnum {
  MENU = 0,
  STORY = 1,
  PLAYING = 2,
  GAMEOVER = 3,
  PAUSED = 4,
}

export type TrafficType = "parcel" | "taxi" | "sedan" | "van" | "bus" | "works" | "puddle";

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  max: number;
}

export interface Floater {
  s: string;
  x: number;
  y: number;
  color: string;
  life: number;
}

export interface BannerInfo {
  kicker: string;
  title: string;
  sub: string;
  color: string;
  time: number;
  duration: number;
}

export interface AchievementToast {
  title: string;
  sub: string;
  reward: number;
  time: number;
  duration: number;
}

export interface RoutePhaseInfo {
  name: string;
  sub: string;
}

export interface ControlsState {
  throttle: boolean;
  brake: boolean;
}
