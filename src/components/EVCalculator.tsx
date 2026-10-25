import React, { useState, useMemo } from 'react';
import { 
  Gauge, 
  BatteryCharging, 
  Zap, 
  Clock, 
  Coins, 
  CheckCircle, 
  AlertTriangle, 
  Flame, 
  Leaf, 
  RotateCcw,
  Info,
  Sliders,
  ChevronRight
} from 'lucide-react';

export const EVCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'range' | 'charge'>('range');

  // --- Tab 1: Range Calculator States ---
  const [voltage, setVoltage] = useState<number>(60);
  const [capacityAh, setCapacityAh] = useState<number>(30);
  const [useDirectKwh, setUseDirectKwh] = useState<boolean>(false);
  const [directKwh, setDirectKwh] = useState<number>(1.8);
  const [avgSpeed, setAvgSpeed] = useState<number>(35); // km/h
  const [combinedLoad, setCombinedLoad] = useState<number>(95); // kg (rider + scooty luggage)
  const [terrain, setTerrain] = useState<'flat' | 'moderate' | 'steep' | 'traffic'>('flat');
  const [batterySOH, setBatterySOH] = useState<number>(95); // State of health %

  // --- Tab 2: Charge Time Calculator States ---
  const [chargerVoltage, setChargerVoltage] = useState<number>(67.2);
  const [chargerAmps, setChargerAmps] = useState<number>(6);
  const [chargeBatteryCapacityAh, setChargeBatteryCapacityAh] = useState<number>(30);
  const [chargeBatteryVoltage, setChargeBatteryVoltage] = useState<number>(60);
  const [currentSOC, setCurrentSOC] = useState<number>(15); // %
  const [targetSOC, setTargetSOC] = useState<number>(85); // %
  const [electricityTariff, setElectricityTariff] = useState<number>(7.5); // per kWh unit (currency)

  // Presets for Range
  const applyRangePreset = (v: number, ah: number, speed: number, load: number) => {
    setVoltage(v);
    setCapacityAh(ah);
    setUseDirectKwh(false);
    setAvgSpeed(speed);
    setCombinedLoad(load);
  };

  // Presets for Charger
  const applyChargerPreset = (v: number, a: number) => {
    setChargerVoltage(v);
    setChargerAmps(a);
  };

  // --- Range Calculation Engine ---
  const rangeResults = useMemo(() => {
    // 1. Calculate raw battery energy in Wh
    const nominalWh = useDirectKwh ? directKwh * 1000 : voltage * capacityAh;
    // 2. Adjust for State of Health (SOH) and safe BMS reserve (retain 8% floor)
    const effectiveWh = nominalWh * (batterySOH / 100) * 0.92;

    // 3. Base consumption model for 2-wheeler electric scooters/bikes
    // Rolling resistance + aerodynamic drag:
    // Base rate ~18 Wh/km at 25km/h with 75kg load
    const speedFactor = Math.pow(avgSpeed / 25, 1.45); // Aerodynamic drag increases non-linearly
    const loadFactor = 1 + ((combinedLoad - 75) / 100) * 0.35; // Each 10kg above 75 adds ~3.5% load

    let terrainFactor = 1.0;
    if (terrain === 'moderate') terrainFactor = 1.15;
    if (terrain === 'steep') terrainFactor = 1.35;
    if (terrain === 'traffic') terrainFactor = 1.25; // Repeated start-stop inertia

    const whPerKm = Math.round(18.5 * speedFactor * loadFactor * terrainFactor * 10) / 10;
    const estimatedRangeKm = Math.max(1, Math.round(effectiveWh / whPerKm));

    // Petrol equivalent comparison (Assumption: 45 km/L petrol at ₹102/L = ₹2.26 / km)
    // EV electricity rate at ₹7.5/kWh:
    const evCostPerKm = (whPerKm / 1000) * 7.5;
    const petrolCostPerKm = 102 / 45; // ~2.27
    const savingsPer1000Km = Math.round((petrolCostPerKm - evCostPerKm) * 1000);

    return {
      nominalKwh: (nominalWh / 1000).toFixed(2),
      effectiveKwh: (effectiveWh / 1000).toFixed(2),
      whPerKm,
      estimatedRangeKm,
      evCostPerKm: evCostPerKm.toFixed(2),
      petrolCostPerKm: petrolCostPerKm.toFixed(2),
      savingsPer1000Km
    };
  }, [voltage, capacityAh, useDirectKwh, directKwh, avgSpeed, combinedLoad, terrain, batterySOH]);

  // --- Charge Time Calculation Engine ---
  const chargeResults = useMemo(() => {
    const totalBatteryWh = chargeBatteryVoltage * chargeBatteryCapacityAh;
    const socDelta = Math.max(1, targetSOC - currentSOC); // % to fill
    const energyNeededWh = (totalBatteryWh * socDelta) / 100;

    // Charger nominal power output
    const chargerPowerWatts = chargerVoltage * chargerAmps;

    // CC/CV Curve Modeling:
    // From 0 to 80% SOC, charger runs at ~Constant Current (fast).
    // Above 80% to 100%, battery enters Constant Voltage saturation where current tapers down to ~0.1C.
    let hours = 0;
    if (targetSOC <= 80) {
      // Pure or mostly CC phase
      hours = (energyNeededWh / chargerPowerWatts) * 1.08; // 8% electrical line and chemical inefficiency
    } else {
      // Target exceeds 80%
      const ccDelta = Math.max(0, Math.min(80, targetSOC) - currentSOC);
      const cvDelta = targetSOC - Math.max(80, currentSOC);

      const ccEnergy = (totalBatteryWh * ccDelta) / 100;
      const cvEnergy = (totalBatteryWh * cvDelta) / 100;

      const ccTime = (ccEnergy / chargerPowerWatts) * 1.08;
      const cvTime = (cvEnergy / (chargerPowerWatts * 0.45)) * 1.15; // Average tapered power ~45% of peak
      hours = ccTime + cvTime;
    }

    const totalMinutes = Math.round(hours * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    // Wall energy consumed with 88% AC-DC conversion efficiency
    const wallEnergyKwh = (energyNeededWh / 0.88) / 1000;
    const sessionCost = (wallEnergyKwh * electricityTariff).toFixed(2);

    // Range added per hour (assuming 25 Wh/km)
    const rangeAddedPerHour = Math.round((chargerPowerWatts * 0.88) / 25);

    return {
      chargerWatts: Math.round(chargerPowerWatts),
      hours: hrs,
      minutes: mins,
      wallUnitsKwh: wallEnergyKwh.toFixed(2),
      sessionCost,
      rangeAddedPerHour
    };
  }, [
    chargerVoltage, 
    chargerAmps, 
    chargeBatteryCapacityAh, 
    chargeBatteryVoltage, 
    currentSOC, 
    targetSOC, 
    electricityTariff
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Title & Introduction */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
          <span>CLIENT-SIDE EV SIMULATION SUITE</span>
          <span aria-hidden="true">·</span>
          <span>Zero Lag Real-Time Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          EV Range & Battery Health Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Accurately simulate real-world riding range, battery degradation thresholds, and charge time curves tailored specifically for 48V, 60V, and 72V electric bikes and scooties.
        </p>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md mb-8">
        <button
          onClick={() => setActiveTab('range')}
          className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'range'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Gauge className="w-4 h-4 text-emerald-500" />
          <span>Range & Health Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('charge')}
          className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'charge'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BatteryCharging className="w-4 h-4 text-emerald-500" />
          <span>Charge Time & Cost</span>
        </button>
      </div>

      {/* ===================== TAB 1: RANGE CALCULATOR ===================== */}
      {activeTab === 'range' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Quick Vehicle Presets */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Quick Vehicle Presets
                </label>
                <span className="text-[11px] text-slate-400">One-click standard specs</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyRangePreset(48, 24, 30, 80)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300 transition-colors text-left"
                >
                  <span className="block font-semibold text-slate-900 dark:text-white">48V 24Ah</span>
                  <span className="text-[10px] text-slate-400">Eco Commuter (1.15 kWh)</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyRangePreset(60, 30, 38, 90)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300 transition-colors text-left"
                >
                  <span className="block font-semibold text-slate-900 dark:text-white">60V 30Ah</span>
                  <span className="text-[10px] text-slate-400">City Scooter (1.8 kWh)</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyRangePreset(72, 42, 45, 105)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300 transition-colors text-left"
                >
                  <span className="block font-semibold text-slate-900 dark:text-white">72V 42Ah</span>
                  <span className="text-[10px] text-slate-400">High-Torque (3.0 kWh)</span>
                </button>
              </div>
            </div>

            {/* Battery Spec Inputs */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Battery Configuration
                </span>
                <button
                  type="button"
                  onClick={() => setUseDirectKwh(!useDirectKwh)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                >
                  {useDirectKwh ? 'Switch to V + Ah' : 'Input Direct kWh'}
                </button>
              </div>

              {!useDirectKwh ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                      Nominal Voltage (V)
                    </label>
                    <select
                      value={voltage}
                      onChange={(e) => setVoltage(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                    >
                      <option value={48}>48V (13S-14S Li-ion / 16S LFP)</option>
                      <option value={52}>52V (14S NMC Mid-Drive)</option>
                      <option value={60}>60V (16S NMC / 20S LFP)</option>
                      <option value={72}>72V (20S NMC / 24S LFP High Speed)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Pack Capacity (Ah)
                      </label>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {capacityAh} Ah ({(voltage * capacityAh / 1000).toFixed(2)} kWh)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={60}
                      step={1}
                      value={capacityAh}
                      onChange={(e) => setCapacityAh(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>15 Ah</span>
                      <span>30 Ah</span>
                      <span>45 Ah</span>
                      <span>60 Ah</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Total Battery Energy (kWh)
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {directKwh} kWh
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.8}
                    max={4.5}
                    step={0.1}
                    value={directKwh}
                    onChange={(e) => setDirectKwh(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>0.8 kWh</span>
                    <span>2.5 kWh</span>
                    <span>4.5 kWh</span>
                  </div>
                </div>
              )}
            </div>

            {/* Average Speed Slider */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Average Cruising Speed (km/h)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {avgSpeed <= 25 ? 'Eco Mode' : avgSpeed <= 45 ? 'City Commute' : 'Sport / Highway'}
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {avgSpeed} km/h
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={15}
                max={75}
                step={1}
                value={avgSpeed}
                onChange={(e) => setAvgSpeed(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>15 km/h (Slow)</span>
                <span>35 km/h (City)</span>
                <span>55 km/h (Brisk)</span>
                <span>75 km/h (Max)</span>
              </div>
            </div>

            {/* Combined Vehicle Payload (Rider + Luggage) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Total Payload (Rider + Pillion / Cargo)
                </label>
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {combinedLoad} kg
                </span>
              </div>
              <input
                type="range"
                min={60}
                max={180}
                step={5}
                value={combinedLoad}
                onChange={(e) => setCombinedLoad(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>60 kg (Solo)</span>
                <span>95 kg (Average)</span>
                <span>140 kg (With Pillion)</span>
                <span>180 kg (Full Load)</span>
              </div>
            </div>

            {/* Terrain & Battery Health Inputs */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Terrain Mode */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Terrain & Traffic Profile
                </label>
                <select
                  value={terrain}
                  onChange={(e) => setTerrain(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="flat">Flat City Asphalt (Standard)</option>
                  <option value="moderate">Gentle Incline & Flyovers (+15% load)</option>
                  <option value="steep">Steep Hilly Roads (+35% load)</option>
                  <option value="traffic">Stop-and-Go Rush Hour (+25% inertia)</option>
                </select>
              </div>

              {/* Battery State of Health (SOH) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Battery SOH (State of Health)
                  </label>
                  <span className={`text-xs font-mono font-bold ${
                    batterySOH >= 85 ? 'text-emerald-500' : batterySOH >= 70 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {batterySOH}%
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={1}
                  value={batterySOH}
                  onChange={(e) => setBatterySOH(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>50% (Degraded)</span>
                  <span>80% (Mid Life)</span>
                  <span>100% (New)</span>
                </div>
              </div>

            </div>

          </div>

          {/* Real-Time Computed Results Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-7 rounded-2xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                  Simulated Output
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {rangeResults.whPerKm} Wh/km rate
                </span>
              </div>

              {/* Big Range Number */}
              <div className="py-6 space-y-1">
                <p className="text-xs text-slate-400 font-medium">Estimated True Driving Range</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                    {rangeResults.estimatedRangeKm}
                  </span>
                  <span className="text-xl font-bold text-emerald-400">km</span>
                </div>
                <p className="text-xs text-slate-400">
                  Based on {avgSpeed} km/h cruising on {terrain} profile with {combinedLoad}kg total load.
                </p>
              </div>

              {/* Technical Telemetry Breakdown */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Usable Energy</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {rangeResults.effectiveKwh} kWh
                  </span>
                  <span className="text-[10px] text-slate-500 block">After SOH & 8% BMS reserve</span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Energy Consumption</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {rangeResults.whPerKm} Wh/km
                  </span>
                  <span className="text-[10px] text-slate-500 block">Aerodynamic + Rolling</span>
                </div>
              </div>

              {/* Economic Savings Calculator */}
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Cost Comparison</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                    EV ₹{rangeResults.evCostPerKm}/km vs Petrol ₹{rangeResults.petrolCostPerKm}/km
                  </span>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-300 block">Est. Savings per 1,000 km</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      ₹{rangeResults.savingsPer1000Km.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400/80 font-medium">
                    ~90% Fuel Cost Reduction
                  </span>
                </div>
              </div>

              {/* Battery Degradation Alert (if SOH < 80%) */}
              {batterySOH < 80 && (
                <div className="mt-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-200">Battery Degradation Alert (SOH {batterySOH}%)</p>
                    <p className="text-[11px] text-amber-300/90 mt-0.5">
                      Cells show capacity loss. An active balancing service or bad cell isolation can recover up to 15-20km of lost range without buying a whole pack.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Quick Action note */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Need custom pack building for higher range?</span>
              <a
                href="#contact"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                Inquire Pack Build <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>
      )}

      {/* ===================== TAB 2: CHARGE TIME & COST ===================== */}
      {activeTab === 'charge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Charger Presets */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Standard Charger Configurations
                </label>
                <span className="text-[11px] text-slate-400">Pre-configured voltage & amps</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyChargerPreset(54.6, 3)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300 transition-colors text-left"
                >
                  <span className="block font-semibold text-slate-900 dark:text-white">48V Standard (3A)</span>
                  <span className="text-[10px] text-slate-400 font-mono">54.6V · 164W output</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyChargerPreset(67.2, 6)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300 transition-colors text-left"
                >
                  <span className="block font-semibold text-slate-900 dark:text-white">60V Fast Home (6A)</span>
                  <span className="text-[10px] text-slate-400 font-mono">67.2V · 403W output</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyChargerPreset(84.0, 10)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300 transition-colors text-left"
                >
                  <span className="block font-semibold text-slate-900 dark:text-white">72V High-Speed (10A)</span>
                  <span className="text-[10px] text-slate-400 font-mono">84.0V · 840W output</span>
                </button>
              </div>
            </div>

            {/* Charger Technical Inputs */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                Charger Specifications (Volts & Amps)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Charger Output Voltage (V)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="24"
                    max="100"
                    value={chargerVoltage}
                    onChange={(e) => setChargerVoltage(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">e.g. 54.6V for 48V pack, 67.2V for 60V, 84V for 72V</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Charger Current Rating (Amps)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="30"
                    value={chargerAmps}
                    onChange={(e) => setChargerAmps(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">Power: {Math.round(chargerVoltage * chargerAmps)} Watts</span>
                </div>
              </div>
            </div>

            {/* Target Battery Pack */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                Scooter Battery Capacity
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Nominal Voltage (V)
                  </label>
                  <select
                    value={chargeBatteryVoltage}
                    onChange={(e) => setChargeBatteryVoltage(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value={48}>48V Pack</option>
                    <option value={60}>60V Pack</option>
                    <option value={72}>72V Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Battery Capacity (Ah)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={chargeBatteryCapacityAh}
                    onChange={(e) => setChargeBatteryCapacityAh(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                    Total: {((chargeBatteryVoltage * chargeBatteryCapacityAh) / 1000).toFixed(2)} kWh
                  </span>
                </div>
              </div>
            </div>

            {/* Current vs Target State of Charge (SOC %) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Starting SOC */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Starting Battery %</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{currentSOC}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.min(90, targetSOC - 5)}
                    step={5}
                    value={currentSOC}
                    onChange={(e) => setCurrentSOC(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block font-mono">Current display level</span>
                </div>

                {/* Target SOC */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Target Battery %</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{targetSOC}%</span>
                  </div>
                  <input
                    type="range"
                    min={Math.max(10, currentSOC + 5)}
                    max={100}
                    step={5}
                    value={targetSOC}
                    onChange={(e) => setTargetSOC(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block font-mono">Recommended: 85% for 3x cycle life</span>
                </div>

              </div>
            </div>

            {/* Electricity Tariff Rate */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Electricity Rate per kWh Unit (₹ / $)
                </label>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  ₹{electricityTariff.toFixed(2)} / unit
                </span>
              </div>
              <input
                type="number"
                step="0.5"
                min="1"
                max="30"
                value={electricityTariff}
                onChange={(e) => setElectricityTariff(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

          </div>

          {/* Real-Time Computed Charge Time Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-7 rounded-2xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                  Charge Duration & Cost
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {chargeResults.chargerWatts}W output
                </span>
              </div>

              {/* Big Time Duration Display */}
              <div className="py-6 space-y-1">
                <p className="text-xs text-slate-400 font-medium">Estimated Charging Duration</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                    {chargeResults.hours}h {chargeResults.minutes}m
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Charging from {currentSOC}% to {targetSOC}% including CC fast mode and CV trickle curve.
                </p>
              </div>

              {/* Telemetry Breakdown */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Units Consumed</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {chargeResults.wallUnitsKwh} kWh
                  </span>
                  <span className="text-[10px] text-slate-500 block">At 88% wall efficiency</span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Session Cost</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    ₹{chargeResults.sessionCost}
                  </span>
                  <span className="text-[10px] text-slate-500 block">At ₹{electricityTariff}/unit</span>
                </div>
              </div>

              {/* Added Range Rate */}
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Charge Recovery Speed</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    +{chargeResults.rangeAddedPerHour} km / hour
                  </span>
                </div>

                {/* Battery Longevity Insight */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <Info className="w-3.5 h-3.5" />
                    <span>Battery Health Recommendation</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    {targetSOC <= 85 ? (
                      <span>Great choice! Capping charging at {targetSOC}% prevents high-voltage electrolyte oxidation, boosting cell lifespan from 800 to over 2,200 cycles.</span>
                    ) : (
                      <span>Note: Charging frequently to 100% accelerates cell cathode stress. For daily commuting, stopping at 80-85% extends battery pack longevity by 2.5x.</span>
                    )}
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Action note */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Is your charger heating up or tripping MCB?</span>
              <a
                href="#contact"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                Book Charger Diagnostic <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
