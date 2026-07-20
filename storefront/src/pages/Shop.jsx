import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data.categories);
      } catch (error) {
        console.error(error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ active: "true", limit: "60" });
        if (activeCategory) params.set("category", activeCategory);
        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [activeCategory]);

  const selectCategory = (id) => {
    if (id) setSearchParams({ category: id });
    else setSearchParams({});
  };

  return (
    <div className="section container">
      <h1 className="section-title">المتجر</h1>
      <p className="section-subtitle">كل منتجاتنا في مكان واحد</p>

      <div className="category-pills">
        <button className={`pill ${!activeCategory ? "active" : ""}`} onClick={() => selectCategory("")}>
          الكل
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            className={`pill ${activeCategory === c._id ? "active" : ""}`}
            onClick={() => selectCategory(c._id)}
          >
            {c.nameAr || c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#7a6a5c" }}>جاري التحميل...</p>
      ) : products.length === 0 ? (
        <div className="empty-state">مفيش منتجات في القسم ده دلوقتي.</div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
