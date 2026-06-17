import json
with open('/workspace/lolm_heros_correct.js') as f:
    heroes_raw = json.load(f)['heroList']
with open('/workspace/lolm_skins.js') as f:
    skins_raw = json.load(f)['skinList']

# 按 heroId 分组皮肤, 按 skinId 排序保持顺序
skins_by_hero = {}
for sid in sorted(skins_raw.keys()):
    s = skins_raw[sid]
    hid = s.get('heroId')
    skins_by_hero.setdefault(hid, []).append(s)

ROLE_MAP = {
    '法师': '法师', 'support': '辅助', 'tank': '坦克', '坦克': '坦克',
    '战士': '战士', 'assassin': '刺客', '刺客': '刺客',
    '射手': '射手', '辅助': '辅助',
}

out = []
total_skins = 0
for hid, h in heroes_raw.items():
    roles = h.get('roles', [])
    type_cn = ','.join(ROLE_MAP.get(r, r) for r in roles) or '其他'
    hero_skins = skins_by_hero.get(hid, [])
    portrait = h.get('avatar', '') or ''
    skins = []
    for i, s in enumerate(hero_skins):
        name = s.get('name', '').strip()
        poster = s.get('poster', '')
        if not name or not poster:
            continue
        if i == 0:  # 第一个是默认皮肤
            if not portrait:
                portrait = poster
            continue
        skins.append({'name': name, 'img': poster, 'quality': s.get('quality', '')})
    out.append({
        'ename': int(hid) if hid.isdigit() else hid,
        'cname': h.get('name', ''),
        'title': h.get('title', ''),
        'id_name': hid,
        'portrait': portrait,
        'skins': skins,
        'type': type_cn.split(',')[0] if type_cn else '其他',
        'type2': type_cn.split(',')[1] if ',' in type_cn else '',
        'roles': roles,
    })
    total_skins += len(skins)

with open('/workspace/lolm_data.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print(f'LoL手游: {len(out)} 英雄, 合计 {total_skins} 皮肤(排除默认)')
