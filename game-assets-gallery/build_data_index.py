#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
扫描 assets/ 目录下已下载的图片，生成/合并 data.json 索引。
用于在 scraper 运行中断或需要补充示例数据时快速重建索引。
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ASSETS_DIR = ROOT / "assets"
DATA_JSON = ASSETS_DIR / "data.json"
GAMES_JSON = ROOT / "games.json"


def load_json(path: Path):
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_json(data, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def make_id(*parts) -> str:
    import hashlib
    raw = "|".join(str(p) for p in parts)
    return hashlib.md5(raw.encode("utf-8")).hexdigest()[:16]


def scan_assets():
    games_config = load_json(GAMES_JSON)
    games = {g["id"]: g for g in games_config.get("games", [])}
    results = []

    for game_dir in ASSETS_DIR.iterdir():
        if not game_dir.is_dir():
            continue
        game_id = game_dir.name
        game = games.get(game_id, {})
        game_name = game.get("name", game_id)
        category = game.get("category", "未知")

        for type_dir in game_dir.iterdir():
            if not type_dir.is_dir():
                continue
            type_ = type_dir.name  # hero / skin / fanart

            if type_ == "fanart":
                for platform_dir in type_dir.iterdir():
                    if not platform_dir.is_dir():
                        continue
                    platform = platform_dir.name
                    for img_path in platform_dir.rglob("*"):
                        if not img_path.is_file() or img_path.suffix in (".json",):
                            continue
                        asset_id = f"{game_id}-fanart-{platform}-{make_id(img_path.name)}"
                        results.append({
                            "id": asset_id,
                            "gameId": game_id,
                            "gameName": game_name,
                            "category": category,
                            "type": "fanart",
                            "name": game_name,
                            "subName": img_path.stem[:80],
                            "artist": "",
                            "artistId": "",
                            "sourceUrl": "",
                            "authorizationStatus": "unknown",
                            "remoteUrl": "",
                            "localPath": str(img_path.relative_to(ROOT).as_posix()),
                            "tags": ["二创", platform],
                        })
            else:
                for name_dir in type_dir.iterdir():
                    if not name_dir.is_dir():
                        continue
                    name = name_dir.name
                    for img_path in name_dir.rglob("*"):
                        if not img_path.is_file():
                            continue
                        sub_name = img_path.stem.split("_")[-1] if "_" in img_path.stem else img_path.stem
                        asset_id = f"{game_id}-{type_}-{make_id(name, sub_name)}"
                        results.append({
                            "id": asset_id,
                            "gameId": game_id,
                            "gameName": game_name,
                            "category": category,
                            "type": type_,
                            "name": name,
                            "subName": sub_name,
                            "artist": "",
                            "artistId": "",
                            "sourceUrl": "",
                            "authorizationStatus": "official",
                            "remoteUrl": "",
                            "localPath": str(img_path.relative_to(ROOT).as_posix()),
                            "tags": ["官方", type_],
                        })

    return results


def main():
    assets = scan_assets()
    save_json(assets, DATA_JSON)
    print(f"已生成 data.json，共 {len(assets)} 条记录")


if __name__ == "__main__":
    main()
