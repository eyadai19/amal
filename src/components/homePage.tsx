"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowRight, FaVolumeUp } from "react-icons/fa";
import AmalNavbar from "./amalNavbar";

// Add ResponsiveVoice type definition
declare global {
	interface Window {
		responsiveVoice: {
			speak: (text: string, voice: string) => void;
			cancel: () => void;
		};
	}
}

export default function HomePage({
	logoutAction,
}: {
	logoutAction: () => Promise<void>;
}) {
	const [activeHover, setActiveHover] = useState<number | null>(null);
	const [speakingText, setSpeakingText] = useState<string | null>(null);

	const loadResponsiveVoice = () => {
		return new Promise<void>((resolve) => {
			if (typeof window !== "undefined" && !window.responsiveVoice) {
				const script = document.createElement("script");
				script.src =
					"https://code.responsivevoice.org/responsivevoice.js?key=bUVdFdpm";
				script.onload = () => resolve();
				document.body.appendChild(script);
			} else {
				resolve();
			}
		});
	};

	const toggleSpeech = async (text: string) => {
		await loadResponsiveVoice();

		if (window.responsiveVoice) {
			if (speakingText === text) {
				window.responsiveVoice.cancel();
				setSpeakingText(null);
			} else {
				window.responsiveVoice.speak(text, "Arabic Female");
				setSpeakingText(text);
			}
		}
	};

	useEffect(() => {
		return () => {
			if (window.responsiveVoice) {
				window.responsiveVoice.cancel();
			}
		};
	}, []);

	const categories = [
		{
			title: "القسم التعليمي",
			description: "!تعلّم معنا",
			bgColor: "bg-gradient-to-br from-[#D8E5F0] to-[#A8C4E0]",
			textColor: "text-[#1E3A6E]",
			hoverColor: "hover:shadow-[#1E3A6E]/40",
			href: "/literacy",
			icon: "📚",
		},
		{
			title: "القسم المهني",
			description: "!مسارك المهني",
			bgColor: "bg-gradient-to-br from-[#E49B97] to-[#D87A75]",
			textColor: "text-[#B84941]",
			hoverColor: "hover:shadow-[#B84941]/40",
			href: "/career",
			icon: "💼",
		},
		{
			title: "القسم النفسي",
			description: "!صحتك النفسية",
			bgColor: "bg-gradient-to-br from-[#E2C8D3] to-[#D9A8BE]",
			textColor: "text-[#582C5E]",
			hoverColor: "hover:shadow-[#582C5E]/40",
			href: "/psychological",
			icon: "🧠",
		},
		{
			title: "القسم القانوني",
			description: "!ثق بنا واسألنا ما تريد",
			bgColor: "bg-gradient-to-br from-[#C7E7E4FF] to-[#85C0BAFF]",
			textColor: "text-[#14514BFF]",
			hoverColor: "hover:shadow-[#14514BFF]/40",
			href: "/legal",
			icon: "⚖️",
		},
	];

	const services = [
		{
			title: "التعليم ومحو الأمية",
			description:
				"دروس تفاعلية تدعم الصوت والكتابة اليدوية لتطوير مهارات القراءة والكتابة بطرق مبتكرة.",
			icon: "📚",
			color: "bg-[#D8E5F0]",
		},
		{
			title: "التوجيه المهني",
			description:
				"اختبارات تقييم المهارات وربط المستخدمين بفرص التدريب والعمل في مختلف المجالات.",
			icon: "💼",
			color: "bg-[#E49B97]",
		},
		{
			title: "الدعم النفسي",
			description:
				"دردشة ذكية لتحليل المشاعر وتقديم استشارات نفسية مع الكشف المبكر عن علامات الاكتئاب.",
			icon: "🧠",
			color: "bg-[#E2C8D3]",
		},
		{
			title: "المساعدة القانونية",
			description:
				"قاعدة بيانات قانونية ذكية وإمكانية التواصل مع محامين لتقديم الاستشارات القانونية.",
			icon: "⚖️",
			color: "bg-[#FFCB99]",
		},
		{
			title: "التواصل المجتمعي",
			description:
				"مجموعات داعمة وورش عمل لتعزيز التواصل الاجتماعي وبناء شبكات العلاقات.",
			icon: "🤝",
			color: "bg-[#C8E2D3]",
		},
		{
			title: "التتبع والتقييم",
			description:
				"نظام متكامل لمتابعة التقدم وتقييم التحسن في مختلف الجوانب التعليمية والمهنية.",
			icon: "📊",
			color: "bg-[#D3C8E2]",
		},
	];

	const contactMethods = [
		{ icon: "📧", title: "البريد الإلكتروني", content: "Amal@gmail.com" },
		{ icon: "📞", title: "رقم الهاتف", content: "+963 991 647 194" },
		{ icon: "🌍", title: "الموقع الإلكتروني", content: "Amal.com" },
		{ icon: "📍", title: "العنوان", content: "دمشق، سوريا" },
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#F5F0EA] to-[#E1D9D1]">
			<AmalNavbar
				logoutAction={logoutAction}
				backgroundColor="#27583BFF"
				activeSection={null}
			/>

			{/* Hero Section */}
			<section id="home" className="relative overflow-hidden">
				<div className="absolute inset-0 bg-[url('/image/patterns/arabesque.png')] bg-cover opacity-6" />
				<div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 sm:px-6 md:flex-row md:py-24">
					<motion.div
						className="relative z-10 mb-8 w-full text-center md:mb-0 md:w-1/2 md:pr-8 md:text-right"
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
					>
						<motion.img
							src="../image/logo/LOGO.png"
							alt="أمل Logo"
							className="mx-auto w-56 drop-shadow-lg sm:w-64 md:w-72 lg:w-80"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
							whileHover={{ scale: 1.05 }}
						/>
						<motion.h1
							className="mt-6 text-3xl font-bold text-[#234330] sm:text-4xl md:mt-8 md:text-5xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
						>
							منصة <span className="text-[#4A8B5C]">أمل</span> للاندماج المجتمعي
						</motion.h1>
					</motion.div>

					<motion.div
						className="relative z-10 grid w-full grid-cols-1 gap-4 sm:gap-5 md:w-1/2 md:grid-cols-2 md:gap-6"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
					>
						{categories.map((category, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
								whileHover={{ y: -5 }}
								onMouseEnter={() => setActiveHover(index)}
								onMouseLeave={() => setActiveHover(null)}
								className="h-full transform transition-transform duration-300 hover:scale-[1.03]"
							>
								<div className="relative h-full">
									<FaVolumeUp
										className={`absolute -top-2 -right-2 z-20 cursor-pointer rounded-full bg-white p-1.5 text-xl shadow-md sm:-top-3 sm:-right-3 sm:p-2 sm:text-2xl ${category.textColor}`}
										onClick={() =>
											toggleSpeech(
												`${category.title} - ${category.description}`,
											)
										}
									/>

									<motion.a
										href={category.href}
										className={`block h-full rounded-xl p-4 shadow-lg transition-all duration-300 sm:rounded-2xl sm:p-6 ${category.bgColor} ${category.hoverColor} ${activeHover === index ? "shadow-xl" : "shadow-md"}`}
									>
										<div className="flex h-full flex-col items-start justify-between">
											<div>
												<span className="text-2xl sm:text-3xl">
													{category.icon}
												</span>
												<h2
													className={`mt-2 text-xl font-bold sm:mt-4 sm:text-2xl ${category.textColor}`}
												>
													{category.title}
												</h2>
												<p
													className={`mt-1 text-base sm:mt-2 sm:text-lg ${category.textColor}`}
												>
													{category.description}
												</p>
											</div>
											<motion.div
												className={`mt-2 flex items-center sm:mt-4 ${category.textColor}`}
												initial={{ x: 0 }}
												animate={{ x: activeHover === index ? 5 : 0 }}
												transition={{ duration: 0.3 }}
											>
												<span className="text-xs font-medium sm:text-sm">
													ابدأ الرحلة
												</span>
												<FaArrowRight className="mr-1 sm:mr-2" />
											</motion.div>
										</div>
									</motion.a>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* About Section */}
			<section id="about" className="relative py-12 sm:py-16 md:py-20">
				<div className="absolute inset-0 bg-[#234330] opacity-5"></div>
				<div className="container mx-auto px-4 sm:px-6">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true, margin: "-100px" }}
						className="relative rounded-2xl bg-white p-6 shadow-xl sm:rounded-3xl sm:p-8 md:p-10"
					>
						<div className="flex items-center justify-center">
							<h2 className="text-3xl font-bold text-[#234330] sm:text-4xl">
								من نحن
							</h2>
							<FaVolumeUp
								className="mr-3 cursor-pointer text-xl text-[#4A8B5C] sm:text-2xl"
								onClick={() => toggleSpeech("من نحن")}
							/>
						</div>

						<div className="mt-8 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-2 md:gap-12">
							<div className="relative">
								<div className="absolute top-0 -left-4 h-full w-1.5 rounded-full bg-gradient-to-b from-[#4A8B5C] to-[#234330] sm:-left-6 sm:w-2"></div>
								<div className="flex items-center justify-end gap-2">
									<p className="text-right text-base leading-relaxed text-gray-700 sm:text-lg md:text-xl">
										<span className="mb-3 block text-xl font-bold text-[#234330] sm:text-2xl">
											رؤيتنا
										</span>
										نؤمن في <strong className="text-[#4A8B5C]">أمل</strong> بأن
										لكل فرد الحق في فرصة ثانية لبناء مستقبل أفضل. نعمل على تسخير
										التكنولوجيا الحديثة لخلق بيئة داعمة تمكن المفرج عنهم من
										تحقيق الاندماج المجتمعي الكامل والاستقرار النفسي والمادي.
									</p>
									<button
										onClick={() =>
											toggleSpeech(
												"رؤيتنا: نؤمن في أمل بأن لكل فرد الحق في فرصة ثانية لبناء مستقبل أفضل. نعمل على تسخير التكنولوجيا الحديثة لخلق بيئة داعمة تمكن المفرج عنهم من تحقيق الاندماج المجتمعي الكامل والاستقرار النفسي والمادي.",
											)
										}
										className={`rounded-full p-2 ${
											speakingText ===
											"رؤيتنا: نؤمن في أمل بأن لكل فرد الحق في فرصة ثانية لبناء مستقبل أفضل. نعمل على تسخير التكنولوجيا الحديثة لخلق بيئة داعمة تمكن المفرج عنهم من تحقيق الاندماج المجتمعي الكامل والاستقرار النفسي والمادي."
												? "bg-gray-200 text-gray-800"
												: "text-gray-600 hover:bg-gray-100"
										}`}
									>
										<FaVolumeUp size={20} />
									</button>
								</div>
							</div>

							<div className="relative">
								<div className="absolute top-0 -left-4 h-full w-1.5 rounded-full bg-gradient-to-b from-[#4A8B5C] to-[#234330] sm:-left-6 sm:w-2"></div>
								<div className="flex items-center justify-end gap-2">
									<p className="text-right text-base leading-relaxed text-gray-700 sm:text-lg md:text-xl">
										<span className="mb-3 block text-xl font-bold text-[#234330] sm:text-2xl">
											مهمتنا
										</span>
										نقدم منصة رقمية شاملة تعتمد على الذكاء الاصطناعي لتقديم حلول
										مبتكرة في مجالات التعليم، التوجيه المهني، الدعم النفسي،
										والمساعدة القانونية. نهدف إلى تمكين المستخدمين من خلال أدوات
										ذكية تسهل عملية إعادة الاندماج.
									</p>
									<button
										onClick={() =>
											toggleSpeech(
												"مهمتنا: نقدم منصة رقمية شاملة تعتمد على الذكاء الاصطناعي لتقديم حلول مبتكرة في مجالات التعليم، التوجيه المهني، الدعم النفسي، والمساعدة القانونية. نهدف إلى تمكين المستخدمين من خلال أدوات ذكية تسهل عملية إعادة الاندماج.",
											)
										}
										className={`rounded-full p-2 ${
											speakingText ===
											"مهمتنا: نقدم منصة رقمية شاملة تعتمد على الذكاء الاصطناعي لتقديم حلول مبتكرة في مجالات التعليم، التوجيه المهني، الدعم النفسي، والمساعدة القانونية. نهدف إلى تمكين المستخدمين من خلال أدوات ذكية تسهل عملية إعادة الاندماج."
												? "bg-gray-200 text-gray-800"
												: "text-gray-600 hover:bg-gray-100"
										}`}
									>
										<FaVolumeUp size={20} />
									</button>
								</div>
							</div>
						</div>

						<div className="mt-8 md:mt-12">
							<motion.img
								src="../image/patterns/team.png"
								alt="فريق العمل"
								className="mx-auto w-full max-w-md rounded-lg shadow-md md:max-w-2xl"
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{ duration: 0.8, delay: 0.2 }}
								viewport={{ once: true }}
							/>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Services Section */}
			<section
				id="services"
				className="bg-gradient-to-r from-[#F5F0EA] to-[#E1D9D1] py-12 sm:py-16 md:py-20"
			>
				<div className="container mx-auto px-4 sm:px-6">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="text-center"
					>
						<div className="inline-flex items-center">
							<h2 className="text-3xl font-bold text-[#234330] sm:text-4xl">
								خدماتنا
							</h2>
							<FaVolumeUp
								className="mr-3 cursor-pointer text-xl text-[#4A8B5C] sm:text-2xl"
								onClick={() => toggleSpeech("خدماتنا")}
							/>
						</div>

						<div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
							{services.map((service, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="rounded-xl bg-white p-5 text-right shadow-lg sm:rounded-2xl sm:p-6 md:p-8"
								>
									<div className="flex items-center justify-between">
										<div
											className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${service.color} mb-4 text-xl sm:h-16 sm:w-16 sm:text-2xl`}
										>
											{service.icon}
										</div>
										<button
											onClick={() =>
												toggleSpeech(`${service.title}: ${service.description}`)
											}
											className={`rounded-full p-2 ${
												speakingText ===
												`${service.title}: ${service.description}`
													? "bg-gray-200 text-gray-800"
													: "text-gray-600 hover:bg-gray-100"
											}`}
										>
											<FaVolumeUp size={20} />
										</button>
									</div>
									<h3 className="mb-3 text-xl font-bold text-[#234330] sm:text-2xl">
										{service.title}
									</h3>
									<p className="text-sm leading-relaxed text-gray-700 sm:text-base">
										{service.description}
									</p>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>
			</section>

			{/* Contact Section */}
			<section
				id="contact"
				className="relative bg-[#234330] py-12 text-white sm:py-16 md:py-20"
			>
				<div className="absolute inset-0 bg-[url('/image/patterns/dots.png')] bg-cover opacity-10"></div>
				<div className="container mx-auto px-4 sm:px-6">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="relative rounded-2xl bg-[#2D5A3D] p-6 shadow-xl sm:rounded-3xl sm:p-8 md:p-12"
					>
						<div className="flex flex-col items-center">
							<div className="flex items-center justify-center gap-2">
								<h2 className="mb-4 text-3xl font-bold sm:text-4xl">
									تواصل معنا
								</h2>
								<button
									onClick={() => toggleSpeech("تواصل معنا")}
									className={`rounded-full p-2 ${
										speakingText === "تواصل معنا"
											? "bg-gray-200 text-gray-800"
											: "text-gray-600 hover:bg-gray-100"
									}`}
								>
									<FaVolumeUp size={20} />
								</button>
							</div>
							<div className="flex items-center justify-center gap-2">
								<p className="mb-8 max-w-2xl text-center text-base sm:text-lg md:mb-12 md:text-xl">
									نحن هنا لدعمكم والإجابة على جميع استفساراتكم. تواصلوا معنا عبر
									القنوات التالية:
								</p>
								<button
									onClick={() =>
										toggleSpeech(
											"نحن هنا لدعمكم والإجابة على جميع استفساراتكم. تواصلوا معنا عبر القنوات التالية",
										)
									}
									className={`rounded-full p-2 ${
										speakingText ===
										"نحن هنا لدعمكم والإجابة على جميع استفساراتكم. تواصلوا معنا عبر القنوات التالية"
											? "bg-gray-200 text-gray-800"
											: "text-gray-600 hover:bg-gray-100"
									}`}
								>
									<FaVolumeUp size={20} />
								</button>
							</div>

							<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-8">
								{contactMethods.map((item, index) => (
									<motion.div
										key={index}
										whileHover={{ y: -5 }}
										className="rounded-lg bg-[#3A6E4F] p-4 text-center sm:rounded-xl sm:p-5 md:p-6"
									>
										<div className="mb-3 text-2xl sm:text-3xl">{item.icon}</div>
										<div className="flex items-center justify-center gap-2">
											<h3 className="mb-2 text-lg font-bold sm:text-xl">
												{item.title}
											</h3>
											<button
												onClick={() =>
													toggleSpeech(`${item.title}: ${item.content}`)
												}
												className={`rounded-full p-2 ${
													speakingText === `${item.title}: ${item.content}`
														? "bg-gray-200 text-gray-800"
														: "text-gray-600 hover:bg-gray-100"
												}`}
											>
												<FaVolumeUp size={20} />
											</button>
										</div>
										<p className="text-sm sm:text-base">{item.content}</p>
									</motion.div>
								))}
							</div>

							<div className="mt-8 w-full max-w-2xl sm:mt-12">
								<div className="flex items-center justify-center gap-2">
									<h3 className="mb-4 text-center text-xl font-bold sm:text-2xl">
										تابعونا على وسائل التواصل
									</h3>
									<button
										onClick={() => toggleSpeech("تابعونا على وسائل التواصل")}
										className={`rounded-full p-2 ${
											speakingText === "تابعونا على وسائل التواصل"
												? "bg-gray-200 text-gray-800"
												: "text-gray-600 hover:bg-gray-100"
										}`}
									>
										<FaVolumeUp size={20} />
									</button>
								</div>
								<div className="flex flex-wrap justify-center gap-3 sm:gap-4">
									{["Facebook", "Twitter", "Instagram", "LinkedIn"].map(
										(social, index) => (
											<motion.div
												key={index}
												whileHover={{ scale: 1.1 }}
												className="cursor-pointer rounded-full bg-[#4A8B5C] px-4 py-2 text-sm sm:text-base"
											>
												<span className="text-white">{social}</span>
											</motion.div>
										),
									)}
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
