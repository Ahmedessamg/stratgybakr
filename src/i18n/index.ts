import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { STORAGE_KEYS } from '../constants';

// Import translation files
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  ar: {
    translation: arTranslations,
  },
};

// Get saved language from localStorage or default to 'ar'
const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'ar';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    lng: savedLanguage,
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: STORAGE_KEYS.LANGUAGE,
    },

    interpolation: {
      escapeValue: false,
    },
  });

// Update HTML dir attribute when language changes and save to localStorage
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lng);
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lng);
});

// Set initial dir attribute
document.documentElement.setAttribute('dir', savedLanguage === 'ar' ? 'rtl' : 'ltr');
document.documentElement.setAttribute('lang', savedLanguage);

export default i18n;
