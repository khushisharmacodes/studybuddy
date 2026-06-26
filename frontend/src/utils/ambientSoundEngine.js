class AmbientSoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.activeNodes = [];
    this.currentSound = null;
    this.intervalIds = [];
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  stop() {
    this.activeNodes.forEach((node) => {
      try {
        node.stop?.();
        node.disconnect?.();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
    this.intervalIds.forEach(clearInterval);
    this.intervalIds = [];
    this.currentSound = null;
  }

  createNoiseBuffer(type = 'pink') {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }
    } else {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    return buffer;
  }

  playNoise({ type = 'pink', filterFreq = 1000, filterType = 'lowpass', gain = 1 }) {
    this.init();
    const source = this.ctx.createBufferSource();
    source.buffer = this.createNoiseBuffer(type);
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = filterFreq;

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = gain;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start();
    this.activeNodes.push(source, filter, gainNode);
  }

  playRain() {
    this.stop();
    this.currentSound = 'Rain';
    this.playNoise({ type: 'brown', filterFreq: 800, filterType: 'lowpass', gain: 1.2 });
  }

  playForest() {
    this.stop();
    this.currentSound = 'Forest';
    this.playNoise({ type: 'pink', filterFreq: 2000, filterType: 'bandpass', gain: 0.6 });

    // Occasional bird chirps
    const scheduleChirp = () => {
      if (this.currentSound !== 'Forest') return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2000 + Math.random() * 1500, now);
      osc.frequency.exponentialRampToValueAtTime(2500 + Math.random() * 1000, now + 0.08);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03 + Math.random() * 0.03, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.2);

      const next = 2000 + Math.random() * 5000;
      const id = setTimeout(scheduleChirp, next);
      this.intervalIds.push(id);
    };

    scheduleChirp();
  }

  playLofi() {
    this.stop();
    this.currentSound = 'Lo-Fi';

    // Soft vinyl crackle
    this.playNoise({ type: 'brown', filterFreq: 4000, filterType: 'highpass', gain: 0.08 });

    // Simple chord pad
    const padFrequencies = [261.63, 329.63, 392, 493.88]; // C major 7
    padFrequencies.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.value = 0.03;
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      this.activeNodes.push(osc, gain);
    });

    // Lo-fi drum loop
    const bpm = 80;
    const beatDuration = 60 / bpm;
    let step = 0;

    const scheduleBeat = () => {
      if (this.currentSound !== 'Lo-Fi') return;
      const now = this.ctx.currentTime;

      // Kick on 1 and 3
      if (step % 4 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.3);
      }

      // Snare on 2 and 4
      if (step % 4 === 2) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer('white');
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(now);
        noise.stop(now + 0.2);
      }

      // Hi-hat every beat
      const hat = this.ctx.createBufferSource();
      hat.buffer = this.createNoiseBuffer('white');
      const hatFilter = this.ctx.createBiquadFilter();
      hatFilter.type = 'highpass';
      hatFilter.frequency.value = 6000;
      const hatGain = this.ctx.createGain();
      hatGain.gain.setValueAtTime(0.03, now);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      hat.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(this.masterGain);
      hat.start(now);
      hat.stop(now + 0.05);

      step += 1;
      const id = setTimeout(scheduleBeat, beatDuration * 1000);
      this.intervalIds.push(id);
    };

    scheduleBeat();
  }

  setVolume(value) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(value, this.ctx.currentTime);
    }
  }

  play(name) {
    switch (name) {
      case 'Rain':
        this.playRain();
        break;
      case 'Forest':
        this.playForest();
        break;
      case 'Lo-Fi':
        this.playLofi();
        break;
      default:
        this.stop();
    }
  }
}

const ambientSoundEngine = new AmbientSoundEngine();
export default ambientSoundEngine;
