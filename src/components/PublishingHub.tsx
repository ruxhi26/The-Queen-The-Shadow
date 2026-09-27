import React, { useState } from 'react';
import { 
  Youtube, Copy, Check, Download, FileText, Tag, Clock, 
  ExternalLink, Sparkles, Share2, Layers
} from 'lucide-react';
import { SCRIPT_ACTS, TITLE_OPTIONS, YOUTUBE_METADATA } from '../data/scriptData';
import { generateSrt, generateVtt, generateScriptText, downloadTextFile } from '../utils/exportUtils';

export const PublishingHub: React.FC = () => {
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(TITLE_OPTIONS[0].title);

  const copyDescription = () => {
    navigator.clipboard.writeText(YOUTUBE_METADATA.descriptionTemplate);
    setCopiedDescription(true);
    setTimeout(() => setCopiedDescription(false), 2000);
  };

  const copyTags = () => {
    navigator.clipboard.writeText(YOUTUBE_METADATA.tags.join(', '));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const copyTitleText = (title: string) => {
    navigator.clipboard.writeText(title);
    setSelectedTitle(title);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const downloadSrtFile = () => {
    const srt = generateSrt(SCRIPT_ACTS);
    downloadTextFile(srt, 'The_Queen_and_The_Shadow_Subtitles.srt', 'text/plain');
  };

  const downloadVttFile = () => {
    const vtt = generateVtt(SCRIPT_ACTS);
    downloadTextFile(vtt, 'The_Queen_and_The_Shadow_Subtitles.vtt', 'text/vtt');
  };

  const downloadFullScript = () => {
    const txt = generateScriptText(SCRIPT_ACTS);
    downloadTextFile(txt, 'The_Queen_and_The_Shadow_Full_Script.txt', 'text/plain');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#26262a] pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
              YouTube Studio · Distribution & Packaging
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold mt-1">
              YouTube Publishing Suite
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
              1-click export for descriptions, timestamps, tags, and subtitle caption files (.SRT / .VTT) formatted specifically for YouTube Studio upload.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadFullScript}
              className="px-3.5 py-2 bg-[#1b1b22] hover:bg-[#252530] text-stone-300 hover:text-white border border-[#303038] text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              Download Script (.txt)
            </button>
            <button
              onClick={downloadSrtFile}
              className="px-3.5 py-2 bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 shadow hover:brightness-110 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download Subtitles (.srt)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Description & Tags */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: YouTube Description & Timestamps (7 Cols) */}
        <div className="lg:col-span-7 bg-[#141418] border border-[#26262a] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#26262a] pb-3">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-[#dc2626]" />
              <h3 className="font-cinzel font-bold text-white text-base">
                YouTube Description & Chapters
              </h3>
            </div>

            <button
              onClick={copyDescription}
              className="px-3 py-1.5 bg-[#1e1e26] hover:bg-[#282834] text-stone-300 hover:text-white text-xs rounded-lg border border-stone-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedDescription ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Description</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-[#0d0d10] border border-[#222228] rounded-lg text-xs font-mono text-stone-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {YOUTUBE_METADATA.descriptionTemplate}
          </pre>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-[#0d0d10] border border-[#222228] rounded-lg text-center">
              <span className="text-[10px] text-stone-500 font-mono uppercase block">Estimated Length</span>
              <span className="text-sm font-bold text-[#d4af37] font-mono">12–14 Min</span>
            </div>
            <div className="p-3 bg-[#0d0d10] border border-[#222228] rounded-lg text-center">
              <span className="text-[10px] text-stone-500 font-mono uppercase block">Word Count</span>
              <span className="text-sm font-bold text-white font-mono">~840 Words</span>
            </div>
            <div className="p-3 bg-[#0d0d10] border border-[#222228] rounded-lg text-center">
              <span className="text-[10px] text-stone-500 font-mono uppercase block">Key Visual Cues</span>
              <span className="text-sm font-bold text-[#dc2626] font-mono">19 Shots</span>
            </div>
          </div>
        </div>

        {/* Right: Suggested Tags & Captions Exporter (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tags Box */}
          <div className="bg-[#141418] border border-[#26262a] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#26262a] pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#d4af37]" />
                <h3 className="font-cinzel font-bold text-white text-base">
                  Suggested YouTube Tags
                </h3>
              </div>

              <button
                onClick={copyTags}
                className="px-3 py-1.5 bg-[#1e1e26] hover:bg-[#282834] text-stone-300 hover:text-white text-xs rounded-lg border border-stone-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedTags ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All Tags</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {YOUTUBE_METADATA.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-[#0d0d10] border border-[#26262c] text-xs text-stone-300 rounded hover:border-[#d4af37] transition-colors select-all"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-[11px] text-stone-500 italic">
              Pre-formatted for direct pasting into the YouTube Studio "Tags" field.
            </p>
          </div>

          {/* Subtitles & Captions Exporter */}
          <div className="bg-[#141418] border border-[#26262a] rounded-xl p-6 space-y-4">
            <h3 className="font-cinzel font-bold text-white text-base">
              Subtitle & Closed Captions
            </h3>
            <p className="text-xs text-stone-400">
              Upload synchronized captions directly to YouTube to boost audience retention, accessibility, and international reach.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={downloadSrtFile}
                className="p-3 bg-[#0d0d10] hover:bg-[#181820] border border-[#26262e] rounded-lg text-left transition-colors group"
              >
                <span className="font-mono text-xs font-bold text-[#d4af37] block group-hover:text-white">
                  .SRT SubRip
                </span>
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  Standard YouTube format
                </span>
              </button>

              <button
                onClick={downloadVttFile}
                className="p-3 bg-[#0d0d10] hover:bg-[#181820] border border-[#26262e] rounded-lg text-left transition-colors group"
              >
                <span className="font-mono text-xs font-bold text-[#d4af37] block group-hover:text-white">
                  .VTT WebVTT
                </span>
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  Web player compatible
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
