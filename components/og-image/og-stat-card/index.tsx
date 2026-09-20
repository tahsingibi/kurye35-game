import React from "react";
import { THEME } from "../types";

interface OgStatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  accentColor?: string;
  highlight?: boolean;
  subtext?: string;
  icon?: "score" | "package" | "shield" | "trophy";
}

function renderIcon(type?: string, color = "#FFFFFF") {
  if (type === "package") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
        <path d="M16.5 9.4 7.55 4.24a1.8 1.8 0 0 0-1.8 0L3.5 5.5a1.8 1.8 0 0 0-.9 1.56v9.88a1.8 1.8 0 0 0 .9 1.56l2.25 1.26a1.8 1.8 0 0 0 1.8 0l8.95-5.16a1.8 1.8 0 0 0 .9-1.56V11a1.8 1.8 0 0 0-.9-1.6Z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" y1="22" x2="12" y2="12" />
      </svg>
    );
  }
  if (type === "trophy") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
        <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 6 12 12 16 14" />
    </svg>
  );
}

export const OgStatCard: React.FC<OgStatCardProps> = ({
  label,
  value,
  unit,
  accentColor = THEME.cyan,
  highlight = false,
  subtext,
  icon,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderRadius: 20,
        backgroundColor: highlight ? "rgba(14, 22, 38, 0.95)" : "rgba(10, 16, 28, 0.8)",
        border: `2px solid ${highlight ? accentColor : THEME.borderCard}`,
        position: "relative",
      }}
    >
      {/* Üst Satır: Etiket ve İkon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: THEME.textMuted,
          }}
        >
          {label}
        </span>
        {icon && renderIcon(icon, accentColor)}
      </div>

      {/* Ana Değer */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          marginTop: 6,
        }}
      >
        <span
          style={{
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: THEME.textMain,
            lineHeight: 1,
          }}
        >
          {typeof value === "number" ? value.toLocaleString("tr-TR") : value}
        </span>
        {unit && (
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: accentColor,
              letterSpacing: "0.08em",
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Alt Bilgi (Subtext) */}
      {subtext && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: THEME.textDim,
            marginTop: 4,
          }}
        >
          {subtext}
        </span>
      )}
    </div>
  );
};
