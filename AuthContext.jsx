import { useEffect, useState, useCallback } from "react";
import { Search, Filter, Download, Eye, Trash2, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import api from "../../utils/api";
import StatusBadge from "../../components/shared/StatusBadge";

const STATUSES = ["Pending","Confirmed","Preparing","Out for Delivery","Delivered","Cancelled"];

// ── Order Detail Modal ────────────────────────────────────────────────────────
function OrderModal({ orderId, onClose, onStatusChange }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get(`/admin/orders/${orderId}`)
      .then((r) => setOrder(r.data))
      .finally(() => setLoading(false));
  }, [orderId]);

  async function updateStatus(status) {
    setUpdating(true);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      setOrder((o) => ({ ...o, status }));
      onStatusChange(orderId, status);
      toast.success(`Status updated to "${status}"`);
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  }

  const printInvoice = () => {
    if (!order) return;
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Invoice ${order.order_id}</title>
      <style>body{font-family:Arial,sans-serif;max-width:600px;margin:20px auto;padding:20px}
      h1{color:#0284c7}table{width:100%;border-collapse:collapse;margin-top:10px}
      td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}
      .total{font-weight:bold;font-size:1.1em}</style></head><body>
      <h1>MedStore — Invoice</h1>
      <p><strong>Order ID:</strong> ${order.order_id}</p>
      <p><strong>Date:</strong> ${format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}</p>
      <p><strong>Customer:</strong> ${order.full_name} | ${order.mobile}</p>
      <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state} – ${order.pin_code}</p>
      <p><strong>Payment:</strong> ${order.payment_method}</p>
      <table><tr><th>Medicine</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr>
      ${order.items.map(i => `<tr><td>${i.medicine_name}<br><small>${i.medicine_brand}</small></td>
      <td>${i.quantity}</td><td>₹${i.unit_price}</td><td>₹${i.subtotal}</td></tr>`).join("")}
      </table><p class="total" style="text-align:right;margin-top:15px">Total: ₹${order.total_amount}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">{orderId}</h2>
            {order && <p className="text-xs text-gray-400">{format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}</p>}
          </div>
          <div className="flex items-center gap-2">
            {order && <StatusBadge status={order.status} />}
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-brand-500" /></div>
        ) : order && (
          <div className="p-5 space-y-5">
            {/* Customer */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Customer</h3>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <p><span className="text-gray-400">Name: </span><strong>{order.full_name}</strong></p>
                <p><span className="text-gray-400">Mobile: </span>{order.mobile}</p>
                {order.email && <p><span className="text-gray-400">Email: </span>{order.email}</p>}
              </div>
            </section>

            {/* Address */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Delivery Address</h3>
              <p className="text-sm text-gray-700">
                {order.address}<br />
                {order.city}, {order.state} – {order.pin_code}
                {order.landmark && <span><br />📍 {order.landmark}</span>}
              </p>
            </section>

            {/* Items */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Items</h3>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">Medicine</th>
                      <th className="text-center px-3 py-2 font-medium">Qty</th>
                      <th className="text-right px-3 py-2 font-medium">Price</th>
                      <th className="text-right px-3 py-2 font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-t border-gray-50">
                        <td className="px-3 py-2">
                          <p className="font-medium">{item.medicine_name}</p>
                          <p className="text-xs text-gray-400">{item.medicine_brand}</p>
                        </td>
                        <td className="px-3 py-2 text-center">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">₹{item.unit_price}</td>
                        <td className="px-3 py-2 text-right font-semibold">₹{item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td colSpan={3} className="px-3 py-2 font-bold text-right">Total</td>
                      <td className="px-3 py-2 font-bold text-right text-brand-700">₹{order.total_amount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* Payment & Notes */}
            <section className="grid sm:grid-cols-2 gap-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Payment</h3>
                <p className="text-sm">{order.payment_method}</p>
              </div>
              {order.order_notes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</h3>
                  <p className="text-sm">{order.order_notes}</p>
                </div>
              )}
            </section>

            {/* Status Update */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button key={s} onClick={() => updateStatus(s)} disabled={updating || order.status === s}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                      ${order.status === s
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-white border-gray-200 text-gray-600 hover:border-brand-400"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </section>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button onClick={printInvoice} className="btn-secondary flex items-center gap-2 text-sm flex-1">
                🖨️ Print Invoice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Orders Page ──────────────────────────────────────────────────────────
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [modalId, setModalId] = useState(null);

  const PER_PAGE = 20;

  const fetchOrders = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/orders", {
        params: { page: p, per_page: PER_PAGE, search, status },
      });
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch { toast.error("Failed to fetch orders."); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { fetchOrders(1); setPage(1); }, [search, status]);
  useEffect(() => { fetchOrders(page); }, [page]);

  async function deleteOrder(orderId) {
    if (!confirm(`Delete order ${orderId}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/orders/${orderId}`);
      toast.success("Order deleted.");
      fetchOrders(page);
    } catch { toast.error("Failed to delete order."); }
  }

  const exportCSV = () => {
    window.open(`${import.meta.env.VITE_API_URL || "/api"}/admin/orders/export/csv`, "_blank");
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((os) => os.map((o) => o.order_id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total orders</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-10" placeholder="Search by Order ID, Name or Mobile..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input sm:w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-brand-500" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No orders found</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Order ID","Customer","Mobile","Total","Status","Date","Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-brand-700 text-xs">{order.order_id}</td>
                      <td className="px-4 py-3 font-medium">{order.full_name}</td>
                      <td className="px-4 py-3 text-gray-500">{order.mobile}</td>
                      <td className="px-4 py-3 font-semibold">₹{order.total_amount.toFixed(2)}</td>
                      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {format(new Date(order.created_at), "dd MMM yy, hh:mm a")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setModalId(order.order_id)}
                            className="p-1.5 hover:bg-brand-50 text-brand-600 rounded-lg transition-colors">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => deleteOrder(order.order_id)}
                            className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-mono font-medium text-brand-700 text-xs">{order.order_id}</p>
                      <p className="font-medium text-gray-900 mt-0.5">{order.full_name}</p>
                      <p className="text-xs text-gray-400">{order.mobile}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-gray-900">₹{order.total_amount.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setModalId(order.order_id)}
                        className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Eye size={15} /></button>
                      <button onClick={() => deleteOrder(order.order_id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-40 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
                className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-40 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {modalId && (
        <OrderModal orderId={modalId} onClose={() => setModalId(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
