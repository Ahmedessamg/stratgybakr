import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SearchInput, Select } from '../../../../components/ui';
import "./FilterBar.scss"
import { Calendar } from '../../../../components/icons/svg';

interface FilterFormData {
  searchBy: string;
  searchValue: string;
  sortBy: string;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterFormData) => void;
}

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const { t } = useTranslation();

  const { control, watch, setValue } = useForm<FilterFormData>({
    defaultValues: {
      searchBy: 'name',
      searchValue: '',
      sortBy: 'date'
    }
  });

  const searchByOptions = [
    { value: 'name', label: t('strategy.searchByName') },
    { value: 'description', label: t('strategy.searchByDescription') },
    { value: 'goals', label: t('strategy.searchByGoals') }
  ];

  const sortByOptions = [
    { value: 'date', label: t('strategy.sortByDate') },
    { value: 'name', label: t('strategy.sortByName') },
    { value: 'status', label: t('strategy.sortByStatus') },
    { value: 'progress', label: t('strategy.sortByProgress') }
  ];

  const formData = watch();

  const handleSearchChange = (value: string) => {
    setValue('searchValue', value);
    onFilterChange({ ...formData, searchValue: value });
  };


  return (
    <div className="strategy-filter">
      {/* Left side - Search controls */}
      <div className="strategy-filter__left">
        <div className="strategy-filter__search-group">
          <div className="strategy-filter__search-by">
            <Select
              name="searchBy"
              control={control}
              options={searchByOptions}
              onChange={(e) => {
                const value = e.target.value;
                setValue('searchBy', value);
                onFilterChange({ ...formData, searchBy: value });
              }}
            />
          </div>
          <div className="strategy-filter__search-input">
            <SearchInput
              placeholder={t('strategy.searchPlaceholder')}
              onSearch={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Right side - Filter label and time period dropdown */}
      <div className="strategy-filter__right">
        <span className="strategy-filter__label">
          {t('strategy.filterBy')}:
        </span>
        <Select
          name="sortBy"
          control={control}
          options={sortByOptions}
          className="strategy-filter__time-select"
          icon={<Calendar width={20} height={20}/>}
          onChange={(e) => {
            const value = e.target.value;
            setValue('sortBy', value);
            onFilterChange({ ...formData, sortBy: value });
          }}
        />
      </div>
    </div>
  );
};

export default FilterBar;
