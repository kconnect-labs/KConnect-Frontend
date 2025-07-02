import React, { createContext, useContext, useState, useCallback } from 'react';
import EN from '@/Language/EN.json';
import RU from '@/Language/RU.json';
import JP from '@/Language/JP.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or default to 'EN'
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('k-connect-language');
    return savedLanguage || 'RU';
  });
  
  const translations = {
    RU,

    EN,
    JP
  };

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (!value || !value[k]) {
        console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
        return key;
      }
      value = value[k];
    }
    
    // Проверяем, что значение - строка
    if (typeof value !== 'string') {
      console.warn(`Translation key ${key} refers to an object instead of a string`);
      return key;
    }
    
    // Если есть параметры, выполняем интерполяцию
    if (Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, key) => {
        return params[key] !== undefined ? params[key] : match;
      });
    }
    
    return value;
  }, [currentLanguage]);

  const changeLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
      // Save language preference to localStorage
      localStorage.setItem('k-connect-language', lang);
      // Also save to sessionStorage for redundancy
      sessionStorage.setItem('k-connect-language', lang);
      // Set language attribute on html tag
      document.documentElement.setAttribute('lang', lang.toLowerCase());
    } else {
      console.warn(`Language ${lang} not supported`);
    }
  }, []);

  // Set initial language attribute
  React.useEffect(() => {
    document.documentElement.setAttribute('lang', currentLanguage.toLowerCase());
  }, []);

  return (
    <LanguageContext.Provider value={{ t, currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}; 