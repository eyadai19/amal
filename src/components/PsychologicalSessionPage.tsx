"use client";

import AmalNavbar from "@/components/amalNavbar";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Message {
	role: "user" | "assistant";
	content: string;
	timestamp: string;
	isPlaying?: boolean;
}

export default function PsychologicalSessionPage({
	logoutAction,
	fetchPsychologicalConversationHistoryAction,
}: {
	logoutAction: () => Promise<void>;
	fetchPsychologicalConversationHistoryAction: () => Promise<
		| {
				questionsAndAnswers: { question: string; answer: string }[];
		  }
		| { field: string; message: string }
	>;
}) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handlePlayAudio = (text: string, index: number) => {
		const currentMessage = messages[index];
		if (currentMessage.isPlaying) {
			window.speechSynthesis.cancel();
			setMessages((prevMessages) =>
				prevMessages.map((msg, i) =>
					i === index ? { ...msg, isPlaying: false } : msg,
				),
			);
			return;
		}

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = "ar-SA";
		utterance.onend = () => {
			setMessages((prevMessages) =>
				prevMessages.map((msg, i) =>
					i === index ? { ...msg, isPlaying: false } : msg,
				),
			);
		};
		window.speechSynthesis.speak(utterance);
		setMessages((prevMessages) =>
			prevMessages.map((msg, i) =>
				i === index ? { ...msg, isPlaying: true } : msg,
			),
		);
	};

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const response = await fetchPsychologicalConversationHistoryAction();
				if ("questionsAndAnswers" in response) {
					const welcomeMessage: Message = {
						role: "assistant",
						content:
							"مرحباً بك في منصة أمل للدعم النفسي. كيف يمكنني مساعدتك اليوم؟",
						timestamp: new Date().toISOString(),
						isPlaying: false,
					};

					const formattedMessages = [
						welcomeMessage,
						...response.questionsAndAnswers.flatMap((qa) => [
							{
								role: "user" as const,
								content: qa.question,
								timestamp: new Date().toISOString(),
								isPlaying: false,
							},
							{
								role: "assistant" as const,
								content: qa.answer,
								timestamp: new Date().toISOString(),
								isPlaying: false,
							},
						]),
					];
					setMessages(formattedMessages);
				} else {
					setError(response.message || "حدث خطأ في جلب المحادثة");
				}
			} catch (err) {
				setError("حدث خطأ في جلب المحادثة");
			} finally {
				setLoading(false);
			}
		};

		fetchMessages();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-white">
				<AmalNavbar
					logoutAction={logoutAction}
					backgroundColor="#582C5E"
					activeSection={"psychological"}
				/>
				<div className="mx-auto max-w-4xl px-4 py-8">
					<div className="mb-8 text-center">
						<div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-[#582C5E]/10"></div>
						<div className="mx-auto mt-4 h-4 w-64 animate-pulse rounded-lg bg-[#582C5E]/10"></div>
					</div>

					<div className="space-y-6">
						{[...Array(5)].map((_, index) => (
							<div
								key={index}
								className={`flex ${
									index % 2 === 0 ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`max-w-[80%] rounded-2xl p-4 ${
										index % 2 === 0
											? "border border-[#582C5E]/20 bg-[#582C5E]/10 text-[#582C5E]"
											: "bg-[#582C5E] text-white"
									}`}
								>
									{index % 2 === 0 && (
										<div className="mb-2 flex items-center justify-end gap-2">
											<div className="h-4 w-12 animate-pulse rounded-lg bg-[#582C5E]/10"></div>
											<div className="h-2 w-2 animate-pulse rounded-full bg-[#582C5E]"></div>
										</div>
									)}
									<div className="space-y-2">
										<div
											className={`h-4 w-3/4 animate-pulse rounded-lg ${
												index % 2 === 0 ? "bg-[#582C5E]/10" : "bg-white/10"
											}`}
										></div>
										<div
											className={`h-4 w-1/2 animate-pulse rounded-lg ${
												index % 2 === 0 ? "bg-[#582C5E]/10" : "bg-white/10"
											}`}
										></div>
									</div>
									<div
										className={`mt-2 h-3 w-16 animate-pulse rounded-lg ${
											index % 2 === 0 ? "bg-[#582C5E]/10" : "bg-white/10"
										}`}
									></div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-8 flex justify-center">
						<div className="h-10 w-40 animate-pulse rounded-lg bg-[#582C5E]/10"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-white">
				<AmalNavbar
					logoutAction={logoutAction}
					backgroundColor="#582C5E"
					activeSection={"psychological"}
				/>
				<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
					<div className="text-center text-[#582C5E]">
						<p className="text-xl">{error}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<AmalNavbar
				logoutAction={logoutAction}
				backgroundColor="#582C5E"
				activeSection={"psychological"}
			/>
			<div className="mx-auto max-w-4xl px-4 py-8">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-[#582C5E]">سجل المحادثة</h1>
					<p className="mt-4 text-[#582C5E]/80">
						محادثة الدعم النفسي بتاريخ{" "}
						{new Date(messages[0]?.timestamp).toLocaleDateString("ar-EG")}
					</p>
				</div>

				<div className="space-y-6">
					{messages.map((message, index) => (
						<div
							key={index}
							className={`flex ${
								message.role === "user" ? "justify-start" : "justify-end"
							}`}
						>
							<div
								className={`max-w-[80%] rounded-2xl p-4 ${
									message.role === "user"
										? "bg-[#582C5E] text-white"
										: "border border-[#582C5E]/20 bg-[#582C5E]/10 text-[#582C5E]"
								}`}
							>
								{message.role === "assistant" && (
									<div className="mb-2 flex items-center justify-end gap-2">
										<span className="text-xs font-medium">أمل</span>
										<div className="h-2 w-2 rounded-full bg-[#582C5E]"></div>
									</div>
								)}
								<div className="flex items-start gap-2">
									<p className="text-right">{message.content}</p>
									<button
										onClick={() => handlePlayAudio(message.content, index)}
										className="flex-shrink-0 rounded-full p-1 hover:bg-white/10"
									>
										{message.isPlaying ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<rect x="6" y="4" width="4" height="16"></rect>
												<rect x="14" y="4" width="4" height="16"></rect>
											</svg>
										) : (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polygon points="5 3 19 12 5 21 5 3"></polygon>
											</svg>
										)}
									</button>
								</div>
								<p className="mt-2 text-xs opacity-60">
									{new Date(message.timestamp).toLocaleTimeString("ar-EG")}
								</p>
							</div>
						</div>
					))}
				</div>

				<div className="mt-8 flex justify-center">
					<Link
						href="/psychological"
						className="rounded-lg bg-[#582C5E] px-6 py-3 text-white transition-colors hover:bg-[#4F2345]"
					>
						إنشاء محادثة جديدة
					</Link>
				</div>
			</div>
		</div>
	);
}
