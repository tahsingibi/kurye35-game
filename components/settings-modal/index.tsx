"use client";

import React from "react";
import { t } from "@/utils/localization";
import { JoystickPosition, ButtonSize, SoundSettings } from "@/utils/settings";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/ui/icons";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  joystickPosition: JoystickPosition;
  onChangeJoystickPosition: (pos: JoystickPosition) => void;
  buttonSize: ButtonSize;
  onChangeButtonSize: (size: ButtonSize) => void;
  soundSettings: SoundSettings;
  onChangeSoundSettings: (settings: SoundSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  joystickPosition,
  onChangeJoystickPosition,
  buttonSize,
  onChangeButtonSize,
  soundSettings,
  onChangeSoundSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="ui-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="ui-panel ui-rise relative w-full max-w-md max-h-[94dvh] overflow-y-auto p-4 sm:p-6 rounded-[28px] space-y-4 text-left">
        {/* Üst Başlık & Kapat Butonu */}
        <div className="flex items-center justify-between">
          <div><div className="ui-kicker">SYSTEM</div><h2 className="mt-2 text-2xl font-black tracking-tight text-white">{t("settings.title")}</h2></div>
          <button
            onClick={onClose}
            className="ui-icon-button active:scale-95"
            aria-label="Kapat"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* 1. Kontrol Buton Boyutu */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>{t("settings.button_size")}</span>
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
                  ? "bg-teal-300 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-white/[.05] text-slate-400 hover:text-white"
              }`}
            >
              {t("settings.size_small")}
            </button>
            <button
              onClick={() => onChangeButtonSize("medium")}
              className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all ${
                buttonSize === "medium"
                  ? "bg-teal-300 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-white/[.05] text-slate-400 hover:text-white"
              }`}
            >
              {t("settings.size_medium")}
            </button>
            <button
              onClick={() => onChangeButtonSize("large")}
              className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all ${
                buttonSize === "large"
                  ? "bg-teal-300 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-white/[.05] text-slate-400 hover:text-white"
              }`}
            >
              {t("settings.size_large")}
            </button>
          </div>
        </div>

        {/* 2. Kontrol Düzeni (Sol/Sağ Yön) */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>{t("settings.controls_layout")}</span>
            <span className="text-[11px] text-teal-400 font-black uppercase">
              {joystickPosition === "left" ? t("settings.steer_left") : t("settings.steer_right")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChangeJoystickPosition("left")}
              className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
                joystickPosition === "left"
                  ? "bg-teal-300 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-white/[.05] text-slate-400 hover:text-white"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-1.5"><ArrowLeftIcon className="h-3.5 w-3.5" />{t("settings.steer_left")}</span>
            </button>
            <button
              onClick={() => onChangeJoystickPosition("right")}
              className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
                joystickPosition === "right"
                  ? "bg-teal-300 text-slate-950 shadow-md shadow-teal-500/20"
                  : "bg-white/[.05] text-slate-400 hover:text-white"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-1.5">{t("settings.steer_right")}<ArrowRightIcon className="h-3.5 w-3.5" /></span>
            </button>
          </div>
        </div>

        {/* 3. Ayrıntılı ses mikseri */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <div>
              <div className="text-xs font-black text-slate-200">{t("settings.audio_mixer")}</div>
              <div className="mt-1 text-[10px] text-slate-500">{t("settings.audio_mixer_desc")}</div>
            </div>
            <SoundToggle
              label={t("settings.master_sound")}
              enabled={soundSettings.master}
              onToggle={() => onChangeSoundSettings({ ...soundSettings, master: !soundSettings.master })}
              prominent
            />
          </div>
          <div className="h-px bg-slate-800" />
          <SoundToggle
            label={t("settings.vehicle_sounds")}
            enabled={soundSettings.vehicle}
            disabled={!soundSettings.master}
            onToggle={() => onChangeSoundSettings({ ...soundSettings, vehicle: !soundSettings.vehicle })}
          />
          <SoundToggle
            label={t("settings.ambient_sounds")}
            enabled={soundSettings.ambience}
            disabled={!soundSettings.master}
            onToggle={() => onChangeSoundSettings({ ...soundSettings, ambience: !soundSettings.ambience })}
          />
          <SoundToggle
            label={t("settings.effect_sounds")}
            enabled={soundSettings.effects}
            disabled={!soundSettings.master}
            onToggle={() => onChangeSoundSettings({ ...soundSettings, effects: !soundSettings.effects })}
          />
        </div>

        {/* Tamamla / Kapat Butonu */}
        <button
          onClick={onClose}
          className="ui-primary w-full py-3.5 rounded-2xl font-black text-sm tracking-wider active:scale-95 transition-all text-center"
        >
          {t("settings.close")}
        </button>
      </div>
    </div>
  );
};

const SoundToggle: React.FC<{
  label: string;
  enabled: boolean;
  disabled?: boolean;
  prominent?: boolean;
  onToggle: () => void;
}> = ({ label, enabled, disabled = false, prominent = false, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    className={`group flex items-center justify-between gap-3 rounded-xl transition-all ${
      prominent ? "min-w-[112px] px-2.5 py-2 bg-slate-800/80" : "w-full px-2 py-2"
    } ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-800/70"}`}
    aria-pressed={enabled}
  >
    <span className={`text-[11px] font-bold text-left transition-colors ${enabled && !disabled ? "text-slate-100" : "text-slate-400"}`}>
      {label}
    </span>
    <span
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 shadow-inner transition-colors duration-200 ${
        enabled
          ? "border-teal-300/80 bg-teal-500"
          : "border-slate-600 bg-slate-800"
      }`}
      aria-hidden="true"
    >
      <span
        className={`block h-[18px] w-[18px] rounded-full bg-white shadow-md ring-1 ring-black/10 transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </span>
  </button>
);
