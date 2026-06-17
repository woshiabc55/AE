import json

with open('/workspace/prts_data/operators_v2.json') as f:
    ops = json.load(f)

# 类型映射
PROF_MAP = {
    '先锋': '先锋', '近卫': '近卫', '重装': '坦克', '狙击': '射手',
    '术师': '法师', '特种': '刺客', '辅助': '辅助', '医疗': '辅助',
    # 子分支可能不同, 这里全部归到主类型
}
# 类型tag class
PROF_CLS = {
    '先锋': 'type-support', '近卫': 'type-warrior', '重装': 'type-tank',
    '狙击': 'type-marksman', '术师': 'type-mage', '特种': 'type-assassin',
    '辅助': 'type-support', '医疗': 'type-support',
}

out = []
for name, info in ops.items():
    prof = info.get('profession', '其他')
    # 只取主职业 (中文)
    main_prof = prof.split('/')[0].strip()
    prof_cls = PROF_CLS.get(main_prof, 'type-other')
    # 标题: 职业 + 阵营
    title_parts = []
    if info.get('star'):
        title_parts.append(f"{info['star']}★")
    if info.get('faction'):
        title_parts.append(info['faction'])
    title = ' · '.join(title_parts) if title_parts else main_prof
    # 皮肤
    skins_objs = []
    # 默认立绘 (用头像)
    portrait = info.get('portrait', '')
    if portrait:
        skins_objs.append({'name': '默认', 'img': portrait})
    # 时装 - 用对应 skin 的 头像
    # 暂用同一张 portrait (简化: 所有 skin 共享一个图)
    for skin_name in info.get('skins', []):
        if skin_name and skin_name != '默认':
            skins_objs.append({'name': skin_name, 'img': portrait})
    out.append({
        'ename': info.get('char_id', name),
        'cname': name,
        'title': title,
        'id_name': info.get('char_id', ''),
        'portrait': portrait,
        'skins': skins_objs,
        'type': main_prof,
        'type_cls': prof_cls,
        'type2': '',
        'star': info.get('star', 0),
    })

# 排序: 按星级降序
out.sort(key=lambda x: (-x.get('star', 0), x['cname']))

with open('/workspace/arknights_data.js', 'w', encoding='utf-8') as f:
    f.write('// 明日方舟 干员图鉴 (PRTS wiki + 官方数据)\n')
    f.write('const ARKNIGHTS_DATA = ' + json.dumps(out, ensure_ascii=False) + ';\n')
print('ARK 干员:', len(out))
print('前 5:', [(h['cname'], h['star'], len(h['skins'])) for h in out[:5]])
