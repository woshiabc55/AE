import { projectData } from '../data/documents';
import SceneCard from '../components/SceneCard';
import ProjectStats from '../components/ProjectStats';

export default function Home() {
  const sceneIcons = ['⚔️', '🎤', '🏚️'];
  const sceneColors = [
    'bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30',
    'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30',
    'bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30'
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl">
              🎬
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">{projectData.project_name}</h1>
              <p className="text-gray-400">{projectData.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-12">
          <ProjectStats title="总时长" value={`${projectData.total_duration}秒`} icon="⏱️" />
          <ProjectStats title="镜头总数" value={projectData.total_shots} icon="📷" />
          <ProjectStats title="场景数量" value={projectData.scenes.length} icon="🎭" />
          <ProjectStats title="角色数量" value={projectData.characters.length} icon="👤" />
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-amber-500">🎬</span>
              场景列表
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {projectData.scenes.map((scene, index) => (
              <SceneCard
                key={scene.id}
                id={scene.id}
                name={scene.name}
                duration={scene.duration}
                shots={scene.shots}
                color={sceneColors[index]}
                icon={sceneIcons[index]}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
            <span className="text-amber-500">✨</span>
            项目特色
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-amber-500">🎨</span>
                视觉风格
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="text-amber-500">▸</span>
                  {projectData.visual_style.quality}
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="text-amber-500">▸</span>
                  {projectData.visual_style.filter}
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="text-amber-500">▸</span>
                  {projectData.visual_style.reference}
                </li>
              </ul>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-amber-500">🎥</span>
                运镜风格
              </h3>
              <ul className="space-y-2">
                {projectData.camera_style.map((style, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-400">
                    <span className="text-amber-500">▸</span>
                    {style}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
