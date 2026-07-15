import { Link } from "react-router-dom";
import Stars from "./Stars.jsx";

export default function ProductCard({ product }) {
  if (!product) return null;

  const id = product.id || product._id;
  const image = product.image || product.images?.[0] || "";

  return (
    <Link to={`/product/${id}`} className="flex-1 min-w-[140px] block group">
      <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#F0EEED]">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <h3 className="font-satoshi font-bold mt-3 text-sm sm:text-base leading-snug">
        {product.name}
      </h3>
      <div className="font-satoshi mt-1">
        <Stars rating={product.rating || 0} />
      </div>
      <div className="mt-1 flex items-center gap-2 flex-wrap">
        <span className="font-satoshi font-bold text-sm sm:text-base">${product.price}</span>
        {product.oldPrice != null && (
          <span className="font-satoshi font-bold text-gray-400 line-through text-sm">
            ${product.oldPrice}
          </span>
        )}
        {product.discount != null && product.discount > 0 && (
          <span className="font-satoshi font-medium text-red-500 bg-red-50 text-[11px] px-2 py-0.5 rounded-full">
            -{product.discount}%
          </span>
        )}
      </div>
    </Link>
  );
}
