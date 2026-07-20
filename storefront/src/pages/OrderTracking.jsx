import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import api from "../api/axios";

const statusSteps = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
const statusLabels = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
  preparing: "جاري التحضير",
  out_for_delivery: "في الطريق إليك",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderNumberInput, setOrderNumberInput] = useState(searchParams.get("number") || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = async (num) => {
    if (!num) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/orders/${num}`);
      setOrder(data.order);
    } catch (err) {
      setError("مفيش طلب بالرقم ده");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("number")) lookup(searchParams.get("number"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="section container">
      <h1 className="section-title">تتبع طلبك</h1>
      <p className="section-subtitle">اكتب رقم الطلب اللي وصلك عند إتمام الشراء</p>

      <div style={{ display: "flex", gap: 10, maxWidth: 420, marginBottom: 32 }}>
        <input
          placeholder="مثال: MOC-20260720-0001"
          value={orderNumberInput}
          onChange={(e) => setOrderNumberInput(e.target.value)}
          style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "1.5px solid #f0e9db" }}
        />
        <button className="btn btn-primary" onClick={() => lookup(orderNumberInput)}>
          بحث
        </button>
      </div>

      {loading && <p>جاري البحث...</p>}
      {error && <p style={{ color: "#b5453f" }}>{error}</p>}

      {order && (
        <div className="cart-summary" style={{ maxWidth: 500 }}>
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <strong>رقم الطلب: {order.orderNumber}</strong>
            <span className="price">{order.total} ج.م</span>
          </div>

          {order.status === "cancelled" ? (
            <p style={{ color: "#b5453f" }}>تم إلغاء هذا الطلب.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {statusSteps.map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {i <= currentStepIndex ? (
                    <CheckCircle2 size={20} color="#4a7c59" />
                  ) : (
                    <Circle size={20} color="#d6cdbd" />
                  )}
                  <span style={{ color: i <= currentStepIndex ? "#2b1d14" : "#a89685" }}>
                    {statusLabels[step]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
