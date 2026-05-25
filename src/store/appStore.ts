import { create } from 'zustand'

interface AppState {
  sidebarCollapsed: boolean
  activeRoute: string
  toggleSidebar: () => void
  setActiveRoute: (route: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  activeRoute: '/',
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActiveRoute: (route) => set({ activeRoute: route }),
}))

interface PromotionStats {
  totalInvites: number
  totalRevenue: number
  monthlyRevenue: number
  rank: number
  inviteTrend: number[]
  revenueTrend: number[]
}

interface InviteLink {
  id: string
  url: string
  createdAt: string
  clickCount: number
  registerCount: number
}

interface ResourceItem {
  id: string
  title: string
  type: 'poster' | 'copy' | 'video'
  thumbnail: string
  downloadUrl: string
  createdAt: string
}

interface ActivityEvent {
  id: string
  title: string
  date: string
  location: string
  type: 'online' | 'offline'
  status: 'upcoming' | 'ongoing' | 'ended'
}

export const mockPromotionStats: PromotionStats = {
  totalInvites: 1286,
  totalRevenue: 8432.5,
  monthlyRevenue: 2156.0,
  rank: 23,
  inviteTrend: [45, 62, 78, 95, 110, 128, 142, 156, 178, 195, 210, 238],
  revenueTrend: [320, 450, 580, 720, 890, 1050, 1200, 1380, 1520, 1680, 1850, 2156],
}

export const mockInviteLinks: InviteLink[] = [
  {
    id: '1',
    url: 'https://app-6p5j8eshleyp.appmiaoda.com/?track_id=promolink-8ps30594vh1c',
    createdAt: '2026-05-20',
    clickCount: 342,
    registerCount: 89,
  },
  {
    id: '2',
    url: 'https://app-6p5j8eshleyp.appmiaoda.com/?track_id=promolink-8ps30594vh1c&ref=wechat',
    createdAt: '2026-05-18',
    clickCount: 218,
    registerCount: 56,
  },
]

export const mockResources: ResourceItem[] = [
  {
    id: '1',
    title: '秒哒推广海报-科技蓝',
    type: 'poster',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tech%20blue%20promotional%20poster%20for%20AI%20no-code%20platform%2C%20clean%20design%20with%20gradient%20background&image_size=portrait_4_3',
    downloadUrl: '#',
    createdAt: '2026-05-15',
  },
  {
    id: '2',
    title: '秒哒推广海报-活力橙',
    type: 'poster',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vibrant%20orange%20promotional%20poster%20for%20AI%20platform%2C%20energetic%20design%20with%20bold%20typography&image_size=portrait_4_3',
    downloadUrl: '#',
    createdAt: '2026-05-14',
  },
  {
    id: '3',
    title: '推广文案模板合集',
    type: 'copy',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=document%20icon%20with%20text%20lines%2C%20minimal%20design%2C%20blue%20accent&image_size=square',
    downloadUrl: '#',
    createdAt: '2026-05-12',
  },
  {
    id: '4',
    title: '秒哒产品介绍视频',
    type: 'video',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20thumbnail%20with%20play%20button%2C%20AI%20technology%20theme%2C%20dark%20blue%20background&image_size=landscape_16_9',
    downloadUrl: '#',
    createdAt: '2026-05-10',
  },
  {
    id: '5',
    title: '校园推广海报',
    type: 'poster',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=campus%20recruitment%20poster%20for%20AI%20coding%20workshop%2C%20youthful%20and%20energetic&image_size=portrait_4_3',
    downloadUrl: '#',
    createdAt: '2026-05-08',
  },
  {
    id: '6',
    title: '社群推广话术指南',
    type: 'copy',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chat%20bubble%20icon%20with%20marketing%20text%2C%20social%20media%20theme%2C%20clean%20design&image_size=square',
    downloadUrl: '#',
    createdAt: '2026-05-05',
  },
]

export const mockActivities: ActivityEvent[] = [
  {
    id: '1',
    title: '秒哒AI创作坊 - 清华站',
    date: '2026-06-05',
    location: '清华大学',
    type: 'offline',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'AI产品推广技巧线上分享会',
    date: '2026-06-01',
    location: '线上直播',
    type: 'online',
    status: 'upcoming',
  },
  {
    id: '3',
    title: '秒哒黑客松大赛',
    date: '2026-05-28',
    location: '上海',
    type: 'offline',
    status: 'ongoing',
  },
  {
    id: '4',
    title: '百度世界大会秒哒展区',
    date: '2026-05-20',
    location: '北京',
    type: 'offline',
    status: 'ended',
  },
]
