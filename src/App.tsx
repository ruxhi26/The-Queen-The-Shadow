import React, { useState } from 'react';
import { Header, StudioTab } from './components/Header';
import { CinematicVideoPlayer } from './components/CinematicVideoPlayer';
import { ScriptReader } from './components/ScriptReader';
import { ThumbnailStudio } from './components/ThumbnailStudio';
import { StoryboardDirector } from './components/StoryboardDirector';
import { CharacterDossier } from './components/CharacterDossier';
import { PublishingHub } from './components/PublishingHub';
import { VisualMoodboard } from './components/VisualMoodboard';
import { GeminiStudioHub } from './components/GeminiStudioHub';
import { TeleprompterModal } from './components/TeleprompterModal';
import { VideoRecorderModal } from './components/VideoRecorderModal';
import { SCRIPT_ACTS, COLOR_PALETTE } from './data/scriptData';
import { Film, Play, Sparkles, Youtube, Crown, Shield } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<StudioTab>('video');
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [isVideoRecorderOpen, setIsVideoRecorderOpen] = useState(false);
  const [teleprompterActIndex, setTeleprompterActIndex] = useState(0);
  const [selectedScriptActId, setSelectedScriptActId] = useState<string>(SCRIPT_ACTS[0].id);

  const handleOpenTeleprompter = (actIdx: number) => {
    setTeleprompterActIndex(actIdx);
    setIsTeleprompterOpen(true);
  };

  const handlePlayInCinema = (actIdx: number) => {
    setActiveTab('video');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#f4eedb] flex flex-col font-sans selection:bg-[#dc2626]/30 selection:text-white">
      {/* Sticky Header */}
      <Header 
        activeTab={activeTab} 
        onSelectTab={setActiveTab}
        onOpenRecorder={() => setIsVideoRecorderOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. CINEMATIC VIDEO PLAYER TAB */}
        {activeTab === 'video' && (
          <div className="space-y-8">
            <div className="border-b border-[#26262a] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
                  Production Studio · Interactive Video
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold mt-1">
                  The Queen & The Shadow — Origin Video
                </h2>
                <p className="text-sm text-stone-400 mt-1 max-w-2xl">
                  Watch the complete cinematic origin story (~12–14 min pacing) featuring high-fidelity manhwa artwork, Ken Burns motion, synchronized voice narration, film noir rain & sub-bass ambience, and real-time subtitles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVideoRecorderOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 hover:brightness-110 active:scale-95 shadow-lg transition-all"
                >
                  <Film className="w-4 h-4" />
                  Render & Export Video
                </button>
              </div>
            </div>

            {/* Video Player */}
            <CinematicVideoPlayer 
              onOpenRecorder={() => setIsVideoRecorderOpen(true)}
              onSelectActInScript={(actId) => setSelectedScriptActId(actId)}
            />

            {/* Video Quick Director Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#121216] border border-[#222228] rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-[#dc2626] text-xs font-mono font-semibold uppercase">
                  <Crown className="w-3.5 h-3.5" />
                  <span>The Queen (Elena)</span>
                </div>
                <p className="text-xs text-stone-300">
                  Female boss in black tailored silk & red heels. Uses patience, intellect, and ledgers to dismantle a tyrannical mob boss.
                </p>
              </div>

              <div className="p-4 bg-[#121216] border border-[#222228] rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-[#d4af37] text-xs font-mono font-semibold uppercase">
                  <Shield className="w-3.5 h-3.5" />
                  <span>The Shadow</span>
                </div>
                <p className="text-xs text-stone-300">
                  Lethal enforcer raised by the syndicate since twelve. When ordered to kill her, she offers him truth and choice.
                </p>
              </div>

              <div className="p-4 bg-[#121216] border border-[#222228] rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-[#f4eedb] text-xs font-mono font-semibold uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Together... They Rule</span>
                </div>
                <p className="text-xs text-stone-300">
                  Rewriting the rules of the underworld: loyalty over fear, precision over chaos. Neither one expendable.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. VISUAL MOODBOARD & RECURRING MOTIFS TAB */}
        {activeTab === 'moodboard' && (
          <VisualMoodboard />
        )}

        {/* 3. GEMINI AI LAB & GROUNDING SUITE */}
        {activeTab === 'gemini' && (
          <GeminiStudioHub />
        )}

        {/* 4. SCRIPT & TELEPROMPTER TAB */}
        {activeTab === 'script' && (
          <ScriptReader 
            selectedActId={selectedScriptActId}
            onOpenTeleprompter={handleOpenTeleprompter}
            onPlayInCinema={handlePlayInCinema}
          />
        )}

        {/* 3. THUMBNAIL STUDIO TAB */}
        {activeTab === 'thumbnail' && (
          <ThumbnailStudio />
        )}

        {/* 4. STORYBOARD DIRECTOR TAB */}
        {activeTab === 'storyboard' && (
          <StoryboardDirector />
        )}

        {/* 5. CHARACTER DOSSIER TAB */}
        {activeTab === 'dossier' && (
          <CharacterDossier />
        )}

        {/* 6. YOUTUBE PUBLISHING & SEO TAB */}
        {activeTab === 'publishing' && (
          <PublishingHub />
        )}
      </main>

      {/* Production Footer */}
      <footer className="mt-auto border-t border-[#1c1c22] bg-[#09090b] py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-cinzel text-white font-bold tracking-wider">
              THE QUEEN & THE SHADOW
            </span>
            <span>·</span>
            <span>Origin Story Studio</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>Color Palette:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#0a0a0c] border border-stone-700" title="Black" />
              <span className="w-3 h-3 rounded-full bg-[#2a2a30]" title="Charcoal" />
              <span className="w-3 h-3 rounded-full bg-[#dc2626]" title="Crimson" />
              <span className="w-3 h-3 rounded-full bg-[#d4af37]" title="Gold" />
              <span className="w-3 h-3 rounded-full bg-[#f4eedb]" title="White/Ivory" />
            </div>
          </div>

          <div className="font-mono text-[11px] text-stone-500">
            "Together... They rule."
          </div>
        </div>
      </footer>

      {/* Studio Teleprompter Modal */}
      <TeleprompterModal 
        isOpen={isTeleprompterOpen}
        onClose={() => setIsTeleprompterOpen(false)}
        initialActIndex={teleprompterActIndex}
      />

      {/* Video Recorder / Render Modal */}
      <VideoRecorderModal
        isOpen={isVideoRecorderOpen}
        onClose={() => setIsVideoRecorderOpen(false)}
      />
    </div>
  );
}
