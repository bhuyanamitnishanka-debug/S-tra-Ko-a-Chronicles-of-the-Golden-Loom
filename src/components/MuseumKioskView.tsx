import React, { useState } from 'react';
import { Volume2, BookOpen, RotateCw, Eye, Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface MuseumKioskViewProps {
  onBackToNovel: () => void;
}

export const MuseumKioskView: React.FC<MuseumKioskViewProps> = ({ onBackToNovel }) => {
  const [selectedWord, setSelectedWord] = useState<string>('sutra');
  const [showUsageModal, setShowUsageModal] = useState<boolean>(false);
  const [whorlRotation, setWhorlRotation] = useState<number>(45);
  const [isSpinning, setIsSpinning] = useState<boolean>(true);

  // Auto spin effect
  React.useEffect(() => {
    if (!isSpinning) return;
    const interval = setInterval(() => {
      setWhorlRotation((prev) => (prev + 3) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isSpinning]);

  const terms = [
    {
      id: 'tantu',
      devanagari: 'तन्तु',
      translit: 'Tantu',
      english: 'Raw Fiber / Filament Strand',
      citation: 'Atharvaveda & Mohenjo-daro silver vase SEM scans confirming pure cultivated cotton (Gossypium arboreum).',
      whorlCaption: 'Raw cotton bolls from Indus floodplains ready for fiber drafting.',
    },
    {
      id: 'sutra',
      devanagari: 'सूत्रम्',
      translit: 'Sūtram',
      english: 'Thread / Yarn / String',
      citation: 'Historical contexts from Rigvedic literature (X.130.1) comparing continuous thread to the cosmic order spun by dawn ancestors.',
      whorlCaption: 'Virtual rotating 3D spinning whorl from Mohenjo-daro, rendered with animated hand fibers.',
    },
    {
      id: 'vana',
      devanagari: 'वान',
      translit: 'Vāna',
      english: 'Weaving / Warp-Weft Interlace',
      citation: 'Taittiriya Samhita describing day and night as twin cosmic weavers passing the shuttle across the sky loom.',
      whorlCaption: 'Bone loom weights and polished deer-horn shuttles recovered from Lothal dockyards.',
    },
    {
      id: 'pata',
      devanagari: 'पट',
      translit: 'Paṭa',
      english: 'Woven Cloth Panel / Canvas',
      citation: 'Panini’s Ashtadhyayi classifying fine count cotton cloth and painted scrolls (Pata-chitra).',
      whorlCaption: 'Madder-dyed woven fabric fragments preserved on bronze axe blades at Harappa.',
    },
    {
      id: 'urna',
      devanagari: 'ऊर्णा',
      translit: 'Ūrṇā',
      english: 'Fleece / Mountain Wool',
      citation: 'Rigveda IV.22.2 praising the fine bleached fleece washed in the swift waters of the Gandhara rivers.',
      whorlCaption: 'Carved bone carding combs and wool spinning needles found in Swat Valley.',
    },
  ];

  const current = terms.find((t) => t.id === selectedWord) || terms[1];

  const handleSelect = (id: string) => {
    sounds.playClick();
    setSelectedWord(id);
    sounds.playSpindleWhirr(1.2);
  };

  const handlePlayAudio = () => {
    sounds.speakWord(current.devanagari, current.translit);
    sounds.playSpindleWhirr(1.8);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Museum Room Atmosphere */}
      <div className="w-full max-w-6xl relative">
        {/* Museum Gallery Kiosk Display Case */}
        <div className="relative rounded-3xl bg-[#1f150f] p-4 sm:p-8 border-4 border-[#3a2618] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Subtle warm gallery downlight */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar inside Tablet */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 bg-gradient-to-r from-[#945f3a] via-[#b67d4e] to-[#945f3a] rounded-t-xl border border-[#d29b68] text-[#2c1709] shadow-md">
            <button
              onClick={onBackToNovel}
              className="w-7 h-7 rounded-full bg-[#3d210f]/20 hover:bg-[#3d210f]/40 flex items-center justify-center transition-colors text-[#2c1709]"
              title="Back to Graphic Novel"
            >
              <ArrowLeft className="w-4 h-4 font-bold" />
            </button>

            <h2 className="font-cinzel text-xs sm:text-base font-bold text-[#2a1608] tracking-wide text-center">
              Interactive Glossary of Sanskrit Textile Terms
            </h2>

            <button
              onClick={() => sounds.playClick()}
              className="w-7 h-7 rounded-full bg-[#3d210f]/20 hover:bg-[#3d210f]/40 flex items-center justify-center transition-colors text-[#2c1709]"
              title="Exhibit Information"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Tablet Main Screen Frame (Matching user's photo!) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 p-3 sm:p-6 bg-gradient-to-br from-[#ebd8ba] via-[#f7ecd6] to-[#ebd2af] rounded-b-xl border-x border-b border-[#c89868] shadow-inner text-[#22150d] relative overflow-hidden">
            {/* Subtle etched damask background */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#804b27_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* Left Column: Sanskrit Terms List (Golden Buttons) */}
            <div className="md:col-span-3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 z-10">
              {terms.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex-1 md:flex-initial py-3 px-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center shadow-md ${
                    selectedWord === item.id
                      ? 'bg-gradient-to-r from-[#8f4422] to-[#b3572d] border-[#ffd685] text-white ring-2 ring-[#ffd685]/50 scale-102 font-bold'
                      : 'bg-gradient-to-b from-[#8f522e] to-[#733f20] border-[#b07447] text-[#ffe6d1] hover:brightness-110'
                  }`}
                >
                  <span className="font-cinzel text-base sm:text-xl font-bold leading-tight drop-shadow-sm">
                    {item.devanagari}
                  </span>
                  <span className="text-[11px] font-mono tracking-wide text-amber-200/90 font-medium">
                    ({item.translit})
                  </span>
                </button>
              ))}
            </div>

            {/* Center Column: Big Glowing Term & Rigvedic Context */}
            <div className="md:col-span-5 flex flex-col justify-between items-center text-center p-3 sm:p-6 bg-white/40 rounded-xl border border-[#c49265]/40 backdrop-blur-xs shadow-sm z-10">
              <div className="flex-1 flex flex-col items-center justify-center my-auto">
                {/* Glowing Golden Sanskrit Word */}
                <h1 className="font-cinzel text-4xl sm:text-6xl font-black text-[#96421e] tracking-wide drop-shadow-md select-none">
                  {current.devanagari}
                </h1>
                <h2 className="font-cinzel text-lg sm:text-2xl font-bold text-[#3d2010] mt-1">
                  {current.translit}
                </h2>
                <div className="text-xs sm:text-sm font-semibold text-[#734327] mt-0.5">
                  {current.english}
                </div>

                {/* Two Action Buttons (Audio & Usage) matching photo */}
                <div className="flex items-center gap-2.5 mt-5">
                  <button
                    onClick={handlePlayAudio}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#944622] to-[#b85b2e] hover:from-[#a85028] hover:to-[#c76433] text-white border border-[#ffcf94]/40 font-bold text-xs shadow-md transition-transform active:scale-95"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>PLAY AUDIO</span>
                  </button>

                  <button
                    onClick={() => setShowUsageModal(!showUsageModal)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#944622] hover:bg-[#a85028] text-white border border-[#ffcf94]/40 font-bold text-xs shadow-md transition-transform active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>HISTORICAL USAGE</span>
                  </button>
                </div>
              </div>

              {/* Decorative separator & Rigvedic Quote */}
              <div className="mt-4 pt-3 border-t border-[#8f522e]/20 w-full text-center">
                <div className="text-[10px] text-[#8f522e] font-cinzel tracking-widest uppercase mb-1">
                  ✦ Rigvedic Archaeological Context ✦
                </div>
                <p className="text-[11px] sm:text-xs text-[#52311b] leading-relaxed italic line-clamp-3">
                  "{current.citation}"
                </p>
              </div>
            </div>

            {/* Right Column: 3D Artifact Showcase Box */}
            <div className="md:col-span-4 flex flex-col justify-between items-center bg-gradient-to-b from-[#2d1b11] to-[#1a0e08] rounded-xl border-2 border-[#5a361e] p-4 text-[#ffdca8] shadow-lg z-10">
              {/* 3D Spindle Model with rotating perspective & hand fibers */}
              <div className="relative w-full h-44 flex items-center justify-center overflow-hidden">
                {/* Animated Rotating Spindle Assembly */}
                <div
                  className="relative flex items-center justify-center transition-transform"
                  style={{
                    transform: `perspective(500px) rotateX(25deg) rotateY(${whorlRotation}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Spindle Rod */}
                  <div className="absolute w-2 h-44 bg-gradient-to-r from-[#6e4324] via-[#b37446] to-[#452712] rounded-full shadow-lg" />

                  {/* Thread cone */}
                  <div
                    className="absolute -top-8 w-6 h-14 bg-[#f8f1e2] rounded-t-full opacity-90 shadow-md"
                    style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' }}
                  />

                  {/* Terracotta Disk */}
                  <div
                    className="w-32 h-32 rounded-full border-2 border-[#542111] shadow-2xl flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, #d46f4d, #943e24 50%, #4a190b)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.6)',
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#240b04] border border-[#ffb294]" />
                  </div>
                </div>

                {/* Hand fiber outline */}
                <div className="absolute top-2 right-2 text-xs font-mono text-amber-200/80 bg-black/40 px-2 py-0.5 rounded border border-amber-300/20">
                  Mohenjo-daro 2500 BCE
                </div>
              </div>

              {/* SEE IN 3D Button */}
              <button
                onClick={() => {
                  setIsSpinning(!isSpinning);
                  sounds.playSpindleWhirr(1.5);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#3e6878] to-[#254652] hover:brightness-110 text-white font-bold text-xs border border-[#8ec8de]/50 shadow-md my-2"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-200" />
                <span>{isSpinning ? 'PAUSE 3D ROTATION' : 'RESUME 3D SPIN'}</span>
              </button>

              {/* Description */}
              <p className="text-[11px] text-[#e0c4aa] text-center leading-snug line-clamp-2">
                {current.whorlCaption}
              </p>

              {/* Dot pagination */}
              <div className="flex items-center gap-1.5 mt-2">
                {terms.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      terms.findIndex((t) => t.id === selectedWord) === i
                        ? 'bg-[#c59f3f] scale-125'
                        : 'bg-[#5e3e29]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Realistic Museum Wooden Pedestal Base */}
        <div className="w-full flex justify-center -mt-2">
          <div className="w-3/4 max-w-xl h-12 bg-gradient-to-b from-[#3a2215] via-[#523321] to-[#2c170c] rounded-b-xl border-x-4 border-b-4 border-[#221107] shadow-2xl flex items-center justify-center text-xs font-cinzel text-amber-200/60 font-semibold tracking-wider">
            National Crafts Museum Gallery · Pedestal 104
          </div>
        </div>
      </div>
    </div>
  );
};
