import random
import hashlib
from typing import List, Dict, Any
from .base import BaseScraper


class TaobaoScraper(BaseScraper):
    platform = "tb"
    platform_name = "淘宝"
    base_url = "https://s.taobao.com"

    def search(self, keyword: str, count: int = 10) -> List[Dict[str, Any]]:
        products = []
        base_prices = {
            "iphone": (4599, 8899),
            "手机": (699, 5999),
            "耳机": (79, 2599),
            "笔记本": (2699, 11999),
            "平板": (1299, 7999),
            "电视": (1099, 8999),
            "空调": (1599, 6999),
            "洗衣机": (799, 4999),
        }

        price_range = (79, 8999)
        for key, pr in base_prices.items():
            if key in keyword.lower():
                price_range = pr
                break

        stores = [
            ("天猫官方旗舰店", 4.9),
            ("品牌直营店", 4.8),
            ("天猫优品店", 4.7),
            ("淘宝精选店", 4.5),
            ("金牌卖家店", 4.6),
        ]

        for i in range(count):
            price = round(random.uniform(price_range[0], price_range[1]), 2)
            original_price = round(price * random.uniform(1.1, 1.4), 2)
            sales = random.randint(1000, 300000)
            store = random.choice(stores)
            name_hash = hashlib.md5(f"{keyword}{i}tb".encode()).hexdigest()[:6]
            item_id = f"{random.randint(100000000, 999999999)}"

            products.append(
                self._build_product(
                    name=f"{keyword} {['天猫正品', '官方授权', '爆款直降', '限时特惠', '新品首发'][i % 5]} {name_hash}",
                    price=price,
                    original_price=original_price,
                    sales=sales,
                    store_name=store[0],
                    store_rating=store[1] + random.uniform(-0.3, 0.1),
                    url=f"https://item.taobao.com/item.htm?id={item_id}",
                    image_url=f"https://img.alicdn.com/imgextra/i3/{item_id}_0.jpg",
                )
            )

        return products
