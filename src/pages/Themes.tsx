import { useEffect } from 'react';
import { THEMES, THEME_KEYS, useTheme } from '../components/Theme';
import { ThemeSwitcherPanel, ThemeSwitcherModal, useThemeModal } from '../components/ThemeSwitcher';
import { Check, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Themes() {
  const { theme, setTheme } = useTheme();
  const { open, openModal, closeModal } = useThemeModal();

  useEffect(() => { document.title = 'THEMES — Skill Forge'; }, []);

  return (
    <div>
      {/* HERO - 3x3 母格 (标题 2, 当前主题卡 1) */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="font-mono text-xs text-volt mb-3 flex items-center gap-2">
              <Palette size={12} />
              <span>// 6 THEMES / 6 主题 / V.10 大规模重塑</span>
            </div>
            <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.82] tracking-tighter">
              <span className="block">PICK</span>
              <span className="block text-volt">YOUR</span>
              <span className="block">THEME.</span>
            </h1>
            <p className="mt-6 text-bone/80 max-w-2xl">
              6 套完整主题。点击下方任一主题即可全站换肤。
              主题基于 CSS 变量，所有组件实时响应。
              切换会持久化到 localStorage，下次访问仍生效。
            </p>
          </div>
          <aside
            className="border-2 border-bone/30 p-4 h-fit"
            style={{ backgroundColor: THEMES[theme].preview.bg, color: THEMES[theme].preview.fg }}
          >
            <div className="font-mono text-[10px] opacity-60 mb-2">// CURRENT / 当前</div>
            <div className="font-display font-black text-3xl" style={{ color: THEMES[theme].preview.accent }}>
              {THEMES[theme].name}
            </div>
            <div className="font-mono text-xs opacity-70 mt-1">{THEMES[theme].cn} · {THEMES[theme].desc}</div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-4 h-4 border" style={{ backgroundColor: THEMES[theme].preview.bg, borderColor: THEMES[theme].preview.fg }} />
              <span className="w-4 h-4" style={{ backgroundColor: THEMES[theme].preview.fg }} />
              <span className="w-4 h-4" style={{ backgroundColor: THEMES[theme].preview.accent }} />
            </div>
          </aside>
        </div>
      </section>

      {/* 6 主题选择面板 */}
      <section className="px-6 py-12 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-4">▸ 6 THEMES / 6 主题选择器 / 点击即时换肤</div>
          <ThemeSwitcherPanel />
        </div>
      </section>

      {/* 9 THEME COMPARISON - 6 主题 × 9 关键变量 */}
      <section className="px-6 py-12 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-4">▸ 6 × 9 / 6 主题 × 9 关键属性</div>
          <div className="overflow-x-auto border-2 border-bone/30">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-bone/30 bg-bone/5">
                  <th className="text-left p-2">ID</th>
                  {THEME_KEYS.map(k => (
                    <th key={k} className="text-left p-2 border-l border-bone/20">{THEMES[k].name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { k: 'cn',       label: '中文' },
                  { k: 'desc',     label: '描述' },
                  { k: 'font',     label: '字体组' },
                  { k: 'preview.bg',    label: 'BG' },
                  { k: 'preview.fg',    label: 'FG' },
                  { k: 'preview.accent',label: 'ACCENT' },
                ].map((row, i) => (
                  <tr key={row.k} className={i % 2 === 0 ? '' : 'bg-bone/5'}>
                    <td className="p-2 text-bone/40">{row.label}</td>
                    {THEME_KEYS.map(k => {
                      const v = (THEMES[k] as any)[row.k];
                      const isColor = typeof v === 'string' && v.startsWith('#');
                      return (
                        <td key={k} className="p-2 border-l border-bone/20">
                          {isColor ? (
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 border border-bone/30" style={{ backgroundColor: v }} />
                              <span className="text-[10px]">{v}</span>
                            </div>
                          ) : (
                            <span className="text-[10px]">{v}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 主题切换演示 - 6 卡 */}
      <section className="px-6 py-12 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-4">▸ THUMBNAILS / 6 主题缩略图（mini 版主题预览）</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {THEME_KEYS.map(k => {
              const t = THEMES[k];
              const active = theme === k;
              return (
                <button
                  key={k}
                  onClick={() => setTheme(k)}
                  className={`text-left border-2 p-3 transition-all ${active ? 'border-volt scale-[1.02]' : 'border-bone/30 hover:border-bone'}`}
                >
                  <div
                    className="aspect-video p-3 mb-2 border-2 flex flex-col justify-between"
                    style={{
                      backgroundColor: t.preview.bg,
                      borderColor: t.preview.fg,
                    }}
                  >
                    <div className="font-display font-black text-2xl leading-none" style={{ color: t.preview.fg }}>
                      Aa
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3" style={{ backgroundColor: t.preview.accent }} />
                      <span className="w-3 h-3 border" style={{ borderColor: t.preview.fg, backgroundColor: 'transparent' }} />
                      <span className="font-mono text-[9px]" style={{ color: t.preview.fg }}>01</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display font-black text-sm">{t.name}</div>
                      <div className="font-mono text-[10px] text-bone/50">{t.cn}</div>
                    </div>
                    {active && <Check size={14} className="text-volt" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 主题切换全屏弹窗触发器 */}
      <section className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto text-center">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ FULL VIEW / 全屏主题选择</div>
          <button
            onClick={openModal}
            className="px-6 py-3 bg-volt text-ink font-mono font-black border-2 border-volt hover:bg-ink hover:text-volt transition-colors text-lg"
          >
            <Palette size={16} className="inline mr-2" />打开全屏主题切换 / OPEN MODAL
          </button>
          <div className="mt-3 font-mono text-[10px] text-bone/40">▸ 或按 ESC 关闭</div>
        </div>
      </section>

      <ThemeSwitcherModal open={open} onClose={closeModal} />

      {/* 底部返回 */}
      <section className="px-6 py-8 border-t-2 border-bone/20 text-center font-mono text-[10px] text-bone/40">
        // 主题系统 V.10 · 6 主题 · CSS 变量驱动 · localStorage 持久化
        <br />
        <Link to="/" className="text-volt hover:underline">← 返回首页 / BACK TO HOME</Link>
      </section>
    </div>
  );
}
