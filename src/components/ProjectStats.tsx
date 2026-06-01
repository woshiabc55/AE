interface ProjectStatsProps {
  title: string;
  value: string | number;
  icon: string;
}

export default function ProjectStats({ title, value, icon }: ProjectStatsProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-1">
        {value}
      </div>
      <div className="text-gray-400 text-sm">{title}</div>
    </div>
  );
}
