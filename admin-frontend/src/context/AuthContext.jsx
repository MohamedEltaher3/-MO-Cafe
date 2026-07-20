import React, { createContext, useContext, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("mocafe_admin_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("mocafe_admin_token", data.token);
      localStorage.setItem("mocafe_admin_user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("تم تسجيل الدخول بنجاح");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل تسجيل الدخول");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("mocafe_admin_token");
    localStorage.removeItem("mocafe_admin_user");
    setUser(null);
  };

  const hasAccess = (module) => {
    if (!user) return false;
    if (user.role === "superadmin") return true;
    return !!user.permissions?.[module];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
