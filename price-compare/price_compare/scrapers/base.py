from abc import ABC, abstractmethod
from typing import List
from ..models import Product


class BaseScraper(ABC):
    platform_name: str = ""
    platform_display: str = ""

    @abstractmethod
    def search(self, keyword: str, page: int = 1, count: int = 20) -> List[Product]:
        raise NotImplementedError

    @abstractmethod
    def get_product_detail(self, product_id: str) -> Product:
        raise NotImplementedError

    def get_platform_name(self) -> str:
        return self.platform_name
