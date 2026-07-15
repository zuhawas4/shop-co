import { useState } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Login() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!authLoading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errors = {};
    if (!email.trim()) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      await refreshCart();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 sm:px-8 lg:px-16 py-12 sm:py-16 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="font-integral text-2xl sm:text-4xl font-extrabold tracking-tight uppercase mb-2 text-center">
          Login
        </h1>
        <p className="font-satoshi text-sm text-gray-500 text-center mb-8">
          Welcome back. Sign in to continue shopping.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            placeholder="••••••••"
          />

          {error && (
            <p className="font-satoshi text-sm text-red-500 text-center">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="font-satoshi text-sm text-center text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-black font-medium underline">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
