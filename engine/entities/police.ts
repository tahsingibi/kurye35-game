import { VH, HORIZON } from "../constants";
import { clamp, roadCenter, roadHalf, depthScale, roundRect, drawText } from "../utils";
import { vehicleShadow, rearLights, plate } from "../renderers/vehicles";
import type { TrafficItem } from "./traffic";
import type { Player } from "./player";

export class PoliceUnit {
  lanePos: number;
  targetLane: number;
  laneVel = 0;
  steerAccel = 0;
  reaction: number;
  y = VH + 96;
  vy = -1.1;
  longAccel = 0;
  alpha = 0;
  retiring = false;
  crashed = false;
  crashFrames = 0;
  spin = 0;
  hitCooldown = 0;
  baseW = 50;
  baseH = 76;
  x = 0;
  w = 0;
  h = 0;

  constructor() {
    this.lanePos = Math.floor(Math.random() * 3);
    this.targetLane = this.lanePos;
    this.reaction = 14 + Math.random() * 18;
    this.updateBounds(0, 0);
  }

  centerX(frame: number, phase: number): number {
    const yy = clamp(this.y, HORIZON, VH);
    return roadCenter(yy, frame, phase) + (this.lanePos - 1) * roadHalf(yy) * 0.54;
  }

  updateBounds(frame: number, phase: number): void {
    const yy = clamp(this.y, HORIZON, VH);
    const s = depthScale(yy);
    this.w = this.baseW * s;
    this.h = this.baseH * s;
    this.x = this.centerX(frame, phase) - this.w / 2;
  }

  laneClear(lane: number, items: TrafficItem[], lookAhead = 135): boolean {
    return !items.some(
      (it) => it.type !== "parcel" && it.type !== "puddle" && Math.abs(it.lane - lane) < 0.45 && it.y < this.y && this.y - it.y < lookAhead
    );
  }

  chooseTargetLane(player: Player, items: TrafficItem[]): void {
    let desired = player.lane;
    const blocking = items.find(
      (it) => it.type !== "parcel" && it.type !== "puddle" && Math.abs(it.lane - desired) < 0.45 && it.y < this.y && this.y - it.y < 150
    );
    if (blocking && this.y - blocking.y > 72) {
      const choices = [desired - 1, desired + 1].filter((l) => l >= 0 && l <= 2 && this.laneClear(l, items, 120));
      if (choices.length) {
        desired = choices.sort((a, b) => Math.abs(a - this.lanePos) - Math.abs(b - this.lanePos))[0];
      }
    }
    this.targetLane = clamp(desired, 0, 2);
  }

  crash(): void {
    if (this.crashed || this.retiring) return;
    this.crashed = true;
    this.crashFrames = 110;
    this.spin = (Math.random() < 0.5 ? -1 : 1) * (0.07 + Math.random() * 0.05);
    this.laneVel += (Math.random() < 0.5 ? -1 : 1) * 0.045;
    this.vy = 2.2;
  }

  update(
    player: Player,
    items: TrafficItem[],
    wanted: number,
    boosting: boolean,
    frame: number,
    phase: number
  ): { arrestDelta: number } {
    let arrestDelta = 0;
    if (this.hitCooldown > 0) this.hitCooldown--;

    if (this.crashed) {
      this.crashFrames--;
      this.lanePos += this.laneVel;
      this.laneVel *= 0.985;
      this.y += Math.max(1.5, this.vy);
      this.vy = Math.min(5.8, this.vy + 0.055);
      this.alpha = this.crashFrames < 35 ? Math.max(0, this.alpha - 0.03) : Math.min(1, this.alpha + 0.05);
      this.updateBounds(frame, phase);
      return { arrestDelta: 0 };
    }

    if (this.retiring) {
      this.alpha = Math.max(0, this.alpha - 0.022);
      this.longAccel = 0.09;
      this.vy = Math.min(6.2, this.vy + this.longAccel);
      this.laneVel *= 0.94;
      this.lanePos += this.laneVel;
      this.y += this.vy;
      this.updateBounds(frame, phase);
      return { arrestDelta: 0 };
    }

    this.alpha = Math.min(1, this.alpha + 0.055);
    this.reaction--;
    if (this.reaction <= 0) {
      this.chooseTargetLane(player, items);
      this.reaction = Math.max(11, 30 - Math.floor(wanted * 0.13)) + Math.random() * 10;
    }

    const laneError = this.targetLane - this.lanePos;
    const maxSteerAccel = 0.0054 + Math.min(0.0022, wanted * 0.000022);
    this.steerAccel = clamp(laneError * 0.008 - this.laneVel * 0.19, -maxSteerAccel, maxSteerAccel);
    this.laneVel = clamp(this.laneVel + this.steerAccel, -0.047, 0.047);
    if (Math.abs(laneError) < 0.035 && Math.abs(this.laneVel) < 0.012) this.laneVel *= 0.78;
    this.lanePos = clamp(this.lanePos + this.laneVel, -0.08, 2.08);

    const desiredGap = boosting ? 150 : 102;
    const targetY = player.y + desiredGap;
    const gapError = targetY - this.y;
    const maxAccel = 0.19 + Math.min(0.07, wanted * 0.0007);
    this.longAccel = clamp(gapError * 0.0036 - this.vy * 0.075, -maxAccel, maxAccel);
    this.vy = clamp(this.vy + this.longAccel, -4.5, 5.4);
    this.y += this.vy;
    if (this.y > VH + 118) {
      this.y = VH + 118;
      this.vy = Math.min(this.vy, 0);
    }
    this.updateBounds(frame, phase);

    const aligned = Math.abs(this.x + this.w / 2 - (player.x + player.w / 2)) < 28;
    const close = this.y - player.y < 116 && this.y > player.y + 34;
    if (wanted >= 20 && aligned && close && !boosting) {
      arrestDelta = 0.15 + wanted * 0.001;
    }

    return { arrestDelta };
  }

  draw(ctx: CanvasRenderingContext2D, frame: number): void {
    const s = depthScale(clamp(this.y, HORIZON, VH));
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y);
    ctx.scale(s, s);
    const steerTilt = this.crashed ? this.spin * this.crashFrames * 0.12 : clamp(-this.laneVel * 7, -0.16, 0.16);
    ctx.rotate(steerTilt);
    vehicleShadow(ctx, 52, 76);

    const g = ctx.createLinearGradient(-25, -38, 25, 38);
    g.addColorStop(0, "#f1f3f4");
    g.addColorStop(0.62, "#b9c2c8");
    g.addColorStop(1, "#7c8992");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-20, -35);
    ctx.quadraticCurveTo(0, -42, 20, -35);
    ctx.lineTo(25, 29);
    ctx.quadraticCurveTo(0, 39, -25, 29);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#142330";
    roundRect(ctx, -16, -25, 32, 20, 5);
    ctx.fill();
    ctx.fillStyle = "#285b86";
    ctx.fillRect(-21, 3, 42, 14);
    drawText(ctx, "POLİS", 0, 13, 5.7, 950, "#fff", "center");

    if (!this.crashed) {
      const flashState = Math.floor(frame / 7) % 2;
      ctx.shadowBlur = 11;
      ctx.fillStyle = flashState ? "#3b82f6" : "#ef4444";
      ctx.shadowColor = ctx.fillStyle;
      ctx.fillRect(-13, -39, 12, 4);
      ctx.fillStyle = flashState ? "#ef4444" : "#3b82f6";
      ctx.shadowColor = ctx.fillStyle;
      ctx.fillRect(2, -39, 12, 4);
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = "rgba(30,30,30,.7)";
      ctx.beginPath();
      ctx.arc(15, -32, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    rearLights(ctx, 52, 22);
    plate(ctx, 30);
    ctx.restore();
  }
}
