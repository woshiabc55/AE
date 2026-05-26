import math
from typing import List, Dict, Any, Tuple
from .models import Product


class Analyzer:
    def __init__(self, products: List[Product]):
        self.products = products

    def recommend(self, top_n: int = 5) -> List[Dict[str, Any]]:
        if not self.products:
            return []

        scored = []
        prices = [p.price for p in self.products]
        sales_list = [p.sales for p in self.products]
        ratings = [p.store_rating for p in self.products]

        min_price, max_price = min(prices), max(prices)
        min_sales, max_sales = min(sales_list), max(sales_list)
        price_range = max_price - min_price if max_price != min_price else 1
        sales_range = max_sales - min_sales if max_sales != min_sales else 1

        for p in self.products:
            price_score = 1 - (p.price - min_price) / price_range
            sales_score = (p.sales - min_sales) / sales_range
            rating_score = p.store_rating / 5.0

            value_score = (
                price_score * 0.4
                + sales_score * 0.25
                + rating_score * 0.2
                + (1 - p.discount if p.discount else 0) * 0.15
            )

            tag = self._get_tag(p, price_score, value_score)

            scored.append({
                **p.to_dict(),
                "value_score": round(value_score, 3),
                "price_score": round(price_score, 3),
                "sales_score": round(sales_score, 3),
                "recommend_tag": tag,
            })

        scored.sort(key=lambda x: x["value_score"], reverse=True)
        return scored[:top_n]

    @staticmethod
    def _get_tag(product: Product, price_score: float, value_score: float) -> str:
        if value_score >= 0.75:
            return "🏆 性价比之王"
        if price_score >= 0.8:
            return "💰 最低价推荐"
        if product.sales >= 100000:
            return "🔥 爆款热销"
        if product.store_rating >= 4.8:
            return "⭐ 优质店铺"
        if product.discount and product.discount <= 0.7:
            return "🎁 超值折扣"
        return "👍 值得关注"

    def price_trend(self) -> Dict[str, List[Dict[str, Any]]]:
        platform_groups: Dict[str, List[Product]] = {}
        for p in self.products:
            platform_groups.setdefault(p.platform, []).append(p)

        trend = {}
        for platform, items in platform_groups.items():
            sorted_items = sorted(items, key=lambda x: x.price)
            bins = self._create_bins(sorted_items, bin_count=5)
            trend[platform] = bins
        return trend

    @staticmethod
    def _create_bins(items: List[Product], bin_count: int = 5) -> List[Dict[str, Any]]:
        if not items:
            return []

        prices = [p.price for p in items]
        min_p, max_p = min(prices), max(prices)
        step = (max_p - min_p) / bin_count if max_p != min_p else 1

        bins = []
        for i in range(bin_count):
            low = min_p + step * i
            high = min_p + step * (i + 1)
            bin_items = [p for p in items if low <= p.price <= high] if i == bin_count - 1 else [p for p in items if low <= p.price < high]
            bins.append({
                "range": f"{round(low, 0)}-{round(high, 0)}",
                "count": len(bin_items),
                "avg_price": round(sum(p.price for p in bin_items) / len(bin_items), 2) if bin_items else 0,
            })
        return bins

    def platform_comparison(self) -> Dict[str, Any]:
        platform_groups: Dict[str, List[Product]] = {}
        for p in self.products:
            platform_groups.setdefault(p.platform, []).append(p)

        result = {}
        for platform, items in platform_groups.items():
            prices = [p.price for p in items]
            result[platform] = {
                "count": len(items),
                "min_price": min(prices),
                "max_price": max(prices),
                "avg_price": round(sum(prices) / len(prices), 2),
                "median_price": sorted(prices)[len(prices) // 2],
            }
        return result

    def price_distribution(self) -> List[Dict[str, Any]]:
        if not self.products:
            return []

        prices = [p.price for p in self.products]
        min_p, max_p = min(prices), max(prices)
        step = (max_p - min_p) / 8 if max_p != min_p else 1

        distribution = []
        for i in range(8):
            low = min_p + step * i
            high = min_p + step * (i + 1)
            count = sum(1 for p in self.products if low <= p.price < high) if i < 7 else sum(1 for p in self.products if low <= p.price <= high)
            distribution.append({
                "range": f"¥{round(low, 0)}-{round(high, 0)}",
                "count": count,
            })
        return distribution
