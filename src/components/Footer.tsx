import { BronzeRoundel, BronzeDivider } from "../lib/ornaments";

export default function Footer() {
  return (
    <footer className="relative temp-changan py-20">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
        <div className="mb-6 flex justify-center">
          <BronzeRoundel size={72} />
        </div>

        <h2 className="font-serif text-2xl font-bold text-gold-200 md:text-3xl">
          建木 → 长安
        </h2>
        <p className="mt-2 font-display text-sm italic text-bronze-300/80">
          A cinematic storyboard · v1.1
        </p>

        <div className="my-8">
          <BronzeDivider />
        </div>

        <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-2">
          <div className="rounded-sm border border-bronze-600/30 bg-ink-900/40 p-5">
            <div className="mb-2 font-mono text-[0.6rem] tracking-widest2 text-bronze-400">
              关于 · IMAGE 01
            </div>
            <p className="text-xs leading-relaxed text-ink-200/75">
              图 1 仅作为<span className="text-gold-200">整段影像的材质质量基准</span>（光照 / 皮肤 / 金属质感参考），<span className="text-gold-200">不作为画面中出现的内容</span>。
            </p>
          </div>
          <div className="rounded-sm border border-bronze-600/30 bg-ink-900/40 p-5">
            <div className="mb-2 font-mono text-[0.6rem] tracking-widest2 text-bronze-400">
              美术 ID 索引
            </div>
            <ul className="space-y-1 font-mono text-xs text-ink-200/75">
              <li>· 角色 · 1 队长 / 9 蚩奼 / 10 伏鹤</li>
              <li>· 建筑 · 16 朱雀门</li>
              <li>· 通道 · 19 穿界门</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-[0.65rem] tracking-widest2 text-bronze-400/80">
          <span>JIANMU</span>
          <span>·</span>
          <span>TURBULENT SEA</span>
          <span>·</span>
          <span>CROSS-WORLD GATE</span>
          <span>·</span>
          <span>ZHUQUE GATE</span>
        </div>

        <p className="mt-8 font-mono text-[0.65rem] tracking-widest2 text-ink-200/40">
          © 2026 · Storyboard v1.1 · Built with React + Vite + Tailwind
        </p>
      </div>
    </footer>
  );
}
