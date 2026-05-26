from typing import List, Dict, Any


def score_products(products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not products:
        return []

    prices = [p["price"] for p in products]
    min_price = min(prices)
    max_price = max(prices)
    price_range = max_price - min_price if max_price != min_price else 1

    max_sales = max(p["sales"] for p in products) or 1

    for p in products:
        price_score = (1 - (p["price"] - min_price) / price_range) * 40
        rating_score = (p["storeRating"] / 5.0) * 30
        sales_score = (p["sales"] / max_sales) * 20
        discount = (p["originalPrice"] - p["price"]) / p["originalPrice"] if p["originalPrice"] > 0 else 0
        discount_score = min(discount * 100, 10)

        p["score"] = round(price_score + rating_score + sales_score + discount_score, 1)

    return products


def get_recommendations(products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not products:
        return []

    scored = score_products(products)
    sorted_by_score = sorted(scored, key=lambda x: x["score"], reverse=True)

    recommendations = []

    best_value = sorted_by_score[0]
    recommendations.append({
        "product": best_value,
        "score": best_value["score"],
        "badge": "best_value",
        "reason": f"综合性价比最高，评分{best_value['score']}分，价格¥{best_value['price']}",
    })

    highest_rated = max(scored, key=lambda x: x["storeRating"])
    if highest_rated["id"] != best_value["id"]:
        recommendations.append({
            "product": highest_rated,
            "score": highest_rated["score"],
            "badge": "best_quality",
            "reason": f"店铺评分最高{highest_rated['storeRating']}分，品质保障",
        })

    best_seller = max(scored, key=lambda x: x["sales"])
    if best_seller["id"] != best_value["id"]:
        recommendations.append({
            "product": best_seller,
            "score": best_seller["score"],
            "badge": "best_seller",
            "reason": f"销量最高{best_seller['sales']}件，大众之选",
        })

    cheapest = min(scored, key=lambda x: x["price"])
    if cheapest["id"] != best_value["id"]:
        recommendations.append({
            "product": cheapest,
            "score": cheapest["score"],
            "badge": "good_deal",
            "reason": f"全网最低价¥{cheapest['price']}，超值入手",
        })

    return recommendations[:4]


def get_comparison(products: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not products:
        return {}

    prices = [p["price"] for p in products]
    platform_avg = {}
    platform_products = {}

    for p in products:
        plat = p["platform"]
        if plat not in platform_products:
            platform_products[plat] = []
        platform_products[plat].append(p)

    for plat, prods in platform_products.items():
        plat_prices = [p["price"] for p in prods]
        platform_avg[plat] = round(sum(plat_prices) / len(plat_prices), 2)

    return {
        "cheapest": min(products, key=lambda x: x["price"]),
        "highestRated": max(products, key=lambda x: x["storeRating"]),
        "bestSeller": max(products, key=lambda x: x["sales"]),
        "priceRange": {
            "min": min(prices),
            "max": max(prices),
            "avg": round(sum(prices) / len(prices), 2),
        },
        "platformAvgPrices": platform_avg,
    }
