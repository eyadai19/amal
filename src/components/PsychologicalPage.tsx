"use client";

import { startVoiceRecognition } from "@/utils/stt";
import { textToSpeech } from "@/utils/tts";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import {
	FaMicrophone,
	FaPaperPlane,
	FaPause,
	FaPlay,
	FaStop,
} from "react-icons/fa";
import AmalNavbar from "./amalNavbar";

type Message = {
	id: string;
	text: string;
	sender: "user" | "bot";
	timestamp: Date;
};

export default function PsychologicalSupport({
	logoutAction,
	savePsychologicalConversationEntryAction,
}: {
	logoutAction: () => Promise<void>;
	savePsychologicalConversationEntryAction: (
		sessionId: string,
		question: string,
		answer: string,
	) => Promise<{ success: boolean } | { field: string; message: string }>;
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
		const userFeeling = userMessage.toLowerCase().includes("حزين")
			? "حزين"
			: "جيد";
		const responses = {
			حزين: "أشعر بما تمر به. هل ترغب في التحدث عن ذلك؟",
			جيد: "أنت بخير، ولكن هل هناك شيء ترغب في مشاركته؟",
			default: "أنا هنا للاستماع إليك. كيف يمكنني مساعدتك؟",
		};

		await new Promise((resolve) =>
			setTimeout(resolve, 1000 + Math.random() * 2000),
		);
		return responses[userFeeling] || responses.default;
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
		const botResponseText = await getPsychologicalResponse(inputText);
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
			console.error("خطأ في الوصول للميكروفون:", err);
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
				backgroundColor="#582C5E"
				activeSection={"psychological"}
			/>

			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
					>
						<div
							className={`max-w-xs rounded-xl p-4 shadow-lg transition-transform duration-300 ${
								message.sender === "user"
									? "bg-white text-[#582C5E]"
									: "bg-[#582C5E] text-white"
							} font-serif`}
						>
							<p className="text-lg">{message.text}</p>
							<div className="mt-2 flex items-center justify-between">
								<span className="text-xs opacity-80">
									{message.timestamp.toLocaleTimeString("ar-EG", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
								<button
									onClick={() => toggleAudioPlayback(message.id)}
									className={`rounded-full p-1 ${
										activeAudioId === message.id && isPlaying
											? message.sender === "user"
												? "bg-[#582C5E] text-white"
												: "bg-white text-[#582C5E]"
											: message.sender === "user"
												? "bg-[#582C5E] text-white"
												: "bg-white text-[#582C5E]"
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
				))}
				{isBotTyping && (
					<div className="flex justify-end">
						<div className="max-w-xs rounded-lg bg-[#F1F0F0] p-5 text-[#582C5E] shadow-lg">
							<p>...</p>
						</div>
					</div>
				)}
			</div>

			<div className="border-t border-gray-300 bg-white p-6 shadow-md">
				<div className="flex items-center rounded-lg bg-[#F1F0F0] p-3 shadow-lg transition-all">
					<button
						onClick={toggleRecording}
						className={`mr-3 rounded-full p-2 ${
							isRecording
								? "bg-[#582C5E] text-white"
								: "bg-white text-[#582C5E]"
						}`}
					>
						{isRecording ? <FaStop size={16} /> : <FaMicrophone size={16} />}
					</button>
					<textarea
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="اكتب رسالتك هنا أو استخدم التسجيل الصوتي..."
						className="flex-1 resize-none rounded-lg bg-transparent p-3 font-serif text-lg text-[#582C5E] placeholder-[#E2C8D3] shadow-md transition-all outline-none focus:ring-2 focus:ring-[#582C5E]"
						rows={1}
					/>
					<button
						onClick={handleSendMessage}
						disabled={!inputText.trim()}
						className={`ml-3 rounded-full p-2 ${
							inputText.trim()
								? "bg-[#582C5E] text-white hover:bg-[#4F2345]"
								: "cursor-not-allowed bg-gray-300 text-gray-500"
						}`}
					>
						<FaPaperPlane size={16} />
					</button>
				</div>
				{error && <p className="mt-2 text-sm text-red-500">{error}</p>}

				<div className="mt-4 flex justify-end">
					<button
						onClick={handleResetConversation}
						className="rounded-full bg-red-500 px-4 py-2 text-white shadow-lg transition-all hover:bg-red-600"
					>
						محادثة جديدة
					</button>
				</div>

				{isVoiceRecognizing && <div className="spinner">...</div>}
			</div>
		</div>
	);
}
