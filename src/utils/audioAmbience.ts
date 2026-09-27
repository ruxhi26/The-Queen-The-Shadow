/**
 * Procedural Web Audio API soundscape generator for film noir & dark mafia ambience.
 * Generates continuous rain on window, subtle analog tape texture, and deep cinematic sub-bass drone.
 */
class NoirSoundscapeGenerator {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private rainNode: AudioNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private droneGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start(volume = 0.4) {
    if (this.isPlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(volume, now);
      this.masterGain.connect(this.ctx.destination);

      // --- 1. PROCEDURAL RAIN (Pink Noise with Dual Filtering) ---
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // scale down
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter rain to sound like glass pane window rain
      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(950, now);

      const rainHighpass = this.ctx.createBiquadFilter();
      rainHighpass.type = 'highpass';
      rainHighpass.frequency.setValueAtTime(180, now);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.35, now);

      whiteNoise.connect(rainHighpass);
      rainHighpass.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);
      whiteNoise.start(now);
      this.rainNode = whiteNoise;

      // --- 2. CINEMATIC SUB-BASS NOIR DRONE (55Hz / A1) ---
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(55, now); // A1 note

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(54.6, now); // subtle detune beat

      const droneFilter = this.ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(140, now);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.18, now);

      this.droneOsc1.connect(droneFilter);
      this.droneOsc2.connect(droneFilter);
      droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);

      this.isPlaying = true;
    } catch (err) {
      console.warn('AudioContext autoplay or init issue:', err);
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    if (!this.isPlaying) return;
    try {
      if (this.rainNode) {
        (this.rainNode as AudioScheduledSourceNode).stop();
        this.rainNode.disconnect();
        this.rainNode = null;
      }
      if (this.droneOsc1) {
        this.droneOsc1.stop();
        this.droneOsc1.disconnect();
        this.droneOsc1 = null;
      }
      if (this.droneOsc2) {
        this.droneOsc2.stop();
        this.droneOsc2.disconnect();
        this.droneOsc2 = null;
      }
      this.isPlaying = false;
    } catch (err) {
      console.warn('Error stopping soundscape:', err);
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const noirAudio = new NoirSoundscapeGenerator();
