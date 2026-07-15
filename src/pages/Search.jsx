import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard.jsx";
import { fetchProducts } from "../api/products.js";

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!q.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await fetchProducts({ search: q.trim(), limit: 24 });
        if (!cancelled) setProducts(data.products || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Search failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <section className="px-4 sm:px-8 lg:px-16 py-6 sm:py-10">
      <div className="font-satoshi text-sm text-gray-500 mb-4 flex items-center gap-1">
        <Link to="/" className="hover:text-black">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-black">Search</span>
      </div>

      <h1 className="font-integral text-2xl sm:text-4xl tracking-tight uppercase mb-2">
        Search Results
      </h1>
      <p className="font-satoshi text-sm text-gray-500 mb-8">
        {q ? (
          <>
            Results for <span className="font-medium text-black">&ldquo;{q}&rdquo;</span>
          </>
        ) : (
          "Enter a search term to find products."
        )}
      </p>

      {loading ? (
        <p className="font-satoshi text-center text-gray-500 py-16">Searching...</p>
      ) : error ? (
        <p className="font-satoshi text-center text-red-500 py-16">{error}</p>
      ) : !q.trim() ? null : products.length === 0 ? (
        <p className="font-satoshi text-center text-gray-500 py-16">No products matched your search.</p>
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
