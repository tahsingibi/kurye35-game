import React from "react";
import { RankInfo } from "../types";

interface OgRankBadgeProps {
  rank: RankInfo;
  size?: "md" | "lg";
}

export const OgRankBadge: React.FC<OgRankBadgeProps> = ({
  rank,
  size = "md",
}) => {
  const isLg = size === "lg";
  const boxWidth = isLg ? 160 : 120;
  const boxHeight = isLg ? 160 : 120;
  const tierFontSize = isLg ? 72 : 54;
  const titleFontSize = isLg ? 16 : 12;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Parlayan Çerçeve Kutusu */}
      <div
        style={{
          display: "flex",
          width: boxWidth,
          height: boxHeight,
          borderRadius: 28,
          backgroundColor: "#080E1A",
          border: `3px solid ${rank.badgeColor}`,
          boxShadow: `0 0 30px ${rank.glowColor}`,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Köşe Vurguları */}
        <div
          style={{
            position: "absolute",
            top: -2,
            left: 12,
            right: 12,
            height: 4,
            backgroundColor: rank.badgeColor,
            borderRadius: 9999,
          }}
        />

        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: rank.badgeColor,
            marginBottom: -4,
          }}
        >
          RANK
        </span>

        <span
          style={{
            fontSize: tierFontSize,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "#FFFFFF",
            textShadow: `0 0 20px ${rank.badgeColor}`,
          }}
        >
          {rank.tier}
        </span>
      </div>

      {/* Rütbe Başlık Şeridi */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
          padding: "6px 16px",
          borderRadius: 9999,
          backgroundColor: rank.badgeColor,
          color: rank.textColor,
          fontSize: titleFontSize,
          fontWeight: 900,
          letterSpacing: "0.14em",
          boxShadow: `0 0 16px ${rank.glowColor}`,
        }}
      >
        {rank.title}
      </div>
    </div>
  );
};
