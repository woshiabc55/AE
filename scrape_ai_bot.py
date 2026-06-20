import requests
from bs4 import BeautifulSoup
import csv
import json
import time
import re
from urllib.parse import urljoin, urlparse

BASE = 'https://ai-bot.cn'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
}

CATEGORIES = [
    ('AI写作工具', '/favorites/ai-writing-tools/'),
    ('AI图像工具', '/favorites/ai-image-tools/'),
    ('AI视频工具', '/favorites/ai-video-tools/'),
    ('AI办公工具', '/favorites/ai-office-tools/'),
    ('AI智能体', '/favorites/ai-agent/'),
    ('AI聊天助手', '/favorites/ai-chatbots/'),
    ('AI编程工具', '/favorites/ai-programming-tools/'),
    ('AI设计工具', '/favorites/ai-design-tools/'),
    ('AI音频工具', '/favorites/ai-audio-tools/'),
    ('AI搜索引擎', '/favorites/ai-search-engines/'),
    ('AI开发平台', '/favorites/ai-frameworks/'),
    ('AI学习网站', '/favorites/websites-to-learn-ai/'),
    ('AI训练模型', '/favorites/ai-models/'),
    ('AI内容检测', '/favorites/ai-content-detection-and-optimization-tools/'),
    ('AI提示指令', '/favorites/ai-prompt-tools/'),
]


def fetch(url):
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        resp.encoding = resp.apparent_encoding
        return resp.text
    except Exception as e:
        print(f'Error fetching {url}: {e}')
        return None


def parse_cards(html, category):
    soup = BeautifulSoup(html, 'lxml')
    cards = soup.find_all('div', class_='url-card')
    items = []
    for card in cards:
        a = card.find('a', class_='card')
        if not a:
            continue
        name_tag = card.find('div', class_='text-sm overflowClip_1')
        name = name_tag.get_text(strip=True) if name_tag else ''
        desc_tag = card.find('p', class_='overflowClip_1')
        description = desc_tag.get_text(strip=True) if desc_tag else ''
        if not description:
            description = a.get('title', '')
        detail_url = urljoin(BASE, a.get('href', ''))
        external_url = a.get('data-url', '')
        # if data-url missing and href is internal, use detail page later? keep both
        img_tag = card.find('img')
        icon_url = img_tag.get('data-src') or img_tag.get('src', '') if img_tag else ''
        # normalize icon
        if icon_url and icon_url.startswith('/'):
            icon_url = urljoin(BASE, icon_url)
        site_id = a.get('data-id', '')
        items.append({
            'category': category,
            'name': name,
            'description': description,
            'detail_url': detail_url,
            'external_url': external_url,
            'icon_url': icon_url,
            'site_id': site_id,
        })
    return items, soup


def get_last_page(soup):
    nav = soup.find('div', class_='posts-nav')
    if not nav:
        return 1
    nums = []
    for a in nav.find_all('a', href=True):
        text = a.get_text(strip=True)
        if text.isdigit():
            nums.append(int(text))
    return max(nums) if nums else 1


def scrape_category(name, path):
    items = []
    first_url = urljoin(BASE, path)
    html = fetch(first_url)
    if not html:
        return items
    page_items, soup = parse_cards(html, name)
    items.extend(page_items)
    last = get_last_page(soup)
    print(f'[{name}] page 1/{last}: {len(page_items)} items')
    if not page_items:
        return items
    for p in range(2, min(last, 100) + 1):
        page_url = urljoin(BASE, f'{path.rstrip("/")}/page/{p}/')
        html = fetch(page_url)
        if not html:
            continue
        page_items, _ = parse_cards(html, name)
        if not page_items:
            print(f'[{name}] page {p}/{last}: no items, stopping')
            break
        items.extend(page_items)
        print(f'[{name}] page {p}/{last}: {len(page_items)} items')
        time.sleep(0.5)
    return items


def main():
    all_items = []
    for name, path in CATEGORIES:
        items = scrape_category(name, path)
        all_items.extend(items)
        print(f'[{name}] total: {len(items)}')
        print('-' * 40)
        time.sleep(1)

    # deduplicate by detail_url
    seen = set()
    unique = []
    for item in all_items:
        key = item['detail_url']
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)

    print(f'\nTotal unique items: {len(unique)}')

    # Save CSV
    csv_path = '/workspace/ai-bot-projects.csv'
    with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=['category', 'name', 'description', 'external_url', 'detail_url', 'icon_url', 'site_id'])
        writer.writeheader()
        writer.writerows(unique)
    print(f'Saved CSV: {csv_path}')

    # Save JSON
    json_path = '/workspace/ai-bot-projects.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(unique, f, ensure_ascii=False, indent=2)
    print(f'Saved JSON: {json_path}')

    # Save Markdown table sample
    md_path = '/workspace/ai-bot-projects.md'
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write('# AI工具集项目收录\n\n')
        f.write(f'来源：[ai-bot.cn]({BASE})，共收录 {len(unique)} 个项目。\n\n')
        f.write('| 分类 | 名称 | 描述 | 官网链接 | 详情页 |\n')
        f.write('| --- | --- | --- | --- | --- |\n')
        for item in unique:
            name = item['name'].replace('|', '\\|')
            desc = item['description'].replace('|', '\\|').replace('\n', ' ')
            cat = item['category'].replace('|', '\\|')
            ext = item['external_url'] or ''
            detail = item['detail_url']
            f.write(f'| {cat} | {name} | {desc} | [{ext}]({ext}) | [{detail}]({detail}) |\n')
    print(f'Saved Markdown: {md_path}')


if __name__ == '__main__':
    main()
