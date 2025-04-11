"use client";
import { useState } from "react";
import AmalNavbar from "./amalNavbar";

export default function CareerPage({
	logoutAction,
}: {
	logoutAction: () => Promise<void>;
}) {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState<number[]>([]);
	const [showResult, setShowResult] = useState(false);

	const careerSteps = [
		{
			title: "تقييم المهارات",
			description:
				"اكتشف نقاط قوتك ومهاراتك من خلال اختبارات تقييم شاملة تساعدك في تحديد المسار المهني المناسب",
			icon: "📊",
		},
		{
			title: "التدريب والتطوير",
			description:
				"احصل على فرص تدريبية متخصصة وورش عمل لتنمية مهاراتك وتطوير قدراتك المهنية",
			icon: "🎓",
		},
		{
			title: "البحث عن فرص عمل",
			description:
				"استفد من قاعدة بيانات واسعة للوظائف وفرص العمل المتاحة في مختلف المجالات",
			icon: "💼",
		},
	];

	const careerTips = [
		{
			title: "بناء السيرة الذاتية",
			description:
				"تعلم كيفية كتابة سيرة ذاتية احترافية تعرض مهاراتك وخبراتك بشكل جذاب",
			icon: "📝",
		},
		{
			title: "مهارات المقابلات",
			description:
				"اكتسب المهارات اللازمة لإجراء مقابلات عمل ناجحة وتقديم نفسك بشكل احترافي",
			icon: "🗣️",
		},
		{
			title: "التواصل المهني",
			description:
				"تعلم كيفية بناء شبكة علاقات مهنية فعالة وتطوير مهارات التواصل في بيئة العمل",
			icon: "🤝",
		},
	];

	const assessmentQuestions = [
		{
			question: "ما هي اهتماماتك الرئيسية؟",
			options: [
				"التكنولوجيا والبرمجة",
				"التعليم والتدريس",
				"التسويق والإدارة",
				"الفنون والتصميم",
			],
		},
		{
			question: "ما هي مهاراتك القوية؟",
			options: [
				"التحليل وحل المشكلات",
				"التواصل والعمل الجماعي",
				"الإبداع والابتكار",
				"التنظيم والتخطيط",
			],
		},
		{
			question: "ما هو مستوى تعليمك؟",
			options: ["ثانوي", "دبلوم", "بكالوريوس", "ماجستير أو أعلى"],
		},
		{
			question: "ما هي بيئة العمل المفضلة لديك؟",
			options: ["عمل مستقل", "عمل جماعي", "قيادة فريق", "عمل مكتبي"],
		},
	];

	const careerSuggestions = {
		"التكنولوجيا والبرمجة": [
			"مطور برمجيات",
			"مصمم واجهات المستخدم",
			"محلل بيانات",
			"متخصص أمن معلومات",
		],
		"التعليم والتدريس": [
			"معلم",
			"مدرب مهني",
			"مستشار تعليمي",
			"متخصص في تطوير المناهج",
		],
		"التسويق والإدارة": [
			"مدير تسويق",
			"متخصص في التسويق الرقمي",
			"مدير موارد بشرية",
			"مدير مشاريع",
		],
		"الفنون والتصميم": [
			"مصمم جرافيك",
			"مصمم داخلي",
			"مصور فوتوغرافي",
			"فنان رقمي",
		],
	};

	const handleAnswer = (answerIndex: number) => {
		const newAnswers = [...answers, answerIndex];
		setAnswers(newAnswers);

		if (currentQuestion < assessmentQuestions.length - 1) {
			setCurrentQuestion(currentQuestion + 1);
		} else {
			setShowResult(true);
		}
	};

	const getCareerSuggestions = () => {
		const mainInterest = assessmentQuestions[0].options[answers[0]];
		return (
			careerSuggestions[mainInterest as keyof typeof careerSuggestions] || []
		);
	};

	const resetAssessment = () => {
		setCurrentQuestion(0);
		setAnswers([]);
		setShowResult(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#B84941] via-[#D6453D] to-[#FFB8B3]">
			<AmalNavbar
				logoutAction={logoutAction}
				backgroundColor="#B84941"
				activeSection={"career"}
			/>
			<div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
				<div className="text-center">
					<h1 className="mb-4 text-4xl font-bold text-white">دليلك المهني</h1>
					<p className="mb-12 text-xl text-white">
						اكتشف مسارك المهني وتطور في حياتك العملية مع دليلنا الشامل
					</p>
				</div>

				{!showResult ? (
					<div className="mb-16 overflow-hidden rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm">
						<div className="mb-8 flex items-center justify-between">
							<h2 className="text-3xl font-bold text-[#D6453D]">
								اختبار المهارات المهنية
							</h2>
							<div className="flex items-center space-x-2 space-x-reverse">
								<div className="h-2 w-24 rounded-full bg-gray-200">
									<div
										className="h-full rounded-full bg-[#D6453D] transition-all duration-300"
										style={{
											width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%`,
										}}
									/>
								</div>
								<span className="text-sm font-medium text-gray-600">
									{currentQuestion + 1}/{assessmentQuestions.length}
								</span>
							</div>
						</div>
						<div className="mb-8">
							<p className="mb-6 text-2xl font-semibold text-gray-800">
								{assessmentQuestions[currentQuestion].question}
							</p>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{assessmentQuestions[currentQuestion].options.map(
									(option, index) => (
										<button
											key={index}
											onClick={() => handleAnswer(index)}
											className="group relative overflow-hidden rounded-xl bg-white p-6 text-right shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
										>
											<div className="absolute inset-0 bg-gradient-to-r from-[#FFB8B3] to-[#E85C54] opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
											<p className="text-lg font-medium text-gray-800">
												{option}
											</p>
										</button>
									),
								)}
							</div>
						</div>
					</div>
				) : (
					<div className="mb-16 overflow-hidden rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm">
						<div className="mb-8">
							<h2 className="mb-4 text-3xl font-bold text-[#D6453D]">
								اقتراحات مهنية
							</h2>
							<p className="text-xl text-gray-700">
								بناءً على إجاباتك، نقدم لك هذه الاقتراحات المهنية المناسبة
								لمهاراتك واهتماماتك:
							</p>
						</div>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							{getCareerSuggestions().map((career, index) => (
								<div
									key={index}
									className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-[#FFB8B3] to-[#E85C54] opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
									<div className="relative">
										<h3 className="mb-2 text-xl font-semibold text-[#D6453D]">
											{career}
										</h3>
										<p className="text-gray-600">
											{career === "مطور برمجيات" &&
												"تصميم وتطوير تطبيقات ومواقع الويب"}
											{career === "مصمم واجهات المستخدم" &&
												"تصميم تجارب مستخدم جذابة وسهلة الاستخدام"}
											{career === "محلل بيانات" &&
												"تحليل البيانات واستخراج رؤى قيّمة للشركات"}
											{career === "متخصص أمن معلومات" &&
												"حماية الأنظمة والشبكات من التهديدات الأمنية"}
											{career === "معلم" &&
												"تعليم وتوجيه الطلاب في مختلف المراحل الدراسية"}
											{career === "مدرب مهني" &&
												"تدريب وتطوير مهارات الموظفين في بيئة العمل"}
											{career === "مستشار تعليمي" &&
												"توجيه الطلاب في اختيار مساراتهم التعليمية والمهنية"}
											{career === "متخصص في تطوير المناهج" &&
												"تصميم وتطوير المناهج التعليمية"}
											{career === "مدير تسويق" &&
												"تخطيط وتنفيذ استراتيجيات التسويق"}
											{career === "متخصص في التسويق الرقمي" &&
												"إدارة الحملات التسويقية عبر الإنترنت"}
											{career === "مدير موارد بشرية" &&
												"إدارة شؤون الموظفين وتطوير المواهب"}
											{career === "مدير مشاريع" &&
												"تخطيط وتنفيذ المشاريع بكفاءة وفعالية"}
											{career === "مصمم جرافيك" &&
												"تصميم المواد البصرية للشركات والمؤسسات"}
											{career === "مصمم داخلي" &&
												"تصميم وتنسيق المساحات الداخلية"}
											{career === "مصور فوتوغرافي" &&
												"التقاط الصور الاحترافية للأحداث والمنتجات"}
											{career === "فنان رقمي" &&
												"إنشاء أعمال فنية باستخدام التقنيات الرقمية"}
										</p>
									</div>
								</div>
							))}
						</div>
						<div className="mt-8 text-center">
							<button
								onClick={resetAssessment}
								className="rounded-xl bg-[#D6453D] px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-[#B84941]"
							>
								إعادة الاختبار
							</button>
						</div>
					</div>
				)}

				<div className="mb-16">
					<h2 className="mb-8 text-center text-3xl font-bold text-white">
						خطوات النجاح المهني
					</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{careerSteps.map((step, index) => (
							<div
								key={index}
								className="overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-transform hover:scale-105"
							>
								<div className="text-right">
									<div className="mb-4 text-4xl">{step.icon}</div>
									<h2 className="mb-2 text-2xl font-semibold text-[#D6453D]">
										{step.title}
									</h2>
									<p className="text-gray-700">{step.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="mt-16">
					<h2 className="mb-8 text-center text-3xl font-bold text-white">
						نصائح مهنية
					</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{careerTips.map((tip, index) => (
							<div
								key={index}
								className="rounded-xl bg-white p-6 text-right shadow-md"
							>
								<div className="mb-4 text-4xl">{tip.icon}</div>
								<h3 className="mb-3 text-xl font-semibold text-[#D6453D]">
									{tip.title}
								</h3>
								<p className="text-gray-700">{tip.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
