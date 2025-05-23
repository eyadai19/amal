import CVPreview, { CVData } from "@/components/cv-preview";
import { getUser, logoutAction } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user_cv } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getUserCvAction } from "../Profile/page";

export default function CVPreviewPage() {
	return (
		<CVPreview
			logoutAction={logoutAction}
			getUserCvAction={getUserCvAction}
			updateCvAction={updateCvAction}
		/>
	);
}

export async function updateCvAction(
	field: keyof CVData,
	value: string,
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

		if (!existingCv) {
			return { success: false, message: "CV not found." };
		}

		await db
			.update(TB_user_cv)
			.set({ [field]: value })
			.where(eq(TB_user_cv.userId, user.id));

		return { success: true, message: "تم تحديث السيرة الذاتية بنجاح" };
	} catch (error) {
		console.error("Error updating CV:", error);
		return { success: false, message: "حدث خطأ أثناء تحديث السيرة الذاتية" };
	}
}
