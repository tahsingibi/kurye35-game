import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import {
  OgXCard,
  OgStoryCard,
  OgPostCard,
  ShareFormat,
  EndReason,
} from "@/components/og-image";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function safeNumber(value: string | null, fallback = 0): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(Math.floor(n), 99_999_999));
}

function normalizeBaseUrl(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    return url.origin;
  } catch {
    return null;
  }
}

function displayHost(value?: string): string | null {
  const base = normalizeBaseUrl(value);
  if (!base) return null;

  try {
    const host = new URL(base).host;
    if (
      host.startsWith("localhost") ||
      host.startsWith("127.0.0.1") ||
      host.startsWith("0.0.0.0")
    ) {
      return null;
    }
    return host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function parseFormat(raw: string | null): ShareFormat {
  if (raw === "story") return "story";
  if (raw === "instagram") return "instagram";
  return "x";
}

function parseReason(raw: string | null): EndReason {
  if (raw === "busted") return "busted";
  if (raw === "shift_end") return "shift_end";
  return "crash";
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = url.searchParams;

    const score = safeNumber(params.get("score"));
    const deliveries = safeNumber(params.get("deliveries"));
    const violations = safeNumber(params.get("violations"));
    const highScore = safeNumber(params.get("highScore") || params.get("high_score"));
    const reason = parseReason(params.get("reason"));
    const format = parseFormat(params.get("format"));

    const appBase = normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL);
    const assetBase = appBase || url.origin;
    const logoUrl = new URL("/logo.png", assetBase).toString();
    const host = displayHost(process.env.NEXT_PUBLIC_APP_URL);

    const commonProps = {
      score,
      deliveries,
      reason,
      violations,
      highScore,
      logoUrl,
      host,
    };

    if (format === "story") {
      return new ImageResponse(<OgStoryCard {...commonProps} />, {
        width: 1080,
        height: 1920,
      });
    }

    if (format === "instagram") {
      return new ImageResponse(<OgPostCard {...commonProps} />, {
        width: 1080,
        height: 1350,
      });
    }

    return new ImageResponse(<OgXCard {...commonProps} />, {
      width: 1200,
      height: 630,
    });
  } catch (error: any) {
    console.error("OG Image generation error:", error);
    return new Response(
      `Failed to generate image: ${error?.message || "Unknown error"}`,
      { status: 500 }
    );
  }
}
