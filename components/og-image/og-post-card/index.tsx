import React from "react";
import { OgImageProps, getRank, getStatus, THEME } from "../types";
import { OgBackground } from "../og-background";
import { OgGameScene } from "../og-game-scene";
import { OgHeader } from "../og-header";
import { OgRankBadge } from "../og-rank-badge";
import { OgStatCard } from "../og-stat-card";
import { OgFooter } from "../og-footer";

export const OgPostCard: React.FC<OgImageProps> = ({
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
        width: 1080,
        height: 1350,
        position: "relative",
        overflow: "hidden",
        backgroundColor: THEME.bgDark,
        padding: "48px 48px",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      <OgBackground accentColor={status.accent} glowColor={status.bgGlow} />

      {/* Üst Başlık & Durum */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <OgHeader logoUrl={logoUrl} status={status} />
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.04em", color: THEME.textMuted }}>
          {status.subtitle}
        </span>
      </div>

      {/* Orta Alan: Oyun Sahnesi ve Skor Yan Yana */}
      <div style={{ display: "flex", gap: 20, width: "100%", height: 500 }}>
        {/* Sol: Oyun Sahnesi */}
        <div style={{ display: "flex", flex: 1, position: "relative" }}>
          <OgGameScene width={480} height={500} reason={reason} />
          <div style={{ display: "flex", position: "absolute", top: 16, right: 16 }}>
            <OgRankBadge rank={rank} size="md" />
          </div>
        </div>

        {/* Sağ: Skor Hero & Metrikler */}
        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "28px 30px",
              borderRadius: 24,
              backgroundColor: "rgba(14, 22, 38, 0.9)",
              border: `2px solid ${THEME.borderCard}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: "0.22em", color: THEME.cyan }}>
                VARDİYA SKORU
              </span>
              {isNewRecord && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    padding: "2px 6px",
                    borderRadius: 4,
                    backgroundColor: THEME.amber,
                    color: "#050811",
                  }}
                >
                  ★ REKOR!
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 4 }}>
              <span
                style={{
                  fontSize: 70,
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  color: "#FFFFFF",
                  textShadow: "0 0 35px rgba(0, 245, 212, 0.35)",
                }}
              >
                {score.toLocaleString("tr-TR")}
              </span>
              <span style={{ fontSize: 18, fontWeight: 900, color: THEME.cyan }}>PUAN</span>
            </div>
          </div>

          <OgStatCard
            label="TESLİMAT"
            value={deliveries}
            unit="PAKET"
            accentColor={THEME.amber}
            icon="package"
            subtext="İzmir içi teslim"
          />

          <OgStatCard
            label="SÜRÜŞ RAPORU"
            value={violations === 0 ? "KUSURSUZ" : `${violations} İHLAL`}
            accentColor={violations === 0 ? THEME.cyan : THEME.red}
            icon="shield"
            subtext={violations === 0 ? "Temiz sürüş primi" : "Trafik cezası"}
          />
        </div>
      </div>

      {/* Alt Meydan Okuma */}
      <OgFooter host={host} />
    </div>
  );
};
