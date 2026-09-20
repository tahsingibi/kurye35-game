"use client";

import React, { useRef, useCallback } from "react";
import { GameEngine } from "@/engine/game-engine";
import { t } from "@/utils/localization";
import { JoystickPosition } from "@/utils/settings";

interface TouchControlsProps {
  engine: GameEngine;
  visible: boolean;
  layout?: JoystickPosition;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  engine,
  visible,
  layout = "left",
}) => {
  const steerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSteer = useCallback((dir: "left" | "right") => {
    if (dir === "left") engine.moveLeft();
    else engine.moveRight();

    if (steerIntervalRef.current) clearInterval(steerIntervalRef.current);
    steerIntervalRef.current = setInterval(() => {
      if (dir === "left") engine.moveLeft();
      else engine.moveRight();
    }, 160);
  }, [engine]);

  const stopSteer = useCallback(() => {
    if (steerIntervalRef.current) {
      clearInterval(steerIntervalRef.current);
      steerIntervalRef.current = null;
    }
  }, []);

  const handleThrottleStart = useCallback(() => {
    engine.controls.throttle = true;
    engine.controls.brake = false;
  }, [engine]);

  const handleThrottleEnd = useCallback(() => {
    engine.controls.throttle = false;
  }, [engine]);

  const handleBrakeStart = useCallback(() => {
    engine.controls.brake = true;
    engine.controls.throttle = false;
  }, [engine]);

  const handleBrakeEnd = useCallback(() => {
    engine.controls.brake = false;
  }, [engine]);

  const handleNos = useCallback(() => {
    engine.activateNOS();
  }, [engine]);

  if (!visible) return null;

  const isLeftLayout = layout === "left";

  const SteerGroup = (
    <div className="flex items-center gap-2.5 pointer-events-auto">
      <button
        onPointerDown={(e) => { e.preventDefault(); startSteer("left"); }}
        onPointerUp={stopSteer}
        onPointerLeave={stopSteer}
        onPointerCancel={stopSteer}
        className="w-16 h-16 rounded-2xl bg-slate-900/85 border-2 border-teal-500/50 active:border-teal-400 active:bg-teal-500/20 active:scale-95 text-teal-300 active:text-teal-200 text-2xl font-black shadow-lg shadow-black/60 flex items-center justify-center select-none touch-none transition-transform"
      >
        ←
      </button>
      <button
        onPointerDown={(e) => { e.preventDefault(); startSteer("right"); }}
        onPointerUp={stopSteer}
        onPointerLeave={stopSteer}
        onPointerCancel={stopSteer}
        className="w-16 h-16 rounded-2xl bg-slate-900/85 border-2 border-teal-500/50 active:border-teal-400 active:bg-teal-500/20 active:scale-95 text-teal-300 active:text-teal-200 text-2xl font-black shadow-lg shadow-black/60 flex items-center justify-center select-none touch-none transition-transform"
      >
        →
      </button>
    </div>
  );

  const PedalGroup = (
    <div className="flex items-center gap-2 pointer-events-auto">
      {/* NOS Butonu */}
      <button
        onPointerDown={(e) => { e.preventDefault(); handleNos(); }}
        className="w-13 h-14 px-3 rounded-2xl bg-sky-950/80 border-2 border-sky-400/60 active:bg-sky-400/30 active:scale-95 text-sky-300 text-xs font-black shadow-lg shadow-sky-950/50 flex flex-col items-center justify-center select-none touch-none transition-all"
      >
        <span className="text-sm leading-none">⚡</span>
        <span className="text-[10px] tracking-wider">{t("hud.nos")}</span>
      </button>

      {/* FREN Pedalı */}
      <button
        onPointerDown={(e) => { e.preventDefault(); handleBrakeStart(); }}
        onPointerUp={handleBrakeEnd}
        onPointerLeave={handleBrakeEnd}
        onPointerCancel={handleBrakeEnd}
        className="w-15 h-16 px-3.5 rounded-2xl bg-rose-950/80 border-2 border-rose-500/50 active:bg-rose-500/25 active:border-rose-400 active:scale-95 text-rose-300 text-xs font-black shadow-lg shadow-black/60 flex flex-col items-center justify-center select-none touch-none transition-all"
      >
        <span className="text-base leading-none">▼</span>
        <span className="text-[10px] tracking-wider">{t("hud.touch_brake")}</span>
      </button>

      {/* GAZ Pedalı */}
      <button
        onPointerDown={(e) => { e.preventDefault(); handleThrottleStart(); }}
        onPointerUp={handleThrottleEnd}
        onPointerLeave={handleThrottleEnd}
        onPointerCancel={handleThrottleEnd}
        className="w-16 h-16 px-4 rounded-2xl bg-emerald-950/85 border-2 border-emerald-400/60 active:bg-emerald-400/25 active:border-emerald-300 active:scale-95 text-emerald-300 text-xs font-black shadow-lg shadow-black/60 flex flex-col items-center justify-center select-none touch-none transition-all"
      >
        <span className="text-lg leading-none">▲</span>
        <span className="text-[11px] tracking-wider">{t("hud.touch_throttle")}</span>
      </button>
    </div>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-2 pointer-events-none z-30 flex items-end justify-between max-w-lg mx-auto select-none">
      {isLeftLayout ? (
        <>
          {SteerGroup}
          {PedalGroup}
        </>
      ) : (
        <>
          {PedalGroup}
          {SteerGroup}
        </>
      )}
    </div>
  );
};
