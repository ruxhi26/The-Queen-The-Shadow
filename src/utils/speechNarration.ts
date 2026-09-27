/**
 * Narration controller utilizing browser Web Speech API.
 * Provides act-by-act continuous speech, sentence tracking, and voice tone profiles.
 */

export interface VoicePersona {
  id: string;
  name: string;
  description: string;
  pitch: number;
  rate: number;
  genderPref: 'female' | 'male' | 'narrator';
}

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'narrator',
    name: 'Cinematic Noir Narrator',
    description: 'Measured, rich, atmospheric pacing suited for dark romance audiobooks.',
    pitch: 0.9,
    rate: 0.95,
    genderPref: 'narrator'
  },
  {
    id: 'queen',
    name: 'The Queen (Elena’s Tone)',
    description: 'Calm, sharp, velvet-toned, calculating and fearless.',
    pitch: 1.05,
    rate: 1.0,
    genderPref: 'female'
  },
  {
    id: 'shadow',
    name: 'The Shadow (Enforcer’s Tone)',
    description: 'Deep, deliberate, low-pitch, protective and unwavering.',
    pitch: 0.75,
    rate: 0.9,
    genderPref: 'male'
  }
];

class ScriptSpeechController {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private isPaused = false;
  private activeActIndex = 0;
  private activeLineIndex = 0;
  private onLineChangeCallback?: (actIdx: number, lineIdx: number) => void;
  private onEndCallback?: () => void;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public speakLine(
    text: string,
    persona: VoicePersona,
    voiceName?: string,
    onFinish?: () => void
  ) {
    if (!this.synth) return;
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const availableVoices = this.getVoices();

    if (voiceName) {
      const selected = availableVoices.find(v => v.name === voiceName);
      if (selected) utterance.voice = selected;
    } else {
      // Pick best matching English voice
      const enVoices = availableVoices.filter(v => v.lang.startsWith('en'));
      if (persona.genderPref === 'female') {
        const female = enVoices.find(v => /female|zira|samantha|karen|susan|victoria/i.test(v.name));
        if (female) utterance.voice = female;
      } else if (persona.genderPref === 'male') {
        const male = enVoices.find(v => /male|david|george|alex|daniel|tom/i.test(v.name));
        if (male) utterance.voice = male;
      } else {
        const natural = enVoices.find(v => /natural|enhanced|google|premium/i.test(v.name)) || enVoices[0];
        if (natural) utterance.voice = natural;
      }
    }

    utterance.pitch = persona.pitch;
    utterance.rate = persona.rate;

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      if (onFinish) onFinish();
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      this.isSpeaking = false;
      if (onFinish) onFinish();
    };

    this.currentUtterance = utterance;
    this.isSpeaking = true;
    this.isPaused = false;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  public resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
    }
  }

  public isActive(): boolean {
    return this.isSpeaking && !this.isPaused;
  }

  public isPausedState(): boolean {
    return this.isPaused;
  }
}

export const speechController = new ScriptSpeechController();
