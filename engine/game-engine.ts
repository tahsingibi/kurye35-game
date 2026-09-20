import { VW, VH, HORIZON, FIXED_STEP, MISSIONS_DATA, ACHIEVEMENTS_DATA } from "./constants";
import { clamp, getHour, daylight, laneCenter } from "./utils";
import { Player } from "./entities/player";
import { TrafficItem } from "./entities/traffic";
import { PoliceUnit } from "./entities/police";
import { playSound } from "./audio";
import { checkAABBHit, handlePoliceTrafficCollisions } from "./collision";
import { getRoutePhase, getMissionProgressText, loadStoredAchievements, saveAchievements, loadScores, saveScores } from "./missions";
import { t } from "@/utils/localization";
import type { GameStateEnum, Particle, Floater, BannerInfo, AchievementToast, ControlsState } from "./types";

export class GameEngine {
  state: GameStateEnum = 0; // MENU
  score = 0;
  deliveries = 0;
  health = 100;
  nos = 100;
  baseSpeed = 2.45;
  frame = 0;
  driveFrames = 0;
  roadScroll = 0;
  worldDistance = 0;
  boosting = false;
  boostFrames = 0;
  combo = 0;
  comboFrames = 0;
  trafficTimer = 0;

  wanted = 0;
  arrest = 0;
  pursuitCleanFrames = 0;
  chaseWasActive = false;
  policeCooldown = 0;
  sirenCooldown = 0;

  violations = 0;
  lastViolation = "Yok";
  cleanMissionFrames = 0;
  lastViolationFrame = -99999;

  rain = 0;
  wet = 0;
  shake = 0;
  flash = 0;
  endReason: "crash" | "busted" = "crash";

  storyPage = 0;
  missionIndex = 0;
  missionStartDeliveries = 0;
  missionTimer = 0;
  missionDone = false;
  missionAdvanceFrames = 0;

  banner: BannerInfo | null = null;
  items: TrafficItem[] = [];
  police: PoliceUnit[] = [];
  particles: Particle[] = [];
  floaters: Floater[] = [];

  gameMinutes = 17 * 60 + 20;
  lastTimePhase = "AKŞAM";
  isTouchDevice = false;
  controls: ControlsState = { throttle: false, brake: false };

  highScore = 0;
  bestDeliveries = 0;
  unlockedAchievements: Set<string> = new Set();
  achievementToast: AchievementToast | null = null;
  achievementSpeedFrames = 0;
  achievementCleanFrames = 0;

  player: Player = new Player();
  onStateChange?: (state: GameStateEnum) => void;

  constructor() {
    const scores = loadScores();
    this.highScore = scores.highScore;
    this.bestDeliveries = scores.bestDeliveries;
    this.unlockedAchievements = loadStoredAchievements();
  }

  get routePhase(): number {
    return getRoutePhase(this.deliveries);
  }

  get displaySpeed(): number {
    return Math.round(14 + this.baseSpeed * 11.8 + (this.boosting ? 30 : 0));
  }

  get clockText(): string {
    let m = Math.floor(this.gameMinutes) % 1440;
    if (m < 0) m += 1440;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }

  get phaseText(): string {
    const h = getHour(this.gameMinutes);
    if (h >= 5.2 && h < 7) return t("time_phases.safak");
    if (h >= 7 && h < 17.5) return t("time_phases.gunduz");
    if (h >= 17.5 && h < 19.4) return t("time_phases.aksam");
    return t("time_phases.gece");
  }

  get currentMissionTitle(): string {
    const m = MISSIONS_DATA[this.missionIndex];
    return m ? t(m.slugTitle) : "Aktif rota";
  }

  get currentMissionProgress(): string {
    return getMissionProgressText(
      this.missionIndex,
      this.deliveries,
      this.missionStartDeliveries,
      this.cleanMissionFrames,
      this.missionTimer
    );
  }

  addParticle(x: number, y: number, count = 12, color = "#ff8a4c"): void {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 28 + Math.random() * 35,
        max: 63,
        size: 2 + Math.random() * 4,
        color,
      });
    }
  }

  addFloater(s: string, x: number, y: number, color = "#fff"): void {
    this.floaters.push({ s, x, y, color, life: 65 });
  }

  setBanner(title: string, sub: string, kicker = "MERKEZ", color = "#80e2da", duration = 190): void {
    this.banner = { title, sub, kicker, color, duration, time: 0 };
  }

  unlockAchievement(id: keyof typeof ACHIEVEMENTS_DATA): boolean {
    if (this.unlockedAchievements.has(id)) return false;
    this.unlockedAchievements.add(id);
    saveAchievements(this.unlockedAchievements);
    const a = ACHIEVEMENTS_DATA[id];
    this.score += a.reward;
    this.nos = Math.min(100, this.nos + 8);
    this.achievementToast = {
      title: t(`achievements.${a.slug}.title`),
      sub: t(`achievements.${a.slug}.sub`),
      reward: a.reward,
      time: 0,
      duration: 210,
    };
    playSound("success");
    this.addParticle(VW / 2, 48, 28, "#ffe08a");
    return true;
  }

  registerViolation(amount: number, label: string): void {
    this.wanted = clamp(this.wanted + amount, 0, 100);
    this.violations++;
    this.lastViolation = label;
    this.lastViolationFrame = this.frame;
    this.pursuitCleanFrames = 0;
    this.cleanMissionFrames = 0;
    if (this.wanted >= 20 && !this.chaseWasActive) {
      this.chaseWasActive = true;
      this.setBanner("Polis takibe başladı", label, "TRAFİK", "#ff6d61", 190);
      playSound("siren");
    }
  }

  endPursuit(): void {
    if (!this.chaseWasActive) return;
    this.chaseWasActive = false;
    this.wanted = 0;
    this.arrest = 0;
    this.pursuitCleanFrames = 0;
    for (const p of this.police) p.retiring = true;
    this.setBanner("Polis izini kaybetti", "Temiz sürüşe devam et.", "TAKİP BİTTİ", "#74e2ac", 210);
    playSound("success");
    this.unlockAchievement("escape");
  }

  activateNOS(): void {
    if (this.state !== 2 || this.nos < 30 || this.boosting) return;
    this.boosting = true;
    this.boostFrames = 92;
    this.nos -= 30;
    this.registerViolation(11, "Aşırı hız / NOS");
    playSound("nos");
    this.addParticle(this.player.x + 24, this.player.y + 84, 22, "#6edbff");
  }

  moveLeft(): void {
    if (this.state !== 2 || this.player.laneLock > 0) return;
    if (this.player.lane > 0) {
      this.player.lane--;
      this.player.laneLock = 4;
      playSound("move");
    }
  }

  moveRight(): void {
    if (this.state !== 2 || this.player.laneLock > 0) return;
    if (this.player.lane < 2) {
      this.player.lane++;
      this.player.laneLock = 4;
      playSound("move");
    }
  }

  startMission(index: number): void {
    this.missionIndex = clamp(index, 0, MISSIONS_DATA.length - 1);
    this.missionStartDeliveries = this.deliveries;
    this.missionDone = false;
    this.cleanMissionFrames = 0;
    const m = MISSIONS_DATA[this.missionIndex];
    this.missionTimer = m.type === "timed" && m.seconds ? m.seconds * 60 : 0;
    this.setBanner(t(m.slugTitle), t(m.slugDesc), "YENİ ROTA", this.missionIndex === 2 ? "#78d8ff" : "#ffbd5a", 200);
  }

  completeMission(): void {
    if (this.missionDone) return;
    this.missionDone = true;
    this.missionAdvanceFrames = 42;
    this.score += 550;
    this.nos = Math.min(100, this.nos + 22);
    playSound("success");
    this.setBanner("Rota tamamlandı", "+550 puan · NOS yenilendi", "TAMAMLANDI", "#78e3ac", 180);
    if (this.missionIndex === MISSIONS_DATA.length - 1) {
      this.unlockAchievement("master");
    }
  }

  onDelivery(): void {
    if (this.deliveries === 3) {
      this.rain = 0.3;
      this.wet = 0.45;
      this.setBanner("Yağmur geliyor", "Asfalt tutuşu düşüyor.", "HAVA", "#78d8ff", 190);
    } else if (this.deliveries === 5) {
      this.rain = 0.65;
      this.wet = 0.9;
      this.setBanner("Kordon ıslak", "Yansımalar görüşünü bozabilir.", "KORDON", "#78d8ff", 190);
    } else if (this.deliveries === 7) {
      this.setBanner("Altınyol bağlantısı", "Karşıyaka yönü viyadük trafiği.", "ALTINYOL", "#ffbd5a", 190);
    } else if (this.deliveries === 10) {
      this.rain = 0.3;
      this.wet = 0.6;
      this.setBanner("Karşıyaka'ya geçtin", "Gece trafiği daha sıkışık.", "KUZEY", "#ff6f91", 190);
    } else if (this.deliveries === 14) {
      this.rain = 0;
      this.wet = 0.25;
      this.setBanner("Çevre yolu", "Hava açıldı. Yol daha net.", "ROTAN AÇIK", "#ffc49a", 220);
    }
  }

  damage(item: TrafficItem): void {
    if (this.player.invuln > 0) return;
    const d = item.type === "bus" ? 46 : item.type === "works" ? 35 : item.type === "van" ? 31 : item.type === "puddle" ? 14 : 27;
    this.health = Math.max(0, this.health - d);
    this.player.invuln = 58;
    this.shake = 18;
    this.flash = 12;
    this.combo = 0;
    this.comboFrames = 0;
    this.registerViolation(item.type === "puddle" ? 5 : 24, item.type === "puddle" ? "Kontrol kaybı" : "Trafik kazası");
    playSound("hit");
    this.addParticle(this.player.x + 24, this.player.y + 45, 26, "#ff754f");
    this.addFloater(item.type === "puddle" ? "Kaydın!" : `-${d}%`, this.player.x + 24, this.player.y - 12, "#ff9c8e");
    if (this.health <= 0) this.endGame("crash");
  }

  endGame(reason: "crash" | "busted"): void {
    this.endReason = reason;
    saveScores(this.score, this.deliveries);
    const sc = loadScores();
    this.highScore = sc.highScore;
    this.bestDeliveries = sc.bestDeliveries;
    this.state = 3; // GAMEOVER
    this.onStateChange?.(this.state);
  }

  resetGame(): void {
    this.score = 0;
    this.deliveries = 0;
    this.health = 100;
    this.nos = 100;
    this.baseSpeed = 2.45;
    this.controls.throttle = false;
    this.controls.brake = false;
    this.frame = 0;
    this.driveFrames = 0;
    this.roadScroll = 0;
    this.worldDistance = 0;
    this.boosting = false;
    this.boostFrames = 0;
    this.combo = 0;
    this.comboFrames = 0;
    this.trafficTimer = 90;
    this.wanted = 0;
    this.arrest = 0;
    this.pursuitCleanFrames = 0;
    this.chaseWasActive = false;
    this.policeCooldown = 0;
    this.sirenCooldown = 0;
    this.violations = 0;
    this.lastViolation = "Yok";
    this.cleanMissionFrames = 0;
    this.lastViolationFrame = -99999;
    this.rain = 0;
    this.wet = 0;
    this.shake = 0;
    this.flash = 0;
    this.endReason = "crash";
    this.storyPage = 0;
    this.missionIndex = 0;
    this.missionStartDeliveries = 0;
    this.missionTimer = 0;
    this.missionDone = false;
    this.missionAdvanceFrames = 0;
    this.gameMinutes = 17 * 60 + 20;
    this.lastTimePhase = this.phaseText;
    this.banner = null;
    this.achievementToast = null;
    this.achievementSpeedFrames = 0;
    this.achievementCleanFrames = 0;
    this.items = [];
    this.police = [];
    this.particles = [];
    this.floaters = [];
    this.player.lane = 1;
    this.player.x = laneCenter(1, this.player.y, 0, 0) - this.player.w / 2;
    this.player.invuln = 0;
    this.state = 1; // STORY
    this.onStateChange?.(this.state);
  }

  beginGame(): void {
    this.state = 2; // PLAYING
    this.trafficTimer = 105;
    this.controls.throttle = false;
    this.controls.brake = false;
    this.startMission(0);
    this.setBanner(t("time_banners.contact_title"), t("time_banners.contact_sub"), "VARDİYA", "#8de8da", 210);
    this.onStateChange?.(this.state);
  }

  togglePause(): void {
    if (this.state === 2) {
      this.state = 4; // PAUSED
      this.controls.throttle = false;
      this.controls.brake = false;
      this.onStateChange?.(this.state);
    } else if (this.state === 4) {
      this.state = 2; // PLAYING
      this.onStateChange?.(this.state);
    }
  }

  update(): void {
    this.frame++;
    this.driveFrames++;
    this.gameMinutes = (this.gameMinutes + 8 / 60) % 1440;

    const currentPhase = this.phaseText;
    if (currentPhase !== this.lastTimePhase) {
      this.lastTimePhase = currentPhase;
      const h = getHour(this.gameMinutes);
      let titleKey = "time_banners.gece_title";
      let subKey = "time_banners.gece_sub";
      let col = "#91bfff";
      if (h >= 5.2 && h < 7) { titleKey = "time_banners.safak_title"; subKey = "time_banners.safak_sub"; col = "#ffc08a"; }
      else if (h >= 7 && h < 17.5) { titleKey = "time_banners.gunduz_title"; subKey = "time_banners.gunduz_sub"; col = "#ffe08a"; }
      else if (h >= 17.5 && h < 19.4) { titleKey = "time_banners.aksam_title"; subKey = "time_banners.aksam_sub"; col = "#ffb277"; }
      this.setBanner(t(titleKey), t(subKey), "SAAT", col, 180);
    }

    const progression = clamp(this.driveFrames / (60 * 210), 0, 1);
    const maxRoadSpeed = 8.65 + progression * 1.15 + Math.min(1.15, this.deliveries * 0.045);
    const idleSpeed = 2.45;

    if (this.controls.brake) {
      this.baseSpeed -= 0.095 + (this.baseSpeed > 6 ? 0.02 : 0);
    } else if (this.controls.throttle) {
      const ratio = clamp(this.baseSpeed / maxRoadSpeed, 0, 1);
      this.baseSpeed += Math.max(0.027, 0.052 - 0.022 * ratio * ratio);
    } else if (this.baseSpeed > idleSpeed) {
      this.baseSpeed -= 0.016;
    } else if (this.baseSpeed < idleSpeed) {
      this.baseSpeed += 0.01;
    }
    this.baseSpeed = clamp(this.baseSpeed, 0.95, maxRoadSpeed);

    const travelStep = this.baseSpeed * (this.boosting ? 1.36 : 1);
    this.roadScroll = (this.roadScroll + travelStep) % (VH - HORIZON);
    this.worldDistance += travelStep;
    this.score += (this.baseSpeed / 8.8) * (this.boosting ? 0.13 : 0.06);

    this.player.update(this.rain, this.frame, this.routePhase);

    // NOS
    if (this.boosting) {
      this.boostFrames--;
      if (this.boostFrames <= 0) this.boosting = false;
    } else {
      this.nos = Math.min(100, this.nos + 0.05);
    }

    // Clean drive tracking
    if (this.frame - this.lastViolationFrame > 0 && !this.boosting && this.player.invuln <= 0) {
      this.cleanMissionFrames++;
    } else if (this.boosting || this.player.invuln > 0) {
      this.cleanMissionFrames = 0;
    }

    // Mission update
    const m = MISSIONS_DATA[this.missionIndex];
    if (m && !this.missionDone) {
      if (m.type === "delta" && this.deliveries - this.missionStartDeliveries >= m.target) this.completeMission();
      if (m.type === "timed") {
        this.missionTimer--;
        if (this.deliveries - this.missionStartDeliveries >= m.target) this.completeMission();
        else if (this.missionTimer <= 0) {
          this.missionStartDeliveries = this.deliveries;
          this.missionTimer = (m.seconds || 60) * 60;
          this.setBanner("Rota yenilendi", "Süre doldu. Polis cezası yok.", "MERKEZ", "#ffcf6a", 160);
        }
      }
      if (m.type === "clean" && this.cleanMissionFrames >= m.target * 60) this.completeMission();
      if (m.type === "total" && this.deliveries >= m.target) this.completeMission();
    }
    if (this.missionAdvanceFrames > 0) {
      this.missionAdvanceFrames--;
      if (this.missionAdvanceFrames <= 0 && this.missionIndex < MISSIONS_DATA.length - 1) {
        this.startMission(this.missionIndex + 1);
      }
    }

    // Police update
    this.policeCooldown--;
    this.sirenCooldown--;
    const active = this.wanted >= 20;
    if (active) {
      if (this.sirenCooldown <= 0) {
        playSound("siren");
        this.sirenCooldown = 240;
      }
      if (this.boosting || this.player.invuln > 0) this.pursuitCleanFrames = 0;
      else this.pursuitCleanFrames++;

      if (this.pursuitCleanFrames > 180) {
        this.wanted = Math.max(20, this.wanted - (this.pursuitCleanFrames > 420 ? 0.12 : 0.055));
        this.arrest = Math.max(0, this.arrest - 0.55);
      }
      if (this.pursuitCleanFrames > 600) {
        this.endPursuit();
      } else {
        const maxPolice = this.wanted > 72 ? 3 : this.wanted > 44 ? 2 : 1;
        if (this.police.filter((p) => !p.retiring).length < maxPolice && this.policeCooldown <= 0) {
          this.police.push(new PoliceUnit());
          this.policeCooldown = 260 - Math.min(100, this.wanted);
          if (this.sirenCooldown <= 0) {
            playSound("siren");
            this.sirenCooldown = 220;
          }
        }
      }
    } else if (this.chaseWasActive) {
      this.endPursuit();
    }

    for (const p of this.police) {
      if (!active) p.retiring = true;
      const { arrestDelta } = p.update(this.player, this.items, this.wanted, this.boosting, this.frame, this.routePhase);
      if (arrestDelta > 0 && this.pursuitCleanFrames < 180) {
        this.arrest = clamp(this.arrest + arrestDelta, 0, 100);
      } else {
        this.arrest = Math.max(0, this.arrest - (this.pursuitCleanFrames > 180 ? 0.82 : 0.48));
      }
      if (this.arrest >= 100 && this.wanted >= 20) this.endGame("busted");
    }
    this.police = this.police.filter((p) => p.alpha > 0 && p.y < VH + 180 && (!p.crashed || p.crashFrames > 0));
    if (this.boosting && active) this.arrest = Math.max(0, this.arrest - 0.5);

    // Combo timer
    if (this.comboFrames > 0) {
      this.comboFrames--;
      if (this.comboFrames <= 0) this.combo = 0;
    }

    // Traffic spawn
    this.trafficTimer--;
    const dayRush = daylight(this.gameMinutes) > 0.65 ? 8 : 0;
    const rate = Math.max(42, 102 - Math.floor((this.baseSpeed - 4.15) * 10) - dayRush);
    if (this.trafficTimer <= 0) {
      this.items.push(new TrafficItem());
      this.trafficTimer = rate + Math.floor(Math.random() * 20);
      if (this.baseSpeed > 7.1 && this.driveFrames > 60 * 70 && Math.random() < 0.09) {
        this.items.push(new TrafficItem(Math.random() < 0.25 ? "parcel" : null));
      }
    }

    for (const i of this.items) i.update(this.baseSpeed, this.boosting, this.frame, this.routePhase);
    this.items = this.items.filter((i) => i.y < VH + 120);

    // Collisions
    handlePoliceTrafficCollisions(this.police, this.items, (p) => {
      this.arrest = Math.max(0, this.arrest - 24);
      this.wanted = Math.max(20, this.wanted - 7);
      this.score += 250;
      this.policeCooldown = Math.max(this.policeCooldown, 145);
      playSound("hit");
      this.shake = Math.max(this.shake, 9);
      this.addParticle(p.x + p.w / 2, p.y + p.h / 2, 28, "#78bfff");
      this.addFloater("POLİS KAZA YAPTI +250", p.x + p.w / 2, p.y - 12, "#9fd1ff");
      this.unlockAchievement("trap");
    });

    // Player with items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      if (checkAABBHit(this.player, it, 7, 5)) {
        if (it.type === "parcel") {
          this.deliveries++;
          const mRatio = Math.max(1, this.combo);
          this.score += 150 * mRatio;
          this.nos = Math.min(100, this.nos + 11);
          this.combo++;
          this.comboFrames = 150;
          playSound("pickup");
          this.addParticle(it.x + it.w / 2, it.y + it.h / 2, 18, "#ffd070");
          this.addFloater(`Teslimat +${150 * mRatio}`, this.player.x + 24, this.player.y - 18, "#ffe1a8");
          this.items.splice(i, 1);
          this.onDelivery();
          if (this.deliveries === 1) this.unlockAchievement("first");
          if (this.combo >= 3) this.unlockAchievement("combo");
          if (this.deliveries >= 10) this.unlockAchievement("ten");
        } else {
          this.damage(it);
          this.items.splice(i, 1);
        }
        continue;
      }
      if (!it.passed && it.type !== "parcel" && it.y > this.player.y + this.player.h) {
        it.passed = true;
        const d = Math.abs(it.x + it.w / 2 - (this.player.x + this.player.w / 2));
        if (d < 53 && it.type !== "puddle") {
          this.score += 30;
          this.nos = Math.min(100, this.nos + 2);
          this.registerViolation(4, "Tehlikeli yakın geçiş");
          this.addFloater("Yakın geçiş", this.player.x + 24, this.player.y + 20, "#ffd683");
        }
      }
    }

    // Player with police
    for (const p of this.police) {
      if (p.retiring || p.crashed) continue;
      if (this.player.invuln <= 0 && checkAABBHit(this.player, p, 8, 5)) {
        this.health = Math.max(0, this.health - 25);
        this.player.invuln = 60;
        this.shake = 20;
        this.flash = 14;
        this.arrest = clamp(this.arrest + 32, 0, 100);
        this.registerViolation(30, "Polis aracına çarpma");
        playSound("hit");
        this.addParticle(this.player.x + 24, this.player.y + 40, 25, "#73b7ff");
        this.addFloater("POLİSE ÇARPTIN", this.player.x + 24, this.player.y - 18, "#8dc4ff");
        if (this.health <= 0) this.endGame("crash");
        if (this.arrest >= 100) this.endGame("busted");
      }
    }

    // Achievements check
    if (this.displaySpeed >= 100 && this.controls.throttle && !this.boosting) {
      this.achievementSpeedFrames++;
      if (this.achievementSpeedFrames >= 240) this.unlockAchievement("speed");
    } else {
      this.achievementSpeedFrames = Math.max(0, this.achievementSpeedFrames - 3);
    }

    if (this.frame - this.lastViolationFrame > 0 && !this.boosting && this.player.invuln <= 0) {
      this.achievementCleanFrames++;
      if (this.achievementCleanFrames >= 1800) this.unlockAchievement("clean");
    } else {
      this.achievementCleanFrames = 0;
    }

    if (this.achievementToast) {
      this.achievementToast.time++;
      if (this.achievementToast.time >= this.achievementToast.duration) {
        this.achievementToast = null;
      }
    }

    // Particles & floaters
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.life--;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    for (const f of this.floaters) {
      f.y -= 0.65;
      f.life--;
    }
    this.floaters = this.floaters.filter((f) => f.life > 0);

    if (this.shake > 0) this.shake--;
    if (this.flash > 0) this.flash--;
    if (this.banner) {
      this.banner.time++;
      if (this.banner.time >= this.banner.duration) this.banner = null;
    }
  }
}
