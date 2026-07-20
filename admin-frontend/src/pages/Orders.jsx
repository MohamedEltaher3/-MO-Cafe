import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const statusLabels = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
  preparing: "جاري التحضير",
  out_for_delivery: "في الطريق",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const statusBadge = {
  pending: "badge-warning",
  confirmed: "badge-warning",
  preparing: "badge-warning",
  out_for_delivery: "badge-warning",
  delivered: "badge-success",
  cancelled: "badge-danger",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders${filterStatus ? `?status=${filterStatus}` : ""}`);
      setOrders(data.orders);
    } catch (error) {
      toast.error("فشل تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success("تم تحديث حالة الطلب");
      load();
    } catch (error) {
      toast.error("فشل التحديث");
    }
  };

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">الطلبات</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: 200, padding: "8px 12px", background: "#121b2e", border: "1px solid #1a2740", borderRadius: 8, color: "#fff" }}
        >
          <option value="">كل الحالات</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="card">
        {loading ? (
          <p className="text-muted">جاري التحميل...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>العميل</th>
                <th>الإجمالي</th>
                <th>الدفع</th>
                <th>الحالة</th>
                <th>تغيير الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td><strong>{o.orderNumber}</strong></td>
                  <td>{o.customer?.name || o.guestInfo?.name || "زائر"}</td>
                  <td>{o.total} ج.م</td>
                  <td>
                    <span className={`badge ${o.paymentStatus === "paid" ? "badge-success" : "badge-warning"}`}>
                      {o.paymentStatus === "paid" ? "مدفوع" : "غير مدفوع"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${statusBadge[o.status]}`}>{statusLabels[o.status]}</span>
                  </td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      style={{ padding: "6px 10px", background: "#0b1220", border: "1px solid #1a2740", borderRadius: 6, color: "#fff" }}
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-muted">مفيش طلبات لسه.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
