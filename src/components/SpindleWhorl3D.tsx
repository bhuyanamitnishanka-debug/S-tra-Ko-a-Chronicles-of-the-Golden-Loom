import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, RotateCw, BookOpen, Sparkles, Info, Eye } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface SpindleWhorl3DProps {
  onUnlockRelic?: () => void;
  isUnlocked?: boolean;
}

export const SpindleWhorl3D: React.FC<SpindleWhorl3DProps> = ({ onUnlockRelic, isUnlocked }) => {
  const [rpm, setRpm] = useState<number>(360);
  const [isSpinning, setIsSpinning] = useState<boolean>(true);
  const [tiltX, setTiltX] = useState<number>(22); // Degrees
  const [tiltY, setTiltY] = useState<number>(0);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [spunMeters, setSpunMeters] = useState<number>(14.8);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Rotation angle state for continuous 3D spin
  const [currentAngle, setCurrentAngle] = useState<number>(0);

  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isSpinning && rpm > 0) {
        setCurrentAngle((prev) => (prev + (rpm * 360 * dt) / 60) % 360);
        setSpunMeters((prev) => prev + (rpm * dt * 0.005));

        // Unlock relic reward if spun past 20 meters
        if (spunMeters > 20 && onUnlockRelic && !isUnlocked) {
          onUnlockRelic();
          sounds.playChimeUnlock();
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isSpinning, rpm, spunMeters, onUnlockRelic, isUnlocked]);

  // Sound effect triggers when spinning speed changes
  const handleRpmChange = (newRpm: number) => {
    setRpm(newRpm);
    sounds.playSpindleWhirr(newRpm / 300);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    setTiltY((prev) => (prev + dx * 0.5) % 360);
    setTiltX((prev) => Math.max(-45, Math.min(65, prev + dy * 0.5)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleSpin = () => {
    const next = !isSpinning;
    setIsSpinning(next);
    sounds.playClick();
    if (next) {
      sounds.playSpindleWhirr(rpm / 300);
    }
  };

  const handlePronounce = () => {
    sounds.speakWord('सूत्रम्', 'Sūtram');
    sounds.playSpindleWhirr(1.5);
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#2a1b12] via-[#22160f] to-[#180f0a] border-2 border-[#5a3b29] rounded-2xl p-4 sm:p-6 shadow-2xl text-[#f5ebd9]">
      {/* Kiosk Header matching museum exhibit */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#4d3222] pb-3 mb-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#caa641] uppercase font-bold">
            Virtual Archaeological Replica · Mohenjo-daro DK Area (2500 BCE)
          </span>
          <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-[#ffdca3] flex items-center gap-2">
            <span>सूत्रम्</span>
            <span className="text-sm font-sans font-normal text-[#d6bca2]">(Sūtram) · 3D Terracotta Spindle Whorl</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePronounce}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#422617] hover:bg-[#56321f] text-[#ffdca3] border border-[#c59f3f]/50 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#caa641]" />
            <span>Play Audio</span>
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              showHistory
                ? 'bg-[#c59f3f] text-[#1c120c] border-[#ffde82]'
                : 'bg-[#291a12] text-[#d6bca2] border-[#4d3222] hover:bg-[#382318]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Historical Usage</span>
          </button>
        </div>
      </div>

      {/* Main 3D Viewport & Simulation Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: 3D Canvas / SVG Viewport */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="lg:col-span-8 relative h-[320px] sm:h-[380px] bg-gradient-to-b from-[#140c08] via-[#1c120b] to-[#120a06] rounded-xl border border-[#4d3222] overflow-hidden cursor-grab active:cursor-grabbing select-none flex items-center justify-center shadow-inner"
        >
          {/* Subtle 3D grid guidelines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c59f3f_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Interactive 3D SVG Spindle Whorl Assembly */}
          <div
            className="relative transition-transform duration-75"
            style={{
              transform: `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Spinning Spindle Rod (Vertical wooden axis) */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-36 w-3 h-72 bg-gradient-to-r from-[#5a361e] via-[#945e39] to-[#3a200f] rounded-full shadow-2xl border border-[#412411]">
              {/* Spindle hook tip */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-5 border-t-2 border-r-2 border-[#d4af37] rounded-tr-full" />
            </div>

            {/* Spun Cotton Yarn Cone around the upper spindle */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-16 w-8 h-20 bg-gradient-to-r from-[#d9cfbe] via-[#fffbf3] to-[#c2b59f] rounded-t-full shadow-lg border border-[#e2d8c3]/40"
              style={{
                clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
              }}
            >
              {/* Spun thread spiral lines */}
              <div className="w-full h-full opacity-60 flex flex-col justify-around py-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-full h-[1px] bg-[#9a8972] transform -rotate-12" />
                ))}
              </div>
            </div>

            {/* The Rotating Terracotta Flywheel Whorl (The Mohenjo-Daro Disk) */}
            <div
              className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full shadow-2xl flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #d47656, #9e462c 45%, #632616 80%, #3e160c)',
                transform: `rotate(${currentAngle}deg)`,
                border: '4px solid #4a1c10',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 3px 8px rgba(255, 255, 255, 0.25)',
              }}
            >
              {/* Concentric etched grooves and Indus glyph symbols */}
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#ffd2a8]/30" />
              <div className="absolute inset-10 rounded-full border border-[#ffe0bd]/20" />
              <div className="absolute inset-16 rounded-full border-2 border-dotted border-[#ffd2a8]/40" />

              {/* 4 Carved Indus Symbols around the rim */}
              <div className="absolute top-3 font-cinzel text-xs font-black text-[#ffcca0]/60 select-none">𐤎</div>
              <div className="absolute bottom-3 font-cinzel text-xs font-black text-[#ffcca0]/60 select-none">𐤐</div>
              <div className="absolute left-3 font-cinzel text-xs font-black text-[#ffcca0]/60 select-none">𐤕</div>
              <div className="absolute right-3 font-cinzel text-xs font-black text-[#ffcca0]/60 select-none">𐤔</div>

              {/* Central spindle hole collar */}
              <div className="w-12 h-12 rounded-full bg-[#2a0e07] border-2 border-[#e69070] flex items-center justify-center shadow-inner">
                <div className="w-4 h-4 rounded-full bg-[#120502]" />
              </div>
            </div>

            {/* Animated Cotton Fibers (Tantu) flowing in from the side */}
            <svg
              className="absolute -top-32 -left-36 w-48 h-48 pointer-events-none overflow-visible"
              viewBox="0 0 150 150"
            >
              {/* Fluffy Raw Cotton cloud */}
              <path
                d="M 20 60 Q 30 40 50 45 Q 70 35 85 55 Q 95 75 75 90 Q 55 105 35 95 Q 15 85 20 60 Z"
                fill="rgba(255, 253, 248, 0.85)"
                filter="drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
              />
              <text x="32" y="72" fill="#5a422d" fontSize="9" fontWeight="bold" fontFamily="monospace">
                Tantu (Fibers)
              </text>

              {/* Twisted thread lines streaming to spindle hook */}
              <path
                d="M 80 65 Q 120 70 145 95"
                fill="none"
                stroke="#fff7ea"
                strokeWidth={isSpinning ? 2.5 : 1.5}
                strokeDasharray={isSpinning ? '4, 2' : 'none'}
                className={isSpinning ? 'animate-pulse' : ''}
              />
            </svg>
          </div>

          {/* Hint Overlay */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-mono text-[#c59f3f] flex items-center gap-1.5 border border-[#c59f3f]/20">
            <Eye className="w-3.5 h-3.5" />
            <span>Click & Drag to rotate 3D view</span>
          </div>

          {/* Live RPM Tag */}
          <div className="absolute top-3 right-3 bg-[#bd593c]/90 px-2.5 py-1 rounded-md text-xs font-mono font-bold text-white shadow-md">
            {rpm} RPM
          </div>
        </div>

        {/* Right: Controls & Interactive Telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#1c120c] p-4 rounded-xl border border-[#4d3222] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#d6bca2]">Spindle Rotation:</span>
              <button
                onClick={toggleSpin}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all shadow ${
                  isSpinning
                    ? 'bg-[#bd593c] text-white hover:bg-[#a1452c]'
                    : 'bg-[#c59f3f] text-[#1c120c] hover:bg-[#d8b352]'
                }`}
              >
                {isSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isSpinning ? 'Pause Spin' : 'Start Spin'}</span>
              </button>
            </div>

            {/* RPM Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono text-[#caa641] mb-1">
                <span>Inertia Speed:</span>
                <span className="font-bold">{rpm} RPM</span>
              </div>
              <input
                type="range"
                min="0"
                max="900"
                step="50"
                value={rpm}
                onChange={(e) => handleRpmChange(parseInt(e.target.value))}
                className="w-full h-2 bg-[#2d1a10] rounded-lg appearance-none cursor-pointer accent-[#c59f3f]"
              />
              <div className="flex justify-between text-[10px] text-[#785741] mt-0.5 font-mono">
                <span>0 (Rest)</span>
                <span>450 (Standard)</span>
                <span>900 (High Speed)</span>
              </div>
            </div>

            {/* Spun Yarn Metric */}
            <div className="bg-[#140b06] p-2.5 rounded-lg border border-[#3e2416] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#a58974] block">
                  Continuous Yarn Spun
                </span>
                <span className="text-lg font-cinzel font-black text-[#ffdca3] tabular-nums">
                  {spunMeters.toFixed(1)} meters
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#bd593c]/20 border border-[#bd593c] flex items-center justify-center text-sm">
                🧵
              </div>
            </div>

            {/* Quick 3D Reset Button */}
            <button
              onClick={() => {
                setTiltX(22);
                setTiltY(0);
                sounds.playClick();
              }}
              className="text-xs text-[#caa641] hover:text-[#ffdca3] flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#27170f] border border-[#4d3222] transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reset 3D Perspective</span>
            </button>
          </div>

          {/* Children Observation Card */}
          <div className="bg-[#241710] p-3 rounded-xl border border-[#bd593c]/40 text-xs">
            <div className="flex items-center gap-2 mb-1.5 text-[#ffdca3] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#caa641]" />
              <span>Kabir's Science Notebook:</span>
            </div>
            <p className="font-comic text-[#e8dacb] leading-relaxed">
              "The flywheel stores angular momentum! The heavier terracotta outer rim keeps it spinning smoothly without wobbling, pulling the fluffy cotton cloud into a super tight thread!"
            </p>
          </div>
        </div>
      </div>

      {/* Historical Usage Dropdown Drawer */}
      {showHistory && (
        <div className="mt-4 pt-4 border-t border-[#4d3222] bg-[#1a0f09] p-4 rounded-xl border border-[#633a23] animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#caa641] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-[#decbb8] space-y-2">
              <p>
                <strong className="text-[#ffdca3]">Indus Valley Excavation Evidence:</strong> Hundreds of terracotta and faience spindle whorls were excavated at Mohenjo-daro and Harappa. Scanning electron microscope (SEM) analysis of cotton fibers preserved inside a silver jar in DK Area proved that ancient South Asians had mastered true cultivated cotton (*Gossypium arboreum*) over 4,500 years ago!
              </p>
              <p>
                <strong className="text-[#ffdca3]">Rigvedic Cosmic Symbolism:</strong> Rigveda X.130.1 compares creation to a vast, cosmic weaving loom where celestial ancestors stretch the warp and spin the unbroken thread of life: <em className="text-[#caa641]">"यो यज्ञो विश्वतस्तन्तुभिस्तत एकशतं देवकर्मेभिरायतः..."</em>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
