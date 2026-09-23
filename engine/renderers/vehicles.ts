import { roundRect, drawText } from "../utils";

export function vehicleShadow(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = "rgba(0,0,0,.44)";
  ctx.beginPath();
  ctx.ellipse(0, h * 0.42, w * 0.58, h * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function rearLights(ctx: CanvasRenderingContext2D, w: number, y: number): void {
  ctx.fillStyle = "#ff273a";
  roundRect(ctx, -w / 2 + 3, y, 9, 4, 1);
  ctx.fill();
  roundRect(ctx, w / 2 - 12, y, 9, 4, 1);
  ctx.fill();
}

export function plate(ctx: CanvasRenderingContext2D, y: number, w = 18): void {
  ctx.fillStyle = "#f3f5f6";
  roundRect(ctx, -w / 2, y, w, 6, 1);
  ctx.fill();
  drawText(ctx, "35 TR", 0, y + 4.5, 3.8, 900, "#161b20", "center");
}

export function drawTaxi(ctx: CanvasRenderingContext2D): void {
  const w = 48, h = 72;
  vehicleShadow(ctx, w, h);
  const g = ctx.createLinearGradient(-24, -36, 24, 36);
  g.addColorStop(0, "#ffd33f");
  g.addColorStop(0.55, "#e7a80e");
  g.addColorStop(1, "#9c6a00");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-20, -34);
  ctx.quadraticCurveTo(0, -42, 20, -34);
  ctx.lineTo(24, 27);
  ctx.quadraticCurveTo(0, 39, -24, 27);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#17212a";
  roundRect(ctx, -16, -25, 32, 20, 5);
  ctx.fill();
  ctx.fillStyle = "rgba(130,191,220,.22)";
  roundRect(ctx, -13, -22, 26, 9, 3);
  ctx.fill();
  ctx.fillStyle = "#11161b";
  roundRect(ctx, -11, -42, 22, 7, 2);
  ctx.fill();
  drawText(ctx, "TAKSİ", 0, -37, 4.5, 900, "#ffd94d", "center");
  ctx.fillStyle = "#24292d";
  ctx.fillRect(-21, 1, 42, 4);
  rearLights(ctx, w, 20);
  plate(ctx, 28);
}

export function drawSedan(ctx: CanvasRenderingContext2D, variant: number): void {
  const w = 48, h = 70;
  vehicleShadow(ctx, w, h);
  const palette = variant > 0.66 ? ["#6a737d", "#333b43"] : variant > 0.33 ? ["#1d5a74", "#0c2837"] : ["#742f3a", "#3a161d"];
  const g = ctx.createLinearGradient(-20, -35, 22, 35);
  g.addColorStop(0, palette[0]);
  g.addColorStop(1, palette[1]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-18, -33);
  ctx.quadraticCurveTo(0, -40, 18, -33);
  ctx.lineTo(23, 27);
  ctx.quadraticCurveTo(0, 37, -23, 27);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#101820";
  roundRect(ctx, -15, -24, 30, 20, 5);
  ctx.fill();
  ctx.fillStyle = "rgba(155,205,226,.18)";
  roundRect(ctx, -12, -21, 24, 8, 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.14)";
  ctx.beginPath();
  ctx.moveTo(-19, -2);
  ctx.lineTo(19, -2);
  ctx.stroke();
  rearLights(ctx, w, 20);
  plate(ctx, 28);
}

export function drawVan(ctx: CanvasRenderingContext2D): void {
  const w = 52, h = 82;
  vehicleShadow(ctx, w, h);
  const g = ctx.createLinearGradient(-26, -43, 26, 40);
  g.addColorStop(0, "#dedfdc");
  g.addColorStop(0.55, "#aeb5b8");
  g.addColorStop(1, "#707a80");
  ctx.fillStyle = g;
  roundRect(ctx, -25, -42, 50, 76, 7);
  ctx.fill();

  ctx.fillStyle = "#18232d";
  roundRect(ctx, -18, -34, 36, 22, 4);
  ctx.fill();
  ctx.fillStyle = "rgba(157,207,225,.18)";
  roundRect(ctx, -15, -31, 30, 9, 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(40,45,50,.55)";
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(0, 22);
  ctx.stroke();
  ctx.fillStyle = "#de493d";
  roundRect(ctx, -18, -5, 36, 14, 3);
  ctx.fill();
  drawText(ctx, "SERVİS", 0, 5, 5.5, 900, "#fff", "center");
  rearLights(ctx, w, 25);
  plate(ctx, 33);
}

export function drawBus(ctx: CanvasRenderingContext2D): void {
  const w = 58, h = 98;
  vehicleShadow(ctx, w, h);
  const g = ctx.createLinearGradient(-29, -50, 29, 48);
  g.addColorStop(0, "#eceee8");
  g.addColorStop(0.7, "#b8c0c0");
  g.addColorStop(1, "#738087");
  ctx.fillStyle = g;
  roundRect(ctx, -28, -50, 56, 92, 7);
  ctx.fill();

  ctx.fillStyle = "#111b23";
  roundRect(ctx, -22, -42, 44, 28, 4);
  ctx.fill();
  ctx.fillStyle = "rgba(107,181,211,.21)";
  roundRect(ctx, -19, -39, 38, 12, 3);
  ctx.fill();
  ctx.fillStyle = "#d43c36";
  ctx.fillRect(-28, 8, 56, 11);
  drawText(ctx, "ESHOT", 0, 17, 6.2, 950, "#fff", "center");
  rearLights(ctx, w, 31);
  plate(ctx, 38, 20);
}

export function drawRoadworks(ctx: CanvasRenderingContext2D): void {
  vehicleShadow(ctx, 66, 42);
  ctx.fillStyle = "#1d242a";
  roundRect(ctx, -34, -7, 68, 30, 6);
  ctx.fill();
  ctx.fillStyle = "#f3f4ee";
  roundRect(ctx, -31, -14, 62, 26, 5);
  ctx.fill();
  ctx.save();
  roundRect(ctx, -31, -14, 62, 26, 5);
  ctx.clip();
  ctx.rotate(-0.18);
  ctx.fillStyle = "#ff741d";
  for (let x = -48; x < 55; x += 18) ctx.fillRect(x, -28, 9, 60);
  ctx.restore();
  ctx.fillStyle = "#292e33";
  ctx.fillRect(-26, 11, 6, 9);
  ctx.fillRect(20, 11, 6, 9);
}

export function drawPuddle(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "rgba(80,142,174,.16)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 38, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(160,220,245,.20)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(5, -1, 25, 5, 0, 0, Math.PI * 2);
  ctx.stroke();
}

export function drawParcel(ctx: CanvasRenderingContext2D, frame: number): void {
  const pulse = 0.65 + Math.sin(frame * 0.09) * 0.2;
  ctx.fillStyle = `rgba(255,199,102,${0.12 + pulse * 0.08})`;
  ctx.beginPath();
  ctx.arc(0, 0, 31, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(255,210,120,${0.46 + pulse * 0.25})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 25 + Math.sin(frame * 0.09) * 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 16;
  ctx.shadowColor = "rgba(255,170,60,.5)";
  ctx.fillStyle = "#d97724";
  roundRect(ctx, -16, -16, 32, 31, 6);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#f4b35f";
  ctx.fillRect(-3, -16, 6, 31);
  ctx.fillRect(-16, -3, 32, 6);
  ctx.fillStyle = "#fff2d8";
  roundRect(ctx, -9, -23, 18, 9, 3);
  ctx.fill();
  drawText(ctx, "35", 0, -16, 5.5, 950, "#5d3515", "center");
}
