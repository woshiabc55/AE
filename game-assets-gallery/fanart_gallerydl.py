#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
基于 gallery-dl 的二创图片抓取适配器
==============================
调用 gallery-dl 抓取各平台二创图片，并转换为本项目 data.json 格式。

注意：
- Pixiv、Twitter/X 等平台需要登录凭证或 cookies，否则无法抓取。
- Bilibili 搜索、LOFTER 标签页不被 gallery-dl 直接支持，需要自行提供作品/文章 URL。
- 运行前请先在 games.json 中配置 fanartSources 与 fanartEnabled。
"""

import json
import logging
import re
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("fanart_gallerydl")

ROOT = Path(__file__).resolve().parent
ASSETS_DIR = ROOT / "assets"
GAMES_JSON = ROOT / "games.json"
DATA_JSON = ASSETS_DIR / "data.json"
GDL_CONFIG = ROOT / "gallery-dl.conf"

# gallery-dl 能直接处理的关键词搜索 URL 模板
SEARCH_TEMPLATES = {
    "pixiv": "https://www.pixiv.net/en/tags/{keyword}/artworks",
    "twitter": "https://twitter.com/search?q={keyword}&f=image",
}

# 不需要关键词、直接按页面抓取的 URL 模板（需用户提供具体 URL）
DIRECT_TEMPLATES = {
    "bilibili": "https://www.bilibili.com/opus/{id}",
    "lofter": "https://{blog}.lofter.com/post/{post_id}",
}


def load_json(path: Path) -> Dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_json(data, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def safe_filename(text: str, max_len: int = 80) -> str:
    text = text.strip().replace(" ", "_")
    text = re.sub(r'[\\/:*?"<>|]', "_", text)
    return text[:max_len]


def build_gallerydl_config() -> str:
    """生成 gallery-dl 配置文件，开启元数据写入与限速。"""
    return """{
    "extractor": {
        "filename": "{category}_{artist!S}_{id!S}_{num}.{extension}",
        "sleep-request": "0.5-1.5",
        "sleep-extractor": "1.0-2.0",
        "write-metadata": true,
        "cookies": null,
        "pixiv": {
            "refresh-token": null
        },
        "twitter": {
            "cookies": null
        }
    },
    "downloader": {
        "filesize-min": "1k",
        "filesize-max": "50M",
        "mtime": true,
        "part": true,
        "part-directory": null,
        "progress": 1,
        "rate": null,
        "retries": 4,
        "timeout": 30.0,
        "verify": true
    },
    "output": {
        "mode": "color",
        "level": "info",
        "log": ["[%(levelname)s] %(message)s"],
        "logfile": null,
        "unsupportedfile": null
    },
    "netrc": false
}
"""


def run_gallerydl(url: str, dest: Path, max_items: int = 20) -> bool:
    """调用 gallery-dl 下载单条 URL 的图片。"""
    cmd = [
        sys.executable, "-m", "gallery_dl",
        "--range", f"1-{max_items}",
        "--dest", str(dest),
        "--config", str(GDL_CONFIG),
        url,
    ]
    logger.info(f"执行: {' '.join(cmd)}")
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300,
        )
        if result.returncode != 0:
            logger.warning(f"gallery-dl 退出码 {result.returncode}")
            logger.warning(result.stderr.strip() or result.stdout.strip())
            return False
        return True
    except subprocess.TimeoutExpired:
        logger.error("gallery-dl 执行超时")
        return False
    except Exception as exc:
        logger.error(f"gallery-dl 执行异常: {exc}")
        return False


def parse_metadata_file(meta_path: Path) -> Optional[Dict]:
    """解析 gallery-dl 生成的 *_metadata.json 文件。"""
    try:
        with meta_path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def collect_downloaded_assets(game_id: str, platform: str, game_name: str, category: str) -> List[Dict]:
    """扫描 gallery-dl 下载目录，将其转换为本项目资源条目。"""
    platform_dir = ASSETS_DIR / game_id / "fanart" / platform
    if not platform_dir.exists():
        return []

    results: List[Dict] = []
    seen_ids = set()

    for img_path in platform_dir.iterdir():
        if not img_path.is_file():
            continue
        if img_path.suffix == ".json":
            continue

        meta_path = img_path.with_suffix(img_path.suffix + "_metadata.json")
        if not meta_path.exists():
            meta_path = img_path.parent / (img_path.stem + "_metadata.json")

        meta = parse_metadata_file(meta_path) if meta_path.exists() else {}

        # 提取画师/作者
        artist = (
            meta.get("user", {}).get("name")
            or meta.get("author", {}).get("name")
            or meta.get("artist")
            or meta.get("user", {}).get("username")
            or ""
        )
        artist_id = (
            str(meta.get("user", {}).get("id", ""))
            or str(meta.get("author", {}).get("id", ""))
            or ""
        )
        source_url = meta.get("url") or meta.get("source") or ""
        title = meta.get("title") or meta.get("content") or img_path.stem
        tags = meta.get("tags") or []
        if isinstance(tags, str):
            tags = [tags]
        tags = [str(t) for t in tags][:5]

        # 生成唯一 ID
        asset_id = f"{game_id}-fanart-{platform}-{img_path.stem}"
        if asset_id in seen_ids:
            continue
        seen_ids.add(asset_id)

        results.append({
            "id": asset_id,
            "gameId": game_id,
            "gameName": game_name,
            "category": category,
            "type": "fanart",
            "name": game_name,
            "subName": title[:80],
            "artist": artist,
            "artistId": artist_id,
            "sourceUrl": source_url,
            "authorizationStatus": "unknown",
            "remoteUrl": source_url,
            "localPath": str(img_path.relative_to(ROOT).as_posix()),
            "tags": ["二创", platform] + tags,
        })

    return results


def fetch_fanart_with_gallerydl(config: Dict) -> List[Dict]:
    """根据 games.json 配置，使用 gallery-dl 抓取二创。"""
    games = config.get("games", [])
    fanart_sources = config.get("fanartSources", {})
    results: List[Dict] = []

    # 写出 gallery-dl 配置文件
    GDL_CONFIG.write_text(build_gallerydl_config(), encoding="utf-8")

    for platform, source_config in fanart_sources.items():
        if not source_config.get("enabled", False):
            continue

        for game in games:
            if not game.get("fanartEnabled", False):
                continue

            game_id = game["id"]
            game_name = game["name"]
            category = game["category"]
            keywords = game.get("fanartKeywords", [game_name])

            platform_dest = ASSETS_DIR / game_id / "fanart" / platform
            if platform in SEARCH_TEMPLATES:
                template = SEARCH_TEMPLATES[platform]
                for keyword in keywords:
                    url = template.format(keyword=keyword)
                    logger.info(f"[{game_name}] 抓取 {platform}: {keyword}")
                    ok = run_gallerydl(
                        url,
                        platform_dest,
                        max_items=game.get("fanartMaxPerKeyword", 20),
                    )
                    if ok:
                        assets = collect_downloaded_assets(game_id, platform, game_name, category)
                        results.extend(assets)
                        logger.info(f"[{game_name}] {platform} 收录 {len(assets)} 张")
            else:
                logger.warning(
                    f"[{game_name}] {platform} 不支持关键词搜索，"
                    f"请在 {DIRECT_TEMPLATES.get(platform, '对应模板')} 中提供具体 URL"
                )

    return results


def merge_with_existing(new_assets: List[Dict]) -> List[Dict]:
    """与现有 data.json 合并，去重。"""
    existing: List[Dict] = []
    if DATA_JSON.exists():
        existing = load_json(DATA_JSON)
        if not isinstance(existing, list):
            existing = []

    existing_ids = {item["id"] for item in existing}
    merged = existing.copy()
    for asset in new_assets:
        if asset["id"] not in existing_ids:
            merged.append(asset)
            existing_ids.add(asset["id"])
    return merged


def main():
    config = load_json(GAMES_JSON)
    new_assets = fetch_fanart_with_gallerydl(config)
    if not new_assets:
        logger.warning("未抓到任何二创素材。请检查：\n"
                       "1. games.json 中是否启用 fanartEnabled 与 fanartSources\n"
                       "2. Pixiv/Twitter 是否已配置 refresh-token / cookies\n"
                       "3. Bilibili/LOFTER 是否提供了具体作品 URL")
        return

    merged = merge_with_existing(new_assets)
    save_json(merged, DATA_JSON)
    logger.info(f"已保存 {len(new_assets)} 条二创记录，data.json 共 {len(merged)} 条")


if __name__ == "__main__":
    main()
