import tr from "@/locales/tr.json";
import en from "@/locales/en.json";

export type Locale = "tr" | "en";

let currentLocale: Locale = "tr";

const dictionaries: Record<Locale, any> = {
  tr,
  en,
};

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Slug tabanlı yerelleştirme fonksiyonu
 * Örn: t('menu.title_main') veya t('hud.last_violation', { reason: 'Ters yön' })
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const dict = dictionaries[currentLocale] || tr;
  const keys = key.split(".");
  let val: any = dict;

  for (const k of keys) {
    if (val && typeof val === "object" && k in val) {
      val = val[k];
    } else {
      val = undefined;
      break;
    }
  }

  // Fallback to Turkish if key not found in active locale
  if (val === undefined && currentLocale !== "tr") {
    let fallbackVal: any = tr;
    for (const k of keys) {
      if (fallbackVal && typeof fallbackVal === "object" && k in fallbackVal) {
        fallbackVal = fallbackVal[k];
      } else {
        fallbackVal = undefined;
        break;
      }
    }
    val = fallbackVal;
  }

  if (val === undefined || typeof val !== "string") {
    return key;
  }

  if (params) {
    return Object.entries(params).reduce((str, [paramKey, paramVal]) => {
      return str.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramVal));
    }, val);
  }

  return val;
}
