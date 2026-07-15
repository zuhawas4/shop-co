import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { navLinks } from "../data/footerLinks.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-16 py-4 gap-4">
        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          type="button"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="font-integral text-xl sm:text-2xl font-extrabold tracking-tight">
          SHOP.CO
        </Link>

        <nav className="font-satoshi hidden lg:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) =>
                `hover:text-gray-500 ${isActive ? "font-semibold" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <form
          onSubmit={handleSearch}
          className="font-satoshi hidden lg:flex items-center flex-1 max-w-md mx-6 bg-[#F0EEED] rounded-full px-4 py-2"
        >
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="bg-[#F0EEED] outline-none text-sm ml-2 w-full"
          />
        </form>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            className="lg:hidden"
            aria-label="Search"
            type="button"
            onClick={() => setMobileSearchOpen((o) => !o)}
          >
            <Search size={20} />
          </button>

          <Link to="/cart" aria-label="Cart" className="relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-black text-white text-[10px] font-satoshi font-bold flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/account"
                className="font-satoshi text-sm hidden sm:inline hover:text-gray-500"
                title={user?.name}
              >
                Profile
              </Link>
              <Link to="/account" aria-label="Profile" className="sm:hidden">
                <User size={20} />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="font-satoshi text-sm hidden sm:inline hover:text-gray-500"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                className="sm:hidden"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="font-satoshi text-sm hidden sm:inline hover:text-gray-500"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="font-satoshi text-sm hidden sm:inline bg-black text-white rounded-full px-3 py-1.5 hover:bg-gray-800"
              >
                Signup
              </Link>
              <Link to="/login" aria-label="Account" className="sm:hidden">
                <User size={20} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {mobileSearchOpen && (
        <form
          onSubmit={handleSearch}
          className="lg:hidden px-4 pb-3 flex items-center gap-2 bg-[#F0EEED] mx-4 mb-3 rounded-full px-4 py-2"
        >
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="font-satoshi bg-transparent outline-none text-sm w-full"
            autoFocus
          />
        </form>
      )}

      {mobileMenuOpen && (
        <nav className="font-satoshi lg:hidden flex flex-col gap-3 px-4 pb-4 text-sm border-t border-gray-100 pt-3">
          {navLinks.map((link) => (
            <NavLink key={link.label} to={link.path} onClick={() => setMobileMenuOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>
              <button type="button" onClick={handleLogout} className="text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                Signup
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
