"use client";

import React from "react";
import { t } from "@/utils/localization";
import { JoystickPosition } from "@/utils/settings";
import { CloseIcon, PlayIcon } from "@/components/ui/icons";

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
    <div className="ui-modal-backdrop absolute inset-0 z-40 flex items-center justify-center p-5 pointer-events-auto select-none">
      <div className="ui-panel ui-rise w-full rounded-[28px] p-5 text-left">
        <div className="flex items-center justify-between">
          <div className="ui-kicker">{t("pause.badge")}</div>
          <button
            onClick={onResume}
            className="ui-icon-button active:scale-95"
            aria-label="Kapat ve oyuna dön"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="my-6">
          <h2 className="text-4xl font-black tracking-[-.04em] text-white">
            {t("pause.title")}
          </h2>
          <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            {[["SAAT", clockText], ["EVRE", phaseText], ["HIZ", `${speed}`]].map(([label, value], i) => <div key={label} className={`px-3 py-3 ${i ? "border-l border-white/10" : ""}`}><div className="text-[8px] font-black tracking-widest text-slate-500">{label}</div><div className="mt-1 text-sm font-black text-white">{value}</div></div>)}
          </div>
        </div>

        <button
          onClick={onResume}
          className="ui-primary group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-sm font-black tracking-wider transition-all"
        >
          <span>{t("pause.resume")}</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#07100f] text-white transition-transform group-hover:scale-105">
            <PlayIcon className="h-4 w-4" />
          </span>
        </button>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="ui-secondary mt-2.5 w-full rounded-2xl px-5 py-3 text-xs font-black tracking-wider transition active:scale-[.98]"
          >
            {t("settings.open_settings")}
          </button>
        )}

        <div className="mt-4 flex items-center justify-between text-[9px] font-bold text-slate-600">
          <div>{t("pause.shortcut")}</div>
          <div>{t("pause.controls")}</div>
        </div>
      </div>
    </div>
  );
};
