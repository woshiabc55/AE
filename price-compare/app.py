from flask import Flask, request, jsonify, render_template
from price_compare.scrapers import ALL_SCRAPERS
from price_compare.processor import DataProcessor
from price_compare.analyzer import Analyzer

app = Flask(__name__, template_folder="templates", static_folder="static")

PLATFORM_MAP = {s.platform_name: s for s in ALL_SCRAPERS}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/search", methods=["POST"])
def api_search():
    data = request.get_json() or {}
    keyword = (data.get("keyword") or "").strip()
    if not keyword:
        return jsonify({"error": "请输入搜索关键词"}), 400

    platforms = data.get("platforms") or list(PLATFORM_MAP.keys())
    min_price = data.get("min_price")
    max_price = data.get("max_price")

    all_products = []
    for pf in platforms:
        if pf not in PLATFORM_MAP:
            continue
        scraper = PLATFORM_MAP[pf]()
        try:
            results = scraper.search(keyword)
            all_products.extend(results)
        except Exception as e:
            print(f"Error scraping {pf}: {e}")

    processor = DataProcessor(all_products)
    processor.clean().deduplicate().filter_by_price_range(min_price, max_price).sort_by_price(ascending=True)
    products = processor.get_all()

    comparison = processor.compare()
    analyzer = Analyzer(products)
    recommendations = analyzer.recommend(top_n=5)
    trend = analyzer.price_trend()
    distribution = analyzer.price_distribution()

    return jsonify({
        "success": True,
        "keyword": keyword,
        "total": len(products),
        "products": [p.to_dict() for p in products],
        "comparison": comparison,
        "recommendations": recommendations,
        "price_trend": trend,
        "price_distribution": distribution,
    })


@app.route("/api/demo")
def api_demo():
    from price_compare.models import Product
    demo_data = [
        Product(name="小米 手机 Pro", price=2999.0, sales=150000, store_name="京东自营旗舰店", store_rating=4.9, platform="京东", url="https://item.jd.com/demo1.html", original_price=3499.0, discount=0.86, keyword="手机"),
        Product(name="华为 手机 Max", price=3999.0, sales=98000, store_name="京东官方旗舰店", store_rating=4.8, platform="京东", url="https://item.jd.com/demo2.html", original_price=4599.0, discount=0.87, keyword="手机"),
        Product(name="苹果 手机 标准版", price=5499.0, sales=220000, store_name="天猫旗舰店", store_rating=4.9, platform="淘宝", url="https://item.taobao.com/item.htm?id=demo3", original_price=6199.0, discount=0.89, keyword="手机"),
        Product(name="OPPO 手机 Ultra", price=2599.0, sales=78000, store_name="品牌授权专卖店", store_rating=4.7, platform="淘宝", url="https://item.taobao.com/item.htm?id=demo4", original_price=3099.0, discount=0.84, keyword="手机"),
        Product(name="vivo 手机 SE", price=1899.0, sales=320000, store_name="百亿补贴店", store_rating=4.8, platform="拼多多", url="https://mobile.yangkeduo.com/goods.html?goods_id=demo5", original_price=2499.0, discount=0.76, keyword="手机"),
        Product(name="荣耀 手机 Lite", price=1699.0, sales=180000, store_name="品牌特卖店", store_rating=4.6, platform="拼多多", url="https://mobile.yangkeduo.com/goods.html?goods_id=demo6", original_price=2199.0, discount=0.77, keyword="手机"),
        Product(name="三星 手机 Plus", price=3499.0, sales=45000, store_name="京东数码专营店", store_rating=4.7, platform="京东", url="https://item.jd.com/demo7.html", original_price=3999.0, discount=0.88, keyword="手机"),
        Product(name="一加 手机 典藏版", price=2799.0, sales=65000, store_name="品牌直营店", store_rating=4.8, platform="淘宝", url="https://item.taobao.com/item.htm?id=demo8", original_price=3299.0, discount=0.85, keyword="手机"),
        Product(name="realme 手机 高配版", price=1499.0, sales=280000, store_name="工厂直销店", store_rating=4.5, platform="拼多多", url="https://mobile.yangkeduo.com/goods.html?goods_id=demo9", original_price=1999.0, discount=0.75, keyword="手机"),
        Product(name="魅族 手机 旗舰版", price=2299.0, sales=35000, store_name="品牌优选店", store_rating=4.6, platform="拼多多", url="https://mobile.yangkeduo.com/goods.html?goods_id=demo10", original_price=2799.0, discount=0.82, keyword="手机"),
    ]

    processor = DataProcessor(demo_data)
    processor.clean().deduplicate().sort_by_price(ascending=True)
    products = processor.get_all()
    comparison = processor.compare()
    analyzer = Analyzer(products)
    recommendations = analyzer.recommend(top_n=5)
    trend = analyzer.price_trend()
    distribution = analyzer.price_distribution()

    return jsonify({
        "success": True,
        "keyword": "手机",
        "is_demo": True,
        "total": len(products),
        "products": [p.to_dict() for p in products],
        "comparison": comparison,
        "recommendations": recommendations,
        "price_trend": trend,
        "price_distribution": distribution,
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
