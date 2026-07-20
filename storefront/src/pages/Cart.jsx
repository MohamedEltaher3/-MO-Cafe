import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    total,
    discount,
    couponCode,
    setCouponCode,
    setDiscount,
  } = useCart();
  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplying(true);
    try {
      const { data } = await api.post("/coupons/validate", {
        code: couponInput.trim(),
        orderAmount: subtotal,
      });
      setDiscount(data.discount);
      setCouponCode(couponInput.trim().toUpperCase());
      toast.success(`تم تطبيق الكوبون! خصم ${data.discount} ج.م`);
    } catch (error) {
      toast.error(error.response?.data?.message || "الكوبون غير صالح");
      setDiscount(0);
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="section container empty-state">
        <p style={{ marginBottom: 20 }}>سلتك فاضية دلوقتي 🛒</p>
        <Link to="/shop" className="btn btn-gold">تصفح المنيو</Link>
      </div>
    );
  }

  return (
    <div className="cart-layout container">
      <div>
        <h1 className="section-title" style={{ marginBottom: 20 }}>سلة المشتريات</h1>
        {items.map((item) => (
          <div className="cart-item" key={item.lineKey}>
            <div className="cart-item-image">
              {item.image ? <img src={item.image} alt={item.name} /> : null}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
              {item.addons?.length > 0 && (
                <div style={{ fontSize: 13, color: "#7a6a5c", marginBottom: 6 }}>
                  {item.addons.map((a) => a.name).join("، ")}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="qty-control" style={{ padding: "4px 12px" }}>
                  <button onClick={() => updateQuantity(item.lineKey, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.lineKey, item.quantity + 1)}>+</button>
                </div>
                <button
                  onClick={() => removeItem(item.lineKey)}
                  style={{ background: "none", border: "none", color: "#b5453f", cursor: "pointer" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="price">
              {(item.price + (item.addons || []).reduce((s, a) => s + a.price, 0)) * item.quantity} ج.م
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="form-group">
          <label>كود الخصم</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="MOCAFE20"
            />
            <button className="btn btn-outline" onClick={applyCoupon} disabled={applying}>
              تطبيق
            </button>
          </div>
        </div>

        <div className="summary-row">
          <span>المجموع الفرعي</span>
          <span>{subtotal} ج.م</span>
        </div>
        {discount > 0 && (
          <div className="summary-row">
            <span>الخصم</span>
            <span>−{discount} ج.م</span>
          </div>
        )}
        <div className="summary-row total">
          <span>الإجمالي</span>
          <span>{total} ج.م</span>
        </div>

        <button className="btn btn-primary btn-full" onClick={() => navigate("/checkout")}>
          إتمام الطلب
        </button>
      </div>
    </div>
  );
};

export default Cart;
