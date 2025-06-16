"use client";

import { startVoiceRecognition } from "@/utils/stt";
import { textToSpeech } from "@/utils/tts";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPaperPlane, FaPause, FaPlay } from "react-icons/fa";
import AmalNavbar from "./amalNavbar";
import SessionSidebar from "./SessionSidebar";
import { analyze_and_respond_Api } from "@/utils/api";

type Message = {
	id: string;
	text: string;
	sender: "user" | "bot";
	timestamp: Date;
};

export default function PsychologicalSupport({
	logoutAction,
	savePsychologicalConversationEntryAction,
	fetchAllPsychologicalSessionsAction,
	deletePsychologicalSessionAction,
	generateSupportResponseAction,
}: {
	logoutAction: () => Promise<void>;
	savePsychologicalConversationEntryAction: (
		sessionId: string,
		question: string,
		answer: string,
	) => Promise<{ success: boolean } | { field: string; message: string }>;
	fetchAllPsychologicalSessionsAction: () => Promise<
		| { sessions: { sessionId: string; lastQuestion: string }[] }
		| { field: string; message: string }
	>;
	deletePsychologicalSessionAction: (
		sessionId: string,
	) => Promise<{ success: boolean } | { field: string; message: string }>;
	generateSupportResponseAction: (input: string) => Promise<string>;
}) {
	const [sessionId, setSessionId] = useState<string>(nanoid());
	const [messages, setMessages] = useState<Message[]>([]);
	const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
	const [inputText, setInputText] = useState("");
	const [isRecording, setIsRecording] = useState(false);
	const [isBotTyping, setIsBotTyping] = useState(false);
	const [isVoiceRecognizing, setIsVoiceRecognizing] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
	const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
	const [error, setError] = useState("");
	// تهيئة الرسالة الترحيبية عند التحميل
	useEffect(() => {
		const welcomeMessage: Message = {
			id: nanoid(),
			text: "مرحباً بك في منصة أمل للدعم النفسي. كيف يمكنني مساعدتك اليوم؟",
			sender: "bot",
			timestamp: new Date(),
		};
		setMessages([welcomeMessage]);
	}, []);

	const getPsychologicalResponse = async (
		userMessage: string,
	): Promise<string> => {
		try {
			const response = await fetch(analyze_and_respond_Api, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					text: userMessage,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return (
				data.response ||
				data.message ||
				"شكراً لمشاركتك. كيف يمكنني مساعدتك أكثر؟"
			);
		} catch (error) {
			console.error("Error calling psychological API:", error);
			return "عذراً، حدث خطأ في الاتصال بالخدمة. يرجى المحاولة مرة أخرى لاحقاً.";
		}
	};

	const handleSendMessage = async () => {
		if (!inputText.trim()) return;

		// إضافة رسالة اليوزر للشات
		const userMessage: Message = {
			id: nanoid(),
			text: inputText,
			sender: "user",
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, userMessage]);
		setInputText("");

		// توليد رد البوت
		setIsBotTyping(true);
		const botResponseText = await g2(inputText);
		setIsBotTyping(false);

		// إضافة رد البوت للشات
		const botMessage: Message = {
			id: nanoid(),
			text: botResponseText,
			sender: "bot",
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, botMessage]);

		// تخزين الزوج (رسالة اليوزر الحالية + رد البوت الحالي)
		// فقط إذا لم تكن هذه هي الرسالة الترحيبية
		if (messages.length > 0) {
			// تأكد أن هناك رسائل سابقة (لتفادي الترحيب)
			await savePsychologicalConversationEntryAction(
				sessionId,
				inputText, // رسالة اليوزر الحالية
				botResponseText, // رد البوت الحالي
			);
		}
	};

	const g2 = async (userMessage: string): Promise<string> => {
		try {
			const resp = await fetch(analyze_and_respond_Api, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					text: userMessage,
				}),
			});
			const response = await generateSupportResponseAction(userMessage);
			return response;
			
		} catch (error) {
			console.error("Error generating response:", error);
			return "عذراً، حدث خطأ في توليد الرد. هل يمكنك المحاولة مرة أخرى؟";
		}
	};
	
	const saveConversationPair = async (
		botMessage: string,
		userMessage: string,
	) => {
		await savePsychologicalConversationEntryAction(
			sessionId,
			botMessage,
			userMessage,
		);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const toggleRecording = async () => {
		setError("");
		try {
			setIsRecording(true);
			await navigator.mediaDevices.getUserMedia({ audio: true });
			setIsVoiceRecognizing(true);
			await navigator.mediaDevices.getUserMedia({ audio: true });
			const transcript = await startVoiceRecognition();
			setInputText(transcript);
		} catch (err) {
			setError("يجب منح الإذن لاستخدام الميكروفون");
		} finally {
			setIsRecording(false);
			setIsVoiceRecognizing(false);
		}
	};

	const toggleAudioPlayback = async (messageId: string) => {
		const message = messages.find((m) => m.id === messageId);
		if (!message) return;

		if (activeAudioId === messageId && isPlaying) {
			window.speechSynthesis.cancel();
			setIsPlaying(false);
			setActiveAudioId(null);
		} else {
			setIsPlaying(true);
			setActiveAudioId(messageId);
			await textToSpeech(message.text);
			setIsPlaying(false);
			setActiveAudioId(null);
		}
	};

	const handleResetConversation = () => {
		const newSessionId = nanoid();
		setSessionId(newSessionId);

		const welcomeMessage: Message = {
			id: nanoid(),
			text: "مرحباً بك في منصة أمل للدعم النفسي. كيف يمكنني مساعدتك اليوم؟",
			sender: "bot",
			timestamp: new Date(),
		};
		setMessages([welcomeMessage]);
		setLastUserMessage(null);
	};

	useEffect(() => {
		return () => {
			Object.values(audioRefs.current).forEach((audio) => {
				if (audio) {
					audio.pause();
					audio.src = "";
				}
			});
		};
	}, []);

	return (
		<div className="flex h-screen flex-col bg-gray-100 pt-24">
			<AmalNavbar
				logoutAction={logoutAction}
				backgroundColor="#4D2353FF"
				activeSection={"psychological"}
			/>
			<SessionSidebar
				fetchSessionsAction={fetchAllPsychologicalSessionsAction}
				deleteSessionAction={deletePsychologicalSessionAction}
				backgroundColor="emerald"
				textColor="emerald"
				hoverColor="emerald"
				title="الجلسات النفسية"
				type="psychological"
			/>
			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
					>
						<div className="w-full max-w-[90%] lg:max-w-[70%]">
							{message.sender === "user" ? (
								<div className="flex justify-start">
									<div className="relative max-w-[80%] transform rounded-xl rounded-bl-none bg-[#582C5E] p-3 shadow-sm transition-all duration-300 hover:scale-105">
										<p className="font-medium text-white">
											{message.text}
											<button
												onClick={() => toggleAudioPlayback(message.id)}
												className={`pl-3 ${
													activeAudioId === message.id && isPlaying
														? "text-red-500"
														: "text-white"
												} transition-colors duration-300`}
											>
												{activeAudioId === message.id && isPlaying ? (
													<FaPause size={14} />
												) : (
													<FaPlay size={14} />
												)}
											</button>
										</p>
									</div>
								</div>
							) : (
								<div className="mb-4 space-y-3 text-right">
									<div className="inline-block max-w-fit transform rounded-xl bg-white p-4 shadow-lg transition-all duration-500 hover:scale-105">
										<div className="flex flex-col items-start gap-1">
											<p className="text-lg font-medium text-[#582C5E]">
												{message.text}
											</p>
											<button
												onClick={() => toggleAudioPlayback(message.id)}
												className={`self-end pt-2 transition-colors duration-300 ${
													activeAudioId === message.id && isPlaying
														? "text-red-500"
														: "text-[#582C5E]"
												}`}
											>
												{activeAudioId === message.id && isPlaying ? (
													<FaPause size={12} />
												) : (
													<FaPlay size={12} />
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
			</div>

			<div className="border-t border-gray-300 bg-white p-4">
				<div className="flex flex-col items-center gap-3 sm:flex-row">
					<div className="relative w-full flex-1">
						<textarea
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="...اكتب رسالتك هنا أو استخدم التسجيل الصوتي"
							className="w-full resize-none rounded-full bg-gray-100 py-2 pr-12 pl-4 text-right text-gray-700 transition-all outline-none focus:ring-2 focus:ring-[#582C5E]"
							rows={1}
						/>
						<div className="absolute top-1/2 right-4 -translate-y-1/2">
							<button
								onClick={handleSendMessage}
								disabled={!inputText.trim()}
								className={`rounded-full p-2 ${
									inputText.trim()
										? "text-[#582C5E] hover:text-[#582C5E]"
										: "cursor-not-allowed text-gray-400"
								}`}
							>
								<FaPaperPlane size={14} />
							</button>
						</div>
					</div>
					<button
						onClick={toggleRecording}
						className={`rounded-lg p-3 transition-colors ${
							isRecording ? "bg-red-500 text-white" : "bg-[#582C5E] text-white"
						}`}
					>
						<FaMicrophone />
					</button>
					<button
						onClick={handleResetConversation}
						className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#582C5E] px-4 py-2 text-white shadow-lg transition-all hover:bg-[#4F2345] sm:w-auto"
					>
						<FaPaperPlane size={16} />
						محادثة جديدة
					</button>
				</div>
				{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
				{isVoiceRecognizing && <div className="spinner">...</div>}
			</div>
		</div>
	);
}
