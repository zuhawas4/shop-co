import { Trash2, Minus, Plus } from "lucide-react";

export default function CartItem({ item, onQtyChange, onRemove }) {
  const id = item._id || item.id;

  return (
    <div className="flex items-start gap-4 py-5 border-b border-gray-200 last:border-b-0">
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F0EEED] rounded-lg overflow-hidden shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-satoshi font-medium text-[15px] leading-snug">{item.name}</h3>
          <button
            onClick={() => onRemove(id)}
            className="text-red-500 shrink-0"
            aria-label="Remove item"
            type="button"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <p className="font-satoshi text-sm text-gray-500 mt-1">
          Size: <span className="text-gray-700">{item.size}</span>
        </p>
        <p className="font-satoshi text-sm text-gray-500">
          Color: <span className="text-gray-700">{item.color}</span>
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="font-satoshi font-bold text-lg">${item.price}</span>
            {item.oldPrice != null && (
              <span className="font-satoshi text-sm text-gray-400 line-through">
                ${item.oldPrice}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 bg-[#F0EEED] rounded-full px-3 py-1.5">
            <button
              type="button"
              onClick={() => onQtyChange(id, item.quantity - 1)}
              className="w-4 flex items-center justify-center"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="font-satoshi text-sm w-3 text-center">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onQtyChange(id, item.quantity + 1)}
              className="w-4 flex items-center justify-center"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
