"use client";

import React from "react";
import { t } from "@/utils/localization";
import { STORY_PAGES } from "@/engine/constants";

interface GameStoryProps {
  currentPage: number;
  onAdvance: () => void;
}

export const GameStory: React.FC<GameStoryProps> = ({ currentPage, onAdvance }) => {
  const current = STORY_PAGES[currentPage] || STORY_PAGES[0];
  const isLastPage = currentPage >= STORY_PAGES.length - 1;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-6 pointer-events-auto select-none bg-slate-950/80 backdrop-blur-md transition-all duration-300">
      {/* Üst Rozet */}
      <div className="pt-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-[11px] font-black uppercase tracking-wider">
          {t("story.badge")}
        </div>
      </div>

      {/* Hikaye İçerik Kartı */}
      <div className="my-auto space-y-4">
        <span className="text-xs font-bold tracking-widest text-slate-400">
          {t(current.tagKey)}
        </span>
        <h2 className="text-3xl font-black text-slate-100 tracking-tight">
          {t(current.titleKey)}
        </h2>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-3">
          <div className="text-xs font-black tracking-widest text-teal-400 uppercase">
            {t("story.center_title")}
          </div>
          {current.lineKeys.map((k) => (
            <p key={k} className="text-sm text-slate-300 leading-relaxed font-normal">
              {t(k)}
            </p>
          ))}
          <div className="pt-2 text-right text-[11px] text-slate-500 font-bold">
            {currentPage + 1} / {STORY_PAGES.length}
          </div>
        </div>
      </div>

      {/* İlerleme Butonu */}
      <div className="pb-4 space-y-2">
        <button
          onClick={onAdvance}
          className="group flex items-center justify-between w-full max-w-[260px] px-6 py-4 rounded-full bg-[#f3f3ee] text-slate-900 font-black text-sm tracking-wider shadow-lg hover:bg-white active:scale-95 transition-all"
        >
          <span>{isLastPage ? t("story.btn_start") : t("story.btn_next")}</span>
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-950 text-white group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
        <p className="text-[11px] text-slate-500 font-medium">
          {t("story.hint")}
        </p>
      </div>
    </div>
  );
};
