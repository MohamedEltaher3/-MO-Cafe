import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`}>
        <div className="product-card-image">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} />
          ) : (
            <span style={{ fontSize: 40 }}>☕</span>
          )}
          {product.isNew && <span className="product-badge">جديد</span>}
          {!product.isNew && product.compareAtPrice && (
            <span className="product-badge">عرض</span>
          )}
        </div>
      </Link>
      <div className="product-card-body">
        <Link to={`/product/${product.slug}`}>
          <div className="product-card-title">{product.nameAr || product.name}</div>
        </Link>
        <div className="product-card-footer">
          <div>
            {product.compareAtPrice && (
              <span className="price-old">{product.compareAtPrice} ج.م</span>
            )}
            <span className="price">{product.price} ج.م</span>
          </div>
          <button className="icon-btn" onClick={() => addItem(product, 1, [])} title="إضافة للسلة">
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
