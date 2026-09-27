import React, { useState } from 'react';
import { 
  Play, Pause, Volume2, Copy, Check, Sparkles, BookOpen, 
  Tv, Film, Eye, Clock, Download, ChevronRight, Mic
} from 'lucide-react';
import { SCRIPT_ACTS } from '../data/scriptData';
import { ScriptAct } from '../types/script';
import { speechController, VOICE_PERSONAS, VoicePersona } from '../utils/speechNarration';

interface ScriptReaderProps {
  onOpenTeleprompter: (actIdx: number) => void;
  onPlayInCinema: (actIdx: number) => void;
  selectedActId?: string;
}

export const ScriptReader: React.FC<ScriptReaderProps> = ({ 
  onOpenTeleprompter, 
  onPlayInCinema,
  selectedActId 
}) => {
  const [activeActId, setActiveActId] = useState<string>(selectedActId || SCRIPT_ACTS[0].id);
  const [playingLineKey, setPlayingLineKey] = useState<string | null>(null);
  const [copiedActId, setCopiedActId] = useState<string | null>(null);
  const [activePersona, setActivePersona] = useState<VoicePersona>(VOICE_PERSONAS[0]);

  const activeAct = SCRIPT_ACTS.find(a => a.id === activeActId) || SCRIPT_ACTS[0];
  const activeActIndex = SCRIPT_ACTS.findIndex(a => a.id === activeActId);

  const playSpeechLine = (line: string, key: string) => {
    if (playingLineKey === key) {
      speechController.stop();
      setPlayingLineKey(null);
      return;
    }

    setPlayingLineKey(key);
    speechController.speakLine(line, activePersona, undefined, () => {
      setPlayingLineKey(null);
    });
  };

  const copyActText = (act: ScriptAct) => {
    const text = `ACT: ${act.title} [${act.timestamp}]\nVISUAL: ${act.visualNote}\n\n` + act.narrationText.join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedActId(act.id);
    setTimeout(() => setCopiedActId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Reader Header */}
      <div className="border-b border-[#26262a] pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
              Screenplay & Production Script
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold mt-1">
              The Queen & The Shadow: Origin Script
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
              Target runtime: ~12–14 minutes (~840 words at 125 WPM narrator cadence). Includes full visual cues, staging notes, and voice actor cues.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPlayInCinema(activeActIndex)}
              className="px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Film className="w-4 h-4" />
              Watch in Cinema Player
            </button>

            <button
              onClick={() => onOpenTeleprompter(activeActIndex)}
              className="px-4 py-2 bg-[#1b1b22] hover:bg-[#252530] text-stone-300 hover:text-white border border-[#30303a] text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all"
            >
              <Tv className="w-4 h-4" />
              Open Teleprompter
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual Pane: Act Selector & Script Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Act Navigator (4 Cols) */}
        <div className="lg:col-span-4 bg-[#141418] border border-[#26262a] rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#26262a] pb-3">
            <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
              Story Acts & Chapters
            </span>
            <span className="text-xs font-mono text-[#d4af37]">
              {SCRIPT_ACTS.length} Acts Total
            </span>
          </div>

          {/* Voice Persona Selector */}
          <div className="p-3 bg-[#0d0d10] border border-[#222228] rounded-lg">
            <label className="block text-[11px] font-mono text-stone-400 uppercase mb-1.5 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-[#d4af37]" />
              Audition Voice Tone
            </label>
            <select
              value={activePersona.id}
              onChange={(e) => {
                const found = VOICE_PERSONAS.find(p => p.id === e.target.value);
                if (found) setActivePersona(found);
              }}
              className="w-full bg-[#16161c] border border-stone-700 text-xs text-white rounded p-1.5 focus:outline-none focus:border-[#d4af37]"
            >
              {VOICE_PERSONAS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-stone-500 mt-1 italic">
              {activePersona.description}
            </p>
          </div>

          {/* Acts List */}
          <div className="space-y-1.5">
            {SCRIPT_ACTS.map((act, idx) => {
              const isActive = act.id === activeActId;
              return (
                <div
                  key={act.id}
                  onClick={() => {
                    speechController.stop();
                    setPlayingLineKey(null);
                    setActiveActId(act.id);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#1e1e26] border-[#d4af37] text-white shadow-md'
                      : 'bg-[#0e0e12] border-transparent text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className={isActive ? 'text-[#d4af37] font-bold' : 'text-stone-500'}>
                      {act.actNumber === 'COLD OPEN' || act.actNumber === 'CTA' ? act.actNumber : `ACT ${act.actNumber}`}
                    </span>
                    <span className="text-stone-500">{act.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-semibold leading-snug">
                    {act.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Focused Act Reading & Staging Area (8 Cols) */}
        <div className="lg:col-span-8 bg-[#141418] border border-[#26262a] rounded-xl p-6 sm:p-8 space-y-8">
          {/* Act Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26262a] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37]">
                <span>{activeAct.actNumber === 'COLD OPEN' || activeAct.actNumber === 'CTA' ? activeAct.actNumber : `ACT ${activeAct.actNumber}`}</span>
                <span>·</span>
                <span>{activeAct.timestamp}</span>
              </div>
              <h3 className="font-cinzel text-2xl sm:text-3xl text-white font-bold mt-1">
                {activeAct.title}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {activeAct.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyActText(activeAct)}
                className="px-3 py-1.5 bg-[#1b1b22] hover:bg-[#252530] text-stone-300 text-xs rounded-lg border border-[#303038] flex items-center gap-1.5 transition-colors"
              >
                {copiedActId === activeAct.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Visual Cue Staging Callout */}
          <div className="p-4 bg-black/60 border-l-4 border-[#dc2626] rounded-r-lg text-xs space-y-1">
            <span className="text-[#dc2626] font-mono uppercase tracking-wider font-semibold block text-[11px]">
              Visual Staging & Scene Directive
            </span>
            <p className="text-stone-300 italic font-sans text-sm">
              [{activeAct.visualNote}]
            </p>
          </div>

          {/* Narration Lines (Interactive) */}
          <div className="space-y-6">
            <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block">
              Narration Voiceover Audio (Click any line to speak):
            </span>

            {activeAct.narrationText.map((line, idx) => {
              const lineKey = `${activeAct.id}-${idx}`;
              const isSpeakingThisLine = playingLineKey === lineKey;

              return (
                <div
                  key={idx}
                  onClick={() => playSpeechLine(line, lineKey)}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                    isSpeakingThisLine
                      ? 'bg-[#1b191a] border-[#d4af37] shadow-xl'
                      : 'bg-[#0d0d10] border-[#222228] hover:border-stone-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      className={`p-2 rounded-full shrink-0 transition-colors ${
                        isSpeakingThisLine
                          ? 'bg-[#d4af37] text-black'
                          : 'bg-white/5 text-stone-400 group-hover:text-white group-hover:bg-white/10'
                      }`}
                    >
                      {isSpeakingThisLine ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <p className={`font-serif text-base sm:text-lg leading-relaxed ${
                        isSpeakingThisLine ? 'text-white font-medium' : 'text-[#f4eedb]'
                      }`}>
                        {line}
                      </p>
                      <span className="text-[10px] font-mono text-stone-500 block">
                        Line {idx + 1} of {activeAct.narrationText.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Act Scene Artwork Preview */}
          {activeAct.cameraShots[0]?.imagePlaceholder && (
            <div className="border-t border-[#26262a] pt-6">
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block mb-3">
                Key Cinematography Reference Shot:
              </span>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-[#2a2a32] shadow-xl">
                <img 
                  src={activeAct.cameraShots[0].imagePlaceholder} 
                  alt={activeAct.cameraShots[0].description} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 text-xs text-stone-300">
                  <span className="text-[#d4af37] font-semibold block font-cinzel">
                    {activeAct.cameraShots[0].shotType} · {activeAct.cameraShots[0].visualMotif}
                  </span>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {activeAct.cameraShots[0].description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
