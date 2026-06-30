"""Input validation and sanitization utilities."""
import re
import bleach


def sanitize(value: str) -> str:
    """Strip HTML tags and limit length."""
    if not isinstance(value, str):
        return value
    return bleach.clean(value.strip(), tags=[], strip=True)


def validate_mobile(mobile: str) -> bool:
    """Validate Indian mobile number (10 digits, optionally prefixed with +91 or 0)."""
    pattern = r"^(?:\+91|91|0)?[6-9]\d{9}$"
    return bool(re.match(pattern, mobile.strip()))


def validate_pin(pin: str) -> bool:
    """Validate Indian PIN code (6 digits)."""
    return bool(re.match(r"^\d{6}$", pin.strip()))


def validate_email(email: str) -> bool:
    """Basic email validation."""
    pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    return bool(re.match(pattern, email.strip()))


def validate_order_payload(data: dict) -> list[str]:
    """Return list of validation error messages for order payload."""
    errors = []
    required = ["full_name", "mobile", "address", "city", "state", "pin_code", "items"]
    for field in required:
        if not data.get(field):
            errors.append(f"'{field}' is required.")

    if data.get("mobile") and not validate_mobile(str(data["mobile"])):
        errors.append("Invalid mobile number.")

    if data.get("pin_code") and not validate_pin(str(data["pin_code"])):
        errors.append("Invalid PIN code (must be 6 digits).")

    if data.get("email") and not validate_email(str(data["email"])):
        errors.append("Invalid email address.")

    items = data.get("items", [])
    if not isinstance(items, list) or len(items) == 0:
        errors.append("Order must contain at least one item.")
    else:
        for i, item in enumerate(items):
            if not item.get("medicine_id"):
                errors.append(f"Item {i+1}: 'medicine_id' is required.")
            qty = item.get("quantity", 0)
            if not isinstance(qty, int) or qty < 1:
                errors.append(f"Item {i+1}: quantity must be a positive integer.")
            if qty > 100:
                errors.append(f"Item {i+1}: quantity cannot exceed 100.")

    return errors
