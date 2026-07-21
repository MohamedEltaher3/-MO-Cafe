import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ShoppingBag, Coffee, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const navItems = [
  { to: "/", label: "الرئيسية" },
  { to: "/shop", label: "المتجر" },
  { to: "/offers", label: "العروض" },
  { to: "/branches", label: "الفروع" },
  { to: "/contact", label: "تواصل معنا" },
];

const Header = () => {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="فتح القائمة">
          <Menu size={22} />
        </button>

        <Link to="/" className="logo">
          <Coffee size={20} style={{ verticalAlign: "middle", marginLeft: 8 }} />
          MO Cafe
        </Link>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <Link to="/cart" className="cart-btn">
          <ShoppingBag size={18} />
          <span className="cart-btn-label">السلة</span>
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </Link>
      </div>

      {menuOpen &&
        createPortal(
          <div className="mobile-nav-overlay" onClick={() => setMenuOpen(false)}>
            <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-nav-header">
                <span className="logo">MO Cafe</span>
                <button className="menu-toggle" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة">
                  <X size={22} />
                </button>
              </div>
              <ul className="mobile-nav-links">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} onClick={() => setMenuOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};

export default Header;
