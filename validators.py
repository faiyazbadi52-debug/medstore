"""Order and OrderItem models."""
import uuid
from app import db
from datetime import datetime


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(20), unique=True, nullable=False, index=True)

    # Customer info
    full_name = db.Column(db.String(150), nullable=False)
    mobile = db.Column(db.String(15), nullable=False, index=True)
    email = db.Column(db.String(150))

    # Delivery address
    address = db.Column(db.Text, nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    pin_code = db.Column(db.String(10), nullable=False)
    landmark = db.Column(db.String(200))

    # Order details
    payment_method = db.Column(db.String(50), default="Cash on Delivery")
    order_notes = db.Column(db.Text)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(
        db.Enum("Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"),
        default="Pending",
        nullable=False,
        index=True,
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    items = db.relationship("OrderItem", backref="order", lazy=True, cascade="all, delete-orphan")

    @staticmethod
    def generate_order_id():
        """Generate a unique order ID like MED-20240629-A3X9."""
        date_part = datetime.utcnow().strftime("%Y%m%d")
        random_part = uuid.uuid4().hex[:6].upper()
        return f"MED-{date_part}-{random_part}"

    def to_dict(self, include_items=False):
        data = {
            "id": self.id,
            "order_id": self.order_id,
            "full_name": self.full_name,
            "mobile": self.mobile,
            "email": self.email,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "pin_code": self.pin_code,
            "landmark": self.landmark,
            "payment_method": self.payment_method,
            "order_notes": self.order_notes,
            "total_amount": float(self.total_amount),
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_items:
            data["items"] = [item.to_dict() for item in self.items]
        return data


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id_fk = db.Column(db.Integer, db.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    medicine_id = db.Column(db.Integer, db.ForeignKey("medicines.id"), nullable=False)

    medicine_name = db.Column(db.String(200), nullable=False)  # snapshot at order time
    medicine_brand = db.Column(db.String(100))
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "medicine_id": self.medicine_id,
            "medicine_name": self.medicine_name,
            "medicine_brand": self.medicine_brand,
            "unit_price": float(self.unit_price),
            "quantity": self.quantity,
            "subtotal": float(self.subtotal),
        }
