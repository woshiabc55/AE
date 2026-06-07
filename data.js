/* 宋太宗北伐 - 故事板数据
   每个分镜固定 15 秒，总时长 13 分钟
   字符位置: 0=中间, 1=左前, 2=右前, 3=左后, 4=右后, 5=上方, 6=下方
*/

const SCRIPT_DATA = {
  meta: {
    title: "高粱河车神与雍熙悲歌：赵光义北伐全纪实",
    totalDuration: 780, // 13 min in seconds
    totalShots: 52,
    readingSpeed: "180-200字/分钟",
    targetWords: 2400
  },
  scenes: [
    {
      id: "intro",
      title: "引子：中原王朝失落的屏障",
      subtitle: "燕云十六州的百年之痛",
      color: "vermilion",
      explanation: "公元936年，后晋石敬瑭认辽帝耶律德光为父，割让燕云十六州，使中原失去北方屏障达四百余年。这一事件直接塑造了此后宋辽军事格局。",
      shots: [
        {
          id: "s01",
          title: "石敬瑭割让燕云",
          startTime: 0, endTime: 15,
          script: "公元936年，五代后晋的开国皇帝石敬瑭，为了换取契丹人的支持，做了一件遗臭万年的事。",
          characters: [
            { name: "石敬瑭", role: "后晋高祖", pos: "1", emotion: "谄媚" },
            { name: "耶律德光", role: "辽太宗", pos: "4", emotion: "得意" }
          ],
          position: "朝堂之上：石敬瑭跪于左，耶律德光高坐于右",
          prompt: "cinematic ancient Chinese palace, two figures: a kneeling Chinese emperor in yellow silk robe on the left offering a map scroll, a tall Khitan emperor on a raised throne on the right with fur cloak and gold crown, dim candlelight, dramatic chiaroscuro, ink wash style, 9:16",
          fx: "朝堂烛火摇曳",
          explanation: "石敬瑭称辽帝为'父皇帝'，自称'儿皇帝'，割让燕云十六州，每年输绢三十万匹，是中原王朝最屈辱的外交事件之一。"
        },
        {
          id: "s02",
          title: "燕云十六州舆图",
          startTime: 15, endTime: 30,
          script: "他不仅把比自己小十岁的契丹皇帝耶律德光认作父亲，更将中原王朝最重要的北方屏障——燕云十六州，拱手让给了辽国。",
          characters: [
            { name: "旁白", role: "叙述者", pos: "0", emotion: "凝重" }
          ],
          position: "俯视古代地图，十六州位置用红色高亮",
          prompt: "top-down view of an ancient Chinese strategic map, sixteen administrative regions highlighted in red along the northern border, surrounding Khitan territory in dark ink, the Great Wall visible as a thin line, aged parchment texture, cinematic overhead shot",
          fx: "地图卷轴展开动画",
          explanation: "燕云十六州包括幽、蓟、瀛、莫、涿、檀、顺、新、妫、儒、武、蔚、云、应、寰、朔，核心是今北京（大兴、幽州）与山西大同（云州）。"
        },
        {
          id: "s03",
          title: "险关失守",
          startTime: 30, endTime: 45,
          script: "这片以今天的北京和大同为中心的战略要地，囊括了居庸关、雁门关等险要关口。",
          characters: [
            { name: "守关宋军", role: "群像", pos: "0", emotion: "绝望" }
          ],
          position: "长城关口，远景切换至城内百姓奔逃",
          prompt: "epic wide shot of Juyongguan and Yanmenguan mountain passes, Chinese defenders abandoning stone fortresses, Khitan cavalry banners appearing on the horizon, snow on the Great Wall, dramatic sunset, traditional Chinese painting composition mixed with cinematic realism",
          fx: "千军万马奔腾特效",
          explanation: "居庸关扼守太行八陉之军都陉，雁门关控遏勾注山，二者与河北平原形成三重防御体系。失去后，游牧骑兵可一泻千里。"
        },
        {
          id: "s04",
          title: "华北无险可守",
          startTime: 45, endTime: 60,
          script: "失去它，整个华北平原便无险可守，北方游牧骑兵可以长驱直入，直抵开封城下。",
          characters: [
            { name: "契丹骑兵", role: "敌方", pos: "5", emotion: "凶悍" }
          ],
          position: "骑兵从北方地平线俯冲而下，前景为平原",
          prompt: "dramatic aerial shot, vast North China plain stretching to the horizon, a massive Khitan cavalry charge sweeping south from the mountains in the background, dust clouds rising, distant view of Kaifeng city silhouette, ominous golden light, ultra-wide cinematic composition",
          fx: "战马扬尘漫天",
          explanation: "华北平原即黄淮海平原，从燕云至开封约700公里，无大河险阻，骑兵一日可至城下。这是历代中原王朝最深的战略恐惧。"
        },
        {
          id: "s05",
          title: "赵光义登基之志",
          startTime: 60, endTime: 75,
          script: "此后四十余年，这块'心病'始终压在每一位中原帝王的心头。直到公元976年，雄心勃勃的宋太宗赵光义，决心终结这个百年憾事。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "雄心" }
          ],
          position: "皇宫大殿中央，龙椅之前",
          prompt: "portrait of Emperor Zhao Guangyi of Song dynasty in full imperial dragon robe, standing before the dragon throne, looking south with determined eyes, a hand pointing forward to a wall map of Yanyun, red candles flanking, misty atmosphere, dramatic low-angle shot, traditional Chinese painting style with modern cinematic lighting",
          fx: "帝王目光如炬",
          explanation: "976年十月，赵光义继位，改元太平兴国。他面临的不仅是燕云之失，更是如何证明皇位合法性的政治困局。"
        }
      ]
    },
    {
      id: "act1",
      title: "第一幕 · 高粱河之败（979年）",
      subtitle: "雄心与冒进之殇",
      color: "vermilion",
      explanation: "太平兴国四年（979年），赵光义挟灭北汉之威，未经休整即东征幽州。高粱河之战，宋军精锐尽失，赵光义本人中箭乘驴车而逃，成为千年笑谈。",
      shots: [
        {
          id: "s06",
          title: "烛影斧声",
          startTime: 75, endTime: 90,
          script: "公元976年，宋太祖赵匡胤突然驾崩，留下了'烛影斧声'的千古谜团。",
          characters: [
            { name: "赵匡胤", role: "宋太祖", pos: "1", emotion: "病重" },
            { name: "赵光义", role: "宋太宗", pos: "4", emotion: "觊觎" }
          ],
          position: "寝殿内：屏风分隔两人，烛光摇晃",
          prompt: "interior of a Song dynasty imperial bedchamber at night, flickering candle casting dancing shadows on a screen, two silhouettes, one lying on the imperial bed on the left, one standing on the right, axe shadow on the wall, dramatic chiaroscuro, mysterious and ominous atmosphere, ink wash with cinematic lighting",
          fx: "烛火摇曳 / 屏风投影",
          explanation: "'烛影斧声'出自《湘山野录》：赵匡胤召赵光义入宫，烛影下有人持斧。最终赵匡胤暴卒，赵光义次日即位于灵柩前，是史学公案。"
        },
        {
          id: "s07",
          title: "继位之议",
          startTime: 90, endTime: 105,
          script: "他的弟弟赵光义在一片争议中登上了皇位，是为宋太宗。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "不安" },
            { name: "文武百官", role: "群臣", pos: "3", emotion: "窃窃私语" }
          ],
          position: "灵柩前，赵光义居中",
          prompt: "wide shot of Song dynasty throne room, a coffin draped in yellow silk in the foreground center, Zhao Guangyi in imperial yellow robe standing before it looking unsettled, rows of ministers on both sides whispering, incense smoke, harsh light from above, somber muted color palette, cinematic realism with traditional Chinese costume details",
          fx: "百官低语回响",
          explanation: "赵光义继位后推出'金匮之盟'，宣称杜太后遗命'兄终弟及'。但此盟书真伪至今是史学界争议焦点。"
        },
        {
          id: "s08",
          title: "北伐北汉",
          startTime: 105, endTime: 120,
          script: "为了证明自己皇位的正当性，也为了超越兄长的功业，赵光义急于建立彪炳史册的战功。他的第一个目标，是五代十国中最后一个割据政权——北汉。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "1", emotion: "决心" },
            { name: "潘美", role: "北路招讨使", pos: "2", emotion: "领命" }
          ],
          position: "行营帅帐：沙盘前，帝王指点",
          prompt: "military command tent interior, Zhao Guangyi in golden armor pointing at a sand table map on the left, General Pan Mei in heavy armor receiving orders on the right, banners and weapon racks in background, warm lantern light, smoke from incense, classical Chinese painting composition, cinematic dramatic lighting",
          fx: "帅旗飘扬 / 战鼓回响",
          explanation: "北汉都太原，依辽为援，自后汉以来割据山西28年。宋若灭北汉，既能消除侧翼威胁，又可获得战略前进基地。"
        },
        {
          id: "s09",
          title: "太原城破",
          startTime: 120, endTime: 135,
          script: "太平兴国四年（公元979年）正月，赵光义任命潘美为北路招讨使，亲率大军北伐。经过数月血战，五月初六，北汉皇帝刘继元被迫出城投降。",
          characters: [
            { name: "刘继元", role: "北汉末帝", pos: "1", emotion: "颓丧" },
            { name: "赵光义", role: "宋太宗", pos: "2", emotion: "得意" }
          ],
          position: "太原城门外，受降仪式",
          prompt: "epic shot outside the ancient city of Taiyuan, gates wide open, defeated Northern Han emperor Liu Jiyuan in white mourning clothes walking out surrounded by Song soldiers, Zhao Guangyi on horseback receiving surrender in golden armor, captured banners on the ground, overcast sky, muted desaturated colors, cinematic realism",
          fx: "城门缓缓打开",
          explanation: "北汉末帝刘继元是刘崇之孙，在位13年。降宋后被封为彭城郡公，13年后病死于房州。"
        },
        {
          id: "s10",
          title: "将士盼赏",
          startTime: 135, endTime: 150,
          script: "北汉的灭亡标志着中原大地结束了自唐末以来长达半个多世纪的分裂割据。然而，胜利的喜悦冲昏了赵光义的头脑。",
          characters: [
            { name: "宋军将士", role: "群像", pos: "0", emotion: "疲惫" }
          ],
          position: "营帐中，群臣环立",
          prompt: "interior of a grand military camp, exhausted Song dynasty soldiers in armor sitting on the ground, some bandaged, looking up expectantly at the command tent, dust and grime, the atmosphere of weariness, muted brown and gray tones, single shaft of light from tent opening, documentary war photography style",
          fx: "远处鼓声沉寂",
          explanation: "自正月出兵至五月破城，宋军连续作战四个多月，跨越太行山深入山西腹地，将士疲惫是必然。但赵光义被胜利冲昏头脑。"
        },
        {
          id: "s11",
          title: "不赏东进",
          startTime: 150, endTime: 165,
          script: "白马岭一战的胜利让他误以为辽军不堪一击。此时的宋军将士们自正月出征以来，已连续作战四个多月，疲惫不堪，人困马乏。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "傲慢" }
          ],
          position: "帅帐中央，手指幽州方向",
          prompt: "close-up of Zhao Guangyi in golden imperial armor, arrogant smirk, pointing forward to the east, map of Youzhou on the table behind, warm dramatic lighting from the side, dust particles in the air, cinematic portrait shot, intricate Song dynasty armor details, painterly quality",
          fx: "地图东向高亮",
          explanation: "白马岭之战是灭北汉过程中的一次胜利，宋军击退辽将耶律沙的援军。但这只是一次小胜，赵光义却误判了辽军整体实力。"
        },
        {
          id: "s12",
          title: "诸将不敢谏",
          startTime: 165, endTime: 180,
          script: "攻破太原后，将士们都盼望得到封赏，可赵光义却分文未赏，反而临时决定不做休整，直接挥师东进，乘胜收复燕云十六州。诸将皆不愿行，但无人敢言。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "专断" },
            { name: "诸将", role: "群像", pos: "3", emotion: "忧虑" }
          ],
          position: "中军大帐，皇帝居高临下",
          prompt: "wide shot of a Song dynasty war council, Zhao Guangyi in golden armor standing imperiously on a raised platform center, generals in subordinate postures on both sides, none daring to speak up, one general on the left with eyes downcast and fists clenched, dramatic overhead single lantern light, chiaroscuro, cinematic war drama composition",
          fx: "帐帘被风掀起",
          explanation: "《宋史》记载'诸将皆不愿行，无人敢言'。这种绝对皇权下无人敢谏的格局，为后来的惨败埋下伏笔。"
        },
        {
          id: "s13",
          title: "仓促东征",
          startTime: 180, endTime: 195,
          script: "六月十三日，赵光义率领十余万疲惫的禁军从镇州仓促出发。",
          characters: [
            { name: "宋军禁军", role: "主力", pos: "0", emotion: "疲惫" }
          ],
          position: "镇州城外，长蛇般的行军队伍",
          prompt: "panoramic shot of an ancient Chinese army marching eastward in summer, exhausted Song soldiers in heavy armor under the blazing sun, dust rising from the road, ten-mile-long column stretching to the horizon, Zhongzhou city wall in the far background, intense summer heat haze, low camera angle, cinematic war film epic scale",
          fx: "烈日灼灼 / 黄沙漫道",
          explanation: "镇州即今河北正定，距幽州约300公里。十余万禁军轻装急进，每人仅带数日口粮，犯下兵家大忌。"
        },
        {
          id: "s14",
          title: "辽军望风而降",
          startTime: 195, endTime: 210,
          script: "或许是天意眷顾，宋军初期进展极为顺利。所到之处，辽军纷纷望风而降。",
          characters: [
            { name: "辽军", role: "地方守军", pos: "4", emotion: "惊惧" }
          ],
          position: "沿途州县，辽军出城投降",
          prompt: "series of small walled towns along the road, Khitan garrison soldiers emerging with white flags of surrender, Song cavalry riding through empty streets, abandoned Khitan banners trampled in dust, summer heat, dramatic wide establishing shots, montage sequence, cinematic war documentary style",
          fx: "城门连续洞开",
          explanation: "辽国在燕云以南多为汉人守将，兵力分散。宋军突然杀至，地方守将多不战而降，给赵光义造成'辽军虚弱'的错觉。"
        },
        {
          id: "s15",
          title: "围困幽州",
          startTime: 210, endTime: 225,
          script: "六月二十三日，宋军仅用十天便抵达幽州城下，随即从东南西北四面将这座辽朝的'南京'围了个水泄不通。",
          characters: [
            { name: "幽州城", role: "地标", pos: "0", emotion: "沉默" },
            { name: "宋军", role: "围城方", pos: "5", emotion: "围困" }
          ],
          position: "幽州城外俯视，四个方向旌旗密布",
          prompt: "bird's-eye view of the ancient city of Youzhou surrounded by four massive Song army camps on all four sides, banners and tents forming a complete ring, the walled city in the center, moat and walls clearly visible, summer afternoon, smoke from countless campfires, painterly Chinese landscape style with modern cinematic color grading",
          fx: "四门同步合围",
          explanation: "幽州是辽五京之南京（今北京西南），辽国陪都，城高墙厚，常驻精兵。辽国将燕云经营近40年，城防极为完善。"
        },
        {
          id: "s16",
          title: "韩德让登城",
          startTime: 225, endTime: 240,
          script: "幽州守将韩德让临危不惧，日夜登城巡视，组织军民顽强抵抗。",
          characters: [
            { name: "韩德让", role: "辽南京留守", pos: "0", emotion: "坚毅" }
          ],
          position: "幽州城头，远眺城外宋营",
          prompt: "portrait of Yelü Xige-era Song-era Chinese general Han Derang in dark Khitan-Song style armor, standing atop ancient city wall at night, hand on sword hilt, looking out at the surrounding Song army campfires, fierce determination, wind blowing his cloak, moonlight, dramatic cinematic portrait",
          fx: "城头风起 / 火把光影",
          explanation: "韩德让是辽国汉臣，韩匡嗣之子，后成为萧太后情人，官至大丞相，被赐国姓耶律，改名耶律隆运，是辽国汉臣第一人。"
        },
        {
          id: "s17",
          title: "攻城无器械",
          startTime: 240, endTime: 255,
          script: "而宋军由于翻越太行山轻装急进，没有携带任何重型攻城器械，面对幽州坚城一筹莫展，攻坚战持续半个月仍毫无进展。",
          characters: [
            { name: "宋军", role: "攻城方", pos: "0", emotion: "沮丧" }
          ],
          position: "幽州城下，攻城云梯被推倒",
          prompt: "low-angle dramatic shot of Song soldiers trying to scale the towering walls of Youzhou with simple ladders, defenders on the wall pouring boiling oil and dropping rocks, ladders catching fire and falling, desperate close combat at the base of the wall, dust and fire, gritty war film aesthetic, dark dramatic tones",
          fx: "攻城器械损毁",
          explanation: "宋军仓促东进，未带冲车、投石机等重型器械。云梯易被守军推倒，损失惨重。这种轻装冒进是兵家大忌。"
        },
        {
          id: "s18",
          title: "围师必阙之失",
          startTime: 255, endTime: 270,
          script: "'围师必阙'是兵家常识——攻城应留一个出口，瓦解敌军斗志。但赵光义太想以一场完美的胜利来证明自己，命令四面合围、不留退路。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "执着" }
          ],
          position: "中军大帐，地图前",
          prompt: "top-down view of a strategic map table with four red banners pushed against a circular walled city from all sides, leaving no opening, Zhao Guangyi's hand slamming down on the map, ring of candles around the table, dramatic shadows, ancient Chinese strategic planning scene, cinematic realism",
          fx: "四道红旗合拢",
          explanation: "'围师必阙'出自《孙子兵法·军争篇》。包围敌人必留缺口，使其有逃生希望而斗志瓦解。赵光义反其道行之，激发死战决心。"
        },
        {
          id: "s19",
          title: "辽军援至",
          startTime: 270, endTime: 285,
          script: "辽景宗耶律贤得知幽州告急，急令各路援军驰援。关键时刻，辽国一代名将耶律休哥主动请缨，率精锐骑兵昼夜兼程赶往战场。",
          characters: [
            { name: "耶律休哥", role: "辽北院大王", pos: "0", emotion: "决然" }
          ],
          position: "北方草原，骑兵昼夜疾驰",
          prompt: "epic shot of Yelü Xiuge, a Khitan general in fur-lined lamellar armor on horseback, leading thousands of Khitan cavalry charging across the Mongolian steppe under a stormy sky, dust clouds and banners, dramatic wide shot from the side, dynamic motion blur, cinematic war epic scale, cool blue-gray tones",
          fx: "昼夜兼程",
          explanation: "耶律休哥是辽国第一名将，史称'以寡敌众，所向克捷'。他以骑兵快速机动见长，曾在满城之战大破宋军，是赵光义的克星。"
        },
        {
          id: "s20",
          title: "高粱河初战",
          startTime: 285, endTime: 300,
          script: "七月初六，辽将耶律沙的部队率先抵达幽州城西北。宋太宗闻讯，亲率主力迎战，双方在高梁河展开激战。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "2", emotion: "振奋" },
            { name: "耶律沙", role: "辽将", pos: "1", emotion: "勇猛" }
          ],
          position: "高粱河畔，两军对垒",
          prompt: "wide shot of the Gaolianghe river battlefield, two armies clashing on the banks, Zhao Guangyi in golden armor leading a cavalry charge on the right, Khitan general Yelü Sha defending on the left, dust and weapons clashing, summer heat, dynamic cinematic battle composition, painterly Chinese war painting style",
          fx: "战马嘶鸣 / 兵器交击",
          explanation: "高粱河在今北京西直门外，是永定河故道。耶律沙的先锋部队首先抵达，与宋军在高粱河西北展开激战。"
        },
        {
          id: "s21",
          title: "耶律休哥突袭",
          startTime: 300, endTime: 315,
          script: "宋军初战告捷，击退了耶律沙。然而就在宋军准备扩大战果时，耶律休哥与耶律斜轸率领的五院军精锐骑兵从左右两翼突然杀出，如两把尖刀直插宋军核心。",
          characters: [
            { name: "耶律休哥", role: "辽北院大王", pos: "4", emotion: "锐利" },
            { name: "耶律斜轸", role: "辽南院大王", pos: "3", emotion: "锐利" }
          ],
          position: "宋军两翼，敌军从侧翼杀出",
          prompt: "dramatic split-screen battle moment, Song soldiers in center looking triumphant, then from both flanks Khitan heavy cavalry exploding into the scene like two blades, banners with Yelü Xiuge and Yelü Xizhen symbols, dust and chaos erupting, dynamic diagonal composition, cinematic war film with slow-motion quality",
          fx: "两翼包抄",
          explanation: "耶律斜轸与耶律休哥齐名，'斜轸统军四十万，休哥总山前诸军'。两人是辽景宗、圣宗时期最重要的双子将星。"
        },
        {
          id: "s22",
          title: "斩首行动",
          startTime: 315, endTime: 330,
          script: "更致命的是，耶律休哥一眼看出了宋军阵中赵光义的御营位置，集中精锐骑兵发动了一次'斩首行动'。",
          characters: [
            { name: "耶律休哥", role: "辽北院大王", pos: "0", emotion: "凶狠" }
          ],
          position: "宋军御营正北，辽军直冲",
          prompt: "intense close-up of Yelü Xiuge pointing his spear directly forward, the imperial Song command tent visible in the distance, a cohort of elite Khitan lancers charging with him, dust and motion, narrow focal length, golden afternoon light, dramatic cinematic war portrait, intense eye contact",
          fx: "御营旌旗被风撕扯",
          explanation: "御营暴露在阵后是兵家大忌，但赵光义为激励士气，将御营设在阵后不远处。耶律休哥一眼识破，发动'斩首'。"
        },
        {
          id: "s23",
          title: "宋军崩溃",
          startTime: 330, endTime: 345,
          script: "早已疲惫不堪的宋军哪里还抵挡得住辽国铁骑的冲击，全军顿时崩溃，阵脚大乱。",
          characters: [
            { name: "宋军", role: "溃兵", pos: "0", emotion: "崩溃" }
          ],
          position: "战场全景，宋军四散奔逃",
          prompt: "apocalyptic wide shot of the Gaolianghe battlefield, Song army lines disintegrating into chaos, soldiers fleeing in all directions, abandoned banners, broken weapons, dust clouds, Khitan cavalry cutting through, sunset light through smoke, intense warm color palette of orange and red, cinematic disaster scale",
          fx: "全军溃散",
          explanation: "宋军连续作战半年，疲惫已极。辽军生力军加入战斗后，宋军一触即溃。这是'疲惫之师遇生力军'的典型战例。"
        },
        {
          id: "s24",
          title: "中箭乘驴车",
          startTime: 345, endTime: 360,
          script: "赵光义在乱军之中大腿连中两箭，战马也被射杀。情急之下，这位皇帝陛下居然找到了一辆驴车，驾着它拼命狂奔。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "狼狈" }
          ],
          position: "乱军之中，驴车向南飞奔",
          prompt: "iconic dramatic shot, Zhao Guangyi in blood-stained golden imperial armor with arrows in his thigh, desperately driving a small donkey cart at full speed through a forest of fleeing soldiers, dust and chaos all around, low angle tracking shot, motion blur, golden hour lighting, this is the legendary 'donkey cart escape'",
          fx: "驴蹄扬尘",
          explanation: "《宋史·太宗本纪》载'中两箭，亟召兵负之至涿州'。司马光《涑水记闻》补充：'乘驴车遁走'。这是'高粱河车神'外号的由来。"
        },
        {
          id: "s25",
          title: "追奔三十里",
          startTime: 360, endTime: 375,
          script: "辽国骑兵追杀三十余里，但宋太宗靠着一手'驴车漂移'的绝技，硬是从死神手中逃脱。",
          characters: [
            { name: "辽国骑兵", role: "追兵", pos: "5", emotion: "懊恼" }
          ],
          position: "官道之上，辽骑追赶",
          prompt: "cinematic chase scene, a small donkey cart with a wounded emperor in golden armor racing down a long ancient road, pursuing Khitan cavalry in the background unable to close the gap, dust trails, sunset sky, dynamic low-angle shot with motion blur, painting the legendary 'donkey cart drifting' moment, humorous yet epic",
          fx: "驴车飞驰",
          explanation: "史书未载'驴车漂移'，但赵光义以驴车逃出生天是史实。'车神'之号来自网络调侃，但确实成为他终生难洗的污点。"
        },
        {
          id: "s26",
          title: "辎重尽失",
          startTime: 375, endTime: 390,
          script: "史书记载，这一战宋军'斩首万余级'，辎重粮草、服御宝器尽数为辽军所夺，十余万百战精锐几乎损失殆尽。",
          characters: [
            { name: "辽军", role: "胜利方", pos: "0", emotion: "得意" }
          ],
          position: "幽州城外，宋军遗弃的辎重堆积如山",
          prompt: "wide shot of the Youzhou battlefield after the battle, Khitan soldiers sorting through massive piles of Song army equipment, imperial banners, bronze drums, silk uniforms, food supplies, in the foreground an abandoned imperial sedan chair with broken wheels, dramatic late afternoon light, documentary war aftermath aesthetic",
          fx: "辎重堆积动画",
          explanation: "此战宋军损失：'近臣多战没，军资器械尽失'。赵光义的御服、宝器、地图全丢，十几万禁军阵亡逃散，是宋朝建国以来最惨重的失败。"
        },
        {
          id: "s27",
          title: "涿州失联",
          startTime: 390, endTime: 405,
          script: "逃回涿州后，赵光义一度与大军失散，下落不明。军中群龙无首，部分将领甚至商议打算拥立宋太祖的儿子赵德昭为皇帝。",
          characters: [
            { name: "赵德昭", role: "太祖之子", pos: "0", emotion: "无辜" },
            { name: "诸将", role: "群臣", pos: "3", emotion: "议立" }
          ],
          position: "涿州城内，将领密议",
          prompt: "dim interior of Zhuozhou city garrison, several Song generals huddled in secret meeting by candlelight, Zhao Dezhao (young prince in white robe) standing at center looking innocent and unaware, conspiratorial atmosphere, warm dim light, cinematic political thriller composition, traditional Chinese setting",
          fx: "密议回响",
          explanation: "此事见于《宋史·太宗本纪》：'军士有欲谋立德昭者'。这是赵光义猜忌武将的根源——他认为武将心向太祖系。"
        },
        {
          id: "s28",
          title: "猜忌之种",
          startTime: 405, endTime: 420,
          script: "赵光义狼狈逃回后，这件事在他心中埋下了对武将深深的猜忌——原来这些人还是向着大哥的。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "阴沉" }
          ],
          position: "驿馆内，独坐昏暗",
          prompt: "extreme close-up of Zhao Guangyi in dim light, paranoid and cold expression, eyes narrowed in suspicion, candle flame reflecting in his eyes, half his face in shadow, no other figures visible, psychological thriller aesthetic, cinematic portrait, traditional Chinese imperial headdress visible",
          fx: "烛火抖动",
          explanation: "此事件直接导致三年后（981年）赵德昭被'逼自杀'。再三年后赵德芳（八贤王原型）也暴卒。赵光义对武猜忌贯穿一朝。"
        }
      ]
    },
    {
      id: "act2",
      title: "第二幕 · 七年的酝酿（979—986年）",
      subtitle: "萧太后与少年天子",
      color: "jade",
      explanation: "高粱河之败后，赵光义卧薪尝胆七年。然而982年辽景宗驾崩，12岁的辽圣宗继位，赵光义误判为北伐良机，殊不知萧太后治下的辽国正走向鼎盛。",
      shots: [
        {
          id: "s29",
          title: "卧薪尝胆",
          startTime: 420, endTime: 435,
          script: "高粱河之战后，赵光义深刻感受到了自己的耻辱。此后的七年，他一直卧薪尝胆，积极整军备战，等待时机一雪前耻。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "隐忍" }
          ],
          position: "皇宫演武场，观看将士操练",
          prompt: "wide shot of imperial training ground, Zhao Guangyi in dragon robe watching soldiers drilling intensely, weapon racks, banners, the emperor's face showing restrained anger, winter light, atmospheric haze, cinematic composition reminiscent of classical Chinese war painting, muted colors with red accents",
          fx: "军鼓阵阵",
          explanation: "七年时间，赵光义做了三件事：扩军（禁军从19万扩至35万）、练阵（创'平戎万全阵'）、储粮（开封府积粮够10年）。准备不可谓不充分。"
        },
        {
          id: "s30",
          title: "辽景宗驾崩",
          startTime: 435, endTime: 450,
          script: "公元982年，辽景宗耶律贤驾崩，年仅十二岁的辽圣宗耶律隆绪继位，三十岁的皇后萧燕燕以太后身份临朝摄政，史称萧太后。",
          characters: [
            { name: "耶律隆绪", role: "辽圣宗", pos: "1", emotion: "稚嫩" },
            { name: "萧燕燕", role: "辽太后", pos: "2", emotion: "威严" }
          ],
          position: "辽上京，少年天子与太后并坐",
          prompt: "interior of Khitan imperial court at supreme capital, twelve-year-old Emperor Yelü Longxu in small imperial robe on the left looking young, Empress Dowager Xiao Yanyan in magnificent phoenix crown on the right with a stern confident expression, both on a golden throne, traditional Khitan and Chinese elements mixed, dramatic low light, cinematic historical drama",
          fx: "龙凤双影",
          explanation: "耶律贤在位13年（969-982），勤政爱民，号'明君'。其子耶律隆绪继位时年幼，政权由其母萧绰（萧燕燕）执掌，承天太后。"
        },
        {
          id: "s31",
          title: "赵光义误判",
          startTime: 450, endTime: 465,
          script: "在赵光义看来，辽朝'主少国疑、母寡子幼'，正是北伐千载难逢的良机。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "窃喜" }
          ],
          position: "皇宫书房，独自审视辽国情报",
          prompt: "close-up of Zhao Guangyi in imperial study, smirk of calculated confidence, an intelligence report on Khitan empire on the desk, candle lighting his face partially, books and scrolls around, expression of someone about to make a critical mistake, cinematic psychological portrait, warm dramatic lighting, dark surrounding",
          fx: "奏章翻开",
          explanation: "赵光义完全误判了萧太后的能力。这位27岁即位的女人后来统治辽国40年，使辽进入鼎盛期，被誉为'辽朝武则天'。"
        },
        {
          id: "s32",
          title: "萧太后整政",
          startTime: 465, endTime: 480,
          script: "与此同时，萧太后迅速整顿朝政，重用韩德让等能臣，整顿军队，短短数年间便稳定了内政，绝非赵光义所想象的那般虚弱不堪。",
          characters: [
            { name: "萧燕燕", role: "辽太后", pos: "0", emotion: "英明" },
            { name: "韩德让", role: "辽丞相", pos: "2", emotion: "忠诚" }
          ],
          position: "辽国朝堂，太后理政",
          prompt: "wide shot of the Liao dynasty court, Empress Dowager Xiao presiding over court in elaborate phoenix robe, ministers reporting to her, documents and edicts on her desk, sense of order and authority, banners with Khitan script, warm golden hall light, cinematic court drama composition, detailed traditional costumes",
          fx: "政务井然",
          explanation: "萧太后推行改革：整顿吏治、重用汉臣、改革赋税、严明军纪。短短数年辽国政治清明，军队战斗力反超宋朝。"
        }
      ]
    },
    {
      id: "act3",
      title: "第三幕 · 雍熙北伐（986年）",
      subtitle: "三路大军与岐沟关之殇",
      color: "vermilion",
      explanation: "雍熙三年（986年），赵光义发动北宋规模最大的北伐，分兵三路：东路曹彬、中路田重进、西路潘美杨业。终因东路冒进，全线崩溃，杨业殉国。",
      shots: [
        {
          id: "s33",
          title: "授以阵图",
          startTime: 480, endTime: 495,
          script: "鉴于高粱河惨败的教训，赵光义这次做了精密部署。他不敢再亲临前线，却发明了'授以阵图、遥控指挥'的作战方式——事先绘制好作战地图、规定好行军路线和布阵方式，千里之外指挥大将如何打仗。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "自负" }
          ],
          position: "开封皇宫，伏案绘制阵图",
          prompt: "Zhao Guangyi in imperial study carefully drawing battle formations on a large scroll, surrounded by multiple smaller strategic maps, ink brush in hand, candles lighting the scene, the atmosphere of someone convinced of their own genius, dim warm lighting, cinematic historical portrait, traditional Chinese painting tools and scrolls visible",
          fx: "阵图徐徐展开",
          explanation: "'阵图'制度是赵光义独创：他将作战方案绘制成图，交给将领执行。曹彬、潘美等大将均受过阵图。事实证明'遥控'极易脱离战场实际。"
        },
        {
          id: "s34",
          title: "三路部署",
          startTime: 495, endTime: 510,
          script: "此次北伐，北宋投入二十万大军，分兵三路北上。东路是主力部队，由开国名将曹彬率领十万精兵出雄州，沿太行山东麓直取幽州；中路田重进出飞狐，牵制辽军中部；西路潘美为帅、杨业为副，出雁门关，攻取山后诸州。",
          characters: [
            { name: "曹彬", role: "东路主帅", pos: "1", emotion: "凝重" },
            { name: "潘美", role: "西路主帅", pos: "2", emotion: "领命" },
            { name: "田重进", role: "中路主帅", pos: "0", emotion: "坚定" },
            { name: "杨业", role: "西路副帅", pos: "3", emotion: "刚毅" }
          ],
          position: "分镜头：四位将领分立四屏风前",
          prompt: "composite of four Song dynasty generals in formal military portrait style: Cao Bin (left top) in golden armor, Pan Mei (right top) in dark armor, Tian Zhongjin (bottom left) in heavy armor, Yang Ye (bottom right) in white battle cloak, each in their own panel separated by silk screens, traditional Chinese four-panel painting style, cinematic and dignified",
          fx: "四将点兵",
          explanation: "曹彬是开国名将，曾灭后蜀、北汉。但其性格谨慎，被赵光义派为东路主力其实并不合适。潘美是演义中'潘仁美'的原型，但历史上他与杨业之死关系复杂。"
        },
        {
          id: "s35",
          title: "会师幽州之策",
          startTime: 510, endTime: 525,
          script: "三路大军最终会师幽州城下，一举收复燕云。这个三路合围的计划堪称宏伟，而且赵光义特意嘱咐曹彬'持重缓行，勿得贪利'，先让中、西两路发力，等辽军主力被牵制后，东路主力再北上一举成功。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "得意" }
          ],
          position: "地图前，三路箭头齐指幽州",
          prompt: "strategic map of northern China, three red arrows pointing toward Youzhou from different directions: east from Xiongzhou, center from Feihu, west from Yanmenguan, imperial planning atmosphere, candlelit map room, Zhao Guangyi's hand visible pointing, classic Chinese strategic planning scene, cinematic warm light, detailed ancient map",
          fx: "三箭齐发",
          explanation: "三路合围是经典钳形攻势：西路取山后诸州、中路取蔚州、东路正面压迫，会师幽州。理论上完美，但执行中东路冒进导致崩盘。"
        },
        {
          id: "s36",
          title: "西路告捷",
          startTime: 525, endTime: 540,
          script: "战事初期，一切按计划顺利推进。中路田重进连克飞狐、蔚州；西路潘美、杨业更是势如破竹，连下寰州、朔州、应州、云州四州。",
          characters: [
            { name: "杨业", role: "西路副帅", pos: "0", emotion: "威武" }
          ],
          position: "云州城外，杨业立马横刀",
          prompt: "epic shot of Yang Ye, the legendary 'Yang Wudi', on horseback at the gates of Yunzhou, having just captured the city, holding a battle spear, white battle cloak flowing, captured Khitan banners on the ground, smoke from city walls, dramatic sunset light, cinematic heroic war portrait, painterly style with realistic details",
          fx: "城池接连陷落",
          explanation: "杨业（杨继业）原为北汉名将，守边28年。北汉降宋后被赵光义收编，是《杨家将》故事的原型。'杨无敌'之号响彻辽国。"
        },
        {
          id: "s37",
          title: "耶律斜轸退避",
          startTime: 540, endTime: 555,
          script: "辽将耶律斜轸面对宋军的凌厉攻势，也不得不暂避锋芒。",
          characters: [
            { name: "耶律斜轸", role: "辽南院大王", pos: "0", emotion: "冷静" }
          ],
          position: "山间小道，辽军战略转进",
          prompt: "Khitan general Yelü Xizhen in dark armor on horseback, observing Song army from a hidden position in the mountains, his army retreating strategically, calculating expression, misty mountain forest, narrow pass, dramatic chiaroscuro, cinematic war general portrait, the look of a shrewd commander",
          fx: "战略转进",
          explanation: "耶律斜轸此时已识破宋军三路合围意图，故意在西路退让，诱使东路曹彬冒进。这是'诱敌深入'的典型应用。"
        },
        {
          id: "s38",
          title: "赵光义得意",
          startTime: 555, endTime: 570,
          script: "各路捷报传回开封，赵光义龙颜大悦，仿佛胜利已近在眼前。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "狂喜" }
          ],
          position: "开封皇宫大殿，帝王居中",
          prompt: "Zhao Guangyi in full imperial dragon robe standing on the throne platform, surrounded by celebrating ministers, holding a captured Khitan banner, joyful confident expression, red lanterns and gold decorations, festive atmosphere, warm imperial palace lighting, cinematic wide shot with classical Chinese painting perspective",
          fx: "龙颜大悦",
          explanation: "赵光义此时在开封遥控指挥，已完全陶醉于'前线捷报'。他没有意识到，东路曹彬的冒进正酝酿巨大危机。"
        },
        {
          id: "s39",
          title: "东路冒进",
          startTime: 570, endTime: 585,
          script: "然而，负责主攻的东路大军却出了问题。名将曹彬率领十万精兵最初也确实进展顺利，迅速攻占固安、新城，兵不血刃拿下涿州。然而进军太快，后勤粮草跟不上，曹彬不得已在涿州逗留十余日，随后又退回雄州就粮。",
          characters: [
            { name: "曹彬", role: "东路主帅", pos: "0", emotion: "焦虑" }
          ],
          position: "涿州城外，宋军大营",
          prompt: "Eastern Route commander Cao Bin in heavy armor standing outside Zhuozhou city, looking worried and hesitant, exhausted soldiers behind him, supply wagons arriving late, dust and hunger, the atmosphere of a stalled army, muted colors with red highlights, cinematic war drama, classical Chinese composition",
          fx: "粮草短缺",
          explanation: "东路是主力，但曹彬性格谨慎，加上皇帝'持重缓行'的诏令，进军速度反而最慢。粮草问题是大军最大的隐患。"
        },
        {
          id: "s40",
          title: "兵家大忌",
          startTime: 585, endTime: 600,
          script: "这一退，兵家最忌讳的大军临阵后退，不但挫伤了锐气，更让辽军看清了宋军的虚实。赵光义得知后大怒，立即派人制止，命曹彬停止撤退、稳住阵线。",
          characters: [
            { name: "曹彬", role: "东路主帅", pos: "1", emotion: "惶恐" },
            { name: "传旨太监", role: "信使", pos: "2", emotion: "严肃" }
          ],
          position: "营帐中，曹彬接旨",
          prompt: "interior of a Song military tent, Cao Bin kneeling in heavy armor receiving an imperial edict from a eunuch messenger, imperial seal in the messenger's hand, Cao Bin's face showing fear and regret, the tent dimly lit by single candle, dramatic shadows, cinematic war political scene, traditional Chinese setting with detailed period costumes",
          fx: "圣旨展开",
          explanation: "《孙子兵法》：'勇者不得独进，怯者不得独退'。大军临阵后退是兵家大忌。曹彬的撤退暴露了宋军弱点。"
        },
        {
          id: "s41",
          title: "将校争功",
          startTime: 600, endTime: 615,
          script: "更糟糕的是，东路军内部也出了问题。看着中、西两路捷报频传，东路将士们争功心切，主帅曹彬根本无法压制部下的冒进情绪。",
          characters: [
            { name: "曹彬", role: "主帅", pos: "0", emotion: "无奈" },
            { name: "东路将校", role: "群像", pos: "3", emotion: "浮躁" }
          ],
          position: "营帐中，众将争执",
          prompt: "interior of Eastern Route army camp tent, several Song generals in heated argument around Cao Bin, some pointing north, banners and maps on walls, the atmosphere of mutiny and indiscipline, smoky torchlight, dramatic shadows, cinematic war drama, chaotic but realistic composition",
          fx: "众议汹汹",
          explanation: "东路军是主力却进展最慢，将校们觉得'丢人'，争相要求主动进攻。曹彬镇不住部下，这暴露了宋军将帅关系的深层问题。"
        },
        {
          id: "s42",
          title: "五日军粮",
          startTime: 615, endTime: 630,
          script: "众议汹汹之下，曹彬只得违背太宗'持重缓行'的旨意，携带仅够五天的军粮，再次向涿州冒进。",
          characters: [
            { name: "曹彬", role: "主帅", pos: "0", emotion: "决然" }
          ],
          position: "帅帐中，发布军令",
          prompt: "Cao Bin in heavy armor issuing rapid orders in the command tent, maps and documents on the table, five-day ration bags visible nearby, the atmosphere of forced and dangerous haste, smoke and torchlight, dramatic moment of bad decision, cinematic war drama, painterly realism",
          fx: "军令如山",
          explanation: "五日军粮即意味着五天决战。曹彬这一决定违背了皇帝'缓行'的圣旨，也违背了'兵马未动，粮草先行'的古训。"
        },
        {
          id: "s43",
          title: "盛夏行军",
          startTime: 630, endTime: 645,
          script: "宋军顶着盛夏酷暑披甲行军，用了四天才到达涿州，早已疲惫不堪。",
          characters: [
            { name: "宋军", role: "东路军", pos: "0", emotion: "疲惫" }
          ],
          position: "盛夏官道，宋军艰难行进",
          prompt: "exhausted Song soldiers in heavy armor marching under the brutal summer sun, sweat pouring, some collapsing, dust rising, long column stretching to the horizon, four days of march showing on their faces, oppressive heat haze, cinematic war documentary style, brown and orange tones, dramatic low angle",
          fx: "烈日炎炎",
          explanation: "979年5月北汉降，986年正月北伐，宋军5月又到涿州。时值盛夏，披甲行军本就极易中暑脱水，战斗力大打折扣。"
        },
        {
          id: "s44",
          title: "空城计",
          startTime: 645, endTime: 660,
          script: "而此时，涿州已是一座空城——辽国名将耶律休哥早就命人烧光城中粮草，切断宋军补给线，以逸待劳。",
          characters: [
            { name: "耶律休哥", role: "辽北院大王", pos: "0", emotion: "从容" }
          ],
          position: "涿州城外，远眺宋军入城",
          prompt: "Yelü Xiuge on horseback on a hilltop overlooking Zhuozhou city which is now an empty smoking ruin, Song army entering the empty city looking confused, smoke rising from the city, the Khitan general looking satisfied and calculating, wide cinematic landscape, dusk light, classical Chinese strategy composition",
          fx: "空城烟火",
          explanation: "耶律休哥实施'坚壁清野'：烧光涿州粮草，让宋军入城后无粮可用。这是他在与宋军多次交手中总结的制胜法宝。"
        },
        {
          id: "s45",
          title: "萧太后亲征",
          startTime: 660, endTime: 675,
          script: "萧太后更是亲自率领主力赶到，与耶律休哥合兵一处。",
          characters: [
            { name: "萧燕燕", role: "辽太后", pos: "0", emotion: "英姿飒爽" },
            { name: "耶律休哥", role: "辽将", pos: "2", emotion: "敬仰" }
          ],
          position: "辽军主营，萧太后与诸将议事",
          prompt: "Empress Dowager Xiao Yanyan in military attire riding a black warhorse at the head of a massive Khitan army, Yelü Xiuge bowing on horseback beside her, banners and war drums everywhere, the atmosphere of a powerful matriarchal general, dramatic wide shot, golden afternoon light, cinematic epic war film scale",
          fx: "凤旗飘扬",
          explanation: "萧太后是中国历史上少数亲征的太后之一。她深谙军事，与耶律休哥、韩德让配合，缔造了辽国军事巅峰。"
        },
        {
          id: "s46",
          title: "岐沟关大败",
          startTime: 675, endTime: 690,
          script: "面对辽军主力的合围，曹彬彻底丧失了作战的勇气。他下令全军南撤。耶律休哥等的就是这个时机，率领精锐骑兵在岐沟关追上宋军并发起总攻，排山倒海般杀来。",
          characters: [
            { name: "曹彬", role: "东路主帅", pos: "1", emotion: "溃逃" },
            { name: "耶律休哥", role: "辽将", pos: "2", emotion: "追击" }
          ],
          position: "岐沟关战场，宋军溃败",
          prompt: "Qigouguan battlefield, Song army in full retreat, Khitan cavalry charging from behind with weapons raised, dust and chaos everywhere, the iconic scene of the decisive defeat, abandoned Song supply wagons, broken weapons, dramatic sunset light, cinematic war epic disaster scale, dark and red tones, painterly composition",
          fx: "排山倒海",
          explanation: "岐沟关在今河北涿州西南，是宋军南撤必经之地。耶律休哥在此截杀，是宋军有史以来最惨重的野战失败之一。"
        },
        {
          id: "s47",
          title: "沙河不流",
          startTime: 690, endTime: 705,
          script: "曹彬下令以战车结阵抵抗，但宋军早已军心涣散，根本无力抵挡。在得知粮道再次被断后，士兵们无心作战，四散奔逃。身为三军统帅的曹彬竟丢弃大军，与米信连夜逃走，十万宋军彻底溃散。",
          characters: [
            { name: "曹彬", role: "主帅", pos: "0", emotion: "惊恐" },
            { name: "米信", role: "副将", pos: "2", emotion: "狼狈" }
          ],
          position: "夜色中，曹彬弃军而逃",
          prompt: "night scene, two Song generals Cao Bin and Mi Xin on horseback fleeing at full gallop through a dark forest, abandoning their army, the dark silhouettes of the two men, sense of betrayal and cowardice, moonlight through the trees, cinematic thriller composition, dark muted colors with hints of red",
          fx: "主帅遁逃",
          explanation: "曹彬是北宋开国名将，'曹彬克蜀'曾有'不妄杀人'之美名。但岐沟关之败是其一生最大污点，弃军而逃是死罪。"
        },
        {
          id: "s48",
          title: "血染沙河",
          startTime: 705, endTime: 720,
          script: "'宋师望尘奔窜，堕岸相踩死者过半，沙河为之不流'——鲜血染红了整条沙河。",
          characters: [
            { name: "宋军溃兵", role: "群像", pos: "0", emotion: "绝望" }
          ],
          position: "沙河岸边，尸体堆积",
          prompt: "Shahe river running red with blood, the banks piled with Song army dead and dying, soldiers and horses, abandoned weapons, the cruel aftermath of a great defeat, dramatic wide shot from the river bank, crimson water reflecting sunset, painterly Chinese war painting composition, emotionally devastating, cinematic and graphic",
          fx: "血色沙河",
          explanation: "《宋史》记载：'沙河为之不流'。这是何等惨烈！十万宋军能逃回开封者不足数万。这是宋朝建国以来最惨重的野战失败。"
        },
        {
          id: "s49",
          title: "全线撤退",
          startTime: 720, endTime: 735,
          script: "岐沟关的惨败彻底葬送了整个北伐。辽军乘胜追击，其他两路宋军失去了东路主力的掩护，被迫全线撤退。赵光义不得不紧急下令三路大军全部撤回，雍熙北伐宣告失败。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "绝望" }
          ],
          position: "开封皇宫，帝王瘫坐龙椅",
          prompt: "Zhao Guangyi collapsed on the dragon throne in Kaifeng palace, head in hands, surrounded by frantic ministers and discarded battle reports, the weight of total defeat on his shoulders, dim throne room lighting, single beam of light from the side, cinematic dramatic moment of political disaster, traditional Chinese imperial setting",
          fx: "全线溃退",
          explanation: "东路崩溃后，中路田重进和西路潘美杨业失去掩护，辽军可集中兵力各个击破。赵光义被迫下令全线撤退，雍熙北伐彻底失败。"
        },
        {
          id: "s50",
          title: "杨业之死",
          startTime: 735, endTime: 750,
          script: "然而，最惨烈的悲剧发生在西路军撤退途中。宋太宗下令西路军护送归附的百姓内迁。面对数倍于己的辽军追兵，副帅杨业提出避敌锋芒的稳妥方案，却遭到监军王侁的冷嘲热讽：'将军号称杨无敌，如今看到敌军却逡巡不前，难道你另有打算吗？'",
          characters: [
            { name: "杨业", role: "西路副帅", pos: "1", emotion: "悲愤" },
            { name: "王侁", role: "监军", pos: "2", emotion: "刁难" }
          ],
          position: "营帐中，杨业受辱",
          prompt: "Yang Ye in white battle cloak confronting the imperial supervisor Wang Shen in the camp, Wang Shen pointing accusingly at Yang Ye, the atmosphere of cruel political pressure, Yang Ye's face showing humiliation and restraint, dramatic torchlight, cinematic war drama, traditional Chinese military setting, emotionally charged moment",
          fx: "冷嘲热讽",
          explanation: "王侁是监军，代表皇帝监视将领。他讽刺杨业'逡巡不前'，实际是威胁杨业'不战就是通敌'。杨业是北汉降将，最怕被怀疑不忠。"
        },
        {
          id: "s51",
          title: "陈家谷口空",
          startTime: 750, endTime: 765,
          script: "杨业本为北汉降将，深知自己身份敏感，无法辩驳，只能含泪率军出战。他在临行前恳求主帅潘美在陈家谷口设伏接应，潘美答应了。杨业率部与辽军血战终日，拼死杀出一条血路，且战且退至陈家谷口。当他浑身浴血地赶到时，却发现潘美和王侁早已率军撤退——谷口空无一人。孤立无援的杨业身受数十处创伤，麾下将士全部战死。杨业的儿子杨延玉也力战而死。最终杨业力竭被俘，绝食三日而死。",
          characters: [
            { name: "杨业", role: "殉国", pos: "0", emotion: "绝望" },
            { name: "潘美", role: "主帅", pos: "2", emotion: "退缩" },
            { name: "杨延玉", role: "杨业之子", pos: "1", emotion: "战死" }
          ],
          position: "陈家谷口空地，杨业独立",
          prompt: "Chenjia Valley entrance, an empty ambush position with no Song army in sight, Yang Ye arriving blood-soaked and wounded, finding nothing but cold silence, his dead son Yang Yanyu at his feet, snow falling, dramatic wintry scene, a tragic hero betrayed by his own side, cinematic tragic war drama, painterly Chinese aesthetic, emotionally devastating",
          fx: "大雪纷飞",
          explanation: "陈家谷口在今山西朔州。潘美在杨业苦战后提前撤军，是历史公案。'杨业之死'是《杨家将》最悲壮的原型，潘美因此背负千年骂名。"
        }
      ]
    },
    {
      id: "epilogue",
      title: "【史诗落幕：北伐之后的北宋】",
      subtitle: "澶渊之盟与百年之憾",
      color: "gold",
      explanation: "雍熙北伐失败后，宋朝彻底放弃收复燕云。18年后（1004年），辽国南下达澶州，签订澶渊之盟，宋朝承认无法收复燕云。这一遗憾直到400年后的明太祖朱元璋手中才得偿。",
      shots: [
        {
          id: "s52",
          title: "澶渊之盟",
          startTime: 765, endTime: 780,
          script: "宋太宗的两次北伐，留给历史的，是'高粱河车神'的千年笑谈和'杨令公血染李陵碑'的千古悲歌。",
          characters: [
            { name: "赵光义", role: "宋太宗", pos: "0", emotion: "寂寥" }
          ],
          position: "开封皇宫，落日余晖",
          prompt: "final cinematic wide shot, Zhao Guangyi old and weary in imperial robe standing on the palace balcony overlooking the city of Kaifeng at sunset, the last light of day painting everything gold and red, the weight of unfulfilled ambitions, deep atmospheric perspective, traditional Chinese painting meets cinematic film, melancholic and reflective mood",
          fx: "落日余晖",
          explanation: "李陵碑是《杨家将》戏曲中杨业碰碑殉国之处，虽是文学创作，但历史原型确为陈家谷口之败。'高粱河车神'和'血染李陵碑'成为宋太宗时代的双重烙印。"
        }
      ]
    }
  ],

  // 角色设计
  characters: [
    {
      id: "zhaogy",
      name: "赵光义",
      role: "宋太宗",
      desc: "赵匡胤之弟，宋朝第二位皇帝。雄心勃勃但军事才能平庸。高粱河之战中箭乘驴车而逃，获'车神'之号。",
      color: "#b03a2e",
      pixel: [
        "....YYYY....",
        "...YCCCCY...",
        "..YCCCCCCY..",
        "..YCRRRRCY..",
        "..YCFRRRCY..",
        "..YCCCCCCY..",
        "...YFFFFY...",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..GG....GG..",
        "..GG....GG..",
        ".YYY....YYY."
      ],
      colors: { Y: "#b8860b", C: "#f4d03f", R: "#fadbd8", F: "#fadbd8", B: "#5d4037", S: "#b03a2e", G: "#3e2723" }
    },
    {
      id: "shijt",
      name: "石敬瑭",
      role: "后晋高祖",
      desc: "五代后晋开国皇帝，为称帝割让燕云十六州，认辽帝为父，被后世视为最耻辱的'儿皇帝'。",
      color: "#8b6f47",
      pixel: [
        "....YYYY....",
        "...YCCCCY...",
        "..YCCCCCCY..",
        "..YRRRRRRY..",
        "..YRRRRRRY..",
        "..YCCCCCCY..",
        "...YSSSSY...",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..GG....GG..",
        "..GG....GG..",
        ".YYY....YYY."
      ],
      colors: { Y: "#8b6f47", C: "#d4a373", R: "#fadbd8", S: "#8b6f47", B: "#5d4037", G: "#3e2723" }
    },
    {
      id: "yelvdg",
      name: "耶律德光",
      role: "辽太宗",
      desc: "契丹第二位皇帝，石敬瑭之'父皇帝'。得燕云十六州，从此契丹据有北方屏障。",
      color: "#3e2723",
      pixel: [
        "....KKKK....",
        "...KCCCCK...",
        "..KCCCCCCK..",
        "..KFRRFRCK..",
        "..KFRRRRCK..",
        "..KCCCCCCK..",
        "...KFFFFK...",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..GG....GG..",
        "..GG....GG..",
        ".YYY....YYY."
      ],
      colors: { Y: "#3e2723", K: "#1a1a1a", C: "#3e2723", R: "#fadbd8", F: "#fadbd8", B: "#3e2723", S: "#5d4037", G: "#3e2723" }
    },
    {
      id: "yeluxg",
      name: "耶律休哥",
      role: "辽北院大王",
      desc: "辽国第一名将，一生与宋作战，鲜有败绩。高粱河、岐沟关两胜赵光义，被宋人视为头号克星。",
      color: "#2c7873",
      pixel: [
        "....KKKK....",
        "...KCCCCK...",
        "..KCCCCCCK..",
        "..KCRRRRCK..",
        "..KCFRRRCK..",
        "..KCCCCCCK..",
        "...KFFFFK...",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..GG....GG..",
        "..GG....GG..",
        ".KKK....KKK."
      ],
      colors: { Y: "#2c7873", K: "#1a3a3a", C: "#3a8a85", R: "#fadbd8", F: "#fadbd8", B: "#3e2723", S: "#2c7873", G: "#3e2723" }
    },
    {
      id: "yangye",
      name: "杨业",
      role: "北宋西路副帅",
      desc: "原北汉名将，号称'杨无敌'。雍熙北伐中受监军逼迫，孤立无援战败被俘，绝食殉国，是《杨家将》原型。",
      color: "#d4a373",
      pixel: [
        "....WWWW....",
        "...WCCCCW...",
        "..WCCCCCCW..",
        "..WCRRRRCW..",
        "..WCFRRRCW..",
        "..WCCCCCCW..",
        "...WFFFFW...",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..GG....GG..",
        "..GG....GG..",
        ".WWW....WWW."
      ],
      colors: { Y: "#d4a373", W: "#f5f5f5", C: "#f4d03f", R: "#fadbd8", F: "#fadbd8", B: "#5d4037", S: "#8b1a1a", G: "#3e2723" }
    },
    {
      id: "caobin",
      name: "曹彬",
      role: "北宋东路主帅",
      desc: "开国名将，曾以仁义灭后蜀。雍熙北伐中东路主力冒进被击溃，弃军而逃，岐沟关十万大军覆没。",
      color: "#1a3a5c",
      pixel: [
        "....BBBB....",
        "...BCCCCB...",
        "..BCCCCCCB..",
        "..BCRRRRCB..",
        "..BCFRRRCB..",
        "..BCCCCCCB..",
        "...BFFFFB...",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..GG....GG..",
        "..GG....GG..",
        ".BBB....BBB."
      ],
      colors: { Y: "#1a3a5c", B: "#1a3a5c", C: "#3a5a8c", R: "#fadbd8", F: "#fadbd8", S: "#1a3a5c", G: "#3e2723" }
    },
    {
      id: "panmei",
      name: "潘美",
      role: "北宋西路主帅",
      desc: "开国功臣，灭南汉、北汉主将。雍熙北伐中未能在陈家谷口接应杨业，被后世视为杨业之死的元凶之一。",
      color: "#5d4e8c",
      pixel: [
        "....PPPP....",
        "...PCCCCP...",
        "..PCCCCCCP..",
        "..PCRRRRCP..",
        "..PCFRRRCP..",
        "..PCCCCCCP..",
        "...PFFFFP...",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..GG....GG..",
        "..GG....GG..",
        ".PPP....PPP."
      ],
      colors: { Y: "#5d4e8c", P: "#5d4e8c", C: "#7d6e9c", R: "#fadbd8", F: "#fadbd8", B: "#3e2723", S: "#5d4e8c", G: "#3e2723" }
    },
    {
      id: "han",
      name: "韩德让",
      role: "辽南京留守",
      desc: "辽国汉臣第一，与萧太后情深，守幽州有功。后官至大丞相，被赐国姓耶律。",
      color: "#2c5f2d",
      pixel: [
        "....HHHH....",
        "...HCCCCH...",
        "..HCCCCCH..",
        "..HCRRRRCH..",
        "..HCFRRRCH..",
        "..HCCCCCH..",
        "...HFFFFH...",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..GG....GG..",
        "..GG....GG..",
        ".HHH....HHH."
      ],
      colors: { Y: "#2c5f2d", H: "#2c5f2d", C: "#5d8a5d", R: "#fadbd8", F: "#fadbd8", B: "#3e2723", S: "#2c5f2d", G: "#3e2723" }
    },
    {
      id: "xiaoyy",
      name: "萧燕燕",
      role: "辽承天太后",
      desc: "辽景宗皇后、圣宗母。27岁摄政，统治辽国40年，使辽进入鼎盛，亲征澶州缔结澶渊之盟。",
      color: "#8b1a1a",
      pixel: [
        "....RRRR....",
        "...RCCCCR...",
        "..RCCCCCCR..",
        "..RCRRRRCR..",
        "..RCFRRRCR..",
        "..RCCCCCCR..",
        "...RFFFFR...",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..GG....GG..",
        "..GG....GG..",
        ".RRR....RRR."
      ],
      colors: { Y: "#8b1a1a", R: "#8b1a1a", C: "#c0392b", R2: "#fadbd8", F: "#fadbd8", B: "#3e2723", S: "#8b1a1a", G: "#3e2723" }
    },
    {
      id: "songjzy",
      name: "宋军群像",
      role: "北宋禁军",
      desc: "赵光义麾下十余万禁军，主力两次北伐损失殆尽。百战精锐，披重甲，战斗力不俗但机动性差。",
      color: "#3a5a8c",
      pixel: [
        "....BBBB....",
        "...BCCCCB...",
        "..BCCCCCB..",
        "..BCRRRCB..",
        "..BCFRRCB..",
        "..BCCCCCB..",
        "...BFFFFB...",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..BSSSSB....",
        "..GG....GG..",
        "..GG....GG..",
        ".BBB....BBB."
      ],
      colors: { Y: "#3a5a8c", B: "#3a5a8c", C: "#5a7aac", R: "#fadbd8", F: "#fadbd8", S: "#1a3a5c", G: "#3e2723" }
    }
  ],

  // 特殊效果
  effects: [
    { id: "candle", name: "烛火摇曳", desc: "古风场景中常见的暖光烛火，营造历史氛围。", html: "candle" },
    { id: "dust", name: "黄沙漫天", desc: "战场行军、骑兵冲锋时扬起的尘烟效果。", html: "dust" },
    { id: "arrow", name: "万箭齐发", desc: "攻城战、伏击战的箭雨特效。", html: "arrow" },
    { id: "fire", name: "战火焚城", desc: "城池陷落、烽火连天的火焰效果。", html: "fire" },
    { id: "blood", name: "血染沙河", desc: "战败后尸横遍野、血流漂杵的惨烈效果。", html: "blood" },
    { id: "snow", name: "大雪纷飞", desc: "英雄末路、悲剧场景的雪景效果。", html: "snow" },
    { id: "imperial", name: "帝王金辉", desc: "帝王登场、龙袍生辉的金色光效。", html: "imperial" },
    { id: "donkey", name: "驴车飞驰", desc: "高粱河之战赵光义驴车逃命的喜剧效果。", html: "donkey" }
  ]
};

// 暴露到全局
window.SCRIPT_DATA = SCRIPT_DATA;
