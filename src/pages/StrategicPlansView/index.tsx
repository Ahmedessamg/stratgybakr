import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home as HomeIcon } from "lucide-react";
import { useBreadcrumb, useStrategicPlan } from "@/hooks";
import { ROUTES } from "@/constants";
import { EmptyState } from "@/components/ui";
import { Plan } from "@/components/icons/svg";
import { TabContent, DescriptionSection, ProgressCard } from "./components";
import dayjs from "dayjs";
import "./index.scss";

const StrategicPlansView = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { setBreadcrumb } = useBreadcrumb();
  const { plan, loading, error } = useStrategicPlan(id);
  console.log("🚀 ~ StrategicPlansView ~ plan:", plan)
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { key: "details", label: t("strategicPlans.tabs.details") },
    { key: "policies", label: t("strategicPlans.tabs.policies") },
    { key: "executiveGoals", label: t("strategicPlans.tabs.executiveGoals") },
    { key: "initiatives", label: t("strategicPlans.tabs.initiatives") },
    { key: "programs", label: t("strategicPlans.tabs.programs") },
    { key: "kpis", label: t("strategicPlans.tabs.kpis") },
    { key: "oneOnOne", label: t("strategicPlans.tabs.oneOnOne") },
    { key: "meetings", label: t("strategicPlans.tabs.meetings") },
    { key: "more", label: t("strategicPlans.tabs.more") },
  ];

  useEffect(() => {
    setBreadcrumb(
      [
        { label: <HomeIcon size={16} />, url: ROUTES.HOME },
        { label: t("nav.home"), url: ROUTES.HOME },
        { label: t("nav.strategicPlans"), url: ROUTES.STRATEGIC_PLANS },
      ],
      plan?.name || t("strategicPlans.viewTitle")
    );
  }, [t, setBreadcrumb, plan]);

  if (loading) {
    return (
      <div className="strategic-plans-view">
        <div className="flex justify-center items-center py-12">
          <p>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="strategic-plans-view">
        <div className="flex justify-center items-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="strategic-plans-view">
        <EmptyState message={t("strategicPlans.noResults")} image="/nodata.svg" />
      </div>
    );
  }

  const createdDate = plan.created_at
    ? dayjs(plan.created_at).format("DD MMMM YYYY")
    : "";

  return (
    <div className="strategic-plans-view">
      <div className="strategic-plans-view__header">
        {/* Header with plan title */}
        <div className="strategic-plans-view__header-main">
          <div className="strategic-plans-view__header-left">
            <div className="strategic-plans-view__header-content">
              <div className="plan-icon">
                <Plan width={26} height={26} />
              </div>
              <div className="content">
                <h1 className="title">{plan.name}</h1>
                <div className="date-line">
                  <span>{t("strategicPlans.createdAt")}:</span>
                  <span>{createdDate}</span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <DescriptionSection
              label={t("strategicPlans.details.description")}
              description={plan.description || t("strategicPlans.details.noDescription")}
              maxLength={300}
            />
          </div>

          {/* Progress Card */}
          <ProgressCard
            progress={32}
            label={t("strategicPlans.planProgress")}
          />
        </div>

        {/* Tabs */}
        <div className="strategic-plans-view__tabs">
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
        <TabContent activeTab={activeTab} plan={plan} />
      </div>
    </div>
  );
};

export default StrategicPlansView;

