import React, { useState } from 'react';
import { Volume2, Sparkles, Wand2, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface DyeAlchemistStudioProps {
  onUnlockRelic?: () => void;
  isUnlocked?: boolean;
}

export const DyeAlchemistStudio: React.FC<DyeAlchemistStudioProps> = ({
  onUnlockRelic,
  isUnlocked,
}) => {
  const [selectedDye, setSelectedDye] = useState<string>('indigo');
  const [hasZariFoil, setHasZariFoil] = useState<boolean>(true);
  const [drapeStyle, setDrapeStyle] = useState<'both' | 'antariya' | 'uttariya'>('both');
  const [isOxidizing, setIsOxidizing] = useState<boolean>(false);

  const dyes = [
    {
      id: 'indigo',
      name: 'Nīlikā (Indigofera Tinctoria)',
      sanskrit: 'नीलिका',
      colorHex: '#1d3557',
      fabricHex: '#25446e',
      desc: 'Fermented in alkaline clay vats. Leaves are green when dipped, then magically oxidize to royal deep blue in the open mountain air!',
    },
    {
      id: 'madder',
      name: 'Mañjiṣṭhā (Indian Madder Root)',
      sanskrit: 'मञ्जिष्ठा',
      colorHex: '#8b1e15',
      fabricHex: '#a3281d',
      desc: 'Boiled roots mixed with alum mordant. Yields an enduring terracotta-crimson praised in classical poetry.',
    },
    {
      id: 'turmeric',
      name: 'Haridrā (Sacred Turmeric Gold)',
      sanskrit: 'हरिद्रा',
      colorHex: '#d49b28',
      fabricHex: '#e8b03d',
      desc: 'Ground sun-dried rhizomes. Yields a radiant sacred gold hue reserved for bridal drapes and ceremonial offerings.',
    },
  ];

  const currentDye = dyes.find((d) => d.id === selectedDye) || dyes[0];

  const handleSelectDye = (dyeId: string) => {
    sounds.playClick();
    setIsOxidizing(true);
    setSelectedDye(dyeId);
    setTimeout(() => {
      setIsOxidizing(false);
      sounds.playChimeUnlock();
      if (onUnlockRelic && !isUnlocked) {
        onUnlockRelic();
      }
    }, 400);
  };

  const toggleZari = () => {
    sounds.playClick();
    setHasZariFoil(!hasZariFoil);
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#20172e] via-[#1a1226] to-[#120a1c] border-2 border-[#57407d] rounded-2xl p-4 sm:p-6 shadow-2xl text-[#f6f3fc]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#433162] pb-3 mb-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#caa641] uppercase font-bold">
            Gupta Royal Atelier · Natural Dye Alchemy & Drapery (400 CE)
          </span>
          <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-[#e8dbff] flex items-center gap-2">
            <span>अन्तरीयम् & उत्तरीयम्</span>
            <span className="text-sm font-sans font-normal text-[#c4b5e0]">
              (Antarīya & Uttarīya) · Unstitched Royal Wardrobe
            </span>
          </h3>
        </div>

        <button
          onClick={() => sounds.speakWord('अन्तरीयम्', 'Antareeyam')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3d2a5c] hover:bg-[#4d3674] text-[#e8dbff] border border-[#6b4f9a] rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#caa641]" />
          <span>Pronounce Antarīya</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Illustrated Royal Drape Mannequin */}
        <div className="lg:col-span-7 bg-[#160d24] rounded-xl border border-[#48346b] p-4 flex flex-col items-center justify-center relative min-h-[340px] shadow-inner">
          {/* Mannequin SVG */}
          <div className={`relative transition-all duration-500 ${isOxidizing ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            <svg width="220" height="290" viewBox="0 0 200 280" className="drop-shadow-2xl">
              {/* Head Silhouette */}
              <circle cx="100" cy="35" r="18" fill="#584178" />
              {/* Neck */}
              <rect x="94" y="50" width="12" height="15" fill="#584178" />

              {/* Upper Shawl: Uttarīya */}
              {(drapeStyle === 'both' || drapeStyle === 'uttariya') && (
                <g className="transition-colors duration-500">
                  {/* Billowing shoulder drape */}
                  <path
                    d="M 60 65 Q 100 80 145 68 Q 155 125 130 160 Q 110 130 65 140 Z"
                    fill={currentDye.fabricHex}
                    stroke="#1a102b"
                    strokeWidth="2"
                  />
                  {/* Golden Zari Border on Shawl */}
                  {hasZariFoil && (
                    <path
                      d="M 60 65 Q 100 80 145 68"
                      fill="none"
                      stroke="#caa641"
                      strokeWidth="5"
                      strokeDasharray="4, 1"
                    />
                  )}
                </g>
              )}

              {/* Waist Sash (Kāyabandha) */}
              <rect x="68" y="130" width="64" height="10" rx="3" fill="#caa641" stroke="#3d2915" strokeWidth="1.5" />

              {/* Lower Wrap: Antarīya */}
              {(drapeStyle === 'both' || drapeStyle === 'antariya') && (
                <g className="transition-colors duration-500">
                  {/* Waterfall Pleats */}
                  <path
                    d="M 68 140 Q 60 210 50 250 L 150 250 Q 140 210 132 140 Z"
                    fill={currentDye.fabricHex}
                    stroke="#1a102b"
                    strokeWidth="2"
                  />
                  {/* Vertical pleat folds */}
                  <line x1="85" y1="140" x2="75" y2="250" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
                  <line x1="100" y1="140" x2="100" y2="250" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
                  <line x1="115" y1="140" x2="125" y2="250" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />

                  {/* Golden Zari Hemline */}
                  {hasZariFoil && (
                    <line
                      x1="50"
                      y1="248"
                      x2="150"
                      y2="248"
                      stroke="#caa641"
                      strokeWidth="6"
                      strokeDasharray="5, 2"
                    />
                  )}
                </g>
              )}
            </svg>
          </div>

          {/* Drape toggle buttons */}
          <div className="flex items-center gap-1.5 mt-2 bg-[#201435] p-1 rounded-lg border border-[#4d3674]">
            {(['both', 'antariya', 'uttariya'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setDrapeStyle(mode);
                  sounds.playClick();
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-all capitalize ${
                  drapeStyle === mode
                    ? 'bg-[#c59f3f] text-[#1c120c] font-bold'
                    : 'text-[#d6c7ee] hover:bg-[#2e1d4b]'
                }`}
              >
                {mode === 'both' ? 'Full Ensemble' : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Dye Pots & Zari Controls */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-[#191029] p-4 rounded-xl border border-[#48346b] flex flex-col gap-3">
            <span className="text-xs font-bold text-[#e8dbff]">Select Natural Dye Vat:</span>

            <div className="flex flex-col gap-2">
              {dyes.map((dye) => (
                <button
                  key={dye.id}
                  onClick={() => handleSelectDye(dye.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all flex items-start gap-2.5 ${
                    selectedDye === dye.id
                      ? 'bg-[#311f4d] border-[#caa641] text-white shadow-md'
                      : 'bg-[#150d22] border-[#392854] text-[#d6c7ee] hover:bg-[#25173d]'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white/50 shrink-0 mt-0.5 shadow-sm"
                    style={{ backgroundColor: dye.colorHex }}
                  />
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1">
                      <span>{dye.name}</span>
                      <span className="text-[10px] text-[#caa641]">({dye.sanskrit})</span>
                    </div>
                    <p className="text-[11px] text-[#bdaecf] leading-snug mt-0.5">
                      {dye.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Zari Gold Foil Toggle */}
            <div className="pt-2 border-t border-[#3c2a59] flex items-center justify-between">
              <span className="text-xs text-[#e8dbff] font-semibold">
                Spun Pure Gold Wire (Zari Border):
              </span>
              <button
                onClick={toggleZari}
                className={`px-3 py-1 text-xs font-bold rounded transition-all border ${
                  hasZariFoil
                    ? 'bg-[#c59f3f] text-[#1c120c] border-[#ffd978]'
                    : 'bg-[#25183d] text-[#b09ecb] border-[#443063]'
                }`}
              >
                {hasZariFoil ? '✦ Zari Embroidered' : 'Plain Selvage'}
              </button>
            </div>
          </div>

          {/* Children Observation Note */}
          <div className="bg-[#211438] p-3 rounded-xl border border-[#c59f3f]/30 text-xs">
            <div className="flex items-center gap-1.5 text-[#ffdca3] font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#caa641]" />
              <span>Maya's Archaeological Journal:</span>
            </div>
            <p className="font-comic text-[#e8daf7] leading-relaxed">
              "In classical India, cloth was unstitched because cutting fibers was believed to weaken their cosmic integrity! Instead, wearers mastered ingenious draping techniques with flowing pleats!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
