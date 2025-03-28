"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaBook, FaCalculator } from "react-icons/fa";
import AmalNavbar from "./amalNavbar";

export default function LiteracyPage() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#D8E5F0] to-[#A3B7D6] p-6 pt-24 font-sans">
      <AmalNavbar backgroundColor="#283a5c" activeSection={"literacy"} />

      <motion.h1
        className="mb-16 text-center text-5xl font-extrabold text-[#1E3A6E] sm:text-6xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        القسم التعليمي
      </motion.h1>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {/* Letters Card */}
        <motion.div
          className="flex h-[350px] w-full flex-col items-center justify-between rounded-3xl bg-white p-8 text-center shadow-xl transition-all transform hover:scale-105"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaBook className="mx-auto mb-6 text-6xl text-[#1E3A6E]" />
          <h2 className="text-2xl font-semibold text-[#1E3A6E]">الأحرف</h2>
          <p className="mt-4 text-lg text-[#344A72]">
            تعلّم معنا القراءة والكتابة بطريقة بسيطة وفعّالة.
          </p>
          <Button
            className="mt-6 w-full bg-[#1E3A6E] text-white hover:bg-[#3f5680] transition-all"
            onClick={() => router.push("/letters")}
          >
            !ابدأ التعلم
          </Button>
        </motion.div>

        {/* Numbers Card */}
        <motion.div
          className="flex h-[350px] w-full flex-col items-center justify-between rounded-3xl bg-white p-8 text-center shadow-xl transition-all transform hover:scale-105"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaCalculator className="mx-auto mb-6 text-6xl text-[#1E3A6E]" />
          <h2 className="text-2xl font-semibold text-[#1E3A6E]">الأرقام</h2>
          <p className="mt-4 text-lg text-[#344A72]">
            تعلّم معنا الأرقام بطريقة بسيطة وفعّالة.
          </p>
          <Button
            className="mt-6 w-full bg-[#1E3A6E] text-white hover:bg-[#3f5680] transition-all"
            onClick={() => router.push("/numbers")}
          >
            !ابدأ التعلم
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
