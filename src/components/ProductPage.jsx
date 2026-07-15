import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  StarHalf,
  Minus,
  Plus,
  ChevronRight,
  MoreHorizontal,
  Check,
} from "lucide-react";
import { fetchProductById, fetchProducts } from "../api/products.js";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "./ProductCard.jsx";

const REVIEWS = [
  {
    name: "Samantha D.",
    rating: 4.5,
    date: "Posted on August 14, 2023",
    text: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
  },
  {
    name: "Alex M.",
    rating: 5,
    date: "Posted on August 15, 2023",
    text: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
  },
  {
    name: "Ethan R.",
    rating: 3.5,
    date: "Posted on August 16, 2023",
    text: "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect.",
  },
  {
    name: "Olivia P.",
    rating: 5,
    date: "Posted on August 17, 2023",
    text: "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear.",
  },
];

function StarRow({ rating, size = 16 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} size={size} className="fill-yellow-400 text-yellow-400" />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarHalf key={i} size={size} className="fill-yellow-400 text-yellow-400" />);
    } else {
      stars.push(<Star key={i} size={size} className="text-gray-300" />);
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

function ProductGallery({ images }) {
  const [active, setActive] = useState(0);
  const gallery = images?.length ? images : [];

  useEffect(() => {
    setActive(0);
  }, [images]);

  if (!gallery.length) {
    return (
      <div className="rounded-2xl bg-[#F0EEED] min-h-[320px] sm:min-h-[420px] flex items-center justify-center font-satoshi text-gray-400">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      <div className="flex sm:flex-col gap-3 overflow-x-auto">
        {gallery.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setActive(i)}
            className={`w-20 h-24 rounded-xl overflow-hidden border shrink-0 ${
              active === i ? "border-black" : "border-transparent"
            }`}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      <div className="flex-1 rounded-2xl overflow-hidden bg-[#F0EEED] min-h-[320px] sm:min-h-[420px]">
        <img
          src={gallery[active]}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("Rating & Reviews");
  const [adding, setAdding] = useState(false);
  const [addedMsg, setAddedMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      setAddedMsg("");
      try {
        const data = await fetchProductById(id);
        if (cancelled) return;
        setProduct(data);
        setColor(data.colors?.[0] || null);
        setSize(data.sizes?.[0] || null);
        setQty(1);

        const relatedData = await fetchProducts({
          dressStyle: data.dressStyle,
          limit: 8,
        });
        if (!cancelled) {
          setRelated(
            (relatedData.products || []).filter((p) => p.id !== data.id).slice(0, 4)
          );
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Product not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !size || !color) return;
    setAdding(true);
    setAddedMsg("");
    try {
      await addItem({
        productId: product.id,
        quantity: qty,
        size,
        color: color.name || color,
        product,
      });
      setAddedMsg("Added to cart");
    } catch (err) {
      setAddedMsg(err.message || "Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-8 py-20 text-center font-satoshi text-gray-500">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-4 sm:px-8 py-20 text-center">
        <p className="font-satoshi text-gray-500 mb-4">{error || "Product not found"}</p>
        <Link to="/shop" className="font-satoshi underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const tabs = ["Product Details", "Rating & Reviews", "FAQs"];

  return (
    <div className="px-4 sm:px-8 lg:px-16 pb-10">
      <div className="font-satoshi px-0 pt-5 pb-2 text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-black">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-black">
          Shop
        </Link>
        <ChevronRight size={14} />
        <Link
          to={`/category/${product.dressStyle}`}
          className="hover:text-black capitalize"
        >
          {product.dressStyle}
        </Link>
        <ChevronRight size={14} />
        <span className="text-black capitalize">{product.category}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 mt-2">
        <ProductGallery images={product.images} />

        <div className="flex flex-col gap-4">
          <h1 className="font-integral text-2xl sm:text-3xl font-black uppercase leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-2">
            <StarRow rating={product.rating} />
            <span className="font-satoshi text-sm text-gray-500">
              {product.rating}/5
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-satoshi font-bold">${product.price}</span>
            {product.oldPrice != null && (
              <span className="text-2xl font-satoshi font-bold text-gray-300 line-through">
                ${product.oldPrice}
              </span>
            )}
            {product.discount != null && product.discount > 0 && (
              <span className="text-xs font-satoshi font-medium bg-red-50 text-red-500 rounded-full px-2 py-1">
                -{product.discount}%
              </span>
            )}
          </div>

          <p className="font-satoshi text-sm text-gray-500 leading-relaxed">
            {product.description}
          </p>

          <hr className="border-gray-100" />

          <div className="font-satoshi flex flex-col gap-2">
            <span className="text-sm text-gray-500">Select Colors</span>
            <div className="flex items-center gap-3 flex-wrap">
              {(product.colors || []).map((c) => {
                const selected = color?.name === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={c.name}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: c.hex,
                      outline: selected ? "2px solid black" : "none",
                      outlineOffset: selected ? "2px" : "0",
                    }}
                  >
                    {selected && (
                      <Check
                        size={14}
                        className={c.hex === "#FFFFFF" ? "text-black" : "text-white"}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="font-satoshi flex flex-col gap-2">
            <span className="text-sm text-gray-500">Choose Size</span>
            <div className="flex flex-wrap gap-2">
              {(product.sizes || []).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    size === s
                      ? "bg-black text-white border-black"
                      : "bg-gray-50 text-gray-600 border-transparent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-3">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="font-satoshi w-4 text-center">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding || !size || !color}
              className="font-satoshi font-medium flex-1 bg-black text-white rounded-full py-3 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
          {addedMsg && (
            <p className="font-satoshi text-sm text-green-600">{addedMsg}</p>
          )}
        </div>
      </div>

      <div className="font-satoshi flex items-center gap-6 border-b border-gray-100 mt-10 overflow-x-auto text-sm sm:text-base">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`pb-3 whitespace-nowrap ${
              tab === t
                ? "text-black border-b-2 border-black font-medium"
                : "text-gray-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Product Details" && (
        <section className="mt-6 font-satoshi text-sm text-gray-600 leading-relaxed max-w-3xl">
          <p>{product.description}</p>
          <ul className="mt-4 list-disc pl-5 space-y-1">
            <li>Category: {product.category}</li>
            <li>Style: {product.dressStyle}</li>
            <li>In stock: {product.stock}</li>
            <li>Available sizes: {(product.sizes || []).join(", ")}</li>
          </ul>
        </section>
      )}

      {tab === "Rating & Reviews" && (
        <section className="mt-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-satoshi font-bold text-lg sm:text-xl">
              All Reviews <span className="text-gray-400 font-normal">(451)</span>
            </h2>
            <button
              type="button"
              className="font-satoshi font-medium bg-black text-white text-sm rounded-full px-5 py-2.5"
            >
              Write a Review
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="border border-gray-200 rounded-2xl p-5 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between">
                  <StarRow rating={review.rating} />
                  <MoreHorizontal size={18} className="text-gray-400" />
                </div>
                <div className="font-satoshi font-medium flex items-center gap-1.5">
                  {review.name}
                  <span className="w-4 h-4 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">
                    ✓
                  </span>
                </div>
                <p className="font-satoshi text-sm text-gray-500 leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>
                <span className="font-satoshi text-xs text-gray-400">{review.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "FAQs" && (
        <section className="mt-6 font-satoshi text-sm text-gray-600 space-y-4 max-w-3xl">
          <div>
            <h3 className="font-medium text-black mb-1">What is your return policy?</h3>
            <p>Returns are accepted within 30 days of delivery for unused items with tags.</p>
          </div>
          <div>
            <h3 className="font-medium text-black mb-1">How long does shipping take?</h3>
            <p>Standard delivery typically takes 3–7 business days depending on your location.</p>
          </div>
          <div>
            <h3 className="font-medium text-black mb-1">Do you offer free shipping?</h3>
            <p>Delivery fee is calculated at checkout. Promo codes may waive delivery fees.</p>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-integral text-2xl sm:text-3xl uppercase text-center">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
