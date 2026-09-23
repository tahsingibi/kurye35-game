import { VW } from "../constants";
import { clamp, roundRect, drawText } from "../utils";
import type { RoutePhaseInfo } from "../types";

export function drawSpeedometer(
  ctx: CanvasRenderingContext2D,
  speed: number,
  isBraking: boolean,
  isThrottling: boolean,
  cx = 225,
  cy = 750,
  r = 38
): void {
  const maxKmh = 160;
  const ratio = clamp(speed / maxKmh, 0, 1);
  ctx.save();

  // Yüksek kontrastlı arka plan ve dış parlama
  ctx.fillStyle = "rgba(4,7,11,.88)";
  ctx.beginPath();
  ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(115,224,209,.35)";
  ctx.lineWidth = 1.4;
  ctx.stroke();

  const a0 = Math.PI * 0.76;
  const a1 = Math.PI * 2.24;
  const span = a1 - a0;

  // Arka halka izi
  ctx.strokeStyle = "rgba(255,255,255,.14)";
  ctx.lineWidth = r > 32 ? 5 : 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, a0, a1);
  ctx.stroke();

  // Renkli hız yayı
  const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  grad.addColorStop(0, "#4ade80");
  grad.addColorStop(0.6, "#facc15");
  grad.addColorStop(1, "#f87171");
  ctx.strokeStyle = grad;
  ctx.lineWidth = r > 32 ? 5 : 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, a0, a0 + span * ratio);
  ctx.stroke();

  // Kadran çizgileri
  for (let i = 0; i <= 8; i++) {
    const a = a0 + span * (i / 8);
    const inner = r - (r > 32 ? 7 : 5);
    const outer = r - 2;
    ctx.strokeStyle = i <= Math.round(ratio * 8) ? "#ffffff" : "rgba(255,255,255,.25)";
    ctx.lineWidth = i % 2 === 0 ? 1.5 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
    ctx.stroke();
  }

  // İbre
  const needleA = a0 + span * ratio;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(needleA) * (r - (r > 32 ? 9 : 7)), cy + Math.sin(needleA) * (r - (r > 32 ? 9 : 7)));
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();

  // Sayısal KM/H Değeri
  const numColor = isBraking ? "#f87171" : isThrottling ? "#4ade80" : "#ffffff";
  drawText(ctx, String(speed), cx, cy + (r > 32 ? 5 : 4), r > 32 ? 16 : 13.5, 950, numColor, "center");
  drawText(ctx, "KM/H", cx, cy + (r > 32 ? 17 : 14), r > 32 ? 6.5 : 5.5, 950, "#94a3b8", "center");
  ctx.restore();
}

export function drawCanvasHUD(
  ctx: CanvasRenderingContext2D,
  phase: RoutePhaseInfo,
  missionTitle: string,
  missionProgress: string,
  deliveries: number,
  score: number,
  unlockedCount: number,
  totalAchievements: number,
  clockText: string,
  phaseText: string,
  health: number,
  speed: number,
  nos: number,
  boosting: boolean,
  wanted: number,
  arrest: number,
  isChasing: boolean,
  cleanFrames: number,
  violations: number,
  lastViolation: string,
  combo: number,
  isTouch: boolean,
  controls: { throttle: boolean; brake: boolean },
  joystickPosition: "left" | "right" = "left",
  buttonSize: "small" | "medium" | "large" = "medium"
): void {
  const panelBg = "rgba(7,11,16,.80)";
  const panelBorder = "rgba(255,255,255,.14)";

  // Üst panel gölgesi
  const topFade = ctx.createLinearGradient(0, 0, 0, 160);
  topFade.addColorStop(0, "rgba(2,4,7,.70)");
  topFade.addColorStop(0.7, "rgba(2,4,7,.25)");
  topFade.addColorStop(1, "rgba(2,4,7,0)");
  ctx.fillStyle = topFade;
  ctx.fillRect(0, 0, VW, 160);

  // 1. Sol üst: Rota ve görev
  ctx.fillStyle = panelBg;
  roundRect(ctx, 14, 44, 218, 70, 18);
  ctx.fill();
  ctx.strokeStyle = panelBorder;
  ctx.stroke();

  drawText(ctx, phase.name, 28, 64, 8, 950, "#73e0d1");
  drawText(ctx, phase.sub, 28, 85, 14, 950, "#f6f7f6");
  drawText(ctx, missionTitle, 28, 103, 8.2, 700, "#82919c");
  drawText(ctx, missionProgress, 216, 103, 8.5, 900, "#ccd5db", "right");

  // 2. Sağ üst: Skor ve teslimat
  ctx.fillStyle = panelBg;
  roundRect(ctx, 238, 44, 198, 70, 18);
  ctx.fill();
  ctx.strokeStyle = panelBorder;
  ctx.stroke();

  drawText(ctx, "TESLİMAT", 254, 64, 7.2, 900, "#7d8b96");
  drawText(ctx, String(deliveries).padStart(2, "0"), 254, 91, 23, 950, "#f2c46d");
  drawText(ctx, "PUAN", 420, 64, 7.2, 900, "#7d8b96", "right");
  drawText(ctx, Math.floor(score).toLocaleString("tr-TR"), 420, 89, 13, 900, "#f3f5f5", "right");
  drawText(ctx, `★ ${unlockedCount}/${totalAchievements}`, 420, 106, 6.7, 900, "#dcbf74", "right");

  // 3. Sağ üst saat pill'i
  ctx.fillStyle = "rgba(7,10,14,.75)";
  roundRect(ctx, 310, 122, 126, 25, 12.5);
  ctx.fill();
  ctx.strokeStyle = panelBorder;
  ctx.stroke();
  drawText(ctx, `${clockText} · ${speed} KM/H`, 373, 138, 8.2, 950, isTouch ? "#38bdf8" : "#d9e5eb", "center");

  // 4. Sağlık Göstergesi: Mobilde yukarıda, masaüstünde sol altta
  if (isTouch) {
    ctx.fillStyle = "rgba(7,10,14,.80)";
    roundRect(ctx, 14, 122, 98, 25, 12.5);
    ctx.fill();
    ctx.strokeStyle = panelBorder;
    ctx.stroke();
    drawText(ctx, "♥ SAĞLIK", 24, 138, 7.2, 950, "#94a3b8");
    drawText(ctx, `${Math.round(health)}%`, 102, 138, 9.5, 950, health < 35 ? "#f87171" : "#4ade80", "right");
  } else {
    ctx.fillStyle = panelBg;
    roundRect(ctx, 14, 708, 92, 66, 18);
    ctx.fill();
    ctx.strokeStyle = panelBorder;
    ctx.stroke();
    drawText(ctx, "SAĞLIK", 28, 729, 7.2, 950, "#788994");
    drawText(ctx, `${Math.round(health)}%`, 28, 754, 18, 950, health < 35 ? "#ff786d" : "#88e2ae");
    ctx.fillStyle = "rgba(255,255,255,.08)";
    roundRect(ctx, 28, 762, 62, 4, 2);
    ctx.fill();
    ctx.fillStyle = health < 35 ? "#ff6b61" : "#67d89a";
    roundRect(ctx, 28, 762, (62 * health) / 100, 4, 2);
    ctx.fill();
  }

  // 5. Hız Göstergesi: Mobilde kontrol bölgesinden tamamen ayrılmış sağ üst kokpit podu.
  const speedCx = isTouch ? 398 : 225;
  const speedCy = isTouch ? 195 : 750;
  const speedR = isTouch ? 27 : 38;

  drawSpeedometer(
    ctx,
    speed,
    controls.brake,
    controls.throttle,
    speedCx,
    speedCy,
    speedR
  );

  // 6. Dairesel NOS Göstergesi: Masaüstünde sağ altta; mobilde TouchControls içinde tıklanabilir interaktif buton
  if (!isTouch) {
    const nosCx = 397;
    const nosCy = 740;
    const nosR = 38;

    ctx.save();
    ctx.fillStyle = "rgba(7,10,14,.88)";
    ctx.beginPath();
    ctx.arc(nosCx, nosCy, nosR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = nos >= 30 ? "rgba(56,189,248,.6)" : panelBorder;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.strokeStyle = nos >= 30 ? (boosting ? "#38bdf8" : "#0284c7") : "#475569";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(nosCx, nosCy, nosR - 6, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * nos) / 100);
    ctx.stroke();

    drawText(ctx, boosting ? "BOOST" : "⚡ NOS", nosCx, nosCy - 1, 8, 950, boosting ? "#7dd3fc" : "#e0f2fe", "center");
    drawText(ctx, `${Math.round(nos)}%`, nosCx, nosCy + 11, 11, 950, "#ffffff", "center");
    ctx.restore();
  }

  // 7. Sürüş durumu: Her platformda oyun alanının üst bilgi katmanında kalır.
  const uyariY = 154;
  const uyariX = 14;
  const uyariW = isTouch ? 348 : 422;
  const uyariH = wanted >= 20 || isChasing ? 38 : 28;
  const uyariR = 14;

  if (wanted >= 20 || isChasing) {
    ctx.fillStyle = "rgba(7,9,12,.85)";
    roundRect(ctx, uyariX, uyariY, uyariW, uyariH, uyariR);
    ctx.fill();
    ctx.strokeStyle = "rgba(248,113,113,.4)";
    ctx.stroke();
    const cleanLeft = Math.max(0, 10 - Math.floor(cleanFrames / 60));
    drawText(ctx, "● POLİS TAKİBİ", uyariX + 12, uyariY + 15, 7.2, 950, "#f87171");
    drawText(ctx, cleanLeft > 0 ? `${cleanLeft}s temiz sür` : "İZ KAYBOLUYOR", uyariX + uyariW - 12, uyariY + 15, 7.2, 900, "#ffd3a1", "right");
    ctx.fillStyle = "rgba(255,255,255,.09)";
    roundRect(ctx, uyariX + 12, uyariY + 23, uyariW - 24, 5, 2.5);
    ctx.fill();
    ctx.fillStyle = arrest > 65 ? "#ff665b" : "#ffc85b";
    roundRect(ctx, uyariX + 12, uyariY + 23, ((uyariW - 24) * arrest) / 100, 5, 2.5);
    ctx.fill();
  } else {
    ctx.fillStyle = "rgba(7,9,12,.70)";
    roundRect(ctx, uyariX, uyariY, uyariW, uyariH, uyariR);
    ctx.fill();
    ctx.strokeStyle = panelBorder;
    ctx.stroke();
    drawText(ctx, violations ? `SON İHLAL · ${lastViolation}` : "✓ TEMİZ SÜRÜŞ · RİTMİ KORU", uyariX + 12, uyariY + 18, 7.5, 900, violations ? "#cbd5e1" : "#4ade80");
  }

  // 8. Combo
  if (combo > 1) {
    ctx.fillStyle = "rgba(42,31,9,.80)";
    roundRect(ctx, 14, wanted >= 20 || isChasing ? 198 : 188, 84, 24, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,200,80,.4)";
    ctx.stroke();
    drawText(ctx, `x${combo} SERİ`, 56, (wanted >= 20 || isChasing ? 198 : 188) + 16, 8, 900, "#fde047", "center");
  }
}
