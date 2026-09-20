import React from "react";
import { OgImageProps, getRank, getStatus, THEME } from "../types";
import { OgBackground } from "../og-background";
import { OgGameScene } from "../og-game-scene";
import { OgHeader } from "../og-header";
import { OgRankBadge } from "../og-rank-badge";
import { OgStatCard } from "../og-stat-card";
import { OgFooter } from "../og-footer";

export const OgStoryCard: React.FC<OgImageProps> = ({
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
        height: 1920,
        position: "relative",
        overflow: "hidden",
        backgroundColor: THEME.bgDark,
        padding: "140px 54px 120px",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      <OgBackground accentColor={status.accent} glowColor={status.bgGlow} />

      {/* Üst Başlık & Durum */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <OgHeader logoUrl={logoUrl} status={status} />
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.04em", color: THEME.textMuted }}>
          {status.subtitle}
        </span>
      </div>

      {/* Orta Alan: Oyun Sahnesi & Üzerine Binen Rank Rozeti */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: 640,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OgGameScene width={972} height={640} reason={reason} />

        {/* Üstte Parlayan Rank Rozeti */}
        <div style={{ display: "flex", position: "absolute", top: 24, right: 28 }}>
          <OgRankBadge rank={rank} size="lg" />
        </div>
      </div>

      {/* Skor Hero Kutusu */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "28px 36px",
          borderRadius: 30,
          backgroundColor: "rgba(14, 22, 38, 0.9)",
          border: `2px solid ${THEME.borderCard}`,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: "0.22em", color: THEME.cyan }}>
            VARDİYA SKORU
          </span>
          {isNewRecord && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.14em",
                padding: "3px 10px",
                borderRadius: 6,
                backgroundColor: THEME.amber,
                color: "#050811",
              }}
            >
              ★ YENİ REKOR!
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 8 }}>
          <span
            style={{
              fontSize: 108,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.05em",
              color: "#FFFFFF",
              textShadow: "0 0 45px rgba(0, 245, 212, 0.4)",
            }}
          >
            {score.toLocaleString("tr-TR")}
          </span>
          <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: "0.1em", color: THEME.cyan }}>
            PUAN
          </span>
        </div>
      </div>

      {/* İstatistik Metrikleri */}
      <div style={{ display: "flex", gap: 16 }}>
        <OgStatCard
          label="TESLİMAT"
          value={deliveries}
          unit="PAKET"
          accentColor={THEME.amber}
          icon="package"
          subtext="Başarılı sipariş"
        />
        <OgStatCard
          label="SÜRÜŞ RAPORU"
          value={violations === 0 ? "KUSURSUZ" : `${violations} İHLAL`}
          accentColor={violations === 0 ? THEME.cyan : THEME.red}
          icon="shield"
          subtext={violations === 0 ? "Temiz sürüş primi" : "Trafik cezası"}
        />
      </div>

      {/* Alt Meydan Okuma */}
      <OgFooter host={host} ctaText="BU SKORU GEÇEBİLİR MİSİN?" />
    </div>
  );
};
