"use client";

import React, { useRef, useState, useCallback } from "react";

export interface JoystickOutput {
  x: number; // -1 (sol) ~ 1 (sağ)
  y: number; // -1 (yukarı/gaz) ~ 1 (aşağı/fren)
}

interface VirtualJoystickProps {
  onMove: (out: JoystickOutput) => void;
  onRelease: () => void;
  visible: boolean;
  position?: "left" | "right";
}

const OUTER_R = 56;
const INNER_R = 24;
const MAX_DIST = OUTER_R - INNER_R;

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  onRelease,
  visible,
  position = "left",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const activePointerId = useRef<number | null>(null);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clampedDist = Math.min(dist, MAX_DIST);
      const angle = Math.atan2(dy, dx);

      const kx = Math.cos(angle) * clampedDist;
      const ky = Math.sin(angle) * clampedDist;

      setKnob({ x: kx, y: ky });
      onMove({
        x: Number((kx / MAX_DIST).toFixed(3)),
        y: Number((ky / MAX_DIST).toFixed(3)),
      });
    },
    [onMove]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    activePointerId.current = e.pointerId;
    setIsActive(true);
    updatePosition(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();
    updatePosition(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    activePointerId.current = null;
    setIsActive(false);
    setKnob({ x: 0, y: 0 });
    onRelease();
  };

  if (!visible) return null;
  const isLeft = position === "left";

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: "fixed",
        left: isLeft ? "clamp(20px, 6vw, 44px)" : "auto",
        right: !isLeft ? "clamp(20px, 6vw, 44px)" : "auto",
        bottom: "clamp(24px, 6vh, 48px)",
        width: OUTER_R * 2,
        height: OUTER_R * 2,
        zIndex: 45,
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        cursor: "grab",
      }}
    >
      <div style={{ position: "absolute", top: -24, left: -24, right: -24, bottom: -24, pointerEvents: "auto" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          backgroundColor: isActive ? "rgba(10, 25, 45, 0.85)" : "rgba(8, 18, 32, 0.65)",
          border: isActive ? "2.5px solid #00F5D4" : "2px solid rgba(0, 245, 212, 0.45)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: isActive
            ? "0 0 24px rgba(0, 245, 212, 0.4), inset 0 0 12px rgba(0, 245, 212, 0.2)"
            : "0 8px 32px rgba(0, 0, 0, 0.6)",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      />
      <svg style={{ position: "absolute", inset: 0, opacity: isActive ? 0.6 : 0.25 }} width={OUTER_R * 2} height={OUTER_R * 2}>
        <line x1={OUTER_R} y1={10} x2={OUTER_R} y2={OUTER_R * 2 - 10} stroke="#00F5D4" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1={10} y1={OUTER_R} x2={OUTER_R * 2 - 10} y2={OUTER_R} stroke="#00F5D4" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: OUTER_R + knob.x - INNER_R,
          top: OUTER_R + knob.y - INNER_R,
          width: INNER_R * 2,
          height: INNER_R * 2,
          borderRadius: "50%",
          background: isActive
            ? "radial-gradient(circle at 35% 35%, #5EEAD4 0%, #00F5D4 45%, #0D9488 100%)"
            : "radial-gradient(circle at 35% 35%, #2DD4BF 0%, #0F766E 100%)",
          boxShadow: isActive ? "0 0 20px rgba(0, 245, 212, 0.8)" : "0 2px 10px rgba(0, 0, 0, 0.5)",
          border: "2px solid rgba(255, 255, 255, 0.8)",
          transform: isActive ? "scale(1.08)" : "scale(1)",
          transition: isActive ? "transform 0.1s" : "left 0.12s ease-out, top 0.12s ease-out, transform 0.1s",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
