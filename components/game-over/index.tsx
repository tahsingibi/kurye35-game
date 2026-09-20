"use client";

import React from "react";
import { t } from "@/utils/localization";
import { ACHIEVEMENTS_DATA } from "@/engine/constants";
import { SOCIAL_LINKS } from "@/utils/config";

interface GameOverProps {
  reason: "crash" | "busted";
  score: number;
  deliveries: number;
  violations: number;
  lastViolation: string;
  highScore: number;
  bestDeliveries: number;
  unlockedCount: number;
  onRestart: () => void;
  onShare?: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  reason,
  score,
  deliveries,
  violations,
  lastViolation,
  highScore,
  bestDeliveries,
  unlockedCount,
  onRestart,
}) => {
  const isBusted = reason === "busted";
  const totalBadges = Object.keys(ACHIEVEMENTS_DATA).length;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-6 pointer-events-auto select-none bg-slate-950/85 backdrop-blur-md">
      {/* Üst Başlık */}
      <div className="pt-3 space-y-2">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
            isBusted
              ? "bg-blue-950/80 border-blue-500/40 text-blue-300"
              : "bg-red-950/80 border-red-500/40 text-red-300"
          }`}
        >
          {isBusted ? t("game_over.busted_badge") : t("game_over.crash_badge")}
        </div>
        <h2 className="text-4xl font-black text-slate-100 tracking-tight">
          {isBusted ? t("game_over.busted_title") : t("game_over.crash_title")}
        </h2>
        <p className="text-xs font-medium text-slate-400">
          {isBusted ? t("game_over.busted_desc") : t("game_over.crash_desc")}
        </p>
      </div>

      {/* İstatistikler Paneli */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 border-y border-slate-700/50 py-4">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {t("game_over.score")}
            </div>
            <div className="text-2xl font-black text-slate-100">
              {Math.floor(score).toLocaleString("tr-TR")}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {t("game_over.deliveries")}
            </div>
            <div className="text-2xl font-black text-amber-400">
              {deliveries}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {t("game_over.violations")}
            </div>
            <div className={`text-2xl font-black ${violations ? "text-red-400" : "text-emerald-400"}`}>
              {violations}
            </div>
          </div>
        </div>

        {/* Son Kayıt Kartı */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-lg space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {t("game_over.last_record")}
          </div>
          <div className="text-sm font-bold text-slate-200">
            {violations ? lastViolation : t("hud.clean_drive")}
          </div>
          <div className="text-[11px] text-slate-400" suppressHydrationWarning>
            {t("menu.high_score")} {highScore.toLocaleString("tr-TR")} · {t("menu.best_deliveries")} {bestDeliveries} · {unlockedCount}/{totalBadges} {t("menu.badge_count")}
          </div>
        </div>
      </div>

      {/* Butonlar ve Bağlantılar (Skoru Paylaş butonu tasarım hazır olana kadar gizlendi) */}
      <div className="pb-4 space-y-3">
        <button
          onClick={onRestart}
          className="group w-full flex items-center justify-between px-6 py-4 rounded-full bg-[#f3f3ee] text-slate-900 font-black text-xs tracking-wider shadow-xl hover:bg-white active:scale-95 transition-all"
        >
          <span>{t("game_over.restart")}</span>
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-950 text-white group-hover:rotate-180 transition-transform duration-300">
            ↻
          </span>
        </button>

        <div className="text-[11px] text-slate-400 tracking-wider flex items-center justify-center gap-2 pt-1">
          <a
            href={SOCIAL_LINKS.authorX}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 underline underline-offset-2 transition"
          >
            {t("game_over.author_twitter")}
          </a>
          <span>·</span>
          <a
            href={SOCIAL_LINKS.authorWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-400 underline underline-offset-2 transition"
          >
            {t("game_over.author_site")}
          </a>
        </div>
      </div>
    </div>
  );
};
