"use client";

import React from "react";
import { t } from "@/utils/localization";
import { ArrowRightIcon } from "@/components/ui/icons";
import { STORY_PAGES } from "@/engine/constants";

interface GameStoryProps {
  currentPage: number;
  onAdvance: () => void;
}

export const GameStory: React.FC<GameStoryProps> = ({ currentPage, onAdvance }) => {
  const current = STORY_PAGES[currentPage] || STORY_PAGES[0];
  const isLastPage = currentPage >= STORY_PAGES.length - 1;

  return (
    <div className="ui-modal-backdrop absolute inset-0 z-40 flex flex-col justify-between px-5 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] pointer-events-auto select-none">
      <div className="flex items-center justify-between">
        <div className="ui-kicker">{t("story.badge")}</div>
        <div className="flex gap-1.5">{STORY_PAGES.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === currentPage ? "w-7 bg-teal-300" : "w-1.5 bg-white/20"}`} />)}</div>
      </div>

      <div className="ui-rise my-auto">
        <div className="mb-3 text-[10px] font-black tracking-[.18em] text-[#ffc766]">{t(current.tagKey)}</div>
        <h2 className="max-w-[340px] text-[2.2rem] font-black leading-[1.02] tracking-[-.045em] text-white">{t(current.titleKey)}</h2>

        <div className="ui-panel relative mt-6 overflow-hidden rounded-3xl p-5">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-teal-300 to-transparent" />
          <div className="ui-kicker mb-4">{t("story.center_title")}</div>
          {current.lineKeys.map((k) => (
            <p key={k} className="mb-2 text-sm leading-relaxed text-slate-300">
              {t(k)}
            </p>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={onAdvance}
          className="ui-primary group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-sm font-black tracking-wider transition-all"
        >
          <span>{isLastPage ? t("story.btn_start") : t("story.btn_next")}</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#07100f] text-white transition-transform group-hover:translate-x-1">
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </button>
        <p className="text-center text-[9px] font-bold tracking-widest text-slate-600">{t("story.hint")}</p>
      </div>
    </div>
  );
};
