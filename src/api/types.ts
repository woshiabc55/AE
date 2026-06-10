export type IconSource =
  | 'lucide'
  | 'heroicons'
  | 'tabler'
  | 'phosphor'
  | 'iconpark'
  | 'material'
  | 'iconfont';

export const ALL_SOURCES: IconSource[] = [
  'lucide',
  'heroicons',
  'tabler',
  'phosphor',
  'iconpark',
  'material',
  'iconfont',
];

export const SOURCE_META: Record<IconSource, { label: string; short: string; count: number }> = {
  lucide: { label: 'Lucide', short: 'LC', count: 0 },
  heroicons: { label: 'Heroicons', short: 'HI', count: 0 },
  tabler: { label: 'Tabler', short: 'TB', count: 0 },
  phosphor: { label: 'Phosphor', short: 'PH', count: 0 },
  iconpark: { label: 'IconPark', short: 'IP', count: 0 },
  material: { label: 'Material', short: 'MT', count: 0 },
  iconfont: { label: 'Iconfont', short: 'IF', count: 0 },
};

export type IconItem = {
  id: string;
  name: string;
  displayName: string;
  source: IconSource;
  category: IconCategory;
  tags: string[];
  svg: string;
  /** 0=line, 1=filled, 2=duotone */
  style: 0 | 1 | 2;
};

export type IconCategory =
  | 'general'
  | 'arrow'
  | 'media'
  | 'communication'
  | 'file'
  | 'system'
  | 'commerce'
  | 'social'
  | 'weather'
  | 'editor';

export const CATEGORY_META: Record<IconCategory, { label: string; cn: string }> = {
  general: { label: 'General', cn: '通用' },
  arrow: { label: 'Arrows', cn: '箭头' },
  media: { label: 'Media', cn: '媒体' },
  communication: { label: 'Communication', cn: '通讯' },
  file: { label: 'Files', cn: '文件' },
  system: { label: 'System', cn: '系统' },
  commerce: { label: 'Commerce', cn: '商业' },
  social: { label: 'Social', cn: '社交' },
  weather: { label: 'Weather', cn: '天气' },
  editor: { label: 'Editor', cn: '编辑' },
};
