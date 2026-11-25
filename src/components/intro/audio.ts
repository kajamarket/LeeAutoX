// Procedural Web Audio engine for starting-grid countdown beeps and V8/V10 engine rev.
// Starts muted by default and creates AudioContext lazily upon user interaction.

class StartingGridAudio {
  private ctx: AudioContext | null = null;
  private muted = true;
  private noiseBuffer: AudioBuffer | null = null;

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(nextMuted: boolean): void {
    this.muted = nextMuted;
    if (!nextMuted) {
      this.ensureContext();
    }
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      try {
        this.ctx = new AudioCtx();
      } catch {
        return null;
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const length = Math.floor(ctx.sampleRate * 1.4);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  public playCountdownBeep(isGo: boolean): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.connect(ctx.destination);

    if (!isGo) {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(220, now);

      master.gain.setValueAtTime(0.001, now);
      master.gain.exponentialRampToValueAtTime(0.14, now + 0.015);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc1.connect(master);
      osc2.connect(master);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.19);
      osc2.stop(now + 0.19);
    } else {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.linearRampToValueAtTime(932, now + 0.14);
      osc.frequency.linearRampToValueAtTime(880, now + 0.48);

      master.gain.setValueAtTime(0.001, now);
      master.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc.connect(master);
      osc.start(now);
      osc.stop(now + 0.56);
    }
  }

  public playEngineRev(): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const dur = 1.28;

    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = Math.tanh(x * 2.6);
    }
    shaper.curve = curve;
    shaper.oversample = '2x';

    const formant = ctx.createBiquadFilter();
    formant.type = 'lowpass';
    formant.Q.setValueAtTime(3.4, now);
    formant.frequency.setValueAtTime(240, now);
    formant.frequency.exponentialRampToValueAtTime(1650, now + 0.36);
    formant.frequency.exponentialRampToValueAtTime(420, now + dur);

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.001, now);
    master.gain.exponentialRampToValueAtTime(0.22, now + 0.12);
    master.gain.setValueAtTime(0.2, now + 0.52);
    master.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    shaper.connect(formant);
    formant.connect(master);
    master.connect(ctx.destination);

    const oscFundamental = ctx.createOscillator();
    oscFundamental.type = 'sawtooth';
    oscFundamental.frequency.setValueAtTime(48, now);
    oscFundamental.frequency.exponentialRampToValueAtTime(162, now + 0.35);
    oscFundamental.frequency.exponentialRampToValueAtTime(108, now + dur);

    const oscOctave = ctx.createOscillator();
    oscOctave.type = 'sawtooth';
    oscOctave.frequency.setValueAtTime(96.5, now);
    oscOctave.frequency.exponentialRampToValueAtTime(325, now + 0.35);
    oscOctave.frequency.exponentialRampToValueAtTime(217, now + dur);

    const oscGrowl = ctx.createOscillator();
    oscGrowl.type = 'triangle';
    oscGrowl.frequency.setValueAtTime(72, now);
    oscGrowl.frequency.exponentialRampToValueAtTime(243, now + 0.35);
    oscGrowl.frequency.exponentialRampToValueAtTime(162, now + dur);

    const g1 = ctx.createGain();
    const g2 = ctx.createGain();
    const g3 = ctx.createGain();
    g1.gain.value = 0.5;
    g2.gain.value = 0.3;
    g3.gain.value = 0.35;

    oscFundamental.connect(g1).connect(shaper);
    oscOctave.connect(g2).connect(shaper);
    oscGrowl.connect(g3).connect(shaper);

    // Intake air hiss
    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer(ctx);
    const intakeFilter = ctx.createBiquadFilter();
    intakeFilter.type = 'bandpass';
    intakeFilter.Q.value = 1.6;
    intakeFilter.frequency.setValueAtTime(750, now);
    intakeFilter.frequency.exponentialRampToValueAtTime(2200, now + 0.45);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.08, now + 0.3);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    noise.connect(intakeFilter).connect(noiseGain).connect(ctx.destination);

    oscFundamental.start(now);
    oscOctave.start(now);
    oscGrowl.start(now);
    noise.start(now);

    oscFundamental.stop(now + dur);
    oscOctave.stop(now + dur);
    oscGrowl.stop(now + dur);
    noise.stop(now + dur);
  }

  public dispose(): void {
    this.muted = true;
    this.noiseBuffer = null;
    if (this.ctx) {
      const ctxToClose = this.ctx;
      this.ctx = null;
      ctxToClose.close().catch(() => {});
    }
  }
}

export const startingGridAudio = new StartingGridAudio();
