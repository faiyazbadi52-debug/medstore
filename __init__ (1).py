"""
MedStore Backend - Flask Application Factory
"""
import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv

load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address, default_limits=["200 per day", "50 per hour"])


def create_app():
    app = Flask(__name__)

    # ── Configuration ──────────────────────────────────────────────────────────
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-me-in-production")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-jwt-secret")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 86400  # 24 hours

    # MySQL connection via SQLAlchemy
    db_user = os.getenv("DB_USER", "root")
    db_password = os.getenv("DB_PASSWORD", "")
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = os.getenv("DB_PORT", "3306")
    db_name = os.getenv("DB_NAME", "medstore_db")
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        "?charset=utf8mb4"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_recycle": 300,
        "pool_pre_ping": True,
    }

    # ── CORS ───────────────────────────────────────────────────────────────────
    allowed = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    CORS(app, resources={r"/api/*": {"origins": allowed}},
         supports_credentials=True)

    # ── Init Extensions ────────────────────────────────────────────────────────
    db.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)

    # ── Security Headers ───────────────────────────────────────────────────────
    @app.after_request
    def security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

    # ── JWT Error Handlers ────────────────────────────────────────────────────
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "Token has expired. Please log in again."}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"error": "Invalid token. Please log in again."}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"error": "Authorization token required."}), 401

    # ── Blueprints ─────────────────────────────────────────────────────────────
    from app.routes.auth import auth_bp
    from app.routes.medicines import medicines_bp
    from app.routes.orders import orders_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(medicines_bp, url_prefix="/api/medicines")
    app.register_blueprint(orders_bp, url_prefix="/api/orders")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    # ── Health Check ───────────────────────────────────────────────────────────
    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "MedStore API"})

    # ── Create Tables ──────────────────────────────────────────────────────────
    with app.app_context():
        db.create_all()
        _seed_admin()
        _seed_medicines()

    return app


def _seed_admin():
    """Create default admin account if not exists."""
    from app.models.admin import Admin
    import bcrypt
    if not Admin.query.first():
        username = os.getenv("ADMIN_USERNAME", "admin")
        password = os.getenv("ADMIN_PASSWORD", "Admin@123456")
        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        admin = Admin(username=username, password_hash=hashed)
        db.session.add(admin)
        db.session.commit()
        print(f"[SEED] Admin created: {username}")


def _seed_medicines():
    """Seed initial medicines catalogue."""
    from app.models.medicine import Medicine
    if Medicine.query.count() > 0:
        return
    medicines = [
        {"name": "Paracetamol 500mg", "brand": "Calpol", "category": "Pain Relief",
         "price": 25.00, "unit": "Strip of 10", "stock": 200,
         "description": "Effective for fever and mild to moderate pain relief."},
        {"name": "Amoxicillin 500mg", "brand": "Amoxil", "category": "Antibiotic",
         "price": 120.00, "unit": "Strip of 10", "stock": 150,
         "description": "Broad-spectrum antibiotic for bacterial infections."},
        {"name": "Cetirizine 10mg", "brand": "Alerid", "category": "Antihistamine",
         "price": 35.00, "unit": "Strip of 10", "stock": 180,
         "description": "Relieves allergy symptoms, hay fever, and urticaria."},
        {"name": "Omeprazole 20mg", "brand": "Omez", "category": "Antacid",
         "price": 80.00, "unit": "Strip of 10", "stock": 120,
         "description": "Reduces stomach acid for acidity and GERD treatment."},
        {"name": "Metformin 500mg", "brand": "Glycomet", "category": "Diabetes",
         "price": 45.00, "unit": "Strip of 10", "stock": 100,
         "description": "Controls blood sugar levels in Type 2 diabetes."},
        {"name": "Atorvastatin 10mg", "brand": "Lipitor", "category": "Cholesterol",
         "price": 95.00, "unit": "Strip of 10", "stock": 90,
         "description": "Lowers LDL cholesterol and reduces cardiovascular risk."},
        {"name": "Azithromycin 500mg", "brand": "Zithromax", "category": "Antibiotic",
         "price": 180.00, "unit": "Strip of 3", "stock": 80,
         "description": "Used for respiratory and skin bacterial infections."},
        {"name": "Ibuprofen 400mg", "brand": "Brufen", "category": "Pain Relief",
         "price": 40.00, "unit": "Strip of 10", "stock": 160,
         "description": "Anti-inflammatory for pain, fever, and inflammation."},
        {"name": "Vitamin D3 1000IU", "brand": "D-Rise", "category": "Vitamins",
         "price": 150.00, "unit": "Bottle of 60", "stock": 200,
         "description": "Supports bone health and immune system function."},
        {"name": "Pantoprazole 40mg", "brand": "Pan 40", "category": "Antacid",
         "price": 65.00, "unit": "Strip of 10", "stock": 130,
         "description": "Proton pump inhibitor for peptic ulcer and GERD."},
        {"name": "Dolo 650mg", "brand": "Dolo", "category": "Pain Relief",
         "price": 30.00, "unit": "Strip of 15", "stock": 250,
         "description": "Paracetamol 650mg for stronger fever and pain relief."},
        {"name": "Montelukast 10mg", "brand": "Montair", "category": "Respiratory",
         "price": 110.00, "unit": "Strip of 10", "stock": 70,
         "description": "Prevents asthma attacks and treats allergic rhinitis."},
    ]
    for m in medicines:
        db.session.add(Medicine(**m))
    db.session.commit()
    print(f"[SEED] {len(medicines)} medicines added.")
