// src/components/EnergyAdvisor.jsx

import { useMemo } from "react";

import {
  analyzeEnergySystem
} from "../services/energyIntelligence";

import RecommendationCard from "./RecommendationCard";
import EnergyScore from "./EnergyScore";

function EnergyAdvisor({
  activePower,
  voltage,
  powerFactor,
  current,
  solarGen,
  batterySoC
}) {
  const analysis = useMemo(() => {
    return analyzeEnergySystem({
      activePower,
      voltage,
      powerFactor,
      current,
      solarGen,
      batterySoC
    });
  }, [
    activePower,
    voltage,
    powerFactor,
    current,
    solarGen,
    batterySoC
  ]);

  const {
    gridImport,
    solarUtilization,
    gridDependency,
    batteryStatus,
    powerFactorStatus,
    energyScore,
    recommendations
  } = analysis;

  return (
    <section className="energy-advisor">

      <div className="advisor-heading">
        <div>
          <span className="section-label">
            AI ENERGY ADVISOR
          </span>

          <h2>Energy Intelligence</h2>

          <p>
            Local decision engine analyzing the current
            electrical and renewable-energy state.
          </p>
        </div>

        <div className="advisor-status">
          <span className="status-dot" />
          Analysis Active
        </div>
      </div>

      <div className="intelligence-grid">

        <div className="intelligence-card">
          <span>Grid Import</span>
          <strong>
            {gridImport.toFixed(2)} kW
          </strong>
          <small>
            Current estimated dependency
          </small>
        </div>

        <div className="intelligence-card">
          <span>Grid Dependency</span>
          <strong>
            {gridDependency.toFixed(0)}%
          </strong>
          <small>
            Current load supplied by grid
          </small>
        </div>

        <div className="intelligence-card">
          <span>Solar Utilization</span>
          <strong>
            {solarUtilization.toFixed(0)}%
          </strong>
          <small>
            Solar contribution to load
          </small>
        </div>

        <div className="intelligence-card">
          <span>Battery Status</span>
          <strong>
            {batteryStatus.label}
          </strong>
          <small>
            {batterySoC}% state of charge
          </small>
        </div>

        <div className="intelligence-card">
          <span>Power Factor</span>
          <strong>
            {powerFactorStatus.label}
          </strong>
          <small>
            PF {powerFactor.toFixed(2)}
          </small>
        </div>

      </div>

      <EnergyScore score={energyScore} />

      <div className="recommendations-section">

        <div className="recommendations-heading">
          <div>
            <span className="section-label">
              SYSTEM RECOMMENDATIONS
            </span>

            <h2>Recommended Actions</h2>
          </div>

          <span className="recommendation-count">
            {recommendations.length} insight
            {recommendations.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="recommendations-list">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
            />
          ))}
        </div>

      </div>

    </section>
  );
}

export default EnergyAdvisor;