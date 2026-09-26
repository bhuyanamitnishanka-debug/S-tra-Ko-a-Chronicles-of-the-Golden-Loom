import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ChildrenScrollStage } from './components/ChildrenScrollStage';
import { GraphicNovelViewer } from './components/GraphicNovelViewer';
import { MuseumKioskView } from './components/MuseumKioskView';
import { HandloomShuttleSimulator } from './components/HandloomShuttleSimulator';
import { GlossaryExplorer } from './components/GlossaryExplorer';
import { ChildrenBackpackModal } from './components/ChildrenBackpackModal';
import { graphicNovelChapters } from './data/chaptersData';
import { Sparkles, BookOpen, Video, Monitor, Compass, BookA, Trophy } from 'lucide-react';
import { sounds } from './utils/soundEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState<'novel' | 'video' | 'kiosk' | 'glossary' | 'loom'>('novel');
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [unlockedRelics, setUnlockedRelics] = useState<string[]>([
    'relic_spindle', // Start with first relic unlocked for immediate delight
  ]);
  const [isBackpackOpen, setIsBackpackOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const chapters = graphicNovelChapters;
  const currentChapter = chapters[currentChapterIndex] || chapters[0];

  const handleUnlockRelic = (relicId: string) => {
    if (!unlockedRelics.includes(relicId)) {
      setUnlockedRelics((prev) => [...prev, relicId]);
      sounds.playChimeUnlock();
    }
  };

  const handleExploreChapter = (chapterId: number) => {
    const idx = chapters.findIndex((c) => c.id === chapterId);
    if (idx !== -1) {
      setCurrentChapterIndex(idx);
    }
    setActiveTab('novel');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#140c08] text-[#f5ebd9] flex flex-col font-sans-main selection:bg-[#c59f3f] selection:text-[#180f0a]">
      {/* Universal Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unlockedRelicsCount={unlockedRelics.length}
        totalRelicsCount={chapters.length}
        onOpenBackpack={() => setIsBackpackOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
        {/* Welcome Kicker Banner */}
        <section className="bg-gradient-to-r from-[#2a170e] via-[#331c11] to-[#25130b] border-2 border-[#543522] rounded-3xl p-5 sm:p-7 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#c59f3f]/10 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#caa641] uppercase">
                Interactive Archaeological Storybook
              </span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-4xl font-black text-[#fef5e7] tracking-tight leading-tight">
              Chronicles of the Golden Loom
            </h1>
            <p className="text-xs sm:text-sm text-[#dec3af] mt-2 leading-relaxed">
              Join school children <strong>Maya</strong>, <strong>Kabir</strong>, and <strong>Leo</strong> as they scroll an illuminated ancient graphic novel, time-traveling from Indus terracotta spindle whorls to the Silk Road trade route of Takṣaśilā University.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('novel');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'novel'
                    ? 'bg-[#bd593c] text-white shadow-md'
                    : 'bg-[#1b100a] text-[#dec3af] border border-[#482c1b] hover:bg-[#2c1a11]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-200" />
                <span>Read Graphic Novel</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('video');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'video'
                    ? 'bg-[#bd593c] text-white shadow-md'
                    : 'bg-[#1b100a] text-[#dec3af] border border-[#482c1b] hover:bg-[#2c1a11]'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-amber-200" />
                <span>Watch Animated Children Scroll</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('kiosk');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'kiosk'
                    ? 'bg-[#bd593c] text-white shadow-md'
                    : 'bg-[#1b100a] text-[#dec3af] border border-[#482c1b] hover:bg-[#2c1a11]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-amber-200" />
                <span>Museum Tablet Kiosk (3D Exhibit)</span>
              </button>
            </div>
          </div>

          {/* Children Hero Trio Card */}
          <div className="relative z-10 bg-[#1a0e08] border-2 border-[#caa641]/50 rounded-2xl p-4 shadow-lg flex flex-col items-center text-center shrink-0 w-full md:w-64">
            <div className="flex items-center justify-center gap-1 text-2xl mb-1">
              <span>👧🏽</span>
              <span>👦🏽</span>
              <span>🧑🏻</span>
            </div>
            <div className="font-cinzel text-sm font-bold text-[#ffd785]">
              Maya · Kabir · Leo
            </div>
            <p className="text-[11px] text-[#dec3af] mt-1 font-comic">
              "We unroll the scrolls, solve the loom puzzles, and decode Sanskrit glyphs!"
            </p>
            <div className="mt-2.5 w-full bg-[#27160d] py-1 px-2 rounded-lg border border-[#482b1b] flex items-center justify-between text-[11px] font-mono">
              <span className="text-amber-200">Relics Collected:</span>
              <span className="font-bold text-[#caa641]">
                {unlockedRelics.length} / {chapters.length}
              </span>
            </div>
          </div>
        </section>

        {/* Tab 1: GRAPHIC NOVEL CHAPTER VIEW */}
        {activeTab === 'novel' && (
          <div className="flex flex-col gap-8">
            {/* Embedded Children Scroll Video Stage at top of graphic novel */}
            <ChildrenScrollStage
              chapters={chapters}
              currentChapterIndex={currentChapterIndex}
              setCurrentChapterIndex={setCurrentChapterIndex}
              onExploreChapter={handleExploreChapter}
            />

            {/* Graphic Novel Reading Book */}
            <GraphicNovelViewer
              chapters={chapters}
              currentChapterId={currentChapter.id}
              onSelectChapter={(id) => {
                const idx = chapters.findIndex((c) => c.id === id);
                if (idx !== -1) setCurrentChapterIndex(idx);
              }}
              unlockedRelics={unlockedRelics}
              onUnlockRelic={handleUnlockRelic}
            />
          </div>
        )}

        {/* Tab 2: CHILDREN ANIMATED SCROLL VIDEO THEATER (Dedicated View) */}
        {activeTab === 'video' && (
          <div className="flex flex-col gap-6">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold tracking-widest text-[#caa641] uppercase">
                Animated Children Theater
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fcefd8] mt-1">
                Watch the School Children Scroll the Ancient Book
              </h2>
              <p className="text-xs sm:text-sm text-[#d8c0ad] mt-1.5">
                Play the animated video or drag the timeline slider. Maya pulls the scroll handles, Kabir dashes along the parchment, and Leo decodes Sanskrit glyphs with his scanner!
              </p>
            </div>

            <ChildrenScrollStage
              chapters={chapters}
              currentChapterIndex={currentChapterIndex}
              setCurrentChapterIndex={setCurrentChapterIndex}
              onExploreChapter={handleExploreChapter}
            />

            {/* Quick Jump to Chapter Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {chapters.map((chap, idx) => (
                <div
                  key={chap.id}
                  onClick={() => {
                    setCurrentChapterIndex(idx);
                    sounds.playParchmentScroll();
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    currentChapterIndex === idx
                      ? 'bg-[#2d1b11] border-[#caa641] shadow-lg scale-102'
                      : 'bg-[#1c110a] border-[#422818] hover:bg-[#281810]'
                  }`}
                >
                  <div className="text-2xl mb-1">{chap.relicReward.icon}</div>
                  <div className="text-[10px] font-mono text-[#caa641] font-bold">
                    Chapter {chap.id}
                  </div>
                  <h4 className="font-cinzel text-sm font-bold text-[#ffd785] truncate">
                    {chap.title.split(': ')[1]}
                  </h4>
                  <p className="text-xs text-[#d6bca8] mt-1 line-clamp-2">
                    {chap.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: MUSEUM TABLET KIOSK VIEW (Matching User Photo!) */}
        {activeTab === 'kiosk' && (
          <div className="flex flex-col gap-6">
            <MuseumKioskView onBackToNovel={() => setActiveTab('novel')} />
          </div>
        )}

        {/* Tab 4: INTERACTIVE LOOM WORKSHOP */}
        {activeTab === 'loom' && (
          <div className="flex flex-col gap-6">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold tracking-widest text-[#caa641] uppercase">
                Guild Crafts Workshop
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fcefd8] mt-1">
                The Sacred Handloom Simulator (वानम् - Vānam)
              </h2>
              <p className="text-xs sm:text-sm text-[#d8c0ad] mt-1.5">
                Pass the carved rosewood shuttle across taut warp threads, switch the heddle sheds, beat the reed comb, and weave royal ancient patterns!
              </p>
            </div>

            <HandloomShuttleSimulator
              onUnlockRelic={() => handleUnlockRelic('relic_shuttle')}
              isUnlocked={unlockedRelics.includes('relic_shuttle')}
            />
          </div>
        )}

        {/* Tab 5: SANSKRIT TEXTILE GLOSSARY */}
        {activeTab === 'glossary' && (
          <GlossaryExplorer onNavigateToChapter={handleExploreChapter} />
        )}
      </main>

      {/* Archaeological Backpack Modal */}
      <ChildrenBackpackModal
        isOpen={isBackpackOpen}
        onClose={() => setIsBackpackOpen(false)}
        chapters={chapters}
        unlockedRelics={unlockedRelics}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-[#3e271a] bg-[#120a06] py-6 px-4 sm:px-6 text-center text-xs text-[#a38774]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-cinzel text-sm font-bold text-[#ffd785]">
            Sūtra-Kośa: Chronicles of the Golden Loom
          </div>
          <div className="text-[11px] text-[#785d4d]">
            Archaeological records grounded in Mohenjo-daro excavations, Rigveda literature & Takṣaśilā Silk Guild manuscripts.
          </div>
          <div className="font-mono text-[11px] text-amber-300/80">
            Interactive Children Graphic Novel Edition
          </div>
        </div>
      </footer>
    </div>
  );
}
