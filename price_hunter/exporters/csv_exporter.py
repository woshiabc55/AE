import csv
import io
from typing import List, Dict, Any


def export_csv(products: List[Dict[str, Any]], filepath: str = "") -> str:
    if not products:
        return ""

    fieldnames = [
        "id", "name", "price", "originalPrice", "sales",
        "storeName", "storeRating", "platform", "url", "score",
    ]
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    for p in products:
        writer.writerow(p)

    content = output.getvalue()
    output.close()

    if filepath:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

    return content
