import React from "react";
import { StatusInfo, THEME } from "../types";

interface OgHeaderProps {
  logoUrl: string;
  status: StatusInfo;
  isCompact?: boolean;
}

export const OgHeader: React.FC<OgHeaderProps> = ({
  logoUrl,
  status,
  isCompact = false,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {/* Sol: Oyun Logosu & Başlık */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          width={isCompact ? 56 : 72}
          height={isCompact ? 56 : 72}
          alt="Kurye 35"
          style={{
            borderRadius: 18,
            border: `2px solid ${THEME.borderCard}`,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: isCompact ? 24 : 30,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: THEME.textMain,
              }}
            >
              KURYE
            </span>
            <span
              style={{
                fontSize: isCompact ? 24 : 30,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: THEME.cyan,
              }}
            >
              35
            </span>
            <div
              style={{
                display: "flex",
                padding: "3px 8px",
                borderRadius: 6,
                backgroundColor: "rgba(0, 245, 212, 0.12)",
                border: "1px solid rgba(0, 245, 212, 0.3)",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: THEME.cyan,
              }}
            >
              İZMİR
            </div>
          </div>

          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: THEME.textDim,
              marginTop: 2,
            }}
          >
            ARCADE MOTOR KURYE SİMÜLASYONU
          </span>
        </div>
      </div>

      {/* Sağ: Vardiya Durum Bandı */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: isCompact ? "8px 16px" : "10px 20px",
          borderRadius: 9999,
          backgroundColor: status.bgGlow,
          border: `2px solid ${status.accent}`,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 9999,
            backgroundColor: status.accent,
            boxShadow: `0 0 10px ${status.accent}`,
          }}
        />
        <span
          style={{
            fontSize: isCompact ? 13 : 15,
            fontWeight: 900,
            letterSpacing: "0.1em",
            color: status.accent,
          }}
        >
          {status.title}
        </span>
      </div>
    </div>
  );
};
