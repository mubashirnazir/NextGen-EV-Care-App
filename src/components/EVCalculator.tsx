import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Gauge,
  BatteryCharging,
  HeartPulse,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Wrench,
  Clock,
  Coins,
  Thermometer,
  Cpu
} from 'lucide-react';
import { RangeTemperatureChart, ChemistryBaselineInput } from './RangeTemperatureChart';

export type BatteryChemistry = 'li-ion' | 'lifepo4' | 'graphene';
export type WeatherCondition = 'cold' | 'mild' | 'hot';
export type CalculatorTab = 'range' | 'charge' | 'health';

interface VehiclePreset {
  id: string;
  name: string;
  voltage: number;
  capacityAh: number;
  motorWatts: number;
  avgSpeed: number;
  chemistry: BatteryChemistry;
}

const VEHICLE_PRESETS: VehiclePreset[] = [
  {
    id: 'standard-scooty',
    name: 'Standard Scooty',
    voltage: 60,
    capacityAh: 30,
    motorWatts: 1500,
    avgSpeed: 35,
    chemistry: 'li-ion',
  },
  {
    id: 'power-pack',
    name: 'Power Pack Scooty',
    voltage: 72,
    capacityAh: 35,
    motorWatts: 2000,
    avgSpeed: 42,
    chemistry: 'lifepo4',
  },
  {
    id: 'economy-ebike',
    name: 'City Commuter E-Bike',
    voltage: 48,
    capacityAh: 20,
    motorWatts: 800,
    avgSpeed: 28,
    chemistry: 'li-ion',
  },
  {
    id: 'graphene-scooty',
    name: 'Lead-Acid / Graphene',
    voltage: 60,
    capacityAh: 24,
    motorWatts: 1200,
    avgSpeed: 32,
    chemistry: 'graphene',
  },
];

interface WeatherOption {
  id: WeatherCondition;
  title: string;
  rangeLabel: string;
  statusLabel: string;
  rangeMultiplier: number;
  efficiencyPenaltyPct: number;
}

const WEATHER_OPTIONS: WeatherOption[] = [
  {
    id: 'cold',
    title: 'Freezing / Winter',
    rangeLabel: '0°C – 10°C',
    statusLabel: '❄️ Cold Weather (Reduced Range)',
    rangeMultiplier: 0.75,
    efficiencyPenaltyPct: 25,
  },
  {
    id: 'mild',
    title: 'Moderate / Spring',
    rangeLabel: '11°C – 25°C',
    statusLabel: '⛅ Mild / Normal',
    rangeMultiplier: 1.0,
    efficiencyPenaltyPct: 0,
  },
  {
    id: 'hot',
    title: 'Hot Summer',
    rangeLabel: '26°C – 45°C',
    statusLabel: '☀️ Hot Weather',
    rangeMultiplier: 0.9,
    efficiencyPenaltyPct: 10,
  },
];

interface ChemistrySpec {
  id: BatteryChemistry;
  name: string;
  shortName: string;
  cellSpec: string;
  cutoffNote: string;
  lifespanBadge: string;
  usableFactor: number;
  dischargeEfficiency: number;
  weightDrag: number;
  sagSensitivity: number;
  baseCycles: number;
  annualCalendarWearPct: number;
  sweetSpotMult: number;
  deepDrainMult: number;
  hotPlugMult: number;
  baseWhPerKm: number;
}

const CHEMISTRY_SPECS: Record<BatteryChemistry, ChemistrySpec> = {
  lifepo4: {
    id: 'lifepo4',
    name: 'LiFePO4 (LFP)',
    shortName: 'LiFePO4 (3.2V/cell)',
    cellSpec: '3.2V /cell · Flat curve',
    cutoffNote: '2.5V/cell flat discharge',
    lifespanBadge: '3,000+ base cycles · 1.4%/yr wear',
    usableFactor: 0.96,
    dischargeEfficiency: 0.99,
    weightDrag: 1.02,
    sagSensitivity: 0.04,
    baseCycles: 3000,
    annualCalendarWearPct: 1.4,
    sweetSpotMult: 1.5,
    deepDrainMult: 0.72,
    hotPlugMult: 0.85,
    baseWhPerKm: 20.5,
  },
  'li-ion': {
    id: 'li-ion',
    name: 'Li-Ion (NMC/NCA)',
    shortName: 'Li-Ion (3.6V/cell)',
    cellSpec: '3.6V /cell · High density',
    cutoffNote: '3.0V/cell BMS cut-off',
    lifespanBadge: '1,000+ base cycles · 2.8%/yr wear',
    usableFactor: 0.92,
    dischargeEfficiency: 0.97,
    weightDrag: 1.0,
    sagSensitivity: 0.12,
    baseCycles: 1000,
    annualCalendarWearPct: 2.8,
    sweetSpotMult: 1.85,
    deepDrainMult: 0.62,
    hotPlugMult: 0.75,
    baseWhPerKm: 20.0,
  },
  graphene: {
    id: 'graphene',
    name: 'Graphene / Lead-Acid',
    shortName: 'Graphene (12V block)',
    cellSpec: '12V /Block · Heavy sag',
    cutoffNote: '10.5V/block Peukert sag',
    lifespanBadge: '500+ base cycles · 6.5%/yr wear',
    usableFactor: 0.78,
    dischargeEfficiency: 0.85,
    weightDrag: 1.1,
    sagSensitivity: 0.45,
    baseCycles: 500,
    annualCalendarWearPct: 6.5,
    sweetSpotMult: 1.25,
    deepDrainMult: 0.55,
    hotPlugMult: 0.7,
    baseWhPerKm: 22.5,
  },
};

const CHARGER_AMPS_OPTIONS = [3, 5, 6, 10, 15];

const GLASS_CARD_CLASS =
  'backdrop-blur-xl bg-white/75 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm';

export interface EVCalculatorProps {
  onBookService?: () => void;
  batteryChemistry?: BatteryChemistry;
  onChemistryChange?: (chemistry: BatteryChemistry) => void;
  activeToolTab?: CalculatorTab;
  onToolTabChange?: (tab: CalculatorTab) => void;
}

export const EVCalculator: React.FC<EVCalculatorProps> = ({
  onBookService,
  batteryChemistry: controlledChemistry,
  onChemistryChange,
  activeToolTab: controlledToolTab,
  onToolTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<CalculatorTab>('range');
  const activeTab = controlledToolTab ?? internalTab;
  const setActiveTab = (tab: CalculatorTab) => {
    setInternalTab(tab);
    onToolTabChange?.(tab);
  };

  // --- Shared Ride, Weather & Battery Specs ---
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('standard-scooty');
  const [internalChemistry, setInternalChemistry] = useState<BatteryChemistry>('li-ion');
  const batteryChemistry = controlledChemistry ?? internalChemistry;
  const setBatteryChemistry = (chem: BatteryChemistry) => {
    setInternalChemistry(chem);
    onChemistryChange?.(chem);
  };
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('mild');
  const [voltage, setVoltage] = useState<number>(60);
  const [capacityAh, setCapacityAh] = useState<number>(30);
  const [avgSpeed, setAvgSpeed] = useState<number>(35);
  const [combinedLoad, setCombinedLoad] = useState<number>(85);

  // --- Collapsible Advanced Settings ---
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [motorWatts, setMotorWatts] = useState<number>(1500);
  const [terrain, setTerrain] = useState<'flat' | 'moderate' | 'steep' | 'traffic'>('flat');
  const [batterySOH, setBatterySOH] = useState<number>(96);

  // --- Pakistan Energy Rates (Synced Once, Editable in Advanced) ---
  const [petrolPrice, setPetrolPrice] = useState<number>(376.06);
  const [petrolMileageKmPerL, setPetrolMileageKmPerL] = useState<number>(45);
  const [electricityTariff, setElectricityTariff] = useState<number>(34.0);
  const [isRatesSyncing, setIsRatesSyncing] = useState<boolean>(false);

  // --- Charge Time Tab State ---
  const [chargerAmps, setChargerAmps] = useState<number>(6);
  const [currentSOC, setCurrentSOC] = useState<number>(20);
  const [targetSOC, setTargetSOC] = useState<number>(85);

  // --- Lifespan Diagnostic Tab State ---
  const [healthDailyKm, setHealthDailyKm] = useState<number>(25);
  const [healthBatteryAgeMonths, setHealthBatteryAgeMonths] = useState<number>(8);
  const [healthChargeHabit, setHealthChargeHabit] = useState<'sweet_spot' | 'regular_100' | 'deep_drain'>('sweet_spot');
  const [healthCoolingHabit, setHealthCoolingHabit] = useState<'shaded_cooled' | 'hot_plug'>('shaded_cooled');

  const syncLiveRates = async () => {
    setIsRatesSyncing(true);
    try {
      const res = await fetch('/api/pakistan-energy-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.petrolPricePerLiter && !isNaN(Number(data.petrolPricePerLiter))) {
        setPetrolPrice(Number(data.petrolPricePerLiter));
      }
      if (data.electricityTariffPerUnit && !isNaN(Number(data.electricityTariffPerUnit))) {
        setElectricityTariff(Number(data.electricityTariffPerUnit));
      }
    } catch {
      // Keep verified baseline values silently
    } finally {
      setIsRatesSyncing(false);
    }
  };

  useEffect(() => {
    syncLiveRates();
  }, []);

  const handleSelectPreset = (preset: VehiclePreset) => {
    setSelectedPresetId(preset.id);
    setVoltage(preset.voltage);
    setCapacityAh(preset.capacityAh);
    setMotorWatts(preset.motorWatts);
    setAvgSpeed(preset.avgSpeed);
    setBatteryChemistry(preset.chemistry);
  };

  // --- Range, Weather & Battery Chemistry Simulation Engine ---
  const activeWeather = useMemo(
    () => WEATHER_OPTIONS.find((w) => w.id === weatherCondition) || WEATHER_OPTIONS[1],
    [weatherCondition]
  );
  const activeChemistry = CHEMISTRY_SPECS[batteryChemistry];

  const rangeSimulation = useMemo(() => {
    const nominalWh = voltage * capacityAh;
    const chem = CHEMISTRY_SPECS[batteryChemistry];

    const speedFactor = Math.pow(avgSpeed / 25, 1.45);
    const loadFactor = 1 + ((combinedLoad - 75) / 100) * 0.35;

    let terrainFactor = 1.0;
    let terrainStressPenalty = 0;
    if (terrain === 'moderate') {
      terrainFactor = 1.15;
      terrainStressPenalty = 4;
    } else if (terrain === 'steep') {
      terrainFactor = 1.35;
      terrainStressPenalty = 11;
    } else if (terrain === 'traffic') {
      terrainFactor = 1.24;
      terrainStressPenalty = 6;
    }

    // Dynamic voltage cut-off sag under heavy throttle/speed (Peukert effect strongest on Lead-Acid/Graphene Gel)
    const heavyThrottleRatio = Math.max(0, (avgSpeed - 32) / 43);
    const voltageSagFactor = Math.max(0.74, 1 - heavyThrottleRatio * chem.sagSensitivity);

    const motorScaleFactor = 0.75 + (motorWatts / 1500) * 0.25;
    const whPerKm = Math.max(
      10,
      Math.round(18.5 * motorScaleFactor * speedFactor * loadFactor * terrainFactor * chem.weightDrag * 10) / 10
    );

    const effectiveWh = nominalWh * (batterySOH / 100) * chem.usableFactor * chem.dischargeEfficiency * voltageSagFactor;
    const factoryEffectiveWh = nominalWh * 0.95;

    const baseRangeKm = effectiveWh / whPerKm;
    const estimatedRangeKm = Math.max(1, Math.round(baseRangeKm * activeWeather.rangeMultiplier));
    const factoryConditionRangeKm = Math.max(
      estimatedRangeKm,
      Math.round(factoryEffectiveWh / (18.5 * motorScaleFactor * speedFactor * loadFactor))
    );

    // Calculate Range Efficiency % (combines SOH, chemistry discharge curve, throttle voltage sag, load & temperature)
    const speedStressPenalty = avgSpeed > 44 ? (avgSpeed - 44) * 0.45 : 0;
    const loadStressPenalty = combinedLoad > 120 ? (combinedLoad - 120) * 0.2 : 0;
    const sagPenaltyPct = Math.round((1 - voltageSagFactor) * 100);
    const efficiencyPct = Math.max(
      20,
      Math.min(
        100,
        Math.round(
          batterySOH * chem.dischargeEfficiency -
            activeWeather.efficiencyPenaltyPct -
            terrainStressPenalty -
            speedStressPenalty -
            loadStressPenalty -
            sagPenaltyPct * 0.5
        )
      )
    );

    // Health Band Classification (Emerald 85-100%, Amber 60-84%, Red <60%)
    let healthBand: 'healthy' | 'moderate' | 'critical' = 'healthy';
    let healthLabel = 'Healthy pack / peak range';
    let barHexColor = '#10b981';
    let badgeColorClass = 'text-emerald-600 dark:text-emerald-400';

    if (efficiencyPct >= 85) {
      healthBand = 'healthy';
      healthLabel = 'Healthy pack / peak range';
      barHexColor = '#10b981';
      badgeColorClass = 'text-emerald-600 dark:text-emerald-400';
    } else if (efficiencyPct >= 60) {
      healthBand = 'moderate';
      healthLabel = 'Moderate wear / routine balance recommended';
      barHexColor = '#f59e0b';
      badgeColorClass = 'text-amber-600 dark:text-amber-400';
    } else {
      healthBand = 'critical';
      healthLabel = 'Weak cells / urgent service needed';
      barHexColor = '#ef4444';
      badgeColorClass = 'text-red-600 dark:text-red-400';
    }

    // PKR Savings vs Petrol Bike (750 km/month daily commute baseline)
    const evCostPerKm = (whPerKm / 1000 / Math.max(0.7, activeWeather.rangeMultiplier)) * electricityTariff;
    const petrolCostPerKm = petrolPrice / petrolMileageKmPerL;
    const monthlySavingsPkr = Math.max(0, Math.round((petrolCostPerKm - evCostPerKm) * 750));
    const yearlySavingsPkr = monthlySavingsPkr * 12;

    return {
      nominalKwh: (nominalWh / 1000).toFixed(2),
      estimatedRangeKm,
      factoryConditionRangeKm,
      efficiencyPct,
      healthBand,
      healthLabel,
      barHexColor,
      badgeColorClass,
      evCostPerKm: evCostPerKm.toFixed(2),
      petrolCostPerKm: petrolCostPerKm.toFixed(2),
      monthlySavingsPkr,
      yearlySavingsPkr,
      whPerKm,
    };
  }, [
    voltage,
    capacityAh,
    batteryChemistry,
    activeWeather,
    avgSpeed,
    combinedLoad,
    terrain,
    motorWatts,
    batterySOH,
    electricityTariff,
    petrolPrice,
    petrolMileageKmPerL,
  ]);

  // --- Baseline Range by Chemistry (for D3 Temperature & Chemistry Trend Chart) ---
  const chemistryBaselines = useMemo<Record<BatteryChemistry, ChemistryBaselineInput>>(() => {
    const nominalWh = voltage * capacityAh;
    const speedFactor = Math.pow(avgSpeed / 25, 1.45);
    const loadFactor = 1 + ((combinedLoad - 75) / 100) * 0.35;
    const terrainFactor =
      terrain === 'moderate' ? 1.15 : terrain === 'steep' ? 1.35 : terrain === 'traffic' ? 1.24 : 1.0;
    const heavyThrottleRatio = Math.max(0, (avgSpeed - 32) / 43);
    const motorScaleFactor = 0.75 + (motorWatts / 1500) * 0.25;

    const computeFor = (chemId: BatteryChemistry): ChemistryBaselineInput => {
      const chem = CHEMISTRY_SPECS[chemId];
      const voltageSagFactor = Math.max(0.74, 1 - heavyThrottleRatio * chem.sagSensitivity);
      const whPerKm = Math.max(
        10,
        Math.round(18.5 * motorScaleFactor * speedFactor * loadFactor * terrainFactor * chem.weightDrag * 10) / 10
      );
      const effectiveWh =
        nominalWh * (batterySOH / 100) * chem.usableFactor * chem.dischargeEfficiency * voltageSagFactor;
      return {
        id: chemId,
        label: chem.name,
        baseRangeKm: Math.max(1, Math.round(effectiveWh / whPerKm)),
      };
    };

    return {
      lifepo4: computeFor('lifepo4'),
      'li-ion': computeFor('li-ion'),
      graphene: computeFor('graphene'),
    };
  }, [voltage, capacityAh, avgSpeed, combinedLoad, terrain, motorWatts, batterySOH]);

  // --- Charge Time & Cost Engine (Chemistry-Exact CC/CV Taper Model) ---
  const chargeSimulation = useMemo(() => {
    const chem = CHEMISTRY_SPECS[batteryChemistry];

    const chargerVoltage =
      batteryChemistry === 'lifepo4'
        ? voltage === 36
          ? 43.8
          : voltage === 48
          ? 58.4
          : voltage === 60
          ? 73.0
          : 87.6
        : batteryChemistry === 'graphene'
        ? voltage === 36
          ? 44.1
          : voltage === 48
          ? 58.8
          : voltage === 60
          ? 73.5
          : 88.2
        : voltage === 36
        ? 42.0
        : voltage === 48
        ? 54.6
        : voltage === 60
        ? 67.2
        : 84.0;

    const totalWh = voltage * capacityAh;
    const socDelta = Math.max(5, targetSOC - currentSOC);
    const energyNeededWh = (totalWh * socDelta) / 100;
    const chargerWatts = chargerVoltage * chargerAmps;

    // Chemistry-specific charging efficiency, CV/absorption taper threshold & slowdown
    const wallEfficiency =
      batteryChemistry === 'lifepo4' ? 0.91 : batteryChemistry === 'graphene' ? 0.78 : 0.88;
    const lineLossFactor =
      batteryChemistry === 'lifepo4' ? 1.04 : batteryChemistry === 'graphene' ? 1.14 : 1.06;
    const taperThreshold =
      batteryChemistry === 'lifepo4' ? 92 : batteryChemistry === 'graphene' ? 75 : 80;
    const cvSlowdown =
      batteryChemistry === 'lifepo4' ? 1.35 : batteryChemistry === 'graphene' ? 2.45 : 1.85;
    const avgDcPowerFactor = batteryChemistry === 'graphene' ? 0.92 : 0.94;

    const ccPct = Math.max(0, Math.min(targetSOC, taperThreshold) - currentSOC);
    const cvPct = Math.max(0, targetSOC - Math.max(currentSOC, taperThreshold));
    const effectiveWhNeeded = (totalWh * (ccPct + cvPct * cvSlowdown)) / 100;

    const hoursFloat = (effectiveWhNeeded / (chargerWatts * avgDcPowerFactor)) * lineLossFactor;
    const totalMinutes = Math.max(10, Math.round(hoursFloat * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const wallKwh = energyNeededWh / wallEfficiency / 1000;
    const sessionCostPkr = (wallKwh * electricityTariff).toFixed(0);

    const kmAdded = (energyNeededWh * chem.usableFactor * chem.dischargeEfficiency) / chem.baseWhPerKm;
    const kmPerHour = Math.max(1, Math.round(kmAdded / Math.max(0.25, hoursFloat)));

    return {
      chargerWatts: Math.round(chargerWatts),
      chargerVoltage: chargerVoltage.toFixed(1),
      hours,
      minutes,
      wallKwh: wallKwh.toFixed(2),
      sessionCostPkr,
      kmPerHour,
      taperThreshold,
      wallEfficiencyPct: Math.round(wallEfficiency * 100),
      chemistryName: chem.name,
    };
  }, [voltage, capacityAh, chargerAmps, currentSOC, targetSOC, batteryChemistry, electricityTariff]);

  // --- Battery Lifespan Diagnostic Engine (Chemistry-Exact Model) ---
  const lifespanSimulation = useMemo(() => {
    const chem = CHEMISTRY_SPECS[batteryChemistry];
    const habitMult =
      healthChargeHabit === 'sweet_spot'
        ? chem.sweetSpotMult
        : healthChargeHabit === 'deep_drain'
        ? chem.deepDrainMult
        : 1.0;
    const heatMult = healthCoolingHabit === 'hot_plug' ? chem.hotPlugMult : 1.0;

    const totalCycles = Math.round(chem.baseCycles * habitMult * heatMult);
    const nominalWh = Math.max(500, voltage * capacityAh);
    const usableWh = nominalWh * chem.usableFactor;
    const effectiveWhPerKm = chem.baseWhPerKm / chem.dischargeEfficiency;
    const rangePerFullCycleKm = usableWh / effectiveWhPerKm;

    const annualCycles = Math.max(15, (healthDailyKm * 365) / rangePerFullCycleKm);
    const ageYears = healthBatteryAgeMonths / 12;

    // 30% SOH loss (100% -> 70% serviceable EV threshold) over rated cycle + calendar wear
    const annualCycleWearPct = (annualCycles / totalCycles) * 30;
    const annualDegradationPct = chem.annualCalendarWearPct + annualCycleWearPct;
    const exactSOH = 100 - ageYears * annualDegradationPct;
    const simulatedSOH = Math.max(35, Math.min(100, Math.round(exactSOH)));

    let barHexColor = '#10b981';
    let badgeColorClass = 'text-emerald-600 dark:text-emerald-400';
    let statusText = 'Healthy pack / peak range';
    if (simulatedSOH < 60) {
      barHexColor = '#ef4444';
      badgeColorClass = 'text-red-600 dark:text-red-400';
      statusText = 'Weak cells / urgent service needed';
    } else if (simulatedSOH < 85) {
      barHexColor = '#f59e0b';
      badgeColorClass = 'text-amber-600 dark:text-amber-400';
      statusText = 'Moderate wear / routine balance recommended';
    }

    const remainingYears = Math.max(0, (exactSOH - 70) / Math.max(0.5, annualDegradationPct)).toFixed(1);
    const lifetimeKm = Math.round(totalCycles * rangePerFullCycleKm);

    return {
      simulatedSOH,
      barHexColor,
      badgeColorClass,
      statusText,
      remainingYears,
      lifetimeKm,
      totalCycles,
      annualCycles: Math.round(annualCycles),
      annualDegradationPct: annualDegradationPct.toFixed(1),
      chemistryName: chem.name,
    };
  }, [voltage, capacityAh, batteryChemistry, healthDailyKm, healthBatteryAgeMonths, healthChargeHabit, healthCoolingHabit]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Section Header + Liquid-Glass Neon Pill Tool Switcher */}
      <div className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            EV Range & Battery Health Calculator
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Pick your electric bike, tune four everyday sliders, and see live riding distance, PKR savings, and battery health in seconds.
          </p>
        </div>

        {/* Sleek Horizontal Frosted Liquid-Glass Neon Pill Tabs */}
        <div
          role="tablist"
          aria-label="Calculator tools"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full"
        >
          {(
            [
              {
                id: 'range' as CalculatorTab,
                label: 'Range & Savings',
                subtitle: 'Distance & PKR savings',
                icon: Gauge,
                activeGradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/25',
                activeBorder: 'border-emerald-500 dark:border-emerald-400',
                activeShadow:
                  'shadow-[0_0_35px_rgba(16,185,129,0.35),0_8px_20px_-4px_rgba(6,182,212,0.28)]',
                activeText: 'text-emerald-700 dark:text-emerald-300',
                activeIconBg:
                  'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-300',
                activeDot: 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]',
                activePing: 'bg-emerald-400/75',
                inactiveHover:
                  'hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.14)]',
              },
              {
                id: 'charge' as CalculatorTab,
                label: 'Charge Time',
                subtitle: 'Amps & WAPDA cost',
                icon: BatteryCharging,
                activeGradient: 'from-amber-500/20 via-orange-500/10 to-yellow-500/25',
                activeBorder: 'border-amber-500 dark:border-amber-400',
                activeShadow:
                  'shadow-[0_0_35px_rgba(245,158,11,0.35),0_8px_20px_-4px_rgba(234,179,8,0.28)]',
                activeText: 'text-amber-700 dark:text-amber-300',
                activeIconBg:
                  'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-300',
                activeDot: 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.9)]',
                activePing: 'bg-amber-400/75',
                inactiveHover:
                  'hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.14)]',
              },
              {
                id: 'health' as CalculatorTab,
                label: 'Lifespan',
                subtitle: 'Battery SOH & cycles',
                icon: HeartPulse,
                activeGradient: 'from-violet-500/20 via-purple-500/10 to-pink-500/25',
                activeBorder: 'border-violet-500 dark:border-violet-400',
                activeShadow:
                  'shadow-[0_0_35px_rgba(139,92,246,0.35),0_8px_20px_-4px_rgba(236,72,153,0.28)]',
                activeText: 'text-violet-700 dark:text-violet-300',
                activeIconBg:
                  'bg-violet-500/20 border-violet-500/40 text-violet-600 dark:text-violet-300',
                activeDot: 'bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.9)]',
                activePing: 'bg-violet-400/75',
                inactiveHover:
                  'hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.14)]',
              },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`relative overflow-hidden rounded-2xl px-6 py-4 flex items-center justify-between gap-3 backdrop-blur-2xl border transition-all duration-300 cursor-pointer text-left ${
                  isActive
                    ? `bg-white/80 dark:bg-slate-900/75 ${tab.activeBorder} ${tab.activeShadow} ${tab.activeText} scale-[1.03] z-10`
                    : `bg-white/50 dark:bg-slate-900/40 border-white/20 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:scale-[1.01] hover:text-slate-900 dark:hover:text-white ${tab.inactiveHover}`
                }`}
              >
                {/* Inherited Neon Ambient Gradient Overlay */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${tab.activeGradient} transition-opacity duration-300 -z-10 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <span className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      isActive
                        ? tab.activeIconBg
                        : 'bg-slate-100/70 dark:bg-white/5 border-slate-200/70 dark:border-white/10 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                  </span>

                  <span className="min-w-0">
                    <span
                      className={`block text-sm sm:text-base font-extrabold tracking-tight whitespace-nowrap truncate ${
                        isActive ? 'text-slate-900 dark:text-white' : ''
                      }`}
                    >
                      {tab.label}
                    </span>
                    <span
                      className={`block text-xs font-medium whitespace-nowrap truncate ${
                        isActive ? tab.activeText : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {tab.subtitle}
                    </span>
                  </span>
                </span>

                {/* Animated Breathing / Glowing Status Indicator Dot */}
                <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                  {isActive && (
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full animate-ping motion-reduce:animate-none ${tab.activePing}`}
                    />
                  )}
                  <span
                    className={`relative inline-flex h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? `${tab.activeDot} animate-pulse motion-reduce:animate-none`
                        : 'bg-slate-400/35 dark:bg-slate-600/50'
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================== VIEW 1: RANGE & SAVINGS (3-STEP HIERARCHY) ===================== */}
      {activeTab === 'range' && (
        <div className="space-y-6">
          {/* STEP 1: CHOOSE YOUR RIDE */}
          <div className={GLASS_CARD_CLASS}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
                  Step 1 of 3
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Choose Your Ride
                </h2>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                Selected Pack: {voltage}V · {capacityAh}Ah ({rangeSimulation.nominalKwh} kWh)
              </span>
            </div>

            {/* Clean Pill-Shaped Preset Buttons */}
            <div className="flex flex-wrap gap-3">
              {VEHICLE_PRESETS.map((preset) => {
                const isActive =
                  selectedPresetId === preset.id &&
                  voltage === preset.voltage &&
                  capacityAh === preset.capacityAh;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`h-12 px-5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer border ${
                      isActive
                        ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-emerald-500/60'
                    }`}
                  >
                    <span>{preset.name}</span>
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        isActive ? 'text-slate-900 font-bold' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {preset.voltage}V / {preset.capacityAh}Ah
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEPS 2 & 3 SIDE BY SIDE ON DESKTOP, STACKED CLEANLY ON MOBILE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* STEP 2: KEY SLIDERS (7 Cols) */}
            <div className={`lg:col-span-7 flex flex-col justify-between space-y-6 ${GLASS_CARD_CLASS}`}>
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
                      Step 2 of 3
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Key Sliders
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    className="h-12 px-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-emerald-500/50 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                    <span>Advanced Settings</span>
                    {showAdvanced ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Essential 4 Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Voltage Slider */}
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="slider-voltage" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Battery Voltage
                      </label>
                      <div className="flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{voltage}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">V</span>
                      </div>
                    </div>
                    <input
                      id="slider-voltage"
                      type="range"
                      min={36}
                      max={72}
                      step={12}
                      value={voltage}
                      onChange={(e) => {
                        setSelectedPresetId(null);
                        setVoltage(Number(e.target.value));
                      }}
                      className="w-full h-2 accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-400">
                      <span>36V</span>
                      <span>48V</span>
                      <span>60V</span>
                      <span>72V</span>
                    </div>
                  </div>

                  {/* Ah Capacity Slider */}
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="slider-ah" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Battery Capacity
                      </label>
                      <div className="flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{capacityAh}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Ah</span>
                      </div>
                    </div>
                    <input
                      id="slider-ah"
                      type="range"
                      min={12}
                      max={60}
                      step={1}
                      value={capacityAh}
                      onChange={(e) => {
                        setSelectedPresetId(null);
                        setCapacityAh(Number(e.target.value));
                      }}
                      className="w-full h-2 accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-400">
                      <span>12 Ah</span>
                      <span>30 Ah</span>
                      <span>60 Ah</span>
                    </div>
                  </div>

                  {/* Riding Speed Slider */}
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="slider-speed" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Riding Speed
                      </label>
                      <div className="flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{avgSpeed}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">km/h</span>
                      </div>
                    </div>
                    <input
                      id="slider-speed"
                      type="range"
                      min={15}
                      max={75}
                      step={1}
                      value={avgSpeed}
                      onChange={(e) => setAvgSpeed(Number(e.target.value))}
                      className="w-full h-2 accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-400">
                      <span>15 km/h</span>
                      <span>35 km/h</span>
                      <span>75 km/h</span>
                    </div>
                  </div>

                  {/* Rider + Luggage Weight Slider */}
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="slider-weight" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Total Weight
                      </label>
                      <div className="flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{combinedLoad}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">kg</span>
                      </div>
                    </div>
                    <input
                      id="slider-weight"
                      type="range"
                      min={50}
                      max={180}
                      step={5}
                      value={combinedLoad}
                      onChange={(e) => setCombinedLoad(Number(e.target.value))}
                      className="w-full h-2 accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-400">
                      <span>50 kg</span>
                      <span>95 kg</span>
                      <span>180 kg</span>
                    </div>
                  </div>
                </div>

                {/* Real-World Environment & Chemistry Controls */}
                <div className="pt-5 border-t border-slate-200/70 dark:border-white/10 space-y-5">
                  {/* 1. Weather & Temperature Conditions Toggle */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Weather & Temperature Conditions</span>
                      </span>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {activeWeather.statusLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {WEATHER_OPTIONS.map((option) => {
                        const isSelected = weatherCondition === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setWeatherCondition(option.id)}
                            className={`h-12 px-4 rounded-full text-xs font-semibold transition-all flex items-center justify-between gap-2 whitespace-nowrap cursor-pointer border ${
                              isSelected
                                ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-sm'
                                : 'bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-emerald-500/50'
                            }`}
                          >
                            <span className="truncate">{option.title}</span>
                            <span
                              className={`font-mono text-[11px] tabular-nums shrink-0 ${
                                isSelected ? 'text-slate-900 font-bold' : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {option.rangeLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Battery Chemistry Selector Pills */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Battery Chemistry</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {activeChemistry.cellSpec} · {activeChemistry.cutoffNote}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {(['li-ion', 'lifepo4', 'graphene'] as BatteryChemistry[]).map((chemId) => {
                        const spec = CHEMISTRY_SPECS[chemId];
                        const isSelected = batteryChemistry === chemId;
                        return (
                          <button
                            key={chemId}
                            type="button"
                            onClick={() => setBatteryChemistry(chemId)}
                            className={`h-12 px-4 rounded-full text-xs font-semibold transition-all flex items-center justify-center whitespace-nowrap cursor-pointer border ${
                              isSelected
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
                                : 'bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-emerald-500/50'
                            }`}
                          >
                            <span className="truncate">{spec.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Collapsible Advanced Technical Settings */}
                {showAdvanced && (
                  <div className="pt-5 border-t border-slate-200/70 dark:border-white/10 space-y-5 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label htmlFor="adv-soh" className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Battery Condition
                          </label>
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            {batterySOH}%
                          </span>
                        </div>
                        <input
                          id="adv-soh"
                          type="range"
                          min={40}
                          max={100}
                          step={1}
                          value={batterySOH}
                          onChange={(e) => setBatterySOH(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label htmlFor="adv-terrain" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          Road Condition
                        </label>
                        <select
                          id="adv-terrain"
                          value={terrain}
                          onChange={(e) => setTerrain(e.target.value as 'flat' | 'moderate' | 'steep' | 'traffic')}
                          className="w-full h-12 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="flat">Flat City Road</option>
                          <option value="moderate">Flyovers / Bridges</option>
                          <option value="traffic">Heavy Stop-and-Go</option>
                          <option value="steep">Steep Hills (+35%)</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="adv-motor" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          Motor Power (W)
                        </label>
                        <input
                          id="adv-motor"
                          type="number"
                          min={250}
                          max={5000}
                          step={50}
                          value={motorWatts}
                          onChange={(e) => setMotorWatts(Math.max(250, Number(e.target.value) || 250))}
                          className="w-full h-12 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <div>
                        <label htmlFor="adv-petrol" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          Petrol Price (PKR/L)
                        </label>
                        <input
                          id="adv-petrol"
                          type="number"
                          min={100}
                          max={700}
                          step={0.5}
                          value={petrolPrice}
                          onChange={(e) => setPetrolPrice(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full h-12 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="adv-unit" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          Electricity Unit (PKR/kWh)
                        </label>
                        <input
                          id="adv-unit"
                          type="number"
                          min={5}
                          max={120}
                          step={0.5}
                          value={electricityTariff}
                          onChange={(e) => setElectricityTariff(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full h-12 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={syncLiveRates}
                        disabled={isRatesSyncing}
                        className="h-12 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2 whitespace-nowrap transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRatesSyncing ? 'animate-spin' : ''}`} />
                        <span>{isRatesSyncing ? 'Syncing Rates...' : 'Sync Pakistan Rates'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Consumption: <strong className="font-mono text-slate-900 dark:text-white tabular-nums">{rangeSimulation.whPerKm} Wh/km</strong>
                </span>
                <span>
                  Rates: <strong className="font-mono tabular-nums">PKR {petrolPrice.toFixed(0)}/L</strong> · <strong className="font-mono tabular-nums">PKR {electricityTariff.toFixed(0)}/kWh</strong>
                </span>
              </div>
            </div>

            {/* STEP 3: INSTANT LIVE RESULTS & BATTERY HEALTH SIMULATION (5 Cols) */}
            <div className={`lg:col-span-5 flex flex-col justify-between space-y-6 ${GLASS_CARD_CLASS}`}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
                      Step 3 of 3
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Instant Live Results
                    </h2>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {rangeSimulation.nominalKwh} kWh Pack
                  </span>
                </div>

                {/* Focal Distance Figure + Active Chemistry & Weather Badges */}
                <div className="py-2 space-y-3">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                    Estimated Single-Charge Distance
                  </span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-6xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                      {rangeSimulation.estimatedRangeKm}
                    </span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      km
                    </span>
                  </div>

                  {/* Active Chemistry & Weather Impact Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10">
                      {activeChemistry.shortName}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                        activeWeather.id === 'cold'
                          ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30'
                          : activeWeather.id === 'hot'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {activeWeather.statusLabel}
                      {activeWeather.efficiencyPenaltyPct > 0 ? ` (-${activeWeather.efficiencyPenaltyPct}%)` : ''}
                    </span>
                  </div>
                </div>

                {/* Clean PKR Savings Grid */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200/70 dark:border-white/10">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      Monthly Fuel Savings
                    </span>
                    <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5 block">
                      PKR {rangeSimulation.monthlySavingsPkr.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                      EV: PKR {rangeSimulation.evCostPerKm}/km
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      Annual Fuel Savings
                    </span>
                    <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums mt-0.5 block">
                      PKR {rangeSimulation.yearlySavingsPkr.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                      Petrol: PKR {rangeSimulation.petrolCostPerKm}/km
                    </span>
                  </div>
                </div>

                {/* Dedicated Battery Health Simulation Visual */}
                <div className="space-y-3" aria-live="polite">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Battery Health Simulation
                    </span>
                    <span className={`text-xs font-mono font-bold tabular-nums flex items-center gap-1.5 ${rangeSimulation.badgeColorClass}`}>
                      {rangeSimulation.healthBand === 'healthy' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      {rangeSimulation.healthBand === 'moderate' && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                      {rangeSimulation.healthBand === 'critical' && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                      <span>{rangeSimulation.efficiencyPct}% Efficiency</span>
                    </span>
                  </div>

                  {/* Quick Chemistry Selector inside Battery Health Simulation */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(['lifepo4', 'li-ion', 'graphene'] as BatteryChemistry[]).map((chemId) => {
                      const selected = batteryChemistry === chemId;
                      return (
                        <button
                          key={chemId}
                          type="button"
                          onClick={() => setBatteryChemistry(chemId)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                            selected
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-100/70 dark:bg-white/5 border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/40'
                          }`}
                        >
                          {chemId === 'lifepo4' ? 'LiFePO4' : chemId === 'li-ion' ? 'Li-Ion' : 'Graphene'}
                        </button>
                      );
                    })}
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 ml-auto">
                      {Math.round(activeChemistry.usableFactor * 100)}% usable
                    </span>
                  </div>

                  {/* Color-coded Progress Bar (Emerald 85-100%, Amber 60-84%, Red <60%) */}
                  <div
                    role="progressbar"
                    aria-valuenow={rangeSimulation.efficiencyPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Battery Health Simulation Efficiency"
                    className="w-full h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: '0%', backgroundColor: rangeSimulation.barHexColor }}
                      animate={{
                        width: `${rangeSimulation.efficiencyPct}%`,
                        backgroundColor: rangeSimulation.barHexColor,
                      }}
                      transition={{
                        width: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                        backgroundColor: { duration: 0.4, ease: 'easeOut' },
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className={rangeSimulation.badgeColorClass}>{rangeSimulation.healthLabel}</span>
                    <span className="font-mono text-slate-400 tabular-nums">60% · 85% · 100%</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Your {activeChemistry.name} pack delivers {rangeSimulation.estimatedRangeKm} km real-world distance compared to {rangeSimulation.factoryConditionRangeKm} km in brand-new factory condition.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onBookService) {
                      onBookService();
                    } else {
                      window.location.hash = '#contact';
                    }
                  }}
                  className="h-12 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap flex-1 cursor-pointer"
                >
                  <Wrench className="w-4 h-4 shrink-0" />
                  <span>Book Battery Checkup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('charge')}
                  className="h-12 px-5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white hover:border-emerald-500/50 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Check Charge Time</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>

          {/* D3 Temperature & Battery Chemistry Range Trend Chart */}
          <RangeTemperatureChart
            activeChemistry={batteryChemistry}
            activeWeather={weatherCondition}
            chemistryBaselines={chemistryBaselines}
            onSelectChemistry={setBatteryChemistry}
          />
        </div>
      )}

      {/* ===================== VIEW 2: CHARGE TIME & COST (3-STEP HIERARCHY) ===================== */}
      {activeTab === 'charge' && (
        <div className="space-y-6">
          {/* Step 1: Battery Chemistry & Charger Speed */}
          <div className={`${GLASS_CARD_CLASS} space-y-6`}>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wide">
                    Step 1 of 3
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Select Battery Chemistry & Charger Amperage
                  </h2>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  Cutoff: {chargeSimulation.chargerVoltage}V · Output: {chargeSimulation.chargerWatts}W ({voltage}V · {capacityAh}Ah)
                </span>
              </div>

              {/* Battery Chemistry Type Cards (LiFePO4, Li-Ion, Graphene) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['lifepo4', 'li-ion', 'graphene'] as BatteryChemistry[]).map((chemId) => {
                  const spec = CHEMISTRY_SPECS[chemId];
                  const isSelected = batteryChemistry === chemId;
                  const chargeNote =
                    chemId === 'lifepo4'
                      ? '91% wall eff · Fast CC to 92%'
                      : chemId === 'li-ion'
                      ? '88% wall eff · CV taper >80%'
                      : '78% wall eff · Slow taper >75%';
                  return (
                    <button
                      key={chemId}
                      type="button"
                      onClick={() => setBatteryChemistry(chemId)}
                      className={`px-4 py-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-slate-900 dark:text-white shadow-[0_0_24px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="block text-sm font-bold truncate">{spec.name}</span>
                        <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {chargeNote}
                        </span>
                      </div>
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.85)]'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-5 border-t border-slate-200/70 dark:border-white/10 space-y-3">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                Charger Amperage
              </span>
              <div className="flex flex-wrap gap-3">
                {CHARGER_AMPS_OPTIONS.map((amps) => {
                  const active = chargerAmps === amps;
                  return (
                    <button
                      key={amps}
                      type="button"
                      onClick={() => setChargerAmps(amps)}
                      className={`h-12 px-5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${
                        active
                          ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-emerald-500/60'
                      }`}
                    >
                      <span className="font-mono font-bold">{amps}A Charger</span>
                      <span className={active ? 'text-slate-900 text-xs' : 'text-slate-500 dark:text-slate-400 text-xs'}>
                        {amps <= 3 ? 'Gentle' : amps <= 6 ? 'Standard' : 'Fast'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Step 2: Charge Level & Pack Spec Sliders */}
            <div className={`lg:col-span-7 flex flex-col justify-between space-y-6 ${GLASS_CARD_CLASS}`}>
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wide">
                      Step 2 of 3
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Charge Level & Pack Sliders
                    </h2>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    Pack: {voltage}V · {capacityAh}Ah ({((voltage * capacityAh) / 1000).toFixed(2)} kWh)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="charge-start" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Starting Charge
                      </label>
                      <div className="flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{currentSOC}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">%</span>
                      </div>
                    </div>
                    <input
                      id="charge-start"
                      type="range"
                      min={0}
                      max={Math.min(90, targetSOC - 5)}
                      step={5}
                      value={currentSOC}
                      onChange={(e) => setCurrentSOC(Number(e.target.value))}
                      className="w-full h-2 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="charge-target" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Target Charge
                      </label>
                      <div className="flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{targetSOC}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">%</span>
                      </div>
                    </div>
                    <input
                      id="charge-target"
                      type="range"
                      min={Math.max(10, currentSOC + 5)}
                      max={100}
                      step={5}
                      value={targetSOC}
                      onChange={(e) => setTargetSOC(Number(e.target.value))}
                      className="w-full h-2 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="charge-voltage" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Pack Voltage
                      </label>
                      <div className="flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{voltage}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">V</span>
                      </div>
                    </div>
                    <input
                      id="charge-voltage"
                      type="range"
                      min={36}
                      max={72}
                      step={12}
                      value={voltage}
                      onChange={(e) => {
                        setSelectedPresetId(null);
                        setVoltage(Number(e.target.value));
                      }}
                      className="w-full h-2 accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-400">
                      <span>36V</span>
                      <span>48V</span>
                      <span>60V</span>
                      <span>72V</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="charge-ah" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Pack Capacity
                      </label>
                      <div className="flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{capacityAh}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Ah</span>
                      </div>
                    </div>
                    <input
                      id="charge-ah"
                      type="range"
                      min={12}
                      max={60}
                      step={1}
                      value={capacityAh}
                      onChange={(e) => {
                        setSelectedPresetId(null);
                        setCapacityAh(Number(e.target.value));
                      }}
                      className="w-full h-2 accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-400">
                      <span>12 Ah</span>
                      <span>30 Ah</span>
                      <span>60 Ah</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span>
                  CV taper slows above <strong className="font-mono text-slate-900 dark:text-white">{chargeSimulation.taperThreshold}%</strong> for {chargeSimulation.chemistryName}.
                </span>
                <span className="font-mono tabular-nums">
                  Efficiency: <strong>{chargeSimulation.wallEfficiencyPct}%</strong>
                </span>
              </div>
            </div>

            {/* Step 3: Instant Charge Results */}
            <div className={`lg:col-span-5 flex flex-col justify-between space-y-6 ${GLASS_CARD_CLASS}`}>
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wide">
                      Step 3 of 3
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Charge Duration & PKR Cost
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 whitespace-nowrap">
                    {chargeSimulation.chemistryName}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                    Time from {currentSOC}% to {targetSOC}%
                  </span>
                  <div className="flex items-baseline gap-2 mt-1 font-mono tabular-nums">
                    <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white">
                      {chargeSimulation.hours}h {chargeSimulation.minutes}m
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200/70 dark:border-white/10">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Electricity Used</span>
                    <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums mt-0.5 block">
                      {chargeSimulation.wallKwh} Units
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Estimated Bill</span>
                    <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5 block">
                      PKR {chargeSimulation.sessionCostPkr}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Recovery Speed ({chargeSimulation.chargerVoltage}V)</span>
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  +{chargeSimulation.kmPerHour} km / hour
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== VIEW 3: BATTERY LIFESPAN & HEALTH (3-STEP HIERARCHY) ===================== */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {/* Step 1: Battery Chemistry & Charging/Heat Routine */}
          <div className={`${GLASS_CARD_CLASS} space-y-6`}>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wide">
                    Step 1 of 3
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Select Battery Chemistry & Charging Routine
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {activeChemistry.cellSpec} · {activeChemistry.lifespanBadge}
                </span>
              </div>

              {/* Battery Chemistry Type Cards (LiFePO4, Li-Ion, Graphene) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['lifepo4', 'li-ion', 'graphene'] as BatteryChemistry[]).map((chemId) => {
                  const spec = CHEMISTRY_SPECS[chemId];
                  const isSelected = batteryChemistry === chemId;
                  return (
                    <button
                      key={chemId}
                      type="button"
                      onClick={() => setBatteryChemistry(chemId)}
                      className={`px-4 py-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-violet-500/15 border-violet-500 text-slate-900 dark:text-white shadow-[0_0_24px_rgba(139,92,246,0.2)]'
                          : 'bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-violet-500/50'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="block text-sm font-bold truncate">{spec.name}</span>
                        <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {spec.lifespanBadge}
                        </span>
                      </div>
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          isSelected
                            ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-5 border-t border-slate-200/70 dark:border-white/10 space-y-3">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                Charging & Thermal Habit
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { id: 'sweet_spot', label: '20% - 85% Routine' },
                  { id: 'regular_100', label: 'Full 100% Daily' },
                  { id: 'deep_drain', label: 'Drain Below 10%' },
                ].map((habit) => {
                  const active = healthChargeHabit === habit.id;
                  return (
                    <button
                      key={habit.id}
                      type="button"
                      onClick={() => setHealthChargeHabit(habit.id as 'sweet_spot' | 'regular_100' | 'deep_drain')}
                      className={`h-12 px-4 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                        active
                          ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-sm'
                          : 'bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-emerald-500/60'
                      }`}
                    >
                      {habit.label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setHealthCoolingHabit('shaded_cooled')}
                  className={`h-12 px-4 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                    healthCoolingHabit === 'shaded_cooled'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10'
                  }`}
                >
                  Cool 20 min Before Charge
                </button>

                <button
                  type="button"
                  onClick={() => setHealthCoolingHabit('hot_plug')}
                  className={`h-12 px-4 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                    healthCoolingHabit === 'hot_plug'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10'
                  }`}
                >
                  Plugged In Hot
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Step 2: Usage, Pack Spec & Age Sliders */}
            <div className={`lg:col-span-7 flex flex-col justify-between space-y-6 ${GLASS_CARD_CLASS}`}>
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wide">
                      Step 2 of 3
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Daily Distance & Pack Age
                    </h2>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    Pack: {voltage}V · {capacityAh}Ah ({((voltage * capacityAh) / 1000).toFixed(2)} kWh)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="health-km" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Daily Commute
                      </label>
                      <div className="flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{healthDailyKm}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">km/day</span>
                      </div>
                    </div>
                    <input
                      id="health-km"
                      type="range"
                      min={5}
                      max={90}
                      step={5}
                      value={healthDailyKm}
                      onChange={(e) => setHealthDailyKm(Number(e.target.value))}
                      className="w-full h-2 accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-400">
                      <span>5 km</span>
                      <span>45 km</span>
                      <span>90 km</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="health-age" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Battery Age
                      </label>
                      <div className="flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{healthBatteryAgeMonths}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">months</span>
                      </div>
                    </div>
                    <input
                      id="health-age"
                      type="range"
                      min={0}
                      max={48}
                      step={2}
                      value={healthBatteryAgeMonths}
                      onChange={(e) => setHealthBatteryAgeMonths(Number(e.target.value))}
                      className="w-full h-2 accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-400">
                      <span>0 mo</span>
                      <span>24 mo</span>
                      <span>48 mo</span>
                    </div>
                  </div>

                  {/* Voltage & Ah Sliders so Lifespan calculates exact kWh cycles independently too */}
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="health-voltage" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Pack Voltage
                      </label>
                      <div className="flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{voltage}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">V</span>
                      </div>
                    </div>
                    <input
                      id="health-voltage"
                      type="range"
                      min={36}
                      max={72}
                      step={12}
                      value={voltage}
                      onChange={(e) => {
                        setSelectedPresetId(null);
                        setVoltage(Number(e.target.value));
                      }}
                      className="w-full h-2 accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-400">
                      <span>36V</span>
                      <span>48V</span>
                      <span>60V</span>
                      <span>72V</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="health-ah" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Pack Capacity
                      </label>
                      <div className="flex items-baseline gap-1 font-mono tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{capacityAh}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Ah</span>
                      </div>
                    </div>
                    <input
                      id="health-ah"
                      type="range"
                      min={12}
                      max={60}
                      step={1}
                      value={capacityAh}
                      onChange={(e) => {
                        setSelectedPresetId(null);
                        setCapacityAh(Number(e.target.value));
                      }}
                      className="w-full h-2 accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-400">
                      <span>12 Ah</span>
                      <span>30 Ah</span>
                      <span>60 Ah</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span>
                  Rated Life: <strong className="font-mono text-slate-900 dark:text-white tabular-nums">{lifespanSimulation.totalCycles.toLocaleString()} cycles</strong>
                </span>
                <span>
                  Usage: <strong className="font-mono tabular-nums">{lifespanSimulation.annualCycles} cycles/yr</strong> · Wear: <strong className="font-mono tabular-nums">{lifespanSimulation.annualDegradationPct}%/yr</strong>
                </span>
              </div>
            </div>

            {/* Step 3: Health & Remaining Life */}
            <div className={`lg:col-span-5 flex flex-col justify-between space-y-6 ${GLASS_CARD_CLASS}`}>
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wide">
                      Step 3 of 3
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Battery Health Simulation
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-violet-500/15 border border-violet-500/30 text-violet-700 dark:text-violet-300 whitespace-nowrap">
                    {lifespanSimulation.chemistryName}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 font-mono tabular-nums">
                  <span className={`text-6xl font-extrabold ${lifespanSimulation.badgeColorClass}`}>
                    {lifespanSimulation.simulatedSOH}%
                  </span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    State of Health
                  </span>
                </div>

                <div className="space-y-2">
                  <div
                    role="progressbar"
                    aria-valuenow={lifespanSimulation.simulatedSOH}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="w-full h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: '0%', backgroundColor: lifespanSimulation.barHexColor }}
                      animate={{
                        width: `${lifespanSimulation.simulatedSOH}%`,
                        backgroundColor: lifespanSimulation.barHexColor,
                      }}
                      transition={{
                        width: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                        backgroundColor: { duration: 0.4, ease: 'easeOut' },
                      }}
                    />
                  </div>
                  <p className={`text-xs font-semibold ${lifespanSimulation.badgeColorClass}`}>
                    {lifespanSimulation.statusText}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/70 dark:border-white/10">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Remaining Life (to 70%)</span>
                    <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                      ~{lifespanSimulation.remainingYears} yrs
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Lifetime Distance</span>
                    <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {lifespanSimulation.lifetimeKm.toLocaleString()} km
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onBookService) {
                    onBookService();
                  } else {
                    window.location.hash = '#contact';
                  }
                }}
                className="h-12 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Coins className="w-4 h-4 shrink-0" />
                <span>Book Cell Balancing Service</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
