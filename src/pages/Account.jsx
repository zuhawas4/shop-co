import { Link, Navigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Account() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <section className="px-4 sm:px-8 lg:px-16 py-20 text-center font-satoshi text-gray-500">
        Loading...
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: "/account" }} />;
  }

  return (
    <section className="px-4 sm:px-8 lg:px-16 py-12 sm:py-16 max-w-2xl mx-auto">
      <h1 className="font-integral text-2xl sm:text-4xl font-extrabold tracking-tight uppercase mb-6">
        My Account
      </h1>

      <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
        <div>
          <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wide">Name</p>
          <p className="font-satoshi font-medium text-lg">{user.name}</p>
        </div>
        <div>
          <p className="font-satoshi text-xs text-gray-400 uppercase tracking-wide">Email</p>
          <p className="font-satoshi font-medium text-lg">{user.email}</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Link to="/cart">
            <Button variant="secondary">View Cart</Button>
          </Link>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
}
