#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
游戏官方设定图抓取框架
========================
仅输出代码框架，不内置任何受版权保护的资源。
用户自行运行脚本并承担所抓取素材的版权与合规责任。
"""

import argparse
import hashlib
import json
import logging
import random
import re
import time
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Dict, List, Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("scraper")

ROOT = Path(__file__).resolve().parent
ASSETS_DIR = ROOT / "assets"
GAMES_JSON = ROOT / "games.json"
DATA_JSON = ASSETS_DIR / "data.json"

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
]


def safe_filename(text: str, max_len: int = 80) -> str:
    """生成安全的本地文件名。"""
    text = text.strip().replace(" ", "_")
    text = re.sub(r'[\\/:*?"<>|]', "_", text)
    return text[:max_len]


class ScraperEngine:
    """通用下载引擎：会话管理、限速、重试、去重。"""

    def __init__(
        self,
        delay: tuple = (0.5, 1.5),
        retries: int = 3,
        timeout: int = 30,
        referer: Optional[str] = None,
    ):
        self.delay = delay
        self.retries = retries
        self.timeout = timeout
        self.referer = referer
        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": random.choice(USER_AGENTS),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            }
        )
        if referer:
            self.session.headers["Referer"] = referer
        self._downloaded_hashes: set = set()

    def get(self, url: str, **kwargs) -> requests.Response:
        """带重试的 GET 请求。"""
        last_exc = None
        for attempt in range(1, self.retries + 1):
            try:
                time.sleep(random.uniform(*self.delay))
                resp = self.session.get(url, timeout=self.timeout, **kwargs)
                resp.raise_for_status()
                return resp
            except Exception as exc:
                last_exc = exc
                logger.warning(f"请求失败 ({attempt}/{self.retries}): {url} -> {exc}")
                time.sleep(2 ** attempt)
        raise last_exc

    def download_image(
        self,
        url: str,
        dest: Path,
        meta: Optional[Dict] = None,
    ) -> Optional[Path]:
        """下载单张图片到目标路径，返回本地路径或 None。"""
        if not url or not url.startswith(("http://", "https://")):
            logger.warning(f"非法 URL，跳过: {url}")
            return None

        dest.parent.mkdir(parents=True, exist_ok=True)

        try:
            resp = self.get(url, stream=True)
            content = resp.content

            file_hash = hashlib.md5(content).hexdigest()
            if file_hash in self._downloaded_hashes:
                logger.debug(f"图片已存在（哈希去重）: {url}")
                return None
            self._downloaded_hashes.add(file_hash)

            suffix = Path(urlparse(url).path).suffix or ".jpg"
            if dest.suffix != suffix:
                dest = dest.with_suffix(suffix)

            dest.write_bytes(content)
            logger.info(f"已下载: {dest}")
            return dest
        except Exception as exc:
            logger.error(f"下载失败: {url} -> {exc}")
            return None


class BaseParser(ABC):
    """解析器基类。每个游戏实现一个子类。"""

    def __init__(self, game: Dict, engine: ScraperEngine):
        self.game = game
        self.engine = engine
        self.game_id = game["id"]
        self.game_name = game["name"]
        self.category = game["category"]
        self.brand_color = game.get("brandColor", "#ffffff")

    @abstractmethod
    def parse(self) -> List[Dict]:
        """
        返回资源列表，每个元素为：
        {
            "id": "...",
            "gameId": "...",
            "gameName": "...",
            "category": "...",
            "type": "hero" | "skin" | "...",
            "name": "...",
            "subName": "...",
            "remoteUrl": "...",
            "localPath": "...",
            "tags": [...],
        }
        """
        pass

    def _make_local_path(self, type_: str, name: str, filename: str) -> Path:
        return ASSETS_DIR / self.game_id / safe_filename(type_) / safe_filename(name) / safe_filename(filename)


class HonorOfKingsParser(BaseParser):
    """
    王者荣耀示例解析器。
    使用公开的英雄列表 JSON 与官方 CDN 皮肤图地址模式。
    注意：官方站点结构可能变化，需根据实际情况调整。
    """

    HEROLIST_URL = "https://pvp.qq.com/web201605/js/herolist.json"
    SKIN_BASE = "https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/{ename}/{ename}-bigskin-{idx}.jpg"

    def parse(self) -> List[Dict]:
        logger.info(f"[{self.game_name}] 开始抓取英雄列表: {self.HEROLIST_URL}")
        try:
            resp = self.engine.get(self.HEROLIST_URL)
            heroes = resp.json()
        except Exception as exc:
            logger.error(f"[{self.game_name}] 英雄列表获取失败: {exc}")
            return []

        results: List[Dict] = []
        for hero in heroes:
            ename = hero.get("ename")
            cname = hero.get("cname", "")
            title = hero.get("title", "")
            skin_names = hero.get("skin_name", "").split("|")

            if not ename or not cname:
                continue

            # 英雄原皮/默认海报
            hero_url = self.SKIN_BASE.format(ename=ename, idx=1)
            hero_path = self._make_local_path("hero", cname, f"{ename}_hero_1")
            local = self.engine.download_image(hero_url, hero_path)
            if local:
                results.append(
                    {
                        "id": f"{self.game_id}-hero-{ename}",
                        "gameId": self.game_id,
                        "gameName": self.game_name,
                        "category": self.category,
                        "type": "hero",
                        "name": cname,
                        "subName": title,
                        "remoteUrl": hero_url,
                        "localPath": str(local.relative_to(ROOT).as_posix()),
                        "tags": [hero.get("hero_type", "")],
                    }
                )

            # 皮肤
            for idx, skin_name in enumerate(skin_names, start=1):
                skin_name = skin_name.strip()
                if not skin_name or skin_name == cname:
                    continue
                skin_url = self.SKIN_BASE.format(ename=ename, idx=idx)
                skin_path = self._make_local_path("skin", cname, f"{ename}_skin_{idx}_{skin_name}")
                local = self.engine.download_image(skin_url, skin_path)
                if local:
                    results.append(
                        {
                            "id": f"{self.game_id}-skin-{ename}-{idx}",
                            "gameId": self.game_id,
                            "gameName": self.game_name,
                            "category": self.category,
                            "type": "skin",
                            "name": cname,
                            "subName": skin_name,
                            "remoteUrl": skin_url,
                            "localPath": str(local.relative_to(ROOT).as_posix()),
                            "tags": ["皮肤"],
                        }
                    )

        logger.info(f"[{self.game_name}] 抓取完成，共 {len(results)} 张")
        return results


class PlaceholderParser(BaseParser):
    """占位解析器：提示用户自行实现。"""

    def parse(self) -> List[Dict]:
        logger.warning(
            f"[{self.game_name}] 暂无解析器实现。请在 scraper.py 中新增 {self.game_id} 的解析器。"
        )
        return []


class GameRegistry:
    _parsers = {
        "honor_of_kings": HonorOfKingsParser,
        "placeholder": PlaceholderParser,
    }

    @classmethod
    def register(cls, name: str, parser_cls):
        cls._parsers[name] = parser_cls

    @classmethod
    def get(cls, name: str):
        return cls._parsers.get(name, PlaceholderParser)


def load_games(path: Path = GAMES_JSON) -> Dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_data(data: List[Dict], path: Path = DATA_JSON):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    logger.info(f"索引已保存: {path}（共 {len(data)} 条）")


def main():
    parser = argparse.ArgumentParser(description="游戏官方设定图抓取框架")
    parser.add_argument(
        "--games",
        "-g",
        nargs="+",
        help="指定要抓取的游戏 id，多个用空格分隔；默认抓取所有 enabled=true 的游戏",
    )
    parser.add_argument(
        "--delay",
        type=float,
        nargs=2,
        default=[0.5, 1.5],
        metavar=("MIN", "MAX"),
        help="请求间隔随机范围（秒），默认 0.5 1.5",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=3,
        help="失败重试次数，默认 3",
    )
    args = parser.parse_args()

    config = load_games()
    games = config.get("games", [])

    target_ids = set(args.games) if args.games else None
    enabled_games = [
        g
        for g in games
        if g.get("enabled", False) and (target_ids is None or g["id"] in target_ids)
    ]

    if not enabled_games:
        logger.warning("没有需要抓取的游戏。请在 games.json 中将目标游戏的 enabled 设为 true。")
        return

    engine = ScraperEngine(delay=tuple(args.delay), retries=args.retries)
    all_assets: List[Dict] = []

    for game in enabled_games:
        parser_cls = GameRegistry.get(game.get("parser", "placeholder"))
        parser_inst = parser_cls(game, engine)
        try:
            assets = parser_inst.parse()
            all_assets.extend(assets)
        except Exception as exc:
            logger.error(f"[{game['name']}] 解析异常: {exc}")

    save_data(all_assets)
    logger.info("全部完成。")


if __name__ == "__main__":
    main()
