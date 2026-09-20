import { VW, VH, HORIZON } from "../constants";
import { clamp, lerp, mixColor, getHour, daylight, twilight, nightLevel } from "../utils";

export function drawSky(ctx: CanvasRenderingContext2D, gameMinutes: number, frame: number): void {
  const day = daylight(gameMinutes);
  const tw = twilight(gameMinutes);
  const night = nightLevel(gameMinutes);

  // Gökyüzü renk geçişleri (Gündüz, Alacakaranlık, Gece)
  let top = mixColor("#040711", "#4b9cdb", day);
  let mid = mixColor("#0c1926", "#8ec4e8", day);
  let low = mixColor("#1b2a36", "#d9cbaf", day);

  if (tw > 0.02) {
    top = mixColor(top, "#341f3d", tw * 0.75);
    mid = mixColor(mid, "#c25f54", tw * 0.8);
    low = mixColor(low, "#f2a868", tw * 0.9);
  }

  // Gökyüzü gradyanı tüm arka planı kaplar ve ufukla kusursuz bütünleşir
  const skyGrad = ctx.createLinearGradient(0, 0, 0, HORIZON + 90);
  skyGrad.addColorStop(0, top);
  skyGrad.addColorStop(0.65, mid);
  skyGrad.addColorStop(1, low);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, VW, VH);

  // Bulutlar
  for (let i = 0; i < 6; i++) {
    const x = ((i * 131 - frame * 0.035) % 650) - 90;
    const y = 25 + i * 25;
    ctx.fillStyle = `rgba(220, 235, 245, ${0.04 + day * 0.06})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 75, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Yıldızlar (Gece)
  if (night > 0.15) {
    for (let i = 0; i < 36; i++) {
      const x = (i * 73) % VW;
      const y = 14 + (i * 41) % (HORIZON - 40);
      const twinkle = Math.sin(frame * 0.05 + i) * 0.2 + 0.8;
      ctx.fillStyle = i % 4 === 0
        ? `rgba(255, 255, 255, ${0.75 * night * twinkle})`
        : `rgba(255, 255, 255, ${0.3 * night * twinkle})`;
      ctx.fillRect(x, y, 1.4, 1.4);
    }
  }

  // Güneş
  const h = getHour(gameMinutes);
  if (day > 0.08 || tw > 0.15) {
    const progress = clamp((h - 5.5) / 13.5, 0, 1);
    const sx = 40 + progress * 370;
    const sy = 140 - Math.sin(progress * Math.PI) * 95;

    // Güneş hare / halo
    const sunGlow = ctx.createRadialGradient(sx, sy, 5, sx, sy, 50);
    sunGlow.addColorStop(0, `rgba(255, 235, 170, ${0.4 * day + 0.2})`);
    sunGlow.addColorStop(1, "rgba(255, 200, 100, 0)");
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sx, sy, 50, 0, Math.PI * 2);
    ctx.fill();

    // Güneş gövdesi
    ctx.fillStyle = `rgba(255, 240, 190, ${0.6 + day * 0.4})`;
    ctx.beginPath();
    ctx.arc(sx, sy, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ay
  if (night > 0.25) {
    const mp = ((h + 6) % 24) / 24;
    const mx = 65 + mp * 330;
    const my = 60 + Math.sin(mp * Math.PI) * 22;

    const moonGlow = ctx.createRadialGradient(mx, my, 8, mx, my, 40);
    moonGlow.addColorStop(0, `rgba(255, 248, 220, ${0.25 * night})`);
    moonGlow.addColorStop(1, "rgba(255, 248, 220, 0)");
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(mx, my, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255, 248, 220, ${0.5 + 0.45 * night})`;
    ctx.beginPath();
    ctx.arc(mx, my, 17, 0, Math.PI * 2);
    ctx.fill();

    // Hilal gölgesi
    ctx.fillStyle = top;
    ctx.beginPath();
    ctx.arc(mx + 6, my - 5, 16, 0, Math.PI * 2);
    ctx.fill();
  }
}
