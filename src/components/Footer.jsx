import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Github } from "lucide-react";
import { footerLinks } from "../data/footerLinks.js";

const linkMap = {
  About: "/shop",
  Features: "/shop",
  Works: "/shop",
  Career: "/shop",
  "Customer Support": "/account",
  "Delivery Details": "/cart",
  "Terms & Conditions": "/shop",
  "Privacy Policy": "/shop",
  Account: "/account",
  "Manage Deliveries": "/account",
  Orders: "/account",
  Payments: "/cart",
  "Free eBooks": "/shop",
  "Development Tutorial": "/shop",
  "How to - Blog": "/shop",
  "Youtube Playlist": "/shop",
};

export default function Footer() {
  return (
    <footer className="bg-[#F0F0F0] border-t border-gray-200 px-4 sm:px-8 lg:px-16 py-10">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="font-integral text-xl font-extrabold tracking-tight">
            SHOP.CO
          </Link>
          <p className="font-satoshi mt-3 text-sm text-gray-500">
            We have clothes that suits your style and which you&apos;re proud to wear. From
            women to men.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              aria-label="Twitter"
            >
              <Twitter size={14} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center"
              aria-label="Facebook"
            >
              <Facebook size={14} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              aria-label="Instagram"
            >
              <Instagram size={14} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              aria-label="Github"
            >
              <Github size={14} />
            </a>
          </div>
        </div>

        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="font-satoshi font-medium text-xs tracking-wide text-black mb-4">
              {heading}
            </h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <Link
                    to={linkMap[link] || "/shop"}
                    className="font-satoshi text-sm text-gray-600 hover:text-black"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="font-satoshi mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-400">Shop.co © 2000-2023, All Rights Reserved</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {["Visa", "Mastercard", "PayPal", "Apple Pay", "GPay"].map((p) => (
            <div
              key={p}
              className="h-6 px-2 rounded bg-white border border-gray-200 flex items-center justify-center text-[9px] font-satoshi font-medium text-gray-600"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
