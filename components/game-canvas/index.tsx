"use client";

import React, { useRef, useEffect, useState } from "react";
import { VW, VH, FIXED_STEP } from "@/engine/constants";
import { GameEngine } from "@/engine/game-engine";
import { InputManager } from "@/engine/input";
import { renderGameView, renderBackground } from "@/engine/game-renderer";
import { GameStateEnum } from "@/engine/types";
import { TouchControls } from "@/components/touch-controls";
import { JoystickPosition, ButtonSize } from "@/utils/settings";
import { PauseIcon } from "@/components/ui/icons";
import {
  downgradeRenderProfile,
  getInitialRenderProfile,
  type RenderProfile,
} from "@/engine/performance";

interface GameCanvasProps {
  engine: GameEngine;
  isPlaying?: boolean;
  controlsLayout?: JoystickPosition;
  buttonSize?: ButtonSize;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  engine,
  isPlaying = false,
  controlsLayout = "left",
  buttonSize = "medium",
}) => {
  engine.joystickPosition = controlsLayout;
  engine.buttonSize = buttonSize;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputMgrRef = useRef<InputManager | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isTouchDev =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        (Boolean(navigator.maxTouchPoints) && navigator.maxTouchPoints > 0);
      engine.isTouchDevice = isTouchDev;
      setIsTouch(isTouchDev);
    }
  }, [engine]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isTouchDev =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      (Boolean(navigator.maxTouchPoints) && navigator.maxTouchPoints > 0);
    let renderProfile: RenderProfile = getInitialRenderProfile(isTouchDev);
    let renderCostTotal = 0;
    let renderCostSamples = 0;
    let rafDeltaTotal = 0;
    let rafDeltaSamples = 0;
    let slowRafFrames = 0;

    const handleResize = () => {
      const scale = Math.min(window.innerWidth / VW, window.innerHeight / VH);
      const w = VW * scale;
      const h = VH * scale;

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * renderProfile.pixelRatio);
      canvas.height = Math.round(h * renderProfile.pixelRatio);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const inputMgr = new InputManager(engine, canvas);
    inputMgrRef.current = inputMgr;

    engine.isTouchDevice = isTouchDev;
    setIsTouch(isTouchDev);
    if (isTouchDev) inputMgr.joystickMode = true;

    const onVisibilityChange = () => {
      if (document.hidden) engine.pause();
    };
    const onBlur = () => engine.pause();

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);

    let animationFrameId: number;
    let lastTime = 0;
    let renderAccumulator = 0;
    let accumulator = 0;

    const gameLoop = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const delta = Math.min(50, Math.max(0, timestamp - lastTime));
      lastTime = timestamp;
      renderAccumulator += delta;

      // Canvas komutlarının GPU maliyeti her tarayıcıda performance.now()'a tam
      // yansımaz. Gerçek RAF aralığı da izlenerek düşen kareler yakalanır.
      if (engine.state === GameStateEnum.PLAYING && renderProfile.quality !== "low" && delta > 0) {
        rafDeltaTotal += delta;
        rafDeltaSamples++;
        if (delta > 22) slowRafFrames++;
        if (rafDeltaSamples >= 90) {
          const averageRafDelta = rafDeltaTotal / rafDeltaSamples;
          const slowFrameRatio = slowRafFrames / rafDeltaSamples;
          if (averageRafDelta > 20.5 || slowFrameRatio > 0.08) {
            renderProfile = downgradeRenderProfile(renderProfile);
            handleResize();
            renderCostTotal = 0;
            renderCostSamples = 0;
            renderAccumulator = 1000 / renderProfile.playingFps;
          }
          rafDeltaTotal = 0;
          rafDeltaSamples = 0;
          slowRafFrames = 0;
        }
      }

      if (engine.state === GameStateEnum.PLAYING) {
        accumulator += delta;
        let guard = 0;
        while (accumulator >= FIXED_STEP && guard < 4) {
          engine.update();
          accumulator -= FIXED_STEP;
          guard++;
        }
      } else if (
        engine.state !== GameStateEnum.MENU &&
        engine.state !== GameStateEnum.PAUSED
      ) {
        engine.frame++;
        engine.roadScroll = (engine.roadScroll + 1.2) % (VH - 218);
        engine.worldDistance += 1.2;
        accumulator = 0;
      } else {
        // Ana menü ve duraklatma ekranında dünya tamamen sabit kalır.
        // Canvas yeniden çizilebilir, fakat oyun zamanı ve yol konumu ilerlemez.
        accumulator = 0;
      }

      const targetFps = engine.state === GameStateEnum.PLAYING
        ? renderProfile.playingFps
        : renderProfile.idleFps;
      const renderInterval = 1000 / targetFps;
      if (renderAccumulator < renderInterval - 1) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }
      renderAccumulator %= renderInterval;

      const renderStartedAt = performance.now();
      const currentWidth = parseFloat(canvas.style.width) || VW;
      const s = (currentWidth / VW) * renderProfile.pixelRatio;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(s, 0, 0, s, 0, 0);

      ctx.save();
      if (engine.shake > 0 && engine.state === GameStateEnum.PLAYING) {
        const a = engine.shake * 0.3;
        ctx.translate((Math.random() - 0.5) * a, (Math.random() - 0.5) * a);
      }

      if (engine.state === GameStateEnum.PLAYING || engine.state === GameStateEnum.PAUSED) {
        renderGameView(ctx, engine, renderProfile.quality);
      } else if (engine.state === GameStateEnum.MENU) {
        // Menü kendi tam ekran kapak görselini kullanır. Oyun dünyasını alta
        // çizmek, yarı saydam katmanların arasından hayalet görüntü oluşturur.
        ctx.fillStyle = "#02070a";
        ctx.fillRect(0, 0, VW, VH);
      } else {
        renderBackground(ctx, engine, renderProfile.quality);
      }
      ctx.restore();

      // Canvas maliyetini seyrek örnekleyip cihaz zorlanıyorsa kaliteyi tek yönlü düşür.
      // Histerezis (90 örnek) çözünürlüğün ileri geri sıçramasını engeller.
      renderCostTotal += performance.now() - renderStartedAt;
      renderCostSamples++;
      if (renderCostSamples >= 90 && renderProfile.quality !== "low") {
        const averageRenderCost = renderCostTotal / renderCostSamples;
        const budget = 1000 / renderProfile.playingFps;
        if (averageRenderCost > budget * 0.72) {
          renderProfile = downgradeRenderProfile(renderProfile);
          handleResize();
          renderAccumulator = 1000 / renderProfile.playingFps;
        }
        renderCostTotal = 0;
        renderCostSamples = 0;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      inputMgr.destroy();
      inputMgrRef.current = null;
    };
  }, [engine]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
      />
      <TouchControls
        engine={engine}
        visible={isTouch && isPlaying}
        layout={controlsLayout}
        buttonSize={buttonSize}
      />
      {isPlaying && (
        <button
          onClick={() => engine.togglePause()}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-11 h-11 rounded-2xl bg-[#071116]/85 border border-white/15 hover:border-teal-300/50 active:scale-90 active:bg-teal-300/15 text-slate-100 backdrop-blur-xl flex items-center justify-center font-black text-sm shadow-xl shadow-black/50 pointer-events-auto z-30 transition-all select-none"
          aria-label="Duraklat"
        >
          <PauseIcon className="h-5 w-5" />
        </button>
      )}
    </>
  );
};
