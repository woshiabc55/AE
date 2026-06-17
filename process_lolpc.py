"""LoL PC: 抓取所有 172 个英雄的详情，构建完整图鉴数据"""
import json, urllib.request, time, sys

LOL_PC_VER = "16.12.1"
LOL_PC_LANG = "zh_CN"

# 1. 加载英雄列表
with open('/workspace/lolpc_champions.json') as f:
    cl = json.load(f)
champ_list = list(cl['data'].values())
print(f'LoL PC 共 {len(champ_list)} 个英雄', file=sys.stderr)

# 2. 抓取详情
out = []
for i, c in enumerate(champ_list):
    cid = c['id']
    url = f"https://ddragon.leagueoflegends.com/cdn/{LOL_PC_VER}/data/{LOL_PC_LANG}/champion/{cid}.json"
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            d = json.load(r)
        info = d['data'][cid]
        # 收集皮肤 (排除默认皮肤 name == 'default')
        skins = []
        for s in info.get('skins', []):
            name = s.get('name', '').strip()
            num = s.get('num', 0)
            if not name or name.lower() == 'default':
                continue
            img = f"https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{cid}_{num}.jpg"
            skins.append({'name': name, 'img': img})
        # 角色立绘
        portrait = f"https://ddragon.leagueoflegends.com/cdn/{LOL_PC_VER}/img/champion/{cid}.png"
        # 角色定位
        tags = info.get('tags', [])
        TYPE_MAP_PC = {'Fighter': '战士', 'Tank': '坦克', 'Mage': '法师', 'Assassin': '刺客', 'Marksman': '射手', 'Support': '辅助'}
        type_cn = ','.join(TYPE_MAP_PC.get(t, t) for t in tags) or '其他'
        out.append({
            'ename': cid,
            'cname': info['name'],
            'title': info.get('title', ''),
            'id_name': cid,
            'portrait': portrait,
            'skins': skins,
            'type': type_cn.split(',')[0] if type_cn else '其他',
            'type2': type_cn.split(',')[1] if ',' in type_cn else '',
            'tags': tags,
        })
        if (i+1) % 20 == 0:
            print(f'  {i+1}/{len(champ_list)}', file=sys.stderr)
    except Exception as e:
        print(f'  ERR {cid}: {e}', file=sys.stderr)
    time.sleep(0.05)  # 礼貌

with open('/workspace/lolpc_data.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print(f'Wrote {len(out)} champions to /workspace/lolpc_data.json', file=sys.stderr)
