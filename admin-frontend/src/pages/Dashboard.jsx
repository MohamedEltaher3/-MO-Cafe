import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axios";

const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
  </div>
);

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: overviewData }, { data: salesData }] = await Promise.all([
          api.get("/reports/overview"),
          api.get("/reports/sales-by-day?days=14"),
        ]);
        setOverview(overviewData.overview);
        setSales(salesData.sales);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="text-muted">جاري التحميل...</p>;

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">نظرة عامة</h1>
      </div>

      <div className="stats-grid">
        <StatCard label="إجمالي الإيرادات" value={`${overview?.totalRevenue?.toLocaleString() || 0} ج.م`} />
        <StatCard label="إيرادات الشهر" value={`${overview?.monthRevenue?.toLocaleString() || 0} ج.م`} />
        <StatCard label="إجمالي الطلبات" value={overview?.totalOrders || 0} />
        <StatCard label="طلبات اليوم" value={overview?.todayOrders || 0} />
        <StatCard label="طلبات معلّقة" value={overview?.pendingOrders || 0} />
        <StatCard label="عدد العملاء" value={overview?.totalCustomers || 0} />
        <StatCard label="عدد المنتجات" value={overview?.totalProducts || 0} />
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>المبيعات آخر 14 يوم</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={sales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" />
            <XAxis dataKey="_id" stroke="#9aa5b8" fontSize={12} />
            <YAxis stroke="#9aa5b8" fontSize={12} />
            <Tooltip contentStyle={{ background: "#121b2e", border: "1px solid #1a2740" }} />
            <Line type="monotone" dataKey="total" stroke="#d8b96a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>الأكثر مبيعًا</h3>
        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>عدد المبيعات</th>
              <th>السعر</th>
            </tr>
          </thead>
          <tbody>
            {overview?.topProducts?.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.salesCount}</td>
                <td>{p.price} ج.م</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
