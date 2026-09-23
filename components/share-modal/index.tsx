"use client";

import React, { useState } from "react";
import { t } from "@/utils/localization";
import { getAppUrl } from "@/utils/config";
import { CloseIcon } from "@/components/ui/icons";

interface ShareModalProps {
  score: number;
  deliveries: number;
  reason: "crash" | "busted";
  violations?: number;
  highScore?: number;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  score,
  deliveries,
  reason,
  violations = 0,
  highScore = 0,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const appUrl = getAppUrl();
  const roundedScore = Math.floor(score);

  const queryParams = new URLSearchParams({
    score: roundedScore.toString(),
    deliveries: deliveries.toString(),
    reason: reason,
    violations: violations.toString(),
    highScore: Math.floor(highScore).toString(),
  }).toString();

  const ogUrl = `${appUrl}/api/og?${queryParams}`;
  const storyUrl = `${appUrl}/api/og?${queryParams}&format=story`;

  const tweetText = t("share.tweet_text", {
    score: roundedScore.toLocaleString("tr-TR"),
    deliveries: deliveries,
  });

  const handleShareX = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(appUrl)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadStory = async () => {
    try {
      const res = await fetch(storyUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kurye35-skor-${roundedScore}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(storyUrl, "_blank");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ui-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="ui-panel ui-rise relative w-full max-w-sm rounded-[28px] p-5 text-white space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-100">
              {t("share.modal_title")}
            </h3>
            <p className="text-xs text-slate-400">
              {t("share.modal_subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ui-icon-button"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Görsel Önizleme */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 aspect-[1200/630]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogUrl}
            alt="Skor Kartı Önizleme"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Paylaşım Butonları */}
        <div className="space-y-2.5">
          <button
            onClick={handleShareX}
            className="ui-secondary flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider transition active:scale-95"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            {t("share.x_button")}
          </button>

          <button
            onClick={handleDownloadStory}
            className="ui-primary flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider transition active:scale-95"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            {t("share.story_button")}
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium text-xs transition"
          >
            {copied ? t("share.link_copied") : t("share.copy_link")}
          </button>
        </div>
      </div>
    </div>
  );
};
