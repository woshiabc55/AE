// 学术期刊式页脚
export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t-2 border-ink bg-paper-warm/40">
      <div className="border-t border-ink/30">
        <div className="container py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* 刊名 */}
            <div className="md:col-span-5">
              <div className="flex items-baseline gap-2">
                <span className="math-deco text-xl text-crimson">∑</span>
                <span className="font-serif font-black text-2xl text-ink">高数卷宗</span>
              </div>
              <p className="font-display-latin italic text-ink-muted text-sm mt-2">
                The Advanced Mathematics Archive
              </p>
              <p className="font-serif text-sm text-ink-muted mt-4 leading-relaxed max-w-sm">
                以学术期刊之严谨，呈高等数学之脉络。试卷与提纲并陈，复习与研读同行。
              </p>
            </div>

            {/* 栏目 */}
            <div className="md:col-span-3">
              <h4 className="font-display-latin italic text-xs uppercase tracking-widest-xl text-ink-light mb-3">
                Columns
              </h4>
              <ul className="space-y-1.5 font-serif text-sm text-ink-soft">
                <li>试卷档案 · Exam Papers</li>
                <li>复习提纲 · Outlines</li>
                <li>考点脉络 · Key Points</li>
                <li>真题索引 · Index</li>
              </ul>
            </div>

            {/* 数学符号装饰 */}
            <div className="md:col-span-4 flex items-start justify-end">
              <div className="text-right">
                <div className="font-display-latin italic text-ink-light text-sm leading-relaxed">
                  <p className="text-ink-muted">
                    “Mathematics is the language in which
                  </p>
                  <p className="text-ink-muted">
                    God has written the universe.”
                  </p>
                  <p className="text-crimson mt-2 not-italic font-serif text-xs">
                    — Galileo Galilei
                  </p>
                </div>
                <div className="mt-5 flex justify-end gap-3 text-2xl math-deco text-ink-light">
                  <span>π</span>
                  <span>∂</span>
                  <span>∞</span>
                  <span>√</span>
                </div>
              </div>
            </div>
          </div>

          {/* 版权条 */}
          <div className="mt-10 pt-5 border-t border-ink/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] uppercase tracking-widest text-ink-light font-sans">
            <span>© MMXXIV 高数卷宗 · For Academic Use</span>
            <span className="font-display-latin italic normal-case tracking-normal">
              Set in Noto Serif &amp; Cormorant Garamond
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
