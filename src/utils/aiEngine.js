export function generateLocalInsights(data) {
  if (!data || data.length < 2) return [];

  const insights = [];
  const total = data.reduce((sum, item) => sum + item.consumption, 0);
  const avg = total / data.length;

  // Rule 1: Week-over-Week Trend Analysis
  if (data.length >= 14) {
    const last7Avg = data.slice(-7).reduce((sum, i) => sum + i.consumption, 0) / 7;
    const prev7Avg = data.slice(-14, -7).reduce((sum, i) => sum + i.consumption, 0) / 7;
    const pctChange = ((last7Avg - prev7Avg) / prev7Avg) * 100;

    if (pctChange > 15) {
      insights.push({
        title: "Consumption Trend (+15% Spurt)",
        description: `Weekly consumption spiked by ${pctChange.toFixed(1)}% (${last7Avg.toFixed(1)} kWh/day vs ${prev7Avg.toFixed(1)} kWh/day previously). Consider shifting flexible loads to off-peak hours.`,
      });
    } else if (pctChange < -10) {
      insights.push({
        title: "Efficiency Gains",
        description: `Great job! Your energy usage dropped by ${Math.abs(pctChange).toFixed(1)}% compared to the prior week.`,
      });
    }
  }

  // Rule 2: High Single-Day Peak Alert
  const maxItem = data.reduce((max, item) => (item.consumption > max.consumption ? item : max), data[0]);
  if (maxItem.consumption > avg * 1.2) {
    insights.push({
      title: "Peak Consumption Alert",
      description: `High peak usage detected on ${maxItem.date} (${maxItem.consumption} kWh). This is over 20% above your average daily usage of ${avg.toFixed(1)} kWh.`,
    });
  }

  // Rule 3: Optimization Opportunity
  insights.push({
    title: "Optimization Opportunity",
    description: `Your average daily load is ${avg.toFixed(1)} kWh. Automating high-power appliances during mid-day or off-peak periods can reduce estimated bill charges.`,
  });

  return insights;
}