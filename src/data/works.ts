import { slugify } from '@/lib/slug'

export type WorkCategory = 'Brand' | 'Motion' | 'Visual' | 'Campaign'

export type Work = {
  slug: string
  index: string
  title: string
  client: string
  year: number
  category: WorkCategory
  coverPrompt: string
  summary: string
  scope: string[]
  tags: string[]
  size: 'wide' | 'tall' | 'square'
  accent: string // 卡片主色
}

const raw: Omit<Work, 'slug'>[] = [
  {
    index: '01',
    title: 'Allotropes / 晨昏之间',
    client: 'BOREAS 咖啡',
    year: 2025,
    category: 'Brand',
    coverPrompt:
      'minimal editorial product photography of a matte black coffee bag on a cream backdrop, geometric shadows, a single droplet of coffee, brutalist composition, high contrast, no text',
    summary:
      '为 BOREAS 重塑整套品牌识别:从字标、配色到包装结构,围绕"晨昏之间"的双重气质建立视觉系统。',
    scope: ['品牌策略', '字标与字体设计', '包装结构', '视觉规范'],
    tags: ['Identity', 'Packaging', 'Type'],
    size: 'wide',
    accent: '#D7FF3A',
  },
  {
    index: '02',
    title: 'Concrete Bloom',
    client: 'NAIAD 香水',
    year: 2024,
    category: 'Motion',
    coverPrompt:
      'cinematic macro shot of translucent water droplet falling onto a cracked concrete slab, slow motion, magenta and chartreuse lighting, ultra detailed, no text',
    summary:
      '香水发布动态 KV:以"水泥中开出的花"为概念,通过 12 秒慢镜 + 颗粒噪点,放大嗅觉的物理痕迹。',
    scope: ['动态 KV', '分镜脚本', '调色', '现场指导'],
    tags: ['Motion', 'Art Direction', 'Key Visual'],
    size: 'tall',
    accent: '#FF4D2E',
  },
  {
    index: '03',
    title: 'Pivot Index',
    client: 'MERIDIAN 建筑事务所',
    year: 2025,
    category: 'Visual',
    coverPrompt:
      'architectural poster of stacked brutalist concrete volumes at golden hour, long dramatic shadows, isometric perspective, dust in the air, no people, no text',
    summary:
      '为事务所年度作品集设计全套视觉系统,采用 12 等分网格与统一节奏,让作品本身成为主角。',
    scope: ['视觉系统', '书籍设计', '展陈'],
    tags: ['Print', 'Identity', 'Editorial'],
    size: 'square',
    accent: '#F2EFE9',
  },
  {
    index: '04',
    title: 'Soft Strike',
    client: 'KILN 服装',
    year: 2024,
    category: 'Campaign',
    coverPrompt:
      'fashion campaign still life: a single draped electric yellow silk fabric frozen mid-fall, against charcoal paper background, high contrast studio lighting, no model, no text',
    summary:
      '春夏系列 campaign:用一块绸缎、一种电光黄、12 张静帧,完成一组克制却极有冲击力的视觉叙事。',
    scope: ['Campaign 概念', '造型指导', '平面拍摄', '物料延展'],
    tags: ['Campaign', 'Styling', 'Print'],
    size: 'wide',
    accent: '#D7FF3A',
  },
  {
    index: '05',
    title: 'Half-Light Atlas',
    client: 'OBSIDIAN 出版社',
    year: 2025,
    category: 'Visual',
    coverPrompt:
      'dark moody still life of an open hardcover book lit by a single warm desk lamp, the pages are pure black with embossed geometric shapes, dust particles in the light beam, no text on cover',
    summary:
      '面向独立出版的品牌重塑:以"半明半暗的地图集"为隐喻,构建书籍封面与版式的统一语法。',
    scope: ['品牌策略', '书籍设计', '字体定制'],
    tags: ['Editorial', 'Identity', 'Type'],
    size: 'tall',
    accent: '#FF4D2E',
  },
  {
    index: '06',
    title: 'Static Garden',
    client: 'GINKGO 家居',
    year: 2024,
    category: 'Brand',
    coverPrompt:
      'studio product shot of a sculptural matte white ceramic vase with a single dried ginkgo branch, cream seamless backdrop, soft directional light, brutalist simplicity, no text',
    summary:
      '家居品牌延展:从器物出发建立摄影语言,以单一光源与中性背景,放大材质的呼吸感。',
    scope: ['品牌延展', '电商视觉', '包装'],
    tags: ['E-commerce', 'Packaging', 'Photography'],
    size: 'square',
    accent: '#F2EFE9',
  },
  {
    index: '07',
    title: 'Loop / De Loop',
    client: 'MAGMA 音乐节',
    year: 2025,
    category: 'Motion',
    coverPrompt:
      'abstract motion poster of a single rotating ribbon of molten lava, deep black background, electric orange and acid green trails, long exposure effect, no text',
    summary:
      '音乐节主视觉:用一条无限循环的"火环"作为母题,在 9 屏装置中以不同速度旋转。',
    scope: ['主视觉', '动态海报', '现场视觉', '周边'],
    tags: ['Motion', 'Identity', 'Key Visual'],
    size: 'wide',
    accent: '#FF4D2E',
  },
  {
    index: '08',
    title: 'Cargo, Unloaded',
    client: 'PORTUS 物流',
    year: 2024,
    category: 'Campaign',
    coverPrompt:
      'monochrome overhead shot of an empty industrial shipping container, light pouring in from one open door, dramatic dust motes, concrete floor, no text',
    summary:
      'B2B 品牌的反套路传播:用一组"卸货之后"的静默画面,讲一个关于"留白"的故事。',
    scope: ['Campaign 概念', '平面拍摄', '官网视觉'],
    tags: ['Campaign', 'B2B', 'Photography'],
    size: 'tall',
    accent: '#8A8780',
  },
  {
    index: '09',
    title: 'Field Notes',
    client: 'NORD 个人工作室',
    year: 2025,
    category: 'Visual',
    coverPrompt:
      'top-down flat lay of a worn leather notebook, a brass compass, and a pressed leaf on cream paper, soft window light, no text, editorial still life',
    summary:
      '个人工作室品牌设计:从田野笔记汲取灵感,建立一套"工作日志"式的版式语言。',
    scope: ['品牌识别', '模板系统', '网站设计'],
    tags: ['Identity', 'Web', 'Template'],
    size: 'square',
    accent: '#D7FF3A',
  },
]

export const works: Work[] = raw.map((w) => ({ ...w, slug: slugify(w.title) }))
