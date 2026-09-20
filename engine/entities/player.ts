import { VW } from "../constants";
import { roundRect, drawText, laneCenter } from "../utils";

export class Player {
  lane = 1;
  x = VW / 2;
  y = 633;
  w = 48;
  h = 88;
  invuln = 0;
  laneLock = 0;

  update(rain: number, frame: number, phase: number): void {
    const targetX = laneCenter(this.lane, this.y, frame, phase) - this.w / 2;
    this.x += (targetX - this.x) * (rain > 0.5 ? 0.18 : 0.28);
    if (this.invuln > 0) this.invuln--;
    if (this.laneLock > 0) this.laneLock--;
  }

  draw(ctx: CanvasRenderingContext2D, boosting: boolean, health: number, frame: number): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.invuln > 0 && Math.floor(this.invuln / 4) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    // Boost ateşi
    if (boosting) {
      const g = ctx.createLinearGradient(24, 62, 24, 126);
      g.addColorStop(0, "rgba(82,210,255,.55)");
      g.addColorStop(0.45, "rgba(255,130,45,.35)");
      g.addColorStop(1, "rgba(255,85,20,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(15, 62);
      ctx.lineTo(4, 124);
      ctx.lineTo(44, 124);
      ctx.lineTo(33, 62);
      ctx.closePath();
      ctx.fill();
    }

    // Gölge
    ctx.fillStyle = "rgba(0,0,0,.5)";
    ctx.beginPath();
    ctx.ellipse(24, 80, 29, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tekerlekler
    ctx.fillStyle = "#050608";
    roundRect(ctx, 18, 47, 12, 37, 6);
    ctx.fill();
    ctx.fillStyle = "#3a4148";
    roundRect(ctx, 20, 49, 8, 31, 4);
    ctx.fill();

    // Gövde
    const bodyGrad = ctx.createLinearGradient(10, 20, 38, 76);
    bodyGrad.addColorStop(0, "#20272e");
    bodyGrad.addColorStop(0.55, "#0d1116");
    bodyGrad.addColorStop(1, "#050709");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(14, 28);
    ctx.quadraticCurveTo(24, 18, 34, 28);
    ctx.lineTo(38, 66);
    ctx.quadraticCurveTo(24, 78, 10, 66);
    ctx.closePath();
    ctx.fill();

    // Kurye Çantası (Sıcak/Turuncu çanta)
    ctx.fillStyle = "#d92e38";
    roundRect(ctx, 12, 47, 24, 17, 7);
    ctx.fill();
    ctx.fillStyle = "#fb6535";
    roundRect(ctx, 5, 31, 38, 29, 6);
    ctx.fill();
    ctx.fillStyle = "#ff9b67";
    ctx.fillRect(8, 35, 32, 3);
    drawText(ctx, "35", 24, 50, 9, 950, "#fff", "center");

    // Sürücü ve kask
    ctx.fillStyle = "#10161d";
    roundRect(ctx, 16, 15, 16, 27, 7);
    ctx.fill();
    ctx.fillStyle = "#e43c32";
    ctx.beginPath();
    ctx.arc(24, 15, 12, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0b1015";
    roundRect(ctx, 12, 14, 24, 5, 2);
    ctx.fill();

    // Aynalar
    ctx.strokeStyle = "#6f7780";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14, 28);
    ctx.lineTo(4, 22);
    ctx.moveTo(34, 28);
    ctx.lineTo(44, 22);
    ctx.stroke();
    ctx.fillStyle = "#111820";
    ctx.beginPath();
    ctx.arc(3, 21, 4, 0, Math.PI * 2);
    ctx.arc(45, 21, 4, 0, Math.PI * 2);
    ctx.fill();

    // Arka stop ve plaka
    ctx.fillStyle = "#ff314c";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff314c";
    roundRect(ctx, 18, 65, 12, 5, 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#eef2f4";
    roundRect(ctx, 17, 72, 14, 5, 1);
    ctx.fill();
    drawText(ctx, "35", 24, 76, 4.5, 900, "#14181c", "center");

    // Hasar dumanı
    if (health < 45) {
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = `rgba(170,180,188,${0.18 - i * 0.04})`;
        ctx.beginPath();
        ctx.arc(36 + i * 4, 15 - i * 10 - ((frame * 0.55 + i * 9) % 15), 4 + i * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}
