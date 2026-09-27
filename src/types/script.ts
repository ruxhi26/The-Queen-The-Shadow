export interface ScriptAct {
  id: string;
  actNumber: number | string; // 'COLD OPEN' | 1 | 2 | 3 | 4 | 5 | 'CTA'
  title: string;
  subtitle?: string;
  timestamp: string; // e.g. "00:00–0:45"
  startSeconds: number;
  endSeconds: number;
  visualNote: string;
  narrationText: string[];
  cameraShots: StoryboardShot[];
  characterFocus: 'queen' | 'shadow' | 'both' | 'boss';
  keyMotifs: string[];
  expressionElena?: string;
  expressionShadow?: string;
}

export interface StoryboardShot {
  id: string;
  shotNumber: string;
  shotType: 'Extreme Close-Up' | 'Close-Up' | 'Medium Shot' | 'Match Cut' | 'Wide Shot' | 'Over-the-Shoulder' | 'Freeze Frame';
  description: string;
  cameraMovement: string;
  lightingMood: string;
  visualMotif: string;
  expressionGuide: string;
  imagePlaceholder?: string;
}

export interface CharacterProfile {
  name: string;
  alias: string;
  role: string;
  traits: string[];
  backstory: string;
  wardrobe: {
    item: string;
    description: string;
    symbolism: string;
  }[];
  expressions: {
    name: string;
    usage: string;
    description: string;
  }[];
  voiceTone: string;
  keyQuote: string;
  primaryImage: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
  aestheticUsage: string;
}
