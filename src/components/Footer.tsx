export const Footer = () => {
  return (
    <footer className="relative bg-ink-950 border-t border-gold-700/30 px-8 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="font-brush text-silk-100 text-3xl">HRNMLJ · 古卷商城</div>
          <div className="text-silk-300/60 mt-2 font-seal tracking-widest text-xs">
            墨卷为屏 · 江湖为幕
          </div>
          <p className="text-silk-300/70 mt-4 leading-7 max-w-md">
            取古意于器物，列卷中以为案头清供；以分镜作序，以朱砂作结。
            愿客官于此卷中，得半日清欢。
          </p>
        </div>
        <div className="md:col-span-3">
          <div className="lens-tag mb-3">卷 内</div>
          <ul className="space-y-2 text-silk-300/80">
            <li>· 卷一 · 孤烟直</li>
            <li>· 卷二 · 烟尘起</li>
            <li>· 卷三 · 刀光乱</li>
            <li>· 卷四 · 万马奔腾</li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="lens-tag mb-3">阁 中</div>
          <ul className="space-y-2 text-silk-300/80">
            <li>· 雅物柜</li>
            <li>· 典藏阁</li>
            <li>· 私藏墨宝</li>
            <li>· 卷末寄语</li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="lens-tag mb-3">客 官</div>
          <ul className="space-y-2 text-silk-300/80">
            <li>· 入卷</li>
            <li>· 落印</li>
            <li>· 寄语</li>
          </ul>
        </div>
      </div>
      <div className="divider-tassel mt-12 mb-6 opacity-50" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-silk-300/40 text-xs font-seal tracking-widest">
        <div>© MMXXVI · HRNMLJ · 卷藏江湖</div>
        <div>· 古卷封泥 · 一刻千金 ·</div>
      </div>
    </footer>
  )
}
