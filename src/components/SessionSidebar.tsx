"use client";

import { ChevronLeft, ChevronRight, History, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Session {
	sessionId: string;
	lastQuestion: string;
	timestamp?: string;
}

interface SessionSidebarProps {
	fetchSessionsAction: () => Promise<
		{ sessions: Session[] } | { field: string; message: string }
	>;
	deleteSessionAction: (
		sessionId: string,
	) => Promise<{ success: boolean } | { field: string; message: string }>;
	backgroundColor?: string;
	textColor?: string;
	hoverColor?: string;
	title?: string;
	type: "legal" | "psychological";
}

export default function SessionSidebar({
	fetchSessionsAction,
	deleteSessionAction,
	backgroundColor = "indigo",
	textColor = "gray",
	hoverColor = "blue",
	title = "سجل الجلسات",
	type,
}: SessionSidebarProps) {
	const [sessions, setSessions] = useState<Session[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedSession, setSelectedSession] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchSessions = async () => {
			try {
				setLoading(true);
				const result = await fetchSessionsAction();
				if ("sessions" in result) {
					// Add timestamps if not provided
					const sessionsWithTime = result.sessions.map((session) => ({
						...session,
						timestamp: session.timestamp || new Date().toLocaleString(),
					}));
					setSessions(sessionsWithTime);
				} else {
					setError(result.message);
				}
			} catch (err) {
				setError("فشل في جلب الجلسات");
			} finally {
				setLoading(false);
			}
		};

		fetchSessions();
	}, [fetchSessionsAction]);

	const handleDeleteSession = async (sessionId: string) => {
		try {
			setSelectedSession(sessionId);
			const result = await deleteSessionAction(sessionId);
			if ("success" in result) {
				setSessions(
					sessions.filter((session) => session.sessionId !== sessionId),
				);
			} else {
				setError(result.message);
			}
		} catch (err) {
			setError("فشل في حذف الجلسة");
		} finally {
			setSelectedSession(null);
		}
	};

	const handleSessionClick = (sessionId: string) => {
		if (type === "psychological") {
			router.push(`/psychological/${sessionId}`);
		} else if (type === "legal") {
			router.push(`/legal/${sessionId}`);
		}
	};

	const getColorClasses = (baseColor: string) => {
		const colorMap: Record<string, string> = {
			// Legal page colors
			blue: "bg-[#14514BFF] text-white border-[#14514BFF] hover:bg-[#14514BFF]",
			// Psychological page colors
			emerald: "bg-[#582C5E] text-white border-[#582C5E] hover:bg-[#4F2345]",
			// Default colors
			indigo:
				"bg-indigo-500 text-indigo-100 border-indigo-400 hover:bg-indigo-600",
			violet:
				"bg-violet-500 text-violet-100 border-violet-400 hover:bg-violet-600",
			amber: "bg-amber-500 text-amber-100 border-amber-400 hover:bg-amber-600",
			gray: "bg-gray-500 text-gray-100 border-gray-400 hover:bg-gray-600",
		};

		return colorMap[baseColor] || colorMap.indigo;
	};

	const getTextColorClasses = (baseColor: string) => {
		const colorMap: Record<string, string> = {
			// Legal page colors
			blue: "text-[#14514BFF]",
			// Psychological page colors
			emerald: "text-[#582C5E]",
			// Default colors
			gray: "text-gray-800",
			slate: "text-slate-800",
			zinc: "text-zinc-800",
			neutral: "text-neutral-800",
			stone: "text-stone-800",
		};

		return colorMap[baseColor] || colorMap.gray;
	};

	const getHoverColorClasses = (baseColor: string) => {
		const colorMap: Record<string, string> = {
			// Legal page colors
			blue: "hover:border-[#D78448] hover:shadow-[#FFCB99]",
			// Psychological page colors
			emerald: "hover:border-[#582C5E] hover:shadow-[#E2C8D3]",
			// Default colors
			indigo: "hover:border-indigo-300 hover:shadow-indigo-100",
			violet: "hover:border-violet-300 hover:shadow-violet-100",
			amber: "hover:border-amber-300 hover:shadow-amber-100",
		};

		return colorMap[baseColor] || colorMap.blue;
	};

	if (loading) {
		return (
			<div
				className={`fixed top-0 left-0 z-50 h-full w-80 transform bg-gradient-to-br from-white to-gray-50 p-4 shadow-xl transition-all duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="animate-pulse space-y-6">
					<div className="flex items-center justify-between">
						<div className="h-8 w-40 rounded-lg bg-gray-200"></div>
						<div className="h-6 w-8 rounded-full bg-gray-200"></div>
					</div>
					<div className="space-y-4">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-4"
							>
								<div className="h-8 w-8 rounded-full bg-gray-200"></div>
								<div className="flex-1 space-y-2">
									<div className="h-4 w-3/4 rounded bg-gray-200"></div>
									<div className="h-3 w-1/2 rounded bg-gray-200"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div
				className={`fixed top-0 left-0 z-50 h-full w-80 transform bg-white p-4 shadow-xl transition-all duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex h-full flex-col items-center justify-center text-center">
					<div className="mb-4 rounded-full bg-red-100 p-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-10 w-10 text-red-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h3 className="mb-2 text-lg font-semibold text-gray-800">حدث خطأ</h3>
					<p className="text-gray-600">{error}</p>
					<button
						onClick={() => setError(null)}
						className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
					>
						المحاولة مرة أخرى
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Floating Toggle Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`fixed top-1/2 left-4 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full ${getColorClasses(backgroundColor)} shadow-lg transition-all duration-300 hover:shadow-xl ${
					isOpen ? "translate-x-80" : "translate-x-0"
				}`}
				aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
			>
				{isOpen ? (
					<ChevronLeft
						size={24}
						className="transform transition-transform duration-300"
					/>
				) : (
					<ChevronRight
						size={24}
						className="transform transition-transform duration-300"
					/>
				)}
			</button>

			{/* Sidebar Content */}
			<div
				className={`fixed top-0 left-0 z-40 h-full w-80 transform bg-gradient-to-br from-white to-gray-50 p-4 shadow-xl transition-all duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* Header */}
				<div className="mt-20 mb-2 flex flex-col items-center justify-center border-b border-gray-200 pb-4">
					<div className="mb-2">
						<h3
							className={`text-2xl font-bold ${getTextColorClasses(textColor)}`}
						>
							{title}
						</h3>
					</div>
				</div>

				{/* Sessions List */}
				<div
					className="space-y-3 overflow-y-auto pb-32 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
					style={{ maxHeight: "calc(100vh - 120px)" }}
				>
					{sessions.length === 0 ? (
						<div className="flex h-64 flex-col items-center justify-center text-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-12 w-12 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<h4 className="mt-3 text-lg font-medium text-gray-600">
								لا توجد جلسات سابقة
							</h4>
							<p className="mt-1 text-sm text-gray-500">
								ستظهر الجلسات هنا عند إنشائها
							</p>
						</div>
					) : (
						sessions.map((session, index) => (
							<div
								key={session.sessionId}
								className={`group relative rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:cursor-pointer ${getHoverColorClasses(hoverColor)}`}
								onClick={() => handleSessionClick(session.sessionId)}
							>
								<div className="flex items-start gap-3">
									<div
										className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${getColorClasses(backgroundColor)} text-sm font-bold shadow-sm`}
									>
										{index + 1}
									</div>
									<div className="flex-1 overflow-hidden">
										<p
											className={`text-sm ${getTextColorClasses(textColor)} line-clamp-2`}
										>
											{session.lastQuestion || "سؤال غير محدد"}
										</p>
										{session.timestamp && (
											<p className="mt-1 text-xs text-gray-500">
												{new Date(session.timestamp).toLocaleString()}
											</p>
										)}
									</div>
								</div>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteSession(session.sessionId);
									}}
									disabled={selectedSession === session.sessionId}
									className={`absolute -top-2 -right-2 flex cursor-pointer items-center justify-center rounded-full bg-white p-1.5 text-red-600 opacity-100 shadow-md transition-all duration-200 hover:bg-red-50 ${
										selectedSession === session.sessionId ? "opacity-100" : ""
									}`}
									title="حذف الجلسة"
								>
									{selectedSession === session.sessionId ? (
										<svg
											className="h-4 w-4 animate-spin"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
									) : (
										<Trash2 size={16} />
									)}
								</button>
							</div>
						))
					)}
				</div>

				{/* Footer */}
				<div className="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white p-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div
								className={`h-2 w-2 rounded-full ${getColorClasses(backgroundColor)}`}
							></div>
							<p className="text-sm font-medium text-gray-600">
								{sessions.length} جلسة
							</p>
						</div>
						<div className="flex items-center gap-2">
							<History className="h-4 w-4 text-gray-400" />
							<p className="text-sm text-gray-500">
								آخر تحديث:{" "}
								{new Date().toLocaleTimeString("ar-EG", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
