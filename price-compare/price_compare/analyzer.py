from typing import List, Dict, Any
from .models import Product


class Analyzer:
    def __init__(self, products: List[Product]):
        self._products = products

    def cross_platform_compare(self) -> List[Dict[str, Any]]:
        brand_groups: Dict[str, Dict[str, List[Product]]] = {}
        for p in self._products:
            key = p.brand
            if key not in brand_groups:
                brand_groups[key] = {}
            if p.platform not in brand_groups[key]:
                brand_groups[key][p.platform] = []
            brand_groups[key][p.platform].append(p)

        results = []
        for brand, platforms in brand_groups.items():
            if len(platforms) < 2:
                continue
            comparison = {"brand": brand, "platforms": {}}
            all_prices = []
            for platform, prods in platforms.items():
                avg_price = round(sum(p.price for p in prods) / len(prods), 2)
                min_price = round(min(p.price for p in prods), 2)
                max_price = round(max(p.price for p in prods), 2)
                avg_sales = round(sum(p.sales for p in prods) / len(prods), 0)
                avg_rating = round(sum(p.store_rating for p in prods) / len(prods), 2)
                comparison["platforms"][platform] = {
                    "count": len(prods),
                    "avg_price": avg_price,
                    "min_price": min_price,
                    "max_price": max_price,
                    "avg_sales": int(avg_sales),
                    "avg_rating": avg_rating,
                }
                all_prices.extend([avg_price, min_price])
            if all_prices:
                comparison["price_spread"] = round(max(all_prices) - min(all_prices), 2)
                comparison["cheapest_platform"] = min(
                    comparison["platforms"].items(),
                    key=lambda x: x[1]["avg_price"]
                )[0]
            results.append(comparison)
        results.sort(key=lambda x: x.get("price_spread", 0), reverse=True)
        return results

    def value_recommendations(self, top_n: int = 10) -> List[Dict[str, Any]]:
        scored = []
        for p in self._products:
            score = p.value_score
            price_rank = sum(1 for x in self._products if x.price < p.price) + 1
            sales_rank = sum(1 for x in self._products if x.sales > p.sales) + 1
            rating_rank = sum(1 for x in self._products if x.store_rating > p.store_rating) + 1
            total = len(self._products)
            tags = []
            if price_rank <= max(total * 0.1, 3):
                tags.append("低价优选")
            if sales_rank <= max(total * 0.1, 3):
                tags.append("热销爆款")
            if rating_rank <= max(total * 0.1, 3):
                tags.append("口碑之选")
            if p.original_price and p.original_price > p.price:
                discount_pct = round((1 - p.price / p.original_price) * 100, 1)
                if discount_pct >= 20:
                    tags.append(f"折扣力度大(-{discount_pct}%)")
            scored.append({
                "product": p.to_dict(),
                "score": score,
                "tags": tags,
                "price_rank": price_rank,
                "sales_rank": sales_rank,
                "rating_rank": rating_rank,
            })
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_n]

    def price_distribution(self, bins: int = 10) -> Dict[str, Any]:
        if not self._products:
            return {"bins": [], "labels": []}
        prices = [p.price for p in self._products]
        min_p = min(prices)
        max_p = max(prices)
        step = (max_p - min_p) / bins if max_p > min_p else 1
        bin_counts = [0] * bins
        bin_labels = []
        for i in range(bins):
            low = round(min_p + i * step, 0)
            high = round(min_p + (i + 1) * step, 0)
            bin_labels.append(f"{int(low)}-{int(high)}")
        for p in self._products:
            idx = min(int((p.price - min_p) / step), bins - 1)
            bin_counts[idx] += 1
        return {"bins": bin_counts, "labels": bin_labels}

    def platform_price_comparison(self) -> Dict[str, Any]:
        platform_data = {}
        for p in self._products:
            if p.platform not in platform_data:
                platform_data[p.platform] = []
            platform_data[p.platform].append(p.price)
        result = {}
        for platform, prices in platform_data.items():
            result[platform] = {
                "avg": round(sum(prices) / len(prices), 2),
                "min": round(min(prices), 2),
                "max": round(max(prices), 2),
                "count": len(prices),
            }
        return result

    def generate_trend_data(self) -> List[Dict[str, Any]]:
        import random
        platforms = list(set(p.platform for p in self._products))
        trend = []
        for p in self._products[:30]:
            history = []
            base = p.price
            for day_offset in range(30, 0, -1):
                fluctuation = random.uniform(-0.05, 0.05)
                day_price = round(base * (1 + fluctuation), 2)
                history.append({"day": -day_offset, "price": day_price})
            history.append({"day": 0, "price": p.price})
            trend.append({
                "product_id": p._id,
                "name": p.name,
                "platform": p.platform,
                "current_price": p.price,
                "history": history,
            })
        return trend

    def full_analysis(self) -> Dict[str, Any]:
        return {
            "cross_platform": self.cross_platform_compare(),
            "recommendations": self.value_recommendations(),
            "price_distribution": self.price_distribution(),
            "platform_comparison": self.platform_price_comparison(),
            "trend_data": self.generate_trend_data(),
        }
