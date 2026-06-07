// 8 位关键人物的「卷轴人物志」

export type Faction = "宋" | "辽" | "北汉";

export type Cast = {
  id: string;
  name: string;
  title: string; // 头衔
  faction: Faction;
  age: string; // 活跃年代
  appearance: string; // 外貌
  costume: string; // 服饰
  weapon: string; // 兵器 / 标志
  signature: string; // 名场面 / 一句话
  promptEn: string; // 英文 Prompt
};

export const CAST: Cast[] = [
  {
    id: "c-zhaoguangi",
    name: "赵光义",
    title: "宋太宗 · 高粱河车神",
    faction: "宋",
    age: "939 — 997",
    appearance:
      "中年天子，面相方正而略显阴沉，眉骨高耸，目光精于算计，唇薄而紧。",
    costume:
      "圆领窄袖赭黄龙袍，腰束玉带，足蹬皂靴，头戴折上巾，肩披朱红大氅。",
    weapon: "御用镶金长剑 / 玉柄拂尘",
    signature: "高粱河大腿中两箭，驾驴车狂奔三十里，史称「驴车漂移」始祖。",
    promptEn:
      "Chinese Emperor Zhao Guangyi, 979 AD, square face with shrewd calculating eyes, thin tight lips, high brow bone, wearing a yellow imperial dragon robe with red cloak, jade belt, holding a long jian sword, Tang-Song dynasty royal aesthetic, painted scroll style portrait, dramatic rim light.",
  },
  {
    id: "c-yeluxiu",
    name: "耶律休哥",
    title: "辽国战神 · 擒首之将",
    faction: "辽",
    age: "?— 998",
    appearance:
      "契丹族青年名将，面庞棱角分明，眼神冷厉如鹰隼，皮肤因风霜而黝黑。",
    costume:
      "契丹式山纹铠甲，外罩墨色战袍，腰悬金弓，背插三支羽翎。",
    weapon: "契丹复合反曲弓 / 弧月战刀",
    signature: "高粱河一战直冲赵光义御营，岐沟关千里追击，宋人闻之色变。",
    promptEn:
      "Khitan general Yelu Xiuge, 986 AD, sharp angular face, piercing hawk-like eyes, weathered tanned skin, wearing tribal mountain-pattern armor with a black war cloak, golden recurve bow at the waist, eagle feathers on his back, painted scroll battle portrait.",
  },
  {
    id: "c-xiaoyanyan",
    name: "萧燕燕",
    title: "辽圣宗萧太后 · 摄政女主",
    faction: "辽",
    age: "953 — 1009",
    appearance:
      "三十许契丹贵妇，面若银盘，目光端庄而威严，眉心一点朱砂痣。",
    costume:
      "辽式贵族礼服，金丝绣凤纹抹额，长裙曳地，外披银狐皮裘。",
    weapon: "镶金玉鞭 / 凤凰金印",
    signature: "澶渊之盟签于黄河岸边，以太后之尊与宋真宗约为兄弟之国。",
    promptEn:
      "Khitan Empress Dowager Xiao Yanyan, 1004 AD, dignified oval face, commanding gaze, cinnabar mark on the brow, wearing Liao noble robes with gold phoenix headdress, silver fox fur shawl, holding a jade-encrusted golden whip, painted scroll royal portrait.",
  },
  {
    id: "c-panmei",
    name: "潘美",
    title: "北宋开国名将 · 潘仁美原型",
    faction: "宋",
    age: "925 — 991",
    appearance:
      "五十许老将，方脸阔口，颌下短须，目光老练而沉稳，略有世故之色。",
    costume:
      "宋式山纹铁甲，外罩绛色战袍，背披朱红披风，头戴凤翅兜鍪。",
    weapon: "开山长柄战刀",
    signature: "陈家谷口未按约设伏，使杨业孤军战死，戏曲中化作潘仁美千古蒙冤。",
    promptEn:
      "Northern Song founding general Pan Mei, 986 AD, square broad face with short beard, seasoned worldly eyes, wearing Song-style mountain-pattern iron armor with crimson cloak, phoenix-wing helmet, holding a long-handled war blade, painted scroll portrait.",
  },
  {
    id: "c-yangye",
    name: "杨业",
    title: "杨无敌 · 杨家将之祖",
    faction: "北汉",
    age: "约 928 — 986",
    appearance:
      "五十许北汉降将，面容清癯而刚毅，鬓已斑白，遍体旧伤。",
    costume:
      "白色镶边鱼鳞甲，外罩素白战袍，银色战盔上缀红缨，背插四面令旗。",
    weapon: "金刀 / 硬弓",
    signature: "陈家谷口空等救兵，被俘后绝食三日而死，后世尊为「杨令公」。",
    promptEn:
      "Northern Han defector General Yang Ye, the 'Invincible Yang', 986 AD, gaunt resolute face, grizzled temples, body covered in old scars, wearing white fish-scale armor with silver helmet and red plume, four command flags on his back, holding a golden battle saber, painted scroll memorial portrait.",
  },
  {
    id: "c-caobin",
    name: "曹彬",
    title: "北宋东路主帅 · 持重失机",
    faction: "宋",
    age: "931 — 999",
    appearance:
      "五十许儒将，气度温雅但眼神中略显怯懦，面白微胖，山羊胡。",
    costume:
      "宋式青光铠甲，外罩素青战袍，无盔仅束发，文将气质。",
    weapon: "长剑 / 令旗",
    signature:
      "持重缓行遵旨行事，最终仍冒进涿州，致十万主力在岐沟关覆灭。",
    promptEn:
      "Northern Song general Cao Bin, 986 AD, scholarly refined face with a hint of timidity, white-skinned and slightly plump, goatee beard, wearing cyan-toned armor with scholar's temperament, no helmet, holding a long sword and command flag, painted scroll portrait.",
  },
  {
    id: "c-handera",
    name: "韩德让",
    title: "辽南京留守 · 一代能臣",
    faction: "辽",
    age: "941 — 1011",
    appearance:
      "汉化契丹贵族，面容儒雅，目光深邃，蓄长须，气质如中原名士。",
    costume:
      "辽式文官常服，紫色团花锦袍，玉带金鱼袋，头戴乌纱展角幞头。",
    weapon: "文官笏 / 宝剑",
    signature:
      "高粱河之围时临危不乱，日夜登城巡视；后辅佐萧燕燕主持辽政二十余年。",
    promptEn:
      "Sinicized Khitan noble Han Derang, 979 AD, refined scholarly face, deep eyes, long beard, wearing a purple brocade robe with jade belt, gold fish pouch, and black gauze official hat, holding a hu tablet, painted scroll civil portrait.",
  },
  {
    id: "c-wangshen",
    name: "王侁",
    title: "监军使 · 纸上谈兵",
    faction: "宋",
    age: "生卒不详",
    appearance:
      "四十许文官出身的监军，瘦削精明，眼神刁钻，嘴角习惯性下撇。",
    costume:
      "宋式监军服，红色战袍外加黑边罩甲，肩悬监军金令牌，头戴武弁。",
    weapon: "监军令牌 / 短剑",
    signature:
      "陈家谷前冷嘲杨业「将军号称杨无敌，如今逡巡不前」，逼其出战致败。",
    promptEn:
      "Northern Song army supervisor Wang Shen, 986 AD, thin shrewd face, sharp critical eyes, downturned mouth, wearing red supervisor robe over black armor, golden supervisor token on shoulder, martial official cap, painted scroll portrait.",
  },
];
