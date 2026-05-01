/**
 * i18n — Lightweight client-side translation
 * English is the default (hardcoded in source).
 * Only Italian translations are loaded from it.json.
 */

import itTranslations from "./it.json";

let locale = "en";
let translations = {};

/**
 * Initialize locale from localStorage or browser language
 */
export function initI18n() {
  const saved = localStorage.getItem("et-locale");
  if (saved && (saved === "en" || saved === "it")) {
    locale = saved;
  } else {
    const browserLang = navigator.language?.slice(0, 2);
    locale = browserLang === "it" ? "it" : "en";
  }
  translations = locale === "it" ? itTranslations : {};
  document.documentElement.lang = locale;
}

/**
 * Translate a key. Returns Italian translation if locale is "it",
 * otherwise returns the English fallback (the original hardcoded text).
 */
export function t(key, fallback) {
  if (locale === "en") return fallback;
  return translations[key] || fallback;
}

/**
 * Get current locale
 */
export function getLocale() {
  return locale;
}

/**
 * Set locale and persist to localStorage
 */
export function setLocale(lang) {
  locale = lang;
  translations = locale === "it" ? itTranslations : {};
  localStorage.setItem("et-locale", lang);
  document.documentElement.lang = locale;
}
