/**
 * Sistema de efectos de sonido y síntesis Web Audio API
 * Genera tonos suaves, chimes y fanfarrias sin requerir librerías externas ni archivos de terceros.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Tono musical suave (para juego de memoria)
  public playNote(frequency: number, duration: number = 0.35, waveType: OscillatorType = 'sine') {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Envolvente ADSR suave para evitar clics
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // Audio playback safety
    }
  }

  // Toque suave de botón
  public playClick() {
    this.playNote(587.33, 0.1, 'sine'); // D5
  }

  // Objeto o ingrediente colocado
  public playPlaceItem() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.2);
      });
    } catch {
      // Ignorar fallos de audio
    }
  }

  // Fanfarria de victoria / Recompensa obtenida
  public playSuccess() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playNote(freq, 0.35, 'triangle');
      }, index * 120);
    });
  }

  // Pista suave o toque incorrecto amigable
  public playGentleHint() {
    if (this.isMuted) return;
    const notes = [440, 415.3]; // A4 -> G#4
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playNote(freq, 0.2, 'sine');
      }, index * 140);
    });
  }

  private birthdayTimeouts: any[] = [];

  // Canción de cumpleaños sintetizada acústica para prueba/muestra
  public stopSampleBirthdaySong() {
    this.birthdayTimeouts.forEach((tid) => clearTimeout(tid));
    this.birthdayTimeouts = [];
  }

  public playSampleBirthdaySong(onFinish?: () => void, onProgress?: (percent: number) => void) {
    this.stopSampleBirthdaySong();
    if (this.isMuted) {
      if (onFinish) onFinish();
      return;
    }

    // C4, C4, D4, C4, F4, E4 | C4, C4, D4, C4, G4, F4 | C4, C4, C5, A4, F4, E4, D4 | Bb4, Bb4, A4, F4, G4, F4
    const score = [
      { f: 261.63, d: 250 }, // Cum
      { f: 261.63, d: 250 }, // plea
      { f: 293.66, d: 500 }, // ños
      { f: 261.63, d: 500 }, // fe
      { f: 349.23, d: 500 }, // liz
      { f: 329.63, d: 900 }, // te
      
      { f: 261.63, d: 250 }, // de
      { f: 261.63, d: 250 }, // se
      { f: 293.66, d: 500 }, // a
      { f: 261.63, d: 500 }, // mos
      { f: 392.00, d: 500 }, // a
      { f: 349.23, d: 900 }, // ti
      
      { f: 261.63, d: 250 }, // Ca
      { f: 261.63, d: 250 }, // mi
      { f: 523.25, d: 500 }, // la
      { f: 440.00, d: 500 }, // her
      { f: 349.23, d: 500 }, // mo
      { f: 329.63, d: 500 }, // sa
      { f: 293.66, d: 800 }, // ¡sí!
      
      { f: 466.16, d: 250 }, // Cum
      { f: 466.16, d: 250 }, // plea
      { f: 440.00, d: 500 }, // ños
      { f: 349.23, d: 500 }, // fe
      { f: 392.00, d: 600 }, // liz
      { f: 349.23, d: 1000 },// 💜
    ];

    let totalDuration = score.reduce((sum, item) => sum + item.d + 60, 0);
    let currentDelay = 0;

    score.forEach((note) => {
      const delay = currentDelay;
      const tid = setTimeout(() => {
        if (!this.isMuted) {
          this.playNote(note.f, note.d / 1000, 'sine');
        }
        if (onProgress) {
          onProgress(Math.min(100, Math.round((delay / totalDuration) * 100)));
        }
      }, delay);
      this.birthdayTimeouts.push(tid);
      currentDelay += note.d + 60;
    });

    const endTid = setTimeout(() => {
      this.birthdayTimeouts = [];
      if (onProgress) onProgress(100);
      if (onFinish) onFinish();
    }, totalDuration);
    this.birthdayTimeouts.push(endTid);
  }
}

export const soundManager = new SoundManager();
