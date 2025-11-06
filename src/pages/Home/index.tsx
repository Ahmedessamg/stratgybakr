import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Home as HomeIcon } from 'lucide-react';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { ROUTES } from '../../constants';
import { StatCard, StrategiesChart, PerformanceChart } from './components';
import './index.scss';

const Home = () => {
  const { t } = useTranslation();
  const { setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb(
      [
        { label: <HomeIcon size={16} />, url: ROUTES.HOME },
      ],
      t('nav.home')
    );
  }, [t, setBreadcrumb]);

  return (
    <div className="home-page">
      <div className="home-page__welcome">
        <h1 className="home-page__title">{t('home.welcome')}</h1>
        <p className="home-page__subtitle">{t('home.subtitle')}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="home-page__stats">
        <StatCard title={t('home.stats.activeStrategies')} value={12} variant="primary" />
        <StatCard title={t('home.stats.ongoingInitiatives')} value={34} variant="primary" />
        <StatCard title={t('home.stats.completedTasks')} value="89%" variant="success" />
      </div>

      {/* Charts Section */}
      <div className="home-page__charts">
        <div className="home-page__chart-item">
          <PerformanceChart />
        </div>
        <div className="home-page__chart-item">
          <StrategiesChart />
        </div>
      </div>
    </div>
  );
};

export default Home;
