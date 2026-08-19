// src/components/EnergyScore.jsx

function EnergyScore({ score }) {
  let label = "Needs Improvement";

  if (score >= 85) {
    label = "Excellent";
  } else if (score >= 70) {
    label = "Good";
  } else if (score >= 50) {
    label = "Moderate";
  }

  return (
    <section className="energy-score-card">
      <div className="score-header">
        <div>
          <span className="section-label">
            ENERGY INTELLIGENCE
          </span>

          <h2>Efficiency Score</h2>
        </div>

        <span className="score-status">
          {label}
        </span>
      </div>

      <div className="score-main">
        <div className="score-number">
          {score}
          <span>/100</span>
        </div>

        <div className="score-bar">
          <div
            className="score-bar-fill"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <p>
        Score calculated from power factor, renewable
        utilization, battery condition and grid dependency.
      </p>
    </section>
  );
}

export default EnergyScore;