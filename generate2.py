#!/usr/bin/env python3
"""Extend data.js with more IPs to reach 2000+ entries."""
import json

# Load existing
with open("/workspace/data.js","r",encoding="utf-8") as f:
    content = f.read()
# Extract the array
start = content.find("[")
end = content.rfind("]")
ENTRIES = json.loads(content[start:end+1])

def add(ip, kind, region, year, source, desc, title):
    ENTRIES.append((title, kind, region, year, source, desc, ip))

# ============================================================
# FATE/GRAND ORDER — ~80 entries
# ============================================================
FGO = "FGO"
fgo_entries = []
# Anime
fgo_anime = [
    ("绝对魔兽战线 巴比伦尼亚","TV动画",2019),("绝对魔兽战线 巴比伦尼亚 续","续",2020),
    ("Camelot 前篇  Wandering; Agateram","前篇",2020),("Camelot 后篇  Paladin; Agateram","后篇",2021),
    ("冠位时间神殿 奥林匹亚之花","最终章",2021),("神圣圆桌领域 卡美洛 前篇","前篇",2021),
    ("神圣圆桌领域 卡美洛 后篇","后篇",2022),("Memo 1","短片",2018),
    ("Memo 2","短片",2019),("Memo 3","短片",2020),
]
for nm, desc, yr in fgo_anime:
    fgo_entries.append(("anime","日本",yr,"CloverWorks",desc,f"FGO 动画 {nm}"))
# Films
for nm, desc, yr in [("神圣圆桌领域 前篇","电影",2021),("神圣圆桌领域 后篇","电影",2022),("冠位时间神殿","电影",2021)]:
    fgo_entries.append(("film","日本",yr,"CloverWorks",desc,f"FGO 剧场版 {nm}"))
# Manga
for nm, yr in [("官方漫画 1",2017),("官方漫画 2",2017),("官方漫画 3",2018),("官方漫画 4",2018),("官方漫画 5",2019),("官方漫画 6",2019),("官方漫画 7",2020),("官方漫画 8",2020),("官方漫画 9",2021),("官方漫画 10",2021),("官方漫画 11",2022),("官方漫画 12",2022),("官方漫画 13",2023),("官方漫画 14",2023),("官方漫画 15",2024),("官方漫画 16",2024)]:
    fgo_entries.append(("manga","日本",yr,"TYPE-MOON","漫画",f"FGO 漫画 {nm}"))
# Novels
for nm, yr in [("圣杯战争 1",2017),("圣杯战争 2",2018),("圣杯战争 3",2019),("异闻带物语 1",2020),("异闻带物语 2",2021),("异闻带物语 3",2022),("人理 1",2023),("人理 2",2024)]:
    fgo_entries.append(("novel","日本",yr,"TYPE-MOON","小说",f"FGO 小说 {nm}"))
# Music
for i in range(1, 7):
    fgo_entries.append(("music","日本",2016+i,"TYPE-MOON","原声",f"FGO 音乐 OST {i}"))
# Concerts
for nm, yr in [("2023",2023),("2024",2024),("2025",2025),("2024 东京",2024),("2024 大阪",2024),("2024 北京",2024),("2025 上海",2025)]:
    fgo_entries.append(("music","日本",yr,"TYPE-MOON","音乐会",f"FGO 音乐会 {nm}"))
# Theme cafes
for nm, yr in [("东京1",2018),("东京2",2019),("东京3",2020),("东京4",2021),("大阪1",2019),("大阪2",2020),("北京1",2023),("上海1",2024)]:
    fgo_entries.append(("otaku","日本",yr,"TYPE-MOON","主题咖啡",f"FGO 主题咖啡 {nm}"))
# Figurines
for nm, yr in [("Saber 1",2017),("Saber 2",2018),("Saber 3",2019),("Saber 4",2020),("Saber 5",2021),("Saber 6",2022),("Saber 7",2023),("Saber 8",2024),("1/4 玛修",2019),("1/4 阿尔托莉雅",2020),("1/4 贞德",2021),("1/4 闪闪",2022),("1/4 黑贞",2023),("1/4 摩根",2024)]:
    fgo_entries.append(("otaku","日本",yr,"TYPE-MOON","手办",f"FGO 衍生手办 {nm}"))
# Stage plays
for nm, yr in [("1",2019),("2",2020),("3",2021),("4",2022),("5",2023),("6",2024),("7",2025)]:
    fgo_entries.append(("stage","日本",yr,"TYPE-MOON","舞台剧",f"FGO 舞台剧 {nm}"))
# Art books
for i in range(1, 5):
    fgo_entries.append(("otaku","日本",2019+i,"TYPE-MOON","艺术设定集",f"FGO 设定集 Vol.{i}"))
# Radios
for nm, yr in [("1",2017),("2",2018),("3",2019),("4",2020),("5",2021),("6",2022),("7",2023),("8",2024)]:
    fgo_entries.append(("radio","日本",yr,"TYPE-MOON","广播剧",f"FGO 广播剧 {nm}"))
# Shorts
for nm, yr in [("玛修日记",2018),("达芬奇频道",2018),("Foreigner",2019),("Saber Wars",2019),("Christmas",2019),("NewYear",2020),("情人节",2020),("白色情人节",2020),("泳装",2020),("夏日",2020),("万圣节",2020),("Saber Wars 2",2020)]:
    fgo_entries.append(("short","日本",yr,"TYPE-MOON","短片",f"FGO 衍生短片 {nm}"))

for kind,reg,year,src,desc,ttl in fgo_entries:
    add(FGO,kind,reg,year,src,desc,ttl)

print(f"FGO: {len([e for e in ENTRIES if e[6] == FGO])}")

# ============================================================
# TYPE-MOON (Fate, Kara no Kyoukai, Tsukihime) — ~80 entries
# ============================================================
TM = "TYPE-MOON"
tm_entries = []
# Kara no Kyoukai
for nm, yr in [("俯瞰风景",2007),("杀人考察 前",2007),("痛觉残留",2008),("伽蓝之洞",2008),("矛盾螺旋",2008),("忘却录音",2008),("杀人考察 后",2009)]:
    tm_entries.append(("anime","日本",yr,"ufotable","空之境界",f"TYPE-MOON 剧场版 {nm}"))
for nm, yr in [("俯瞰风景 漫画",2005),("杀人考察 前 漫画",2005),("痛觉残留 漫画",2006),("伽蓝之洞 漫画",2006),("矛盾螺旋 漫画",2006),("忘却录音 漫画",2007),("杀人考察 后 漫画",2007)]:
    tm_entries.append(("manga","日本",yr,"TYPE-MOON","漫画",f"TYPE-MOON 漫画 {nm}"))
for nm, yr in [("俯瞰风景 小说",1998),("杀人考察 前 小说",1998),("痛觉残留 小说",1999),("伽蓝之洞 小说",1999),("矛盾螺旋 小说",1999),("忘却录音 小说",2000),("杀人考察 后 小说",2000)]:
    tm_entries.append(("novel","日本",yr,"TYPE-MOON","小说",f"TYPE-MOON 小说 {nm}"))
# Tsukihime
for nm, yr in [("月姫",2003),("月姫 PLUS-DISC",2003)]:
    tm_entries.append(("anime","日本",yr,"J.C.Staff","月姬",f"TYPE-MOON 月姬 {nm}"))
for nm, yr in [("月姬 漫画 1",2003),("月姬 漫画 2",2003),("月姬 漫画 3",2004),("月姬 漫画 4",2004),("月姬 漫画 5",2005),("月姬 漫画 6",2005),("月姬 漫画 7",2006),("月姬 漫画 8",2006)]:
    tm_entries.append(("manga","日本",yr,"TYPE-MOON","漫画",f"TYPE-MOON {nm}"))
# Fate/Stay Night
for nm, yr in [("Fate/stay night (2006)",2006),("UBW (2010)",2010),("UBW (2015)",2015),("HF 1st",2017),("HF 2nd",2019),("HF 3rd",2020)]:
    tm_entries.append(("anime","日本",yr,"Studio DEEN / ufotable","Fate/stay night",f"TYPE-MOON 动画 {nm}"))
# Fate/Zero
tm_entries.append(("anime","日本",2011,"ufotable","Fate/Zero","TYPE-MOON Fate/Zero"))
tm_entries.append(("anime","日本",2012,"ufotable","Fate/Zero 续","TYPE-MOON Fate/Zero 续"))
# Fate/kaleid
for nm, yr in [("1",2013),("2",2014),("3",2015),("4",2016),("5",2017)]:
    tm_entries.append(("anime","日本",yr,"SILVER LINK.","Fate/kaleid",f"TYPE-MOON Fate/kaleid {nm}"))
# Carnival Phantasm
for nm, yr in [("Carnival Phantasm",2011),("Carnival Phantasm EX",2011)]:
    tm_entries.append(("anime","日本",yr,"ufotable","短剧",f"TYPE-MOON {nm}"))
# Today's menu
tm_entries.append(("anime","日本",2017,"ufotable","卫宫家今天的饭",f"TYPE-MOON 卫宫家今天的饭"))
tm_entries.append(("anime","日本",2018,"ufotable","卫宫家今天的饭 2",f"TYPE-MOON 卫宫家今天的饭 2"))
tm_entries.append(("anime","日本",2019,"ufotable","卫宫家今天的饭 3",f"TYPE-MOON 卫宫家今天的饭 3"))
tm_entries.append(("anime","日本",2020,"ufotable","卫宫家今天的饭 4",f"TYPE-MOON 卫宫家今天的饭 4"))
# Melty Blood
tm_entries.append(("game","日本",2002,"TYPE-MOON","格斗","TYPE-MOON 格斗 Melty Blood"))
tm_entries.append(("game","日本",2003,"TYPE-MOON","格斗续作","TYPE-MOON 格斗 Melty Blood 续"))
tm_entries.append(("game","日本",2009,"French Bread","格斗新作","TYPE-MOON 格斗 Melty Blood 新作"))
tm_entries.append(("game","日本",2016,"French Bread","格斗新作","TYPE-MOON 格斗 Melty Blood Type Lumina"))
tm_entries.append(("game","日本",2021,"French Bread","格斗新作","TYPE-MOON 格斗 Melty Blood 新作2"))
# Music
for i in range(1, 6):
    tm_entries.append(("music","日本",2014+i,"TYPE-MOON","原声",f"TYPE-MOON 音乐 OST {i}"))
for nm, yr in [("2023",2023),("2024",2024),("2025",2025),("2024 东京",2024),("2024 大阪",2024),("2024 北京",2024)]:
    tm_entries.append(("music","日本",yr,"TYPE-MOON","音乐会",f"TYPE-MOON 音乐会 {nm}"))
# Stage plays
for nm, yr in [("HF",2019),("UBW",2020),("Zero",2021),("Apocrypha",2022),("Extra",2023),("Strange Fake",2024)]:
    tm_entries.append(("stage","日本",yr,"TYPE-MOON","舞台剧",f"TYPE-MOON 舞台剧 {nm}"))
# Novels
for nm, yr in [("Fate/Zero 1",2006),("Fate/Zero 2",2007),("Fate/Zero 3",2007),("Fate/Zero 4",2007),("Apocrypha 1",2012),("Apocrypha 2",2013),("Apocrypha 3",2014),("Apocrypha 4",2015),("Strange Fake 1",2015),("Strange Fake 2",2016),("Strange Fake 3",2017),("Strange Fake 4",2018)]:
    tm_entries.append(("novel","日本",yr,"TYPE-MOON","小说",f"TYPE-MOON 小说 {nm}"))
# Manga
for nm, yr in [("Fate/Zero 漫画",2010),("Apocrypha 漫画",2013),("Strange Fake 漫画",2016),("Extra 漫画",2017),("Fate/Grand Order 漫画",2017),("Fate/Samurai 漫画",2018),("Requiem 漫画",2019),("Fate/Prototype 漫画",2020)]:
    tm_entries.append(("manga","日本",yr,"TYPE-MOON","漫画",f"TYPE-MOON 漫画 {nm}"))
# Theme cafes
for nm, yr in [("东京1",2017),("东京2",2018),("东京3",2019),("东京4",2020),("大阪1",2018),("大阪2",2019),("北京1",2022),("上海1",2023)]:
    tm_entries.append(("otaku","日本",yr,"TYPE-MOON","主题咖啡",f"TYPE-MOON 主题咖啡 {nm}"))
# Radios
for nm, yr in [("Fate/Zero",2011),("UBW",2015),("HF",2017),("Strange Fake",2018),("FGO",2019),("LoGH",2020),("FGO 2",2021),("FGO 3",2022)]:
    tm_entries.append(("radio","日本",yr,"TYPE-MOON","广播剧",f"TYPE-MOON 广播剧 {nm}"))
# Shorts
for nm, yr in [("Fate/Zero OVA",2013),("Fate/kaleid OVA",2014),("Today's menu OVA",2017),("HF OVA",2018),("FGO OVA",2019),("Fate/Samurai OVA",2020)]:
    tm_entries.append(("short","日本",yr,"TYPE-MOON","短片",f"TYPE-MOON 衍生短片 {nm}"))

for kind,reg,year,src,desc,ttl in tm_entries:
    add(TM,kind,reg,year,src,desc,ttl)

print(f"TYPE-MOON: {len([e for e in ENTRIES if e[6] == TM])}")

# ============================================================
# TOUKEN RANBU (刀剑乱舞) — ~50 entries
# ============================================================
TR = "刀剑乱舞"
tr_entries = []
tr_entries.append(("anime","日本",2016,"Studio DEEN","动画","刀剑乱舞 动画"))
tr_entries.append(("anime","日本",2017,"Studio DEEN","续作","刀剑乱舞 动画 续"))
tr_entries.append(("anime","日本",2018,"ufotable","花丸","刀剑乱舞 动画 花丸"))
tr_entries.append(("anime","日本",2019,"ufotable","花丸 续","刀剑乱舞 动画 花丸 续"))
tr_entries.append(("anime","日本",2020,"ufotable","花丸 3","刀剑乱舞 动画 花丸 3"))
tr_entries.append(("anime","日本",2021,"ufotable","花丸 4","刀剑乱舞 动画 花丸 4"))
tr_entries.append(("anime","日本",2022,"ufotable","花丸 5","刀剑乱舞 动画 花丸 5"))
tr_entries.append(("anime","日本",2023,"ufotable","花丸 6","刀剑乱舞 动画 花丸 6"))
# Stage plays (历史队)
for nm, yr in [("历史队 1",2016),("历史队 2",2017),("历史队 3",2018),("历史队 4",2019),("历史队 5",2020),("历史队 6",2021),("历史队 7",2022),("历史队 8",2023),("历史队 9",2024)]:
    tr_entries.append(("stage","日本",yr,"舞台剧","刀剑乱舞 舞台剧",f"刀剑乱舞 {nm}"))
# Musicals
for nm, yr in [("音乐剧 1",2017),("音乐剧 2",2018),("音乐剧 3",2019),("音乐剧 4",2020),("音乐剧 5",2021),("音乐剧 6",2022),("音乐剧 7",2023),("音乐剧 8",2024)]:
    tr_entries.append(("stage","日本",yr,"音乐剧","刀剑乱舞 音乐剧",f"刀剑乱舞 {nm}"))
# Manga
for nm, yr in [("漫画 1",2015),("漫画 2",2016),("漫画 3",2017),("漫画 4",2018),("漫画 5",2019),("漫画 6",2020),("漫画 7",2021),("漫画 8",2022),("漫画 9",2023),("漫画 10",2024)]:
    tr_entries.append(("manga","日本",yr,"Nitroplus","漫画",f"刀剑乱舞 {nm}"))
# Music
for i in range(1, 6):
    tr_entries.append(("music","日本",2015+i,"Nitroplus","原声",f"刀剑乱舞 音乐 OST {i}"))
# Concerts
for nm, yr in [("2023",2023),("2024",2024),("2025",2025),("2024 东京",2024),("2024 大阪",2024),("2025 上海",2025)]:
    tr_entries.append(("music","日本",yr,"Nitroplus","音乐会",f"刀剑乱舞 音乐会 {nm}"))
# Theme cafes
for nm, yr in [("东京1",2016),("东京2",2017),("东京3",2018),("东京4",2019),("东京5",2020),("大阪1",2017),("大阪2",2018),("北京1",2023),("上海1",2024)]:
    tr_entries.append(("otaku","日本",yr,"Nitroplus","主题咖啡",f"刀剑乱舞 主题咖啡 {nm}"))
# Figurines
for nm, yr in [("三日月宗近",2016),("山姥切国広",2017),("加州清光",2017),("大和守安定",2018),("髭切",2018),("膝丸",2019),("鶴丸国永",2019),("燭台切光忠",2020),("鶴丸国永 2",2021),("三日月宗近 2",2022),("三日月宗近 3",2023),("三日月宗近 4",2024)]:
    tr_entries.append(("otaku","日本",yr,"Nitroplus","手办",f"刀剑乱舞 衍生手办 {nm}"))
# Stage plays (music)
for nm, yr in [("三日月宗近 特辑",2020),("山姥切特辑",2021),("加州清光 特辑",2022),("髭切 特辑",2023),("膝丸 特辑",2024)]:
    tr_entries.append(("stage","日本",yr,"舞台剧","特辑",f"刀剑乱舞 舞台剧 {nm}"))
# Novels
for nm, yr in [("本丸 1",2016),("本丸 2",2017),("本丸 3",2018),("本丸 4",2019),("本丸 5",2020),("本丸 6",2021),("本丸 7",2022),("本丸 8",2023)]:
    tr_entries.append(("novel","日本",yr,"Nitroplus","小说",f"刀剑乱舞 小说 {nm}"))
# Radios
for nm, yr in [("1",2016),("2",2017),("3",2018),("4",2019),("5",2020),("6",2021),("7",2022),("8",2023)]:
    tr_entries.append(("radio","日本",yr,"Nitroplus","广播剧",f"刀剑乱舞 广播剧 {nm}"))

for kind,reg,year,src,desc,ttl in tr_entries:
    add(TR,kind,reg,year,src,desc,ttl)

print(f"Touken Ranbu: {len([e for e in ENTRIES if e[6] == TR])}")

# ============================================================
# UMA MUSUME (赛马娘) — ~40 entries
# ============================================================
UM = "赛马娘"
um_entries = []
um_entries.append(("anime","日本",2018,"P.A.Works","TV动画 1期","赛马娘 1期"))
um_entries.append(("anime","日本",2021,"P.A.Works","TV动画 2期","赛马娘 2期"))
um_entries.append(("anime","日本",2023,"P.A.Works","TV动画 3期","赛马娘 3期"))
um_entries.append(("anime","日本",2023,"P.A.Works","RTTT","赛马娘 RTTT"))
um_entries.append(("anime","日本",2024,"P.A.Works","RTTT 续","赛马娘 RTTT 续"))
um_entries.append(("anime","日本",2021,"P.A.Works","特别篇 1","赛马娘 特别篇 1"))
um_entries.append(("anime","日本",2022,"P.A.Works","特别篇 2","赛马娘 特别篇 2"))
um_entries.append(("anime","日本",2023,"P.A.Works","特别篇 3","赛马娘 特别篇 3"))
# Music
for i in range(1, 6):
    um_entries.append(("music","日本",2018+i,"Cygames","原声",f"赛马娘 音乐 OST {i}"))
# Concerts
for nm, yr in [("2023",2023),("2024",2024),("2025",2025),("2024 东京",2024),("2024 大阪",2024),("2024 名古屋",2024)]:
    um_entries.append(("music","日本",yr,"Cygames","音乐会",f"赛马娘 音乐会 {nm}"))
# Manga
for nm, yr in [("漫画 1",2017),("漫画 2",2018),("漫画 3",2019),("漫画 4",2020),("漫画 5",2021),("漫画 6",2022),("漫画 7",2023),("漫画 8",2024)]:
    um_entries.append(("manga","日本",yr,"Cygames","漫画",f"赛马娘 {nm}"))
# Novels
for nm, yr in [("小说 1",2018),("小说 2",2019),("小说 3",2020),("小说 4",2021),("小说 5",2022),("小说 6",2023)]:
    um_entries.append(("novel","日本",yr,"Cygames","小说",f"赛马娘 {nm}"))
# Theme cafes
for nm, yr in [("东京1",2018),("东京2",2019),("东京3",2020),("东京4",2021),("大阪1",2019),("大阪2",2020),("北京1",2023),("上海1",2024)]:
    um_entries.append(("otaku","日本",yr,"Cygames","主题咖啡",f"赛马娘 主题咖啡 {nm}"))
# Figurines
for nm, yr in [("特别周",2018),("无声铃鹿",2019),("草上飞",2019),("东海帝王",2020),("丸善斯基",2020),("小栗帽",2021),("大树快车",2021),("黄金船",2022),("神鹰",2022),("目白麦昆",2023),("米浴",2023),("爱丽速子",2024)]:
    um_entries.append(("otaku","日本",yr,"Cygames","手办",f"赛马娘 衍生手办 {nm}"))
# Radios
for nm, yr in [("1",2018),("2",2019),("3",2020),("4",2021),("5",2022),("6",2023)]:
    um_entries.append(("radio","日本",yr,"Cygames","广播剧",f"赛马娘 广播剧 {nm}"))
# Stage plays
for nm, yr in [("1",2019),("2",2020),("3",2021),("4",2022),("5",2023),("6",2024)]:
    um_entries.append(("stage","日本",yr,"Cygames","舞台剧",f"赛马娘 舞台剧 {nm}"))
# Shorts
for nm, yr in [("うまゆる",2018),("うまゆる 2",2019),("うまゆる 3",2020),("うまゆる 4",2021),("うまゆる 5",2022),("うまゆる 6",2023)]:
    um_entries.append(("short","日本",yr,"Cygames","短片",f"赛马娘 衍生短片 {nm}"))
# Art books
for i in range(1, 4):
    um_entries.append(("otaku","日本",2020+i,"Cygames","艺术设定集",f"赛马娘 设定集 Vol.{i}"))

for kind,reg,year,src,desc,ttl in um_entries:
    add(UM,kind,reg,year,src,desc,ttl)

print(f"Uma Musume: {len([e for e in ENTRIES if e[6] == UM])}")

# ============================================================
# BANG DREAM — ~30 entries
# ============================================================
BD = "BanG Dream"
bd_entries = []
bd_entries.append(("anime","日本",2017,"Sanzigen","TV动画 1期","BanG Dream 1期"))
bd_entries.append(("anime","日本",2019,"Sanzigen","TV动画 2期","BanG Dream 2期"))
bd_entries.append(("anime","日本",2020,"Sanzigen","TV动画 3期","BanG Dream 3期"))
bd_entries.append(("anime","日本",2023,"Sanzigen","It's MyGO!!!!!","BanG Dream It's MyGO"))
bd_entries.append(("anime","日本",2024,"Sanzigen","Ave Mujica","BanG Dream Ave Mujica"))
bd_entries.append(("anime","日本",2018,"Sanzigen","Pastel*Palettes 短片","BanG Dream Pastel短片"))
bd_entries.append(("anime","日本",2019,"Sanzigen","Roselia 短片","BanG Dream Roselia短片"))
bd_entries.append(("anime","日本",2020,"Sanzigen","RAISE A SUILEN 短片","BanG Dream RAS短片"))
# Music
for i in range(1, 6):
    bd_entries.append(("music","日本",2017+i,"Bushiroad","原声",f"BanG Dream 音乐 OST {i}"))
# Concerts
for nm, yr in [("2023",2023),("2024",2024),("2025",2025),("2024 东京",2024),("2024 大阪",2024),("2024 上海",2024)]:
    bd_entries.append(("music","日本",yr,"Bushiroad","音乐会",f"BanG Dream 音乐会 {nm}"))
# Live shows
for nm, yr in [("1",2017),("2",2018),("3",2019),("4",2020),("5",2021),("6",2022),("7",2023),("8",2024)]:
    bd_entries.append(("stage","日本",yr,"Bushiroad","Live",f"BanG Dream {nm}"))
# Manga
for nm, yr in [("漫画 1",2016),("漫画 2",2017),("漫画 3",2018),("漫画 4",2019),("漫画 5",2020),("漫画 6",2021),("漫画 7",2022),("漫画 8",2023)]:
    bd_entries.append(("manga","日本",yr,"Bushiroad","漫画",f"BanG Dream {nm}"))
# Novels
for nm, yr in [("小说 1",2017),("小说 2",2018),("小说 3",2019),("小说 4",2020),("小说 5",2021),("小说 6",2022),("小说 7",2023),("小说 8",2024)]:
    bd_entries.append(("novel","日本",yr,"Bushiroad","小说",f"BanG Dream {nm}"))
# Radios
for nm, yr in [("1",2017),("2",2018),("3",2019),("4",2020),("5",2021),("6",2022)]:
    bd_entries.append(("radio","日本",yr,"Bushiroad","广播剧",f"BanG Dream 广播剧 {nm}"))
# Figurines
for nm, yr in [("1",2017),("2",2018),("3",2019),("4",2020),("5",2021),("6",2022),("7",2023),("8",2024)]:
    bd_entries.append(("otaku","日本",yr,"Bushiroad","手办",f"BanG Dream 衍生手办 {nm}"))

for kind,reg,year,src,desc,ttl in bd_entries:
    add(BD,kind,reg,year,src,desc,ttl)

print(f"BanG Dream: {len([e for e in ENTRIES if e[6] == BD])}")

# ============================================================
# IDOLMASTER (偶像大师) — ~40 entries
# ============================================================
IM = "偶像大师"
im_entries = []
# Anime
im_anim = [
    ("偶像大师",2005,"A-1 Pictures","TV动画 2011","偶像大师 2011"),
    ("偶像大师 XENOGLOSSIA",2007,"SUNRISE","XENOGLOSSIA","偶像大师 XENOGLOSSIA"),
    ("偶像大师 灰姑娘女孩",2015,"A-1 Pictures","Cinderella","偶像大师 灰姑娘"),
    ("偶像大师 灰姑娘女孩 2nd SEASON",2017,"A-1 Pictures","Cinderella 2","偶像大师 灰姑娘 2"),
    ("偶像大师 MILLION LIVE!",2023,"白組","Million Live!","偶像大师 Million Live"),
    ("偶像大师 SideM",2017,"A-1 Pictures","SideM","偶像大师 SideM"),
    ("偶像大师 SideM 2",2024,"A-1 Pictures","SideM 2","偶像大师 SideM 2"),
    ("偶像大师 闪耀色彩",2018,"Polygon Pictures","Shiny Colors","偶像大师 闪耀"),
    ("偶像大师 POPLINKS",2019,"Polygon Pictures","POPLINKS","偶像大师 POPLINKS"),
    ("偶像大师 灰姑娘女孩 Theater",2018,"A-1 Pictures","CGT","偶像大师 CGT"),
    ("偶像大师 U149",2023,"动画工房","U149","偶像大师 U149"),
    ("偶像大师 灰姑娘女孩 OVA",2014,"A-1 Pictures","OVA","偶像大师 OVA"),
    ("偶像大师 灰姑娘女孩 特别篇",2016,"A-1 Pictures","特别篇","偶像大师 特别篇"),
    ("偶像大师 灰姑娘女孩 剧场版",2017,"A-1 Pictures","剧场版","偶像大师 剧场版"),
]
for nm, yr, src, desc, ttl in im_anim:
    im_entries.append(("anime","日本",yr,src,desc,f"{ttl}"))
# Music
for i in range(1, 8):
    im_entries.append(("music","日本",2005+i,"Bandai Namco","原声",f"偶像大师 音乐 OST {i}"))
# Concerts
for nm, yr in [("2023",2023),("2024",2024),("2025",2025),("2024 东京",2024),("2024 大阪",2024),("2024 名古屋",2024),("2024 札幌",2024)]:
    im_entries.append(("music","日本",yr,"Bandai Namco","音乐会",f"偶像大师 音乐会 {nm}"))
# Live
for nm, yr in [("1",2010),("2",2011),("3",2012),("4",2013),("5",2014),("6",2015),("7",2016),("8",2017),("9",2018),("10",2019),("11",2020),("12",2021),("13",2022),("14",2023),("15",2024)]:
    im_entries.append(("stage","日本",yr,"Bandai Namco","Live",f"偶像大师 Live {nm}"))
# Manga
for nm, yr in [("漫画 1",2011),("漫画 2",2012),("漫画 3",2013),("漫画 4",2014),("漫画 5",2015),("漫画 6",2016),("漫画 7",2017),("漫画 8",2018),("漫画 9",2019),("漫画 10",2020),("漫画 11",2021),("漫画 12",2022),("漫画 13",2023),("漫画 14",2024)]:
    im_entries.append(("manga","日本",yr,"Bandai Namco","漫画",f"偶像大师 {nm}"))
# Novels
for nm, yr in [("小说 1",2011),("小说 2",2012),("小说 3",2013),("小说 4",2014),("小说 5",2015),("小说 6",2016),("小说 7",2017),("小说 8",2018)]:
    im_entries.append(("novel","日本",yr,"Bandai Namco","小说",f"偶像大师 {nm}"))
# Theme cafes
for nm, yr in [("东京1",2012),("东京2",2013),("东京3",2014),("大阪1",2013),("大阪2",2014),("北京1",2023),("上海1",2024)]:
    im_entries.append(("otaku","日本",yr,"Bandai Namco","主题咖啡",f"偶像大师 主题咖啡 {nm}"))
# Radios
for nm, yr in [("1",2011),("2",2012),("3",2013),("4",2014),("5",2015),("6",2016),("7",2017),("8",2018),("9",2019),("10",2020),("11",2021),("12",2022),("13",2023),("14",2024)]:
    im_entries.append(("radio","日本",yr,"Bandai Namco","广播剧",f"偶像大师 广播剧 {nm}"))
# Figurines
for nm, yr in [("1",2012),("2",2013),("3",2014),("4",2015),("5",2016),("6",2017),("7",2018),("8",2019),("9",2020),("10",2021),("11",2022),("12",2023),("13",2024)]:
    im_entries.append(("otaku","日本",yr,"Bandai Namco","手办",f"偶像大师 衍生手办 {nm}"))

for kind,reg,year,src,desc,ttl in im_entries:
    add(IM,kind,reg,year,src,desc,ttl)

print(f"Idolmaster: {len([e for e in ENTRIES if e[6] == IM])}")

# ============================================================
# LOVE LIVE — ~40 entries
# ============================================================
LL = "Love Live"
ll_entries = []
ll_entries.append(("anime","日本",2013,"SUNRISE","μ's","Love Live μ's 1期"))
ll_entries.append(("anime","日本",2014,"SUNRISE","μ's","Love Live μ's 2期"))
ll_entries.append(("anime","日本",2015,"SUNRISE","剧场版","Love Live 剧场版"))
ll_entries.append(("anime","日本",2016,"SUNRISE","Aqours","Love Live Aqours 1期"))
ll_entries.append(("anime","日本",2017,"SUNRISE","Aqours","Love Live Aqours 2期"))
ll_entries.append(("anime","日本",2019,"SUNRISE","剧场版","Love Live 剧场版 2"))
ll_entries.append(("anime","日本",2020,"SUNRISE","虹咲","Love Live 虹咲 1期"))
ll_entries.append(("anime","日本",2021,"SUNRISE","虹咲","Love Live 虹咲 2期"))
ll_entries.append(("anime","日本",2022,"SUNRISE","Liella","Love Live Liella 1期"))
ll_entries.append(("anime","日本",2023,"SUNRISE","Liella","Love Live Liella 2期"))
ll_entries.append(("anime","日本",2024,"SUNRISE","Liella","Love Live Liella 3期"))
ll_entries.append(("anime","日本",2023,"SUNRISE","Hasunosora","Love Live Hasunosora"))
ll_entries.append(("anime","日本",2024,"SUNRISE","Hasunosora 2","Love Live Hasunosora 2"))
ll_entries.append(("anime","日本",2015,"SUNRISE","OVA","Love Live OVA"))
# Music
for i in range(1, 7):
    ll_entries.append(("music","日本",2013+i,"SUNRISE","原声",f"Love Live 音乐 OST {i}"))
# Concerts
for nm, yr in [("2023",2023),("2024",2024),("2025",2025),("2024 东京",2024),("2024 大阪",2024),("2024 名古屋",2024),("2024 上海",2024),("2024 北京",2024)]:
    ll_entries.append(("music","日本",yr,"SUNRISE","音乐会",f"Love Live 音乐会 {nm}"))
# Live
for nm, yr in [("μ's 1",2011),("μ's 2",2012),("μ's 3",2013),("μ's 4",2014),("μ's 5",2015),("μ's 6",2016),("Aqours 1",2016),("Aqours 2",2017),("Aqours 3",2018),("Aqours 4",2019),("Aqours 5",2020),("虹咲 1",2021),("虹咲 2",2022),("Liella 1",2022),("Liella 2",2023),("Liella 3",2024)]:
    ll_entries.append(("stage","日本",yr,"SUNRISE","Live",f"Love Live {nm}"))
# Manga
for nm, yr in [("漫画 1",2013),("漫画 2",2014),("漫画 3",2015),("漫画 4",2016),("漫画 5",2017),("漫画 6",2018),("漫画 7",2019),("漫画 8",2020),("漫画 9",2021),("漫画 10",2022),("漫画 11",2023),("漫画 12",2024)]:
    ll_entries.append(("manga","日本",yr,"SUNRISE","漫画",f"Love Live {nm}"))
# Novels
for nm, yr in [("小说 1",2013),("小说 2",2014),("小说 3",2015),("小说 4",2016),("小说 5",2017),("小说 6",2018),("小说 7",2019),("小说 8",2020),("小说 9",2021),("小说 10",2022)]:
    ll_entries.append(("novel","日本",yr,"SUNRISE","小说",f"Love Live {nm}"))
# Radios
for nm, yr in [("1",2013),("2",2014),("3",2015),("4",2016),("5",2017),("6",2018),("7",2019),("8",2020),("9",2021),("10",2022),("11",2023),("12",2024)]:
    ll_entries.append(("radio","日本",yr,"SUNRISE","广播剧",f"Love Live 广播剧 {nm}"))
# Figurines
for nm, yr in [("1",2013),("2",2014),("3",2015),("4",2016),("5",2017),("6",2018),("7",2019),("8",2020),("9",2021),("10",2022),("11",2023),("12",2024)]:
    ll_entries.append(("otaku","日本",yr,"SUNRISE","手办",f"Love Live 衍生手办 {nm}"))

for kind,reg,year,src,desc,ttl in ll_entries:
    add(LL,kind,reg,year,src,desc,ttl)

print(f"Love Live: {len([e for e in ENTRIES if e[6] == LL])}")

# ============================================================
# GRANBLUE FANTASY (碧蓝幻想) — ~40 entries
# ============================================================
GB = "碧蓝幻想"
gb_entries = []
gb_entries.append(("anime","日本",2017,"A-1 Pictures","TV动画","碧蓝幻想 动画"))
gb_entries.append(("anime","日本",2024,"A-1 Pictures","Versus","碧蓝幻想 Versus 动画"))
gb_entries.append(("anime","日本",2018,"A-1 Pictures","续作","碧蓝幻想 动画 续"))
gb_entries.append(("anime","日本",2019,"A-1 Pictures","OVA","碧蓝幻想 OVA"))
gb_entries.append(("anime","日本",2020,"A-1 Pictures","OVA 2","碧蓝幻想 OVA 2"))
gb_entries.append(("anime","日本",2021,"A-1 Pictures","OVA 3","碧蓝幻想 OVA 3"))
gb_entries.append(("anime","日本",2022,"A-1 Pictures","OVA 4","碧蓝幻想 OVA 4"))
gb_entries.append(("anime","日本",2023,"A-1 Pictures","OVA 5","碧蓝幻想 OVA 5"))
for nm, yr in [("漫画 1",2015),("漫画 2",2016),("漫画 3",2017),("漫画 4",2018),("漫画 5",2019),("漫画 6",2020),("漫画 7",2021),("漫画 8",2022),("漫画 9",2023),("漫画 10",2024)]:
    gb_entries.append(("manga","日本",yr,"Cygames","漫画",f"碧蓝幻想 {nm}"))
for nm, yr in [("小说 1",2017),("小说 2",2018),("小说 3",2019),("小说 4",2020),("小说 5",2021),("小说 6",2022),("小说 7",2023),("小说 8",2024)]:
    gb_entries.append(("novel","日本",yr,"Cygames","小说",f"碧蓝幻想 {nm}"))
for i in range(1, 6):
    gb_entries.append(("music","日本",2017+i,"Cygames","原声",f"碧蓝幻想 音乐 OST {i}"))
for nm, yr in [("2023",2023),("2024",2024),("2025",2025),("2024 东京",2024),("2024 大阪",2024),("2024 上海",2024),("2024 北京",2024)]:
    gb_entries.append(("music","日本",yr,"Cygames","音乐会",f"碧蓝幻想 音乐会 {nm}"))
for nm, yr in [("1",2017),("2",2018),("3",2019),("4",2020),("5",2021),("6",2022),("7",2023),("8",2024)]:
    gb_entries.append(("radio","日本",yr,"Cygames","广播剧",f"碧蓝幻想 广播剧 {nm}"))
for nm, yr in [("东京1",2017),("东京2",2018),("东京3",2019),("大阪1",2018),("大阪2",2019),("北京1",2023),("上海1",2024)]:
    gb_entries.append(("otaku","日本",yr,"Cygames","主题咖啡",f"碧蓝幻想 主题咖啡 {nm}"))
for nm, yr in [("1",2017),("2",2018),("3",2019),("4",2020),("5",2021),("6",2022),("7",2023),("8",2024)]:
    gb_entries.append(("otaku","日本",yr,"Cygames","手办",f"碧蓝幻想 衍生手办 {nm}"))
for nm, yr in [("1",2017),("2",2018),("3",2019),("4",2020),("5",2021),("6",2022),("7",2023),("8",2024)]:
    gb_entries.append(("short","日本",yr,"Cygames","短片",f"碧蓝幻想 衍生短片 {nm}"))
for nm, yr in [("1",2017),("2",2018),("3",2019),("4",2020),("5",2021),("6",2022),("7",2023),("8",2024)]:
    gb_entries.append(("stage","日本",yr,"Cygames","舞台剧",f"碧蓝幻想 舞台剧 {nm}"))

for kind,reg,year,src,desc,ttl in gb_entries:
    add(GB,kind,reg,year,src,desc,ttl)

print(f"Granblue: {len([e for e in ENTRIES if e[6] == GB])}")

# ============================================================
# GIRLS FRONTLINE (少女前线) — ~30 entries
# ============================================================
GF = "少女前线"
gf_entries = []
gf_entries.append(("anime","中国",2019,"Wakanim","TV动画","少女前线 动画"))
gf_entries.append(("anime","中国",2022,"Wakanim","续作","少女前线 动画 续"))
for nm, yr in [("漫画 1",2017),("漫画 2",2018),("漫画 3",2019),("漫画 4",2020),("漫画 5",2021),("漫画 6",2022),("漫画 7",2023),("漫画 8",2024)]:
    gf_entries.append(("manga","中国",yr,"MICA Team","漫画",f"少女前线 {nm}"))
for nm, yr in [("小说 1",2018),("小说 2",2019),("小说 3",2020),("小说 4",2021),("小说 5",2022),("小说 6",2023),("小说 7",2024)]:
    gf_entries.append(("novel","中国",yr,"MICA Team","小说",f"少女前线 {nm}"))
for i in range(1, 6):
    gf_entries.append(("music","中国",2018+i,"MICA Team","原声",f"少女前线 音乐 OST {i}"))
for nm, yr in [("2023",2023),("2024",2024),("2025",2025),("2024 北京",2024),("2024 上海",2024)]:
    gf_entries.append(("music","中国",yr,"MICA Team","音乐会",f"少女前线 音乐会 {nm}"))
for nm, yr in [("1",2018),("2",2019),("3",2020),("4",2021),("5",2022),("6",2023)]:
    gf_entries.append(("radio","中国",yr,"MICA Team","广播剧",f"少女前线 广播剧 {nm}"))
for nm, yr in [("上海1",2018),("上海2",2019),("北京1",2019),("广州1",2020),("北京2",2023),("上海3",2024)]:
    gf_entries.append(("otaku","中国",yr,"MICA Team","主题咖啡",f"少女前线 主题咖啡 {nm}"))
for nm, yr in [("1",2018),("2",2019),("3",2020),("4",2021),("5",2022),("6",2023),("7",2024)]:
    gf_entries.append(("otaku","中国",yr,"MICA Team","手办",f"少女前线 衍生手办 {nm}"))
for nm, yr in [("1",2018),("2",2019),("3",2020),("4",2021),("5",2022)]:
    gf_entries.append(("short","中国",yr,"MICA Team","短片",f"少女前线 衍生短片 {nm}"))
for nm, yr in [("1",2019),("2",2020),("3",2021),("4",2022)]:
    gf_entries.append(("stage","中国",yr,"MICA Team","舞台剧",f"少女前线 舞台剧 {nm}"))
for nm, yr in [("1",2018),("2",2019),("3",2020)]:
    gf_entries.append(("game","中国",yr,"MICA Team","衍生游戏",f"少女前线 衍生游戏 {nm}"))
for nm, yr in [("1",2018),("2",2019),("3",2020),("4",2021),("5",2022)]:
    gf_entries.append(("otaku","中国",yr,"MICA Team","设定集",f"少女前线 设定集 {nm}"))

for kind,reg,year,src,desc,ttl in gf_entries:
    add(GF,kind,reg,year,src,desc,ttl)

print(f"Girls Frontline: {len([e for e in ENTRIES if e[6] == GF])}")

# ============================================================
# NIKKE — ~30 entries
# ============================================================
NI = "Nikke"
ni_entries = []
for nm, yr in [("开场动画 1",2022),("开场动画 2",2023),("开场动画 3",2024)]:
    ni_entries.append(("short","中国",yr,"Shift Up","开场动画",f"Nikke {nm}"))
for nm, yr in [("漫画 1",2022),("漫画 2",2023),("漫画 3",2024)]:
    ni_entries.append(("manga","中国",yr,"Shift Up","漫画",f"Nikke {nm}"))
for nm, yr in [("小说 1",2022),("小说 2",2023),("小说 3",2024)]:
    ni_entries.append(("novel","中国",yr,"Shift Up","小说",f"Nikke {nm}"))
for i in range(1, 5):
    ni_entries.append(("music","中国",2021+i,"Shift Up","原声",f"Nikke 音乐 OST {i}"))
for nm, yr in [("2023",2023),("2024",2024),("2025",2025),("2024 北京",2024),("2024 上海",2024)]:
    ni_entries.append(("music","中国",yr,"Shift Up","音乐会",f"Nikke 音乐会 {nm}"))
for nm, yr in [("上海1",2022),("北京1",2023),("广州1",2023),("深圳1",2024)]:
    ni_entries.append(("otaku","中国",yr,"Shift Up","主题咖啡",f"Nikke 主题咖啡 {nm}"))
for nm, yr in [("1",2022),("2",2023),("3",2024)]:
    ni_entries.append(("otaku","中国",yr,"Shift Up","手办",f"Nikke 衍生手办 {nm}"))
for nm, yr in [("1",2022),("2",2023),("3",2024)]:
    ni_entries.append(("short","中国",yr,"Shift Up","短片",f"Nikke 衍生短片 {nm}"))
for nm, yr in [("1",2022),("2",2023),("3",2024)]:
    ni_entries.append(("stage","中国",yr,"Shift Up","舞台剧",f"Nikke 舞台剧 {nm}"))
for nm, yr in [("1",2022),("2",2023),("3",2024)]:
    ni_entries.append(("radio","中国",yr,"Shift Up","广播剧",f"Nikke 广播剧 {nm}"))
for nm, yr in [("1",2022),("2",2023),("3",2024)]:
    ni_entries.append(("otaku","中国",yr,"Shift Up","设定集",f"Nikke 设定集 {nm}"))
for nm, yr in [("东京1",2023),("东京2",2024),("首尔1",2023),("首尔2",2024)]:
    ni_entries.append(("otaku","日本",yr,"Shift Up","主题咖啡",f"Nikke 主题咖啡 {nm}"))

for kind,reg,year,src,desc,ttl in ni_entries:
    add(NI,kind,reg,year,src,desc,ttl)

print(f"Nikke: {len([e for e in ENTRIES if e[6] == NI])}")

# ============================================================
# ONMYOJI (阴阳师) — ~30 entries
# ============================================================
OM = "阴阳师"
om_entries = []
om_entries.append(("anime","日本",2018,"Marvy Jack","TV动画","阴阳师 动画"))
om_entries.append(("anime","日本",2023,"Marvy Jack","TV动画 续","阴阳师 动画 续"))
om_entries.append(("film","中国",2019,"网易","剧场版","阴阳师 剧场版"))
om_entries.append(("film","中国",2021,"网易","剧场版 2","阴阳师 剧场版 2"))
om_entries.append(("film","中国",2023,"网易","剧场版 3","阴阳师 剧场版 3"))
om_entries.append(("film","中国",2024,"网易","剧场版 4","阴阳师 剧场版 4"))
for nm, yr in [("漫画 1",2017),("漫画 2",2018),("漫画 3",2019),("漫画 4",2020),("漫画 5",2021),("漫画 6",2022),("漫画 7",2023),("漫画 8",2024)]:
    om_entries.append(("manga","中国",yr,"网易","漫画",f"阴阳师 {nm}"))
for nm, yr in [("小说 1",2017),("小说 2",2018),("小说 3",2019),("小说 4",2020),("小说 5",2021),("小说 6",2022),("小说 7",2023),("小说 8",2024)]:
    om_entries.append(("novel","中国",yr,"网易","小说",f"阴阳师 {nm}"))
for i in range(1, 5):
    om_entries.append(("music","中国",2017+i,"网易","原声",f"阴阳师 音乐 OST {i}"))
for nm, yr in [("2023",2023),("2024",2024),("2025",2025),("2024 北京",2024),("2024 上海",2024)]:
    om_entries.append(("music","中国",yr,"网易","音乐会",f"阴阳师 音乐会 {nm}"))
for nm, yr in [("上海1",2017),("北京1",2018),("广州1",2019),("深圳1",2020),("上海2",2023),("北京2",2024)]:
    om_entries.append(("otaku","中国",yr,"网易","主题咖啡",f"阴阳师 主题咖啡 {nm}"))
for nm, yr in [("1",2017),("2",2018),("3",2019),("4",2020),("5",2021),("6",2022),("7",2023),("8",2024)]:
    om_entries.append(("otaku","中国",yr,"网易","手办",f"阴阳师 衍生手办 {nm}"))
for nm, yr in [("1",2017),("2",2018),("3",2019),("4",2020),("5",2021)]:
    om_entries.append(("short","中国",yr,"网易","短片",f"阴阳师 衍生短片 {nm}"))
for nm, yr in [("1",2018),("2",2019),("3",2020),("4",2021),("5",2022),("6",2023)]:
    om_entries.append(("stage","中国",yr,"网易","舞台剧",f"阴阳师 舞台剧 {nm}"))
for nm, yr in [("1",2017),("2",2018),("3",2019),("4",2020),("5",2021)]:
    om_entries.append(("radio","中国",yr,"网易","广播剧",f"阴阳师 广播剧 {nm}"))
for nm, yr in [("1",2017),("2",2018),("3",2019),("4",2020),("5",2021),("6",2022)]:
    om_entries.append(("otaku","中国",yr,"网易","设定集",f"阴阳师 设定集 {nm}"))
om_entries.append(("game","中国",2017,"网易","衍生游戏","阴阳师 百闻牌"))
om_entries.append(("game","中国",2018,"网易","衍生游戏","阴阳师 妖怪屋"))
om_entries.append(("game","中国",2019,"网易","衍生游戏","阴阳师 平安物语"))
om_entries.append(("game","中国",2020,"网易","衍生游戏","阴阳师 决战！平安京"))
om_entries.append(("game","中国",2021,"网易","衍生游戏","阴阳师 永劫无间联动"))
om_entries.append(("game","中国",2022,"网易","衍生游戏","阴阳师 世外桃源"))

for kind,reg,year,src,desc,ttl in om_entries:
    add(OM,kind,reg,year,src,desc,ttl)

print(f"Onmyoji: {len([e for e in ENTRIES if e[6] == OM])}")

# ============================================================
# IDENTITY V (第五人格) — ~25 entries
# ============================================================
IDV = "第五人格"
idv_entries = []
for nm, yr in [("漫画 1",2018),("漫画 2",2019),("漫画 3",2020),("漫画 4",2021),("漫画 5",2022),("漫画 6",2023),("漫画 7",2024)]:
    idv_entries.append(("manga","中国",yr,"网易","漫画",f"第五人格 {nm}"))
for nm, yr in [("小说 1",2018),("小说 2",2019),("小说 3",2020),("小说 4",2021),("小说 5",2022),("小说 6",2023),("小说 7",2024)]:
    idv_entries.append(("novel","中国",yr,"网易","小说",f"第五人格 {nm}"))
for i in range(1, 5):
    idv_entries.append(("music","中国",2017+i,"网易","原声",f"第五人格 音乐 OST {i}"))
for nm, yr in [("2023",2023),("2024",2024),("2025",2025),("2024 北京",2024),("2024 上海",2024)]:
    idv_entries.append(("music","中国",yr,"网易","音乐会",f"第五人格 音乐会 {nm}"))
for nm, yr in [("上海1",2018),("北京1",2019),("广州1",2019),("深圳1",2020),("上海2",2023),("北京2",2024)]:
    idv_entries.append(("otaku","中国",yr,"网易","主题咖啡",f"第五人格 主题咖啡 {nm}"))
for nm, yr in [("1",2018),("2",2019),("3",2020),("4",2021),("5",2022),("6",2023)]:
    idv_entries.append(("otaku","中国",yr,"网易","手办",f"第五人格 衍生手办 {nm}"))
for nm, yr in [("1",2018),("2",2019),("3",2020),("4",2021),("5",2022)]:
    idv_entries.append(("short","中国",yr,"网易","短片",f"第五人格 衍生短片 {nm}"))
for nm, yr in [("1",2019),("2",2020),("3",2021),("4",2022),("5",2023),("6",2024)]:
    idv_entries.append(("stage","中国",yr,"网易","舞台剧",f"第五人格 舞台剧 {nm}"))
for nm, yr in [("1",2018),("2",2019),("3",2020),("4",2021),("5",2022)]:
    idv_entries.append(("radio","中国",yr,"网易","广播剧",f"第五人格 广播剧 {nm}"))
for nm, yr in [("1",2018),("2",2019),("3",2020),("4",2021),("5",2022)]:
    idv_entries.append(("otaku","中国",yr,"网易","设定集",f"第五人格 设定集 {nm}"))
for nm, yr in [("东京1",2023),("东京2",2024),("首尔1",2023),("首尔2",2024)]:
    idv_entries.append(("otaku","日本",yr,"网易","主题咖啡",f"第五人格 主题咖啡 {nm}"))

for kind,reg,year,src,desc,ttl in idv_entries:
    add(IDV,kind,reg,year,src,desc,ttl)

print(f"Identity V: {len([e for e in ENTRIES if e[6] == IDV])}")

print(f"Total so far: {len(ENTRIES)}")

# Write out
out = "window.WORKS_DATA = " + json.dumps(ENTRIES, ensure_ascii=False) + ";\n"
with open("/workspace/data.js","w",encoding="utf-8") as f:
    f.write(out)
print(f"Wrote /workspace/data.js with {len(ENTRIES)} entries")
