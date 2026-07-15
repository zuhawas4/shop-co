import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="font-satoshi relative bg-black text-white text-xs sm:text-sm text-center py-2 px-8">
      <span>
        Sign up and get 20% off to your first order.{" "}
        <Link to="/signup" className="font-medium underline">
          Sign Up Now
        </Link>
      </span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
