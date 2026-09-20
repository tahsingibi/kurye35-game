"use client";

import React, { useState, useMemo } from "react";
import { GameEngine } from "@/engine/game-engine";
import { GameStateEnum } from "@/engine/types";
import { GameCanvas } from "@/components/game-canvas";
import { GameMenu } from "@/components/game-menu";
import { GameStory } from "@/components/game-story";
import { GamePause } from "@/components/game-pause";
import { GameOver } from "@/components/game-over";
import { ShareModal } from "@/components/share-modal";
import { PwaInstaller } from "@/components/pwa-installer";
import {
  getJoystickPosition,
  setJoystickPosition as saveJoystickPosition,
  JoystickPosition,
} from "@/utils/settings";

export const GameContainer: React.FC = () => {
  const engine = useMemo(() => new GameEngine(), []);
  const [gameState, setGameState] = useState<GameStateEnum>(GameStateEnum.MENU);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [controlsLayout, setControlsLayout] = useState<JoystickPosition>(getJoystickPosition);
  const [, setTick] = useState(0);

  engine.onStateChange = (nextState: GameStateEnum) => {
    setGameState(nextState);
    setTick((t) => t + 1);
  };

  const handleLayoutChange = (pos: JoystickPosition) => {
    setControlsLayout(pos);
    saveJoystickPosition(pos);
  };

  const handleStartShift = () => {
    engine.resetGame();
  };

  const handleAdvanceStory = () => {
    if (engine.storyPage < 2) {
      engine.storyPage++;
      setTick((t) => t + 1);
    } else {
      engine.beginGame();
    }
  };

  const handleResume = () => {
    engine.togglePause();
  };

  const handleRestart = () => {
    setIsShareOpen(false);
    engine.resetGame();
  };

  return (
    <main className="relative w-screen h-[100dvh] flex items-center justify-center overflow-hidden bg-radial from-[#16212b] via-[#070a0d] to-[#020305]">
      {/* Oyun Alanı ve Canvas Kapsayıcısı */}
      <div className="relative aspect-[9/16] h-full max-h-[920px] max-w-full flex items-center justify-center overflow-hidden">
        <GameCanvas
          engine={engine}
          isPlaying={gameState === GameStateEnum.PLAYING}
          controlsLayout={controlsLayout}
        />

        {/* UI Katmanları */}
        {gameState === GameStateEnum.MENU && (
          <GameMenu
            onStart={handleStartShift}
            highScore={engine.highScore}
            bestDeliveries={engine.bestDeliveries}
            unlockedCount={engine.unlockedAchievements.size}
            joystickPosition={controlsLayout}
            onChangeJoystickPosition={handleLayoutChange}
          />
        )}

        {gameState === GameStateEnum.STORY && (
          <GameStory
            currentPage={engine.storyPage}
            onAdvance={handleAdvanceStory}
          />
        )}

        {gameState === GameStateEnum.PAUSED && (
          <GamePause
            onResume={handleResume}
            clockText={engine.clockText}
            phaseText={engine.phaseText}
            speed={engine.displaySpeed}
            joystickPosition={controlsLayout}
            onChangeJoystickPosition={handleLayoutChange}
          />
        )}

        {gameState === GameStateEnum.GAMEOVER && (
          <GameOver
            reason={engine.endReason}
            score={engine.score}
            deliveries={engine.deliveries}
            violations={engine.violations}
            lastViolation={engine.lastViolation}
            highScore={engine.highScore}
            bestDeliveries={engine.bestDeliveries}
            unlockedCount={engine.unlockedAchievements.size}
            onRestart={handleRestart}
            onShare={() => setIsShareOpen(true)}
          />
        )}
      </div>

      {/* Paylaşım Modalı */}
      {isShareOpen && (
        <ShareModal
          score={engine.score}
          deliveries={engine.deliveries}
          reason={engine.endReason}
          violations={engine.violations}
          highScore={engine.highScore}
          onClose={() => setIsShareOpen(false)}
        />
      )}

      {/* PWA Yükleme ve Çevrimdışı Bildirimi */}
      <PwaInstaller />
    </main>
  );
};
