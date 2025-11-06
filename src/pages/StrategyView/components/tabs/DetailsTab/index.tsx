import { useTranslation } from "react-i18next";
import { Calendar, DocumentText, Global } from "@/components/icons/svg";
import type { Strategy } from "@/pages/StrategyList/components";
import { HeaderItem, CardWithHeader, DetailRow, DataTable } from "../../shared";

interface DetailsTabProps {
  strategy: Strategy;
}

const DetailsTab = ({ strategy }: DetailsTabProps) => {
  const { t } = useTranslation();

  return (
    <div className="tab-content">
      <h3 className="tab-content__title">{t("strategy.tabs.details")}</h3>

      {/* Header with Calendar Icons */}
      <div className="details-header">
        <HeaderItem
          icon={<Calendar width={20} height={20} />}
          label={t("strategy.details.startDate")}
          value={strategy.startDate}
        />
        <HeaderItem
          icon={<Calendar width={20} height={20} />}
          label={t("strategy.details.endDate")}
          value={strategy.endDate}
        />
        <HeaderItem
          icon={<Global width={20} height={20} />}
          label={t("strategy.details.status")}
          value={t(`strategy.status.${strategy.status}`)}
        />
      </div>

      {/* Strategic Details Section */}
      <CardWithHeader
        icon={<DocumentText width={20} height={20} />}
        title={t("strategy.details.strategicDetailsTitle")}
      >
        {/* Strategy Name */}
        <DetailRow label={t("strategy.details.strategyName")}>
          {strategy.name}
        </DetailRow>

        {/* Description */}
        {strategy.description && (
          <DetailRow label={t("strategy.details.description")}>
            {strategy.description}
          </DetailRow>
        )}

        {/* Strategic Details */}
        {strategy.strategicDetails && (
          <DetailRow label={t("strategy.strategicDetails.details")}>
            {strategy.strategicDetails}
          </DetailRow>
        )}

        {/* Vision & Mission */}
        {strategy.visionMission && (
          <DetailRow label={t("strategy.details.visionMission")}>
            {strategy.visionMission}
          </DetailRow>
        )}

        {/* Focus Areas */}
        {strategy.focusAreas && strategy.focusAreas.length > 0 && (
          <DetailRow label={t("strategy.details.focusAreas")}>
            <ul className="focus-areas-list">
              {strategy.focusAreas.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </DetailRow>
        )}
      </CardWithHeader>

      {/* Values Section */}
      <CardWithHeader
        icon={<DocumentText width={20} height={20} />}
        title={t("strategy.values.title")}
        noBorder
      >
        {strategy.values && strategy.values.length > 0 ? (
          <DataTable
            columns={[
              { key: "name", label: t("strategy.values.valueName") },
              {
                key: "description",
                label: t("strategy.values.valueDescription"),
              },
            ]}
            data={strategy.values}
          />
        ) : (
          <div className="empty-state">
            <p className="py-4 text-center text-gray-500">
              {t("strategy.values.noValues")}
            </p>
          </div>
        )}
      </CardWithHeader>

      {/* Pillars Section */}
      <CardWithHeader
        icon={<DocumentText width={20} height={20} />}
        title={t("strategy.pillars.title")}
        noBorder
      >
        {strategy.pillars && strategy.pillars.length > 0 ? (
          <DataTable
            columns={[
              { key: "name", label: t("strategy.pillars.pillarName") },
              {
                key: "description",
                label: t("strategy.pillars.pillarDescription"),
              },
            ]}
            data={strategy.pillars}
          />
        ) : (
          <div className="empty-state">
            <p className="py-4 text-center text-gray-500">
              {t("strategy.pillars.noPillars")}
            </p>
          </div>
        )}
      </CardWithHeader>
    </div>
  );
};

export default DetailsTab;
