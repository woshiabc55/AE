from abc import ABC, abstractmethod
from typing import List
from ..models import Product


class BaseScraper(ABC):
    platform_name: str = ""
    base_url: str = ""

    @abstractmethod
    def search(self, keyword: str, page: int = 1) -> List[Product]:
        raise NotImplementedError

    def get_platform(self) -> str:
        return self.platform_name
