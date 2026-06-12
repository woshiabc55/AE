/* ==========================================================================
   《山海》— 神话扩写（第四部）— 山海经 · 一只鲲鹏的北冥
   5 幕 · 12 镜 · 90s
   ========================================================================== */

const SHANHAI_META = {
  titleCn: '山海',
  titleEn: 'Shān Hǎi',
  tagline: 'PV · 山海经 · 神话',
  sub: '北冥之鱼，其名为鲲 —— 鲲化为鹏，鹏之背，不知其几千里。<br />这是它的最后一次迁徙。',
  pills: ['3 渲 2 + 水墨', '玄青 + 朱砂 + 赭黄', '神话美学', '庄子 · 山海经'],
  heroPrompt: 'A colossal mythical Kun fish swimming in a vast primordial northern sea, transitioning into a giant Peng bird with wings spanning the horizon, ink wash painting aesthetic blended with IMAX cinematic scale, deep cyan and cinnabar, 16:9',
};

const SHANHAI_ACTS = [
  { num: '01', name: '北冥',     emotion: '沉 → 缓', camera: '大远景 · 慢推 · 水墨',         curve: [10, 15, 25, 35, 50, 55],
    prompt: 'A primordial northern sea in misty ink wash style, a giant mythical Kun fish slowly surfacing, deep cyan and pale jade, IMAX cinematic, 16:9' },
  { num: '02', name: '化鹏',     emotion: '缓 → 急', camera: '中景 · 急速拉升 · 视角翻转',     curve: [40, 55, 70, 80, 90, 85],
    prompt: 'A colossal Kun fish transforming into a giant Peng bird mid-leap, water exploding into spray, IMAX cinematic, cinnabar and ink, 16:9' },
  { num: '03', name: '九万里',   emotion: '急 → 远', camera: '俯拍 · 急速后退 · 视角极限',     curve: [70, 65, 60, 55, 50, 40],
    prompt: 'A giant Peng bird flying above endless clouds, wings spanning the entire frame, IMAX cinematic, ink wash style, 16:9' },
  { num: '04', name: '南冥',     emotion: '远 → 静', camera: '大远景 · 极缓拉远',             curve: [40, 35, 30, 25, 20, 15],
    prompt: 'A vast southern sea seen from above, a giant Peng bird silhouette diving toward the water, IMAX cinematic, ink wash and cyan, 16:9' },
  { num: '05', name: '复化',     emotion: '静 → 沉', camera: '大远景 · 慢推 · 镜像回环',       curve: [25, 30, 35, 40, 35, 20],
    prompt: 'A circular cinematic loop, the Peng bird landing in the southern sea and becoming a Kun fish again, IMAX cinematic, ink wash, 16:9' },
];

const SHANHAI_SHOTS = [
  { act: '第一幕：北冥', range: '0″ – 6″',   number: '01', framing: '大远景', camera: '固定 · 极缓推',         content: '北冥之水，天水一色；海面忽然涌起一个巨大的水脊，山的尺度。', fx: '水墨流体 · 3 渲 2 巨鱼轮廓 · 体积雾', audio: '极低频海鸣 · 一声远古的鲸', mood: 1, prompt: 'A primordial northern sea, sky and water merged, a giant fish-shaped swell rising with mountain scale, ink wash style, IMAX cinematic, deep cyan, 16:9' },
  { act: '第一幕：北冥', range: '6″ – 12″',  number: '02', framing: '远景',   camera: '俯拍 · 慢推',           content: '水下，鲲的剪影长达几里；它的眼睛半闭，鱼尾慢摆，掀起千米暗流。', fx: '水墨剪影 · IC 暗流粒子 · 慢动作', audio: '水压低频 · 极远处钟鸣', mood: 1, prompt: 'Aerial underwater view, a giant Kun fish silhouette kilometers long, half-closed eyes, slow tail movement creating deep currents, ink wash style, IMAX cinematic, 16:9' },
  { act: '第一幕：北冥', range: '12″ – 18″', number: '03', framing: '特写',   camera: '固定 · 烟流',           content: '鲲的眼睛缓缓张开，瞳仁里有整个北冥 —— 海、海鸟、以及一只雏鹏。', fx: '瞳仁合成 · 海鸟叠加 · 微距', audio: '水压 · 一声雏鹏鸣', mood: 1, prompt: 'Close-up of a giant Kun fish eye slowly opening, the pupil reflecting the entire northern sea and a baby Peng bird, ink wash, IMAX cinematic, intimate, 16:9' },

  { act: '第二幕：化鹏', range: '18″ – 24″', number: '04', framing: '全景',   camera: '急速拉升',             content: '鲲忽然跃出海面，水柱升天 —— 在最高点，它的身体开始爆裂为羽。', fx: '3 渲 2 化形 · 水柱粒子 · 羽毛爆裂', audio: '海裂 · 风起 · 鼓声', mood: 2, prompt: 'A giant Kun fish leaping out of the sea, water column rising to the sky, its body beginning to explode into feathers at the apex, IMAX cinematic, cinnabar, 16:9' },
  { act: '第二幕：化鹏', range: '24″ – 30″', number: '05', framing: '全景',   camera: '视角翻转',             content: '镜头以鲲为轴翻转 —— 海变成天，天变成海；羽翼在最高点完全展开。', fx: '3D 视角翻转 · 镜头内部合成 · 羽毛扩散', audio: '风起 · 鼓声渐强', mood: 2, prompt: 'Camera rotating around the leaping Kun, sea becomes sky sky becomes sea, wings fully extended at the apex, IMAX cinematic, 16:9' },
  { act: '第二幕：化鹏', range: '30″ – 36″', number: '06', framing: '大远景', camera: '急速后退',             content: '鹏翼展开的瞬间，翼展覆盖整个画面；天空被一分为二，羽色赭黄。', fx: '羽翼粒子 · 天空割裂 · 大景深', audio: '翼破空气 · 一声远古长啸', mood: 2, prompt: 'A giant Peng bird with wings covering the entire frame, sky split in two, feathers ochre yellow, IMAX cinematic, 16:9' },

  { act: '第三幕：九万里', range: '36″ – 42″', number: '07', framing: '大远景', camera: '俯拍',                 content: '鹏升入云层之上，下方是九万里的弧形地平线；星辰已可见。', fx: '云海粒子 · 星辰叠加 · 视角极限', audio: '风嘶 · 星辰低语', mood: 3, prompt: 'A Peng bird rising above the clouds, the curved horizon 90000 li below, stars visible, IMAX cinematic, ink wash, 16:9' },
  { act: '第三幕：九万里', range: '42″ – 48″', number: '08', framing: '中景',   camera: '跟拍 · 横移',           content: '鹏翼下，云层被切成一条条几何形的水墨线条；几何倍扩散。', fx: '几何水墨 · 云流粒子 · 视角极限', audio: '风 · 鼓点', mood: 3, prompt: 'A Peng bird in flight, clouds cut into geometric ink lines below, geometric multiple expansion, IMAX cinematic, 16:9' },
  { act: '第三幕：九万里', range: '48″ – 54″', number: '09', framing: '特写',   camera: '固定 · 烟流',           content: '鹏的眼睛里映出南方 —— 南冥已近，夕阳将水面染成赭黄。', fx: '瞳仁合成 · 赭黄夕阳 · 微距', audio: '风声 · 一声南方的鹤', mood: 3, prompt: 'Close-up of a Peng bird eye reflecting the southern sea at sunset, ochre yellow water, IMAX cinematic, intimate, 16:9' },

  { act: '第四幕：南冥', range: '54″ – 60″', number: '10', framing: '大远景', camera: '极缓拉远',             content: '鹏在夕阳中收翼，从九万里的高度俯冲；水面的赭黄被它压出一道黑色的 V。', fx: '俯冲粒子 · 水压变形 · 慢动作', audio: '风压 · 海面撕裂', mood: 4, prompt: 'A Peng bird diving from extreme height toward the southern sea at sunset, leaving a black V wake, IMAX cinematic, 16:9' },
  { act: '第四幕：南冥', range: '60″ – 66″', number: '11', framing: '全景',   camera: '固定',                 content: '鹏入水，水柱升天 —— 与北冥的鲲跃水瞬间镜像；它开始复化为鱼。', fx: '水柱粒子 · 镜像回环 · 化形', audio: '海裂 · 鼓声渐弱', mood: 4, prompt: 'A Peng bird entering the southern sea, water column rising, beginning to transform back into a fish, mirroring its earlier leap, IMAX cinematic, 16:9' },

  { act: '第五幕：复化', range: '66″ – 78″', number: '12', framing: '大远景', camera: '固定 · 镜像回环',       content: '水柱落下，海面合拢；一只新生的鲲缓缓游向北方，画面回到第一镜的姿态。', fx: '镜像循环 · 鱼尾摆动粒子 · 闭环剪辑', audio: '水压 · 远古鲸 · 鼓点消失', mood: 5, prompt: 'A wide circular shot, the water column settling, a newborn Kun fish slowly swimming north, mirroring the first shot, IMAX cinematic, ink wash, 16:9' },
];

const SHANHAI_CONSTRAINTS = [
  { text: '<strong>画面比例</strong>：严格 16:9 IMAX 满画幅。' },
  { text: '<strong>水墨主导</strong>：所有云、海、羽均以水墨笔触呈现；禁写实光影。' },
  { text: '<strong>色板三色</strong>：玄青 + 朱砂 + 赭黄，禁止其他饱和色。' },
  { text: '<strong>尺度夸张</strong>：所有参照物（云、海鸟、星辰）的尺度都要让观众失去"人"的参照。' },
  { text: '<strong>镜头翻转</strong>：第 5 镜必须含一次完整 180° 镜头翻转；这是全片唯一一次。' },
  { text: '<strong>闭环剪辑</strong>：最后一镜的姿态必须与第一镜完全一致；这是庄子"不知其几千里"的存在感。' },
];

const SHANHAI_ASSETS = [
  { name: '鲲剪影',         desc: '水墨剪影 · 几里长鱼 · 暗流',           thumb: 'thumb-1', prompt: 'A giant Kun fish silhouette kilometers long underwater in ink wash style, IMAX cinematic, deep cyan, 16:9' },
  { name: '化形瞬间',       desc: '鱼身爆裂为羽 · 水柱升天',             thumb: 'thumb-2', prompt: 'A Kun fish transforming into a Peng bird, body exploding into feathers, water column rising, IMAX cinematic, 16:9' },
  { name: '翼展满画幅',     desc: '翅膀占满整个 16:9 · 天空割裂',         thumb: 'thumb-3', prompt: 'A giant Peng bird with wings filling the entire 16:9 frame, sky split in two, IMAX cinematic, 16:9' },
  { name: '九万里弧形地平线', desc: '俯拍地平线 · 星辰可见 · 水墨云',     thumb: 'thumb-4', prompt: 'A Peng bird above the clouds, curved horizon 90000 li below, stars visible, ink wash style, IMAX cinematic, 16:9' },
  { name: '几何水墨云',     desc: '云被切成几何线条 · 几何倍扩散',         thumb: 'thumb-5', prompt: 'A Peng bird in flight, clouds cut into geometric ink lines below, geometric multiple expansion, IMAX cinematic, 16:9' },
  { name: '闭环镜头',       desc: '镜像回环 · 鱼游向北 · 与第 1 镜同姿态', thumb: 'thumb-6', prompt: 'A newborn Kun fish slowly swimming north in the southern sea, mirroring the first shot, IMAX cinematic, ink wash, 16:9' },
];

const SHANHAI_CHARS = [
  {
    name: '鲲', pinyin: 'Kūn', role: '北冥之鱼 · 万物之始',
    portraitPrompt: 'A colossal mythical Kun fish swimming in the primordial northern sea, ink wash painting style, deep cyan and pale jade, IMAX cinematic, character concept art, 4:3',
    expressionPrompt: 'Close-up of a giant mythical Kun fish eye half-closed, the pupil reflecting the entire northern sea, ink wash style, IMAX portrait, intimate, 4:3',
    desc: '北冥有鱼，其名为鲲。鲲之大，不知其几千里也。它在这里游了不知几万年；它已经不记得自己的名字。',
    signature: '水墨剪影 · 海鸣 · 半闭之眼',
    line: '（不答）',
    color: '#1A3A4A',
  },
  {
    name: '鹏', pinyin: 'Péng', role: '九万里之鸟 · 万物之极',
    portraitPrompt: 'A giant mythical Peng bird with wings spanning the entire horizon, flying above clouds, ink wash style, cinnabar red and ochre, IMAX cinematic, character concept art, 4:3',
    expressionPrompt: 'Close-up of a giant Peng bird eye reflecting the southern sea at sunset, ink wash style, IMAX portrait, intimate, 4:3',
    desc: '鹏之背，不知其几千里；怒而飞，其翼若垂天之云。它一飞就是九万里；它回到原点，又一飞九万里。',
    signature: '翼展满画幅 · 赭黄羽 · 俯冲',
    line: '（一啸）',
    color: '#8B1A1A',
  },
  {
    name: '北冥', pinyin: 'Běi Míng', role: '起点 · 海',
    portraitPrompt: 'A vast primordial northern sea, sky and water merged, ink wash style, deep cyan and pale jade, IMAX cinematic, 4:3',
    expressionPrompt: 'A still primordial sea surface reflecting the entire sky, ink wash style, IMAX portrait, intimate, 4:3',
    desc: '天水一色，无风，无浪，无鸟。它不记得自己被鲲压出第一道水脊的那一刻；它也不需要记得。',
    signature: '天水一色 · 水墨流体 · 远古鲸',
    line: '（不答）',
    color: '#2A4A5A',
  },
];
