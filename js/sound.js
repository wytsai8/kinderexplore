/**
 * 童趣互動音效與語音朗讀系統
 * 使用 Web Audio API 合成音效，無需外部資源，零延遲，純純天然！
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.speechEnabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  toggleSpeech() {
    this.speechEnabled = !this.speechEnabled;
    if (!this.speechEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.speechEnabled;
  }

  // 泡泡點擊聲
  playPop() {
    if (!this.enabled) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn(e);
    }
  }

  // 答對叮咚聲
  playCorrect() {
    if (!this.enabled) return;
    try {
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.26);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // 答錯溫柔提示聲
  playWrong() {
    if (!this.enabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn(e);
    }
  }

  // 通關勝利號角
  playVictory() {
    if (!this.enabled) return;
    try {
      this.init();
      // Fanfare: C5, E5, G5, pause, G5, C6
      const fanfare = [
        { f: 523.25, t: 0, d: 0.12 },
        { f: 659.25, t: 0.12, d: 0.12 },
        { f: 783.99, t: 0.24, d: 0.15 },
        { f: 783.99, t: 0.42, d: 0.1 },
        { f: 1046.50, t: 0.54, d: 0.45 }
      ];

      fanfare.forEach(item => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + item.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.3, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + item.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + item.d + 0.02);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // 星星收集音
  playStar() {
    if (!this.enabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.18); // A6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn(e);
    }
  }

  // 鋼琴琴鍵音符 (用於音律島互動)
  playPianoNote(noteIndex) {
    if (!this.enabled) return;
    try {
      this.init();
      // Do Re Mi Fa Sol La Ti Do
      const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
      const freq = scale[noteIndex % scale.length];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.52);
    } catch (e) {
      console.warn(e);
    }
  }

  // 語音朗讀 (Web Speech API)
  speak(text) {
    if (!this.speechEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // 停止先前的朗讀
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-TW';
    utter.rate = 0.95; // 稍微放慢一點，適合小朋友聆聽
    utter.pitch = 1.15; // 稍微提高音調，更具親和童趣感

    // 尋找中文語音
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('cmn'));
    if (zhVoice) {
      utter.voice = zhVoice;
    }

    window.speechSynthesis.speak(utter);
  }

  stopSpeech() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

window.soundEngine = new SoundEngine();
