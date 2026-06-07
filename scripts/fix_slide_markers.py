#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
为 /workspace/ppt.html 的每张 slide 添加 slide-marker（如果还没有）。
支持已存在 slide-marker 的情况（去重）。
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
    'PROLOGUE': '序章', 'THESIS': '主旨', 'CHARACTERS': '人物',
    'ACT I': '第一幕', 'ACT II': '第二幕', 'ACT III': '第三幕', 'EPILOGUE': '升华',
}

src = PATH.read_text(encoding='utf-8')
added = 0

# 找所有 <section ... data-slide="N" ...> 块的开头
def add_one(match):
    global added
    n = int(match.group(1))
    # 找到 section 起始位置
    start = match.start()
    # 找下一个 > 即 section 开始 tag 结束
    open_end = src.find('>', start) + 1
    # section 内容开始位置
    if 'slide-marker' in src[open_end:open_end+500]:
        return match.group(0)  # 已有
    act = ACT_MAP.get(n, 'EPILOGUE')
    cn  = CN[act]
    marker = f'\n    <div class="slide-marker">SLIDE {n:02d} · {cn} · {act}</div>'
    # 紧接 section 起始 tag 后插入（在 bg-grid 之后如有）
    head = src[open_end:open_end+200]
    bg_idx = head.find('<div class="bg-grid"></div>')
    if bg_idx >= 0:
        insert_pos = open_end + bg_idx + len('<div class="bg-grid"></div>')
    else:
        insert_pos = open_end
    global src_being_modified
    # 不能在闭包内修改 src；用另一种方式：返回时连同 marker 一并返回是不行的
    return match.group(0)  # 占位，下面做替换

# 简单方法：先收集所有位置，再批量插入
matches = list(re.finditer(r'<section class="slide[^"]*" data-slide="(\d+)"', src))
print(f'找到 {len(matches)} 张幻灯片')

# 从后往前插入，避免偏移
out = src
for m in reversed(matches):
    n = int(m.group(1))
    open_end = out.find('>', m.start()) + 1
    if 'class="slide-marker"' in out[open_end:open_end+500]:
        continue
    act = ACT_MAP.get(n, 'EPILOGUE')
    cn  = CN[act]
    marker = f'\n    <div class="slide-marker">SLIDE {n:02d} · {cn} · {act}</div>'
    head = out[open_end:open_end+300]
    bg_idx = head.find('<div class="bg-grid"></div>')
    if bg_idx >= 0:
        insert_pos = open_end + bg_idx + len('<div class="bg-grid"></div>')
    else:
        insert_pos = open_end
    out = out[:insert_pos] + marker + out[insert_pos:]
    added += 1

PATH.write_text(out, encoding='utf-8')
print(f'✓ 新增 {added} 个 slide-marker（跳过已存在的）')
