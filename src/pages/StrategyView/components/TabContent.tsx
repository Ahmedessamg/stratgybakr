import type { Strategy } from '@/pages/StrategyList/components';
import {
  DetailsTab,
  StrategicGoalsTab,
  StrategicPlansTab,
  OperationalGoalsTab,
  OKRsTab,
  KPIsTab,
  MeetingsTab,
  MoreTab
} from './tabs';

interface TabContentProps {
  activeTab: number;
  strategy: Strategy;
}

const TabContent = ({ activeTab, strategy }: TabContentProps) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // التفاصيل
        return <DetailsTab strategy={strategy} />;
      case 1: // الأهداف الاستراتيجية
        return <StrategicGoalsTab />;
      case 2: // الخطط الاستراتيجية
        return <StrategicPlansTab />;
      case 3: // الأهداف الإجرائية
        return <OperationalGoalsTab />;
      case 4: // الأهداف (OKRs)
        return <OKRsTab />;
      case 5: // المؤشرات (KPIs)
        return <KPIsTab />;
      case 6: // الاجتماعات
        return <MeetingsTab />;
      case 7: // المزيد
        return <MoreTab />;
      default:
        return null;
    }
  };

  return <div className="strategy-view__tab-content">{renderTabContent()}</div>;
};

export default TabContent;