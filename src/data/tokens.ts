// 设计系统令牌：色卡、字号、印章、肌理、动效曲线
// 作为"模版化"基底，被 DesignModule 与各业务组件共用

export interface ColorToken {
  name: string
  cn: string
  hex: string
  usage: string
}

export const colorTokens: ColorToken[] = [
  { name: 'ink-950',     cn: '玄', hex: '#0E0B08', usage: '底色 / 暗调主色' },
  { name: 'silk-100',    cn: '绢', hex: '#F2E9D8', usage: '正文 / 反白' },
  { name: 'cinnabar',    cn: '朱', hex: '#A22B1F', usage: '强调 / 印章 / 行动点' },
  { name: 'gold-500',    cn: '金', hex: '#C9A14A', usage: '烫金 / 装饰线' },
  { name: 'jasper-500',  cn: '青', hex: '#3D5A5A', usage: '远山 / 冷色平衡' },
  { name: 'inkstone',    cn: '砚', hex: '#1B2A3A', usage: '砚池 / 深空' },
  { name: 'ink-800',     cn: '墨', hex: '#1B1A18', usage: '次级底色 / 卡片' },
  { name: 'gold-700',    cn: '黈', hex: '#7A5A22', usage: '暗金 / 描边' },
]

export const typeScale = [
  { step: 'Display', cn: '题', size: '10rem', weight: 400, use: '卷首 / 章节大标' },
  { step: 'H1', cn: '目', size: '4.5rem', weight: 400, use: '段落主标' },
  { step: 'H2', cn: '次', size: '3rem', weight: 400, use: '次级标题' },
  { step: 'H3', cn: '节', size: '2rem', weight: 400, use: '卡片标题' },
  { step: 'Body', cn: '文', size: '1rem', weight: 400, use: '正文' },
  { step: 'Caption', cn: '注', size: '0.75rem', weight: 500, use: '镜头元数据 / 角注' },
]

export const sealLibrary = [
  { char: '壹', use: '章节起首' },
  { char: '贰', use: '章节起首' },
  { char: '叁', use: '章节起首' },
  { char: '肆', use: '章节起首' },
  { char: '墨', use: '品类 - 墨' },
  { char: '纸', use: '品类 - 纸' },
  { char: '笔', use: '品类 - 笔' },
  { char: '砚', use: '品类 - 砚' },
  { char: '茶', use: '品类 - 茶' },
  { char: '香', use: '品类 - 香' },
  { char: '玩', use: '品类 - 玩' },
  { char: '卷', use: '通栏 - 卷' },
  { char: '藏', use: '通栏 - 藏' },
  { char: '印', use: '通栏 - 印' },
]

export const textures = [
  { id: 'paper', cn: '宣纸', desc: '基础底纹 · 全卷通用', sample: 'noise' },
  { id: 'rice', cn: '米黄', desc: '暖调底纹 · 雅物柜', sample: 'warm' },
  { id: 'ink', cn: '墨韵', desc: '深底纹理 · 影院 / 章末', sample: 'dark' },
  { id: 'mount', cn: '远山', desc: '山水层叠 · 卷一首', sample: 'mountain' },
]

export const motionTokens = [
  { name: 'brush-in', desc: '题字描线入场', duration: '1.4s', easing: 'cubic-bezier(.2,.7,.2,1)' },
  { name: 'shake-slow', desc: '镜头微抖 · 静止时', duration: '0.8s', easing: 'ease-in-out' },
  { name: 'flicker', desc: '录制指示灯', duration: '2.4s', easing: 'ease-in-out' },
  { name: 'bleed', desc: '墨液飞溅', duration: '0.9s', easing: 'ease-out' },
  { name: 'hover-glow', desc: '悬停朱砂光晕', duration: '0.25s', easing: 'ease' },
]

export const principles = [
  {
    id: 'yin-yang',
    cn: '阴阳对位',
    en: 'YIN · YANG',
    desc: '墨黑为底，绢白为字；朱砂为点，冷金为线。强对比压全卷，弱对比托气氛。',
    ratio: '8 : 2',
  },
  {
    id: 'seal-accent',
    cn: '朱砂点睛',
    en: 'SEAL · ACCENT',
    desc: '每张卡必有一枚印章，落于上左 / 右上；其大小不超过版面 8%，旋转 -6°。',
    ratio: '≤ 8%',
  },
  {
    id: 'three-beat',
    cn: '三段成章',
    en: 'THREE · BEAT',
    desc: '每章节以"题 / 幕 / 跋"三段呈现：题字 → 主体 → 落款。字幕用 01/02/03 起。',
    ratio: '1 : 6 : 1',
  },
  {
    id: 'tassel',
    cn: '流苏分隔',
    en: 'TASSEL · DIV',
    desc: '段落之间用一道由 0% 透明到 50% 烫金再到透明的细线作"流苏"，宽度不超 240px。',
    ratio: '≤ 240px',
  },
  {
    id: 'scroll-axis',
    cn: '卷轴为骨',
    en: 'SCROLL · AXIS',
    desc: '整页以"卷"为节奏单位，自上而下展卷；右侧固定轴头 + 进度。',
    ratio: '固定',
  },
  {
    id: 'lens-meta',
    cn: '镜头在场',
    en: 'LENS · META',
    desc: '分镜附 ISO / 快门 / 焦段 / REC 计时器，让"画"在电影之内。',
    ratio: '4 行',
  },
]
