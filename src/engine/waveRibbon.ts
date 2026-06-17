import type { Theme } from '@/themes/themes';

// 全屏波形带：使用多重正弦波 + 频段调制，绘制成"丝绸光带"
export class WaveRibbon {
  draw(
    ctx: CanvasRenderingContext2D,
    freqData: Uint8Array,
    timeData: Uint8Array,
    theme: Theme,
    w: number,
    h: number,
    t: number,
    beat: number,
    sensitivity: number,
    horizonY: number,
  ) {
    // 波形带漂浮在日盘上方
    const cy = horizonY - Math.min(w, h) * 0.32 * (1 + beat * 0.4);
    const ribbonHeight = Math.min(w, h) * 0.055;

    // 取出平均能量 + 分段低中高能量
    let low = 0,
      mid = 0,
      high = 0;
    const bins = freqData.length;
    for (let i = 0; i < bins * 0.12; i++) low += freqData[i];
    for (let i = Math.floor(bins * 0.12); i < bins * 0.45; i++) mid += freqData[i];
    for (let i = Math.floor(bins * 0.45); i < bins; i++) high += freqData[i];
    low = (low / (bins * 0.12)) / 255;
    mid = (mid / (bins * 0.33)) / 255;
    high = (high / (bins * 0.55)) / 255;

    // 振幅分层
    const ampLow = 14 + low * 60 * sensitivity + beat * 22;
    const ampMid = 10 + mid * 45 * sensitivity;
    const ampHigh = 6 + high * 30 * sensitivity;

    const layers = [
      { amp: ampLow, freq: 0.012, speed: 0.6, color: theme.waveBottom, alpha: 0.7, width: ribbonHeight },
      { amp: ampMid, freq: 0.022, speed: -0.9, color: theme.waveBottom, alpha: 0.55, width: ribbonHeight * 0.65 },
      { amp: ampHigh, freq: 0.05, speed: 1.6, color: theme.waveTop, alpha: 0.85, width: ribbonHeight * 0.35 },
    ];

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (const L of layers) {
      // 主带（填充渐变多边形）
      const top: Array<[number, number]> = [];
      const bot: Array<[number, number]> = [];
      const step = 2;
      for (let x = 0; x <= w; x += step) {
        // 多正弦叠加 + 频段微扰
        const y =
          cy +
          Math.sin(x * L.freq + t * L.speed) * L.amp +
          Math.sin(x * L.freq * 2.7 - t * L.speed * 0.6) * L.amp * 0.4 +
          Math.sin(x * L.freq * 5.1 + t * L.speed * 1.3) * L.amp * 0.2;
        top.push([x, y - L.width / 2]);
        bot.push([x, y + L.width / 2]);
      }
      // 渐变填充
      const grad = ctx.createLinearGradient(0, cy - L.width, 0, cy + L.width);
      grad.addColorStop(0, L.color + '00');
      grad.addColorStop(0.5, L.color + Math.floor(L.alpha * 255).toString(16).padStart(2, '0'));
      grad.addColorStop(1, L.color + '00');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(top[0][0], top[0][1]);
      for (let i = 1; i < top.length; i++) ctx.lineTo(top[i][0], top[i][1]);
      for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]);
      ctx.closePath();
      ctx.fill();

      // 描边
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = L.color + Math.floor(L.alpha * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      for (let i = 0; i < top.length; i++) {
        const [x, y] = top[i];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i < bot.length; i++) {
        const [x, y] = bot[i];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 顶端高光（白热）
    if (beat > 0.05) {
      const hi: Array<[number, number]> = [];
      for (let x = 0; x <= w; x += 2) {
        const y =
          cy +
          Math.sin(x * 0.022 + t * -0.9) * ampMid +
          Math.sin(x * 0.012 + t * 0.6) * ampLow * 0.5;
        hi.push([x, y]);
      }
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#FFFFFF' + Math.floor(beat * 200).toString(16).padStart(2, '0');
      ctx.beginPath();
      for (let i = 0; i < hi.length; i++) {
        const [x, y] = hi[i];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 时域点（细线轨迹）—— 中央波峰
    const samples = timeData.length;
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = theme.waveTop + 'AA';
    ctx.beginPath();
    for (let i = 0; i < samples; i += 2) {
      const x = (i / samples) * w;
      const v = (timeData[i] - 128) / 128;
      const y = cy + v * (8 + beat * 6);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.restore();
  }
}
