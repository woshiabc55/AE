import json, urllib.request, urllib.parse, time

with open('/workspace/prts_data/operators_v2.json') as f:
    ops = json.load(f)

names = list(ops.keys())
print('total:', len(names))

BATCH = 30
img_map = {}

for i in range(0, len(names), BATCH):
    batch = names[i:i+BATCH]
    titles = '|'.join(['File:头像 ' + n + '.png' for n in batch])
    url = 'https://prts.wiki/api.php?action=query&titles=' + urllib.parse.quote(titles) + '&prop=imageinfo&iiprop=url&format=json'
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            d = json.load(r)
        if 'query' in d:
            for pid, page in d['query'].get('pages', {}).items():
                title = page.get('title', '')
                cleaned = title.replace('文件:', '').replace('File:', '').replace('头像 ', '').replace('.png', '').strip()
                if 'imageinfo' in page:
                    img_map[cleaned] = page['imageinfo'][0]['url']
    except Exception as e:
        print('  batch err', i, e)
    if (i // BATCH) % 3 == 0:
        print('  ', i, '/', len(names), flush=True)
    time.sleep(0.3)

print('got', len(img_map))

matched = 0
for name, info in ops.items():
    if name in img_map:
        info['portrait'] = img_map[name]
        matched += 1
    else:
        info['portrait'] = ''

with open('/workspace/prts_data/operators_v2.json', 'w', encoding='utf-8') as f:
    json.dump(ops, f, ensure_ascii=False, indent=1)
print('matched', matched, '/', len(ops))
