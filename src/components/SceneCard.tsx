import { Link } from 'react-router-dom';

interface SceneCardProps {
  id: string;
  name: string;
  duration: number;
  shots: number;
  color: string;
  icon: string;
}

export default function SceneCard({ id, name, duration, shots, color, icon }: SceneCardProps) {
  return (
    <Link to={`/document/storyboard`} className="group block">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 ${color}`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">{name}</h3>
        <div className="flex items-center gap-4 text-gray-400">
          <div className="flex items-center gap-1">
            <span className="text-amber-500">⏱️</span>
            <span>{duration}秒</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500">📷</span>
            <span>{shots}个镜头</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
