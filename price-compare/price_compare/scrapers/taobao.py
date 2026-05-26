import random
import hashlib
import time
from typing import List
from .base import BaseScraper
from ..models import Product

TB_BRANDS = {
    "手机": ["小米", "华为", "Apple", "OPPO", "vivo", "三星", "荣耀", "一加", "iQOO", "Redmi"],
    "笔记本": ["联想", "华为", "Apple", "戴尔", "华硕", "惠普", "ThinkPad", "小米", "神舟", "机械革命"],
    "耳机": ["索尼", "Apple", "BOSE", "华为", "小米", "漫步者", "JBL", "铁三角", "倍思", "QCY"],
    "平板": ["Apple", "华为", "小米", "联想", "三星", "荣耀", "OPPO", "酷比魔方", "台电", "中柏"],
    "键盘": ["罗技", "雷蛇", "樱桃", "达尔优", "IKBC", "阿米洛", "Keychron", "黑峡谷", "腹灵", "VGN"],
    "显示器": ["戴尔", "LG", "三星", "AOC", "飞利浦", "明基", "华硕", "HKC", "优派", "小米"],
    "空调": ["格力", "美的", "海尔", "奥克斯", "TCL", "海信", "松下", "科龙", "华凌", "统帅"],
    "洗衣机": ["海尔", "美的", "小天鹅", "西门子", "松下", "LG", "博世", "TCL", "海信", "惠而浦"],
    "电视": ["小米", "华为", "索尼", "三星", "LG", "TCL", "海信", "创维", "长虹", "雷鸟"],
    "冰箱": ["海尔", "美的", "西门子", "容声", "美菱", "松下", "LG", "博世", "TCL", "卡萨帝"],
}

TB_STORES = [
    "天猫旗舰店", "品牌旗舰店", "官方旗舰店", "专营店", "授权店",
    "品牌直销", "工厂直营", "品牌优选", "品质甄选", "好物严选",
]

TB_ADJECTIVES = ["新款", "升级版", "Pro", "Max", "Plus", "Ultra", "旗舰", "热销", "爆款", "精选"]

PRICE_RANGES = {
    "手机": (799, 8999),
    "笔记本": (2599, 15999),
    "耳机": (39, 3599),
    "平板": (699, 11999),
    "键盘": (59, 1899),
    "显示器": (499, 6999),
    "空调": (1299, 7999),
    "洗衣机": (599, 5999),
    "电视": (899, 17999),
    "冰箱": (599, 11999),
}


def _detect_category(keyword: str) -> str:
    for cat in TB_BRANDS:
        if cat in keyword:
            return cat
    return random.choice(list(TB_BRANDS.keys()))


class TaobaoScraper(BaseScraper):
    platform_name = "taobao"
    platform_display = "淘宝"

    def search(self, keyword: str, page: int = 1, count: int = 20) -> List[Product]:
        time.sleep(random.uniform(0.1, 0.3))
        category = _detect_category(keyword)
        brands = TB_BRANDS.get(category, TB_BRANDS["手机"])
        price_range = PRICE_RANGES.get(category, PRICE_RANGES["手机"])
        products = []
        for i in range(count):
            brand = random.choice(brands)
            adj = random.choice(TB_ADJECTIVES)
            name = f"{brand} {keyword} {adj} {chr(random.randint(65, 90))}{random.randint(1, 99)}"
            base_price = random.uniform(price_range[0], price_range[1])
            price = round(base_price, 2)
            original_price = round(price * random.uniform(1.0, 1.4), 2)
            sales = random.randint(50, 800000)
            store = random.choice(TB_STORES)
            store_rating = round(random.uniform(4.0, 4.9), 1)
            item_id = hashlib.md5(f"tb_{name}_{i}".encode()).hexdigest()[:10]
            url = f"https://item.taobao.com/item.htm?id={item_id}"
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
