import { VW, VH, HORIZON } from "../constants";
import { clamp, lerp, nightLevel, roadCenter, roadHalf, drawText, roundRect } from "../utils";
import type { Particle, Floater, BannerInfo, AchievementToast } from "../types";

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

export function drawFloaters(ctx: CanvasRenderingContext2D, floaters: Floater[]): void {
  for (const f of floaters) {
    ctx.globalAlpha = Math.min(1, f.life / 22);
    drawText(ctx, f.s, f.x, f.y, 12.5, 900, f.color, "center");
  }
  ctx.globalAlpha = 1;
}

export function drawHeadlightBeam(
  ctx: CanvasRenderingContext2D,
  playerX: number,
  playerY: number,
  playerW: number,
  gameMinutes: number,
  frame: number,
  phase: number
): void {
  const n = nightLevel(gameMinutes);
  if (n < 0.18) return;
  const cx = playerX + playerW / 2;
  const topY = HORIZON + 55;
  const beamSpread = Math.max(13, playerW * 0.38);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - beamSpread, playerY + 10);
  ctx.lineTo(roadCenter(topY, frame, phase) - 52, topY);
  ctx.lineTo(roadCenter(topY, frame, phase) + 52, topY);
  ctx.lineTo(cx + beamSpread, playerY + 10);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, playerY, 0, topY);
  g.addColorStop(0, `rgba(255, 239, 190, ${0.03 * n})`);
  g.addColorStop(1, `rgba(255, 239, 190, ${0.16 * n})`);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
}

export function drawTimeAtmosphere(ctx: CanvasRenderingContext2D, gameMinutes: number): void {
  const n = nightLevel(gameMinutes);
  if (n > 0.05) {
    ctx.fillStyle = `rgba(5, 11, 20, ${0.07 * n})`;
    ctx.fillRect(0, 0, VW, VH);
  }
}

export function drawRain(ctx: CanvasRenderingContext2D, rain: number, frame: number): void {
  if (rain <= 0) return;
  ctx.strokeStyle = `rgba(185, 220, 236, ${0.12 + rain * 0.13})`;
  ctx.lineWidth = 1;
  for (let i = 0; i < 70; i++) {
    const x = ((i * 71 + frame * 3.1) % 500) - 25;
    const y = ((i * 43 + frame * 10.5) % 840) - 20;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 4 - rain * 3, y + 14 + rain * 8);
    ctx.stroke();
  }
}

export function drawPursuitDangerEffect(
  ctx: CanvasRenderingContext2D,
  wanted: number,
  arrest: number,
  hasActivePolice: boolean,
  frame: number,
  wet: number,
  gameMinutes: number,
  playerY: number,
  phase: number
): void {
  if (wanted < 20 && !hasActivePolice) return;
  const intensity = clamp(0.18 + ((wanted - 20) / 100) * 0.34 + (arrest / 100) * 0.58, 0, 1);
  const pulse = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(frame * 0.19));

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  let g = ctx.createLinearGradient(0, 0, 92, 0);
  g.addColorStop(0, `rgba(255, 42, 48, ${0.16 * intensity * pulse})`);
  g.addColorStop(1, "rgba(255, 42, 48, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 100, VH);

  g = ctx.createLinearGradient(VW, 0, VW - 92, 0);
  g.addColorStop(0, `rgba(51, 135, 255, ${0.17 * intensity * (1.15 - pulse * 0.45)})`);
  g.addColorStop(1, "rgba(51, 135, 255, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(VW - 100, 0, 100, VH);

  if (wet > 0.15 || nightLevel(gameMinutes) > 0.35) {
    const y = playerY + 65;
    const half = roadHalf(y) * 0.72;
    const cx = roadCenter(y, frame, phase);
    g = ctx.createLinearGradient(cx - half, y, cx + half, y);
    g.addColorStop(0, `rgba(255, 50, 55, ${0.05 * intensity * pulse})`);
    g.addColorStop(0.5, "rgba(0,0,0,0)");
    g.addColorStop(1, `rgba(55, 135, 255, ${0.06 * intensity * (1.2 - pulse * 0.4)})`);
    ctx.fillStyle = g;
    ctx.fillRect(cx - half, y - 125, half * 2, 180);
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = `rgba(255, 95, 84, ${0.16 * intensity})`;
  ctx.lineWidth = 2;
  ctx.strokeRect(3, 3, VW - 6, VH - 6);
  ctx.restore();
}

export function drawBanner(ctx: CanvasRenderingContext2D, banner: BannerInfo | null): void {
  if (!banner) return;
  const a = clamp(Math.min(banner.time / 12, (banner.duration - banner.time) / 14), 0, 1);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = "rgba(7, 9, 12, 0.88)";
  roundRect(ctx, 22, 154, 312, 64, 17);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.10)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = banner.color;
  roundRect(ctx, 22, 154, 4, 64, 2);
  ctx.fill();

  drawText(ctx, banner.kicker, 42, 175, 7.2, 950, banner.color);
  drawText(ctx, banner.title, 42, 195, 13.2, 950, "#fff");
  drawText(ctx, banner.sub, 42, 211, 7.9, 650, "#aebbc4");
  ctx.restore();
}

export function drawAchievementToast(ctx: CanvasRenderingContext2D, toast: AchievementToast | null): void {
  if (!toast) return;
  const t = toast.time;
  const d = toast.duration;
  const fade = clamp(Math.min(t / 10, (d - t) / 15), 0, 1);
  const slide = lerp(-18, 0, clamp(t / 16, 0, 1));

  ctx.save();
  ctx.globalAlpha = fade;
  ctx.translate(VW / 2, slide + 24);

  ctx.fillStyle = "rgba(3,6,9,.95)";
  roundRect(ctx, -154, -18, 308, 36, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,218,118,.34)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const rg = ctx.createRadialGradient(-130, 0, 2, -130, 0, 15);
  rg.addColorStop(0, "#ffe391");
  rg.addColorStop(0.62, "#dca844");
  rg.addColorStop(1, "#6f4b16");
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.arc(-130, 0, 14, 0, Math.PI * 2);
  ctx.fill();

  drawText(ctx, "★", -130, 4, 9.5, 950, "#17130b", "center");
  drawText(ctx, "BAŞARIM", -107, -4, 6.3, 950, "#f4c96d");
  drawText(ctx, toast.title, -107, 9, 10.5, 950, "#fff");
  drawText(ctx, `+${toast.reward} · +8 NOS`, 133, 5, 7.2, 900, "#8fe3b9", "right");
  ctx.restore();
}
