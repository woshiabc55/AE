from typing import List, Dict, Any
import re


def clean_products(products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    cleaned = []
    for p in products:
        if not p.get("name") or not p.get("price"):
            continue

        p["name"] = _clean_name(p["name"])
        p["price"] = _clean_price(p["price"])
        p["originalPrice"] = _clean_price(p.get("originalPrice", p["price"]))
        p["sales"] = _clean_sales(p.get("sales", 0))
        p["storeRating"] = _clean_rating(p.get("storeRating", 0))

        if p["price"] <= 0:
            continue

        if p["originalPrice"] < p["price"]:
            p["originalPrice"] = p["price"]

        cleaned.append(p)

    return cleaned


def _clean_name(name: str) -> str:
    name = re.sub(r"\s+", " ", name).strip()
    name = re.sub(r"[^\w\s\u4e00-\u9fff\-+（）().]", "", name)
    return name


def _clean_price(price) -> float:
    if isinstance(price, (int, float)):
        return float(price)
    if isinstance(price, str):
        cleaned = re.sub(r"[^\d.]", "", price)
        try:
            return float(cleaned)
        except ValueError:
            return 0.0
    return 0.0


def _clean_sales(sales) -> int:
    if isinstance(sales, int):
        return sales
    if isinstance(sales, str):
        multipliers = {"万": 10000, "k": 1000, "K": 1000, "w": 10000, "W": 10000}
        for suffix, mult in multipliers.items():
            if suffix in sales:
                try:
                    return int(float(sales.replace(suffix, "")) * mult)
                except ValueError:
                    return 0
        cleaned = re.sub(r"[^\d]", "", sales)
        return int(cleaned) if cleaned else 0
    return 0


def _clean_rating(rating) -> float:
    if isinstance(rating, (int, float)):
        return min(5.0, max(0.0, round(float(rating), 1)))
    return 0.0
