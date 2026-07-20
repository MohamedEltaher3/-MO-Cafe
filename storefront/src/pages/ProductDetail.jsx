import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data.product);
        setRelated(data.relatedProducts || []);
        setActiveImage(0);
        setSelectedAddons([]);
        setQuantity(1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  if (loading) return <div className="section container">جاري التحميل...</div>;
  if (!product) return <div className="section container empty-state">المنتج غير موجود.</div>;

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product.price + addonsTotal;

  return (
    <div>
      <div className="product-detail container">
        <div>
          <div className="product-gallery-main">
            {product.images?.[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.name} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 60 }}>☕</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="product-gallery-thumbs">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={i === activeImage ? "active" : ""}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1>{product.nameAr || product.name}</h1>
          <span className="price">{unitPrice} ج.م</span>
          {product.description && <p style={{ color: "#7a6a5c", marginBottom: 16 }}>{product.description}</p>}

          {product.ingredients?.length > 0 && (
            <div>
              <strong style={{ fontSize: 14 }}>المكونات:</strong>
              <div className="tag-list">
                {product.ingredients.map((ing, i) => (
                  <span className="tag" key={i}>{ing}</span>
                ))}
              </div>
            </div>
          )}

          {product.addons?.length > 0 && (
            <div style={{ margin: "16px 0" }}>
              <strong style={{ fontSize: 14 }}>إضافات:</strong>
              {product.addons.map((addon, i) => (
                <div className="addon-row" key={i}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={!!selectedAddons.find((a) => a.name === addon.name)}
                      onChange={() => toggleAddon(addon)}
                    />
                    {addon.name}
                  </label>
                  <span>+{addon.price} ج.م</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "20px 0" }}>
            <div className="qty-control">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => addItem(product, quantity, selectedAddons)}
            >
              أضف للسلة — {unitPrice * quantity} ج.م
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section container">
          <h2 className="section-title">منتجات مشابهة</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
