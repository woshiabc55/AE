#!/usr/bin/env python3
import argparse
import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from price_compare.scrapers import ALL_SCRAPERS
from price_compare.processor import DataProcessor
from price_compare.analyzer import Analyzer


PLATFORM_MAP = {s.platform_name: s for s in ALL_SCRAPERS}


def run_search(keyword: str, platforms: list = None, top_n: int = 10, min_price: float = None, max_price: float = None, output: str = None):
    if platforms is None:
        platforms = list(PLATFORM_MAP.keys())

    all_products = []
    for pf in platforms:
        if pf not in PLATFORM_MAP:
            print(f"⚠ 不支持的平台: {pf}，跳过")
            continue
        scraper = PLATFORM_MAP[pf]()
        print(f"🔍 正在从 {pf} 采集 '{keyword}' ...")
        try:
            results = scraper.search(keyword)
            all_products.extend(results)
            print(f"  ✅ 采集到 {len(results)} 条商品")
        except Exception as e:
            print(f"  ❌ 采集失败: {e}")

    if not all_products:
        print("未采集到任何商品数据")
        return

    processor = DataProcessor(all_products)
    processor.clean().deduplicate().filter_by_price_range(min_price, max_price).sort_by_price(ascending=True)
    products = processor.get_all()

    print(f"\n{'='*80}")
    print(f"📊 采集结果: 共 {len(products)} 条商品 (已清洗去重，按价格从低到高排序)")
    print(f"{'='*80}")

    for i, p in enumerate(products[:top_n], 1):
        discount_str = f"  折扣: {p.discount}" if p.discount else ""
        print(f"\n  [{i}] {p.name}")
        print(f"      平台: {p.platform}  |  价格: ¥{p.price}  |  原价: ¥{p.original_price}{discount_str}")
        print(f"      销量: {p.sales:,}  |  店铺: {p.store_name} (评分 {p.store_rating})")
        print(f"      链接: {p.url}")

    comparison = processor.compare()
    print(f"\n{'='*80}")
    print("📈 平台横向对比")
    print(f"{'='*80}")
    for platform, stats in comparison.items():
        print(f"\n  【{platform}】")
        print(f"    商品数: {stats['count']}  |  均价: ¥{stats['avg_price']}  |  最低: ¥{stats['min_price']}  |  最高: ¥{stats['max_price']}")
        print(f"    平均销量: {stats['avg_sales']:,}  |  平均店铺评分: {stats['avg_rating']}")

    analyzer = Analyzer(products)
    recommendations = analyzer.recommend(top_n=5)
    print(f"\n{'='*80}")
    print("🎯 性价比推荐 TOP 5")
    print(f"{'='*80}")
    for i, rec in enumerate(recommendations, 1):
        print(f"\n  [{i}] {rec['name']}")
        print(f"      平台: {rec['platform']}  |  价格: ¥{rec['price']}  |  性价比分: {rec['value_score']}")
        print(f"      标签: {rec['recommend_tag']}")

    trend = analyzer.price_trend()
    print(f"\n{'='*80}")
    print("📉 价格区间分布")
    print(f"{'='*80}")
    for platform, bins in trend.items():
        print(f"\n  【{platform}】")
        for b in bins:
            bar = "█" * b["count"]
            print(f"    {b['range']:>15s} | {bar} ({b['count']})")

    result = {
        "keyword": keyword,
        "total": len(products),
        "products": [p.to_dict() for p in products],
        "comparison": comparison,
        "recommendations": recommendations,
        "price_trend": trend,
        "price_distribution": analyzer.price_distribution(),
    }

    save_path = output or os.path.join(os.path.dirname(os.path.abspath(__file__)), "result.json")
    with open(save_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"\n💾 结果已保存到: {save_path}")


def main():
    parser = argparse.ArgumentParser(description="电商商品价格采集与对比工具")
    parser.add_argument("keyword", help="搜索关键词")
    parser.add_argument("-p", "--platforms", nargs="+", choices=list(PLATFORM_MAP.keys()), default=list(PLATFORM_MAP.keys()), help="指定采集平台")
    parser.add_argument("-n", "--top", type=int, default=10, help="显示前N条结果 (默认10)")
    parser.add_argument("--min-price", type=float, default=None, help="最低价格过滤")
    parser.add_argument("--max-price", type=float, default=None, help="最高价格过滤")
    parser.add_argument("-o", "--output", type=str, default=None, help="输出JSON文件路径")
    args = parser.parse_args()

    run_search(
        keyword=args.keyword,
        platforms=args.platforms,
        top_n=args.top,
        min_price=args.min_price,
        max_price=args.max_price,
        output=args.output,
    )


if __name__ == "__main__":
    main()
