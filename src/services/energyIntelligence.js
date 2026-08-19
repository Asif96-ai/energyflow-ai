// src/services/energyIntelligence.js

/**
 * EnergyFlow AI
 * Local Energy Intelligence Engine
 *
 * This module intentionally does not require an external AI API.
 * It analyzes electrical/energy parameters locally and produces
 * recommendations based on engineering thresholds and scoring.
 */

// Keep values inside sensible engineering ranges.
const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Calculate grid import.
 *
 * If load is greater than solar generation, the remaining demand
 * is supplied by the grid/battery.
 */
export function calculateGridImport(activePower, solarGen, batteryPower = 0) {
  const netDemand = activePower - solarGen - batteryPower;

  return Math.max(0, netDemand);
}

/**
 * Calculate solar utilization.
 *
 * This represents how much of the current load is being supplied
 * by solar generation.
 */
export function calculateSolarUtilization(activePower, solarGen) {
  if (activePower <= 0) {
    return 0;
  }

  return clamp((solarGen / activePower) * 100, 0, 100);
}

/**
 * Calculate grid dependency.
 */
export function calculateGridDependency(activePower, solarGen, batteryPower = 0) {
  if (activePower <= 0) {
    return 0;
  }

  const gridImport = calculateGridImport(
    activePower,
    solarGen,
    batteryPower
  );

  return clamp((gridImport / activePower) * 100, 0, 100);
}

/**
 * Determine battery status.
 */
export function getBatteryStatus(batterySoC) {
  if (batterySoC >= 90) {
    return {
      level: "high",
      label: "High",
      message: "Battery has strong reserve capacity."
    };
  }

  if (batterySoC >= 60) {
    return {
      level: "healthy",
      label: "Healthy",
      message: "Battery operating within a healthy state of charge."
    };
  }

  if (batterySoC >= 30) {
    return {
      level: "moderate",
      label: "Moderate",
      message: "Battery reserve is available but should be monitored."
    };
  }

  return {
    level: "low",
    label: "Low",
    message: "Battery reserve is low and grid support may be required."
  };
}

/**
 * Analyze power factor.
 */
export function analyzePowerFactor(powerFactor) {
  if (powerFactor >= 0.95) {
    return {
      level: "excellent",
      label: "Excellent",
      message: "Power factor is within an efficient operating range."
    };
  }

  if (powerFactor >= 0.90) {
    return {
      level: "good",
      label: "Good",
      message: "Power factor is acceptable but optimization is possible."
    };
  }

  if (powerFactor >= 0.80) {
    return {
      level: "warning",
      label: "Needs Attention",
      message: "Low power factor may increase reactive power demand."
    };
  }

  return {
    level: "critical",
    label: "Critical",
    message: "Very low power factor indicates significant reactive power."
  };
}

/**
 * Calculate an overall energy efficiency score.
 *
 * Score components:
 * - Power factor
 * - Solar contribution
 * - Battery condition
 * - Grid dependency
 */
export function calculateEnergyScore({
  activePower,
  solarGen,
  batterySoC,
  powerFactor
}) {
  const solarUtilization = calculateSolarUtilization(
    activePower,
    solarGen
  );

  const gridDependency = calculateGridDependency(
    activePower,
    solarGen
  );

  const pfScore = clamp(powerFactor * 100, 0, 100);

  const solarScore = clamp(solarUtilization, 0, 100);

  const batteryScore = clamp(batterySoC, 0, 100);

  const gridScore = clamp(100 - gridDependency, 0, 100);

  const score =
    pfScore * 0.25 +
    solarScore * 0.30 +
    batteryScore * 0.20 +
    gridScore * 0.25;

  return Math.round(clamp(score, 0, 100));
}

/**
 * Generate intelligent recommendations.
 *
 * The engine evaluates multiple conditions and ranks the
 * recommendations according to severity.
 */
export function generateEnergyRecommendations({
  activePower,
  voltage,
  powerFactor,
  current,
  solarGen,
  batterySoC
}) {
  const recommendations = [];

  const gridImport = calculateGridImport(
    activePower,
    solarGen
  );

  const solarUtilization = calculateSolarUtilization(
    activePower,
    solarGen
  );

  // 1. Power factor recommendation
  if (powerFactor < 0.90) {
    recommendations.push({
      id: "power-factor",
      type: "electrical",
      priority: "high",
      title: "Improve Power Factor",
      message:
        "The current power factor indicates increased reactive power demand.",
      action:
        "Investigate inductive loads and consider reactive power compensation.",
      metric: `PF ${powerFactor.toFixed(2)}`,
      score: 90
    });
  } else if (powerFactor < 0.95) {
    recommendations.push({
      id: "power-factor-monitor",
      type: "electrical",
      priority: "medium",
      title: "Monitor Power Factor",
      message:
        "Power factor is acceptable but there is potential for further optimization.",
      action:
        "Monitor large inductive loads during high-demand periods.",
      metric: `PF ${powerFactor.toFixed(2)}`,
      score: 55
    });
  }

  // 2. High grid dependency
  const gridDependency =
    activePower > 0
      ? (gridImport / activePower) * 100
      : 0;

  if (gridDependency > 50) {
    recommendations.push({
      id: "grid-dependency-high",
      type: "grid",
      priority: "high",
      title: "High Grid Dependency",
      message:
        "More than half of the current load is not being covered by local renewable generation.",
      action:
        "Increase renewable utilization or shift flexible loads toward periods of higher solar generation.",
      metric: `${gridDependency.toFixed(0)}% grid`,
      score: 85
    });
  } else if (gridDependency > 25) {
    recommendations.push({
      id: "grid-dependency-medium",
      type: "grid",
      priority: "medium",
      title: "Optimize Grid Consumption",
      message:
        "The system still relies significantly on external grid power.",
      action:
        "Consider scheduling flexible loads during periods of higher renewable generation.",
      metric: `${gridDependency.toFixed(0)}% grid`,
      score: 60
    });
  }

  // 3. High battery SOC
  if (batterySoC >= 90 && solarGen > 0) {
    recommendations.push({
      id: "battery-high",
      type: "battery",
      priority: "medium",
      title: "Battery Nearly Full",
      message:
        "Battery state of charge is high while renewable generation is available.",
      action:
        "Prioritize suitable local loads or export excess renewable energy where supported.",
      metric: `${batterySoC}% SOC`,
      score: 65
    });
  }

  // 4. Low battery
  if (batterySoC < 30) {
    recommendations.push({
      id: "battery-low",
      type: "battery",
      priority: "high",
      title: "Low Battery Reserve",
      message:
        "Battery state of charge is approaching a low reserve level.",
      action:
        "Reduce non-critical battery loads and maintain sufficient reserve for essential loads.",
      metric: `${batterySoC}% SOC`,
      score: 88
    });
  }

  // 5. Solar opportunity
  if (activePower > solarGen * 1.5 && solarGen > 0) {
    recommendations.push({
      id: "solar-opportunity",
      type: "solar",
      priority: "medium",
      title: "Solar Utilization Opportunity",
      message:
        "Current electrical demand is significantly higher than solar generation.",
      action:
        "Schedule flexible loads during stronger solar production periods where possible.",
      metric: `${solarUtilization.toFixed(0)}% solar`,
      score: 70
    });
  }

  // 6. Voltage monitoring
  if (voltage < 210) {
    recommendations.push({
      id: "voltage-low",
      type: "voltage",
      priority: "high",
      title: "Low Voltage Condition",
      message:
        "Measured voltage is below the configured operating threshold.",
      action:
        "Inspect supply conditions, feeder loading and voltage regulation.",
      metric: `${voltage.toFixed(1)} V`,
      score: 95
    });
  } else if (voltage > 250) {
    recommendations.push({
      id: "voltage-high",
      type: "voltage",
      priority: "high",
      title: "High Voltage Condition",
      message:
        "Measured voltage is above the configured operating threshold.",
      action:
        "Inspect voltage regulation and supply-side conditions.",
      metric: `${voltage.toFixed(1)} V`,
      score: 95
    });
  }

  // 7. High current
  if (current > 30) {
    recommendations.push({
      id: "current-high",
      type: "load",
      priority: "medium",
      title: "High Current Demand",
      message:
        "Current demand is relatively high and may indicate increased system loading.",
      action:
        "Review active loads and consider load balancing where applicable.",
      metric: `${current.toFixed(1)} A`,
      score: 75
    });
  }

  // 8. If no problems are detected
  if (recommendations.length === 0) {
    recommendations.push({
      id: "system-healthy",
      type: "system",
      priority: "low",
      title: "System Operating Normally",
      message:
        "Current electrical and renewable-energy indicators are within the configured operating ranges.",
      action:
        "Continue monitoring system performance and renewable utilization.",
      metric: "Healthy",
      score: 20
    });
  }

  return recommendations.sort((a, b) => b.score - a.score);
}

/**
 * Main intelligence function.
 */
export function analyzeEnergySystem({
  activePower,
  voltage,
  powerFactor,
  current,
  solarGen,
  batterySoC
}) {
  const gridImport = calculateGridImport(
    activePower,
    solarGen
  );

  const solarUtilization = calculateSolarUtilization(
    activePower,
    solarGen
  );

  const gridDependency = calculateGridDependency(
    activePower,
    solarGen
  );

  const batteryStatus = getBatteryStatus(batterySoC);

  const powerFactorStatus =
    analyzePowerFactor(powerFactor);

  const energyScore = calculateEnergyScore({
    activePower,
    solarGen,
    batterySoC,
    powerFactor
  });

  const recommendations =
    generateEnergyRecommendations({
      activePower,
      voltage,
      powerFactor,
      current,
      solarGen,
      batterySoC
    });

  return {
    gridImport,
    solarUtilization,
    gridDependency,
    batteryStatus,
    powerFactorStatus,
    energyScore,
    recommendations
  };
}