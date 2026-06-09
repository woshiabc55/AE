import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DotMatrix } from '@/components/visual/DotMatrix';
import { CrackleField } from '@/components/visual/CrackleField';
import { LightArc } from '@/components/visual/LightArc';

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-ink relative overflow-hidden">
      <div className="fixed inset-0 -z-0">
        <DotMatrix seed="about-bg" cols={80} rows={45} color="#C9A972" density={0.1} scale={0.4} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(194,80,42,0.06) 0%, transparent 50%)' }} />
        <LightArc rotate={45} radius={48} color="#C2502A" width={0.6} blur={10} opacity={0.4} />
      </div>

      <div className="relative z-10 px-8 lg:px-12 py-6 flex items-center justify-between border-b border-gold/10">
        <button
          onClick={() => navigate('/')}
          className="text-paper/70 hover:text-gold transition-colors flex items-center gap-2 text-xs tracking-widest"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M19 12H5M12 19L5 12L12 5" />
          </svg>
          返回首页
        </button>
        <div className="text-gold/60 shot-num text-xs tracking-widest">ABOUT · 创作笔记</div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-8 lg:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-gold/50 text-[10px] shot-num tracking-[0.4em] mb-4">CREATIVE NOTES</div>
          <h1 className="serif-display text-4xl md:text-5xl text-paper mb-3">
            关于这部「分镜本」
          </h1>
          <p className="text-paper/60 leading-loose serif-display text-base">
            本作以 74 镜 / 9 段 / 4 分 30 秒的体量，将《哥窑开片》的分镜脚本重新转化为可交互的 React 视频体验。
            所有画面、声音、转场、视觉提示均由程序化生成，无任何外置影像。
          </p>
        </motion.div>

        {/* 视觉母题 */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="border border-gold/20 p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <DotMatrix seed="m1" cols={30} rows={20} color="#C9A972" density={0.5} />
            </div>
            <div className="relative">
              <div className="text-gold/50 text-[10px] shot-num tracking-[0.3em] mb-2">MOTIF 01</div>
              <h2 className="serif-display text-2xl text-paper mb-3">点阵 · Dot Matrix</h2>
              <p className="text-paper/70 text-sm leading-loose serif-display">
                像素化墨点，代表瓷器裂纹、记忆断层、像素呼吸。
                在 60×34 的 Canvas 网格中，每个圆点都有独立的闪烁相位，
                整体形成"会呼吸的瓷面"。
              </p>
            </div>
          </div>

          <div className="border border-gold/20 p-8 relative overflow-hidden">
            <div className="absolute inset-0">
              <LightArc rotate={30} radius={40} color="#C2502A" width={1} blur={8} opacity={0.5} />
              <LightArc rotate={120} radius={32} color="#C9A972" width={0.6} blur={6} opacity={0.5} reverse />
            </div>
            <div className="relative">
              <div className="text-gold/50 text-[10px] shot-num tracking-[0.3em] mb-2">MOTIF 02</div>
              <h2 className="serif-display text-2xl text-paper mb-3">光弧 · Light Arc</h2>
              <p className="text-paper/70 text-sm leading-loose serif-display">
                SVG path 描绘的弧形光带，是窑火余晖的视觉化。
                通过 stroke-dasharray + 高斯模糊滤镜，光弧像火苗一样向一个方向流动，
                象征"时间不曾停歇"。
              </p>
            </div>
          </div>

          <div className="border border-gold/20 p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-40">
              <CrackleField seed="m3" count={14} color="#C9A972" width={0.6} />
            </div>
            <div className="relative">
              <div className="text-gold/50 text-[10px] shot-num tracking-[0.3em] mb-2">MOTIF 03</div>
              <h2 className="serif-display text-2xl text-paper mb-3">裂纹场 · Crackle</h2>
              <p className="text-paper/70 text-sm leading-loose serif-display">
                使用递推式折线算法，模拟开片从中心向外扩散的过程。
                每条主裂纹可分叉 2-3 层，最终形成网状结构，
                也是全片视觉密度最高的部分。
              </p>
            </div>
          </div>

          <div className="border border-gold/20 p-8 relative overflow-hidden">
            <div className="relative">
              <div className="text-gold/50 text-[10px] shot-num tracking-[0.3em] mb-2">MOTIF 04</div>
              <h2 className="serif-display text-2xl text-paper mb-3">火焰 · Flame</h2>
              <p className="text-paper/70 text-sm leading-loose serif-display">
                SVG 路径绘制的多道贝塞尔火焰，叠加高斯模糊 + 闪烁动画。
                火焰的高度与数量随章节情绪变化：初生时温弱，裂变时汹涌，致敬时沉默。
              </p>
              <div className="mt-4 h-24 border border-gold/15 relative overflow-hidden">
                <svg className="absolute inset-x-0 bottom-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="about-flame" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#C2502A" />
                      <stop offset="100%" stopColor="#FFD4A0" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[20, 50, 80].map((x, i) => (
                    <path
                      key={i}
                      d={`M ${x} 100 C ${x - 8} 70, ${x + 8} 50, ${x} 30 C ${x - 4} 50, ${x + 4} 70, ${x} 100 Z`}
                      fill="url(#about-flame)"
                      style={{ mixBlendMode: 'screen', transformOrigin: `${x}% 100%`, animation: `aboutFlicker 1.${i + 2}s ease-in-out infinite alternate` }}
                    />
                  ))}
                  <style>{`@keyframes aboutFlicker { from { transform: scaleY(0.95); } to { transform: scaleY(1.05); } }`}</style>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* 技术栈 */}
        <section className="mt-20">
          <div className="text-gold/50 text-[10px] shot-num tracking-[0.3em] mb-4">TECH STACK</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/10 border border-gold/10">
            {[
              { label: 'React 19', desc: '视图层' },
              { label: 'TypeScript', desc: '类型契约' },
              { label: 'Vite 5', desc: '构建工具' },
              { label: 'Tailwind 3', desc: '样式系统' },
              { label: 'Zustand', desc: '状态管理' },
              { label: 'Framer Motion', desc: '页面切换' },
              { label: 'Canvas 2D', desc: '点阵 / 裂纹' },
              { label: 'Web Audio', desc: '声音合成' },
            ].map((t) => (
              <div key={t.label} className="bg-ink p-4">
                <div className="text-paper serif-display text-sm">{t.label}</div>
                <div className="text-gold/50 text-[10px] shot-num mt-1">{t.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 创作笔记 */}
        <section className="mt-20 space-y-6 serif-display text-paper/80 leading-loose">
          <h2 className="text-2xl text-paper">叙事三幕</h2>
          <p>
            <span className="text-gold">第一幕「火 · 初生」</span>建立人物与空间——火苗、窑洞、兄弟、雨夜。一切都还是"完整的"。
          </p>
          <p>
            <span className="text-gold">第二幕「裂 · 山河碎」</span>是第一道裂纹出现的时刻，也是国家破碎投射在瓷面上的时刻。
            父亲把窑砖塞进两兄弟的手，象征"火种分裂、却永不熄灭"。
          </p>
          <p>
            <span className="text-gold">第三幕「渡 · 东渡与碎」</span>让碗出海东瀛，在异国被赞叹"疵即美"，
            然后意外碎裂，最终被锔钉缝合——这就是哥窑的真正完成。
          </p>
          <p className="text-paper/60 text-sm">
            全片结尾"真正活过的东西，都会留下痕迹"——这是把瓷器当成生命体来书写的尝试，
            也是在 AI 时代对"不完美"的一种辩护。
          </p>
        </section>

        <div className="mt-20 flex flex-wrap gap-4 justify-center">
          <button onClick={() => navigate('/player')} className="btn-line btn-kiln">
            立即观看
          </button>
          <button onClick={() => navigate('/chapter')} className="btn-line">
            浏览章节
          </button>
        </div>
      </div>
    </div>
  );
}
