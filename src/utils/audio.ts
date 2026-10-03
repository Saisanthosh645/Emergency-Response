/**
 * Pure Web Audio API sound synthesizer - zero external sound files required!
 */
class SoundEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // 1. SOS Countdown Pulse Tick
  playCountdownTick(freq: number = 800) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // safe ignore
    }
  }

  // 2. High Priority Siren for Incoming Dispatch
  playEmergencySiren(durationSec: number = 2.5) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      // 108 Indian emergency siren dual sweep
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.linearRampToValueAtTime(960, now + 0.35);
      osc.frequency.linearRampToValueAtTime(700, now + 0.7);
      osc.frequency.linearRampToValueAtTime(960, now + 1.05);
      osc.frequency.linearRampToValueAtTime(700, now + 1.4);
      osc.frequency.linearRampToValueAtTime(960, now + 1.75);
      osc.frequency.linearRampToValueAtTime(700, now + 2.1);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + durationSec);
    } catch {
      // safe ignore
    }
  }

  // 3. Positive Success Chord for Resolution / Acceptance
  playSuccessChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = this.ctx!.currentTime + idx * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {
      // safe ignore
    }
  }

  // 4. Alert Ping for Area Broadcast or Escalate
  playWarningBeep() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // safe ignore
    }
  }

  // 5. Radio Squelch & Chirp for Push-To-Talk Comms
  playRadioChirp() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.setValueAtTime(1800, now + 0.05);
      osc.frequency.setValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // safe ignore
    }
  }

  // 6. Loud Dual-Tone Emergency Ambulance Air Horn & Siren Blare
  playAmbulanceHorn(durationSec: number = 3.5) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Dual-tone heavy air horn harmonics (Standard Emergency Vehicle Horn)
      const hornFrequencies = [380, 475, 760];
      hornFrequencies.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = idx === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Subtle compressor flutter
        osc.frequency.linearRampToValueAtTime(freq * 1.02, now + 0.12);
        osc.frequency.linearRampToValueAtTime(freq * 0.98, now + 0.9);
        osc.frequency.linearRampToValueAtTime(freq, now + 1.8);

        gain.gain.setValueAtTime(0.24, now);
        gain.gain.setValueAtTime(0.24, now + durationSec - 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + durationSec);
      });

      // Layered sweeping 108 Indian emergency siren
      this.playEmergencySiren(durationSec);
    } catch {
      // safe ignore
    }
  }

  playAlert() {
    this.playWarningBeep();
  }

  playNotificationBeep() {
    this.playWarningBeep();
  }

  playSuccessBeep() {
    this.playSuccessChime();
  }

  // 7. Subtle Button Tap Feedback
  playButtonTap(freq: number = 750) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // safe ignore
    }
  }
}

export const sound = new SoundEngine();

export function triggerHaptic(pattern: number[] | string = [100, 50, 100]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      const p = Array.isArray(pattern) ? pattern : pattern === 'success' ? [50, 50, 50] : [100, 50, 100];
      navigator.vibrate(p);
    } catch {
      // ignore
    }
  }
}
