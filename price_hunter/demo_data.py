import random
import json
from typing import Dict, Any

random.seed(42)

DEMO_KEYWORD = "iPhone 16"

DEMO_PRODUCTS = [
    {"id": "jd-001", "name": "iPhone 16 旗舰版 a1b2c3", "price": 5499.00, "originalPrice": 6299.00, "sales": 85000, "storeName": "京东自营旗舰店", "storeRating": 4.9, "platform": "jd", "url": "https://item.jd.com/1000123456.html", "imageUrl": "", "score": 87.5},
    {"id": "jd-002", "name": "iPhone 16 标准版 d4e5f6", "price": 5199.00, "originalPrice": 5999.00, "sales": 120000, "storeName": "京东官方旗舰店", "storeRating": 4.8, "platform": "jd", "url": "https://item.jd.com/1000789012.html", "imageUrl": "", "score": 82.3},
    {"id": "jd-003", "name": "iPhone 16 尊享版 g7h8i9", "price": 6299.00, "originalPrice": 6999.00, "sales": 45000, "storeName": "京东数码专营店", "storeRating": 4.7, "platform": "jd", "url": "https://item.jd.com/1000345678.html", "imageUrl": "", "score": 68.1},
    {"id": "jd-004", "name": "iPhone 16 高配版 j0k1l2", "price": 5899.00, "originalPrice": 6599.00, "sales": 67000, "storeName": "京东家电旗舰店", "storeRating": 4.8, "platform": "jd", "url": "https://item.jd.com/1000567890.html", "imageUrl": "", "score": 75.6},
    {"id": "jd-005", "name": "iPhone 16 经典版 m3n4o5", "price": 4999.00, "originalPrice": 5799.00, "sales": 95000, "storeName": "京东品牌授权店", "storeRating": 4.6, "platform": "jd", "url": "https://item.jd.com/1000987654.html", "imageUrl": "", "score": 85.2},
    {"id": "tb-001", "name": "iPhone 16 天猫正品 p6q7r8", "price": 5299.00, "originalPrice": 6199.00, "sales": 150000, "storeName": "天猫官方旗舰店", "storeRating": 4.9, "platform": "tb", "url": "https://item.taobao.com/item.htm?id=123456789", "imageUrl": "", "score": 80.4},
    {"id": "tb-002", "name": "iPhone 16 官方授权 s9t0u1", "price": 5099.00, "originalPrice": 5999.00, "sales": 180000, "storeName": "品牌直营店", "storeRating": 4.8, "platform": "tb", "url": "https://item.taobao.com/item.htm?id=234567890", "imageUrl": "", "score": 83.7},
    {"id": "tb-003", "name": "iPhone 16 爆款直降 v2w3x4", "price": 4899.00, "originalPrice": 5899.00, "sales": 220000, "storeName": "天猫优品店", "storeRating": 4.7, "platform": "tb", "url": "https://item.taobao.com/item.htm?id=345678901", "imageUrl": "", "score": 88.9},
    {"id": "tb-004", "name": "iPhone 16 限时特惠 y5z6a7", "price": 5599.00, "originalPrice": 6499.00, "sales": 90000, "storeName": "淘宝精选店", "storeRating": 4.5, "platform": "tb", "url": "https://item.taobao.com/item.htm?id=456789012", "imageUrl": "", "score": 70.2},
    {"id": "tb-005", "name": "iPhone 16 新品首发 b8c9d0", "price": 5399.00, "originalPrice": 6299.00, "sales": 110000, "storeName": "金牌卖家店", "storeRating": 4.6, "platform": "tb", "url": "https://item.taobao.com/item.htm?id=567890123", "imageUrl": "", "score": 76.8},
    {"id": "pdd-001", "name": "iPhone 16 百亿补贴 e1f2g3", "price": 4699.00, "originalPrice": 5999.00, "sales": 350000, "storeName": "百亿补贴店", "storeRating": 4.9, "platform": "pdd", "url": "https://mobile.yangkeduo.com/goods.html?goods_id=111222333", "imageUrl": "", "score": 92.3},
    {"id": "pdd-002", "name": "iPhone 16 万人团 h4i5j6", "price": 4799.00, "originalPrice": 5899.00, "sales": 280000, "storeName": "万人团店", "storeRating": 4.5, "platform": "pdd", "url": "https://mobile.yangkeduo.com/goods.html?goods_id=222333444", "imageUrl": "", "score": 89.1},
    {"id": "pdd-003", "name": "iPhone 16 限时秒杀 k7l8m9", "price": 4599.00, "originalPrice": 5799.00, "sales": 420000, "storeName": "品牌黑标店", "storeRating": 4.8, "platform": "pdd", "url": "https://mobile.yangkeduo.com/goods.html?goods_id=333444555", "imageUrl": "", "score": 94.6},
    {"id": "pdd-004", "name": "iPhone 16 品牌特卖 n0o1p2", "price": 4999.00, "originalPrice": 6099.00, "sales": 190000, "storeName": "正品保障店", "storeRating": 4.6, "platform": "pdd", "url": "https://mobile.yangkeduo.com/goods.html?goods_id=444555666", "imageUrl": "", "score": 81.5},
    {"id": "pdd-005", "name": "iPhone 16 拼单特价 q3r4s5", "price": 4899.00, "originalPrice": 5999.00, "sales": 250000, "storeName": "拼购旗舰店", "storeRating": 4.7, "platform": "pdd", "url": "https://mobile.yangkeduo.com/goods.html?goods_id=555666777", "imageUrl": "", "score": 85.8},
]

DEMO_COMPARISON = {
    "cheapest": {"id": "pdd-003", "name": "iPhone 16 限时秒杀 k7l8m9", "price": 4599.00, "originalPrice": 5799.00, "sales": 420000, "storeName": "品牌黑标店", "storeRating": 4.8, "platform": "pdd", "url": "https://mobile.yangkeduo.com/goods.html?goods_id=333444555", "imageUrl": "", "score": 94.6},
    "highestRated": {"id": "jd-001", "name": "iPhone 16 旗舰版 a1b2c3", "price": 5499.00, "originalPrice": 6299.00, "sales": 85000, "storeName": "京东自营旗舰店", "storeRating": 4.9, "platform": "jd", "url": "https://item.jd.com/1000123456.html", "imageUrl": "", "score": 87.5},
    "bestSeller": {"id": "pdd-003", "name": "iPhone 16 限时秒杀 k7l8m9", "price": 4599.00, "originalPrice": 5799.00, "sales": 420000, "storeName": "品牌黑标店", "storeRating": 4.8, "platform": "pdd", "url": "https://mobile.yangkeduo.com/goods.html?goods_id=333444555", "imageUrl": "", "score": 94.6},
    "priceRange": {"min": 4599.00, "max": 6299.00, "avg": 5172.67},
    "platformAvgPrices": {"jd": 5579.00, "tb": 5219.00, "pdd": 4799.00},
}

DEMO_RECOMMENDATIONS = [
    {"product": {"id": "pdd-003", "name": "iPhone 16 限时秒杀 k7l8m9", "price": 4599.00, "originalPrice": 5799.00, "sales": 420000, "storeName": "品牌黑标店", "storeRating": 4.8, "platform": "pdd", "url": "https://mobile.yangkeduo.com/goods.html?goods_id=333444555", "imageUrl": "", "score": 94.6}, "score": 94.6, "badge": "best_value", "reason": "综合性价比最高，评分94.6分，价格¥4599.0"},
    {"product": {"id": "jd-001", "name": "iPhone 16 旗舰版 a1b2c3", "price": 5499.00, "originalPrice": 6299.00, "sales": 85000, "storeName": "京东自营旗舰店", "storeRating": 4.9, "platform": "jd", "url": "https://item.jd.com/1000123456.html", "imageUrl": "", "score": 87.5}, "score": 87.5, "badge": "best_quality", "reason": "店铺评分最高4.9分，品质保障"},
    {"product": {"id": "pdd-001", "name": "iPhone 16 百亿补贴 e1f2g3", "price": 4699.00, "originalPrice": 5999.00, "sales": 350000, "storeName": "百亿补贴店", "storeRating": 4.9, "platform": "pdd", "url": "https://mobile.yangkeduo.com/goods.html?goods_id=111222333", "imageUrl": "", "score": 92.3}, "score": 92.3, "badge": "best_seller", "reason": "销量最高350000件，大众之选"},
]


def get_demo_data() -> Dict[str, Any]:
    return {
        "keyword": DEMO_KEYWORD,
        "timestamp": "2026-05-26T10:00:00Z",
        "products": DEMO_PRODUCTS,
        "comparison": DEMO_COMPARISON,
        "recommendations": DEMO_RECOMMENDATIONS,
    }
