# EnergyFlow AI
> Smart Energy Analytics & In-Browser AI Insights Dashboard

A web application designed to track electricity consumption, compute daily/monthly metrics, calculate financial/environmental impact, and generate rule-based AI optimization insights.


## Live Demo
- **Deployed App**:(https://energyflow-ai.vercel.app/)
- **GitHub Repository**: https://github.com/Asif96-ai/energyflow-ai

## Features
* **Interactive Dashboard**: Visualizes daily electricity consumption trends using interactive charts.
* **Custom CSV Upload**: Parses dynamic user-uploaded energy consumption files (`date,consumption_kwh`).
* **Rule-Based AI Engine**: Analyzes time-series data locally to identify usage spurts, high-consumption alerts, and cost optimization opportunities.
* **Financial & Environmental Metrics**: Auto-calculates total kWh usage, estimated cost (€), daily average, and CO₂ footprint.


## Tech Stack
* **Frontend**: React, Vite
* **Data Visualization**: Recharts
* **UI Components**: Lucide React
* **Engine**: Custom JavaScript Rule-Based Heuristic Engine


## Local Development
```bash
# Clone the repository
git clone [https://github.com/Asif96-ai/energyflow-ai.git](https://github.com/Asif96-ai/energyflow-ai.git)

# Navigate to directory
cd energyflow-ai

# Install dependencies
npm install

# Start development server
npm run dev