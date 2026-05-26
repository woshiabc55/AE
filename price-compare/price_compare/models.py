from dataclasses import dataclass, field, asdict
from typing import Optional
from datetime import datetime
import hashlib


@dataclass
class Product:
    name: str
    price: float
    sales: int
    store_name: str
    store_rating: float
    platform: str
    url: str
    keyword: str = ""
    image_url: str = ""
    original_price: Optional[float] = None
    discount: Optional[str] = None
    category: str = ""
    brand: str = ""
    collected_at: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    _id: str = field(default="")

    def __post_init__(self):
        if not self._id:
            raw = f"{self.platform}:{self.name}:{self.store_name}"
            self._id = hashlib.md5(raw.encode("utf-8")).hexdigest()[:12]
        if self.original_price is None:
            self.original_price = self.price

    @property
    def price_per_unit_value(self) -> float:
        if self.sales > 0:
            return self.price / max(self.store_rating, 0.1)
        return self.price

    @property
    def value_score(self) -> float:
        rating_factor = self.store_rating / 5.0
        sales_factor = min(self.sales / 10000, 1.0)
        price_factor = 1.0 / max(self.price, 0.01)
        return round((rating_factor * 0.3 + sales_factor * 0.3 + price_factor * 0.4) * 100, 2)

    def to_dict(self) -> dict:
        d = asdict(self)
        d["value_score"] = self.value_score
        d["price_per_unit_value"] = self.price_per_unit_value
        return d
