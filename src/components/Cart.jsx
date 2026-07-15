import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Tag, ArrowRight } from "lucide-react";
import CartItem from "./CartItem.jsx";
import { useCart } from "../context/CartContext.jsx";

function OrderSummary({ summary }) {
  const discountPct =
    summary.subtotal > 0
      ? Math.round((summary.discountTotal / summary.subtotal) * 100)
      : 0;

  return (
    <div className="border border-gray-200 rounded-2xl p-5 sm:p-6 h-fit">
      <h2 className="font-satoshi font-bold text-xl mb-5">Order Summary</h2>
      <div className="font-satoshi space-y-3 text-[15px]">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold">${summary.subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">
            Discount{discountPct > 0 ? ` (-${discountPct}%)` : ""}
          </span>
          <span className="font-semibold text-red-500">-${summary.discountTotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Delivery Fee</span>
          <span className="font-semibold">${summary.deliveryFee}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <span>Total</span>
          <span className="font-bold text-lg">${summary.total}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <div className="flex-1 bg-gray-100 rounded-full flex items-center gap-2 px-4 py-3">
          <Tag size={16} className="text-gray-400" />
          <input
            placeholder="Add promo code"
            className="font-satoshi bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
          />
        </div>
        <button
          type="button"
          className="font-satoshi bg-black text-white rounded-full px-6 font-medium text-sm shrink-0"
        >
          Apply
        </button>
      </div>

      <button
        type="button"
        className="font-satoshi w-full mt-4 bg-black text-white rounded-full py-3.5 font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
      >
        Go to Checkout <ArrowRight size={16} />
      </button>
      <p className="font-satoshi text-xs text-gray-400 text-center mt-3">
        Payment gateway coming soon
      </p>
    </div>
  );
}

export default function Cart() {
  const { items, summary, loading, updateItem, removeItem } = useCart();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const changeQty = async (id, quantity) => {
    if (quantity < 1) return;
    setBusy(true);
    try {
      await updateItem(id, { quantity });
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id) => {
    setBusy(true);
    try {
      await removeItem(id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
      <div className="font-satoshi text-sm text-gray-500 py-5 flex items-center gap-1">
        <Link to="/" className="hover:text-black">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-black">Cart</span>
      </div>

      <h1 className="font-integral text-3xl sm:text-4xl font-extrabold uppercase mb-6">
        Your Cart
      </h1>

      {loading ? (
        <div className="font-satoshi py-16 text-center text-gray-500 mb-14">Loading cart...</div>
      ) : items.length === 0 ? (
        <div className="font-satoshi py-16 text-center text-gray-500 border border-gray-200 rounded-2xl mb-14">
          <p className="mb-4">Your cart is empty.</p>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="bg-black text-white rounded-full px-8 py-3 text-sm font-medium"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div
          className={`grid lg:grid-cols-[1fr_360px] gap-6 mb-14 items-start ${
            busy ? "opacity-70 pointer-events-none" : ""
          }`}
        >
          <div className="border border-gray-200 rounded-2xl px-5 sm:px-6">
            {items.map((it) => (
              <CartItem
                key={it._id || it.id}
                item={it}
                onQtyChange={changeQty}
                onRemove={handleRemove}
              />
            ))}
          </div>
          <OrderSummary summary={summary} />
        </div>
      )}
    </div>
  );
}
