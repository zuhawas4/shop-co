import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Signup() {
  const { signup, isAuthenticated, loading: authLoading } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (form.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      await refreshCart();
      navigate("/account", { replace: true });
    } catch (err) {
      const apiErrors = err.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length) {
        const mapped = {};
        apiErrors.forEach((item) => {
          if (item.path) mapped[item.path] = item.msg;
        });
        setFieldErrors(mapped);
        setError(apiErrors[0]?.msg || err.message);
      } else {
        setError(err.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 sm:px-8 lg:px-16 py-12 sm:py-16 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="font-integral text-2xl sm:text-4xl font-extrabold tracking-tight uppercase mb-2 text-center">
          Sign Up
        </h1>
        <p className="font-satoshi text-sm text-gray-500 text-center mb-8">
          Create an account to track orders and save your cart.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={update("name")}
            error={fieldErrors.name}
            placeholder="Your name"
            autoComplete="name"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={update("email")}
            error={fieldErrors.email}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={update("password")}
            error={fieldErrors.password}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            error={fieldErrors.confirmPassword}
            placeholder="Repeat password"
            autoComplete="new-password"
          />

          {error && (
            <p className="font-satoshi text-sm text-red-500 text-center">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="font-satoshi text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
