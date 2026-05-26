import random
import hashlib
import time
from typing import List
from .base import BaseScraper
from ..models import Product

PDD_BRANDS = {
    "手机": ["小米", "华为", "OPPO", "vivo", "荣耀", "一加", "iQOO", "Redmi", "realme", "魅族"],
    "笔记本": ["联想", "华为", "戴尔", "华硕", "惠普", "小米", "神舟", "机械革命", "宏碁", "清华同方"],
    "耳机": ["小米", "漫步者", "JBL", "QCY", "倍思", "华为", "索尼", "铁三角", "万魔", "声阔"],
    "平板": ["华为", "小米", "联想", "荣耀", "酷比魔方", "台电", "中柏", "OPPO", "vivo", "三星"],
    "键盘": ["罗技", "雷蛇", "达尔优", "IKBC", "黑峡谷", "腹灵", "VGN", "新盟", "迈从", "狼蛛"],
    "显示器": ["AOC", "HKC", "戴尔", "LG", "三星", "飞利浦", "华硕", "优派", "明基", "小米"],
    "空调": ["格力", "美的", "海尔", "奥克斯", "TCL", "海信", "科龙", "华凌", "统帅", "新飞"],
    "洗衣机": ["海尔", "美的", "小天鹅", "TCL", "海信", "奥克斯", "惠而浦", "松下", "LG", "西门子"],
    "电视": ["小米", "华为", "TCL", "海信", "创维", "长虹", "康佳", "雷鸟", "三星", "索尼"],
    "冰箱": ["海尔", "美的", "容声", "美菱", "TCL", "海信", "奥克斯", "松下", "西门子", "卡萨帝"],
}

PDD_STORES = [
    "品牌旗舰店", "官方旗舰店", "百亿补贴", "品牌黑标店", "正品直营",
    "工厂直供", "产地直发", "品牌特卖", "万人团", "限时秒杀",
]

PDD_ADJECTIVES = ["百亿补贴", "万人团", "限时秒杀", "超值", "爆款", "热卖", "精选", "直降", "特惠", "新品"]

PRICE_RANGES = {
    "手机": (599, 7999),
    "笔记本": (1999, 13999),
    "耳机": (19, 2999),
    "平板": (499, 9999),
    "键盘": (39, 1499),
    "显示器": (399, 5999),
    "空调": (999, 6999),
    "洗衣机": (399, 4999),
    "电视": (699, 14999),
    "冰箱": (399, 9999),
}


def _detect_category(keyword: str) -> str:
    for cat in PDD_BRANDS:
        if cat in keyword:
            return cat
    return random.choice(list(PDD_BRANDS.keys()))


class PDDScraper(BaseScraper):
    platform_name = "pdd"
    platform_display = "拼多多"

    def search(self, keyword: str, page: int = 1, count: int = 20) -> List[Product]:
        time.sleep(random.uniform(0.1, 0.3))
        category = _detect_category(keyword)
        brands = PDD_BRANDS.get(category, PDD_BRANDS["手机"])
        price_range = PRICE_RANGES.get(category, PRICE_RANGES["手机"])
        products = []
        for i in range(count):
            brand = random.choice(brands)
            adj = random.choice(PDD_ADJECTIVES)
            name = f"【{adj}】{brand} {keyword} {random.randint(1, 99)}代"
            base_price = random.uniform(price_range[0], price_range[1])
            price = round(base_price * random.uniform(0.7, 0.95), 2)
            original_price = round(base_price, 2)
            sales = random.randint(1000, 2000000)
            store = random.choice(PDD_STORES)
            store_rating = round(random.uniform(3.8, 4.8), 1)
            goods_id = hashlib.md5(f"pdd_{name}_{i}".encode()).hexdigest()[:10]
            url = f"https://mobile.yangkeduo.com/goods.html?goods_id={goods_id}"
            products.append(Product(
                name=name,
                price=price,
                sales=sales,
                store_name=f"{brand}{store}",
                store_rating=store_rating,
                platform=self.platform_name,
                url=url,
                keyword=keyword,
                original_price=original_price,
                discount=f"-{round((1 - price / original_price) * 100)}%" if original_price > price else "",
                category=category,
                brand=brand,
            ))
        return products

    def get_product_detail(self, product_id: str) -> Product:
        products = self.search("商品", count=1)
        return products[0] if products else None
