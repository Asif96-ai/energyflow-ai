import React, { useState } from "react";

function Calculator({ onDataUpload }) {
  const [kwh, setKwh] = useState(1248);
  const [price, setPrice] = useState(0.31);
  const [renewable, setRenewable] = useState(25);

  const totalCost = kwh * price;
  const co2 = kwh * 0.41 * (1 - renewable / 100);
  const savings = totalCost * (renewable / 100);

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

      if (parsedData.length > 0 && onDataUpload) {
        onDataUpload(parsedData);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="content-card">
      <div className="card-header">
        <h2>Energy Calculator & CSV Upload</h2>
      </div>

      <div style={{ marginTop: "16px" }}>
        <label><strong>Upload Custom Data (CSV): </strong></label>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>

      <hr style={{ margin: "20px 0", border: "0.5px solid #eee" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        <div>
          <label>Consumption (kWh)</label>
          <input
            type="number"
            value={kwh}
            onChange={(e) => setKwh(Number(e.target.value))}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>
        <div>
          <label>Price (€/kWh)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>
        <div>
          <label>Renewable %</label>
          <input
            type="number"
            value={renewable}
            onChange={(e) => setRenewable(Number(e.target.value))}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>
      </div>

      <div className="insights" style={{ marginTop: "20px" }}>
        <div className="insight">
          <strong>Cost</strong>
          <p>€{totalCost.toFixed(2)}</p>
        </div>
        <div className="insight">
          <strong>Estimated CO₂</strong>
          <p>{co2.toFixed(1)} kg</p>
        </div>
        <div className="insight">
          <strong>Potential Savings</strong>
          <p>€{savings.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default Calculator;