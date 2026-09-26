import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Sparkles, Compass, Download, Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert, Database, Trash2 } from 'lucide-react';
import { SilkCheckpoint } from '../types';
import { silkCheckpointsData } from '../data/glossaryData';
import { sounds } from '../utils/soundEffects';

interface SilkTradeRouteMapProps {
  onUnlockRelic?: () => void;
  isUnlocked?: boolean;
}

export const SilkTradeRouteMap: React.FC<SilkTradeRouteMapProps> = ({
  onUnlockRelic,
  isUnlocked,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<number>(0);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([0]);

  // Telemetry Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0); // 0 to 100%
  const [currentDistance, setCurrentDistance] = useState<number>(0);
  const [currentDays, setCurrentDays] = useState<number>(0);
  const [currentAltitude, setCurrentAltitude] = useState<number>(549);
  const [cargoHealth, setCargoHealth] = useState<number>(100);
  const [surgeCycles, setSurgeCycles] = useState<number>(0);
  const [currentWeather, setCurrentWeather] = useState<string>('Temperate Valley');
  const [telemetryLogs, setTelemetryLogs] = useState<Array<{ time: string; text: string; tag: string }>>([
    {
      time: 'Day 01 · 06:00',
      text: 'Caravan assembled at Takṣaśilā (Taxila) academic dry-port. 80 bales of wild Kauśeya silk and indigo cakes sealed.',
      tag: 'DEPARTURE',
    },
  ]);

  // Local Storage Cache Detection State
  const [hasCachedState, setHasCachedState] = useState<boolean>(false);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeCheckpoint: SilkCheckpoint = silkCheckpointsData[selectedNodeId] || silkCheckpointsData[0];

  // Elevation Profile Map Data Points
  const elevationProfile = [
    { name: 'Taxila', dist: 0, elev: 549, weather: 'Temperate Valley' },
    { name: 'Pamir Pass', dist: 520, elev: 4200, weather: 'High Blizzard Cold' },
    { name: 'Kashgar', dist: 1100, elev: 1300, weather: 'Arid Mountain Wind' },
    { name: 'Taklamakan Edge', dist: 1650, elev: 850, weather: 'Desert Dust Storm' },
    { name: 'Dunhuang', dist: 2200, elev: 1140, weather: 'Oasis Dry Breeze' },
    { name: 'Hexi Corridor', dist: 2850, elev: 1600, weather: 'Steppe Mountain Winds' },
    { name: 'Chang\'an', dist: 3500, elev: 405, weather: 'Imperial Temperate' },
  ];

  // Check for cached state on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('sutra_silk_telemetry_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.simProgress && parsed.simProgress > 0 && parsed.simProgress < 100) {
          setHasCachedState(true);
        }
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Save state to local storage when progressing
  useEffect(() => {
    if (simProgress > 0) {
      try {
        const stateToSave = {
          simProgress,
          currentDistance,
          currentDays,
          currentAltitude,
          cargoHealth,
          selectedNodeId,
          surgeCycles,
        };
        localStorage.setItem('sutra_silk_telemetry_cache', JSON.stringify(stateToSave));
      } catch {
        // LocalStorage fallback
      }
    }
  }, [simProgress, currentDistance, currentDays, currentAltitude, cargoHealth, selectedNodeId, surgeCycles]);

  const applyCachedState = () => {
    sounds.playClick();
    try {
      const cached = localStorage.getItem('sutra_silk_telemetry_cache');
      if (cached) {
        const p = JSON.parse(cached);
        setSimProgress(p.simProgress || 0);
        setCurrentDistance(p.currentDistance || 0);
        setCurrentDays(p.currentDays || 0);
        setCurrentAltitude(p.currentAltitude || 549);
        setCargoHealth(p.cargoHealth || 100);
        setSelectedNodeId(p.selectedNodeId || 0);
        setSurgeCycles(p.surgeCycles || 0);
        setHasCachedState(false);
        sounds.playChimeUnlock();
      }
    } catch {
      // Fallback
    }
  };

  const clearStateCacheMemory = () => {
    sounds.playClick();
    try {
      localStorage.removeItem('sutra_silk_telemetry_cache');
    } catch {
      // Fallback
    }
    setHasCachedState(false);
  };

  // Compute System Alert Level
  const getAlertStatus = () => {
    if (!isSimulating && simProgress === 0) {
      return { level: 'standby', text: '⚠️ System State: Standby (Awaiting Dispatch)', style: 'bg-[#2a1d17] border-[#4a2e1d] text-[#c9b19e]' };
    }
    if (currentAltitude >= 3800) {
      return { level: 'critical', text: '🚨 CRITICAL ELEVATION: 4,200m Pamir Pass · Yak Team Deployed', style: 'bg-red-950/80 border-red-500 text-red-200 animate-pulse' };
    }
    if (currentWeather.includes('Blizzard') || currentWeather.includes('Storm')) {
      return { level: 'warning', text: '⚡ WEATHER ADVISORY: Desert Dust & High Altitude Wind Gusts', style: 'bg-amber-950/80 border-amber-500 text-amber-200' };
    }
    return { level: 'nominal', text: '🟢 Route Transit: Nominal Operations (42 km/day)', style: 'bg-emerald-950/80 border-emerald-500 text-emerald-200' };
  };

  const alertStatus = getAlertStatus();

  // Draw Dynamic Elevation Chart on Canvas
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(197, 159, 63, 0.12)';
    ctx.lineWidth = 1;
    for (let y = 20; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Coordinates mapping
    const maxElev = 4500;
    const paddingX = 24;
    const usableW = width - paddingX * 2;
    const usableH = height - 30;

    const points = elevationProfile.map((pt, i) => {
      const x = paddingX + (i / (elevationProfile.length - 1)) * usableW;
      const y = height - 15 - (pt.elev / maxElev) * usableH;
      return { ...pt, x, y };
    });

    // Draw terrain fill area
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - 10);
    points.forEach((pt) => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(points[points.length - 1].x, height - 10);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(189, 89, 60, 0.45)');
    gradient.addColorStop(1, 'rgba(36, 18, 16, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw ridge line
    ctx.beginPath();
    points.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.strokeStyle = '#c59f3f';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw node dots & labels
    points.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#bd593c';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '9px monospace';
      ctx.fillStyle = '#caa641';
      ctx.fillText(`${pt.elev}m`, pt.x - 12, pt.y - 8);
    });

    // Draw active caravan position pointer on chart
    const currentChartX = paddingX + (simProgress / 100) * usableW;
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(currentChartX, 0);
    ctx.lineTo(currentChartX, height);
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
  }, [simProgress]);

  // Simulation transit tick loop
  useEffect(() => {
    if (!isSimulating) return;

    const timer = setInterval(() => {
      setSimProgress((prev) => {
        const next = prev + 1.25;
        if (next >= 100) {
          setIsSimulating(false);
          sounds.playChimeUnlock();
          if (onUnlockRelic && !isUnlocked) {
            onUnlockRelic();
          }
          setTelemetryLogs((logs) => [
            {
              time: 'Day 82 · 18:00',
              text: 'Caravan reached Chang\'an Imperial Gates! Silk cargo delivered intact. Imperial toll seals stamped.',
              tag: 'TERMINAL REACHED',
            },
            ...logs,
          ]);
          return 100;
        }

        // Live math interpolation
        const totalDist = 3500;
        const dist = Math.round((next / 100) * totalDist);
        setCurrentDistance(dist);
        setCurrentDays(Math.round((next / 100) * 82));

        // Elevation & weather calculation based on progress
        if (next < 25) {
          const elev = Math.round(549 + (next / 25) * (4200 - 549));
          setCurrentAltitude(elev);
          setCurrentWeather('High Blizzard Cold · Pamir Pass');
          setSurgeCycles(Math.round((next / 25) * 88));
          setSelectedNodeId(0);
        } else if (next < 50) {
          const elev = Math.round(4200 - ((next - 25) / 25) * (4200 - 1300));
          setCurrentAltitude(elev);
          setCurrentWeather('Arid Mountain Wind · Kashgar Basin');
          setSurgeCycles(Math.max(12, Math.round(88 - ((next - 25) / 25) * 60)));
          setSelectedNodeId(1);
        } else if (next < 75) {
          const elev = Math.round(1300 - ((next - 50) / 25) * (1300 - 1140));
          setCurrentAltitude(elev);
          setCurrentWeather('Desert Dust Breeze · Dunhuang Mogao');
          setSurgeCycles(32);
          setSelectedNodeId(2);
        } else {
          const elev = Math.round(1140 - ((next - 75) / 25) * (1140 - 405));
          setCurrentAltitude(elev);
          setCurrentWeather('Imperial Temperate · Chang\'an Basin');
          setSurgeCycles(8);
          setSelectedNodeId(3);
        }

        // Add periodic historical event logs
        if (Math.floor(next) === 20 && prev < 20) {
          setTelemetryLogs((logs) => [
            {
              time: 'Day 16 · 14:30',
              text: 'Pamir mountain blizzard encountered at 4,200m altitude. Yak pack ropes reinforced with Tantu linen straps.',
              tag: 'HIGH PASS',
            },
            ...logs,
          ]);
          sounds.playLoomClack();
        } else if (Math.floor(next) === 45 && prev < 45) {
          setTelemetryLogs((logs) => [
            {
              time: 'Day 38 · 11:15',
              text: 'Kashgar oasis checkpoint reached. Raw Tussar silk bales weighed on guild balance scales; Sanskrit trade scrolls cross-examined.',
              tag: 'CARAVAN HUB',
            },
            ...logs,
          ]);
          sounds.playSpindleWhirr(1.5);
        } else if (Math.floor(next) === 70 && prev < 70) {
          setTelemetryLogs((logs) => [
            {
              time: 'Day 58 · 09:40',
              text: 'Dunhuang Mogao oasis reached. Liturgical manuscript rolls delivered to cave scriptorium.',
              tag: 'MANUSCRIPT DEPOT',
            },
            ...logs,
          ]);
          sounds.playParchmentScroll();
        }

        return next;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [isSimulating, onUnlockRelic, isUnlocked]);

  const toggleSimulation = () => {
    const nextState = !isSimulating;
    setIsSimulating(nextState);
    sounds.playClick();
    if (nextState) {
      sounds.playParchmentScroll();
    }
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimProgress(0);
    setCurrentDistance(0);
    setCurrentDays(0);
    setCurrentAltitude(549);
    setCargoHealth(100);
    setSurgeCycles(0);
    setCurrentWeather('Temperate Valley');
    clearStateCacheMemory();
    sounds.playClick();
  };

  const handleSelectNode = (id: number) => {
    sounds.playClick();
    setSelectedNodeId(id);
    if (!visitedNodes.includes(id)) {
      const updated = [...visitedNodes, id];
      setVisitedNodes(updated);
      if (updated.length >= 4 && onUnlockRelic && !isUnlocked) {
        onUnlockRelic();
        sounds.playChimeUnlock();
      }
    }
  };

  // Export Path Logs to CSV Functionality
  const exportPathLogsToCSV = () => {
    sounds.playClick();
    const rows = [
      ['Timestamp', 'Station Hub', 'Latitude', 'Longitude', 'Distance (km)', 'Elevation (m)', 'Weather & Terrain', 'Cargo Integrity (%)', 'Event Log'],
      ...telemetryLogs.map((l, i) => [
        l.time,
        activeCheckpoint.name,
        activeCheckpoint.lat,
        activeCheckpoint.lon,
        (currentDistance - i * 120).toString(),
        currentAltitude.toString(),
        currentWeather,
        cargoHealth.toString(),
        `"${l.text.replace(/"/g, '""')}"`,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sutra_silk_road_telemetry_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    sounds.playChimeUnlock();
  };

  const handlePronounce = () => {
    sounds.speakWord('चिनांशुकम्', 'Chinanshuka');
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#241210] via-[#1c0e0c] to-[#120706] border-2 border-[#8a2218] rounded-2xl p-4 sm:p-6 shadow-2xl text-[#fcf4f3]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#5a1811] pb-3 mb-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#caa641] uppercase font-bold">
            Sūtra-Telemetry Corridor & Audit Vault · Trans-Asian Highway (100 CE)
          </span>
          <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-[#ffd5d1] flex items-center gap-2">
            <span>चिनांशुकम्</span>
            <span className="text-sm font-sans font-normal text-[#e6b3ae]">(Cīnāṁśuka) · Taxila to Chang'an Caravan</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportPathLogsToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2d5a3c] hover:bg-[#396e4b] text-white border border-[#488a5e] rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
            title="Download CSV log spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-emerald-200" />
            <span>Export Path Logs (CSV)</span>
          </button>

          <button
            onClick={handlePronounce}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#421410] hover:bg-[#561a15] text-[#ffd5d1] border border-[#a83226] rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#caa641]" />
            <span>Chant Term</span>
          </button>
        </div>
      </div>

      {/* Local Storage Restore Prompt Bar */}
      {hasCachedState && (
        <div className="mb-4 bg-[#162738] border-2 border-[#38bdf8] p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2 text-[#e0f2fe]">
            <Database className="w-4 h-4 text-cyan-300" />
            <span>
              <strong>Previous Caravan Transit Detected in Cache:</strong> Would you like to resume your route from the saved checkpoint?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={applyCachedState}
              className="px-3 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-md transition-colors"
            >
              Restore State
            </button>
            <button
              onClick={clearStateCacheMemory}
              className="px-3 py-1 bg-[#334155] hover:bg-[#475569] text-stone-300 rounded-md transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Automated Warning Module HUD Banner */}
      <div className={`mb-4 p-2.5 rounded-xl border font-mono text-xs font-bold text-center tracking-wider transition-all shadow-sm ${alertStatus.style}`}>
        {alertStatus.text}
      </div>

      {/* Main Grid: Vector Map & Telemetry Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Map Canvas & Elevation Profile */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Visual Map Canvas */}
          <div className="bg-[#180e0a] rounded-xl border-2 border-[#541e17] p-3 relative overflow-hidden shadow-inner flex flex-col justify-between h-[300px] sm:h-[340px]">
            {/* Desert Sand & Mountain Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2b1912] via-[#21130d] to-[#170c07] opacity-90" />

            {/* SVG Map Lines & Coordinates */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Mountain Range silhouettes */}
              <path
                d="M 5 60 L 15 45 L 25 55 L 35 38 L 45 50 L 60 35 L 75 48 L 90 40 L 95 65"
                fill="none"
                stroke="rgba(197, 159, 63, 0.12)"
                strokeWidth="1.5"
              />
              {/* The Great Caravan Highway Path */}
              <path
                d="M 18 72 Q 30 60 42 48 T 68 42 T 90 64"
                fill="none"
                stroke="#caa641"
                strokeWidth="0.8"
                strokeDasharray="2, 2"
              />
            </svg>

            {/* Map Nodes (Interactive Buttons) */}
            <div className="relative z-10 w-full h-full">
              {silkCheckpointsData.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isVisited = visitedNodes.includes(node.id);
                return (
                  <div
                    key={node.id}
                    style={{
                      left: `${node.xPercent}%`,
                      top: `${node.yPercent}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => handleSelectNode(node.id)}
                    className="absolute cursor-pointer group flex flex-col items-center select-none"
                  >
                    {/* Pin Dot with pulsing halo */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition-transform duration-200 ${
                        isSelected
                          ? 'bg-[#c59f3f] text-[#1a0f0a] scale-125 shadow-[0_0_15px_#caa641] ring-4 ring-amber-400/40'
                          : isVisited
                          ? 'bg-[#bd593c] text-white'
                          : 'bg-[#3d1f18] text-[#caa641] border border-[#caa641]/50'
                      }`}
                    >
                      {node.id + 1}
                    </div>

                    {/* Label tag */}
                    <span
                      className={`mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded backdrop-blur-sm whitespace-nowrap transition-colors ${
                        isSelected
                          ? 'bg-[#caa641] text-[#1c0f0a] font-bold shadow'
                          : 'bg-black/60 text-[#dfcfbe]'
                      }`}
                    >
                      {node.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}

              {/* Traveling Camel Caravan Indicator on Active Route */}
              <div
                className="absolute transition-all duration-300 ease-out z-20 pointer-events-none"
                style={{
                  left: `${18 + (simProgress / 100) * (90 - 18)}%`,
                  top: `${72 - Math.sin((simProgress / 100) * Math.PI) * 28}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <div className="bg-[#bd593c] text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 border border-white/30 animate-bounce">
                  <span>🐪</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider">
                    {Math.round(simProgress)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Map Legend */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[#d6b5a3] bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#caa641]" />
                <span>Caravan Route: Taxila ➔ Pamir ➔ Kashgar ➔ Dunhuang ➔ Chang'an</span>
              </span>
              <span className="text-[#caa641] font-bold">
                {currentDistance} km / 3,500 km
              </span>
            </div>
          </div>

          {/* Dynamic Terrain Cross-Section Elevation Chart */}
          <div className="bg-[#180e0a] rounded-xl border border-[#541e17] p-3 shadow-md flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-cinzel font-bold text-[#ffd5d1] flex items-center gap-1.5">
                <span>Terrain Elevation Profile (Cross-Section)</span>
                <span className="text-[10px] text-[#caa641] font-mono">Max: 4,200m (Pamir)</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                Current Altitude: {currentAltitude} m
              </span>
            </div>

            <canvas
              ref={chartCanvasRef}
              width={640}
              height={110}
              className="w-full h-24 bg-[#120a06] rounded border border-[#3e1b15]"
            />
          </div>
        </div>

        {/* Right: Telemetry Core & Live Event Streams */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Dispatch Simulation Action Control Box */}
          <div className="bg-[#1c0f0a] p-4 rounded-xl border border-[#541e17] shadow-lg flex flex-col gap-3">
            <span className="text-xs font-bold text-[#ffd5d1] uppercase tracking-wider font-mono">
              Caravan Telemetry Core
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSimulation}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#8a2218] to-[#6d1810] hover:from-[#a02b1f] hover:to-[#7f1e14] text-white rounded-lg font-bold text-xs shadow-md transition-all active:scale-98"
              >
                {isSimulating ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isSimulating ? 'Pause Dispatch' : 'Dispatch Caravan Transit'}</span>
              </button>

              <button
                onClick={resetSimulation}
                className="p-2.5 rounded-lg bg-[#27150f] hover:bg-[#381e15] text-[#d6b5a3] border border-[#541e17] transition-colors"
                title="Reset simulation to Taxila"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Real-time Telemetry Metrics Table */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#3e1913] text-xs">
              <div className="flex justify-between py-0.5 border-b border-[#30140f] text-[11px]">
                <span className="text-[#a4887b]">Transit Station:</span>
                <strong className="text-[#ffd5d1]">{activeCheckpoint.name.split(' ')[0]}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#30140f] text-[11px]">
                <span className="text-[#a4887b]">Days in Transit:</span>
                <strong className="text-[#caa641] font-mono">{currentDays} Days</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#30140f] text-[11px]">
                <span className="text-[#a4887b]">Distance Traversed:</span>
                <strong className="text-[#ffd5d1] font-mono">{currentDistance} km</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#30140f] text-[11px]">
                <span className="text-[#a4887b]">Active Altitude:</span>
                <strong className="text-amber-300 font-mono">{currentAltitude} m</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#30140f] text-[11px]">
                <span className="text-[#a4887b]">Cargo Health:</span>
                <strong className="text-emerald-400 font-mono font-bold">{cargoHealth}% Intact</strong>
              </div>
              <div className="flex justify-between py-0.5 text-[11px]">
                <span className="text-[#a4887b]">Critical Surge Cycles:</span>
                <strong className="text-amber-400 font-mono font-bold">{surgeCycles}%</strong>
              </div>
            </div>

            {/* Manual Clear Cache Button */}
            <button
              onClick={clearStateCacheMemory}
              className="mt-1 flex items-center justify-center gap-1.5 py-1 rounded bg-[#20110b] hover:bg-[#2b170f] text-[#8e7667] text-[10px] font-mono border border-[#3e2116] transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Local State Cache</span>
            </button>
          </div>

          {/* Real-Time Event Log Ledger */}
          <div className="bg-[#1c0f0a] p-3 rounded-xl border border-[#541e17] shadow-lg flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-between border-b border-[#3e1913] pb-1.5">
              <span className="text-[11px] font-mono uppercase text-[#caa641] font-bold">
                Live Transit Log Streams
              </span>
              <span className="text-[10px] font-mono bg-black/40 px-1.5 py-0.5 rounded text-[#a4887b]">
                {telemetryLogs.length} events
              </span>
            </div>

            <div className="max-h-44 overflow-y-auto flex flex-col gap-2 pr-1">
              {telemetryLogs.map((log, idx) => (
                <div key={idx} className="bg-[#140b07] p-2 rounded-lg border border-[#30140f] text-[11px] flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#caa641] font-bold">{log.time}</span>
                    <span className="bg-[#381610] text-amber-200 px-1 rounded text-[9px] uppercase font-bold">
                      {log.tag}
                    </span>
                  </div>
                  <p className="text-[#e6cdc7] leading-snug">
                    {log.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
