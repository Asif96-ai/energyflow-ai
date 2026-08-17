import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import { energyData as initialData } from "./data/energyData";
import "./App.css";

function App() {
  const [data, setData] = useState(initialData);

  return (
    <div>
      <Dashboard data={data} />
    </div>
  );
}

export default App;