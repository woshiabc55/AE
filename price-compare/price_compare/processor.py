from typing import List, Dict, Any, Optional
from .models import Product


class DataProcessor:
    def __init__(self, products: List[Product]):
        self.products = products

    def clean(self) -> "DataProcessor":
        cleaned = []
        for p in self.products:
            if not p.name or not p.name.strip():
                continue
            if p.price <= 0:
                continue
            p.name = p.name.strip()
            p.price = round(p.price, 2)
            if p.original_price and p.original_price < p.price:
                p.original_price = None
                p.discount = None
            p.store_rating = round(max(0.0, min(5.0, p.store_rating)), 1)
            p.sales = max(0, p.sales)
            cleaned.append(p)
        self.products = cleaned
        return self

    def deduplicate(self) -> "DataProcessor":
        seen = set()
        unique = []
        for p in self.products:
            key = (p.platform, p.name, p.store_name)
            if key not in seen:
                seen.add(key)
                unique.append(p)
        self.products = unique
        return self

    def sort_by_price(self, ascending: bool = True) -> "DataProcessor":
        self.products.sort(key=lambda p: p.price, reverse=not ascending)
        return self

    def filter_by_platform(self, platforms: List[str]) -> "DataProcessor":
        self.products = [p for p in self.products if p.platform in platforms]
        return self

    def filter_by_price_range(self, min_price: Optional[float] = None, max_price: Optional[float] = None) -> "DataProcessor":
        result = self.products
        if min_price is not None:
            result = [p for p in result if p.price >= min_price]
        if max_price is not None:
            result = [p for p in result if p.price <= max_price]
        self.products = result
        return self

    def compare(self) -> Dict[str, Any]:
        platform_groups: Dict[str, List[Product]] = {}
        for p in self.products:
            platform_groups.setdefault(p.platform, []).append(p)

        comparison = {}
        for platform, items in platform_groups.items():
            prices = [p.price for p in items]
            sales_list = [p.sales for p in items]
            ratings = [p.store_rating for p in items]
            comparison[platform] = {
                "count": len(items),
                "avg_price": round(sum(prices) / len(prices), 2) if prices else 0,
                "min_price": min(prices) if prices else 0,
                "max_price": max(prices) if prices else 0,
                "avg_sales": round(sum(sales_list) / len(sales_list)) if sales_list else 0,
                "avg_rating": round(sum(ratings) / len(ratings), 1) if ratings else 0,
                "best_value": min(items, key=lambda p: p.price).to_dict() if items else None,
            }
        return comparison

    def get_all(self) -> List[Product]:
        return self.products

    def to_dict_list(self) -> List[Dict[str, Any]]:
        return [p.to_dict() for p in self.products]
