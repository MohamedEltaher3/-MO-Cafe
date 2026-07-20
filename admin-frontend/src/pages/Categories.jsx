import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", nameAr: "", description: "", sortOrder: 0 });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data.categories);
    } catch (error) {
      toast.error("فشل تحميل التصنيفات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", nameAr: "", description: "", sortOrder: 0 });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, nameAr: cat.nameAr || "", description: cat.description || "", sortOrder: cat.sortOrder || 0 });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        toast.success("تم التعديل");
      } else {
        await api.post("/categories", form);
        toast.success("تم الإضافة");
      }
      setShowModal(false);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("متأكد من حذف التصنيف ده؟")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("تم الحذف");
      load();
    } catch (error) {
      toast.error("فشل الحذف");
    }
  };

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">التصنيفات</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} style={{ verticalAlign: "middle", marginLeft: 6 }} />
          إضافة تصنيف
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p className="text-muted">جاري التحميل...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الاسم بالعربي</th>
                <th>الترتيب</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.nameAr || "-"}</td>
                  <td>{c.sortOrder}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => openEdit(c)}>
                      <Pencil size={14} />
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(c._id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-muted">مفيش تصنيفات لسه.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>{editingId ? "تعديل تصنيف" : "إضافة تصنيف"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>الاسم (إنجليزي)</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>الاسم (عربي)</label>
                <input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
              </div>
              <div className="form-group">
                <label>الوصف</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>ترتيب الظهور</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  حفظ
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
