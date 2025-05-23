"use client";

import { UserInfo } from "@/app/Profile/page";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AmalNavbar from "./amalNavbar";
import { CVData } from "./cv-preview";

export default function Profile({
	logoutAction,
	getUserInfoAction,
	fetchAllPsychologicalSessionsAction,
	fetchAllLegalSessionsAction,
	deletePsychologicalSessionAction,
	deleteLegalSessionAction,
	updateProfileAction,
	getUserOCRProgressAction,
	getUserCvAction,
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
	getUserCvAction: () => Promise<CVData | { field: string; message: string }>;
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
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		age: "",
		releaseDate: "",
		sentenceDuration: "",
	});
	const [cvData, setCvData] = useState<CVData | null>(null);

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

	useEffect(() => {
		const fetchCvData = async () => {
			const cv = await getUserCvAction();
			if (!("field" in cv)) {
				setCvData(cv);
			}
		};

		fetchCvData();
	}, [getUserCvAction]);

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
					<div className="flex flex-col sm:flex-row">
						<div className="p-4 sm:flex-shrink-0">
							<img
								src={user.photo || "/default-avatar.png"}
								alt={`${user.firstName} ${user.lastName}`}
								className="h-32 w-32 rounded-full border-4 border-red-100 object-cover"
							/>
						</div>
						<div className="flex-1 p-6 sm:p-8">
							<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
								<div>
									<h2 className="text-2xl font-bold text-gray-900">
										{user.firstName} {user.lastName}
									</h2>
									<p className="text-gray-500">@{user.username}</p>
								</div>
								<Button
									onClick={handleEdit}
									className="mt-4 bg-red-600 hover:bg-red-700 sm:mt-0"
								>
									تعديل
								</Button>
							</div>

							<div className="mt-6 grid grid-cols-2 gap-4">
								<div>
									<h3 className="text-sm font-medium text-gray-500">العمر</h3>
									<p className="mt-1 text-gray-900">{user.age || "غير محدد"}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										تاريخ الإفراج
									</h3>
									<p className="mt-1 text-gray-900">
										{user.releaseDate
											? new Date(user.releaseDate).toLocaleDateString("ar-EG")
											: "غير محدد"}
									</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										مدة الحكم
									</h3>
									<p className="mt-1 text-gray-900">
										{user.sentenceDuration
											? `${user.sentenceDuration} سنة`
											: "غير محدد"}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* تبويبات الجلسات والسيرة الذاتية */}
				<Tabs defaultValue="sessions" className="space-y-6">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="sessions">الجلسات</TabsTrigger>
						<TabsTrigger value="cv">السيرة الذاتية</TabsTrigger>
					</TabsList>

					<TabsContent value="sessions">
						<div className="space-y-6">
							{psychologicalSessions.length > 0 && (
								<div className="overflow-hidden rounded-2xl bg-white shadow-lg">
									<div className="border-b border-gray-200 px-6 py-5">
										<h3 className="text-lg font-medium text-gray-900">
											الجلسات النفسية
										</h3>
									</div>
									<div className="divide-y divide-gray-200">
										{psychologicalSessions.map((session, index) => (
											<div key={session.sessionId} className="p-4">
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-4 space-x-reverse">
														<div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
															<span className="text-sm font-medium text-red-600">
																{index + 1}
															</span>
														</div>
														<p className="font-medium">
															{session.lastQuestion}
														</p>
													</div>
													<div className="flex items-center space-x-2 space-x-reverse">
														<Button
															onClick={() =>
																router.push(
																	`/psychological/${session.sessionId}`,
																)
															}
															variant="outline"
															size="sm"
														>
															عرض
														</Button>
														<Button
															onClick={() =>
																handleDeletePsychologicalSession(
																	session.sessionId,
																)
															}
															variant="destructive"
															size="sm"
														>
															حذف
														</Button>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{legalSessions.length > 0 && (
								<div className="overflow-hidden rounded-2xl bg-white shadow-lg">
									<div className="border-b border-gray-200 px-6 py-5">
										<h3 className="text-lg font-medium text-gray-900">
											الجلسات القانونية
										</h3>
									</div>
									<div className="divide-y divide-gray-200">
										{legalSessions.map((session, index) => (
											<div key={session.sessionId} className="p-4">
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-4 space-x-reverse">
														<div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
															<span className="text-sm font-medium text-red-600">
																{index + 1}
															</span>
														</div>
														<p className="font-medium">
															{session.lastQuestion}
														</p>
													</div>
													<div className="flex items-center space-x-2 space-x-reverse">
														<Button
															onClick={() =>
																router.push(`/legal/${session.sessionId}`)
															}
															variant="outline"
															size="sm"
														>
															عرض
														</Button>
														<Button
															onClick={() =>
																handleDeleteLegalSession(session.sessionId)
															}
															variant="destructive"
															size="sm"
														>
															حذف
														</Button>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{psychologicalSessions.length === 0 &&
								legalSessions.length === 0 && (
									<div className="overflow-hidden rounded-2xl bg-white p-8 text-center shadow-lg">
										<p className="text-gray-500">لا توجد جلسات</p>
									</div>
								)}
						</div>
					</TabsContent>

					<TabsContent value="cv">
						<div className="overflow-hidden rounded-2xl bg-white shadow-lg">
							<div className="border-b border-gray-200 px-6 py-5">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-medium text-gray-900">
										السيرة الذاتية
									</h3>
									<Button
										onClick={() => router.push("/cvbuilder")}
										className="bg-red-600 hover:bg-red-700"
									>
										{cvData ? "تعديل السيرة الذاتية" : "إنشاء سيرة ذاتية"}
									</Button>
								</div>
							</div>
							<div className="p-6">
								{cvData ? (
									<div className="space-y-6">
										<div className="grid gap-6 md:grid-cols-2">
											<div className="space-y-2">
												<h3 className="text-lg font-semibold">
													المعلومات الشخصية
												</h3>
												<p>
													<span className="font-medium">الاسم:</span>{" "}
													{cvData.name}
												</p>
												<p>
													<span className="font-medium">العمر:</span>{" "}
													{cvData.age}
												</p>
												<p>
													<span className="font-medium">
														البريد الإلكتروني:
													</span>{" "}
													{cvData.email}
												</p>
												<p>
													<span className="font-medium">رقم الهاتف:</span>{" "}
													{cvData.phone}
												</p>
												<p>
													<span className="font-medium">العنوان:</span>{" "}
													{cvData.address}
												</p>
											</div>
											<div className="space-y-2">
												<h3 className="text-lg font-semibold">الملخص المهني</h3>
												<p className="text-gray-600">{cvData.summary}</p>
											</div>
										</div>

										<div className="grid gap-6 md:grid-cols-2">
											<div className="space-y-2">
												<h3 className="text-lg font-semibold">
													المهارات والخبرات
												</h3>
												<div className="whitespace-pre-line text-gray-600">
													{cvData.skills}
												</div>
											</div>
											<div className="space-y-2">
												<h3 className="text-lg font-semibold">اللغات</h3>
												<div className="whitespace-pre-line text-gray-600">
													{cvData.languages}
												</div>
											</div>
										</div>
									</div>
								) : (
									<div className="py-8 text-center">
										<p className="mb-4 text-gray-500">
											لم يتم إنشاء سيرة ذاتية بعد
										</p>
										<Button
											onClick={() => router.push("/cvbuilder")}
											className="bg-red-600 hover:bg-red-700"
										>
											إنشاء سيرة ذاتية
										</Button>
									</div>
								)}
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
