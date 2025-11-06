import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    
    // Update document direction for RTL support
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="fixed top-4 right-4 z-50"
    >
      {t('language.switch')} ({i18n.language === 'en' ? 'AR' : 'EN'})
    </Button>
  );
};

export default LanguageSwitcher;
