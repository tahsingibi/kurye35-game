import { VW, VH, HORIZON } from "../constants";
import { clamp, lerp, mixColor, daylight, nightLevel, roadT, roadCenter, roadHalf, approachDepth, roundRect, drawText } from "../utils";

// Altınyol / Bayraklı Kavşak Viyadüğü & Üst Geçidi
// Alsancak - Karşıyaka arasındaki ana arterde gerçekçi Karayolları viyadüğü
export function drawApproachingBridge(
  ctx: CanvasRenderingContext2D,
  worldDistance: number,
  gameMinutes: number,
  frame: number,
  phase: number
): void {
  if (phase !== 2) return; // Sadece Altınyol etabında viyadük geçişi

  const y = approachDepth(130, worldDistance, 1150);
  if (y > VH + 80 || y < HORIZON - 20) return;

  const t = clamp(roadT(y), 0, 1);
  const cx = roadCenter(y, frame, phase);
  const half = roadHalf(y);

  const bridgeWidth = lerp(120, 440, t);
  const pillarHeight = lerp(30, 160, t);
  const pillarWidth = lerp(6, 28, t);
  const beamTop = y - pillarHeight;
  const beamHeight = lerp(8, 30, t);

  const fadeIn = clamp((y - HORIZON) / 70, 0, 1);
  const fadeOut = clamp((VH + 40 - y) / 160, 0, 1);
  const alpha = fadeIn * fadeOut;

  ctx.save();
  ctx.globalAlpha = alpha;

  const day = daylight(gameMinutes);
  const night = nightLevel(gameMinutes);

  const leftPillarX = cx - half - pillarWidth * 0.3;
  const rightPillarX = cx + half + pillarWidth * 0.3;

  // 1. Zemin asfalt gölgesi
  ctx.fillStyle = `rgba(0,0,0,${0.35 + 0.25 * t})`;
  ctx.beginPath();
  ctx.ellipse(cx, y + 4, bridgeWidth * 0.52, lerp(4, 16, t), 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Betonarme Viyadük Ayakları (Pilonlar)
  const drawPillar = (px: number, isRight: boolean) => {
    const x = isRight ? px : px - pillarWidth;
    const pg = ctx.createLinearGradient(x, beamTop, x + pillarWidth, y);
    pg.addColorStop(0, mixColor("#38424a", "#8c98a2", day * 0.52));
    pg.addColorStop(0.5, mixColor("#232b31", "#5d6770", day * 0.45));
    pg.addColorStop(1, mixColor("#14191d", "#383f46", day * 0.38));
    ctx.fillStyle = pg;

    ctx.beginPath();
    ctx.moveTo(x + (isRight ? 0 : pillarWidth * 0.15), beamTop);
    ctx.lineTo(x + (isRight ? pillarWidth * 0.85 : pillarWidth), beamTop);
    ctx.lineTo(x + pillarWidth, y + 6);
    ctx.lineTo(x, y + 6);
    ctx.closePath();
    ctx.fill();

    // Beton derz çizgisi
    ctx.strokeStyle = mixColor("#1c2227", "#485158", day * 0.4);
    ctx.lineWidth = lerp(1, 2, t);
    ctx.beginPath();
    ctx.moveTo(x, beamTop + pillarHeight * 0.5);
    ctx.lineTo(x + pillarWidth, beamTop + pillarHeight * 0.5);
    ctx.stroke();

    // Gece ikaz lambası
    if (night > 0.2) {
      const lampX = isRight ? x + pillarWidth * 0.5 : x + pillarWidth * 0.5;
      const lampY = beamTop + 4;
      ctx.shadowBlur = 8 * night;
      ctx.shadowColor = "#ffb040";
      ctx.fillStyle = `rgba(255,180,70,${0.7 + 0.3 * night})`;
      ctx.beginPath();
      ctx.arc(lampX, lampY, lerp(1.2, 3, t), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  drawPillar(leftPillarX, false);
  drawPillar(rightPillarX, true);

  // 3. Viyadük Üst Kirişi ve Tabliyesi
  const beamLeft = leftPillarX - pillarWidth * 0.6;
  const beamRight = rightPillarX + pillarWidth * 0.6;
  const beamW = beamRight - beamLeft;

  const beamGrad = ctx.createLinearGradient(0, beamTop - beamHeight, 0, beamTop);
  beamGrad.addColorStop(0, mixColor("#46525c", "#98a5b0", day * 0.52));
  beamGrad.addColorStop(0.6, mixColor("#293239", "#636f7a", day * 0.44));
  beamGrad.addColorStop(1, mixColor("#161c20", "#3a434a", day * 0.38));
  ctx.fillStyle = beamGrad;
  roundRect(ctx, beamLeft, beamTop - beamHeight, beamW, beamHeight, lerp(2, 5, t));
  ctx.fill();

  // Üst korkuluk rayı
  ctx.fillStyle = mixColor("#5d6b76", "#b0bdc8", day * 0.5);
  ctx.fillRect(beamLeft, beamTop - beamHeight - lerp(2, 6, t), beamW, lerp(1.5, 4, t));

  // 4. Standart Karayolları Otoyol Yön Tabelası (Yeşil Zemin, Beyaz Çerçeve)
  const signW = lerp(75, 210, t);
  const signH = lerp(14, 32, t);
  const signY = beamTop - beamHeight * 0.7;

  // Tabela yeşil zemin (Karayolları Otoyol Standardı)
  ctx.fillStyle = "rgba(14,80,50,.96)";
  roundRect(ctx, cx - signW / 2, signY - signH / 2, signW, signH, lerp(2, 5, t));
  ctx.fill();

  // Beyaz çerçeve
  ctx.strokeStyle = "rgba(240,250,245,.85)";
  ctx.lineWidth = lerp(0.8, 1.8, t);
  ctx.stroke();

  // Tabela yazısı
  drawText(ctx, "KARŞIYAKA  •  BORNOVA", cx, signY + lerp(2.5, 5, t), lerp(4.5, 9.5, t), 900, "#f2fcf6", "center");

  ctx.restore();
}

// Yol Üstü Portal Yön Tabelaları (Karayolları Standardı)
export function drawApproachingRouteLandmark(
  ctx: CanvasRenderingContext2D,
  worldDistance: number,
  gameMinutes: number,
  frame: number,
  phase: number
): void {
  if (phase === 2) return; // Altınyol etabında viyadük çizilir

  const y = approachDepth(phase === 4 ? 240 : 520, worldDistance, 1030);
  if (y > 570 || y < HORIZON) return;

  const t = roadT(y);
  const cx = roadCenter(y, frame, phase);
  const half = roadHalf(y);

  ctx.save();
  ctx.globalAlpha = clamp((570 - y) / 75, 0, 1);

  const left = cx - half - 6;
  const right = cx + half + 6;
  const top = y - lerp(38, 118, t);

  ctx.strokeStyle = mixColor("#4b5964", "#78848c", daylight(gameMinutes) * 0.42);
  ctx.lineWidth = lerp(2, 7, t);

  ctx.beginPath();
  ctx.moveTo(left, y + 4);
  ctx.lineTo(left, top);
  ctx.lineTo(right, top);
  ctx.lineTo(right, y + 4);
  ctx.stroke();

  // Gerçekçi Karayolları güzergâh yön levhaları
  const labels = [
    "ALSANCAK  •  KORDON",
    "ALTINYOL  •  BAYRAKLI",
    "",
    "BOSTANLI  •  MAVİŞEHİR",
    "O-30  •  ÇEŞME  •  AYDIN"
  ];
  const label = labels[phase] || "İZMİR";
  const bw = lerp(85, 215, t);
  const bh = lerp(20, 44, t);

  // Karayolları yeşil otoyol tabelası
  ctx.fillStyle = phase === 4 ? "rgba(10,50,90,.95)" : "rgba(14,75,48,.95)";
  roundRect(ctx, cx - bw / 2, top - bh * 0.55, bw, bh, lerp(3, 7, t));
  ctx.fill();

  ctx.strokeStyle = "rgba(240,250,245,.85)";
  ctx.lineWidth = 1 + t * 1.4;
  ctx.stroke();

  drawText(ctx, label, cx, top + 4 + t * 3, lerp(5.5, 10.5, t), 900, "#f0faf5", "center");
  ctx.restore();
}
