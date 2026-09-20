import React from "react";
import { THEME } from "../types";

interface OgBackgroundProps {
  accentColor: string;
  glowColor: string;
}

export const OgBackground: React.FC<OgBackgroundProps> = ({
  accentColor,
  glowColor,
}) => {
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: THEME.bgDark,
        overflow: "hidden",
      }}
    >
      {/* Sol Üst Parlama (Radyal CSS Gradient) */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: -200,
          left: -200,
          width: 900,
          height: 700,
          borderRadius: 9999,
          background: glowColor,
          opacity: 0.35,
          filter: "blur(120px)",
        }}
      />

      {/* Sağ Alt Aksan Parlaması */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: -200,
          right: -200,
          width: 800,
          height: 600,
          borderRadius: 9999,
          background: accentColor,
          opacity: 0.18,
          filter: "blur(120px)",
        }}
      />

      {/* İnce Grid Deseni (CSS ile) */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.06,
          backgroundImage:
            "linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Köşe HUD İşaretleri */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 20,
          left: 24,
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: "0.18em",
          color: "rgba(255, 255, 255, 0.18)",
        }}
      >
        [+] IZM-35 // HUD
      </div>

      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 20,
          right: 24,
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: "0.18em",
          color: "rgba(255, 255, 255, 0.18)",
        }}
      >
        SYS.VER 3.5 [+]
      </div>
    </div>
  );
};
