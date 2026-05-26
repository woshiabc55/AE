#!/usr/bin/env python3
import argparse
import json
import sys
import os
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from price_hunter.scrapers.jd import JDScraper
from price_hunter.scrapers.taobao import TaobaoScraper
from price_hunter.scrapers.pinduoduo import PinduoduoScraper
from price_hunter.processors.cleaner import clean_products
from price_hunter.processors.dedup import dedup_products
from price_hunter.processors.scorer import score_products, get_recommendations, get_comparison
from price_hunter.exporters.json_exporter import export_json
from price_hunter.exporters.csv_exporter import export_csv
from price_hunter.exporters.table_renderer import render_table, render_recommendations, render_comparison
from price_hunter.demo_data import get_demo_data

SCRAPERS = {
    "jd": JDScraper,
    "tb": TaobaoScraper,
    "pdd": PinduoduoScraper,
}

PLATFORM_NAMES = {"jd": "京东", "tb": "淘宝", "pdd": "拼多多"}


def search(keyword: str, platforms: list, count: int = 10) -> dict:
    all_products = []

    def scrape_platform(platform_key: str):
        scraper = SCRAPERS[platform_key]()
        return scraper.search(keyword, count)

    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {executor.submit(scrape_platform, p): p for p in platforms}
        for future in as_completed(futures):
            platform = futures[future]
            try:
                products = future.result()
                all_products.extend(products)
            except Exception as e:
                print(f"  ⚠ {PLATFORM_NAMES[platform]}采集失败: {e}", file=sys.stderr)

    cleaned = clean_products(all_products)
    deduped = dedup_products(cleaned)
    scored = score_products(deduped)
    sorted_products = sorted(scored, key=lambda x: x["price"])

    comparison = get_comparison(sorted_products)
    recommendations = get_recommendations(sorted_products)

    return {
        "keyword": keyword,
        "timestamp": datetime.now().isoformat(),
        "products": sorted_products,
        "comparison": comparison,
        "recommendations": recommendations,
    }


def cmd_search(args):
    platforms = [p.strip() for p in args.platforms.split(",")]
    invalid = [p for p in platforms if p not in SCRAPERS]
    if invalid:
        print(f"❌ 不支持的平台: {', '.join(invalid)}")
        print(f"   支持的平台: jd(京东), tb(淘宝), pdd(拼多多)")
        sys.exit(1)

    print(f"🔍 正在搜索: {args.keyword}")
    print(f"   平台: {', '.join(PLATFORM_NAMES.get(p, p) for p in platforms)}")
    print()

    result = search(args.keyword, platforms, args.count)

    fmt = args.format
    if fmt == "json":
        output = export_json(result)
        print(output)
    elif fmt == "csv":
        output = export_csv(result["products"])
        print(output)
    else:
        print(render_table(result["products"]))
        print(render_comparison(result["comparison"]))
        print(render_recommendations(result["recommendations"]))

    if args.output:
        ext = args.output.rsplit(".", 1)[-1] if "." in args.output else "json"
        if ext == "csv":
            export_csv(result["products"], args.output)
        else:
            export_json(result, args.output)
        print(f"\n💾 结果已保存到: {args.output}")


def cmd_compare(args):
    platforms = [p.strip() for p in args.platforms.split(",")]
    print(f"📊 正在生成对比报告: {args.keyword}")
    print()

    result = search(args.keyword, platforms, args.count)

    print(render_comparison(result["comparison"]))
    print(render_recommendations(result["recommendations"]))

    if args.output:
        export_json(result, args.output)
        print(f"\n💾 报告已保存到: {args.output}")


def cmd_demo(args):
    print("📋 加载演示数据...")
    print()

    demo = get_demo_data()
    scored = score_products(demo["products"])
    demo["products"] = sorted(scored, key=lambda x: x["price"])
    demo["comparison"] = get_comparison(demo["products"])
    demo["recommendations"] = get_recommendations(demo["products"])

    print(render_table(demo["products"]))
    print(render_comparison(demo["comparison"]))
    print(render_recommendations(demo["recommendations"]))


def main():
    parser = argparse.ArgumentParser(
        description="电商商品价格自动化采集与对比工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python -m price_hunter search "iPhone 16" --platforms jd,tb,pdd
  python -m price_hunter search "耳机" --platforms jd --format json
  python -m price_hunter compare "笔记本" --output report.json
  python -m price_hunter demo
        """,
    )
    subparsers = parser.add_subparsers(dest="command", help="可用命令")

    search_parser = subparsers.add_parser("search", help="搜索采集商品")
    search_parser.add_argument("keyword", help="搜索关键词")
    search_parser.add_argument("--platforms", default="jd,tb,pdd", help="平台列表，逗号分隔 (默认: jd,tb,pdd)")
    search_parser.add_argument("--count", type=int, default=5, help="每平台采集数量 (默认: 5)")
    search_parser.add_argument("--format", choices=["table", "json", "csv"], default="table", help="输出格式 (默认: table)")
    search_parser.add_argument("--output", default="", help="输出文件路径")

    compare_parser = subparsers.add_parser("compare", help="生成对比报告")
    compare_parser.add_argument("keyword", help="搜索关键词")
    compare_parser.add_argument("--platforms", default="jd,tb,pdd", help="平台列表，逗号分隔 (默认: jd,tb,pdd)")
    compare_parser.add_argument("--count", type=int, default=5, help="每平台采集数量 (默认: 5)")
    compare_parser.add_argument("--output", default="", help="输出文件路径")

    demo_parser = subparsers.add_parser("demo", help="运行演示数据")

    args = parser.parse_args()

    if args.command == "search":
        cmd_search(args)
    elif args.command == "compare":
        cmd_compare(args)
    elif args.command == "demo":
        cmd_demo(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
