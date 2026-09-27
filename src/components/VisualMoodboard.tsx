import React, { useState } from 'react';
import { 
  Sparkles, Eye, Copy, Check, Download, Layers, Palette, 
  Film, Compass, Camera, Shield, Crown, Maximize2, ExternalLink
} from 'lucide-react';

// Motif Assets
import redHeelsMarble from '../assets/images/red_heels_marble_1790494524913.jpg';
import goldWatchBlazer from '../assets/images/gold_watch_blazer_1790494542906.jpg';
import citySkylineNight from '../assets/images/city_skyline_night_1790494556702.jpg';
import blackCarArrival from '../assets/images/black_car_arrival_1790494571587.jpg';
import handgunLedger from '../assets/images/handgun_ledger_motif_1790494587487.jpg';
import queenShadowThrone from '../assets/images/queen_shadow_throne_1790494117170.jpg';
import queenCloseup from '../assets/images/queen_closeup_1790494082144.jpg';
import shadowAlley from '../assets/images/shadow_alley_1790494153864.jpg';
import act3Standoff from '../assets/images/act3_standoff_1790494251849.jpg';

export interface VisualMotifCard {
  id: string;
  title: string;
  category: 'Key Motif' | 'Wardrobe & Texture' | 'Prop & Artifact' | 'Environment';
  image: string;
  paletteFocus: string[];
  description: string;
  productionNote: string;
  cinematicRole: string;
  promptRecipe: string;
  aspect: 'square' | 'landscape';
}

export const VISUAL_MOTIFS: VisualMotifCard[] = [
  {
    id: 'red-heels-marble',
    title: 'Red Heels Striking Marble',
    category: 'Key Motif',
    image: redHeelsMarble,
    paletteFocus: ['#DC2626 (Blood Red)', '#0A0A0C (Obsidian Marble)', '#D4AF37 (Gold Reflection)'],
    description: 'Vibrant patent crimson stilettos stepping deliberately onto high-gloss black marble with crisp, echoing reflections.',
    productionNote: 'Elena\'s entrance signature. Echoes like a countdown clock whenever she enters a room full of dangerous men.',
    cinematicRole: 'Opening cadence in Cold Open (00:15) and recurring auditory/visual power marker.',
    promptRecipe: 'Cinematic extreme close-up of glossy crimson red patent leather stiletto heels stepping onto reflective dark black Italian marble floor. Luxury dark mafia penthouse, subtle gold rim reflections, noir lighting, 8k resolution.',
    aspect: 'square'
  },
  {
    id: 'gold-watch-blazer',
    title: 'Gold Watch & Tailored Silk Blazer',
    category: 'Wardrobe & Texture',
    image: goldWatchBlazer,
    paletteFocus: ['#D4AF37 (Champagne Gold)', '#0A0A0C (Silk Black)', '#1E1E22 (Charcoal)'],
    description: 'Understated Swiss luxury gold timepiece paired with crisp bespoke double-breasted silk blazer cuff and black leather gloves.',
    productionNote: 'Elena\'s weapon of patience and The Shadow\'s tactical precision. Every second accounted for.',
    cinematicRole: 'Featured in close-up glances during negotiations, countdown beats, and throne poses.',
    promptRecipe: 'Luxury aesthetic close-up of an exquisite Swiss gold watch with black leather strap on a wrist, beside the cuff of a sharp tailored black silk blazer and supple black leather driving gloves. Dark noir cinematic lighting, gold glow.',
    aspect: 'square'
  },
  {
    id: 'city-skyline-night',
    title: 'City Skyline at Night (Bookend)',
    category: 'Environment',
    image: citySkylineNight,
    paletteFocus: ['#0A0A0C (Night Sky)', '#D4AF37 (Golden Bokeh)', '#1E1E22 (Charcoal Towers)'],
    description: 'Panoramic metropolitan expanse viewed through rain-beaded glass. High-rise penthouse towers shrouded in velvet mist.',
    productionNote: 'The city they rule. Used as visual bookends: opening the cold open and closing Act 5.',
    cinematicRole: 'Symbolizes their empire and perspective looking down upon the city that once wrote them off.',
    promptRecipe: 'Atmospheric panoramic view of a massive glowing metropolitan city skyline at night, seen through tall rain-streaked penthouse glass windows. Warm golden bokeh lights, skyscrapers in dark charcoal mist, cinematic film noir.',
    aspect: 'landscape'
  },
  {
    id: 'black-car-arrival',
    title: 'The Armored Black Sedan',
    category: 'Prop & Artifact',
    image: blackCarArrival,
    paletteFocus: ['#0A0A0C (Gloss Black)', '#D4AF37 (Amber Streetlight)', '#1E1E22 (Wet Asphalt)'],
    description: 'Sleek luxury black armored sedan gliding through rain-slicked city streets, steam rising quietly from the exhaust.',
    productionNote: 'Reuse prop for opening arrival and syndicate transports. Represents silent, impenetrable mobility.',
    cinematicRole: 'Cold Open arrival shot (00:00–0:45) and tactical getaway vehicle.',
    promptRecipe: 'Sleek luxury black armored sedan car parked silently on wet rainy city asphalt at night. Raindrops beading on polished black hood, mist in cool air, warm amber streetlight reflections in street puddles, noir crime romance.',
    aspect: 'landscape'
  },
  {
    id: 'handgun-ledger',
    title: 'Lowered Handgun & The Ledger',
    category: 'Prop & Artifact',
    image: handgunLedger,
    paletteFocus: ['#DC2626 (Red Ink)', '#0A0A0C (Matte Gun)', '#F4EEDB (Aged Paper)'],
    description: 'Matte black semi-automatic weapon resting silently beside an open ledger with financial betrayal circled in red ink.',
    productionNote: 'Shown, never fired on-screen, for a mature-but-not-graphic psychological romance tone.',
    cinematicRole: 'Act 3 climax: The exact pivot where an assassination order transforms into a lifelong mutual alliance.',
    promptRecipe: 'High-tension cinematic still life of a matte black handgun resting gently beside an open vintage black leather financial ledger on a dark mahogany desk. Numbers in calligraphy, circled in crimson red ink, warm desk lamp glow.',
    aspect: 'square'
  },
  {
    id: 'leather-armchair-throne',
    title: 'The Leather Armchair & Shoulder Pose',
    category: 'Key Motif',
    image: queenShadowThrone,
    paletteFocus: ['#0A0A0C (Obsidian Suit)', '#DC2626 (Red Stilettos)', '#D4AF37 (Gold Highlights)'],
    description: 'Elena seated regally with legs crossed in vintage leather armchair; The Shadow standing half a step behind her right shoulder.',
    productionNote: 'The iconic reference sheet composition that establishes their dynamic: Together... They Rule.',
    cinematicRole: 'Closing freeze frame of Cold Open and Act 5 finale title card.',
    promptRecipe: 'Cinematic scene of Elena The Queen seated regally in black leather armchair in black pant suit and red stiletto heels. Standing behind her shoulder is The Shadow in black suit and leather gloves. Rain on glass skyline at night, anime manhwa art style.',
    aspect: 'landscape'
  }
];

export const VisualMoodboard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMotif, setSelectedMotif] = useState<VisualMotifCard | null>(VISUAL_MOTIFS[0]);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const categories = ['all', 'Key Motif', 'Wardrobe & Texture', 'Prop & Artifact', 'Environment'];

  const filteredMotifs = activeCategory === 'all'
    ? VISUAL_MOTIFS
    : VISUAL_MOTIFS.filter(m => m.category === activeCategory);

  const copyPrompt = (motif: VisualMotifCard) => {
    navigator.clipboard.writeText(motif.promptRecipe);
    setCopiedPromptId(motif.id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#26262a] pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
              Cinematic Aesthetics & Reference Sheets
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold mt-1">
              Visual Moodboard & Motifs
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
              Generated using the Image Generation system to ground the production's visual motifs: marble textures, red stiletto heels, Swiss gold timepieces, night skyline bookends, black armored vehicles, and the lowered handgun pact.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#d4af37] text-black font-semibold shadow'
                    : 'bg-[#18181f] text-stone-400 hover:text-white border border-[#2a2a32]'
                }`}
              >
                {cat === 'all' ? 'All Motifs (6)' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Production Visual Constitution Callout */}
      <div className="p-4 bg-[#141418] border-l-4 border-[#d4af37] rounded-r-xl border-y border-r border-[#26262a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
              Production Rule · Strict Consistency
            </span>
          </div>
          <p className="text-xs text-[#f4eedb]">
            <strong className="text-white">Recurring Motifs:</strong> Red heels striking marble/concrete · Gold watch · Black tailored blazer · Leather gloves · City skyline at night · Lowered handgun (never fired on-screen).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-stone-400 font-mono">Palette:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#0a0a0c] border border-stone-600" title="Black" />
            <span className="w-4 h-4 rounded-full bg-[#1e1e22] border border-stone-600" title="Charcoal" />
            <span className="w-4 h-4 rounded-full bg-[#dc2626]" title="Blood Red" />
            <span className="w-4 h-4 rounded-full bg-[#d4af37]" title="Gold / Champagne" />
            <span className="w-4 h-4 rounded-full bg-[#f4eedb]" title="White / Ivory" />
          </div>
        </div>
      </div>

      {/* Hero Showcase of Selected Motif */}
      {selectedMotif && (
        <div className="bg-[#121216] border border-[#2a2a30] rounded-xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Main Visual Artwork with Noir Lighting overlay */}
          <div className="lg:col-span-7 relative bg-black min-h-[320px] lg:min-h-[440px] flex items-center justify-center overflow-hidden group">
            <img 
              src={selectedMotif.image} 
              alt={selectedMotif.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Noir Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded text-xs font-mono text-[#d4af37] border border-white/10">
              {selectedMotif.category.toUpperCase()}
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-300 bg-black/80 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
              <span className="font-semibold text-white">{selectedMotif.title}</span>
              <span className="text-[11px] font-mono text-[#d4af37]">Production Motif Asset</span>
            </div>
          </div>

          {/* Details & Production Staging Inspector */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6 bg-[#141418]">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#dc2626] font-semibold">
                  Aesthetic Directive & Symbolism
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl text-white font-bold mt-0.5">
                  {selectedMotif.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#f4eedb] leading-relaxed">
                {selectedMotif.description}
              </p>

              {/* Production Note */}
              <div className="p-3 bg-[#0c0c10] border-l-2 border-[#d4af37] rounded-r text-xs space-y-1">
                <span className="text-[#d4af37] font-semibold text-[11px] block uppercase font-mono">
                  Production Note:
                </span>
                <p className="text-stone-300 italic">
                  "{selectedMotif.productionNote}"
                </p>
              </div>

              {/* Scene Application */}
              <div className="text-xs text-stone-300">
                <strong className="text-stone-400 block mb-1 font-mono uppercase text-[10px]">
                  Cinematic Timing & Execution:
                </strong>
                {selectedMotif.cinematicRole}
              </div>

              {/* Palette Accent Focus */}
              <div>
                <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1.5">
                  Palette Swatches in Shot:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMotif.paletteFocus.map((p, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 bg-black/60 border border-white/10 text-[11px] text-stone-300 font-mono rounded"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Prompt Copy Action */}
            <div className="border-t border-[#26262a] pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-mono text-[10px] uppercase">Midjourney / Flux / Gemini Prompt:</span>
                {copiedPromptId === selectedMotif.id && (
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1 font-mono">
                    <Check className="w-3 h-3" /> Copied!
                  </span>
                )}
              </div>
              <div 
                onClick={() => copyPrompt(selectedMotif)}
                className="p-3 bg-[#0a0a0d] border border-[#2a2a32] hover:border-[#d4af37] rounded-lg text-[11px] font-mono text-stone-300 cursor-pointer transition-colors group flex items-start justify-between gap-3"
              >
                <span className="line-clamp-2 italic">"{selectedMotif.promptRecipe}"</span>
                <Copy className="w-4 h-4 text-stone-500 group-hover:text-white shrink-0 mt-0.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of All Moodboard Motifs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-cinzel text-lg text-white font-bold">
            Motif Catalog & High-Fidelity Assets
          </h3>
          <span className="text-xs text-stone-400 font-mono">
            Click any card to inspect staging notes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMotifs.map((motif) => {
            const isSelected = selectedMotif?.id === motif.id;
            return (
              <div
                key={motif.id}
                onClick={() => setSelectedMotif(motif)}
                className={`group bg-[#141418] border rounded-xl overflow-hidden cursor-pointer transition-all shadow-lg flex flex-col ${
                  isSelected
                    ? 'border-[#d4af37] ring-1 ring-[#d4af37]/40 shadow-amber-950/20'
                    : 'border-[#26262a] hover:border-stone-500'
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={motif.image}
                    alt={motif.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#d4af37] border border-white/10">
                    {motif.category}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyPrompt(motif);
                    }}
                    title="Copy AI Prompt"
                    className="absolute top-2 right-2 bg-black/80 backdrop-blur-md p-1.5 rounded text-stone-300 hover:text-white border border-white/10 hover:border-[#d4af37] transition-all"
                  >
                    {copiedPromptId === motif.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-cinzel text-base text-white font-bold group-hover:text-[#d4af37] transition-colors">
                      {motif.title}
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                      {motif.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#222228] flex items-center justify-between text-[11px] text-stone-500 font-mono">
                    <span className="text-[#dc2626] font-medium">Motif Focus</span>
                    <span className="text-stone-400 group-hover:text-white flex items-center gap-1">
                      Inspect <Eye className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
