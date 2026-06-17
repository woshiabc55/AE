"""为 43 款游戏生成独特的 SVG 封面 (基于游戏名 + 分类生成主题)"""
import os
import re
import json

# 解析 games_meta.js
with open('/workspace/games_meta.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 简单提取 const GAMES_META = [...] 用 eval 是因为有中文
# 用更安全的方式: 提取到 '];' 但跳过嵌套数组 (此文件无嵌套问题)
m = re.search(r'const GAMES_META = (\[(?:.|\n)*?\n\]);', code)
games_text = m.group(1)
# 单引号转双引号
games_text = games_text.replace("'", '"')
# 修整尾部逗号
games_text = re.sub(r',\s*\]', ']', games_text)
games = json.loads(games_text)
print(f'解析到 {len(games)} 款游戏')

# 主题色板 (按分类)
CATEGORY_THEMES = {
    'moba': [
        ('#1a3a6e', '#0a1830', '#3a78d0'),  # 王者蓝
        ('#5a1a1a', '#0a0303', '#c83232'),  # 红
    ],
    'rpg': [
        ('#2a1a4a', '#0a0518', '#8a4ad0'),  # 紫
        ('#1a4a3a', '#031008', '#3ac88a'),  # 翠绿
        ('#4a1a3a', '#0a0510', '#d04a8a'),  # 粉
    ],
    'fps': [
        ('#1a1a1a', '#000000', '#5a5a5a'),  # 灰黑
        ('#2a2a3a', '#050510', '#7a7a9a'),  # 蓝灰
    ],
    'action': [
        ('#3a1a1a', '#0a0505', '#d05a4a'),  # 暗红
    ],
    'horror': [
        ('#0a0a1a', '#000000', '#3a2a4a'),  # 紫黑
    ],
    'adventure': [
        ('#1a3a4a', '#03101a', '#5ac8d0'),  # 天青
    ],
    'party': [
        ('#3a1a4a', '#0a0510', '#d0a04a'),  # 暖橙
    ],
    'strategy': [
        ('#1a2a3a', '#03080a', '#5a8ab0'),  # 钢蓝
    ],
    'card': [
        ('#3a2a1a', '#0a0805', '#c8a04a'),  # 古铜
    ],
    'fighting': [
        ('#2a1a0a', '#0a0500', '#c84a2a'),  # 橙红
    ],
    'mmo': [
        ('#2a3a4a', '#050a10', '#5a9ad0'),  # 古青
    ],
    'racing': [
        ('#3a1a1a', '#0a0505', '#d03030'),  # 速度红
    ],
}

# 游戏名 → 字符画 (用首字 + 装饰)
def make_cover(g, idx):
    cat = g['category']
    themes = CATEGORY_THEMES.get(cat, CATEGORY_THEMES['rpg'])
    c1, c2, accent = themes[idx % len(themes)]
    
    name = g['name']
    en = g['en_name']
    # 取首字作大字符
    initial = name[0]
    
    # 提取名字里的"关键词"用于装饰
    chars = list(name)
    
    # 生成装饰元素: 用游戏首字 + 字符画
    # 风格: 类似印章/卷轴/卦象
    style = idx % 6
    deco_svg = ''
    
    if style == 0:  # 印章风格
        deco_svg = f'''
        <rect x="200" y="60" width="160" height="160" rx="6" fill="none" stroke="{accent}" stroke-width="3" opacity="0.4"/>
        <text x="280" y="170" font-family="serif" font-size="80" fill="{accent}" text-anchor="middle" font-weight="900" opacity="0.6">{initial}</text>
        <line x1="210" y1="180" x2="350" y2="180" stroke="{accent}" stroke-width="1" opacity="0.3"/>
        '''
    elif style == 1:  # 圆形纹章
        deco_svg = f'''
        <circle cx="280" cy="140" r="80" fill="none" stroke="{accent}" stroke-width="2" opacity="0.3"/>
        <circle cx="280" cy="140" r="65" fill="none" stroke="{accent}" stroke-width="1" opacity="0.2"/>
        <text x="280" y="170" font-family="serif" font-size="60" fill="{accent}" text-anchor="middle" font-weight="900" opacity="0.7">{initial}</text>
        '''
    elif style == 2:  # 卦象
        deco_svg = f'''
        <line x1="220" y1="100" x2="340" y2="100" stroke="{accent}" stroke-width="3" opacity="0.4"/>
        <line x1="220" y1="120" x2="340" y2="120" stroke="{accent}" stroke-width="3" opacity="0.4"/>
        <line x1="220" y1="140" x2="280" y2="140" stroke="{accent}" stroke-width="3" opacity="0.4"/>
        <line x1="295" y1="140" x2="340" y2="140" stroke="{accent}" stroke-width="3" opacity="0.4"/>
        <line x1="220" y1="160" x2="340" y2="160" stroke="{accent}" stroke-width="3" opacity="0.4"/>
        <line x1="220" y1="180" x2="280" y2="180" stroke="{accent}" stroke-width="3" opacity="0.4"/>
        <line x1="295" y1="180" x2="340" y2="180" stroke="{accent}" stroke-width="3" opacity="0.4"/>
        '''
    elif style == 3:  # 三层同心圆
        deco_svg = f'''
        <circle cx="280" cy="140" r="90" fill="none" stroke="{accent}" stroke-width="1" opacity="0.2"/>
        <circle cx="280" cy="140" r="70" fill="none" stroke="{accent}" stroke-width="1" opacity="0.3"/>
        <circle cx="280" cy="140" r="50" fill="none" stroke="{accent}" stroke-width="2" opacity="0.5"/>
        <text x="280" y="160" font-family="serif" font-size="48" fill="{accent}" text-anchor="middle" font-weight="900" opacity="0.8">{initial}</text>
        '''
    elif style == 4:  # 装饰横线
        deco_svg = f'''
        <line x1="180" y1="80" x2="380" y2="80" stroke="{accent}" stroke-width="1" opacity="0.4"/>
        <line x1="180" y1="200" x2="380" y2="200" stroke="{accent}" stroke-width="1" opacity="0.4"/>
        <line x1="200" y1="140" x2="240" y2="140" stroke="{accent}" stroke-width="2" opacity="0.5"/>
        <line x1="320" y1="140" x2="360" y2="140" stroke="{accent}" stroke-width="2" opacity="0.5"/>
        <text x="280" y="170" font-family="serif" font-size="64" fill="{accent}" text-anchor="middle" font-weight="900" opacity="0.7">{initial}</text>
        '''
    else:  # 斜线
        deco_svg = f'''
        <line x1="160" y1="220" x2="220" y2="80" stroke="{accent}" stroke-width="1" opacity="0.3"/>
        <line x1="200" y1="220" x2="260" y2="80" stroke="{accent}" stroke-width="1" opacity="0.3"/>
        <line x1="240" y1="220" x2="300" y2="80" stroke="{accent}" stroke-width="1" opacity="0.3"/>
        <line x1="280" y1="220" x2="340" y2="80" stroke="{accent}" stroke-width="1" opacity="0.3"/>
        <line x1="320" y1="220" x2="380" y2="80" stroke="{accent}" stroke-width="1" opacity="0.3"/>
        <text x="280" y="170" font-family="serif" font-size="64" fill="{accent}" text-anchor="middle" font-weight="900" opacity="0.6">{initial}</text>
        '''
    
    # 名称文字
    name_cn_size = 28 if len(name) <= 4 else 22
    name_en_size = 12 if len(en) <= 14 else 10
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 240" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="bg{idx}" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="{c1}"/>
      <stop offset="60%" stop-color="{c2}"/>
      <stop offset="100%" stop-color="#050302"/>
    </radialGradient>
    <linearGradient id="text{idx}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f5e1a4"/>
      <stop offset="100%" stop-color="#8b6a2b"/>
    </linearGradient>
  </defs>
  <rect width="560" height="240" fill="url(#bg{idx})"/>
  <!-- 噪点纹理 -->
  <rect width="560" height="240" fill="url(#bg{idx})" opacity="0.5"/>
  <!-- 装饰元素 -->
  {deco_svg}
  <!-- 底部名称 -->
  <rect x="0" y="200" width="560" height="40" fill="rgba(0,0,0,0.5)"/>
  <text x="20" y="226" font-family="serif" font-size="{name_cn_size}" fill="url(#text{idx})" font-weight="900" letter-spacing="0.1em">{name}</text>
  <text x="540" y="226" font-family="serif" font-size="{name_en_size}" fill="#a78a5a" text-anchor="end" letter-spacing="0.1em">{en[:18]}</text>
</svg>'''
    return svg

# 生成
out_meta = {}
for i, g in enumerate(games):
    svg = make_cover(g, i)
    fname = f'cover_{g["id"]}.svg'
    fpath = f'/workspace/covers/{fname}'
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(svg)
    out_meta[g['id']] = fname

print(f'生成 {len(out_meta)} 个 SVG 封面')
print('示例:', list(out_meta.items())[:3])
