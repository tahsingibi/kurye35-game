export type JoystickPosition = "left" | "right";

const JOYSTICK_KEY = "kurye35_joystick_pos_side";

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
