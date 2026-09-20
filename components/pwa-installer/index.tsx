"use client";

import React, { useState, useEffect } from "react";
import { t } from "@/utils/localization";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PwaInstaller: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between p-4 rounded-xl bg-slate-900/90 border border-slate-700/50 backdrop-blur-md shadow-2xl text-white max-w-sm mx-auto">
      <div className="flex flex-col">
        <span className="font-bold text-sm tracking-wide text-cyan-400">
          {t("app.title")}
        </span>
        <span className="text-xs text-slate-300">
          {t("pwa.offline_ready")}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs rounded-lg transition active:scale-95"
        >
          {t("pwa.install_btn")}
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="px-2 py-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          {t("pwa.close")}
        </button>
      </div>
    </div>
  );
};
