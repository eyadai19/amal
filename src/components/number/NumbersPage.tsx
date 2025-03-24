"use client";
import { getArabicNumerals } from "@/utils/arabicNumerals";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AmalNavbar from "../amalNavbar";

export default function NumbersPage() {
	const router = useRouter();
	const numbersWithKeys = Object.entries(getArabicNumerals);

	// تصفية الأرقام الأساسية فقط (0-9) لعرضها في الشبكة
	const basicNumbers = numbersWithKeys.filter(([key]) =>
		[
			"zero",
			"one",
			"two",
			"three",
			"four",
			"five",
			"six",
			"seven",
			"eight",
			"nine",
		].includes(key),
	);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-[#D8E5F0] p-6 pt-24">
			<AmalNavbar backgroundColor="#283a5c" />

			<motion.h1
				className="mb-16 text-center text-4xl font-bold text-[#1E3A6E]"
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
			>
				الأرقام العربية
			</motion.h1>

			<div className="grid w-full max-w-4xl grid-cols-4 gap-6 md:grid-cols-6 lg:grid-cols-7">
				{basicNumbers.map(([key, number], index) => (
					<motion.div
						key={key}
						className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl bg-white text-2xl font-bold text-[#1E3A6E] shadow-md transition-transform hover:scale-105"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: index * 0.05 }}
						onClick={() => router.push(`/numbers/${key}`)}
					>
						{number}
					</motion.div>
				))}
			</div>

			{/* قسم للأعداد الكبيرة */}
			<motion.h2
				className="mt-16 mb-8 text-center text-3xl font-bold text-[#1E3A6E]"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
			>
				الأعداد الكبيرة
			</motion.h2>

			<div className="grid w-full max-w-4xl grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
				{numbersWithKeys
					.filter(
						([key]) =>
							![
								"zero",
								"one",
								"two",
								"three",
								"four",
								"five",
								"six",
								"seven",
								"eight",
								"nine",
							].includes(key),
					)
					.map(([key, number], index) => (
						<motion.div
							key={key}
							className="flex h-24 cursor-pointer items-center justify-center rounded-xl bg-white px-4 text-xl font-bold text-[#1E3A6E] shadow-md transition-transform hover:scale-105"
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
							onClick={() => router.push(`/numbers/${key}`)}
						>
							<div className="text-center">
								<div className="text-2xl">{number}</div>
								<div className="text-sm text-gray-500">{key}</div>
							</div>
						</motion.div>
					))}
			</div>
		</div>
	);
}
