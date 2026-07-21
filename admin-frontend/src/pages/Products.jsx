import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const emptyForm = {
  name: "",
  nameAr: "",
  description: "",
  price: "",
  compareAtPrice: "",
  category: "",
  stock: "",
  images: "",
  ingredients: "",
  isFeatured: false,
  isNew: false,
  isActive: true,
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: prodData }, { data: catData }] = await Promise.all([
        api.get("/products?limit=100"),
        api.get("/categories"),
      ]);
      setProducts(prodData.products);
      setCategories(catData.categories);
    } catch (error) {
      toast.error("فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      nameAr: product.nameAr || "",
      description: product.description || "",
      price: product.price,
      compareAtPrice: product.compareAtPrice || "",
      category: product.category?._id || "",
      stock: product.stock,
      images: (product.images || []).join(", "),
      ingredients: (product.ingredients || []).join(", "),
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      isActive: product.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      stock: Number(form.stock) || 0,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      ingredients: form.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("تم تعديل المنتج");
      } else {
        await api.post("/products", payload);
        toast.success("تم إضافة المنتج");
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("متأكد من حذف المنتج ده؟")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("تم الحذف");
      loadData();
    } catch (error) {
      toast.error("فشل الحذف");
    }
  };

  return (
    <div>
      <div className="topbar">
        <h1 className="page-title">المنتجات</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} style={{ verticalAlign: "middle", marginLeft: 6 }} />
          إضافة منتج
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
                <th>التصنيف</th>
                <th>السعر</th>
                <th>المخزون</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    {p.name}{" "}
                    {p.isFeatured && <Star size={14} color="#c9a24b" style={{ verticalAlign: "middle" }} />}{" "}
                    {p.isNew && <Sparkles size={14} color="#2eb872" style={{ verticalAlign: "middle" }} />}
                  </td>
                  <td>{p.category?.name || "-"}</td>
                  <td>{p.price} ج.م</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`badge ${p.isActive ? "badge-success" : "badge-muted"}`}>
                      {p.isActive ? "متاح" : "متوقف"}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => openEdit(p)}>
                      <Pencil size={14} />
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(p._id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-muted">
                    مفيش منتجات لسه. ابدأ بإضافة أول منتج!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>{editingId ? "تعديل منتج" : "إضافة منتج جديد"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>اسم المنتج (إنجليزي)</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>اسم المنتج (عربي)</label>
                <input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
              </div>
              <div className="form-group">
                <label>الوصف</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>التصنيف</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">اختر تصنيف</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>السعر</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>سعر قبل الخصم (اختياري)</label>
                  <input type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>المخزون</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>روابط الصور (مفصولة بفاصلة)</label>
                <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://... , https://..." />
              </div>
              <div className="form-group">
                <label>المكونات (مفصولة بفاصلة)</label>
                <input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} placeholder="قهوة, حليب, سكر" />
              </div>
              <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                  منتج مميز
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                  <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} />
                  منتج جديد
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  متاح للبيع
                </label>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingId ? "حفظ التعديلات" : "إضافة المنتج"}
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

export default Products;
