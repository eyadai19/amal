"use client";
import { Career, CareerQuestion } from "@/lib/ServerAction/careerExp";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import AmalNavbar from "./amalNavbar";

type CareerResult = {
	bestCareer: {
		id: string;
		name: string;
	};
	allScores: Record<string, number>;
};

type CareerSection = {
	id: string;
	name: string;
	icon: string;
};

type CareerStep = {
	title: string;
	description: string;
	icon: string;
};

type CareerTip = {
	title: string;
	description: string;
	icon: string;
};

export default function CareerPage({
	logoutAction,
	getSectionQuestionsAction,
	processCareerAnswersAction,
	collectCvTextsAction,
	hasCvAction,
}: {
	logoutAction: () => Promise<void>;
	getSectionQuestionsAction: (sectionId: string) => Promise<CareerQuestion[]>;
	processCareerAnswersAction: (
		sectionId: string,
		answers: { questionId: string; answer: boolean }[],
	) => Promise<{ bestCareer: Career; allScores: Record<string, number> }>;
	collectCvTextsAction: (
		sectionId: string,
		questionIds: string[],
	) => Promise<{ success: boolean; message: string }>;
	hasCvAction: () => Promise<{
		hasCv: boolean;
	}>;
}) {
	const [currentStep, setCurrentStep] = useState<
		"sections" | "questions" | "result"
	>("sections");
	const [selectedSection, setSelectedSection] = useState<string>("");
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [questions, setQuestions] = useState<CareerQuestion[]>([]);
	const [answers, setAnswers] = useState<
		{ questionId: string; answer: boolean }[]
	>([]);
	const [result, setResult] = useState<CareerResult | null>(null);
	const [showExperiencesModal, setShowExperiencesModal] = useState(false);
	const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
	const [yesAnswers, setYesAnswers] = useState<CareerQuestion[]>([]);
	const [isAddingToCV, setIsAddingToCV] = useState(false);
	const [hasCv, setHasCv] = useState(false);

	useEffect(() => {
		const checkCv = async () => {
			try {
				const result = await hasCvAction();
				setHasCv(result.hasCv);
			} catch (error) {
				console.error("Error checking CV:", error);
			}
		};
		checkCv();
	}, [hasCvAction]);

	const careerSteps: CareerStep[] = [
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

	const careerTips: CareerTip[] = [
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

	const sections: CareerSection[] = [
		{
			id: "1",
			name: "الزراعة والعمل البيئي",
			icon: "🌱",
		},
		{
			id: "2",
			name: "الإدارة والمحاسبة",
			icon: "📊",
		},
		{
			id: "3",
			name: "الاعمال الفنية والابداعية",
			icon: "🎨",
		},
		{
			id: "4",
			name: "الخدمات والتعامل مع الناس",
			icon: "💬",
		},
		{
			id: "5",
			name: "العمل اليدوي والميكانيكي",
			icon: "🔧",
		},
		{
			id: "6",
			name: "الحرف والصناعات التقليدية",
			icon: "⚒️",
		},
		{
			id: "7",
			name: "العمل المكتبي",
			icon: "💼",
		},
		{
			id: "8",
			name: "التعليم والتدريب",
			icon: "📚",
		},
	];

	const handleSectionSelect = async (sectionId: string) => {
		setSelectedSection(sectionId);
		try {
			const sectionQuestions = await getSectionQuestionsAction(sectionId);
			setQuestions(sectionQuestions);
			setCurrentStep("questions");
		} catch (error) {
			console.error("Error fetching questions:", error);
		}
	};

	const handleAnswer = async (answer: boolean) => {
		const newAnswers = [
			...answers,
			{ questionId: questions[currentQuestion].id, answer },
		];
		setAnswers(newAnswers);

		if (answer) {
			setYesAnswers((prev) => [...prev, questions[currentQuestion]]);
		}

		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1);
		} else {
			try {
				const result = await processCareerAnswersAction(
					selectedSection,
					newAnswers,
				);
				setResult(result);
				setCurrentStep("result");
			} catch (error) {
				console.error("Error processing answers:", error);
			}
		}
	};

	const handleAddToCV = async () => {
		try {
			setIsAddingToCV(true);
			const result = await collectCvTextsAction(
				selectedSection,
				selectedExperiences,
			);
			if (result.success) {
				setShowExperiencesModal(false);
			} else {
				alert(result.message);
			}
		} catch (error) {
			console.error("Error adding experiences to CV:", error);
			alert("حدث خطأ أثناء إضافة الخبرات إلى السيرة الذاتية");
		} finally {
			setIsAddingToCV(false);
		}
	};

	const toggleExperience = (questionId: string) => {
		setSelectedExperiences((prev) =>
			prev.includes(questionId)
				? prev.filter((id) => id !== questionId)
				: [...prev, questionId],
		);
	};

	const selectAllExperiences = () => {
		setSelectedExperiences(yesAnswers.map((q) => q.id));
	};

	const deselectAllExperiences = () => {
		setSelectedExperiences([]);
	};

	const resetAssessment = () => {
		setCurrentStep("sections");
		setSelectedSection("");
		setCurrentQuestion(0);
		setQuestions([]);
		setAnswers([]);
		setResult(null);
	};

	return (
		<div className="min-h-screen bg-[#fbdcdc82]">
			<AmalNavbar
				logoutAction={logoutAction}
				backgroundColor="#7D1B14FF"
				activeSection={"career"}
			/>
			<div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
				<div className="text-center">
					<h1 className="mb-4 text-4xl font-bold text-gray-800">
						دليلك المهني
					</h1>
					<p className="mb-12 text-xl text-gray-600">
						اكتشف مسارك المهني وتطور في حياتك العملية مع دليلنا الشامل
					</p>
				</div>

				<div className="mb-16 rounded-2xl bg-white p-8 shadow-xl">
					{currentStep === "sections" && (
						<>
							<div className="mb-8 flex justify-end">
								<h2 className="text-3xl font-bold text-gray-800">
									اختر القسم المناسب لك
								</h2>
							</div>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{sections.map((section) => (
									<button
										key={section.id}
										onClick={() => handleSectionSelect(section.id)}
										className="flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-6 transition-all hover:bg-[#ffd4d482]"
									>
										<span className="mr-4 text-3xl">{section.icon}</span>
										<span className="text-xl text-gray-700">
											{section.name}
										</span>
									</button>
								))}
							</div>
						</>
					)}

					{currentStep === "questions" && (
						<>
							<div className="mb-8 flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<div className="h-2 w-24 rounded-full bg-gray-200">
										<div
											className="h-full rounded-full bg-[#7D1B14FF] transition-all duration-300"
											style={{
												width: `${((currentQuestion + 1) / questions.length) * 100}%`,
											}}
										/>
									</div>
									<span className="text-sm font-medium text-gray-600">
										{currentQuestion + 1}/{questions.length}
									</span>
								</div>
								<h2 className="text-3xl font-bold text-gray-800">
									اختبار المهارات المهنية
								</h2>
							</div>
							<div className="mb-8">
								<div className="mb-6 flex justify-end">
									<p className="text-2xl font-semibold text-gray-800">
										{questions[currentQuestion].text}
									</p>
								</div>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<button
										onClick={() => handleAnswer(true)}
										className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 text-center text-lg text-gray-700 transition-all hover:bg-[#ffd4d482]"
									>
										نعم
									</button>
									<button
										onClick={() => handleAnswer(false)}
										className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 text-center text-lg text-gray-700 transition-all hover:bg-[#ffd4d482]"
									>
										لا
									</button>
								</div>
							</div>
						</>
					)}

					{currentStep === "result" && result && (
						<>
							<div className="mb-4 flex justify-end">
								<h2 className="text-3xl font-bold text-gray-800">
									توصيات مسارك المهني
								</h2>
							</div>
							<div className="mb-8 flex justify-end">
								<p className="text-lg text-gray-600">
									بناءً على إجاباتك، المهنة الأنسب لك هي:
								</p>
							</div>
							<div className="mb-8 flex justify-center">
								<div className="rounded-lg bg-[#ffd4d482] p-6 text-center">
									<h3 className="text-2xl font-bold text-gray-800">
										{result.bestCareer.name}
									</h3>
								</div>
							</div>
							<div className="mt-8 flex flex-col items-end space-y-4 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-4">
								<button
									onClick={resetAssessment}
									className="w-full rounded-lg bg-[#972820FF] px-6 py-2 text-white hover:bg-red-600 sm:w-auto"
								>
									إعادة الاختبار
								</button>
								{hasCv && (
									<button
										onClick={() => setShowExperiencesModal(true)}
										className="w-full rounded-lg bg-[#972820FF] px-6 py-2 text-white hover:bg-red-600 sm:w-auto"
									>
										إضافة خبراتك إلى السيرة الذاتية
									</button>
								)}
								<button
									onClick={() => {
										window.location.href = "/cvbuilder";
									}}
									className="w-full rounded-lg border border-[#972820FF] bg-white px-6 py-2 text-[#972820FF] transition-all hover:bg-[#ffd4d482] sm:w-auto"
								>
									انشئ السيرة الذاتية خاصتك
								</button>
							</div>
						</>
					)}
				</div>
				{/* قسم السيرة الذاتية بالذكاء الاصطناعي */}
				<div className="mb-16 text-center">
					<h2 className="mb-8 text-3xl font-bold text-gray-800">
						أنشئ سيرتك الذاتية بمساعدة الذكاء الاصطناعي
					</h2>
					<div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
						<div className="mb-6 flex justify-center">
							<span className="text-5xl">🤖</span>
						</div>
						<h3 className="mb-4 text-2xl font-semibold text-gray-800">
							سيرة ذاتية احترافية في دقائق
						</h3>
						<p className="mb-8 text-lg text-gray-600">
							استخدم قوة الذكاء الاصطناعي لإنشاء سيرة ذاتية احترافية تبرز
							مهاراتك وخبراتك بشكل مثالي
						</p>
						<button
							onClick={() => {
								window.location.href = "/cvbuilder";
							}}
							className="rounded-lg bg-[#E85C54] px-8 py-3 text-lg font-medium text-white transition-all hover:bg-[#d44c44]"
						>
							ابدأ الآن
						</button>
					</div>
				</div>

				<div className="mb-16 text-center">
					<h2 className="mb-8 text-3xl font-bold text-gray-800">
						خطواتك التالية
					</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{careerSteps.map((step, index) => (
							<div
								key={index}
								className="group relative flex flex-col items-center justify-center rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl"
							>
								<span className="text-4xl">{step.icon}</span>
								<h3 className="mt-4 text-xl font-semibold text-gray-800">
									{step.title}
								</h3>
								<p className="mt-2 text-gray-600">{step.description}</p>
							</div>
						))}
					</div>
				</div>

				<div className="mb-16 text-center">
					<h2 className="mb-8 text-3xl font-bold text-gray-800">
						نصائح إضافية
					</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{careerTips.map((tip, index) => (
							<div
								key={index}
								className="group relative flex flex-col items-center justify-center rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl"
							>
								<span className="text-4xl">{tip.icon}</span>
								<h3 className="mt-4 text-xl font-semibold text-gray-800">
									{tip.title}
								</h3>
								<p className="mt-2 text-gray-600">{tip.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Modal for selecting experiences */}
			{showExperiencesModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div
						className="fixed inset-0 bg-black/50"
						onClick={() => setShowExperiencesModal(false)}
					/>
					<div className="relative z-50 w-full max-w-2xl rounded-lg bg-white p-6">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-2xl font-bold text-gray-800">
								اختر الخبرات لإضافتها إلى السيرة الذاتية
							</h3>
							<button
								onClick={() => setShowExperiencesModal(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								<X size={24} />
							</button>
						</div>
						<div className="mb-4 flex justify-end space-x-2">
							<button
								onClick={selectAllExperiences}
								className="rounded-lg bg-[#972820FF] px-4 py-2 text-sm text-white hover:bg-red-600"
							>
								تحديد الكل
							</button>
							<button
								onClick={deselectAllExperiences}
								className="rounded-lg border border-[#972820FF] px-4 py-2 text-sm text-[#972820FF] hover:bg-[#ffd4d482]"
							>
								إلغاء التحديد
							</button>
						</div>
						<div className="mb-4 max-h-96 overflow-y-auto">
							{yesAnswers.map((question) => (
								<div
									key={question.id}
									className="mb-2 flex items-center justify-end space-x-2 rounded-lg border border-gray-200 p-3"
								>
									<input
										type="checkbox"
										checked={selectedExperiences.includes(question.id)}
										onChange={() => toggleExperience(question.id)}
										className="h-5 w-5 rounded border-gray-300 text-[#972820FF] focus:ring-[#972820FF]"
									/>
									<span className="text-gray-700">{question.text}</span>
								</div>
							))}
						</div>
						<div className="flex justify-end space-x-2">
							<button
								onClick={() => setShowExperiencesModal(false)}
								className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
								disabled={isAddingToCV}
							>
								إلغاء
							</button>
							<button
								onClick={handleAddToCV}
								className="flex items-center rounded-lg bg-[#972820FF] px-6 py-2 text-white hover:bg-red-600 disabled:opacity-50"
								disabled={isAddingToCV}
							>
								{isAddingToCV ? (
									<>
										<Loader2 className="ml-2 h-5 w-5 animate-spin" />
										جاري الإضافة...
									</>
								) : (
									"إضافة إلى السيرة الذاتية"
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
