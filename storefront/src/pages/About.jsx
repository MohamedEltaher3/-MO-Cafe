import React from "react";

const About = () => {
  return (
    <div className="section container" style={{ maxWidth: 700 }}>
      <h1 className="section-title">عن MO Cafe</h1>
      <p style={{ color: "#7a6a5c", fontSize: 15, lineHeight: 1.9, marginBottom: 16 }}>
        بدأنا رحلتنا بشغف بسيط: نقدّم قهوة ومشروبات بجودة حقيقية، من غير ما نضحي بالتجربة أو
        السرعة. كل مكون بنستخدمه بيتم اختياره بعناية، وكل كوب بيتحضّر بنفس المعايير في كل مرة.
      </p>
      <p style={{ color: "#7a6a5c", fontSize: 15, lineHeight: 1.9 }}>
        دلوقتي بقينا متاحين أونلاين عشان نوصلّك قهوتك المفضلة أينما كنت، مع نفس الجودة اللي
        اتعودت عليها في فروعنا.
      </p>
    </div>
  );
};

export default About;
