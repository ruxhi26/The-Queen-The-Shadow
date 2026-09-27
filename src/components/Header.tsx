import React, { useState, useEffect } from 'react';
import { 
  Play, Film, Tv, Image, BookOpen, User, Youtube, Volume2, 
  VolumeX, Sparkles, Download, Crown, Shield, Palette, Bot
} from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';

export type StudioTab = 'video' | 'moodboard' | 'gemini' | 'script' | 'thumbnail' | 'storyboard' | 'dossier' | 'publishing';

interface HeaderProps {
  activeTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  onOpenRecorder: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onSelectTab,
  onOpenRecorder 
}) => {
  const [ambientAudioActive, setAmbientAudioActive] = useState(false);

  const toggleAmbience = () => {
    if (ambientAudioActive) {
      noirAudio.stop();
      setAmbientAudioActive(false);
    } else {
      noirAudio.start(0.35);
      setAmbientAudioActive(true);
    }
  };

  const navItems: { id: StudioTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'video', label: 'Cinema Video', icon: <Film className="w-4 h-4" />, badge: 'Watch' },
    { id: 'moodboard', label: 'Visual Moodboard', icon: <Palette className="w-4 h-4" />, badge: 'Motifs' },
    { id: 'gemini', label: 'Gemini AI Lab', icon: <Bot className="w-4 h-4" />, badge: 'Veo & AI' },
    { id: 'script', label: 'Screenplay Script', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'thumbnail', label: 'Thumbnail Studio', icon: <Image className="w-4 h-4" />, badge: 'Split' },
    { id: 'storyboard', label: 'Storyboard Shots', icon: <Tv className="w-4 h-4" /> },
    { id: 'dossier', label: 'Character Dossier', icon: <Crown className="w-4 h-4" /> },
    { id: 'publishing', label: 'YouTube Suite', icon: <Youtube className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/95 backdrop-blur-md border-b border-[#222228]">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#dc2626] to-[#d4af37] p-0.5 shadow-lg shadow-red-950/50 flex items-center justify-center">
              <div className="w-full h-full bg-[#0a0a0c] rounded-[7px] flex items-center justify-center">
                <Crown className="w-4 h-4 text-[#d4af37]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-cinzel font-extrabold text-base sm:text-lg tracking-wider text-white">
                  THE QUEEN <span className="text-[#d4af37] font-normal">&</span> THE SHADOW
                </h1>
                <span className="text-[10px] font-mono tracking-widest text-[#dc2626] uppercase hidden sm:inline">
                  Origin Story
                </span>
              </div>
              <div className="text-[11px] text-stone-400 font-sans hidden sm:block">
                Dark Mafia Romance · YouTube Studio & Cinema Production
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ambient Noir Rain Soundtrack Toggle */}
            <button
              onClick={toggleAmbience}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                ambientAudioActive
                  ? 'bg-[#d4af37]/15 border border-[#d4af37] text-[#d4af37] shadow-lg shadow-amber-950/20'
                  : 'bg-[#15151a] hover:bg-[#1f1f26] border border-[#2b2b34] text-stone-300'
              }`}
              title="Toggle Web Audio procedural noir rain & sub-bass ambience"
            >
              {ambientAudioActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                  <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="hidden md:inline">Ambience On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  <span className="hidden md:inline">Atmosphere</span>
                </>
              )}
            </button>

            {/* Video Exporter Modal Trigger */}
            <button
              onClick={onOpenRecorder}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#c5a059] hover:brightness-110 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Video</span>
            </button>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-[#1a1a20] scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#181820] text-white border-b-2 border-[#d4af37] font-semibold'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={isActive ? 'text-[#d4af37]' : 'text-stone-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded uppercase ${
                    isActive ? 'bg-[#d4af37] text-black font-bold' : 'bg-white/10 text-stone-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
