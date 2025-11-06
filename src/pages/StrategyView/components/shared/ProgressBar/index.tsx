import { useTranslation } from "react-i18next";
import "./styles.scss";

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  showMarker?: boolean;
}

const ProgressBar = ({
  progress,
  showLabel = true,
  showMarker = true
}: ProgressBarProps) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // For RTL: marker position from right
  // For LTR: marker position from left
  const getMarkerPosition = () => {
    if (isRTL) {
      return { right: progress > 0 ? `${100 - progress}%` : "0" };
    } else {
      return { left: progress > 0 ? `${progress}%` : "0" };
    }
  };

  return (
    <div className="progress-bar">
      {showLabel && (
        <div className="progress-bar__label">
          <span>{progress}%</span>
        </div>
      )}
      <div className="progress-bar__wrapper">
        <div className="progress-bar__bg">
          {progress > 0 && (
            <div
              className="progress-bar__fill"
              style={{ width: `${progress}%` }}
            />
          )}
          {showMarker && (
            <div
              className="progress-bar__marker"
              style={getMarkerPosition()}
            >
              <span>{progress}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
