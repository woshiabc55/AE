#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
为 /workspace/ppt.html 的每张 slide 添加 data-act 属性与 slide-marker。
- 1-5:    PROLOGUE  (序章)
- 6-7:    THESIS    (主旨)
- 8-10:   CHARACTERS (人物)
- 11:     THESIS
- 12-15:  ACT I     (第一幕)
- 16-18:  ACT II    (第二幕)
- 19-21:  ACT III   (第三幕)
- 22-24:  EPILOGUE  (升华)
"""
import re
from pathlib import Path

PATH = Path('/workspace/ppt.html')

ACT_MAP = {
    1:  'PROLOGUE',  2:  'PROLOGUE',  3:  'PROLOGUE',  4:  'PROLOGUE',  5:  'PROLOGUE',
    6:  'THESIS',    7:  'THESIS',
    8:  'CHARACTERS', 9: 'CHARACTERS', 10: 'CHARACTERS',
    11: 'THESIS',
    12: 'ACT I', 13: 'ACT I', 14: 'ACT I', 15: 'ACT I',
    16: 'ACT II', 17: 'ACT II', 18: 'ACT II',
    19: 'ACT III', 20: 'ACT III', 21: 'ACT III',
    22: 'EPILOGUE', 23: 'EPILOGUE', 24: 'EPILOGUE',
}

CN = {
    'PROLOGUE':   '序章',
    'THESIS':     '主旨',
    'CHARACTERS': '人物',
    'ACT I':      '第一幕',
    'ACT II':     '第二幕',
    'ACT III':    '第三幕',
    'EPILOGUE':   '升华',
}

src = PATH.read_text(encoding='utf-8')

# 给每张 <section class="slide" data-slide="N" ...> 补 data-act="..."
def repl_act(m):
    n = int(m.group(1))
    act = ACT_MAP.get(n, 'EPILOGUE')
    return m.group(0) + f' data-act="{act}"'

src, n_act = re.subn(
    r'<section class="slide[^"]*" data-slide="(\d+)"',
    repl_act, src)

# 在每张 slide 的开头注入 slide-marker（如果没有的话）
# 用 Python 一次扫描每个 slide 块的开头
def add_marker(m):
    block = m.group(0)
    if 'slide-marker' in block:
        return block
    n = int(m.group(1))
    act = ACT_MAP.get(n, 'EPILOGUE')
    cn  = CN[act]
    marker = f'\n    <div class="slide-marker">SLIDE {n:02d} · {cn} · {act}</div>'
    # 找到 section 起始行后插入（在 <div class="bg-grid"> 之后）
    return block.replace('<div class="bg-grid"></div>',
                          '<div class="bg-grid"></div>' + marker, 1)

src, n_mark = re.subn(
    r'<section class="slide[^"]*" data-slide="(\d+)"[^>]*>.*?(?=<section class="slide|$)',
    add_marker, src, flags=re.DOTALL)

# 有些 slide 没有 bg-grid，就直接在 <section...> 后追加
def add_marker_simple(m):
    block = m.group(0)
    if 'slide-marker' in block:
        return block
    n = int(m.group(1))
    act = ACT_MAP.get(n, 'EPILOGUE')
    cn  = CN[act]
    marker = f'\n    <div class="slide-marker">SLIDE {n:02d} · {cn} · {act}</div>'
    return m.group(2) + marker

PATH.write_text(src, encoding='utf-8')
print(f'✓ 已为 {n_act} 张幻灯片补充 data-act')
print(f'✓ 已为 {n_mark} 张幻灯片添加 slide-marker')
print(f'  输出：{PATH}')
