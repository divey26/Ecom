// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en/translation.json';  // English translations
import taTranslation from './ta/translation.json';  // Tamil translations

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    ta: { translation: taTranslation },

  },
  lng: 'en', // Default language
  fallbackLng: 'en', // Use English if the selected language is not available
  interpolation: {
    escapeValue: false, // React already escapes the strings
  },
});

export default i18n;
