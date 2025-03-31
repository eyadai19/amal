"use client";

import { textToSpeech } from "@/utils/tts";
import { useEffect, useRef, useState } from "react";
import {
	FaCheck,
	FaMicrophone,
	FaPlay,
	FaRedo,
	FaSearch,
} from "react-icons/fa";
import AmalNavbar from "./amalNavbar";

type Message = {
	id: string;
	text: string;
	sender: "user" | "bot";
	timestamp: Date;
	answers?: string[];
	isFinalAnswer?: boolean;
};

const colors = {
	primary: "#FF8C42", // لون السؤال
	secondary: "#FFD1A8", // لون الخيارات
	accent: "#FF9E5E", // لون التمييز
	text: "#333333", // لون النص الغامق
	lightText: "#FFFFFF", // لون النص الفاتح
};

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
	>;
}) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isBotTyping, setIsBotTyping] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(
		new Set(),
	);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		scrollToBottom();
		startConversation();
	}, []);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const startConversation = async () => {
		setIsBotTyping(true);
		const initialResponse = await ChatbotExpAction("", "");
		setIsBotTyping(false);

		if ("question" in initialResponse) {
			setMessages([
				{
					id: Date.now().toString(),
					text: initialResponse.question,
					sender: "bot",
					timestamp: new Date(),
					answers: initialResponse.answers,
				},
			]);
		}
	};

	const handleAnswerSelection = async (answer: string) => {
		const userMessage: Message = {
			id: Date.now().toString(),
			text: answer,
			sender: "user",
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, userMessage]);

		setIsBotTyping(true);
		const lastBotMessage = messages.findLast((m) => m.sender === "bot");
		const botResponse = await ChatbotExpAction(
			lastBotMessage?.text || "",
			answer,
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
	};

	const handleResetConversation = () => {
		setMessages([]);
		setSelectedAnswers(new Set());
		setSearchQuery("");
		startConversation();
	};

	const handleSearch = () => {
		// سيتم تنفيذ وظيفة البحث لاحقاً
		console.log("Searching for:", searchQuery);
	};

	const playMessage = (text: string) => {
		textToSpeech(text);
	};

	return (
		<div className="flex h-screen flex-col bg-gray-50 pt-24">
			<AmalNavbar backgroundColor={"#E67E35"} activeSection={"legal"} />

			{/* Messages container */}
			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
					>
						<div className="w-full max-w-[90%] lg:max-w-[70%]">
							{/* Bot Question */}
							{message.sender === "bot" && (
								<div className="mb-4 space-y-3 text-right">
									<div className="inline-block max-w-fit rounded-xl bg-white p-4 shadow-sm">
										<div className="flex flex-col items-start gap-1">
											<p className="text-lg font-medium text-gray-800">
												{message.text}
											</p>
											<button
												onClick={() => textToSpeech(message.text)}
												className="self-end pt-2 text-orange-500 hover:text-orange-600"
											>
												<FaPlay size={12} />
											</button>
										</div>
									</div>

									{/* Answer Options */}
									{message.answers && (
										<div className="flex flex-wrap justify-end gap-2">
											{message.answers.map((answer, index) => (
												<div key={index} className="flex items-center gap-1">
													<button
														onClick={() => {
															handleAnswerSelection(answer);
															setSelectedAnswers(
																new Set([...selectedAnswers, answer]),
															);
														}}
														className={`rounded-lg px-4 py-2 transition-colors ${
															selectedAnswers.has(answer)
																? "bg-orange-100 text-orange-700"
																: "bg-[#FFF3E0] text-gray-800 hover:bg-[#FFE0B2]"
														}`}
													>
														{answer}
														<button
															onClick={() => textToSpeech(answer)}
															className="pl-3 text-orange-500 hover:text-orange-600"
														>
															<FaPlay size={12} />
														</button>
													</button>
												</div>
											))}
										</div>
									)}
								</div>
							)}

							{/* User Answer */}
							{message.sender === "user" && (
								<div className="flex justify-start">
									<div className="relative max-w-[80%] rounded-xl rounded-bl-none bg-orange-100 p-3 shadow-sm">
										<p className="font-medium text-orange-800">
											{message.text}
											<button
												onClick={() => textToSpeech(message.text)}
												className="pl-3 text-orange-500 hover:text-orange-600"
											>
												<FaPlay size={12} />
											</button>
										</p>
										<div className="clip-triangle absolute bottom-0 -left-2 h-4 w-4 bg-orange-100" />
									</div>
								</div>
							)}

							{/* Final Answer */}
							{message.isFinalAnswer && (
								<div className="mt-4 w-full rounded-xl border border-orange-200 bg-orange-50 p-4 text-right md:w-fit">
									<div className="flex flex-col items-end gap-3 md:flex-row md:items-center md:justify-end">
										{/* النص وعناصر التحكم */}
										<div className="flex w-full items-center justify-end gap-2 md:w-auto">
											<FaCheck className="hidden shrink-0 text-orange-600 md:block" />
											<p className="flex-1 font-medium text-orange-800 md:flex-none">
												{message.text}
											</p>
											<button
												onClick={() => textToSpeech(message.text)}
												className="text-orange-500 hover:text-orange-600"
											>
												<FaPlay size={14} />
											</button>
										</div>

										{/* زر إعادة المحادثة */}
										<button
											onClick={handleResetConversation}
											className="w-full rounded-lg bg-orange-500 px-3 py-2 text-white transition-colors hover:bg-orange-600 md:w-auto"
										>
											<div className="flex items-center justify-center gap-2">
												<FaRedo size={14} />
												<span>إعادة المحادثة</span>
											</div>
										</button>
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
				{/* للشاشات الصغيرة: ترتيب أفقي للعناصر */}
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					{/* شريط البحث مع الأزرار في نفس الصف للشاشات الصغيرة */}
					<div className="flex flex-row items-center gap-2 sm:flex-1 sm:gap-4">
						{/* شريط البحث مع الأيقونة على اليمين */}
						<div className="relative flex-1">
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="ابحث في الأسئلة..."
								className="w-full rounded-full bg-gray-100 py-2 pr-12 pl-4 text-right text-gray-700 outline-none"
							/>
							<button
								onClick={handleSearch}
								className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-orange-500 p-2 text-white"
							>
								<FaSearch size={14} />
							</button>
						</div>

						{/* الأزرار في نفس الصف مع شريط البحث للشاشات الصغيرة */}
						<div className="flex items-center gap-2 sm:hidden">
							<button
								onClick={handleResetConversation}
								className="rounded-lg bg-orange-500 p-2 text-white transition-colors hover:bg-orange-600"
							>
								<FaRedo size={20} />
							</button>
							<button
								onClick={() => setIsRecording(!isRecording)}
								className={`rounded-lg p-2 transition-colors ${
									isRecording
										? "bg-orange-500 text-white"
										: "bg-gray-100 text-orange-500 hover:bg-orange-50"
								}`}
							>
								<FaMicrophone size={20} />
							</button>
						</div>
					</div>

					{/* الأزرار للشاشات الكبيرة (تظهر فقط في الشاشات المتوسطة فما فوق) */}
					<div className="hidden items-center gap-2 sm:flex">
						<button
							onClick={handleResetConversation}
							className="flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-white transition-colors hover:bg-orange-600"
						>
							<FaRedo className="shrink-0" />
							<span>إعادة</span>
						</button>
						<button
							onClick={() => setIsRecording(!isRecording)}
							className={`rounded-lg p-2 transition-colors ${
								isRecording
									? "bg-orange-500 text-white"
									: "bg-gray-100 text-orange-500 hover:bg-orange-50"
							}`}
						>
							<FaMicrophone size={20} />
						</button>
					</div>
				</div>
			</div>

			<style jsx>{`
				.clip-triangle {
					clip-path: polygon(0 0, 0% 100%, 100% 0);
				}
			`}</style>
		</div>
	);
}
