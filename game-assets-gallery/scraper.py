#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
游戏官方设定图与二创图片抓取框架
=====================================
仅输出代码框架，不内置任何受版权保护的资源。
用户自行运行脚本并承担所抓取素材的版权与合规责任。

数据字段说明：
- id: 唯一标识
- gameId / gameName / category: 所属游戏与分类
- type: 资源类型（hero / skin / fanart / ...）
- name / subName: 角色名 / 作品标题
- artist: 画师名（二创必填）
- artistId: 画师平台 ID
- sourceUrl: 原作品链接
- authorizationStatus: 授权状态
    - unknown: 未知
    - personal_only: 仅限个人本地参考
    - authorized: 已获得作者授权
    - no_repost: 作者明确禁止转载
- remoteUrl: 图片远程地址
- localPath: 本地相对路径
- tags: 标签数组
"""

import argparse
import hashlib
import json
import logging
import random
import re
import time
import urllib.parse
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


def make_id(*parts) -> str:
    """用多个部分生成唯一 ID。"""
    raw = "|".join(str(p) for p in parts)
    return hashlib.md5(raw.encode("utf-8")).hexdigest()[:16]


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
        self._downloaded_urls: set = set()

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

        if url in self._downloaded_urls:
            logger.debug(f"图片已存在（URL 去重）: {url}")
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
            self._downloaded_urls.add(url)

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
    """解析器基类。每个游戏/平台实现一个子类。"""

    def __init__(self, game: Dict, engine: ScraperEngine):
        self.game = game
        self.engine = engine
        self.game_id = game["id"]
        self.game_name = game["name"]
        self.category = game["category"]
        self.brand_color = game.get("brandColor", "#ffffff")

    @abstractmethod
    def parse(self) -> List[Dict]:
        pass

    def _make_local_path(self, type_: str, name: str, filename: str) -> Path:
        return ASSETS_DIR / self.game_id / safe_filename(type_) / safe_filename(name) / safe_filename(filename)


# ==========================================================
# 官方设定图解析器
# ==========================================================
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

            hero_url = self.SKIN_BASE.format(ename=ename, idx=1)
            hero_path = self._make_local_path("hero", cname, f"{ename}_hero_1")
            local = self.engine.download_image(hero_url, hero_path)
            if local:
                results.append(self._asset("hero", cname, title, hero_url, local, [hero.get("hero_type", "")]))

            for idx, skin_name in enumerate(skin_names, start=1):
                skin_name = skin_name.strip()
                if not skin_name or skin_name == cname:
                    continue
                skin_url = self.SKIN_BASE.format(ename=ename, idx=idx)
                skin_path = self._make_local_path("skin", cname, f"{ename}_skin_{idx}_{skin_name}")
                local = self.engine.download_image(skin_url, skin_path)
                if local:
                    results.append(self._asset("skin", cname, skin_name, skin_url, local, ["皮肤"]))

        logger.info(f"[{self.game_name}] 抓取完成，共 {len(results)} 张")
        return results

    def _asset(self, type_: str, name: str, sub_name: str, remote_url: str, local: Path, tags: List[str]) -> Dict:
        return {
            "id": f"{self.game_id}-{type_}-{make_id(name, sub_name)}",
            "gameId": self.game_id,
            "gameName": self.game_name,
            "category": self.category,
            "type": type_,
            "name": name,
            "subName": sub_name,
            "artist": "",
            "artistId": "",
            "sourceUrl": "",
            "authorizationStatus": "official",
            "remoteUrl": remote_url,
            "localPath": str(local.relative_to(ROOT).as_posix()),
            "tags": tags,
        }


class PlaceholderParser(BaseParser):
    """占位解析器：提示用户自行实现。"""

    def parse(self) -> List[Dict]:
        logger.warning(
            f"[{self.game_name}] 暂无解析器实现。请在 scraper.py 中新增 {self.game_id} 的解析器。"
        )
        return []


# ==========================================================
# 二创（同人图）解析器
# ==========================================================
class FanartBaseParser(BaseParser):
    """
    二创图片解析器基类。
    所有二创资源必须包含画师信息与来源 URL，授权状态默认 unknown。
    """

    PLATFORM = "unknown"

    def __init__(self, game: Dict, engine: ScraperEngine, source_config: Dict):
        super().__init__(game, engine)
        self.source_config = source_config
        self.keywords = game.get("fanartKeywords", [game["name"]])
        self.max_per_keyword = game.get("fanartMaxPerKeyword", 20)

    def _fanart_asset(
        self,
        keyword: str,
        title: str,
        artist: str,
        artist_id: str,
        source_url: str,
        image_url: str,
        local: Path,
        tags: Optional[List[str]] = None,
    ) -> Dict:
        return {
            "id": f"{self.game_id}-fanart-{self.PLATFORM}-{make_id(source_url, image_url)}",
            "gameId": self.game_id,
            "gameName": self.game_name,
            "category": self.category,
            "type": "fanart",
            "name": keyword,
            "subName": title,
            "artist": artist,
            "artistId": artist_id,
            "sourceUrl": source_url,
            "authorizationStatus": "unknown",
            "remoteUrl": image_url,
            "localPath": str(local.relative_to(ROOT).as_posix()),
            "tags": tags or ["二创", self.PLATFORM],
        }


class PixivFanartParser(FanartBaseParser):
    """
    Pixiv 二创解析器框架。
    Pixiv 需要登录/特殊 API，以下代码提供可扩展结构。
    建议使用 pixivpy 库并填入 REFRESH_TOKEN 后使用。
    """

    PLATFORM = "pixiv"

    def parse(self) -> List[Dict]:
        logger.warning(
            f"[{self.game_name}] Pixiv 解析器为框架示例。"
            "请配置 pixivpy 或 Pixiv API 后再运行，否则只会记录日志。"
        )
        logger.info(f"[{self.game_name}] 计划搜索关键词: {self.keywords}")
        # 实际实现时需要：
        # 1. 安装 pixivpy
        # 2. 使用 pixivpy.AppPixivAPI() 登录
        # 3. 调用 search_illust() 搜索每个关键词
        # 4. 下载 image_urls['large'] 并调用 self._fanart_asset()
        return []


class TwitterFanartParser(FanartBaseParser):
    """
    Twitter/X 二创解析器框架。
    由于 Twitter 反爬强，建议使用 Nitter 实例或官方 API。
    """

    PLATFORM = "twitter"

    def parse(self) -> List[Dict]:
        logger.warning(
            f"[{self.game_name}] Twitter/X 解析器为框架示例。"
            "请配置 Nitter 实例或 Twitter API 后再运行。"
        )
        logger.info(f"[{self.game_name}] 计划搜索关键词: {self.keywords}")
        # 实际实现思路：
        # 1. 使用 Nitter 实例搜索页，如 https://nitter.net/search?f=images&q={keyword}
        # 2. 解析推文卡片获取图片地址、作者、推文链接
        # 3. 下载图片并调用 self._fanart_asset()
        return []


class BilibiliFanartParser(FanartBaseParser):
    """
    Bilibili 二创解析器框架。
    支持相簿搜索接口，需处理 Cookie 与分页。
    """

    PLATFORM = "bilibili"

    def parse(self) -> List[Dict]:
        logger.warning(
            f"[{self.game_name}] Bilibili 解析器为框架示例。"
            "请根据实际接口返回结构补充解析逻辑。"
        )
        logger.info(f"[{self.game_name}] 计划搜索关键词: {self.keywords}")
        # 实际实现思路：
        # 1. 调用 https://api.bilibili.com/x/web-interface/search/type
        #    参数：keyword={kw}&search_type=photo&page={page}
        # 2. 解析 JSON 中的 result 列表，获取 item.doc_id、title、cover、uname 等
        # 3. 进入详情页获取高清图片并下载
        # 4. 调用 self._fanart_asset()
        return []


class LofterFanartParser(FanartBaseParser):
    """
    LOFTER 二创解析器框架。
    LOFTER 标签页结构变化频繁，需按实际 DOM 调整。
    """

    PLATFORM = "lofter"

    def parse(self) -> List[Dict]:
        logger.warning(
            f"[{self.game_name}] LOFTER 解析器为框架示例。"
            "请根据实际页面结构补充解析逻辑。"
        )
        logger.info(f"[{self.game_name}] 计划搜索关键词: {self.keywords}")
        # 实际实现思路：
        # 1. 访问 https://www.lofter.com/tag/{keyword}
        # 2. 解析文章列表获取图片、标题、作者、文章链接
        # 3. 下载图片并调用 self._fanart_asset()
        return []


class GameRegistry:
    _parsers = {
        "honor_of_kings": HonorOfKingsParser,
        "placeholder": PlaceholderParser,
    }

    _fanart_parsers = {
        "pixiv": PixivFanartParser,
        "twitter": TwitterFanartParser,
        "bilibili": BilibiliFanartParser,
        "lofter": LofterFanartParser,
    }

    @classmethod
    def register(cls, name: str, parser_cls):
        cls._parsers[name] = parser_cls

    @classmethod
    def get(cls, name: str):
        return cls._parsers.get(name, PlaceholderParser)

    @classmethod
    def get_fanart_parser(cls, name: str):
        return cls._fanart_parsers.get(name)


def load_games(path: Path = GAMES_JSON) -> Dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_data(data: List[Dict], path: Path = DATA_JSON):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    logger.info(f"索引已保存: {path}（共 {len(data)} 条）")


def fetch_official_assets(config: Dict, engine: ScraperEngine, target_ids: Optional[set] = None) -> List[Dict]:
    """抓取官方设定图。"""
    games = config.get("games", [])
    enabled_games = [
        g
        for g in games
        if g.get("enabled", False) and (target_ids is None or g["id"] in target_ids)
    ]
    results: List[Dict] = []
    for game in enabled_games:
        parser_cls = GameRegistry.get(game.get("parser", "placeholder"))
        parser_inst = parser_cls(game, engine)
        try:
            assets = parser_inst.parse()
            results.extend(assets)
        except Exception as exc:
            logger.error(f"[{game['name']}] 官方解析异常: {exc}")
    return results


def fetch_fanart_assets(config: Dict, engine: ScraperEngine, target_ids: Optional[set] = None) -> List[Dict]:
    """抓取二创图片。"""
    games = config.get("games", [])
    fanart_sources = config.get("fanartSources", {})
    results: List[Dict] = []

    for platform, source_config in fanart_sources.items():
        if not source_config.get("enabled", False):
            continue
        parser_cls = GameRegistry.get_fanart_parser(platform)
        if not parser_cls:
            logger.warning(f"未知二创平台: {platform}")
            continue

        for game in games:
            if not game.get("fanartEnabled", False):
                continue
            if target_ids is not None and game["id"] not in target_ids:
                continue
            parser_inst = parser_cls(game, engine, source_config)
            try:
                assets = parser_inst.parse()
                results.extend(assets)
            except Exception as exc:
                logger.error(f"[{game['name']}] {platform} 二创解析异常: {exc}")

    return results


def main():
    parser = argparse.ArgumentParser(description="游戏官方设定图与二创图片抓取框架")
    parser.add_argument(
        "--games",
        "-g",
        nargs="+",
        help="指定要抓取的游戏 id，多个用空格分隔",
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
    parser.add_argument(
        "--official",
        action="store_true",
        help="仅抓取官方设定图",
    )
    parser.add_argument(
        "--fanart",
        action="store_true",
        help="仅抓取二创图片",
    )
    args = parser.parse_args()

    config = load_games()
    target_ids = set(args.games) if args.games else None

    run_official = args.official or not args.fanart
    run_fanart = args.fanart or not args.official

    engine = ScraperEngine(delay=tuple(args.delay), retries=args.retries)
    all_assets: List[Dict] = []

    if run_official:
        logger.info("===== 开始抓取官方设定图 =====")
        all_assets.extend(fetch_official_assets(config, engine, target_ids))

    if run_fanart:
        logger.info("===== 开始抓取二创图片 =====")
        all_assets.extend(fetch_fanart_assets(config, engine, target_ids))

    if not all_assets:
        logger.warning("没有抓取到任何素材。请检查 games.json 中的 enabled / fanartEnabled / fanartSources 配置。")
        return

    save_data(all_assets)
    logger.info("全部完成。")


if __name__ == "__main__":
    main()
