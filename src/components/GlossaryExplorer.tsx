import React, { useState, useMemo } from 'react';
import { Search, Volume2, BookOpen, Filter, Sparkles, Compass } from 'lucide-react';
import { glossaryDatabase } from '../data/glossaryData';
import { GlossaryTerm } from '../types';
import { sounds } from '../utils/soundEffects';

interface GlossaryExplorerProps {
  onNavigateToChapter: (chapterId: number) => void;
}

export const GlossaryExplorer: React.FC<GlossaryExplorerProps> = ({ onNavigateToChapter }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Terms (समस्त)' },
    { id: 'Material', label: 'Raw Fibers (सामग्री)' },
    { id: 'Process', label: 'Manufacturing (प्रक्रिया)' },
    { id: 'Garment', label: 'Apparel (वस्त्र)' },
    { id: 'Trade', label: 'Caravan Trade (व्यापार)' },
  ];

  const filteredTerms = useMemo(() => {
    return glossaryDatabase.filter((term) => {
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        term.word.toLowerCase().includes(q) ||
        term.translit.toLowerCase().includes(q) ||
        term.english.toLowerCase().includes(q) ||
        term.definition.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handlePronounce = (term: GlossaryTerm) => {
    sounds.speakWord(term.word, term.translit);
    sounds.playSpindleWhirr(1.2);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Deck */}
      <div className="rounded-3xl bg-[#1d130d] border-2 border-[#52331f] p-4 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <span className="text-xs font-mono font-bold tracking-widest text-[#caa641] uppercase">
            Sūtra-Kośa Comprehensive Lexicon
          </span>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#fcefd8] mt-1">
            सूत्रकोश · Sanskrit Textile & Craft Lexicon
          </h2>
          <p className="text-xs sm:text-sm text-[#d8c0ad] mt-2 leading-relaxed">
            Explore the historical vocabulary of ancient Indian spinning, weaving guilds, wild tussar silks, and trans-continental textile trade from Harappa (2500 BCE) to the Classical Golden Age.
          </p>
        </div>

        {/* Controls: Search & Category Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#caa641]" />
            <input
              type="text"
              placeholder="Search Sanskrit word, transliteration, or meaning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#140c08] border border-[#482e1d] rounded-xl text-xs sm:text-sm text-[#f5ebd9] placeholder-[#806450] focus:outline-none focus:border-[#caa641] transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  sounds.playClick();
                }}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap border ${
                  selectedCategory === cat.id
                    ? 'bg-[#bd593c] border-[#ff8d6e] text-white shadow-md'
                    : 'bg-[#180e09] border-[#3e2617] text-[#c9b2a0] hover:bg-[#281810]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            className="bg-[#241710] rounded-2xl border-2 border-[#52331f] p-4 sm:p-5 shadow-lg flex flex-col justify-between hover:border-[#caa641]/60 transition-all hover:-translate-y-1 group"
          >
            <div>
              {/* Category & Pronounce Action */}
              <div className="flex items-center justify-between gap-2 border-b border-[#3e2516] pb-2 mb-3">
                <span className="text-[10px] font-mono uppercase bg-[#180f0a] text-[#caa641] px-2 py-0.5 rounded font-bold border border-[#caa641]/20">
                  {term.categoryLabel}
                </span>

                <button
                  onClick={() => handlePronounce(term)}
                  className="flex items-center gap-1 text-[11px] text-amber-200 bg-[#3d2214] hover:bg-[#522d1b] px-2 py-1 rounded-md transition-colors"
                  title="Pronounce Sanskrit Term"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#caa641]" />
                  <span>Pronounce</span>
                </button>
              </div>

              {/* Sanskrit Word & Meaning */}
              <h3 className="font-cinzel text-2xl font-bold text-[#ffd785] group-hover:text-amber-200 transition-colors">
                {term.word}
              </h3>
              <div className="font-cinzel text-sm font-semibold text-[#caa641] mt-0.5">
                {term.translit}
              </div>
              <div className="text-xs font-semibold text-[#f5ebd9] mt-0.5">
                {term.english}
              </div>

              <p className="text-xs text-[#d6bca8] leading-relaxed mt-2.5">
                {term.definition}
              </p>
            </div>

            {/* Excavation and Literature Callout */}
            <div className="mt-4 pt-3 border-t border-[#3e2516] flex flex-col gap-2">
              <div className="bg-[#180e08] p-2.5 rounded-lg border border-[#3c2213] text-[11px]">
                <span className="text-[10px] font-mono text-[#caa641] font-bold block mb-0.5">
                  Excavation Insight:
                </span>
                <p className="text-[#c9b19e] italic leading-snug">
                  {term.excavationFact}
                </p>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigateToChapter(term.linkedChapter);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#321c10] hover:bg-[#452818] text-[#ffd699] text-xs font-bold transition-colors border border-[#52331f]"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>See In Chapter {term.linkedChapter} Story</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
