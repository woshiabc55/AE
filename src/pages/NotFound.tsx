import { Link } from 'react-router-dom';

/**
 * 404 / 路由未匹配时的回退页
 */
export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="font-display font-black text-[20vw] md:text-[12rem] leading-none text-volt">
        404
      </div>
      <div className="font-mono text-sm text-bone/60 mt-2 mb-8">
        PAGE NOT FOUND / 页面不存在 / 路径未注册
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        <Link to="/" className="px-4 py-2 bg-volt text-ink border-2 border-volt font-bold text-sm hover:bg-bone hover:border-bone transition-colors">
          ← HOME / 回首页
        </Link>
        <Link to="/packs" className="px-4 py-2 border-2 border-bone/40 text-bone hover:border-bone text-sm transition-colors">
          PACKS / 技能包
        </Link>
        <Link to="/about" className="px-4 py-2 border-2 border-bone/40 text-bone hover:border-bone text-sm transition-colors">
          ABOUT / 关于
        </Link>
      </div>
      <div className="mt-12 font-mono text-[10px] text-bone/30 max-w-md">
        路径不在 ROUTES 表内。检查 src/components/PageNav.tsx 与 src/App.tsx 中的路由配置。
      </div>
    </div>
  );
}
