import { useState } from 'react'
import { mockResources, mockActivities } from '@/store/appStore'
import { Download, Image, FileText, Video, MapPin, Calendar, Clock, ExternalLink } from 'lucide-react'

const typeIcons: Record<string, React.ElementType> = {
  poster: Image,
  copy: FileText,
  video: Video,
}

const typeLabels: Record<string, string> = {
  poster: '海报',
  copy: '文案',
  video: '视频',
}

const statusConfig: Record<string, { label: string; color: string }> = {
  upcoming: { label: '即将开始', color: 'bg-blue-100 text-blue-700' },
  ongoing: { label: '进行中', color: 'bg-emerald-100 text-emerald-700' },
  ended: { label: '已结束', color: 'bg-zinc-100 text-zinc-500' },
}

function ResourceCard({ resource }: { resource: typeof mockResources[0] }) {
  const Icon = typeIcons[resource.type]

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden group hover:shadow-lg hover:border-zinc-300 transition-all duration-300">
      <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
        <img
          src={resource.thumbnail}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-medium text-zinc-700">
            <Icon className="w-3 h-3" />
            {typeLabels[resource.type]}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-sm font-semibold text-zinc-800 mb-2 line-clamp-1">{resource.title}</h4>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">{resource.createdAt}</span>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-3 h-3" />
            下载
          </button>
        </div>
      </div>
    </div>
  )
}

function ActivityCard({ activity }: { activity: typeof mockActivities[0] }) {
  const status = statusConfig[activity.status]

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-blue-600 leading-none">
          {activity.date.split('-')[2]}
        </span>
        <span className="text-[10px] text-blue-400">
          {parseInt(activity.date.split('-')[1])}月
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-semibold text-zinc-800 truncate">{activity.title}</h4>
          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <MapPin className="w-3 h-3" />
            {activity.location}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <Calendar className="w-3 h-3" />
            {activity.date}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <Clock className="w-3 h-3" />
            {activity.type === 'online' ? '线上' : '线下'}
          </span>
        </div>
      </div>
      {activity.status !== 'ended' && (
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0">
          <ExternalLink className="w-3 h-3" />
          {activity.status === 'upcoming' ? '报名' : '查看'}
        </button>
      )}
    </div>
  )
}

export default function Resources() {
  const [activeTab, setActiveTab] = useState<'resources' | 'activities'>('resources')
  const [filterType, setFilterType] = useState<string>('all')

  const filteredResources = filterType === 'all'
    ? mockResources
    : mockResources.filter((r) => r.type === filterType)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 bg-white rounded-xl border border-zinc-200 p-1 w-fit">
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'resources' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          素材库
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'activities' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          活动日历
        </button>
      </div>

      {activeTab === 'resources' && (
        <>
          <div className="flex items-center gap-2">
            {[
              { key: 'all', label: '全部' },
              { key: 'poster', label: '海报' },
              { key: 'copy', label: '文案' },
              { key: 'video', label: '视频' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterType(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filterType === tab.key
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </>
      )}

      {activeTab === 'activities' && (
        <div className="space-y-3">
          {mockActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}
