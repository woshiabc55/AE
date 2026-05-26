from abc import ABC, abstractmethod
from typing import List, Dict, Any


class BaseScraper(ABC):
    platform: str = ""
    platform_name: str = ""
    base_url: str = ""

    @abstractmethod
    def search(self, keyword: str, count: int = 10) -> List[Dict[str, Any]]:
        pass

    def _build_product(
        self,
        name: str,
        price: float,
        original_price: float,
        sales: int,
        store_name: str,
        store_rating: float,
        url: str,
        image_url: str = "",
    ) -> Dict[str, Any]:
        import uuid
        return {
            "id": str(uuid.uuid4()),
            "name": name,
            "price": round(price, 2),
            "originalPrice": round(original_price, 2),
            "sales": sales,
            "storeName": store_name,
            "storeRating": round(store_rating, 1),
            "platform": self.platform,
            "url": url,
            "imageUrl": image_url,
        }
