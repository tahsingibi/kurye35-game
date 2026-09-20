import { Player } from "./entities/player";
import { TrafficItem } from "./entities/traffic";
import { PoliceUnit } from "./entities/police";

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function checkAABBHit(a: Box, b: Box, ma = 6, mb = 4): boolean {
  return (
    a.x + ma < b.x + b.w - mb &&
    a.x + a.w - ma > b.x + mb &&
    a.y + ma < b.y + b.h - mb &&
    a.y + a.h - ma > b.y + mb
  );
}

export function handlePoliceTrafficCollisions(
  police: PoliceUnit[],
  items: TrafficItem[],
  onPoliceCrash: (policeUnit: PoliceUnit, item: TrafficItem) => void
): void {
  for (const p of police) {
    if (p.retiring || p.crashed || p.alpha < 0.65) continue;
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      if (it.type === "parcel" || it.type === "puddle") continue;
      if (checkAABBHit(p, it, 5, 4)) {
        p.crash();
        onPoliceCrash(p, it);
        if (it.type !== "bus" && it.type !== "works") {
          items.splice(i, 1);
        } else {
          it.passed = true;
        }
        break;
      }
    }
  }
}
