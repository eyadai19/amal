import Profile from "@/components/ProfilePage";
import { getUser, logoutAction } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
	deleteLegalSessionAction,
	fetchAllLegalSessionsAction,
} from "../legal/page";
import {
	deletePsychologicalSessionAction,
	fetchAllPsychologicalSessionsAction,
} from "../psychological/page";

export default function ProfilePage() {
	return (
		<div>
			<Profile
				logoutAction={logoutAction}
				getUserInfoAction={getUserInfoAction}
				fetchAllPsychologicalSessionsAction={
					fetchAllPsychologicalSessionsAction
				}
				fetchAllLegalSessionsAction={fetchAllLegalSessionsAction}
				deleteLegalSessionAction={deleteLegalSessionAction}
				deletePsychologicalSessionAction={deletePsychologicalSessionAction}
				updateProfileAction={UpdateProfileAction}
			/>
		</div>
	);
}

export interface UserInfo {
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
export async function getUserInfoAction(): Promise<
	UserInfo | { field: string; message: string }
> {
	"use server";
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
		return { field: "root", message: "Failed to fetch user info." };
	}
}

export async function UpdateProfileAction(
	form: FormData,
): Promise<string | { field: string; message: string } | undefined> {
	"use server";

	try {
		const firstName = form.get("firstName")?.toString();
		const lastName = form.get("lastName")?.toString();
		const age = form.get("age")?.toString();
		const releaseDate = form.get("releaseDate")?.toString();
		const sentenceDuration = form.get("sentenceDuration")?.toString();

		if (!firstName || !lastName) {
			return {
				field: "form",
				message: "الاسم الأول والاسم الأخير مطلوبان",
			};
		}

		const user = await getUser();
		if (!user) {
			return { field: "root", message: "المستخدم غير مسجل الدخول" };
		}

		const updateData: {
			firstName: string;
			lastName: string;
			age?: number;
			releaseDate?: Date;
			sentenceDuration?: number;
			lastUpdateTime: Date;
		} = {
			firstName,
			lastName,
			lastUpdateTime: new Date(),
		};

		if (age) {
			updateData.age = parseInt(age);
		}

		if (releaseDate) {
			updateData.releaseDate = new Date(releaseDate);
		}

		if (sentenceDuration) {
			updateData.sentenceDuration = parseInt(sentenceDuration);
		}

		// تنفيذ التحديث
		const updatedUser = await db
			.update(TB_user)
			.set(updateData)
			.where(eq(TB_user.id, user.id));

		if (updatedUser) {
			return "تم تحديث الملف الشخصي بنجاح";
		} else {
			return { field: "root", message: "فشل في تحديث الملف الشخصي" };
		}
	} catch (error) {
		return { field: "root", message: "حدث خطأ أثناء تحديث الملف الشخصي" };
	}
}
