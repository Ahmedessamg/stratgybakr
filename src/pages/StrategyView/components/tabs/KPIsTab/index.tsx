import { useTranslation } from 'react-i18next';

const KPIsTab = () => {
  const { t } = useTranslation();

  return (
    <div className="tab-content">
      <h3 className="tab-content__title">{t('strategy.tabs.kpis')}</h3>
      <p className="tab-content__placeholder">{t('strategy.details.noKPIs')}</p>
    </div>
  );
};

export default KPIsTab;
