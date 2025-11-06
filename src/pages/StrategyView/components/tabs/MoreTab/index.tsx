import { useTranslation } from 'react-i18next';

const MoreTab = () => {
  const { t } = useTranslation();

  return (
    <div className="tab-content">
      <h3 className="tab-content__title">{t('strategy.tabs.more')}</h3>
      <p className="tab-content__placeholder">{t('strategy.details.additionalContent')}</p>
    </div>
  );
};

export default MoreTab;
