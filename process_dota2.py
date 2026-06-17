"""Dota 2 完整英雄图鉴 (基于 OpenDota 数据)"""
import json
import urllib.request

# 获取完整英雄数据
with open('/tmp/dota2.json') as f:
    heroes = json.load(f)

# Dota 2 图像 CDN
# 头像: http://cdn.dota2.com/apps/dota2/images/heroes/{name}_sb.png (small portrait)
# 立绘: http://cdn.dota2.com/apps/dota2/images/heroes/{name}_full.png (full)
# 注: name 是 npc_dota_hero_xxx, 需要去掉前缀

ATTR_MAP = {
    'str': {'name': '力量', 'cls': 'type-warrior'},
    'agi': {'name': '敏捷', 'cls': 'type-marksman'},
    'int': {'name': '智力', 'cls': 'type-mage'},
    'all': {'name': '全才', 'cls': 'type-support'},
}
ROLE_MAP_CN = {
    'Carry': '核心', 'Support': '辅助', 'Nuker': '爆发', 'Disabler': '控制',
    'Jungler': '打野', 'Durable': '耐久', 'Escape': '逃生', 'Pusher': '推进',
    'Initiator': '先手',
}

out = []
for h in heroes:
    raw_name = h['name']  # npc_dota_hero_antimage
    short = raw_name.replace('npc_dota_hero_', '')
    attr_info = ATTR_MAP.get(h.get('primary_attr', 'all'), {'name': '其他', 'cls': 'type-other'})
    portrait = f"http://cdn.dota2.com/apps/dota2/images/heroes/{short}_sb.png"
    full = f"http://cdn.dota2.com/apps/dota2/images/heroes/{short}_full.png"
    roles_cn = [ROLE_MAP_CN.get(r, r) for r in h.get('roles', [])]
    # Dota 2 没有传统皮肤系统, 共有 1 套(Arcana/Immortal 等通过装备系统)
    # 用其全图作为唯一"造型"
    out.append({
        'ename': h['id'],
        'cname': h['localized_name'],
        'title': ' · '.join(roles_cn) if roles_cn else h.get('attack_type', ''),
        'id_name': short,
        'portrait': portrait,
        'skins': [{'name': h['localized_name'] + ' 立绘', 'img': full}],
        'type': attr_info['name'],
        'type_cls': attr_info['cls'],
        'type2': h.get('attack_type', ''),
        'primary_attr': h.get('primary_attr', ''),
    })

with open('/workspace/dota2_data.js', 'w', encoding='utf-8') as f:
    f.write('// Dota 2 完整英雄图鉴 (OpenDota + Valve CDN)\n')
    f.write('const DOTA2_DATA = ' + json.dumps(out, ensure_ascii=False) + ';\n')
print(f'Dota 2: {len(out)} 英雄')
print('前 3:', [(h['cname'], h['portrait']) for h in out[:3]])
