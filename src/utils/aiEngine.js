/**
 * EnergyFlow AI
 * Local Engineering Intelligence Engine
 *
 * 100% client-side.
 * No API key required.
 */

export function generateAdvancedInsights(system, devices = []) {
  if (!system) return [];

  const insights = [];

  const {
    totalLoadKW,
    solarKW,
    solarCoverage,
    solarSurplusKW,
    solarDeficitKW,
    batterySoC,
    batteryPowerKW,
    gridImportKW,
    gridExportKW,
    currentAmps,
    powerFactor,
    renewableUtilization,
    estimatedHourlyCost,
    estimatedHourlyCO2,
  } = system;

  // ---------------------------------------------------------
  // GRID DEPENDENCY
  // ---------------------------------------------------------

  if (
    gridImportKW > 0 &&
    totalLoadKW > 0 &&
    gridImportKW / totalLoadKW > 0.7
  ) {
    insights.push({
      category: "Grid Dependency",
      title: "High Grid Dependency",
      description:
        `The system is importing ${gridImportKW.toFixed(
          2
        )} kW while demand is ${totalLoadKW.toFixed(
          2
        )} kW. Flexible loads should be shifted toward periods of higher renewable generation.`,
      recommendation:
        "Shift flexible loads such as EV charging, heating or appliances toward solar-production periods.",
      severity: "warning",
    });
  }

  // ---------------------------------------------------------
  // SOLAR SURPLUS
  // ---------------------------------------------------------

  if (solarSurplusKW > 0.2) {
    insights.push({
      category: "Renewable Energy",
      title: "Solar Surplus Available",
      description:
        `Solar generation exceeds current demand by ${solarSurplusKW.toFixed(
          2
        )} kW.`,
      recommendation:
        "Use the surplus to charge the battery or activate flexible loads before exporting to the grid.",
      severity: "success",
    });
  }

  // ---------------------------------------------------------
  // SOLAR DEFICIT
  // ---------------------------------------------------------

  if (solarDeficitKW > 0.2) {
    insights.push({
      category: "Solar Generation",
      title: "Solar Generation Below Demand",
      description:
        `Current demand exceeds solar generation by ${solarDeficitKW.toFixed(
          2
        )} kW.`,
      recommendation:
        "Use stored battery energy or shift non-critical loads to reduce grid dependency.",
      severity: "info",
    });
  }

  // ---------------------------------------------------------
  // BATTERY
  // ---------------------------------------------------------

  if (batterySoC < 20) {
    insights.push({
      category: "Battery",
      title: "Battery State of Charge Is Low",
      description:
        `Battery state of charge is ${batterySoC.toFixed(0)}%.`,
      recommendation:
        "Prioritize battery charging during the next solar-surplus period.",
      severity: "warning",
    });
  }

  if (batterySoC > 90 && solarSurplusKW > 0.2) {
    insights.push({
      category: "Battery",
      title: "Battery Near Full Capacity",
      description:
        `Battery is at ${batterySoC.toFixed(
          0
        )}% while solar generation is producing surplus energy.`,
      recommendation:
        "Increase flexible consumption or export excess renewable energy.",
      severity: "info",
    });
  }

  // ---------------------------------------------------------
  // RENEWABLE COVERAGE
  // ---------------------------------------------------------

  if (solarCoverage >= 70) {
    insights.push({
      category: "Renewable Energy",
      title: "Strong Solar Load Coverage",
      description:
        `Solar generation currently covers approximately ${solarCoverage.toFixed(
          0
        )}% of active demand.`,
      recommendation:
        "Run flexible loads while renewable generation is available.",
      severity: "success",
    });
  }

  // ---------------------------------------------------------
  // POWER QUALITY
  // ---------------------------------------------------------

  if (powerFactor < 0.85) {
    insights.push({
      category: "Power Quality",
      title: "Low Power Factor",
      description:
        `Estimated power factor is ${powerFactor.toFixed(2)}.`,
      recommendation:
        "Investigate inductive loads and consider appropriate reactive-power compensation.",
      severity: "warning",
    });
  }

  // ---------------------------------------------------------
  // CURRENT
  // ---------------------------------------------------------

  if (currentAmps > 20) {
    insights.push({
      category: "Electrical Loading",
      title: "Elevated Current Demand",
      description:
        `Estimated current is ${currentAmps.toFixed(2)} A.`,
      recommendation:
        "Review simultaneous operation of high-power loads.",
      severity: "warning",
    });
  }

  // ---------------------------------------------------------
  // GRID EXPORT
  // ---------------------------------------------------------

  if (gridExportKW > 0.2) {
    insights.push({
      category: "Grid Export",
      title: "Renewable Energy Export",
      description:
        `Approximately ${gridExportKW.toFixed(
          2
        )} kW is currently available for grid export.`,
      recommendation:
        "Consider storing or consuming the surplus before exporting it.",
      severity: "success",
    });
  }

  // ---------------------------------------------------------
  // COST
  // ---------------------------------------------------------

  if (estimatedHourlyCost > 0.5) {
    insights.push({
      category: "Energy Cost",
      title: "Grid Energy Cost Opportunity",
      description:
        `Current grid import corresponds to approximately €${estimatedHourlyCost.toFixed(
          2
        )} per hour.`,
      recommendation:
        "Reduce or shift flexible loads to renewable-generation periods.",
      severity: "warning",
    });
  }

  // ---------------------------------------------------------
  // CO2
  // ---------------------------------------------------------

  if (estimatedHourlyCO2 > 1) {
    insights.push({
      category: "Carbon",
      title: "Grid Carbon Exposure",
      description:
        `Current grid demand corresponds to approximately ${estimatedHourlyCO2.toFixed(
          2
        )} kg CO₂/hour using the simulation emission factor.`,
      recommendation:
        "Increase renewable self-consumption and reduce grid imports.",
      severity: "info",
    });
  }

  // ---------------------------------------------------------
  // DEVICE-SPECIFIC INTELLIGENCE
  // ---------------------------------------------------------

  const heavyDevices = devices.filter(
    (device) =>
      device.active && Number(device.power) >= 1000
  );

  if (heavyDevices.length > 0) {
    const names = heavyDevices
      .map((device) => device.name)
      .join(", ");

    insights.push({
      category: "Load Management",
      title: "High-Power Loads Active",
      description:
        `${names} ${heavyDevices.length === 1 ? "is" : "are"} currently contributing significant demand.`,
      recommendation:
        "Schedule high-power loads when solar generation is highest where possible.",
      severity: "info",
    });
  }

  // ---------------------------------------------------------
  // FALLBACK
  // ---------------------------------------------------------

  if (insights.length === 0) {
    insights.push({
      category: "System Health",
      title: "Energy System Operating Normally",
      description:
        "No major optimization opportunity was detected in the current operating state.",
      recommendation:
        "Continue monitoring renewable generation, battery state and grid demand.",
      severity: "success",
    });
  }

  return insights;
}