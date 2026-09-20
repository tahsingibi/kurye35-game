"use client";

import React, { useRef, useEffect, useState } from "react";
import { VW, VH, FIXED_STEP } from "@/engine/constants";
import { GameEngine } from "@/engine/game-engine";
import { InputManager } from "@/engine/input";
import { renderGameView, renderBackground } from "@/engine/game-renderer";
import { GameStateEnum } from "@/engine/types";
import { TouchControls } from "@/components/touch-controls";
import { JoystickPosition } from "@/utils/settings";

interface GameCanvasProps {
  engine: GameEngine;
  isPlaying?: boolean;
  controlsLayout?: JoystickPosition;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  engine,
  isPlaying = false,
  controlsLayout = "left",
}) => {
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

    const handleResize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const ratio = VW / VH;
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      let w: number;
      let h: number;

      if (ww / wh < ratio) {
        w = ww;
        h = w / ratio;
      } else {
        h = Math.min(wh, 920);
        w = h * ratio;
      }

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const inputMgr = new InputManager(engine, canvas);
    inputMgrRef.current = inputMgr;

    const isTouchDev =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      (Boolean(navigator.maxTouchPoints) && navigator.maxTouchPoints > 0);
    engine.isTouchDevice = isTouchDev;
    setIsTouch(isTouchDev);
    if (isTouchDev) inputMgr.joystickMode = true;

    const onVisibilityChange = () => {
      if (document.hidden) engine.togglePause();
    };
    const onBlur = () => engine.togglePause();

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);

    let animationFrameId: number;
    let lastTime = 0;
    let accumulator = 0;

    const gameLoop = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const delta = Math.min(50, Math.max(0, timestamp - lastTime));
      lastTime = timestamp;

      if (engine.state === GameStateEnum.PLAYING) {
        accumulator += delta;
        let guard = 0;
        while (accumulator >= FIXED_STEP && guard < 4) {
          engine.update();
          accumulator -= FIXED_STEP;
          guard++;
        }
      } else {
        engine.frame++;
        engine.roadScroll = (engine.roadScroll + 1.2) % (VH - 218);
        engine.worldDistance += 1.2;
        accumulator = 0;
      }

      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const currentWidth = parseFloat(canvas.style.width) || VW;
      const viewScale = currentWidth / VW;
      const s = viewScale * dpr;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(s, 0, 0, s, 0, 0);

      ctx.save();
      if (engine.shake > 0 && engine.state === GameStateEnum.PLAYING) {
        const a = engine.shake * 0.3;
        ctx.translate((Math.random() - 0.5) * a, (Math.random() - 0.5) * a);
      }

      if (engine.state === GameStateEnum.PLAYING || engine.state === GameStateEnum.PAUSED) {
        renderGameView(ctx, engine);
      } else {
        renderBackground(ctx, engine);
      }
      ctx.restore();

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
        className="block shadow-[0_34px_120px_rgba(0,0,0,0.85)] rounded-lg overflow-hidden"
      />
      <TouchControls
        engine={engine}
        visible={isTouch && isPlaying}
        layout={controlsLayout}
      />
    </>
  );
};
