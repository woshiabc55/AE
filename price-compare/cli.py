#!/usr/bin/env python3
import argparse
import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from price_compare.scrapers import SCRAPERS
from price_compare.processor import DataProcessor
from price_compare.analyzer import Analyzer

PLATFORM_MAP = {
    "jd": "京东",
    "taobao": "淘宝",
    "pdd": "拼多多",
}


def collect(keyword: str, platforms: list, count: int = 20):
    all_products = []
    for plat_key in platforms:
        if plat_key not in SCRAPERS:
            print(f"  ⚠ 不支持的平台: {plat_key}", file=sys.stderr)
            continue
        scraper_cls = SCRAPERS[plat_key]
        scraper = scraper_cls()
        plat_name = PLATFORM_MAP.get(plat_key, plat_key)
        print(f"  📡 正在从 {plat_name} 采集 '{keyword}' ...", file=sys.stderr)
        try:
            products = scraper.search(keyword, count=count)
            all_products.extend(products)
            print(f"  ✅ {plat_name} 采集到 {len(products)} 条数据", file=sys.stderr)
        except Exception as e:
            print(f"  ❌ {plat_name} 采集失败: {e}", file=sys.stderr)
    return all_products


def format_price(price: float) -> str:
    return f"¥{price:,.2f}"


def format_sales(sales: int) -> str:
    if sales >= 10000:
        return f"{sales / 10000:.1f}万"
    return str(sales)


def print_products_table(products, limit=30):
    print(f"\n{'='*120}")
    print(f"  商品列表（按价格从低到高，显示前{limit}条）")
    print(f"{'='*120}")
    header = f"{'序号':>4} {'平台':<6} {'商品名称':<40} {'价格':>12} {'原价':>12} {'销量':>10} {'店铺评分':>8} {'店铺':<20}"
    print(header)
    print("-" * 120)
    for i, p in enumerate(products[:limit], 1):
        name = p.name[:38] + ".." if len(p.name) > 40 else p.name
        plat = PLATFORM_MAP.get(p.platform, p.platform)
        store = p.store_name[:18] + ".." if len(p.store_name) > 20 else p.store_name
        orig = format_price(p.original_price) if p.original_price else "-"
        print(f"{i:>4} {plat:<6} {name:<40} {format_price(p.price):>12} {orig:>12} {format_sales(p.sales):>10} {p.store_rating:>8.1f} {store:<20}")
    print(f"{'='*120}\n")


def print_stats(stats):
    print(f"\n{'='*60}")
    print(f"  数据统计摘要")
    print(f"{'='*60}")
    print(f"  总商品数: {stats.get('total', 0)}")
    print(f"  价格范围: {format_price(stats.get('price_min', 0))} ~ {format_price(stats.get('price_max', 0))}")
    print(f"  平均价格: {format_price(stats.get('price_avg', 0))}")
    print(f"  中位价格: {format_price(stats.get('price_median', 0))}")
    print(f"  平均评分: {stats.get('rating_avg', 0):.2f}")
    plat_counts = stats.get("platform_counts", {})
    for k, v in plat_counts.items():
        print(f"  {PLATFORM_MAP.get(k, k)}: {v} 条")
    print(f"{'='*60}\n")


def print_recommendations(recs):
    print(f"\n{'='*100}")
    print(f"  🏆 性价比推荐 TOP 10")
    print(f"{'='*100}")
    for i, rec in enumerate(recs, 1):
        p = rec["product"]
        tags = " | ".join(rec["tags"]) if rec["tags"] else "综合推荐"
        plat = PLATFORM_MAP.get(p["platform"], p["platform"])
        print(f"  {i:>2}. [{plat}] {p['name'][:50]}")
        print(f"      价格: {format_price(p['price'])}  评分: {p['store_rating']}  销量: {format_sales(p['sales'])}  性价比分: {rec['score']}")
        print(f"      标签: {tags}")
        print(f"      链接: {p['url']}")
        print()
    print(f"{'='*100}\n")


def print_cross_platform(compare):
    print(f"\n{'='*80}")
    print(f"  📊 跨平台价格对比")
    print(f"{'='*80}")
    for item in compare[:10]:
        print(f"  品牌: {item['brand']}")
        cheapest = PLATFORM_MAP.get(item.get("cheapest_platform", ""), "")
        spread = item.get("price_spread", 0)
        print(f"  价差: {format_price(spread)}  最低价平台: {cheapest}")
        for plat, data in item["platforms"].items():
            plat_name = PLATFORM_MAP.get(plat, plat)
            print(f"    {plat_name}: 均价{format_price(data['avg_price'])}  最低{format_price(data['min_price'])}  均销{format_sales(data['avg_sales'])}  均分{data['avg_rating']}")
        print()
    print(f"{'='*80}\n")


def main():
    parser = argparse.ArgumentParser(
        description="电商商品价格自动化采集与对比工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python cli.py 手机
  python cli.py 笔记本 --platforms jd taobao --count 30
  python cli.py 耳机 --output result.json
  python cli.py 键盘 --min-price 100 --max-price 500
        """,
    )
    parser.add_argument("keyword", help="搜索关键词")
    parser.add_argument("--platforms", "-p", nargs="+", default=["jd", "taobao", "pdd"],
                        choices=["jd", "taobao", "pdd"], help="采集平台 (默认全部)")
    parser.add_argument("--count", "-n", type=int, default=20, help="每个平台采集数量 (默认20)")
    parser.add_argument("--output", "-o", help="输出JSON文件路径")
    parser.add_argument("--min-price", type=float, default=0, help="最低价格过滤")
    parser.add_argument("--max-price", type=float, default=float("inf"), help="最高价格过滤")
    parser.add_argument("--min-sales", type=int, default=0, help="最低销量过滤")
    parser.add_argument("--min-rating", type=float, default=0, help="最低店铺评分过滤")
    parser.add_argument("--limit", type=int, default=30, help="表格显示条数 (默认30)")
    parser.add_argument("--quiet", "-q", action="store_true", help="静默模式，只输出JSON")

    args = parser.parse_args()

    if not args.quiet:
        print(f"\n🛒 电商价格采集对比工具")
        print(f"   关键词: {args.keyword}")
        print(f"   平台: {', '.join(PLATFORM_MAP.get(p, p) for p in args.platforms)}")
        print(f"   每平台采集: {args.count} 条\n")

    products = collect(args.keyword, args.platforms, args.count)

    if not args.quiet:
        print(f"\n📦 共采集 {len(products)} 条原始数据，开始处理...\n")

    processor = DataProcessor(products)
    processed = processor.process()

    from price_compare.processor import filter_by_price_range, filter_by_min_sales, filter_by_min_rating
    processed = filter_by_price_range(processed, args.min_price, args.max_price)
    processed = filter_by_min_sales(processed, args.min_sales)
    processed = filter_by_min_rating(processed, args.min_rating)

    stats = processor.get_stats()
    analyzer = Analyzer(processed)
    analysis = analyzer.full_analysis()

    if args.quiet:
        output = {
            "keyword": args.keyword,
            "products": [p.to_dict() for p in processed],
            "stats": stats,
            "analysis": analysis,
        }
        print(json.dumps(output, ensure_ascii=False, indent=2))
    else:
        print_products_table(processed, args.limit)
        print_stats(stats)
        print_recommendations(analysis["recommendations"])
        print_cross_platform(analysis["cross_platform"])

    if args.output:
        output = {
            "keyword": args.keyword,
            "products": [p.to_dict() for p in processed],
            "stats": stats,
            "analysis": analysis,
        }
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        if not args.quiet:
            print(f"💾 结果已保存到: {args.output}")


if __name__ == "__main__":
    main()
