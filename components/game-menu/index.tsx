"use client";

import React from "react";
import Image from "next/image";
import { t } from "@/utils/localization";
import { ACHIEVEMENTS_DATA } from "@/engine/constants";
import { SOCIAL_LINKS } from "@/utils/config";
import { ArrowRightIcon, CarIcon, ChevronDownIcon, MotorcycleIcon, SettingsIcon } from "@/components/ui/icons";
import type { JoystickPosition, VehicleType } from "@/utils/settings";

interface GameMenuProps {
  onStart: () => void;
  highScore: number;
  bestDeliveries: number;
  unlockedCount: number;
  selectedVehicle: VehicleType;
  onOpenVehicleSelect?: () => void;
  joystickPosition?: JoystickPosition;
  onChangeJoystickPosition?: (pos: JoystickPosition) => void;
  onOpenSettings?: () => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  onStart,
  highScore,
  bestDeliveries,
  unlockedCount,
  selectedVehicle,
  onOpenVehicleSelect,
  onOpenSettings,
}) => {
  const totalBadges = Object.keys(ACHIEVEMENTS_DATA).length;

  return (
    <div className="ui-screen absolute inset-0 z-40 flex flex-col justify-between px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] pointer-events-auto select-none">
      <Image src="/art/izmir-shift-key-art.png" alt="" fill priority className="pointer-events-none object-cover object-center opacity-90" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,10,.10)_0%,rgba(2,7,10,.12)_34%,rgba(2,7,10,.68)_63%,rgba(2,7,10,.98)_100%)]" />
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#071015]/80 px-2.5 py-2 backdrop-blur-xl">
          <div className="relative w-7 h-7 rounded-xl overflow-hidden border border-teal-300/40 shadow-[0_0_18px_rgba(93,230,207,.15)]">
            <Image
              src="/icon-192.png"
              alt="Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div><div className="text-[9px] font-black tracking-[.18em] text-teal-300">{t("menu.badge")}</div><div className="text-[8px] font-bold tracking-wider text-slate-500">DISPATCH ONLINE</div></div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenVehicleSelect}
            className="ui-secondary inline-flex h-9 items-center gap-2 rounded-xl px-3 text-[10px] font-black tracking-wider transition active:scale-95"
            aria-label={t("vehicles.select_vehicle")}
          >
            {selectedVehicle === "car"
              ? <CarIcon className="h-4 w-4" />
              : <MotorcycleIcon className="h-4 w-4" />}
            <span className="hidden xs:inline">
              {selectedVehicle === "car" ? t("vehicles.car.name") : t("vehicles.motor.name")}
            </span>
            <ChevronDownIcon className="h-3 w-3 text-teal-300" />
          </button>

          <button
            onClick={onOpenSettings}
            className="ui-icon-button active:scale-95"
            aria-label={t("settings.open_settings")}
          >
            <SettingsIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <div className="ui-rise relative z-10 mt-auto flex flex-col gap-4">
        <div>
          <div className="ui-kicker mb-3">{t("menu.tagline")}</div>
          <div className="flex items-end gap-3 leading-none">
            <h1 className="text-[3.8rem] font-black tracking-[-.075em] text-white drop-shadow-xl">{t("menu.title_main")}</h1>
            <span className="mb-1 text-[3.8rem] font-black tracking-[-.08em] text-[#ffc766] drop-shadow-xl">{t("menu.title_sub")}</span>
          </div>
        </div>

        <div className="max-w-[330px] border-l-2 border-teal-300/70 pl-3">
          <p className="text-sm font-bold text-slate-100">{t("menu.desc_1")}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{t("menu.desc_2")}</p>
        </div>

        <div>
          <button
            onClick={onStart}
            className="ui-primary group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-sm font-black tracking-[.08em] transition-all"
          >
            <span>{t("menu.start_shift")}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#07100f] text-white transition-transform group-hover:translate-x-1">
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </button>

        </div>

        <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-[#071015]/80 backdrop-blur-xl" suppressHydrationWarning>
          {[
            [t("menu.high_score"), highScore.toLocaleString("tr-TR")],
            [t("menu.best_deliveries"), bestDeliveries],
            [t("menu.badge_count"), `${unlockedCount}/${totalBadges}`],
          ].map(([label, value], index) => (
            <div key={String(label)} className={`px-3 py-3 ${index ? "border-l border-white/10" : ""}`}>
              <div className="text-[8px] font-black tracking-[.14em] text-slate-500">{label}</div>
              <div className={`mt-1 text-base font-black ${index === 2 ? "text-[#ffc766]" : "text-white"}`}>{value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 text-[8px] font-bold tracking-wide text-slate-500">
          <div className="min-w-0 truncate">{t("menu.controls_steer")} · {t("menu.controls_nos")}</div>
          <div className="flex shrink-0 items-center gap-2">
            <a href={SOCIAL_LINKS.authorX} target="_blank" rel="noopener noreferrer" className="hover:text-teal-300">{t("menu.author_twitter")}</a>
            <span>·</span>
            <a href={SOCIAL_LINKS.authorWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-teal-300">{t("menu.author_site")}</a>
          </div>
        </div>
      </div>
    </div>
  );
};
