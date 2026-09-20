import React from "react";
import { THEME } from "../types";

interface OgFooterProps {
  host: string | null;
  ctaText?: string;
  isCompact?: boolean;
}

export const OgFooter: React.FC<OgFooterProps> = ({
  host,
  ctaText = "BU SKORU GEÇEBİLİR MİSİN?",
  isCompact = false,
}) => {
  const displayUrl = host || "kurye35.com";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: isCompact ? "14px 20px" : "18px 24px",
        borderRadius: 20,
        backgroundColor: "rgba(10, 16, 28, 0.9)",
        border: `1px solid ${THEME.borderCard}`,
      }}
    >
      {/* Sol: Meydan Okuma Çağrısı */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: isCompact ? 32 : 38,
            height: isCompact ? 32 : 38,
            borderRadius: 12,
            backgroundColor: THEME.cyan,
            color: "#050811",
            fontWeight: 900,
            fontSize: isCompact ? 16 : 20,
          }}
        >
          ⚡
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: THEME.cyan,
            }}
          >
            MEYDAN OKUMA
          </span>
          <span
            style={{
              fontSize: isCompact ? 16 : 20,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: THEME.textMain,
            }}
          >
            {ctaText}
          </span>
        </div>
      </div>

      {/* Sağ: Oyna Buton Efekti ve URL */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            fontSize: isCompact ? 14 : 16,
            fontWeight: 800,
            letterSpacing: "0.05em",
            color: THEME.textMuted,
          }}
        >
          {displayUrl}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isCompact ? "8px 16px" : "10px 20px",
            borderRadius: 9999,
            backgroundColor: THEME.cyan,
            color: "#050811",
            fontSize: isCompact ? 12 : 14,
            fontWeight: 900,
            letterSpacing: "0.08em",
          }}
        >
          HEMEN OYNA →
        </div>
      </div>
    </div>
  );
};
