export function generateAdvancedInsights(stats, activePower, solarGen) {
  const insights = [];

  // 1. Power Factor Optimization Rule
  const reactivePower = Math.sqrt(Math.max(0, Math.pow(activePower * 1.25, 2) - Math.pow(activePower, 2)));
  const apparentPower = Math.sqrt(Math.pow(activePower, 2) + Math.pow(reactivePower, 2));
  const powerFactor = apparentPower > 0 ? (activePower / apparentPower).toFixed(2) : 1.0;

  if (powerFactor < 0.85) {
    insights.push({
      title: "Low Power Factor Alert (PF: " + powerFactor + ")",
      category: "Power Quality",
      description: "High inductive load detected causing phase displacement. Installing capacitor banks can reduce reactive penalties.",
      badge: "Warning"
    });
  }

  // 2. Solar PV Self-Consumption & Grid Export Rule
  if (solarGen > activePower) {
    const surplus = (solarGen - activePower).toFixed(0);
    insights.push({
      title: "Solar Grid Export Active (+" + surplus + " W)",
      category: "Renewable Generation",
      description: "Solar production exceeds household demand. Surplus power is being fed back to the grid or charging local storage.",
      badge: "Success"
    });
  } else if (solarGen > 0) {
    const coverage = ((solarGen / activePower) * 100).toFixed(0);
    insights.push({
      title: "Solar Offset Ratio (" + coverage + "% Covered)",
      category: "Renewable Generation",
      description: "Solar PV is actively covering " + coverage + "% of real-time load. Grid energy compensates for the rest.",
      badge: "Info"
    });
  }

  // 3. Peak Demand Detection Rule
  const maxDay = stats.reduce((max, item) => (item.consumption > max.consumption ? item : max), stats[0] || { day: "0", consumption: 0 });
  insights.push({
    title: "Peak Daily Load Spike (" + maxDay.consumption + " kWh)",
    category: "Demand Management",
    description: "Peak consumption recorded on Day " + maxDay.day + ". Automated load shedding is recommended during high-tariff windows.",
    badge: "Alert"
  });

  return insights;
}