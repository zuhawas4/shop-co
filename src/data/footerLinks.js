export const footerLinks = {
  COMPANY: ["About", "Features", "Works", "Career"],
  HELP: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
  FAQ: ["Account", "Manage Deliveries", "Orders", "Payments"],
  RESOURCES: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"],
};

// Top nav links. To add a new page to the header:
// 1. Add { label: "My Page", path: "/my-page" } below
// 2. Create src/pages/MyPage.jsx
// 3. Add a <Route> for it in src/App.jsx
export const navLinks = [
  { label: "Shop", path: "/shop" },
  { label: "On Sale", path: "/shop?filter=sale" },
  { label: "New Arrivals", path: "/shop?filter=new" },
  { label: "Brands", path: "/shop?filter=brands" },
];
