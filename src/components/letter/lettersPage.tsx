"use client";
import { getArabicLetters } from "@/utils/arabicLetters"; // Make sure this is imported correctly
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AmalNavbar from "../amalNavbar"; // Ensure the path is correct
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function LettersPage() {
  const router = useRouter();
  
  // Assuming getArabicLetters is an object, use it directly without calling it as a function
  const lettersWithKeys = Object.entries(getArabicLetters); // No parentheses here
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#D8E5F0] to-[#A3B7D6] p-6 pt-24 font-sans">
      {/* Updated Amal Navbar with Gradient and Font Styles */}
      <AmalNavbar backgroundColor="#283a5c" activeSection={"literacy"} />

      <div className="ml-15 mt-5 mb-6 md:mb-8 flex justify-start items-start gap-4 w-full">
        <Link
          href="/literacy"
          className="flex items-center text-[#1E3A6E] hover:text-[#3f5680]"
        >
          <FaArrowLeft className="mr-2" />
          <span className="text-sm md:text-base">العودة إلى القسم التعليمي</span>
        </Link>
        <div className="hidden md:block md:w-8"></div>
      </div>

      {/* Updated Title with Font Style */}
      <motion.h1
        className="mb-16 text-center text-5xl font-extrabold text-[#1E3A6E] sm:text-6xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        الأحرف العربية
      </motion.h1>

      {/* Letters Grid with Updated Font Style */}
      <div className="grid w-full max-w-4xl grid-cols-4 gap-6 md:grid-cols-6 lg:grid-cols-7">
        {lettersWithKeys.map(([key, letter], index) => (
          <motion.div
            key={key}
            className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl bg-white text-2xl font-bold text-[#1E3A6E] shadow-md transition-transform hover:scale-105"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onClick={() => router.push(`/letters/${key}`)}
          >
            {letter} {/* This should correctly display the Arabic letter */}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
