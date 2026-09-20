import { VW, VH } from "./constants";
import { GameEngine } from "./game-engine";
import { GameStateEnum } from "./types";

interface TouchRecord {
  sx: number;
  sy: number;
  lastX: number;
  role: "nos" | "brake" | "throttle";
  steered: boolean;
}

export class InputManager {
  private engine: GameEngine;
  private canvas: HTMLCanvasElement;
  private touchDrives = new Map<number, TouchRecord>();
  private throttleTouchCount = 0;
  private brakeTouchCount = 0;
  private preventKeys = new Set([
    "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ",
    "a", "d", "w", "s", "A", "D", "W", "S", "Shift", "Enter", "p", "P", "Escape"
  ]);

  // Joystick modu aktif olduğunda canvas touch olayları yok sayılır
  joystickMode = false;

  // Joystick şerit kontrol durumu
  private laneLatched: "left" | "right" | null = null;
  private laneHoldFrames = 0;

  constructor(engine: GameEngine, canvas: HTMLCanvasElement) {
    this.engine = engine;
    this.canvas = canvas;
    this.initListeners();
  }

  private toGame(clientX: number, clientY: number): { x: number; y: number } {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: ((clientX - r.left) / r.width) * VW,
      y: ((clientY - r.top) / r.height) * VH,
    };
  }

  private touchRole(p: { x: number; y: number }): "nos" | "brake" | "throttle" {
    const dx = p.x - 397;
    const dy = p.y - 740;
    if (dx * dx + dy * dy < 46 * 46) return "nos";
    return p.x < VW / 2 ? "brake" : "throttle";
  }

  private releaseTouch(id: number): void {
    const rec = this.touchDrives.get(id);
    if (!rec) return;
    if (rec.role === "throttle") this.throttleTouchCount = Math.max(0, this.throttleTouchCount - 1);
    if (rec.role === "brake") this.brakeTouchCount = Math.max(0, this.brakeTouchCount - 1);
    this.engine.controls.throttle = this.throttleTouchCount > 0;
    this.engine.controls.brake = this.brakeTouchCount > 0;
    this.touchDrives.delete(id);
  }

  /**
   * Joystick girdisini tek bir atomik fonksiyonla yönetir.
   * x: -1 (sol) ~ +1 (sağ)
   * y: -1 (yukarı/gaz) ~ +1 (aşağı/fren)
   */
  handleJoystick(x: number, y: number): void {
    if (this.engine.state !== GameStateEnum.PLAYING) return;

    // 1. Dikey Eksen: Gaz & Fren
    // Yukarı çekilince (y < -0.22): Gaz açılır
    // Aşağı çekilince (y > 0.22): Fren yapılır
    // Merkezde (|y| <= 0.22): Varsayılan hızda devam edilir
    if (y < -0.22) {
      this.engine.controls.throttle = true;
      this.engine.controls.brake = false;
    } else if (y > 0.22) {
      this.engine.controls.brake = true;
      this.engine.controls.throttle = false;
    } else {
      this.engine.controls.throttle = false;
      this.engine.controls.brake = false;
    }

    // 2. Yatay Eksen: Şerit Değiştirme
    // Sağ: x > 0.30, Sol: x < -0.30
    if (x > 0.3) {
      if (this.laneLatched !== "right") {
        this.engine.moveRight();
        this.laneLatched = "right";
        this.laneHoldFrames = 0;
      } else {
        // Kullanıcı sağda basılı tutmaya devam ederse ~350ms sonra tekrar şerit değiştir
        this.laneHoldFrames++;
        if (this.laneHoldFrames > 22) {
          this.engine.moveRight();
          this.laneHoldFrames = 8;
        }
      }
    } else if (x < -0.3) {
      if (this.laneLatched !== "left") {
        this.engine.moveLeft();
        this.laneLatched = "left";
        this.laneHoldFrames = 0;
      } else {
        // Kullanıcı solda basılı tutmaya devam ederse ~350ms sonra tekrar şerit değiştir
        this.laneHoldFrames++;
        if (this.laneHoldFrames > 22) {
          this.engine.moveLeft();
          this.laneHoldFrames = 8;
        }
      }
    } else if (Math.abs(x) < 0.18) {
      // Merkeze yaklaştığında kilidi anında aç (flick hareketlerinde anında yeni yön alır)
      this.laneLatched = null;
      this.laneHoldFrames = 0;
    }
  }

  // Geriye dönük uyumluluk
  applyJoystick(x: number, y: number): void {
    this.handleJoystick(x, y);
  }

  applyJoystickLane(x: number): void {
    // handleJoystick içinde zaten işleniyor
  }

  releaseJoystick(): void {
    this.engine.controls.throttle = false;
    this.engine.controls.brake = false;
    this.laneLatched = null;
    this.laneHoldFrames = 0;
  }

  private initListeners(): void {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    this.canvas.addEventListener("touchstart", this.onTouchStart, { passive: false });
    this.canvas.addEventListener("touchmove", this.onTouchMove, { passive: false });
    this.canvas.addEventListener("touchend", this.onTouchEnd, { passive: false });
    this.canvas.addEventListener("touchcancel", this.onTouchCancel, { passive: false });
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
  }

  public destroy(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);

    this.canvas.removeEventListener("touchstart", this.onTouchStart);
    this.canvas.removeEventListener("touchmove", this.onTouchMove);
    this.canvas.removeEventListener("touchend", this.onTouchEnd);
    this.canvas.removeEventListener("touchcancel", this.onTouchCancel);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (this.preventKeys.has(e.key)) e.preventDefault();
    if (e.key === "p" || e.key === "P" || e.key === "Escape") {
      this.engine.togglePause();
      return;
    }
    if (this.engine.state === GameStateEnum.PLAYING) {
      if (!e.repeat && (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")) this.engine.moveLeft();
      if (!e.repeat && (e.key === "ArrowRight" || e.key === "d" || e.key === "D")) this.engine.moveRight();
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") this.engine.controls.throttle = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S" || e.key === " ") this.engine.controls.brake = true;
      if (e.key === "Shift" && !e.repeat) this.engine.activateNOS();
    } else if (this.engine.state === GameStateEnum.PAUSED && e.key === "Enter") {
      this.engine.togglePause();
    } else if (this.engine.state === GameStateEnum.MENU && e.key === "Enter") {
      this.engine.resetGame();
    } else if (this.engine.state === GameStateEnum.STORY && (e.key === "Enter" || e.key === " ")) {
      this.engine.beginGame();
    } else if (this.engine.state === GameStateEnum.GAMEOVER && e.key === "Enter") {
      this.engine.resetGame();
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") this.engine.controls.throttle = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S" || e.key === " ") this.engine.controls.brake = false;
  };

  private onTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    // Joystick modu aktifken canvas touch'ları sadece NOS ve pause için
    if (this.joystickMode) {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        const p = this.toGame(t.clientX, t.clientY);
        if (p.x > 402 && p.y < 154) {
          this.engine.togglePause();
        }
        // NOS butonu - sağ alt köşe
        const dx = p.x - 397;
        const dy = p.y - 740;
        if (dx * dx + dy * dy < 46 * 46) {
          this.engine.activateNOS();
        }
      }
      return;
    }

    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const p = this.toGame(t.clientX, t.clientY);
      if (p.x > 402 && p.y < 154) {
        this.engine.togglePause();
        continue;
      }
      const role = this.touchRole(p);
      this.touchDrives.set(t.identifier, { sx: p.x, sy: p.y, lastX: p.x, role, steered: false });
      if (role === "nos") {
        this.engine.activateNOS();
        continue;
      }
      if (role === "throttle") {
        this.throttleTouchCount++;
        this.engine.controls.throttle = true;
      }
      if (role === "brake") {
        this.brakeTouchCount++;
        this.engine.controls.brake = true;
      }
    }
  };

  private onTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    if (this.joystickMode || this.engine.state !== GameStateEnum.PLAYING) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const rec = this.touchDrives.get(t.identifier);
      if (!rec || rec.role === "nos") continue;
      const p = this.toGame(t.clientX, t.clientY);
      const dx = p.x - rec.lastX;
      if (Math.abs(p.x - rec.sx) > 34 && !rec.steered) {
        if (dx < 0) this.engine.moveLeft();
        else this.engine.moveRight();
        rec.steered = true;
        rec.lastX = p.x;
      }
      if (Math.abs(p.x - rec.sx) < 16) rec.steered = false;
    }
  };

  private onTouchEnd = (e: TouchEvent): void => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      this.releaseTouch(e.changedTouches[i].identifier);
    }
  };

  private onTouchCancel = (e: TouchEvent): void => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      this.releaseTouch(e.changedTouches[i].identifier);
    }
  };

  private onPointerDown = (e: PointerEvent): void => {
    if (e.pointerType === "touch") return;
    const p = this.toGame(e.clientX, e.clientY);
    if (p.x > 402 && p.y < 154) {
      this.engine.togglePause();
      return;
    }
  };
}
