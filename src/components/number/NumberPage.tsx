// components/numbers/NumberPage.tsx
"use client";
import { Button } from "@/components/ui/button";
import { ArabicNumeralsKeys } from "@/utils/arabicNumerals";
import { numbersData } from "@/utils/numbersData";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import AmalNavbar from "../amalNavbar";

export default function NumberPage({
	params,
}: {
	params: { number: ArabicNumeralsKeys };
}) {
	const [showPad, setShowPad] = useState(false);
	const [isErasing, setIsErasing] = useState(false);
	const [accuracyResult, setAccuracyResult] = useState<{
		correct: boolean;
		accuracy: number;
		feedback?: string;
	} | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const [isDrawing, setIsDrawing] = useState(false);

	const currentNumber = numbersData[params.number];

	useEffect(() => {
		if (showPad && canvasRef.current) {
			const canvas = canvasRef.current;
			canvas.width = canvas.offsetWidth * 2;
			canvas.height = canvas.offsetHeight * 2;
			const ctx = canvas.getContext("2d");

			if (ctx) {
				ctx.scale(2, 2);
				ctx.lineCap = "round";
				ctx.lineJoin = "round";
				ctx.strokeStyle = "#1E3A6E";
				ctx.lineWidth = 3;
				ctx.fillStyle = "white";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctxRef.current = ctx;
			}
			setAccuracyResult(null);
		}
	}, [showPad]);

	// وظائف الرسم (نفس تلك المستخدمة في صفحة الحروف)
	const startDrawing = (e: React.MouseEvent) => {
		/*...*/
	};
	const draw = (e: React.MouseEvent) => {
		/*...*/
	};
	const stopDrawing = () => {
		/*...*/
	};
	const clearCanvas = () => {
		/*...*/
	};

	const handleSubmitDrawing = () => {
		const randomAccuracy = Math.floor(Math.random() * 30) + 70;
		const isCorrect = randomAccuracy > 80;

		setAccuracyResult({
			correct: isCorrect,
			accuracy: randomAccuracy,
			feedback: isCorrect
				? "رسمة ممتازة! استمر في الممارسة"
				: "حاول مرة أخرى وركز على الشكل الصحيح",
		});
	};

	if (!currentNumber) {
		return <div>بيانات الرقم غير متوفرة</div>;
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#D8E5F0] to-[#f0f5fa] p-4 pt-28 md:p-6 md:pt-32">
			<AmalNavbar backgroundColor="#1E3A6E" activeSection={"literacy"} />
			<div className="container mx-auto max-w-6xl">
				{/* Header */}
				<div className="mb-6 flex flex-col items-center gap-4 md:mb-8 md:flex-row md:justify-between">
					<Link
						href="/numbers"
						className="flex items-center text-[#1E3A6E] hover:text-[#3f5680]"
					>
						<FaArrowLeft className="mr-2" />
						<span className="text-sm md:text-base">العودة إلى الأرقام</span>
					</Link>
					<h1 className="text-center text-3xl font-bold text-[#1E3A6E] md:text-5xl">
						رقم {currentNumber.title}
					</h1>
					<div className="hidden md:block md:w-8"></div>
				</div>

				{/* Main Content */}
				<div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
					{/* Number Info */}
					<div className="lg:col-span-1">
						<div className="flex h-full flex-col items-center rounded-2xl bg-white p-4 shadow-lg md:p-6">
							<div className="mb-4 flex h-48 w-48 items-center justify-center md:h-64 md:w-64">
								<span className="text-9xl text-[#1E3A6E]">
									{currentNumber.numeral}
								</span>
							</div>
							<p className="mb-4 text-right text-base leading-relaxed text-[#344A72FF] md:text-lg">
								{currentNumber.description}
							</p>
							<Button
								className="w-full rounded-full bg-[#1E3A6E] px-6 py-2 text-white transition-all hover:bg-[#3f5680] hover:shadow-md md:px-8 md:py-3 md:text-lg"
								onClick={() => setShowPad(true)}
							>
								جرب كتابة الرقم بنفسك!
							</Button>
						</div>
					</div>

					{/* Usage Examples */}
					<div className="space-y-4 lg:col-span-1">
						<div className="rounded-2xl bg-white p-4 shadow-lg md:p-6">
							<h3 className="mb-4 text-right text-xl font-bold text-[#1E3A6E] md:text-2xl">
								أمثلة استخدام
							</h3>
							<div className="space-y-3">
								{currentNumber.examples.map((ex, i) => (
									<div key={i} className="rounded-lg bg-[#F5F9FF] p-3">
										<p className="text-right text-lg text-[#344A72FF]">
											<span className="font-bold">{ex.value}</span>
											<span className="mx-2 text-gray-400">-</span>
											<span className="text-gray-600">{ex.context}</span>
										</p>
									</div>
								))}
							</div>
						</div>

						{/* Mathematical Representation */}
						<div className="rounded-2xl bg-white p-4 shadow-lg md:p-6">
							<h3 className="mb-4 text-right text-xl font-bold text-[#1E3A6E] md:text-2xl">
								تمثيل رياضي
							</h3>
							<div className="flex flex-wrap justify-center gap-4">
								<div className="flex items-center justify-center rounded-lg bg-[#F5F9FF] p-4">
									<span className="text-2xl">
										العربية: {currentNumber.numeral}
									</span>
								</div>
								<div className="flex items-center justify-center rounded-lg bg-[#F5F9FF] p-4">
									<span className="text-2xl">
										الإنجليزية: {currentNumber.english}
									</span>
								</div>
								<div className="flex items-center justify-center rounded-lg bg-[#F5F9FF] p-4">
									<span className="text-2xl">
										القيمة: {currentNumber.value}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Practice Section */}
				<div className="mb-6 rounded-2xl bg-white p-4 shadow-lg md:mb-8 md:p-6">
					<h2 className="mb-6 text-center text-2xl font-bold text-[#1E3A6E] md:text-3xl">
						تمرين الكتابة
					</h2>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
						{[1, 2, 3].map((size) => (
							<div key={size} className="flex flex-col items-center">
								<div className="mb-3 flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-[#1E3A6E]/30 bg-[#F5F9FF] md:h-48">
									<span
										className={`text-${size * 4}xl text-[#1E3A6E] opacity-50`}
									>
										{currentNumber.numeral}
									</span>
								</div>
								<Button
									variant="outline"
									className="w-full border-[#1E3A6E] text-[#1E3A6E] transition-all hover:bg-[#1E3A6E] hover:text-white"
									onClick={() => setShowPad(true)}
								>
									اكتب الرقم بحجم {size}
								</Button>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Drawing Pad Modal (نفس المكون المستخدم في الحروف) */}
			{showPad && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					{/* ... نفس محتوى لوحة الرسم ... */}
				</div>
			)}
		</div>
	);
}
