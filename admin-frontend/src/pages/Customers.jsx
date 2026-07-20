import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/customers${search ? `?search=${search}` : ""}`);
      setCustomers(data.customers);
    } catch (error) {
      toast.error("فشل تحميل العملاء");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(load, 350); // debounce للبحث
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">العملاء</h1>
        <input
          placeholder="بحث بالاسم أو الموبايل..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 260, padding: "10px 14px", background: "#121b2e", border: "1px solid #1a2740", borderRadius: 8, color: "#fff" }}
        />
      </div>

      <div className="card">
        {loading ? (
          <p className="text-muted">جاري التحميل...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الموبايل</th>
                <th>البريد الإلكتروني</th>
                <th>عدد الطلبات</th>
                <th>إجمالي الإنفاق</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email || "-"}</td>
                  <td>{c.totalOrders}</td>
                  <td>{c.totalSpent?.toLocaleString()} ج.م</td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-muted">مفيش عملاء لسه.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Customers;
