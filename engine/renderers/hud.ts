import { VW, VH } from "../constants";
import { clamp, roundRect, drawText } from "../utils";
import type { RoutePhaseInfo } from "../types";

export function drawSpeedometer(
  ctx: CanvasRenderingContext2D,
  speed: number,
  isBraking: boolean,
  isThrottling: boolean
): void {
  const cx = 225, cy = 750, r = 38, maxKmh = 160;
  const ratio = clamp(speed / maxKmh, 0, 1);
  ctx.save();
  ctx.fillStyle = "rgba(7,10,14,.85)";
  ctx.beginPath();
  ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.12)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  const a0 = Math.PI * 0.76;
  const a1 = Math.PI * 2.24;
  const span = a1 - a0;

  ctx.strokeStyle = "rgba(255,255,255,.10)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, a0, a1);
  ctx.stroke();

  const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  grad.addColorStop(0, "#75dca4");
  grad.addColorStop(0.62, "#f1c75f");
  grad.addColorStop(1, "#ff7166");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, a0, a0 + span * ratio);
  ctx.stroke();

  for (let i = 0; i <= 8; i++) {
    const a = a0 + span * (i / 8);
    const inner = r - 8;
    const outer = r - 3;
    ctx.strokeStyle = i <= Math.round(ratio * 8) ? "rgba(244,246,242,.85)" : "rgba(255,255,255,.22)";
    ctx.lineWidth = i % 2 === 0 ? 1.6 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
    ctx.stroke();
  }

  const needleA = a0 + span * ratio;
  ctx.strokeStyle = "#f4f1e8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(needleA) * (r - 11), cy + Math.sin(needleA) * (r - 11));
  ctx.stroke();

  ctx.fillStyle = "#f4f1e8";
  ctx.beginPath();
  ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
  ctx.fill();

  drawText(ctx, String(speed), cx, cy + 4, 15, 950, isBraking ? "#ff9a8f" : isThrottling ? "#9aefc4" : "#fff", "center");
  drawText(ctx, "KM/H", cx, cy + 17, 5.7, 950, "#81909a", "center");
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
  controls: { throttle: boolean; brake: boolean }
): void {
  const panelBg = "rgba(7,11,16,.75)";
  const panelBorder = "rgba(255,255,255,.12)";

  // Üst panel gölgesi / karartması (yolla kusursuz bütünleşme için üst gradyan)
  const topFade = ctx.createLinearGradient(0, 0, 0, 160);
  topFade.addColorStop(0, "rgba(2,4,7,.65)");
  topFade.addColorStop(0.7, "rgba(2,4,7,.25)");
  topFade.addColorStop(1, "rgba(2,4,7,0)");
  ctx.fillStyle = topFade;
  ctx.fillRect(0, 0, VW, 160);

  // 1. Sol üst: Rota ve görev
  ctx.fillStyle = panelBg;
  roundRect(ctx, 14, 44, 220, 70, 18);
  ctx.fill();
  ctx.strokeStyle = panelBorder;
  ctx.stroke();

  drawText(ctx, phase.name, 28, 64, 8, 950, "#73e0d1");
  drawText(ctx, phase.sub, 28, 85, 14, 950, "#f6f7f6");
  drawText(ctx, missionTitle, 28, 103, 8.2, 700, "#82919c");
  drawText(ctx, missionProgress, 218, 103, 8.5, 900, "#ccd5db", "right");

  // 2. Sağ üst: Skor ve teslimat
  ctx.fillStyle = panelBg;
  roundRect(ctx, 244, 44, 192, 70, 18);
  ctx.fill();
  ctx.strokeStyle = panelBorder;
  ctx.stroke();

  drawText(ctx, "TESLİMAT", 260, 64, 7.2, 900, "#7d8b96");
  drawText(ctx, String(deliveries).padStart(2, "0"), 260, 91, 23, 950, "#f2c46d");
  drawText(ctx, "PUAN", 420, 64, 7.2, 900, "#7d8b96", "right");
  drawText(ctx, Math.floor(score).toLocaleString("tr-TR"), 420, 89, 13, 900, "#f3f5f5", "right");
  drawText(ctx, `★ ${unlockedCount}/${totalAchievements}`, 420, 106, 6.7, 900, "#dcbf74", "right");

  // 3. Saat pill ve Duraklat butonu
  ctx.fillStyle = "rgba(7,10,14,.72)";
  roundRect(ctx, 320, 122, 86, 25, 12.5);
  ctx.fill();
  ctx.strokeStyle = panelBorder;
  ctx.stroke();
  drawText(ctx, `${clockText} · ${phaseText}`, 363, 138, 8, 900, "#d9e5eb", "center");

  ctx.fillStyle = "rgba(7,10,14,.76)";
  ctx.beginPath();
  ctx.arc(423, 134, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = panelBorder;
  ctx.stroke();
  drawText(ctx, "Ⅱ", 423, 138, 8.5, 950, "#e8eeef", "center");

  // 4. Sol alt: Sağlık
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

  // 5. Orta alt: Hız göstergesi
  drawSpeedometer(ctx, speed, controls.brake, controls.throttle);

  // 6. Sağ alt: NOS göstergesi
  ctx.fillStyle = "rgba(7,10,14,.82)";
  ctx.beginPath();
  ctx.arc(397, 740, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = panelBorder;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.strokeStyle = nos >= 30 ? "#67d8ff" : "#5e6971";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(397, 740, 29, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * nos) / 100);
  ctx.stroke();
  drawText(ctx, boosting ? "BOOST" : "NOS", 397, 738, 7.5, 950, boosting ? "#9ce8ff" : "#8295a2", "center");
  drawText(ctx, `${Math.round(nos)}%`, 397, 754, 10.5, 950, "#fff", "center");

  // 7. Polis veya İhlal Paneli
  if (wanted >= 20 || isChasing) {
    ctx.fillStyle = "rgba(7,9,12,.80)";
    roundRect(ctx, 117, 670, 216, 48, 16);
    ctx.fill();
    ctx.strokeStyle = panelBorder;
    ctx.stroke();
    drawText(ctx, "POLİS TAKİBİ", 132, 690, 7.1, 950, "#ff7b70");
    const cleanLeft = Math.max(0, 10 - Math.floor(cleanFrames / 60));
    drawText(ctx, cleanLeft > 0 ? `${cleanLeft}s temiz` : "İZ KAYBOLUYOR", 318, 690, 7.6, 900, "#ffd3a1", "right");
    ctx.fillStyle = "rgba(255,255,255,.09)";
    roundRect(ctx, 132, 699, 186, 6, 3);
    ctx.fill();
    ctx.fillStyle = arrest > 65 ? "#ff665b" : "#ffc85b";
    roundRect(ctx, 132, 699, (186 * arrest) / 100, 6, 3);
    ctx.fill();
    drawText(ctx, `yakalanma ${Math.round(arrest)}%`, 318, 713, 6.8, 800, "#9eabb4", "right");
  } else {
    ctx.fillStyle = "rgba(7,9,12,.60)";
    roundRect(ctx, 130, 680, 190, 31, 14);
    ctx.fill();
    ctx.strokeStyle = panelBorder;
    ctx.stroke();
    drawText(ctx, violations ? `Son ihlal: ${lastViolation}` : "Temiz sürüş", 225, 700, 7.7, 850, violations ? "#aeb8bf" : "#84deb0", "center");
  }

  // 8. Combo
  if (combo > 1) {
    ctx.fillStyle = "rgba(42,31,9,.75)";
    roundRect(ctx, 18, 126, 84, 26, 13);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,200,80,.3)";
    ctx.stroke();
    drawText(ctx, `x${combo} SERİ`, 60, 143, 8, 900, "#ffe09b", "center");
  }
}
