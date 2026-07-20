import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Coffee } from "lucide-react";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <Coffee size={20} style={{ verticalAlign: "middle", marginLeft: 8 }} />
          MO Cafe
        </Link>

        <ul className="nav-links">
          <li><Link to="/">الرئيسية</Link></li>
          <li><Link to="/shop">المتجر</Link></li>
          <li><Link to="/offers">العروض</Link></li>
          <li><Link to="/branches">الفروع</Link></li>
          <li><Link to="/contact">تواصل معنا</Link></li>
        </ul>

        <Link to="/cart" className="cart-btn">
          <ShoppingBag size={18} />
          السلة
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </Link>
      </div>
    </header>
  );
};

export default Header;
