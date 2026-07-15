import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import ProductGrid from "../components/ProductGrid.jsx";
import { dressStyles } from "../data/dressStyles.js";
import { testimonials } from "../data/testimonials.js";
import { fetchProducts } from "../api/products.js";

export default function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [arrivals, top] = await Promise.all([
          fetchProducts({ filter: "new", limit: 4 }),
          fetchProducts({ filter: "brands", limit: 4 }),
        ]);
        if (cancelled) return;
        setNewArrivals(arrivals.products || []);
        setTopSelling(top.products || []);
      } catch {
        if (!cancelled) {
          setNewArrivals([]);
          setTopSelling([]);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDressStyleClick = (style) => {
    navigate(`/category/${style.label.toLowerCase()}`);
  };

  const visibleTestimonials = () => {
    const arr = [];
    for (let i = 0; i < 3; i++) {
      arr.push(testimonials[(testimonialIndex + i) % testimonials.length]);
    }
    return arr;
  };
  const nextTestimonial = () => setTestimonialIndex((i) => (i + 1) % testimonials.length);
  const prevTestimonial = () =>
    setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <>
      <section className="bg-[#F2F0F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 lg:py-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
          <div className="flex-1">
            <h1 className="font-integral text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-[1.05] tracking-tight">
              Find Clothes That Matches Your Style
            </h1>
            <p className="font-satoshi mt-4 text-sm sm:text-base text-gray-500 max-w-md">
              Browse through our diverse range of meticulously crafted garments, designed
              to bring out your individuality and cater to your sense of style.
            </p>
            <Link
              to="/shop"
              className="font-satoshi font-medium mt-6 inline-block bg-black text-white rounded-full px-10 py-3.5 text-sm hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </Link>

            <div className="mt-8 flex flex-wrap gap-6 sm:gap-8">
              <div>
                <p className="font-satoshi font-bold text-xl sm:text-2xl">200+</p>
                <p className="font-satoshi text-xs sm:text-sm text-gray-500">International Brands</p>
              </div>
              <div className="border-l border-gray-300 pl-6 sm:pl-8">
                <p className="font-satoshi font-bold text-xl sm:text-2xl">2,000+</p>
                <p className="font-satoshi text-xs sm:text-sm text-gray-500">High-Quality Products</p>
              </div>
              <div className="border-l border-gray-300 pl-6 sm:pl-8">
                <p className="font-satoshi font-bold text-xl sm:text-2xl">30,000+</p>
                <p className="font-satoshi text-xs sm:text-sm text-gray-500">Happy Customers</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full h-full">
            <img
              src="/images/imgs/models.jpg"
              alt="Models"
              className="w-full h-full object-cover scale-110"
            />
          </div>
        </div>

        <div className="bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6 flex flex-wrap items-center justify-between gap-4">
            {["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"].map((brand) => (
              <span
                key={brand}
                className="text-white font-semibold text-sm sm:text-xl opacity-90 font-satoshi"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <ProductGrid title="New Arrivals" products={newArrivals} viewAllLink="/shop?filter=new" />
      )}

      <div className="border-t border-gray-200 mx-4 sm:mx-8 lg:mx-16" />

      {topSelling.length > 0 && (
        <ProductGrid title="Top Selling" products={topSelling} viewAllLink="/shop?filter=brands" />
      )}

      <section className="px-4 sm:px-8 lg:px-16 pb-10 sm:pb-14">
        <div className="bg-[#F0F0F0] rounded-2xl p-4 sm:p-8">
          <h2 className="font-integral text-center text-2xl sm:text-4xl font-extrabold tracking-tight uppercase mb-6">
            Browse by Dress Style
          </h2>
          <div className="font-satoshi font-bold grid grid-cols-2 gap-4">
            {dressStyles?.map((style) => (
              <div
                key={style.id}
                onClick={() => handleDressStyleClick(style)}
                onKeyDown={(e) => e.key === "Enter" && handleDressStyleClick(style)}
                role="button"
                tabIndex={0}
                className="relative rounded-xl bg-white border border-gray-300 min-h-[160px] sm:min-h-[220px] flex items-start p-4 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={style.image}
                  alt={style.label}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <span className="font-satoshi font-bold relative z-10 text-sm sm:text-base text-black">
                  {style.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 lg:px-16 py-10 sm:py-14">
        <div className="font-satoshi flex items-center justify-between mb-8">
          <h2 className="font-integral text-2xl sm:text-4xl font-extrabold tracking-tight uppercase">
            Our Happy Customers
          </h2>
          <div className="hidden sm:flex gap-2">
            <button
              type="button"
              onClick={prevTestimonial}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextTestimonial}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="font-satoshi grid grid-cols-1 sm:grid-cols-3 gap-6">
          {visibleTestimonials().map((t) => (
            <div key={t.id} className="border border-gray-200 rounded-xl p-5">
              <div className="flex text-yellow-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <div className="flex items-center gap-1 mb-2">
                <span className="font-satoshi font-bold text-sm">{t.name}</span>
                {t.verified && (
                  <span className="text-green-500" title="Verified buyer">
                    ✔
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>

        <div className="font-satoshi flex sm:hidden justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={prevTestimonial}
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={nextTestimonial}
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </>
  );
}
