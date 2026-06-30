import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function MedicineCard({ med }) {
  const { cart, addToCart, setQty, removeFromCart } = useCart();
  const cartItem = cart.find((i) => i.id === med.id);
  const qty = cartItem?.qty || 0;

  const CATEGORY_COLORS = {
    "Pain Relief": "bg-red-50 text-red-700",
    Antibiotic: "bg-orange-50 text-orange-700",
    Antihistamine: "bg-purple-50 text-purple-700",
    Antacid: "bg-green-50 text-green-700",
    Diabetes: "bg-blue-50 text-blue-700",
    Cholesterol: "bg-yellow-50 text-yellow-700",
    Vitamins: "bg-teal-50 text-teal-700",
    Respiratory: "bg-indigo-50 text-indigo-700",
  };

  return (
    <div className="card flex flex-col hover:shadow-md transition-shadow duration-200">
      {/* Category badge */}
      <div className="flex items-start justify-between mb-3">
        <span className={`badge text-xs ${CATEGORY_COLORS[med.category] || "bg-gray-100 text-gray-600"}`}>
          {med.category}
        </span>
        {med.stock < 20 && med.stock > 0 && (
          <span className="badge bg-amber-50 text-amber-700 text-xs">Low Stock</span>
        )}
      </div>

      {/* Info */}
      <h3 className="font-semibold text-gray-900 text-sm leading-snug">{med.name}</h3>
      <p className="text-xs text-gray-500 mt-0.5">{med.brand} · {med.unit}</p>
      {med.description && (
        <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">{med.description}</p>
      )}

      <div className="mt-auto pt-4 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-gray-900">₹{med.price.toFixed(2)}</span>
        </div>

        {qty === 0 ? (
          <button
            onClick={() => addToCart({ id: med.id, name: med.name, brand: med.brand, price: med.price, unit: med.unit })}
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white
                       text-sm font-medium px-3 py-1.5 rounded-xl transition-all active:scale-95"
          >
            <ShoppingCart size={14} />
            Add
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => qty === 1 ? removeFromCart(med.id) : setQty(med.id, qty - 1)}
              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center
                         justify-center transition-colors active:scale-95"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center font-semibold text-sm">{qty}</span>
            <button
              onClick={() => setQty(med.id, qty + 1)}
              className="w-7 h-7 rounded-lg bg-brand-600 hover:bg-brand-700 text-white flex
                         items-center justify-center transition-colors active:scale-95"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
