export type JoystickPosition = "left" | "right";
export type ButtonSize = "small" | "medium" | "large";

const JOYSTICK_KEY = "kurye35_joystick_pos_side";
const BUTTON_SIZE_KEY = "kurye35_button_size";
const SOUND_KEY = "kurye35_sound_enabled";

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
