"use client";

import { useEffect, useRef, useState } from "react";
import {
	FaMicrophone,
	FaPaperPlane,
	FaPause,
	FaPlay,
	FaStop,
} from "react-icons/fa";
import AmalNavbar from "./amalNavbar";
import { textToSpeech } from "@/utils/tts";

type Message = {
	id: string;
	text: string;
	sender: "user" | "bot";
	timestamp: Date;
};

export default function PsychologicalSupport() {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			text: "مرحباً بك في منصة أمل للدعم النفسي. كيف يمكنني مساعدتك اليوم؟",
			sender: "bot",
			timestamp: new Date(),
		},
	]);
	const [inputText, setInputText] = useState("");
	const [isRecording, setIsRecording] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
	const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

	// هذه الدالة تحاكي استدعاء API للدعم النفسي
	// في التطبيق الحقيقي، ستستبدل هذه الدالة باستدعاء حقيقي للباكند
	const getPsychologicalResponse = async (
		userMessage: string,
	): Promise<string> => {
		// محاكاة استجابة من API مع ردود عشوائية
		const responses = [
			"أنا هنا لأسمعك. أخبرني المزيد عن ما تشعر به.",
			"يبدو أنك تمر بوقت صعب. تذكر أن مشاعرك مشروعة ومهمة.",
			"شكراً لمشاركتي هذا. هل يمكنك أن تصف لي شعورك بمزيد من التفاصيل؟",
			"أنا أفهم أن هذا قد يكون صعباً عليك. أنت لست وحدك في هذا.",
			"مشاعرك مهمة جداً. دعنا نستكشف هذا الشعور معاً.",
			"أنا أسمعك وأقدّر صراحتك. الحياة قد تكون صعبة أحياناً ولكن هناك دائماً أمل.",
		];

		// محاكاة تأخير الشبكة
		await new Promise((resolve) =>
			setTimeout(resolve, 1000 + Math.random() * 2000),
		);

		return responses[Math.floor(Math.random() * responses.length)];
	};

	const handleSendMessage = async () => {
		if (!inputText.trim()) return;

		// إضافة رسالة المستخدم
		const userMessage: Message = {
			id: Date.now().toString(),
			text: inputText,
			sender: "user",
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, userMessage]);
		setInputText("");

		// الحصول على رد من البوت
		const botResponseText = await getPsychologicalResponse(inputText);
		const botMessage: Message = {
			id: Date.now().toString(),
			text: botResponseText,
			sender: "bot",
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, botMessage]);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const toggleRecording = () => {
		// هنا سيتم تنفيذ منطق التسجيل الصوتي
		setIsRecording(!isRecording);

		if (!isRecording) {
			// محاكاة عملية التسجيل
			console.log("بدء التسجيل...");
		} else {
			// محاكاة تحويل الصوت إلى نص
			setTimeout(() => {
				const recordedText = "هذا نص محاكى من الصوت المسجل";
				setInputText(recordedText);
			}, 1500);
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

	// تنظيف تأثيرات الصوت عند إلغاء تحميل المكون
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
			<AmalNavbar backgroundColor="#9257AD" activeSection={"psychological"} />

			{/* منطقة المحادثة */}
			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
					>
						<div
							className={`max-w-xs rounded-lg p-4 md:max-w-md lg:max-w-lg ${
								message.sender === "user"
									? "bg-[#D9B3E6] text-[#7D3C98]"
									: "bg-[#9257AD] text-white"
							}`}
						>
							<p className="text-sm">{message.text}</p>
							<div className="mt-2 flex items-center justify-between">
								<span className="text-xs opacity-70">
									{message.timestamp.toLocaleTimeString("ar-EG", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
								{message.sender === "bot" && (
									<button
										onClick={() => toggleAudioPlayback(message.id)}
										className={`rounded-full p-1 ${
											activeAudioId === message.id && isPlaying
												? "bg-[#7D3C98] text-white"
												: "bg-white text-[#7D3C98]"
										}`}
									>
										{activeAudioId === message.id && isPlaying ? (
											<FaPause size={12} />
										) : (
											<FaPlay size={12} />
										)}
									</button>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* منطقة الإدخال */}
			<div className="border-t border-gray-200 bg-white p-4">
				<div className="flex items-center rounded-lg bg-[#D9B3E6] p-2">
					<button
						onClick={toggleRecording}
						className={`mr-2 rounded-full p-2 ${
							isRecording
								? "bg-[#7D3C98] text-white"
								: "bg-white text-[#7D3C98]"
						}`}
					>
						{isRecording ? <FaStop size={16} /> : <FaMicrophone size={16} />}
					</button>
					<textarea
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="اكتب رسالتك هنا أو استخدم التسجيل الصوتي..."
						className="flex-1 resize-none bg-transparent text-[#7D3C98] placeholder-[#9257AD] outline-none"
						rows={1}
					/>
					<button
						onClick={handleSendMessage}
						disabled={!inputText.trim()}
						className={`ml-2 rounded-full p-2 ${
							inputText.trim()
								? "bg-[#7D3C98] text-white"
								: "bg-gray-300 text-gray-500"
						}`}
					>
						<FaPaperPlane size={16} />
					</button>
				</div>
			</div>
		</div>
	);
}
