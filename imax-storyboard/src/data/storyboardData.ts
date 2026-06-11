export interface StoryboardShot {
  id: number;
  scene: string; // 景别
  camera: string; // 运镜
  content: string; // 画面内容
  effects: string; // 特效/渲染
  sound: string; // 音效
}

export interface Chapter {
  id: number;
  title: string; // 章节标题
  subtitle: string; // 副标题
  duration: string; // 时长
  theme: string; // 主题
  shots: StoryboardShot[];
  accentColor: string; // 章节强调色
  glyph: string; // 装饰字符
}

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "第一幕：觉醒",
    subtitle: "The Awakening",
    duration: "15s",
    theme: "沉睡的农夫睁开眼，世界在他脚下震颤",
    accentColor: "#d4af37",
    glyph: "壹",
    shots: [
      {
        id: 1,
        scene: "大全景",
        camera: "地面仰拍 → 急速拉升",
        content:
          "IMAX级全画幅镜头，参考IMS粒子模糊算法，大景深呈现——圣像自地面破土，苍茫大地为之一震",
        effects: "IMAX 渲染 / IMS 粒子模糊 / 大气景深",
        sound: "低频嗡鸣 / 大地震颤"
      },
      {
        id: 2,
        scene: "远景",
        camera: "长焦压缩 → 横移",
        content:
          "中国老头（农夫装扮）蓦然回身，衣衫褴褛却步伐奇特——狂战运镜揭示其不世身份，周围空气被力量扭曲",
        effects: "3渲2 角色 / IC 现实环境 / 3渲2融合",
        sound: "急促脚步 / 古老编钟"
      },
      {
        id: 3,
        scene: "特写",
        camera: "快速变焦",
        content:
          "老头抬头，眼神从浑浊瞬间变得锐利，嘴角一丝中式幽默的狡黠笑容——一念之间，觉醒已成",
        effects: "面部微表情捕捉 / 瞳孔金光绽放",
        sound: "一声清脆的「叮」"
      }
    ]
  },
  {
    id: 2,
    title: "第二幕：战场召唤",
    subtitle: "Summoning the Battlefield",
    duration: "15s",
    theme: "空间崩裂，万军辟易，只为一农夫的登场",
    accentColor: "#ff6b35",
    glyph: "贰",
    shots: [
      {
        id: 4,
        scene: "全景",
        camera: "不稳定手持 → 环绕",
        content:
          "战场废墟之上，中式塔楼虚影忽现忽灭，巨型高塔凌空落下，画面割裂感强烈——天虹瞬间变色",
        effects: "空间崩解 / 镜头剧烈晃动 / 现实割裂",
        sound: "心跳低频 / 崩裂轰鸣"
      },
      {
        id: 5,
        scene: "中景",
        camera: "快速推拉",
        content:
          "士兵跌倒，抬头看见老头立于前方——水墨线条从角色身上迸发，笼罩整个战场的威压降临",
        effects: "瞬间模糊→清晰 / 水墨线条迸发",
        sound: "声音骤停 / 只剩风声"
      },
      {
        id: 6,
        scene: "特写",
        camera: "固定机位",
        content:
          "老头开口，方言古音震彻寰宇：「炽龙！逮住他」——水墨巨龙自虚空中延展而出",
        effects: "言出法随 / 空间扭曲 / 巨龙虚影",
        sound: "古老咒语回声 / 多层混响"
      }
    ]
  },
  {
    id: 3,
    title: "第三幕：天坠",
    subtitle: "The Heaven Falls",
    duration: "15s",
    theme: "行星自天外坠落，巨神自裂隙中苏醒",
    accentColor: "#e85d04",
    glyph: "叁",
    shots: [
      {
        id: 7,
        scene: "大全景",
        camera: "天顶俯拍 → 急速下坠",
        content:
          "天空撕裂，一颗行星冲破大气层，地面崩塌——火球占据整个IMAX画幅，冲击波环形扩散",
        effects: "物理模拟：大气摩擦粒子 / 冲击波环形扩散",
        sound: "次声波压迫 / 耳膜刺痛感"
      },
      {
        id: 8,
        scene: "中景",
        camera: "稳定跟拍",
        content:
          "尘埃粒子IC级现实渲染，逆光剪影勾勒铠甲轮廓——老头戴上帽子，暗示战斗开始",
        effects: "IC级现实渲染 / 逆光剪影 / 粒子尘埃",
        sound: "金属铠甲碰撞声"
      },
      {
        id: 9,
        scene: "特写",
        camera: "慢动作",
        content:
          "巨兽面部细节，异域神秘感——瞳孔之中倒映着坠落的星辰，与老头的身影重叠",
        effects: "异域神秘 / 面部细节 / 慢动作",
        sound: "英文低沉 / 古老口音"
      }
    ]
  },
  {
    id: 4,
    title: "第四幕：神力爆发",
    subtitle: "Divine Power Unleashed",
    duration: "15s",
    theme: "农夫一推手，行星湮灭；宇宙巨兽，自裂隙而出",
    accentColor: "#d62828",
    glyph: "肆",
    shots: [
      {
        id: 10,
        scene: "中景",
        camera: "环绕长镜头",
        content:
          "老头单手平推，动作如农夫推犁般随意——行星瞬间静止，然后向内坍缩、爆裂、毁灭",
        effects: "空间褶皱 / 引力透镜 / 物质崩解为几何碎片",
        sound: "绝对静音 → 爆发性白噪音"
      },
      {
        id: 11,
        scene: "大全景",
        camera: "急速后退",
        content:
          "冲击波几何倍数扩散，环形气浪摧毁方圆百里——但老头和士兵所在之处安然无恙",
        effects: "空间割裂感：毁灭与安全边界清晰可见",
        sound: "冲击波低频扫荡"
      },
      {
        id: 12,
        scene: "近景",
        camera: "快速切换",
        content:
          "太空巨兽从裂隙中探出，老头与巨兽的第一次交锋——水墨画风格的打击轨迹，瞬间线条勾勒力量走向",
        effects: "水墨画打击轨迹 / 力量线条勾勒",
        sound: "骨骼碰撞的沉闷巨响"
      }
    ]
  },
  {
    id: 5,
    title: "第五幕：神战",
    subtitle: "The Cosmic Duel",
    duration: "15s",
    theme: "每一拳都是宇宙的涟漪，每一击都是星辰的葬歌",
    accentColor: "#9d0208",
    glyph: "伍",
    shots: [
      {
        id: 13,
        scene: "特写 → 全景",
        camera: "镜头瞬间变化",
        content:
          "老头每一次出拳，冲击波都几何倍扩散，在宇宙中形成涟漪——镜头跟随拳头轨迹，速度线+动态模糊",
        effects: "运镜展现力度 / 速度线 / 动态模糊",
        sound: "打击音效层层叠加"
      },
      {
        id: 14,
        scene: "中景",
        camera: "快速横移",
        content:
          "巨兽被击中，空间本身被撕裂，露出背后的虚空与星辰——物理法则崩坏的视觉化",
        effects: "空间毁灭效果 / 物理法则崩坏",
        sound: "玻璃碎裂声放大千倍"
      },
      {
        id: 15,
        scene: "大全景",
        camera: "360度环绕",
        content:
          "最终一击——老头跃起，全身化为水墨金龙，贯穿巨兽——3渲2角色完全释放，中国神话美学爆发",
        effects: "3渲2完全释放 / 中国神话美学 / 金龙贯穿",
        sound: "龙吟 + 宇宙寂静"
      }
    ]
  },
  {
    id: 6,
    title: "第六幕：余韵",
    subtitle: "The Quiet Aftermath",
    duration: "15s",
    theme: "沙丘的苍凉里，传来一声东方编钟",
    accentColor: "#6c757d",
    glyph: "陆",
    shots: [
      {
        id: 16,
        scene: "远景",
        camera: "缓慢拉升",
        content:
          "老头平静站着，周围太空舰队无声环绕——角色深呼吸，沙丘色调的苍凉史诗感铺陈而来",
        effects: "低饱和《沙丘》色调 / 苍凉史诗感",
        sound: "风声 / 远处星辰低语"
      },
      {
        id: 17,
        scene: "特写",
        camera: "固定机位",
        content:
          "老头脸上浮现一丝中式幽默——在毁灭宇宙巨兽之后，他只是拍了拍身上的灰尘",
        effects: "中式幽默 / 强烈反差感",
        sound: "轻快的笛声插入"
      },
      {
        id: 18,
        scene: "黑屏",
        camera: "无",
        content:
          "编钟最后一声——色调严格《沙丘》低饱和，画面彻底归于寂静，余韵悠长",
        effects: "《沙丘》低饱和 / 完结",
        sound: "编钟余韵 / 消散"
      }
    ]
  }
];
