import React, { useState } from 'react';
import { Play, RotateCcw, Volume2, Sparkles, CheckCircle2, Award, ShieldCheck, Flame, Trophy, Send, Scroll, Check, Layers } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HandloomShuttleSimulatorProps {
  onUnlockRelic?: () => void;
  isUnlocked?: boolean;
}

interface GuildPattern {
  id: string;
  name: string;
  sanskrit: string;
  requiredRows: number;
  description: string;
  colors: string[];
}

interface DeliveredBolt {
  id: number;
  patternName: string;
  sanskritName: string;
  rows: number;
  pointsEarned: number;
  timestamp: string;
  colorSwatch: string[];
}

export const HandloomShuttleSimulator: React.FC<HandloomShuttleSimulatorProps> = ({
  onUnlockRelic,
  isUnlocked,
}) => {
  const [shedState, setShedState] = useState<'odd' | 'even'>('odd'); // Which heddle is raised
  const [shuttlePosition, setShuttlePosition] = useState<'left' | 'right'>('left');
  const [isBeating, setIsBeating] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<string>('#c59f3f'); // Gold Zari default
  const [colorName, setColorName] = useState<string>('Golden Zari Thread');
  const [guildPoints, setGuildPoints] = useState<number>(180);
  const [activePatternId, setActivePatternId] = useState<string>('chevron');
  const [completedPatternsCount, setCompletedPatternsCount] = useState<number>(1);
  const [deliveredBolts, setDeliveredBolts] = useState<DeliveredBolt[]>([
    {
      id: 1,
      patternName: 'Vedic Chevron Ribbon',
      sanskritName: 'वैदिक तरङ्ग',
      rows: 6,
      pointsEarned: 280,
      timestamp: 'Imperial Commission #101',
      colorSwatch: ['#c59f3f', '#1e3a5f', '#c59f3f'],
    },
  ]);
  const [justDelivered, setJustDelivered] = useState<boolean>(false);
  const [wovenRows, setWovenRows] = useState<Array<{ color: string; pattern: string }>>([
    { color: '#8a2218', pattern: 'odd' },
    { color: '#8a2218', pattern: 'even' },
    { color: '#284f7a', pattern: 'odd' },
  ]);

  const guildPatterns: GuildPattern[] = [
    {
      id: 'chevron',
      name: 'Vedic Chevron Ribbon',
      sanskrit: 'वैदिक तरङ्ग',
      requiredRows: 6,
      description: 'Alternating golden zari and indigo sheds creating sacred river waves.',
      colors: ['#c59f3f', '#1e3a5f'],
    },
    {
      id: 'royal_band',
      name: 'Pataliputra Imperial Stripe',
      sanskrit: 'राजकीय पट्टिका',
      requiredRows: 8,
      description: 'Triple-dyed madder crimson interweaved with fine flax yarn.',
      colors: ['#962b1e', '#dfd7c5'],
    },
    {
      id: 'diamond',
      name: 'Indus Sun Diamond',
      sanskrit: 'सूर्य मण्डल',
      requiredRows: 10,
      description: 'Intricate high-density gold zari geometry reserved for royal crowns.',
      colors: ['#c59f3f', '#962b1e'],
    },
  ];

  const currentPattern = guildPatterns.find((p) => p.id === activePatternId) || guildPatterns[0];

  // Guild Ranks & Next Tier Thresholds
  const getGuildRank = (points: number) => {
    if (points >= 500) {
      return {
        title: 'Imperial Master Weaver',
        sanskrit: 'महा-वयकार (Mahā-Vayakāra)',
        rankIcon: '👑',
        color: 'text-amber-300',
        nextTier: 'Supreme Arch-Weaver',
        nextPoints: 1000,
        tierPercent: Math.min(100, Math.round(((points - 500) / 500) * 100)),
      };
    }
    if (points >= 300) {
      return {
        title: 'Guild Senior Artisan',
        sanskrit: 'वयकार (Vayakāra)',
        rankIcon: '🏵️',
        color: 'text-emerald-300',
        nextTier: 'Imperial Master Weaver',
        nextPoints: 500,
        tierPercent: Math.min(100, Math.round(((points - 300) / 200) * 100)),
      };
    }
    if (points >= 150) {
      return {
        title: 'Journeyman Weaver',
        sanskrit: 'सूत-कार (Sūta-Kāra)',
        rankIcon: '🧵',
        color: 'text-cyan-300',
        nextTier: 'Guild Senior Artisan',
        nextPoints: 300,
        tierPercent: Math.min(100, Math.round(((points - 150) / 150) * 100)),
      };
    }
    return {
      title: 'Apprentice Weaver',
      sanskrit: 'तन्तु-शिल्पी (Tantu-Śilpī)',
      rankIcon: '🌱',
      color: 'text-stone-300',
      nextTier: 'Journeyman Weaver',
      nextPoints: 150,
      tierPercent: Math.min(100, Math.round((points / 150) * 100)),
    };
  };

  const currentRank = getGuildRank(guildPoints);

  // Visual Guild Progress Computation
  const completedRows = wovenRows.length;
  const targetRows = currentPattern.requiredRows;
  const progressPercent = Math.min(100, Math.round((completedRows / targetRows) * 100));
  const fabricMetersContributed = (completedRows * 0.45).toFixed(2);
  const quotaTargetMeters = (targetRows * 0.45).toFixed(2);
  const isPatternComplete = completedRows >= targetRows;

  const [lastPointGain, setLastPointGain] = useState<{ amount: number; key: number } | null>(null);

  const palette = [
    { name: 'Golden Zari Thread', hex: '#c59f3f' },
    { name: 'Sacred Indigo Blue', hex: '#1e3a5f' },
    { name: 'Madder Root Crimson', hex: '#962b1e' },
    { name: 'Unbleached Flax Linen', hex: '#dfd7c5' },
  ];

  // Pass Shuttle Across
  const passShuttle = () => {
    sounds.playLoomClack();
    const nextPos = shuttlePosition === 'left' ? 'right' : 'left';
    setShuttlePosition(nextPos);

    // Add woven thread row
    const newRow = { color: activeColor, pattern: shedState };
    const updated = [...wovenRows, newRow];
    setWovenRows(updated);

    // Increment guild contribution points
    const pointsGained = 35;
    const newPoints = guildPoints + pointsGained;
    setGuildPoints(newPoints);
    setLastPointGain({ amount: pointsGained, key: Date.now() });

    // Toggle shed automatically for smooth weaving rhythm
    setShedState(shedState === 'odd' ? 'even' : 'odd');

    // Check pattern completion
    if (updated.length === currentPattern.requiredRows) {
      setCompletedPatternsCount((prev) => prev + 1);
      sounds.playChimeUnlock();
    }

    // Check reward condition
    if (updated.length >= 6 && onUnlockRelic && !isUnlocked) {
      onUnlockRelic();
      sounds.playChimeUnlock();
    }
  };

  // Beat with Reed
  const beatReed = () => {
    setIsBeating(true);
    sounds.playLoomClack();
    const beatPoints = 15;
    setGuildPoints((prev) => prev + beatPoints);
    setLastPointGain({ amount: beatPoints, key: Date.now() });
    setTimeout(() => setIsBeating(false), 200);
  };

  // Deliver Finished Bolt to Guild Hall
  const deliverBoltToGuild = () => {
    sounds.playChimeUnlock();
    const deliveryBonus = 120;
    setGuildPoints((prev) => prev + deliveryBonus);
    setLastPointGain({ amount: deliveryBonus, key: Date.now() });

    const newDelivered: DeliveredBolt = {
      id: Date.now(),
      patternName: currentPattern.name,
      sanskritName: currentPattern.sanskrit,
      rows: wovenRows.length,
      pointsEarned: wovenRows.length * 35 + deliveryBonus,
      timestamp: `Commission #${100 + deliveredBolts.length + 1}`,
      colorSwatch: Array.from(new Set(wovenRows.map((r) => r.color))),
    };

    setDeliveredBolts((prev) => [newDelivered, ...prev]);
    setJustDelivered(true);
    setTimeout(() => setJustDelivered(false), 3000);

    // Reset current loom rows for next fresh commission bolt
    setWovenRows([]);
  };

  const resetLoom = () => {
    sounds.playClick();
    setWovenRows([
      { color: '#8a2218', pattern: 'odd' },
      { color: '#8a2218', pattern: 'even' },
    ]);
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#1a2e22] via-[#16241b] to-[#0f1712] border-2 border-[#2d5a3c] rounded-2xl p-4 sm:p-6 shadow-2xl text-[#f2f7f3]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2d5a3c]/60 pb-3 mb-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#caa641] uppercase font-bold">
            Interactive Handloom Simulator · Pataliputra Guilds (300 BCE)
          </span>
          <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-[#c7ebd1] flex items-center gap-2">
            <span>वानम्</span>
            <span className="text-sm font-sans font-normal text-[#a6d1b2]">(Vānam) · The Art of the Flying Shuttle</span>
          </h3>
        </div>

        <button
          onClick={() => sounds.speakWord('वानम्', 'Vānam')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#254531] hover:bg-[#325b41] text-[#c7ebd1] border border-[#407a55] rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#caa641]" />
          <span>Pronounce Vānam</span>
        </button>
      </div>

      {/* GUILD CONTRIBUTION VISUAL PROGRESS METER BANNER */}
      <div className="mb-5 bg-[#122318] border-2 border-[#386b49] rounded-xl p-4 shadow-lg flex flex-col gap-3 relative overflow-hidden">
        {/* Subtle patterned backdrop */}
        <div className="absolute -right-10 -bottom-10 opacity-10 text-8xl font-cinzel select-none pointer-events-none">
          वान
        </div>

        {/* Top Level: Current Rank & Points */}
        <div className="flex flex-wrap items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c59f3f] to-[#8c531d] border border-amber-300/40 flex items-center justify-center text-xl shadow-md">
              {currentRank.rankIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-[#1d3d2a] text-[#86e2a5] px-2 py-0.5 rounded font-bold border border-[#2e5e40]">
                  Guild Contribution
                </span>
                <span className="text-xs font-cinzel font-bold text-[#ffd785]">
                  {currentRank.sanskrit}
                </span>
              </div>
              <h4 className={`font-cinzel text-base font-bold ${currentRank.color}`}>
                {currentRank.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0d1a12] px-3.5 py-1.5 rounded-lg border border-[#2d5a3c]">
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#82b894] uppercase block">
                Total Guild Score
              </span>
              <span className="text-base font-cinzel font-black text-[#ffdca3] tabular-nums flex items-center gap-1 justify-end">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                {guildPoints} pts
              </span>
            </div>
          </div>
        </div>

        {/* Middle Level: The Animated Progress Bar */}
        <div className="flex flex-col gap-1.5 z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a4d4b1] font-medium flex items-center gap-1.5">
              <span>Current Weave:</span>
              <strong className="text-white font-cinzel">{currentPattern.name}</strong>
              <span className="text-[11px] text-[#caa641]">({currentPattern.sanskrit})</span>
            </span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#86e2a5] font-bold">
                {wovenRows.length} / {currentPattern.requiredRows} Rows Woven
              </span>
              <span className="bg-[#244b33] text-amber-200 px-2 py-0.5 rounded font-bold">
                {progressPercent}% Guild Progress
              </span>
            </div>
          </div>

          {/* Visual Progress Bar Track */}
          <div className="relative w-full h-5 bg-[#0a140e] rounded-full p-0.5 border-2 border-[#3e7551] shadow-inner overflow-hidden">
            {/* Background hatch lines */}
            <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,transparent_4px,transparent_8px)]" />

            {/* Filled Progress Gradient Bar */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#205e38] via-[#85b854] to-[#f0c34f] shadow-[0_0_15px_rgba(240,195,79,0.7)] transition-all duration-300 relative flex items-center justify-end pr-1.5"
              style={{ width: `${progressPercent}%` }}
            >
              {progressPercent > 6 && (
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              )}
            </div>

            {/* Milestone Threshold Pegs */}
            <div className="absolute inset-0 flex justify-between px-3 items-center pointer-events-none text-[9px] font-mono text-white/70">
              <span className="border-l border-white/30 pl-1 font-bold">25%</span>
              <span className="border-l border-white/30 pl-1 font-bold">50%</span>
              <span className="border-l border-white/30 pl-1 font-bold">75%</span>
              <span className="border-l border-white/30 pl-1 text-amber-200 font-bold">100% Guild Seal</span>
            </div>
          </div>

          {/* Segment-by-Segment Pattern Row Visualizer Cells */}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] font-mono text-[#86e2a5] uppercase shrink-0 mr-1">
              Pattern Grid:
            </span>
            <div className="flex-1 grid grid-flow-col auto-cols-fr gap-1">
              {[...Array(currentPattern.requiredRows)].map((_, idx) => {
                const isWoven = idx < wovenRows.length;
                const rowData = wovenRows[idx];
                return (
                  <div
                    key={idx}
                    className={`h-3 rounded-sm border transition-all flex items-center justify-center text-[8px] font-mono font-bold ${
                      isWoven
                        ? 'border-amber-300 shadow-sm text-white scale-102'
                        : 'border-[#2d5a3c]/60 bg-[#122217] text-stone-500 opacity-60'
                    }`}
                    style={isWoven && rowData ? { backgroundColor: rowData.color } : undefined}
                    title={`Row ${idx + 1}: ${isWoven ? 'Completed' : 'Pending shuttle pass'}`}
                  >
                    {isWoven ? '✓' : idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Guild Output Metrics Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#a4d4b1] bg-[#0c1810] px-3 py-1.5 rounded-lg border border-[#234530]">
            <div className="flex items-center gap-3">
              <span>
                Fabric Output: <strong className="text-white">{fabricMetersContributed} m</strong> / {quotaTargetMeters} m
              </span>
              <span>·</span>
              <span>
                Tension Status: <strong className="text-emerald-400">98.4% Balanced</strong>
              </span>
            </div>

            {lastPointGain && (
              <span key={lastPointGain.key} className="text-amber-300 font-bold animate-bounce text-xs">
                +{lastPointGain.amount} Guild Points!
              </span>
            )}
          </div>
        </div>

        {/* Bottom Level: Pattern Selector Pills & Achievement Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#22442e] text-xs z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[#7eb390] font-mono">Guild Commission:</span>
            {guildPatterns.map((pat) => (
              <button
                key={pat.id}
                onClick={() => {
                  setActivePatternId(pat.id);
                  sounds.playClick();
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all border ${
                  activePatternId === pat.id
                    ? 'bg-[#c59f3f] text-[#14241a] border-amber-300 font-bold shadow-sm'
                    : 'bg-[#15291d] text-[#a4d4b1] border-[#295439] hover:bg-[#1e3b2a]'
                }`}
              >
                {pat.name.split(' ')[0]} ({pat.requiredRows}r)
              </button>
            ))}
          </div>

          {progressPercent >= 100 ? (
            <div className="flex items-center justify-between gap-2 p-2 bg-[#2d1c08] border border-amber-400 rounded-lg w-full animate-fadeIn shadow-md">
              <div className="flex items-center gap-1.5 text-xs text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  <strong>Commission 100% Completed!</strong> Ready for delivery to Pataliputra Guild.
                </span>
              </div>
              <button
                onClick={deliverBoltToGuild}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#caa641] to-[#e6b94d] hover:brightness-110 text-[#14241a] font-bold text-xs rounded-md shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Deliver Bolt to Guild (+120 Pts)</span>
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-[#86e2a5] flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#caa641]" />
              <span>Weave {Math.max(0, currentPattern.requiredRows - wovenRows.length)} more rows to complete commission</span>
            </div>
          )}
        </div>
      </div>

      {/* Just Delivered Toast Banner */}
      {justDelivered && (
        <div className="mb-4 p-3 bg-gradient-to-r from-[#1c3a28] to-[#122419] border-2 border-emerald-400 rounded-xl text-xs text-emerald-200 flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              <strong>Cloth Bolt Officially Stamped & Delivered!</strong> Stored in the Royal Treasury. +120 Guild Points added.
            </span>
          </div>
          <span className="font-cinzel text-amber-300 font-bold">📜 Seal Bestowed</span>
        </div>
      )}

      {/* Loom Canvas Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Visual Wooden Loom Box */}
        <div className="lg:col-span-8 bg-[#101b14] border-4 border-[#3b2314] rounded-xl p-4 relative overflow-hidden shadow-2xl">
          {/* Wood Grain Frame Top & Bottom Beams */}
          <div className="w-full h-5 bg-gradient-to-r from-[#4d2c18] via-[#754425] to-[#4d2c18] rounded border border-[#2b180d] shadow flex items-center justify-around">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1.5 h-2 bg-[#2a170c] rounded-full" />
            ))}
          </div>

          {/* Central Warp & Weft Area */}
          <div className="relative h-60 my-2 bg-[#17231a] rounded flex flex-col justify-end p-2 overflow-hidden border border-[#2a4533]">
            {/* Vertical Warp Threads (Taut Lines) */}
            <div className="absolute inset-0 flex justify-between px-6 pointer-events-none">
              {[...Array(18)].map((_, i) => {
                const isRaised = shedState === 'odd' ? i % 2 === 0 : i % 2 !== 0;
                return (
                  <div
                    key={i}
                    className={`w-[2px] h-full transition-transform duration-200 ${
                      isRaised
                        ? 'bg-[#ffffff] shadow-[0_0_4px_rgba(255,255,255,0.8)] scale-y-105'
                        : 'bg-[#98a89c] opacity-60'
                    }`}
                  />
                );
              })}
            </div>

            {/* Woven Rows (Accumulated at bottom) */}
            <div className={`relative z-10 flex flex-col-reverse gap-1 transition-transform ${isBeating ? 'translate-y-1' : ''}`}>
              {wovenRows.map((row, idx) => (
                <div
                  key={idx}
                  className="h-3.5 rounded-sm shadow-sm flex items-center justify-center text-[9px] font-mono font-bold tracking-wider text-white/90 border-y border-black/20"
                  style={{ backgroundColor: row.color }}
                >
                  Row {idx + 1} · {row.pattern === 'odd' ? '▲ Odd Shed' : '▼ Even Shed'}
                </div>
              ))}
            </div>

            {/* Interactive Flying Shuttle in Flight */}
            <div
              className={`absolute top-12 transition-all duration-300 z-20 flex items-center ${
                shuttlePosition === 'left' ? 'left-6' : 'right-6'
              }`}
            >
              <div
                className="w-24 h-7 rounded-full bg-gradient-to-r from-[#824b26] via-[#be7945] to-[#824b26] border-2 border-[#ffc991] shadow-2xl flex items-center justify-between px-2 cursor-pointer hover:scale-105 transition-transform"
                onClick={passShuttle}
                title="Click Shuttle to Shoot across the Warp!"
              >
                <div className="w-2 h-2 rounded-full bg-[#3d1f0d]" />
                {/* Spool inside shuttle */}
                <div
                  className="w-10 h-3.5 rounded-full shadow-inner border border-black/30"
                  style={{ backgroundColor: activeColor }}
                />
                <div className="w-2 h-2 rounded-full bg-[#3d1f0d]" />
              </div>
            </div>

            {/* Reed Beater Bar (Moving down when beating) */}
            <div
              className={`absolute left-0 right-0 h-4 bg-gradient-to-r from-[#6b4124] via-[#a3683f] to-[#6b4124] border-y-2 border-[#331c0d] transition-all duration-150 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-lg ${
                isBeating ? 'top-32 shadow-2xl' : 'top-4'
              }`}
            >
              <span>Reed Beater Bar (Pounding Comb)</span>
            </div>
          </div>

          {/* Wood Bottom Beam */}
          <div className="w-full h-5 bg-gradient-to-r from-[#4d2c18] via-[#754425] to-[#4d2c18] rounded border border-[#2b180d] shadow flex items-center justify-around">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1.5 h-2 bg-[#2a170c] rounded-full" />
            ))}
          </div>
        </div>

        {/* Right Controls */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Action Buttons */}
          <div className="bg-[#122217] p-4 rounded-xl border border-[#2d5a3c] flex flex-col gap-3">
            <span className="text-xs font-bold text-[#c7ebd1]">Weaver Actions:</span>

            {/* Shuttle shoot button */}
            <button
              onClick={passShuttle}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#bd593c] to-[#983e25] hover:from-[#cb6446] hover:to-[#a9482d] text-white rounded-lg font-bold text-xs shadow-md transition-all active:scale-98"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Pass Shuttle Across (+35 Guild Pts)</span>
            </button>

            {/* Reed Beater button */}
            <button
              onClick={beatReed}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-[#23422e] hover:bg-[#2c543a] text-[#c7ebd1] border border-[#3b704d] rounded-lg font-bold text-xs transition-colors"
            >
              <span>Beat Weft Down Firmly (+15 Pts)</span>
            </button>

            {/* Reset */}
            <button
              onClick={resetLoom}
              className="flex items-center justify-center gap-1.5 py-1 text-xs text-[#95bfa1] hover:text-[#d3f0db] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Woven Cloth</span>
            </button>
          </div>

          {/* Natural Dye Color Selector */}
          <div className="bg-[#122217] p-3 rounded-xl border border-[#2d5a3c] flex flex-col gap-2">
            <span className="text-[11px] font-bold text-[#a4d4b1]">Select Ancient Weft Spool:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {palette.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setActiveColor(p.hex);
                    setColorName(p.name);
                    sounds.playClick();
                  }}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border text-left text-xs transition-all ${
                    activeColor === p.hex
                      ? 'border-[#caa641] bg-[#1d3826] font-bold text-white'
                      : 'border-[#2d5a3c]/60 bg-[#16271c] text-[#a4d4b1] hover:bg-[#1f3526]'
                  }`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm shrink-0"
                    style={{ backgroundColor: p.hex }}
                  />
                  <span className="truncate text-[11px]">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Achievement Summary Card */}
          <div className="bg-[#172c1e] p-3 rounded-xl border border-[#3b704d] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#a4d4b1] block">
                Commissions Finished:
              </span>
              <span className="text-base font-cinzel font-bold text-[#ffdeb3]">
                {completedPatternsCount} Guild Masterpieces
              </span>
            </div>
            {wovenRows.length >= 6 ? (
              <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>Relic Granted!</span>
              </div>
            ) : (
              <span className="text-xs text-[#caa641] font-mono font-bold animate-pulse">
                Keep Weaving!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* GUILD CONTRIBUTION VAULT & COMMUNAL TAPESTRY */}
      <div className="mt-6 pt-5 border-t border-[#2d5a3c]/60 flex flex-col gap-4">
        {/* Tier XP Progress Bar */}
        <div className="bg-[#122318] p-4 rounded-xl border border-[#2d5a3c] flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a4d4b1] font-mono flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Rank Advancement to <strong>{currentRank.nextTier}</strong>:</span>
            </span>
            <span className="font-mono font-bold text-amber-200">
              {guildPoints} / {currentRank.nextPoints} XP ({currentRank.tierPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#0a140e] rounded-full overflow-hidden border border-[#234530]">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${currentRank.tierPercent}%` }}
            />
          </div>
        </div>

        {/* Communal Tapestry Finished Bolts Archive */}
        <div className="bg-[#122318] p-4 rounded-xl border border-[#2d5a3c] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#234530] pb-2">
            <div className="flex items-center gap-2">
              <Scroll className="w-4 h-4 text-amber-300" />
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#c7ebd1]">
                Pataliputra Guild Masterpiece Archive
              </h4>
            </div>
            <span className="text-[11px] font-mono text-[#86e2a5]">
              {deliveredBolts.length} Fabric Bolts Delivered to Royal Hall
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {deliveredBolts.map((bolt) => (
              <div
                key={bolt.id}
                className="bg-[#0e1a12] p-3 rounded-lg border border-[#2b5438] flex flex-col justify-between gap-2 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#caa641]">
                    <span>{bolt.timestamp}</span>
                    <span className="bg-[#1f3f2a] text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                      +{bolt.pointsEarned} pts
                    </span>
                  </div>
                  <div className="font-cinzel text-xs font-bold text-white mt-1">
                    {bolt.patternName}
                  </div>
                  <div className="text-[10px] text-[#86e2a5] font-cinzel">
                    {bolt.sanskritName} · {bolt.rows} Rows
                  </div>
                </div>

                {/* Color Swatch ribbon */}
                <div className="flex items-center gap-1 mt-1 pt-1 border-t border-[#1c3825]">
                  <span className="text-[9px] font-mono text-stone-400">Dyes:</span>
                  {bolt.colorSwatch.map((c, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-2.5 rounded-xs border border-white/20"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <span className="ml-auto text-[10px] text-amber-300">📜 Stamped</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

