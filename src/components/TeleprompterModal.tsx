import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, RotateCcw, FlipHorizontal, ArrowUp, ArrowDown, 
  Type, Settings2, Compass
} from 'lucide-react';
import { SCRIPT_ACTS } from '../data/scriptData';

interface TeleprompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialActIndex?: number;
}

export const TeleprompterModal: React.FC<TeleprompterModalProps> = ({ 
  isOpen, 
  onClose, 
  initialActIndex = 0 
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1 to 5
  const [fontSize, setFontSize] = useState(36); // px
  const [isMirrored, setIsMirrored] = useState(false);
  const [currentAct, setCurrentAct] = useState(initialActIndex);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentAct(initialActIndex);
  }, [initialActIndex]);

  useEffect(() => {
    let lastTime = performance.now();

    const scrollLoop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (isScrolling && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += (scrollSpeed * delta) / 16;
      }
      animationFrameRef.current = requestAnimationFrame(scrollLoop);
    };

    if (isScrolling) {
      animationFrameRef.current = requestAnimationFrame(scrollLoop);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isScrolling, scrollSpeed]);

  if (!isOpen) return null;

  const resetScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top Floating Control Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#0d0d10] border-b border-[#222228] select-none">
        <div className="flex items-center gap-3">
          <span className="font-cinzel font-bold text-white text-base">
            Studio Teleprompter
          </span>
          <span className="text-xs font-mono text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/30">
            {isScrolling ? 'SCROLLING' : 'PAUSED'}
          </span>
        </div>

        {/* Center Prompter Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsScrolling(!isScrolling)}
            className="px-5 py-2 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            {isScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            {isScrolling ? 'Pause Scroll (Space)' : 'Start Scrolling'}
          </button>

          <button
            onClick={resetScroll}
            title="Reset to Top"
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Slider */}
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <span>Speed</span>
            <input
              type="range"
              min={0.5}
              max={6}
              step={0.5}
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
              className="w-24 accent-[#d4af37]"
            />
            <span className="font-mono text-[#d4af37] w-6">{scrollSpeed}x</span>
          </div>

          {/* Font Size */}
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <Type className="w-3.5 h-3.5" />
            <input
              type="range"
              min={24}
              max={56}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-20 accent-[#d4af37]"
            />
          </div>

          {/* Mirroring Toggle */}
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            title="Mirror horizontally for glass teleprompter rig"
            className={`p-2 rounded-lg flex items-center gap-1.5 text-xs transition-colors ${
              isMirrored ? 'bg-[#d4af37] text-black font-semibold' : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FlipHorizontal className="w-4 h-4" />
            <span>Mirror</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prompter Visual Reading Area */}
      <div 
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto px-8 sm:px-20 md:px-36 py-24 select-none ${
          isMirrored ? 'scale-x-[-1]' : ''
        }`}
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Eye Line Guide in Center */}
        <div className="fixed top-1/2 left-0 right-0 h-1 bg-[#d4af37]/30 pointer-events-none z-10">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#d4af37] bg-black/80 px-2 py-0.5 rounded">
            EYELINE GUIDE
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-24">
          {SCRIPT_ACTS.map((act) => (
            <div key={act.id} className="space-y-8">
              <div className="border-b border-stone-800 pb-4">
                <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] block">
                  {act.actNumber === 'COLD OPEN' || act.actNumber === 'CTA' ? act.actNumber : `ACT ${act.actNumber}`} · {act.timestamp}
                </span>
                <h2 className="font-cinzel text-3xl sm:text-4xl text-white font-bold mt-1">
                  {act.title}
                </h2>
                <p className="text-stone-400 text-sm mt-2 italic">
                  [VISUAL CUE: {act.visualNote}]
                </p>
              </div>

              <div 
                className="space-y-8 text-[#f4eedb] font-serif leading-relaxed"
                style={{ fontSize: `${fontSize}px` }}
              >
                {act.narrationText.map((line, idx) => (
                  <p key={idx} className="hover:text-white transition-colors">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* End padding so script can scroll to end */}
          <div className="h-96" />
        </div>
      </div>
    </div>
  );
};
