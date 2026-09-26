import React from 'react';
import { X, Trophy, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { Chapter } from '../types';
import { sounds } from '../utils/soundEffects';

interface ChildrenBackpackModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  unlockedRelics: string[];
}

export const ChildrenBackpackModal: React.FC<ChildrenBackpackModalProps> = ({
  isOpen,
  onClose,
  chapters,
  unlockedRelics,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-gradient-to-b from-[#241710] to-[#170e09] border-2 border-[#caa641] rounded-3xl p-5 sm:p-7 shadow-2xl relative text-[#f5ebd9]">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#3d2516] hover:bg-[#52331f] flex items-center justify-center text-[#dec0ac] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#4d3220] pb-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#bd593c] to-[#802a14] border border-[#f08567]/40 flex items-center justify-center text-2xl shadow-lg">
            🎒
          </div>
          <div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#ffd785]">
              Archaeological Field Backpack
            </h3>
            <p className="text-xs text-[#d6bca8]">
              Maya, Kabir, and Leo's collected ancient craft relics
            </p>
          </div>
        </div>

        {/* Relic List */}
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {chapters.map((chap) => {
            const isUnlocked = unlockedRelics.includes(chap.relicReward.id);
            return (
              <div
                key={chap.id}
                className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-[#2d1d13] border-[#caa641]/60 shadow-md'
                    : 'bg-[#180f0a] border-[#382315] opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                    isUnlocked
                      ? 'bg-[#3b2416] border-[#caa641] text-amber-200 shadow'
                      : 'bg-[#120a06] border-[#29170d] text-stone-600'
                  }`}
                >
                  {isUnlocked ? chap.relicReward.icon : <Lock className="w-5 h-5 text-stone-600" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase text-[#caa641] font-bold">
                      Chapter {chap.id} Discovery
                    </span>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Collected</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-stone-500">Locked</span>
                    )}
                  </div>

                  <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#ffd785] mt-0.5">
                    {chap.relicReward.name}
                  </h4>
                  <p className="text-xs text-[#d6bca8] leading-relaxed mt-1">
                    {chap.relicReward.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Footer */}
        <div className="mt-5 pt-4 border-t border-[#4d3220] flex items-center justify-between text-xs font-mono">
          <span className="text-[#caa641]">
            Relics Discovered: {unlockedRelics.length} of {chapters.length}
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#bd593c] hover:bg-[#a3442a] text-white font-bold rounded-lg shadow transition-colors"
          >
            Keep Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
