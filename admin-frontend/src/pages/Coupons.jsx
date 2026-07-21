import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const emptyForm = {
  code: "",
  type: "percentage",
  value: "",
  minOrderAmount: "",
  maxDiscountAmount: "",
  usageLimit: "",
  endDate: "",
};

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/coupons");
      setCoupons(data.coupons);
    } catch (error) {
      toast.error("فشل تحميل الكوبونات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/coupons", {
        ...form,
        value: Number(form.value),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      });
      toast.success("تم إضافة الكوبون");
      setShowModal(false);
      setForm(emptyForm);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("متأكد من حذف الكوبون؟")) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success("تم الحذف");
      load();
    } catch (error) {
      toast.error("فشل الحذف");
    }
  };

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">الكوبونات والعروض</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} style={{ verticalAlign: "middle", marginLeft: 6 }} />
          كوبون جديد
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p className="text-muted">جاري التحميل...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>الكود</th>
                <th>النوع</th>
                <th>القيمة</th>
                <th>الاستخدام</th>
                <th>ينتهي في</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td><strong>{c.code}</strong></td>
                  <td>{c.type === "percentage" ? "نسبة %" : "مبلغ ثابت"}</td>
                  <td>{c.value}{c.type === "percentage" ? "%" : " ج.م"}</td>
                  <td>{c.usedCount} / {c.usageLimit || "∞"}</td>
                  <td>{new Date(c.endDate).toLocaleDateString("ar-EG")}</td>
                  <td>
                    <span className={`badge ${c.isActive ? "badge-success" : "badge-muted"}`}>
                      {c.isActive ? "فعّال" : "متوقف"}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(c._id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-muted">مفيش كوبونات لسه.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>إضافة كوبون جديد</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>الكود</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="MOCAFE20" />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>النوع</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="percentage">نسبة مئوية %</option>
                    <option value="fixed">مبلغ ثابت</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>القيمة</label>
                  <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>أقل قيمة طلب</label>
                  <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>أقصى خصم (اختياري)</label>
                  <input type="number" value={form.maxDiscountAmount} onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>حد الاستخدام (اختياري)</label>
                  <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>تاريخ الانتهاء</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>حفظ</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
