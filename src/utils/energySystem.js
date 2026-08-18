/**
 * EnergyFlow AI
 * Local Energy System Simulation & Engineering Calculations
 *
 * No API key required.
 * All calculations run locally in the browser.
 */

export function calculateEnergySystem({
  devices = [],
  solarGeneration = 0,
  batterySoC = 50,
  batteryCapacity = 20,
  voltage = 230,
  powerFactor = 0.94,
  batteryMaxPower = 5,
  electricityPrice = 0.32,
}) {
  // ---------------------------------------------------------
  // 1. Calculate active electrical load
  // ---------------------------------------------------------

  const activeDevices = devices.filter((device) => device.active);

  const totalLoadWatts = activeDevices.reduce(
    (total, device) => total + Number(device.power || 0),
    0
  );

  const totalLoadKW = totalLoadWatts / 1000;

  // ---------------------------------------------------------
  // 2. Electrical calculations
  // ---------------------------------------------------------

  const apparentPowerVA =
    powerFactor > 0
      ? totalLoadWatts / powerFactor
      : totalLoadWatts;

  const currentAmps =
    voltage > 0
      ? totalLoadWatts / (voltage * powerFactor)
      : 0;

  const reactivePowerVAR = Math.sqrt(
    Math.max(
      0,
      Math.pow(apparentPowerVA, 2) -
        Math.pow(totalLoadWatts, 2)
    )
  );

  // ---------------------------------------------------------
  // 3. Solar contribution
  // ---------------------------------------------------------

  const solarKW = Math.max(0, Number(solarGeneration) || 0);

  const solarCoverage =
    totalLoadKW > 0
      ? Math.min((solarKW / totalLoadKW) * 100, 100)
      : 0;

  const solarSurplusKW = Math.max(
    0,
    solarKW - totalLoadKW
  );

  const solarDeficitKW = Math.max(
    0,
    totalLoadKW - solarKW
  );

  // ---------------------------------------------------------
  // 4. Battery state
  // ---------------------------------------------------------

  const safeBatterySoC = Math.min(
    100,
    Math.max(0, Number(batterySoC) || 0)
  );

  const safeBatteryCapacity = Math.max(
    0,
    Number(batteryCapacity) || 0
  );

  const batteryEnergyKWh =
    safeBatteryCapacity * (safeBatterySoC / 100);

  // ---------------------------------------------------------
  // 5. Grid interaction
  //
  // Positive = grid import
  // Negative = grid export
  // ---------------------------------------------------------

  let batteryPowerKW = 0;

  // If solar exceeds the load, use surplus solar to charge battery.
  if (solarSurplusKW > 0 && safeBatterySoC < 100) {
    batteryPowerKW = -Math.min(
      solarSurplusKW,
      batteryMaxPower
    );
  }

  // If solar cannot cover demand, battery can assist.
  if (solarDeficitKW > 0 && safeBatterySoC > 10) {
    batteryPowerKW = Math.min(
      solarDeficitKW,
      batteryMaxPower
    );
  }

  const netGridPowerKW =
    totalLoadKW - solarKW + batteryPowerKW;

  const gridImportKW = Math.max(
    0,
    netGridPowerKW
  );

  const gridExportKW = Math.max(
    0,
    -netGridPowerKW
  );

  // ---------------------------------------------------------
  // 6. Estimated cost
  // ---------------------------------------------------------

  const estimatedHourlyCost =
    gridImportKW * electricityPrice;

  // ---------------------------------------------------------
  // 7. Renewable utilization
  // ---------------------------------------------------------

  const renewableUtilization =
    solarKW > 0
      ? Math.min(
          ((solarKW - solarSurplusKW) / solarKW) * 100,
          100
        )
      : 0;

  // ---------------------------------------------------------
  // 8. CO2 estimation
  //
  // Approximation only for simulation purposes.
  // 0.4 kg CO2/kWh grid electricity.
  // ---------------------------------------------------------

  const estimatedHourlyCO2 =
    gridImportKW * 0.4;

  // ---------------------------------------------------------
  // 9. System status
  // ---------------------------------------------------------

  let systemStatus = "OPTIMAL";

  if (gridImportKW > totalLoadKW * 0.7) {
    systemStatus = "HIGH GRID DEPENDENCY";
  } else if (safeBatterySoC < 20) {
    systemStatus = "LOW BATTERY";
  } else if (solarSurplusKW > 0) {
    systemStatus = "SOLAR SURPLUS";
  }

  // ---------------------------------------------------------
  // Return complete engineering model
  // ---------------------------------------------------------

  return {
    activeDevices,

    totalLoadWatts: Number(totalLoadWatts.toFixed(2)),
    totalLoadKW: Number(totalLoadKW.toFixed(2)),

    voltage,
    powerFactor,

    currentAmps: Number(currentAmps.toFixed(2)),
    apparentPowerVA: Number(apparentPowerVA.toFixed(2)),
    reactivePowerVAR: Number(reactivePowerVAR.toFixed(2)),

    solarKW: Number(solarKW.toFixed(2)),
    solarCoverage: Number(solarCoverage.toFixed(1)),
    solarSurplusKW: Number(solarSurplusKW.toFixed(2)),
    solarDeficitKW: Number(solarDeficitKW.toFixed(2)),

    batterySoC: Number(safeBatterySoC.toFixed(1)),
    batteryCapacityKWh: Number(
      safeBatteryCapacity.toFixed(1)
    ),
    batteryEnergyKWh: Number(
      batteryEnergyKWh.toFixed(2)
    ),
    batteryPowerKW: Number(
      batteryPowerKW.toFixed(2)
    ),

    gridImportKW: Number(
      gridImportKW.toFixed(2)
    ),
    gridExportKW: Number(
      gridExportKW.toFixed(2)
    ),

    renewableUtilization: Number(
      renewableUtilization.toFixed(1)
    ),

    estimatedHourlyCost: Number(
      estimatedHourlyCost.toFixed(2)
    ),

    estimatedHourlyCO2: Number(
      estimatedHourlyCO2.toFixed(2)
    ),

    systemStatus,
  };
}