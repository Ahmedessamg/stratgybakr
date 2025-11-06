import "./styles.scss";

interface ProgressCardProps {
  progress: number;
  label: string;
}

const ProgressCard = ({ progress, label }: ProgressCardProps) => {
  const radius = 43;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-card">
      <div className="progress-card__content">
        <div className="progress-card__chart">
          <svg width="108.12" height="100" viewBox="0 0 108.12 100">
            <defs>
              <filter
                id="progress-shadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur in="SourceAlpha" stdDeviation="3.177" />
                <feOffset dx="0" dy="0" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.02" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background circle with shadow */}

            <circle
              cx="54.06"
              cy="50"
              r={radius}
              fill="none"
              stroke="#EEEEEE"
              strokeWidth="6.7"
              filter="url(#progress-shadow)"
            />

            {/* Progress circle */}
            <circle
              cx="54.06"
              cy="50"
              r={radius}
              fill="none"
              stroke="#50CD89"
              strokeWidth="6.7"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              transform="rotate(-90 54.06 50)"
              className="progress-circle"
            />

            {/* Percentage text */}
            <text
              x="54.06"
              y="55"
              textAnchor="middle"
              className="progress-text"
            >
              {progress}%
            </text>
          </svg>
        </div>
        <p className="progress-card__label">{label}</p>
      </div>
    </div>
  );
};

export default ProgressCard;
