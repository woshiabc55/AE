import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  colorTokens,
  typeScale,
  sealLibrary,
  textures,
  motionTokens,
  principles,
} from '../data/tokens'
import { Seal } from '../lib/svg'

/**
 * 组成·设计稿
 * 模版化设计 + 组成概念设计模块
 * - 展示设计令牌（色 / 字 / 印 / 肌理 / 动效）
 * - 呈现六条构成原理
 * - 内置一个交互式「小样合成器」，可即时换肤换印章
 */

type Template = {
  id: string
  name: string
  ratio: string
  desc: string
  build: (props: { seal: string; bg: string; ink: string; accent: string }) => JSX.Element
}

const templates: Template[] = [
  {
    id: 'card-classic',
    name: '经典宣纸卡',
    ratio: '3 : 4',
    desc: '类宣纸底 + 印章角标 + 烫金描边',
    build: ({ seal, bg, ink, accent }) => (
      <div
        className="w-full h-full p-5 flex flex-col justify-between"
        style={{
          background: `linear-gradient(180deg, ${bg}, #15110D)`,
          border: `1px solid ${accent}33`,
        }}
      >
        <div className="flex items-start justify-between">
          <span
            className="seal-stamp"
            style={{ width: 36, height: 36, fontSize: 16 }}
          >
            {seal}
          </span>
          <span className="font-seal text-[10px] tracking-widest" style={{ color: `${ink}66` }}>
            NO. 0001
          </span>
        </div>
        <div>
          <div className="font-brush text-3xl" style={{ color: ink }}>
            雅物名
          </div>
          <div className="text-xs mt-1" style={{ color: `${ink}80` }}>
            文房 · 案头清供
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="font-seal text-lg" style={{ color: accent }}>
            ¥ 8,800
          </div>
          <div
            className="px-3 py-1 text-xs font-brush tracking-widest"
            style={{ border: `1px solid ${accent}80`, color: accent }}
          >
            卷 藏
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'chapter-banner',
    name: '章节横幅',
    ratio: '21 : 5',
    desc: '朱砂印章 + 毛笔题字 + 镜头元数据',
    build: ({ seal, bg, ink, accent }) => (
      <div
        className="w-full h-full px-8 flex items-center gap-6"
        style={{ background: `linear-gradient(90deg, #0E0B08, ${bg} 50%, #0E0B08)` }}
      >
        <span
          className="seal-stamp"
          style={{ width: 64, height: 64, fontSize: 30 }}
        >
          {seal}
        </span>
        <div className="flex-1">
          <div className="lens-tag" style={{ color: accent }}>
            CHAPTER 01
          </div>
          <div className="font-brush text-4xl mt-1" style={{ color: ink }}>
            卷一 · 孤烟直
          </div>
        </div>
        <div
          className="text-right text-[10px] tracking-widest font-seal space-y-1"
          style={{ color: `${ink}66` }}
        >
          <div>ISO · 800</div>
          <div>SHUTTER · 1/120s</div>
          <div style={{ color: accent }}>REC ● 00:08:14</div>
        </div>
      </div>
    ),
  },
  {
    id: 'product-square',
    name: '方形器物卡',
    ratio: '1 : 1',
    desc: '器物象形 + 价格 + 产地，卷末速览用',
    build: ({ seal, bg, ink, accent }) => (
      <div
        className="w-full h-full grid place-items-center relative"
        style={{ background: `radial-gradient(circle at center, ${bg}55, transparent 70%)` }}
      >
        <span className="seal-stamp" style={{ width: 64, height: 64, fontSize: 28 }}>
          {seal}
        </span>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <div className="font-brush text-base" style={{ color: ink }}>
              顾渚紫笋
            </div>
            <div className="text-[10px]" style={{ color: `${ink}66` }}>
              湖州 · 长兴
            </div>
          </div>
          <div className="font-seal text-sm" style={{ color: accent }}>
            ¥ 4,200
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'page-divider',
    name: '卷中流苏',
    ratio: '12 : 1',
    desc: '段落分隔，金线 + 印章点缀',
    build: ({ seal, bg, ink, accent }) => (
      <div className="w-full h-full flex items-center justify-center gap-4">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }} />
        <span className="seal-stamp" style={{ width: 24, height: 24, fontSize: 11 }}>
          {seal}
        </span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }} />
      </div>
    ),
  },
]

export const DesignModule = () => {
  // 合成器状态
  const [tpl, setTpl] = useState(templates[0])
  const [seal, setSeal] = useState('卷')
  const [bgIdx, setBgIdx] = useState(0) // inkstone
  const [inkIdx, setInkIdx] = useState(1) // silk
  const [accentIdx, setAccentIdx] = useState(2) // cinnabar

  const bg = colorTokens[bgIdx].hex
  const ink = colorTokens[inkIdx].hex
  const accent = colorTokens[accentIdx].hex

  return (
    <div className="max-w-7xl mx-auto">
      {/* 标题 */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="lens-tag">DESIGN · 组成·设计稿</div>
        <h2 className="font-brush text-silk-100 text-6xl md:text-7xl mt-3">
          模<span className="text-cinnabar">·</span>板
          <span className="text-cinnabar mx-3">·</span>
          构<span className="text-cinnabar">·</span>成
        </h2>
        <div className="divider-tassel w-40 mt-6" />
        <p className="mt-6 text-silk-300/70 max-w-2xl leading-8 font-serif">
          卷中万象，皆由色·字·印·理四组模版拼合而成。
          此页将基底令牌与构成原理悉数展开，以供他日复用。
        </p>
      </div>

      {/* 设计令牌 */}
      <SectionTitle en="01 · TOKENS" cn="色卡" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-20">
        {colorTokens.map((c, i) => (
          <div key={c.name} className="card-paper p-3 group">
            <div
              className="aspect-square mb-3 flex items-end p-2"
              style={{
                background: c.hex,
                boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px -10px ${c.hex}66`,
              }}
            >
              <span
                className="font-seal text-[10px] tracking-widest"
                style={{ color: ['#0E0B08', '#1B2A3A', '#1B1A18', '#7A5A22'].includes(c.hex) ? '#F2E9D8' : '#0E0B08' }}
              >
                {c.hex}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-brush text-silk-100 text-lg leading-none">{c.cn}</div>
                <div className="text-[10px] text-silk-300/50 font-seal">{c.name}</div>
              </div>
              <span className="text-[10px] text-silk-300/30 font-seal">0{i + 1}</span>
            </div>
            <div className="mt-2 text-[10px] text-silk-300/60 leading-5">{c.usage}</div>
          </div>
        ))}
      </div>

      {/* 字号阶梯 */}
      <SectionTitle en="02 · TYPE SCALE" cn="字号阶梯" />
      <div className="card-paper p-8 mb-20 space-y-4">
        {typeScale.map((t) => (
          <div key={t.step} className="grid grid-cols-12 items-baseline gap-6 border-b border-gold-700/15 last:border-0 pb-3 last:pb-0">
            <div className="col-span-2 text-silk-300/40 font-seal text-xs tracking-widest">
              {t.step} · {t.cn}
            </div>
            <div
              className="col-span-2 font-brush text-silk-100"
              style={{ fontSize: Math.min(parseInt(t.size) * 0.3, 64) }}
            >
              卷藏江湖
            </div>
            <div className="col-span-1 text-silk-300/40 font-seal text-[10px]">
              {t.size}
            </div>
            <div className="col-span-2 text-silk-300/40 font-seal text-[10px]">
              wt {t.weight}
            </div>
            <div className="col-span-5 text-silk-300/70 text-sm">{t.use}</div>
          </div>
        ))}
      </div>

      {/* 印章库 */}
      <SectionTitle en="03 · SEAL LIBRARY" cn="印章库" />
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-20">
        {sealLibrary.map((s) => (
          <div key={s.char} className="card-paper p-3 flex flex-col items-center">
            <Seal char={s.char} size={56} rotate={-6} />
            <div className="mt-2 text-[10px] text-silk-300/50 font-seal">{s.use}</div>
          </div>
        ))}
      </div>

      {/* 肌理 + 动效 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div>
          <SectionTitle en="04 · TEXTURES" cn="肌理库" />
          <div className="grid grid-cols-2 gap-3">
            {textures.map((t) => (
              <div key={t.id} className="card-paper p-4 h-32 relative overflow-hidden" data-texture={t.id}>
                <div className="absolute inset-0" style={{ background: texturePreview(t.id) }} />
                <div className="relative">
                  <div className="font-brush text-silk-100 text-xl">{t.cn}</div>
                  <div className="text-[10px] text-silk-300/60 mt-1">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle en="05 · MOTION" cn="动效曲线" />
          <div className="card-paper p-5 space-y-3">
            {motionTokens.map((m, i) => (
              <div key={m.name} className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-3 font-seal text-xs text-silk-300/70">{m.name}</div>
                <div className="col-span-2 text-[10px] text-silk-300/40 font-seal">{m.duration}</div>
                <div className="col-span-7 h-6 relative overflow-hidden border border-gold-700/20">
                  <div
                    className="absolute inset-y-0 w-1/3 bg-cinnabar"
                    style={{
                      animation: `motion-${i} ${m.duration} ${m.easing} infinite`,
                    }}
                  />
                </div>
                <div className="col-span-12 text-[10px] text-silk-300/50">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 构成原理 */}
      <SectionTitle en="06 · PRINCIPLES" cn="构成原理" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {principles.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            viewport={{ once: true }}
            className="card-paper p-6 relative"
          >
            <div className="absolute top-3 right-3 text-silk-300/30 font-seal text-[10px] tracking-widest">
              0{i + 1}
            </div>
            <div className="lens-tag">{p.en}</div>
            <h3 className="font-brush text-silk-100 text-2xl mt-1">{p.cn}</h3>
            <div className="divider-tassel my-4" />
            <p className="text-silk-300/70 text-sm leading-7">{p.desc}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-cinnabar font-seal text-xs tracking-widest">
              <span>比例</span>
              <span className="border border-cinnabar/50 px-2 py-0.5">{p.ratio}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 模板合成器 */}
      <SectionTitle en="07 · COMPOSER" cn="小样合成器" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧：模板选择 */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setTpl(t)}
              className={`text-left card-paper p-4 transition ${
                tpl.id === t.id ? 'glow-cinnabar border-cinnabar/60' : 'hover:border-gold-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-brush text-silk-100 text-lg">{t.name}</div>
                <div className="text-[10px] text-silk-300/40 font-seal">{t.ratio}</div>
              </div>
              <div className="text-[11px] text-silk-300/60 leading-5">{t.desc}</div>
            </button>
          ))}
        </div>

        {/* 中间：预览 */}
        <div className="lg:col-span-6">
          <div className="card-paper p-8">
            <div className="lens-tag mb-3">PREVIEW · 即时合成</div>
            <div
              className="w-full mx-auto"
              style={{
                aspectRatio: tpl.ratio.replace(' : ', '/'),
              }}
            >
              {tpl.build({ seal, bg, ink, accent })}
            </div>
          </div>
        </div>

        {/* 右侧：参数面板 */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="card-paper p-4">
            <div className="lens-tag mb-3">SEAL · 印章</div>
            <div className="grid grid-cols-4 gap-2">
              {sealLibrary.slice(0, 12).map((s) => (
                <button
                  key={s.char}
                  onClick={() => setSeal(s.char)}
                  className={`grid place-items-center p-1 transition ${
                    seal === s.char ? 'bg-cinnabar/10 border border-cinnabar/50' : ''
                  }`}
                >
                  <Seal char={s.char} size={32} rotate={-4} />
                </button>
              ))}
            </div>
          </div>
          <div className="card-paper p-4">
            <div className="lens-tag mb-3">BG · 底色</div>
            <div className="grid grid-cols-4 gap-2">
              {colorTokens.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setBgIdx(i)}
                  className={`aspect-square transition ${
                    bgIdx === i ? 'ring-2 ring-cinnabar' : 'hover:ring-1 hover:ring-gold-500'
                  }`}
                  style={{ background: c.hex }}
                  title={c.cn}
                />
              ))}
            </div>
          </div>
          <div className="card-paper p-4">
            <div className="lens-tag mb-3">INK · 字色</div>
            <div className="grid grid-cols-4 gap-2">
              {colorTokens.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setInkIdx(i)}
                  className={`aspect-square transition ${
                    inkIdx === i ? 'ring-2 ring-cinnabar' : 'hover:ring-1 hover:ring-gold-500'
                  }`}
                  style={{ background: c.hex }}
                  title={c.cn}
                />
              ))}
            </div>
          </div>
          <div className="card-paper p-4">
            <div className="lens-tag mb-3">ACCENT · 点睛</div>
            <div className="grid grid-cols-4 gap-2">
              {colorTokens.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setAccentIdx(i)}
                  className={`aspect-square transition ${
                    accentIdx === i ? 'ring-2 ring-cinnabar' : 'hover:ring-1 hover:ring-gold-500'
                  }`}
                  style={{ background: c.hex }}
                  title={c.cn}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 底部说明 */}
      <div className="mt-16 text-center text-silk-300/50 text-sm leading-7 max-w-2xl mx-auto">
        卷中一切器物，皆由上列模版与原理所制。客官可于合成器中自换印章、自配色，
        即得一张可入卷的小样。
      </div>

      {/* 内联 keyframes（动效示意） */}
      <style>{`
        ${motionTokens.map((m, i) => {
          const t = i % 4
          return `@keyframes motion-${i}{0%{left:-33%} 100%{left:100%}}`
        }).join('\n')}
      `}</style>
    </div>
  )
}

const SectionTitle: React.FC<{ en: string; cn: string }> = ({ en, cn }) => (
  <div className="flex items-center gap-4 mb-6">
    <span className="lens-tag">{en}</span>
    <span className="h-px flex-1 bg-gradient-to-r from-gold-700/40 to-transparent" />
    <span className="font-brush text-silk-100 text-2xl">{cn}</span>
  </div>
)

function texturePreview(id: string): string {
  switch (id) {
    case 'paper':
      return 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 4px), radial-gradient(ellipse at 30% 30%, rgba(201,161,74,0.12), transparent 60%), #15110D'
    case 'rice':
      return 'radial-gradient(circle at 50% 50%, rgba(201,161,74,0.18), transparent 60%), #1B1A18'
    case 'ink':
      return 'radial-gradient(circle at 70% 30%, rgba(27,42,58,0.6), transparent 60%), #0E0B08'
    case 'mount':
      return 'linear-gradient(180deg, transparent 40%, #3D5A5A66 55%, #3D5A5A88 75%, #1B1A18 100%)'
    default:
      return '#15110D'
  }
}
