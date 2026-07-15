import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Search from "./pages/Search.jsx";
import Cart from "./components/Cart.jsx";
import Category from "./components/Category.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProductPage from "./components/ProductPage.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:style" element={<Category />} />
        <Route path="/casual" element={<Navigate to="/category/casual" replace />} />
        <Route path="/formal" element={<Navigate to="/category/formal" replace />} />
        <Route path="/party" element={<Navigate to="/category/party" replace />} />
        <Route path="/gym" element={<Navigate to="/category/gym" replace />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
