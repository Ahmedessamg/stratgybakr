import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './PerformanceChart.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PerformanceChart = () => {
  const { t } = useTranslation();
  
  const data = {
    labels: [
      t('home.months.january'),
      t('home.months.february'),
      t('home.months.march'),
      t('home.months.april'),
      t('home.months.may'),
      t('home.months.june')
    ],
    datasets: [
      {
        label: t('home.charts.targetPerformance'),
        data: [65, 70, 75, 80, 85, 90],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: t('home.charts.actualPerformance'),
        data: [60, 68, 78, 82, 88, 92],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        rtl: document.documentElement.dir === 'rtl',
        labels: {
          font: {
            family: 'IBM Plex Sans Arabic',
          },
          usePointStyle: true,
          pointStyle: 'circle',
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
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: 'IBM Plex Sans Arabic',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          font: {
            family: 'IBM Plex Sans Arabic',
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="performance-chart">
      <h3 className="performance-chart__title">{t('home.charts.monthlyPerformance')}</h3>
      <div className="performance-chart__container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default PerformanceChart;
