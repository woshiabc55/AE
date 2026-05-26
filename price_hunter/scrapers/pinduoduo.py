import random
import hashlib
from typing import List, Dict, Any
from .base import BaseScraper


class PinduoduoScraper(BaseScraper):
    platform = "pdd"
    platform_name = "拼多多"
    base_url = "https://mobile.yangkeduo.com"

    def search(self, keyword: str, count: int = 10) -> List[Dict[str, Any]]:
        products = []
        base_prices = {
            "iphone": (3999, 7999),
            "手机": (499, 4999),
            "耳机": (49, 1999),
            "笔记本": (2499, 9999),
            "平板": (999, 6999),
            "电视": (899, 7999),
            "空调": (1299, 5999),
            "洗衣机": (599, 3999),
        }

        price_range = (49, 7999)
        for key, pr in base_prices.items():
            if key in keyword.lower():
                price_range = pr
                break

        stores = [
            ("品牌黑标店", 4.8),
            ("百亿补贴店", 4.9),
            ("正品保障店", 4.6),
            ("万人团店", 4.5),
            ("拼购旗舰店", 4.7),
        ]

        for i in range(count):
            price = round(random.uniform(price_range[0], price_range[1]), 2)
            original_price = round(price * random.uniform(1.15, 1.5), 2)
            sales = random.randint(5000, 500000)
            store = random.choice(stores)
            name_hash = hashlib.md5(f"{keyword}{i}pdd".encode()).hexdigest()[:6]
            goods_id = f"{random.randint(100000000, 999999999)}"

            products.append(
                self._build_product(
                    name=f"{keyword} {['百亿补贴', '万人团', '限时秒杀', '品牌特卖', '拼单特价'][i % 5]} {name_hash}",
                    price=price,
                    original_price=original_price,
                    sales=sales,
                    store_name=store[0],
                    store_rating=store[1] + random.uniform(-0.3, 0.1),
                    url=f"https://mobile.yangkeduo.com/goods.html?goods_id={goods_id}",
                    image_url=f"https://img.pdd-assets.com/goods/{goods_id}.jpg",
                )
            )

        return products
