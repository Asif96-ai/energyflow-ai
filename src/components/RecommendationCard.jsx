// src/components/RecommendationCard.jsx

function RecommendationCard({ recommendation }) {
  const {
    title,
    message,
    action,
    metric,
    priority
  } = recommendation;

  return (
    <div className={`recommendation-card ${priority}`}>
      <div className="recommendation-header">
        <div>
          <h3>{title}</h3>
          <span className={`priority-badge ${priority}`}>
            {priority.toUpperCase()}
          </span>
        </div>

        <strong>{metric}</strong>
      </div>

      <p className="recommendation-message">
        {message}
      </p>

      <div className="recommendation-action">
        <strong>Recommended action:</strong>
        <span>{action}</span>
      </div>
    </div>
  );
}

export default RecommendationCard;