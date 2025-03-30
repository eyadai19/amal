"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function IntroPage() {
	const [isLogoClicked, setIsLogoClicked] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const router = useRouter();
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		handleResize(); // التحقق عند التحميل الأولي
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-[#E1D9D1]">
			{!isLogoClicked ? (
				<div className="flex h-screen w-full items-center justify-center">
					<motion.img
						src="../image/logo/LOGO.png"
						alt="أمل Logo"
						className="w-48 cursor-pointer md:w-64"
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1.5, ease: "easeOut" }}
						onClick={() => setIsLogoClicked(true)}
					/>
				</div>
			) : (
				<div className="relative h-screen w-full">
					{/* اللوجو المتحرك */}
					<motion.div
						className="absolute flex items-center justify-center"
						initial={{ left: "50%", top: "50%" }}
						animate={
							isMobile
								? { left: "50%", top: "25%" }
								: { left: "25%", top: "50%" }
						}
						transition={{
							duration: prefersReducedMotion ? 0 : 1,
							ease: "easeInOut",
						}}
						style={{
							transform: "translate(-50%, -50%)",
						}}
					>
						<motion.img
							src="../image/logo/LOGO.png"
							alt="أمل Logo"
							className="w-48 md:w-64"
						/>
					</motion.div>

					{/* محتوى سطح المكتب */}
					<motion.div
						className="absolute top-0 right-0 hidden h-full w-1/2 flex-col items-center justify-center bg-[#697867] p-8 text-center text-white md:flex"
						initial={{ opacity: 0, x: "100%" }}
						animate={{ opacity: 1, x: "0%" }}
						transition={{
							duration: prefersReducedMotion ? 0 : 1,
							ease: "easeInOut",
							delay: 0.2,
						}}
					>
						<div className="max-w-md">
							<h1 className="mb-4 text-4xl font-bold">!مرحبًا بكم في أمل</h1>
							<p className="text-lg leading-relaxed">
								منصتنا الذكية مصممة لدعمكم في إعادة الاندماج بالمجتمع بسهولة.
								نوفر برامج تعليمية تفاعلية لمحو الأمية، ودورات متخصصة لتنمية
								مهاراتكم وفتح آفاق جديدة في سوق العمل. نساعدكم على التكيف مع
								المجتمع، وبناء علاقات جديدة، وتحقيق الاستقرار.
							</p>
						</div>
					</motion.div>

					{/* محتوى الجوال */}
					<motion.div
						className="absolute bottom-0 left-0 h-[60%] w-full bg-[#697867] p-4 text-center text-white md:hidden"
						initial={{ opacity: 0, y: "100%" }}
						animate={{ opacity: 1, y: "0%" }}
						transition={{
							duration: prefersReducedMotion ? 0 : 1,
							ease: "easeInOut",
							delay: 0.2,
						}}
					>
						<div className="flex h-full flex-col items-center justify-center px-2">
							<h1 className="mb-4 text-2xl font-bold">!مرحبًا بكم في أمل</h1>
							<p className="text-base leading-relaxed">
								منصتنا الذكية مصممة لدعمكم في إعادة الاندماج بالمجتمع بسهولة.
								نوفر برامج تعليمية تفاعلية لمحو الأمية، ودورات متخصصة لتنمية
								مهاراتكم وفتح آفاق جديدة في سوق العمل. نساعدكم على التكيف مع
								المجتمع، وبناء علاقات جديدة، وتحقيق الاستقرار.
							</p>
						</div>
					</motion.div>

					{/* زر المتابعة */}
					<motion.button
						className={`absolute ${
							isMobile
								? "right-4 bottom-4 px-4 py-2 text-sm"
								: "right-8 bottom-8 px-6 py-3 text-lg"
						} rounded-xl bg-[#E1D9D1] font-semibold text-[#697867] shadow-md transition duration-300 hover:bg-[#bbcbb1]`}
						onClick={() => router.push("/home")}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							delay: prefersReducedMotion ? 0 : 1.5,
							duration: 0.5,
						}}
					>
						المتابعة
					</motion.button>
				</div>
			)}
		</div>
	);
}
