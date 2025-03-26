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
		<div className="flex min-h-screen flex-col items-center justify-center bg-[#D8E5F0] p-6 pt-24">
			<AmalNavbar backgroundColor="#283a5c" activeSection={"literacy"} />

			<motion.h1
				className="mb-16 text-center text-4xl font-bold text-[#1E3A6E]"
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
			>
				القسم التعليمي
			</motion.h1>

			<div className="grid w-full max-w-4xl grid-cols-1 justify-center gap-10 sm:grid-cols-2">
				<motion.div
					className="flex h-[300px] w-full flex-col items-center rounded-2xl bg-white p-8 text-center shadow-md md:w-[350px] lg:w-[400px] xl:w-[450px]"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					whileHover={{ scale: 1.05 }}
				>
					<FaBook className="mx-auto mb-3 text-5xl text-[#1E3A6E]" />
					<h2 className="text-xl font-semibold text-[#1E3A6E]">الأحرف</h2>
					<div className="flex flex-grow items-center justify-center">
						<p className="text-[#344A72FF]">
							!تعلّم معنا القراءة والكتابة بطريقة بسيطة وفعّالة
						</p>
					</div>
					<Button
						className="mt-6 w-full bg-[#D8E5F0] text-[#1E3A6E] hover:bg-[#3f5680] hover:text-[#D8E5F0]"
						onClick={() => router.push("/letters")}
					>
						!ابدأ التعلم
					</Button>
				</motion.div>

				<motion.div
					className="flex h-[300px] w-full flex-col items-center rounded-2xl bg-white p-8 text-center shadow-md md:w-[350px] lg:w-[400px] xl:w-[450px]"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					whileHover={{ scale: 1.05 }}
				>
					<FaCalculator className="mx-auto mb-3 text-5xl text-[#1E3A6E]" />
					<h2 className="text-xl font-semibold text-[#1E3A6E]">الأرقام</h2>
					<div className="flex flex-grow items-center justify-center">
						<p className="text-[#344A72FF]">
							!تعلّم معنا الأرقام بطريقة بسيطة وفعالة
						</p>
					</div>
					<Button
						className="mt-6 w-full bg-[#D8E5F0] text-[#1E3A6E] hover:bg-[#3f5680] hover:text-[#D8E5F0]"
						onClick={() => router.push("/numbers")}
					>
						!ابدأ التعلم
					</Button>
				</motion.div>
			</div>
		</div>
	);
}
