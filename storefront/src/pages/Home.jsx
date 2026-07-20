import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Coffee, Truck, Star, Clock } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: f }, { data: b }] = await Promise.all([
          api.get("/products?featured=true&active=true&limit=8"),
          api.get("/products?bestSellers=true&active=true&limit=4"),
        ]);
        setFeatured(f.products);
        setBestSellers(b.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>قهوتك المفضلة، على بعد كليك</h1>
        <p>مكونات مختارة بعناية، تحضير طازج كل يوم، وتوصيل سريع لباب بيتك أو مكتبك.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/shop" className="btn btn-gold">
            <Coffee size={18} />
            تصفح المنيو
          </Link>
          <Link to="/branches" className="btn btn-outline">
            فروعنا
          </Link>
        </div>
      </section>

      <section className="section container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginBottom: 20,
          }}
        >
          {[
            { icon: Coffee, title: "مكونات مختارة", desc: "بن مختص ومكونات طازجة يوميًا" },
            { icon: Truck, title: "توصيل سريع", desc: "لكل الأحياء خلال دقائق" },
            { icon: Star, title: "جودة مضمونة", desc: "تحضير احترافي في كل مرة" },
            { icon: Clock, title: "طلب 24/7", desc: "اطلب في أي وقت يناسبك" },
          ].map((f, i) => (
            <div key={i} style={{ textAlign: "center", padding: 20 }}>
              <f.icon size={28} color="#c98a3e" style={{ marginBottom: 10 }} />
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#7a6a5c" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {!loading && featured.length > 0 && (
        <section className="section container">
          <h2 className="section-title">منتجات مميزة</h2>
          <p className="section-subtitle">اختياراتنا المفضلة لهذا الأسبوع</p>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {!loading && bestSellers.length > 0 && (
        <section className="section container" style={{ background: "#fff", borderRadius: 20 }}>
          <h2 className="section-title">الأكثر مبيعًا</h2>
          <p className="section-subtitle">اللي بيطلبه عملاؤنا أكتر</p>
          <div className="product-grid">
            {bestSellers.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {!loading && featured.length === 0 && bestSellers.length === 0 && (
        <section className="section container empty-state">
          لسه مفيش منتجات مضافة. ضيفهم من لوحة التحكم عشان يظهروا هنا.
        </section>
      )}
    </div>
  );
};

export default Home;
