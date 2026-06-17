"""星穹铁道: 整理角色 + 命之座 数据"""
import json
with open('/workspace/starrail_chars.json') as f:
    raw = json.load(f)

# 基础 CDN 尝试
SR_BASE = "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/"

PATH_CN = {
    'Knight': '存护', 'Rogue': '巡猎', 'Mage': '智识', 'Shaman': '同谐',
    'Warlock': '虚无', 'Warrior': '毁灭',
    'Preservation': '存护', 'Harmony': '同谐', 'Hunt': '巡猎',
    'Erudition': '智识', 'Destruction': '毁灭', 'Nihility': '虚无', 'Abundance': '丰饶',
}
ELEMENT_CN = {
    'Ice': '冰', 'Fire': '火', 'Wind': '风', 'Lightning': '雷',
    'Quantum': '量子', 'Imaginary': '虚数', 'Physical': '物理',
}

out = []
for cid, c in raw.items():
    element = ELEMENT_CN.get(c.get('element', ''), c.get('element', ''))
    path = PATH_CN.get(c.get('path', ''), c.get('path', ''))
    portrait = SR_BASE + c.get('portrait', '')
    icon = SR_BASE + c.get('icon', '')
    # 命之座 = 6 个 rank, 多数角色没有"皮肤"概念
    # 这里把所有 rank 名称当皮肤名
    skins = []
    # 默认造型 = icon
    skins.append({'name': '默认造型', 'img': icon})
    # 高清立绘
    if c.get('portrait'):
        skins.append({'name': '角色立绘', 'img': portrait})
    out.append({
        'ename': int(cid) if cid.isdigit() else cid,
        'cname': c.get('name', ''),
        'title': path,
        'id_name': c.get('tag', ''),
        'portrait': icon,
        'skins': skins,
        'type': element,
        'type2': path,
        'rarity': c.get('rarity', 0),
    })

with open('/workspace/starrail_data.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print(f'星穹铁道: {len(out)} 角色')
print('前 5 角色:')
for c in out[:5]:
    print(f'  {c["cname"]} ({c["rarity"]}★) - {c["type"]}/{c["type2"]}')
