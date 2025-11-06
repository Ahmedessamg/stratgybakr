import { useTranslation } from "react-i18next";
import { ExternalLink } from "@/components/icons/svg";
import { ProgressBar } from "../../shared";
import { mockStrategicPlans } from "./mockData";
import "./styles.scss";

const StrategicPlansTab = () => {
  const { t } = useTranslation();

  return (
    <div className="strategic-plans-tab">
      <div className="strategic-plans-table">
        {/* Table Header */}
        <div className="strategic-plans-table__header">
          <div className="strategic-plans-table__header-cell strategic-plans-table__header-cell--goal">
            {t("strategy.strategicPlansTable.goalName")}
          </div>
          <div className="strategic-plans-table__header-cell strategic-plans-table__header-cell--owner">
            {t("strategy.strategicPlansTable.owner")}
          </div>
          <div className="strategic-plans-table__header-cell strategic-plans-table__header-cell--date">
            {t("strategy.strategicPlansTable.targetDate")}
          </div>
          <div className="strategic-plans-table__header-cell strategic-plans-table__header-cell--progress">
            {t("strategy.strategicPlansTable.progressLevel")}
          </div>
        </div>

        {/* Table Body */}
        <div className="strategic-plans-table__body">
          {mockStrategicPlans.map((plan) => (
            <div key={plan.id} className="strategic-plans-table__row">
              {/* Goal Name with Link Icon */}
              <div className="strategic-plans-table__cell strategic-plans-table__cell--goal">
                <div className="goal-name">
                  <span className="goal-name__text">{plan.goalName}</span>
                  <ExternalLink
                    width={17}
                    height={17}
                    className="ltr:[transform:rotateY(180deg)] goal-name__icon"
                  />
                </div>
              </div>

              {/* Owner */}
              <div className="strategic-plans-table__cell strategic-plans-table__cell--owner">
                <div className="owner">
                  <span className="owner__name">{plan.owner.name}</span>
                  <img
                    src={plan.owner.avatar}
                    alt={plan.owner.name}
                    className="owner__avatar"
                  />
                </div>
              </div>

              {/* Target Date */}
              <div className="strategic-plans-table__cell strategic-plans-table__cell--date">
                <div className="target-date">
                  <span className="target-date__quarter">{plan.quarter}</span>
                  <span className="target-date__range">{plan.dateRange}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="strategic-plans-table__cell strategic-plans-table__cell--progress">
                <ProgressBar progress={plan.progress} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StrategicPlansTab;
