#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成示例二创占位图，仅用于演示画廊的二创展示与授权筛选功能。
图片为程序生成的纯色占位图，带有 "FANART DEMO" 水印，并非真实二创作品。
"""

import json
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
ASSETS_DIR = ROOT / "assets"
DATA_JSON = ASSETS_DIR / "data.json"

GAMES = [
    {"id": "honor-of-kings", "name": "王者荣耀", "category": "MOBA", "keywords": ["李白", "貂蝉", "孙尚香"]},
    {"id": "genshin-impact", "name": "原神", "category": "开放世界/RPG", "keywords": ["胡桃", "雷电将军", "芙宁娜"]},
    {"id": "arknights", "name": "明日方舟", "category": "开放世界/RPG", "keywords": ["阿米娅", "能天使", "凯尔希"]},
]

PLATFORMS = ["pixiv", "twitter", "bilibili", "lofter"]
AUTH_STATUSES = ["unknown", "personal_only", "authorized", "no_repost"]


def load_json(path: Path):
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
        return data if isinstance(data, list) else []


def save_json(data, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def generate_placeholder(path: Path, game_name: str, keyword: str, platform: str, idx: int):
    path.parent.mkdir(parents=True, exist_ok=True)

    w, h = 600, 800
    hue = random.randint(0, 360)
    color = f"hsl({hue}, 60%, 20%)"
    accent = f"hsl({hue}, 80%, 60%)"

    img = Image.new("RGB", (w, h), color)
    draw = ImageDraw.Draw(img)

    # 绘制装饰性几何图形
    for _ in range(8):
        x1, y1 = random.randint(0, w), random.randint(0, h)
        x2, y2 = x1 + random.randint(50, 200), y1 + random.randint(50, 200)
        draw.rectangle([x1, y1, x2, y2], fill=f"hsl({random.randint(0, 360)}, 50%, 30%)", outline=accent, width=2)

    # 文字
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
    except Exception:
        font_large = ImageFont.load_default()
        font_small = font_large

    # 居中文本
    text_demo = "FANART DEMO"
    text_game = f"{game_name} · {keyword}"
    text_platform = f"来源: {platform} #{idx}"

    bbox = draw.textbbox((0, 0), text_demo, font=font_large)
    draw.text(((w - (bbox[2] - bbox[0])) // 2, h // 2 - 40), text_demo, fill="white", font=font_large)

    bbox = draw.textbbox((0, 0), text_game, font=font_small)
    draw.text(((w - (bbox[2] - bbox[0])) // 2, h // 2 + 20), text_game, fill=accent, font=font_small)

    bbox = draw.textbbox((0, 0), text_platform, font=font_small)
    draw.text(((w - (bbox[2] - bbox[0])) // 2, h // 2 + 60), text_platform, fill="white", font=font_small)

    # 授权状态水印
    status = random.choice(AUTH_STATUSES)
    status_text = f"授权: {status}"
    bbox = draw.textbbox((0, 0), status_text, font=font_small)
    draw.text(((w - (bbox[2] - bbox[0])) // 2, h - 60), status_text, fill="yellow", font=font_small)

    img.save(path, quality=85)
    return status


def main(count_per_game: int = 12):
    data = load_json(DATA_JSON)
    existing_ids = {item["id"] for item in data}
    random.seed(42)

    for game in GAMES:
        game_id = game["id"]
        game_name = game["name"]
        category = game["category"]
        keywords = game["keywords"]

        for i in range(count_per_game):
            platform = random.choice(PLATFORMS)
            keyword = random.choice(keywords)
            idx = i + 1
            filename = f"demo_{platform}_{keyword}_{idx}.jpg"
            local = ASSETS_DIR / game_id / "fanart" / platform / filename
            status = generate_placeholder(local, game_name, keyword, platform, idx)
            asset_id = f"{game_id}-fanart-demo-{platform}-{idx}"

            if asset_id in existing_ids:
                continue
            existing_ids.add(asset_id)

            data.append({
                "id": asset_id,
                "gameId": game_id,
                "gameName": game_name,
                "category": category,
                "type": "fanart",
                "name": keyword,
                "subName": f"示例二创 #{idx}",
                "artist": "示例画师",
                "artistId": f"demo_artist_{idx}",
                "sourceUrl": "https://example.com/fanart-demo",
                "authorizationStatus": status,
                "remoteUrl": "",
                "localPath": str(local.relative_to(ROOT).as_posix()),
                "tags": ["二创", platform, "示例"],
            })

    save_json(data, DATA_JSON)
    fanart_count = sum(1 for item in data if item.get("type") == "fanart")
    print(f"已生成 {len(data)} 条记录，其中二创示例 {fanart_count} 条")


if __name__ == "__main__":
    main()
