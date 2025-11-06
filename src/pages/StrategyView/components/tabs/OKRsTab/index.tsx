import { useTranslation } from 'react-i18next';

const OKRsTab = () => {
  const { t } = useTranslation();

  return (
    <div className="tab-content">
      <h3 className="tab-content__title">{t('strategy.tabs.okrs')}</h3>
      <p className="tab-content__placeholder">{t('strategy.details.noOKRs')}</p>
    </div>
  );
};

export default OKRsTab;
