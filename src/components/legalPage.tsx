"use client";

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

// Speech recognition function
const startVoiceRecognition = async (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "ar-SA";

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event) => {
      reject(event.error);
    };
  });
};

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  answers?: string[];
  isFinalAnswer?: boolean;
  isException?: boolean;
  // Add new type for search results
  isSearchResult?: boolean;
  searchResults?: {
    question: string;
    answer: string;
    score: number;
  }[];
};

const colors = {
  primary: "#D78448",
  secondary: "#FFCB99",
  accent: "#D78448",
  text: "#333333",
  lightText: "#FFFFFF",
  playButtonColor: "#D78448",
  pauseButtonColor: "#FF4C4C",
};

// Hardcoded knowledge base
const knowledgeBase = [
  {
    question: "ما هي مدة التقادم في الدعاوى التجارية؟",
    answer: "مدة التقادم في الدعاوى التجارية هي 10 سنوات وفقًا لنظام القانون التجاري السعودي",
    similarity_score: 0.95
  },
  {
    question: "كيف يمكنني رفع دعوى قضائية؟",
    answer: "يمكنك رفع دعوى قضائية عن طريق تقديم صحيفة الدعوى إلى المحكمة المختصة مع المستندات المطلوبة",
    similarity_score: 0.87
  },
  {
    question: "ما هي حقوق المستأجر في السعودية؟",
    answer: "للمستأجر حق الانتفاع بالمأجور وفقاً لشروط العقد وحق المطالبة بالإصلاحات الضرورية",
    similarity_score: 0.78
  }
];
export default function LegalSupport({
  ChatbotExpAction,
}: {
  ChatbotExpAction: (
    question: string,
    answer: string,
  ) => Promise<
    | { question: string; answers: string[] }
    | { field: string; message: string }
    | { answer: string }
    | { answer: string; exception: string }
  >;
}) {
	const [messages, setMessages] = useState<Message[]>([]);
  	const [isBotTyping, setIsBotTyping] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(new Set());
	const [isPlaying, setIsPlaying] = useState(false);
	const [speechInstance, setSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [activeQuestions, setActiveQuestions] = useState<Set<string>>(new Set());
	const [audioStates, setAudioStates] = useState<Map<string, boolean>>(new Map());
	const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
	
	useEffect(() => {
		scrollToBottom();
    	startConversation();
  	}, []);
	
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	const handleAnswerSelection = async (answer: string, questionId: string) => {
		// التوقف إذا كان السؤال غير نشط أو الإجابة مختارة مسبقاً
		if (!activeQuestions.has(questionId) || selectedAnswers.has(answer)) {
			return;
		}

		// تأمين الإجابة المختارة لمنع التكرار
		setSelectedAnswers((prev) => new Set([...prev, answer]));

		// إنشاء رسالة المستخدم
		const userMessage: Message = {
			id: `${questionId}-${Date.now()}`,
			text: answer,
			sender: "user",
			timestamp: new Date(),
		};

		// تحديث الرسائل مع منع التكرار
		setMessages((prev) => {
			const lastUserMessage = [...prev]
				.reverse()
				.find((m) => m.sender === "user");

			if (lastUserMessage?.text === answer) {
				return prev;
			}
			return [...prev, userMessage];
		});

		// تعطيل السؤال الحالي
		setActiveQuestions((prev) => {
			const newSet = new Set(prev);
			newSet.delete(questionId);
			return newSet;
		});

		setIsBotTyping(true);
		try {
			const botResponse = await ChatbotExpAction(
				messages.find((m) => m.id === questionId)?.text || "",
				answer,
			);

			if ("answer" in botResponse) {
				const botMessage: Message = {
					id: Date.now().toString(),
					text: botResponse.answer,
					sender: "bot",
					timestamp: new Date(),
					isFinalAnswer: true,
				};

				// إضافة رسالة البوت النهائية
				setMessages((prev) => [...prev, botMessage]);

				// معالجة الاستثناءات إذا وجدت
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

				// إضافة سؤال البوت الجديد
				setMessages((prev) => [...prev, botMessage]);
				setActiveQuestions((prev) => new Set([...prev, botMessage.id]));
			}
		} finally {
			setIsBotTyping(false);
			scrollToBottom(); // التأكد من التمرير للأسفل
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
		window.speechSynthesis.cancel();
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
    
		// Add user's search query as a message
		const userMessage: Message = {
		id: Date.now().toString(),
		text: searchQuery,
		sender: "user",
		timestamp: new Date(),
		};
    
		setMessages(prev => [...prev, userMessage]);
		
		// Simulate API call with hardcoded results
		setIsBotTyping(true);
		setTimeout(() => { // Simulate network delay
		const searchResults = knowledgeBase.map(item => ({
			question: item.question,
			answer: item.answer,
			score: item.similarity_score
		}));
		
		const botMessage: Message = {
			id: Date.now().toString(),
			text: "إليك أهم الأسئلة المشابهة لبحثك:",
			sender: "bot",
			timestamp: new Date(),
			isSearchResult: true,
			searchResults: searchResults
		};
		
		setMessages(prev => [...prev, botMessage]);
		setIsBotTyping(false);
		scrollToBottom();
		}, 1500);
  	};

	const toggleAudioPlayback = async (audioId: string, text: string) => {
		// إيقاف أي صوت قيد التشغيل حالياً
		if (activeAudioId && activeAudioId !== audioId) {
			window.speechSynthesis.cancel();
			setAudioStates((prev) => {
				const newMap = new Map(prev);
				newMap.set(activeAudioId, false);
				return newMap;
			});
		}

		const isCurrentlyPlaying = audioStates.get(audioId) || false;

		if (isCurrentlyPlaying) {
			window.speechSynthesis.cancel();
			setAudioStates((prev) => new Map(prev).set(audioId, false));
			setActiveAudioId(null);
		} else {
			setAudioStates((prev) => new Map(prev).set(audioId, true));
			setActiveAudioId(audioId);

			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = "ar-SA";

			utterance.onend = () => {
				setAudioStates((prev) => new Map(prev).set(audioId, false));
				setActiveAudioId(null);
			};

			window.speechSynthesis.speak(utterance);
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
				console.error("Error with voice recognition:", err);
			} finally {
				setIsRecording(false);
			}
		}
	};

	return (
		<div className="flex h-screen flex-col bg-gray-50 pt-24">
			<AmalNavbar backgroundColor={"#CA5A29FF"} activeSection={"legal"} />

			{/* Messages container */}
			<div className="flex-1 space-y-4 overflow-y-auto p-4">
			{messages.map((message) => (
			<div
				key={message.id}
				className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"} transition-all ease-in-out`}
			>
				<div className="w-full max-w-[90%] lg:max-w-[70%]">
				{/* Bot Question (keep existing) */}
				{message.sender === "bot" && !message.isFinalAnswer 
				&& !message.isException && !message.isSearchResult && (
									<div className="mb-4 space-y-3 text-right">
										<div className="inline-block max-w-fit transform rounded-xl bg-white p-4 shadow-lg transition-all duration-500 hover:scale-105">
											<div className="flex flex-col items-start gap-1">
												<p className="text-lg font-medium text-gray-800">
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
																	? "bg-[#D78448] text-white"
																	: "bg-[#FFCB99] hover:bg-[#FFB37D]"
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
									<div className="relative max-w-[80%] transform rounded-xl rounded-bl-none bg-[#FFCB99] p-3 shadow-sm transition-all duration-300 hover:scale-105">
										<p className="font-medium text-[#D78448]">
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
								<div className="mt-4 w-full rounded-xl border border-[#D78448] bg-[#FFCB99] p-4 text-right">
									<h3 className="text-lg font-medium mb-3">{message.text}</h3>
									<div className="space-y-3">
										{message.searchResults?.map((result, index) => (
										<div key={index} className="bg-white p-3 rounded-lg shadow">
											<p className="font-medium text-[#D78448]">{result.question}</p>
											<p className="text-gray-700 mt-1">{result.answer}</p>
											<div className="text-sm text-gray-500 mt-1">
												درجة التطابق: {(result.score * 100).toFixed(0)}%
											</div>
											<button
												onClick={() => toggleAudioPlayback(`result-${index}`, `${result.question} ${result.answer}`)}
												className="text-[#D78448] mt-2"
											>
											{audioStates.get(`result-${index}`) ? (
												<FaPause size={14} />
											) : (
												<FaPlay size={14} />
											)}
											</button>
										</div>
									))}
									</div>
								</div>
							)}

							{/* Final Answer */}
							{message.isFinalAnswer && (
								<div className="mt-4 w-full rounded-xl border border-[#D78448] bg-[#FFCB99] p-4 text-right md:w-fit">
									<div className="flex flex-col items-end gap-3 md:flex-row md:items-center md:justify-end">
										{/* النص وعناصر التحكم */}
										<div className="flex w-full items-center justify-end gap-2 md:w-auto">
											<FaCheck className="hidden shrink-0 text-[#D78448] md:block" />
											<p className="flex-1 font-medium text-[#D78448] md:flex-none">
												{message.text}
											</p>
											<button
												onClick={() =>
													toggleAudioPlayback(
														`final-${message.id}`,
														message.text,
													)
												}
												className="text-[#D78448] transition-colors duration-300 hover:text-[#D78448]"
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
											className="w-full rounded-lg bg-[#D78448] px-3 py-2 text-white transition-colors hover:bg-[#D78448] md:w-auto"
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
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="ابحث في الأسئلة..."
								className="w-full rounded-full bg-gray-100 py-2 pr-12 pl-4 text-right text-gray-700 transition-all outline-none focus:ring-2 focus:ring-[#D78448]"
							/>
							<button
								onClick={handleSearch}
								className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-[#D78448] p-2 text-white hover:bg-[#D78448]"
							>
								<FaSearch size={14} />
							</button>
						</div>
						<button
							onClick={handleResetConversation}
							className="w-fit rounded-lg bg-[#D78448] px-3 py-2 text-white transition-colors hover:bg-[#D78448] md:w-fit"
						>
							<div className="flex items-center justify-center gap-2">
								<FaRedo size={14} />
								<span className="hidden sm:inline">إعادة المحادثة</span>
							</div>
						</button>
						{/* Voice Record Button */}
						<button
							onClick={toggleRecording}
							className={`${
								isRecording
									? "bg-red-500 text-white"
									: "bg-[#D78448] text-white"
							} rounded-lg p-3 transition-colors`}
						>
							<FaMicrophone />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
