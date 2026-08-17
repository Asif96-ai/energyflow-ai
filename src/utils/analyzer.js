export function analyzeEnergyData(data) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.consumption, 0);
  const avg = total / data.length;
  
  // Find peak and lowest usage days
  const peak = data.reduce((max, item) => (item.consumption > max.consumption ? item : max), data[0]);
  const min = data.reduce((min, item) => (item.consumption < min.consumption ? item : min), data[0]);

  // Calculate week-over-week trend if at least 14 days exist
  let trend = 0;
  if (data.length >= 14) {
    const last7 = data.slice(-7).reduce((sum, item) => sum + item.consumption, 0);
    const prev7 = data.slice(-14, -7).reduce((sum, item) => sum + item.consumption, 0);
    trend = (((last7 - prev7) / prev7) * 100).toFixed(1);
  }

  return {
    totalConsumption: total.toFixed(1),
    avgDaily: avg.toFixed(1),
    peakDay: peak,
    minDay: min,
    weeklyTrendPercent: trend,
    dataCount: data.length,
  };
}