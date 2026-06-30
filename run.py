"""Authentication routes — Admin login/logout."""
import bcrypt
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import limiter
from app.models.admin import Admin

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("10 per minute")
def login():
    data = request.get_json(silent=True) or {}
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", "")).strip()

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    admin = Admin.query.filter_by(username=username).first()
    if not admin or not bcrypt.checkpw(password.encode(), admin.password_hash.encode()):
        return jsonify({"error": "Invalid credentials."}), 401

    token = create_access_token(identity=str(admin.id))
    return jsonify({
        "message": "Login successful.",
        "token": token,
        "admin": admin.to_dict(),
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    admin_id = int(get_jwt_identity())
    admin = Admin.query.get(admin_id)
    if not admin:
        return jsonify({"error": "Admin not found."}), 404
    return jsonify({"admin": admin.to_dict()}), 200
