#!/usr/bin/env python3
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from price_compare.scrapers import SCRAPERS
from price_compare.processor import DataProcessor, filter_by_price_range, filter_by_min_sales, filter_by_min_rating
from price_compare.analyzer import Analyzer

app = Flask(__name__, static_folder="web", static_url_path="")
CORS(app)

PLATFORM_MAP = {"jd": "京东", "taobao": "淘宝", "pdd": "拼多多"}


def _get_demo_data():
    demo_file = os.path.join(os.path.dirname(__file__), "demo_data.json")
    if os.path.exists(demo_file):
        with open(demo_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return None


@app.route("/")
def index():
    return send_from_directory("web", "index.html")


@app.route("/api/search", methods=["POST"])
def search():
    data = request.get_json() or {}
    keyword = data.get("keyword", "").strip()
    platforms = data.get("platforms", ["jd", "taobao", "pdd"])
    count = min(data.get("count", 20), 50)
    min_price = data.get("min_price", 0)
    max_price = data.get("max_price", float("inf"))
    min_sales = data.get("min_sales", 0)
    min_rating = data.get("min_rating", 0)

    if not keyword:
        return jsonify({"error": "关键词不能为空"}), 400

    all_products = []
    for plat_key in platforms:
        if plat_key not in SCRAPERS:
            continue
        scraper = SCRAPERS[plat_key]()
        try:
            products = scraper.search(keyword, count=count)
            all_products.extend(products)
        except Exception as e:
            print(f"Scraper error for {plat_key}: {e}")

    processor = DataProcessor(all_products)
    processed = processor.process()
    processed = filter_by_price_range(processed, min_price, max_price)
    processed = filter_by_min_sales(processed, min_sales)
    processed = filter_by_min_rating(processed, min_rating)

    stats = processor.get_stats()
    analyzer = Analyzer(processed)
    analysis = analyzer.full_analysis()

    return jsonify({
        "keyword": keyword,
        "products": [p.to_dict() for p in processed],
        "stats": stats,
        "analysis": analysis,
    })


@app.route("/api/demo", methods=["GET"])
def demo():
    demo_data = _get_demo_data()
    if demo_data:
        return jsonify(demo_data)
    return jsonify({"error": "Demo data not available"}), 404


@app.route("/api/platforms", methods=["GET"])
def get_platforms():
    return jsonify({
        "platforms": [
            {"key": k, "name": v} for k, v in PLATFORM_MAP.items()
        ]
    })


def generate_demo_data():
    print("Generating demo data...")
    keyword = "手机"
    all_products = []
    for plat_key in ["jd", "taobao", "pdd"]:
        scraper = SCRAPERS[plat_key]()
        products = scraper.search(keyword, count=15)
        all_products.extend(products)

    processor = DataProcessor(all_products)
    processed = processor.process()
    stats = processor.get_stats()
    analyzer = Analyzer(processed)
    analysis = analyzer.full_analysis()

    demo_data = {
        "keyword": keyword,
        "products": [p.to_dict() for p in processed],
        "stats": stats,
        "analysis": analysis,
    }

    demo_file = os.path.join(os.path.dirname(__file__), "demo_data.json")
    with open(demo_file, "w", encoding="utf-8") as f:
        json.dump(demo_data, f, ensure_ascii=False, indent=2)
    print(f"Demo data saved to {demo_file}")
    return demo_data


if __name__ == "__main__":
    demo_data = _get_demo_data()
    if not demo_data:
        generate_demo_data()
    app.run(host="0.0.0.0", port=5000, debug=False)
