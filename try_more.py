import urllib.request, json, re, time

UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

def fetch(url, timeout=15):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read().decode('utf-8', errors='ignore')
    except Exception as e:
        return None

# 1. genshin-impact.fandom.com
print('=== genshin-impact.fandom.com ===')
html = fetch('https://genshin-impact.fandom.com/wiki/Character/List')
if html:
    print('  size:', len(html))
    # 查找角色名
    names = re.findall(r'<td[^>]*>\s*<a[^>]+title="([^"]+)"', html)
    chars = [n for n in names if n and not n.startswith('Category') and len(n) < 30]
    print(f'  角色: {len(chars)}')
    for c in chars[:10]:
        print(f'    {c}')

# 2. azurlane fandom
print()
print('=== azurlane.koumakan.jp ===')
html = fetch('https://azurlane.koumakan.jp/wiki/List_of_Ships')
if html:
    print('  size:', len(html))
    names = re.findall(r'<a[^>]+title="([^"]+)"[^>]*>', html)
    chars = [n for n in names if 'Ship' not in n and 'Category' not in n and len(n) < 50]
    chars = list(set(chars))
    print(f'  链接: {len(chars)}')
    for c in chars[:10]:
        print(f'    {c}')

# 3. 鸣潮 - kuro.wiki
print()
print('=== kuro.wiki ===')
html = fetch('https://kuro.wiki/%E8%B7%B3%E8%A7%86%E8%90%BD%E5%9C%B0')
if html:
    print('  size:', len(html))

# 4. prts - 阿米娅 page (再次测)
print()
print('=== prts (more) ===')
html = fetch('https://prts.wiki/api.php?action=query&list=categorymembers&cmtitle=Category:%E6%97%B6%E8%A3%85%E4%B8%80%E8%A7%88&cmlimit=500&format=json')
if html:
    d = json.loads(html)
    members = d['query']['categorymembers']
    print(f'  时装一览: {len(members)}')
    for m in members[:5]:
        print(f'    {m["title"]}')
