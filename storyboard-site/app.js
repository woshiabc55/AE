/* ==========================================================================
   对决 · IMAX 分镜脚本 — 数据 + 交互
   ========================================================================== */

const DUEL_META = {
  titleCn: '对决',
  titleEn: 'Duél',
  tagline: 'PV · 大荧幕开端',
  sub: '一个中国老头（农夫装扮）与大刀客的<span class="accent">宇宙级</span>对峙 ——<br />巨像崛起 · 水墨神力 · 冲击波几何扩散。',
  pills: ['3 渲 2 + IMAX 渲染', 'IMS 粒子模糊', '《沙丘》低饱和', '水墨国风'],
  heroPrompt: 'A colossal ancient saint statue erupting from cracked earth in epic landscape, golden volumetric light beams shooting upward, dust and golden particles rising, low angle cinematic shot, IMAX photorealistic, dark mood with gold accents, epic scale, 16:9',
};

let ACTS = [
  { num: '01', name: '觉醒',   emotion: '沉 → 升', camera: '仰拍 · 拉升 · 变焦',       curve: [10, 25, 45, 60, 70, 85],
    prompt: 'A colossal ancient saint statue erupting from cracked earth at dawn, golden volumetric god rays shooting upward, dust particles, low angle cinematic, IMAX, dark earth tones with gold light, epic scale, 16:9' },
  { num: '02', name: '战场召唤', emotion: '急 → 静', camera: '手持晃动 · 推拉 · 固定',   curve: [60, 70, 50, 30, 45, 70],
    prompt: 'A warrior drawing a great curved blade on a Chinese ancient battlefield, dust swirling, pagoda silhouette in distance, IMAX cinematic, golden hour, dark earth tones, 16:9' },
  { num: '03', name: '天坠',   emotion: '压 → 爆', camera: '俯拍下坠 · 跟拍 · 慢动作', curve: [70, 65, 80, 50, 30, 90],
    prompt: 'A massive alien warship breaking through Earth atmosphere from above, fireball and shockwave, ground collapsing beneath, IMAX cinematic, cosmic scale, dark sky with red fire, 16:9' },
  { num: '04', name: '神力爆发', emotion: '静 → 爆', camera: '环绕长镜 · 急速后退 · 快速切换', curve: [40, 50, 35, 95, 80, 70],
    prompt: 'A Chinese old man pushing his hand forward causing a planet to collapse inward with gravitational lensing, geometric debris, IMAX cinematic, dark space, 16:9' },
  { num: '05', name: '神战',   emotion: '紧 → 极', camera: '瞬切 · 横移 · 360° 环绕',   curve: [75, 85, 90, 100, 95, 60],
    prompt: 'Old man transforming into a giant golden Chinese ink dragon in cosmic battle, mythological aesthetic, deep space with stars, IMAX cinematic, 16:9' },
  { num: '06', name: '余韵',   emotion: '紧 → 远', camera: '缓慢拉升 · 固定 · 黑屏',     curve: [50, 30, 25, 20, 15, 10],
    prompt: 'Chinese old man standing calmly in vast desert, distant alien space fleet approaching, low saturation Dune color palette, IMAX cinematic, 16:9' },
];

const IMG = (prompt) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_16_9`;

const IMG_P = (prompt) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=portrait_4_3`;

let SHOTS = [
  { act: '第一幕：觉醒', range: '0″ – 5″',   number: '01', framing: '大全景', camera: '地面仰拍 → 急速拉升', content: '巨像（圣像）从地面拔地而起，尘埃与粒子在阳光斜射下形成体积光柱，地面裂纹呈放射状向外扩散。', fx: 'IMAX 渲染 · IMS 粒子模糊 · 大景深 · 镜头径向拉伸', audio: '低频嗡鸣 + 大地结构性震颤', mood: 1, prompt: 'A colossal ancient saint statue erupting from cracked earth, dust and golden particles rising, low angle looking up, IMAX cinematic, volumetric god rays, photorealistic, dark earth tones with gold light, dark mood, 16:9' },
  { act: '第一幕：觉醒', range: '5″ – 12″',  number: '02', framing: '远景',   camera: '长焦压缩 → 横移',     content: '一个中国老头（农夫装扮、衣衫褴褛）站定回望；周围空气呈现实白色线框高速掠过，老头随手抬升地面一块泥土。', fx: '3 渲 2 角色 + IC 现实环境 · 材质对比 · 运动模糊', audio: '急促脚步 + 古老编钟',         mood: 1, prompt: 'A Chinese old farmer in tattered clothes standing in a desolate battlefield, a warrior with a great curved blade facing him, dust swirling in air, white speed lines streaking past, cinematic IMAX, golden hour, dark earth tones, 16:9' },
  { act: '第一幕：觉醒', range: '12″ – 15″', number: '03', framing: '特写',   camera: '快速变焦（拉近）',   content: '老头抬头：眼神从浑浊瞬间变锐利，瞳孔金光绽放，嘴角露出一丝中式幽默的狡黠笑容。', fx: '面部微表情捕捉 · 瞳孔金光粒子 · 镜片呼吸', audio: '清脆单音「叮」 · 编钟起音',     mood: 1, prompt: 'Extreme close-up of a Chinese old man face, eyes turning from cloudy to sharp gold, a cunning smile forming, IMAX portrait, dramatic rim lighting, weathered skin texture, dark background with gold light, 16:9' },

  { act: '第二幕：战场召唤', range: '15″ – 20″', number: '04', framing: '全景',   camera: '不稳定手持 → 环绕',  content: '战场废墟；大刀客抽刀，刀身折射出冷光；中式高塔虚影在远处崩塌，空间开始崩解。', fx: '画面割裂感（镜头故意不稳）· 色彩置换',         audio: '心跳低频 + 刀鸣金属延音',       mood: 2, prompt: 'Battlefield ruins after a great war, a warrior drawing a glowing great curved blade, Chinese pagoda silhouette collapsing in background, sky turning to rainbow colors, handheld shaky camera, IMAX cinematic, 16:9' },
  { act: '第二幕：战场召唤', range: '20″ – 25″', number: '05', framing: '中景',   camera: '快速推拉',           content: '士兵跌倒，抬头看见老头挡在身前；老头开口："炽龙！逮住他。"水墨巨龙从四周延展而出。', fx: '镜头瞬间模糊 → 清晰 · 水墨线条迸发',         audio: '声音骤停 · 仅余风声',           mood: 2, prompt: 'A fallen soldier on dusty ground looking up at a Chinese old man standing in front protectively, water-ink dragon beginning to spiral out from old man body, IMAX cinematic, motion blur, 16:9' },
  { act: '第二幕：战场召唤', range: '25″ – 30″', number: '06', framing: '特写',   camera: '固定',               content: '老头带上斗笠。大刀客问："你到底是谁？"老头答："一个种地的。"——言出法随，空间扭曲。', fx: '嘴唇微动驱动空间扭曲 · 古音 / 方言',         audio: '古老咒语回声 + 多层混响',       mood: 2, prompt: 'Extreme close-up of an old Chinese man putting on a bamboo conical hat, a warrior with great blade behind him, space distortion around his lips, ancient Chinese atmosphere, IMAX portrait, 16:9' },

  { act: '第三幕：天坠', range: '30″ – 35″', number: '07', framing: '大全景', camera: '天顶俯拍 → 急速下坠', content: '天空撕裂，一颗外星战舰冲破大气层，过程地面崩塌；老头的替身先行离地以"式"镇压姿态迎上。', fx: '大气摩擦粒子 · 冲击波环形扩散 · IMS 模糊',  audio: '次声波压迫 + 耳膜刺痛感',         mood: 3, prompt: 'A massive alien warship or meteor breaking through Earth atmosphere, fireball and shockwave expanding, ground collapsing, top-down to down-tilt camera, IMAX cinematic, cosmic scale, 16:9' },
  { act: '第三幕：天坠', range: '35″ – 40″', number: '08', framing: '中景',   camera: '稳定跟拍',           content: '老头逆光剪影，铠甲碎屑悬浮；尘埃粒子在 IC 级现实渲染下可见单体运动。', fx: '尘埃粒子 IC 级现实渲染 · 逆光剪影',         audio: '金属铠甲碰撞声',                 mood: 3, prompt: 'Backlit silhouette of a Chinese old man warrior standing against bright cosmic fire, armor fragments floating, dust particles in air, IMAX cinematic, dramatic lighting, golden rim, 16:9' },
  { act: '第三幕：天坠', range: '40″ – 45″', number: '09', framing: '特写',   camera: '慢动作（120fps）',   content: '老头面部细节，异域神秘感，瞳孔金光与行星倒影同框。', fx: '面部细节分层渲染 · 异域神秘感',             audio: '英文低沉旁白 · 带古老口音',       mood: 3, prompt: 'Close-up of Chinese old man face, mysterious alien aura, golden light reflecting planet in his pupil, slow motion, IMAX portrait, low saturation, 16:9' },

  { act: '第四幕：神力爆发', range: '45″ – 50″', number: '10', framing: '中景', camera: '环绕长镜头',         content: '老头单手平推，动作如农夫推犁般随意——行星瞬间静止，向内坍缩、爆裂、毁灭。', fx: '空间褶皱 · 引力透镜 · 物质崩解为几何碎片',     audio: '绝对静音 → 爆发性白噪音',         mood: 4, prompt: 'Chinese old man pushing hand forward casually like a farmer plowing, a planet in background instantly stopping then collapsing inward, space warping with gravitational lensing, IMAX cinematic, geometric debris, 16:9' },
  { act: '第四幕：神力爆发', range: '50″ – 55″', number: '11', framing: '大全景', camera: '急速后退',           content: '冲击波几何倍数扩散，环形气浪摧毁方圆百里；但老头和士兵所在之处安然无恙——画面一分为二。', fx: '空间割裂感 · 毁灭与安全的边界清晰可见',     audio: '冲击波低频扫荡',                 mood: 4, prompt: 'Massive shockwave ring expanding across a wasteland, geometric multiple expansion, clear boundary between destroyed area and safe area where two figures stand, IMAX cinematic, 16:9' },
  { act: '第四幕：神力爆发', range: '55″ – 60″', number: '12', framing: '近景',   camera: '快速切换（5 帧 / 切）', content: '太空巨兽从裂隙中探出，与老头第一次交锋——打击轨迹呈水墨画风格。', fx: '水墨画打击轨迹 · 瞬间线条勾勒',             audio: '骨骼碰撞的沉闷巨响',             mood: 4, prompt: 'A cosmic space beast emerging from a dimensional rift, first clash with old man, water-ink style impact trails, IMAX cinematic, dark void, 16:9' },

  { act: '第五幕：神战', range: '60″ – 66″', number: '13', framing: '特写 → 全景', camera: '镜头瞬间变化（OBS 视觉转换）', content: '老头每一次出拳，冲击波都几何倍扩散，在宇宙中形成涟漪。', fx: '速度线 + 动态模糊 · 镜头跟随拳头轨迹',         audio: '打击音效层层叠加',               mood: 5, prompt: 'Chinese old man throwing a punch, shockwave rippling outward geometrically in deep space, stars in background, speed lines and motion blur, IMAX cinematic, 16:9' },
  { act: '第五幕：神战', range: '66″ – 72″', number: '14', framing: '中景',   camera: '快速横移',           content: '巨兽被击中，空间本身被撕裂，露出背后虚空与星辰。', fx: '物理法则崩坏的视觉化 · 玻璃碎裂感放大千倍', audio: '玻璃碎裂声放大千倍',             mood: 5, prompt: 'The cosmic beast being struck, space itself tearing apart revealing void and stars behind, IMAX cinematic, shattered glass effect, 16:9' },
  { act: '第五幕：神战', range: '72″ – 78″', number: '15', framing: '大全景', camera: '360° 环绕',           content: '最终一击——老头跃起，全身化为水墨金龙，贯穿巨兽；中国神话美学全面爆发。', fx: '3 渲 2 角色完全释放 · 水墨金龙 · 神话美学',   audio: '龙吟 + 宇宙寂静',                 mood: 5, prompt: 'Old man leaping and transforming into a giant golden Chinese ink dragon piercing through the cosmic beast, mythological aesthetic, IMAX cinematic, cosmic battle, 16:9' },

  { act: '第六幕：余韵', range: '78″ – 90″', number: '16', framing: '远景',   camera: '缓慢拉升 → 黑屏',     content: '老头平静站立，远处太空舰队缓至；大刀客角色深呼吸；色调严格《沙丘》低饱和。', fx: '低饱和《沙丘》色调 · 苍凉史诗感 · 编钟收束', audio: '风声 + 远处星辰低语 → 编钟收束', mood: 6, prompt: 'Chinese old man standing calmly in vast desert, distant alien space fleet approaching, low saturation Dune color palette, vast empty landscape, IMAX cinematic, 16:9' },
];

let CONSTRAINTS = [
  { text: '<strong>画面比例</strong>：严格 16:9 IMAX 满画幅，禁止上下黑边。' },
  { text: '<strong>渲染参考</strong>：IMS 粒子 / IMAX 实拍物理光照 / 3 渲 2 角色与现实环境融合。' },
  { text: '<strong>画面割裂感</strong>：毁灭 / 安全 / 现实 / 水墨 四象限必须可被一眼分辨。' },
  { text: '<strong>运动模糊</strong>：连续 5 拳及关键打击瞬间必须含运动模糊 + 速度线。' },
  { text: '<strong>运镜力度</strong>：镜头直接服务于「力」的呈现，不为美而美。' },
  { text: '<strong>声音与画面耦合</strong>：心跳 / 嗡鸣 / 编钟 / 龙吟必须与镜头切换严格同步。' },
];

let ASSETS = [
  { name: '圣像粒子崛起',  desc: 'IMS 粒子系统 · 体积光柱 · 放射裂纹',     thumb: 'thumb-1', prompt: 'Ancient saint statue rising from earth with golden particles, IMS particle effects, IMAX cinematic concept art, dark mood, 16:9' },
  { name: '水墨巨龙',      desc: '中国神话美学 · 笔触延展 · 墨分五色',     thumb: 'thumb-2', prompt: 'Chinese water-ink giant dragon spiraling in dark void, ink wash painting aesthetic, brush strokes, dark background, 16:9' },
  { name: '行星几何坍缩',  desc: '引力透镜 · 几何碎片 · 空间褶皱',         thumb: 'thumb-3', prompt: 'Planet collapsing inward, gravitational lensing, geometric fragments exploding, IMAX cinematic, dark space, 16:9' },
  { name: '冲击波扩散',    desc: '几何倍扩散 · 空间割裂 · 边界清晰',       thumb: 'thumb-4', prompt: 'Concentric shockwave rings expanding across desolate landscape, geometric multiple expansion, IMAX cinematic, low saturation, 16:9' },
  { name: '水墨金龙',      desc: '全身化龙 · 贯穿巨兽 · 神话美学爆发',     thumb: 'thumb-5', prompt: 'Giant golden Chinese ink dragon coiling in cosmos, mythological aesthetic, dark space with stars, 16:9' },
  { name: '太空舰队',      desc: '《沙丘》低饱和 · 苍凉史诗 · 远景剪影',   thumb: 'thumb-6', prompt: 'Vast alien space fleet approaching in distance over desert, low saturation Dune color palette, IMAX cinematic, 16:9' },
];

/* ==========================================================================
   角色档案 — 三部剧本的 9 位主创
   ========================================================================== */
const DUEL_CHARS = [
  {
    name: '老头', pinyin: 'Lǎo Tóu', role: '主角 · 农夫',
    portraitPrompt: 'A powerful Chinese old farmer in tattered clothes, weathered face with a cunning smile, standing in a field with golden dust, IMAX cinematic portrait, warm gold rim light, 3D to 2D stylized, character concept art, portrait 4:3',
    expressionPrompt: 'Extreme close-up of a Chinese old farmer face, eyes turning from cloudy to sharp gold, a cunning smile forming, dramatic rim lighting, weathered skin texture, IMAX portrait, character expression sheet, 4:3',
    desc: '衣衫褴褛的中国老农。看似躬耕陇亩，掌中却藏着能毁星的力量。中式幽默的狡黠笑容是他唯一的注解。',
    signature: '瞳孔金光 · 推掌如推犁 · 耳内波动',
    line: '「一个种地的。」',
    color: '#C9A961',
  },
  {
    name: '大刀客', pinyin: 'Dà Dāo Kè', role: '对手 · 刀客',
    portraitPrompt: 'A Chinese warrior with a massive curved blade sword, black and red traditional clothes, wind-blown hair, intense eyes, IMAX cinematic portrait, dark mood with red accents, character concept art, 4:3',
    expressionPrompt: 'Close-up of a Chinese warrior face, intense eyes, sweat and rain on skin, blade reflected in pupil, IMAX portrait, character expression sheet, 4:3',
    desc: '持巨刃的流浪刀客。不懂神话，只懂刀。被老头打飞数百米后喃喃道：「此界有如此人。」',
    signature: '黑红衣 · 巨刃 · 头发被风吹起',
    line: '「此界有如此人。」',
    color: '#8B1A1A',
  },
  {
    name: '太空巨兽', pinyin: 'Tài Kōng Jù Shòu', role: '终敌 · 神级',
    portraitPrompt: 'A colossal cosmic beast emerging from a dimensional rift in deep space, scale dwarfing planets, void-black body with glowing cosmic veins, IMAX cinematic, character concept art, 4:3',
    expressionPrompt: 'Close-up of a cosmic beast face, void-black skin with glowing energy lines, a single massive eye, IMAX portrait, character expression sheet, dark, 4:3',
    desc: '从宇宙裂隙中探出的虚空巨兽。身体由黑洞物质组成，眼如恒星。最终被水墨金龙贯穿。',
    signature: '虚空之体 · 宇宙级尺度 · 单眼',
    line: '（无台词 · 龙吟）',
    color: '#6B5BA8',
  },
];

const GUI_CHARS = [
  {
    name: '宇航员', pinyin: 'Yǔ Háng Yuán', role: '主角 · 归来者',
    portraitPrompt: 'An old astronaut in a worn vintage 1980s spacesuit, weathered face with old scar, holding a helmet, standing on black sand beach, IMAX cinematic portrait, blue-grey tone with warm gold, character concept art, 4:3',
    expressionPrompt: 'Extreme close-up of an old astronaut face, eyes half-closed, old scar visible, breath misting in visor, IMAX portrait, character expression sheet, intimate, 4:3',
    desc: '三十年前出发执行深空任务的宇航员。醒来时，地球已经过去 30 年，妻子已逝，儿子老了。随身带一台 1980 年代的磁带录音机，里面有儿子小时候的录音。',
    signature: '旧疤 · 半透明面罩 · 1980s 太空服',
    line: '（无台词 · 全部以呼吸与沉默）',
    color: '#6B7A8E',
  },
  {
    name: '儿子', pinyin: 'Ér Zi', role: '客体 · 等待者',
    portraitPrompt: 'An old white-haired Chinese man, 60s, gentle face, looking out a warm-lit window, IMAX cinematic portrait, warm gold interior light, character concept art, 4:3',
    expressionPrompt: 'Close-up of an old man face turning slowly, eyes wet, glass reflection overlapping with his father outside, IMAX portrait, warm gold, 4:3',
    desc: '老人的儿子。三十年前还是孩子，现在已是白发苍苍。在亮着暖黄灯光的窗口等待。',
    signature: '白发 · 暖黄窗光 · 玻璃反射',
    line: '「爸。」',
    color: '#E8C77A',
  },
  {
    name: '妻子', pinyin: 'Qī Zi', role: '客体 · 已逝',
    portraitPrompt: 'A translucent ghostly silhouette of a Chinese woman, 30s, gentle smile, surrounded by white particles, IMAX cinematic, ethereal, blue-grey tone, character concept art, 4:3',
    expressionPrompt: 'A faded memory photograph of a Chinese woman with gentle smile, sepia tones, water-damaged, IMAX portrait, intimate, 4:3',
    desc: '未真正出现。只在录音里、在路牌背后、在老人停顿的呼吸里。30 年前种的树还在开花。',
    signature: '半透明 · 树 · 录音',
    line: '「回来的时候，到家门口那棵树下等我。」',
    color: '#A8B5C4',
  },
];

const YUYE_CHARS = [
  {
    name: '快递员', pinyin: 'Kuài Dì Yuán', role: '主角 · 雨夜行者',
    portraitPrompt: 'A young Asian male courier in a transparent raincoat, riding a scooter in rainy Hong Kong neon street, face wet with rain, IMAX cinematic portrait, magenta and cyan neon, character concept art, 4:3',
    expressionPrompt: 'Close-up of a young courier face, rain dripping, phone screen reflection, concerned eyes, IMAX portrait, neon reflections, 4:3',
    desc: '雨夜快递员。7 天前一个地址消失，他仍在送那个包裹。透明雨衣是他的盔甲。',
    signature: '透明雨衣 · 电瓶车 · 雨水流痕',
    line: '「地址没了？再查查。」',
    color: '#E91E63',
  },
  {
    name: '茶餐厅老板', pinyin: 'Chá Cān Tīng Lǎo Bǎn', role: '客串 · 指点者',
    portraitPrompt: 'An old Hong Kong tea restaurant boss, gray hair, apron, behind counter with warm tungsten light, rainy window behind, IMAX cinematic portrait, warm yellow interior, character concept art, 4:3',
    expressionPrompt: 'Close-up of an old Hong Kong man pointing through a rain-streaked window, weathered face, IMAX portrait, warm tungsten, 4:3',
    desc: '深水区茶餐厅的老板。认识这一带的每一户人。他用手指向窗外，说那个地址，拆了。',
    signature: '围裙 · 钨丝灯 · 雨窗',
    line: '「那个地址，拆了。」',
    color: '#FFB74D',
  },
  {
    name: '收件人', pinyin: 'Shōu Jiàn Rén', role: '客体 · 缺席者',
    portraitPrompt: 'A faded old photograph of a Chinese person holding a cassette player, sepia tones, water-damaged, lying on a Hong Kong tenement floor, IMAX cinematic, character concept art, 4:3',
    expressionPrompt: 'A blank door with a faded red Chinese character, wooden planks nailed across, hints of a person who once lived there, IMAX portrait, melancholic, 4:3',
    desc: '从未真正出现。只在录音里、在「吉」字贴背后、在「谢谢」手写字里。已经离开了，但还在等他来。',
    signature: '「吉」字贴 · 木板钉门 · 谢谢手写',
    line: '「谢谢。」',
    color: '#00BCD4',
  },
];

const CHARACTERS = [
  { story: 'duel',  storyName: '对决',  chars: DUEL_CHARS },
  { story: 'gui',   storyName: '归',   chars: GUI_CHARS },
  { story: 'yuye',  storyName: '雨夜',  chars: YUYE_CHARS },
];

/* ==========================================================================
   渲染：六幕
   ========================================================================== */
function renderActs() {
  const root = document.getElementById('acts');
  if (!root) return;
  root.innerHTML = ACTS.map((a) => {
    const max = Math.max(...a.curve);
    const points = a.curve
      .map((v, i) => {
        const x = (i / (a.curve.length - 1)) * 100;
        const y = 56 - (v / max) * 48 - 4;
        return `${x},${y}`;
      })
      .join(' ');
    return `
      <div class="act">
        <div class="act__bg">
          <img class="act__img" loading="lazy" alt="${a.name}" src="${IMG(a.prompt)}" onload="this.classList.add('is-loaded')" onerror="this.classList.add('is-error')" />
          <div class="act__bg-scrim"></div>
        </div>
        <span class="act__num">ACT ${a.num}</span>
        <h3 class="act__name">${a.name}</h3>
        <div class="act__curve">
          <svg viewBox="0 0 100 56" preserveAspectRatio="none">
            <defs>
              <linearGradient id="g-${a.num}-${activeStoryboard}" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#C9A961" stop-opacity="0.2"/>
                <stop offset="50%" stop-color="#E8C77A" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#8B1A1A" stop-opacity="0.6"/>
              </linearGradient>
            </defs>
            <polyline
              points="${points}"
              fill="none"
              stroke="url(#g-${a.num}-${activeStoryboard})"
              stroke-width="1.5"
              vector-effect="non-scaling-stroke"
            />
            <polyline
              points="${points}"
              fill="none"
              stroke="#E8C77A"
              stroke-width="0.5"
              stroke-opacity="0.3"
              vector-effect="non-scaling-stroke"
              transform="translate(0,2)"
            />
          </svg>
        </div>
        <p class="act__camera">${a.camera}<br/><em style="font-family:var(--serif-en); font-style:italic; color:var(--gold-dim); font-size:0.8rem;">${a.emotion}</em></p>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   渲染：对照表（对决 vs 归 vs 雨夜）
   ========================================================================== */
const COMPARE_STORIES = [
  { key: 'duel',  cls: 'compare__cell--duel',  en: 'DUÉL' },
  { key: 'gui',   cls: 'compare__cell--gui',   en: 'GUĪ' },
  { key: 'yuye',  cls: 'compare__cell--yuye',  en: 'YǓ YÈ' },
];

function renderCompare() {
  const root = document.getElementById('compareGrid');
  if (!root) return;
  const stories = COMPARE_STORIES.map((s) => STORYBOARDS[s.key]);
  root.innerHTML = Array.from({ length: 6 }).map((_, i) => {
    const acts = stories.map((sb) => sb.acts[i]);
    const cells = stories.map((sb, idx) => {
      const a = acts[idx];
      const meta = COMPARE_STORIES[idx];
      return `
        <div class="compare__cell ${meta.cls}">
          <div class="compare__cell-num">${a.num}<small>${a.name} / ${meta.en}</small></div>
          <div class="compare__cell-content">
            <h4>${a.name}</h4>
            <p>${a.camera}</p>
            <span class="emotion">${a.emotion}</span>
          </div>
          <div class="compare__cell-thumb">
            <img alt="${a.name}" src="${IMG(a.prompt)}" onload="this.classList.add('is-loaded')" onerror="this.classList.add('is-error')" />
          </div>
        </div>
      `;
    }).join('');
    return `
      <div class="compare__row">
        <div class="compare__label">
          <span class="compare__label-num">ACT ${String(i + 1).padStart(2, '0')}</span>
          <span class="compare__label-vs">vs</span>
        </div>
        ${cells}
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   渲染：16 镜分镜
   ========================================================================== */
function renderShots() {
  const root = document.getElementById('shotsGrid');
  if (!root) return;
  root.innerHTML = SHOTS.map((s) => {
    // 不同景别的运镜指示
    let motionArrow = '';
    if (s.camera.includes('仰拍') || s.camera.includes('拉升') || s.camera.includes('俯拍') || s.camera.includes('跳跃')) {
      motionArrow = `<div class="shot__motion-arrow shot__motion-arrow--up">↑<br/>${s.camera.split('→')[0].trim()}</div>`;
    } else if (s.camera.includes('横移') || s.camera.includes('推拉') || s.camera.includes('跟拍')) {
      motionArrow = `<div class="shot__motion-arrow shot__motion-arrow--pan">→ ${s.camera.split('→')[0].trim()}</div>`;
    } else if (s.camera.includes('变焦') || s.camera.includes('环绕') || s.camera.includes('切换')) {
      motionArrow = `<div class="shot__motion-arrow shot__motion-arrow--zoom">⊙ ${s.camera.split('→')[0].trim()}</div>`;
    }

    return `
      <article class="shot" data-shot="${s.number}">
        <div class="shot__canvas">
          <div class="shot__frame mood-${s.mood}"></div>
          <img class="shot__img" loading="lazy" alt="Shot ${s.number} — ${s.framing}" src="${IMG(s.prompt)}" onload="this.classList.add('is-loaded')" onerror="this.classList.add('is-error')" />
          ${motionArrow}
          <span class="shot__num">SHOT ${s.number}</span>
          <span class="shot__framing">${s.framing}</span>
          <span class="shot__act-label">${s.act.split('：')[1]}</span>
          <span class="shot__timecode">${s.range}</span>
        </div>
        <div class="shot__data">
          <div class="shot__data-meta">
            <span class="shot__data-num">${s.number}</span>
            <span class="shot__data-act">${s.act}</span>
            <span class="shot__data-range">${s.range}</span>
          </div>
          <table class="shot__table">
            <tr>
              <th>运镜</th>
              <td><em>${s.camera}</em></td>
            </tr>
            <tr>
              <th>画面</th>
              <td class="shot__table td--content">${s.content}</td>
            </tr>
            <tr>
              <th>特效</th>
              <td>${s.fx}</td>
            </tr>
            <tr>
              <th>音效</th>
              <td>${s.audio}</td>
            </tr>
          </table>
        </div>
      </article>
    `;
  }).join('');
}

/* ==========================================================================
   渲染：技术约束
   ========================================================================== */
function renderConstraints() {
  const root = document.getElementById('constraintsGrid');
  if (!root) return;
  root.innerHTML = CONSTRAINTS.map((c, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `
      <div class="constraint">
        <span class="constraint__num">CONSTRAINT · ${n}</span>
        <p class="constraint__text">${c.text}</p>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   渲染：资产清单
   ========================================================================== */
function renderAssets() {
  const root = document.getElementById('assetsGrid');
  if (!root) return;
  root.innerHTML = ASSETS.map((a) => `
    <div class="asset">
      <div class="asset__thumb ${a.thumb}">
        <img class="asset__img" loading="lazy" alt="${a.name}" src="${IMG(a.prompt)}" onload="this.classList.add('is-loaded')" onerror="this.classList.add('is-error')" />
      </div>
      <div class="asset__info">
        <h3 class="asset__name">${a.name}</h3>
        <p class="asset__desc">${a.desc}</p>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   渲染：角色档案（9 位主创）
   ========================================================================== */
function renderChars() {
  const root = document.getElementById('charsGrid');
  if (!root) return;
  root.innerHTML = CHARACTERS.map((block) => `
    <div class="chars__block chars__block--${block.story}">
      <div class="chars__block-head">
        <span class="caption">${block.storyName} · 角色档案</span>
        <h3 class="chars__block-title">${block.storyName} <em>${block.story === 'duel' ? 'Duél' : block.story === 'gui' ? 'Guī' : 'Yǔ Yè'}</em></h3>
      </div>
      <div class="chars__grid">
        ${block.chars.map((c) => `
          <div class="char" style="--char-color: ${c.color}">
            <div class="char__portrait">
              <img class="char__img" alt="${c.name} 全身像" src="${IMG_P(c.portraitPrompt)}" onload="this.classList.add('is-loaded')" onerror="this.classList.add('is-error')" />
              <div class="char__portrait-fallback"></div>
            </div>
            <div class="char__head">
              <h4 class="char__name">${c.name}</h4>
              <span class="char__pinyin">${c.pinyin}</span>
            </div>
            <div class="char__role">${c.role}</div>
            <p class="char__desc">${c.desc}</p>
            <div class="char__signature">
              <span class="caption">视觉签名</span>
              <p>${c.signature}</p>
            </div>
            <div class="char__line">${c.line}</div>
            <div class="char__expression">
              <img alt="${c.name} 表情" src="${IMG_P(c.expressionPrompt)}" onload="this.classList.add('is-loaded')" onerror="this.classList.add('is-error')" />
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   交互：Hero 粒子
   ========================================================================== */
function spawnParticles() {
  const root = document.getElementById('particles');
  if (!root) return;
  const count = 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = `-10px`;
    p.style.animationDelay = `${Math.random() * 8}s`;
    p.style.animationDuration = `${6 + Math.random() * 6}s`;
    p.style.opacity = `${0.3 + Math.random() * 0.5}`;
    p.style.width = p.style.height = `${1 + Math.random() * 2}px`;
    root.appendChild(p);
  }
}

/* ==========================================================================
   交互：分镜卡进入视口
   ========================================================================== */
function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.shot').forEach((el) => observer.observe(el));
}

/* ==========================================================================
   交互：分镜卡数据区点击 — 模拟音效（避开画框，画框留给 lightbox）
   ========================================================================== */
function setupShotAudio() {
  const ctx = window.AudioContext || window.webkitAudioContext;
  if (!ctx) return;
  let audio = null;
  document.querySelectorAll('.shot__data').forEach((data) => {
    data.addEventListener('click', (e) => {
      // 排除链接等真实交互
      if (e.target.closest('a, button')) return;
      const num = data.closest('.shot').dataset.shot;
      if (audio) audio.close();
      audio = new ctx();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.frequency.value = 110 + (parseInt(num, 10) % 8) * 30;
      osc.type = num % 3 === 0 ? 'sine' : 'triangle';
      gain.gain.setValueAtTime(0, audio.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, audio.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.6);
      osc.connect(gain).connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + 0.6);
    });
  });
}

/* ==========================================================================
   时钟
   ========================================================================== */
function tickClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  const update = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    el.textContent = `${hh}:${mm}:${ss}`;
  };
  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   多剧本注册与切换
   ========================================================================== */

// 把当前 ACTS / SHOTS / CONSTRAINTS / ASSETS 快照为「对决」
const DUEL_ACTS = ACTS;
const DUEL_SHOTS = SHOTS;
const DUEL_CONSTRAINTS = CONSTRAINTS;
const DUEL_ASSETS = ASSETS;

const STORYBOARDS = {
  duel: { meta: DUEL_META, acts: DUEL_ACTS, shots: DUEL_SHOTS, constraints: DUEL_CONSTRAINTS, assets: DUEL_ASSETS },
  gui:  { meta: GUI_META,  acts: GUI_ACTS,  shots: GUI_SHOTS,  constraints: GUI_CONSTRAINTS,  assets: GUI_ASSETS  },
  yuye: { meta: YUYE_META, acts: YUYE_ACTS, shots: YUYE_SHOTS, constraints: YUYE_CONSTRAINTS, assets: YUYE_ASSETS },
};

let activeStoryboard = 'duel';

function applyStoryboard(key) {
  const sb = STORYBOARDS[key];
  if (!sb) return;
  activeStoryboard = key;
  ACTS = sb.acts;
  SHOTS = sb.shots;
  CONSTRAINTS = sb.constraints;
  ASSETS = sb.assets;

  // 更新 Hero
  document.getElementById('heroTitleCn').textContent = sb.meta.titleCn;
  document.querySelector('#heroTitleEn em').textContent = sb.meta.titleEn;
  document.getElementById('heroTagline').textContent = sb.meta.tagline;
  document.getElementById('heroSub').innerHTML = sb.meta.sub;
  document.getElementById('heroPills').innerHTML = sb.meta.pills.map((p) => `<li>${p}</li>`).join('');
  const heroImg = document.getElementById('heroImg');
  heroImg.classList.remove('is-loaded');
  heroImg.src = IMG(sb.meta.heroPrompt);

  // 重新渲染所有数据驱动区
  renderActs();
  renderShots();
  renderConstraints();
  renderAssets();
  renderDeck();
  renderLightboxThumbs();
  renderTimeline();
  setupReveal();
  setupShotAudio();

  // 重置 lightbox / 播放器状态
  closeLightbox();
  closePlayer();
  currentShotIdx = 0;

  // 预热新剧本图片
  preloadAllImages();

  // 滚回顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupTabs() {
  document.querySelectorAll('#tabs .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('is-active')) return;
      document.querySelectorAll('#tabs .tab').forEach((t) => t.classList.toggle('is-active', t === tab));
      applyStoryboard(tab.dataset.story);
    });
  });
}

/* ==========================================================================
   导出：JSON / Markdown / 打印
   ========================================================================== */
function setupExport() {
  const toggle = document.getElementById('exportToggle');
  const menu = document.getElementById('exportMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open');
  });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== toggle) {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
    }
  });

  menu.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const fmt = btn.dataset.fmt;
      if (fmt === 'json') downloadJSON();
      else if (fmt === 'md') downloadMarkdown();
      else if (fmt === 'pdf') window.print();
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
    });
  });
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadJSON() {
  const sb = STORYBOARDS[activeStoryboard];
  const data = {
    meta: sb.meta,
    acts: sb.acts,
    shots: sb.shots,
    constraints: sb.constraints,
    assets: sb.assets,
    exported: new Date().toISOString(),
  };
  downloadFile(
    JSON.stringify(data, null, 2),
    `storyboard-${activeStoryboard}-${Date.now()}.json`,
    'application/json'
  );
}

function downloadMarkdown() {
  const sb = STORYBOARDS[activeStoryboard];
  const m = sb.meta;
  let md = `# 《${m.titleCn}》— 影视 PV 分镜脚本\n\n`;
  md += `> 画幅：16:9 IMAX 满画幅\n`;
  md += `> 时长：≈ 90s（六幕 × 15s）\n`;
  md += `> 导出时间：${new Date().toLocaleString()}\n\n`;
  md += `## 六幕节奏\n\n`;
  md += `| 幕 | 标题 | 情绪 | 镜头语言 |\n| --- | --- | --- | --- |\n`;
  sb.acts.forEach((a) => {
    md += `| ${a.num} | ${a.name} | ${a.emotion} | ${a.camera} |\n`;
  });
  md += `\n## 16 镜分镜\n\n`;
  let currentAct = '';
  sb.shots.forEach((s) => {
    if (s.act !== currentAct) {
      currentAct = s.act;
      md += `\n### 【${currentAct}】\n\n`;
      md += `| 镜号 | 景别 | 运镜 | 画面 | 特效 | 音效 |\n| --- | --- | --- | --- | --- | --- |\n`;
    }
    md += `| ${s.number} | ${s.framing} | ${s.camera} | ${s.content} | ${s.fx} | ${s.audio} |\n`;
  });
  md += `\n## 全局技术约束\n\n`;
  sb.constraints.forEach((c, i) => {
    md += `${i + 1}. ${c.text.replace(/<[^>]+>/g, '')}\n`;
  });
  md += `\n## 关键特效资产\n\n`;
  sb.assets.forEach((a) => {
    md += `- **${a.name}**：${a.desc}\n`;
  });
  downloadFile(md, `storyboard-${activeStoryboard}-${Date.now()}.md`, 'text/markdown');
}

/* ==========================================================================
   启动
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderActs();
  renderShots();
  renderCompare();
  renderConstraints();
  renderAssets();
  renderChars();
  renderDeck();
  renderLightboxThumbs();
  renderTimeline();
  spawnParticles();
  setupReveal();
  setupShotAudio();
  tickClock();
  setupProgressBar();
  setupScrollSpy();
  setupAmbientAudio();
  setupLightbox();
  setupDeckObserver();
  setupPlayer();
  setupTimelineInteraction();
  preloadAllImages();
  setupTabs();
  setupExport();
});

/* ==========================================================================
   渲染：胶片轨道（底部 16 镜小图）
   ========================================================================== */
function renderDeck() {
  const track = document.getElementById('deckTrack');
  if (!track) return;
  track.innerHTML = SHOTS.map((s) => `
    <div class="deck__cell" data-shot="${s.number}" data-act="${s.act}" title="Shot ${s.number} — ${s.framing}">
      <div class="deck__cell-bg"></div>
      <img class="deck__cell-img" loading="lazy" alt="Shot ${s.number}" src="${IMG(s.prompt)}" onload="this.classList.add('is-loaded')" onerror="this.classList.add('is-error')" />
      <span class="deck__cell-num">${s.number}</span>
      <span class="deck__cell-act">${s.act.split('：')[0].replace('第', '').replace('幕', '')}</span>
    </div>
  `).join('');

  // 点击 → 滚动到对应分镜
  track.addEventListener('click', (e) => {
    const cell = e.target.closest('.deck__cell');
    if (!cell) return;
    const num = cell.dataset.shot;
    const target = document.querySelector(`.shot[data-shot="${num}"]`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ==========================================================================
   胶片轨道：显示/隐藏 + 当前镜高亮
   ========================================================================== */
function setupDeckObserver() {
  const deck = document.getElementById('deck');
  if (!deck) return;

  // Hero 滚出后显示轨道
  const heroObs = new IntersectionObserver(
    ([entry]) => {
      deck.classList.toggle('is-visible', !entry.isIntersecting);
    },
    { threshold: 0.1 }
  );
  const hero = document.getElementById('hero');
  if (hero) heroObs.observe(hero);

  // 当前镜高亮
  const shotObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          const num = entry.target.dataset.shot;
          document.querySelectorAll('.deck__cell').forEach((c) => {
            c.classList.toggle('is-active', c.dataset.shot === num);
          });
          // 同步滚动 deck 到对应 cell
          const activeCell = document.querySelector(`.deck__cell[data-shot="${num}"]`);
          if (activeCell) {
            activeCell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      });
    },
    { threshold: [0.4, 0.6] }
  );
  document.querySelectorAll('.shot').forEach((el) => shotObs.observe(el));
}

/* ==========================================================================
   Lightbox：点击分镜看大图 + 键盘左右切换
   ========================================================================== */
let currentShotIdx = 0;
function openLightbox(num) {
  const idx = SHOTS.findIndex((s) => s.number === num);
  if (idx < 0) return;
  currentShotIdx = idx;
  renderLightbox();
  const lb = document.getElementById('lightbox');
  lb.classList.add('is-open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('is-open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function navLightbox(dir) {
  currentShotIdx = (currentShotIdx + dir + SHOTS.length) % SHOTS.length;
  renderLightbox();
}

function renderLightbox() {
  const s = SHOTS[currentShotIdx];
  const inner = document.getElementById('lightboxInner');
  if (!inner) return;
  inner.innerHTML = `
    <div class="lb__canvas">
      <img class="lb__canvas-img" alt="Shot ${s.number}" src="${IMG(s.prompt)}" />
      <span class="lb__canvas-num">${s.number}</span>
      <span class="lb__canvas-act">${s.act}</span>
      <span class="lb__canvas-timecode">${s.range}</span>
    </div>
    <div class="lb__data">
      <h2>${s.act} · Shot ${s.number}</h2>
      <div class="lb__row"><span class="lb__label">景别</span><span class="lb__value">${s.framing}</span></div>
      <div class="lb__row"><span class="lb__label">运镜</span><span class="lb__value"><em>${s.camera}</em></span></div>
      <div class="lb__row"><span class="lb__label">画面</span><span class="lb__value">${s.content}</span></div>
      <div class="lb__row"><span class="lb__label">特效</span><span class="lb__value">${s.fx}</span></div>
      <div class="lb__row"><span class="lb__label">音效</span><span class="lb__value">${s.audio}</span></div>
      <div class="lb__row"><span class="lb__label">Prompt</span><span class="lb__value" style="font-family:var(--mono); font-size:0.75rem; color:var(--smoke-dim);">${s.prompt}</span></div>
    </div>
  `;
  // 同步底部缩略图高亮
  const num = s.number;
  document.querySelectorAll('.lb__thumb').forEach((t) => {
    t.classList.toggle('is-active', t.dataset.shot === num);
  });
  const active = document.querySelector('.lb__thumb.is-active');
  if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function setupLightbox() {
  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev')?.addEventListener('click', () => navLightbox(-1));
  document.getElementById('lightboxNext')?.addEventListener('click', () => navLightbox(1));
  document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb?.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });
  // 分镜画框点击 → 打开 lightbox（之前是播放音效）
  document.querySelectorAll('.shot__canvas').forEach((canvas) => {
    canvas.addEventListener('click', () => {
      const num = canvas.closest('.shot').dataset.shot;
      openLightbox(num);
    });
  });
}

/* ==========================================================================
   Lightbox 底部 16 镜缩略图导航
   ========================================================================== */
function renderLightboxThumbs() {
  const strip = document.getElementById('lightboxThumbs');
  if (!strip) return;
  strip.innerHTML = SHOTS.map((s) => `
    <div class="lb__thumb" data-shot="${s.number}" title="Shot ${s.number} — ${s.framing}">
      <img alt="Shot ${s.number}" src="${IMG(s.prompt)}" onload="this.classList.add('is-loaded')" onerror="this.classList.add('is-error')" />
      <span class="lb__thumb-num">${s.number}</span>
    </div>
  `).join('');
  strip.addEventListener('click', (e) => {
    const t = e.target.closest('.lb__thumb');
    if (!t) return;
    openLightbox(t.dataset.shot);
  });
}

/* ==========================================================================
   播放器：一键自动按时间码播放 16 镜
   ========================================================================== */
let playerTimer = null;
let playerStart = 0;
let playerIdx = 0;
let playerPaused = false;

function parseRangeToMs(range) {
  // 解析 "0″ – 5″" → 5000
  const m = range.match(/(\d+)″\s*[–-]\s*(\d+)″/);
  if (!m) return 5000;
  return (parseInt(m[2], 10) - parseInt(m[1], 10)) * 1000;
}

function openPlayer(startIdx = 0) {
  playerIdx = startIdx;
  playerPaused = false;
  document.getElementById('player').classList.add('is-open');
  document.body.style.overflow = 'hidden';
  showPlayerShot(playerIdx);
  scheduleNext();
}

function closePlayer() {
  document.getElementById('player').classList.remove('is-open');
  document.body.style.overflow = '';
  if (playerTimer) { clearTimeout(playerTimer); playerTimer = null; }
  document.getElementById('playerPlayPause').textContent = '⏸';
}

function showPlayerShot(idx) {
  const s = SHOTS[idx];
  const img = document.getElementById('playerImg');
  img.classList.remove('is-loaded');
  img.src = IMG(s.prompt);
  img.alt = `Shot ${s.number}`;
  // 重新触发 onload（src 变化时新图像会重新加载）
  img.onload = () => img.classList.add('is-loaded');

  // 提取每镜的标题（前 12 字）
  const title = s.content.replace(/[，。：；（）「」""'']/g, '').slice(0, 12);
  document.getElementById('playerTitle').textContent = title;
  document.getElementById('playerSub').innerHTML = `<em>${s.camera}</em>`;
  document.getElementById('playerCounter').textContent = `${s.number} / 16`;
  document.getElementById('playerAct').textContent = s.act;

  // 同步触发音效
  playShotTone(s.number);
  // 进度条
  document.getElementById('playerProgress').style.width = `${(idx / SHOTS.length) * 100}%`;
}

function scheduleNext() {
  if (playerPaused) return;
  if (playerTimer) clearTimeout(playerTimer);
  const range = SHOTS[playerIdx].range;
  const duration = parseRangeToMs(range);
  playerStart = Date.now();
  playerTimer = setTimeout(() => {
    playerIdx = (playerIdx + 1) % SHOTS.length;
    showPlayerShot(playerIdx);
    scheduleNext();
  }, duration);
}

function playShotTone(num) {
  const ctxCtor = window.AudioContext || window.webkitAudioContext;
  if (!ctxCtor) return;
  try {
    const ctx = new ctxCtor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 110 + (parseInt(num, 10) % 8) * 30;
    osc.type = parseInt(num, 10) % 3 === 0 ? 'sine' : 'triangle';
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {}
}

function setupPlayer() {
  document.getElementById('topbarPlay')?.addEventListener('click', () => openPlayer(0));
  document.getElementById('playerExit')?.addEventListener('click', closePlayer);
  document.getElementById('playerPlayPause')?.addEventListener('click', () => {
    playerPaused = !playerPaused;
    document.getElementById('playerPlayPause').textContent = playerPaused ? '▶' : '⏸';
    if (!playerPaused) scheduleNext();
    else if (playerTimer) clearTimeout(playerTimer);
  });
  document.getElementById('playerPrev')?.addEventListener('click', () => {
    playerIdx = (playerIdx - 1 + SHOTS.length) % SHOTS.length;
    showPlayerShot(playerIdx);
    if (!playerPaused) scheduleNext();
  });
  document.getElementById('playerNext')?.addEventListener('click', () => {
    playerIdx = (playerIdx + 1) % SHOTS.length;
    showPlayerShot(playerIdx);
    if (!playerPaused) scheduleNext();
  });
  // 倍速切换
  document.querySelectorAll('.player__speed-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      playerSpeed = parseFloat(btn.dataset.speed);
      document.querySelectorAll('.player__speed-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      if (!playerPaused) scheduleNext();
    });
  });
  document.addEventListener('keydown', (e) => {
    const p = document.getElementById('player');
    if (!p?.classList.contains('is-open')) return;
    if (e.key === 'Escape') closePlayer();
    if (e.key === ' ') { e.preventDefault(); document.getElementById('playerPlayPause').click(); }
    if (e.key === 'ArrowLeft') document.getElementById('playerPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('playerNext').click();
  });
}

/* ==========================================================================
   播放器进度回调 → 同步时间轴 playhead
   ========================================================================== */
let playerSpeed = 1;
let playerShotStart = 0;
const _origShow = showPlayerShot;
showPlayerShot = function (idx) {
  playerShotStart = Date.now();
  _origShow(idx);
  // 高亮时间轴节点
  const num = SHOTS[idx].number;
  document.querySelectorAll('.timeline__node').forEach((n) => {
    n.classList.toggle('is-active', n.dataset.shot === num);
  });
  // 滚动时间轴到可见
  const active = document.querySelector('.timeline__node.is-active');
  if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  // 显示 playhead
  const ph = document.getElementById('timelinePlayhead');
  if (ph) {
    ph.style.display = 'block';
    const pct = (parseTimeMs(SHOTS[idx].range.split(/[–-]/)[0]) / 90000) * 100;
    ph.style.left = `${pct}%`;
  }
};

function parseTimeMs(s) {
  return parseInt(s.replace(/[″"]/g, '').trim(), 10) * 1000;
}

// 播放期间每帧更新 playhead 位置
setInterval(() => {
  if (playerTimer && !playerPaused) {
    const s = SHOTS[playerIdx];
    const startMs = parseTimeMs(s.range.split(/[–-]/)[0]);
    const dur = (parseTimeMs(s.range.split(/[–-]/)[1]) - startMs) / playerSpeed;
    const elapsed = (Date.now() - playerShotStart) * (playerSpeed);
    const pct = ((startMs + Math.min(elapsed, dur)) / 90000) * 100;
    const ph = document.getElementById('timelinePlayhead');
    if (ph) ph.style.left = `${pct}%`;
    const timeEl = document.getElementById('timelineTime');
    if (timeEl) {
      const total = Math.min(startMs + elapsed, 90000);
      const ss = Math.floor(total / 1000);
      const ff = Math.floor((total % 1000) / 10);
      timeEl.textContent = `${String(ss).padStart(2, '0')}″${String(ff).padStart(2, '0')}`;
    }
  }
}, 50);

/* ==========================================================================
   渲染：分镜时间轴
   ========================================================================== */
function renderTimeline() {
  const bar = document.getElementById('timelineBar');
  const ticks = document.getElementById('timelineTicks');
  if (!bar || !ticks) return;

  // 16 镜节点
  bar.insertAdjacentHTML('beforeend', SHOTS.map((s) => {
    const startMs = parseTimeMs(s.range.split(/[–-]/)[0]);
    const endMs = parseTimeMs(s.range.split(/[–-]/)[1]);
    const left = (startMs / 90000) * 100;
    const width = ((endMs - startMs) / 90000) * 100;
    const actNum = parseInt(s.act.match(/第(\d+)幕/)?.[1] || '0', 10);
    return `<div class="timeline__node act-color-${actNum}" data-shot="${s.number}" style="left:${left}%; width:${width}%;" title="Shot ${s.number} — ${s.framing} (${s.range})">
      <span class="timeline__node-num">${s.number}</span>
      <span class="timeline__node-act">A${actNum}</span>
    </div>`;
  }).join(''));

  // 标尺：每 15s 一格
  ticks.innerHTML = [0, 15, 30, 45, 60, 75, 90].map((s) => `
    <div class="timeline__tick" style="left:${(s / 90) * 100}%;">
      <span class="timeline__tick-label">${String(s).padStart(2, '0')}″</span>
    </div>
  `).join('');
}

function setupTimelineInteraction() {
  const bar = document.getElementById('timelineBar');
  if (!bar) return;
  bar.addEventListener('click', (e) => {
    const node = e.target.closest('.timeline__node');
    if (!node) return;
    const num = node.dataset.shot;
    // 打开 lightbox 或在播放器中跳转
    const playerOpen = document.getElementById('player')?.classList.contains('is-open');
    if (playerOpen) {
      const idx = SHOTS.findIndex((s) => s.number === num);
      if (idx >= 0) {
        playerIdx = idx;
        showPlayerShot(idx);
        if (!playerPaused) scheduleNext();
      }
    } else {
      // 滚动到对应分镜
      const target = document.querySelector(`.shot[data-shot="${num}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* ==========================================================================
   预热所有图片（消除播放时加载卡顿）
   ========================================================================== */
function preloadAllImages() {
  const urls = new Set();
  // Hero
  urls.add(document.querySelector('.hero__img')?.src);
  // 6 幕
  ACTS.forEach((a) => urls.add(IMG(a.prompt)));
  // 16 镜
  SHOTS.forEach((s) => urls.add(IMG(s.prompt)));
  // 6 资产
  ASSETS.forEach((a) => urls.add(IMG(a.prompt)));
  // 通过 Image() 静默预加载
  urls.forEach((u) => {
    if (!u) return;
    const im = new Image();
    im.src = u;
  });
  console.log(`[preload] queued ${urls.size} images`);
}
function setupProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ==========================================================================
   章节 scroll-spy
   ========================================================================== */
function setupScrollSpy() {
  const sections = ['hero', 'rhythm', 'shots', 'constraints', 'assets'];
  const links = document.querySelectorAll('.chapters a');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    },
    { threshold: 0.3, rootMargin: '-10% 0px -50% 0px' }
  );
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

/* ==========================================================================
   环境音（低频嗡鸣 + 偶尔编钟）
   ========================================================================== */
function setupAmbientAudio() {
  const btn = document.getElementById('audioToggle');
  if (!btn) return;
  const ctxCtor = window.AudioContext || window.webkitAudioContext;
  if (!ctxCtor) return;

  let ctx = null;
  let osc = null;
  let gain = null;
  let bellTimer = null;
  let isPlaying = false;

  const start = () => {
    ctx = new ctxCtor();
    // 低频嗡鸣
    osc = ctx.createOscillator();
    gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 55; // A1
    gain.gain.value = 0;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.2);

    // 偶尔编钟敲击
    bellTimer = setInterval(() => {
      if (!ctx || Math.random() > 0.5) return;
      const t = ctx.currentTime;
      const freqs = [220, 277, 330, 415, 466]; // 编钟五度叠加
      freqs.forEach((f) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.025, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.001, t + 2.5);
        o.connect(g).connect(ctx.destination);
        o.start(t);
        o.stop(t + 2.5);
      });
    }, 6000);
  };

  const stop = () => {
    if (!ctx) return;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    setTimeout(() => {
      try { osc.stop(); } catch (e) {}
      ctx.close();
    }, 500);
    clearInterval(bellTimer);
    ctx = null;
  };

  btn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    btn.classList.toggle('is-playing', isPlaying);
    if (isPlaying) start();
    else stop();
  });
}
