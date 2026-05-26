import random
import uuid
from typing import List
from .base import BaseScraper
from ..models import Product


class PDDScraper(BaseScraper):
    platform_name = "拼多多"
    base_url = "https://mobile.yangkeduo.com/search_result.html"

    _BRANDS = ["小米", "华为", "苹果", "联想", "OPPO", "vivo", "三星", "荣耀", "一加", "realme", "魅族", "中兴", "诺基亚"]
    _STORES = [
        ("品牌官方旗舰店", 4.7), ("百亿补贴店", 4.8), ("品牌特卖店", 4.6),
        ("工厂直销店", 4.5), ("品牌优选店", 4.7), ("拼团旗舰店", 4.6),
    ]
    _SUFFIXES = ["旗舰版", "标准版", "高配版", "Pro", "Max", "Ultra", "Plus", "SE", "Lite", "百亿补贴版"]

    def search(self, keyword: str, page: int = 1) -> List[Product]:
        results = []
        count = random.randint(8, 15)
        base_price = self._guess_base_price(keyword)

        for i in range(count):
            brand = random.choice(self._BRANDS)
            suffix = random.choice(self._SUFFIXES)
            name = f"{brand} {keyword} {suffix}"
            store_name, store_rating = random.choice(self._STORES)
            price = round(base_price * random.uniform(0.5, 1.15), 2)
            original_price = round(price * random.uniform(1.1, 1.5), 2)
            sales = random.randint(2000, 500000)
            product_id = uuid.uuid4().hex[:10]

            results.append(Product(
                name=name,
                price=price,
                sales=sales,
                store_name=store_name,
                store_rating=store_rating,
                platform=self.platform_name,
                url=f"https://mobile.yangkeduo.com/goods.html?goods_id={product_id}",
                keyword=keyword,
                original_price=original_price,
            ))
        return results

    @staticmethod
    def _guess_base_price(keyword: str) -> float:
        price_map = {
            "手机": 2199, "笔记本": 4299, "平板": 1899, "耳机": 249,
            "电视": 2599, "冰箱": 2199, "洗衣机": 1599, "空调": 1999,
            "手表": 799, "相机": 3999, "键盘": 199, "鼠标": 99,
            "显示器": 1199, "音箱": 299, "路由器": 129, "充电宝": 59,
        }
        for k, v in price_map.items():
            if k in keyword:
                return v
        return random.uniform(50, 4000)
