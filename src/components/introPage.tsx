"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function IntroPage() {
  const [showIntro, setShowIntro] = useState(false);
  const [startTransition, setStartTransition] = useState(false);
  const router = useRouter(); 

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#E1D9D1] overflow-hidden">
      {!showIntro && (
        <motion.img
          src="../image/logo/LOGO.png"
          alt="أمل Logo"
          className="w-64 cursor-pointer"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          onClick={() => setShowIntro(true)}
        />
      )}

      {showIntro && (
        <motion.div
          className="absolute inset-0 flex w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex w-full h-full absolute top-0 left-0"
            animate={startTransition ? { x: "-50%" } : { x: "0%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <div className="w-1/2 flex flex-col items-center justify-center">
              <motion.img
                src="../image/logo/LOGO.png"
                alt="أمل Logo"
                className="w-64"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>

            <div className="w-1/2 h-full bg-[#697867] text-white flex flex-col items-center justify-center p-8 text-center">
              <h1 className="text-4xl font-bold mb-4">!مرحبًا بكم في أمل</h1>
              <p className="text-lg leading-relaxed">
                منصتنا الذكية مصممة لدعمكم في إعادة الاندماج بالمجتمع بسهولة.  
                نوفر برامج تعليمية تفاعلية لمحو الأمية، ودورات متخصصة لتنمية مهاراتكم وفتح آفاق جديدة في سوق العمل.  
                نساعدكم على التكيف مع المجتمع، وبناء علاقات جديدة، وتحقيق الاستقرار.  
                كما نقدم استشارات مهنية لتحديد مساركم الوظيفي، إلى جانب دعم نفسي وقانوني لمساعدتكم على تجاوز التحديات.  
                لكل فرد الحق في بداية جديدة، انضموا إلينا اليوم وابدؤوا رحلتكم نحو مستقبل أكثر إشراقًا
              </p>
            </div>

          </motion.div>
          {!startTransition && (
            <motion.button
              className="absolute bottom-8 right-8 bg-[#E1D9D1] text-[#697867] px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-[#bbcbb1] transition duration-300"
              onClick={() => router.push("/home")}
              initial={{ opacity: 1 }}
              animate={{ opacity: startTransition ? 0 : 1 }}
              transition={{ duration: 0.5 }}
            >
              المتابعة
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
