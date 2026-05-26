from typing import List, Dict, Any

PLATFORM_MAP = {"jd": "京东", "tb": "淘宝", "pdd": "拼多多"}
BADGE_MAP = {
    "best_value": "🏆 最佳性价比",
    "best_quality": "⭐ 品质之选",
    "best_seller": "🔥 销量冠军",
    "good_deal": "💰 超值好价",
}


def render_table(products: List[Dict[str, Any]]) -> str:
    if not products:
        return "暂无数据"

    col_widths = {
        "name": 30,
        "price": 10,
        "originalPrice": 10,
        "sales": 10,
        "storeName": 18,
        "storeRating": 8,
        "platform": 8,
        "score": 8,
    }

    header = (
        f"{'商品名称':<{col_widths['name']}} "
        f"{'现价':>{col_widths['price']}} "
        f"{'原价':>{col_widths['originalPrice']}} "
        f"{'销量':>{col_widths['sales']}} "
        f"{'店铺':<{col_widths['storeName']}} "
        f"{'评分':>{col_widths['storeRating']}} "
        f"{'平台':^{col_widths['platform']}} "
        f"{'评分':>{col_widths['score']}}"
    )

    separator = "─" * len(header)

    lines = [separator, header, separator]

    for p in products:
        name = _truncate(p["name"], col_widths["name"])
        platform = PLATFORM_MAP.get(p["platform"], p["platform"])

        line = (
            f"{name:<{col_widths['name']}} "
            f"¥{p['price']:>{col_widths['price'] - 1}} "
            f"¥{p['originalPrice']:>{col_widths['originalPrice'] - 1}} "
            f"{_format_sales(p['sales']):>{col_widths['sales']}} "
            f"{_truncate(p['storeName'], col_widths['storeName']):<{col_widths['storeName']}} "
            f"{p['storeRating']:>{col_widths['storeRating']}} "
            f"{platform:^{col_widths['platform']}} "
            f"{p.get('score', 'N/A'):>{col_widths['score']}}"
        )
        lines.append(line)

    lines.append(separator)
    return "\n".join(lines)


def render_recommendations(recommendations: List[Dict[str, Any]]) -> str:
    if not recommendations:
        return "暂无推荐"

    lines = ["\n📋 性价比推荐", "═" * 60]

    for rec in recommendations:
        p = rec["product"]
        badge = BADGE_MAP.get(rec["badge"], rec["badge"])
        platform = PLATFORM_MAP.get(p["platform"], p["platform"])

        lines.append(f"\n{badge}")
        lines.append(f"  商品：{p['name']}")
        lines.append(f"  价格：¥{p['price']} (原价¥{p['originalPrice']}) | 平台：{platform}")
        lines.append(f"  店铺：{p['storeName']} (评分{p['storeRating']}) | 销量：{_format_sales(p['sales'])}")
        lines.append(f"  综合评分：{rec['score']} | 推荐理由：{rec['reason']}")

    return "\n".join(lines)


def render_comparison(comparison: Dict[str, Any]) -> str:
    if not comparison:
        return "暂无对比数据"

    lines = ["\n📊 横向对比分析", "═" * 60]

    pr = comparison["priceRange"]
    lines.append(f"  价格区间：¥{pr['min']} ~ ¥{pr['max']} | 均价：¥{pr['avg']}")

    lines.append("\n  各平台均价：")
    for plat, avg in comparison["platformAvgPrices"].items():
        platform = PLATFORM_MAP.get(plat, plat)
        bar_len = int(avg / pr["max"] * 30)
        lines.append(f"    {platform}：¥{avg} {'█' * bar_len}")

    cheapest = comparison["cheapest"]
    platform = PLATFORM_MAP.get(cheapest["platform"], cheapest["platform"])
    lines.append(f"\n  🏷️ 最低价：¥{cheapest['price']} ({platform} - {cheapest['storeName']})")

    highest = comparison["highestRated"]
    platform = PLATFORM_MAP.get(highest["platform"], highest["platform"])
    lines.append(f"  ⭐ 最高评分：{highest['storeRating']} ({platform} - {highest['storeName']})")

    best = comparison["bestSeller"]
    platform = PLATFORM_MAP.get(best["platform"], best["platform"])
    lines.append(f"  🔥 最高销量：{_format_sales(best['sales'])} ({platform} - {best['storeName']})")

    return "\n".join(lines)


def _truncate(text: str, max_len: int) -> str:
    if len(text) <= max_len:
        return text
    return text[: max_len - 2] + ".."


def _format_sales(sales: int) -> str:
    if sales >= 10000:
        return f"{sales / 10000:.1f}万"
    return str(sales)
