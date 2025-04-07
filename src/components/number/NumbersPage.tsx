"use client";
import { getArabicNumerals } from "@/utils/arabicNumerals";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import AmalNavbar from "../amalNavbar";

const arabicNumberNames: Record<string, string> = {
	ten: "عشرة",
	twenty: "عشرون",
	thirty: "ثلاثون",
	forty: "أربعون",
	fifty: "خمسون",
	sixty: "ستون",
	seventy: "سبعون",
	eighty: "ثمانون",
	ninety: "تسعون",
	hundred: "مائة",
	thousand: "ألف",
	million: "مليون",
	billion: "مليار",
};

export default function NumbersPage({ logoutAction }: { logoutAction: () => Promise<void> }) {
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
			<AmalNavbar
				logoutAction={logoutAction}
				backgroundColor="#283a5c"
				activeSection={"literacy"}
			/>
			<div className="mt-5 mb-6 ml-15 flex w-full items-start justify-start gap-4 md:mb-8">
				<Link
					href="/literacy"
					className="flex items-center text-[#1E3A6E] hover:text-[#3f5680]"
				>
					<FaArrowLeft className="mr-2" />
					<span className="text-sm md:text-base">
						العودة إلى القسم التعليمي
					</span>
				</Link>
				<div className="hidden md:block md:w-8"></div>
			</div>

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
								<div className="text-sm text-gray-500">
									{arabicNumberNames[key] || key}{" "}
									{/* Fallback to English if no Arabic name */}
								</div>
							</div>
						</motion.div>
					))}
			</div>
		</div>
	);
}
