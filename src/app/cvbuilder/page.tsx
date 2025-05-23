import { CVData } from "@/components/cv-preview";
import CVBuilder from "@/components/cvbuilder";
import { getUser, logoutAction } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user_cv } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { hasCvAction } from "../cv-preview/page";

export default function CVBuilderPage() {
	return (
		<div>
			<CVBuilder
				getUserCvInfoAction={getUserCvInfoAction}
				saveCvAction={saveCvAction}
				logoutAction={logoutAction}
				hasCvAction={hasCvAction}
			/>
		</div>
	);
}

export type UserCvInfo = {
	name: string;
	photo: string | null;
	age?: number;
};

export async function getUserCvInfoAction(): Promise<
	UserCvInfo | { field: string; message: string }
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
			name: userInfo.firstName + " " + userInfo.lastName,
			photo: userInfo.photo,
			age: userInfo.age || undefined,
		};
	} catch (error) {
		return { field: "root", message: "Failed to fetch user info." };
	}
}

export async function saveCvAction(
	cvData: CVData,
): Promise<{ success: boolean; message: string }> {
	"use server";
	try {
		const user = await getUser();
		if (!user) {
			return { success: false, message: "User not authenticated." };
		}

		const existingCv = await db.query.TB_user_cv.findFirst({
			where: (table, { eq }) => eq(table.userId, user.id),
		});

		if (existingCv) {
			// تحديث السيرة الذاتية الموجودة
			await db
				.update(TB_user_cv)
				.set({
					name: cvData.name,
					age: cvData.age,
					email: cvData.email,
					phone: cvData.phone,
					address: cvData.address,
					summary: cvData.summary,
					skills: cvData.skills,
					languages: cvData.languages,
				})
				.where(eq(TB_user_cv.userId, user.id));

			return { success: true, message: "تم تحديث السيرة الذاتية بنجاح" };
		} else {
			// إنشاء سيرة ذاتية جديدة
			await db.insert(TB_user_cv).values({
				id: nanoid(),
				userId: user.id,
				name: cvData.name,
				age: cvData.age,
				email: cvData.email,
				phone: cvData.phone,
				address: cvData.address,
				summary: cvData.summary,
				skills: cvData.skills,
				languages: cvData.languages,
			});

			return { success: true, message: "تم حفظ السيرة الذاتية بنجاح" };
		}
	} catch (error) {
		console.error("Error saving CV:", error);
		return { success: false, message: "حدث خطأ أثناء حفظ السيرة الذاتية" };
	}
}
