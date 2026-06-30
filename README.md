# 💊 MedStore — Full-Stack Order Management System

A production-ready online medical store with user shopping, admin dashboard, order tracking, and CSV export.

**Tech Stack:** React + Tailwind CSS (Frontend) · Python Flask (Backend) · MySQL (Database)

---

## 📁 Project Structure

```
medstore/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App factory, seeding
│   │   ├── models/
│   │   │   ├── admin.py
│   │   │   ├── medicine.py
│   │   │   └── order.py         # Order + OrderItem
│   │   ├── routes/
│   │   │   ├── auth.py          # Admin login/me
│   │   │   ├── medicines.py     # Catalogue API
│   │   │   ├── orders.py        # Customer orders
│   │   │   └── admin.py         # Admin panel API
│   │   └── utils/
│   │       └── validators.py    # Input validation
│   ├── run.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx              # Routes
    │   ├── context/
    │   │   ├── CartContext.jsx  # Cart state (localStorage)
    │   │   └── AuthContext.jsx  # Admin JWT auth
    │   ├── components/
    │   │   ├── shared/          # Navbar, StatusBadge
    │   │   ├── user/            # MedicineCard, OrderTracker
    │   │   └── admin/           # ProtectedRoute
    │   ├── pages/
    │   │   ├── user/            # Home, Cart, Checkout, Success, Track, History
    │   │   └── admin/           # Login, Layout, Dashboard, Orders
    │   └── utils/api.js         # Axios instance
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **MySQL** 8.0+

---

## 🚀 Installation

### 1. Database Setup

```sql
CREATE DATABASE medstore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'medstore_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON medstore_db.* TO 'medstore_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

```bash
cd medstore/backend

# Copy env file and fill in your values
cp .env.example .env
# Edit .env with your DB credentials, secrets, etc.

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server (auto-creates tables + seeds data)
python run.py
```

Backend runs at: **http://localhost:5000**

On first run, it automatically:
- Creates all database tables
- Seeds 12 medicines in the catalogue
- Creates admin account (from `.env` values)

### 3. Frontend Setup

```bash
cd medstore/frontend

# Install packages
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 🔑 Default Admin Credentials

```
Username: admin
Password: Admin@123456
```

👉 Change these in `.env` before deploying!

Admin panel: **http://localhost:3000/admin**

---

## 📡 API Endpoints

### Public (no auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/medicines/` | List medicines (with search/filter) |
| GET | `/api/medicines/:id` | Get single medicine |
| POST | `/api/orders/` | Place a new order |
| GET | `/api/orders/track/:order_id` | Track order by ID |
| GET | `/api/orders/history?mobile=` | Order history by mobile |

### Admin (JWT required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current admin |
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/orders` | List orders (search, filter, paginate) |
| GET | `/api/admin/orders/:id` | Get order details |
| PATCH | `/api/admin/orders/:id/status` | Update order status |
| DELETE | `/api/admin/orders/:id` | Delete order |
| GET | `/api/admin/orders/export/csv` | Export all orders as CSV |

---

## 🏗️ Production Deployment

### Backend (on Ubuntu/Debian server)

```bash
# Install gunicorn (already in requirements.txt)
cd medstore/backend
source venv/bin/activate

# Set FLASK_ENV=production in .env

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app

# Or with systemd service — see docs
```

### Frontend (build for production)

```bash
cd medstore/frontend

# Set your backend URL
echo "VITE_API_URL=https://your-api-domain.com/api" > .env

npm run build
# Output in dist/ — serve with Nginx or upload to Netlify/Vercel
```

### Nginx Config (example)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend (static files)
    location / {
        root /var/www/medstore/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API (proxy to gunicorn)
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Deploy to Render.com

**Backend (Web Service):**
- Root Dir: `medstore/backend`
- Build: `pip install -r requirements.txt`
- Start: `gunicorn run:app`
- Add all `.env` variables in Render's Environment section

**Frontend (Static Site):**
- Root Dir: `medstore/frontend`
- Build: `npm install && npm run build`
- Publish Dir: `dist`
- Add env var: `VITE_API_URL=https://your-backend.onrender.com/api`

---

## 🔒 Security Features

- ✅ JWT-based admin authentication (24h expiry)
- ✅ bcrypt password hashing
- ✅ Input validation on all endpoints
- ✅ HTML/XSS sanitization with bleach
- ✅ Rate limiting (Flask-Limiter)
- ✅ CORS restricted to allowed origins
- ✅ Security headers (X-Frame-Options, XSS-Protection, etc.)
- ✅ SQL injection protection via SQLAlchemy ORM
- ✅ Parameterized queries only

---

## 🛒 User Features

- Browse medicines with search & category filter
- Add/remove items, adjust quantities in cart
- Cart persists across page refreshes (localStorage)
- Full checkout form with address validation
- Unique Order ID generated (e.g. `MED-20240629-A3X9`)
- Order success page with copy-to-clipboard
- Real-time order tracking with step timeline
- View all past orders by mobile number

## 🛠️ Admin Features

- Secure login with JWT
- Dashboard with revenue + status breakdown
- Searchable, filterable, paginated orders table
- Full order detail modal
- One-click status update
- Print invoice (opens print dialog)
- Export all orders to CSV
- Delete orders
- Responsive on mobile

---

## 📋 Database Schema

```
admins        — id, username, password_hash, created_at
medicines     — id, name, brand, category, price, unit, stock, description, is_active
orders        — id, order_id, customer details, address, payment, status, total_amount, timestamps
order_items   — id, order_id (FK), medicine_id (FK), name snapshot, qty, unit_price, subtotal
```

---

## 🧑‍💻 Author

Designed & built by **Faiyaz**  
V.V.P. Engineering College, GTU · Enrollment: 240470107011

---

## 📄 License

MIT License — free to use and modify for personal and commercial projects.
