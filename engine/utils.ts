import { VW, VH, HORIZON } from "./constants";

export const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  s: string,
  x: number,
  y: number,
  size = 12,
  weight = 700,
  color = "#fff",
  align: CanvasTextAlign = "left"
): void {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = align;
  ctx.fillText(s, x, y);
}

export function hexToRgb(value: string): { r: number; g: number; b: number } {
  if (value.startsWith("rgb")) {
    const m = value.match(/\d+/g) || [0, 0, 0];
    return { r: +m[0], g: +m[1], b: +m[2] };
  }
  const h = value.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function mixColor(a: string, b: string, t: number): string {
  const cl = clamp(t, 0, 1);
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return `rgb(${Math.round(lerp(A.r, B.r, cl))},${Math.round(lerp(A.g, B.g, cl))},${Math.round(lerp(A.b, B.b, cl))})`;
}

export function getHour(gameMinutes: number): number {
  return (gameMinutes / 60) % 24;
}

export function daylight(gameMinutes: number): number {
  const h = getHour(gameMinutes);
  if (h >= 7 && h < 17.5) return 1;
  if (h >= 5.5 && h < 7) return (h - 5.5) / 1.5;
  if (h >= 17.5 && h < 19) return 1 - (h - 17.5) / 1.5;
  return 0;
}

export function twilight(gameMinutes: number): number {
  const h = getHour(gameMinutes);
  const dawn = h >= 5 && h < 7.2 ? 1 - Math.abs(h - 6.1) / 1.1 : 0;
  const dusk = h >= 17 && h < 19.4 ? 1 - Math.abs(h - 18.2) / 1.2 : 0;
  return clamp(Math.max(dawn, dusk), 0, 1);
}

export function nightLevel(gameMinutes: number): number {
  return clamp(1 - daylight(gameMinutes) * 0.92 - twilight(gameMinutes) * 0.25, 0, 1);
}

export function roadT(y: number): number {
  return clamp((y - HORIZON) / (VH - HORIZON), 0, 1);
}

export function roadCenter(y: number, frame: number, phase: number): number {
  const t = roadT(y);
  const bend = Math.sin(frame * 0.003 + phase * 1.7) * 18 + Math.sin(frame * 0.0013 + 1.2) * 12;
  return VW / 2 + bend * Math.pow(t, 1.55);
}

export function roadHalf(y: number): number {
  const t = roadT(y);
  return lerp(58, 250, Math.pow(t, 0.92));
}

export function laneCenter(lane: number, y: number, frame: number, phase: number): number {
  const half = roadHalf(y);
  return roadCenter(y, frame, phase) + (lane - 1) * half * 0.54;
}

export function depthScale(y: number): number {
  const t = roadT(y);
  return 0.28 + 1.03 * Math.pow(t, 0.82);
}

export function approachDepth(offset: number, worldDistance: number, cycle = 980): number {
  const d = (((worldDistance + offset) % cycle) + cycle) % cycle;
  const p = d / cycle;
  return HORIZON + 4 + Math.pow(p, 1.72) * (VH - HORIZON + 170);
}
