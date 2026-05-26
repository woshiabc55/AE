import random
import uuid
from typing import List
from .base import BaseScraper
from ..models import Product


class TaobaoScraper(BaseScraper):
    platform_name = "淘宝"
    base_url = "https://s.taobao.com/search"

    _BRANDS = ["小米", "华为", "苹果", "联想", "OPPO", "vivo", "三星", "荣耀", "一加", "realme", "魅族", "中兴"]
    _STORES = [
        ("品牌官方旗舰店", 4.8), ("天猫旗舰店", 4.9), ("品牌授权专卖店", 4.7),
        ("品牌直营店", 4.8), ("淘宝优选店", 4.5), ("金牌卖家店", 4.6),
    ]
    _SUFFIXES = ["旗舰版", "标准版", "高配版", "Pro", "Max", "Ultra", "Plus", "SE", "Lite", "典藏版"]

    def search(self, keyword: str, page: int = 1) -> List[Product]:
        results = []
        count = random.randint(8, 15)
        base_price = self._guess_base_price(keyword)

        for i in range(count):
            brand = random.choice(self._BRANDS)
            suffix = random.choice(self._SUFFIXES)
            name = f"{brand} {keyword} {suffix}"
            store_name, store_rating = random.choice(self._STORES)
            price = round(base_price * random.uniform(0.6, 1.3), 2)
            original_price = round(price * random.uniform(1.05, 1.35), 2)
            sales = random.randint(1000, 300000)
            product_id = uuid.uuid4().hex[:10]

            results.append(Product(
                name=name,
                price=price,
                sales=sales,
                store_name=store_name,
                store_rating=store_rating,
                platform=self.platform_name,
                url=f"https://item.taobao.com/item.htm?id={product_id}",
                keyword=keyword,
                original_price=original_price,
            ))
        return results

    @staticmethod
    def _guess_base_price(keyword: str) -> float:
        price_map = {
            "手机": 2599, "笔记本": 4999, "平板": 2199, "耳机": 299,
            "电视": 2999, "冰箱": 2599, "洗衣机": 1899, "空调": 2399,
            "手表": 999, "相机": 4499, "键盘": 249, "鼠标": 129,
            "显示器": 1399, "音箱": 399, "路由器": 169, "充电宝": 79,
        }
        for k, v in price_map.items():
            if k in keyword:
                return v
        return random.uniform(80, 4500)
