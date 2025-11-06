import { StrategicPlanData } from "@/services/supabase/strategicPlan/strategicPlan.service";
import { DetailsTab, PoliciesTab, ExecutiveGoalsTab } from "./tabs";

interface TabContentProps {
  activeTab: number;
  plan: StrategicPlanData;
}

const TabContent = ({ activeTab, plan }: TabContentProps) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // التفاصيل
        return <DetailsTab plan={plan} />;
      case 1: // السياسات
        return <PoliciesTab planId={plan.id} />;
      case 2: // اهداف تنفيذية
        return <ExecutiveGoalsTab planId={plan.id} />;
      case 3: // المبادارات
        return <div>Initiatives Tab - Coming Soon</div>;
      case 4: // البرامج
        return <div>Programs Tab - Coming Soon</div>;
      case 5: // المؤشرات (KPIs)
        return <div>KPIs Tab - Coming Soon</div>;
      case 6: // محادثة ثنائية
        return <div>One on One Tab - Coming Soon</div>;
      case 7: // الاجتماعات
        return <div>Meetings Tab - Coming Soon</div>;
      case 8: // المزيد
        return <div>More Tab - Coming Soon</div>;
      default:
        return null;
    }
  };

  return <div className="strategic-plans-view__tab-content">{renderTabContent()}</div>;
};

export default TabContent;
