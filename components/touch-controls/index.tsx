"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { GameEngine } from "@/engine/game-engine";
import { t } from "@/utils/localization";
import { JoystickPosition, ButtonSize } from "@/utils/settings";

interface TouchControlsProps {
  engine: GameEngine;
  visible: boolean;
  layout?: JoystickPosition;
  buttonSize?: ButtonSize;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  engine,
  visible,
  layout = "left",
  buttonSize = "medium",
}) => {
  const steerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [nosPercent, setNosPercent] = useState(engine.nos);
  const [isBoosting, setIsBoosting] = useState(engine.boosting);

  // NOS durumunu buton üzerinde canlı güncellemek için animation frame
  useEffect(() => {
    if (!visible) return;
    let animId: number;
    const updateNos = () => {
      setNosPercent(Math.round(engine.nos));
      setIsBoosting(engine.boosting);
      animId = requestAnimationFrame(updateNos);
    };
    animId = requestAnimationFrame(updateNos);
    return () => cancelAnimationFrame(animId);
  }, [engine, visible]);

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

  // Buton ve NOS boyut haritası
  const sizeMap: Record<ButtonSize, {
    btnPx: number;
    nosPx: number;
    textClass: string;
    labelClass: string;
  }> = {
    small: { btnPx: 64, nosPx: 52, textClass: "text-2xl", labelClass: "text-[11px]" },
    medium: { btnPx: 76, nosPx: 60, textClass: "text-3xl", labelClass: "text-[12px]" },
    large: { btnPx: 90, nosPx: 70, textClass: "text-4xl", labelClass: "text-[13px]" },
  };

  const currentSize = sizeMap[buttonSize] || sizeMap.medium;
  const btnStyle = { width: `${currentSize.btnPx}px`, height: `${currentSize.btnPx}px` };
  const nosStyle = { width: `${currentSize.nosPx}px`, height: `${currentSize.nosPx}px` };

  const nosAvailable = nosPercent >= 30;
  const radius = (currentSize.nosPx - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (nosPercent / 100) * circumference;

  // Tıklanabilir Dairesel NOS Butonu / Göstergesi
  const NosButton = (
    <button
      onPointerDown={(e) => { e.preventDefault(); handleNos(); }}
      style={nosStyle}
      className={`relative rounded-full flex flex-col items-center justify-center select-none touch-none transition-all active:scale-90 active:brightness-125 pointer-events-auto ${
        nosAvailable
          ? "bg-slate-950/90 shadow-lg shadow-sky-500/25 border border-sky-400/60"
          : "bg-slate-950/80 border border-slate-700/60 opacity-80"
      }`}
      aria-label="NOS Göstergesi ve Butonu"
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx={currentSize.nosPx / 2}
          cy={currentSize.nosPx / 2}
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="3.5"
          fill="none"
        />
        <circle
          cx={currentSize.nosPx / 2}
          cy={currentSize.nosPx / 2}
          r={radius}
          stroke={nosAvailable ? (isBoosting ? "#7dd3fc" : "#38bdf8") : "#64748b"}
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-100"
        />
      </svg>
      <span className="text-[10px] font-black leading-none text-sky-300">
        {isBoosting ? "BOOST" : "⚡ NOS"}
      </span>
      <span className="text-[11px] font-black leading-none text-white mt-0.5">
        {nosPercent}%
      </span>
    </button>
  );

  const SteerGroup = (
    <div className="flex flex-col items-center gap-2 pointer-events-auto shrink-0">
      {NosButton}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onPointerDown={(e) => { e.preventDefault(); startSteer("left"); }}
          onPointerUp={stopSteer}
          onPointerLeave={stopSteer}
          onPointerCancel={stopSteer}
          style={btnStyle}
          className="rounded-3xl bg-slate-900/90 border-2 border-teal-500/60 active:border-teal-300 active:bg-teal-500/30 active:scale-90 active:brightness-125 text-teal-300 active:text-white font-black shadow-2xl shadow-black/80 flex items-center justify-center select-none touch-none transition-all duration-75"
          aria-label="Sol"
        >
          <span className={currentSize.textClass}>←</span>
        </button>
        <button
          onPointerDown={(e) => { e.preventDefault(); startSteer("right"); }}
          onPointerUp={stopSteer}
          onPointerLeave={stopSteer}
          onPointerCancel={stopSteer}
          style={btnStyle}
          className="rounded-3xl bg-slate-900/90 border-2 border-teal-500/60 active:border-teal-300 active:bg-teal-500/30 active:scale-90 active:brightness-125 text-teal-300 active:text-white font-black shadow-2xl shadow-black/80 flex items-center justify-center select-none touch-none transition-all duration-75"
          aria-label="Sağ"
        >
          <span className={currentSize.textClass}>→</span>
        </button>
      </div>
    </div>
  );

  const PedalGroup = (
    <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto shrink-0 self-end">
      {/* FREN Pedalı */}
      <button
        onPointerDown={(e) => { e.preventDefault(); handleBrakeStart(); }}
        onPointerUp={handleBrakeEnd}
        onPointerLeave={handleBrakeEnd}
        onPointerCancel={handleBrakeEnd}
        style={btnStyle}
        className="rounded-3xl bg-rose-950/90 border-2 border-rose-500/70 active:bg-rose-500/40 active:border-rose-300 active:scale-90 active:brightness-125 text-rose-200 active:text-white font-black shadow-2xl shadow-black/80 flex flex-col items-center justify-center select-none touch-none transition-all duration-75"
        aria-label="Fren"
      >
        <span className="text-xl sm:text-2xl leading-none">▼</span>
        <span className={`${currentSize.labelClass} tracking-wider mt-1 font-black`}>{t("hud.touch_brake")}</span>
      </button>

      {/* GAZ Pedalı */}
      <button
        onPointerDown={(e) => { e.preventDefault(); handleThrottleStart(); }}
        onPointerUp={handleThrottleEnd}
        onPointerLeave={handleThrottleEnd}
        onPointerCancel={handleThrottleEnd}
        style={btnStyle}
        className="rounded-3xl bg-emerald-950/90 border-2 border-emerald-400/80 active:bg-emerald-400/40 active:border-emerald-200 active:scale-90 active:brightness-125 text-emerald-200 active:text-white font-black shadow-2xl shadow-black/80 flex flex-col items-center justify-center select-none touch-none transition-all duration-75"
        aria-label="Gaz"
      >
        <span className="text-2xl sm:text-3xl leading-none">▲</span>
        <span className={`${currentSize.labelClass} tracking-wider mt-1 font-black`}>{t("hud.touch_throttle")}</span>
      </button>
    </div>
  );

  return (
    <div className="fixed bottom-4 md:bottom-7 left-0 right-0 px-4 sm:px-6 pointer-events-none z-30 flex items-end justify-between max-w-lg mx-auto select-none">
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
