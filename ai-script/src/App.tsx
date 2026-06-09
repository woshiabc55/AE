import { ACTS } from './data/catalog';
import Cover from './components/Cover';
import Prologue from './components/Prologue';
import ActHeader from './components/ActHeader';
import SceneGrid from './components/SceneGrid';
import Credits from './components/Credits';
import FilmStrip from './components/FilmStrip';
import SideRail from './components/SideRail';
import FilterBar from './components/FilterBar';
import ReelPanel from './components/ReelPanel';
import { SlateFloat, RunningLight } from './components/Decoration';

function App() {
  return (
    <div className="script-paper min-h-screen text-parchment-100 grain">
      {/* 全局 */}
      <FilmStrip />
      <SideRail />
      <FilterBar />
      <RunningLight />
      <SlateFloat />

      {/* 装订线 */}
      <div
        className="fixed left-0 top-0 bottom-0 w-px bg-gilt-600/30 pointer-events-none hidden md:block"
        style={{ zIndex: 20 }}
      />
      <div
        className="fixed right-0 top-0 bottom-0 w-px bg-gilt-600/30 pointer-events-none hidden md:block"
        style={{ zIndex: 20 }}
      />

      {/* 顶部留白（胶片条下方） */}
      <div className="h-9" />

      {/* 内容 */}
      <main className="relative" style={{ zIndex: 2 }}>
        <Cover />
        <Prologue />

        {ACTS.map((act) => (
          <section
            key={act.id}
            id={`act-${act.id}`}
            className="border-t border-gilt-600/30"
          >
            <ActHeader act={act} />
            <SceneGrid actId={act.id} />
          </section>
        ))}

        <Credits />
      </main>

      {/* Reel 侧栏（始终挂在 DOM，靠状态控制显隐） */}
      <ReelPanel />
    </div>
  );
}

export default App;
