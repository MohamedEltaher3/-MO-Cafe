import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);
const STORAGE_KEY = "mocafe_cart";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // كل عنصر في السلة له مفتاح فريد بناءً على المنتج + الإضافات المختارة
  const makeLineKey = (productId, addons) =>
    productId + "::" + (addons || []).map((a) => a.name).sort().join(",");

  const addItem = (product, quantity = 1, addons = []) => {
    const lineKey = makeLineKey(product._id, addons);
    setItems((prev) => {
      const existing = prev.find((i) => i.lineKey === lineKey);
      if (existing) {
        return prev.map((i) =>
          i.lineKey === lineKey ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          lineKey,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          addons,
          quantity,
        },
      ];
    });
    toast.success(`تمت إضافة ${product.name} للسلة`);
  };

  const updateQuantity = (lineKey, quantity) => {
    if (quantity < 1) return removeItem(lineKey);
    setItems((prev) => prev.map((i) => (i.lineKey === lineKey ? { ...i, quantity } : i)));
  };

  const removeItem = (lineKey) => {
    setItems((prev) => prev.filter((i) => i.lineKey !== lineKey));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode("");
    setDiscount(0);
  };

  const subtotal = items.reduce((sum, i) => {
    const addonsTotal = (i.addons || []).reduce((s, a) => s + (a.price || 0), 0);
    return sum + (i.price + addonsTotal) * i.quantity;
  }, 0);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        total,
        itemCount,
        couponCode,
        setCouponCode,
        discount,
        setDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
