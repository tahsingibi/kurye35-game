"use client";

import React from "react";
import { t } from "@/utils/localization";
import { playVehicleRev } from "@/engine/audio";
import type { VehicleType } from "@/utils/settings";

interface VehicleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle: VehicleType;
  onSelectVehicle: (type: VehicleType) => void;
  isStartingFlow?: boolean;
  onStartGame?: () => void;
}

interface VehicleOption {
  type: VehicleType;
  icon: string;
  nameKey: string;
  tagKey: string;
  descKey: string;
  stats: {
    agility: number;
    speed: number;
    durability: number;
  };
}

const VEHICLES: VehicleOption[] = [
  {
    type: "motor",
    icon: "🛵",
    nameKey: "vehicles.motor.name",
    tagKey: "vehicles.motor.tag",
    descKey: "vehicles.motor.desc",
    stats: { agility: 95, speed: 90, durability: 45 },
  },
  {
    type: "car",
    icon: "🚗",
    nameKey: "vehicles.car.name",
    tagKey: "vehicles.car.tag",
    descKey: "vehicles.car.desc",
    stats: { agility: 65, speed: 75, durability: 95 },
  },
];

export const VehicleSelectModal: React.FC<VehicleSelectModalProps> = ({
  isOpen,
  onClose,
  selectedVehicle,
  onSelectVehicle,
  isStartingFlow = false,
  onStartGame,
}) => {
  if (!isOpen) return null;

  const handleSelect = (type: VehicleType) => {
    onSelectVehicle(type);
    playVehicleRev(type);
  };

  const handleStart = () => {
    onClose();
    onStartGame?.();
  };

  const handleClose = () => {
    onClose();
    if (isStartingFlow) {
      onStartGame?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md p-5 rounded-3xl bg-slate-900/95 border border-slate-700/70 shadow-2xl space-y-4 text-left">
        {/* Üst Başlık & Kapat */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-[11px] font-black uppercase tracking-wider">
            🚦 {t("vehicles.select_title")}
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-black transition active:scale-95"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          {t("vehicles.select_subtitle")}
        </p>

        {/* Araç Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VEHICLES.map((v) => {
            const isSelected = selectedVehicle === v.type;
            return (
              <div
                key={v.type}
                className={`relative flex flex-col justify-between p-3 rounded-2xl border transition-all ${
                  isSelected
                    ? "bg-slate-950/90 border-teal-400/80 shadow-lg shadow-teal-500/15"
                    : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{v.icon}</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                          : "bg-slate-800/80 text-slate-400"
                      }`}
                    >
                      {t(v.tagKey)}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-100">
                    {t(v.nameKey)}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    {t(v.descKey)}
                  </p>

                  <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-800/80">
                    <StatBar label={t("vehicles.stats.agility")} value={v.stats.agility} color="#38bdf8" />
                    <StatBar label={t("vehicles.stats.speed")} value={v.stats.speed} color="#f59e0b" />
                    <StatBar label={t("vehicles.stats.durability")} value={v.stats.durability} color="#10b981" />
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center gap-2">
                  <button
                    onClick={() => playVehicleRev(v.type)}
                    title={t("vehicles.preview_sound")}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold transition flex items-center justify-center"
                    aria-label={t("vehicles.preview_sound")}
                  >
                    🔊
                  </button>

                  <button
                    onClick={() => handleSelect(v.type)}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black tracking-wider transition active:scale-95 text-center ${
                      isSelected
                        ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                        : "bg-slate-800/90 hover:bg-slate-700 text-slate-200"
                    }`}
                  >
                    {isSelected ? `✓ ${t("vehicles.selected")}` : t("vehicles.select")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Oyun Başlama Aşamasında İse "Vardiyayı Başlat" Butonu */}
        {isStartingFlow ? (
          <button
            onClick={handleStart}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs tracking-wider shadow-xl active:scale-95 transition-all text-center flex items-center justify-center gap-2"
          >
            <span>{t("vehicles.start_shift")}</span>
            <span>→</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};

interface StatBarProps {
  label: string;
  value: number;
  color: string;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, color }) => (
  <div className="flex items-center justify-between gap-2 text-[10px]">
    <span className="text-slate-400 font-bold min-w-[64px]">{label}</span>
    <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
    <span className="text-slate-300 font-bold w-6 text-right">%{value}</span>
  </div>
);
