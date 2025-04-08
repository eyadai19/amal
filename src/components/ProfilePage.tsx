"use client";

import { UserInfo } from "@/app/Profile/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AmalNavbar from "./amalNavbar";

export default function Profile({
	logoutAction,
	getUserInfoAction,
	fetchAllPsychologicalSessionsAction,
	fetchAllLegalSessionsAction,
	deletePsychologicalSessionAction,
	deleteLegalSessionAction,
}: {
	logoutAction: () => Promise<void>;
	getUserInfoAction: () => Promise<
		UserInfo | { field: string; message: string }
	>;
	fetchAllPsychologicalSessionsAction: () => Promise<
		| { sessions: { sessionId: string; lastQuestion: string }[] }
		| { field: string; message: string }
	>;
	fetchAllLegalSessionsAction: () => Promise<
		| { sessions: { sessionId: string; lastQuestion: string }[] }
		| { field: string; message: string }
	>;
	deletePsychologicalSessionAction: (
		sessionId: string,
	) => Promise<{ success: boolean } | { field: string; message: string }>;
	deleteLegalSessionAction: (
		sessionId: string,
	) => Promise<{ success: boolean } | { field: string; message: string }>;
}) {
	const router = useRouter();
	const [user, setUser] = useState<UserInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [psychologicalSessions, setPsychologicalSessions] = useState<
		{ lastQuestion: string; sessionId: string }[]
	>([]);
	const [legalSessions, setLegalSessions] = useState<
		{ lastQuestion: string; sessionId: string }[]
	>([]);

	// تقدم الحروف الافتراضي
	const alphaProgress = [
		{ alphaBit: { bit: "أ", id: "alpha-1" }, accuracy: 85, attempts: 12 },
		{ alphaBit: { bit: "ب", id: "alpha-2" }, accuracy: 72, attempts: 8 },
		{ alphaBit: { bit: "ت", id: "alpha-3" }, accuracy: 65, attempts: 10 },
		{ alphaBit: { bit: "ث", id: "alpha-4" }, accuracy: 90, attempts: 15 },
		{ alphaBit: { bit: "ج", id: "alpha-5" }, accuracy: 45, attempts: 5 },
		{ alphaBit: { bit: "ح", id: "alpha-6" }, accuracy: 78, attempts: 9 },
	];

	// تقدم الأرقام الافتراضي
	const digitProgress = [
		{ digit: { digit: "١", id: "digit-1" }, accuracy: 95, attempts: 7 },
		{ digit: { digit: "٢", id: "digit-2" }, accuracy: 88, attempts: 6 },
		{ digit: { digit: "٣", id: "digit-3" }, accuracy: 72, attempts: 5 },
		{ digit: { digit: "٤", id: "digit-4" }, accuracy: 60, attempts: 4 },
	];

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				const [userResult, psychResult, legalResult] = await Promise.all([
					getUserInfoAction(),
					fetchAllPsychologicalSessionsAction(),
					fetchAllLegalSessionsAction(),
				]);

				if ("field" in userResult) {
					setError(userResult.message);
					router.push("/home");
				} else {
					setUser(userResult);
				}

				if (!("field" in psychResult)) {
					setPsychologicalSessions(
						psychResult.sessions.map((session) => ({
							lastQuestion: session.lastQuestion,
							sessionId: session.sessionId,
						})),
					);
				}

				if (!("field" in legalResult)) {
					setLegalSessions(
						legalResult.sessions.map((session) => ({
							lastQuestion: session.lastQuestion,
							sessionId: session.sessionId,
						})),
					);
				}
			} catch (err) {
				setError("Failed to fetch user data");
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [
		getUserInfoAction,
		fetchAllPsychologicalSessionsAction,
		fetchAllLegalSessionsAction,
	]);

	const handleDeleteLegalSession = async (sessionId: string) => {
		try {
			const result = await deleteLegalSessionAction(sessionId);
			if ("success" in result) {
				// تحديث القائمة بعد الحذف
				const newSessions = legalSessions.filter(
					(_, i) => legalSessions[i].sessionId !== sessionId,
				);
				setLegalSessions(newSessions);
			} else {
				setError(result.message);
			}
		} catch (err) {
			setError("Failed to delete session");
		}
	};

	const handleDeletePsychologicalSession = async (sessionId: string) => {
		try {
			const result = await deletePsychologicalSessionAction(sessionId);
			if ("success" in result) {
				// تحديث القائمة بعد الحذف
				const newSessions = psychologicalSessions.filter(
					(_, i) => psychologicalSessions[i].sessionId !== sessionId,
				);
				setPsychologicalSessions(newSessions);
			} else {
				setError(result.message);
			}
		} catch (err) {
			setError("Failed to delete session");
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="mx-auto h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500"></div>
					<p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="max-w-md rounded-lg bg-red-50 p-4 text-center">
					<h3 className="text-lg font-medium text-red-800">حدث خطأ</h3>
					<p className="mt-2 text-red-600">{error}</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="max-w-md rounded-lg bg-yellow-50 p-4 text-center">
					<h3 className="text-lg font-medium text-yellow-800">
						لا توجد بيانات
					</h3>
					<p className="mt-2 text-yellow-600">
						لم يتم العثور على معلومات المستخدم
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
			<AmalNavbar
				logoutAction={logoutAction}
				backgroundColor="#166534" // 047857  -  0F766E
				activeSection={"profile"}
			/>
			<div className="mx-auto mt-16 max-w-4xl">
				{/* بطاقة المعلومات الشخصية */}
				<div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
					<div className="sm:flex">
						<div className="p-4 sm:flex-shrink-0">
							<img
								className="h-32 w-32 rounded-full border-4 border-indigo-100 object-cover"
								src={user.photo || "/default-avatar.png"}
								alt={`${user.firstName} ${user.lastName}`}
							/>
						</div>
						<div className="flex-1 p-6 sm:p-8">
							<div className="flex items-start justify-between">
								<div>
									<h1 className="text-2xl font-bold text-gray-900">
										{user.firstName} {user.lastName}
									</h1>
									<p className="text-gray-600">@{user.username}</p>
								</div>
								{user.age && (
									<span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
										سنة {user.age}
									</span>
								)}
							</div>

							<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
								{user.releaseDate && (
									<div>
										<h3 className="text-sm font-medium text-gray-500">
											تاريخ الإفراج
										</h3>
										<p className="mt-1 text-sm text-gray-900">
											{new Date(user.releaseDate).toLocaleDateString("ar-EG")}
										</p>
									</div>
								)}
								{user.sentenceDuration && (
									<div>
										<h3 className="text-sm font-medium text-gray-500">
											مدة الحكم
										</h3>
										<p className="mt-1 text-sm text-gray-900">
											سنة {user.sentenceDuration}
										</p>
									</div>
								)}
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										تاريخ التسجيل
									</h3>
									<p className="mt-1 text-sm text-gray-900">
										{new Date(user.createdTime).toLocaleDateString("ar-EG")}
									</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										آخر تحديث
									</h3>
									<p className="mt-1 text-sm text-gray-900">
										{new Date(user.lastUpdateTime).toLocaleDateString("ar-EG")}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{psychologicalSessions.length > 0 && (
					<div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
						<div className="border-b border-gray-200 px-6 py-5">
							<h3 className="text-lg leading-6 font-medium text-gray-900">
								الجلسات النفسية
							</h3>
						</div>
						<div className="divide-y divide-gray-200">
							{psychologicalSessions.map((session, index) => (
								<div key={index} className="p-4 hover:bg-gray-50">
									<div className="flex items-start justify-between">
										<div className="flex items-start">
											<div className="flex-shrink-0 pt-0.5">
												<div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-200">
													<span className="text-xs text-indigo-800">
														{index + 1}
													</span>
												</div>
											</div>
											<div className="ml-3 flex-1">
												<p className="text-sm text-gray-800">
													{session.lastQuestion}
												</p>
											</div>
										</div>
										<button
											onClick={() =>
												handleDeletePsychologicalSession(session.sessionId)
											}
											className="text-sm font-medium text-red-600 hover:text-red-800"
											title="حذف الجلسة"
										>
											حذف
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* قسم الجلسات القانونية */}
				{legalSessions.length > 0 && (
					<div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
						<div className="border-b border-gray-200 px-6 py-5">
							<h3 className="text-lg leading-6 font-medium text-gray-900">
								السجل القانوني
							</h3>
						</div>
						<div className="divide-y divide-gray-200">
							{legalSessions.map((session, index) => (
								<div key={index} className="p-4 hover:bg-gray-50">
									<div className="flex items-start justify-between">
										<div className="flex items-start">
											<div className="flex-shrink-0 pt-0.5">
												<div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-200">
													<span className="text-xs text-green-800">
														{index + 1}
													</span>
												</div>
											</div>
											<div className="ml-3 flex-1">
												<p className="text-sm text-gray-800">
													{session.lastQuestion}
												</p>
											</div>
										</div>
										<button
											onClick={() =>
												handleDeleteLegalSession(session.sessionId)
											}
											className="text-sm font-medium text-red-600 hover:text-red-800"
											title="حذف الجلسة"
										>
											حذف
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* تقدم تعلم الحروف */}
				<div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
					<div className="border-b border-gray-200 px-6 py-5">
						<h3 className="text-lg leading-6 font-medium text-gray-900">
							تقدم تعلم الحروف
						</h3>
					</div>
					<div className="p-6">
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
							{alphaProgress.map((progress) => (
								<div
									key={progress.alphaBit.id}
									className="flex flex-col items-center rounded-lg border p-3"
								>
									<span className="mb-1 text-xl font-bold">
										{progress.alphaBit.bit}
									</span>
									<div className="h-2.5 w-full rounded-full bg-gray-200">
										<div
											className="h-2.5 rounded-full bg-indigo-600"
											style={{ width: `${progress.accuracy}%` }}
										></div>
									</div>
									<span className="mt-1 text-xs">
										{progress.accuracy}% ({progress.attempts} محاولة)
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* تقدم تعلم الأرقام */}
				<div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
					<div className="border-b border-gray-200 px-6 py-5">
						<h3 className="text-lg leading-6 font-medium text-gray-900">
							تقدم تعلم الأرقام
						</h3>
					</div>
					<div className="p-6">
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
							{digitProgress.map((progress) => (
								<div
									key={progress.digit.id}
									className="flex flex-col items-center rounded-lg border p-3"
								>
									<span className="mb-1 text-xl font-bold">
										{progress.digit.digit}
									</span>
									<div className="h-2.5 w-full rounded-full bg-gray-200">
										<div
											className="h-2.5 rounded-full bg-green-600"
											style={{ width: `${progress.accuracy}%` }}
										></div>
									</div>
									<span className="mt-1 text-xs">
										{progress.accuracy}% ({progress.attempts} محاولة)
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* آخر التمارين */}
				<div className="overflow-hidden rounded-lg bg-white shadow">
					<div className="border-b border-gray-200 px-6 py-5">
						<h3 className="text-lg leading-6 font-medium text-gray-900">
							آخر التمارين
						</h3>
					</div>
					<div className="divide-y divide-gray-200">
						<div className="p-4 hover:bg-gray-50">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium">تمرين كتابة حرف "أ"</h4>
									<p className="text-sm text-gray-500">دقة 85% - منذ ساعتين</p>
								</div>
								<span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
									كتابة
								</span>
							</div>
						</div>
						<div className="p-4 hover:bg-gray-50">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium">تمرين نطق حرف "ب"</h4>
									<p className="text-sm text-gray-500">دقة 72% - منذ يوم</p>
								</div>
								<span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
									صوت
								</span>
							</div>
						</div>
						<div className="p-4 hover:bg-gray-50">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium">تمرين كتابة رقم "5"</h4>
									<p className="text-sm text-gray-500">دقة 91% - منذ 3 أيام</p>
								</div>
								<span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
									كتابة
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
