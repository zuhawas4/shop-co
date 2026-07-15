import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as cartApi from "../api/cart.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);
const LOCAL_CART_KEY = "shopco_local_cart";

const emptyCart = {
  items: [],
  summary: { subtotal: 0, discountTotal: 0, deliveryFee: 0, total: 0 },
};

function calcLocalSummary(items) {
  let subtotal = 0;
  let discountTotal = 0;
  for (const item of items) {
    const qty = item.quantity || 1;
    const selling = item.price || 0;
    const original = item.oldPrice != null ? item.oldPrice : selling;
    subtotal += original * qty;
    discountTotal += (original - selling) * qty;
  }
  const deliveryFee = items.length > 0 ? 15 : 0;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountTotal: Math.round(discountTotal * 100) / 100,
    deliveryFee,
    total: Math.round((subtotal - discountTotal + deliveryFee) * 100) / 100,
  };
}

function readLocalCart() {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    if (!raw) return emptyCart;
    const parsed = JSON.parse(raw);
    const items = parsed.items || [];
    return { items, summary: calcLocalSummary(items) };
  } catch {
    return emptyCart;
  }
}

function writeLocalCart(cart) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify({ items: cart.items || [] }));
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const applyCart = useCallback((data) => {
    const next = {
      items: data?.items || [],
      summary: data?.summary || calcLocalSummary(data?.items || []),
      _id: data?._id,
    };
    setCart(next);
    writeLocalCart(next);
    return next;
  }, []);

  const refreshCart = useCallback(async () => {
    setError(null);
    try {
      const data = await cartApi.fetchCart();
      applyCart(data);
    } catch (err) {
      setError(err.message);
      applyCart(readLocalCart());
    } finally {
      setLoading(false);
    }
  }, [applyCart]);

  useEffect(() => {
    if (authLoading) return;
    refreshCart();
  }, [authLoading, user?.id, refreshCart]);

  const addItem = async ({ productId, quantity, size, color, product }) => {
    try {
      const data = await cartApi.addCartItem({ productId, quantity, size, color });
      return applyCart(data);
    } catch (err) {
      // Guest/local fallback when API unreachable
      const local = readLocalCart();
      const existing = local.items.find(
        (i) =>
          String(i.product) === String(productId) &&
          i.size === size &&
          i.color === color
      );
      let items;
      if (existing) {
        items = local.items.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        items = [
          ...local.items,
          {
            _id: `local_${Date.now()}`,
            product: productId,
            name: product?.name || "Product",
            image: product?.image || product?.images?.[0] || "",
            price: product?.price || 0,
            oldPrice: product?.oldPrice ?? null,
            discount: product?.discount ?? null,
            size,
            color,
            quantity,
          },
        ];
      }
      return applyCart({ items, summary: calcLocalSummary(items) });
    }
  };

  const updateItem = async (itemId, payload) => {
    try {
      const data = await cartApi.updateCartItem(itemId, payload);
      return applyCart(data);
    } catch {
      const local = readLocalCart();
      const items = local.items
        .map((i) => {
          if (String(i._id) !== String(itemId)) return i;
          return {
            ...i,
            ...(payload.quantity !== undefined ? { quantity: payload.quantity } : {}),
            ...(payload.size !== undefined ? { size: payload.size } : {}),
            ...(payload.color !== undefined ? { color: payload.color } : {}),
          };
        })
        .filter((i) => i.quantity >= 1);
      return applyCart({ items, summary: calcLocalSummary(items) });
    }
  };

  const removeItem = async (itemId) => {
    try {
      const data = await cartApi.removeCartItem(itemId);
      return applyCart(data);
    } catch {
      const local = readLocalCart();
      const items = local.items.filter((i) => String(i._id) !== String(itemId));
      return applyCart({ items, summary: calcLocalSummary(items) });
    }
  };

  const cartCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart.items]
  );

  const value = useMemo(
    () => ({
      cart,
      items: cart.items,
      summary: cart.summary,
      cartCount,
      loading,
      error,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
    }),
    [cart, cartCount, loading, error, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
