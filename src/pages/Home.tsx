import MainToolbar from '../components/Toolbar/MainToolbar';
import LayerPanel from '../components/Layers/LayerPanel';
import SVGCanvas from '../components/Canvas/SVGCanvas';
import PropertyPanel from '../components/Properties/PropertyPanel';
import TimelinePanel from '../components/Timeline/TimelinePanel';
import SceneManager from '../components/Scenes/SceneManager';

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f1117] text-white overflow-hidden">
      {/* 顶部工具栏 */}
      <MainToolbar />

      {/* 中间区域 */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* 左侧图层面板 */}
        <div className="flex-shrink-0">
          <LayerPanel />
        </div>

        {/* 中央画布 */}
        <div className="flex-1 overflow-hidden min-w-0">
          <SVGCanvas />
        </div>

        {/* 右侧属性面板 */}
        <div className="flex-shrink-0">
          <PropertyPanel />
        </div>
      </div>

      {/* 底部时间线 */}
      <div className="flex-shrink-0">
        <TimelinePanel />
      </div>

      {/* 底部场景管理条 */}
      <div className="flex-shrink-0">
        <SceneManager />
      </div>
    </div>
  );
}
