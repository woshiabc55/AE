/**
 * 6幕18镜分镜数据
 * 整合自用户原始文段 — 影视PV · 大荧幕 · 觉醒
 */
export const ACTS = [
  { id: 1, name: '觉醒', en: 'AWAKENING' },
  { id: 2, name: '战场召唤', en: 'BATTLEFIELD SUMMON' },
  { id: 3, name: '天坠', en: 'METEOR' },
  { id: 4, name: '神力爆发', en: 'DIVINE ERUPTION' },
  { id: 5, name: '神战', en: 'COSMIC CLASH' },
  { id: 6, name: '余韵', en: 'AFTERMATH' }
]

export const SHOTS = [
  // ---------- 第一幕：觉醒 ----------
  {
    id: 'S01', act: 1, no: 1,
    shotSize: '大全景',
    movement: '地面仰拍 → 急速拉升',
    duration: 5200,
    description: '荒芜大地，地平线尽头一道裂痕。镜头从地面仰角开始，急速向天顶拉升，大景深纳入天地。',
    fx: 'IMAX 渲染 · IMS 粒子模糊',
    audio: 'rumble',
    audioCue: '低频嗡鸣 · 大地震颤',
    render: 'Desert',
    camera: { startScale: 1.6, endScale: 0.55, startY: 80, endY: 0, rotate: 0, opacity: [0, 1, 1, 0.6] }
  },
  {
    id: 'S02', act: 1, no: 2,
    shotSize: '远景',
    movement: '长焦压缩 → 横移',
    duration: 5800,
    description: '中国老头(农夫装扮)在农场里种地，衣衫褴褛却步伐奇特。周围年轻人围观。瞬间出拳——连续5拳，拳风白色线条高速移动，年轻人被打飞数百米，惊呼"此界有如此人"。',
    fx: '3渲2角色 · IC现实环境',
    audio: 'whoosh+bell',
    audioCue: '急促脚步 · 古老编钟',
    render: 'Farmer',
    camera: { startScale: 1.0, endScale: 1.0, startY: 0, endY: 0, rotate: 0 }
  },
  {
    id: 'S03', act: 1, no: 3,
    shotSize: '特写',
    movement: '快速变焦',
    duration: 3000,
    description: '老头抬头，眼神从浑浊瞬间变得锐利，嘴角一丝中式幽默的狡黠笑容。瞳孔金光绽放。',
    fx: '面部捕捉 · 瞳孔金光',
    audio: 'ding',
    audioCue: '清脆"叮"',
    render: 'Eye',
    camera: { startScale: 1.6, endScale: 1.0, startY: 0, endY: 0, rotate: 0 }
  },

  // ---------- 第二幕：战场召唤 ----------
  {
    id: 'S04', act: 2, no: 4,
    shotSize: '全景',
    movement: '不稳定手持 → 环绕',
    duration: 5200,
    description: '战场废墟，崩塌的九层妖塔(中式)虚影。画面割裂，天虹闪烁，空间崩解。老头说"换个地方"。',
    fx: '画面割裂 · 空间崩解',
    audio: 'rumble+heartbeat',
    audioCue: '心跳低频 · 空间崩解',
    render: 'Ruins',
    camera: { startScale: 1.0, endScale: 1.0, startY: 0, endY: 0, rotate: 0, shake: 18 }
  },
  {
    id: 'S05', act: 2, no: 5,
    shotSize: '中景',
    movement: '快速推拉',
    duration: 3800,
    description: '士兵跌倒，抬头看见老头站在前方。镜头瞬间模糊→清晰，水墨线条从角色身上迸发。',
    fx: '水墨线条 · 镜头模糊',
    audio: 'wind',
    audioCue: '声音骤停 · 只剩风声',
    render: 'Confront',
    camera: { startScale: 1.4, endScale: 1.0, startY: 0, endY: 0, rotate: 0, blur: true }
  },
  {
    id: 'S06', act: 2, no: 6,
    shotSize: '特写',
    movement: '固定',
    duration: 4200,
    description: '老头方言/古音台词："炽龙！逮住他！" — 嘴唇微动，言出法随，空间开始扭曲。',
    fx: '言出法随 · 空间扭曲',
    audio: 'incant',
    audioCue: '古老咒语回声 · 多层混响',
    render: 'Incant',
    camera: { startScale: 1.0, endScale: 1.05, startY: 0, endY: 0, rotate: 0 }
  },

  // ---------- 第三幕：天坠 ----------
  {
    id: 'S07', act: 3, no: 7,
    shotSize: '大全景',
    movement: '天顶俯拍 → 急速下坠',
    duration: 5400,
    description: '天空撕裂，一颗行星冲破大气层，燃烧着砸向地面。火球占据整个IMAX画幅。',
    fx: '大气摩擦粒子 · 冲击波扩散',
    audio: 'infrasound',
    audioCue: '次声波压迫 · 耳膜刺痛',
    render: 'Meteor',
    camera: { startScale: 0.4, endScale: 1.6, startY: -50, endY: 30, rotate: 0 }
  },
  {
    id: 'S08', act: 3, no: 8,
    shotSize: '中景',
    movement: '稳定跟拍',
    duration: 3800,
    description: '金属铠甲骑士逆光剪影站起，尘埃粒子弥漫。',
    fx: 'IC级现实渲染 · 逆光剪影',
    audio: 'metal',
    audioCue: '金属铠甲碰撞',
    render: 'Knight',
    camera: { startScale: 1.0, endScale: 1.0, startY: 0, endY: 0, rotate: 0 }
  },
  {
    id: 'S09', act: 3, no: 9,
    shotSize: '特写',
    movement: '慢动作',
    duration: 3200,
    description: '骑士面部细节，异域神秘。低声沉吟。',
    fx: '面部细节强化',
    audio: 'whisper-en',
    audioCue: '英文低沉 · 古老口音',
    render: 'Face',
    camera: { startScale: 1.4, endScale: 1.0, startY: 0, endY: 0, rotate: 0 }
  },

  // ---------- 第四幕：神力爆发 ----------
  {
    id: 'S10', act: 4, no: 10,
    shotSize: '中景',
    movement: '环绕长镜头',
    duration: 6000,
    description: '老头单手平推，动作如农夫推犁般随意——行星瞬间静止，然后向内坍缩、爆裂、毁灭。',
    fx: '空间褶皱 · 引力透镜 · 几何碎片',
    audio: 'silence→boom',
    audioCue: '绝对静音 → 爆发性白噪音',
    render: 'Push',
    camera: { startScale: 1.0, endScale: 1.0, startY: 0, endY: 0, rotate: 30, perspective: true }
  },
  {
    id: 'S11', act: 4, no: 11,
    shotSize: '大全景',
    movement: '急速后退',
    duration: 4400,
    description: '冲击波几何倍数扩散，环形气浪摧毁方圆百里——但老头和士兵所在之处安然无恙。',
    fx: '空间割裂 · 毁灭与安全边界',
    audio: 'rumble-sweep',
    audioCue: '冲击波低频扫荡',
    render: 'Wave',
    camera: { startScale: 1.2, endScale: 0.5, startY: 0, endY: 0, rotate: 0 }
  },
  {
    id: 'S12', act: 4, no: 12,
    shotSize: '近景',
    movement: '快速切换',
    duration: 3000,
    description: '太空巨兽从裂隙中探出——老头与巨兽第一次交锋。水墨画风格打击轨迹。',
    fx: '水墨线条 · 力量走向',
    audio: 'bone',
    audioCue: '骨骼碰撞沉闷巨响',
    render: 'FirstHit',
    camera: { startScale: 1.3, endScale: 1.0, startY: 0, endY: 0, rotate: 0, flash: true }
  },

  // ---------- 第五幕：神战 ----------
  {
    id: 'S13', act: 5, no: 13,
    shotSize: '特写→全景',
    movement: '镜头瞬间变化',
    duration: 5000,
    description: '老头每一次出拳，冲击波都几何倍扩散，在宇宙中形成涟漪。速度线+动态模糊。',
    fx: '速度线 · 动态模糊',
    audio: 'punch-stack',
    audioCue: '打击音效层层叠加',
    render: 'Cosmos',
    camera: { startScale: 1.6, endScale: 0.7, startY: 0, endY: 0, rotate: 0, speedLine: true }
  },
  {
    id: 'S14', act: 5, no: 14,
    shotSize: '中景',
    movement: '快速横移',
    duration: 4000,
    description: '巨兽被击中，空间本身被撕裂，露出背后的虚空与星辰。物理法则崩坏的视觉化。',
    fx: '空间毁灭 · 物理崩坏',
    audio: 'glass-mega',
    audioCue: '玻璃碎裂声放大千倍',
    render: 'Tear',
    camera: { startScale: 1.0, endScale: 1.0, startY: 0, endY: 0, rotate: 0, slideX: 100 }
  },
  {
    id: 'S15', act: 5, no: 15,
    shotSize: '大全景',
    movement: '360度环绕',
    duration: 5800,
    description: '最终一击——老头跃起，全身化为水墨金龙，贯穿巨兽。3渲2角色完全释放，中国神话美学爆发。',
    fx: '水墨金龙 · 神话美学',
    audio: 'dragon+silence',
    audioCue: '龙吟 + 宇宙寂静',
    render: 'Dragon',
    camera: { startScale: 0.6, endScale: 1.2, startY: 0, endY: 0, rotate: 360, orbit: true }
  },

  // ---------- 第六幕：余韵 ----------
  {
    id: 'S16', act: 6, no: 16,
    shotSize: '远景',
    movement: '缓慢拉升',
    duration: 5200,
    description: '巨兽尸体漂浮在破碎的星球残骸间，老头站在一块碎石上，重新变成那个佝偻的农夫。',
    fx: '《沙丘》低饱和 · 苍凉史诗',
    audio: 'wind+stars',
    audioCue: '风声 · 远处星辰低语',
    render: 'Aftermath',
    camera: { startScale: 0.8, endScale: 0.5, startY: 50, endY: 0, rotate: 0 }
  },
  {
    id: 'S17', act: 6, no: 17,
    shotSize: '特写',
    movement: '固定',
    duration: 3000,
    description: '老头中式幽默收束的狡黠眼神——从神回到人。',
    fx: '反差感',
    audio: 'flute',
    audioCue: '轻快笛声插入',
    render: 'Wink',
    camera: { startScale: 1.0, endScale: 1.0, startY: 0, endY: 0, rotate: 0 }
  },
  {
    id: 'S18', act: 6, no: 18,
    shotSize: '黑屏',
    movement: '缓慢淡出',
    duration: 3800,
    description: '编钟最后一声。色调严格《沙丘》低饱和。',
    fx: '黑屏 · 低饱和',
    audio: 'bell-final',
    audioCue: '钟声余韵 · 渐隐',
    render: 'Black',
    camera: { startScale: 1.0, endScale: 1.0, startY: 0, endY: 0, rotate: 0 }
  }
]

export const TOTAL_DURATION = SHOTS.reduce((acc, s) => acc + s.duration, 0)
