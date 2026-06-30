import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2, Lock, Cross } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Cross size={24} className="text-white" strokeWidth={3} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">MedStore Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage orders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <input className="input" placeholder="admin" value={form.username}
              onChange={set("username")} required autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password}
              onChange={set("password")} required />
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2 py-3">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Secured with JWT authentication
        </p>
      </div>
    </div>
  );
}
