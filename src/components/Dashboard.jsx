import React, { useState, useEffect } from "react";
import { calculateEnergySystem } from "../utils/energySystem";
import { generateAdvancedInsights } from "../utils/aiEngine";
import { 
  Zap, Lightbulb, Wifi, Tv, ShieldCheck, BatteryCharging,
  LayoutDashboard, CreditCard, Clock, PiggyBank, Settings, Sparkles, ArrowUpRight, ArrowDownLeft,
  Upload, LogOut, User, Flame, Thermometer, MessageSquare, Plus, Trash2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const initialStats = [
  { day: "12", consumption: 15 }, { day: "13", consumption: 22 },
  { day: "14", consumption: 18 }, { day: "15", consumption: 35 },
  { day: "16", consumption: 28 }, { day: "17", consumption: 24 },
  { day: "18", consumption: 30 }, { day: "19", consumption: 19 },
  { day: "20", consumption: 26 }, { day: "21", consumption: 32 }
];

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fileName, setFileName] = useState("No file chosen");
  const [smsAlerts, setSmsAlerts] = useState(true);

  // Temperature State
  const [insideTemp] = useState(21.5);
  const [outsideTemp] = useState(11.0);

  // Dynamic Devices State (Add/Remove Appliances)
  const [devices, setDevices] = useState([
    { id: "heating", name: "Heat Pump HVAC", power: 1800, active: true, icon: Flame },
    { id: "light", name: "Smart Lighting", power: 180, active: true, icon: Lightbulb },
    { id: "internet", name: "WiFi Router", power: 45, active: true, icon: Wifi },
    { id: "tv", name: "Entertainment Unit", power: 210, active: false, icon: Tv },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDevicePower, setNewDevicePower] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDevice = (id) => {
    setDevices(devices.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const addDevice = (e) => {
    e.preventDefault();
    if (!newDeviceName || !newDevicePower) return;
    const newDevice = {
      id: Date.now().toString(),
      name: newDeviceName,
      power: parseFloat(newDevicePower),
      active: true,
      icon: Zap
    };
    setDevices([...devices, newDevice]);
    setNewDeviceName("");
    setNewDevicePower("");
    setShowAddForm(false);
  };

  const removeDevice = (id, e) => {
    e.stopPropagation();
    setDevices(devices.filter(d => d.id !== id));
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  // Electrical parameter calculations
   // =========================================================
  // ENERGY SYSTEM ENGINE
  // =========================================================

  // Simulated solar generation in kW.
  // We keep this value in kW for the engineering engine.
  const solarGenerationKW = 1.2;

  // Simulated battery state of charge.
  const batteryStateOfCharge = 82;

  // Electrical system parameters.
  const voltage = 230;
const powerFactor = 0.94;

  // Run the local EnergyFlow engineering engine.
  const energySystem = calculateEnergySystem({
    devices,
    solarGeneration: solarGenerationKW,
    batterySoC: batteryStateOfCharge,
    batteryCapacity: 20,
    voltage,
    powerFactor,
    batteryMaxPower: 5,
    electricityPrice: 0.32,
  });

  // =========================================================
  // COMPATIBILITY VALUES
  // =========================================================

  const activePower = energySystem.totalLoadWatts;

  const solarGen = energySystem.solarKW * 1000;

  const batterySoC = energySystem.batterySoC;

  const totalCurrent = energySystem.currentAmps.toFixed(2);

  // =========================================================
  // LOCAL AI ENGINE
  // =========================================================

  const advancedAIInsights =
    generateAdvancedInsights(energySystem);

  // Dynamic AI Insight Generator
  const getDynamicInsights = () => {
    const insights = [];
    const isHeatingActive = devices.find(d => d.id === "heating")?.active;
    const tempDelta = (insideTemp - outsideTemp).toFixed(1);

    if (isHeatingActive) {
      insights.push({
        category: "Home Heating Efficiency",
        title: `Thermal Delta: ${tempDelta}°C`,
        description: `Heat Pump HVAC is drawing ${(1800 / (voltage * powerFactor)).toFixed(1)}A to maintain inside home temperature (${insideTemp}°C) vs outside temperature (${outsideTemp}°C).`
      });
    } else {
      insights.push({
        category: "Thermal Storage Mode",
        title: `HVAC Inactive — Outside ${outsideTemp}°C`,
        description: `Indoor heat loss is ~0.4°C/hr. Thermal retention is optimal. Heat pump can remain idle until inside home temperature drops below 19°C.`
      });
    }

    if (solarGen > activePower) {
      insights.push({
        category: "Solar Thermal Pre-heating",
        title: `Surplus Generation: ${solarGen - activePower} W`,
        description: "PV array is producing more power than active loads. Optimal window to turn on additional appliances or charge storage battery."
      });
    } else {
      insights.push({
        category: "Grid Import Throttling",
        title: `Importing ${activePower - solarGen} W from Grid`,
        description: "Consumption exceeds solar generation. Consider turning off heavy inactive loads to remain within self-generated capacity."
      });
    }

    insights.push({
      category: "Power Quality Telemetry",
      title: `Current Draw: ${totalCurrent} A @ ${powerFactor} PF`,
      description: `Mains voltage steady at ${voltage}V across ${devices.length} registered household appliances.`
    });

    return insights;
  };

  const dynamicInsights = getDynamicInsights();

  return (
    <div className="app-wrapper">
      {/* Dark Navy Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Zap size={22} color="#00e676" />
          <span>EnergyFlow AI</span>
        </div>
        
        <nav className="nav-group">
          <div className="nav-item active"><LayoutDashboard size={18} /> Dashboard</div>
          <div className="nav-item"><CreditCard size={18} /> Service Request</div>
          <div className="nav-item"><Clock size={18} /> Energy Consumption</div>
          <div className="nav-item"><PiggyBank size={18} /> Savings & Tariffs</div>
          <div className="nav-item"><Settings size={18} /> Settings</div>
        </nav>

        {/* Upgrade to Premium Option */}
        <div className="premium-card">
          <ShieldCheck size={26} style={{ margin: "0 auto 6px" }} />
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "600" }}>Upgrade to Premium</p>
          <p style={{ margin: "4px 0 0", fontSize: "11px", opacity: 0.8 }}>Unlock AI thermal scheduling & automated grid dispatch</p>
          <button>Go Premium</button>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-btn-logout"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="main-container">
        {/* Top Header */}
        <header className="top-header">
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>Energy Command Center</h2>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "13px" }}>
              Real-time load management, heating integration & solar microgrid control
            </p>
          </div>

          <div className="header-right-tools">
            <div className="clock-badge">
              <Clock size={16} color="#00c853" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>

            <div className="user-profile-box">
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>Alex Mercer</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#00c853", fontWeight: "600" }}>Pro Member</p>
              </div>
              <div className="user-avatar">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid Layout */}
        <div className="dashboard-grid">
          {/* Main Left Column */}
          <section className="main-column">
            {/* Real-time Electrical Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              <div className="card" style={{ padding: "14px" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>ACTIVE POWER</span>
                <h3 style={{ margin: "6px 0 0", fontSize: "18px" }}>{activePower} W</h3>
              </div>

              <div className="card" style={{ padding: "14px" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>POWER FACTOR</span>
                <h3 style={{ margin: "6px 0 0", fontSize: "18px", color: "#00c853" }}>{powerFactor}</h3>
              </div>

              <div className="card" style={{ padding: "14px" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>MAINS VOLTAGE</span>
                <h3 style={{ margin: "6px 0 0", fontSize: "18px" }}>{voltage} V</h3>
              </div>

              <div className="card" style={{ padding: "14px" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>TOTAL CURRENT</span>
                <h3 style={{ margin: "6px 0 0", fontSize: "18px" }}>{totalCurrent} A</h3>
              </div>
            </div>

            {/* Dedicated Temperature Cards */}
            <div className="temp-grid">
              <div className="temp-card">
                <div>
                  <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "UPPERCASE" }}>Inside Home Temperature</span>
                  <h3 style={{ margin: "4px 0 0", fontSize: "18px", color: "#0f172a" }}>{insideTemp} °C</h3>
                </div>
                <Flame size={22} color="#dc2626" />
              </div>

              <div className="temp-card">
                <div>
                  <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "UPPERCASE" }}>Outside Temperature</span>
                  <h3 style={{ margin: "4px 0 0", fontSize: "18px", color: "#0f172a" }}>{outsideTemp} °C</h3>
                </div>
                <Thermometer size={22} color="#2563eb" />
              </div>
            </div>

            {/* Active Household Loads Controls */}
            <div className="card">
              <div className="devices-header-actions">
                <h4 style={{ margin: 0, fontSize: "15px" }}>Active Household Loads ({devices.filter(d => d.active).length}/{devices.length})</h4>
                <button className="btn-add-appliance" onClick={() => setShowAddForm(!showAddForm)}>
                  <Plus size={14} /> {showAddForm ? "Cancel" : "Add Appliance"}
                </button>
              </div>

              {showAddForm && (
                <form className="add-device-form" onSubmit={addDevice}>
                  <input 
                    type="text" 
                    placeholder="Appliance Name (e.g. Microwave)" 
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    required
                  />
                  <input 
                    type="number" 
                    placeholder="Power (Watts)" 
                    value={newDevicePower}
                    onChange={(e) => setNewDevicePower(e.target.value)}
                    required
                  />
                  <button type="submit">Save Appliance</button>
                </form>
              )}

              <div className="devices-grid">
                {devices.map((device) => {
                  const Icon = device.icon;
                  return (
                    <div 
                      key={device.id} 
                      className={`device-card ${device.active ? "active" : ""}`} 
                      onClick={() => toggleDevice(device.id)}
                    >
                      <div className="device-header">
                        <Icon size={18} />
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span className="device-status-badge">
                            {device.active ? "ON" : "OFF"}
                          </span>
                          <button 
                            className="delete-btn" 
                            title="Remove Appliance" 
                            onClick={(e) => removeDevice(device.id, e)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="device-card-content">
                        <h4 className="device-title">{device.name}</h4>
                        <span className="device-watt-badge">{device.power} W</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Power Usage Chart */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ margin: 0, fontSize: "15px" }}>24-Hour Consumption Profile</h4>
                <span style={{ fontSize: "12px", color: "#00c853", fontWeight: "600" }}>Live Microgrid Data</span>
              </div>
              <div style={{ width: "100%", height: 180, marginTop: "12px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={initialStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="consumption" fill="#1e293b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Right Side Column */}
          <aside className="side-column">
            {/* CSV Data Import Box */}
            <div className="interactive-csv-card">
              <h4 style={{ margin: "0 0 6px", fontSize: "15px", color: "#0f172a" }}>Import Smart Meter Data</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>
                Upload your raw CSV consumption file to calibrate AI dynamic tariff forecasts & load analytics!
              </p>
              <label htmlFor="csv-file-input" className="csv-upload-btn-large">
                <Upload size={16} /> Choose CSV Data File
              </label>
              <input 
                id="csv-file-input" 
                type="file" 
                accept=".csv" 
                style={{ display: "none" }} 
                onChange={handleFileUpload} 
              />
              <p style={{ margin: "8px 0 0", fontSize: "11px", color: "#64748b" }}>{fileName}</p>
            </div>

            {/* SMS Emergency & Outage Alerts Block */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <MessageSquare size={16} color="#00c853" />
                <h4 style={{ margin: 0, fontSize: "15px" }}>SMS & Grid Alerts</h4>
              </div>
              <div className="sms-alert-box">
                <div>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: "600" }}>Peak Outage Notifications</p>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#64748b" }}>Instant text alert when grid imports spike</p>
                </div>
                <div 
                  className={`switch-toggle ${smsAlerts ? "active" : ""}`} 
                  onClick={() => setSmsAlerts(!smsAlerts)}
                >
                  <div className="switch-circle" />
                </div>
              </div>
            </div>

            {/* Storage Battery */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h4 style={{ margin: 0, fontSize: "15px" }}>Storage Battery</h4>
                <BatteryCharging size={18} color="#00c853" />
              </div>
              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                <h2 style={{ margin: 0, fontSize: "24px", color: "#00c853" }}>{batterySoC}%</h2>
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#64748b" }}>State of Charge (SoC)</p>
              </div>
            </div>

            {/* Grid Flow Telemetry */}
            <div className="card">
              <h4 style={{ margin: "0 0 10px", fontSize: "15px" }}>Grid Telemetry</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#00c853", fontSize: "10px", fontWeight: "700" }}>
                    <ArrowUpRight size={12} /> EXPORT
                  </div>
                  <h4 style={{ margin: "4px 0 0", fontSize: "15px" }}>{Math.max(0, solarGen - activePower)} W</h4>
                </div>
                <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#dc2626", fontSize: "10px", fontWeight: "700" }}>
                    <ArrowDownLeft size={12} /> IMPORT
                  </div>
                  <h4 style={{ margin: "4px 0 0", fontSize: "15px" }}>{Math.max(0, activePower - solarGen)} W</h4>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Dynamic AI Energy Insights */}
        <section className="bottom-insights-container">
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={18} color="#00c853" />
              <h4 style={{ margin: 0, fontSize: "16px" }}>AI Energy Insights & Thermal Load Optimization</h4>
            </div>

            <div className="insights-grid">
              {dynamicInsights.map((item, idx) => (
                <div key={idx} className="insight-card">
                  <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", padding: "2px 6px", borderRadius: "4px", background: "#e8f5e9", color: "#2e7d32" }}>
                    {item.category}
                  </span>
                  <h5 style={{ margin: "8px 0 4px", fontSize: "14px" }}>⚡ {item.title}</h5>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;