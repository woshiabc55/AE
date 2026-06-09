/**
 * Web Audio 程序化音效合成器
 * 全部音效均使用 OscillatorNode / BufferSource 实时合成
 * 无需外部音频文件
 */

let ctx = null
let masterGain = null
let ambienceNodes = null

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    masterGain = ctx.createGain()
    masterGain.gain.value = 0.6
    masterGain.connect(ctx.destination)
  }
  return ctx
}

export function resumeAudio() {
  const c = getCtx()
  if (c.state === 'suspended') c.resume()
}

/* ---------- 基础工具 ---------- */
function envGain(c, attack, decay, peak = 1) {
  const g = c.createGain()
  const t = c.currentTime
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  return g
}

function noiseBuffer(c, duration = 1) {
  const buf = c.createBuffer(1, c.sampleRate * duration, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buf
}

/* ---------- 音效库 ---------- */
export const SFX = {
  // 低频嗡鸣 · 大地震颤
  rumble(duration = 2) {
    const c = getCtx()
    const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = 40
    const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 55
    const o3 = c.createOscillator(); o3.type = 'triangle'; o3.frequency.value = 80
    const g = envGain(c, 0.4, duration, 0.6)
    const filter = c.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 120
    o1.connect(g); o2.connect(g); o3.connect(g)
    g.connect(filter); filter.connect(masterGain)
    o1.start(); o2.start(); o3.start()
    o1.stop(c.currentTime + duration); o2.stop(c.currentTime + duration); o3.stop(c.currentTime + duration)
  },

  // 拳风 / 急促脚步
  whoosh() {
    const c = getCtx()
    const buf = noiseBuffer(c, 0.6)
    const src = c.createBufferSource(); src.buffer = buf
    const filter = c.createBiquadFilter(); filter.type = 'bandpass'
    filter.frequency.setValueAtTime(300, c.currentTime)
    filter.frequency.exponentialRampToValueAtTime(2000, c.currentTime + 0.3)
    filter.Q.value = 2
    const g = envGain(c, 0.02, 0.4, 0.5)
    src.connect(filter); filter.connect(g); g.connect(masterGain)
    src.start()
  },

  // 古老编钟
  bell(freqs = [220, 440, 660, 880], duration = 2) {
    const c = getCtx()
    freqs.forEach((f, i) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f
      const g = c.createGain()
      g.gain.setValueAtTime(0, c.currentTime)
      g.gain.linearRampToValueAtTime(0.18 / (i + 1), c.currentTime + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration)
      o.connect(g); g.connect(masterGain)
      o.start(); o.stop(c.currentTime + duration)
    })
  },

  // 清脆 "叮"
  ding() {
    const c = getCtx()
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 1760
    const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 2640
    const g = envGain(c, 0.005, 0.8, 0.3)
    o.connect(g); o2.connect(g); g.connect(masterGain)
    o.start(); o2.start()
    o.stop(c.currentTime + 0.8); o2.stop(c.currentTime + 0.8)
  },

  // 心跳低频
  heartbeat() {
    const c = getCtx()
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 50
    const g = c.createGain()
    const t = c.currentTime
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.5, t + 0.05)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    g.gain.setValueAtTime(0, t + 0.4)
    g.gain.linearRampToValueAtTime(0.35, t + 0.45)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.7)
    o.connect(g); g.connect(masterGain)
    o.start(); o.stop(t + 0.8)
  },

  // 风声
  wind(duration = 1.5) {
    const c = getCtx()
    const buf = noiseBuffer(c, duration)
    const src = c.createBufferSource(); src.buffer = buf
    const filter = c.createBiquadFilter(); filter.type = 'lowpass'
    filter.frequency.setValueAtTime(400, c.currentTime)
    filter.frequency.linearRampToValueAtTime(1200, c.currentTime + duration / 2)
    filter.frequency.linearRampToValueAtTime(400, c.currentTime + duration)
    const g = envGain(c, 0.2, duration, 0.4)
    src.connect(filter); filter.connect(g); g.connect(masterGain)
    src.start()
  },

  // 古老咒语 · 混响
  incant() {
    const c = getCtx()
    const freqs = [110, 165, 220, 330]
    freqs.forEach((f, i) => {
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f
      const filter = c.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 800
      const delay = c.createDelay(); delay.delayTime.value = 0.15 + i * 0.08
      const feedback = c.createGain(); feedback.gain.value = 0.4
      const g = envGain(c, 0.05, 1.6, 0.12)
      o.connect(filter); filter.connect(delay); delay.connect(feedback); feedback.connect(delay)
      delay.connect(g); g.connect(masterGain)
      o.start(); o.stop(c.currentTime + 1.8)
    })
  },

  // 次声波 · 压迫
  infrasound() {
    const c = getCtx()
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 25
    const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 30
    const filter = c.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 60
    const g = envGain(c, 0.5, 2.5, 0.7)
    o.connect(g); o2.connect(g); g.connect(filter); filter.connect(masterGain)
    o.start(); o2.start()
    o.stop(c.currentTime + 3); o2.stop(c.currentTime + 3)
  },

  // 金属铠甲碰撞
  metal() {
    const c = getCtx()
    const freqs = [800, 1200, 1800, 2400, 3200]
    freqs.forEach((f, i) => {
      const o = c.createOscillator(); o.type = 'square'; o.frequency.value = f
      const g = envGain(c, 0.001, 0.3, 0.05)
      o.connect(g); g.connect(masterGain)
      o.start(); o.stop(c.currentTime + 0.3)
    })
  },

  // 英文低语
  whisperEn() {
    const c = getCtx()
    const buf = noiseBuffer(c, 1.2)
    const src = c.createBufferSource(); src.buffer = buf
    const filter = c.createBiquadFilter(); filter.type = 'bandpass'
    filter.frequency.value = 800; filter.Q.value = 8
    const g = envGain(c, 0.1, 1.0, 0.3)
    src.connect(filter); filter.connect(g); g.connect(masterGain)
    src.start()
  },

  // 静音→爆发白噪音
  silenceBoom() {
    const c = getCtx()
    setTimeout(() => {
      const buf = noiseBuffer(c, 1.5)
      const src = c.createBufferSource(); src.buffer = buf
      const filter = c.createBiquadFilter(); filter.type = 'lowpass'
      filter.frequency.setValueAtTime(200, c.currentTime)
      filter.frequency.exponentialRampToValueAtTime(8000, c.currentTime + 0.3)
      const g = c.createGain()
      g.gain.setValueAtTime(0, c.currentTime)
      g.gain.linearRampToValueAtTime(0.9, c.currentTime + 0.05)
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.5)
      src.connect(filter); filter.connect(g); g.connect(masterGain)
      src.start()
    }, 800)
  },

  // 冲击波扫荡
  rumbleSweep() {
    const c = getCtx()
    const buf = noiseBuffer(c, 1.5)
    const src = c.createBufferSource(); src.buffer = buf
    const filter = c.createBiquadFilter(); filter.type = 'bandpass'
    filter.frequency.setValueAtTime(200, c.currentTime)
    filter.frequency.exponentialRampToValueAtTime(3000, c.currentTime + 0.8)
    filter.frequency.exponentialRampToValueAtTime(100, c.currentTime + 1.4)
    filter.Q.value = 1.5
    const g = envGain(c, 0.1, 1.3, 0.7)
    src.connect(filter); filter.connect(g); g.connect(masterGain)
    src.start()
  },

  // 骨骼碰撞
  bone() {
    const c = getCtx()
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 120
    const o2 = c.createOscillator(); o2.type = 'triangle'; o2.frequency.value = 180
    const g = envGain(c, 0.001, 0.4, 0.6)
    o.connect(g); o2.connect(g); g.connect(masterGain)
    o.start(); o2.start()
    o.stop(c.currentTime + 0.4); o2.stop(c.currentTime + 0.4)
  },

  // 打击叠加
  punchStack(count = 3) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => SFX.bone(), i * 250)
    }
  },

  // 玻璃碎裂
  glassMega() {
    const c = getCtx()
    const buf = noiseBuffer(c, 1.0)
    const src = c.createBufferSource(); src.buffer = buf
    const filter = c.createBiquadFilter(); filter.type = 'highpass'
    filter.frequency.value = 4000
    const g = envGain(c, 0.001, 0.8, 0.6)
    src.connect(filter); filter.connect(g); g.connect(masterGain)
    src.start()
  },

  // 龙吟
  dragon() {
    const c = getCtx()
    const o = c.createOscillator(); o.type = 'sawtooth'
    o.frequency.setValueAtTime(80, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.3)
    o.frequency.exponentialRampToValueAtTime(60, c.currentTime + 1.5)
    const o2 = c.createOscillator(); o2.type = 'sawtooth'
    o2.frequency.setValueAtTime(160, c.currentTime)
    o2.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.3)
    o2.frequency.exponentialRampToValueAtTime(120, c.currentTime + 1.5)
    const filter = c.createBiquadFilter(); filter.type = 'bandpass'
    filter.frequency.value = 600; filter.Q.value = 4
    const g = envGain(c, 0.1, 1.6, 0.5)
    o.connect(filter); o2.connect(filter); filter.connect(g); g.connect(masterGain)
    o.start(); o2.start()
    o.stop(c.currentTime + 1.6); o2.stop(c.currentTime + 1.6)
  },

  // 星辰低语
  starsWhisper() {
    const c = getCtx()
    const freqs = [880, 1100, 1320, 1760]
    freqs.forEach((f, i) => {
      setTimeout(() => {
        const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f
        const g = envGain(c, 0.05, 0.6, 0.08)
        o.connect(g); g.connect(masterGain)
        o.start(); o.stop(c.currentTime + 0.6)
      }, i * 400)
    })
  },

  // 轻快笛声
  flute() {
    const c = getCtx()
    const notes = [523, 659, 784, 659, 523]  // C E G E C
    notes.forEach((f, i) => {
      setTimeout(() => {
        const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f
        const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2
        const g = envGain(c, 0.02, 0.3, 0.15)
        o.connect(g); o2.connect(g); g.connect(masterGain)
        o.start(); o2.start()
        o.stop(c.currentTime + 0.3); o2.stop(c.currentTime + 0.3)
      }, i * 200)
    })
  }
}

/**
 * 根据 shot.audio 字符串触发对应音效
 * audio 字段支持 '+' 连接多个
 */
export function playShotAudio(audioStr) {
  if (!audioStr) return
  resumeAudio()
  const parts = audioStr.split('+').map(s => s.trim())
  parts.forEach(p => {
    if (SFX[p]) SFX[p]()
  })
}
