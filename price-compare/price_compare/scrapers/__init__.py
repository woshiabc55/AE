from .jd import JDScraper
from .taobao import TaobaoScraper
from .pdd import PDDScraper

SCRAPERS = {
    "jd": JDScraper,
    "taobao": TaobaoScraper,
    "pdd": PDDScraper,
}

__all__ = ["SCRAPERS", "JDScraper", "TaobaoScraper", "PDDScraper"]
