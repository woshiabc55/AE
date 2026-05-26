import random
import hashlib
import time
from typing import List
from .base import BaseScraper
from ..models import Product

JD_BRANDS = {
    "手机": ["小米", "华为", "Apple", "OPPO", "vivo", "三星", "荣耀", "一加", "realme", "魅族"],
    "笔记本": ["联想", "华为", "Apple", "戴尔", "华硕", "惠普", "ThinkPad", "小米", "宏碁", "机械革命"],
    "耳机": ["索尼", "Apple", "BOSE", "森海塞尔", "华为", "小米", "漫步者", "JBL", "铁三角", "AKG"],
    "平板": ["Apple", "华为", "小米", "联想", "三星", "OPPO", "vivo", "荣耀", "微软", "酷比魔方"],
    "键盘": ["罗技", "雷蛇", "樱桃", "达尔优", "IKBC", "阿米洛", "Keychron", "黑峡谷", "腹灵", "VGN"],
    "显示器": ["戴尔", "LG", "三星", "AOC", "飞利浦", "明基", "华硕", "HKC", "优派", "小米"],
    "空调": ["格力", "美的", "海尔", "奥克斯", "TCL", "海信", "松下", "三菱电机", "大金", "志高"],
    "洗衣机": ["海尔", "美的", "小天鹅", "西门子", "松下", "LG", "博世", "TCL", "海信", "惠而浦"],
    "电视": ["小米", "华为", "索尼", "三星", "LG", "TCL", "海信", "创维", "长虹", "康佳"],
    "冰箱": ["海尔", "美的", "西门子", "容声", "美菱", "松下", "LG", "博世", "TCL", "海信"],
}

JD_STORES = [
    "京东自营", "京东超市", "品牌旗舰店", "官方旗舰店", "授权专卖店",
    "品牌专营店", "数码旗舰店", "家电旗舰店", "生活旗舰店", "精选旗舰店",
]

JD_ADJECTIVES = ["旗舰", "新款", "升级", "Pro", "Max", "Plus", "Ultra", "SE", "Lite", "经典款"]

PRICE_RANGES = {
    "手机": (899, 9999),
    "笔记本": (2999, 16999),
    "耳机": (49, 3999),
    "平板": (799, 12999),
    "键盘": (69, 1999),
    "显示器": (599, 7999),
    "空调": (1499, 8999),
    "洗衣机": (699, 6999),
    "电视": (999, 19999),
    "冰箱": (699, 12999),
}


def _detect_category(keyword: str) -> str:
    for cat in JD_BRANDS:
        if cat in keyword:
            return cat
    return random.choice(list(JD_BRANDS.keys()))


class JDScraper(BaseScraper):
    platform_name = "jd"
    platform_display = "京东"

    def search(self, keyword: str, page: int = 1, count: int = 20) -> List[Product]:
        time.sleep(random.uniform(0.1, 0.3))
        category = _detect_category(keyword)
        brands = JD_BRANDS.get(category, JD_BRANDS["手机"])
        price_range = PRICE_RANGES.get(category, PRICE_RANGES["手机"])
        products = []
        for i in range(count):
            brand = random.choice(brands)
            adj = random.choice(JD_ADJECTIVES)
            name = f"{brand} {keyword} {adj} {random.randint(1, 99)}代"
            base_price = random.uniform(price_range[0], price_range[1])
            price = round(base_price, 2)
            original_price = round(price * random.uniform(1.0, 1.3), 2)
            sales = random.randint(100, 500000)
            store = random.choice(JD_STORES)
            if store == "京东自营":
                store_rating = round(random.uniform(4.7, 5.0), 1)
            else:
                store_rating = round(random.uniform(4.2, 4.9), 1)
            sku_id = hashlib.md5(f"jd_{name}_{i}".encode()).hexdigest()[:8]
            url = f"https://item.jd.com/{sku_id}.html"
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
