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
import { SettingsModal } from "@/components/settings-modal";
import { VehicleSelectModal } from "@/components/vehicle-select-modal";
import { PwaInstaller } from "@/components/pwa-installer";
import { setSoundMuted } from "@/engine/audio";
import {
  getJoystickPosition,
  setJoystickPosition as saveJoystickPosition,
  getButtonSize,
  setButtonSize as saveButtonSize,
  getSoundEnabled,
  setSoundEnabled as saveSoundEnabled,
  getSelectedVehicle,
  setSelectedVehicle as saveSelectedVehicle,
  JoystickPosition,
  ButtonSize,
  VehicleType,
} from "@/utils/settings";

export const GameContainer: React.FC = () => {
  const engine = useMemo(() => new GameEngine(), []);
  const [gameState, setGameState] = useState<GameStateEnum>(GameStateEnum.MENU);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVehicleSelectOpen, setIsVehicleSelectOpen] = useState(false);
  const [isStartingFlow, setIsStartingFlow] = useState(false);
  const [selectedVehicle, setSelectedVehicleState] = useState<VehicleType>(getSelectedVehicle);
  const [controlsLayout, setControlsLayout] = useState<JoystickPosition>(getJoystickPosition);
  const [buttonSize, setButtonSize] = useState<ButtonSize>(getButtonSize);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(getSoundEnabled);
  const [, setTick] = useState(0);

  engine.onStateChange = (nextState: GameStateEnum) => {
    setGameState(nextState);
    setTick((t) => t + 1);
  };

  const handleLayoutChange = (pos: JoystickPosition) => {
    setControlsLayout(pos);
    saveJoystickPosition(pos);
  };

  const handleButtonSizeChange = (size: ButtonSize) => {
    setButtonSize(size);
    saveButtonSize(size);
  };

  const handleSoundChange = (enabled: boolean) => {
    setSoundEnabled(enabled);
    saveSoundEnabled(enabled);
    setSoundMuted(!enabled);
  };

  const handleVehicleChange = (vehicle: VehicleType) => {
    setSelectedVehicleState(vehicle);
    saveSelectedVehicle(vehicle);
    engine.setVehicleType(vehicle);
    setTick((t) => t + 1);
  };

  const handleOpenVehicleMenu = () => {
    setIsStartingFlow(false);
    setIsVehicleSelectOpen(true);
  };

  const handleStartShiftFlow = () => {
    setIsStartingFlow(true);
    setIsVehicleSelectOpen(true);
  };

  const handleProceedToGame = () => {
    setIsStartingFlow(false);
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
    handleStartShiftFlow();
  };

  return (
    <main className="relative w-screen h-[100dvh] flex items-center justify-center overflow-hidden bg-radial from-[#16212b] via-[#070a0d] to-[#020305]">
      {/* Oyun Alanı ve Canvas Kapsayıcısı */}
      <div className="relative aspect-[9/16] h-full max-h-[920px] max-w-full flex items-center justify-center overflow-hidden">
        <GameCanvas
          engine={engine}
          isPlaying={gameState === GameStateEnum.PLAYING}
          controlsLayout={controlsLayout}
          buttonSize={buttonSize}
        />

        {/* UI Katmanları */}
        {gameState === GameStateEnum.MENU && (
          <GameMenu
            onStart={handleStartShiftFlow}
            highScore={engine.highScore}
            bestDeliveries={engine.bestDeliveries}
            unlockedCount={engine.unlockedAchievements.size}
            selectedVehicle={selectedVehicle}
            onOpenVehicleSelect={handleOpenVehicleMenu}
            joystickPosition={controlsLayout}
            onChangeJoystickPosition={handleLayoutChange}
            onOpenSettings={() => setIsSettingsOpen(true)}
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
            onOpenSettings={() => setIsSettingsOpen(true)}
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

      {/* Ayarlar Modalı */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        joystickPosition={controlsLayout}
        onChangeJoystickPosition={handleLayoutChange}
        buttonSize={buttonSize}
        onChangeButtonSize={handleButtonSizeChange}
        soundEnabled={soundEnabled}
        onChangeSoundEnabled={handleSoundChange}
      />

      {/* Araç Seçim Modalı */}
      <VehicleSelectModal
        isOpen={isVehicleSelectOpen}
        onClose={() => setIsVehicleSelectOpen(false)}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={handleVehicleChange}
        isStartingFlow={isStartingFlow}
        onStartGame={handleProceedToGame}
      />

      {/* PWA Yükleme ve Çevrimdışı Bildirimi */}
      <PwaInstaller />
    </main>
  );
};
