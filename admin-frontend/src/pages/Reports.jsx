import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import toast from "react-hot-toast";
import api from "../api/axios";

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/reports/sales-by-day?days=${days}`);
        setSales(data.sales);
      } catch (error) {
        toast.error("فشل تحميل التقارير");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [days]);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalOrders = sales.reduce((sum, s) => sum + s.orders, 0);

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">التقارير</h1>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={{ padding: "8px 12px", background: "#121b2e", border: "1px solid #1a2740", borderRadius: 8, color: "#fff" }}
        >
          <option value={7}>آخر 7 أيام</option>
          <option value={30}>آخر 30 يوم</option>
          <option value={90}>آخر 90 يوم</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">إجمالي الإيرادات ({days} يوم)</div>
          <div className="stat-value">{totalRevenue.toLocaleString()} ج.م</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">إجمالي الطلبات المدفوعة</div>
          <div className="stat-value">{totalOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">متوسط قيمة الطلب</div>
          <div className="stat-value">{totalOrders ? Math.round(totalRevenue / totalOrders) : 0} ج.م</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>المبيعات اليومية</h3>
        {loading ? (
          <p className="text-muted">جاري التحميل...</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" />
              <XAxis dataKey="_id" stroke="#9aa5b8" fontSize={11} />
              <YAxis stroke="#9aa5b8" fontSize={12} />
              <Tooltip contentStyle={{ background: "#121b2e", border: "1px solid #1a2740" }} />
              <Bar dataKey="total" fill="#d8b96a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Reports;
