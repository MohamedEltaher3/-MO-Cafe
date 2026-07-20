import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <h3 style={{ color: "#fff", marginBottom: 12 }}>☕ MO Cafe</h3>
          <p style={{ maxWidth: 280, fontSize: 14 }}>
            تجربة قهوة فاخرة، من قلب المكونات لحد فنجانك. اطلب أونلاين واستلم بسرعة.
          </p>
        </div>
        <div>
          <h4 style={{ color: "#fff", marginBottom: 12, fontSize: 15 }}>روابط سريعة</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            <Link to="/shop">المتجر</Link>
            <Link to="/track-order">تتبع طلبك</Link>
            <Link to="/faq">الأسئلة الشائعة</Link>
            <Link to="/policies">سياسات الاستخدام</Link>
          </div>
        </div>
        <div>
          <h4 style={{ color: "#fff", marginBottom: 12, fontSize: 15 }}>تواصل معنا</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            <a href="#">واتساب</a>
            <a href="#">انستجرام</a>
            <a href="#">تيك توك</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} MO Cafe. جميع الحقوق محفوظة.</div>
    </footer>
  );
};

export default Footer;
