export function applyEffect(
  src: Uint8ClampedArray,
  dst: Uint8ClampedArray,
  w: number,
  h: number,
  effectId: string,
  params: Record<string, number | boolean | string>,
  time: number,
): void {
  if (effectId === 'pixelate') {
    applyPixelate(src, dst, w, h, params)
  } else if (effectId === 'wave') {
    applyWave(src, dst, w, h, params, time)
  } else if (effectId === 'glitch') {
    applyGlitch(src, dst, w, h, params, time)
  } else if (effectId === 'chromatic') {
    applyChromatic(src, dst, w, h, params, time)
  } else if (effectId === 'ionize') {
    applyIonize(src, dst, w, h, params, time)
  } else {
    dst.set(src)
  }
}

function applyPixelate(
  src: Uint8ClampedArray, dst: Uint8ClampedArray,
  w: number, h: number,
  params: Record<string, number | boolean | string>,
): void {
  const ps = Math.max(2, (params.pixelSize as number) || 8)
  const grid = !!params.gridShow
  for (let by = 0; by < h; by += ps) {
    for (let bx = 0; bx < w; bx += ps) {
      let sr = 0, sg = 0, sb = 0, cnt = 0
      for (let dy = 0; dy < ps && by + dy < h; dy++) {
        for (let dx = 0; dx < ps && bx + dx < w; dx++) {
          const i = ((by + dy) * w + (bx + dx)) * 4
          sr += src[i]!; sg += src[i + 1]!; sb += src[i + 2]!; cnt++
        }
      }
      const ar = sr / cnt, ag = sg / cnt, ab = sb / cnt
      for (let dy = 0; dy < ps && by + dy < h; dy++) {
        for (let dx = 0; dx < ps && bx + dx < w; dx++) {
          const i = ((by + dy) * w + (bx + dx)) * 4
          dst[i] = ar; dst[i + 1] = ag; dst[i + 2] = ab; dst[i + 3] = 255
        }
      }
    }
  }
  if (grid) {
    for (let by = 0; by < h; by += ps) {
      for (let bx = 0; bx < w; bx += ps) {
        for (let dx = 0; dx < ps && bx + dx < w; dx++) {
          const i = (by * w + (bx + dx)) * 4
          if (i + 2 < dst.length) { dst[i] = 40; dst[i + 1] = 60; dst[i + 2] = 40 }
        }
        for (let dy = 0; dy < ps && by + dy < h; dy++) {
          const i = ((by + dy) * w + bx) * 4
          if (i + 2 < dst.length) { dst[i] = 40; dst[i + 1] = 60; dst[i + 2] = 40 }
        }
      }
    }
  }
}

function applyWave(
  src: Uint8ClampedArray, dst: Uint8ClampedArray,
  w: number, h: number,
  params: Record<string, number | boolean | string>, time: number,
): void {
  const amp = (params.amplitude as number) || 15
  const freq = (params.frequency as number) || 3
  const spd = (params.speed as number) || 1
  const mode = (params.lineMode as string) || 'sine'
  for (let y = 0; y < h; y++) {
    const t = y * freq * 0.01 + time * spd * 0.001
    let offset: number
    if (mode === 'sine') offset = amp * Math.sin(t)
    else if (mode === 'triangle') offset = amp * (2 * Math.abs(2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5))) - 1)
    else offset = amp * ((t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI))) * 2 - 1)
    const off = Math.round(offset)
    for (let x = 0; x < w; x++) {
      const sx = x + off
      const di = (y * w + x) * 4
      if (sx >= 0 && sx < w) {
        const si = (y * w + sx) * 4
        dst[di] = src[si]!; dst[di + 1] = src[si + 1]!; dst[di + 2] = src[si + 2]!; dst[di + 3] = src[si + 3]!
      } else {
        dst[di] = 0; dst[di + 1] = 0; dst[di + 2] = 0; dst[di + 3] = 0
      }
    }
  }
}

function applyGlitch(
  src: Uint8ClampedArray, dst: Uint8ClampedArray,
  w: number, h: number,
  params: Record<string, number | boolean | string>, time: number,
): void {
  const intensity = (params.intensity as number) || 0.5
  const shift = (params.channelShift as number) || 8
  const burst = !!params.burstMode && Math.random() > 0.7
  for (let y = 0; y < h; y++) {
    const isBand = burst || Math.sin(y * 0.7 + time * 0.003) * 0.5 + 0.5 > 1 - intensity
    const rowShift = isBand ? Math.round((Math.random() - 0.5) * shift * 2 * intensity) : 0
    for (let x = 0; x < w; x++) {
      const di = (y * w + x) * 4
      const rx = Math.min(w - 1, Math.max(0, x + rowShift - shift))
      const bx = Math.min(w - 1, Math.max(0, x + rowShift + shift))
      const gx = Math.min(w - 1, Math.max(0, x + rowShift))
      dst[di] = src[(y * w + rx) * 4]!; dst[di + 1] = src[(y * w + gx) * 4 + 1]!
      dst[di + 2] = src[(y * w + bx) * 4 + 2]!; dst[di + 3] = 255
    }
  }
}

function applyChromatic(
  src: Uint8ClampedArray, dst: Uint8ClampedArray,
  w: number, h: number,
  params: Record<string, number | boolean | string>, time: number,
): void {
  const oR = (params.offsetR as number) || -4
  const oB = (params.offsetB as number) || 4
  const anim = params.animate ? Math.sin(time * 0.002) * 3 : 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const di = (y * w + x) * 4
      const rx = Math.min(w - 1, Math.max(0, x + oR + anim))
      const bx = Math.min(w - 1, Math.max(0, x + oB + anim))
      dst[di] = src[(y * w + rx) * 4]!; dst[di + 1] = src[(y * w + x) * 4 + 1]!
      dst[di + 2] = src[(y * w + bx) * 4 + 2]!; dst[di + 3] = 255
    }
  }
}

function applyIonize(
  src: Uint8ClampedArray, dst: Uint8ClampedArray,
  w: number, h: number,
  params: Record<string, number | boolean | string>, time: number,
): void {
  const density = (params.density as number) || 0.05
  const spd = (params.speed as number) || 2
  const grav = (params.gravity as number) || 0.5
  const spread = (params.spread as number) || 1.5
  dst.fill(0)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (Math.random() > density) continue
      const si = (y * w + x) * 4
      if (src[si + 3]! < 10) continue
      const life = Math.random()
      const vx = (Math.random() - 0.5) * spread * spd
      const vy = (Math.random() - 0.5) * spread * spd + grav * time * 0.0001
      const nx = Math.round(x + vx)
      const ny = Math.round(y + vy)
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const di = (ny * w + nx) * 4
        dst[di] = src[si]!; dst[di + 1] = src[si + 1]!; dst[di + 2] = src[si + 2]!
        dst[di + 3] = Math.floor(src[si + 3]! * life)
      }
    }
  }
}
