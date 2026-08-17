import { Zap, Euro, Activity, Cloud } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { generateLocalInsights } from "../utils/aiEngine";

function Dashboard({ data = [] }) {
  const safeData = Array.isArray(data) ? data : [];
  const totalConsumption = safeData.reduce((acc, item) => acc + item.consumption, 0);
  const averageConsumption = safeData.length > 0 ? totalConsumption / safeData.length : 0;
  const electricityPrice = 0.31;
  const estimatedCost = totalConsumption * electricityPrice;
  const estimatedCO2 = totalConsumption * 0.41;

  // Run rule-based AI engine on active dataset
  const insights = generateLocalInsights(safeData);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>EnergyFlow AI</h1>
          <p>Smart energy monitoring and rule-based AI insights</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Zap size={22} /></div>
          <div>
            <p>Total Energy</p>
            <h2>{totalConsumption.toFixed(1)} kWh</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Euro size={22} /></div>
          <div>
            <p>Estimated Cost</p>
            <h2>€{estimatedCost.toFixed(2)}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Activity size={22} /></div>
          <div>
            <p>Average / Day</p>
            <h2>{averageConsumption.toFixed(1)} kWh</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Cloud size={22} /></div>
          <div>
            <p>Estimated CO₂</p>
            <h2>{estimatedCO2.toFixed(1)} kg</h2>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header">
          <div>
            <h2>Energy Consumption</h2>
            <p>Daily electricity consumption trend</p>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="consumption" stroke="#2563eb" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="content-card ai-card">
        <div className="card-header">
          <div>
            <h2>AI Energy Insights</h2>
            <p>Rule-engine analysis based on uploaded usage patterns</p>
          </div>
        </div>
        <div className="insights">
          {insights.map((item, idx) => (
            <div className="insight" key={idx}>
              <strong>⚡ {item.title}</strong>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;