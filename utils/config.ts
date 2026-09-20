/**
 * Uygulamanın tam URL'sini ortam değişkeninden veya tarayıcı penceresinden çözen yardımcı fonksiyon.
 */
export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "https://sungur.dev";
}

export const SOCIAL_LINKS = {
  authorX: "https://x.com/tahsingibi",
  authorWebsite: "https://sungur.dev",
};
