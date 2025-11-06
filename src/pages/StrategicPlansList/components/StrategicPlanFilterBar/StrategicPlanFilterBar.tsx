import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import { Select } from '../../../../components/ui';
import "./StrategicPlanFilterBar.scss"
import { Calendar } from '../../../../components/icons/svg';

interface FilterFormData {
  department: string;
  owner: string;
  period: string;
}

interface StrategicPlanFilterBarProps {
  onFilterChange: (filters: FilterFormData) => void;
}

const StrategicPlanFilterBar = ({ onFilterChange }: StrategicPlanFilterBarProps) => {
  const { t } = useTranslation();

  const { control, watch, setValue } = useForm<FilterFormData>({
    defaultValues: {
      department: 'all',
      owner: 'all',
      period: 'all'
    }
  });

  const departmentOptions = [
    { value: 'all', label: t('strategicPlans.allDepartments') },
    { value: 'it', label: t('strategicPlans.departments.it') },
    { value: 'hr', label: t('strategicPlans.departments.hr') },
    { value: 'finance', label: t('strategicPlans.departments.finance') }
  ];

  const ownerOptions = [
    { value: 'all', label: t('strategicPlans.allOwners') },
    { value: 'owner1', label: 'مراد عبداللطيف' },
    { value: 'owner2', label: 'أحمد محمد' },
    { value: 'owner3', label: 'سارة أحمد' }
  ];

  const periodOptions = [
    { value: 'all', label: t('strategicPlans.periods.all') },
    { value: 'q1', label: t('strategicPlans.periods.q1') },
    { value: 'q2', label: t('strategicPlans.periods.q2') },
    { value: 'q3', label: t('strategicPlans.periods.q3') },
    { value: 'q4', label: t('strategicPlans.periods.q4') }
  ];

  const formData = watch();

  return (
    <div className="strategic-plan-filter">
      <div className="strategic-plan-filter__left">
        <div className="strategic-plan-filter__filter-group">
          <div className="strategic-plan-filter__department">
            <Select
              name="department"
              control={control}
              options={departmentOptions}
              icon={<Users width={20} height={20}/>}
              onChange={(e) => {
                const value = e.target.value;
                setValue('department', value);
                onFilterChange({ ...formData, department: value });
              }}
            />
          </div>
          <div className="strategic-plan-filter__owner">
            <Select
              name="owner"
              control={control}
              options={ownerOptions}
              icon={<Users width={20} height={20}/>}
              onChange={(e) => {
                const value = e.target.value;
                setValue('owner', value);
                onFilterChange({ ...formData, owner: value });
              }}
            />
          </div>
        </div>
      </div>

      <div className="strategic-plan-filter__right">
        <span className="strategic-plan-filter__label">
          {t('strategicPlans.filterByPeriod')}:
        </span>
        <Select
          name="period"
          control={control}
          options={periodOptions}
          className="strategic-plan-filter__period-select"
          icon={<Calendar width={20} height={20}/>}
          onChange={(e) => {
            const value = e.target.value;
            setValue('period', value);
            onFilterChange({ ...formData, period: value });
          }}
        />
      </div>
    </div>
  );
};

export default StrategicPlanFilterBar;

