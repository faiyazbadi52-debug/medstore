import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Layouts
import Navbar from "./components/shared/Navbar";
import AdminLayout from "./pages/admin/AdminLayout";

// User pages
import HomePage from "./pages/user/HomePage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import OrderSuccessPage from "./pages/user/OrderSuccessPage";
import TrackPage from "./pages/user/TrackPage";
import HistoryPage from "./pages/user/HistoryPage";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";

// ── User layout wrapper ───────────────────────────────────────────────────────
function UserLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 sm:pb-6">{children}</main>
      <footer className="hidden sm:block text-center py-4 text-xs text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} MedStore · Designed by Faiyaz · All rights reserved
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* ── User Routes ── */}
          <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
          <Route path="/cart" element={<UserLayout><CartPage /></UserLayout>} />
          <Route path="/checkout" element={<UserLayout><CheckoutPage /></UserLayout>} />
          <Route path="/order-success" element={<UserLayout><OrderSuccessPage /></UserLayout>} />
          <Route path="/track" element={<UserLayout><TrackPage /></UserLayout>} />
          <Route path="/history" element={<UserLayout><HistoryPage /></UserLayout>} />

          {/* ── Admin Routes ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
