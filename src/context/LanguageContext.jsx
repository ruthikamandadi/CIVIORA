import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { DEFAULT_LANGUAGE, getTranslationDictionary } from '../data/translations.js';

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key, fallback = '') => fallback,
});

export function LanguageProvider({ children, language: controlledLanguage, setLanguage: controlledSetLanguage }) {
  const [internalLanguage, setInternalLanguage] = useState(() => {
    try {
      return localStorage.getItem('civioraLanguage') || DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  const language = controlledLanguage ?? internalLanguage;

  useEffect(() => {
    try {
      localStorage.setItem('civioraLanguage', language);
    } catch {
      // noop if storage is unavailable
    }
  }, [language]);

  const setLanguage = (nextLanguage) => {
    if (controlledSetLanguage) {
      controlledSetLanguage(nextLanguage);
      return;
    }

    setInternalLanguage(nextLanguage);
  };

  const t = useMemo(() => {
    return (key, fallback = '') => {
      const translations = getTranslationDictionary(language);
      return translations[key] ?? fallback ?? key;
    };
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
