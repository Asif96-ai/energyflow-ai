import React, { useEffect, useMemo, useState } from "react";
import EnergyAdvisor from "./EnergyAdvisor";
import {
  Zap,
  Lightbulb,
  Wifi,
  Tv,
  ShieldCheck,
  BatteryCharging,
  LayoutDashboard,
  CreditCard,
  Clock,
  PiggyBank,
  Settings,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Upload,
  LogOut,
  User,
  Flame,
  Thermometer,
  MessageSquare,
  Plus,
  Trash2,
  Bot,
  Sun,
  Gauge,
  Euro,
  Leaf,
  Play,
  RotateCcw,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

import { calculateEnergySystem } from "../utils/energySystem";
import { generateAdvancedInsights } from "../utils/aiEngine";

const initialStats = [
  { day: "12", consumption: 15 },
  { day: "13", consumption: 22 },
  { day: "14", consumption: 18 },
  { day: "15", consumption: 35 },
  { day: "16", consumption: 28 },
  { day: "17", consumption: 24 },
  { day: "18", consumption: 30 },
  { day: "19", consumption: 19 },
  { day: "20", consumption: 26 },
  { day: "21", consumption: 32 },
];

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(
    new Date()
  );

  const [fileName, setFileName] =
    useState("No file chosen");

  const [smsAlerts, setSmsAlerts] = useState(true);

  const [insideTemp] = useState(21.5);
  const [outsideTemp] = useState(11.0);

  const [devices, setDevices] = useState([
    {
      id: "heating",
      name: "Heat Pump HVAC",
      power: 1800,
      active: true,
      icon: Flame,
    },
    {
      id: "light",
      name: "Smart Lighting",
      power: 180,
      active: true,
      icon: Lightbulb,
    },
    {
      id: "internet",
      name: "WiFi Router",
      power: 45,
      active: true,
      icon: Wifi,
    },
    {
      id: "tv",
      name: "Entertainment Unit",
      power: 210,
      active: false,
      icon: Tv,
    },
  ]);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [newDeviceName, setNewDeviceName] =
    useState("");

  const [newDevicePower, setNewDevicePower] =
    useState("");

  const [solarGenerationKW, setSolarGenerationKW] =
    useState(1.2);

  const [batteryStateOfCharge, setBatteryStateOfCharge] =
    useState(82);

  const [aiQuestion, setAIQuestion] =
    useState("");

  const [aiAnswer, setAIAnswer] =
    useState("");

  const [simulationBattery, setSimulationBattery] =
    useState(50);

  const [simulationSolar, setSimulationSolar] =
    useState(1.2);

  const [simulationResult, setSimulationResult] =
    useState(null);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentTime(new Date()),
      1000
    );

    return () => clearInterval(timer);
  }, []);

  const toggleDevice = (id) => {
    setDevices((currentDevices) =>
      currentDevices.map((device) =>
        device.id === id
          ? {
              ...device,
              active: !device.active,
            }
          : device
      )
    );
  };

  const addDevice = (e) => {
    e.preventDefault();

    if (!newDeviceName || !newDevicePower) {
      return;
    }

    const newDevice = {
      id: Date.now().toString(),
      name: newDeviceName,
      power: Number(newDevicePower),
      active: true,
      icon: Zap,
    };

    setDevices((currentDevices) => [
      ...currentDevices,
      newDevice,
    ]);

    setNewDeviceName("");
    setNewDevicePower("");
    setShowAddForm(false);
  };

  const removeDevice = (id, e) => {
    e.stopPropagation();

    setDevices((currentDevices) =>
      currentDevices.filter(
        (device) => device.id !== id
      )
    );
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  /*
   * ---------------------------------------------------------
   * CENTRAL ENERGY MODEL
   * ---------------------------------------------------------
   */

  const energySystem = useMemo(
    () =>
      calculateEnergySystem({
        devices,
        solarGeneration: solarGenerationKW,
        batterySoC: batteryStateOfCharge,
        batteryCapacity: 20,
        voltage: 230,
        powerFactor: 0.94,
        batteryMaxPower: 5,
        electricityPrice: 0.32,
      }),
    [
      devices,
      solarGenerationKW,
      batteryStateOfCharge,
    ]
  );

  /*
   * ---------------------------------------------------------
   * LOCAL AI ENGINE
   * ---------------------------------------------------------
   */

  const aiInsights = useMemo(
    () =>
      generateAdvancedInsights(
        energySystem,
        devices
      ),
    [energySystem, devices]
  );

  /*
   * ---------------------------------------------------------
   * LOCAL AI COPILOT
   * ---------------------------------------------------------
   */

  const answerAIQuestion = () => {
    const question =
      aiQuestion.trim().toLowerCase();

    if (!question) return;

    const {
      totalLoadKW,
      solarKW,
      batterySoC,
      gridImportKW,
      gridExportKW,
      solarSurplusKW,
      solarDeficitKW,
      currentAmps,
      powerFactor,
      estimatedHourlyCost,
    } = energySystem;

    if (
      question.includes("grid") &&
      question.includes("import")
    ) {
      setAIAnswer(
        `Grid import is currently ${gridImportKW.toFixed(
          2
        )} kW. Total demand is ${totalLoadKW.toFixed(
          2
        )} kW while solar generation is ${solarKW.toFixed(
          2
        )} kW. Battery SoC is ${batterySoC.toFixed(
          0
        )}%. The main optimization opportunity is to shift flexible loads toward periods of higher solar generation.`
      );

      return;
    }

    if (
      question.includes("solar") ||
      question.includes("sun")
    ) {
      if (solarSurplusKW > 0) {
        setAIAnswer(
          `Solar generation is currently ${solarKW.toFixed(
            2
          )} kW and exceeds demand by ${solarSurplusKW.toFixed(
            2
          )} kW. This is a good opportunity to charge the battery or activate flexible loads.`
        );
      } else {
        setAIAnswer(
          `Solar generation is currently ${solarKW.toFixed(
            2
          )} kW while demand is ${totalLoadKW.toFixed(
            2
          )} kW. The system has a ${solarDeficitKW.toFixed(
            2
          )} kW generation deficit.`
        );
      }

      return;
    }

    if (
      question.includes("battery") ||
      question.includes("charge")
    ) {
      setAIAnswer(
        `Battery state of charge is ${batterySoC.toFixed(
          0
        )}%. ${
          batterySoC < 20
            ? "The battery is low and should be prioritized for charging."
            : batterySoC > 90
            ? "The battery is almost full, so additional solar may need to be exported or consumed by flexible loads."
            : "The battery is in a moderate operating range."
        }`
      );

      return;
    }

    if (
      question.includes("power factor") ||
      question.includes("pf")
    ) {
      setAIAnswer(
        `The simulated power factor is ${powerFactor.toFixed(
          2
        )}. Current demand is approximately ${currentAmps.toFixed(
          2
        )} A at 230 V. A lower power factor would indicate increased reactive power demand.`
      );

      return;
    }

    if (
      question.includes("cost") ||
      question.includes("price")
    ) {
      setAIAnswer(
        `At the configured electricity price of €0.32/kWh, current grid demand corresponds to approximately €${estimatedHourlyCost.toFixed(
          2
        )} per hour. Reducing grid import or shifting flexible loads can reduce this cost.`
      );

      return;
    }

    setAIAnswer(
      `Current system status: ${energySystem.systemStatus}. Demand is ${totalLoadKW.toFixed(
        2
      )} kW, solar generation is ${solarKW.toFixed(
        2
      )} kW, battery SoC is ${batterySoC.toFixed(
        0
      )}%, and grid import is ${gridImportKW.toFixed(
        2
      )} kW. Try asking about grid import, solar, battery, cost or power factor.`
    );
  };

  /*
   * ---------------------------------------------------------
   * WHAT-IF SIMULATOR
   * ---------------------------------------------------------
   */

const runSimulation = () => {
  const currentModel = energySystem;

  const simulatedModel = calculateEnergySystem({
    devices,
    solarGeneration: simulationSolar,

    // What-If battery slider represents SOC
    batterySoC: simulationBattery,

    // Fixed simulated battery capacity
    batteryCapacity: 20,

    voltage: 230,
    powerFactor: 0.94,
    batteryMaxPower: 5,
    electricityPrice: 0.32,
  });

  const currentGrid =
    Number(currentModel.gridImportKW) || 0;

  const simulatedGrid =
    Number(simulatedModel.gridImportKW) || 0;

  const gridDifference =
    currentGrid - simulatedGrid;

  const gridImprovementPercent =
    currentGrid > 0
      ? (gridDifference / currentGrid) * 100
      : 0;

  setSimulationResult({
    currentGrid,
    simulatedGrid,

    currentSolar:
      Number(currentModel.solarKW) || 0,

    simulatedSolar:
      Number(simulatedModel.solarKW) || 0,

    currentBattery:
      Number(currentModel.batterySoC) || 0,

    simulatedBattery:
      Number(simulatedModel.batterySoC) || 0,

    gridDifference,

    gridImprovementPercent,

    costDifference:
      (Number(
        currentModel.estimatedHourlyCost
      ) || 0) -
      (Number(
        simulatedModel.estimatedHourlyCost
      ) || 0),
  });
};
 const resetSimulation = () => {
  setSimulationBattery(50);
  setSimulationSolar(1.2);
  setSimulationResult(null);
};
  /*
   * ---------------------------------------------------------
   * SIMULATED 24-HOUR PROFILE
   * ---------------------------------------------------------
   */

  const liveChartData = initialStats.map(
    (item, index) => ({
      ...item,
      solar: Number(
        (
          solarGenerationKW *
          Math.max(
            0,
            Math.sin(
              ((index - 2) / 10) *
                Math.PI
            )
          )
        ).toFixed(1)
      ),
    })
  );

  return (
    <div className="app-wrapper">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Zap
            size={22}
            color="#00e676"
          />
          <span>EnergyFlow AI</span>
        </div>

        <nav className="nav-group">
          <div className="nav-item active">
            <LayoutDashboard size={18} />
            Dashboard
          </div>

          <div className="nav-item">
            <CreditCard size={18} />
            Service Request
          </div>

          <div className="nav-item">
            <Clock size={18} />
            Energy Consumption
          </div>

          <div className="nav-item">
            <PiggyBank size={18} />
            Savings & Tariffs
          </div>

          <div className="nav-item">
            <Settings size={18} />
            Settings
          </div>
        </nav>

        <div className="premium-card">
          <ShieldCheck
            size={26}
            style={{
              margin: "0 auto 6px",
            }}
          />

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Energy Intelligence
          </p>

          <p
            style={{
              margin: "4px 0 0",
              fontSize: "11px",
              opacity: 0.8,
            }}
          >
            Local AI energy optimization
            engine
          </p>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-btn-logout">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-container">
        <header className="top-header">
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "700",
              }}
            >
              Energy Command Center
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              AI-powered microgrid analytics,
              simulation & load management
            </p>
          </div>

          <div className="header-right-tools">
            <div className="clock-badge">
              <Clock
                size={16}
                color="#00c853"
              />
              <span>
                {currentTime.toLocaleTimeString()}
              </span>
            </div>

            <div className="user-profile-box">
              <div
                style={{
                  textAlign: "right",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#0f172a",
                  }}
                >
                  Asif96-ai
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "#00c853",
                    fontWeight: "600",
                  }}
                >
                  AI Energy Lab
                </p>
              </div>

              <div className="user-avatar">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          <section className="main-column">
            {/* KPI CARDS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(4, 1fr)",
                gap: "12px",
              }}
            >
              <div
                className="card"
                style={{
                  padding: "14px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    fontWeight: "600",
                  }}
                >
                  ACTIVE POWER
                </span>

                <h3
                  style={{
                    margin: "6px 0 0",
                    fontSize: "18px",
                  }}
                >
                  {
                    energySystem.totalLoadWatts
                  }{" "}
                  W
                </h3>
              </div>

              <div
                className="card"
                style={{
                  padding: "14px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    fontWeight: "600",
                  }}
                >
                  POWER FACTOR
                </span>

                <h3
                  style={{
                    margin: "6px 0 0",
                    fontSize: "18px",
                    color: "#00c853",
                  }}
                >
                  {
                    energySystem.powerFactor
                  }
                </h3>
              </div>

              <div
                className="card"
                style={{
                  padding: "14px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    fontWeight: "600",
                  }}
                >
                  MAINS VOLTAGE
                </span>

                <h3
                  style={{
                    margin: "6px 0 0",
                    fontSize: "18px",
                  }}
                >
                  {energySystem.voltage} V
                </h3>
              </div>

              <div
                className="card"
                style={{
                  padding: "14px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    fontWeight: "600",
                  }}
                >
                  CURRENT
                </span>

                <h3
                  style={{
                    margin: "6px 0 0",
                    fontSize: "18px",
                  }}
                >
                  {
                    energySystem.currentAmps
                  }{" "}
                  A
                </h3>
              </div>
            </div>

            {/* ENGINEERING KPIs */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(4, 1fr)",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              <div className="card">
                <Sun
                  size={18}
                  color="#f59e0b"
                />

                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  SOLAR
                </p>

                <strong>
                  {energySystem.solarKW} kW
                </strong>
              </div>

              <div className="card">
                <BatteryCharging
                  size={18}
                  color="#00c853"
                />

                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  BATTERY
                </p>

                <strong>
                  {energySystem.batterySoC}%
                </strong>
              </div>

              <div className="card">
                <Gauge
                  size={18}
                  color="#2563eb"
                />

                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  GRID IMPORT
                </p>

                <strong>
                  {
                    energySystem.gridImportKW
                  }{" "}
                  kW
                </strong>
              </div>

              <div className="card">
                <Euro
                  size={18}
                  color="#7c3aed"
                />

                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  EST. COST / H
                </p>

                <strong>
                  €
                  {
                    energySystem.estimatedHourlyCost
                  }
                </strong>
              </div>
            </div>

            {/* TEMPERATURE */}

            <div className="temp-grid">
              <div className="temp-card">
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      fontWeight: "600",
                    }}
                  >
                    Inside Home Temperature
                  </span>

                  <h3
                    style={{
                      margin: "4px 0 0",
                      fontSize: "18px",
                    }}
                  >
                    {insideTemp} °C
                  </h3>
                </div>

                <Flame
                  size={22}
                  color="#dc2626"
                />
              </div>

              <div className="temp-card">
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      fontWeight: "600",
                    }}
                  >
                    Outside Temperature
                  </span>

                  <h3
                    style={{
                      margin: "4px 0 0",
                      fontSize: "18px",
                    }}
                  >
                    {outsideTemp} °C
                  </h3>
                </div>

                <Thermometer
                  size={22}
                  color="#2563eb"
                />
              </div>
            </div>

            {/* SOLAR CONTROL */}

            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: "15px",
                  }}
                >
                  Solar Generation
                </h4>

                <strong>
                  {solarGenerationKW} kW
                </strong>
              </div>

              <input
                type="range"
                min="0"
                max="8"
                step="0.1"
                value={solarGenerationKW}
                onChange={(e) =>
                  setSolarGenerationKW(
                    Number(e.target.value)
                  )
                }
                style={{
                  width: "100%",
                  marginTop: "12px",
                }}
              />

              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                Adjust simulated PV output to
                observe AI recommendations.
              </p>
            </div>

            {/* DEVICE CONTROL */}

            <div className="card">
              <div className="devices-header-actions">
                <h4
                  style={{
                    margin: 0,
                    fontSize: "15px",
                  }}
                >
                  Active Household Loads (
                  {
                    devices.filter(
                      (d) => d.active
                    ).length
                  }
                  /{devices.length})
                </h4>

                <button
                  className="btn-add-appliance"
                  onClick={() =>
                    setShowAddForm(
                      !showAddForm
                    )
                  }
                >
                  <Plus size={14} />

                  {showAddForm
                    ? "Cancel"
                    : "Add Appliance"}
                </button>
              </div>

              {showAddForm && (
                <form
                  className="add-device-form"
                  onSubmit={addDevice}
                >
                  <input
                    type="text"
                    placeholder="Appliance Name"
                    value={newDeviceName}
                    onChange={(e) =>
                      setNewDeviceName(
                        e.target.value
                      )
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Power (Watts)"
                    value={newDevicePower}
                    onChange={(e) =>
                      setNewDevicePower(
                        e.target.value
                      )
                    }
                    required
                  />

                  <button type="submit">
                    Save Appliance
                  </button>
                </form>
              )}

              <div className="devices-grid">
                {devices.map((device) => {
                  const Icon =
                    device.icon;

                  return (
                    <div
                      key={device.id}
                      className={`device-card ${
                        device.active
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        toggleDevice(
                          device.id
                        )
                      }
                    >
                      <div className="device-header">
                        <Icon size={18} />

                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "8px",
                          }}
                        >
                          <span className="device-status-badge">
                            {device.active
                              ? "ON"
                              : "OFF"}
                          </span>

                          <button
                            className="delete-btn"
                            title="Remove Appliance"
                            onClick={(e) =>
                              removeDevice(
                                device.id,
                                e
                              )
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="device-card-content">
                        <h4 className="device-title">
                          {device.name}
                        </h4>

                        <span className="device-watt-badge">
                          {device.power} W
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* POWER PROFILE */}

            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: "15px",
                  }}
                >
                  Energy Consumption & Solar Profile
                </h4>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#00c853",
                    fontWeight: "600",
                  }}
                >
                  Live Simulation
                </span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: 200,
                  marginTop: "12px",
                }}
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={liveChartData}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />

                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      hide
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="consumption"
                      stroke="#1e293b"
                      strokeWidth={2}
                      dot={false}
                    />

                    <Line
                      type="monotone"
                      dataKey="solar"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN */}

          <aside className="side-column">
            {/* SYSTEM STATUS */}

            <div className="card">
              <h4
                style={{
                  margin: "0 0 10px",
                  fontSize: "15px",
                }}
              >
                System Status
              </h4>

              <div
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  background:
                    "#f0fdf4",
                  border:
                    "1px solid #bbf7d0",
                }}
              >
                <strong
                  style={{
                    color: "#15803d",
                  }}
                >
                  {energySystem.systemStatus}
                </strong>

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  Local engineering
                  intelligence active
                </p>
              </div>
            </div>

            {/* CSV */}

            <div className="interactive-csv-card">
              <h4
                style={{
                  margin: "0 0 6px",
                  fontSize: "15px",
                }}
              >
                Import Smart Meter Data
              </h4>

              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Upload a CSV file for future
                energy analytics.
              </p>

              <label
                htmlFor="csv-file-input"
                className="csv-upload-btn-large"
              >
                <Upload size={16} />
                Choose CSV Data File
              </label>

              <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                style={{
                  display: "none",
                }}
                onChange={
                  handleFileUpload
                }
              />

              <p
                style={{
                  margin:
                    "8px 0 0",
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                {fileName}
              </p>
            </div>

            {/* BATTERY */}

            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: "15px",
                  }}
                >
                  Storage Battery
                </h4>

                <BatteryCharging
                  size={18}
                  color="#00c853"
                />
              </div>

              <div
                style={{
                  marginTop: "10px",
                  background:
                    "#f8fafc",
                  padding: "12px",
                  borderRadius: "10px",
                  textAlign: "center",
                  border:
                    "1px solid #e2e8f0",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    color: "#00c853",
                  }}
                >
                  {
                    energySystem.batterySoC
                  }
                  %
                </h2>

                <p
                  style={{
                    margin:
                      "2px 0 0",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  State of Charge
                </p>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={
                  batteryStateOfCharge
                }
                onChange={(e) =>
                  setBatteryStateOfCharge(
                    Number(
                      e.target.value
                    )
                  )
                }
                style={{
                  width: "100%",
                  marginTop: "12px",
                }}
              />
            </div>

            {/* GRID */}

            <div className="card">
              <h4
                style={{
                  margin:
                    "0 0 10px",
                  fontSize: "15px",
                }}
              >
                Grid Telemetry
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    background:
                      "#f8fafc",
                    padding: "10px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      color: "#00c853",
                      fontSize: "10px",
                      fontWeight: "700",
                    }}
                  >
                    <ArrowUpRight
                      size={12}
                    />
                    EXPORT
                  </div>

                  <h4
                    style={{
                      margin:
                        "4px 0 0",
                    }}
                  >
                    {
                      energySystem.gridExportKW
                    }{" "}
                    kW
                  </h4>
                </div>

                <div
                  style={{
                    background:
                      "#f8fafc",
                    padding: "10px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      color: "#dc2626",
                      fontSize: "10px",
                      fontWeight: "700",
                    }}
                  >
                    <ArrowDownLeft
                      size={12}
                    />
                    IMPORT
                  </div>

                  <h4
                    style={{
                      margin:
                        "4px 0 0",
                    }}
                  >
                    {
                      energySystem.gridImportKW
                    }{" "}
                    kW
                  </h4>
                </div>
              </div>
            </div>

            {/* AI COPILOT */}

            <div className="card">
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "8px",
                  marginBottom:
                    "10px",
                }}
              >
                <Bot
                  size={18}
                  color="#7c3aed"
                />

                <h4
                  style={{
                    margin: 0,
                  }}
                >
                  EnergyFlow AI Copilot
                </h4>
              </div>

              <textarea
                value={aiQuestion}
                onChange={(e) =>
                  setAIQuestion(
                    e.target.value
                  )
                }
                placeholder="Ask: Why is my grid import high?"
                rows={3}
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius:
                    "8px",
                  padding: "8px",
                  resize: "vertical",
                }}
              />

              <button
                onClick={
                  answerAIQuestion
                }
                style={{
                  marginTop: "8px",
                  width: "100%",
                  padding: "9px",
                  border: "none",
                  borderRadius:
                    "8px",
                  background:
                    "#0f172a",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <Bot
                  size={14}
                  style={{
                    verticalAlign:
                      "middle",
                    marginRight:
                      "5px",
                  }}
                />
                Analyze System
              </button>

              {aiAnswer && (
                <div
                  style={{
                    marginTop:
                      "10px",
                    padding: "10px",
                    borderRadius:
                      "8px",
                    background:
                      "#f8fafc",
                    fontSize:
                      "12px",
                    lineHeight:
                      "1.5",
                    color:
                      "#334155",
                  }}
                >
                  {aiAnswer}
                </div>
              )}
            </div>

            {/* SMS */}

            <div className="card">
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "8px",
                }}
              >
                <MessageSquare
                  size={16}
                  color="#00c853"
                />

                <h4
                  style={{
                    margin: 0,
                  }}
                >
                  Grid Alerts
                </h4>
              </div>

              <div
                className="sms-alert-box"
                style={{
                  marginTop: "10px",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize:
                        "13px",
                      fontWeight:
                        "600",
                    }}
                  >
                    Peak Demand Alerts
                  </p>

                  <p
                    style={{
                      margin:
                        "2px 0 0",
                      fontSize:
                        "11px",
                      color:
                        "#64748b",
                    }}
                  >
                    Local simulation
                    alert system
                  </p>
                </div>

                <div
                  className={`switch-toggle ${
                    smsAlerts
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setSmsAlerts(
                      !smsAlerts
                    )
                  }
                >
                  <div className="switch-circle" />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* WHAT-IF SIMULATOR */}

        <section
          style={{
            marginTop: "16px",
          }}
        >
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "12px",
              }}
            >
              <div>
                <h4
                  style={{
                    margin: 0,
                    fontSize:
                      "17px",
                  }}
                >
                  <Play
                    size={17}
                    style={{
                      verticalAlign:
                        "middle",
                      marginRight:
                        "6px",
                    }}
                  />
                  What-If Energy Simulator
                </h4>

                <p
                  style={{
                    margin:
                      "4px 0 0",
                    fontSize:
                      "12px",
                    color:
                      "#64748b",
                  }}
                >
                  Test alternative
                  energy-system
                  configurations without
                  changing the live system.
                </p>
              </div>

              <button
                onClick={
                  resetSimulation
                }
                style={{
                  border:
                    "1px solid #e2e8f0",
                  background:
                    "white",
                  borderRadius:
                    "8px",
                  padding:
                    "7px 10px",
                  cursor:
                    "pointer",
                }}
              >
                <RotateCcw
                  size={14}
                />
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize:
                      "12px",
                    fontWeight:
                      "600",
                  }}
                >
                  <div>
  <label
    style={{
      fontSize: "12px",
      fontWeight: "600",
    }}
  >
    Simulated Battery SOC:{" "}
    {simulationBattery}%
  </label>

  <input
    type="range"
    min="0"
    max="100"
    step="5"
    value={simulationBattery}
    onChange={(e) =>
      setSimulationBattery(
        Number(e.target.value)
      )
    }
    style={{
      width: "100%",
      marginTop: "8px",
    }}
  />

  <p
    style={{
      margin: "5px 0 0",
      fontSize: "11px",
      color: "#64748b",
    }}
  >
    Test different battery charge levels.
  </p>
</div>
                  Simulated Solar:
                  {" "}
                  {
                    simulationSolar
                  }{" "}
                  kW
                </label>

                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.1"
                  value={
                    simulationSolar
                  }
                  onChange={(e) =>
                    setSimulationSolar(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  style={{
                    width:
                      "100%",
                  }}
                />
              </div>
            </div>

            <button
              onClick={
                runSimulation
              }
              style={{
                marginTop:
                  "15px",
                padding:
                  "10px 16px",
                border: "none",
                borderRadius:
                  "8px",
                background:
                  "#00c853",
                color:
                  "#052e16",
                fontWeight:
                  "700",
                cursor:
                  "pointer",
              }}
            >
              Run Energy Simulation
            </button>

           {simulationResult && (
  <div style={{ marginTop: "18px" }}>

    {/* =====================================================
        SIMULATION RESULT CARDS
    ===================================================== */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "10px",
      }}
    >

      {/* CURRENT GRID */}

      <div
        style={{
          padding: "14px",
          background: "#f8fafc",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
        }}
      >
        <small
          style={{
            color: "#64748b",
            fontWeight: "600",
          }}
        >
          Current Grid
        </small>

        <strong
          style={{
            display: "block",
            marginTop: "6px",
            fontSize: "20px",
          }}
        >
          {simulationResult.currentGrid.toFixed(2)} kW
        </strong>

        <small
          style={{
            color: "#64748b",
          }}
        >
          Current grid import
        </small>
      </div>


      {/* SIMULATED GRID */}

      <div
        style={{
          padding: "14px",
          background: "#f8fafc",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
        }}
      >
        <small
          style={{
            color: "#64748b",
            fontWeight: "600",
          }}
        >
          Simulated Grid
        </small>

        <strong
          style={{
            display: "block",
            marginTop: "6px",
            fontSize: "20px",
          }}
        >
          {simulationResult.simulatedGrid.toFixed(2)} kW
        </strong>

        <small
          style={{
            color: "#64748b",
          }}
        >
          Grid import after scenario
        </small>
      </div>


      {/* GRID REDUCTION */}

      <div
        style={{
          padding: "14px",
          background:
            simulationResult.gridDifference >= 0
              ? "#f0fdf4"
              : "#fef2f2",
          borderRadius: "10px",
          border:
            simulationResult.gridDifference >= 0
              ? "1px solid #bbf7d0"
              : "1px solid #fecaca",
        }}
      >
        <small
          style={{
            color: "#64748b",
            fontWeight: "600",
          }}
        >
          Grid Reduction
        </small>

        <strong
          style={{
            display: "block",
            marginTop: "6px",
            fontSize: "20px",
          }}
        >
          {simulationResult.gridDifference >= 0
            ? "↓ "
            : "↑ "}

          {Math.abs(
            simulationResult.gridDifference
          ).toFixed(2)}{" "}
          kW
        </strong>

        <small
          style={{
            color: "#64748b",
          }}
        >
          Change in grid import
        </small>
      </div>


      {/* IMPROVEMENT */}

      <div
        style={{
          padding: "14px",
          background:
            simulationResult.gridImprovementPercent >= 0
              ? "#f0fdf4"
              : "#fef2f2",
          borderRadius: "10px",
          border:
            simulationResult.gridImprovementPercent >= 0
              ? "1px solid #bbf7d0"
              : "1px solid #fecaca",
        }}
      >
        <small
          style={{
            color: "#64748b",
            fontWeight: "600",
          }}
        >
          Grid Import Reduction
        </small>

        <strong
          style={{
            display: "block",
            marginTop: "6px",
            fontSize: "20px",
          }}
        >
          {simulationResult.gridImprovementPercent >= 0
            ? "↓ "
            : "↑ "}

          {Math.abs(
            simulationResult.gridImprovementPercent
          ).toFixed(1)}%
        </strong>

        <small
          style={{
            color: "#64748b",
          }}
        >
          Relative change in grid dependency
        </small>
      </div>

    </div>


    {/* =====================================================
        SCENARIO COMPARISON
    ===================================================== */}

    <div
      style={{
        marginTop: "15px",
        padding: "16px",
        background: "#ffffff",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
      }}
    >

      <h4
        style={{
          margin: "0 0 12px 0",
          fontSize: "15px",
        }}
      >
        What-If Scenario Comparison
      </h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1.2fr 1fr 1fr 1fr",
          gap: "8px",
          fontSize: "13px",
        }}
      >

        {/* HEADER */}

        <strong>Parameter</strong>
        <strong>Current</strong>
        <strong>Simulated</strong>
        <strong>Change</strong>


        {/* SOLAR */}

        <span>Solar Generation</span>

        <span>
          {simulationResult.currentSolar.toFixed(2)} kW
        </span>

        <span>
          {simulationResult.simulatedSolar.toFixed(2)} kW
        </span>

        <span>
          {(
            simulationResult.simulatedSolar -
            simulationResult.currentSolar
          ).toFixed(2)}{" "}
          kW
        </span>


        {/* BATTERY */}

        <span>Battery SoC</span>

        <span>
          {simulationResult.currentBattery.toFixed(0)}%
        </span>

        <span>
          {simulationResult.simulatedBattery.toFixed(0)}%
        </span>

        <span>
          {(
            simulationResult.simulatedBattery -
            simulationResult.currentBattery
          ).toFixed(0)}{" "}
          pts
        </span>


        {/* GRID */}

        <span>Grid Import</span>

        <span>
          {simulationResult.currentGrid.toFixed(2)} kW
        </span>

        <span>
          {simulationResult.simulatedGrid.toFixed(2)} kW
        </span>

        <span>
          {simulationResult.gridDifference >= 0
            ? "-"
            : "+"}
          {Math.abs(
            simulationResult.gridDifference
          ).toFixed(2)}{" "}
          kW
        </span>

      </div>
    </div>


    {/* =====================================================
        ENGINEERING INTERPRETATION
    ===================================================== */}

    <div
      style={{
        marginTop: "15px",
        padding: "16px",
        background: "#f8fafc",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
      }}
    >

      <h4
        style={{
          margin: "0 0 8px 0",
          fontSize: "15px",
        }}
      >
        Energy Impact
      </h4>

      <p
        style={{
          margin: 0,
          lineHeight: 1.6,
          color: "#475569",
          fontSize: "13px",
        }}
      >

        {simulationResult.gridDifference > 0 ? (
          <>
            The simulated scenario reduces grid import by{" "}
            <strong>
              {simulationResult.gridDifference.toFixed(2)} kW
            </strong>
            , corresponding to a{" "}
            <strong>
              {simulationResult.gridImprovementPercent.toFixed(1)}%
            </strong>{" "}
            reduction in grid dependency under the selected
            load conditions.
          </>
        ) : simulationResult.gridDifference < 0 ? (
          <>
            The simulated scenario increases grid import by{" "}
            <strong>
              {Math.abs(
                simulationResult.gridDifference
              ).toFixed(2)} kW
            </strong>
            . The selected scenario therefore increases
            grid dependency compared with the current system.
          </>
        ) : (
          <>
            The simulated scenario produces the same grid
            import as the current operating condition.
            No grid-import improvement was detected.
          </>
        )}

      </p>

    </div>


    {/* =====================================================
        SCENARIO DETAILS
    ===================================================== */}

    <div
      style={{
        marginTop: "12px",
        padding: "14px",
        background: "#f8fafc",
        borderRadius: "10px",
      }}
    >

      <small
        style={{
          display: "block",
          fontWeight: "600",
          marginBottom: "6px",
        }}
      >
        Scenario Details
      </small>

      <div
        style={{
          fontSize: "12px",
          color: "#64748b",
          lineHeight: 1.7,
        }}
      >

        Solar generation changes from{" "}
        <strong>
          {simulationResult.currentSolar.toFixed(2)} kW
        </strong>{" "}
        to{" "}
        <strong>
          {simulationResult.simulatedSolar.toFixed(2)} kW
        </strong>
        .

        <br />

        Battery state of charge changes from{" "}
        <strong>
          {simulationResult.currentBattery.toFixed(0)}%
        </strong>{" "}
        to{" "}
        <strong>
          {simulationResult.simulatedBattery.toFixed(0)}%
        </strong>
        .

        <br />

        Grid import changes from{" "}
        <strong>
          {simulationResult.currentGrid.toFixed(2)} kW
        </strong>{" "}
        to{" "}
        <strong>
          {simulationResult.simulatedGrid.toFixed(2)} kW
        </strong>
        .

      </div>

    </div>

  </div>
)}
          </div>
        </section>

        {/* AI INSIGHTS */}

        <section className="bottom-insights-container">
          <div className="card">
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "8px",
              }}
            >
              <Sparkles
                size={18}
                color="#00c853"
              />

              <h4
                style={{
                  margin: 0,
                  fontSize:
                    "16px",
                }}
              >
                Local AI Energy Intelligence
              </h4>
            </div>

            <div className="insights-grid">
              {aiInsights.map(
                (item, idx) => (
                  <div
                    key={idx}
                    className="insight-card"
                  >
                    <span
                      style={{
                        fontSize:
                          "10px",
                        fontWeight:
                          "700",
                        textTransform:
                          "uppercase",
                        padding:
                          "2px 6px",
                        borderRadius:
                          "4px",
                        background:
                          item.severity ===
                          "warning"
                            ? "#fef3c7"
                            : item.severity ===
                              "success"
                            ? "#dcfce7"
                            : "#e0f2fe",
                        color:
                          item.severity ===
                          "warning"
                            ? "#92400e"
                            : item.severity ===
                              "success"
                            ? "#166534"
                            : "#075985",
                      }}
                    >
                      {item.category}
                    </span>

                    <h5
                      style={{
                        margin:
                          "8px 0 4px",
                        fontSize:
                          "14px",
                      }}
                    >
                      ⚡ {item.title}
                    </h5>

                    <p
                      style={{
                        margin: 0,
                        fontSize:
                          "12px",
                        color:
                          "#64748b",
                        lineHeight:
                          "1.5",
                      }}
                    >
                      {
                        item.description
                      }
                    </p>

                    <p
                      style={{
                        margin:
                          "8px 0 0",
                        fontSize:
                          "11px",
                        fontWeight:
                          "600",
                        color:
                          "#0f172a",
                      }}
                    >
                      Recommendation:
                      {" "}
                      {
                        item.recommendation
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
  {/* V2.1 ENERGY ADVISOR */}

        <EnergyAdvisor
          activePower={energySystem.totalLoadKW}
          voltage={energySystem.voltage}
          powerFactor={energySystem.powerFactor}
          current={energySystem.currentAmps}
          solarGen={energySystem.solarKW}
          batterySoC={energySystem.batterySoC}
        />
        {/* FOOTER METRICS */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "12px",
            marginTop:
              "12px",
            marginBottom:
              "20px",
          }}
        >
          <div className="card">
            <Leaf
              size={18}
              color="#16a34a"
            />

            <strong
              style={{
                display:
                  "block",
                marginTop:
                  "6px",
              }}
            >
              {
                energySystem.estimatedHourlyCO2
              }{" "}
              kg CO₂/h
            </strong>

            <small>
              Estimated grid emissions
            </small>
          </div>

          <div className="card">
            <Gauge
              size={18}
              color="#2563eb"
            />

            <strong
              style={{
                display:
                  "block",
                marginTop:
                  "6px",
              }}
            >
              {
                energySystem.renewableUtilization
              }
              %
            </strong>

            <small>
              Renewable utilization
            </small>
          </div>

          <div className="card">
            <BatteryCharging
              size={18}
              color="#7c3aed"
            />

            <strong
              style={{
                display:
                  "block",
                marginTop:
                  "6px",
              }}
            >
              {
                energySystem.batteryEnergyKWh
              }{" "}
              kWh
            </strong>

            <small>
              Stored battery energy
            </small>
          </div>
        </section>
      </main>
    </div>
  );
}
export default Dashboard;