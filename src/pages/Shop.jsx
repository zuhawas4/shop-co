import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { fetchProducts } from "../api/products.js";

export default function Shop() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProducts({
          category: category || undefined,
          filter: filter || undefined,
          limit: 24,
        });
        if (!cancelled) setProducts(data.products || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [category, filter]);

  const title = category
    ? category.replace(/-/g, " ")
    : filter === "sale"
      ? "On Sale"
      : filter === "new"
        ? "New Arrivals"
        : filter === "brands"
          ? "Top Brands"
          : "Shop";

  return (
    <section className="px-4 sm:px-8 lg:px-16 py-10 sm:py-14">
      <h1 className="font-integral text-2xl sm:text-4xl tracking-tight uppercase mb-2">
        {title}
      </h1>
      {filter && !category && (
        <p className="font-satoshi text-sm text-gray-500 mb-8">
          Filtering by: <span className="font-medium">{filter}</span>
        </p>
      )}
      {!filter && <div className="mb-8" />}

      {loading ? (
        <p className="font-satoshi text-center text-gray-500 py-16">Loading products...</p>
      ) : error ? (
        <p className="font-satoshi text-center text-red-500 py-16">{error}</p>
      ) : products.length === 0 ? (
        <p className="font-satoshi text-center text-gray-500 py-16">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
