"use client";

import dynamic from "next/dynamic";

const GameContainer = dynamic(
  () => import("@/components/game-container").then((mod) => mod.GameContainer),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-[100dvh] flex items-center justify-center bg-[#020305] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs tracking-widest text-teal-300 font-bold">YÜKLENİYOR...</span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return <GameContainer />;
}
