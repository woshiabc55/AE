// Lightweight audio engine using Web Audio API.
// Exposes a low-frequency oscillator as a fallback when the user has not
// granted microphone access.

export class AudioEngine {
  private ctx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private data: Uint8Array = new Uint8Array(960)
  private oscNodes: OscillatorNode[] = []
  private master: GainNode | null = null
  private micSource: MediaStreamAudioSourceNode | null = null
  private micStream: MediaStream | null = null
  private started = false

  ensure(): AudioContext {
    if (!this.ctx) {
      const Ctor: typeof AudioContext =
        (window as any).AudioContext || (window as any).webkitAudioContext
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.18
      this.analyser = this.ctx.createAnalyser()
      this.analyser.fftSize = 2048
      this.analyser.smoothingTimeConstant = 0.82
      this.data = new Uint8Array(this.analyser.frequencyBinCount)
      this.master.connect(this.analyser)
      this.analyser.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  /** Default ambient: three detuned low oscillators. */
  startAmbient() {
    const ctx = this.ensure()
    if (this.started) return
    this.started = true
    const freqs = [55, 82.5, 110, 138.5]
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator()
      o.type = i % 2 === 0 ? 'sine' : 'triangle'
      o.frequency.value = f
      const g = ctx.createGain()
      g.gain.value = 0.18 - i * 0.025
      // slight detune drift via lfo
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.13 + i * 0.07
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 4
      lfo.connect(lfoGain).connect(o.detune)
      o.connect(g).connect(this.master!)
      o.start()
      lfo.start()
      this.oscNodes.push(o, lfo)
    })
  }

  async startMic(): Promise<boolean> {
    const ctx = this.ensure()
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      return false
    }
    this.micSource = ctx.createMediaStreamSource(this.micStream)
    this.micSource.connect(this.analyser!)
    this.started = true
    return true
  }

  stopMic() {
    try {
      this.micSource?.disconnect()
    } catch {}
    this.micSource = null
    this.micStream?.getTracks().forEach((t) => t.stop())
    this.micStream = null
  }

  setMuted(muted: boolean) {
    if (!this.master || !this.ctx) return
    this.master.gain.cancelScheduledValues(this.ctx.currentTime)
    this.master.gain.linearRampToValueAtTime(
      muted ? 0 : 0.18,
      this.ctx.currentTime + 0.4,
    )
  }

  read(): Uint8Array {
    if (!this.analyser) return this.data
    this.analyser.getByteFrequencyData(this.data as any)
    return this.data
  }

  /** 12 aggregated bands of energy 0..1. */
  bands12(): number[] {
    const d = this.read()
    const bands: number[] = []
    const slices = 12
    const step = Math.floor(d.length / slices)
    for (let i = 0; i < slices; i++) {
      let sum = 0
      for (let j = 0; j < step; j++) sum += d[i * step + j]
      bands.push(sum / (step * 255))
    }
    return bands
  }
}

export const audio = new AudioEngine()
