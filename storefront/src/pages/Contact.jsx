import React, { useState } from "react";
import toast from "react-hot-toast";
import { Phone, Mail, MessageCircle } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("تم استلام رسالتك، هنتواصل معاك قريبًا");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="section container">
      <h1 className="section-title">تواصل معنا</h1>
      <p className="section-subtitle">عندك سؤال أو اقتراح؟ ابعتلنا</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>الاسم</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>رسالتك</label>
            <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          </div>
          <button className="btn btn-primary">إرسال</button>
        </form>

        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
            <Phone size={18} /> <span>+20 1XX XXX XXXX</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
            <Mail size={18} /> <span>hello@mocafe.com</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <MessageCircle size={18} /> <span>واتساب: تواصل مباشر</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
