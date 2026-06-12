/* ==========================================================================
   《雾》— 短篇剧本（第三部）— 18 世纪破庙里的雾
   4 幕 · 10 镜 · 60s
   ========================================================================== */

const WU_META = {
  titleCn: '雾',
  titleEn: 'Wù',
  tagline: 'PV · 短篇 · 60s',
  sub: '乾隆年间一座坍塌的山神庙 —— 雾里进来一个人，雾里走出去一个人。<br />他们是不是同一个人？',
  pills: ['3 渲 2 + 实拍融合', '烟白 + 朱砂 + 玄青', '雾中残影 / 半透明', '中国 18 世纪'],
  heroPrompt: 'A ruined Qing dynasty mountain temple in dense morning fog, a lone figure in tattered white robe standing under a half-collapsed arch, faded red Chinese characters on stone, IMAX cinematic, misty white and pale jade, melancholic, 16:9',
};

const WU_ACTS = [
  { num: '01', name: '入雾',     emotion: '沉 → 缓', camera: '远景 · 慢推 · 雾流',         curve: [10, 20, 30, 45, 60, 55],
    prompt: 'A ruined Qing dynasty mountain temple in dense morning fog, a lone figure in white robe emerging from the mist, faded red Chinese characters on the stone arch, IMAX cinematic, misty white with pale jade, 16:9' },
  { num: '02', name: '残字',     emotion: '缓 → 紧', camera: '特写 · 跟字 · 烟流',         curve: [30, 40, 55, 50, 45, 40],
    prompt: 'Close-up of faded red Chinese characters on ancient stone, smoke wisps curling around the strokes, IMAX cinematic, misty white and cinnabar, intimate, 16:9' },
  { num: '03', name: '相逢',     emotion: '紧 → 疑', camera: '中景 · 静止 · 雾中残影',     curve: [50, 60, 80, 70, 60, 75],
    prompt: 'A figure in white robe meets their own reflection in a still pool of water inside the temple, fog swirling, IMAX cinematic, mysterious, 16:9' },
  { num: '04', name: '出雾',     emotion: '疑 → 远', camera: '大远景 · 极缓拉远 · 雾合',     curve: [40, 30, 25, 20, 15, 10],
    prompt: 'A wide shot of the ruined temple gradually being consumed by closing fog, the figure walking deeper into the mist and disappearing, IMAX cinematic, misty white, melancholic, 16:9' },
];

const WU_SHOTS = [
  { act: '第一幕：入雾', range: '0″ – 6″',   number: '01', framing: '大远景', camera: '固定 · 慢推',           content: '清晨。一座坍塌的山神庙，残垣断壁上刻着模糊的「山神」二字；浓雾从山下涌来。', fx: 'IC 体积雾 · 3 渲 2 残垣 · 风动雾流粒子', audio: '山鸟一声 · 风起 · 远处泉水', mood: 1, prompt: 'A ruined Qing dynasty mountain temple in dense morning fog, faded Chinese characters on broken stone arch, fog flowing from below, IMAX cinematic, misty white and pale jade, melancholic, 16:9' },
  { act: '第一幕：入雾', range: '6″ – 14″',  number: '02', framing: '全景',   camera: '缓推',                 content: '一个白衣人影从雾中走来，步履迟缓，肩上披着发黄的白麻布；身上没有行李。', fx: '3 渲 2 角色 + IC 雾 · 布纹动态 · 头发飘动粒子', audio: '白麻布摩擦 · 脚步踏过湿石板', mood: 1, prompt: 'A figure in faded white linen robe walking out of dense morning fog toward a ruined mountain temple, no luggage, IMAX cinematic, misty white, 16:9' },
  { act: '第一幕：入雾', range: '14″ – 20″', number: '03', framing: '中景',   camera: '固定 · 烟流',           content: '白衣人停在残碑前，伸手触摸「山神」二字；指腹下，红色颜料被手指温度晕开。', fx: '指温晕开模拟 · 微距摄影 · 烟与指交叠', audio: '指腹摩石 · 一声极轻的"啊"', mood: 1, prompt: 'Close-up of a hand in white robe touching faded red Chinese characters on ancient stone, the red pigment smearing under finger warmth, mist swirling, IMAX cinematic, intimate, 16:9' },

  { act: '第二幕：残字', range: '20″ – 26″', number: '04', framing: '特写',   camera: '推近 · 跟字',           content: '残碑上模糊的「神」字忽然如活过来一般，从左到右晕染开；字底慢慢渗出水汽。', fx: '字体 3D 浮雕 · 流体晕染 · 微距镜头', audio: '一声悠长的钟磬 · 流水', mood: 2, prompt: 'Extreme close-up of an ancient Chinese character 神 on stone coming alive, red pigment flowing, mist seeping from under the strokes, IMAX cinematic, cinnabar red, intimate, 16:9' },
  { act: '第二幕：残字', range: '26″ – 32″', number: '05', framing: '中景',   camera: '横移',                 content: '白衣人抬头，看见断墙另一面刻着一行小字：「若你是你，请自问。」', fx: '3D 浮雕文字 · 烟流绕字 · 浅景深', audio: '风过墙缝 · 字字顿挫的"嗯"', mood: 2, prompt: 'A white-robed figure looking at small Chinese characters carved on the other side of a broken wall 若你是你请自问, mist flowing, IMAX cinematic, intimate, 16:9' },
  { act: '第二幕：残字', range: '32″ – 38″', number: '06', framing: '特写',   camera: '固定 · 烟流',           content: '白衣人眼里闪出一丝惊觉；瞳仁里反射出另一个自己 —— 但身着黑袍。', fx: '瞳孔合成 · 黑袍残影 · 烟流瞳孔', audio: '心跳低频', mood: 2, prompt: 'Close-up of a white-robed figures eyes reflecting another self in black robe, IMAX cinematic, intimate, 16:9' },

  { act: '第三幕：相逢', range: '38″ – 44″', number: '07', framing: '中景',   camera: '静止',                 content: '庙中央有一方静水，水面倒映出完整的庙宇与白云；黑袍人影也在水边，背向而立。', fx: '水面倒影合成 · 双身影叠合 · 烟与水汽', audio: '泉水滴答 · 极远处的人声', mood: 3, prompt: 'A figure in white robe meeting a black-robed reflection at a still pool of water in the ruined temple, fog swirling, IMAX cinematic, mysterious, 16:9' },
  { act: '第三幕：相逢', range: '44″ – 50″', number: '08', framing: '中景',   camera: '横移 · 慢推',           content: '白衣人伸手，水面波纹荡开；波纹尚未合拢，水中黑袍人已转身面对 —— 是一模一样的脸。', fx: '波纹流体模拟 · 双身影互动 · 慢动作', audio: '水波声 · 一声低沉的"你"', mood: 3, prompt: 'A white-robed figure reaching toward a still pool, water rippling, the black-robed reflection turning to reveal an identical face, IMAX cinematic, mysterious, 16:9' },

  { act: '第四幕：出雾', range: '50″ – 54″', number: '09', framing: '大远景', camera: '极缓拉远',             content: '雾从山下再次涌来，比来时更浓；白衣人与黑袍人背对背，在雾中越走越远。', fx: '雾流粒子 · 双身影半透明 · 雾合帧', audio: '风 · 雾吞没一切的白噪声', mood: 4, prompt: 'Wide shot of two figures in white and black robes walking in opposite directions into deepening fog, the ruined temple in the middle distance, IMAX cinematic, misty white, melancholic, 16:9' },
  { act: '第四幕：出雾', range: '54″ – 60″', number: '10', framing: '大远景', camera: '固定 · 雾合 · 白屏',     content: '雾合拢，整座庙消失；只剩下空山新雨后，雾气里隐约一声编钟。', fx: '雾合帧 · 远山虚化 · 编钟声同步', audio: '编钟一声 · 山鸟群起 · 寂静', mood: 4, prompt: 'Wide shot of mountains and forest gradually being consumed by closing fog, the temple no longer visible, IMAX cinematic, misty white, melancholic, 16:9' },
];

const WU_CONSTRAINTS = [
  { text: '<strong>画面比例</strong>：严格 16:9 IMAX 满画幅。' },
  { text: '<strong>雾为角色</strong>：雾不仅是环境，是另一个"他"；雾的浓淡即人物心理。' },
  { text: '<strong>色调单一</strong>：整片只用烟白 + 朱砂 + 玄青三种主色，禁止金黄。' },
  { text: '<strong>声音极简</strong>：只有泉水、钟磬、风、白麻布声；禁编钟（与《对决》重叠）。' },
  { text: '<strong>运镜克制</strong>：不急推、不环绕；只有静、缓推、横移。' },
  { text: '<strong>不点破</strong>：白衣与黑袍是不是同一人，留给观众。' },
];

const WU_ASSETS = [
  { name: '山神庙残碑',     desc: '18 世纪石雕 · 模糊朱砂 · 苔藓覆盖',  thumb: 'thumb-1', prompt: 'Ruined Qing dynasty mountain temple with carved red Chinese characters, moss-covered stone, IMAX cinematic, misty white, 16:9' },
  { name: '白衣人影',       desc: '3 渲 2 · 麻布纹理 · 半透明雾中',     thumb: 'thumb-2', prompt: 'A figure in faded white linen robe in misty morning fog, IMAX cinematic, 16:9' },
  { name: '静水倒影',       desc: '流体模拟 · 双身影叠合 · 烟与水',     thumb: 'thumb-3', prompt: 'A still pool of water in a ruined temple reflecting two figures in white and black robes, IMAX cinematic, mysterious, 16:9' },
  { name: '字体晕染',       desc: '3D 浮雕 · 朱砂流体 · 微观摄影',     thumb: 'thumb-4', prompt: 'Close-up of ancient Chinese characters on stone, red pigment flowing like water, IMAX cinematic, intimate, 16:9' },
  { name: '瞳孔合成',       desc: '双身影 · 烟流瞳孔 · 微距',           thumb: 'thumb-5', prompt: 'Close-up of a figures eye reflecting another self, mist swirling in the pupil, IMAX cinematic, intimate, 16:9' },
  { name: '雾合远山',       desc: '雾流粒子 · 远山虚化 · 收束白屏',     thumb: 'thumb-6', prompt: 'Mountains and forest gradually being consumed by closing fog, misty white, IMAX cinematic, melancholic, 16:9' },
];

const WU_CHARS = [
  {
    name: '白衣人影', pinyin: 'Bái Yī Rén', role: '来访者 · 现在的我',
    portraitPrompt: 'A lone figure in faded white linen robe standing in dense morning fog in front of a ruined Qing dynasty mountain temple, IMAX cinematic, character concept art, 4:3',
    expressionPrompt: 'Close-up of a pale face in white robe, eyes full of recognition, faint red reflection of the character 神 on the pupil, IMAX portrait, intimate, 4:3',
    desc: '穿一身发黄的白麻布，肩上披着一件无袖短褂；脸上没有明显年龄，像是四十岁，又像是二十岁。踏进庙时，他记得自己走过；但他不记得是来做什么。',
    signature: '白麻布 · 雾中残影 · 指温晕字',
    line: '「我是来过的。」',
    color: '#E0E8EE',
  },
  {
    name: '黑袍人影', pinyin: 'Hēi Páo Rén', role: '倒影 · 过去的我',
    portraitPrompt: 'A figure in dark Qing dynasty robe, faceless, standing in fog at the edge of a still pool, mirror image, IMAX cinematic, character concept art, 4:3',
    expressionPrompt: 'A dark hooded face with no clear features, only the outline of eyes, looking directly at camera, IMAX portrait, mysterious, 4:3',
    desc: '他从不正面示人；只有背影、侧影、水中倒影。他说的话没人记得；记得的人都不在了。',
    signature: '黑袍 · 静水倒影 · 烟流绕身',
    line: '「你是我。」',
    color: '#2A2A35',
  },
  {
    name: '残碑', pinyin: 'Cán Bēi', role: '见证者 · 山神',
    portraitPrompt: 'A broken ancient stone stele with faded red Chinese characters and moss, half-buried in wet ground, IMAX cinematic, 4:3',
    expressionPrompt: 'Close-up of the character 神 on the stone, the red pigment alive and flowing, IMAX portrait, intimate, 4:3',
    desc: '它不说话。字里的话被风读了三百年。问它"你在不在"的人，都已不在；问它"你在不在"的下一句，永远是"请自问"。',
    signature: '残碑 · 朱砂 · 苔藓 · 山神',
    line: '「若你是你，请自问。」',
    color: '#8B1A1A',
  },
];
