import json

with open('/workspace/herolist.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

TYPE_MAP = {
    1: {'name': '战士', 'cls': 'type-warrior'},
    2: {'name': '法师', 'cls': 'type-mage'},
    3: {'name': '坦克', 'cls': 'type-tank'},
    4: {'name': '刺客', 'cls': 'type-assassin'},
    5: {'name': '射手', 'cls': 'type-marksman'},
    6: {'name': '辅助', 'cls': 'type-support'},
}

# Build normalized list
hero_list = []
for h in heroes:
    ename = h['ename']
    skins = [s.strip() for s in h.get('skin_name', '').split('|') if s.strip()]
    # de-dup preserving order
    seen = set()
    uniq_skins = []
    for s in skins:
        if s not in seen:
            seen.add(s)
            uniq_skins.append(s)
    t = h.get('hero_type', 0)
    t2 = h.get('hero_type2', 0)
    primary = TYPE_MAP.get(t, {'name': '其他', 'cls': 'type-other'})
    secondary = TYPE_MAP.get(t2, {}).get('name', '') if t2 else ''
    hero_list.append({
        'ename': ename,
        'cname': h['cname'],
        'title': h.get('title', ''),
        'id_name': h.get('id_name', ''),
        'skins': uniq_skins,
        'type': primary['name'],
        'type_cls': primary['cls'],
        'type2': secondary,
    })

print(f'Generated {len(hero_list)} heroes')
with open('/workspace/hero_data.js', 'w', encoding='utf-8') as f:
    f.write('const HERO_DATA = ' + json.dumps(hero_list, ensure_ascii=False) + ';\n')
print('Wrote /workspace/hero_data.js')
