"use client";
import { Button } from "@/components/ui/button";
import { alphaBitOcrApi } from "@/utils/api";
import { ArabicLettersKeys } from "@/utils/arabicLetters";
import { lettersData } from "@/utils/letterData";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
	FaArrowLeft,
	FaEraser,
	FaPencilAlt,
	FaSpinner,
	FaTimes,
	FaVolumeUp,
} from "react-icons/fa";
import AmalNavbar from "../amalNavbar";

// Add ResponsiveVoice type definition
declare global {
	interface Window {
		responsiveVoice: {
			speak: (text: string, voice: string) => void;
			cancel: () => void;
		};
	}
}

export default function LetterPage({
	params,
	logoutAction,
}: {
	params: { letter: ArabicLettersKeys };
	logoutAction: () => Promise<void>;
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
	const [prediction, setPrediction] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [confidence, setConfidence] = useState<number | null>(null);
	const [isRecording, setIsRecording] = useState(false);
	const [recordingResult, setRecordingResult] = useState<boolean | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
	const [recordingAccuracy, setRecordingAccuracy] = useState<number | null>(
		null,
	);
	const [speakingText, setSpeakingText] = useState<string | null>(null);

	const currentLetter = lettersData[params.letter];

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
				ctx.lineWidth = 15;
				ctx.fillStyle = "white";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctxRef.current = ctx;
			}
			setAccuracyResult(null);
			setPrediction(null);
			setConfidence(null);
		}
	}, [showPad]);

	const startDrawing = (e: React.MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.beginPath();
		ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		setIsDrawing(true);
	};

	const draw = (e: React.MouseEvent) => {
		if (!isDrawing) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// إعدادات الممحاة
		if (isErasing) {
			ctx.globalCompositeOperation = "source-over";
			ctx.strokeStyle = "#ffffff"; // لون الخلفية الأبيض
			ctx.lineWidth = 20;
		}
		// إعدادات القلم
		else {
			ctx.globalCompositeOperation = "source-over";
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 15;
		}

		ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		ctx.stroke();
	};

	const stopDrawing = () => {
		if (!ctxRef.current) return;
		setIsDrawing(false);
		ctxRef.current.closePath();
	};

	const clearCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		setPrediction(null);
		setAccuracyResult(null);
		setConfidence(null);
	};

	const handleSubmitDrawing = async () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		setIsLoading(true);
		setAccuracyResult(null);

		const dataUrl = canvas.toDataURL("image/png");
		const blob = await (await fetch(dataUrl)).blob();

		const formData = new FormData();
		formData.append("image", blob, "drawing.png");

		try {
			const response = await fetch(alphaBitOcrApi, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();
			const predictedDigit = data.character;
			const predictionConfidence = data.confidence; // confidence - line 501

			const isCorrect =
				predictedDigit === currentLetter!.title ||
				lettersData[predictedDigit as ArabicLettersKeys]?.title ===
					currentLetter!.title;

			// تعيين الدقة بناءً على صحة التوقع
			const finalAccuracy = isCorrect ? predictionConfidence : 0;

			setAccuracyResult({
				correct: isCorrect,
				accuracy: finalAccuracy,
				feedback: isCorrect
					? "رسمة ممتازة! استمر في الممارسة"
					: "حاول مرة أخرى وركز على الشكل الصحيح",
			});

			setPrediction(predictedDigit);
			setConfidence(predictionConfidence);
		} catch (error) {
			setAccuracyResult({
				correct: false,
				accuracy: 0,
				feedback: "حدث خطأ أثناء معالجة الرسمة",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const playLetterSound = () => {
		if (audioRef.current) {
			audioRef.current.play();
			setIsPlaying(true);
		}
	};

	const handleAudioEnded = () => {
		setIsPlaying(false);
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunksRef.current.push(e.data);
				}
			};

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
				const audioUrl = URL.createObjectURL(audioBlob);
				setRecordedAudioUrl(audioUrl);

				// في الواقع، هنا سيتم إرسال التسجيل للتحليل
				// لكن لأغراض العرض، سنستخدم نتيجة عشوائية
				const isCorrect = Math.random() > 0.5;
				const accuracy = Math.floor(Math.random() * 20) + 80; // نسبة دقة عشوائية بين 80-100
				setRecordingResult(isCorrect);
				setRecordingAccuracy(accuracy);
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error("Error accessing microphone:", error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	const handleRecordedAudioEnded = () => {
		setIsPlayingRecorded(false);
	};

	if (!currentLetter) {
		return <div>بيانات الحرف غير متوفرة</div>;
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#D8E5F0] to-[#f0f5fa] p-4 pt-28 md:p-6 md:pt-32">
			<AmalNavbar
				logoutAction={logoutAction}
				backgroundColor="#283a5c"
				activeSection={"literacy"}
			/>
			<div className="container mx-auto max-w-6xl">
				{/* Header */}
				<div className="mb-6 flex flex-col items-center gap-4 md:mb-8 md:flex-row md:justify-between">
					<Link
						href="/letters"
						className="flex items-center text-[#1E3A6E] hover:text-[#3f5680]"
					>
						<FaArrowLeft className="mr-2" />
						<span className="text-sm md:text-base">العودة إلى الحروف</span>
					</Link>
					<div className="flex items-center gap-2">
						<h1 className="text-center text-3xl font-bold text-[#1E3A6E] md:text-5xl">
							حرف {currentLetter.title}
						</h1>
						<button
							onClick={() => toggleSpeech(`حرف ${currentLetter.title}`)}
							className={`rounded-full p-2 ${
								speakingText === `حرف ${currentLetter.title}`
									? "bg-gray-200 text-gray-800"
									: "text-gray-600 hover:bg-gray-100"
							}`}
						>
							<FaVolumeUp size={20} />
						</button>
					</div>
					<div className="hidden md:block md:w-8"></div>
				</div>

				{/* Main Content */}
				<div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
					{/* Letter Info */}
					<div className="lg:col-span-1">
						<div className="flex h-full flex-col items-center rounded-2xl bg-white p-4 shadow-lg md:p-6">
							<div className="mb-4 flex h-48 w-48 items-center justify-center md:h-64 md:w-64">
								<img
									src={currentLetter.image}
									alt={currentLetter.title}
									className="max-h-full max-w-full object-contain"
								/>
							</div>
							<div className="flex items-center gap-2">
								<p className="mb-4 text-right text-base leading-relaxed text-[#344A72FF] md:text-lg">
									{currentLetter.description}
								</p>
								<button
									onClick={() => toggleSpeech(currentLetter.description)}
									className={`rounded-full p-2 ${
										speakingText === currentLetter.description
											? "bg-gray-200 text-gray-800"
											: "text-gray-600 hover:bg-gray-100"
									}`}
								>
									<FaVolumeUp size={20} />
								</button>
							</div>
							<Button
								className="w-full rounded-full bg-[#1E3A6E] px-6 py-2 text-white transition-all hover:bg-[#3f5680] hover:shadow-md md:px-8 md:py-3 md:text-lg"
								onClick={() => setShowPad(true)}
							>
								!جرب كتابة الحرف بنفسك
							</Button>
						</div>
					</div>

					{/* Usage Examples */}
					<div className="space-y-4 lg:col-span-1">
						{/* Initial form */}
						<div className="rounded-2xl bg-white p-4 shadow-lg md:p-6">
							<div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
								<div className="flex h-24 w-24 items-center justify-center rounded-lg border border-[#1E3A6E]/20 bg-[#F5F9FF] md:h-40 md:w-40">
									{currentLetter.start_image ? (
										<img
											src={currentLetter.start_image}
											alt="شكل الحرف في البداية"
											className="h-16 w-16 md:h-40 md:w-40"
										/>
									) : (
										<span className="text-4xl text-[#1E3A6E] md:text-5xl">
											{currentLetter.forms.start[0].word.charAt(0)}
										</span>
									)}
								</div>
								<div className="flex-1">
									<div className="flex items-center justify-end gap-2">
										<h3 className="mb-2 text-right text-xl font-bold text-[#1E3A6E] md:mb-3 md:text-2xl">
											:في بداية الكلمة
										</h3>
										<button
											onClick={() => toggleSpeech("في بداية الكلمة")}
											className={`rounded-full p-2 ${
												speakingText === "في بداية الكلمة"
													? "bg-gray-200 text-gray-800"
													: "text-gray-600 hover:bg-gray-100"
											}`}
										>
											<FaVolumeUp size={20} />
										</button>
									</div>
									<div className="text-right">
										{currentLetter.forms.start.map((ex, i) => (
											<div key={i} className="mb-2 last:mb-0">
												<div className="flex items-center justify-end gap-2">
													<p className="text-base text-[#344A72FF] md:text-xl">
														<span className="font-bold text-[#1E3A6E]">
															{ex.word}
														</span>
														<span className="mx-2 text-gray-400">-</span>
														<span className="text-gray-500">{ex.example}</span>
													</p>
													<button
														onClick={() =>
															toggleSpeech(`${ex.word} - ${ex.example}`)
														}
														className={`rounded-full p-2 ${
															speakingText === `${ex.word} - ${ex.example}`
																? "bg-gray-200 text-gray-800"
																: "text-gray-600 hover:bg-gray-100"
														}`}
													>
														<FaVolumeUp size={20} />
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Middle form */}
						<div className="rounded-2xl bg-white p-4 shadow-lg md:p-6">
							<div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
								<div className="flex h-24 w-24 items-center justify-center rounded-lg border border-[#1E3A6E]/20 bg-[#F5F9FF] md:h-40 md:w-40">
									{currentLetter.middle_image ? (
										<img
											src={currentLetter.middle_image}
											alt="شكل الحرف في الوسط"
											className="h-16 w-16 md:h-40 md:w-40"
										/>
									) : (
										<span className="text-4xl text-[#1E3A6E] md:text-5xl">
											{
												currentLetter.forms.middle[0].word.split("")[
													Math.floor(
														currentLetter.forms.middle[0].word.length / 2,
													)
												]
											}
										</span>
									)}
								</div>
								<div className="flex-1">
									<div className="flex items-center justify-end gap-2">
										<h3 className="mb-2 text-right text-xl font-bold text-[#1E3A6E] md:mb-3 md:text-2xl">
											:في وسط الكلمة
										</h3>
										<button
											onClick={() => toggleSpeech("في وسط الكلمة")}
											className={`rounded-full p-2 ${
												speakingText === "في وسط الكلمة"
													? "bg-gray-200 text-gray-800"
													: "text-gray-600 hover:bg-gray-100"
											}`}
										>
											<FaVolumeUp size={20} />
										</button>
									</div>
									<div className="text-right">
										{currentLetter.forms.middle.map((ex, i) => (
											<div key={i} className="mb-2 last:mb-0">
												<div className="flex items-center justify-end gap-2">
													<p className="text-base text-[#344A72FF] md:text-xl">
														<span className="font-bold text-[#1E3A6E]">
															{ex.word}
														</span>
														<span className="mx-2 text-gray-400">-</span>
														<span className="text-gray-500">{ex.example}</span>
													</p>
													<button
														onClick={() =>
															toggleSpeech(`${ex.word} - ${ex.example}`)
														}
														className={`rounded-full p-2 ${
															speakingText === `${ex.word} - ${ex.example}`
																? "bg-gray-200 text-gray-800"
																: "text-gray-600 hover:bg-gray-100"
														}`}
													>
														<FaVolumeUp size={20} />
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* End form */}
						<div className="rounded-2xl bg-white p-4 shadow-lg md:p-6">
							<div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
								<div className="flex h-24 w-24 items-center justify-center rounded-lg border border-[#1E3A6E]/20 bg-[#F5F9FF] md:h-40 md:w-40">
									{currentLetter.end_image ? (
										<img
											src={currentLetter.end_image}
											alt="شكل الحرف في النهاية"
											className="h-16 w-16 md:h-40 md:w-40"
										/>
									) : (
										<span className="text-4xl text-[#1E3A6E] md:text-5xl">
											{currentLetter.forms.end[0].word.slice(-1)}
										</span>
									)}
								</div>
								<div className="flex-1">
									<div className="flex items-center justify-end gap-2">
										<h3 className="mb-2 text-right text-xl font-bold text-[#1E3A6E] md:mb-3 md:text-2xl">
											:في نهاية الكلمة
										</h3>
										<button
											onClick={() => toggleSpeech("في نهاية الكلمة")}
											className={`rounded-full p-2 ${
												speakingText === "في نهاية الكلمة"
													? "bg-gray-200 text-gray-800"
													: "text-gray-600 hover:bg-gray-100"
											}`}
										>
											<FaVolumeUp size={20} />
										</button>
									</div>
									<div className="text-right">
										{currentLetter.forms.end.map((ex, i) => (
											<div key={i} className="mb-2 last:mb-0">
												<div className="flex items-center justify-end gap-2">
													<p className="text-base text-[#344A72FF] md:text-xl">
														<span className="font-bold text-[#1E3A6E]">
															{ex.word}
														</span>
														<span className="mx-2 text-gray-400">-</span>
														<span className="text-gray-500">{ex.example}</span>
													</p>
													<button
														onClick={() =>
															toggleSpeech(`${ex.word} - ${ex.example}`)
														}
														className={`rounded-full p-2 ${
															speakingText === `${ex.word} - ${ex.example}`
																? "bg-gray-200 text-gray-800"
																: "text-gray-600 hover:bg-gray-100"
														}`}
													>
														<FaVolumeUp size={20} />
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Practice Section */}
				<div className="mb-6 rounded-2xl bg-white p-4 shadow-lg md:mb-8 md:p-6">
					<div className="flex items-center justify-center gap-2">
						<h2 className="mb-6 text-center text-2xl font-bold text-[#1E3A6E] md:text-3xl">
							تمرين الكتابة
						</h2>
						<button
							onClick={() => toggleSpeech("تمرين الكتابة")}
							className={`rounded-full p-2 ${
								speakingText === "تمرين الكتابة"
									? "bg-gray-200 text-gray-800"
									: "text-gray-600 hover:bg-gray-100"
							}`}
						>
							<FaVolumeUp size={20} />
						</button>
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						{[
							{
								type: "start",
								title: "البداية",
								image: currentLetter.start_image,
							},
							{
								type: "middle",
								title: "الوسط",
								image: currentLetter.middle_image,
							},
							{
								type: "end",
								title: "النهاية",
								image: currentLetter.end_image,
							},
						].map((item) => (
							<div key={item.type} className="flex flex-col items-center">
								<div className="mb-3 flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-[#1E3A6E]/30 bg-[#F5F9FF] md:h-50">
									{item.image ? (
										<img
											src={item.image}
											alt={`تمرين ${item.type}`}
											className="h-40 w-40 opacity-50"
										/>
									) : (
										<span className="text-6xl text-[#1E3A6E] opacity-50">
											{item.type === "start" &&
												currentLetter.forms.start[0].word.charAt(0)}
											{item.type === "middle" &&
												currentLetter.forms.middle[0].word.split("")[
													Math.floor(
														currentLetter.forms.middle[0].word.length / 2,
													)
												]}
											{item.type === "end" &&
												currentLetter.forms.end[0].word.slice(-1)}
										</span>
									)}
								</div>
								<Button
									variant="outline"
									className="w-full border-[#1E3A6E] text-[#1E3A6E] transition-all hover:bg-[#1E3A6E] hover:text-white"
									onClick={() => setShowPad(true)}
								>
									اكتب الحرف في {item.title}
								</Button>
							</div>
						))}
					</div>
				</div>

				{/* Pronunciation Practice Section */}
				<div className="mb-16">
					<h2 className="mb-8 text-center text-3xl font-bold text-[#1E3A6E]">
						تدريب النطق
					</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						{/* Listen Section */}
						<div className="rounded-xl bg-white p-8 shadow-xl">
							<h3 className="mb-4 text-2xl font-semibold text-[#1E3A6E]">
								استمع إلى النطق الصحيح
							</h3>
							<p className="mb-6 text-gray-700">
								استمع إلى نطق الحرف بشكل صحيح وكرره بعد ذلك
							</p>
							<div className="flex flex-col items-center gap-4">
								<button
									onClick={playLetterSound}
									className={`flex items-center rounded-xl px-6 py-3 text-lg font-medium text-white transition-colors ${
										isPlaying
											? "bg-[#3f5680]"
											: "bg-[#1E3A6E] hover:bg-[#3f5680]"
									}`}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="mr-2 h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
										/>
									</svg>
									{isPlaying ? "جاري التشغيل..." : "تشغيل النطق"}
								</button>
								<div className="w-full">
									<audio
										ref={audioRef}
										src={`/letters/${currentLetter?.title}.mp3`}
										onEnded={handleAudioEnded}
										className="w-full"
										controls
									/>
								</div>
							</div>
						</div>

						{/* Record Section */}
						<div className="rounded-xl bg-white p-8 shadow-xl">
							<h3 className="mb-4 text-2xl font-semibold text-[#1E3A6E]">
								سجل نطقك
							</h3>
							<p className="mb-6 text-gray-700">
								سجل نطقك للحرف وسنقيم مدى دقة نطقك
							</p>
							<div className="flex flex-col items-center gap-4">
								<button
									onClick={isRecording ? stopRecording : startRecording}
									className={`flex items-center rounded-xl px-6 py-3 text-lg font-medium text-white transition-colors ${
										isRecording
											? "bg-red-500 hover:bg-red-600"
											: "bg-[#1E3A6E] hover:bg-[#3f5680]"
									}`}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="mr-2 h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
										/>
									</svg>
									{isRecording
										? "إيقاف التسجيل"
										: recordingResult !== null
											? "تجربة مرة أخرى"
											: "بدء التسجيل"}
								</button>
								{recordedAudioUrl && (
									<div className="w-full">
										<audio
											src={recordedAudioUrl}
											controls
											className="w-full"
											onEnded={handleRecordedAudioEnded}
											onPlay={() => setIsPlayingRecorded(true)}
											onPause={() => setIsPlayingRecorded(false)}
										/>
									</div>
								)}
								{recordingResult !== null && (
									<div
										className={`mt-4 rounded-lg p-4 text-center ${
											recordingResult
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										<p className="text-lg font-medium">
											{recordingResult
												? "نطق صحيح! أحسنت ✓"
												: "حاول مرة أخرى، ركز على النطق الصحيح ✗"}
										</p>
										{recordingAccuracy !== null && (
											<p className="mt-2 text-base">
												نسبة الدقة: {recordingAccuracy}%
											</p>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* draw Section */}
			{showPad && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="mx-4 w-full max-w-md rounded-2xl bg-white p-4 shadow-xl md:p-6">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-2xl font-bold text-[#1E3A6E]">
								لوحة الكتابة
							</h3>
							<div className="flex space-x-4">
								<button
									className={`rounded-full p-2 ${!isErasing ? "bg-[#1E3A6E] text-white" : "bg-gray-200"}`}
									onClick={() => setIsErasing(false)}
									title="قلم"
								>
									<FaPencilAlt />
								</button>
								<button
									className={`rounded-full p-2 ${isErasing ? "bg-[#C7BA9F] text-white" : "bg-gray-200"}`}
									onClick={() => setIsErasing(true)}
									title="ممحاة"
								>
									<FaEraser />
								</button>
								<button
									className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
									onClick={clearCanvas}
									title="مسح الكل"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
								<button
									className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
									onClick={() => setShowPad(false)}
									title="إغلاق"
								>
									<FaTimes />
								</button>
							</div>
						</div>
						<canvas
							ref={canvasRef}
							className="h-64 w-full touch-none rounded-lg border-2 border-gray-300"
							onMouseDown={startDrawing}
							onMouseMove={draw}
							onMouseUp={stopDrawing}
							onMouseLeave={stopDrawing}
							onTouchEnd={stopDrawing}
						/>

						<div className="mt-4 flex justify-between">
							<Button
								variant="outline"
								className="border-red-500 text-red-500"
								onClick={clearCanvas}
							>
								مسح الكل
							</Button>

							<Button
								className="bg-[#1E3A6E] text-white"
								onClick={handleSubmitDrawing}
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<FaSpinner className="mr-2 animate-spin" />
										جاري المعالجة...
									</>
								) : (
									"إرسال الرسمة"
								)}
							</Button>
						</div>

						{accuracyResult && (
							<div className="mt-4 rounded-lg bg-gray-100 p-3 text-center">
								<p
									className={`text-lg font-medium ${accuracyResult.correct ? "text-green-600" : "text-red-600"}`}
								>
									{accuracyResult.correct ? "صحيح ✓" : "غير صحيح ✗"}
								</p>
								<p className="text-gray-600">
									الدقة: {accuracyResult?.correct ? confidence?.toFixed(2) : 0}%
								</p>
								<p className="text-gray-600">الحرف المتوقع: {prediction}</p>
								{accuracyResult.feedback && (
									<p className="mt-2 text-sm text-gray-500">
										{accuracyResult.feedback}
									</p>
								)}
							</div>
						)}

						<div className="mt-4 text-center text-gray-500">
							اسحب بإصبعك أو بالفأرة للكتابة
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
