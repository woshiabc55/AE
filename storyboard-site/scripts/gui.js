/* ==========================================================================
   《归》— 影视 PV 分镜脚本（第二部）
   与《对决》共用渲染器；本页为数据源
   ========================================================================== */

const GUI_META = {
  titleCn: '归',
  titleEn: 'Guī',
  tagline: 'PV · 归途 · 长镜',
  sub: '三十年太空航行后，一位宇航员回到地球 ——<br />他成了最后一位访客。',
  pills: ['3 渲 2 + IMAX 渲染', '失重长镜头', '雾蓝 + 苔绿 + 暖金', '时间侵蚀 / 半透明'],
  heroPrompt: 'A lone astronaut in a worn vintage spacesuit walking out of a misty sea onto a black sand beach, vast empty horizon, first warm light breaking through fog, IMAX cinematic, blue-grey low saturation, melancholic, 16:9',
};

const GUI_ACTS = [
  { num: '01', name: '海',     emotion: '静 → 升', camera: '远景 · 固定 · 慢动作',       curve: [5, 15, 25, 40, 55, 70],
    prompt: 'A lone figure in a worn spacesuit emerging from a misty sea onto a black sand beach, vast empty horizon, IMAX cinematic, volumetric fog, long lens compression, blue-grey low saturation, melancholic, 16:9' },
  { num: '02', name: '沙',     emotion: '紧 → 释', camera: '推近 · 沙流粒子 · 时间码叠印', curve: [30, 45, 35, 25, 20, 30],
    prompt: 'Close-up of an old astronaut boots walking on black volcanic sand, sand flowing like water, overgrown alien vegetation in background, IMAX cinematic, blue-grey tone, melancholic, 16:9' },
  { num: '03', name: '林',     emotion: '沉 → 惊', camera: '横移 · 长焦 · 植物吞噬建筑', curve: [25, 30, 50, 40, 35, 45],
    prompt: 'A ruined city overgrown by dense forest, only rooftops visible, morning mist with first warm golden light through canopy, IMAX cinematic, blue-grey with warm gold, 16:9' },
  { num: '04', name: '声',     emotion: '空 → 满', camera: '环绕长镜 · 磁带噪声 · 暖光骤亮', curve: [20, 25, 30, 70, 60, 50],
    prompt: 'An old astronaut sitting on a broken wall holding a vintage cassette player, warm golden light streaming in, forest background, IMAX cinematic, intimate scene, 16:9' },
  { num: '05', name: '寻',     emotion: '紧 → 暖', camera: '主观视点 · 山丘遥望 · 单灯', curve: [40, 50, 55, 65, 90, 75],
    prompt: 'POV shot from a hilltop looking down at a single lit window in a forest-covered village, blue fog with one warm yellow light, IMAX cinematic, dusk, melancholic, 16:9' },
  { num: '06', name: '归',     emotion: '满 → 空', camera: '长镜 · 镜头不再跟 · 黑屏',     curve: [50, 40, 30, 20, 15, 5],
    prompt: 'A lone astronaut silhouette at a doorway looking at a warm window, then turning away walking toward the misty sea, IMAX cinematic, blue-grey, long shot, 16:9' },
];

const GUI_SHOTS = [
  { act: '第一幕：海', range: '0″ – 5″',   number: '01', framing: '大远景', camera: '固定机位 · 水平线分割', content: '雾海平面，黑沙海岸，没有天空与海的边界；一个黑点从海面缓缓浮出。', fx: 'IMAX 渲染 · 体积雾 · 长焦压缩 · 颗粒噪点', audio: '海浪低频 · 沙摩擦', mood: 1, prompt: 'Misty ocean horizon, black sand beach, a small dark figure slowly emerging from the sea, no clear boundary between sea and sky, IMAX cinematic, volumetric fog, long lens compression, blue-grey low saturation, melancholic, 16:9' },
  { act: '第一幕：海', range: '5″ – 12″',  number: '02', framing: '全景',   camera: '极缓推近',             content: '一位老人身穿磨损的旧式宇航服，涉水走上黑沙海岸；背后是发白的地平线。', fx: '3 渲 2 角色 + IC 海浪 · 海水浮力粒子 · 半透明面罩', audio: '沙湿步履 · 头盔内呼吸', mood: 1, prompt: 'An old man in a worn vintage spacesuit wading onto a black sand beach, misty white horizon behind, IMAX cinematic, water particles, translucent visor, blue-grey tone, melancholic, 16:9' },
  { act: '第一幕：海', range: '12″ – 15″', number: '03', framing: '特写',   camera: '固定',                 content: '头盔面罩内反光，倒映出三十年前发射场的人群；老人的眼睛半阖，没有立刻睁眼。', fx: '面罩反射合成 · 瞳孔金光微现 · 镜片呼吸雾气', audio: '一声清脆的"咔"（头盔锁扣）', mood: 1, prompt: 'Close-up of a vintage spacesuit helmet visor reflecting a crowd from thirty years ago, the astronaut eyes half-closed, IMAX cinematic, blue-grey tone, intimate, 16:9' },

  { act: '第二幕：沙', range: '15″ – 20″', number: '04', framing: '全景',   camera: '缓慢横移',             content: '老人踏上黑沙，沙在脚下流动成细流；周围植物异常茂密，像一片被遗忘了三十年的森林。', fx: '流体沙粒 · 风动植被 · 长焦压缩', audio: '风穿过叶隙 · 沙声流走', mood: 2, prompt: 'Wide shot of an old astronaut walking on black volcanic sand that flows like water, dense overgrown forest around, IMAX cinematic, blue-grey with green vegetation, melancholic, 16:9' },
  { act: '第二幕：沙', range: '20″ – 25″', number: '05', framing: '中景',   camera: '固定 · 时间码叠印',     content: '老人手腕上的旧式电子表闪烁：地球时间 30 年 4 月 12 日 06:14:08。', fx: '时间码数字合成 · 旧 CRT 扫描线 · 沙粒遮挡', audio: '数字切换音 · 电流声', mood: 2, prompt: 'Close-up of an old vintage digital watch on astronaut wrist showing date 30 years later, CRT scan lines, sand particles floating, IMAX cinematic, blue-grey, intimate, 16:9' },
  { act: '第二幕：沙', range: '25″ – 30″', number: '06', framing: '特写',   camera: '缓慢上推',             content: '老人抬起手，慢慢摘下头盔；第一次呼吸地球空气；脸上一道旧疤，眉头因气味松开。', fx: '面部 3 渲 2 · 疤痕立体化 · 镜头呼吸感', audio: '一声长长的"嘶 —" · 鸟鸣第一次出现', mood: 2, prompt: 'Close-up of an old astronaut slowly removing a vintage helmet, first breath of earth air, old scar on face, brow relaxing, IMAX cinematic, intimate, blue-grey tone, 16:9' },

  { act: '第三幕：林', range: '30″ – 35″', number: '07', framing: '大远景', camera: '极缓拉升',             content: '远处城市被植物吞噬，只剩几栋楼顶的轮廓；天空出现第一缕暖光。', fx: '建筑被藤蔓覆盖 · 体积光透过枝叶 · 雾中暖金', audio: '鸟群掠过的翅膀声 · 远方钟声', mood: 3, prompt: 'Wide shot of a ruined city overgrown by dense forest, only rooftops visible, first warm golden light breaking through canopy, IMAX cinematic, blue-grey with warm gold, 16:9' },
  { act: '第三幕：林', range: '35″ – 40″', number: '08', framing: '中景',   camera: '长焦 · 横移',           content: '老人穿过曾经是街道的树荫；脚下是碎裂的柏油路；路牌半埋在苔藓里。', fx: '物理粒子 · 风过藤蔓 · 沙漏光线', audio: '风 · 脚步从硬地变软土', mood: 3, prompt: 'An old astronaut walking through a tree-shaded street, broken asphalt beneath, moss-covered road sign half-buried, IMAX cinematic, dappled light, blue-green tone, 16:9' },
  { act: '第三幕：林', range: '40″ – 45″', number: '09', framing: '特写',   camera: '固定 · 推近',           content: '老人蹲下，从苔藓中扒出一块残破的路牌；路牌上刻着一个姓 —— 正是他自己的姓氏。', fx: '文字 3D 浮雕 · 苔藓流体 · 微距镜头', audio: '一声闷雷 · 老人喉咙里"嗯 —"', mood: 3, prompt: 'Close-up of a moss-covered broken street sign with a Chinese surname carved on it, the astronaut hand brushing away moss, IMAX cinematic, blue-green tone, intimate, 16:9' },

  { act: '第四幕：声', range: '45″ – 50″', number: '10', framing: '中景', camera: '环绕长镜头',           content: '老人坐在一截断墙上，从胸前口袋取出一台三十年前的磁带录音机；按下播放键。', fx: '录音机 3 渲 2 细节 · 磁带转动粒子 · 暖光渐起', audio: '磁带旋转的"沙沙"· 录音键的"咔哒"', mood: 4, prompt: 'An old astronaut sitting on a broken concrete wall, taking out a vintage 1980s cassette player from chest pocket, pressing play, warm golden light, IMAX cinematic, intimate, 16:9' },
  { act: '第四幕：声', range: '50″ – 55″', number: '11', framing: '特写',   camera: '推近 · 失焦再聚焦',     content: '录音机里传出三十年前儿子的声音："爸，回来的时候，到家门口那棵树下等我"。', fx: '声音波形可视化 · 雾在老人脸上凝成水汽', audio: '儿子童声 · 沙沙底噪', mood: 4, prompt: 'Extreme close-up of cassette player reels spinning, the astronaut face with condensation from breath, voice waveform visualized as light, IMAX cinematic, warm gold, 16:9' },
  { act: '第四幕：声', range: '55″ – 60″', number: '12', framing: '中景',   camera: '缓慢拉远',             content: '老人抬起头，看到断墙后面 —— 远处有一棵开花的树，正是录音里提到的那棵。', fx: '树作为视觉锚点 · 花粉粒子 · 阳光斜射', audio: '树叶声 · 鸟鸣第二次 · 儿子声音的尾音', mood: 4, prompt: 'Wide shot from behind the astronaut, looking at a single blossoming tree in distance, sunlight slanting through, pollen particles in air, IMAX cinematic, warm gold, melancholic, 16:9' },

  { act: '第五幕：寻', range: '60″ – 66″', number: '13', framing: '大远景', camera: '主观视点 · 极缓推',     content: '老人走上山丘，向下望去；远处一户人家亮着一盏窗灯；周围是已经长成森林的村庄。', fx: '主观视点镜头参数 · 大景深 · 烟囱有微弱烟气', audio: '风声 · 远处狗吠（似曾相识）', mood: 5, prompt: 'POV shot from hilltop looking down at a forest-covered village, a single warm yellow window lit among trees, chimney with faint smoke, IMAX cinematic, blue fog with warm window, 16:9' },
  { act: '第五幕：寻', range: '66″ – 72″', number: '14', framing: '中景',   camera: '长焦 · 横移',           content: '老人走近，窗内透出暖黄灯光；窗台上有一盆花，与三十年前妻子留下的那盆一模一样。', fx: '暖黄 vs 雾蓝对比 · 玻璃上的水珠流痕 · 花瓣 3D 建模', audio: '木地板的"吱呀"（他想象自己推门）', mood: 5, prompt: 'An old astronaut walking close to a window with warm yellow light, flower pot on the windowsill with water streaks on glass, IMAX cinematic, warm gold vs cool blue, intimate, 16:9' },
  { act: '第五幕：寻', range: '72″ – 78″', number: '15', framing: '特写',   camera: '固定 · 浅景深',         content: '窗后一个白发苍苍的身影缓缓转身 —— 是他自己的儿子，已经老了；两人目光在玻璃上相接。', fx: '玻璃反射叠合两人脸 · 浅景深 · 暖色侧光', audio: '一声几乎听不见的"爸" · 心跳低频', mood: 5, prompt: 'Close-up through a window, an old white-haired man turning slowly, his reflection overlapping with the astronaut outside, glass reflection, IMAX cinematic, warm gold, intimate, 16:9' },

  { act: '第六幕：归', range: '78″ – 90″', number: '16', framing: '远景',   camera: '固定 · 长镜 · 黑屏',     content: '老人在门口停下，没有敲门；他望着窗户里的光，慢慢转身，向海的方向走去；屏幕渐暗。', fx: '长焦压缩 · 沙石渐隐 · 暖金褪色为沙蓝 · 黑屏 3 秒', audio: '脚步渐远 · 海浪回潮 · 编钟最后一声 · 寂静', mood: 6, prompt: 'An astronaut silhouette at a doorway looking at a warm window, then slowly turning and walking toward the misty sea, camera staying at the empty doorway, IMAX cinematic, warm gold fading to blue-grey, 16:9' },
];

const GUI_CONSTRAINTS = [
  { text: '<strong>画面比例</strong>：严格 16:9 IMAX 满画幅，禁上下黑边。' },
  { text: '<strong>运镜原则</strong>：与《对决》相反 —— 不用急速运镜，不用 360° 环绕；用固定、推近、长焦、留白。' },
  { text: '<strong>声音留白</strong>：第 6 幕后 5 秒只有脚步与海浪；让"无声"成为情绪。' },
  { text: '<strong>时间码叠印</strong>：第 5 镜必须含可读的地球时间码，强化"30 年"的存在感。' },
  { text: '<strong>色调转折</strong>：第 4 幕录音机按下的瞬间，从雾蓝骤入暖金；暖金仅持续到第 6 幕开始。' },
  { text: '<strong>镜头不再跟</strong>：第 16 镜，老人转身离开后镜头留在空门廊；这是全片唯一一次"镜头不跟人"的决定。' },
];

const GUI_ASSETS = [
  { name: '黑沙流体',   desc: '海岸沙粒流体 · 雨后湿润感 · 长焦压缩',  thumb: 'thumb-1', prompt: 'Black volcanic sand beach with flowing sand particles, IMAX cinematic, blue-grey, 16:9' },
  { name: '雾林体积光', desc: '建筑被藤蔓覆盖 · 暖光透过枝叶',         thumb: 'thumb-2', prompt: 'A ruined overgrown building with volumetric golden light breaking through forest canopy, IMAX cinematic, 16:9' },
  { name: '磁带录音机', desc: '1980s 复古 · 磁带转动粒子 · 3 渲 2',     thumb: 'thumb-3', prompt: 'Vintage 1980s portable cassette player with cassette reels spinning, warm golden light, IMAX cinematic, intimate close-up, 16:9' },
  { name: '时间码叠印', desc: '3D 数字 · CRT 扫描线 · 沙粒遮挡',       thumb: 'thumb-4', prompt: 'Digital timecode numbers floating in 3D space with CRT scan lines and sand particles, IMAX cinematic, blue-grey, 16:9' },
  { name: '玻璃反射叠合', desc: '父子对视 · 双脸反射 · 浅景深',         thumb: 'thumb-5', prompt: 'Glass reflection of two old men faces overlapping, shallow depth of field, warm side light, IMAX cinematic, intimate, 16:9' },
  { name: '黑沙海岸',   desc: '低饱和蓝灰 · 雾海平面 · 末幕长镜',       thumb: 'thumb-6', prompt: 'Empty doorway looking at a misty black sand beach and ocean, blue-grey low saturation, IMAX cinematic, melancholic, 16:9' },
];
