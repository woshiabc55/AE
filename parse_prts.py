import json, re

# 重新抓取并解析(已有 wikitext 但需要重新提取)
# 为节省时间, 直接用新的字段名再次解析
# 但原始 wikitext 已经在 /tmp 文件丢失, 需重新抓
# 改为: 用新逻辑 + 旧 JSON 中的 imgs/has_text
# 但 has_text 不足以重新提取, 需重新抓
# 妥协: 重新快速抓一次, 用新正则
import urllib.request, urllib.parse, time

# 加载干员列表
import os
# 重新调一次 API 取干员列表
url = 'https://prts.wiki/api.php?action=query&list=categorymembers&cmtitle=Category:%E5%B9%B2%E5%91%98&cmlimit=500&format=json'
with urllib.request.urlopen(url, timeout=15) as r:
    members = json.load(r)['query']['categorymembers']

ops = []
for m in members:
    t = m['title']
    if '(' in t and ')' in t:
        continue
    if t.startswith('Category:') or t == '干员' or t == '12F':
        continue
    ops.append(t)
ops = list(dict.fromkeys(ops))
print(f'共 {len(ops)} 干员')

# 抓取并解析 (用新字段)
results = {}
for i, name in enumerate(ops):
    try:
        url = 'https://prts.wiki/api.php?action=parse&page=' + urllib.parse.quote(name) + '&format=json&prop=wikitext'
        with urllib.request.urlopen(url, timeout=10) as r:
            d = json.load(r)
        if 'parse' in d:
            wt = d['parse']['wikitext']['*']
            info = {'name': name}
            # 稀有度 (star)
            m = re.search(r'\|稀有度\s*=\s*(\d+)', wt)
            if m: info['star'] = int(m.group(1))
            # 职业
            m = re.search(r'\|职业\s*=\s*([^\n|]+)', wt)
            if m: info['profession'] = m.group(1).strip()
            # 国家
            m = re.search(r'\|所属国家\s*=\s*([^\n|]+)', wt)
            if m: info['faction'] = m.group(1).strip()
            # 干员ID
            m = re.search(r'\|干员id\s*=\s*(\S+)', wt)
            if m: info['char_id'] = m.group(1).strip()
            # 皮肤 (时装)
            skins = []
            for sm in re.finditer(r'\|时装\d+名称\s*=\s*([^\n|]+)', wt):
                skins.append(sm.group(1).strip())
            info['skins'] = skins
            # 只保留有职业的可玩干员
            if 'profession' in info and 'star' in info:
                results[name] = info
    except Exception as e:
        pass
    if (i+1) % 30 == 0:
        print(f'  {i+1}/{len(ops)}', flush=True)

with open('/workspace/prts_data/operators_v2.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=1)
print(f'保存 {len(results)} 个可玩干员')
# 星级分布
star_count = {}
for v in results.values():
    s = v.get('star', 0)
    star_count[s] = star_count.get(s, 0) + 1
for s in sorted(star_count.keys(), reverse=True):
    print(f'  {s}星: {star_count[s]}')
