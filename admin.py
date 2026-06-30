"""Medicine catalogue model."""
from app import db
from datetime import datetime


class Medicine(db.Model):
    __tablename__ = "medicines"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, index=True)
    brand = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False, index=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    unit = db.Column(db.String(100), nullable=False)  # e.g. "Strip of 10"
    stock = db.Column(db.Integer, default=0)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    order_items = db.relationship("OrderItem", backref="medicine", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "category": self.category,
            "price": float(self.price),
            "unit": self.unit,
            "stock": self.stock,
            "description": self.description,
            "is_active": self.is_active,
        }
