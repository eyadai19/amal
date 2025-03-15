"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaBook, FaCalculator } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function LiteracyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#D8E5F0] p-6 flex flex-col items-center justify-center">
      <motion.h1
        className="text-4xl font-bold text-center text-[#1E3A6E] mb-70"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        القسم التعليمي
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-center w-full max-w-4xl mt-[-200px]">
        
        <motion.div
          className="bg-white p-8 rounded-2xl shadow-md text-center w-full h-[300px] md:w-[350px] lg:w-[400px] xl:w-[450px]"
          whileHover={{ scale: 1.05 }}
        >
          <FaBook className="text-[#1E3A6E] text-5xl mx-auto mb-3" />
          <h2 className="text-xl text-[#1E3A6E] font-semibold mb-2">الأحرف</h2>
          <p className="text-[#344A72FF] mb-4">!تعلّم معنا القراءة والكتابة بطريقة بسيطة وفعّالة</p>
          <Button
            className="bg-[#D8E5F0] text-[#1E3A6E] hover:bg-[#3f5680] hover:text-[#D8E5F0] w-full"
            onClick={() => router.push("/letters")}
          >
            !ابدأ التعلم
          </Button>
        </motion.div>

        <motion.div
          className="bg-white p-8 rounded-2xl shadow-md text-center w-full h-[300px] md:w-[350px] lg:w-[400px] xl:w-[450px]"
          whileHover={{ scale: 1.05 }}
        >
          <FaCalculator className="text-[#1E3A6E] text-5xl mx-auto mb-3" />
          <h2 className="text-xl text-[#1E3A6E] font-semibold mb-2">الأرقام</h2>
          <p className="text-[#344A72FF] mb-4">!تعلّم معنا الأرقام بطريقة بسيطة وفعالة</p>
          <Button
            className="bg-[#D8E5F0] text-[#1E3A6E] hover:bg-[#3f5680] hover:text-[#D8E5F0] w-full"
            onClick={() => router.push("/numbers")}
          >
            !ابدأ التعلم
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
