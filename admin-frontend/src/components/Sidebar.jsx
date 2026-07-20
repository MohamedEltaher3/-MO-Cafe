import React from "react";
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Store size={20} style={{ verticalAlign: "middle", marginLeft: 8 }} />
        MO Cafe
      </div>

      <nav className="sidebar-nav">
        {links
          .filter((l) => !l.module || hasAccess(l.module))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
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
  );
};

export default Sidebar;
