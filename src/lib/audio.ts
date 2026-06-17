// 音频引擎类 - 封装 Web Audio API 管线
// 文件源：AudioBufferSourceNode
// 麦克风源：MediaStreamSourceNode
// 输出统一经过 GainNode -> AnalyserNode -> destination

import { useAudioStore } from "@/store/useAudioStore"

const FFT_SIZE = 1024
const BIN_COUNT = 32 // 折叠后的频段数

export class AudioEngine {
  private ctx: AudioContext | null = null
  private gainNode: GainNode | null = null
  private analyser: AnalyserNode | null = null
  private bufferSource: AudioBufferSourceNode | null = null
  private mediaStream: MediaStream | null = null
  private micSource: MediaStreamAudioSourceNode | null = null

  // 节拍检测状态
  private bassHistory: number[] = []
  private lastBeatTime = 0
  private beatCooldown = 0.12 // 秒

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const gain = this.ctx.createGain()
      const analyser = this.ctx.createAnalyser()
      analyser.fftSize = FFT_SIZE
      analyser.smoothingTimeConstant = 0.78
      gain.connect(analyser)
      analyser.connect(this.ctx.destination)
      this.gainNode = gain
      this.analyser = analyser
    }
    return this.ctx
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser
  }

  getFrequencyData(): Uint8Array {
    const analyser = this.analyser
    if (!analyser) return new Uint8Array(BIN_COUNT)
    const raw = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(raw)
    // 折叠到 BIN_COUNT
    const folded = new Uint8Array(BIN_COUNT)
    const binSize = Math.floor(raw.length / BIN_COUNT)
    for (let i = 0; i < BIN_COUNT; i++) {
      let sum = 0
      const start = i * binSize
      const end = Math.min(raw.length, start + binSize)
      for (let j = start; j < end; j++) {
        sum += raw[j]
      }
      folded[i] = sum / (end - start)
    }
    return folded
  }

  setVolume(v: number) {
    if (this.gainNode) this.gainNode.gain.value = v
  }

  async resume() {
    const ctx = this.getCtx()
    if (ctx.state === "suspended") await ctx.resume()
  }

  async loadFile(file: File): Promise<AudioBuffer> {
    const ctx = this.getCtx()
    const arrayBuffer = await file.arrayBuffer()
    const buffer = await ctx.decodeAudioData(arrayBuffer)
    return buffer
  }

  playBuffer(buffer: AudioBuffer, offset = 0) {
    this.stopBuffer()
    const ctx = this.getCtx()
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    src.connect(this.gainNode!)
    src.start(0, offset)
    this.bufferSource = src
  }

  stopBuffer() {
    if (this.bufferSource) {
      try {
        this.bufferSource.stop()
      } catch {
        // ignore
      }
      this.bufferSource.disconnect()
      this.bufferSource = null
    }
  }

  async startMic() {
    this.stopBuffer()
    this.stopMic()
    const ctx = this.getCtx()
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    })
    this.mediaStream = stream
    const src = ctx.createMediaStreamSource(stream)
    // 麦克风直接连 analyser，不连 destination（避免回声）
    src.connect(this.analyser!)
    this.micSource = src
  }

  stopMic() {
    if (this.micSource) {
      this.micSource.disconnect()
      this.micSource = null
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop())
      this.mediaStream = null
    }
  }

  stopAll() {
    this.stopBuffer()
    this.stopMic()
  }

  /**
   * 每帧调用 - 提取频段特征 + 节拍检测
   */
  tick(): { bass: number; mid: number; treble: number; beat: number } {
    const analyser = this.analyser
    if (!analyser) return { bass: 0, mid: 0, treble: 0, beat: 0 }
    const folded = this.getFrequencyData()

    // 计算低/中/高频段能量
    let bass = 0,
      mid = 0,
      treble = 0
    for (let i = 0; i < 4; i++) bass += folded[i]
    bass /= 4 * 255
    for (let i = 4; i < 12; i++) mid += folded[i]
    mid /= 8 * 255
    for (let i = 12; i < 32; i++) treble += folded[i]
    treble /= 20 * 255

    // 简单节拍检测：低频能量突增超过历史均值
    this.bassHistory.push(bass)
    if (this.bassHistory.length > 43) this.bassHistory.shift() // ~0.7s @ 60fps
    const avg =
      this.bassHistory.reduce((a, b) => a + b, 0) / Math.max(1, this.bassHistory.length)
    const now = performance.now() / 1000
    const beat =
      bass > avg * 1.35 &&
      bass > 0.18 &&
      now - this.lastBeatTime > this.beatCooldown
        ? 1
        : 0
    if (beat) this.lastBeatTime = now

    const store = useAudioStore.getState()
    store.setFrequencyData(folded, bass, mid, treble)

    // 节拍脉冲衰减
    const prev = store.beatPulse
    const next = Math.max(beat, prev * 0.86)
    if (Math.abs(next - prev) > 0.001 || beat) {
      store.setBeatPulse(next)
    }

    return { bass, mid, treble, beat }
  }
}

// 全局单例
export const audioEngine = new AudioEngine()
