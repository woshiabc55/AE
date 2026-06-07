#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
哥窑 · 66 个分镜 HTML 批量生成脚本
基于用户提供的分镜表生成 shot-01.html ~ shot-66.html
"""
import os
import json

# ============ 分镜数据 ============
SHOTS = [
    # 序章
    {"id": 1,  "act": "序章", "size": "黑场",      "content": "初始动画，角色面朝向天空，送别弟弟。", "audio": "", "duration": "", "note": "开篇·无声的离别"},
    {"id": 2,  "act": "序章", "size": "特写",      "content": "一双布满老茧的手。", "audio": "老林问老张：\"你弟去上学你咋不知道？\" 老张：\"我哪晓得，他年轻，我支持。\" 列车迅速驶过长焦", "duration": "7s", "note": "现代线·埋下伏笔"},
    {"id": 3,  "act": "序章", "size": "中景",      "content": "老匠人独坐桌前，看着瓷器，手滑险些掉落，角色接住。镜头另一端，角色在教育局申请教师资格和项目上报。", "audio": "沉默", "duration": "3s", "note": "现代线·缺了一块"},
    {"id": 4,  "act": "序章", "size": "大特写",    "content": "碎瓷底款——\"章生\"二字。角色进入窑洞巡查。", "audio": "", "duration": "4s", "note": "碎瓷底款·章生"},
    {"id": 5,  "act": "序章", "size": "黑场字幕",  "content": "\"哥窑的'哥'，是谁？\"", "audio": "古琴单音，余韵悠长", "duration": "5s", "note": "全片问句的起点"},
    # 第一幕
    {"id": 6,  "act": "第一幕", "size": "字幕浮现", "content": "字幕浮现。", "audio": "鼓点渐入", "duration": "4s", "note": "时代巨幕拉开"},
    {"id": 7,  "act": "第一幕", "size": "快切蒙太奇", "content": "战马、烽火、流民、南下……", "audio": "战鼓、马蹄、哭喊混音", "duration": "4s", "note": "乱世速写"},
    {"id": 8,  "act": "第一幕", "size": "全景",      "content": "北方窑口，角色在水墨空间寻找，模糊差量镜头，窑火被践踏熄灭。", "audio": "马蹄声、瓷器碎裂声、哭喊", "duration": "5s", "note": "窑口被毁"},
    {"id": 9,  "act": "第一幕", "size": "中景",      "content": "两个包袱塞入兄弟手中——一个是瓷土，一个是家谱。", "audio": "\"往南走，找能烧窑的土地，不能丢。手艺不能断。志元，看好你弟弟。\"", "duration": "4s", "note": "父亲的嘱托"},
    {"id": 10, "act": "第一幕", "size": "中景",      "content": "兄弟接过包袱的特写。", "audio": "沉默", "duration": "3s", "note": "接过的瞬间"},
    {"id": 11, "act": "第一幕", "size": "全景",      "content": "兄弟二人背影，骑马，张寄拿起纸张和梅子青瓷，渐行渐远。", "audio": "风声、脚步声、远处战火", "duration": "4s", "note": "南下启程"},
    {"id": 12, "act": "第一幕", "size": "中景",      "content": "路途上，张志耀指着远方山峦，对弟弟说着什么。", "audio": "章生一：\"吾弟，你看那山，像不像咱家窑口的轮廓？\"", "duration": "4s", "note": "路上闲谈·家山之忆"},
    {"id": 13, "act": "第一幕", "size": "中景",      "content": "兄弟在路途歇脚的剪影。", "audio": "风声", "duration": "3s", "note": "歇脚剪影"},
    {"id": 14, "act": "第一幕", "size": "全景",      "content": "队伍穿越瓯江，江水映着夕阳如血。", "audio": "水声、号子声", "duration": "4s", "note": "瓯江·如血夕阳"},
    {"id": 15, "act": "第一幕", "size": "航拍",      "content": "丽水群山，晨雾中一座山谷土质泛红——紫金土。", "audio": "风声渐起", "duration": "5s", "note": "紫金土·天意"},
    {"id": 16, "act": "第一幕", "size": "中景",      "content": "章生一突然蹲下，抓起一把土，眼神发亮。", "audio": "张寄：\"哥，这土……在唱歌。\"", "duration": "4s", "note": "⭐ 觉醒时刻·天赋"},
    {"id": 17, "act": "第一幕", "size": "双人中景", "content": "张志耀看着弟弟，笑了——那笑容里有欣慰，有骄傲。", "audio": "张志耀：\"那就这儿了。\"", "duration": "4s", "note": "⭐ 哥哥的肯定"},
    {"id": 18, "act": "第一幕", "size": "全景",      "content": "山谷中，兄弟二人徒手清理坡地，身后是原始森林。", "audio": "斧头砍树声、号子声", "duration": "4s", "note": "开荒"},
    {"id": 19, "act": "第一幕", "size": "中景",      "content": "张志耀丈量坡度，用树枝在地上画出窑体轮廓。", "audio": "张志耀：\"龙窑要依山而建，火才能顺着山势往上走。\"", "duration": "4s", "note": "⭐ 窑体规划·理性"},
    {"id": 20, "act": "第一幕", "size": "特写",      "content": "张寄用半块家传窑砖比对新挖的窑土，神色凝重。", "audio": "沉默", "duration": "3s", "note": "家传窑砖·比对"},
    {"id": 21, "act": "第一幕", "size": "中景",      "content": "兄弟二人并肩夯土，动作默契如一。", "audio": "夯土声、号子声", "duration": "4s", "note": "夯土·默契如一"},
    {"id": 22, "act": "第一幕", "size": "特写",      "content": "汗水滴入泥土，章生一的手磨出血泡。", "audio": "张志耀（画外音）：\"寄儿，歇会儿。\"", "duration": "3s", "note": "血泡·画外关怀"},
    {"id": 23, "act": "第一幕", "size": "中景",      "content": "张寄摇头，继续夯土。张志元默默递来一块布裹住弟弟的手。", "audio": "沉默中的关怀", "duration": "4s", "note": "⭐ 兄弟之默·守护"},
    {"id": 24, "act": "第一幕", "size": "全景",      "content": "窑体渐成，当地山民前来围观，有人摇头，有人好奇。", "audio": "议论声：\"外乡人，能烧出啥？\"", "duration": "4s", "note": "山民围观"},
    {"id": 25, "act": "第一幕", "size": "中景",      "content": "张志耀向山民拱手，言语恳切。", "audio": "张志耀：\"各位乡人，我们兄弟只求一处容身，烧出的瓷，与大家共分。\"", "duration": "5s", "note": "恳切承诺"},
    {"id": 26, "act": "第一幕", "size": "特写",      "content": "一位老者微微点头，转身离去。", "audio": "沉默", "duration": "3s", "note": "老者的默许"},
    {"id": 27, "act": "第一幕", "size": "全景",      "content": "第一窑装窑，张寄亲手摆放每一件坯体，神情如仪式。", "audio": "坯体碰撞的轻响", "duration": "4s", "note": "装窑·仪式"},
    {"id": 28, "act": "第一幕", "size": "中景",      "content": "张志耀在窑口点燃第一把火，火光映红兄弟二人的脸。", "audio": "火声渐起、心跳声", "duration": "4s", "note": "⭐ 第一把火"},
    {"id": 29, "act": "第一幕", "size": "特写",      "content": "张寄闭眼倾听窑火的声音，嘴唇微动。", "audio": "张寄：\"火着了。\"", "duration": "3s", "note": "听火·低语"},
    {"id": 30, "act": "第一幕", "size": "全景",      "content": "龙窑彻夜燃烧，火光从窑孔透出，如龙身鳞片。", "audio": "窑火轰鸣、风声", "duration": "5s", "note": "龙窑彻夜·鳞片"},
    {"id": 31, "act": "第一幕", "size": "中景",      "content": "兄弟二人轮流守夜，一个在窑前添柴，一个在草棚打盹。", "audio": "交替的剪影", "duration": "4s", "note": "轮流守夜"},
    {"id": 32, "act": "第一幕", "size": "特写",      "content": "开窑时刻。张寄用铁钩打开窑门，白烟涌出。", "audio": "水汽蒸腾声", "duration": "4s", "note": "开窑门"},
    {"id": 33, "act": "第一幕", "size": "大特写",    "content": "烟散，第一件青瓷出窑——釉色如玉，却未开片。", "audio": "沉默", "duration": "3s", "note": "第一件青瓷·未开片"},
    # 第一幕 过渡分镜（34、35）—— 原脚本留白
    {"id": 34, "act": "第一幕", "size": "中景",      "content": "兄弟二人看着未开片的第一件青瓷，相视一笑，收拾窑场。", "audio": "风声、笑声", "duration": "3s", "note": "未开片·淡然处之"},
    {"id": 35, "act": "第一幕", "size": "全景",      "content": "龙窑安静下来，山谷中余烟袅袅，兄弟二人收拾工具，准备第二窑。", "audio": "收拾声、远山鸟鸣", "duration": "4s", "note": "收拾·准备第二窑"},
    # 第二幕
    {"id": 36, "act": "第二幕", "size": "全景",      "content": "几匹快马驰入山谷，官府旗帜飘扬。", "audio": "马蹄声", "duration": "4s", "note": "快马入谷"},
    {"id": 37, "act": "第二幕", "size": "中景",      "content": "一位官员下马，身后随从捧着木匣。", "audio": "官员：\"朝廷有令，龙泉青瓷可贡于临安，特来查验。\"", "duration": "5s", "note": "官员下马·朝廷令"},
    {"id": 38, "act": "第二幕", "size": "特写",      "content": "张寄紧张地看向哥哥，张志耀微微点头。", "audio": "沉默", "duration": "3s", "note": "紧张与点头"},
    {"id": 39, "act": "第二幕", "size": "中景",      "content": "张寄呈上第二窑出窑的青瓷——釉色更润，隐隐有细纹。", "audio": "官员接过，细细端详", "duration": "4s", "note": "第二窑出窑"},
    {"id": 40, "act": "第二幕", "size": "大特写",    "content": "官员眼中闪过惊讶，手指抚过釉面细纹。", "audio": "官员：\"这纹路……如冰裂，却浑然天成？\"", "duration": "4s", "note": "⭐ 冰裂初现"},
    {"id": 41, "act": "第二幕", "size": "中景",      "content": "张寄低头。", "audio": "张寄：\"回大人，是火候所致，非有意为之。\" 张寄声音微颤", "duration": "3s", "note": "谦逊的弟弟"},
    {"id": 42, "act": "第二幕", "size": "特写",      "content": "官员笑了，打开木匣，取出一方印。", "audio": "官员：\"无意之得，方为天工。此窑，准予贡品之印。\"", "duration": "5s", "note": "⭐ 天工之赐"},
    {"id": 43, "act": "第二幕", "size": "大特写",    "content": "印文——\"龙泉章氏\"——盖在瓷底。", "audio": "印泥落下的沉闷声", "duration": "4s", "note": "⭐ 龙泉章氏"},
    {"id": 44, "act": "第二幕", "size": "全景",      "content": "山民们围拢过来，脸上的疑虑化为笑容。", "audio": "欢呼声、掌声", "duration": "4s", "note": "山民欢呼"},
    {"id": 45, "act": "第二幕", "size": "中景",      "content": "张志耀将印递给弟弟，张寄却摇头，把哥哥的手一起按在印上。", "audio": "张寄：\"哥，没有你这盏灯，我哪能坚持学业，这里都参着你的补贴呢。\"", "duration": "5s", "note": "⭐ 兄弟之印·全片高潮"},
    {"id": 46, "act": "第二幕", "size": "双人中景", "content": "兄弟二人按在印上的手。", "audio": "沉默，只有风声", "duration": "4s", "note": "印上的手"},
    {"id": 47, "act": "第二幕", "size": "航拍",      "content": "龙窑炊烟升起，山谷中人影忙碌，一片生机。", "audio": "号子声、窑火声交织", "duration": "5s", "note": "炊烟升起·生机"},
    # 第三幕
    {"id": 48, "act": "第三幕", "size": "全景",      "content": "窑烧制中，张寄彻夜未眠，守在窑前。", "audio": "窑火轰鸣", "duration": "4s", "note": "彻夜守窑"},
    {"id": 49, "act": "第三幕", "size": "特写",      "content": "张志元突然站起，耳朵贴近窑壁——声音不对。", "audio": "窑火声中夹杂异响", "duration": "3s", "note": "声音不对"},
    {"id": 50, "act": "第三幕", "size": "中景",      "content": "张志耀冲过来，兄弟二人对视——火光映着紧张的脸。", "audio": "张志耀：\"寄儿，怎么了？\"", "duration": "3s", "note": "对视·紧张"},
    {"id": 51, "act": "第三幕", "size": "大特写",    "content": "张寄眼神复杂——恐惧、期待、疯狂交织。", "audio": "张寄：\"哥，火……太急了。\"", "duration": "3s", "note": "⭐ 火太急了"},
    {"id": 52, "act": "第三幕", "size": "全景",      "content": "窑火突然转旺，窑孔中喷出金色火焰。", "audio": "轰鸣声骤强", "duration": "4s", "note": "火焰转旺"},
    {"id": 53, "act": "第三幕", "size": "特写",      "content": "张志耀一把拉住要冲上去的弟弟。", "audio": "张志耀：\"等！现在开窑，全毁了！\"", "duration": "3s", "note": "⭐ 哥哥拉住·理性"},
    {"id": 54, "act": "第三幕", "size": "双人中景", "content": "兄弟二人并肩站在窑前，火光将他们的影子投在山壁上，如一人。", "audio": "窑火声、心跳声、呼吸声", "duration": "5s", "note": "⭐ 如一人·精神顶点"},
    {"id": 55, "act": "第三幕", "size": "黑场",      "content": "黑场。", "audio": "寂静", "duration": "3s", "note": "寂静的等待"},
    {"id": 56, "act": "第三幕", "size": "大特写",    "content": "开窑。一片瓷缓缓取出——釉面开片，金丝铁线，前所未见。", "audio": "瓷片轻响，如钟磬", "duration": "4s", "note": "⭐ 金丝铁线·诞生"},
    {"id": 57, "act": "第三幕", "size": "特写",      "content": "张寄颤抖的手抚过瓷片，眼泪滑落。", "audio": "张寄：\"哥……成了。\"", "duration": "3s", "note": "⭐ 哥，成了"},
    {"id": 58, "act": "第三幕", "size": "中景",      "content": "张志耀望着这片瓷。", "audio": "\"把这些带回去，我会传承下去，你不必留下。\"", "duration": "3s", "note": "传承之托"},
    {"id": 59, "act": "第三幕", "size": "全景",      "content": "晨曦中，龙窑炊烟袅袅，兄弟二人并肩坐在窑口。", "audio": "鸟鸣、风声", "duration": "4s", "note": "晨曦·并肩"},
    {"id": 60, "act": "第三幕", "size": "中景",      "content": "张志耀指着东方初升的太阳，对弟弟说着什么。", "audio": "张志耀：\"寄儿，你看，天亮了。\"", "duration": "4s", "note": "天亮了"},
    {"id": 61, "act": "第三幕", "size": "特写",      "content": "张寄笑了，那笑容里有释然，有感激。", "audio": "", "duration": "3s", "note": "弟弟的笑"},
    {"id": 62, "act": "第三幕", "size": "大特写",    "content": "一片新瓷放在二人中间，釉面开片如兄弟并肩的轨迹。", "audio": "瓷片反光", "duration": "3s", "note": "新瓷·并肩轨迹"},
    {"id": 63, "act": "第三幕", "size": "航拍",      "content": "丽水大地，龙窑如龙，盘踞山间，窑火不灭。", "audio": "古琴渐起", "duration": "5s", "note": "龙窑如龙·古琴"},
    {"id": 64, "act": "第三幕", "size": "黑场字幕",  "content": "\"哥窑之'哥'，非长幼之序，乃'歌'之古字——窑火如歌，兄弟如线。\"", "audio": "古琴最后一个音", "duration": "5s", "note": "⭐ 主题字幕"},
    {"id": 65, "act": "第三幕", "size": "片尾",      "content": "角色在两个方向，在同一个地方，张志元递给张寄。", "audio": "淡出", "duration": "5s", "note": "片尾·两个方向"},
    {"id": 66, "act": "第三幕", "size": "结尾",      "content": "两个时代的背影重叠，结尾，黑场。", "audio": "淡出", "duration": "5s", "note": "⭐ 两个背影·闭环"},
]

# ============ 模板 ============
SIZE_MAP = {
    "黑场":      "BLACK",
    "黑场字幕":  "TITLE",
    "字幕浮现":  "TITLE",
    "片尾":      "TITLE",
    "结尾":      "TITLE",
    "特写":      "CU",
    "中景":      "MS",
    "大特写":    "ECU",
    "全景":      "WS",
    "航拍":      "AIR",
    "双人中景":  "MS",
    "快切蒙太奇": "WS",
}

ACT_CLASS = {
    "序章":   "prologue",
    "第一幕": "act-1",
    "第二幕": "act-2",
    "第三幕": "act-3",
}

ACT_LINK = {
    "序章":   "index.html",
    "第一幕": "act-1.html",
    "第二幕": "act-2.html",
    "第三幕": "act-3.html",
}

TEMPLATE = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>镜号 {num} · {size} · 哥窑</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Noto+Serif+SC:wght@300;400;500;700&family=Noto+Sans+SC:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/shot.css">
</head>
<body>
<div class="noise"></div>

<div class="shot-page size-{size_class}">
  <div class="shot-canvas" data-text="{title_text}">
    <div class="shot-meta">
      <div class="label">{act} · 镜号 {num}</div>
      <div class="duration">{duration}</div>
    </div>
  </div>

  <div class="shot-info">
    <a href="{act_link}" style="border: none; font-family: var(--font-display); font-size: 12px; letter-spacing: .3em; color: var(--ash); text-transform: uppercase;">← {act}</a>
    <div class="shot-num">N°{num:02d}</div>
    <h2>{size}</h2>
    <div class="shot-type">{act} · {duration} · {note}</div>

    {dialogue_block}

    <p class="shot-description">{content}</p>

    {audio_block}

    <div class="shot-nav">
      {prev_link}
      <a href="gallery.html">分镜索引</a>
      {next_link}
    </div>
  </div>
</div>

<script src="assets/js/audio.js"></script>
</body>
</html>
'''

def render_shot(shot):
    size_class = SIZE_MAP.get(shot["size"], "MS")
    act = shot["act"]
    num = shot["id"]
    size = shot["size"]
    content = shot["content"]
    audio = shot["audio"]
    duration = shot["duration"] or "—"
    note = shot["note"]
    act_link = ACT_LINK.get(act, "index.html")

    # dialogue
    dialogue_block = ""
    if audio and "：" in audio and ("\"") in audio:
        # 把对话切开
        parts = audio.split("\"")
        if len(parts) >= 3:
            speaker_line = parts[0].strip().rstrip("：:").strip()
            speech = parts[1]
            tail = "\"".join(parts[2:]).strip()
            speaker = speaker_line or "对白"
            dialogue_block = f'''<div class="shot-dialogue">
        <span class="speaker">{speaker}</span>
        "{speech}"
      </div>'''

    # audio
    audio_block = ""
    if audio and not dialogue_block:
        audio_block = f'''<div class="shot-audio">
      <div class="wave"></div>
      <span>{audio}</span>
    </div>'''
    elif audio:
        # 已经有 dialogue，audio 显示剩余
        tail = audio
        # 把对话部分去掉
        if '"' in audio:
            parts = audio.split('"')
            if len(parts) >= 3:
                tail = (parts[0] + '"' + '"'.join(parts[2:])).strip(' "：:')
        if tail and tail != "沉默" and tail != "寂静":
            audio_block = f'''<div class="shot-audio">
        <div class="wave"></div>
        <span>{tail}</span>
      </div>'''

    # 标题文字（黑场字幕用）
    if "黑场字幕" in size or "字幕" in size:
        title_text = content
    else:
        title_text = ""

    # prev / next
    idx = next((i for i, s in enumerate(SHOTS) if s["id"] == num), None)
    prev_id = SHOTS[idx - 1]["id"] if idx is not None and idx > 0 else None
    next_id = SHOTS[idx + 1]["id"] if idx is not None and idx < len(SHOTS) - 1 else None

    prev_link = ""
    next_link = ""
    if prev_id is not None:
        prev_link = f'<a href="shot-{prev_id:02d}.html">← 镜号 {prev_id}</a>'
    else:
        prev_link = '<span class="disabled">← 起始</span>'
    if next_id is not None:
        next_link = f'<a href="shot-{next_id:02d}.html">镜号 {next_id} →</a>'
    else:
        next_link = '<span class="disabled">结尾 →</span>'

    return TEMPLATE.format(
        num=num,
        size=size,
        size_class=size_class,
        act=act,
        duration=duration,
        note=note,
        content=content,
        dialogue_block=dialogue_block,
        audio_block=audio_block,
        act_link=act_link,
        title_text=title_text,
        prev_link=prev_link,
        next_link=next_link,
    )

def main():
    out_dir = "/workspace"
    count = 0
    for shot in SHOTS:
        num = shot["id"]
        path = os.path.join(out_dir, f"shot-{num:02d}.html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(render_shot(shot))
        count += 1
    print(f"已生成 {count} 个分镜 HTML 页面。")

if __name__ == "__main__":
    main()
