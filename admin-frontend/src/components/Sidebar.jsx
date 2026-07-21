import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Ticket,
  ShoppingCart,
  Users,
  BarChart3,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "نظرة عامة", icon: LayoutDashboard, module: null },
  { to: "/products", label: "المنتجات", icon: Package, module: "products" },
  { to: "/categories", label: "التصنيفات", icon: Tags, module: "products" },
  { to: "/coupons", label: "الكوبونات والعروض", icon: Ticket, module: "coupons" },
  { to: "/orders", label: "الطلبات", icon: ShoppingCart, module: "orders" },
  { to: "/customers", label: "العملاء", icon: Users, module: "customers" },
  { to: "/reports", label: "التقارير", icon: BarChart3, module: "reports" },
];

const Sidebar = () => {
  const { user, logout, hasAccess } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const visibleLinks = links.filter((l) => !l.module || hasAccess(l.module));

  return (
    <>
      {/* شريط علوي يظهر بس على الموبايل */}
      <div className="mobile-topbar">
        <button className="menu-toggle" onClick={() => setOpen(true)} aria-label="فتح القائمة">
          <Menu size={22} />
        </button>
        <div className="sidebar-logo" style={{ marginBottom: 0 }}>
          <Store size={18} style={{ verticalAlign: "middle", marginLeft: 6 }} />
          MO Cafe
        </div>
        <div style={{ width: 22 }} />
      </div>

      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar${open ? " open" : ""}`}>
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <Store size={20} style={{ verticalAlign: "middle", marginLeft: 8 }} />
            MO Cafe
          </div>
          <button className="menu-toggle sidebar-close" onClick={() => setOpen(false)} aria-label="إغلاق القائمة">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ marginBottom: 10 }}>
            <strong>{user?.name}</strong>
            <br />
            <span className="badge badge-muted">{user?.role}</span>
          </div>
          <button className="btn btn-secondary" style={{ width: "100%" }} onClick={handleLogout}>
            <LogOut size={14} style={{ verticalAlign: "middle", marginLeft: 6 }} />
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
