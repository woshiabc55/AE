/* ==========================================================================
   《雨夜》— 影视 PV 分镜脚本（第三部）
   与前两部共用渲染器
   ========================================================================== */

const YUYE_META = {
  titleCn: '雨夜',
  titleEn: 'Yǔ Yè',
  tagline: 'PV · 霓虹 · 垂直',
  sub: '一个雨夜快递员在 24 小时的不停雨中递送一个<span class="accent">七天前</span>的包裹 ——<br />收件人地址已经不存在了。',
  pills: ['3 渲 2 + IMAX 渲染', '霓虹反射 + 雨幕粒子', '品红 · 青蓝 · 暖黄', 'Noir · Cyberpunk'],
  heroPrompt: 'A lone courier on a scooter in rainy Hong Kong neon street at night, vertical city with skyscrapers, rain reflections on wet asphalt, magenta and cyan neon, cyberpunk noir, IMAX cinematic, 16:9',
};

const YUYE_ACTS = [
  { num: '01', name: '街',     emotion: '起 → 紧', camera: '俯视 · 推近 · 雨幕',           curve: [20, 30, 40, 50, 60, 70],
    prompt: 'Aerial view of rainy Hong Kong neon city at night, vertical skyscrapers with neon signs, rain falling in sheets, magenta and cyan reflections on wet streets, IMAX cinematic, cyberpunk noir, 16:9' },
  { num: '02', name: '霓',     emotion: '急 → 慢', camera: '长焦 · 横移 · 反射',           curve: [50, 65, 55, 40, 45, 50],
    prompt: 'A courier riding a scooter through narrow Hong Kong neon alley, rain pouring, neon reflections on wet ground, magenta and cyan, IMAX cinematic, cyberpunk noir, intimate, 16:9' },
  { num: '03', name: '箱',     emotion: '慢 → 凝', camera: '微距 · 推近 · 时间码',         curve: [40, 35, 50, 70, 60, 55],
    prompt: 'Close-up of a vintage cassette player wrapped in old newspaper as a delivery package, raindrops on plastic wrap, IMAX cinematic, warm yellow light, intimate, 16:9' },
  { num: '04', name: '客',     emotion: '沉 → 触', camera: '主观视点 · 楼梯 · 门缝',       curve: [30, 40, 50, 60, 75, 80],
    prompt: 'POV shot of climbing a dark wet stairwell in an old Hong Kong tenement building, dim light, water dripping, IMAX cinematic, noir, intimate, 16:9' },
  { num: '05', name: '楼',     emotion: '紧 → 释', camera: '拉远 · 远景纵深 · 玻璃雨痕',   curve: [70, 65, 70, 80, 75, 60],
    prompt: 'Wide shot from a tenement rooftop looking down at rainy Hong Kong neon street, a single window with warm light, IMAX cinematic, magenta and cyan, melancholic, 16:9' },
  { num: '06', name: '远',     emotion: '满 → 散', camera: '跟拍 · 渐褪色 · 黑屏',         curve: [60, 50, 40, 30, 20, 10],
    prompt: 'A courier on scooter riding into the rain distance on a neon Hong Kong street at night, neon fading behind, IMAX cinematic, cyberpunk noir, melancholic, 16:9' },
];

const YUYE_SHOTS = [
  { act: '第一幕：街', range: '0″ – 5″',   number: '01', framing: '大远景', camera: '俯视 · 雨幕垂直',         content: '香港夜景俯视，雨幕在摩天楼间流成河；远景霓虹在雨雾中晕成一片。', fx: '体积雨雾 · 霓虹色散 · 长焦压缩', audio: '密集雨声 · 远处雷声', mood: 1, prompt: 'Aerial view of rainy Hong Kong neon city at night, rain falling in sheets between skyscrapers, neon signs glowing through fog, IMAX cinematic, magenta and cyan, 16:9' },
  { act: '第一幕：街', range: '5″ – 12″',  number: '02', framing: '全景',   camera: '推近',                     content: '一位快递员骑电瓶车穿过窄巷，霓虹反射在水坑；雨水打在他的透明雨衣上。', fx: '雨滴粒子 · 反射合成 · 镜头径向拉伸', audio: '电瓶车嗡鸣 · 雨打雨衣', mood: 1, prompt: 'A courier on a scooter riding through narrow Hong Kong neon alley, rain pouring, neon reflections on wet ground, courier in transparent raincoat, IMAX cinematic, cyberpunk noir, 16:9' },
  { act: '第一幕：街', range: '12″ – 15″', number: '03', framing: '特写',   camera: '固定',                     content: '他接起电话：「地址没了？再查查。」脸上雨水顺着下巴流下。', fx: '面部 3 渲 2 · 雨滴流痕 · 屏幕冷光', audio: '电话铃声 · 雨声加大', mood: 1, prompt: 'Close-up of a young Asian courier face in rain, holding a phone, looking concerned, water dripping down chin, neon light reflecting on face, IMAX cinematic, intimate, 16:9' },

  { act: '第二幕：霓', range: '15″ – 20″', number: '04', framing: '全景',   camera: '长焦 · 横移',               content: '他进入更深的街区，雨更大，霓虹更密；楼顶的招牌堆叠成垂直的城市。', fx: '垂直纵深 · 蒸汽 · 雨反射霓虹', audio: '雨声 + 远处音乐', mood: 2, prompt: 'A courier entering deep neon district of rainy Hong Kong, vertical stacked signs, rain pouring, magenta and cyan neon, IMAX cinematic, cyberpunk, 16:9' },
  { act: '第二幕：霓', range: '20″ – 25″', number: '05', framing: '中景',   camera: '固定',                     content: '在茶餐厅避雨，老板指向远处：「那个地址，拆了。」窗外是倾盆大雨。', fx: '玻璃雨痕 · 茶餐厅暖光 · 长焦', audio: '茶杯声 · 粤语对白', mood: 2, prompt: 'Inside a Hong Kong tea restaurant, a courier sitting at table, an old boss pointing through rain-streaked window, warm yellow interior light, IMAX cinematic, intimate, 16:9' },
  { act: '第二幕：霓', range: '25″ – 30″', number: '06', framing: '特写',   camera: '微距',                     content: '他在桌上打开包裹一角，里面是一台 1980 年代的磁带录音机，老旧泛黄。', fx: '物体 3 渲 2 细节 · 暖光聚焦 · 雨滴反光', audio: '塑料袋窸窣 · 雨声远', mood: 2, prompt: 'Macro close-up of a vintage 1980s cassette player partially unwrapped from newspaper as a delivery, warm yellow light, raindrops on plastic, IMAX cinematic, intimate, 16:9' },

  { act: '第三幕：箱', range: '30″ – 35″', number: '07', framing: '大远景', camera: '拉远',                     content: '雨在垂直的摩天楼间流成河；他在楼底看上去，楼的轮廓像一道切口。', fx: '体积雨 · 垂直构图 · 楼灯辉光', audio: '雨声轰鸣 · 风声', mood: 3, prompt: 'Wide shot of a single figure at the base of a towering Hong Kong skyscraper, rain pouring vertically, IMAX cinematic, magenta and cyan, 16:9' },
  { act: '第三幕：箱', range: '35″ – 40″', number: '08', framing: '中景',   camera: '推近',                     content: '他在雨里用手指在咖啡馆窗玻璃上画地址，雨水顺着笔画流下。', fx: '雨痕流体 · 手指 3D · 玻璃反射', audio: '雨打窗 · 远处电话', mood: 3, prompt: 'A courier finger drawing an address on a rain-streaked glass window, water flowing down the drawing, neon reflecting, IMAX cinematic, intimate, 16:9' },
  { act: '第三幕：箱', range: '40″ – 45″', number: '09', framing: '特写',   camera: '微距',                     content: '录音机的播放键亮起，泛黄的按键；他没有按，只是看着。', fx: '暖光扫过 · 颗粒胶片 · 浅景深', audio: '电流声 · 雨声远', mood: 3, prompt: 'Macro close-up of a vintage cassette player play button glowing warm yellow, courier finger hovering above, shallow depth of field, rain in background, IMAX cinematic, intimate, 16:9' },

  { act: '第四幕：客', range: '45″ – 50″', number: '10', framing: '中景',   camera: '主观视点',               content: '他推门进入旧楼，楼梯间湿漉漉；脚下是不同年代的瓷砖。', fx: 'POV 镜头参数 · 楼梯间潮湿 · 单灯', audio: '脚步在湿楼梯 · 远处水滴', mood: 4, prompt: 'POV shot climbing a dark wet stairwell in an old Hong Kong tenement, single dim light, water dripping, vintage tiles, IMAX cinematic, noir, 16:9' },
  { act: '第四幕：客', range: '50″ – 55″', number: '11', framing: '特写',   camera: '推近',                   content: '他爬到顶楼，发现门已经被木板钉死；门上贴着褪色的「吉」字。', fx: '木板纹理 3D · 褪色海报 · 浅景深', audio: '手指敲木板 · 雨声闷', mood: 4, prompt: 'Close-up of an old Hong Kong tenement door nailed shut with wooden planks, faded red Chinese character on door, courier hand touching wood, IMAX cinematic, intimate, 16:9' },
  { act: '第四幕：客', range: '55″ – 60″', number: '12', framing: '中景',   camera: '缓慢拉远',               content: '他把包裹塞进门缝，转身离开；雨声盖过脚步。', fx: '门缝光 · 走廊纵深 · 慢动作', audio: '雨声轰鸣 · 脚步渐远', mood: 4, prompt: 'A courier sliding a package into a gap under a nailed door, then turning and walking away down a long corridor, dim light, IMAX cinematic, noir, 16:9' },

  { act: '第五幕：楼', range: '60″ – 66″', number: '13', framing: '大远景', camera: '拉远',                 content: '镜头拉远，他从顶楼窗户的剪影；楼外是垂直的霓虹雨夜。', fx: '剪影合成 · 垂直霓虹 · 雨幕', audio: '雨声远 · 远处喇叭', mood: 5, prompt: 'Wide shot from outside a tenement building, a courier silhouette at a top-floor window looking out, vertical neon signs below, rain, IMAX cinematic, cyberpunk, 16:9' },
  { act: '第五幕：楼', range: '66″ – 72″', number: '14', framing: '中景',   camera: '长焦',                 content: '下楼时瞥见一户亮着灯的窗口，有人在看雨；两人目光在玻璃上相接。', fx: '窗内暖光 vs 窗外冷霓 · 浅景深', audio: '楼梯脚步 · 雨打窗', mood: 5, prompt: 'A courier descending stairs, peeking through a door crack at a lit window with someone watching the rain, warm interior light, IMAX cinematic, intimate, 16:9' },
  { act: '第五幕：楼', range: '72″ – 78″', number: '15', framing: '特写',   camera: '微距',                 content: '回到街上，包裹上多了一行手写字：「谢谢」；字迹被雨打湿。', fx: '墨水扩散 · 雨滴 · 浅景深', audio: '雨声 · 远处电瓶车', mood: 5, prompt: 'Macro close-up of a delivery package with handwritten Chinese characters "谢谢" (thank you), the ink being washed away by raindrops, IMAX cinematic, intimate, 16:9' },

  { act: '第六幕：远', range: '78″ – 90″', number: '16', framing: '远景',   camera: '跟拍 · 渐褪色 · 黑屏', content: '他骑电瓶车消失在雨幕中，霓虹在他身后慢慢褪色；屏幕渐暗。', fx: '长焦压缩 · 雾气渐浓 · 黑屏 3 秒', audio: '电瓶车远去 · 雨声渐弱 · 寂静', mood: 6, prompt: 'A courier on scooter riding into rainy neon distance of Hong Kong, neon fading behind, IMAX cinematic, cyberpunk noir, melancholic, 16:9' },
];

const YUYE_CONSTRAINTS = [
  { text: '<strong>画面比例</strong>：严格 16:9 IMAX 满画幅，禁上下黑边。' },
  { text: '<strong>运镜原则</strong>：以横移 + 推近为主，禁用 360° 环绕（那是《对决》）；以 POV 推进叙事。' },
  { text: '<strong>反射与水痕</strong>：所有玻璃面必须有雨痕或蒸汽；所有地面必须有反射。' },
  { text: '<strong>霓虹色规则</strong>：品红 + 青蓝 + 暖黄三色限制；其他颜色饱和度降低 50%。' },
  { text: '<strong>声音层次</strong>：雨声是底噪；粤语对白仅 1 句（茶餐厅老板）；其余用环境音推动。' },
  { text: '<strong>道具母题</strong>：磁带录音机（与《归》呼应）；"谢谢"手写字（与包裹形成首尾闭环）。' },
];

const YUYE_ASSETS = [
  { name: '香港霓虹雨夜',   desc: '垂直城市 · 雨幕 · 反射',                   thumb: 'thumb-1', prompt: 'Rainy Hong Kong neon street at night, vertical skyscrapers, rain reflections on wet asphalt, magenta and cyan, IMAX cinematic, cyberpunk noir, 16:9' },
  { name: '快递员剪影',     desc: '透明雨衣 · 电瓶车 · 长焦',                 thumb: 'thumb-2', prompt: 'A lone courier on a scooter in rain, silhouette, transparent raincoat, Hong Kong neon background, IMAX cinematic, cyberpunk, 16:9' },
  { name: '磁带录音机包裹', desc: '1980s 复古 · 旧报纸包装 · 暖光',           thumb: 'thumb-3', prompt: 'A vintage 1980s cassette player wrapped in old newspaper as a delivery package, warm yellow light, raindrops on plastic, IMAX cinematic, intimate close-up, 16:9' },
  { name: '玻璃雨痕',       desc: '手指画地址 · 雨水流痕',                     thumb: 'thumb-4', prompt: 'Rain-streaked glass window with a finger drawing an address, water flowing down the strokes, neon reflections, IMAX cinematic, intimate, 16:9' },
  { name: '茶餐厅暖光',     desc: '粤式室内 · 黄色钨丝灯 · 雨窗',             thumb: 'thumb-5', prompt: 'Inside a Hong Kong tea restaurant at night, warm tungsten light, rain-streaked window, vintage decor, IMAX cinematic, intimate, 16:9' },
  { name: '「谢谢」手写',   desc: '墨水扩散 · 雨滴 · 浅景深',                 thumb: 'thumb-6', prompt: 'Close-up of handwritten Chinese characters 谢谢 (thank you) on a paper being washed by raindrops, ink spreading, IMAX cinematic, intimate, 16:9' },
];
