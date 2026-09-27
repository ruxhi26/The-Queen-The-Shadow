import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Maximize2, Minimize2, Subtitles, Film, Sparkles, Download, 
  Settings2, Eye, ShieldAlert, BookOpen, Layers
} from 'lucide-react';
import { SCRIPT_ACTS } from '../data/scriptData';
import { ScriptAct, StoryboardShot } from '../types/script';
import { noirAudio } from '../utils/audioAmbience';
import { speechController, VOICE_PERSONAS, VoicePersona } from '../utils/speechNarration';

interface CinematicVideoPlayerProps {
  onOpenRecorder?: () => void;
  onSelectActInScript?: (actId: string) => void;
}

export const CinematicVideoPlayer: React.FC<CinematicVideoPlayerProps> = ({ 
  onOpenRecorder,
  onSelectActInScript 
}) => {
  const [currentActIndex, setCurrentActIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ambientAudioOn, setAmbientAudioOn] = useState(false);
  const [speechPersona, setSpeechPersona] = useState<VoicePersona>(VOICE_PERSONAS[0]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showMotifsHud, setShowMotifsHud] = useState(true);
  const [cinemascopeBars, setCinemascopeBars] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeAct: ScriptAct = SCRIPT_ACTS[currentActIndex] || SCRIPT_ACTS[0];
  const activeShot: StoryboardShot = activeAct.cameraShots[currentShotIndex] || activeAct.cameraShots[0];
  const currentLine = activeAct.narrationText[currentLineIndex] || activeAct.narrationText[0];

  // Handle Ambience Toggle
  const toggleAmbientAudio = () => {
    if (ambientAudioOn) {
      noirAudio.stop();
      setAmbientAudioOn(false);
    } else {
      noirAudio.start(0.4);
      setAmbientAudioOn(true);
    }
  };

  // Play narration line
  const speakCurrentLine = useCallback(() => {
    if (!isPlaying) return;

    speechController.speakLine(
      currentLine,
      { ...speechPersona, rate: speechPersona.rate * playbackSpeed },
      undefined,
      () => {
        // When line finishes, advance
        if (currentLineIndex < activeAct.narrationText.length - 1) {
          setCurrentLineIndex(prev => prev + 1);
          // Advance shot roughly matching line progression
          const shotRatio = (currentLineIndex + 1) / activeAct.narrationText.length;
          const targetShot = Math.min(
            activeAct.cameraShots.length - 1, 
            Math.floor(shotRatio * activeAct.cameraShots.length)
          );
          setCurrentShotIndex(targetShot);
        } else {
          // Act finished -> go to next act
          if (currentActIndex < SCRIPT_ACTS.length - 1) {
            setCurrentActIndex(prev => prev + 1);
            setCurrentLineIndex(0);
            setCurrentShotIndex(0);
          } else {
            setIsPlaying(false);
          }
        }
      }
    );
  }, [isPlaying, currentLine, speechPersona, playbackSpeed, currentLineIndex, activeAct, currentActIndex]);

  // Sync speech playback
  useEffect(() => {
    if (isPlaying) {
      speakCurrentLine();
    } else {
      speechController.stop();
    }
  }, [isPlaying, currentActIndex, currentLineIndex, speakCurrentLine]);

  // Handle Play / Pause
  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (!ambientAudioOn) {
        noirAudio.start(0.35);
        setAmbientAudioOn(true);
      }
    } else {
      setIsPlaying(false);
      speechController.stop();
    }
  };

  // Jump to specific act
  const jumpToAct = (idx: number) => {
    speechController.stop();
    setCurrentActIndex(idx);
    setCurrentLineIndex(0);
    setCurrentShotIndex(0);
    if (onSelectActInScript) {
      onSelectActInScript(SCRIPT_ACTS[idx].id);
    }
  };

  // Next / Prev Act
  const nextAct = () => {
    if (currentActIndex < SCRIPT_ACTS.length - 1) {
      jumpToAct(currentActIndex + 1);
    }
  };

  const prevAct = () => {
    if (currentActIndex > 0) {
      jumpToAct(currentActIndex - 1);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.warn(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
      setIsFullscreen(false);
    }
  };

  // Calculate total progress
  const totalSeconds = 780; // ~13 mins
  const currentSeconds = activeAct.startSeconds + 
    ((currentLineIndex / Math.max(1, activeAct.narrationText.length)) * (activeAct.endSeconds - activeAct.startSeconds));
  const progressPercent = Math.min(100, Math.max(0, (currentSeconds / totalSeconds) * 100));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-black rounded-xl overflow-hidden border border-[#26262a] shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'h-screen rounded-none border-0' : 'aspect-video max-h-[720px]'
      }`}
    >
      {/* 1. CINEMATIC VIDEO CANVAS / IMAGE LAYER WITH KEN BURNS EFFECT */}
      <div className="absolute inset-0 overflow-hidden bg-[#070709]">
        {activeShot?.imagePlaceholder ? (
          <img 
            src={activeShot.imagePlaceholder} 
            alt={activeShot.description}
            key={`${currentActIndex}-${currentShotIndex}`}
            className={`w-full h-full object-cover select-none transition-transform duration-10000 ease-out ${
              isPlaying ? 'scale-108 translate-x-1' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-[#121216] flex items-center justify-center">
            <Film className="w-12 h-12 text-[#40404a]" />
          </div>
        )}

        {/* Noir Vignette & Grain Filter */}
        <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-black/40 to-black/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/70 pointer-events-none" />

        {/* Lightning Flash Effect during Act 3 Standoff */}
        {activeAct.id === 'act-3' && isPlaying && (
          <div className="absolute inset-0 bg-white/5 pointer-events-none animate-pulse duration-1000" />
        )}

        {/* Cinemascope 2.39:1 Letterboxing Bars (Toggleable) */}
        {cinemascopeBars && (
          <>
            <div className="absolute top-0 left-0 right-0 h-10 md:h-14 bg-black z-10 pointer-events-none border-b border-black" />
            <div className="absolute bottom-0 left-0 right-0 h-10 md:h-14 bg-black z-10 pointer-events-none border-t border-black" />
          </>
        )}
      </div>

      {/* 2. TOP HUD: CHAPTER WATERMARK & METADATA */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-cinzel tracking-widest text-[#d4af37] font-semibold uppercase text-xs sm:text-sm drop-shadow">
            THE QUEEN & THE SHADOW
          </span>
          <span className="text-[#a1a1aa]">·</span>
          <span className="text-[#f4eedb] tracking-wider font-medium text-xs hidden sm:inline">
            {activeAct.actNumber === 'COLD OPEN' || activeAct.actNumber === 'CTA' ? activeAct.actNumber : `ACT ${activeAct.actNumber}`}: {activeAct.title}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[#a1a1aa]">
          {/* Ambient Rain Indicator */}
          {ambientAudioOn && (
            <div className="flex items-center gap-1.5 text-xs text-[#d4af37] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-sm border border-[#d4af37]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
              <span>Noir Rain & Sub-Bass Active</span>
            </div>
          )}

          <div className="font-mono text-xs text-[#f4eedb] bg-black/50 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
            {formatTime(currentSeconds)} / 13:00
          </div>
        </div>
      </div>

      {/* 3. VISUAL MOTIF & EXPRESSION HUD BADGES */}
      {showMotifsHud && (
        <div className="absolute top-14 left-4 z-20 flex flex-col gap-1.5 max-w-sm pointer-events-none">
          {activeAct.keyMotifs && (
            <div className="bg-black/75 backdrop-blur-md border-l-2 border-[#dc2626] px-3 py-1.5 rounded-r text-[11px] text-[#f4eedb] shadow-lg">
              <span className="text-[#dc2626] font-semibold uppercase tracking-wider block text-[10px]">
                Visual Motif
              </span>
              <span className="text-stone-300 font-sans">{activeAct.keyMotifs.join(' · ')}</span>
            </div>
          )}

          {activeShot?.expressionGuide && (
            <div className="bg-black/75 backdrop-blur-md border-l-2 border-[#d4af37] px-3 py-1.5 rounded-r text-[11px] text-[#f4eedb] shadow-lg">
              <span className="text-[#d4af37] font-semibold uppercase tracking-wider block text-[10px]">
                Expression Guide
              </span>
              <span className="text-stone-300 font-sans">{activeShot.expressionGuide}</span>
            </div>
          )}
        </div>
      )}

      {/* 4. SUBTITLES & CINEMATIC NARRATION OVERLAY */}
      {showSubtitles && (
        <div className="absolute bottom-16 sm:bottom-20 left-4 right-4 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-3xl bg-black/80 backdrop-blur-md px-6 py-3 rounded-lg border border-white/10 shadow-2xl transition-all duration-300">
            <p className="font-cormorant text-lg sm:text-2xl md:text-3xl text-[#f4eedb] tracking-wide leading-relaxed font-medium">
              "{currentLine}"
            </p>
            <div className="mt-1 flex items-center justify-center gap-2 text-[10px] sm:text-xs text-[#a1a1aa] font-mono">
              <span className="text-[#d4af37]">Shot {activeShot.shotNumber}</span>
              <span>·</span>
              <span className="text-stone-400">{activeShot.shotType}</span>
              <span>·</span>
              <span>{activeShot.cameraMovement}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. PLAYER CONTROLS & TIMELINE HUD (BOTTOM) */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/90 to-transparent p-3 sm:p-4">
        {/* Scrub Bar / Timeline with Chapter Markers */}
        <div className="relative w-full h-2 group cursor-pointer mb-3">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden transition-all group-hover:h-2">
            <div 
              className="h-full bg-gradient-to-r from-[#dc2626] to-[#d4af37] rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Chapter Tick Marks */}
          <div className="absolute inset-0 flex justify-between pointer-events-none">
            {SCRIPT_ACTS.map((act, i) => {
              const actPos = (act.startSeconds / totalSeconds) * 100;
              return (
                <div 
                  key={act.id} 
                  className="absolute top-0 bottom-0 w-0.5 bg-white/40 hover:bg-[#d4af37]"
                  style={{ left: `${actPos}%` }}
                  title={`${act.title} (${act.timestamp})`}
                />
              );
            })}
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between gap-2 text-[#f4eedb]">
          {/* Left Controls: Play / Prev / Next / Time */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={prevAct}
              title="Previous Act"
              className="p-1.5 rounded hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause Video' : 'Play Cinematic Video'}
              className="p-2 sm:p-2.5 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-lg shadow-red-900/40 transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={nextAct}
              title="Next Act"
              className="p-1.5 rounded hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <div className="text-xs font-mono text-stone-300 hidden sm:block">
              {formatTime(currentSeconds)} / 13:00
            </div>
          </div>

          {/* Center: Act Quick Selector Tabs */}
          <div className="hidden lg:flex items-center gap-1 bg-black/60 border border-white/10 rounded-lg p-0.5 text-xs">
            {SCRIPT_ACTS.map((act, idx) => (
              <button
                key={act.id}
                onClick={() => jumpToAct(idx)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  idx === currentActIndex 
                    ? 'bg-[#d4af37] text-black font-semibold shadow' 
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {act.actNumber === 'COLD OPEN' ? 'Open' : act.actNumber === 'CTA' ? 'Outro' : `Act ${act.actNumber}`}
              </button>
            ))}
          </div>

          {/* Right Controls: Ambience / Persona / Subtitles / Scope / Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ambient Noir Rain Soundtrack Toggle */}
            <button
              onClick={toggleAmbientAudio}
              title={ambientAudioOn ? 'Mute Noir Ambience' : 'Play Noir Rain & Sub-Bass'}
              className={`p-1.5 rounded transition-colors flex items-center gap-1 text-xs ${
                ambientAudioOn ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-stone-400 hover:text-white'
              }`}
            >
              {ambientAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline text-[11px]">Ambience</span>
            </button>

            {/* Subtitles Toggle */}
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              title="Toggle Subtitles"
              className={`p-1.5 rounded transition-colors ${
                showSubtitles ? 'text-[#d4af37]' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Motifs HUD Toggle */}
            <button
              onClick={() => setShowMotifsHud(!showMotifsHud)}
              title="Toggle Visual Motifs HUD"
              className={`p-1.5 rounded transition-colors ${
                showMotifsHud ? 'text-[#dc2626]' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Cinemascope Bars Toggle */}
            <button
              onClick={() => setCinemascopeBars(!cinemascopeBars)}
              title="Cinemascope 2.39:1 Letterbox"
              className={`p-1.5 rounded transition-colors hidden sm:block ${
                cinemascopeBars ? 'text-[#d4af37]' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4" />
            </button>

            {/* Speed Selector */}
            <div className="hidden sm:flex items-center text-xs text-stone-300">
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="bg-black/60 border border-white/20 text-[#f4eedb] text-xs rounded px-1.5 py-1 focus:outline-none focus:border-[#d4af37]"
                title="Playback Speed"
              >
                <option value={0.75}>0.75x</option>
                <option value={1.0}>1.0x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>
            </div>

            {/* Record / Export Video Action */}
            {onOpenRecorder && (
              <button
                onClick={onOpenRecorder}
                title="Render & Export Video"
                className="px-2.5 py-1 bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-black font-semibold text-xs rounded flex items-center gap-1.5 hover:brightness-110 active:scale-95 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Export Video</span>
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="p-1.5 rounded hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
