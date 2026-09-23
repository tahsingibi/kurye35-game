"use client";

import React from "react";
import { t } from "@/utils/localization";
import { ACHIEVEMENTS_DATA } from "@/engine/constants";
import { SOCIAL_LINKS } from "@/utils/config";
import { RestartIcon } from "@/components/ui/icons";

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
    <div className="ui-modal-backdrop absolute inset-0 z-40 flex flex-col justify-between px-5 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] pointer-events-auto select-none">
      <div className="ui-rise space-y-3">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[.16em] ${
            isBusted
              ? "bg-blue-950/80 border-blue-500/40 text-blue-300"
              : "bg-red-950/80 border-red-500/40 text-red-300"
          }`}
        >
          {isBusted ? t("game_over.busted_badge") : t("game_over.crash_badge")}
        </div>
        <h2 className="text-[2.65rem] font-black leading-none tracking-[-.05em] text-white">
          {isBusted ? t("game_over.busted_title") : t("game_over.crash_title")}
        </h2>
        <p className="text-sm font-medium text-slate-400">
          {isBusted ? t("game_over.busted_desc") : t("game_over.crash_desc")}
        </p>
      </div>

      <div className="ui-rise space-y-3">
        <div className="ui-panel grid grid-cols-3 overflow-hidden rounded-3xl">
          <div className="p-4">
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {t("game_over.score")}
            </div>
            <div className="mt-1 text-2xl font-black text-white">
              {Math.floor(score).toLocaleString("tr-TR")}
            </div>
          </div>
          <div className="border-l border-white/10 p-4">
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {t("game_over.deliveries")}
            </div>
            <div className="text-2xl font-black text-amber-400">
              {deliveries}
            </div>
          </div>
          <div className="border-l border-white/10 p-4">
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {t("game_over.violations")}
            </div>
            <div className={`text-2xl font-black ${violations ? "text-red-400" : "text-emerald-400"}`}>
              {violations}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4 space-y-1">
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

      <div className="space-y-2.5">
        <button
          onClick={onRestart}
          className="ui-primary group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-xs font-black tracking-wider transition-all"
        >
          <span>{t("game_over.restart")}</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#07100f] text-white transition-transform duration-300 group-hover:rotate-180">
            <RestartIcon className="h-4 w-4" />
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
