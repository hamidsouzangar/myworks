class SoundEngine {
  private audioCtx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioCtx;
  }

  // Must be called inside a direct user interaction (e.g. onClick) to unlock AudioContext on iOS Safari
  public unlock() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    // Play a silent tone to immediately bind the context to the interaction
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.001);
  }

  private playTone(frequency: number, type: OscillatorType, duration: number, volume: number = 0.5) {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Fade out to prevent clicking
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  public playCountdownBeep() {
    this.playTone(600, 'sine', 0.15, 0.3);
  }

  public playStartBuzz() {
    // Layering two square waves for a bright buzz
    this.playTone(800, 'square', 0.4, 0.4);
    this.playTone(805, 'square', 0.4, 0.2);
  }

  public playEndBuzz() {
    this.playTone(150, 'sawtooth', 0.8, 0.6);
  }

  public playHarshBeep() {
    this.playTone(400, 'triangle', 0.3, 0.5);
  }
}

export const soundEngine = new SoundEngine();
