import { Check, Clock, Package, Truck, Home, XCircle } from "lucide-react";

const STEPS = [
  { key: "Pending", label: "Order Placed", Icon: Clock },
  { key: "Confirmed", label: "Confirmed", Icon: Check },
  { key: "Preparing", label: "Preparing", Icon: Package },
  { key: "Out for Delivery", label: "Out for Delivery", Icon: Truck },
  { key: "Delivered", label: "Delivered", Icon: Home },
];

export default function OrderTracker({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
        <XCircle className="text-red-500" size={24} />
        <div>
          <p className="font-semibold text-red-700">Order Cancelled</p>
          <p className="text-sm text-red-500">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 -z-0" />

      <div className="space-y-4">
        {STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          const { Icon } = step;

          return (
            <div key={step.key} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all ${
                  done
                    ? "bg-brand-600 border-brand-600 text-white"
                    : active
                    ? "bg-white border-brand-600 text-brand-600"
                    : "bg-white border-gray-200 text-gray-300"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              </div>
              <div>
                <p className={`font-medium text-sm ${active ? "text-brand-700" : done ? "text-gray-700" : "text-gray-400"}`}>
                  {step.label}
                </p>
                {active && (
                  <p className="text-xs text-brand-500 mt-0.5">Current status</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
