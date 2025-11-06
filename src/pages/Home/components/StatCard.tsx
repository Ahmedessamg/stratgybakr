import './StatCard.scss';

interface StatCardProps {
  title: string;
  value: string | number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

const StatCard = ({ title, value, variant = 'primary' }: StatCardProps) => {
  return (
    <div className="stat-card">
      <h3 className="stat-card__title">{title}</h3>
      <p className={`stat-card__value stat-card__value--${variant}`}>{value}</p>
    </div>
  );
};

export default StatCard;

