import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "إزاي أطلب من الموقع؟", a: "اختار المنتجات اللي عايزها، ضيفها للسلة، وبعدين اكمل بيانات التوصيل والدفع من صفحة إتمام الطلب." },
  { q: "طرق الدفع المتاحة إيه؟", a: "بنقبل Apple Pay، مدى، Visa، Mastercard، STC Pay، وكمان الدفع عند الاستلام." },
  { q: "أقدر أتابع طلبي إزاي؟", a: "هيوصلك رقم الطلب بعد ما تأكد الأوردر، تقدر تستخدمه في صفحة 'تتبع طلبك' عشان تعرف حالته لحظة بلحظة." },
  { q: "أقدر ألغي أو أعدّل طلبي؟", a: "تقدر تتواصل معانا في أسرع وقت بعد الطلب مباشرة عبر واتساب أو صفحة تواصل معنا." },
  { q: "هل فيه كوبونات وخصومات؟", a: "أيوه، بنطلق كوبونات وعروض بشكل دوري — تابعنا على السوشيال ميديا عشان تعرف بأحدث العروض." },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="section container" style={{ maxWidth: 700 }}>
      <h1 className="section-title">الأسئلة الشائعة</h1>
      <p className="section-subtitle">كل اللي محتاج تعرفه</p>

      <div>
        {faqs.map((item, i) => (
          <div key={i} style={{ borderBottom: "1px solid #f0e9db", padding: "16px 0" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 700,
                color: "#2b1d14",
                textAlign: "start",
              }}
            >
              {item.q}
              <ChevronDown
                size={18}
                style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              />
            </button>
            {open === i && <p style={{ marginTop: 10, color: "#7a6a5c", fontSize: 14 }}>{item.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
