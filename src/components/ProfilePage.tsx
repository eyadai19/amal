"use client";

import { UserInfo } from "@/app/Profile/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AmalNavbar from "./amalNavbar";

export default function Profile({
	logoutAction,
	getUserInfoAction,
	fetchAllPsychologicalSessionsAction,
	fetchAllLegalSessionsAction,
	deletePsychologicalSessionAction,
	deleteLegalSessionAction,
	updateProfileAction,
	getUserOCRProgressAction,
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
	updateProfileAction: (
		form: FormData,
	) => Promise<string | { field: string; message: string } | undefined>;
	getUserOCRProgressAction: () => Promise<
		| {
				alphas: { accuracy: number; attempts: number; bit: string }[];
				digits: { accuracy: number; attempts: number; digit: string }[];
		  }
		| { field: string; message: string }
	>;
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
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [ocrProgress, setOcrProgress] = useState<{
		alphas: { accuracy: number; attempts: number; bit: string }[];
		digits: { accuracy: number; attempts: number; digit: string }[];
	} | null>(null);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		age: "",
		releaseDate: "",
		sentenceDuration: "",
	});

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				const [userResult, psychResult, legalResult, ocrResult] =
					await Promise.all([
						getUserInfoAction(),
						fetchAllPsychologicalSessionsAction(),
						fetchAllLegalSessionsAction(),
						getUserOCRProgressAction(),
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

				if (!("field" in ocrResult)) {
					setOcrProgress(ocrResult);
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
		getUserOCRProgressAction,
	]);

	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName,
				lastName: user.lastName,
				age: user.age?.toString() || "",
				releaseDate:
					user.releaseDate instanceof Date
						? user.releaseDate.toISOString().split("T")[0]
						: user.releaseDate || "",
				sentenceDuration: user.sentenceDuration?.toString() || "",
			});
		}
	}, [user]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		if (user) {
			setFormData({
				firstName: user.firstName,
				lastName: user.lastName,
				age: user.age?.toString() || "",
				releaseDate:
					user.releaseDate instanceof Date
						? user.releaseDate.toISOString().split("T")[0]
						: user.releaseDate || "",
				sentenceDuration: user.sentenceDuration?.toString() || "",
			});
		}
	};

	const handleSubmit = async () => {
		setIsSaving(true);
		try {
			const form = new FormData();
			form.append("firstName", formData.firstName);
			form.append("lastName", formData.lastName);
			if (formData.age) form.append("age", formData.age);
			if (formData.releaseDate)
				form.append("releaseDate", formData.releaseDate);
			if (formData.sentenceDuration)
				form.append("sentenceDuration", formData.sentenceDuration);

			const result = await updateProfileAction(form);
			if (typeof result === "string") {
				// تحديث بيانات المستخدم بعد التعديل
				const updatedUser = await getUserInfoAction();
				if (!("field" in updatedUser)) {
					setUser(updatedUser);
					// تحديث formData بالبيانات الجديدة
					setFormData({
						firstName: updatedUser.firstName,
						lastName: updatedUser.lastName,
						age: updatedUser.age?.toString() || "",
						releaseDate:
							updatedUser.releaseDate instanceof Date
								? updatedUser.releaseDate.toISOString().split("T")[0]
								: updatedUser.releaseDate || "",
						sentenceDuration: updatedUser.sentenceDuration?.toString() || "",
					});
					setIsEditing(false);
				}
			} else if (result) {
				setError(result.message);
			}
		} catch (error) {
			setError("حدث خطأ أثناء تحديث الملف الشخصي");
		} finally {
			setIsSaving(false);
		}
	};

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
			<div className="min-h-screen bg-gradient-to-b from-[#D8E5F0] to-[#f0f5fa] p-4 pt-20 md:p-6 md:pt-20">
				<AmalNavbar
					logoutAction={logoutAction}
					backgroundColor="#27583BFF"
					activeSection={"profile"}
				/>
				<div className="mx-auto mt-7 max-w-4xl">
					{/* بطاقة المعلومات الشخصية - سكيلتون */}
					<div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
						<div className="flex flex-col sm:flex-row">
							<div className="p-4 sm:flex-shrink-0">
								<div className="h-32 w-32 animate-pulse rounded-full bg-[#9cdbbc]"></div>
							</div>
							<div className="flex-1 p-6 sm:p-8">
								<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
									<div className="space-y-2">
										<div className="h-8 w-48 animate-pulse rounded bg-[#9cdbbc]"></div>
										<div className="h-4 w-32 animate-pulse rounded bg-[#9cdbbc]"></div>
									</div>
									<div className="mt-4 sm:mt-0">
										<div className="h-6 w-16 animate-pulse rounded-full bg-[#9cdbbc]"></div>
									</div>
								</div>

								<div className="mt-6 grid grid-cols-2 gap-4">
									{[1, 2, 3, 4].map((i) => (
										<div key={i} className="space-y-2">
											<div className="h-4 w-24 animate-pulse rounded bg-[#9cdbbc]"></div>
											<div className="h-4 w-32 animate-pulse rounded bg-[#9cdbbc]"></div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* سكيلتون للجلسات */}
					<div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
						<div className="border-b border-gray-200 px-6 py-5">
							<div className="h-6 w-32 animate-pulse rounded bg-[#9cdbbc]"></div>
						</div>
						<div className="divide-y divide-gray-200">
							{[1, 2, 3].map((i) => (
								<div key={i} className="p-4">
									<div className="flex items-start justify-between">
										<div className="flex items-start">
											<div className="flex-shrink-0 pt-0.5">
												<div className="h-5 w-5 animate-pulse rounded-full bg-[#9cdbbc]"></div>
											</div>
											<div className="ml-3 flex-1">
												<div className="h-4 w-48 animate-pulse rounded bg-[#9cdbbc]"></div>
											</div>
										</div>
										<div className="h-4 w-8 animate-pulse rounded bg-[#9cdbbc]"></div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* سكيلتون لتقدم تعلم الحروف */}
					<div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
						<div className="border-b border-gray-200 px-6 py-5">
							<div className="h-6 w-32 animate-pulse rounded bg-[#9cdbbc]"></div>
						</div>
						<div className="p-6">
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
								{[1, 2, 3, 4, 5, 6].map((i) => (
									<div
										key={i}
										className="flex flex-col items-center rounded-lg border border-[#9cdbbc] p-3"
									>
										<div className="mb-1 h-6 w-6 animate-pulse rounded-full bg-[#9cdbbc]"></div>
										<div className="h-2.5 w-full animate-pulse rounded-full bg-[#9cdbbc]"></div>
										<div className="mt-1 h-4 w-16 animate-pulse rounded bg-[#9cdbbc]"></div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* سكيلتون لتقدم تعلم الأرقام */}
					<div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
						<div className="border-b border-gray-200 px-6 py-5">
							<div className="h-6 w-32 animate-pulse rounded bg-[#9cdbbc]"></div>
						</div>
						<div className="p-6">
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="flex flex-col items-center rounded-lg border border-[#9cdbbc] p-3"
									>
										<div className="mb-1 h-6 w-6 animate-pulse rounded-full bg-[#9cdbbc]"></div>
										<div className="h-2.5 w-full animate-pulse rounded-full bg-[#9cdbbc]"></div>
										<div className="mt-1 h-4 w-16 animate-pulse rounded bg-[#9cdbbc]"></div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* سكيلتون لآخر التمارين */}
					<div className="overflow-hidden rounded-2xl bg-white shadow-lg">
						<div className="border-b border-gray-200 px-6 py-5">
							<div className="h-6 w-32 animate-pulse rounded bg-[#9cdbbc]"></div>
						</div>
						<div className="divide-y divide-gray-200">
							{[1, 2, 3].map((i) => (
								<div key={i} className="p-4">
									<div className="flex items-center justify-between">
										<div className="space-y-2">
											<div className="h-4 w-48 animate-pulse rounded bg-[#9cdbbc]"></div>
											<div className="h-3 w-32 animate-pulse rounded bg-[#9cdbbc]"></div>
										</div>
										<div className="h-5 w-12 animate-pulse rounded-full bg-[#9cdbbc]"></div>
									</div>
								</div>
							))}
						</div>
					</div>
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
		<div className="min-h-screen bg-gradient-to-b from-[#D8E5F0] to-[#f0f5fa] p-4 pt-20 md:p-6 md:pt-20">
			<AmalNavbar
				logoutAction={logoutAction}
				backgroundColor="#27583BFF"
				activeSection={"profile"}
			/>
			<div className="mx-auto mt-7 max-w-4xl">
				{/* بطاقة المعلومات الشخصية */}
				<div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
					<div className="flex flex-col sm:flex-row-reverse">
						{/* الصورة - تظهر في الأعلى على الشاشات الصغيرة */}
						<div className="flex flex-col items-center p-4 sm:flex-shrink-0">
							<div className="group relative">
								<img
									className="h-32 w-32 rounded-full border-4 border-[#9cdbbc] object-cover transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-300"
									src={user.photo || "/default-avatar.png"}
									alt={`${user.firstName} ${user.lastName}`}
								/>
								<div className="absolute inset-0 rounded-full bg-[#9cdbbc] opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
							</div>
						</div>

						{/* المعلومات - تظهر في الأسفل على الشاشات الصغيرة */}
						<div className="flex-1 p-6 sm:p-8">
							<div className="flex flex-col items-end">
								<div className="w-full text-right">
									{isEditing ? (
										<div className="space-y-4">
											<div className="flex flex-col gap-4">
												<div>
													<label className="mb-1 block text-sm font-medium text-gray-500">
														الاسم الأول
													</label>
													<input
														type="text"
														name="firstName"
														value={formData.firstName}
														onChange={handleInputChange}
														className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right"
														placeholder="الاسم الأول"
													/>
												</div>
												<div>
													<label className="mb-1 block text-sm font-medium text-gray-500">
														الاسم الأخير
													</label>
													<input
														type="text"
														name="lastName"
														value={formData.lastName}
														onChange={handleInputChange}
														className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right"
														placeholder="الاسم الأخير"
													/>
												</div>
												<div>
													<label className="mb-1 block text-sm font-medium text-gray-500">
														العمر
													</label>
													<input
														type="number"
														name="age"
														value={formData.age}
														onChange={handleInputChange}
														className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right"
														placeholder="العمر"
													/>
												</div>
											</div>
										</div>
									) : (
										<>
											<h1 className="text-2xl font-bold text-gray-900">
												{user.firstName} {user.lastName}
											</h1>
											<p className="mt-1 text-gray-600">@{user.username}</p>
											{user.age && (
												<span className="mt-2 inline-flex items-center rounded-full bg-[#9cdbbc] px-3 py-1 text-sm font-medium text-emerald-800">
													سنة {user.age}
												</span>
											)}
										</>
									)}
								</div>
							</div>

							<div className="mt-6 grid grid-cols-2 gap-4 text-center">
								{isEditing ? (
									<>
										<div>
											<h3 className="text-sm font-medium text-gray-500">
												تاريخ الإفراج
											</h3>
											<input
												type="date"
												name="releaseDate"
												value={formData.releaseDate}
												onChange={handleInputChange}
												className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-center"
											/>
										</div>
										<div>
											<h3 className="text-sm font-medium text-gray-500">
												مدة الحكم
											</h3>
											<input
												type="number"
												name="sentenceDuration"
												value={formData.sentenceDuration}
												onChange={handleInputChange}
												className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-center"
												placeholder="مدة الحكم بالسنوات"
											/>
										</div>
									</>
								) : (
									<>
										<div>
											<h3 className="text-sm font-medium text-gray-500">
												تاريخ الإفراج
											</h3>
											<p className="mt-1 text-sm text-gray-900">
												{user.releaseDate
													? new Date(user.releaseDate).toLocaleDateString(
															"ar-EG",
														)
													: "٢/٤/٢٠٢٥"}
											</p>
										</div>
										<div>
											<h3 className="text-sm font-medium text-gray-500">
												مدة الحكم
											</h3>
											<p className="mt-1 text-sm text-gray-900">
												{user.sentenceDuration
													? `سنة ${user.sentenceDuration}`
													: "سنة 10"}
											</p>
										</div>
									</>
								)}
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										تاريخ التسجيل
									</h3>
									<p className="mt-1 text-sm text-gray-900">
										{new Date(user.createdTime).toLocaleDateString("ar-EG") ||
											"٨/٤/٢٠٢٥"}
									</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										آخر تحديث
									</h3>
									<p className="mt-1 text-sm text-gray-900">
										{new Date(user.lastUpdateTime).toLocaleDateString(
											"ar-EG",
										) || "٨/٤/٢٠٢٥"}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="flex justify-start p-4">
						{!isEditing ? (
							<button
								onClick={handleEdit}
								className="rounded-full bg-[#9cdbbc] px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-200"
							>
								تعديل
							</button>
						) : (
							<div className="flex gap-2">
								<button
									onClick={handleSubmit}
									disabled={isSaving}
									className="rounded-full bg-[#9cdbbc] px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-200 disabled:opacity-50"
								>
									{isSaving ? "جاري التعديل..." : "حفظ"}
								</button>
								<button
									onClick={handleCancel}
									disabled={isSaving}
									className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 disabled:opacity-50"
								>
									إلغاء
								</button>
							</div>
						)}
					</div>
				</div>

				{/* قسم الجلسات النفسية */}
				{psychologicalSessions.length > 0 && (
					<div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
						<div className="border-b border-gray-200 px-6 py-5">
							<h3 className="text-lg font-semibold text-emerald-800">
								الجلسات النفسية
							</h3>
						</div>
						<div className="divide-y divide-gray-200">
							{psychologicalSessions.map((session, index) => (
								<Link
									key={index}
									href={`/psychological/${session.sessionId}`}
									className="block cursor-pointer p-4 hover:bg-emerald-50"
								>
									<div className="flex items-start justify-between">
										<div className="flex items-start">
											<div className="flex-shrink-0 pt-0.5">
												<div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9cdbbc]">
													<span className="text-xs text-emerald-800">
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
											onClick={(e) => {
												e.preventDefault();
												handleDeletePsychologicalSession(session.sessionId);
											}}
											className="text-sm font-medium text-red-600 hover:text-red-800"
											title="حذف الجلسة"
										>
											حذف
										</button>
									</div>
								</Link>
							))}
						</div>
					</div>
				)}

				{/* قسم الجلسات القانونية */}
				{legalSessions.length > 0 && (
					<div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
						<div className="border-b border-gray-200 px-6 py-5">
							<h3 className="text-lg font-semibold text-emerald-800">
								السجل القانوني
							</h3>
						</div>
						<div className="divide-y divide-gray-200">
							{legalSessions.map((session, index) => (
								<Link
									key={index}
									href={`/legal/${session.sessionId}`}
									className="block cursor-pointer p-4 hover:bg-emerald-50"
								>
									<div className="flex items-start justify-between">
										<div className="flex items-start">
											<div className="flex-shrink-0 pt-0.5">
												<div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9cdbbc]">
													<span className="text-xs text-emerald-800">
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
											onClick={(e) => {
												e.preventDefault();
												handleDeleteLegalSession(session.sessionId);
											}}
											className="text-sm font-medium text-red-600 hover:text-red-800"
											title="حذف الجلسة"
										>
											حذف
										</button>
									</div>
								</Link>
							))}
						</div>
					</div>
				)}

				{/* تقدم تعلم الحروف */}
				<div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
					<div className="border-b border-gray-200 px-6 py-5">
						<h3 className="text-lg font-semibold text-emerald-800">
							تقدم تعلم الحروف
						</h3>
					</div>
					<div className="p-6">
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
							{ocrProgress?.alphas.map((progress) => (
								<div
									key={progress.bit}
									className="flex flex-col items-center rounded-lg border border-emerald-100 p-3 hover:bg-emerald-50"
								>
									<span className="mb-1 text-xl font-bold text-emerald-800">
										{progress.bit}
									</span>
									<div className="h-2.5 w-full rounded-full bg-emerald-100">
										<div
											className="h-2.5 rounded-full bg-emerald-600"
											style={{ width: `${progress.accuracy}%` }}
										></div>
									</div>
									<span className="mt-1 text-xs text-emerald-700">
										{progress.accuracy}% ({progress.attempts} محاولة)
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* تقدم تعلم الأرقام */}
				<div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
					<div className="border-b border-gray-200 px-6 py-5">
						<h3 className="text-lg font-semibold text-emerald-800">
							تقدم تعلم الأرقام
						</h3>
					</div>
					<div className="p-6">
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
							{ocrProgress?.digits.map((progress) => (
								<div
									key={progress.digit}
									className="flex flex-col items-center rounded-lg border border-emerald-100 p-3 hover:bg-emerald-50"
								>
									<span className="mb-1 text-xl font-bold text-emerald-800">
										{progress.digit}
									</span>
									<div className="h-2.5 w-full rounded-full bg-emerald-100">
										<div
											className="h-2.5 rounded-full bg-emerald-600"
											style={{ width: `${progress.accuracy}%` }}
										></div>
									</div>
									<span className="mt-1 text-xs text-emerald-700">
										{progress.accuracy}% ({progress.attempts} محاولة)
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* آخر التمارين */}
				<div className="overflow-hidden rounded-2xl bg-white shadow-lg">
					<div className="border-b border-gray-200 px-6 py-5">
						<h3 className="text-lg font-semibold text-emerald-800">
							آخر التمارين
						</h3>
					</div>
					<div className="divide-y divide-gray-200">
						<div className="p-4 hover:bg-emerald-50">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium text-emerald-800">
										تمرين كتابة حرف &quot;أ&quot;
									</h4>
									<p className="text-sm text-gray-500">دقة 85% - منذ ساعتين</p>
								</div>
								<span className="inline-flex items-center rounded-full bg-[#9cdbbc] px-2.5 py-0.5 text-xs font-medium text-emerald-800">
									كتابة
								</span>
							</div>
						</div>
						<div className="p-4 hover:bg-emerald-50">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium text-emerald-800">
										تمرين نطق حرف &quot;ب&quot;
									</h4>
									<p className="text-sm text-gray-500">دقة 72% - منذ يوم</p>
								</div>
								<span className="inline-flex items-center rounded-full bg-[#9cdbbc] px-2.5 py-0.5 text-xs font-medium text-emerald-800">
									صوت
								</span>
							</div>
						</div>
						<div className="p-4 hover:bg-emerald-50">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium text-emerald-800">
										تمرين كتابة رقم &quot;5&quot;
									</h4>
									<p className="text-sm text-gray-500">دقة 91% - منذ 3 أيام</p>
								</div>
								<span className="inline-flex items-center rounded-full bg-[#9cdbbc] px-2.5 py-0.5 text-xs font-medium text-emerald-800">
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
