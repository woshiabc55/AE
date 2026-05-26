import json
from typing import List, Dict, Any


def export_json(data: Dict[str, Any], filepath: str = "") -> str:
    output = json.dumps(data, ensure_ascii=False, indent=2)
    if filepath:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(output)
    return output
