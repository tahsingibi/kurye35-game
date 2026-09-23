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
  onOpenSettings?: () => void;
}

export const GamePause: React.FC<GamePauseProps> = ({
  onResume,
  clockText,
  phaseText,
  speed,
  onOpenSettings,
}) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-6 pointer-events-auto select-none bg-slate-950/75 backdrop-blur-md">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-2xl space-y-4 text-left">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-[11px] font-black uppercase tracking-wider">
            {t("pause.badge")}
          </div>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black transition active:scale-95 border border-slate-600/50"
            >
              <span>⚙️</span>
              <span>{t("settings.open_settings")}</span>
            </button>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-black text-slate-100 tracking-tight">
            {t("pause.title")}
          </h2>
          <p className="mt-1 text-xs font-bold text-slate-400">
            {clockText} · {phaseText} · {speed} km/h
          </p>
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
