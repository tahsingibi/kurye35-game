import React from "react";
import { EndReason } from "../types";

interface OgGameSceneProps {
  width: number;
  height: number;
  reason: EndReason;
}

export const OgGameScene: React.FC<OgGameSceneProps> = ({
  width,
  height,
  reason,
}) => {
  const isBusted = reason === "busted";
  const isCrash = reason === "crash";

  return (
    <div
      style={{
        display: "flex",
        width,
        height,
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        border: "2px solid rgba(0, 245, 212, 0.3)",
        backgroundColor: "#060A14",
      }}
    >
      <svg
        viewBox="0 0 400 500"
        width={width}
        height={height}
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#040711" />
            <stop offset="50%" stopColor="#0B1A30" />
            <stop offset="100%" stopColor="#162D4A" />
          </linearGradient>
          <linearGradient id="road-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B1017" />
            <stop offset="100%" stopColor="#1B232E" />
          </linearGradient>
          <linearGradient id="nos-flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="60%" stopColor="#00B4D8" />
            <stop offset="100%" stopColor="#0B1017" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="headlight" cx="50%" cy="100%" r="90%">
            <stop offset="0%" stopColor="#FFF5D2" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFF5D2" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Gökyüzü */}
        <rect width="400" height="230" fill="url(#sky-grad)" />

        {/* Yıldızlar */}
        <circle cx="50" cy="30" r="1" fill="#FFFFFF" opacity="0.6" />
        <circle cx="140" cy="55" r="0.8" fill="#FFFFFF" opacity="0.5" />
        <circle cx="260" cy="25" r="1.2" fill="#FFFFFF" opacity="0.7" />
        <circle cx="310" cy="70" r="0.7" fill="#FFFFFF" opacity="0.4" />
        <circle cx="370" cy="40" r="1" fill="#FFFFFF" opacity="0.55" />
        <circle cx="190" cy="15" r="0.9" fill="#FFFFFF" opacity="0.65" />

        {/* Uzak Şehir Silueti / Bina Blokları */}
        <rect x="0" y="150" width="400" height="60" fill="#081220" />
        <rect x="15" y="130" width="22" height="80" rx="2" fill="#0C1A2C" />
        <rect x="42" y="140" width="18" height="70" rx="1" fill="#0E1E30" />
        <rect x="68" y="125" width="16" height="85" rx="1" fill="#0A1624" />
        <rect x="300" y="135" width="20" height="75" rx="1" fill="#0C1A2C" />
        <rect x="325" y="128" width="24" height="82" rx="2" fill="#0E1E30" />
        <rect x="360" y="142" width="18" height="68" rx="1" fill="#0A1624" />

        {/* İzmir Körfezi & Sahil Işıkları */}
        <rect y="175" width="400" height="35" fill="#071322" />
        <ellipse cx="200" cy="192" rx="190" ry="12" fill="#0C2540" opacity="0.6" />
        <circle cx="80" cy="180" r="1.5" fill="#FFD166" opacity="0.8" />
        <circle cx="120" cy="182" r="2" fill="#00F5D4" opacity="0.9" />
        <circle cx="160" cy="181" r="1.5" fill="#FFB703" opacity="0.7" />
        <circle cx="230" cy="183" r="1.5" fill="#FFD166" opacity="0.6" />
        <circle cx="280" cy="182" r="2" fill="#FF0054" opacity="0.8" />
        <circle cx="340" cy="180" r="1.5" fill="#00F5D4" opacity="0.8" />

        {/* Bina Pencereleri (Sarı / Cyan / Turuncu ışıklar) */}
        <rect x="19" y="135" width="4" height="3" fill="#FFD166" opacity="0.7" />
        <rect x="26" y="142" width="4" height="3" fill="#00F5D4" opacity="0.5" />
        <rect x="19" y="148" width="4" height="3" fill="#FB8500" opacity="0.6" />
        <rect x="305" y="140" width="4" height="3" fill="#FFD166" opacity="0.6" />
        <rect x="312" y="148" width="4" height="3" fill="#00B4D8" opacity="0.5" />
        <rect x="332" y="135" width="4" height="3" fill="#FFD166" opacity="0.7" />
        <rect x="339" y="144" width="4" height="3" fill="#FB8500" opacity="0.5" />

        {/* İzmir Konak Saat Kulesi Silüeti */}
        <g transform="translate(60, 85) scale(0.9)">
          <rect x="8" y="70" width="34" height="25" fill="#131B26" rx="2" />
          <rect x="13" y="32" width="24" height="38" fill="#182433" rx="1" />
          <rect x="16" y="16" width="18" height="16" fill="#1F2E40" rx="1" />
          <circle cx="25" cy="24" r="5" fill="#FFEAA7" opacity="0.85" />
          <polygon points="15,16 25,2 35,16" fill="#25374C" />
          <line x1="25" y1="2" x2="25" y2="-4" stroke="#FFD166" strokeWidth="1.5" />
        </g>

        {/* Kordon Palmiyeleri */}
        <path d="M330,195 Q335,160 340,140" stroke="#121D28" strokeWidth="3" fill="none" />
        <ellipse cx="330" cy="138" rx="16" ry="6" fill="#172736" transform="rotate(-20 330 138)" />
        <ellipse cx="350" cy="138" rx="16" ry="6" fill="#172736" transform="rotate(20 350 138)" />

        {/* Perspektif Yol */}
        <polygon points="155,210 245,210 380,500 20,500" fill="url(#road-grad)" />
        {/* Yol Kenar Bordürleri */}
        <polygon points="152,210 156,210 24,500 16,500" fill="#FF0054" opacity="0.7" />
        <polygon points="244,210 248,210 384,500 376,500" fill="#FF0054" opacity="0.7" />

        {/* Kesikli Orta Şeritler */}
        <polygon points="198,215 202,215 203,240 197,240" fill="#FFEAA7" opacity="0.8" />
        <polygon points="197,255 203,255 204,295 196,295" fill="#FFEAA7" opacity="0.85" />
        <polygon points="196,315 204,315 206,375 194,375" fill="#FFEAA7" opacity="0.9" />
        <polygon points="194,405 206,405 208,485 192,485" fill="#FFEAA7" />

        {/* Far Işığı Yayılımı */}
        <polygon points="170,390 230,390 280,260 120,260" fill="url(#headlight)" />

        {/* OYUNCU: KURYE 35 MOTORU */}
        <g transform="translate(172, 340)">
          {/* NOS Ateşi / Egzoz */}
          {!isCrash && (
            <polygon points="24,62 10,105 46,105 32,62" fill="url(#nos-flame)" opacity="0.85" />
          )}

          {/* Kaza Kıvılcımları */}
          {isCrash && (
            <g>
              <circle cx="28" cy="40" r="3" fill="#FFB703" />
              <line x1="28" y1="40" x2="52" y2="20" stroke="#FF0054" strokeWidth="2" />
              <line x1="28" y1="40" x2="4" y2="18" stroke="#FB8500" strokeWidth="2" />
              <circle cx="48" cy="24" r="2" fill="#FF0054" opacity="0.7" />
              <circle cx="8" cy="22" r="1.5" fill="#FFB703" opacity="0.6" />
            </g>
          )}

          {/* Motor Gölge */}
          <ellipse cx="28" cy="80" rx="28" ry="10" fill="#000000" opacity="0.5" />

          {/* Motor Arka Tekerlek */}
          <rect x="20" y="52" width="16" height="36" rx="6" fill="#07090C" />
          <rect x="23" y="55" width="10" height="30" rx="4" fill="#2C343E" />

          {/* Motor Gövdesi */}
          <path d="M16,28 Q28,16 40,28 L44,64 Q28,74 12,64 Z" fill="#131B24" />

          {/* Kırmızı Kurye Teslimat Çantası */}
          <rect x="5" y="30" width="46" height="28" rx="6" fill="#D92E38" />
          <rect x="5" y="28" width="46" height="6" rx="2" fill="#FB6535" />
          {/* Çanta üstü şerit */}
          <rect x="8" y="34" width="40" height="3" fill="#FF9B67" />
          {/* "35" yerine beyaz blok */}
          <rect x="20" y="40" width="16" height="12" rx="3" fill="#FFFFFF" />
          <rect x="22" y="43" width="5" height="6" rx="1" fill="#D92E38" />
          <rect x="29" y="43" width="5" height="6" rx="1" fill="#D92E38" />

          {/* Sürücü Kaskı (Kırmızı Kask & Vizör) */}
          <circle cx="28" cy="18" r="13" fill="#E43C32" />
          <rect x="16" y="17" width="24" height="6" rx="2" fill="#0A0E13" />

          {/* Aynalar */}
          <line x1="14" y1="28" x2="4" y2="22" stroke="#6F7780" strokeWidth="2" />
          <line x1="42" y1="28" x2="52" y2="22" stroke="#6F7780" strokeWidth="2" />
          <circle cx="3" cy="21" r="4" fill="#111820" />
          <circle cx="53" cy="21" r="4" fill="#111820" />

          {/* Arka Neon Stop Lambası */}
          <rect x="21" y="62" width="14" height="5" rx="2" fill="#FF314C" />

          {/* Plaka */}
          <rect x="19" y="69" width="18" height="6" rx="1" fill="#EEF2F4" />
          <rect x="21" y="70" width="5" height="4" rx="1" fill="#14181C" />
          <rect x="28" y="70" width="7" height="4" rx="1" fill="#14181C" />
        </g>

        {/* POLİS TAKİBİ (Busted Durumunda) */}
        {isBusted && (
          <g transform="translate(260, 390)">
            {/* Polis gölge */}
            <ellipse cx="32" cy="82" rx="30" ry="8" fill="#000000" opacity="0.4" />
            {/* Polis aracı gövde */}
            <rect x="0" y="10" width="65" height="68" rx="8" fill="#0B1522" />
            <rect x="5" y="0" width="55" height="16" rx="4" fill="#0E1D32" />
            {/* Tepe lambaları */}
            <circle cx="16" cy="8" r="7" fill="#FF0054" opacity="0.9" />
            <circle cx="49" cy="8" r="7" fill="#00B4D8" opacity="0.9" />
            {/* Siren glow */}
            <circle cx="16" cy="8" r="14" fill="#FF0054" opacity="0.15" />
            <circle cx="49" cy="8" r="14" fill="#00B4D8" opacity="0.15" />
            {/* Polis şerit */}
            <rect x="4" y="40" width="57" height="6" rx="2" fill="#00B4D8" opacity="0.6" />
            {/* Arka farlar */}
            <rect x="4" y="68" width="10" height="4" rx="1" fill="#FF273A" />
            <rect x="51" y="68" width="10" height="4" rx="1" fill="#FF273A" />
          </g>
        )}
      </svg>

      {/* Sahne Üzerinde HUD Etiketi */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 12,
          left: 14,
          padding: "4px 10px",
          borderRadius: 8,
          backgroundColor: "rgba(6, 10, 20, 0.75)",
          border: "1px solid rgba(0, 245, 212, 0.4)",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "0.14em",
          color: "#00F5D4",
        }}
      >
        LIVE · İZMİR VARDİYASI
      </div>
    </div>
  );
};
