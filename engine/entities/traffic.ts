import { HORIZON } from "../constants";
import { laneCenter, depthScale, roadT } from "../utils";
import type { TrafficType } from "../types";
import {
  drawTaxi,
  drawSedan,
  drawVan,
  drawBus,
  drawRoadworks,
  drawPuddle,
  drawParcel,
} from "../renderers/vehicles";

export class TrafficItem {
  lane: number;
  y: number;
  baseW: number;
  baseH: number;
  dead = false;
  passed = false;
  variant: number;
  type: TrafficType;
  w = 0;
  h = 0;
  x = 0;

  constructor(forceType: TrafficType | null = null) {
    this.lane = Math.floor(Math.random() * 3);
    this.y = HORIZON + 2;
    this.baseW = 46;
    this.baseH = 70;
    this.variant = Math.random();

    const r = Math.random();
    this.type =
      forceType ||
      (r < 0.19
        ? "parcel"
        : r < 0.38
        ? "taxi"
        : r < 0.59
        ? "sedan"
        : r < 0.74
        ? "van"
        : r < 0.86
        ? "bus"
        : r < 0.94
        ? "works"
        : "puddle");

    if (this.type === "parcel") {
      this.baseW = 34;
      this.baseH = 36;
    } else if (this.type === "bus") {
      this.baseW = 56;
      this.baseH = 94;
    } else if (this.type === "works") {
      this.baseW = 64;
      this.baseH = 40;
    } else if (this.type === "puddle") {
      this.baseW = 72;
      this.baseH = 22;
    }
  }

  updateBounds(frame: number, phase: number): void {
    const s = depthScale(this.y);
    this.w = this.baseW * s;
    this.h = this.baseH * s;
    this.x = laneCenter(this.lane, this.y, frame, phase) - this.w / 2;
  }

  update(baseSpeed: number, boosting: boolean, frame: number, phase: number): void {
    const speed = baseSpeed * (0.48 + roadT(this.y) * 0.94) * (boosting ? 1.34 : 1);
    this.y += speed;
    this.updateBounds(frame, phase);
  }

  draw(ctx: CanvasRenderingContext2D, frame: number, phase: number): void {
    const s = depthScale(this.y);
    ctx.save();
    ctx.translate(laneCenter(this.lane, this.y, frame, phase), this.y);
    ctx.scale(s, s);

    if (this.type === "parcel") drawParcel(ctx, frame);
    else if (this.type === "taxi") drawTaxi(ctx);
    else if (this.type === "sedan") drawSedan(ctx, this.variant);
    else if (this.type === "van") drawVan(ctx);
    else if (this.type === "bus") drawBus(ctx);
    else if (this.type === "works") drawRoadworks(ctx);
    else if (this.type === "puddle") drawPuddle(ctx);

    ctx.restore();
  }
}
