import React, { useState } from 'react';
import { 
  Crown, Shield, Sparkles, Check, Copy, Flame, Clock, 
  Car, Eye, Heart, Compass, Crosshair
} from 'lucide-react';
import { CHARACTER_DOSSIERS, COLOR_PALETTE, PROPS_AND_VIBES } from '../data/scriptData';
import { ColorSwatch } from '../types/script';

export const CharacterDossier: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queen' | 'shadow' | 'palette' | 'props'>('queen');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const queen = CHARACTER_DOSSIERS.queen;
  const shadow = CHARACTER_DOSSIERS.shadow;

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="border-b border-[#26262a] pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
              Character Sheet & Production Dossier
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold mt-1">
              The Queen & The Shadow Dossier
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
              Official character design sheets, wardrobe details, expression matrices, props, and four-color palette rules for visual consistency across generated shots.
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 bg-[#121216] border border-[#26262a] p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('queen')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === 'queen'
                  ? 'bg-[#dc2626] text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              The Queen
            </button>

            <button
              onClick={() => setActiveTab('shadow')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === 'shadow'
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              The Shadow
            </button>

            <button
              onClick={() => setActiveTab('palette')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'palette'
                  ? 'bg-white/20 text-white'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Color Palette
            </button>

            <button
              onClick={() => setActiveTab('props')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'props'
                  ? 'bg-white/20 text-white'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Props & Vibes
            </button>
          </div>
        </div>
      </div>

      {/* 1. THE QUEEN DOSSIER */}
      {activeTab === 'queen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Portrait Card */}
          <div className="lg:col-span-4 bg-[#141418] border border-[#2a2a30] rounded-xl overflow-hidden shadow-2xl">
            <div className="relative aspect-square bg-black overflow-hidden">
              <img 
                src={queen.primaryImage} 
                alt="Elena The Queen" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[11px] font-mono text-[#dc2626] font-semibold tracking-wider uppercase block">
                  WOMEN BOSS · MASTERMIND
                </span>
                <h3 className="font-cinzel text-2xl text-white font-bold">
                  {queen.name} <span className="text-[#d4af37]">"{queen.alias}"</span>
                </h3>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Traits Badges */}
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block mb-2">
                  Personality Attributes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {queen.traits.map(t => (
                    <span 
                      key={t}
                      className="px-2.5 py-1 bg-black/60 border border-[#dc2626]/30 text-xs text-[#f4eedb] rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="p-3 bg-black/40 border-l-2 border-[#dc2626] rounded-r text-xs italic text-[#f4eedb]">
                {queen.keyQuote}
              </div>

              {/* Voice Tone */}
              <div className="text-xs text-stone-400">
                <strong className="text-stone-300 block mb-1">Narration Voice Style:</strong>
                {queen.voiceTone}
              </div>
            </div>
          </div>

          {/* Right: Wardrobe & Expression Matrix */}
          <div className="lg:col-span-8 space-y-6">
            {/* Backstory */}
            <div className="p-5 bg-[#141418] border border-[#26262a] rounded-xl">
              <h4 className="font-cinzel text-base text-[#d4af37] font-semibold mb-2">
                Origin Lore & Psychological Profile
              </h4>
              <p className="text-xs sm:text-sm text-[#f4eedb] leading-relaxed">
                {queen.backstory}
              </p>
            </div>

            {/* Expression Matrix */}
            <div className="p-5 bg-[#141418] border border-[#26262a] rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-cinzel text-base text-white font-semibold">
                  Elena Expression Matrix
                </h4>
                <span className="text-[11px] font-mono text-stone-400">
                  Calm & Smirk (Present) · Angry & Thoughtful (Flashbacks)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {queen.expressions.map(exp => (
                  <div key={exp.name} className="p-3 bg-[#0d0d10] border border-[#222228] rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-cinzel font-bold text-sm text-[#dc2626]">
                        {exp.name}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {exp.usage}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wardrobe Breakdown */}
            <div className="p-5 bg-[#141418] border border-[#26262a] rounded-xl">
              <h4 className="font-cinzel text-base text-white font-semibold mb-4">
                Wardrobe Details & Visual Symbolism
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {queen.wardrobe.map(item => (
                  <div key={item.item} className="p-3 bg-[#0d0d10] border border-[#222228] rounded-lg space-y-1">
                    <span className="text-xs font-bold text-white block">
                      {item.item}
                    </span>
                    <p className="text-xs text-stone-400">
                      {item.description}
                    </p>
                    <p className="text-[11px] text-[#d4af37] italic pt-1 border-t border-white/5">
                      Symbolism: {item.symbolism}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. THE SHADOW DOSSIER */}
      {activeTab === 'shadow' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Portrait Card */}
          <div className="lg:col-span-4 bg-[#141418] border border-[#2a2a30] rounded-xl overflow-hidden shadow-2xl">
            <div className="relative aspect-square bg-black overflow-hidden">
              <img 
                src={shadow.primaryImage} 
                alt="The Shadow" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[11px] font-mono text-[#d4af37] font-semibold tracking-wider uppercase block">
                  MALE GANGSTER · ENFORCER
                </span>
                <h3 className="font-cinzel text-2xl text-white font-bold">
                  {shadow.alias}
                </h3>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Traits Badges */}
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block mb-2">
                  Personality Attributes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {shadow.traits.map(t => (
                    <span 
                      key={t}
                      className="px-2.5 py-1 bg-black/60 border border-[#d4af37]/30 text-xs text-[#f4eedb] rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="p-3 bg-black/40 border-l-2 border-[#d4af37] rounded-r text-xs italic text-[#f4eedb]">
                {shadow.keyQuote}
              </div>

              {/* Voice Tone */}
              <div className="text-xs text-stone-400">
                <strong className="text-stone-300 block mb-1">Narration Voice Style:</strong>
                {shadow.voiceTone}
              </div>
            </div>
          </div>

          {/* Right: Wardrobe & Expression Matrix */}
          <div className="lg:col-span-8 space-y-6">
            {/* Backstory */}
            <div className="p-5 bg-[#141418] border border-[#26262a] rounded-xl">
              <h4 className="font-cinzel text-base text-[#d4af37] font-semibold mb-2">
                Origin Lore & Psychological Profile
              </h4>
              <p className="text-xs sm:text-sm text-[#f4eedb] leading-relaxed">
                {shadow.backstory}
              </p>
            </div>

            {/* Expression Matrix */}
            <div className="p-5 bg-[#141418] border border-[#26262a] rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-cinzel text-base text-white font-semibold">
                  The Shadow Expression Matrix
                </h4>
                <span className="text-[11px] font-mono text-stone-400">
                  Serious & Angry (Acts 1-3) · Soft (Rare) & Protective (Act 5)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shadow.expressions.map(exp => (
                  <div key={exp.name} className="p-3 bg-[#0d0d10] border border-[#222228] rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-cinzel font-bold text-sm text-[#d4af37]">
                        {exp.name}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {exp.usage}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wardrobe Breakdown */}
            <div className="p-5 bg-[#141418] border border-[#26262a] rounded-xl">
              <h4 className="font-cinzel text-base text-white font-semibold mb-4">
                Wardrobe Details & Visual Motifs
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {shadow.wardrobe.map(item => (
                  <div key={item.item} className="p-3 bg-[#0d0d10] border border-[#222228] rounded-lg space-y-1">
                    <span className="text-xs font-bold text-white block">
                      {item.item}
                    </span>
                    <p className="text-xs text-stone-400">
                      {item.description}
                    </p>
                    <p className="text-[11px] text-[#d4af37] italic pt-1 border-t border-white/5">
                      Symbolism: {item.symbolism}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. COLOR PALETTE SWATCH INSPECTOR */}
      {activeTab === 'palette' && (
        <div className="space-y-6">
          <div className="p-6 bg-[#141418] border border-[#26262a] rounded-xl">
            <h3 className="font-cinzel text-xl text-white font-bold mb-1">
              Production Color Palette Constitution
            </h3>
            <p className="text-xs text-stone-400 max-w-2xl mb-6">
              "Black · charcoal · red · gold · white — stick to it in every scene for visual consistency across generated shots." Click any swatch to copy the HEX code for Midjourney, Photoshop, or DaVinci Resolve color grading.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {COLOR_PALETTE.map((c) => (
                <div 
                  key={c.name}
                  onClick={() => copyHex(c.hex)}
                  className="bg-[#0e0e12] border border-[#26262e] rounded-xl p-4 cursor-pointer hover:border-[#d4af37] transition-all group"
                >
                  <div 
                    className="w-full h-24 rounded-lg shadow-inner border border-white/10 mb-3 flex items-end p-2 transition-transform group-hover:scale-[1.02]"
                    style={{ backgroundColor: c.hex }}
                  >
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      c.hex === '#0A0A0C' || c.hex === '#1E1E22' ? 'bg-white/10 text-white' : 'bg-black/60 text-white'
                    }`}>
                      {c.hex}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-cinzel font-bold text-sm text-white">{c.name}</h4>
                    {copiedHex === c.hex ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-stone-500 opacity-60 group-hover:opacity-100" />
                    )}
                  </div>

                  <p className="text-[11px] text-[#d4af37] font-medium">{c.role}</p>
                  <p className="text-[11px] text-stone-400 mt-2 leading-relaxed">{c.aestheticUsage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. PROPS & VIBES */}
      {activeTab === 'props' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROPS_AND_VIBES.map((prop) => (
            <div 
              key={prop.name}
              className="bg-[#141418] border border-[#26262a] rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#d4af37] tracking-wider uppercase">
                  {prop.category}
                </span>
                <Sparkles className="w-4 h-4 text-stone-600" />
              </div>

              <h4 className="font-cinzel text-lg text-white font-bold">
                {prop.name}
              </h4>

              <p className="text-xs text-[#f4eedb] leading-relaxed">
                {prop.details}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
