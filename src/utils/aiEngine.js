/**
 * EnergyFlow AI
 * Local Engineering Intelligence Engine
 *
 * This module does NOT require an API key.
 * It analyzes the energy system locally using
 * engineering rules, thresholds and calculations.
 */

export function generateAdvancedInsights(system) {
  const insights = [];

  if (!system) {
    return insights;
  }

  const {
    totalLoadKW,
    solarKW,
    solarCoverage,
    solarSurplusKW,
    solarDeficitKW,
    batterySoC,
    gridImportKW,
    gridExportKW,
    currentAmps,
    powerFactor,
    renewableUtilization,
    estimatedHourlyCost,
    systemStatus,
  } = system;

  // =========================================================
  // 1. HIGH GRID DEPENDENCY
  // =========================================================

  if (
    gridImportKW > 0 &&
    gridImportKW > totalLoadKW * 0.7
  ) {
    insights.push({
      category: "Grid Dependency",
      title: "High Grid Dependency Detected",
      description:
        `The system is importing ${gridImportKW.toFixed(
          2
        )} kW from the grid while total demand is ${totalLoadKW.toFixed(
          2
        )} kW. Consider shifting flexible loads toward periods of higher solar generation.`,
      severity: "warning",
      recommendation:
        "Shift EV charging, heating or other flexible loads to the solar production window.",
    });
  }

  // =========================================================
  // 2. SOLAR SURPLUS
  // =========================================================

  if (solarSurplusKW > 0.2) {
    insights.push({
      category: "Renewable Energy",
      title: "Solar Surplus Available",
      description:
        `Solar generation exceeds current demand by ${solarSurplusKW.toFixed(
          2
        )} kW. This energy can potentially be stored in the battery or used by flexible loads.`,
      severity: "success",
      recommendation:
        "Charge the battery or activate flexible loads before exporting excess energy.",
    });
  }

  // =========================================================
  // 3. LOW BATTERY
  // =========================================================

  if (batterySoC < 20) {
    insights.push({
      category: "Battery",
      title: "Battery State of Charge Is Low",
      description:
        `Battery state of charge is currently ${batterySoC.toFixed(
          0
        )}%. The system has limited stored energy available for peak-demand support.`,
      severity: "warning",
      recommendation:
        "Prioritize battery charging during periods of solar surplus.",
    });
  }

  // =========================================================
  // 4. HIGH BATTERY
  // =========================================================

  if (batterySoC > 90 && solarSurplusKW > 0) {
    insights.push({
      category: "Battery",
      title: "Battery Near Full Capacity",
      description:
        `Battery state of charge is ${batterySoC.toFixed(
          0
        )}% while solar generation is producing surplus energy.`,
      severity: "info",
      recommendation:
        "Consider increasing flexible consumption or exporting excess solar energy.",
    });
  }

  // =========================================================
  // 5. SOLAR PERFORMANCE
  // =========================================================

  if (solarKW > 0 && solarCoverage >= 50) {
    insights.push({
      category: "Solar Performance",
      title: "Strong Solar Load Coverage",
      description:
        `Solar generation currently covers approximately ${solarCoverage.toFixed(
          0
        )}% of the active electrical load.`,
      severity: "success",
      recommendation:
        "Prioritize flexible loads during the current solar production period.",
    });
  }

  // =========================================================
  // 6. POWER FACTOR
  // =========================================================

  if (powerFactor < 0.85) {
    insights.push({
      category: "Power Quality",
      title: "Low Power Factor Detected",
      description:
        `The estimated power factor is ${powerFactor.toFixed(
          2
        )}. Low power factor indicates increased reactive power demand.`,
      severity: "warning",
      recommendation:
        "Investigate inductive loads and consider appropriate reactive power compensation.",
    });
  }

  // =========================================================
  // 7. CURRENT LOADING
  // =========================================================

  if (currentAmps > 20) {
    insights.push({
      category: "Electrical Loading",
      title: "Elevated Current Demand",
      description:
        `Current demand is approximately ${currentAmps.toFixed(
          2
        )} A at the simulated supply voltage.`,
      severity: "warning",
      recommendation:
        "Review simultaneous operation of high-power loads during peak demand periods.",
    });
  }

  // =========================================================
  // 8. GRID EXPORT
  // =========================================================

  if (gridExportKW > 0.2) {
    insights.push({
      category: "Grid Export",
      title: "Energy Export Available",
      description:
        `The microgrid is currently exporting approximately ${gridExportKW.toFixed(
          2
        )} kW.`,
      severity: "success",
      recommendation:
        "Consider storing surplus energy or scheduling flexible loads before exporting.",
    });
  }

  // =========================================================
  // 9. COST
  // =========================================================

  if (estimatedHourlyCost > 1) {
    insights.push({
      category: "Energy Cost",
      title: "High Estimated Grid Cost",
      description:
        `Current grid import corresponds to approximately €${estimatedHourlyCost.toFixed(
          2
        )} per hour at the configured electricity price.`,
      severity: "warning",
      recommendation:
        "Reduce grid-dependent loads or shift flexible consumption toward renewable generation periods.",
    });
  }

  // =========================================================
  // 10. GENERAL SYSTEM STATUS
  // =========================================================

  if (insights.length === 0) {
    insights.push({
      category: "System Health",
      title: "Energy System Operating Normally",
      description:
        "No major energy optimization conditions were detected in the current simulation state.",
      severity: "success",
      recommendation:
        "Continue monitoring solar generation, battery state of charge and grid demand.",
    });
  }

  return insights;
}