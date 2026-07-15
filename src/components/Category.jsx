import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  X,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import ProductCard from "./ProductCard.jsx";
import { fetchProducts } from "../api/products.js";

const FILTER_COLORS = [
  "#22C55E",
  "#EF4444",
  "#EAB308",
  "#F97316",
  "#38BDF8",
  "#2563EB",
  "#7C3AED",
  "#EC4899",
  "#FFFFFF",
  "#111111",
];

const SIZES = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large",
];

const CATEGORIES = [
  { label: "T-shirts", value: "t-shirts" },
  { label: "Shorts", value: "shorts" },
  { label: "Shirts", value: "shirts" },
  { label: "Hoodie", value: "hoodie" },
  { label: "Jeans", value: "jeans" },
];

const STYLES = ["casual", "formal", "party", "gym"];

function Accordion({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-black/10 py-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="font-satoshi w-full flex items-center justify-between font-medium text-[15px]"
      >
        {title}
        <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function FiltersPanel({
  onClose,
  category,
  setCategory,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  priceRange,
  setPriceRange,
  dressStyle,
  onApplyStyle,
  onApply,
}) {
  return (
    <div className="bg-white rounded-2xl border border-black/10 p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-satoshi font-bold text-lg">Filters</h2>
        {onClose && (
          <button type="button" onClick={onClose} className="lg:hidden" aria-label="Close filters">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="pb-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(category === c.value ? "" : c.value)}
            className={`font-satoshi w-full flex items-center justify-between py-3 text-[15px] transition-colors ${
              category === c.value ? "text-black font-medium" : "text-black/60 hover:text-black"
            }`}
          >
            {c.label}
            <ChevronRight size={16} />
          </button>
        ))}
      </div>

      <Accordion title="Price">
        <div className="font-satoshi pt-1 space-y-3">
          <div className="flex justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            aria-label="Minimum price"
            type="range"
            min={50}
            max={195}
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 5), priceRange[1]])
            }
            className="w-full"
          />
          <input
            aria-label="Maximum price"
            type="range"
            min={55}
            max={300}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 5)])
            }
            className="w-full"
          />
        </div>
      </Accordion>

      <Accordion title="Colors">
        <div className="flex flex-wrap gap-3">
          {FILTER_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedColor(selectedColor === c ? "" : c)}
              aria-label={`Color ${c}`}
              className="w-8 h-8 rounded-full flex items-center justify-center ring-1 ring-black/10"
              style={{ backgroundColor: c }}
            >
              {selectedColor === c && (
                <Check size={16} className={c === "#FFFFFF" ? "text-black" : "text-white"} />
              )}
            </button>
          ))}
        </div>
      </Accordion>

      <Accordion title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSize(selectedSize === s ? "" : s)}
              className={`font-satoshi px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedSize === s
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-black/60 hover:bg-neutral-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Accordion>

      <Accordion title="Dress Style">
        <div className="pb-1">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onApplyStyle(s)}
              className={`font-satoshi w-full flex items-center justify-between py-3 text-[15px] capitalize transition-colors ${
                dressStyle === s ? "text-black font-medium" : "text-black/60 hover:text-black"
              }`}
            >
              {s}
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </Accordion>

      <button
        type="button"
        onClick={onApply}
        className="w-full mt-5 bg-black text-white rounded-full py-3 font-satoshi font-medium hover:bg-black/85 transition-colors"
      >
        Apply Filter
      </button>
    </div>
  );
}

export default function Category() {
  const { style } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const dressStyle = (style || searchParams.get("style") || "casual").toLowerCase();
  const page = Number(searchParams.get("page") || 1);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [priceRange, setPriceRange] = useState([50, 300]);
  const [appliedFilters, setAppliedFilters] = useState({
    category: searchParams.get("category") || "",
    color: "",
    size: "",
    min: 50,
    max: 300,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProducts({
          dressStyle,
          category: appliedFilters.category || undefined,
          page,
          limit: 9,
        });
        if (cancelled) return;

        let list = data.products || [];
        list = list.filter(
          (p) => p.price >= appliedFilters.min && p.price <= appliedFilters.max
        );
        if (appliedFilters.size) {
          list = list.filter((p) => (p.sizes || []).includes(appliedFilters.size));
        }
        if (appliedFilters.color) {
          list = list.filter((p) =>
            (p.colors || []).some(
              (c) => c.hex?.toLowerCase() === appliedFilters.color.toLowerCase()
            )
          );
        }

        setProducts(list);
        setPagination(data.pagination || { page: 1, pages: 1, total: list.length });
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
  }, [dressStyle, page, appliedFilters]);

  const title = useMemo(
    () => dressStyle.charAt(0).toUpperCase() + dressStyle.slice(1),
    [dressStyle]
  );

  const applyFilters = () => {
    setAppliedFilters({
      category,
      color: selectedColor,
      size: selectedSize,
      min: priceRange[0],
      max: priceRange[1],
    });
    const next = new URLSearchParams(searchParams);
    if (category) next.set("category", category);
    else next.delete("category");
    next.set("page", "1");
    setSearchParams(next);
    setFiltersOpen(false);
  };

  const goStyle = (s) => {
    navigate(`/category/${s}`);
    setFiltersOpen(false);
  };

  const setPage = (n) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(n));
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
      <div className="font-satoshi text-sm text-black/50 py-5 flex items-center gap-1">
        <Link to="/" className="hover:text-black">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-black capitalize">{title}</span>
      </div>

      <div className="flex gap-8 pb-16">
        <aside className="hidden lg:block w-72 shrink-0">
          <FiltersPanel
            category={category}
            setCategory={setCategory}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            dressStyle={dressStyle}
            onApplyStyle={goStyle}
            onApply={applyFilters}
          />
        </aside>

        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-neutral-50 overflow-y-auto p-4">
              <FiltersPanel
                onClose={() => setFiltersOpen(false)}
                category={category}
                setCategory={setCategory}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                dressStyle={dressStyle}
                onApplyStyle={goStyle}
                onApply={applyFilters}
              />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5 gap-3">
            <div>
              <h1 className="font-integral text-2xl sm:text-3xl font-bold uppercase">{title}</h1>
              <p className="font-satoshi text-sm text-black/50 mt-1">
                Showing {products.length} of {pagination.total} Products
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"
              aria-label="Open filters"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {loading ? (
            <p className="font-satoshi text-gray-500 py-16 text-center">Loading products...</p>
          ) : error ? (
            <p className="font-satoshi text-red-500 py-16 text-center">{error}</p>
          ) : products.length === 0 ? (
            <p className="font-satoshi text-gray-500 py-16 text-center">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-10 flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                className="font-satoshi flex items-center gap-2 px-4 py-2 rounded-lg border border-black/10 text-sm disabled:opacity-40"
                disabled={page <= 1}
              >
                <ArrowLeft size={14} /> Previous
              </button>
              <div className="flex items-center gap-1.5 text-sm font-satoshi">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .slice(0, 5)
                  .map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        page === n ? "bg-black text-white" : "text-black/60 hover:bg-neutral-100"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
              </div>
              <button
                type="button"
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                className="font-satoshi flex items-center gap-2 px-4 py-2 rounded-lg border border-black/10 text-sm disabled:opacity-40"
                disabled={page >= pagination.pages}
              >
                Next <ArrowRight size={14} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
