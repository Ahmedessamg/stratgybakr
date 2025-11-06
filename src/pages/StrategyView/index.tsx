import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home as HomeIcon } from "lucide-react";
import { useBreadcrumb, useStrategy } from "@/hooks";
import { ROUTES } from "@/constants";
import { EmptyState } from "@/components/ui";
import { TabContent } from "./components";
import "./index.scss";
import { Plan } from "@/components/icons/svg";

const StrategyView = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { setBreadcrumb } = useBreadcrumb();
  const [activeTab, setActiveTab] = useState(0);

  // Fetch strategy data
  const { strategy, loading, error } = useStrategy(id);

  const tabs = [
    { key: "details", label: t("strategy.tabs.details") },
    { key: "strategicGoals", label: t("strategy.tabs.strategicGoals") },
    { key: "strategicPlans", label: t("strategy.tabs.strategicPlans") },
    { key: "operationalGoals", label: t("strategy.tabs.operationalGoals") },
    { key: "okrs", label: t("strategy.tabs.okrs") },
    { key: "kpis", label: t("strategy.tabs.kpis") },
    { key: "meetings", label: t("strategy.tabs.meetings") },
    { key: "more", label: t("strategy.tabs.more") },
  ];

  useEffect(() => {
    setBreadcrumb(
      [
        { label: <HomeIcon size={16} />, url: ROUTES.HOME },
        { label: t("nav.home"), url: ROUTES.HOME },
        { label: t("nav.strategy"), url: ROUTES.STRATEGY },
      ],
      strategy?.name || t("strategy.viewTitle")
    );
  }, [t, setBreadcrumb, strategy]);

  // Show loading state
  if (loading) {
    return (
      <div className="strategy-view">
        <div className="flex items-center justify-center py-12">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="strategy-view">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!strategy) {
    return (
      <div className="strategy-view">
        <EmptyState message={t("strategy.noResults")} image="/nodata.svg" />
      </div>
    );
  }

  return (
    <div className="strategy-view">
      <div className="strategy-view__header">
        {/* Header */}
        <div className="strategy-view__header-main">
          <div className="plan-icon">
            <Plan width={26} height={26} />
          </div>
          <div className="content">
            <div className="title-line">
              <h1 className="title">{strategy.name}</h1>
              <span className="separator">:</span>
              <p className="description">{strategy.description}</p>
            </div>
            <div className="date-line">
              <span className="date-label">{t("strategy.createdAt")}:</span>
              <span>{strategy.startDate}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="strategy-view__tabs">
          <div className="tabs-nav">
            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                className={`tab-button ${activeTab === index ? "active" : ""}`}
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tabs-content">
        <TabContent activeTab={activeTab} strategy={strategy} />
      </div>
    </div>
  );
};

export default StrategyView;
