import React, { useEffect, useState } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import api from "../api/axios";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/branches");
        setBranches(data.branches);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="section container">
      <h1 className="section-title">فروعنا</h1>
      <p className="section-subtitle">تعال زورنا في أقرب فرع ليك</p>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : branches.length === 0 ? (
        <div className="empty-state">لسه مفيش فروع مضافة. ضيفهم من لوحة التحكم.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {branches.map((b) => (
            <div className="cart-summary" key={b._id}>
              <h3 style={{ marginBottom: 10 }}>{b.nameAr || b.name}</h3>
              {b.address && (
                <div style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 14 }}>
                  <MapPin size={16} /> {b.address}
                </div>
              )}
              {b.phone && (
                <div style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 14 }}>
                  <Phone size={16} /> {b.phone}
                </div>
              )}
              {b.workingHours && (
                <div style={{ display: "flex", gap: 8, fontSize: 14 }}>
                  <Clock size={16} /> {b.workingHours}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Branches;
