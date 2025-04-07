export default function ProfilePage() {
	const user = {
		id: "user-123",
		username: "user123",
		firstName: "أحمد",
		lastName: "محمد",
		photo: "/default-avatar.png",
		age: 35,
		releaseDate: new Date("2025-06-15"),
		sentenceDuration: 5,
		createdTime: new Date("2024-01-10"),
		lastUpdateTime: new Date("2024-05-20"),
	};

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

	return (
		<div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl">
				{/* بطاقة المعلومات الشخصية */}
				<div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
					<div className="sm:flex">
						<div className="p-4 sm:flex-shrink-0">
							<img
								className="h-32 w-32 rounded-full border-4 border-indigo-100 object-cover"
								src={user.photo}
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
								<span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
									{user.age} سنة
								</span>
							</div>

							<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										تاريخ الإفراج
									</h3>
									<p className="mt-1 text-sm text-gray-900">
										{user.releaseDate.toLocaleDateString("ar-EG")}
									</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										مدة الحكم
									</h3>
									<p className="mt-1 text-sm text-gray-900">
										{user.sentenceDuration} سنة
									</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										تاريخ التسجيل
									</h3>
									<p className="mt-1 text-sm text-gray-900">
										{user.createdTime.toLocaleDateString("ar-EG")}
									</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										آخر تحديث
									</h3>
									<p className="mt-1 text-sm text-gray-900">
										{user.lastUpdateTime.toLocaleDateString("ar-EG")}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

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



'use server';

import { db } from '@/lib/db'; 
import { eq } from 'drizzle-orm';
import { getUser } from '@/lib/auth'; 
export async function getCurrentUserInfo(): Promise<
	| {
			id: string;
			username: string;
			firstName: string;
			lastName: string;
			photo: string | null;
			age: number | null;
			releaseDate: Date | null;
			sentenceDuration: number | null;
			createdTime: Date;
			lastUpdateTime: Date;
	  }
	| { field: string; message: string }
> {
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		const userInfo = await db.query.TB_user.findFirst({
			where: (table, { eq }) => eq(table.id, user.id),
		});

		if (!userInfo) return { field: "root", message: "User not found." };

		return {
			id: userInfo.id,
			username: userInfo.username,
			firstName: userInfo.firstName,
			lastName: userInfo.lastName,
			photo: userInfo.photo,
			age: userInfo.age,
			releaseDate: userInfo.releaseDate,
			sentenceDuration: userInfo.sentenceDuration,
			createdTime: userInfo.createdTime,
			lastUpdateTime: userInfo.lastUpdateTime,
		};
	} catch (error) {
		console.error("Error fetching user info:", error);
		return { field: "root", message: "Failed to fetch user info." };
	}
}
