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

export type TrafficBehavior = "normal" | "laneChangeWarning" | "changingLane";

export class TrafficItem {
  lane: number;
  lanePos: number;
  targetLane: number;
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
  behavior: TrafficBehavior = "normal";
  behaviorTimer = 0;
  indicatorDirection: -1 | 0 | 1 = 0;
  isTrafficEvent = false;
  hasChangedLane = false;

  constructor(forceType: TrafficType | null = null) {
    this.lane = Math.floor(Math.random() * 3);
    this.lanePos = this.lane;
    this.targetLane = this.lane;
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
    this.x = laneCenter(this.lanePos, this.y, frame, phase) - this.w / 2;
  }

  get isVehicle(): boolean {
    return this.type === "taxi" || this.type === "sedan" || this.type === "van" || this.type === "bus";
  }

  startLaneChange(targetLane: number): void {
    if (!this.isVehicle || this.behavior !== "normal" || targetLane < 0 || targetLane > 2) return;
    this.targetLane = targetLane;
    this.indicatorDirection = targetLane > this.lanePos ? 1 : -1;
    this.behavior = "laneChangeWarning";
    this.behaviorTimer = 42;
    this.isTrafficEvent = true;
    this.hasChangedLane = true;
  }

  update(baseSpeed: number, boosting: boolean, frame: number, phase: number): void {
    const speed = baseSpeed * (0.48 + roadT(this.y) * 0.94) * (boosting ? 1.34 : 1);
    const eventSpeedScale = this.behavior === "laneChangeWarning" || this.behavior === "changingLane" ? 0.94 : 1;
    this.y += speed * eventSpeedScale;

    if (this.behavior === "laneChangeWarning") {
      this.behaviorTimer--;
      if (this.behaviorTimer <= 0) this.behavior = "changingLane";
    } else if (this.behavior === "changingLane") {
      const laneError = this.targetLane - this.lanePos;
      const lateralStep = Math.sign(laneError) * Math.min(Math.abs(laneError), 0.018);
      this.lanePos += lateralStep;
      if (Math.abs(laneError) < 0.03) {
        this.lanePos = this.targetLane;
        this.lane = this.targetLane;
        this.indicatorDirection = 0;
        this.behavior = "normal";
        this.isTrafficEvent = false;
      }
    }
    this.updateBounds(frame, phase);
  }

  draw(ctx: CanvasRenderingContext2D, frame: number, phase: number): void {
    const s = depthScale(this.y);
    ctx.save();
    ctx.translate(laneCenter(this.lanePos, this.y, frame, phase), this.y);
    ctx.scale(s, s);

    if (this.type === "parcel") drawParcel(ctx, frame);
    else if (this.type === "taxi") drawTaxi(ctx);
    else if (this.type === "sedan") drawSedan(ctx, this.variant);
    else if (this.type === "van") drawVan(ctx);
    else if (this.type === "bus") drawBus(ctx);
    else if (this.type === "works") drawRoadworks(ctx);
    else if (this.type === "puddle") drawPuddle(ctx);

    if ((this.behavior === "laneChangeWarning" || this.behavior === "changingLane") && Math.floor(frame / 7) % 2 === 0) {
      const ix = this.indicatorDirection < 0 ? -19 : 19;
      ctx.fillStyle = "#ffb21c";
      ctx.shadowColor = "#ff9d00";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(ix, 22, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }
}
