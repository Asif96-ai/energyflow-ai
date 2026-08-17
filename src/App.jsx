import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import { energyData as initialData } from "./data/energyData";
import "./App.css";

function App() {
  const [data, setData] = useState(initialData);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.split("\n").slice(1);
      const parsedData = lines
        .map((line) => {
          const [date, consumption] = line.split(",");
          return date && consumption
            ? { date: date.trim(), consumption: parseFloat(consumption) }
            : null;
        })
        .filter(Boolean);

      if (parsedData.length > 0) {
        setData(parsedData);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div style={{ maxWidth: "1400px", margin: "20px auto 0", padding: "0 32px" }}>
        <div style={{ background: "white", padding: "16px 24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "16px" }}>
          <strong>Upload CSV Data:</strong>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        </div>
      </div>
      <Dashboard data={data} />
    </div>
  );
}

export default App;