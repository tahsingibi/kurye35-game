"use client";

import React from "react";
import { t } from "@/utils/localization";
import { JoystickPosition, ButtonSize } from "@/utils/settings";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  joystickPosition: JoystickPosition;
  onChangeJoystickPosition: (pos: JoystickPosition) => void;
  buttonSize: ButtonSize;
  onChangeButtonSize: (size: ButtonSize) => void;
  soundEnabled: boolean;
  onChangeSoundEnabled: (enabled: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  joystickPosition,
  onChangeJoystickPosition,
  buttonSize,
  onChangeButtonSize,
  soundEnabled,
  onChangeSoundEnabled,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-sm p-6 rounded-3xl bg-slate-900/95 border border-slate-700/70 shadow-2xl space-y-5 text-left">
        {/* Üst Başlık & Kapat Butonu */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-[11px] font-black uppercase tracking-wider">
            ⚙️ {t("settings.title")}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-black transition active:scale-95"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        {/* 1. Kontrol Buton Boyutu */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>📐 {t("settings.button_size")}</span>
            <span className="text-[11px] text-teal-400 font-black uppercase">
              {buttonSize === "small"
                ? t("settings.size_small")
                : buttonSize === "large"
                ? t("settings.size_large")
                : t("settings.size_medium")}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onChangeButtonSize("small")}
              className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all ${
                buttonSize === "small"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              {t("settings.size_small")}
            </button>
            <button
              onClick={() => onChangeButtonSize("medium")}
              className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all ${
                buttonSize === "medium"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              {t("settings.size_medium")}
            </button>
            <button
              onClick={() => onChangeButtonSize("large")}
              className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all ${
                buttonSize === "large"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              {t("settings.size_large")}
            </button>
          </div>
        </div>

        {/* 2. Kontrol Düzeni (Sol/Sağ Yön) */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>🕹️ {t("settings.controls_layout")}</span>
            <span className="text-[11px] text-teal-400 font-black uppercase">
              {joystickPosition === "left" ? t("settings.steer_left") : t("settings.steer_right")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChangeJoystickPosition("left")}
              className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
                joystickPosition === "left"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              ← {t("settings.steer_left")}
            </button>
            <button
              onClick={() => onChangeJoystickPosition("right")}
              className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
                joystickPosition === "right"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              {t("settings.steer_right")} →
            </button>
          </div>
        </div>

        {/* 3. Ses Efektleri */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>🔊 {t("settings.sound_effects")}</span>
            <span className="text-[11px] text-teal-400 font-black uppercase">
              {soundEnabled ? t("settings.sound_on") : t("settings.sound_off")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChangeSoundEnabled(true)}
              className={`py-2 px-2 rounded-xl text-xs font-black transition-all ${
                soundEnabled
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              🔊 {t("settings.sound_on")}
            </button>
            <button
              onClick={() => onChangeSoundEnabled(false)}
              className={`py-2 px-2 rounded-xl text-xs font-black transition-all ${
                !soundEnabled
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              🔇 {t("settings.sound_off")}
            </button>
          </div>
        </div>

        {/* Tamamla / Kapat Butonu */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm tracking-wider shadow-lg active:scale-95 transition-all text-center"
        >
          {t("settings.close")}
        </button>
      </div>
    </div>
  );
};
