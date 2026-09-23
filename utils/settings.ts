export type JoystickPosition = "left" | "right";
export type ButtonSize = "small" | "medium" | "large";
export type VehicleType = "motor" | "car";
export interface SoundSettings {
  master: boolean;
  vehicle: boolean;
  ambience: boolean;
  effects: boolean;
}

const JOYSTICK_KEY = "kurye35_joystick_pos_side";
const BUTTON_SIZE_KEY = "kurye35_button_size";
const SOUND_KEY = "kurye35_sound_enabled";
const SOUND_SETTINGS_KEY = "kurye35_sound_settings";
const VEHICLE_KEY = "kurye35_selected_vehicle";

export function getJoystickPosition(): JoystickPosition {
  if (typeof window === "undefined") return "left";
  try {
    const saved = localStorage.getItem(JOYSTICK_KEY);
    return saved === "right" ? "right" : "left";
  } catch {
    return "left";
  }
}

export function setJoystickPosition(pos: JoystickPosition): void {
  try {
    localStorage.setItem(JOYSTICK_KEY, pos);
  } catch {}
}

export function getButtonSize(): ButtonSize {
  if (typeof window === "undefined") return "medium";
  try {
    const saved = localStorage.getItem(BUTTON_SIZE_KEY);
    if (saved === "small" || saved === "medium" || saved === "large") {
      return saved;
    }
    return "medium";
  } catch {
    return "medium";
  }
}

export function setButtonSize(size: ButtonSize): void {
  try {
    localStorage.setItem(BUTTON_SIZE_KEY, size);
  } catch {}
}

export function getSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const saved = localStorage.getItem(SOUND_KEY);
    return saved === null ? true : saved === "true";
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_KEY, String(enabled));
  } catch {}
}

const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  master: true,
  vehicle: true,
  ambience: true,
  effects: true,
};

export function getSoundSettings(): SoundSettings {
  if (typeof window === "undefined") return DEFAULT_SOUND_SETTINGS;
  try {
    const saved = localStorage.getItem(SOUND_SETTINGS_KEY);
    if (!saved) {
      return { ...DEFAULT_SOUND_SETTINGS, master: getSoundEnabled() };
    }
    const parsed = JSON.parse(saved) as Partial<SoundSettings>;
    return {
      master: parsed.master !== false,
      vehicle: parsed.vehicle !== false,
      ambience: parsed.ambience !== false,
      effects: parsed.effects !== false,
    };
  } catch {
    return { ...DEFAULT_SOUND_SETTINGS, master: getSoundEnabled() };
  }
}

export function setSoundSettings(settings: SoundSettings): void {
  try {
    localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(settings));
    localStorage.setItem(SOUND_KEY, String(settings.master));
  } catch {}
}

export function getSelectedVehicle(): VehicleType {
  if (typeof window === "undefined") return "motor";
  try {
    const saved = localStorage.getItem(VEHICLE_KEY);
    return saved === "car" ? "car" : "motor";
  } catch {
    return "motor";
  }
}

export function setSelectedVehicle(vehicle: VehicleType): void {
  try {
    localStorage.setItem(VEHICLE_KEY, vehicle);
  } catch {}
}
