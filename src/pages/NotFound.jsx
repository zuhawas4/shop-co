import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="px-4 sm:px-8 lg:px-16 py-20 text-center">
      <h1 className="font-integral text-3xl sm:text-5xl tracking-tight mb-4">404</h1>
      <p className="font-satoshi text-gray-500 mb-6">This page doesn&apos;t exist.</p>
      <Link to="/" className="font-satoshi underline">
        Back to home
      </Link>
    </section>
  );
}
