from typing import List, Dict, Any
import hashlib


def dedup_products(products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen = set()
    deduped = []

    for p in products:
        fingerprint = _fingerprint(p)
        if fingerprint in seen:
            continue
        seen.add(fingerprint)
        deduped.append(p)

    return deduped


def _fingerprint(product: Dict[str, Any]) -> str:
    name = product.get("name", "").lower().strip()
    platform = product.get("platform", "")
    store = product.get("storeName", "").lower().strip()
    price = round(product.get("price", 0), 0)

    key = f"{name}|{platform}|{store}|{price}"
    return hashlib.md5(key.encode()).hexdigest()
