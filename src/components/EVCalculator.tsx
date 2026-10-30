import React, { useState, useMemo, useEffect } from 'react';
import { 
  Gauge, 
  BatteryCharging, 
  Zap, 
  Clock, 
  Coins, 
  AlertTriangle, 
  Info, 
  ChevronRight, 
  Cpu, 
  Layers, 
  Sparkles,
  HeartPulse,
  ShieldCheck,
  ThermometerSun,
  Flame,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  TrendingUp,
  Wrench,
  Battery,
  SlidersHorizontal,
  PhoneCall,
  Fuel
} from 'lucide-react';

export type BatteryChemistry = 'li-ion' | 'lifepo4' | 'graphene';
export type CalculatorTab = 'range' | 'charge' | 'health';

// Quick vehicle presets for everyday riders in Pakistan
interface VehiclePreset {
  name: string;
  badge: string;
  voltage: number;
  capacityAh: number;
  motorWatts: number;
  avgSpeed: number;
  chemistry: BatteryChemistry;
  description: string;
}

const VEHICLE_PRESETS: VehiclePreset[] = [
  {
    name: 'Standard Scooty',
    badge: 'Popular Scooty',
    voltage: 60,
    capacityAh: 30,
    motorWatts: 1500,
    avgSpeed: 38,
    chemistry: 'li-ion',
    description: 'Standard 60V 30Ah setup'
  },
  {
    name: 'Power Pack Scooty',
    badge: 'Full Power Pack',
    voltage: 72,
    capacityAh: 35,
    motorWatts: 2000,
    avgSpeed: 45,
    chemistry: 'lifepo4',
    description: 'High performance 72V 35Ah pack'
  },
  {
    name: 'Economy City E-Bike',
    badge: 'Light Commuter',
    voltage: 48,
    capacityAh: 20,
    motorWatts: 800,
    avgSpeed: 30,
    chemistry: 'li-ion',
    description: 'Compact 48V 20Ah city commuter'
  },
  {
    name: 'Lead-Carbon Graphene Scooty',
    badge: 'Budget Pack',
    voltage: 60,
    capacityAh: 24,
    motorWatts: 1200,
    avgSpeed: 32,
    chemistry: 'graphene',
    description: 'Standard 60V 24Ah pack setup'
  }
];

interface ChargerSpeedPreset {
  amps: number;
  name: string;
  badge: string;
  description: string;
}

const CHARGER_SPEED_PRESETS: ChargerSpeedPreset[] = [
  {
    amps: 3,
    name: 'Gentle Slow (3A)',
    badge: '3A',
    description: 'Runs cool, best for battery longevity',
  },
  {
    amps: 5,
    name: 'Daily Commuter (5A)',
    badge: '5A',
    description: 'Balanced 5A draw, gentle on household sockets',
  },
  {
    amps: 6,
    name: 'Standard Home (6A)',
    badge: '6A',
    description: 'Factory charger included with most e-bikes',
  },
  {
    amps: 10,
    name: 'Fast Charger (10A)',
    badge: '10A',
    description: 'Fast turnaround for delivery riders & couriers',
  },
  {
    amps: 15,
    name: 'Ultra Fast (15A)',
    badge: '15A',
    description: 'High-power rapid charging for large battery packs',
  },
];

export const EVCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('range');

  // --- Shared Battery Chemistry ---
  const [batteryChemistry, setBatteryChemistry] = useState<BatteryChemistry>('li-ion');

  // Track selected vehicle preset independently from battery technology
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>('Metro E8S / Yadea T5');

  // Simple Mode toggle for non-technical users
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);

  // --- Tab 1: Range Calculator States ---
  const [voltage, setVoltage] = useState<number>(60);
  const [capacityAh, setCapacityAh] = useState<number>(30);
  const [useDirectKwh, setUseDirectKwh] = useState<boolean>(false);
  const [directKwh, setDirectKwh] = useState<number>(1.8);
  const [motorWatts, setMotorWatts] = useState<number>(1500); // Motor Watts
  const [avgSpeed, setAvgSpeed] = useState<number>(35); // km/h
  const [combinedLoad, setCombinedLoad] = useState<number>(95); // kg (rider + luggage)
  const [terrain, setTerrain] = useState<'flat' | 'moderate' | 'steep' | 'traffic'>('flat');
  const [batterySOH, setBatterySOH] = useState<number>(95); // State of health %

  // --- Tab 2: Charge Time Calculator States ---
  const [chargeBatteryVoltage, setChargeBatteryVoltage] = useState<number>(60);
  const [chargerVoltage, setChargerVoltage] = useState<number>(67.2);
  const [chargerAmps, setChargerAmps] = useState<number>(6);
  const [chargeBatteryCapacityAh, setChargeBatteryCapacityAh] = useState<number>(30);
  const [currentSOC, setCurrentSOC] = useState<number>(15); // %
  const [targetSOC, setTargetSOC] = useState<number>(85); // %
  const [electricityTariff, setElectricityTariff] = useState<number>(34.0); // per kWh unit (PKR WAPDA/NEPRA baseline)

  // --- Live Pakistan Energy Rates (AI-Powered) ---
  const [petrolPrice, setPetrolPrice] = useState<number>(376.06); // PKR per Liter (Current PSO / OGRA retail pump rate)
  const [petrolMileageKmPerL, setPetrolMileageKmPerL] = useState<number>(45); // Standard 70cc motorbike mileage
  const [isAiPriceLoading, setIsAiPriceLoading] = useState<boolean>(false);
  const [aiPriceInfo, setAiPriceInfo] = useState<{
    source: string;
    summary: string;
    updatedAt: string;
    isLive: boolean;
  } | null>(null);
  const [aiPriceError, setAiPriceError] = useState<string | null>(null);
  const [showCustomRates, setShowCustomRates] = useState<boolean>(false);

  // Function to fetch live energy rates in Pakistan using Gemini AI with Google Search grounding
  const fetchLiveEnergyRates = async () => {
    setIsAiPriceLoading(true);
    setAiPriceError(null);
    try {
      const res = await fetch('/api/pakistan-energy-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      if (data.petrolPricePerLiter && !isNaN(Number(data.petrolPricePerLiter))) {
        setPetrolPrice(Number(data.petrolPricePerLiter));
      }
      if (data.electricityTariffPerUnit && !isNaN(Number(data.electricityTariffPerUnit))) {
        setElectricityTariff(Number(data.electricityTariffPerUnit));
      }
      setAiPriceInfo({
        source: data.source || 'OGRA & NEPRA Notifications',
        summary: data.summary || 'Live consumer energy prices retrieved via Gemini AI search.',
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
        isLive: !data.isFallback,
      });
    } catch (err: any) {
      console.error('Failed to fetch live Pakistan energy rates:', err);
      setAiPriceError('Could not refresh live rates. Using current verified baseline.');
    } finally {
      setIsAiPriceLoading(false);
    }
  };

  // Automatically fetch live rates on initial mount
  useEffect(() => {
    fetchLiveEnergyRates();
  }, []);

  // --- Tab 3: Battery Health Diagnostic States ---
  const [healthDailyKm, setHealthDailyKm] = useState<number>(25); // Daily commute in km
  const [healthPackKwh, setHealthPackKwh] = useState<number>(1.8); // Pack capacity in kWh (e.g. 60V 30Ah = 1.8kWh)
  const [healthChargeHabit, setHealthChargeHabit] = useState<'sweet_spot' | 'regular_100' | 'deep_drain' | 'overnight_float'>('sweet_spot');
  const [healthCoolingHabit, setHealthCoolingHabit] = useState<'shaded_cooled' | 'hot_plug'>('shaded_cooled');
  const [healthChargerRate, setHealthChargerRate] = useState<'standard_gentle' | 'fast_charger'>('standard_gentle');
  const [healthBatteryAgeMonths, setHealthBatteryAgeMonths] = useState<number>(8); // months used
  // User symptom checklist
  const [symptomSuddenDrop, setSymptomSuddenDrop] = useState<boolean>(false);
  const [symptomHotCharger, setSymptomHotCharger] = useState<boolean>(false);
  const [symptomPowerCutUphill, setSymptomPowerCutUphill] = useState<boolean>(false);

  // Apply Quick Vehicle Preset
  const handleSelectPreset = (preset: VehiclePreset) => {
    setSelectedPresetName(preset.name);
    setVoltage(preset.voltage);
    setCapacityAh(preset.capacityAh);
    setUseDirectKwh(false);
    setMotorWatts(preset.motorWatts);
    setAvgSpeed(preset.avgSpeed);
    // NOTE: Intentionally do NOT set batteryChemistry here.
    // Battery technology is selected manually and independently by the user.

    // Also align charge tab
    setChargeBatteryVoltage(preset.voltage);
    setChargeBatteryCapacityAh(preset.capacityAh);
    if (preset.voltage === 36) setChargerVoltage(42.0);
    else if (preset.voltage === 48) setChargerVoltage(54.6);
    else if (preset.voltage === 60) setChargerVoltage(67.2);
    else if (preset.voltage === 72) setChargerVoltage(84.0);

    // Align health tab capacity
    setHealthPackKwh(Number(((preset.voltage * preset.capacityAh) / 1000).toFixed(2)));
  };

  // Presets for Range manual
  const applyRangePreset = (v: number, ah: number, speed: number, load: number, motor: number) => {
    setSelectedPresetName(null);
    setVoltage(v);
    setCapacityAh(ah);
    setUseDirectKwh(false);
    setAvgSpeed(speed);
    setCombinedLoad(load);
    setMotorWatts(motor);
  };

  // Helper to get charger DC cut-off voltage from nominal pack voltage
  const getChargerVoltageForPack = (packV: number) => {
    if (packV === 36) return 42.0;
    if (packV === 48) return 54.6;
    if (packV === 52) return 58.8;
    if (packV === 60) return 67.2;
    if (packV === 72) return 84.0;
    return Number((packV * 1.15).toFixed(1));
  };

  // Presets for Charger speed
  const applyChargerSpeed = (amps: number) => {
    setChargerAmps(amps);
    setChargerVoltage(getChargerVoltageForPack(chargeBatteryVoltage));
  };

  // Presets for Charger (full preset)
  const applyChargerPreset = (v: number, a: number, batV?: number) => {
    if (batV) setChargeBatteryVoltage(batV);
    setChargerVoltage(v || getChargerVoltageForPack(batV || chargeBatteryVoltage));
    setChargerAmps(a);
  };

  // When changing battery voltage in Tab 2, auto-align charger output voltage
  const handleChargeVoltageChange = (newV: number) => {
    setChargeBatteryVoltage(newV);
    setChargerVoltage(getChargerVoltageForPack(newV));
  };

  // --- Range Calculation Engine ---
  const rangeResults = useMemo(() => {
    // 1. Calculate raw battery energy in Wh
    const nominalWh = useDirectKwh ? directKwh * 1000 : voltage * capacityAh;
    
    // 2. Adjust for State of Health (SOH) and chemistry usable depth of discharge (DoD)
    let chemUsableFactor = 0.92;
    let chemWeightDrag = 1.0;
    if (batteryChemistry === 'lifepo4') {
      chemUsableFactor = 0.95;
      chemWeightDrag = 1.02; // slightly heavier than NMC
    } else if (batteryChemistry === 'graphene') {
      chemUsableFactor = 0.85; // higher cut-off sag under motor load
      chemWeightDrag = 1.08; // lead-carbon graphene is noticeably heavier
    }

    const effectiveWh = nominalWh * (batterySOH / 100) * chemUsableFactor;

    // 3. Base consumption model for electric 2-wheelers
    const speedFactor = Math.pow(avgSpeed / 25, 1.45);
    const loadFactor = 1 + ((combinedLoad - 75) / 100) * 0.35;

    let terrainFactor = 1.0;
    if (terrain === 'moderate') terrainFactor = 1.15;
    if (terrain === 'steep') terrainFactor = 1.35;
    if (terrain === 'traffic') terrainFactor = 1.25;

    const motorScaleFactor = 0.75 + (motorWatts / 1500) * 0.25;
    const baseWhPerKm = 18.5 * motorScaleFactor;
    const whPerKm = Math.round(baseWhPerKm * speedFactor * loadFactor * terrainFactor * chemWeightDrag * 10) / 10;
    const estimatedRangeKm = Math.max(1, Math.round(effectiveWh / whPerKm));

    // Peak current draw estimated
    const peakAmps = Math.round((motorWatts * 1.35) / voltage);
    const cruisingAmps = (Math.round((whPerKm * (avgSpeed / 3600) * 3600 / voltage) * 10) / 10).toFixed(1);

    // Petrol equivalent comparison (Dynamic based on AI-verified petrol & electricity rates)
    const evCostPerKm = (whPerKm / 1000) * electricityTariff;
    const petrolCostPerKm = petrolPrice / petrolMileageKmPerL;
    const savingsPer1000Km = Math.round((petrolCostPerKm - evCostPerKm) * 1000);
    const monthlyCommuteKm = 25 * 30; // standard 750 km/month (25 km/day)
    const monthlySavings = Math.round((petrolCostPerKm - evCostPerKm) * monthlyCommuteKm);
    const yearlySavings = Math.round((petrolCostPerKm - evCostPerKm) * (monthlyCommuteKm * 12));

    return {
      nominalKwh: (nominalWh / 1000).toFixed(2),
      effectiveKwh: (effectiveWh / 1000).toFixed(2),
      whPerKm,
      estimatedRangeKm,
      peakAmps,
      cruisingAmps,
      evCostPerKm: evCostPerKm.toFixed(2),
      petrolCostPerKm: petrolCostPerKm.toFixed(2),
      savingsPer1000Km,
      monthlySavings,
      yearlySavings,
      petrolPrice,
      petrolMileageKmPerL
    };
  }, [voltage, capacityAh, useDirectKwh, directKwh, motorWatts, avgSpeed, combinedLoad, terrain, batterySOH, batteryChemistry, electricityTariff, petrolPrice, petrolMileageKmPerL]);

  // --- Charge Time Calculation Engine ---
  const chargeResults = useMemo(() => {
    const totalBatteryWh = chargeBatteryVoltage * chargeBatteryCapacityAh;
    const socDelta = Math.max(1, targetSOC - currentSOC); // % to fill
    const energyNeededWh = (totalBatteryWh * socDelta) / 100;

    // Charger nominal power output
    const chargerPowerWatts = chargerVoltage * chargerAmps;

    let ccCutoff = 80;
    let cvCurrentFraction = 0.45;
    let lineLossFactor = 1.08;
    let wallEfficiency = 0.88;

    if (batteryChemistry === 'lifepo4') {
      ccCutoff = 88;
      cvCurrentFraction = 0.60;
      lineLossFactor = 1.04;
      wallEfficiency = 0.90;
    } else if (batteryChemistry === 'graphene') {
      ccCutoff = 72;
      cvCurrentFraction = 0.32;
      lineLossFactor = 1.24;
      wallEfficiency = 0.82;
    }

    let hours = 0;
    if (targetSOC <= ccCutoff) {
      hours = (energyNeededWh / chargerPowerWatts) * lineLossFactor;
    } else {
      const ccDelta = Math.max(0, Math.min(ccCutoff, targetSOC) - currentSOC);
      const cvDelta = targetSOC - Math.max(ccCutoff, currentSOC);

      const ccEnergy = (totalBatteryWh * ccDelta) / 100;
      const cvEnergy = (totalBatteryWh * cvDelta) / 100;

      const ccTime = (ccEnergy / chargerPowerWatts) * lineLossFactor;
      const cvTime = (cvEnergy / (chargerPowerWatts * cvCurrentFraction)) * (lineLossFactor * 1.05);
      hours = ccTime + cvTime;
    }

    const totalMinutes = Math.round(hours * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    // Wall energy consumed with AC-DC conversion efficiency
    const wallEnergyKwh = (energyNeededWh / wallEfficiency) / 1000;
    const sessionCost = (wallEnergyKwh * electricityTariff).toFixed(2);

    // Range added per hour (assuming 22 Wh/km)
    const rangeAddedPerHour = Math.round((chargerPowerWatts * wallEfficiency) / 22);

    return {
      chargerWatts: Math.round(chargerPowerWatts),
      hours: hrs,
      minutes: mins,
      wallUnitsKwh: wallEnergyKwh.toFixed(2),
      sessionCost,
      rangeAddedPerHour,
      ccCutoff,
      wallEfficiency: Math.round(wallEfficiency * 100)
    };
  }, [
    chargerVoltage, 
    chargerAmps, 
    chargeBatteryCapacityAh, 
    chargeBatteryVoltage, 
    currentSOC, 
    targetSOC, 
    batteryChemistry,
    electricityTariff
  ]);

  // --- Tab 3: Battery Health Diagnostic Engine ---
  const healthResults = useMemo(() => {
    // 1. Chemistry Baseline Full Cycles to 70% SOH (End of Life in EV standard)
    let baseCycles = 1000; // NMC Lithium-ion
    let chemistryName = 'Lithium-Ion (NMC)';
    let costPerKwhPkr = 65000; // Replacement pack cost in PKR per kWh

    if (batteryChemistry === 'lifepo4') {
      baseCycles = 3000;
      chemistryName = 'Lithium Iron Phosphate (LiFePO4)';
      costPerKwhPkr = 75000;
    } else if (batteryChemistry === 'graphene') {
      baseCycles = 500;
      chemistryName = 'Graphene / Lead-Carbon';
      costPerKwhPkr = 35000;
    }

    // 2. Multipliers based on User Charging Habits
    let habitMultiplier = 1.0;
    if (healthChargeHabit === 'sweet_spot') {
      // 20% to 80% shallow cycling reduces mechanical strain on electrode lattice
      habitMultiplier = batteryChemistry === 'lifepo4' ? 1.8 : 2.1;
    } else if (healthChargeHabit === 'regular_100') {
      habitMultiplier = 1.0;
    } else if (healthChargeHabit === 'deep_drain') {
      // Draining below 10-15% causes copper dissolution & SEI growth
      habitMultiplier = 0.65;
    } else if (healthChargeHabit === 'overnight_float') {
      // Sitting at 100% at high voltage promotes electrolyte oxidation
      habitMultiplier = 0.82;
    }

    // 3. Multiplier for Heat / Pakistan Summer Cooldown
    let heatMultiplier = 1.0;
    if (healthCoolingHabit === 'hot_plug') {
      // Charging cell directly when hot (>40°C in Gujranwala summers) accelerates capacity fade
      heatMultiplier = 0.76;
    }

    // 4. Multiplier for Charging Speed
    let speedMultiplier = 1.0;
    if (healthChargerRate === 'fast_charger') {
      speedMultiplier = 0.86;
    }

    // Total adjusted life cycles with current habits
    const totalExpectedCycles = Math.round(baseCycles * habitMultiplier * heatMultiplier * speedMultiplier);

    // What if user used optimal care? (Potential cycles)
    const potentialOptimalCycles = Math.round(baseCycles * 2.0 * 1.0 * 1.0);

    // 5. Daily usage in cycles
    // Assumes ~22 Wh per km consumption
    const dailyKwhConsumed = (healthDailyKm * 22) / 1000;
    const dailyEquivalentCycles = Math.min(1.5, dailyKwhConsumed / Math.max(0.5, healthPackKwh));
    const annualCycles = dailyEquivalentCycles * 365;

    // Total expected lifespan in years
    const expectedLifespanYears = Math.max(0.5, totalExpectedCycles / Math.max(20, annualCycles));
    const potentialLifespanYears = Math.max(0.8, potentialOptimalCycles / Math.max(20, annualCycles));

    // Total expected lifetime riding distance in kilometers
    const totalLifetimeKm = Math.round(totalExpectedCycles * (healthPackKwh * 1000 / 22));
    const potentialLifetimeKm = Math.round(potentialOptimalCycles * (healthPackKwh * 1000 / 22));

    // 6. Current estimated SOH (State of Health)
    // Accumulated cycles so far
    const monthsElapsed = healthBatteryAgeMonths;
    const accumulatedCyclesSoFar = Math.round((annualCycles / 12) * monthsElapsed);
    
    // Calendar aging + cycle degradation
    const calendarDegradationPct = (monthsElapsed / 12) * (batteryChemistry === 'lifepo4' ? 1.5 : 2.5);
    const cycleDegradationPct = (accumulatedCyclesSoFar / totalExpectedCycles) * 30; // 30% drop over full life
    
    // Symptom penalties
    let symptomPenalty = 0;
    if (symptomSuddenDrop) symptomPenalty += 7; // unbalanced cells
    if (symptomHotCharger) symptomPenalty += 5; // high internal resistance
    if (symptomPowerCutUphill) symptomPenalty += 6; // excessive voltage sag

    const estimatedSOH = Math.max(45, Math.min(100, Math.round(100 - calendarDegradationPct - cycleDegradationPct - symptomPenalty)));

    // Remaining lifespan from today
    const remainingYears = Math.max(0.1, ((estimatedSOH - 70) / 30) * expectedLifespanYears);
    const remainingMonths = Math.round(remainingYears * 12);

    // Estimated pack replacement cost in PKR
    const packCostPkr = Math.round(healthPackKwh * costPerKwhPkr);

    // Money saved by good habits vs bad habits
    // Difference between optimal habit lifespan and current habit lifespan
    const yearsGainedByHabits = Math.max(0, potentialLifespanYears - expectedLifespanYears);
    const annualizedSavingsPkr = Math.round((packCostPkr / expectedLifespanYears) * yearsGainedByHabits);

    // Health Rating Badge & Colors
    let healthStatus: 'Optimal' | 'Good' | 'Fair' | 'Service Needed' = 'Optimal';
    let healthColor = 'text-emerald-500';
    let healthBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    let progressBg = 'bg-emerald-500';

    if (estimatedSOH >= 88) {
      healthStatus = 'Optimal';
      healthColor = 'text-emerald-500';
      healthBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      progressBg = 'bg-emerald-500';
    } else if (estimatedSOH >= 78) {
      healthStatus = 'Good';
      healthColor = 'text-teal-400';
      healthBg = 'bg-teal-500/10 border-teal-500/30 text-teal-400';
      progressBg = 'bg-teal-500';
    } else if (estimatedSOH >= 70) {
      healthStatus = 'Fair';
      healthColor = 'text-amber-400';
      healthBg = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      progressBg = 'bg-amber-500';
    } else {
      healthStatus = 'Service Needed';
      healthColor = 'text-red-400';
      healthBg = 'bg-red-500/10 border-red-500/30 text-red-400';
      progressBg = 'bg-red-500';
    }

    return {
      chemistryName,
      estimatedSOH,
      healthStatus,
      healthColor,
      healthBg,
      progressBg,
      totalExpectedCycles,
      potentialOptimalCycles,
      accumulatedCyclesSoFar,
      expectedLifespanYears: expectedLifespanYears.toFixed(1),
      potentialLifespanYears: potentialLifespanYears.toFixed(1),
      remainingMonths,
      remainingYears: remainingYears.toFixed(1),
      totalLifetimeKm,
      potentialLifetimeKm,
      packCostPkr,
      annualizedSavingsPkr,
      dailyEquivalentCycles: dailyEquivalentCycles.toFixed(2),
      habitMultiplier,
      heatMultiplier,
      speedMultiplier
    };
  }, [
    batteryChemistry, 
    healthDailyKm, 
    healthPackKwh, 
    healthChargeHabit, 
    healthCoolingHabit, 
    healthChargerRate, 
    healthBatteryAgeMonths, 
    symptomSuddenDrop, 
    symptomHotCharger, 
    symptomPowerCutUphill
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Title & Introduction */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>REAL-TIME EV DIAGNOSTIC & SIMULATION SUITE</span>
          <span aria-hidden="true">·</span>
          <span>Designed for Pakistani Riders</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          EV Range, Charge & Battery Health Diagnostic
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Calculate your exact riding range, electricity cost in PKR, and estimate your battery pack's remaining lifespan based on everyday charging and summer heat habits.
        </p>
      </div>

      {/* Segmented Tab Controls (3 Tabs) in Frosted Liquid Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 liquid-glass rounded-2xl max-w-3xl mb-8">
        <button
          onClick={() => setActiveTab('range')}
          className={`h-11 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'range'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md border border-white/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <Gauge className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>1. Riding Range</span>
        </button>

        <button
          onClick={() => setActiveTab('charge')}
          className={`h-11 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'charge'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md border border-white/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <BatteryCharging className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>2. Charge Time & Cost</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`h-11 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'health'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md border border-white/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="flex items-center gap-1.5">
            <span>3. Battery Health & Life</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">NEW</span>
          </span>
        </button>
      </div>

      {/* Shared Battery Chemistry Switcher in Tactile Liquid Glass Card */}
      <div className="liquid-glass-card p-5 sm:p-6 rounded-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Select Your Battery Technology</span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select your battery chemistry manually. Vehicle presets below will not alter this choice.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Current selection:</span>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              {batteryChemistry.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setBatteryChemistry('li-ion')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              batteryChemistry === 'li-ion'
                ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-md ring-2 ring-emerald-500/20'
                : 'liquid-glass-subtle hover:border-emerald-400/50 hover:bg-white/70 dark:hover:bg-slate-800/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Lithium-Ion (NMC)</span>
              {batteryChemistry === 'li-ion' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Standard in Metro, Yadea & high-speed e-scooters. Light weight & high energy.
            </p>
            <div className="mt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Life: 800-1,200 cycles (~3-4 yrs)</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setBatteryChemistry('lifepo4')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              batteryChemistry === 'lifepo4'
                ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-md ring-2 ring-emerald-500/20'
                : 'liquid-glass-subtle hover:border-emerald-400/50 hover:bg-white/70 dark:hover:bg-slate-800/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">LiFePO4 (LFP Iron)</span>
              {batteryChemistry === 'lifepo4' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Maximum safety & longest life. High heat tolerance for Pakistan summer.
            </p>
            <div className="mt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Life: 2,500-4,000 cycles (~6-8+ yrs)</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setBatteryChemistry('graphene')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              batteryChemistry === 'graphene'
                ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-md ring-2 ring-emerald-500/20'
                : 'liquid-glass-subtle hover:border-emerald-400/50 hover:bg-white/70 dark:hover:bg-slate-800/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Graphene / Lead-Carbon</span>
              {batteryChemistry === 'graphene' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Budget friendly initial cost. Noticeably heavier pack with lower efficiency.
            </p>
            <div className="mt-2 text-[11px] font-mono text-amber-500 flex items-center gap-1">
              <span>Life: 400-600 cycles (~1.5-2 yrs)</span>
            </div>
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: RANGE CALCULATOR ===================== */}
      {activeTab === 'range' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Form (7 Cols) in Tactile Liquid Glass Card */}
          <div className="lg:col-span-7 liquid-glass-card p-6 sm:p-7 rounded-2xl space-y-6">
            
            {/* Quick Pakistani Vehicle Presets */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Choose Your Electric Bike / Scooty</span>
                </label>
                <span className="text-[11px] text-slate-400">One-click presets · Keep battery tech above</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {VEHICLE_PRESETS.map((preset) => {
                  const isPresetActive = selectedPresetName === preset.name && voltage === preset.voltage && capacityAh === preset.capacityAh;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 text-xs font-medium rounded-xl border transition-all text-left group cursor-pointer ${
                        isPresetActive
                          ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 ring-2 ring-emerald-500/30 text-slate-900 dark:text-white shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold transition-colors ${isPresetActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white group-hover:text-emerald-500'}`}>
                          {preset.name}
                        </span>
                        {isPresetActive ? (
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950 rounded-full font-mono font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full font-mono">
                            {preset.badge}
                          </span>
                        )}
                      </div>
                      <span className={`text-[11px] block mt-1 ${isPresetActive ? 'text-emerald-950/80 dark:text-emerald-300/80 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                        {preset.voltage}V {preset.capacityAh}Ah · {preset.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Battery Size Sliders / Inputs */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    Battery Voltage & Capacity
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Think of Voltage (V) as motor power, and Capacity (Ah) as your fuel tank size.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{isAdvancedMode ? 'Hide Advanced' : 'Show Advanced'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    System Voltage (Volts)
                  </label>
                  <select
                    value={voltage}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSelectedPresetName(null);
                      setVoltage(v);
                      handleChargeVoltageChange(v);
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value={36}>36V (Electric Bicycle / Light Assist)</option>
                    <option value={48}>48V (Small Commuter Scooty)</option>
                    <option value={60}>60V (Standard City Scooty - Metro/Yadea)</option>
                    <option value={72}>72V (High-Power Scooty / CD70 Conversion)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Battery Tank Size (Ah)
                    </label>
                    <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      {capacityAh} Ah ({(voltage * capacityAh / 1000).toFixed(2)} kWh)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={60}
                    step={1}
                    value={capacityAh}
                    onChange={(e) => {
                      setSelectedPresetName(null);
                      setCapacityAh(Number(e.target.value));
                      setChargeBatteryCapacityAh(Number(e.target.value));
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>15Ah (Compact)</span>
                    <span>30Ah (Standard)</span>
                    <span>45Ah (Long Range)</span>
                    <span>60Ah (Touring)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Riding Speed & Load Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              {/* Average Riding Speed */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Riding Speed</span>
                    <span className="text-slate-400 ml-1.5 text-[11px]">(Wind resistance increases heavily above 40 km/h)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {avgSpeed} km/h
                  </span>
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
                  <span>15 km/h (Slow traffic)</span>
                  <span>35 km/h (City cruising)</span>
                  <span>50 km/h (Main road)</span>
                  <span>75 km/h (Top speed)</span>
                </div>
              </div>

              {/* Combined Payload */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Total Rider & Luggage Weight</span>
                    <span className="text-slate-400 ml-1.5 text-[11px]">(Includes passenger if double riding)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {combinedLoad} kg
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={180}
                  step={5}
                  value={combinedLoad}
                  onChange={(e) => setCombinedLoad(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>65 kg (Single Solo)</span>
                  <span>95 kg (Average Rider)</span>
                  <span>140 kg (With Passenger)</span>
                  <span>180 kg (Heavy Cargo)</span>
                </div>
              </div>
            </div>

            {/* Advanced Settings (Terrain, Motor Watts, Battery SOH) */}
            {isAdvancedMode && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Advanced Technical Adjustments
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Motor Wattage */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Motor Power (Watts)
                    </label>
                    <input
                      type="number"
                      step={100}
                      min={250}
                      max={5000}
                      value={motorWatts}
                      onChange={(e) => setMotorWatts(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Terrain */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Terrain / Traffic
                    </label>
                    <select
                      value={terrain}
                      onChange={(e) => setTerrain(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="flat">Flat City Asphalt</option>
                      <option value="moderate">Gentle Incline / Flyovers</option>
                      <option value="steep">Steep Roads (+35% load)</option>
                      <option value="traffic">Stop-and-Go Rush Hour</option>
                    </select>
                  </div>

                  {/* Battery Health % */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Battery Health (SOH)
                      </label>
                      <span className="text-xs font-mono font-bold text-emerald-500">{batterySOH}%</span>
                    </div>
                    <input
                      type="range"
                      min={60}
                      max={100}
                      value={batterySOH}
                      onChange={(e) => setBatterySOH(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Real-Time Computed Results Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-7 rounded-2xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Gauge className="w-4 h-4" />
                  <span>Real-World Range Estimate</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {rangeResults.effectiveKwh} kWh Usable
                </span>
              </div>

              {/* Big Range Display */}
              <div className="py-6 space-y-1">
                <p className="text-xs text-slate-400 font-medium">Estimated Distance on Single Charge</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                    {rangeResults.estimatedRangeKm}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-400">km</span>
                </div>
                <p className="text-xs text-slate-400">
                  At average {avgSpeed} km/h with {combinedLoad} kg load on {voltage}V {capacityAh}Ah pack.
                </p>
              </div>

              {/* Petrol Savings Comparison (AI Live Rates for Pakistan) */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-300 space-y-3">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Your Fuel Savings vs Petrol</span>
                  </span>
                  <span className="font-mono text-white text-sm">Save ~PKR {rangeResults.savingsPer1000Km.toLocaleString()}</span>
                </div>

                {/* AI Live Rates Status Banner */}
                {isAiPriceLoading ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300">
                    <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                    <span>Gemini AI is checking official OGRA petrol & NEPRA electricity rates in Pakistan...</span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Live Energy Rates (Pakistan)</span>
                      </div>
                      <button
                        type="button"
                        onClick={fetchLiveEnergyRates}
                        disabled={isAiPriceLoading}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-mono flex items-center gap-1"
                        title="Click to re-fetch live rates from OGRA & NEPRA via Gemini AI"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Re-check AI</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase">Petrol Pump (OGRA)</span>
                        <span className="font-bold text-amber-400 text-sm">PKR {petrolPrice.toFixed(2)}/L</span>
                      </div>
                      <div className="bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase">WAPDA Domestic Unit</span>
                        <span className="font-bold text-emerald-400 text-sm">PKR {electricityTariff.toFixed(2)}/kWh</span>
                      </div>
                    </div>

                    {aiPriceInfo?.summary && (
                      <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-1.5">
                        <span className="text-emerald-400 font-semibold">Source: </span>
                        {aiPriceInfo.source} · {aiPriceInfo.summary}
                      </p>
                    )}

                    <p className="text-[10px] text-slate-400/90 leading-tight border-t border-slate-800/80 pt-1.5 flex items-start gap-1">
                      <span className="text-emerald-400 font-semibold shrink-0">* Note:</span>
                      <span>AI-generated info related to EV scooty behaviors is an advisory benchmark and not fully implemented on your specific vehicle.</span>
                    </p>
                  </div>
                )}

                {/* Comparative Rate Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">EV Running Cost:</span>
                    <span className="font-bold text-emerald-400 text-sm">PKR {rangeResults.evCostPerKm} / km</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">70cc Petrol Bike:</span>
                    <span className="font-bold text-rose-400 text-sm">PKR {rangeResults.petrolCostPerKm} / km</span>
                  </div>
                </div>

                {/* Commuter Savings Summary */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-500/20 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Monthly Commute (25 km/day):</span>
                    <span className="font-bold text-white font-mono">Save ~PKR {rangeResults.monthlySavings.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Annual Fuel Savings:</span>
                    <span className="font-bold text-emerald-400 font-mono">Save ~PKR {rangeResults.yearlySavings.toLocaleString()}</span>
                  </div>
                </div>

                {/* Collapsible Manual Rate Adjuster */}
                <div className="pt-2 border-t border-emerald-500/20">
                  <button
                    type="button"
                    onClick={() => setShowCustomRates(!showCustomRates)}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center justify-between w-full"
                  >
                    <span className="flex items-center gap-1 text-emerald-400">
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>{showCustomRates ? 'Hide Custom Rate Controls' : 'Custom Petrol & Electricity Rates'}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Test future prices</span>
                  </button>

                  {showCustomRates && (
                    <div className="mt-3 p-3 rounded-lg bg-slate-950/90 border border-slate-800 space-y-3 text-xs">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-slate-300 font-medium">Petrol Price (PKR / Liter)</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400">PKR</span>
                            <input
                              type="number"
                              min={150}
                              max={600}
                              step={0.1}
                              value={petrolPrice}
                              onChange={(e) => setPetrolPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                              className="w-20 px-2 py-0.5 rounded bg-slate-900 border border-amber-500/40 text-amber-400 font-mono font-bold text-right text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min={200}
                          max={480}
                          step={0.5}
                          value={petrolPrice}
                          onChange={(e) => setPetrolPrice(Number(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                          <span>200</span>
                          <span className="text-amber-400 font-mono">Current ~376.06</span>
                          <span>480</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-slate-300 font-medium">Petrol Bike Fuel Average</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={20}
                              max={80}
                              step={1}
                              value={petrolMileageKmPerL}
                              onChange={(e) => setPetrolMileageKmPerL(Math.max(1, parseInt(e.target.value, 10) || 1))}
                              className="w-16 px-2 py-0.5 rounded bg-slate-900 border border-rose-500/40 text-slate-200 font-mono font-bold text-right text-xs focus:outline-none focus:ring-1 focus:ring-rose-400"
                            />
                            <span className="text-[10px] text-slate-400">km/L</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={25}
                          max={70}
                          step={1}
                          value={petrolMileageKmPerL}
                          onChange={(e) => setPetrolMileageKmPerL(Number(e.target.value))}
                          className="w-full accent-rose-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-slate-300 font-medium">WAPDA Unit Rate (PKR / kWh)</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400">PKR</span>
                            <input
                              type="number"
                              min={10}
                              max={120}
                              step={0.5}
                              value={electricityTariff}
                              onChange={(e) => setElectricityTariff(Math.max(0, parseFloat(e.target.value) || 0))}
                              className="w-20 px-2 py-0.5 rounded bg-slate-900 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-right text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min={15}
                          max={90}
                          step={0.5}
                          value={electricityTariff}
                          onChange={(e) => setElectricityTariff(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={fetchLiveEnergyRates}
                        className="w-full py-1.5 text-center text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline flex items-center justify-center gap-1 border border-emerald-500/20 rounded bg-emerald-950/30"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Re-sync with official Pakistan rates (PSO & OGRA)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Energy Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Energy Consumption</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {rangeResults.whPerKm} Wh / km
                  </span>
                  <span className="text-[10px] text-slate-500 block">Avg power draw</span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Cruising Current</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {rangeResults.cruisingAmps} Amps
                  </span>
                  <span className="text-[10px] text-slate-500 block">Peak: {rangeResults.peakAmps}A</span>
                </div>
              </div>

              {/* Switch to Tab 2 or 3 link */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Want to check how long it takes to charge?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('charge')}
                  className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                >
                  Calculate Charge Time <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Quick Consultation CTA */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Getting lower range on your bike than expected?</span>
              <a
                href="#contact"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                Free Diagnostic Checkup <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Small Advisory Note */}
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center sm:text-left px-1">
              * Note: AI-generated info related to EV scooty behaviors is an advisory benchmark and not fully implemented on your specific vehicle.
            </p>

          </div>

        </div>
      )}

      {/* ===================== TAB 2: CHARGE TIME & COST ===================== */}
      {activeTab === 'charge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Form (7 Cols) in Tactile Liquid Glass Card */}
          <div className="lg:col-span-7 liquid-glass-card p-6 sm:p-7 rounded-2xl space-y-6">
            
            {/* Standard Charger Options for everyday users */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Your Charger Speed
                </label>
                <span className="text-[11px] text-slate-400">
                  Selected:{' '}
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {chargerAmps}A
                  </span>{' '}
                  ({chargeResults.chargerWatts}W output)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5">
                {CHARGER_SPEED_PRESETS.map((preset) => {
                  const isActive = chargerAmps === preset.amps;
                  return (
                    <button
                      key={preset.amps}
                      type="button"
                      onClick={() => applyChargerSpeed(preset.amps)}
                      className={`relative p-3 rounded-xl border-2 transition-all text-left group cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 ring-2 ring-emerald-500/30 dark:ring-emerald-500/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span
                            className={`font-bold text-xs ${
                              isActive
                                ? 'text-emerald-900 dark:text-emerald-200'
                                : 'text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                            }`}
                          >
                            {preset.name}
                          </span>
                          {isActive ? (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full border border-emerald-400/30 shrink-0">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                              {preset.badge}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[11px] block leading-relaxed ${
                            isActive
                              ? 'text-emerald-950/80 dark:text-emerald-300/80 font-medium'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {preset.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Battery Pack */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                Your Battery Pack Capacity
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Nominal Voltage (V)
                  </label>
                  <select
                    value={chargeBatteryVoltage}
                    onChange={(e) => handleChargeVoltageChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value={36}>36V Pack (e-Bike / Bicycle)</option>
                    <option value={48}>48V Pack (Light Scooty)</option>
                    <option value={60}>60V Pack (Standard City Scooty)</option>
                    <option value={72}>72V Pack (High Power / Conversion)</option>
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
                    Total Energy: {((chargeBatteryVoltage * chargeBatteryCapacityAh) / 1000).toFixed(2)} kWh
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
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Current Battery Level</span>
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
                  <span className="text-[10px] text-slate-400 block font-mono">Current meter reading when plugging in</span>
                </div>

                {/* Target SOC */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Desired Target Level</span>
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
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono">
                    💡 Pro tip: Stopping at 85% triples battery cycle life!
                  </span>
                </div>

              </div>
            </div>

            {/* Electricity Tariff Rate */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <span>WAPDA Electricity Rate per Unit (PKR)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 font-mono flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>AI Synced</span>
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchLiveEnergyRates}
                    disabled={isAiPriceLoading}
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    title="Refresh rate from NEPRA official baseline"
                  >
                    <RefreshCw className={`w-2.5 h-2.5 ${isAiPriceLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    PKR {electricityTariff.toFixed(2)} / unit
                  </span>
                </div>
              </div>
              <input
                type="number"
                step="0.5"
                min="1"
                max="80"
                value={electricityTariff}
                onChange={(e) => setElectricityTariff(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Standard NEPRA residential unit rate with fuel adjustments. Updates automatically via Gemini AI.
              </span>
            </div>

          </div>

          {/* Real-Time Computed Charge Time Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-7 rounded-2xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Charging Duration & Cost</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {chargeResults.chargerWatts}W output
                </span>
              </div>

              {/* Big Time Duration Display */}
              <div className="py-6 space-y-1">
                <p className="text-xs text-slate-400 font-medium">Estimated Time to Reach {targetSOC}%</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                    {chargeResults.hours}h {chargeResults.minutes}m
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Charging from {currentSOC}% to {targetSOC}% on a {chargeBatteryVoltage}V {chargeBatteryCapacityAh}Ah pack.
                </p>
              </div>

              {/* Real World Cost in PKR */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Units Consumed</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {chargeResults.wallUnitsKwh} Units (kWh)
                  </span>
                  <span className="text-[10px] text-slate-500 block">From wall meter</span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Total Session Cost</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    PKR {chargeResults.sessionCost}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Cheaper than tea!</span>
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

                {/* Longevity Tip */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <Info className="w-3.5 h-3.5" />
                    <span>Battery Health Tip</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    {targetSOC <= 85 ? (
                      <span>Capping your daily charging at {targetSOC}% eliminates cell electrolyte stress, keeping your battery fresh for 5+ years.</span>
                    ) : (
                      <span>Charging to 100% is fine when preparing for a long ride! For daily short commutes, unplugging at 85-90% doubles battery life.</span>
                    )}
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Action */}
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

      {/* ===================== TAB 3: BATTERY HEALTH & LIFE ESTIMATOR ===================== */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Diagnostic Questionnaire / Habit Form (7 Cols) in Tactile Liquid Glass Card */}
          <div className="lg:col-span-7 liquid-glass-card p-6 sm:p-7 rounded-2xl space-y-6">
            
            {/* Header intro */}
            <div>
              <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider mb-1">
                <HeartPulse className="w-4 h-4" />
                <span>Battery Lifespan Diagnostic</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                How Do You Charge & Ride Your Electric Bike?
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Answer these simple questions. Our algorithmic model estimates your battery degradation rate, remaining years of life, and shows how simple habit tweaks can save you over PKR 70,000.
              </p>
            </div>

            {/* Question 1: Daily Commuting Distance */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  1. How Many Kilometers Do You Ride Daily?
                </label>
                <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {healthDailyKm} km / day
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={90}
                step={5}
                value={healthDailyKm}
                onChange={(e) => setHealthDailyKm(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10 km (Quick market trips)</span>
                <span>25 km (Standard commute)</span>
                <span>50 km (Double commute)</span>
                <span>80+ km (Delivery / Rider)</span>
              </div>
            </div>

            {/* Question 2: Charging Habit (Depth of Discharge) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                2. What Is Your Usual Charging Habit?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setHealthChargeHabit('sweet_spot')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    healthChargeHabit === 'sweet_spot'
                      ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">⭐ Sweet Spot (20% - 85%)</span>
                    {healthChargeHabit === 'sweet_spot' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Charge when battery drops to 20-30%, unplug near 85%. Never let it drain to zero.
                  </p>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
                    +100% Lifespan Boost (2x Cycles)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setHealthChargeHabit('regular_100')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    healthChargeHabit === 'regular_100'
                      ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Regular 100% Everyday</span>
                    {healthChargeHabit === 'regular_100' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Plug in each night, let it charge to full 100%, ride next morning.
                  </p>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">
                    Standard Baseline Lifespan
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setHealthChargeHabit('deep_drain')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    healthChargeHabit === 'deep_drain'
                      ? 'border-rose-500 bg-rose-500/10 text-slate-900 dark:text-white ring-2 ring-rose-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-rose-500">⚠️ Ride Until Nearly Empty</span>
                    {healthChargeHabit === 'deep_drain' && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Only charge when meter turns red or bike slows down below 10%.
                  </p>
                  <span className="text-[10px] font-mono text-rose-500 font-bold block mt-1">
                    -35% Accelerated Wear
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setHealthChargeHabit('overnight_float')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    healthChargeHabit === 'overnight_float'
                      ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white ring-2 ring-amber-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-500">Left Plugged In All Night</span>
                    {healthChargeHabit === 'overnight_float' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Charger stays on for 10-12 hours continuously every single night.
                  </p>
                  <span className="text-[10px] font-mono text-amber-500 font-bold block mt-1">
                    -18% Stress from Float Trickle
                  </span>
                </button>
              </div>
            </div>

            {/* Question 3: Summer Heat & Cooldown (Crucial for Gujranwala / Punjab) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ThermometerSun className="w-3.5 h-3.5 text-amber-500" />
                  <span>3. Summer Heat & Cooldown Routine (Gujranwala / Punjab 40°C+)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setHealthCoolingHabit('shaded_cooled')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    healthCoolingHabit === 'shaded_cooled'
                      ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">🌿 Cooled Down & Shaded</span>
                    {healthCoolingHabit === 'shaded_cooled' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Wait 20-30 mins after riding for cells to cool down; charge in ventilated shade.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setHealthCoolingHabit('hot_plug')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    healthCoolingHabit === 'hot_plug'
                      ? 'border-rose-500 bg-rose-500/10 text-slate-900 dark:text-white ring-2 ring-rose-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-rose-500">☀️ Plugged In Immediately Hot</span>
                    {healthCoolingHabit === 'hot_plug' && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Plugged in right after riding on hot asphalt or charged under direct sunlight.
                  </p>
                  <span className="text-[10px] font-mono text-rose-500 font-bold block mt-1">
                    -24% Accelerated Thermal Wear
                  </span>
                </button>
              </div>
            </div>

            {/* Question 4: Battery Age in Months */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  4. How Old Is Your Current Battery Pack?
                </label>
                <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {healthBatteryAgeMonths} Months ({ (healthBatteryAgeMonths / 12).toFixed(1) } yrs)
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={48}
                step={2}
                value={healthBatteryAgeMonths}
                onChange={(e) => setHealthBatteryAgeMonths(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Brand New (0 mo)</span>
                <span>1 Year (12 mo)</span>
                <span>2 Years (24 mo)</span>
                <span>4 Years (48 mo)</span>
              </div>
            </div>

            {/* Question 5: Warning Symptoms Checklist */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                5. Do You Experience Any of These Warning Symptoms?
              </label>

              <div className="space-y-2">
                <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/40">
                  <input
                    type="checkbox"
                    checked={symptomSuddenDrop}
                    onChange={(e) => setSymptomSuddenDrop(e.target.checked)}
                    className="mt-0.5 accent-emerald-500 w-4 h-4 rounded"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                      Sudden drop in meter (e.g. falls rapidly from 30% to 0%)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Indicates unbalanced cell strings or weak individual series needing BMS balancing.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/40">
                  <input
                    type="checkbox"
                    checked={symptomPowerCutUphill}
                    onChange={(e) => setSymptomPowerCutUphill(e.target.checked)}
                    className="mt-0.5 accent-emerald-500 w-4 h-4 rounded"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                      Power cuts off or scooter crawls when climbing flyovers or sudden throttle
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      High internal resistance causing excessive voltage sag under acceleration.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/40">
                  <input
                    type="checkbox"
                    checked={symptomHotCharger}
                    onChange={(e) => setSymptomHotCharger(e.target.checked)}
                    className="mt-0.5 accent-emerald-500 w-4 h-4 rounded"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                      Charger gets burning hot or shuts off before full charge
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Could be faulty cooling fan, mismatched voltage cutoff, or cell overvoltage.
                    </span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Diagnostic Result Card & Action Plan (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-7 rounded-2xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span>Diagnostic Health Card</span>
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${healthResults.healthBg}`}>
                  {healthResults.healthStatus}
                </span>
              </div>

              {/* Big SOH Percentage & Visual Gauge */}
              <div className="py-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400 font-medium">Estimated Battery SOH (State of Health)</p>
                  <span className="text-xs font-mono text-slate-400">Target &gt; 70%</span>
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className={`text-6xl sm:text-7xl font-extrabold font-mono tracking-tight tabular-nums ${healthResults.healthColor}`}>
                    {healthResults.estimatedSOH}%
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {healthResults.estimatedSOH >= 85 ? 'Healthy Pack' : healthResults.estimatedSOH >= 70 ? 'Moderate Age' : 'Needs Checkup'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full transition-all duration-500 ${healthResults.progressBg}`} 
                    style={{ width: `${healthResults.estimatedSOH}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0% (Dead)</span>
                  <span>70% (EV Minimum)</span>
                  <span>100% (Brand New)</span>
                </div>
              </div>

              {/* Expected Lifespan in Years & KM */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Remaining Lifespan</span>
                  <span className="font-mono font-bold text-white text-base">
                    ~{healthResults.remainingYears} Years
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    ({healthResults.remainingMonths} months left)
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Total Lifetime Distance</span>
                  <span className="font-mono font-bold text-emerald-400 text-base">
                    {healthResults.totalLifetimeKm.toLocaleString()} km
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    ~{healthResults.totalExpectedCycles} total cycles
                  </span>
                </div>
              </div>

              {/* Habit Value / Savings Banner */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>Habit Value Calculation</span>
                  </span>
                  <span className="font-mono text-white text-xs">Pack Value: ~PKR {healthResults.packCostPkr.toLocaleString()}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {healthChargeHabit === 'sweet_spot' && healthCoolingHabit === 'shaded_cooled' ? (
                    <span className="text-emerald-300">
                      🎉 <strong>Excellent Care!</strong> Your 20%-80% shallow charging and cool resting habits will grant up to <strong>{healthResults.potentialLifetimeKm.toLocaleString()} km</strong> of riding, saving you over <strong>PKR {healthResults.annualizedSavingsPkr.toLocaleString()}</strong> in early battery replacement costs!
                    </span>
                  ) : (
                    <span>
                      💡 <strong>Potential Gain:</strong> By switching to shallow 20%-80% charging and letting your battery rest 20 mins before summer charging, you can extend pack life by <strong>+{ (Number(healthResults.potentialLifespanYears) - Number(healthResults.expectedLifespanYears)).toFixed(1) } Years</strong> and save ~<strong>PKR {healthResults.annualizedSavingsPkr.toLocaleString()}</strong>!
                    </span>
                  )}
                </p>
              </div>

              {/* Actionable Diagnostics Checklist */}
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  Prescribed Battery Care Protocol:
                </span>
                <ul className="text-[11px] text-slate-400 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>The 20-Min Cooldown:</strong> In Gujranwala summers (40°C+), never plug into the charger immediately after riding. Let cell core temperature drop first.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Monthly Full Balance:</strong> Once a month, charge to 100% and leave it on for 60 extra minutes so the BMS can equalize cell group voltages.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Storage Rule:</strong> If you are traveling or leaving the scooter parked for more than 5 days, keep battery level around 50%-60%.
                    </span>
                  </li>
                </ul>

                {/* Small Advisory Note */}
                <p className="text-[10px] text-slate-400 leading-tight border-t border-slate-800/80 pt-2 flex items-start gap-1">
                  <span className="text-emerald-400 font-semibold shrink-0">* Note:</span>
                  <span>AI-generated info related to EV scooty behaviors is an advisory benchmark and not fully implemented on your specific vehicle.</span>
                </p>
              </div>

            </div>

            {/* Direct Workshop / Doorstep Diagnostic Booking */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-sm">Need a Certified Physical Cell Diagnostic?</h3>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                NextGen EV Care provides computerized BMS cell impedance testing, capacity discharge analysis, and doorstep battery health certifications anywhere in Gujranwala.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href="#contact"
                  className="px-4 py-2 bg-white text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Book Doorstep Diagnostic</span>
                </a>
                <a
                  href="https://wa.me/923217436463?text=Hi%20NextGen%20EV%20Care,%20I%20used%20your%20Battery%20Health%20Calculator%20and%20want%20a%20physical%20diagnostic%20checkup%20for%20my%20bike."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-950/40 border border-emerald-400/40 text-white font-semibold text-xs rounded-xl hover:bg-emerald-950/60 transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>WhatsApp: 0321-7436463</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Non-Technical Explanatory FAQ / Guide Section */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mb-6">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Beginner's EV Knowledge Guide
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Understanding Your Electric Bike in Plain Words
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            No engineering degree required! Here are simple answers to common questions about battery care in Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
              V
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">What is Voltage (36V, 48V, 60V, 72V)?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Voltage is like water pressure. Higher voltage (e.g. 72V) gives faster acceleration, higher top speed, and better power to climb flyovers compared to 48V.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
              Ah
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">What is Ah (Ampere-Hours)?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ah is your fuel tank capacity. A 30Ah battery stores twice as much energy as a 15Ah battery, giving you roughly double the riding distance per charge.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs">
              80%
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Why the 20% to 80% Rule?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Just like humans feel stressed when completely starving or overstuffed, lithium battery cells experience physical expansion strain at 100% and 0%. Keeping it in the middle triples cycle life.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
