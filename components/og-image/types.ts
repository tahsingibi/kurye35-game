export type ShareFormat = "x" | "story" | "instagram";
export type EndReason = "crash" | "busted" | "shift_end";

export interface OgImageProps {
  score: number;
  deliveries: number;
  reason: EndReason;
  violations?: number;
  highScore?: number;
  bestDeliveries?: number;
  logoUrl: string;
  host: string | null;
}

export interface RankInfo {
  tier: "S+" | "S" | "A" | "B" | "C";
  title: string;
  badgeColor: string;
  glowColor: string;
  textColor: string;
}

export interface StatusInfo {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  secondary: string;
  bgGlow: string;
}

export const THEME = {
  bgDark: "#050811",
  bgPanel: "#090E1A",
  bgCard: "#0E1626",
  borderCard: "rgba(30, 58, 95, 0.6)",
  borderActive: "rgba(0, 245, 212, 0.4)",
  textMain: "#FFFFFF",
  textMuted: "#8FA3BF",
  textDim: "#546882",
  cyan: "#00F5D4",
  blue: "#00B4D8",
  amber: "#FFB703",
  orange: "#FB8500",
  red: "#FF0054",
  purple: "#7209B7",
} as const;

export function getRank(score: number, deliveries: number): RankInfo {
  if (score >= 40000 || deliveries >= 15) {
    return {
      tier: "S+",
      title: "EFSANE KURYE",
      badgeColor: "#FFD166",
      glowColor: "rgba(255, 209, 102, 0.4)",
      textColor: "#050811",
    };
  }
  if (score >= 25000 || deliveries >= 10) {
    return {
      tier: "S",
      title: "USTA KURYE",
      badgeColor: "#00F5D4",
      glowColor: "rgba(0, 245, 212, 0.35)",
      textColor: "#050811",
    };
  }
  if (score >= 12000 || deliveries >= 6) {
    return {
      tier: "A",
      title: "SERİ KURYE",
      badgeColor: "#00B4D8",
      glowColor: "rgba(0, 180, 216, 0.35)",
      textColor: "#050811",
    };
  }
  if (score >= 5000 || deliveries >= 3) {
    return {
      tier: "B",
      title: "HIZLI KURYE",
      badgeColor: "#9D4EDD",
      glowColor: "rgba(157, 78, 221, 0.3)",
      textColor: "#FFFFFF",
    };
  }
  return {
    tier: "C",
    title: "ÇAYLAK KURYE",
    badgeColor: "#4A5568",
    glowColor: "rgba(74, 85, 104, 0.2)",
    textColor: "#FFFFFF",
  };
}

export function getStatus(reason: EndReason): StatusInfo {
  if (reason === "busted") {
    return {
      eyebrow: "POLİS RAPORU · CEZA KESİLDİ",
      title: "YAKALANDIN",
      subtitle: "İzmir Emniyeti vardiyanı Kordon'da sonlandırdı.",
      accent: THEME.red,
      secondary: THEME.blue,
      bgGlow: "rgba(255, 0, 84, 0.2)",
    };
  }
  if (reason === "crash") {
    return {
      eyebrow: "KAZA RAPORU · HASAR ALINDI",
      title: "KAZA YAPILDI",
      subtitle: "İzmir trafiği affetmedi, motor pert oldu.",
      accent: THEME.orange,
      secondary: THEME.amber,
      bgGlow: "rgba(251, 133, 0, 0.2)",
    };
  }
  return {
    eyebrow: "VARDİYA RAPORU · BAŞARILI",
    title: "VARDİYA TAMAMLANDI",
    subtitle: "Kordon'dan Karşıyaka'ya tüm siparişler teslim edildi.",
    accent: THEME.cyan,
    secondary: THEME.amber,
    bgGlow: "rgba(0, 245, 212, 0.2)",
  };
}
