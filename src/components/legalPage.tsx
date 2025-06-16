"use client";
import { legalSearchApi } from "@/utils/api";
import { stopSpeech, textToSpeech } from "@/utils/tts";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import {
	FaCheck,
	FaExclamationTriangle,
	FaMicrophone,
	FaPause,
	FaPlay,
	FaRedo,
	FaSearch,
} from "react-icons/fa";
import AmalNavbar from "./amalNavbar";
import SessionSidebar from "./SessionSidebar";

// Add type definitions for Web Speech API
declare global {
	interface Window {
		SpeechRecognition: typeof SpeechRecognition;
		webkitSpeechRecognition: typeof SpeechRecognition;
	}
}

// Speech recognition function
const startVoiceRecognition = async (): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		const recognition = new (window.SpeechRecognition ||
			window.webkitSpeechRecognition)();
		recognition.lang = "ar-SA";

		recognition.start();

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			const transcript = event.results[0][0].transcript;
			resolve(transcript);
		};

		recognition.onerror = (event) => {
			reject(event.error);
		};
	});
};

type SearchResult = {
	id: string;
	question: string;
	answer: string;
	similarity_score: number;
};

type Message = {
	id: string;
	text: string;
	sender: "user" | "bot";
	timestamp: Date;
	answers?: string[];
	isFinalAnswer?: boolean;
	isException?: boolean;
	isSearchResult?: boolean;
	searchResults?: SearchResult[];
	selectedQuestion?: string;
};

const colors = {
	primary: "#14514BFF",
	secondary: "#a2d7d2",
	accent: "#14514BFF",
	text: "#333333",
	lightText: "#FFFFFF",
	playButtonColor: "#14514BFF",
	pauseButtonColor: "#FF4C4C",
};

export default function LegalSupport({
	logoutAction,
	ChatbotExpAction,
	saveQuestionLegalAction,
	saveAnswerLegalAction,
	fetchAllLegalSessionsAction,
	deleteLegalSessionAction,
}: {
	logoutAction: () => Promise<void>;
	ChatbotExpAction: (
		question: string,
		answer: string,
	) => Promise<
		| { question: string; answers: string[] }
		| { field: string; message: string }
		| { answer: string }
		| { answer: string; exception: string }
	>;
	saveQuestionLegalAction: (
		question: string,
		answer: string,
		sessionId: string,
	) => Promise<{ field: string; message: string } | undefined>;
	saveAnswerLegalAction: (
		exception: string | null,
		answer: string,
		sessionId: string,
	) => Promise<{ field: string; message: string } | undefined>;
	fetchAllLegalSessionsAction: () => Promise<
		| { sessions: { sessionId: string; lastQuestion: string }[] }
		| { field: string; message: string }
	>;
	deleteLegalSessionAction: (
		sessionId: string,
	) => Promise<{ success: boolean } | { field: string; message: string }>;
}) {
	const [sessionId, setSessionId] = useState<string>(nanoid());
	const [messages, setMessages] = useState<Message[]>([]);
	const [isBotTyping, setIsBotTyping] = useState(false);
	const [hasFinalAnswer, setHasFinalAnswer] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(
		new Set(),
	);
	const [isPlaying, setIsPlaying] = useState(false);
	const [speechInstance, setSpeechInstance] =
		useState<SpeechSynthesisUtterance | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [activeQuestions, setActiveQuestions] = useState<Set<string>>(
		new Set(),
	);
	const [audioStates, setAudioStates] = useState<Map<string, boolean>>(
		new Map(),
	);
	const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

	useEffect(() => {
		scrollToBottom();
		startConversation();
	}, []);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleAnswerSelection = async (answer: string, questionId: string) => {
		// إذا لم يكن السؤال نشطًا (غير موجود في activeQuestions) نخرج من الدالة
		if (!activeQuestions.has(questionId)) return;

		// إضافة الإجابة المختارة إلى مجموعة الإجابات المحددة
		setSelectedAnswers((prev) => new Set([...prev, answer]));

		// إنشاء رسالة المستخدم
		const userMessage: Message = {
			id: `${questionId}-${Date.now()}`,
			text: answer,
			sender: "user",
			timestamp: new Date(),
		};

		// تحديث حالة الرسائل بإضافة رسالة المستخدم
		setMessages((prev) => [...prev, userMessage]);

		// إزالة السؤال من الأسئلة النشطة
		setActiveQuestions((prev) => {
			const newSet = new Set(prev);
			newSet.delete(questionId);
			return newSet;
		});

		// تفعيل حالة الكتابة للبوت
		setIsBotTyping(true);

		try {
			// البحث عن الرسالة الأصلية (السؤال)
			let originalQuestion = "";

			// البحث في نتائج البحث أولاً
			const searchResult = messages
				.flatMap(
					(msg) =>
						msg.searchResults?.find((res) => res.id === questionId) || [],
				)
				.find(Boolean);

			if (searchResult) {
				originalQuestion = searchResult.question;
			} else {
				// إذا لم يكن من نتائج البحث، نبحث في الرسائل العادية
				const originalMessage = messages.find((m) => m.id === questionId);
				originalQuestion = originalMessage?.text || "";
			}

			// حفظ السؤال والإجابة في السجل
			await saveQuestionLegalAction(originalQuestion, answer, sessionId);

			// الحصول على رد البوت
			const botResponse = await ChatbotExpAction(originalQuestion, answer);

			// معالجة رد البوت حسب نوعه
			if ("answer" in botResponse) {
				// إذا كانت إجابة نهائية
				setHasFinalAnswer(true);
				const botMessage: Message = {
					id: Date.now().toString(),
					text: botResponse.answer,
					sender: "bot",
					timestamp: new Date(),
					isFinalAnswer: true,
				};

				setMessages((prev) => [...prev, botMessage]);

				// حفظ الإجابة النهائية والاستثناء إن وجد
				await saveAnswerLegalAction(
					"exception" in botResponse ? botResponse.exception : null,
					botResponse.answer,
					sessionId,
				);

				// إذا كان هناك استثناء، نضيف رسالة الاستثناء
				if ("exception" in botResponse && botResponse.exception) {
					setMessages((prev) => [
						...prev,
						{
							id: (Date.now() + 1).toString(),
							text: botResponse.exception,
							sender: "bot",
							timestamp: new Date(),
							isException: true,
						},
					]);
				}
			} else if ("question" in botResponse) {
				// إذا كان هناك سؤال متابعة
				const botMessage: Message = {
					id: Date.now().toString(),
					text: botResponse.question,
					sender: "bot",
					timestamp: new Date(),
					answers: botResponse.answers,
				};

				setMessages((prev) => [...prev, botMessage]);
				setActiveQuestions(new Set([botMessage.id])); // تعيين السؤال الجديد كسؤال نشط
			}
		} catch (error) {
			console.error("Error in handleAnswerSelection:", error);

			// في حالة حدوث خطأ، نعرض رسالة خطأ للمستخدم
			const errorMessage: Message = {
				id: Date.now().toString(),
				text: "حدث خطأ أثناء معالجة إجابتك. يرجى المحاولة مرة أخرى.",
				sender: "bot",
				timestamp: new Date(),
				isException: true,
			};

			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			// إيقاف حالة الكتابة للبوت والتأكد من التمرير للأسفل
			setIsBotTyping(false);
			scrollToBottom();
		}
	};

	const processSelectedQuestion = async (question: string, answer: string) => {
		setIsBotTyping(true);

		try {
			// حفظ السؤال والإجابة في السجل
			await saveQuestionLegalAction(question, answer, sessionId);

			// الحصول على رد البوت
			const botResponse = await ChatbotExpAction(question, answer);

			// معالجة رد البوت
			if ("answer" in botResponse) {
				const botMessage: Message = {
					id: Date.now().toString(),
					text: botResponse.answer,
					sender: "bot",
					timestamp: new Date(),
					isFinalAnswer: true,
				};

				setMessages((prev) => [...prev, botMessage]);

				// حفظ الإجابة النهائية
				await saveAnswerLegalAction(
					"exception" in botResponse ? botResponse.exception : null,
					botResponse.answer,
					sessionId,
				);

				if ("exception" in botResponse && botResponse.exception) {
					setMessages((prev) => [
						...prev,
						{
							id: (Date.now() + 1).toString(),
							text: botResponse.exception,
							sender: "bot",
							timestamp: new Date(),
							isException: true,
						},
					]);
				}
			} else if ("question" in botResponse) {
				const botMessage: Message = {
					id: Date.now().toString(),
					text: botResponse.question,
					sender: "bot",
					timestamp: new Date(),
					answers: botResponse.answers,
				};

				setMessages((prev) => [...prev, botMessage]);
				setActiveQuestions(new Set([botMessage.id]));
			}
		} catch (error) {
			console.error("Error processing selected question:", error);
			const errorMessage: Message = {
				id: Date.now().toString(),
				text: "حدث خطأ أثناء معالجة السؤال المختار. يرجى المحاولة مرة أخرى.",
				sender: "bot",
				timestamp: new Date(),
				isException: true,
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsBotTyping(false);
			scrollToBottom();
		}
	};

	const startConversation = async () => {
		setIsBotTyping(true);
		const initialResponse = await ChatbotExpAction("", "");
		setIsBotTyping(false);

		if ("question" in initialResponse) {
			const initialMessage: Message = {
				id: Date.now().toString(),
				text: initialResponse.question,
				sender: "bot",
				timestamp: new Date(),
				answers: initialResponse.answers,
			};

			setMessages([initialMessage]);
			setActiveQuestions(new Set([initialMessage.id]));
		}
	};

	const handleResetConversation = () => {
		const newSessionId = nanoid();
		setSessionId(newSessionId);
		stopSpeech();
		setMessages([]);
		setSelectedAnswers(new Set());
		setSearchQuery("");
		setActiveQuestions(new Set());
		setAudioStates(new Map());
		setActiveAudioId(null);
		startConversation();
	};

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			text: searchQuery,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setIsBotTyping(true);

		try {
			const response = await fetch(legalSearchApi, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: searchQuery,
					top_n: 3,
				}),
			});

			if (!response.ok)
				throw new Error(`HTTP error! status: ${response.status}`);

			const data = await response.json();

			const botMessage: Message = {
				id: Date.now().toString(),
				text: "إليك أهم الأسئلة المشابهة لبحثك:",
				sender: "bot",
				timestamp: new Date(),
				isSearchResult: true,
				searchResults: (data.results || data).map((result: any) => ({
					...result,
					id: nanoid(), // إنشاء معرف فريد لكل نتيجة
				})),
			};

			setMessages((prev) => [...prev, botMessage]);
			setActiveQuestions(new Set([botMessage.id]));
		} catch (error) {
			console.error("Error fetching search results:", error);
			const errorMessage: Message = {
				id: Date.now().toString(),
				text: "عذرًا، حدث خطأ أثناء جلب النتائج. يرجى المحاولة لاحقًا.",
				sender: "bot",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsBotTyping(false);
			scrollToBottom();
		}
	};

	const toggleAudioPlayback = async (audioId: string, text: string) => {
		// إيقاف أي صوت قيد التشغيل حالياً
		if (activeAudioId && activeAudioId !== audioId) {
			stopSpeech();
			setAudioStates((prev) => {
				const newMap = new Map(prev);
				newMap.set(activeAudioId, false);
				return newMap;
			});
		}

		const isCurrentlyPlaying = audioStates.get(audioId) || false;

		if (isCurrentlyPlaying) {
			stopSpeech();
			setAudioStates((prev) => new Map(prev).set(audioId, false));
			setActiveAudioId(null);
		} else {
			setAudioStates((prev) => new Map(prev).set(audioId, true));
			setActiveAudioId(audioId);

			await textToSpeech(text);

			// تحديث حالة التشغيل عند انتهاء الصوت
			setAudioStates((prev) => new Map(prev).set(audioId, false));
			setActiveAudioId(null);
		}
	};

	const toggleRecording = async () => {
		setIsRecording((prev) => !prev);
		if (!isRecording) {
			try {
				const transcript = await startVoiceRecognition();
				setSearchQuery(transcript);
				const lastBotMessage = messages.findLast((m) => m.sender === "bot");
				setIsBotTyping(true);
				const botResponse = await ChatbotExpAction(
					lastBotMessage?.text || "",
					transcript,
				);
				setIsBotTyping(false);
				if ("answer" in botResponse) {
					const botMessage: Message = {
						id: Date.now().toString(),
						text: botResponse.answer,
						sender: "bot",
						timestamp: new Date(),
						isFinalAnswer: true,
					};
					setMessages((prev) => [...prev, botMessage]);
				} else if ("question" in botResponse) {
					const botMessage: Message = {
						id: Date.now().toString(),
						text: botResponse.question,
						sender: "bot",
						timestamp: new Date(),
						answers: botResponse.answers,
					};
					setMessages((prev) => [...prev, botMessage]);
				}
			} catch (err) {
				console.error("Error with voice recognition:", err); //setError
			} finally {
				setIsRecording(false);
			}
		}
	};

	return (
		<div className="flex h-screen flex-col bg-gray-50 pt-24">
			<AmalNavbar
				backgroundColor={"#14514BFF"}
				logoutAction={logoutAction}
				activeSection={"legal"}
			/>
			<SessionSidebar
				fetchSessionsAction={fetchAllLegalSessionsAction}
				deleteSessionAction={deleteLegalSessionAction}
				backgroundColor="blue"
				textColor="blue"
				hoverColor="blue"
				title="السجل القانوني"
				type="legal"
			/>
			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"} transition-all ease-in-out`}
					>
						<div className="w-full max-w-[90%] lg:max-w-[70%]">
							{/* Bot Question (keep existing) */}
							{message.sender === "bot" &&
								!message.isFinalAnswer &&
								!message.isException &&
								!message.isSearchResult && (
									<div className="mb-4 space-y-3 text-right">
										<div className="inline-block max-w-fit transform rounded-xl bg-white p-4 shadow-lg transition-all duration-500 hover:scale-105">
											<div className="flex flex-col items-start gap-1">
												<p className="text-lg font-medium text-[#14514BFF]">
													{message.text}
												</p>
												<button
													onClick={() =>
														toggleAudioPlayback(
															`msg-${message.id}`,
															message.text,
														)
													}
													className={`self-end pt-2 transition-colors duration-300 ${
														audioStates.get(`msg-${message.id}`)
															? `text-${colors.pauseButtonColor}`
															: `text-${colors.playButtonColor}`
													}`}
												>
													{audioStates.get(`msg-${message.id}`) ? (
														<FaPause size={12} />
													) : (
														<FaPlay size={12} />
													)}
												</button>
											</div>
										</div>

										{/* Answer Options */}
										{message.answers && (
											<div className="flex flex-wrap justify-end gap-2">
												{message.answers.map((answer, index) => {
													const isAnswerPlaying =
														activeAudioId === `${message.id}-${index}`;

													return (
														<div
															key={`${message.id}-${index}`}
															className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
																selectedAnswers.has(answer)
																	? "bg-[#14514BFF] text-[#a2d7d2]"
																	: "bg-[#a2d7d2] hover:bg-[#669792]"
															} transition-all duration-300`}
														>
															<button
																onClick={() =>
																	handleAnswerSelection(answer, message.id)
																}
																className="flex-1 text-right"
															>
																{answer}
															</button>

															<button
																onClick={(e) => {
																	e.stopPropagation();
																	toggleAudioPlayback(
																		`${message.id}-${index}`,
																		answer,
																	);
																}}
																className="flex items-center justify-center p-1"
															>
																{audioStates.get(`${message.id}-${index}`) ? (
																	<FaPause size={14} />
																) : (
																	<FaPlay size={14} />
																)}
															</button>
														</div>
													);
												})}
											</div>
										)}
									</div>
								)}

							{/* User Answer */}
							{message.sender === "user" && !message.isSearchResult && (
								<div className="flex justify-start">
									<div className="relative max-w-[80%] transform rounded-xl rounded-bl-none bg-[#a2d7d2] p-3 shadow-sm transition-all duration-300 hover:scale-105">
										<p className="font-medium text-[#14514BFF]">
											{message.text}
											<button
												onClick={() =>
													toggleAudioPlayback(
														`user-${message.id}`,
														message.text,
													)
												}
												className={`pl-3 ${
													audioStates.get(`user-${message.id}`)
														? `text-${colors.pauseButtonColor}`
														: `text-${colors.playButtonColor}`
												} transition-colors duration-300`}
											>
												{audioStates.get(`user-${message.id}`) ? (
													<FaPause size={14} />
												) : (
													<FaPlay size={14} />
												)}
											</button>
										</p>
									</div>
								</div>
							)}

							{message.isSearchResult && (
								<div className="mt-4 w-full rounded-xl border border-[#14514BFF] bg-[#a2d7d2] p-4 text-right">
									<h3 className="mb-3 text-lg font-medium">{message.text}</h3>
									<div className="space-y-3">
										{message.searchResults?.map((result, index) => {
											const isSelected = message.selectedQuestion === result.id;
											const isActive = activeQuestions.has(message.id);

											return (
												<div
													key={result.id}
													className={`rounded-lg border p-3 shadow transition-all ${isSelected ? "border-[#14514BFF] bg-[#a2d7d2]" : "border-transparent bg-white"} ${isActive && !isSelected ? "hover:cursor-pointer hover:border-[#14514BFF] hover:bg-[#a2d7d2]" : ""} ${!isActive && !isSelected ? "opacity-50" : ""} `}
													onClick={() => {
														if (!isActive) return;

														const updatedMessages = messages.map((msg) =>
															msg.id === message.id
																? { ...msg, selectedQuestion: result.id }
																: msg,
														);

														const botMessage: Message = {
															id: `${result.id}-${Date.now()}`,
															text: result.question,
															sender: "bot",
															timestamp: new Date(),
														};

														const userMessage: Message = {
															id: `${result.id}-${Date.now() + 1}`,
															text: result.answer,
															sender: "user",
															timestamp: new Date(),
														};

														setMessages([
															...updatedMessages,
															botMessage,
															userMessage,
														]);

														setActiveQuestions((prev) => {
															const newSet = new Set(prev);
															newSet.delete(message.id);
															return newSet;
														});

														processSelectedQuestion(
															result.question,
															result.answer,
														);
													}}
												>
													<div className="flex items-center justify-between">
														<p
															className={`flex-1 font-medium text-[#14514BFF]`}
														>
															{result.question}
														</p>
														{isSelected && (
															<span className="ml-2 font-bold text-[#14514BFF]">
																✔
															</span>
														)}
													</div>
													<p
														className={`mt-1 ${isSelected ? "text-gray-800" : "text-gray-700"}`}
													>
														{result.answer}
													</p>
													<div
														className={`mt-1 text-sm ${isSelected ? "text-gray-700" : "text-gray-500"}`}
													>
														درجة التطابق:{" "}
														{(result.similarity_score * 100).toFixed(0)}%
													</div>
													<button
														onClick={(e) => {
															e.stopPropagation();
															toggleAudioPlayback(
																`result-${index}`,
																`${result.question} ${result.answer}`,
															);
														}}
														className={`mt-2 text-[#14514BFF]`}
													>
														{audioStates.get(`result-${index}`) ? (
															<FaPause size={14} />
														) : (
															<FaPlay size={14} />
														)}
													</button>
												</div>
											);
										})}
									</div>
									{!activeQuestions.has(message.id) && (
										<p className="mt-2 text-sm text-gray-600">
											تم اختيار إجابة من هذه النتائج بالفعل
										</p>
									)}
								</div>
							)}

							{/* Final Answer */}
							{message.isFinalAnswer && (
								<div className="mt-4 w-full rounded-xl border border-[#14514BFF] bg-[#a2d7d2] p-4 text-right md:w-fit">
									<div className="flex flex-col items-end gap-3 md:flex-row md:items-center md:justify-end">
										{/* النص وعناصر التحكم */}
										<div className="flex w-full items-center justify-end gap-2 md:w-auto">
											<FaCheck className="hidden shrink-0 text-[#14514BFF] md:block" />
											<p className="flex-1 font-medium text-[#14514BFF] md:flex-none">
												{message.text}
											</p>
											<button
												onClick={() =>
													toggleAudioPlayback(
														`final-${message.id}`,
														message.text,
													)
												}
												className="text-[#14514BFF] transition-colors duration-300 hover:text-[#14514BFF]"
											>
												{audioStates.get(`final-${message.id}`) ? (
													<FaPause size={14} />
												) : (
													<FaPlay size={14} />
												)}
											</button>
										</div>

										{/* زر إعادة المحادثة */}
										<button
											onClick={handleResetConversation}
											className="w-full rounded-lg bg-[#14514BFF] px-3 py-2 text-white transition-colors hover:bg-[#14514BFF] md:w-auto"
										>
											<div className="flex items-center justify-center gap-2">
												<FaRedo size={14} />
												<span>إعادة المحادثة</span>
											</div>
										</button>
									</div>
								</div>
							)}

							{/* Exception Message */}
							{message.isException && (
								<div className="mt-4 w-full rounded-xl border border-red-400 bg-red-50 p-4 text-right md:w-fit">
									<div className="flex flex-col items-end gap-3 md:flex-row md:items-center md:justify-end">
										{/* أيقونة ورسالة الخطأ */}
										<div className="flex w-full items-center justify-end gap-2 md:w-auto">
											<FaExclamationTriangle className="hidden shrink-0 text-red-600 md:block" />
											<div className="text-red-600">
												<p className="font-medium">ملاحظة هامة:</p>
												<p>{message.text}</p>
											</div>
											<button
												onClick={() =>
													toggleAudioPlayback(
														`exception-${message.id}`,
														message.text,
													)
												}
												className="text-red-700 transition-colors duration-300 hover:text-red-800"
											>
												{audioStates.get(`exception-${message.id}`) ? (
													<FaPause size={14} />
												) : (
													<FaPlay size={14} />
												)}
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				))}
				{isBotTyping && (
					<div className="flex justify-end">
						<div className="animate-pulse rounded-xl bg-white p-3">
							<div className="flex items-center gap-2 text-gray-500">
								<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
								<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-100" />
								<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-200" />
							</div>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Bottom Action Bar */}
			<div className="w-full border-t border-gray-200 bg-white p-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					{/* Search Bar and Buttons */}
					<div className="flex flex-row items-center gap-2 sm:flex-1 sm:gap-4">
						{/* Search Bar */}
						<div className="relative flex-1">
							<input
								disabled={hasFinalAnswer}
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="...ابحث في الأسئلة"
								className={`w-full rounded-full py-2 pr-12 pl-4 text-right transition-all outline-none ${
									hasFinalAnswer
										? "cursor-not-allowed bg-gray-200 text-gray-400"
										: "bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#14514BFF]"
								}`}
							/>

							<button
								disabled={hasFinalAnswer}
								onClick={handleSearch}
								className={`absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-2 ${
									hasFinalAnswer
										? "cursor-not-allowed text-gray-400"
										: "text-[#14514BFF] hover:text-[#14514BFF]"
								}`}
							>
								<FaSearch size={14} />
							</button>
						</div>
						{/* Voice Record Button */}
						<button
							onClick={toggleRecording}
							disabled={hasFinalAnswer}
							className={`rounded-lg p-3 transition-colors ${
								hasFinalAnswer
									? "cursor-not-allowed bg-gray-200 text-gray-400"
									: isRecording
										? "bg-red-500 text-white"
										: "bg-[#14514BFF] text-white"
							}`}
						>
							<FaMicrophone />
						</button>
						<button
							onClick={handleResetConversation}
							className="w-fit rounded-lg bg-[#14514BFF] px-3 py-2 text-white transition-colors hover:bg-[#14514BFF] md:w-fit"
						>
							<div className="flex items-center justify-center gap-2">
								<FaRedo size={14} />
								<span className="hidden sm:inline">إعادة المحادثة</span>
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
