import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './StrategiesChart.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

const StrategiesChart = () => {
  const { t } = useTranslation();
  
  const data = {
    labels: [
      t('home.charts.completed'),
      t('home.charts.inProgress'),
      t('home.charts.delayed'),
      t('home.charts.pending')
    ],
    datasets: [
      {
        data: [12, 19, 3, 5],
        backgroundColor: [
          '#10b981', // success
          '#3b82f6', // primary
          '#f59e0b', // warning
          '#ef4444', // danger
        ],
        borderColor: [
          '#10b981',
          '#3b82f6',
          '#f59e0b',
          '#ef4444',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        rtl: document.documentElement.dir === 'rtl',
        labels: {
          font: {
            family: 'IBM Plex Sans Arabic',
          },
          padding: 15,
        },
      },
      tooltip: {
        rtl: document.documentElement.dir === 'rtl',
        bodyFont: {
          family: 'IBM Plex Sans Arabic',
        },
        titleFont: {
          family: 'IBM Plex Sans Arabic',
        },
      },
    },
  };

  return (
    <div className="strategies-chart">
      <h3 className="strategies-chart__title">{t('home.charts.strategiesStatus')}</h3>
      <div className="strategies-chart__container">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default StrategiesChart;
