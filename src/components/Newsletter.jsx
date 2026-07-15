import { useState } from "react";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <section className="px-4 sm:px-8 lg:px-16 pb-10">
      <div className="bg-black rounded-2xl px-6 sm:px-12 py-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        <h3 className="font-integral text-white text-xl sm:text-2xl font-extrabold uppercase text-center lg:text-left max-w-sm">
          Stay upto date about our latest offers
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[320px]">
          <div className="font-satoshi flex items-center gap-2 bg-white rounded-full px-4 py-3">
            <Mail size={16} className="text-gray-400 shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="outline-none text-sm w-full"
            />
          </div>
          <button
            type="submit"
            className="font-satoshi font-medium bg-white text-black rounded-full py-3 text-sm hover:bg-gray-200 transition-colors"
          >
            Subscribe to Newsletter
          </button>
          {message && (
            <p className="font-satoshi text-xs text-center text-gray-300">{message}</p>
          )}
        </form>
      </div>
    </section>
  );
}
