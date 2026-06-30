import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, LogOut, Cross, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/admin/dashboard", Icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/orders", Icon: ShoppingBag, label: "Orders" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const Sidebar = () => (
    <aside className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 p-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Cross size={14} className="text-white" strokeWidth={3} />
        </div>
        <span className="font-bold text-gray-900">MedStore <span className="text-brand-600">Admin</span></span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ to, Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Admin info + logout */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
            {admin?.username?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{admin?.username}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-500
                     hover:bg-red-50 hover:text-red-600 transition-colors font-medium">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-56 bg-white border-r border-gray-100 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile overlay sidebar */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-56 bg-white border-r border-gray-100 h-full shadow-xl">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-gray-100">
          <button onClick={() => setOpen(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-gray-900">MedStore Admin</span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
