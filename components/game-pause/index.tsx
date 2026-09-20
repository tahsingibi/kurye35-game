"use client";

import React from "react";
import { t } from "@/utils/localization";
import { JoystickPosition } from "@/utils/settings";

interface GamePauseProps {
  onResume: () => void;
  clockText: string;
  phaseText: string;
  speed: number;
  joystickPosition?: JoystickPosition;
  onChangeJoystickPosition?: (pos: JoystickPosition) => void;
}

export const GamePause: React.FC<GamePauseProps> = ({
  onResume,
  clockText,
  phaseText,
  speed,
  joystickPosition = "left",
  onChangeJoystickPosition,
}) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-6 pointer-events-auto select-none bg-slate-950/75 backdrop-blur-md">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-2xl space-y-5 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-[11px] font-black uppercase tracking-wider">
          {t("pause.badge")}
        </div>

        <div>
          <h2 className="text-3xl font-black text-slate-100 tracking-tight">
            {t("pause.title")}
          </h2>
          <p className="mt-1 text-xs font-bold text-slate-400">
            {clockText} · {phaseText} · {speed} km/h
          </p>
        </div>

        {/* Mobil Kontrol Düzeni Ayarı */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>⚙️ {t("settings.controls_layout")}</span>
            <span className="text-[11px] text-teal-400 uppercase font-black">
              {joystickPosition === "left" ? t("settings.steer_left") : t("settings.steer_right")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChangeJoystickPosition?.("left")}
              className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
                joystickPosition === "left"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              ← {t("settings.steer_left")}
            </button>
            <button
              onClick={() => onChangeJoystickPosition?.("right")}
              className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
                joystickPosition === "right"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {t("settings.steer_right")} →
            </button>
          </div>
        </div>

        <button
          onClick={onResume}
          className="group flex items-center justify-between w-full px-6 py-4 rounded-full bg-[#f2f3ef] text-slate-900 font-black text-sm tracking-wider shadow-lg hover:bg-white active:scale-95 transition-all"
        >
          <span>{t("pause.resume")}</span>
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-950 text-white group-hover:scale-105 transition-transform">
            ▶
          </span>
        </button>

        <div className="space-y-1 pt-1 text-[11px] font-medium text-slate-500">
          <div>{t("pause.shortcut")}</div>
          <div>{t("pause.controls")}</div>
        </div>
      </div>
    </div>
  );
};
