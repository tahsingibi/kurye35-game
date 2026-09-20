import { VW, VH, HORIZON } from "../constants";
import { clamp, lerp, mixColor, daylight, nightLevel, roadT, roadCenter, roadHalf, approachDepth } from "../utils";

// ==========================================
// 1. İZMİR YOL KENARI PERSPEKTİF SİLÜETLERİ
// ==========================================

// A) Konak Saat Kulesi (Yol Kenarında Yaklaşan Perspektif)
function drawPerspectiveSaatKulesi(
  ctx: CanvasRenderingContext2D,
  side: number,
  y: number,
  scale: number,
  day: number,
  night: number,
  frame: number,
  phase: number
): void {
  const edge = roadCenter(y, frame, phase) + side * (roadHalf(y) + 16 + scale * 18);
  const w = 34 * scale;
  const h = 105 * scale;
  const x = side < 0 ? edge - w : edge;
  const cx = x + w / 2;
  const base = y;
  const top = y - h;

  // Taban gölgesi
  ctx.fillStyle = "rgba(0,0,0,.36)";
  ctx.beginPath();
  ctx.ellipse(cx, base, w * 0.75, 4 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Kaide
  const baseGrad = ctx.createLinearGradient(x, top, x, base);
  baseGrad.addColorStop(0, mixColor("#352e26", "#8c8275", day * 0.55));
  baseGrad.addColorStop(1, mixColor("#1c1813", "#453f38", day * 0.45));
  ctx.fillStyle = baseGrad;

  // Alt geniş platform (sekizgen kaide)
  ctx.fillRect(cx - w * 0.46, base - 18 * scale, w * 0.92, 18 * scale);
  // Orta revaklı gövde
  ctx.fillRect(cx - w * 0.32, base - 62 * scale, w * 0.64, 44 * scale);
  // Üst saat katı
  ctx.fillRect(cx - w * 0.26, base - 82 * scale, w * 0.52, 20 * scale);

  // Saat kadranı (Daire)
  ctx.fillStyle = night > 0.2 ? `rgba(255,235,160,${0.3 + 0.6 * night})` : mixColor("#211b14", "#cfc2ad", day * 0.65);
  ctx.beginPath();
  ctx.arc(cx, base - 72 * scale, 5.5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Üst kubbe ve alem
  ctx.fillStyle = mixColor("#3a3128", "#887c6f", day * 0.52);
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.24, base - 82 * scale);
  ctx.lineTo(cx, top + 6 * scale);
  ctx.lineTo(cx + w * 0.24, base - 82 * scale);
  ctx.closePath();
  ctx.fill();

  // İnce tepe alemi
  ctx.fillRect(cx - 1 * scale, top, 2 * scale, 8 * scale);
  if (night > 0.25) {
    ctx.shadowBlur = 8 * night;
    ctx.shadowColor = "#ff5544";
    ctx.fillStyle = "rgba(255,80,60,.9)";
    ctx.beginPath();
    ctx.arc(cx, top, 1.5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// B) Buca Kemerleri (Yol Kenarında Antik Su Kemeri Silüeti)
function drawPerspectiveBucaKemer(
  ctx: CanvasRenderingContext2D,
  side: number,
  y: number,
  scale: number,
  day: number,
  night: number,
  frame: number,
  phase: number
): void {
  const edge = roadCenter(y, frame, phase) + side * (roadHalf(y) + 14 + scale * 16);
  const w = 58 * scale;
  const h = 72 * scale;
  const x = side < 0 ? edge - w : edge;
  const base = y;
  const top = y - h;

  // Taban gölgesi
  ctx.fillStyle = "rgba(0,0,0,.3)";
  ctx.beginPath();
  ctx.ellipse(x + w / 2, base, w * 0.6, 3.5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Kemer taş gövdesi
  const kemerGrad = ctx.createLinearGradient(x, top, x, base);
  kemerGrad.addColorStop(0, mixColor("#3d352b", "#8a7e70", day * 0.52));
  kemerGrad.addColorStop(1, mixColor("#1a1612", "#423b33", day * 0.42));
  ctx.fillStyle = kemerGrad;

  // Üst taş hat
  ctx.fillRect(x, top, w, 14 * scale);

  // Taş payandalar (3 sütun)
  const colW = 10 * scale;
  ctx.fillRect(x, top + 14 * scale, colW, h - 14 * scale);
  ctx.fillRect(x + (w - colW) / 2, top + 14 * scale, colW, h - 14 * scale);
  ctx.fillRect(x + w - colW, top + 14 * scale, colW, h - 14 * scale);

  // Kemer oyukları (Yarım daire tonozlar)
  ctx.fillStyle = mixColor("#0a0c10", "#21282e", day * 0.4);
  const archR = (w / 2 - colW) * 0.52;
  const arch1Cx = x + colW + archR;
  const arch2Cx = x + w - colW - archR;
  const archCy = top + 26 * scale;

  ctx.beginPath();
  ctx.arc(arch1Cx, archCy, archR, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(arch2Cx, archCy, archR, Math.PI, 0);
  ctx.fill();

  // Gece tarihi aydınlatma
  if (night > 0.2) {
    ctx.fillStyle = `rgba(255,200,90,${0.1 + 0.35 * night})`;
    ctx.fillRect(x + 2, top + 14 * scale, w - 4, 2 * scale);
  }
}

// C) Bostanlı Köprü Heykeli (Gün Batımı Seyir Köprüsü ve Modern Anıt)
function drawPerspectiveBostanli(
  ctx: CanvasRenderingContext2D,
  side: number,
  y: number,
  scale: number,
  day: number,
  night: number,
  frame: number,
  phase: number
): void {
  const edge = roadCenter(y, frame, phase) + side * (roadHalf(y) + 16 + scale * 16);
  const w = 48 * scale;
  const h = 64 * scale;
  const x = side < 0 ? edge - w : edge;
  const cx = x + w / 2;
  const base = y;
  const top = y - h;

  // Gölge
  ctx.fillStyle = "rgba(0,0,0,.3)";
  ctx.beginPath();
  ctx.ellipse(cx, base, w * 0.55, 3.5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dalgalı ahşap gün batımı köprü rampası
  ctx.fillStyle = mixColor("#2e261d", "#7c6b57", day * 0.55);
  ctx.beginPath();
  ctx.moveTo(x, base);
  ctx.quadraticCurveTo(cx, base - 28 * scale, x + w, base - 10 * scale);
  ctx.lineTo(x + w, base);
  ctx.closePath();
  ctx.fill();

  // Modern Heykel (Kıvrımlı çelik gün batımı heykeli)
  ctx.strokeStyle = mixColor("#354555", "#90aabf", day * 0.6);
  ctx.lineWidth = 3.5 * scale;
  ctx.beginPath();
  ctx.moveTo(cx, base - 18 * scale);
  ctx.bezierCurveTo(cx - 16 * scale, top + 18 * scale, cx + 18 * scale, top + 6 * scale, cx, top);
  ctx.stroke();

  // Heykelin tepe küresi
  ctx.fillStyle = night > 0.2 ? `rgba(120,225,255,${0.4 + 0.5 * night})` : mixColor("#253d4c", "#7dc2e8", day * 0.7);
  ctx.beginPath();
  ctx.arc(cx, top, 4 * scale, 0, Math.PI * 2);
  ctx.fill();
}

// D) Alsancak Atlı Atatürk Heykeli (Gündoğdu Meydanı)
function drawPerspectiveAlsancakAtli(
  ctx: CanvasRenderingContext2D,
  side: number,
  y: number,
  scale: number,
  day: number,
  night: number,
  frame: number,
  phase: number
): void {
  const edge = roadCenter(y, frame, phase) + side * (roadHalf(y) + 16 + scale * 16);
  const w = 44 * scale;
  const h = 76 * scale;
  const x = side < 0 ? edge - w : edge;
  const cx = x + w / 2;
  const base = y;
  const top = y - h;

  // Gölge
  ctx.fillStyle = "rgba(0,0,0,.35)";
  ctx.beginPath();
  ctx.ellipse(cx, base, w * 0.65, 4 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Kaide (Mermer anıt platformu)
  ctx.fillStyle = mixColor("#242c33", "#74808c", day * 0.55);
  ctx.fillRect(cx - w * 0.38, base - 28 * scale, w * 0.76, 28 * scale);
  ctx.fillStyle = mixColor("#181f25", "#555f69", day * 0.5);
  ctx.fillRect(cx - w * 0.44, base - 8 * scale, w * 0.88, 8 * scale);

  // Şaha kalkmış at ve süvari silüeti
  ctx.fillStyle = mixColor("#131a20", "#3a4650", day * 0.6);
  ctx.beginPath();
  // At gövdesi ve arka ayaklar
  ctx.moveTo(cx - 8 * scale, base - 28 * scale);
  ctx.lineTo(cx - 2 * scale, base - 44 * scale);
  // Şaha kalkan ön ayaklar
  ctx.lineTo(cx + 12 * scale, base - 58 * scale);
  ctx.lineTo(cx + 8 * scale, base - 54 * scale);
  // At başı
  ctx.lineTo(cx + 11 * scale, base - 66 * scale);
  ctx.lineTo(cx + 4 * scale, base - 60 * scale);
  // Süvari gövdesi ve şapkası
  ctx.lineTo(cx, base - 68 * scale);
  ctx.lineTo(cx - 4 * scale, base - 56 * scale);
  // Arka kuyruk
  ctx.lineTo(cx - 14 * scale, base - 38 * scale);
  ctx.closePath();
  ctx.fill();

  // Gece anıt spot ışığı
  if (night > 0.2) {
    ctx.shadowBlur = 10 * night;
    ctx.shadowColor = "#ffdf96";
    ctx.fillStyle = `rgba(255,225,150,${0.15 + 0.35 * night})`;
    ctx.beginPath();
    ctx.arc(cx, base - 48 * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// E) Kordon Palmiyesi (Yol Kenarında Yaklaşan)
function drawPerspectivePalmiye(
  ctx: CanvasRenderingContext2D,
  side: number,
  y: number,
  scale: number,
  day: number,
  frame: number,
  phase: number
): void {
  const edge = roadCenter(y, frame, phase) + side * (roadHalf(y) + 12 + scale * 12);
  const cx = side < 0 ? edge - 12 * scale : edge + 12 * scale;
  const base = y;
  const h = 68 * scale;
  const top = y - h;

  // Gölge
  ctx.fillStyle = "rgba(0,0,0,.25)";
  ctx.beginPath();
  ctx.ellipse(cx, base, 14 * scale, 3 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eğri gövde
  ctx.strokeStyle = mixColor("#1c1813", "#5c5042", day * 0.55);
  ctx.lineWidth = 3.2 * scale;
  ctx.beginPath();
  ctx.moveTo(cx, base);
  ctx.quadraticCurveTo(cx + (side < 0 ? -6 : 6) * scale, base - h * 0.5, cx, top);
  ctx.stroke();

  // Palmiye yaprakları
  ctx.fillStyle = mixColor("#122416", "#35583b", day * 0.65);
  const fronds = [-1.3, -0.8, -0.2, 0.3, 0.9, 1.4];
  for (const a of fronds) {
    ctx.save();
    ctx.translate(cx, top);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(8 * scale, -8 * scale, 22 * scale, -4 * scale);
    ctx.quadraticCurveTo(8 * scale, -2 * scale, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

// Standart Bina (Perspektif)
export function drawPerspectiveBuilding(
  ctx: CanvasRenderingContext2D,
  side: number,
  y: number,
  seed = 0,
  gameMinutes: number,
  frame: number,
  phase: number
): void {
  if (y < HORIZON || y > VH + 120) return;
  const t = roadT(Math.min(y, VH));
  const day = daylight(gameMinutes);
  const night = nightLevel(gameMinutes);
  const scale = 0.30 + t * 1.28;
  const edge = roadCenter(y, frame, phase) + side * (roadHalf(y) + 14 + t * 25);
  const w = (30 + (seed % 4) * 7) * scale;
  const h = (58 + (seed % 5) * 12) * scale;
  const x = side < 0 ? edge - w : edge;
  const top = y - h;

  const g = ctx.createLinearGradient(x, top, x + w, y);
  g.addColorStop(0, mixColor(seed % 2 ? "#222c36" : "#182230", seed % 2 ? "#9aa4a8" : "#858d92", day * 0.64));
  g.addColorStop(1, mixColor("#0c1118", "#555e62", day * 0.55));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x, top + 8 * scale);
  ctx.lineTo(x + w, top);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = mixColor("#11181e", "#697477", day * 0.5);
  ctx.fillRect(x - 2 * scale, top, w + 4 * scale, 4 * scale);

  const cols = seed % 2 ? 2 : 3;
  const rows = 3 + (seed % 3);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c + seed) % 2 === 0) {
        const wx = x + w * (0.18 + (c / (cols + 1)) * 0.72);
        const wy = top + h * (0.25 + (r / (rows + 1)) * 0.62);
        ctx.fillStyle = `rgba(255,205,120,${0.025 + 0.27 * night})`;
        ctx.fillRect(wx, wy, Math.max(1.5, 3 * scale), Math.max(2, 5 * scale));
      }
    }
  }

  // Zemin gölgesi
  ctx.fillStyle = "rgba(0,0,0,.3)";
  ctx.beginPath();
  ctx.ellipse(side < 0 ? x + w * 0.82 : x + w * 0.18, y, w * 0.4, 4 + 8 * t, 0, 0, Math.PI * 2);
  ctx.fill();
}

// =========================================================================
// 2. YOL KENARINDAN AKAN BİNALAR VE İZMİR SİLÜETLERİ (SAĞDAN SOLDAN GEÇENLER)
// =========================================================================
export function drawMovingBuildings(
  ctx: CanvasRenderingContext2D,
  worldDistance: number,
  gameMinutes: number,
  frame: number,
  phase: number
): void {
  const day = daylight(gameMinutes);
  const night = nightLevel(gameMinutes);

  // 6 farklı mesafe offseti ile sürekli sağdan ve soldan yaklaşım
  const offsets = [40, 195, 360, 520, 680, 840];
  const cycle = 1000;

  for (let i = 0; i < offsets.length; i++) {
    // Sol kanat
    const yLeft = approachDepth(offsets[i], worldDistance, cycle);
    if (yLeft >= HORIZON && yLeft < VH + 115) {
      const t = roadT(Math.min(yLeft, VH));
      const scale = 0.30 + t * 1.28;
      const typeLeft = (i + Math.floor(worldDistance / cycle) * 2) % 6;

      if (typeLeft === 0) {
        drawPerspectiveSaatKulesi(ctx, -1, yLeft, scale, day, night, frame, phase);
      } else if (typeLeft === 1) {
        drawPerspectiveBucaKemer(ctx, -1, yLeft, scale, day, night, frame, phase);
      } else if (typeLeft === 2) {
        drawPerspectiveAlsancakAtli(ctx, -1, yLeft, scale, day, night, frame, phase);
      } else if (typeLeft === 3) {
        drawPerspectivePalmiye(ctx, -1, yLeft, scale, day, frame, phase);
      } else {
        drawPerspectiveBuilding(ctx, -1, yLeft, i + 1, gameMinutes, frame, phase);
      }
    }

    // Sağ kanat
    const yRight = approachDepth(offsets[i] + 85, worldDistance, cycle);
    if (yRight >= HORIZON && yRight < VH + 115) {
      const t = roadT(Math.min(yRight, VH));
      const scale = 0.30 + t * 1.28;
      const typeRight = (i + Math.floor(worldDistance / cycle) * 2 + 3) % 6;

      if (typeRight === 0) {
        drawPerspectiveSaatKulesi(ctx, 1, yRight, scale, day, night, frame, phase);
      } else if (typeRight === 1) {
        drawPerspectiveBostanli(ctx, 1, yRight, scale, day, night, frame, phase);
      } else if (typeRight === 2) {
        drawPerspectivePalmiye(ctx, 1, yRight, scale, day, frame, phase);
      } else if (typeRight === 3) {
        drawPerspectiveAlsancakAtli(ctx, 1, yRight, scale, day, night, frame, phase);
      } else {
        drawPerspectiveBuilding(ctx, 1, yRight, i + 8, gameMinutes, frame, phase);
      }
    }
  }
}

// ==========================================
// 3. UZAK ŞEHİR SİLÜETİ VE KÖRFEZ
// ==========================================
export function drawDistantSkyline(ctx: CanvasRenderingContext2D, gameMinutes: number, phase: number): void {
  const day = daylight(gameMinutes);
  const night = nightLevel(gameMinutes);

  // Arka Ege Tepeleri (Ufukla gökyüzünü organik bağlayan dağlar)
  const hill = ctx.createLinearGradient(0, HORIZON - 75, 0, HORIZON + 15);
  hill.addColorStop(0, mixColor("#131c26", "#7e8d9c", day * 0.48));
  hill.addColorStop(0.6, mixColor("#0c141d", "#525f6c", day * 0.42));
  hill.addColorStop(1, mixColor("#060a0f", "#262e36", day * 0.38));
  ctx.fillStyle = hill;
  ctx.beginPath();
  ctx.moveTo(0, HORIZON + 15);
  for (let x = 0; x <= VW; x += 20) {
    const y = HORIZON - 18 - Math.sin(x * 0.03 + phase) * 8 - Math.sin(x * 0.012 + 1.2) * 10;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(VW, HORIZON + 15);
  ctx.closePath();
  ctx.fill();

  // Ufuktaki silüet binaları (Sol ve sağ kanat, yoldan dışarı doğru yükselir)
  const skylineBuildings = [
    { x: 0, w: 30, h: 54 },
    { x: 28, w: 26, h: 48 },
    { x: 52, w: 24, h: 38 },
    { x: 74, w: 22, h: 30 },
    { x: 94, w: 24, h: 22 },
    { x: 116, w: 20, h: 16 },
    { x: 314, w: 20, h: 16 },
    { x: 332, w: 24, h: 24 },
    { x: 354, w: 22, h: 32 },
    { x: 374, w: 26, h: 42 },
    { x: 398, w: 24, h: 50 },
    { x: 420, w: 30, h: 58 },
  ];

  for (let i = 0; i < skylineBuildings.length; i++) {
    const b = skylineBuildings[i];
    const topY = HORIZON - b.h;
    const bGrad = ctx.createLinearGradient(b.x, topY, b.x, HORIZON);
    bGrad.addColorStop(0, mixColor(i % 2 ? "#182430" : "#121a24", i % 2 ? "#6f7d8c" : "#5a6876", day * 0.52));
    bGrad.addColorStop(1, mixColor("#080c12", "#283038", day * 0.4));
    ctx.fillStyle = bGrad;
    ctx.fillRect(b.x, topY, b.w, b.h + 8);

    if (night > 0.18) {
      for (let wy = topY + 8; wy < HORIZON - 2; wy += 9) {
        for (let wx = b.x + 4; wx < b.x + b.w - 3; wx += 6) {
          if ((wx + wy + i) % 4 === 0) {
            ctx.fillStyle = `rgba(255, 218, 130, ${0.06 + 0.36 * night})`;
            ctx.fillRect(wx, wy, 2, 3);
          }
        }
      }
    }
  }
}

// İzmir Körfezi (Ege Denizi) - Kordon Etabı
export function drawWaterfront(ctx: CanvasRenderingContext2D, gameMinutes: number): void {
  const day = daylight(gameMinutes);
  const night = nightLevel(gameMinutes);

  const waterGrad = ctx.createLinearGradient(0, HORIZON, 0, HORIZON + 80);
  waterGrad.addColorStop(0, mixColor("#062035", "#2a7098", day * 0.72));
  waterGrad.addColorStop(1, mixColor("#020812", "#0e2e40", day * 0.55));
  ctx.fillStyle = waterGrad;
  ctx.beginPath();
  ctx.moveTo(300, HORIZON);
  ctx.lineTo(VW, HORIZON);
  ctx.lineTo(VW, HORIZON + 90);
  ctx.lineTo(350, HORIZON + 75);
  ctx.lineTo(300, HORIZON + 35);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 8; i++) {
    const wy = HORIZON + 8 + i * 8;
    const wx = 320 + ((i * 28) % 70);
    ctx.fillStyle = i % 2 ? `rgba(100,190,255,${0.08 + 0.04 * day})` : `rgba(255,200,100,${0.05 + 0.03 * night})`;
    ctx.fillRect(wx, wy, 16 + (i % 2) * 6, 1);
  }
}
