/**
 * EnergyFlow AI
 * Local Energy System Simulation Engine
 *
 * No external API required.
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
  const activeDevices = devices.filter(
    (device) => device.active
  );

  const totalLoadWatts = activeDevices.reduce(
    (total, device) =>
      total + Number(device.power || 0),
    0
  );

  const totalLoadKW = totalLoadWatts / 1000;

  const safePF =
    Math.min(1, Math.max(0.5, Number(powerFactor) || 0.94));

  const apparentPowerVA =
    safePF > 0
      ? totalLoadWatts / safePF
      : 0;

  const currentAmps =
    voltage > 0
      ? totalLoadWatts /
        (voltage * safePF)
      : 0;

  const reactivePowerVAR = Math.sqrt(
    Math.max(
      0,
      apparentPowerVA ** 2 -
        totalLoadWatts ** 2
    )
  );

  const solarKW = Math.max(
    0,
    Number(solarGeneration) || 0
  );

  const solarCoverage =
    totalLoadKW > 0
      ? Math.min(
          (solarKW / totalLoadKW) * 100,
          100
        )
      : 0;

  const solarSurplusKW = Math.max(
    0,
    solarKW - totalLoadKW
  );

  const solarDeficitKW = Math.max(
    0,
    totalLoadKW - solarKW
  );

  const safeSoC = Math.min(
    100,
    Math.max(0, Number(batterySoC) || 0)
  );

  const safeCapacity = Math.max(
    0,
    Number(batteryCapacity) || 0
  );

  const batteryEnergyKWh =
    safeCapacity * (safeSoC / 100);

  let batteryPowerKW = 0;

  // Battery charging from solar surplus.
  if (
    solarSurplusKW > 0 &&
    safeSoC < 100
  ) {
    batteryPowerKW = -Math.min(
      solarSurplusKW,
      batteryMaxPower
    );
  }

  // Battery discharging to support load.
  if (
    solarDeficitKW > 0 &&
    safeSoC > 10
  ) {
    batteryPowerKW = Math.min(
      solarDeficitKW,
      batteryMaxPower
    );
  }

  /*
   * Convention:
   * positive batteryPowerKW = discharge
   * negative batteryPowerKW = charge
   */

  const netGridPowerKW =
    totalLoadKW -
    solarKW -
    batteryPowerKW;

  const gridImportKW = Math.max(
    0,
    netGridPowerKW
  );

  const gridExportKW = Math.max(
    0,
    -netGridPowerKW
  );

  const renewableUsedKW =
    Math.min(
      solarKW,
      totalLoadKW
    );

  const renewableUtilization =
    solarKW > 0
      ? Math.min(
          (renewableUsedKW / solarKW) * 100,
          100
        )
      : 0;

  const estimatedHourlyCost =
    gridImportKW * electricityPrice;

  const gridEmissionFactor = 0.4;

  const estimatedHourlyCO2 =
    gridImportKW * gridEmissionFactor;

  let systemStatus = "OPTIMAL";

  if (
    gridImportKW > totalLoadKW * 0.7 &&
    totalLoadKW > 0
  ) {
    systemStatus = "HIGH GRID DEPENDENCY";
  } else if (safeSoC < 20) {
    systemStatus = "LOW BATTERY";
  } else if (solarSurplusKW > 0.2) {
    systemStatus = "SOLAR SURPLUS";
  }

  return {
    activeDevices,

    totalLoadWatts:
      Number(totalLoadWatts.toFixed(2)),

    totalLoadKW:
      Number(totalLoadKW.toFixed(2)),

    voltage,

    powerFactor: Number(
      safePF.toFixed(2)
    ),

    currentAmps:
      Number(currentAmps.toFixed(2)),

    apparentPowerVA:
      Number(apparentPowerVA.toFixed(2)),

    reactivePowerVAR:
      Number(reactivePowerVAR.toFixed(2)),

    solarKW:
      Number(solarKW.toFixed(2)),

    solarCoverage:
      Number(solarCoverage.toFixed(1)),

    solarSurplusKW:
      Number(solarSurplusKW.toFixed(2)),

    solarDeficitKW:
      Number(solarDeficitKW.toFixed(2)),

    batterySoC:
      Number(safeSoC.toFixed(1)),

    batteryCapacityKWh:
      Number(safeCapacity.toFixed(1)),

    batteryEnergyKWh:
      Number(batteryEnergyKWh.toFixed(2)),

    batteryPowerKW:
      Number(batteryPowerKW.toFixed(2)),

    gridImportKW:
      Number(gridImportKW.toFixed(2)),

    gridExportKW:
      Number(gridExportKW.toFixed(2)),

    renewableUtilization:
      Number(
        renewableUtilization.toFixed(1)
      ),

    estimatedHourlyCost:
      Number(
        estimatedHourlyCost.toFixed(2)
      ),

    estimatedHourlyCO2:
      Number(
        estimatedHourlyCO2.toFixed(2)
      ),

    systemStatus,
  };
}