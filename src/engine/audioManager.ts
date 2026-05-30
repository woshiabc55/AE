import { useRef, useCallback } from 'react'
import type { BgmId, SfxId } from '@/engine/types'

interface AudioAssets {
  bgm: Record<BgmId, string>
  sfx: Record<SfxId, string>
}

const audioAssets: AudioAssets = {
  bgm: {
    main_theme: '',
    ancient_kiln: '',
    modern_longquan: '',
    tension: '',
    reunion: '',
    epilogue: '',
  },
  sfx: {
    kiln_fire: '',
    crack: '',
    rain: '',
    shard: '',
    chime: '',
    typewriter: '',
  },
}

class AudioEngine {
  private bgmAudio: HTMLAudioElement | null = null
  private currentBgm: BgmId | null = null
  private bgmVolume = 0.3
  private sfxVolume = 0.5
  private audioContext: AudioContext | null = null
  private activeOscillators: OscillatorNode[] = []
  private activeTimers: ReturnType<typeof setTimeout>[] = []
  private bgmGainNode: GainNode | null = null

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext()
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    return this.audioContext
  }

  private cleanupOscillators() {
    for (const osc of this.activeOscillators) {
      try { osc.stop() } catch { /* already stopped */ }
    }
    this.activeOscillators = []
    for (const timer of this.activeTimers) {
      clearTimeout(timer)
    }
    this.activeTimers = []
  }

  playBgm(id: BgmId) {
    if (id === this.currentBgm) return
    this.currentBgm = id

    this.cleanupOscillators()

    if (this.bgmAudio) {
      this.bgmAudio.pause()
      this.bgmAudio = null
    }

    if (this.bgmGainNode) {
      try { this.bgmGainNode.disconnect() } catch { /* ignore */ }
      this.bgmGainNode = null
    }

    if (!audioAssets.bgm[id]) {
      this.playSynthBgm(id)
      return
    }

    this.bgmAudio = new Audio(audioAssets.bgm[id])
    this.bgmAudio.loop = true
    this.bgmAudio.volume = this.bgmVolume
    this.bgmAudio.play().catch(() => {})
  }

  private playSynthBgm(id: BgmId) {
    try {
      const ctx = this.getContext()
      this.bgmGainNode = ctx.createGain()
      this.bgmGainNode.gain.value = 0.08
      this.bgmGainNode.connect(ctx.destination)

      const configs: Record<string, { freq: number; type: OscillatorType; lfoFreq: number }> = {
        main_theme: { freq: 220, type: 'sine', lfoFreq: 0.3 },
        ancient_kiln: { freq: 165, type: 'sine', lfoFreq: 0.2 },
        modern_longquan: { freq: 262, type: 'sine', lfoFreq: 0.4 },
        tension: { freq: 147, type: 'sawtooth', lfoFreq: 1.5 },
        reunion: { freq: 196, type: 'sine', lfoFreq: 0.25 },
        epilogue: { freq: 185, type: 'sine', lfoFreq: 0.15 },
      }

      const config = configs[id] || configs.main_theme

      const osc = ctx.createOscillator()
      osc.type = config.type
      osc.frequency.value = config.freq

      const lfo = ctx.createOscillator()
      lfo.frequency.value = config.lfoFreq
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = config.freq * 0.02
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)

      osc.connect(this.bgmGainNode)
      osc.start()
      lfo.start()

      this.activeOscillators.push(osc, lfo)

      const timer = setTimeout(() => {
        try { osc.stop() } catch { /* already stopped */ }
        try { lfo.stop() } catch { /* already stopped */ }
        this.activeOscillators = this.activeOscillators.filter((o) => o !== osc && o !== lfo)
      }, 30000)
      this.activeTimers.push(timer)
    } catch {
      // AudioContext not available
    }
  }

  playSfx(id: SfxId) {
    if (!audioAssets.sfx[id]) {
      this.playSynthSfx(id)
      return
    }

    const audio = new Audio(audioAssets.sfx[id])
    audio.volume = this.sfxVolume
    audio.play().catch(() => {})
  }

  private playSynthSfx(id: SfxId) {
    try {
      const ctx = this.getContext()
      const gainNode = ctx.createGain()
      gainNode.gain.value = 0.15
      gainNode.connect(ctx.destination)

      switch (id) {
        case 'crack': {
          const bufferSize = Math.floor(ctx.sampleRate * 0.3)
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
          const data = buffer.getChannelData(0)
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05))
          }
          const source = ctx.createBufferSource()
          source.buffer = buffer
          source.connect(gainNode)
          source.start()
          break
        }
        case 'shard': {
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(800, ctx.currentTime)
          osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3)
          gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
          osc.connect(gainNode)
          osc.start()
          osc.stop(ctx.currentTime + 0.5)
          break
        }
        case 'kiln_fire': {
          const bufferSize = Math.floor(ctx.sampleRate * 1)
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
          const data = buffer.getChannelData(0)
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3 * Math.sin(i / ctx.sampleRate * Math.PI)
          }
          const source = ctx.createBufferSource()
          source.buffer = buffer
          const filter = ctx.createBiquadFilter()
          filter.type = 'lowpass'
          filter.frequency.value = 400
          source.connect(filter)
          filter.connect(gainNode)
          source.start()
          break
        }
        case 'rain': {
          const bufferSize = Math.floor(ctx.sampleRate * 2)
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
          const data = buffer.getChannelData(0)
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1
          }
          const source = ctx.createBufferSource()
          source.buffer = buffer
          const filter = ctx.createBiquadFilter()
          filter.type = 'bandpass'
          filter.frequency.value = 2000
          filter.Q.value = 0.5
          source.connect(filter)
          filter.connect(gainNode)
          source.start()
          break
        }
        case 'chime': {
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.value = 523
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)
          osc.connect(gainNode)
          osc.start()
          osc.stop(ctx.currentTime + 1)
          break
        }
        default: {
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.value = 440
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
          osc.connect(gainNode)
          osc.start()
          osc.stop(ctx.currentTime + 0.2)
        }
      }
    } catch {
      // AudioContext not available
    }
  }

  stopBgm() {
    this.cleanupOscillators()
    if (this.bgmAudio) {
      this.bgmAudio.pause()
      this.bgmAudio = null
    }
    if (this.bgmGainNode) {
      try { this.bgmGainNode.disconnect() } catch { /* ignore */ }
      this.bgmGainNode = null
    }
    this.currentBgm = null
  }

  destroy() {
    this.stopBgm()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

const audioEngine = new AudioEngine()

export function useAudio() {
  const engineRef = useRef(audioEngine)

  const playBgm = useCallback((id: BgmId) => {
    engineRef.current.playBgm(id)
  }, [])

  const playSfx = useCallback((id: SfxId) => {
    engineRef.current.playSfx(id)
  }, [])

  const stopBgm = useCallback(() => {
    engineRef.current.stopBgm()
  }, [])

  return { playBgm, playSfx, stopBgm }
}
