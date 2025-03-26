"use client";
import { getArabicLetters } from "@/utils/arabicLetters";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AmalNavbar from "../amalNavbar";

export default function LettersPage() {
	const router = useRouter();
	const lettersWithKeys = Object.entries(getArabicLetters);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-[#D8E5F0] p-6 pt-24">
			<AmalNavbar backgroundColor="#1E3A6E" activeSection={"literacy"} />

			<motion.h1
				className="mb-16 text-center text-4xl font-bold text-[#1E3A6E]"
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
			>
				الأحرف العربية
			</motion.h1>

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
						{letter}
					</motion.div>
				))}
			</div>
		</div>
	);
}
