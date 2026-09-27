import React, { useState } from 'react';
import { Camera, Film, Sparkles, Copy, Check, Eye, Clapperboard, Filter } from 'lucide-react';
import { SCRIPT_ACTS } from '../data/scriptData';
import { ScriptAct, StoryboardShot } from '../types/script';

export const StoryboardDirector: React.FC = () => {
  const [selectedActId, setSelectedActId] = useState<string>('all');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const filteredActs = selectedActId === 'all' 
    ? SCRIPT_ACTS 
    : SCRIPT_ACTS.filter(a => a.id === selectedActId);

  const copyPrompt = (shot: StoryboardShot, act: ScriptAct) => {
    const prompt = `Cinematic dark mafia romance anime manhwa style, ${shot.description}. Lighting: ${shot.lightingMood}. Camera: ${shot.cameraMovement}. Characters: The Queen (black tailored silk suit, gold hoops, red lips) and The Shadow (black tailored suit, high-collar shirt, leather gloves). Color palette: black, charcoal, crimson red, champagne gold, white. Highly detailed, 8k resolution, film noir cinematography.`;
    navigator.clipboard.writeText(prompt);
    setCopiedPromptId(shot.id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#26262a] pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
              Visual Direction · Shot Lists & Motifs
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold mt-1">
              Cinematic Storyboard Director
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
              19 key visual beats engineered for YouTube viewer retention (~12–14 min pacing). Featuring recurring motifs (red heels, gold watch, ledger, lowered handgun) and character expression benchmarks.
            </p>
          </div>

          {/* Act Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedActId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedActId === 'all'
                  ? 'bg-[#d4af37] text-black font-semibold shadow'
                  : 'bg-[#18181f] text-stone-400 hover:text-white border border-[#2a2a32]'
              }`}
            >
              All Acts (19 Shots)
            </button>
            {SCRIPT_ACTS.map(act => (
              <button
                key={act.id}
                onClick={() => setSelectedActId(act.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedActId === act.id
                    ? 'bg-[#d4af37] text-black font-semibold shadow'
                    : 'bg-[#18181f] text-stone-400 hover:text-white border border-[#2a2a32]'
                }`}
              >
                {act.actNumber === 'COLD OPEN' ? 'Cold Open' : act.actNumber === 'CTA' ? 'Outro' : `Act ${act.actNumber}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Acts Breakdown */}
      <div className="space-y-12">
        {filteredActs.map((act) => (
          <div key={act.id} className="space-y-4">
            {/* Act Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-[#141418] border-l-4 border-[#dc2626] rounded-r-lg border-y border-r border-[#26262a]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#d4af37] font-semibold uppercase">
                    {act.actNumber === 'COLD OPEN' || act.actNumber === 'CTA' ? act.actNumber : `ACT ${act.actNumber}`}
                  </span>
                  <span className="text-stone-500">·</span>
                  <span className="text-xs text-stone-400 font-mono">{act.timestamp}</span>
                </div>
                <h3 className="font-cinzel text-lg sm:text-xl text-white font-bold mt-0.5">
                  {act.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {act.expressionElena && act.expressionElena !== 'N/A' && (
                  <span className="bg-black/60 border border-[#dc2626]/40 text-[#f4eedb] px-2.5 py-1 rounded text-[11px]">
                    <strong className="text-[#dc2626]">Elena:</strong> {act.expressionElena}
                  </span>
                )}
                {act.expressionShadow && act.expressionShadow !== 'N/A' && (
                  <span className="bg-black/60 border border-[#d4af37]/40 text-[#f4eedb] px-2.5 py-1 rounded text-[11px]">
                    <strong className="text-[#d4af37]">Shadow:</strong> {act.expressionShadow}
                  </span>
                )}
              </div>
            </div>

            {/* Shots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {act.cameraShots.map((shot) => (
                <div 
                  key={shot.id} 
                  className="bg-[#121216] border border-[#26262c] rounded-xl overflow-hidden shadow-lg flex flex-col group hover:border-[#d4af37]/40 transition-colors"
                >
                  {/* Visual Shot Artwork */}
                  <div className="relative aspect-video bg-black overflow-hidden">
                    {shot.imagePlaceholder ? (
                      <img 
                        src={shot.imagePlaceholder} 
                        alt={shot.description}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1a1a20]">
                        <Clapperboard className="w-8 h-8 text-stone-600" />
                      </div>
                    )}

                    {/* Shot Tag overlay */}
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#d4af37] border border-white/10">
                      SHOT {shot.shotNumber} · {shot.shotType}
                    </div>

                    {/* Copy AI Prompt Button */}
                    <button
                      onClick={() => copyPrompt(shot, act)}
                      title="Copy Midjourney / Flux Prompt"
                      className="absolute top-2 right-2 bg-black/80 backdrop-blur-md p-1.5 rounded text-stone-300 hover:text-white border border-white/10 hover:border-[#d4af37] transition-all"
                    >
                      {copiedPromptId === shot.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                      )}
                    </button>
                  </div>

                  {/* Shot Technical Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-[#f4eedb] leading-relaxed">
                      {shot.description}
                    </p>

                    <div className="space-y-1.5 text-[11px] border-t border-[#222228] pt-2.5">
                      <div className="flex items-start justify-between text-stone-400">
                        <span className="text-stone-500">Camera:</span>
                        <span className="text-right text-stone-300">{shot.cameraMovement}</span>
                      </div>
                      <div className="flex items-start justify-between text-stone-400">
                        <span className="text-stone-500">Lighting:</span>
                        <span className="text-right text-stone-300">{shot.lightingMood}</span>
                      </div>
                      <div className="flex items-start justify-between text-stone-400">
                        <span className="text-[#dc2626] font-medium">Motif:</span>
                        <span className="text-right text-[#f4eedb]">{shot.visualMotif}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
