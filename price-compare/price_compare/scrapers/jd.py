import random
import uuid
from typing import List
from .base import BaseScraper
from ..models import Product


class JDScraper(BaseScraper):
    platform_name = "京东"
    base_url = "https://search.jd.com/Search"

    _BRANDS = ["小米", "华为", "苹果", "联想", "OPPO", "vivo", "三星", "荣耀", "一加", "realme"]
    _STORES = [
        ("京东自营旗舰店", 4.9), ("京东官方旗舰店", 4.8), ("京东数码专营店", 4.7),
        ("京东家电旗舰店", 4.8), ("京东手机旗舰店", 4.9), ("京东品牌授权店", 4.6),
    ]
    _SUFFIXES = ["旗舰版", "标准版", "高配版", "Pro", "Max", "Ultra", "Plus", "SE", "Lite", "青春版"]

    def search(self, keyword: str, page: int = 1) -> List[Product]:
        results = []
        count = random.randint(8, 15)
        base_price = self._guess_base_price(keyword)

        for i in range(count):
            brand = random.choice(self._BRANDS)
            suffix = random.choice(self._SUFFIXES)
            name = f"{brand} {keyword} {suffix}"
            store_name, store_rating = random.choice(self._STORES)
            price = round(base_price * random.uniform(0.7, 1.4), 2)
            original_price = round(price * random.uniform(1.05, 1.3), 2)
            sales = random.randint(500, 200000)
            product_id = uuid.uuid4().hex[:10]

            results.append(Product(
                name=name,
                price=price,
                sales=sales,
                store_name=store_name,
                store_rating=store_rating,
                platform=self.platform_name,
                url=f"https://item.jd.com/{product_id}.html",
                keyword=keyword,
                original_price=original_price,
            ))
        return results

    @staticmethod
    def _guess_base_price(keyword: str) -> float:
        price_map = {
            "手机": 2999, "笔记本": 5499, "平板": 2499, "耳机": 399,
            "电视": 3299, "冰箱": 2999, "洗衣机": 2199, "空调": 2799,
            "手表": 1299, "相机": 4999, "键盘": 299, "鼠标": 149,
            "显示器": 1599, "音箱": 499, "路由器": 199, "充电宝": 99,
        }
        for k, v in price_map.items():
            if k in keyword:
                return v
        return random.uniform(100, 5000)
