import React from 'react';
import { Volume2, VolumeX, Backpack, Sparkles, BookOpen, Video, Monitor, Compass, BookA } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  activeTab: 'novel' | 'video' | 'kiosk' | 'glossary' | 'loom';
  setActiveTab: (tab: 'novel' | 'video' | 'kiosk' | 'glossary' | 'loom') => void;
  unlockedRelicsCount: number;
  totalRelicsCount: number;
  onOpenBackpack: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unlockedRelicsCount,
  totalRelicsCount,
  onOpenBackpack,
  soundEnabled,
  setSoundEnabled,
}) => {
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.setSoundEnabled(newState);
    if (newState) {
      sounds.playClick();
    }
  };

  const handleNavClick = (tab: 'novel' | 'video' | 'kiosk' | 'glossary' | 'loom') => {
    sounds.playClick();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#17100b]/95 backdrop-blur-md border-b border-[#3d2920] shadow-xl">
      {/* Zone 1: Single-element brand wordmark */}
      <button
        onClick={() => handleNavClick('novel')}
        className="flex items-center gap-2.5 text-left group focus:outline-none"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c59f3f] to-[#bd593c] flex items-center justify-center shadow-md shadow-[#bd593c]/20 group-hover:scale-105 transition-transform">
          <span className="font-cinzel text-base font-black text-[#1a120c]">सू</span>
        </div>
        <div className="flex flex-col">
          <span className="font-cinzel text-base sm:text-lg font-bold tracking-tight text-[#f5ebd9] group-hover:text-[#c59f3f] transition-colors leading-tight">
            Sūtra-Kośa
          </span>
          <span className="text-[10px] text-[#c59f3f]/80 font-mono tracking-widest uppercase">
            Chronicles of the Golden Loom
          </span>
        </div>
      </button>

      {/* Zone 2: Navigation Links (single line, functional segmented control) */}
      <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-[#221711] rounded-xl border border-[#3d2920]">
        <button
          onClick={() => handleNavClick('novel')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'novel'
              ? 'bg-[#c59f3f] text-[#1a110a] shadow-sm font-bold'
              : 'text-[#d8c5b6] hover:text-white hover:bg-[#2d1e16]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Graphic Novel</span>
        </button>

        <button
          onClick={() => handleNavClick('video')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'video'
              ? 'bg-[#bd593c] text-white shadow-sm font-bold'
              : 'text-[#d8c5b6] hover:text-white hover:bg-[#2d1e16]'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Children Scroll Video</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </button>

        <button
          onClick={() => handleNavClick('kiosk')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'kiosk'
              ? 'bg-[#c59f3f] text-[#1a110a] shadow-sm font-bold'
              : 'text-[#d8c5b6] hover:text-white hover:bg-[#2d1e16]'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Museum Tablet Kiosk</span>
        </button>

        <button
          onClick={() => handleNavClick('loom')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'loom'
              ? 'bg-[#c59f3f] text-[#1a110a] shadow-sm font-bold'
              : 'text-[#d8c5b6] hover:text-white hover:bg-[#2d1e16]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Loom</span>
        </button>

        <button
          onClick={() => handleNavClick('glossary')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'glossary'
              ? 'bg-[#c59f3f] text-[#1a110a] shadow-sm font-bold'
              : 'text-[#d8c5b6] hover:text-white hover:bg-[#2d1e16]'
          }`}
        >
          <BookA className="w-3.5 h-3.5" />
          <span>Sanskrit Glossary</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          className={`p-2 rounded-lg border transition-all text-xs flex items-center justify-center ${
            soundEnabled
              ? 'bg-[#261b14] border-[#c59f3f]/50 text-[#c59f3f] hover:bg-[#34241b]'
              : 'bg-[#1b120c] border-[#3d2920] text-stone-500 hover:text-stone-300'
          }`}
          aria-label={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Archaeological Backpack button */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenBackpack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#bd593c] to-[#9b3e24] hover:from-[#c86345] hover:to-[#ae472a] text-white border border-[#f08c6d]/30 shadow-md text-xs font-semibold transition-all hover:scale-102 active:scale-98 whitespace-nowrap"
        >
          <Backpack className="w-4 h-4 text-amber-200" />
          <span className="hidden sm:inline">Backpack</span>
          <span className="bg-black/30 px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums text-amber-200 font-bold">
            {unlockedRelicsCount}/{totalRelicsCount}
          </span>
        </button>
      </div>
    </header>
  );
};
