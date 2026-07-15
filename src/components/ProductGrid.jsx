import { Link } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ title, products, viewAllLink = "/shop" }) {
  return (
    <section className="px-4 sm:px-8 lg:px-16 py-10 sm:py-14">
      <h2 className="font-integral text-center text-2xl sm:text-4xl font-extrabold tracking-tight uppercase">
        {title}
      </h2>
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link
          to={viewAllLink}
          className="font-satoshi font-medium border border-gray-300 rounded-full px-10 py-3 text-sm hover:bg-black hover:text-white transition-colors"
        >
          View All
        </Link>
      </div>
    </section>
  );
}
