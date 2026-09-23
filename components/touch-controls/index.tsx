"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { GameEngine } from "@/engine/game-engine";
import { t } from "@/utils/localization";
import { JoystickPosition, ButtonSize } from "@/utils/settings";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, BoltIcon } from "@/components/ui/icons";

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
    labelClass: string;
  }> = {
    small: { btnPx: 58, nosPx: 48, labelClass: "text-[10px]" },
    medium: { btnPx: 68, nosPx: 56, labelClass: "text-[11px]" },
    large: { btnPx: 80, nosPx: 64, labelClass: "text-[12px]" },
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
          ? "bg-[#071116]/90 shadow-[0_0_28px_rgba(56,189,248,.22)] border border-sky-300/60 backdrop-blur-xl"
          : "bg-[#071116]/80 border border-white/10 opacity-75 backdrop-blur-xl"
      }`}
      aria-label="NOS Göstergesi ve Butonu"
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx={currentSize.nosPx / 2}
          cy={currentSize.nosPx / 2}
          r={radius}
          stroke="rgba(255,255,255,0.10)"
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
      <span className="flex items-center gap-0.5 text-[10px] font-black leading-none text-sky-300">
        {!isBoosting && <BoltIcon className="h-2.5 w-2.5" />}
        {isBoosting ? "BOOST" : "NOS"}
      </span>
      <span className="text-[11px] font-black leading-none text-white mt-0.5">
        {nosPercent}%
      </span>
    </button>
  );

  const SteerGroup = (
    <div className="flex flex-col items-center gap-2.5 pointer-events-auto shrink-0">
      {NosButton}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onPointerDown={(e) => { e.preventDefault(); startSteer("left"); }}
          onPointerUp={stopSteer}
          onPointerLeave={stopSteer}
          onPointerCancel={stopSteer}
          style={btnStyle}
          className="rounded-[26px] bg-[#071116]/88 border border-teal-300/45 active:border-teal-200 active:bg-teal-300/25 active:scale-90 text-teal-200 active:text-white font-black shadow-[0_14px_30px_rgba(0,0,0,.48),inset_0_1px_rgba(255,255,255,.08)] backdrop-blur-xl flex items-center justify-center select-none touch-none transition-all duration-75"
          aria-label="Sol"
        >
          <ArrowLeftIcon className="h-[42%] w-[42%]" />
        </button>
        <button
          onPointerDown={(e) => { e.preventDefault(); startSteer("right"); }}
          onPointerUp={stopSteer}
          onPointerLeave={stopSteer}
          onPointerCancel={stopSteer}
          style={btnStyle}
          className="rounded-[26px] bg-[#071116]/88 border border-teal-300/45 active:border-teal-200 active:bg-teal-300/25 active:scale-90 text-teal-200 active:text-white font-black shadow-[0_14px_30px_rgba(0,0,0,.48),inset_0_1px_rgba(255,255,255,.08)] backdrop-blur-xl flex items-center justify-center select-none touch-none transition-all duration-75"
          aria-label="Sağ"
        >
          <ArrowRightIcon className="h-[42%] w-[42%]" />
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
        className="rounded-[26px] bg-[#1a0b0d]/88 border border-rose-400/55 active:bg-rose-400/35 active:border-rose-200 active:scale-90 text-rose-200 active:text-white font-black shadow-[0_14px_30px_rgba(0,0,0,.48),inset_0_1px_rgba(255,255,255,.07)] backdrop-blur-xl flex flex-col items-center justify-center select-none touch-none transition-all duration-75"
        aria-label="Fren"
      >
        <ArrowDownIcon className="h-[28%] w-[28%]" />
        <span className={`${currentSize.labelClass} tracking-wider mt-1 font-black`}>{t("hud.touch_brake")}</span>
      </button>

      {/* GAZ Pedalı */}
      <button
        onPointerDown={(e) => { e.preventDefault(); handleThrottleStart(); }}
        onPointerUp={handleThrottleEnd}
        onPointerLeave={handleThrottleEnd}
        onPointerCancel={handleThrottleEnd}
        style={btnStyle}
        className="rounded-[26px] bg-[#07150f]/90 border border-emerald-300/65 active:bg-emerald-300/35 active:border-emerald-100 active:scale-90 text-emerald-100 active:text-white font-black shadow-[0_14px_30px_rgba(0,0,0,.48),0_0_24px_rgba(52,211,153,.10),inset_0_1px_rgba(255,255,255,.08)] backdrop-blur-xl flex flex-col items-center justify-center select-none touch-none transition-all duration-75"
        aria-label="Gaz"
      >
        <ArrowUpIcon className="h-[30%] w-[30%]" />
        <span className={`${currentSize.labelClass} tracking-wider mt-1 font-black`}>{t("hud.touch_throttle")}</span>
      </button>
    </div>
  );

  return (
    <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-0 right-0 px-3 sm:px-6 pointer-events-none z-30 flex items-end justify-between max-w-[42rem] mx-auto select-none">
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
