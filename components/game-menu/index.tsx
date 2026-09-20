"use client";

import React from "react";
import Image from "next/image";
import { t } from "@/utils/localization";
import { ACHIEVEMENTS_DATA } from "@/engine/constants";
import { SOCIAL_LINKS } from "@/utils/config";
import { JoystickPosition } from "@/utils/settings";

interface GameMenuProps {
  onStart: () => void;
  highScore: number;
  bestDeliveries: number;
  unlockedCount: number;
  joystickPosition?: JoystickPosition;
  onChangeJoystickPosition?: (pos: JoystickPosition) => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  onStart,
  highScore,
  bestDeliveries,
  unlockedCount,
  joystickPosition = "left",
  onChangeJoystickPosition,
}) => {
  const totalBadges = Object.keys(ACHIEVEMENTS_DATA).length;

  const toggleJoystick = () => {
    onChangeJoystickPosition?.(joystickPosition === "left" ? "right" : "left");
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-6 pointer-events-auto select-none bg-gradient-to-b from-transparent via-black/25 to-black/85 transition-opacity duration-300">
      {/* Üst Kısım: Logo, Rozet ve Hızlı Kontrol Düzeni Ayarı */}
      <div className="pt-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/70 border border-teal-500/30 backdrop-blur-md shadow-lg shadow-teal-500/10">
          <div className="relative w-5 h-5 rounded-full overflow-hidden border border-teal-400/50">
            <Image
              src="/icon-192.png"
              alt="Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-[11px] font-black tracking-widest text-teal-300 uppercase">
            {t("menu.badge")}
          </span>
        </div>

        {/* Hızlı Kontrol Düzeni Ayarı */}
        <button
          onClick={toggleJoystick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] font-black tracking-wider transition active:scale-95 shadow-md"
        >
          <span>🕹️</span>
          <span>
            {joystickPosition === "left" ? t("settings.steer_left") : t("settings.steer_right")}
          </span>
        </button>
      </div>

      {/* Ana Başlık ve Başlat Alanı */}
      <div className="flex flex-col gap-4 mt-auto mb-4">
        <div>
          <div className="leading-none">
            <h1 className="text-6xl font-black tracking-tighter text-slate-100 drop-shadow-md">
              {t("menu.title_main")}
            </h1>
            <span className="text-6xl font-black tracking-tighter text-orange-500 drop-shadow-md">
              {t("menu.title_sub")}
            </span>
          </div>
          <p className="mt-2 text-xs font-black tracking-widest text-teal-400 uppercase">
            {t("menu.tagline")}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-200">
            {t("menu.desc_1")}
          </p>
          <p className="text-xs text-slate-400">
            {t("menu.desc_2")}
          </p>
        </div>

        <button
          onClick={onStart}
          className="group relative flex items-center justify-between w-full max-w-[280px] px-6 py-4 rounded-full bg-[#f4f4ef] text-slate-900 font-black text-sm tracking-wider shadow-xl hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-150"
        >
          <span>{t("menu.start_shift")}</span>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-950 text-white group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>

        {/* Kontrol Kılavuzu & İstatistikler */}
        <div className="pt-2 space-y-1.5 text-[11px] font-semibold text-slate-400">
          <div className="flex flex-wrap gap-x-3 text-slate-400">
            <span>{t("menu.controls_throttle")}</span>
            <span>·</span>
            <span>{t("menu.controls_steer")}</span>
          </div>
          <div className="text-slate-500">
            {t("menu.controls_nos")}
          </div>
          <div className="flex items-center gap-3 pt-1 text-xs" suppressHydrationWarning>
            <span className="text-amber-400 font-bold" suppressHydrationWarning>
              {t("menu.badge_count")} {unlockedCount}/{totalBadges}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300" suppressHydrationWarning>
              {t("menu.high_score")} {highScore.toLocaleString("tr-TR")}
            </span>
            <span>·</span>
            <span className="text-slate-300" suppressHydrationWarning>
              {t("menu.best_deliveries")} {bestDeliveries}
            </span>
          </div>
        </div>

        {/* Tıklanabilir Geliştirici Bağlantıları */}
        <div className="text-[11px] text-slate-400 tracking-wider flex items-center gap-2 pt-1">
          <a
            href={SOCIAL_LINKS.authorX}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 underline underline-offset-2 transition"
          >
            {t("menu.author_twitter")}
          </a>
          <span>·</span>
          <a
            href={SOCIAL_LINKS.authorWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 underline underline-offset-2 transition"
          >
            {t("menu.author_site")}
          </a>
        </div>
      </div>
    </div>
  );
};
