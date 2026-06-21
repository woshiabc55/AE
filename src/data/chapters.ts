export interface ChapterParagraph {
  text: string;
  emphasis?: boolean;
}

export interface Chapter {
  id: string;
  roman: string;
  index: string;
  title: string;
  subtitle: string;
  bgClass: string;
  accent: "ember" | "blue" | "flare";
  paragraphs: ChapterParagraph[];
}

export const introParagraphs: ChapterParagraph[] = [
  {
    text: `如果此刻你正站在"地球诞生前"的宇宙坐标上，你会发现一个颠覆常识的事实：这里没有"站在"这个动作，因为脚下空无一物，甚至连"空"本身都还没被定义。`,
  },
  {
    text: `让我们把时间拨回46亿年前，拨过那个奇点，回到一片混沌的星云深处。如果你是穿越而来的观察者（假设你有一艘无视物理法则的飞船），你看到的场景会是这样的：`,
  },
];

export const chapters: Chapter[] = [
  {
    id: "visual",
    roman: "I",
    index: "01",
    title: "视觉",
    subtitle: `宇宙最极致的"水墨画"`,
    bgClass: "bg-chapter-visual",
    accent: "ember",
    paragraphs: [
      {
        text: `没有蓝天，没有星光点点的熟悉夜空。你眼前是一团跨度达数光年的暗黑分子云——像浓稠的墨汁滴入水中。背景里，上一代超新星爆发抛出的重元素尘埃（硅、铁、氧）在绝对零度附近漂浮。`,
      },
      {
        text: `唯一的光源，是云核中心因引力坍缩而微微发热的原恒星（我们的太阳前身），它发出暗红色的、如炭火余烬般的红外微光，照亮了周围旋转的、由冰晶和硅酸盐颗粒组成的"宇宙雪暴"。`,
        emphasis: true,
      },
    ],
  },
  {
    id: "audio",
    roman: "II",
    index: "02",
    title: "听觉",
    subtitle: `永恒的"宇宙白噪音"`,
    bgClass: "bg-chapter-audio",
    accent: "blue",
    paragraphs: [
      {
        text: `如果你能释放传感器，你会感受到强烈的引力波涟漪和湍流嘶吼。周围没有空气传播声音，但星云中的气体分子在引力拉扯下高速摩擦，产生持续的低频震动。`,
      },
      {
        text: `你仿佛置身于一个巨大的、没有出口的瀑布底部，周围全是氢分子和氦原子撞击飞船外壳的沙沙声——那是星云在"呼吸"，在为地球的诞生收集建材。`,
        emphasis: true,
      },
    ],
  },
  {
    id: "embryo",
    roman: "III",
    index: "03",
    title: "胚胎",
    subtitle: `地球的"胚胎"正在抢夺资源`,
    bgClass: "bg-chapter-embryo",
    accent: "flare",
    paragraphs: [
      {
        text: `此时的太阳系还只是一盘散沙。在距离原恒星大约1.5亿公里（即现在地球轨道）的位置，没有固体星球，只有一圈密度稍高的尘埃环。你如果放大视野，会看到无数直径仅几微米的尘粒在随机游走。`,
      },
      {
        text: `偶尔，它们会因静电吸附在一起，形成毫米级的"绒球"。这就是地球的"受精卵"时刻——它正在与轨道上数百万颗小行星争夺物质，每一次碰撞都可能在数万年内改变它的最终质量。`,
        emphasis: true,
      },
    ],
  },
  {
    id: "time",
    roman: "IV",
    index: "04",
    title: "时间",
    subtitle: "时间感的崩溃",
    bgClass: "bg-chapter-time",
    accent: "ember",
    paragraphs: [
      {
        text: `如果你是肉身穿越，你会瞬间被宇宙微波背景辐射（约3K）冻成粉末，同时被强烈的太阳风剥离。但即便你是一段不灭的意识流，你也会体验到前所未有的孤独：要想看到地球凝聚成熔岩球，你需要在这里悬浮5000万年。`,
      },
      {
        text: `在这段时光里，你会目睹原太阳从红外暗红骤然点燃氢核聚变，爆发出刺眼的蓝白色光芒——那场"点火"带来的太阳风，会像一只巨手，把轻质气体（氢、氦）吹向外围，恰好让内侧的重元素岩石得以幸存，汇聚成你脚下未来的大地。`,
        emphasis: true,
      },
    ],
  },
  {
    id: "paradox",
    roman: "V",
    index: "05",
    title: "悖论",
    subtitle: "最深层的悖论：你并不存在",
    bgClass: "bg-chapter-paradox",
    accent: "blue",
    paragraphs: [
      {
        text: `最令人战栗的是物理法则：在地球诞生前，构成你身体里的每一颗钙原子、每一粒铁元素、每一个氧原子，此刻都还散落在这片星云的不同角落。有的来自120亿年前某颗红巨星的临终抛射，有的来自几万年前附近超新星的冲击波。`,
      },
      {
        text: `穿越回这里，意味着你的存在本身瓦解了——你并不是回到了"过去"，而是回到了"你身体的原材料尚未组装"的仓库。如果此时有一束光照亮你，你会发现你的身体正在缓缓消散成基本粒子，因为维持你化学键的电磁力，在星云高能辐射下显得摇摇欲坠。`,
        emphasis: true,
      },
    ],
  },
];

export const finaleParagraphs: ChapterParagraph[] = [
  {
    text: `当时间走过亿万年的吸积，当那颗直径一万两千公里的岩石行星终于在撞击中成型，你可能会看到一片滚烫的橘红色岩浆海。`,
  },
  {
    text: `但就在地球诞生的第一秒，一阵来自原太阳的更猛烈的辐射风袭来，吹散了最后残余的气体——地球正式"断奶"。`,
  },
  {
    text: `而你，这位穿越者，如果还保留着最后一丝意识，你会明白：你不是在目睹地球的诞生，你是在目睹你自己成为可能的那个瞬间。`,
    emphasis: true,
  },
  {
    text: `当你回到现代，呼吸第一口空气时，请记住——那口空气里的氮原子，曾经在46亿年前的那个暗黑时刻，从你透明的指尖流过。`,
  },
];
