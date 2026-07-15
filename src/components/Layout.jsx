import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar.jsx";
import Header from "./Header.jsx";
import Newsletter from "./Newsletter.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-black font-satoshi flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
}
