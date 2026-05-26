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
    discount: Optional[float] = None
    collected_at: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    product_id: str = ""

    def __post_init__(self):
        if not self.product_id:
            raw = f"{self.platform}:{self.name}:{self.store_name}"
            self.product_id = hashlib.md5(raw.encode("utf-8")).hexdigest()[:12]
        if self.original_price and self.original_price > 0 and not self.discount:
            self.discount = round(self.price / self.original_price, 2)

    def to_dict(self):
        return asdict(self)
