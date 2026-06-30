import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Package, ClipboardList, Cross } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { pathname } = useLocation();

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        pathname === to ? "text-brand-600" : "text-gray-600 hover:text-brand-600"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Cross size={16} className="text-white" strokeWidth={3} />
          </div>
          <span className="text-lg font-bold text-gray-900">
            Med<span className="text-brand-600">Store</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-6">
          {navLink("/", "Medicines")}
          {navLink("/track", "Track Order")}
          {navLink("/history", "My Orders")}
        </nav>

        {/* Cart */}
        <Link
          to="/cart"
          className="relative flex items-center gap-2 bg-brand-50 hover:bg-brand-100 text-brand-700
                     px-4 py-2 rounded-xl transition-colors font-medium text-sm"
        >
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-xs
                             w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile nav */}
      <nav className="sm:hidden flex border-t border-gray-100 bg-white">
        {[
          ["/", "Medicines", Package],
          ["/track", "Track", ClipboardList],
          ["/history", "Orders", ClipboardList],
          ["/cart", "Cart", ShoppingCart],
        ].map(([to, label, Icon]) => (
          <Link
            key={to}
            to={to}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors ${
              pathname === to ? "text-brand-600" : "text-gray-500"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
