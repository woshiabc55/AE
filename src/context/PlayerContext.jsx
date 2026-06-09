import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { SHOTS, TOTAL_DURATION } from '../data/storyboard.js'
import { playShotAudio, resumeAudio } from '../audio/synth.js'

const PlayerContext = createContext(null)

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider')
  return ctx
}

export function PlayerProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [globalTime, setGlobalTime] = useState(0)
  const [currentShotIndex, setCurrentShotIndex] = useState(0)
  const [shotProgress, setShotProgress] = useState(0)
  const rafRef = useRef(null)
  const lastTickRef = useRef(0)
  const shotStartTimesRef = useRef([])
  const playedAudioRef = useRef(new Set())

  // 预计算每个镜头的开始时间
  useEffect(() => {
    const starts = []
    let acc = 0
    SHOTS.forEach(s => {
      starts.push(acc)
      acc += s.duration
    })
    shotStartTimesRef.current = starts
  }, [])

  // 主循环
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTickRef.current = 0
      return
    }
    resumeAudio()
    const tick = (ts) => {
      if (!lastTickRef.current) lastTickRef.current = ts
      const dt = ts - lastTickRef.current
      lastTickRef.current = ts
      setGlobalTime(prev => {
        let next = prev + dt
        if (next >= TOTAL_DURATION) {
          next = TOTAL_DURATION
          setIsPlaying(false)
        }
        return next
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isPlaying])

  // 根据 globalTime 推算当前镜头
  useEffect(() => {
    const starts = shotStartTimesRef.current
    if (!starts.length) return
    let idx = 0
    for (let i = 0; i < starts.length; i++) {
      if (globalTime >= starts[i]) idx = i
    }
    if (globalTime >= TOTAL_DURATION) idx = SHOTS.length - 1

    if (idx !== currentShotIndex) {
      setCurrentShotIndex(idx)
      // 触发新镜头的音效（仅一次）
      if (!playedAudioRef.current.has(idx)) {
        playedAudioRef.current.add(idx)
        const shot = SHOTS[idx]
        if (shot.audio) playShotAudio(shot.audio)
      }
    }
    // 计算 shotProgress
    const shotStart = starts[idx]
    const shotDur = SHOTS[idx].duration
    setShotProgress(Math.min(1, Math.max(0, (globalTime - shotStart) / shotDur)))
  }, [globalTime, currentShotIndex])

  const play = useCallback(() => {
    if (globalTime >= TOTAL_DURATION) {
      setGlobalTime(0)
      playedAudioRef.current = new Set()
    }
    setIsPlaying(true)
  }, [globalTime])

  const pause = useCallback(() => setIsPlaying(false), [])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const seekToShot = useCallback((idx) => {
    const starts = shotStartTimesRef.current
    if (!starts.length) return
    const t = starts[idx] + 50
    setGlobalTime(t)
    setCurrentShotIndex(idx)
    // 重新触发音效
    if (!playedAudioRef.current.has(idx)) {
      playedAudioRef.current.add(idx)
    } else {
      // 重复点击重新播放
      playedAudioRef.current.delete(idx)
    }
    const shot = SHOTS[idx]
    if (shot.audio) playShotAudio(shot.audio)
  }, [])

  const next = useCallback(() => {
    if (currentShotIndex < SHOTS.length - 1) seekToShot(currentShotIndex + 1)
  }, [currentShotIndex, seekToShot])

  const prev = useCallback(() => {
    if (currentShotIndex > 0) seekToShot(currentShotIndex - 1)
    else setGlobalTime(0)
  }, [currentShotIndex, seekToShot])

  const seek = useCallback((t) => {
    setGlobalTime(Math.max(0, Math.min(TOTAL_DURATION, t)))
  }, [])

  // 键盘控制
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.code === 'Space') { e.preventDefault(); toggle() }
      else if (e.code === 'ArrowRight') { next() }
      else if (e.code === 'ArrowLeft') { prev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle, next, prev])

  const value = {
    isPlaying, globalTime, currentShotIndex, shotProgress,
    totalDuration: TOTAL_DURATION,
    currentShot: SHOTS[currentShotIndex],
    shots: SHOTS,
    play, pause, toggle, seek, seekToShot, next, prev
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}
