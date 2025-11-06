import { useTranslation } from 'react-i18next';

const MeetingsTab = () => {
  const { t } = useTranslation();

  return (
    <div className="tab-content">
      <h3 className="tab-content__title">{t('strategy.tabs.meetings')}</h3>
      <p className="tab-content__placeholder">{t('strategy.details.noMeetings')}</p>
    </div>
  );
};

export default MeetingsTab;
