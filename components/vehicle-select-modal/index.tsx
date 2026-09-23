"use client";

import React from "react";
import Image from "next/image";
import { t } from "@/utils/localization";
import { playVehicleRev } from "@/engine/audio";
import type { VehicleType } from "@/utils/settings";
import { ArrowRightIcon, CheckIcon, CloseIcon, SpeakerIcon } from "@/components/ui/icons";

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
  image: string;
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
    image: "/art/courier-motor.png",
    nameKey: "vehicles.motor.name",
    tagKey: "vehicles.motor.tag",
    descKey: "vehicles.motor.desc",
    stats: { agility: 95, speed: 90, durability: 45 },
  },
  {
    type: "car",
    image: "/art/courier-car.png",
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
    <div className="ui-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 select-none">
      <div className="ui-panel ui-rise relative w-full max-w-md max-h-[96dvh] overflow-y-auto p-5 rounded-[28px] space-y-4 text-left">
        {/* Üst Başlık & Kapat */}
        <div className="flex items-center justify-between">
          <div><div className="ui-kicker">GARAGE 35</div><h2 className="mt-2 text-2xl font-black tracking-tight text-white">{t("vehicles.select_title")}</h2></div>
          <button
            onClick={handleClose}
            className="ui-icon-button active:scale-95"
            aria-label="Kapat"
          >
            <CloseIcon className="h-4 w-4" />
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
                className={`relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? "bg-teal-300/[.07] border-teal-300/70 shadow-lg shadow-teal-500/10"
                    : "bg-black/20 border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="relative mb-3 h-24 overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_50%_70%,rgba(93,230,207,.16),transparent_62%)]">
                    <Image src={v.image} alt={t(v.nameKey)} fill className="object-contain p-1 drop-shadow-[0_12px_18px_rgba(0,0,0,.55)]" />
                    <span
                      className={`absolute right-2 top-2 text-[8px] font-black uppercase px-2 py-1 rounded-full ${
                        isSelected ? "bg-teal-300/15 text-teal-200 border border-teal-300/30" : "bg-white/[.05] text-slate-400"
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
                    <SpeakerIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleSelect(v.type)}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black tracking-wider transition active:scale-95 text-center ${
                      isSelected
                        ? "bg-teal-300 text-slate-950 shadow-md shadow-teal-500/20"
                        : "bg-white/[.07] hover:bg-white/[.12] text-slate-200"
                    }`}
                  >
                    {isSelected ? <span className="inline-flex items-center justify-center gap-1.5"><CheckIcon className="h-3.5 w-3.5" />{t("vehicles.selected")}</span> : t("vehicles.select")}
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
            className="ui-primary w-full py-3.5 px-4 rounded-2xl text-slate-950 font-black text-xs tracking-wider active:scale-95 transition-all text-center flex items-center justify-center gap-2"
          >
            <span>{t("vehicles.start_shift")}</span>
            <ArrowRightIcon className="h-4 w-4" />
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
