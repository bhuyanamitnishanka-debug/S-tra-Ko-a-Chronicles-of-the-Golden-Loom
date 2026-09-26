import React, { useRef } from 'react';
import { Volume2, Sparkles, BookOpen, Compass, Trophy } from 'lucide-react';
import { Chapter } from '../types';
import { SpindleWhorl3D } from './SpindleWhorl3D';
import { HandloomShuttleSimulator } from './HandloomShuttleSimulator';
import { SilkTradeRouteMap } from './SilkTradeRouteMap';
import { DyeAlchemistStudio } from './DyeAlchemistStudio';
import { sounds } from '../utils/soundEffects';

interface GraphicNovelViewerProps {
  chapters: Chapter[];
  currentChapterId: number;
  onSelectChapter: (id: number) => void;
  unlockedRelics: string[];
  onUnlockRelic: (relicId: string) => void;
}

export const GraphicNovelViewer: React.FC<GraphicNovelViewerProps> = ({
  chapters,
  currentChapterId,
  onSelectChapter,
  unlockedRelics,
  onUnlockRelic,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentChapter = chapters.find((c) => c.id === currentChapterId) || chapters[0];

  const getCharacterBadge = (char: string) => {
    switch (char) {
      case 'maya':
        return { label: 'Maya', bg: 'bg-[#bd593c]', border: 'border-[#ea8567]' };
      case 'kabir':
        return { label: 'Kabir', bg: 'bg-[#d4962c]', border: 'border-[#ffd485]' };
      case 'leo':
        return { label: 'Leo', bg: 'bg-[#2d7d52]', border: 'border-[#71c899]' };
      case 'master_weaver':
        return { label: 'Ancient Master', bg: 'bg-[#5b3820]', border: 'border-[#caa641]' };
      default:
        return { label: 'Chronicle', bg: 'bg-[#3b2a20]', border: 'border-[#8f6d54]' };
    }
  };

  return (
    <div className="w-full flex flex-col gap-6" ref={containerRef}>
      {/* Chapter Selection Ribbon */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 p-1.5 bg-[#1f150e] rounded-xl border border-[#452b1b]">
        {chapters.map((chap) => {
          const isSelected = chap.id === currentChapterId;
          const isUnlocked = unlockedRelics.includes(chap.relicReward.id);
          return (
            <button
              key={chap.id}
              onClick={() => {
                sounds.playParchmentScroll();
                onSelectChapter(chap.id);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-gradient-to-r from-[#bd593c] to-[#9c3e24] text-white shadow-md font-bold ring-1 ring-amber-300/40'
                  : 'bg-[#291b12] text-[#d6c4b6] hover:bg-[#38251a]'
              }`}
            >
              <span className="text-lg">{chap.relicReward.icon}</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200">
                  Chapter {chap.id}
                </span>
                <span className="text-xs font-semibold max-w-[130px] truncate">
                  {chap.title.split(': ')[1] || chap.title}
                </span>
              </div>
              {isUnlocked && (
                <span className="text-[10px] text-amber-300 bg-black/40 px-1.5 py-0.5 rounded ml-1">
                  ✓ Found
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Chapter Book Frame */}
      <article className="rounded-3xl bg-[#1d130d] border-3 border-[#52331f] shadow-2xl overflow-hidden p-4 sm:p-8 relative">
        {/* Chapter Header Banner */}
        <header className="border-b-2 border-[#52331f] pb-5 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="text-xs font-mono font-bold tracking-widest text-[#caa641] uppercase">
              {currentChapter.era} · {currentChapter.location}
            </span>
            <div className="flex items-center gap-2 text-xs bg-[#2b190f] text-[#ffd699] px-3 py-1 rounded-full border border-[#caa641]/30">
              <Trophy className="w-3.5 h-3.5 text-[#caa641]" />
              <span>Chapter Relic: {currentChapter.relicReward.name}</span>
            </div>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl font-black text-[#fdefd4] tracking-tight leading-tight">
            {currentChapter.title}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#d8c0ad] mt-1.5 max-w-3xl leading-relaxed">
            {currentChapter.summary}
          </p>
        </header>

        {/* Comic Story Panels */}
        <div className="flex flex-col gap-8">
          {currentChapter.panels.map((panel, pIdx) => (
            <section
              key={panel.id}
              className="bg-[#271911] rounded-2xl border-2 border-[#5a3922] p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col gap-4"
            >
              {/* Halftone texture */}
              <div className="absolute inset-0 comic-halftone opacity-10 pointer-events-none" />

              {/* Panel Top Line */}
              <div className="flex items-center justify-between relative z-10 border-b border-[#452b1b] pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase bg-[#180f0a] text-[#caa641] px-2 py-0.5 rounded font-bold border border-[#caa641]/30">
                    Panel {pIdx + 1}: {panel.kicker}
                  </span>
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#f7ecd6]">
                    {panel.title}
                  </h3>
                </div>

                {panel.soundEffect && (
                  <div className="font-comic text-xs sm:text-sm font-black text-amber-300 bg-[#8a2218] px-2 py-0.5 rounded-full border border-amber-400/50 shadow-md rotate-2 transform">
                    {panel.soundEffect}
                  </div>
                )}
              </div>

              {/* Scene Narrative Prose */}
              <p className="font-sans text-xs sm:text-sm text-[#e4d1c1] italic leading-relaxed relative z-10 pl-3 border-l-2 border-[#bd593c]">
                {panel.sceneDescription}
              </p>

              {/* Character Speech Bubbles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10 my-1">
                {panel.dialogues.map((dlg, dIdx) => {
                  const badge = getCharacterBadge(dlg.character);
                  return (
                    <div
                      key={dIdx}
                      className="bg-[#fefaf4] text-[#1c120c] p-3 rounded-xl shadow-md border-2 border-[#bd593c] flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase text-white px-2 py-0.5 rounded shadow-xs ${badge.bg}`}
                        >
                          {dlg.characterName}
                        </span>
                        {dlg.emotion && (
                          <span className="text-[10px] font-mono text-[#784f33] italic capitalize">
                            ✦ {dlg.emotion}
                          </span>
                        )}
                      </div>
                      <p className="font-comic text-xs sm:text-sm font-semibold text-[#29170e] leading-snug">
                        "{dlg.text}"
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Sanskrit Archaeological Word Spotlight */}
              {panel.sanskritSpotlight && (
                <div className="relative z-10 bg-[#190f09] p-3 rounded-xl border border-[#c59f3f]/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#bd593c] text-white flex items-center justify-center font-cinzel text-xl font-bold shadow-md">
                      सू
                    </div>
                    <div>
                      <div className="font-cinzel text-base font-bold text-[#ffd782] flex items-center gap-2">
                        <span>{panel.sanskritSpotlight.word}</span>
                        <span className="text-xs font-sans text-[#dec8b4]">
                          ({panel.sanskritSpotlight.translit})
                        </span>
                      </div>
                      <div className="text-xs text-[#d6bca4]">
                        {panel.sanskritSpotlight.meaning}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (panel.sanskritSpotlight) {
                        sounds.speakWord(
                          panel.sanskritSpotlight.word,
                          panel.sanskritSpotlight.translit
                        );
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3b2213] hover:bg-[#4a2c19] text-[#ffd782] border border-[#c59f3f]/50 text-xs font-bold transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#caa641]" />
                    <span>Pronounce</span>
                  </button>
                </div>
              )}

              {/* Embedded Interactive Illustration (When active on panel) */}
              {panel.interactiveType === 'spindle_whorl' && (
                <div className="relative z-10 mt-2">
                  <SpindleWhorl3D
                    onUnlockRelic={() => onUnlockRelic(currentChapter.relicReward.id)}
                    isUnlocked={unlockedRelics.includes(currentChapter.relicReward.id)}
                  />
                </div>
              )}

              {panel.interactiveType === 'loom_shuttle' && (
                <div className="relative z-10 mt-2">
                  <HandloomShuttleSimulator
                    onUnlockRelic={() => onUnlockRelic(currentChapter.relicReward.id)}
                    isUnlocked={unlockedRelics.includes(currentChapter.relicReward.id)}
                  />
                </div>
              )}

              {panel.interactiveType === 'silk_map' && (
                <div className="relative z-10 mt-2">
                  <SilkTradeRouteMap
                    onUnlockRelic={() => onUnlockRelic(currentChapter.relicReward.id)}
                    isUnlocked={unlockedRelics.includes(currentChapter.relicReward.id)}
                  />
                </div>
              )}

              {panel.interactiveType === 'dye_alchemist' && (
                <div className="relative z-10 mt-2">
                  <DyeAlchemistStudio
                    onUnlockRelic={() => onUnlockRelic(currentChapter.relicReward.id)}
                    isUnlocked={unlockedRelics.includes(currentChapter.relicReward.id)}
                  />
                </div>
              )}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
};
