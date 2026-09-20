import { VW, VH, HORIZON } from "../constants";
import { clamp, lerp, mixColor, daylight, twilight, nightLevel, roadT, roadCenter, roadHalf } from "../utils";

export function drawRoad(
  ctx: CanvasRenderingContext2D,
  gameMinutes: number,
  frame: number,
  phase: number,
  roadScroll: number,
  wet: number
): void {
  const day = daylight(gameMinutes);
  const tw = twilight(gameMinutes);
  const night = nightLevel(gameMinutes);

  // 1. Zemin geçişi: Gökyüzü taban rengi ile araziyi birleştiren kademeli zemin
  let groundSkyTone = mixColor("#1b2a36", "#c5bba8", day);
  if (tw > 0.02) groundSkyTone = mixColor(groundSkyTone, "#b06056", tw * 0.7);

  const groundGrad = ctx.createLinearGradient(0, HORIZON - 25, 0, VH);
  groundGrad.addColorStop(0, groundSkyTone);
  groundGrad.addColorStop(0.08, mixColor("#131a22", "#353f46", day * 0.5));
  groundGrad.addColorStop(0.35, mixColor("#0a0e13", "#1e2429", day * 0.45));
  groundGrad.addColorStop(1, "#05070a");

  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, HORIZON - 10, VW, VH - HORIZON + 10);

  // 2. Yol banketleri / Otoyol şevi (Yolun zemine doğrudan oturmasını sağlayan yumuşak geçiş)
  const cxTop = roadCenter(HORIZON, frame, phase);
  const halfTop = roadHalf(HORIZON);
  const cxBot = roadCenter(VH, frame, phase);
  const halfBot = roadHalf(VH);

  // Banket (Shoulder) alanı
  ctx.beginPath();
  ctx.moveTo(cxTop - halfTop - 12, HORIZON);
  ctx.lineTo(cxTop + halfTop + 12, HORIZON);
  ctx.lineTo(cxBot + halfBot + 48, VH);
  ctx.lineTo(cxBot - halfBot - 48, VH);
  ctx.closePath();
  ctx.fillStyle = mixColor("#10171e", "#2b343c", day * 0.5);
  ctx.fill();

  // 3. Asfalt poligonu
  ctx.beginPath();
  ctx.moveTo(cxTop - halfTop, HORIZON);
  ctx.lineTo(cxTop + halfTop, HORIZON);
  ctx.lineTo(cxBot + halfBot, VH);
  ctx.lineTo(cxBot - halfBot, VH);
  ctx.closePath();

  const rg = ctx.createLinearGradient(0, HORIZON, 0, VH);
  rg.addColorStop(0, mixColor("#2c3238", "#53595f", day * 0.55));
  rg.addColorStop(0.35, mixColor("#1e2327", "#44494e", day * 0.48));
  rg.addColorStop(1, mixColor("#121518", "#2d3135", day * 0.42));
  ctx.fillStyle = rg;
  ctx.fill();

  // 4. Islak asfalt yansıması
  if (wet > 0.05) {
    ctx.save();
    ctx.clip();
    const wg = ctx.createLinearGradient(0, HORIZON, 0, VH);
    wg.addColorStop(0, "rgba(120,160,180,.02)");
    wg.addColorStop(1, `rgba(87,132,154,${0.14 * wet})`);
    ctx.fillStyle = wg;
    ctx.fillRect(0, HORIZON, VW, VH - HORIZON);
    ctx.restore();
  }

  // 5. Bordür ve bariyerler (Çift katmanlı ve perspektif uyumlu)
  for (const side of [-1, 1]) {
    ctx.strokeStyle = mixColor("#485159", "#788189", day * 0.4);
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let y = HORIZON; y <= VH; y += 16) {
      const x = roadCenter(y, frame, phase) + side * roadHalf(y);
      if (y === HORIZON) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let y = HORIZON; y <= VH; y += 16) {
      const x = roadCenter(y, frame, phase) + side * (roadHalf(y) + 8 + roadT(y) * 8);
      if (y === HORIZON) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // 6. Şerit çizgileri
  for (let divider = 0.5; divider <= 1.5; divider += 1) {
    for (let i = 0; i < 18; i++) {
      const offset = (roadScroll * 2.1) % (VH - HORIZON);
      const y = HORIZON + ((i * 55 + offset) % (VH - HORIZON));
      const t = roadT(y);
      const y2 = Math.min(VH, y + lerp(8, 35, t));
      const half1 = roadHalf(y);
      const half2 = roadHalf(y2);
      const cx1 = roadCenter(y, frame, phase);
      const cx2 = roadCenter(y2, frame, phase);
      const ratio = divider === 0.5 ? -0.27 : 0.27;
      const x = cx1 + half1 * ratio;
      const x2 = cx2 + half2 * ratio;
      ctx.strokeStyle = `rgba(236,238,230,${0.1 + t * 0.6})`;
      ctx.lineWidth = lerp(1, 4.2, t);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  // 7. Yol dokusu
  for (let i = 0; i < 28; i++) {
    const y = HORIZON + ((i * 67 + roadScroll * 0.8) % (VH - HORIZON));
    const t = roadT(y);
    const x = roadCenter(y, frame, phase) + (((i * 97) % 100) / 100 - 0.5) * roadHalf(y) * 1.5;
    ctx.fillStyle = `rgba(255,255,255,${0.012 + t * 0.016})`;
    ctx.fillRect(x, y, lerp(6, 28, t), 1);
  }

  // 8. Reflektörler
  for (let i = 0; i < 11; i++) {
    const y = HORIZON + ((i * 78 + roadScroll * 1.7) % (VH - HORIZON));
    const t = roadT(y);
    for (const side of [-1, 1]) {
      const x = roadCenter(y, frame, phase) + side * roadHalf(y) * 0.92;
      ctx.fillStyle = side === -1 ? "rgba(255,205,95,.65)" : "rgba(255,255,255,.55)";
      ctx.beginPath();
      ctx.arc(x, y, 1 + t * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 9. Islak zemin gece ışık yansımaları
  if (wet > 0.35) {
    for (let i = 0; i < 7; i++) {
      const y = 430 + i * 58 + ((roadScroll * 0.8) % 58);
      const t = roadT(y);
      const x = roadCenter(y, frame, phase) + (i % 2 ? -0.6 : 0.6) * roadHalf(y);
      const g = ctx.createLinearGradient(x, y, x, y + 70);
      g.addColorStop(0, i % 2 ? "rgba(255,179,72,.14)" : "rgba(80,180,255,.11)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - 5, y, 10, 70);
    }
  }

  // 10. UFUK SİSİ VE ATMOSFERİK ENTEGRASYON (Yolun gökyüzüyle ve binalarla kusursuz birleşimi)
  const hazeGrad = ctx.createLinearGradient(0, HORIZON - 35, 0, HORIZON + 45);
  const fogColor = night > 0.25 ? "14, 20, 28" : "190, 205, 220";
  hazeGrad.addColorStop(0, `rgba(${fogColor}, 0)`);
  hazeGrad.addColorStop(0.45, `rgba(${fogColor}, ${0.35 + (1 - night) * 0.25})`);
  hazeGrad.addColorStop(0.7, `rgba(${fogColor}, ${0.2 + (1 - night) * 0.15})`);
  hazeGrad.addColorStop(1, `rgba(${fogColor}, 0)`);
  ctx.fillStyle = hazeGrad;
  ctx.fillRect(0, HORIZON - 35, VW, 80);
}

export function drawStreetFurniture(
  ctx: CanvasRenderingContext2D,
  gameMinutes: number,
  frame: number,
  phase: number,
  roadScroll: number
): void {
  const night = nightLevel(gameMinutes);
  for (let i = 0; i < 7; i++) {
    const y = HORIZON + 35 + ((i * 112 + roadScroll * 1.45) % (VH - HORIZON - 20));
    const t = roadT(y);
    for (const side of [-1, 1]) {
      const x = roadCenter(y, frame, phase) + side * (roadHalf(y) + 18 + t * 18);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(0.35 + t * 0.9, 0.35 + t * 0.9);
      ctx.strokeStyle = "#39434c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.lineTo(0, -32);
      ctx.lineTo(-side * 9, -32);
      ctx.stroke();

      ctx.fillStyle = `rgba(255,215,125,${0.08 + 0.92 * night})`;
      ctx.shadowBlur = 12 * night;
      ctx.shadowColor = "#ffd77d";
      ctx.beginPath();
      ctx.arc(-side * 10, -31, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }
}
