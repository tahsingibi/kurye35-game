import React from "react";
import { OgImageProps, getRank, getStatus, THEME } from "../types";
import { OgBackground } from "../og-background";
import { OgGameScene } from "../og-game-scene";
import { OgHeader } from "../og-header";
import { OgRankBadge } from "../og-rank-badge";
import { OgStatCard } from "../og-stat-card";
import { OgFooter } from "../og-footer";

export const OgXCard: React.FC<OgImageProps> = ({
  score,
  deliveries,
  reason,
  violations = 0,
  highScore = 0,
  logoUrl,
  host,
}) => {
  const rank = getRank(score, deliveries);
  const status = getStatus(reason);
  const isNewRecord = score > 0 && score >= highScore;

  return (
    <div
      style={{
        display: "flex",
        width: 1200,
        height: 630,
        position: "relative",
        overflow: "hidden",
        backgroundColor: THEME.bgDark,
        padding: "32px 40px",
        flexDirection: "row",
        gap: 28,
        fontFamily: "sans-serif",
      }}
    >
      <OgBackground accentColor={status.accent} glowColor={status.bgGlow} />

      {/* Sol Panel: Skor ve İstatistik HUD (690px) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <OgHeader logoUrl={logoUrl} status={status} isCompact />

        {/* Skor Hero */}
        <div style={{ display: "flex", flexDirection: "column", margin: "6px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.22em", color: THEME.cyan }}>
              VARDİYA SKORU
            </span>
            {isNewRecord && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: "0.14em",
                  padding: "2px 8px",
                  borderRadius: 4,
                  backgroundColor: THEME.amber,
                  color: "#050811",
                }}
              >
                ★ YENİ REKOR!
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 2 }}>
            <span
              style={{
                fontSize: 84,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.05em",
                color: "#FFFFFF",
                textShadow: "0 0 40px rgba(0, 245, 212, 0.4)",
              }}
            >
              {score.toLocaleString("tr-TR")}
            </span>
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: "0.1em", color: THEME.cyan }}>
              PUAN
            </span>
          </div>
        </div>

        {/* Metrik Kartları */}
        <div style={{ display: "flex", gap: 12 }}>
          <OgStatCard
            label="TESLİMAT"
            value={deliveries}
            unit="PAKET"
            accentColor={THEME.amber}
            icon="package"
            subtext="İzmir içi başarılı teslim"
          />
          <OgStatCard
            label="SÜRÜŞ RAPORU"
            value={violations === 0 ? "KUSURSUZ" : `${violations} İHLAL`}
            accentColor={violations === 0 ? THEME.cyan : THEME.red}
            icon="shield"
            subtext={violations === 0 ? "Temiz sürüş primi" : "Trafik ihlali"}
          />
        </div>

        <OgFooter host={host} isCompact />
      </div>

      {/* Sağ Panel: Oyun Sahnesi & Üzerinde Rank Rozeti (420px) */}
      <div
        style={{
          display: "flex",
          width: 420,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OgGameScene width={420} height={566} reason={reason} />

        {/* Sahne Üstünde Parlayan Rank Rozeti */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 20,
            right: 20,
          }}
        >
          <OgRankBadge rank={rank} size="md" />
        </div>
      </div>
    </div>
  );
};
