from typing import List, Dict, Any
from .models import Product


def clean_products(products: List[Product]) -> List[Product]:
    cleaned = []
    for p in products:
        if not p.name or not p.name.strip():
            continue
        if p.price <= 0:
            continue
        if p.sales < 0:
            p.sales = 0
        if p.store_rating < 0 or p.store_rating > 5:
            p.store_rating = min(max(p.store_rating, 0), 5)
        p.name = p.name.strip()
        p.price = round(p.price, 2)
        if p.original_price and p.original_price < p.price:
            p.original_price = p.price
        cleaned.append(p)
    return cleaned


def deduplicate(products: List[Product]) -> List[Product]:
    seen = set()
    result = []
    for p in products:
        if p._id not in seen:
            seen.add(p._id)
            result.append(p)
    return result


def sort_by_price(products: List[Product], ascending: bool = True) -> List[Product]:
    return sorted(products, key=lambda p: p.price, reverse=not ascending)


def sort_by_sales(products: List[Product], descending: bool = True) -> List[Product]:
    return sorted(products, key=lambda p: p.sales, reverse=descending)


def sort_by_value_score(products: List[Product], descending: bool = True) -> List[Product]:
    return sorted(products, key=lambda p: p.value_score, reverse=descending)


def filter_by_platform(products: List[Product], platforms: List[str]) -> List[Product]:
    return [p for p in products if p.platform in platforms]


def filter_by_price_range(products: List[Product], min_price: float = 0, max_price: float = float("inf")) -> List[Product]:
    return [p for p in products if min_price <= p.price <= max_price]


def filter_by_min_sales(products: List[Product], min_sales: int = 0) -> List[Product]:
    return [p for p in products if p.sales >= min_sales]


def filter_by_min_rating(products: List[Product], min_rating: float = 0) -> List[Product]:
    return [p for p in products if p.store_rating >= min_rating]


class DataProcessor:
    def __init__(self, products: List[Product]):
        self._raw = products
        self._products = []

    def process(self) -> List[Product]:
        self._products = clean_products(self._raw)
        self._products = deduplicate(self._products)
        self._products = sort_by_price(self._products, ascending=True)
        return self._products

    def get_products(self) -> List[Product]:
        return self._products

    def to_dict_list(self) -> List[Dict[str, Any]]:
        return [p.to_dict() for p in self._products]

    def get_stats(self) -> Dict[str, Any]:
        if not self._products:
            return {}
        prices = [p.price for p in self._products]
        sales = [p.sales for p in self._products]
        ratings = [p.store_rating for p in self._products]
        platform_counts = {}
        for p in self._products:
            platform_counts[p.platform] = platform_counts.get(p.platform, 0) + 1
        return {
            "total": len(self._products),
            "price_min": round(min(prices), 2),
            "price_max": round(max(prices), 2),
            "price_avg": round(sum(prices) / len(prices), 2),
            "price_median": round(sorted(prices)[len(prices) // 2], 2),
            "sales_total": sum(sales),
            "sales_avg": round(sum(sales) / len(sales), 0),
            "rating_avg": round(sum(ratings) / len(ratings), 2),
            "platform_counts": platform_counts,
        }
