class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.audioCtx.destination);
    }
    return this.audioCtx;
  }

  public unlock() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start();
    osc.stop(ctx.currentTime + 0.001);
  }

  private createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private playTone(frequency: number, type: OscillatorType, duration: number, volume: number = 1.0) {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain!);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  public playCountdown() {
    this.playTone(600, 'sine', 0.1);
  }

  public playStartBuzz() {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain!);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);

    // Layer with noise burst at the peak
    setTimeout(() => {
      const noiseBuffer = this.createNoiseBuffer(ctx, 0.1);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      noiseSource.connect(noiseGain);
      noiseGain.connect(this.masterGain!);
      noiseSource.start();
    }, 300);
  }

  public playFinish() {
    const ctx = this.getContext();
    // C4, E4, G4, C5
    const freqs = [261.63, 329.63, 392.00, 523.25];
    const duration = 0.15;

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';

      const startTime = ctx.currentTime + (i * 0.1);
      osc.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.6, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  public playTimeOut(type: 'buzzer' | 'digital') {
    if (type === 'buzzer') {
      this.playTone(130, 'sawtooth', 0.8, 0.8);
    } else {
      const ctx = this.getContext();
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'square';

        const startTime = ctx.currentTime + (i * 0.15);
        const duration = 0.08;

        osc.frequency.setValueAtTime(2000, startTime);

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.4, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.masterGain!);

        osc.start(startTime);
        osc.stop(startTime + duration);
      }
    }
  }

  public playUiPop() {
    this.playTone(1200, 'triangle', 0.02, 0.3);
  }

  public playBottleSpin(durationMs: number) {
    const duration = durationMs / 1000;
    const ctx = this.getContext();

    const noiseBuffer = this.createNoiseBuffer(ctx, duration);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(800, ctx.currentTime);
    bandpass.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(1.0, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    // LFO for wobbling scrape
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(8, ctx.currentTime); // 8 Hz wobble
    lfo.frequency.linearRampToValueAtTime(1, ctx.currentTime + duration); // slows down

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.8;
    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);

    noiseSource.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(this.masterGain!);

    noiseSource.start();
    lfo.start();
    noiseSource.stop(ctx.currentTime + duration);
    lfo.stop(ctx.currentTime + duration);
  }

  public playBottleStop() {
    const ctx = this.getContext();

    // Thud
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);

    oscGain.gain.setValueAtTime(1.0, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain!);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);

    // Noise bump
    const noiseBuffer = this.createNoiseBuffer(ctx, 0.1);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 200;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    noiseSource.connect(lowpass);
    lowpass.connect(noiseGain);
    noiseGain.connect(this.masterGain!);
    noiseSource.start();
  }
}

export const soundEngine = new SoundEngine();
