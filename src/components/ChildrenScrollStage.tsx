import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Volume2, Sparkles, Compass, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { Chapter } from '../types';
import { sounds } from '../utils/soundEffects';

interface ChildrenScrollStageProps {
  chapters: Chapter[];
  currentChapterIndex: number;
  setCurrentChapterIndex: React.Dispatch<React.SetStateAction<number>>;
  onExploreChapter: (chapterId: number) => void;
}

export const ChildrenScrollStage: React.FC<ChildrenScrollStageProps> = ({
  chapters,
  currentChapterIndex,
  setCurrentChapterIndex,
  onExploreChapter,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0); // 0 to 100
  const [speechBubble, setSpeechBubble] = useState<{ char: string; text: string } | null>({
    char: 'Maya',
    text: 'Look at the giant ancient scroll! Pull together, everyone!'
  });
  const [activeChildReaction, setActiveChildReaction] = useState<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentChapter = chapters[currentChapterIndex] || chapters[0];

  // Video playback loop
  useEffect(() => {
    let lastTime = performance.now();
    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlaying) {
        setScrollProgress((prev) => {
          const next = prev + delta * 12 * playbackSpeed;
          if (next >= 100) {
            // Advance to next chapter
            setCurrentChapterIndex((prevIdx) => (prevIdx + 1) % chapters.length);
            sounds.playChimeUnlock();
            return 0;
          }
          return next;
        });
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, chapters.length, setCurrentChapterIndex]);

  // Update speech bubble based on scroll progress and chapter
  useEffect(() => {
    if (scrollProgress < 25) {
      setSpeechBubble({
        char: 'Maya',
        text: `Unrolling ${currentChapter.title}! Keep the tension even!`
      });
    } else if (scrollProgress < 60) {
      setSpeechBubble({
        char: 'Kabir',
        text: `Look at the glowing symbols! The ancient spindle is starting to spin!`
      });
    } else if (scrollProgress < 85) {
      setSpeechBubble({
        char: 'Leo',
        text: `My scanner locked on: ${currentChapter.panels[0]?.sanskritSpotlight?.word || 'सूत्रम्'}!`
      });
    } else {
      setSpeechBubble({
        char: 'Maya',
        text: `We reached the relic checkpoint! Tap Explore to interact!`
      });
    }
  }, [scrollProgress, currentChapter]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    sounds.playClick();
    if (nextState) {
      sounds.playParchmentScroll();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setScrollProgress(val);
    sounds.playParchmentScroll();
  };

  const handleNextChapter = () => {
    sounds.playParchmentScroll();
    setCurrentChapterIndex((currentChapterIndex + 1) % chapters.length);
    setScrollProgress(0);
  };

  const handlePrevChapter = () => {
    sounds.playParchmentScroll();
    setCurrentChapterIndex((currentChapterIndex - 1 + chapters.length) % chapters.length);
    setScrollProgress(0);
  };

  const handleChildClick = (child: 'maya' | 'kabir' | 'leo') => {
    sounds.playClick();
    setActiveChildReaction(child);
    setTimeout(() => setActiveChildReaction(null), 1800);

    if (child === 'maya') {
      sounds.speakWord('माया अन्वेषयति', 'Maya discovers');
      setSpeechBubble({
        char: 'Maya',
        text: 'I found an ancient seal mark! Rigvedic hymns describe thread as cosmic cords!'
      });
    } else if (child === 'kabir') {
      sounds.playSpindleWhirr(2);
      setSpeechBubble({
        char: 'Kabir',
        text: 'Whooo! Running along this scroll makes the whole world spin backward!'
      });
    } else {
      sounds.playChimeUnlock();
      setSpeechBubble({
        char: 'Leo',
        text: 'Decrypted! Harappan cotton thread is Gossypium arboreum, short-staple magic!'
      });
    }
  };

  // Calculate dynamic character positions based on scrollProgress
  const kabirOffset = Math.sin((scrollProgress / 10) * Math.PI) * 8;
  const scrollRotation = (scrollProgress * 3.6) % 360;

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-[#1e140e] via-[#241710] to-[#1a110a] border-2 border-[#543828] shadow-2xl p-4 sm:p-6 overflow-hidden relative">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#3e271a] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <h2 className="font-cinzel text-base sm:text-xl font-bold text-[#f5ecd8] tracking-wide">
            Children Animated Scroll Theater
          </h2>
          <span className="text-xs bg-[#3b271b] text-[#c59f3f] px-2 py-0.5 rounded font-mono font-semibold border border-[#523725]">
            Chapter {currentChapter.id} of {chapters.length}
          </span>
        </div>

        {/* Playback speed selector */}
        <div className="flex items-center gap-1.5 bg-[#17100b] p-1 rounded-lg border border-[#3e271a]">
          {[1, 1.5, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => {
                setPlaybackSpeed(spd);
                sounds.playClick();
              }}
              className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                playbackSpeed === spd
                  ? 'bg-[#c59f3f] text-[#1a110b]'
                  : 'text-[#9c8270] hover:text-[#e5d5c5]'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Animated Canvas Viewport */}
      <div className="relative w-full h-[360px] sm:h-[440px] rounded-xl bg-gradient-to-b from-[#0e0a07] via-[#1a120c] to-[#251810] border-2 border-[#4a2e1d] overflow-hidden flex flex-col justify-between p-4 shadow-inner">
        {/* Background Stars & Sanskrit Constellations */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-6 left-12 text-amber-200 font-cinzel text-3xl font-black opacity-30 select-none">
            तन्तु
          </div>
          <div className="absolute top-16 right-20 text-amber-200 font-cinzel text-4xl font-black opacity-30 select-none">
            सूत्रम्
          </div>
          <div className="absolute bottom-20 left-1/3 text-amber-200 font-cinzel text-3xl font-black opacity-30 select-none">
            वानम्
          </div>
          <div className="absolute top-1/2 right-12 text-amber-200 font-cinzel text-3xl font-black opacity-30 select-none">
            कौशेय
          </div>
        </div>

        {/* Top Floating Speech Bubble */}
        <div className="relative z-20 flex justify-center">
          {speechBubble && (
            <div className="relative bg-[#fcf8f0] text-[#1c120c] px-4 py-2 rounded-xl shadow-lg border-2 border-[#bd593c] max-w-lg transition-all animate-bounce-subtle">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase px-1.5 py-0.5 rounded bg-[#bd593c] text-white tracking-wider">
                  {speechBubble.char}
                </span>
                <p className="font-comic text-sm sm:text-base font-semibold text-[#2b180f] leading-snug">
                  "{speechBubble.text}"
                </p>
              </div>
              <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#bd593c]" />
            </div>
          )}
        </div>

        {/* Central Illustrated Scroll & Animated Children */}
        <div className="relative flex-1 flex items-center justify-center my-2">
          {/* Left Spindle Roller (Animated turning rod) */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Maya Character standing on the top left roller */}
            <div
              onClick={() => handleChildClick('maya')}
              className={`cursor-pointer transition-transform duration-300 -mb-2 ${
                activeChildReaction === 'maya' ? 'scale-125 -translate-y-2' : 'hover:scale-110'
              }`}
              title="Click Maya to interact!"
            >
              <div className="relative flex flex-col items-center">
                {/* Maya SVG Illustration */}
                <svg width="68" height="85" viewBox="0 0 100 120" className="drop-shadow-lg">
                  {/* Magnifying Glass with glow */}
                  <circle cx="78" cy="45" r="14" fill="rgba(197, 159, 63, 0.3)" stroke="#c59f3f" strokeWidth="3" />
                  <line x1="68" y1="55" x2="52" y2="70" stroke="#784528" strokeWidth="4" strokeLinecap="round" />
                  {/* Hair */}
                  <circle cx="50" cy="30" r="22" fill="#2d1a0e" />
                  <path d="M 32 32 Q 22 55 18 65 Q 28 65 35 45 Z" fill="#2d1a0e" />
                  {/* Head */}
                  <circle cx="50" cy="34" r="16" fill="#f8d5b8" />
                  {/* Glasses */}
                  <circle cx="44" cy="34" r="5" fill="none" stroke="#bd593c" strokeWidth="2.5" />
                  <circle cx="56" cy="34" r="5" fill="none" stroke="#bd593c" strokeWidth="2.5" />
                  <line x1="49" y1="34" x2="51" y2="34" stroke="#bd593c" strokeWidth="2.5" />
                  {/* Eyes & Smile */}
                  <circle cx="44" cy="34" r="1.5" fill="#1c120c" />
                  <circle cx="56" cy="34" r="1.5" fill="#1c120c" />
                  <path d="M 46 41 Q 50 44 54 41" fill="none" stroke="#1c120c" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Red School Vest */}
                  <path d="M 36 50 L 64 50 L 68 85 L 32 85 Z" fill="#bd593c" />
                  <rect x="42" y="50" width="16" height="35" fill="#f8f4ec" />
                  <polygon points="50,56 46,72 50,75 54,72" fill="#c59f3f" />
                  {/* Arms pulling rope */}
                  <path
                    d={`M 36 55 Q 25 ${65 + Math.sin(scrollProgress) * 4} 15 ${68 + Math.cos(scrollProgress) * 4}`}
                    fill="none"
                    stroke="#f8d5b8"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path d="M 64 55 Q 70 60 76 66" fill="none" stroke="#f8d5b8" strokeWidth="6" strokeLinecap="round" />
                  {/* Legs */}
                  <line x1="42" y1="85" x2="40" y2="108" stroke="#1c2438" strokeWidth="7" strokeLinecap="round" />
                  <line x1="58" y1="85" x2="60" y2="108" stroke="#1c2438" strokeWidth="7" strokeLinecap="round" />
                  {/* Shoes */}
                  <ellipse cx="38" cy="110" rx="6" ry="3.5" fill="#8a2218" />
                  <ellipse cx="62" cy="110" rx="6" ry="3.5" fill="#8a2218" />
                </svg>
                <span className="text-[10px] font-bold text-amber-300 bg-black/60 px-1.5 py-0.2 rounded mt-0.5 border border-amber-500/30">
                  Maya (Guide)
                </span>
              </div>
            </div>

            {/* Left Roller Cylinder */}
            <div className="w-9 sm:w-12 h-44 sm:h-56 rounded-full bg-gradient-to-r from-[#593922] via-[#caa641] to-[#3a2212] border-2 border-[#ffd778] shadow-2xl flex flex-col items-center justify-between py-2 relative">
              <div
                className="w-full h-full flex flex-col justify-around items-center"
                style={{ transform: `rotate(${scrollRotation}deg)` }}
              >
                <div className="w-full h-1 bg-[#1a0f08]/50" />
                <div className="w-full h-1 bg-[#1a0f08]/50" />
                <div className="w-full h-1 bg-[#1a0f08]/50" />
                <div className="w-full h-1 bg-[#1a0f08]/50" />
              </div>
              <div className="absolute -top-3 w-7 h-7 rounded-full bg-[#caa641] border border-[#ffebaa] shadow-md flex items-center justify-center text-xs font-bold text-[#321e0b]">
                ✦
              </div>
              <div className="absolute -bottom-3 w-7 h-7 rounded-full bg-[#caa641] border border-[#ffebaa] shadow-md flex items-center justify-center text-xs font-bold text-[#321e0b]">
                ✦
              </div>
            </div>
          </div>

          {/* Central Ancient Parchment Canvas */}
          <div className="flex-1 max-w-2xl h-44 sm:h-56 mx-1 sm:mx-2 bg-gradient-to-r from-[#edd8be] via-[#fff9ef] to-[#ebd4b8] rounded-md border-y-4 border-[#8c5e3a] shadow-2xl relative overflow-hidden flex flex-col justify-between p-3 sm:p-4">
            {/* Parchment texture overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none comic-halftone" />

            {/* Continuous dynamic scroll lines */}
            <div
              className="absolute inset-0 flex items-center justify-around opacity-25 pointer-events-none"
              style={{ transform: `translateX(${-scrollProgress * 2}% )` }}
            >
              <div className="text-6xl font-cinzel font-black text-[#5a3820]">ऋग्वेद</div>
              <div className="text-6xl font-cinzel font-black text-[#5a3820]">तक्षशिला</div>
              <div className="text-6xl font-cinzel font-black text-[#5a3820]">हरप्पा</div>
              <div className="text-6xl font-cinzel font-black text-[#5a3820]">सुवर्ण</div>
            </div>

            {/* Scroll Content Preview Box */}
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#8a3e26] font-bold">
                    {currentChapter.era}
                  </span>
                  <h3 className="font-cinzel text-base sm:text-2xl font-black text-[#2e190f] leading-tight">
                    {currentChapter.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#65432b] line-clamp-1">
                    {currentChapter.subtitle}
                  </p>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-2xl">{currentChapter.relicReward.icon}</span>
                  <div className="text-[10px] font-mono text-[#8a3e26] font-bold">
                    {currentChapter.relicReward.name}
                  </div>
                </div>
              </div>

              {/* Kabir running in center of scroll */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  onClick={() => handleChildClick('kabir')}
                  className={`pointer-events-auto cursor-pointer transition-transform duration-200 ${
                    activeChildReaction === 'kabir' ? 'scale-125 -translate-y-3' : 'hover:scale-110'
                  }`}
                  style={{
                    transform: `translateY(${kabirOffset}px)`
                  }}
                  title="Click Kabir to interact!"
                >
                  <div className="flex flex-col items-center">
                    {/* Kabir SVG Illustration */}
                    <svg width="65" height="85" viewBox="0 0 100 120" className="drop-shadow-lg">
                      {/* Spiky Black Hair */}
                      <path d="M 28 35 Q 35 15 50 18 Q 65 14 72 35 Q 68 45 60 45 L 35 45 Z" fill="#1b120c" />
                      {/* Head */}
                      <circle cx="50" cy="38" r="16" fill="#eec29a" />
                      {/* Eyes with excitement */}
                      <ellipse cx="44" cy="36" rx="2.5" ry="3.5" fill="#1c120c" />
                      <ellipse cx="56" cy="36" rx="2.5" ry="3.5" fill="#1c120c" />
                      <circle cx="45" cy="35" r="1" fill="#ffffff" />
                      <circle cx="57" cy="35" r="1" fill="#ffffff" />
                      {/* Big laughing mouth */}
                      <path d="M 44 44 Q 50 52 56 44 Z" fill="#8a2218" />
                      {/* Yellow School Hoodie */}
                      <path d="M 32 54 L 68 54 L 72 88 L 28 88 Z" fill="#e5a93c" />
                      <polygon points="50,54 44,70 56,70" fill="#2d1e13" />
                      {/* Running Arms */}
                      <path
                        d={`M 32 58 Q ${20 + kabirOffset} 70 ${12 - kabirOffset} 65`}
                        fill="none"
                        stroke="#eec29a"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <path
                        d={`M 68 58 Q ${80 - kabirOffset} 68 ${88 + kabirOffset} 60`}
                        fill="none"
                        stroke="#eec29a"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      {/* Running Blue Jeans legs */}
                      <line
                        x1="38"
                        y1="88"
                        x2={30 + kabirOffset * 1.5}
                        y2="110"
                        stroke="#22395d"
                        strokeWidth="7"
                        strokeLinecap="round"
                      />
                      <line
                        x1="62"
                        y1="88"
                        x2={70 - kabirOffset * 1.5}
                        y2="110"
                        stroke="#22395d"
                        strokeWidth="7"
                        strokeLinecap="round"
                      />
                      {/* Sneakers */}
                      <ellipse cx={28 + kabirOffset * 1.5} cy="112" rx="7" ry="4" fill="#ffffff" stroke="#c0392b" strokeWidth="2" />
                      <ellipse cx={72 - kabirOffset * 1.5} cy="112" rx="7" ry="4" fill="#ffffff" stroke="#c0392b" strokeWidth="2" />
                    </svg>
                    <span className="text-[10px] font-bold text-amber-950 bg-amber-400/80 px-1.5 py-0.2 rounded font-mono shadow-sm">
                      Kabir (Scroller)
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress & Chapter Relic Callout */}
              <div className="flex items-center justify-between pt-2 border-t border-[#8c5e3a]/30">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#8a3e26]">
                    Chapter Progress:
                  </span>
                  <span className="font-mono text-xs font-bold text-[#2e190f]">
                    {Math.round(scrollProgress)}%
                  </span>
                </div>

                <button
                  onClick={() => onExploreChapter(currentChapter.id)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#bd593c] hover:bg-[#a3442a] text-white text-xs font-bold rounded shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Dive Into Chapter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Spindle Roller */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Leo Character standing on bottom right roller */}
            <div
              onClick={() => handleChildClick('leo')}
              className={`cursor-pointer transition-transform duration-300 -mb-2 ${
                activeChildReaction === 'leo' ? 'scale-125 -translate-y-2' : 'hover:scale-110'
              }`}
              title="Click Leo to interact!"
            >
              <div className="relative flex flex-col items-center">
                {/* Leo SVG Illustration with glowing tablet */}
                <svg width="68" height="85" viewBox="0 0 100 120" className="drop-shadow-lg">
                  {/* Hair with cap */}
                  <circle cx="50" cy="32" r="18" fill="#2d3748" />
                  <path d="M 32 30 Q 50 16 68 30 Z" fill="#3182ce" />
                  <path d="M 60 28 L 82 25 L 80 32 Z" fill="#3182ce" />
                  {/* Head */}
                  <circle cx="50" cy="36" r="15" fill="#fbd38d" />
                  {/* Eyes */}
                  <circle cx="45" cy="35" r="2" fill="#1a202c" />
                  <circle cx="55" cy="35" r="2" fill="#1a202c" />
                  <path d="M 47 43 Q 50 45 53 43" fill="none" stroke="#1a202c" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Green jacket */}
                  <path d="M 34 52 L 66 52 L 70 86 L 30 86 Z" fill="#2f855a" />
                  <line x1="50" y1="52" x2="50" y2="86" stroke="#e2e8f0" strokeWidth="2" />
                  {/* Arms holding tablet */}
                  {/* Glowing Tablet */}
                  <rect x="36" y="58" width="28" height="20" rx="3" fill="#1a202c" stroke="#4fd1c5" strokeWidth="2" />
                  <rect x="39" y="61" width="22" height="14" rx="2" fill="#234e52" />
                  <circle cx="50" cy="68" r="3" fill="#81e6d9" className="animate-ping" />
                  {/* Hands */}
                  <circle cx="35" cy="68" r="4" fill="#fbd38d" />
                  <circle cx="65" cy="68" r="4" fill="#fbd38d" />
                  {/* Pants */}
                  <line x1="42" y1="86" x2="42" y2="108" stroke="#4a5568" strokeWidth="7" strokeLinecap="round" />
                  <line x1="58" y1="86" x2="58" y2="108" stroke="#4a5568" strokeWidth="7" strokeLinecap="round" />
                  {/* Shoes */}
                  <ellipse cx="40" cy="110" rx="6" ry="3.5" fill="#1a202c" />
                  <ellipse cx="60" cy="110" rx="6" ry="3.5" fill="#1a202c" />
                </svg>
                <span className="text-[10px] font-bold text-emerald-300 bg-black/60 px-1.5 py-0.2 rounded mt-0.5 border border-emerald-500/30">
                  Leo (Decoder)
                </span>
              </div>
            </div>

            {/* Right Roller Cylinder */}
            <div className="w-9 sm:w-12 h-44 sm:h-56 rounded-full bg-gradient-to-r from-[#593922] via-[#caa641] to-[#3a2212] border-2 border-[#ffd778] shadow-2xl flex flex-col items-center justify-between py-2 relative">
              <div
                className="w-full h-full flex flex-col justify-around items-center"
                style={{ transform: `rotate(${-scrollRotation}deg)` }}
              >
                <div className="w-full h-1 bg-[#1a0f08]/50" />
                <div className="w-full h-1 bg-[#1a0f08]/50" />
                <div className="w-full h-1 bg-[#1a0f08]/50" />
                <div className="w-full h-1 bg-[#1a0f08]/50" />
              </div>
              <div className="absolute -top-3 w-7 h-7 rounded-full bg-[#caa641] border border-[#ffebaa] shadow-md flex items-center justify-center text-xs font-bold text-[#321e0b]">
                ✦
              </div>
              <div className="absolute -bottom-3 w-7 h-7 rounded-full bg-[#caa641] border border-[#ffebaa] shadow-md flex items-center justify-center text-xs font-bold text-[#321e0b]">
                ✦
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Video & Scrubbing Deck */}
        <div className="relative z-20 bg-[#160f0a]/90 backdrop-blur-md p-2.5 rounded-lg border border-[#482c1b] flex flex-col gap-2">
          {/* Timeline Slider with child avatar handle */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#caa641] font-bold">0%</span>
            <div className="relative flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={scrollProgress}
                onChange={handleSeek}
                className="w-full h-2.5 bg-[#2a1b12] rounded-lg appearance-none cursor-pointer accent-[#bd593c] border border-[#52331f]"
              />
            </div>
            <span className="text-[11px] font-mono text-[#caa641] font-bold">100%</span>
          </div>

          {/* Video Controls Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevChapter}
                className="p-1.5 rounded-md bg-[#251810] hover:bg-[#382317] text-[#d6c5b8] border border-[#4a2e1d] transition-colors"
                title="Previous Chapter"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-gradient-to-r from-[#bd593c] to-[#963c23] hover:from-[#c96345] hover:to-[#a7462c] text-white font-bold text-xs shadow-md border border-[#ea896c]/30 transition-all hover:scale-102"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'Pause Video' : 'Play Animated Video'}</span>
              </button>

              <button
                onClick={handleNextChapter}
                className="p-1.5 rounded-md bg-[#251810] hover:bg-[#382317] text-[#d6c5b8] border border-[#4a2e1d] transition-colors"
                title="Next Chapter"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setScrollProgress(0);
                  sounds.playParchmentScroll();
                }}
                className="p-1.5 rounded-md bg-[#251810] hover:bg-[#382317] text-[#d6c5b8] border border-[#4a2e1d] transition-colors"
                title="Restart Chapter Scroll"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Chapter Selector Pills */}
            <div className="hidden md:flex items-center gap-1">
              {chapters.map((chap, idx) => (
                <button
                  key={chap.id}
                  onClick={() => {
                    setCurrentChapterIndex(idx);
                    setScrollProgress(0);
                    sounds.playParchmentScroll();
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all ${
                    currentChapterIndex === idx
                      ? 'bg-[#c59f3f] text-[#1a110a] shadow'
                      : 'bg-[#22160f] text-[#a58d7c] hover:bg-[#322016]'
                  }`}
                >
                  Ch {chap.id}
                </button>
              ))}
            </div>

            {/* Spoken Word Audio Action */}
            <button
              onClick={() => {
                if (currentChapter.panels[0]?.sanskritSpotlight) {
                  sounds.speakWord(
                    currentChapter.panels[0].sanskritSpotlight.word,
                    currentChapter.panels[0].sanskritSpotlight.translit
                  );
                }
              }}
              className="flex items-center gap-1 text-xs text-[#caa641] hover:text-white px-2 py-1 rounded bg-[#251810] border border-[#4a2e1d] transition-colors"
              title="Hear Sanskrit Term"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chant Term</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
