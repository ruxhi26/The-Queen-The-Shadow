import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, Sliders, Type, Palette, Copy, Check, Eye } from 'lucide-react';
import queenCloseup from '../assets/images/queen_closeup_1790494082144.jpg';
import shadowCloseup from '../assets/images/shadow_closeup_1790494098828.jpg';
import { TITLE_OPTIONS } from '../data/scriptData';

export const ThumbnailStudio: React.FC = () => {
  const [headlineText, setHeadlineText] = useState('TOGETHER... THEY RULE.');
  const [kickerText, setKickerText] = useState('DARK MAFIA ROMANCE · ORIGIN STORY');
  const [goldLineWidth, setGoldLineWidth] = useState(2);
  const [goldGlow, setGoldGlow] = useState(true);
  const [fontSize, setFontSize] = useState(58);
  const [vignetteDarkness, setVignetteDarkness] = useState(0.4);
  const [selectedTitle, setSelectedTitle] = useState(TITLE_OPTIONS[0].title);
  const [copiedTitle, setCopiedTitle] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw thumbnail on canvas
  const renderThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1280;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    const queenImg = new Image();
    const shadowImg = new Image();
    queenImg.src = queenCloseup;
    shadowImg.src = shadowCloseup;

    let loadedCount = 0;
    const onBothLoaded = () => {
      loadedCount++;
      if (loadedCount < 2) return;

      // 1. Draw Left Half (The Queen)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width / 2, height);
      ctx.clip();
      ctx.drawImage(queenImg, -80, 0, width * 0.65, height);
      ctx.restore();

      // 2. Draw Right Half (The Shadow)
      ctx.save();
      ctx.beginPath();
      ctx.rect(width / 2, 0, width / 2, height);
      ctx.clip();
      ctx.drawImage(shadowImg, width / 2 - 80, 0, width * 0.65, height);
      ctx.restore();

      // 3. Vignette & Bottom Text Contrast Gradients
      const bottomGrad = ctx.createLinearGradient(0, height * 0.5, 0, height);
      bottomGrad.addColorStop(0, 'rgba(10, 10, 12, 0)');
      bottomGrad.addColorStop(0.6, 'rgba(10, 10, 12, 0.7)');
      bottomGrad.addColorStop(1, 'rgba(10, 10, 12, 0.95)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, 0, width, height);

      const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.3);
      topGrad.addColorStop(0, 'rgba(10, 10, 12, 0.7)');
      topGrad.addColorStop(1, 'rgba(10, 10, 12, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, height);

      // Vignette edges
      ctx.fillStyle = `rgba(0, 0, 0, ${vignetteDarkness})`;
      ctx.fillRect(0, 0, width, height);

      // 4. Center Gold Divider Line
      if (goldLineWidth > 0) {
        ctx.save();
        if (goldGlow) {
          ctx.shadowColor = '#d4af37';
          ctx.shadowBlur = 18;
        }
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = goldLineWidth;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
        ctx.restore();
      }

      // 5. Top Kicker Badge / Text
      if (kickerText.trim()) {
        ctx.save();
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.letterSpacing = '4px';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 8;
        ctx.fillText(kickerText.toUpperCase(), width / 2, 60);
        ctx.restore();
      }

      // 6. Character Labels (Subtle Editorial)
      ctx.save();
      ctx.font = '600 16px "Cinzel", serif';
      ctx.fillStyle = 'rgba(244, 238, 219, 0.85)';
      ctx.letterSpacing = '3px';
      ctx.textAlign = 'left';
      ctx.fillText('THE QUEEN', 50, height - 160);

      ctx.textAlign = 'right';
      ctx.fillText('THE SHADOW', width - 50, height - 160);
      ctx.restore();

      // 7. Bottom Bold White Serif Headline: "TOGETHER... THEY RULE."
      ctx.save();
      ctx.font = `800 ${fontSize}px "Cinzel", Georgia, serif`;
      ctx.fillStyle = '#ffffff';
      ctx.letterSpacing = '6px';
      ctx.textAlign = 'center';
      
      // Heavy drop shadow for YouTube readability
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      ctx.fillText(headlineText.toUpperCase(), width / 2, height - 70);

      // Gold bottom accent line
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const textWidth = ctx.measureText(headlineText.toUpperCase()).width;
      ctx.moveTo(width / 2 - textWidth / 2, height - 50);
      ctx.lineTo(width / 2 + textWidth / 2, height - 50);
      ctx.stroke();

      ctx.restore();
    };

    queenImg.onload = onBothLoaded;
    shadowImg.onload = onBothLoaded;
  };

  useEffect(() => {
    renderThumbnail();
  }, [headlineText, kickerText, goldLineWidth, goldGlow, fontSize, vignetteDarkness]);

  const downloadThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'The_Queen_and_The_Shadow_YouTube_Thumbnail.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyTitle = (title: string) => {
    navigator.clipboard.writeText(title);
    setSelectedTitle(title);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Title & Concept Explanation */}
      <div className="border-b border-[#26262a] pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
              Production Suite · Thumbnail Concept
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold mt-1">
              Split Composition YouTube Thumbnail
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
              Strict 4-color palette: black, red, gold/champagne, and white. Elena's close-up with red lips & gold hoops on the left, The Shadow's serious expression on the right, divided by the signature thin gold line.
            </p>
          </div>

          <button
            onClick={downloadThumbnail}
            className="self-start md:self-auto px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 hover:brightness-110 active:scale-95 shadow-xl transition-all"
          >
            <Download className="w-4 h-4" />
            Download Thumbnail (1280x720)
          </button>
        </div>
      </div>

      {/* Main Preview & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Thumbnail Preview (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-xl overflow-hidden border-2 border-[#2a2a30] shadow-2xl bg-black">
            <canvas 
              ref={canvasRef} 
              className="w-full h-auto aspect-video block"
            />
            {/* 16:9 ratio badge */}
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-stone-300 border border-white/10">
              1280 × 720 · 16:9 Native YouTube Format
            </div>
          </div>

          {/* YouTube Video Card Mockup Preview */}
          <div className="p-4 bg-[#141418] border border-[#26262a] rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-32 aspect-video rounded overflow-hidden bg-black shrink-0 relative border border-white/10">
              <img 
                src={queenCloseup} 
                alt="thumbnail mini" 
                className="w-1/2 h-full object-cover float-left"
              />
              <img 
                src={shadowCloseup} 
                alt="thumbnail mini" 
                className="w-1/2 h-full object-cover float-right"
              />
              <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1 font-mono text-white rounded">
                13:12
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-sans font-semibold text-white text-sm truncate">
                {selectedTitle}
              </h4>
              <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                <span>The Queen & The Shadow</span>
                <span>·</span>
                <span>482K views</span>
                <span>·</span>
                <span>3 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customization Controls (4 Cols) */}
        <div className="lg:col-span-4 bg-[#141418] border border-[#26262a] rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-[#26262a] pb-3">
            <Sliders className="w-4 h-4 text-[#d4af37]" />
            <h3 className="font-cinzel text-sm font-semibold text-white tracking-wider">
              Composition Settings
            </h3>
          </div>

          {/* Main Headline */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Bottom Serif Headline
            </label>
            <input
              type="text"
              value={headlineText}
              onChange={(e) => setHeadlineText(e.target.value)}
              className="w-full bg-[#1b1b22] border border-[#303038] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
            <span className="text-[10px] text-stone-500 mt-0.5 block">
              Default prompt concept: "TOGETHER... THEY RULE."
            </span>
          </div>

          {/* Top Kicker */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Top Gold Kicker / Subtitle
            </label>
            <input
              type="text"
              value={kickerText}
              onChange={(e) => setKickerText(e.target.value)}
              className="w-full bg-[#1b1b22] border border-[#303038] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Font Size */}
          <div>
            <div className="flex justify-between text-xs text-stone-300 mb-1">
              <span>Headline Font Size</span>
              <span className="font-mono text-[#d4af37]">{fontSize}px</span>
            </div>
            <input
              type="range"
              min={40}
              max={76}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full accent-[#d4af37]"
            />
          </div>

          {/* Gold Divider Line Width */}
          <div>
            <div className="flex justify-between text-xs text-stone-300 mb-1">
              <span>Center Gold Divider</span>
              <span className="font-mono text-[#d4af37]">{goldLineWidth}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={6}
              value={goldLineWidth}
              onChange={(e) => setGoldLineWidth(parseInt(e.target.value))}
              className="w-full accent-[#d4af37]"
            />
          </div>

          {/* Gold Glow Toggle */}
          <div className="flex items-center justify-between text-xs text-stone-300 py-1">
            <span>Gold Divider Glow Effect</span>
            <button
              onClick={() => setGoldGlow(!goldGlow)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                goldGlow ? 'bg-[#d4af37]' : 'bg-[#303038]'
              }`}
            >
              <div 
                className={`w-3.5 h-3.5 rounded-full bg-black transition-transform absolute top-0.5 ${
                  goldGlow ? 'translate-x-5' : 'translate-x-1'
                }`} 
              />
            </button>
          </div>

          {/* Color Palette Verification */}
          <div className="border-t border-[#26262a] pt-4">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono block mb-2">
              Palette Strict Adherence (4 Colors)
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
              <div className="bg-[#0a0a0c] border border-stone-800 p-2 rounded text-stone-400">
                <div className="w-full h-4 bg-[#0a0a0c] border border-stone-700 rounded mb-1" />
                Black
              </div>
              <div className="bg-[#1e1e24] border border-stone-800 p-2 rounded text-stone-400">
                <div className="w-full h-4 bg-[#dc2626] rounded mb-1" />
                Red
              </div>
              <div className="bg-[#1e1e24] border border-stone-800 p-2 rounded text-stone-400">
                <div className="w-full h-4 bg-[#d4af37] rounded mb-1" />
                Gold
              </div>
              <div className="bg-[#1e1e24] border border-stone-800 p-2 rounded text-stone-400">
                <div className="w-full h-4 bg-[#ffffff] rounded mb-1" />
                White
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title Options A/B Testing & Selection */}
      <div className="p-6 bg-[#141418] border border-[#26262a] rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-cinzel text-lg text-white font-bold">
              Target YouTube Title Options
            </h3>
            <p className="text-xs text-stone-400">
              Click any title to copy and preview with your thumbnail.
            </p>
          </div>
          {copiedTitle && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" /> Copied to clipboard!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TITLE_OPTIONS.map((opt) => (
            <div
              key={opt.id}
              onClick={() => copyTitle(opt.title)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedTitle === opt.title
                  ? 'bg-[#1e1e26] border-[#d4af37] shadow-md'
                  : 'bg-[#0f0f13] border-[#26262e] hover:border-stone-600'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-[#d4af37] mb-2">
                <span>{opt.badge}</span>
                <Copy className="w-3.5 h-3.5 opacity-60" />
              </div>
              <h4 className="text-sm font-semibold text-white leading-snug">
                {opt.title}
              </h4>
              <p className="text-xs text-stone-400 mt-2">
                {opt.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
