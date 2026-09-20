import { VW, VH, HORIZON } from "./constants";
import { drawSky } from "./renderers/sky";
import { drawDistantSkyline, drawWaterfront, drawMovingBuildings } from "./renderers/city";
import { drawRoad, drawStreetFurniture } from "./renderers/road";
import { drawApproachingBridge, drawApproachingRouteLandmark } from "./renderers/architecture";
import {
  drawParticles,
  drawFloaters,
  drawHeadlightBeam,
  drawTimeAtmosphere,
  drawRain,
  drawPursuitDangerEffect,
  drawBanner,
  drawAchievementToast,
} from "./renderers/effects";
import { drawCanvasHUD } from "./renderers/hud";
import { getPhaseInfo } from "./missions";
import type { GameEngine } from "./game-engine";
import { GameStateEnum } from "./types";

export function renderBackground(ctx: CanvasRenderingContext2D, engine: GameEngine): void {
  drawSky(ctx, engine.gameMinutes, engine.frame);
  drawDistantSkyline(ctx, engine.gameMinutes, engine.routePhase);
  if (engine.routePhase === 1) {
    drawWaterfront(ctx, engine.gameMinutes);
  }
  drawRoad(ctx, engine.gameMinutes, engine.frame, engine.routePhase, engine.roadScroll, engine.wet);
  drawMovingBuildings(ctx, engine.worldDistance, engine.gameMinutes, engine.frame, engine.routePhase);
  drawApproachingRouteLandmark(ctx, engine.worldDistance, engine.gameMinutes, engine.frame, engine.routePhase);
  drawApproachingBridge(ctx, engine.worldDistance, engine.gameMinutes, engine.frame, engine.routePhase);
  drawStreetFurniture(ctx, engine.gameMinutes, engine.frame, engine.routePhase, engine.roadScroll);
  drawTimeAtmosphere(ctx, engine.gameMinutes);
  drawRain(ctx, engine.rain, engine.frame);
}

export function renderGameView(ctx: CanvasRenderingContext2D, engine: GameEngine): void {
  renderBackground(ctx, engine);
  drawHeadlightBeam(
    ctx,
    engine.player.x,
    engine.player.y,
    engine.player.w,
    engine.gameMinutes,
    engine.frame,
    engine.routePhase
  );

  // Trafik araçları ve nesneler (derinliğe göre sıralı)
  engine.items.slice().sort((a, b) => a.y - b.y).forEach((item) => {
    item.draw(ctx, engine.frame, engine.routePhase);
  });

  // Polis araçları
  for (const p of engine.police) {
    ctx.globalAlpha = p.alpha;
    p.draw(ctx, engine.frame);
    ctx.globalAlpha = 1;
  }

  // Oyuncu
  engine.player.draw(ctx, engine.boosting, engine.health, engine.frame);

  // Parçacıklar ve kayan metinler
  drawParticles(ctx, engine.particles);
  drawFloaters(ctx, engine.floaters);

  // Polis tehlike kenar efekti
  const isChasing = engine.police.some((p) => !p.retiring);
  drawPursuitDangerEffect(
    ctx,
    engine.wanted,
    engine.arrest,
    isChasing,
    engine.frame,
    engine.wet,
    engine.gameMinutes,
    engine.player.y,
    engine.routePhase
  );

  // HUD
  if (engine.state === GameStateEnum.PLAYING) {
    const phase = getPhaseInfo(engine.routePhase);
    drawCanvasHUD(
      ctx,
      phase,
      engine.currentMissionTitle,
      engine.currentMissionProgress,
      engine.deliveries,
      engine.score,
      engine.unlockedAchievements.size,
      8,
      engine.clockText,
      engine.phaseText,
      engine.health,
      engine.displaySpeed,
      engine.nos,
      engine.boosting,
      engine.wanted,
      engine.arrest,
      isChasing,
      engine.pursuitCleanFrames,
      engine.violations,
      engine.lastViolation,
      engine.combo,
      engine.isTouchDevice,
      engine.controls
    );
  }

  // Banner & Achievement
  drawBanner(ctx, engine.banner);
  drawAchievementToast(ctx, engine.achievementToast);

  // Boost görsel efekti
  if (engine.boosting) {
    ctx.fillStyle = "rgba(69,190,255,.035)";
    ctx.fillRect(0, 0, VW, VH);
    ctx.strokeStyle = "rgba(137,224,255,.12)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const y = HORIZON + ((engine.frame * 11 + i * 137) % (VH - HORIZON));
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(72, y - 44);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(VW, y + 36);
      ctx.lineTo(VW - 72, y - 8);
      ctx.stroke();
    }
  }

  // Hasar flaşı
  if (engine.flash > 0) {
    ctx.fillStyle = `rgba(255,66,52,${engine.flash / 50})`;
    ctx.fillRect(0, 0, VW, VH);
  }
}
