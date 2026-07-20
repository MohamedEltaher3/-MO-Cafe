import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredModule }) => {
  const { user, hasAccess } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (requiredModule && !hasAccess(requiredModule)) {
    return (
      <div className="card">
        <h3>🚫 مفيش صلاحية للوصول لهذا القسم</h3>
        <p className="text-muted">تواصل مع السوبر أدمن لو محتاج صلاحية إضافية.</p>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;
