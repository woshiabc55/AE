import random
import hashlib
from typing import List, Dict, Any
from .base import BaseScraper


class JDScraper(BaseScraper):
    platform = "jd"
    platform_name = "京东"
    base_url = "https://search.jd.com"

    def search(self, keyword: str, count: int = 10) -> List[Dict[str, Any]]:
        products = []
        base_prices = {
            "iphone": (4999, 8999),
            "手机": (899, 6999),
            "耳机": (99, 2999),
            "笔记本": (2999, 12999),
            "平板": (1499, 8999),
            "电视": (1299, 9999),
            "空调": (1799, 7999),
            "洗衣机": (899, 5999),
        }

        price_range = (99, 9999)
        for key, pr in base_prices.items():
            if key in keyword.lower():
                price_range = pr
                break

        stores = [
            ("京东自营旗舰店", 4.9),
            ("京东官方旗舰店", 4.8),
            ("京东数码专营店", 4.7),
            ("京东家电旗舰店", 4.8),
            ("京东品牌授权店", 4.6),
        ]

        for i in range(count):
            price = round(random.uniform(price_range[0], price_range[1]), 2)
            original_price = round(price * random.uniform(1.05, 1.3), 2)
            sales = random.randint(500, 200000)
            store = random.choice(stores)
            name_hash = hashlib.md5(f"{keyword}{i}".encode()).hexdigest()[:6]
            product_id = f"1000{random.randint(100000, 999999)}"

            products.append(
                self._build_product(
                    name=f"{keyword} {['旗舰版', '标准版', '尊享版', '高配版', '经典版'][i % 5]} {name_hash}",
                    price=price,
                    original_price=original_price,
                    sales=sales,
                    store_name=store[0],
                    store_rating=store[1] + random.uniform(-0.3, 0.1),
                    url=f"https://item.jd.com/{product_id}.html",
                    image_url=f"https://img14.360buyimg.com/n1/s450x450_{product_id}.jpg",
                )
            )

        return products
