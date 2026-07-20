import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const paymentMethods = [
  { id: "apple_pay", label: "Apple Pay" },
  { id: "mada", label: "مدى" },
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "stc_pay", label: "STC Pay" },
  { id: "cash", label: "الدفع عند الاستلام" },
];

const Checkout = () => {
  const { items, subtotal, total, discount, couponCode, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    area: "",
    street: "",
    building: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/orders", {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          addons: i.addons,
        })),
        guestInfo: { name: form.name, phone: form.phone, email: form.email },
        couponCode: couponCode || undefined,
        paymentMethod,
        deliveryAddress: {
          city: form.city,
          area: form.area,
          street: form.street,
          building: form.building,
          notes: form.notes,
        },
        deliveryFee: 0,
      });
      clearCart();
      toast.success("تم إرسال طلبك بنجاح!");
      navigate(`/track-order?number=${data.order.orderNumber}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return <div className="section container empty-state">سلتك فاضية، ارجع للمتجر وضيف منتجات الأول.</div>;
  }

  return (
    <div className="cart-layout container">
      <form onSubmit={handleSubmit}>
        <h1 className="section-title" style={{ marginBottom: 20 }}>إتمام الطلب</h1>

        <h3 style={{ marginBottom: 12 }}>بيانات التواصل</h3>
        <div className="form-group">
          <label>الاسم بالكامل</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>رقم الموبايل</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>البريد الإلكتروني (اختياري)</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        <h3 style={{ margin: "20px 0 12px" }}>عنوان التوصيل</h3>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>المدينة</label>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>الحي/المنطقة</label>
            <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>الشارع</label>
            <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>رقم المبنى</label>
            <input value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label>ملاحظات إضافية (اختياري)</label>
          <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        <h3 style={{ margin: "20px 0 12px" }}>طريقة الدفع</h3>
        <div className="payment-options">
          {paymentMethods.map((m) => (
            <div
              key={m.id}
              className={`payment-option ${paymentMethod === m.id ? "active" : ""}`}
              onClick={() => setPaymentMethod(m.id)}
            >
              {m.label}
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: 24 }} disabled={submitting}>
          {submitting ? "جاري الإرسال..." : `تأكيد الطلب — ${total} ج.م`}
        </button>
      </form>

      <div className="cart-summary">
        <h3 style={{ marginBottom: 16 }}>ملخص الطلب</h3>
        {items.map((item) => (
          <div className="summary-row" key={item.lineKey}>
            <span>{item.name} × {item.quantity}</span>
            <span>{(item.price + (item.addons || []).reduce((s, a) => s + a.price, 0)) * item.quantity} ج.م</span>
          </div>
        ))}
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
      </div>
    </div>
  );
};

export default Checkout;
