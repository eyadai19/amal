"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaBook, FaCalculator } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LiteracyPage() {
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[#D8E5F0] p-6 flex flex-col items-center justify-center pt-24">
      <nav className="fixed top-0 left-0 z-50 w-full bg-[#283a5c] py-1 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6">
        <img
          src="../image/authImage/LOGO.png"
          alt="أمل Logo"
          className="h-17 w-28 object-contain"
        />
        
        <button
          onClick={toggleMenu}
          className="block focus:outline-none sm:hidden"
          aria-label="فتح القائمة"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        <ul
          className={`${
            isMenuOpen ? "block" : "hidden"
          } absolute top-16 right-0 left-0 z-10 space-y-4 bg-[#283a5c] p-4 sm:static sm:flex sm:space-y-0 sm:bg-transparent sm:p-0 ${
            isMenuOpen ? "flex-col" : "sm:flex-row"
          } sm:flex sm:w-full sm:max-w-2xl sm:items-center sm:justify-around`}
        >
          <li className="text-center">
            <a
              href="/home"
              className="block w-full text-lg font-semibold transition duration-300 hover:text-[#D8E5F0]"
            >
              الصفحة الرئيسية
            </a>
          </li>
          <li className="text-center">
            <a
              href="/home#about"
              className="block w-full text-lg font-semibold transition duration-300 hover:text-[#D8E5F0]"
            >
              من نحن
            </a>
          </li>
          <li className="text-center">
            <a
              href="/home#services"
              className="block w-full text-lg font-semibold transition duration-300 hover:text-[#D8E5F0]"
            >
              خدماتنا
            </a>
          </li>
          <li className="text-center">
            <a
              href="/home#contact"
              className="block w-full text-lg font-semibold transition duration-300 hover:text-[#D8E5F0]"
            >
              تواصل معنا
            </a>
          </li>
        </ul>
      </div>
    </nav>

      <motion.h1
        className="text-4xl font-bold text-center text-[#1E3A6E] mb-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        القسم التعليمي
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-center w-full max-w-4xl">
        <motion.div
          className="bg-white p-8 rounded-2xl shadow-md text-center w-full h-[300px] md:w-[350px] lg:w-[400px] xl:w-[450px] flex flex-col items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <FaBook className="text-[#1E3A6E] text-5xl mx-auto mb-3" />
          <h2 className="text-xl text-[#1E3A6E] font-semibold">الأحرف</h2>
          <div className="flex-grow flex items-center justify-center">
            <p className="text-[#344A72FF]">!تعلّم معنا القراءة والكتابة بطريقة بسيطة وفعّالة</p>
          </div>
          <Button
            className="bg-[#D8E5F0] text-[#1E3A6E] hover:bg-[#3f5680] hover:text-[#D8E5F0] w-full mt-6"
            onClick={() => router.push("/letters")}
          >
            !ابدأ التعلم
          </Button>
        </motion.div>

        <motion.div
          className="bg-white p-8 rounded-2xl shadow-md text-center w-full h-[300px] md:w-[350px] lg:w-[400px] xl:w-[450px] flex flex-col items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <FaCalculator className="text-[#1E3A6E] text-5xl mx-auto mb-3" />
          <h2 className="text-xl text-[#1E3A6E] font-semibold">الأرقام</h2>
          <div className="flex-grow flex items-center justify-center">
            <p className="text-[#344A72FF]">!تعلّم معنا الأرقام بطريقة بسيطة وفعالة</p>
          </div>
          <Button
            className="bg-[#D8E5F0] text-[#1E3A6E] hover:bg-[#3f5680] hover:text-[#D8E5F0] w-full mt-6"
            onClick={() => router.push("/numbers")}
          >
            !ابدأ التعلم
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
